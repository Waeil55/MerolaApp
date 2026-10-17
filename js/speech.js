/* Genius Kids Academy - speech layer.
   Voice: by default the most natural voice on the device (neural, online, enhanced and Google voices are ranked first);
   with a parent's own key it uses an AI voice (OpenAI or ElevenLabs). AI clips are cached on the device and the next
   card's words are fetched ahead of time, so they play at once and still work offline once heard.
   Recognition works in Chrome, Edge and Safari. Firefox has no recognition, so the app offers a parent-check fallback. */
window.GKA = window.GKA || {};
(function () {
  const S = {};
  const synth = window.speechSynthesis || null;
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  S.ttsOK = !!synth;
  S.sttOK = !!Rec;
  S.voices = [];
  S.listening = false;
  S.lastError = "";
  let rec = null;

  // ----- Keys live in their own storage slot so they never go into a progress backup. -----
  const KEYS = "gka.keys.v1";
  S.keys = () => { try { return JSON.parse(localStorage.getItem(KEYS) || "{}") || {}; } catch (e) { return {}; } };
  S.setKeys = (obj) => { try { const k = Object.assign(S.keys(), obj); Object.keys(k).forEach((x) => { if (!k[x]) delete k[x]; }); localStorage.setItem(KEYS, JSON.stringify(k)); } catch (e) { /* storage blocked */ } };
  const settings = () => (window.GKA.Store ? window.GKA.Store.settings() : {}) || {};

  // ----- Device voices, best first -----
  const voiceScore = (v) => {
    const n = v.name || ""; let s = 0;
    if (/natural|neural/i.test(n)) s += 60;
    if (/online/i.test(n)) s += 25;
    if (/premium|enhanced|siri/i.test(n)) s += 45;
    if (/google/i.test(n)) s += 35;
    if (/aria|jenny|ava|emma|michelle|samantha|allison|joanna|libby|sonia|natasha|clara|guy|andrew|brian/i.test(n)) s += 12;
    if (/zira|hazel|susan|karen|moira|tessa/i.test(n)) s += 3; // friendlier among basic voices
    if (/en-US/i.test(v.lang)) s += 10; else if (/en-(GB|AU|CA|IE|NZ)/i.test(v.lang)) s += 6;
    if (v.localService === false) s += 4;
    if (/espeak|compact|novelty|whisper|bad news|bells|boing|bubbles|cellos|zarvox|trinoids|albert|jester|organ|superstar|wobble|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley/i.test(n)) s -= 120;
    return s;
  };
  function loadVoices() {
    if (!synth) return;
    const v = synth.getVoices() || [];
    if (v.length) S.voices = v.filter((x) => /^en/i.test(x.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
  }
  if (synth) { loadVoices(); if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = loadVoices; }
  S.isNatural = (v) => !!v && voiceScore(v) >= 35;
  S.pickVoice = (uri) => {
    loadVoices();
    if (!S.voices.length) return null;
    if (uri) { const v = S.voices.find((x) => x.voiceURI === uri || x.name === uri); if (v) return v; }
    return S.voices[0];
  };

  // ----- Which engine speaks -----
  S.AI_VOICES = {
    openai: [["nova", "Nova (bright, friendly)"], ["coral", "Coral (warm)"], ["shimmer", "Shimmer (soft)"], ["sage", "Sage (calm)"], ["alloy", "Alloy (neutral)"], ["fable", "Fable (storyteller)"], ["echo", "Echo (deep)"], ["ash", "Ash (clear)"]],
    elevenlabs: [["21m00Tcm4TlvDq8ikWAM", "Rachel (warm)"], ["EXAVITQu4vr4xnSDxMaL", "Sarah (soft)"], ["XrExE9yKIg1WjnnlVkGX", "Matilda (friendly)"], ["pFZP5JQG7iQjIQuC4Bku", "Lily (clear)"], ["TX3LPaxmHKxFdv7VOQHJ", "Liam (bright)"], ["onwK4e9ZLuTAKqWW03F9", "Daniel (calm)"]]
  };
  S.engine = () => {
    const e = settings().voiceEngine || "device"; const k = S.keys();
    if (S.aiBroken) return "device";
    if (e === "openai" && k.openai) return "openai";
    if (e === "elevenlabs" && k.elevenlabs) return "elevenlabs";
    return "device";
  };
  S.engineLabel = () => ({ device: "Natural voice on this device", openai: "OpenAI AI voice", elevenlabs: "ElevenLabs AI voice" })[S.engine()];

  // ----- AI voice clips: memory, then the device cache, then the network -----
  const memo = new Map(); const inflight = new Map();
  const CACHE = "gka-voice-v1";
  const hash = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + str.length.toString(36); };
  const clipKey = (eng, voice, text) => eng + "/" + voice + "/" + hash(text);
  const aiVoice = (eng) => eng === "openai" ? (settings().aiVoice || "nova") : (settings().elevenVoice || "21m00Tcm4TlvDq8ikWAM");
  async function fetchClip(eng, voice, text) {
    const k = S.keys();
    let res;
    if (eng === "openai") {
      res = await fetch("https://api.openai.com/v1/audio/speech", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + k.openai },
        body: JSON.stringify({ model: "gpt-4o-mini-tts", voice, input: text, response_format: "mp3", instructions: "You are a warm, cheerful, patient teacher reading to a child. Speak clearly and naturally, with gentle expression. Say single words crisply." }) });
    } else {
      res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(voice) + "?output_format=mp3_44100_64", { method: "POST", headers: { "Content-Type": "application/json", "xi-api-key": k.elevenlabs, Accept: "audio/mpeg" },
        body: JSON.stringify({ text, model_id: "eleven_flash_v2_5", voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true } }) });
    }
    if (!res.ok) { let msg = "HTTP " + res.status; try { const j = await res.json(); msg = (j.error && (j.error.message || j.error)) || (j.detail && (j.detail.message || j.detail)) || msg; } catch (e) { /* not json */ } throw new Error(String(msg)); }
    return res.blob();
  }
  async function getClip(eng, text) {
    const voice = aiVoice(eng); const key = clipKey(eng, voice, text);
    if (memo.has(key)) return memo.get(key);
    if (inflight.has(key)) return inflight.get(key);
    const p = (async () => {
      const url = "https://gka-voice.local/" + key;
      let blob = null;
      try { if (window.caches) { const c = await caches.open(CACHE); const hit = await c.match(url); if (hit) blob = await hit.blob(); } } catch (e) { /* no cache here */ }
      if (!blob) {
        blob = await fetchClip(eng, voice, text);
        try { if (window.caches) { const c = await caches.open(CACHE); await c.put(url, new Response(blob, { headers: { "Content-Type": "audio/mpeg" } })); } } catch (e) { /* cache full or blocked */ }
      }
      const obj = URL.createObjectURL(blob); memo.set(key, obj);
      if (memo.size > 400) { const first = memo.keys().next().value; URL.revokeObjectURL(memo.get(first)); memo.delete(first); }
      return obj;
    })();
    inflight.set(key, p);
    try { return await p; } finally { inflight.delete(key); }
  }
  // Long texts are read in chunks of whole sentences, so the first sentence starts quickly while the next is fetched.
  const chunksOf = (text) => {
    const t = String(text).replace(/\s+/g, " ").trim(); if (t.length <= 240) return [{ t, at: 0 }];
    const parts = t.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) || [t]; const out = []; let cur = "", at = 0, pos = 0;
    for (const p of parts) { if (cur && (cur + p).length > 240) { out.push({ t: cur.trim(), at }); at = pos; cur = ""; } cur += p; pos += p.length; }
    if (cur.trim()) out.push({ t: cur.trim(), at });
    return out;
  };
  const audio = typeof Audio !== "undefined" ? new Audio() : null;
  if (audio) { audio.preload = "auto"; try { audio.preservesPitch = true; } catch (e) { /* old browser */ } }
  let token = 0; let pendingResolve = null;
  // Phones only let a page play audio after a tap: play a tiny silent clip on the first tap to open the audio element.
  const silentWav = () => { const n = 800, buf = new ArrayBuffer(44 + n * 2), d = new DataView(buf); const w = (o, str) => { for (let i = 0; i < str.length; i++) d.setUint8(o + i, str.charCodeAt(i)); };
    w(0, "RIFF"); d.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt "); d.setUint32(16, 16, true); d.setUint16(20, 1, true); d.setUint16(22, 1, true); d.setUint32(24, 8000, true); d.setUint32(28, 16000, true); d.setUint16(32, 2, true); d.setUint16(34, 16, true); w(36, "data"); d.setUint32(40, n * 2, true);
    return URL.createObjectURL(new Blob([buf], { type: "audio/wav" })); };
  S.unlock = () => { if (!audio || S._unlocked) return; S._unlocked = true; try { audio.src = silentWav(); const p = audio.play(); if (p && p.then) p.then(() => audio.pause()).catch(() => {}); } catch (e) { /* ignore */ } };
  function playUrl(url, rate, onProgress, myToken) {
    return new Promise((resolve) => {
      if (!audio || myToken !== token) return resolve(false);
      let done = false, tick = null;
      const end = (ok) => { if (done) return; done = true; clearInterval(tick); audio.onended = audio.onerror = null; pendingResolve = null; resolve(ok); };
      pendingResolve = () => end(false);
      audio.onended = () => end(true);
      audio.onerror = () => end(false);
      audio.src = url; audio.volume = 1;
      audio.playbackRate = Math.max(0.5, Math.min(2, (rate || 0.9) / 0.9));
      if (onProgress) tick = setInterval(() => { if (audio.duration) onProgress(audio.currentTime / audio.duration); }, 90);
      const p = audio.play(); if (p && p.catch) p.catch(() => end(false));
    });
  }
  async function speakAI(eng, text, opts) {
    const my = ++token;
    const chunks = chunksOf(text);
    let next = getClip(eng, chunks[0].t);
    for (let i = 0; i < chunks.length; i++) {
      const url = await next;
      if (my !== token) return false;
      if (i + 1 < chunks.length) { next = getClip(eng, chunks[i + 1].t); next.catch(() => {}); }
      const ch = chunks[i];
      const ok = await playUrl(url, opts.rate, opts.onBoundary ? (f) => opts.onBoundary(Math.round(ch.at + f * ch.t.length)) : null, my);
      if (!ok || my !== token) return false;
    }
    return true;
  }

  // ----- Device voice -----
  function speakDevice(text, opts) {
    return new Promise((resolve) => {
      if (!synth || !text) return resolve(false);
      try { synth.cancel(); } catch (e) { /* ignore */ }
      const u = new SpeechSynthesisUtterance(String(text));
      const v = S.pickVoice(opts.voiceURI != null ? opts.voiceURI : settings().voiceURI);
      if (v) u.voice = v;
      u.lang = (v && v.lang) || "en-US";
      u.rate = opts.rate || 0.9;
      u.pitch = opts.pitch || (S.isNatural(v) ? 1 : 1.05);
      u.volume = 1;
      let done = false;
      const finish = (ok) => { if (done) return; done = true; resolve(ok); };
      u.onend = () => finish(true);
      u.onerror = () => finish(false);
      if (opts.onBoundary) u.onboundary = (ev) => { if (ev.name === "word" || ev.charIndex != null) opts.onBoundary(ev.charIndex, ev.charLength); };
      synth.speak(u);
      // Safety: some browsers never fire onend for short strings.
      const est = 1500 + String(text).length * 90 / (u.rate || 1);
      setTimeout(() => { if (!done && !synth.speaking) finish(true); }, est);
      setTimeout(() => finish(true), est + 20000);
    });
  }

  /* Speak text. Resolves true when it finished, false when stopped or failed.
     opts: rate, pitch, voiceURI, engine ("device" to force the device voice), onBoundary(charIndex). */
  S.speak = async (text, opts) => {
    opts = opts || {};
    text = String(text || "").trim();
    if (!text) return false;
    S.stop();
    const eng = opts.engine || S.engine();
    if (eng !== "device") {
      try { return await speakAI(eng, text, opts); }
      catch (e) {
        S.lastError = (e && e.message) || "AI voice failed";
        // A network or key problem: use the device voice for the rest of this visit instead of failing again.
        if (!navigator.onLine || /401|403|invalid|key|unauthor|Failed to fetch|NetworkError|Load failed/i.test(S.lastError)) S.aiBroken = true;
      }
    }
    return speakDevice(text, opts);
  };
  // Fetch AI clips ahead of time (the next card's words and sentences).
  S.prefetch = (texts) => {
    const eng = S.engine(); if (eng === "device" || !navigator.onLine) return;
    (texts || []).filter(Boolean).slice(0, 6).forEach((t) => { const c = chunksOf(t)[0]; getClip(eng, c.t).catch(() => {}); });
  };
  S.test = async (eng, sample) => { S.aiBroken = false; S.lastError = ""; const t = sample || "Hi! I am Nova, your teacher. Let's learn something amazing today."; if (eng === "device") return speakDevice(t, {}); return speakAI(eng, t, {}); };
  S.clearVoiceCache = async () => { memo.forEach((u) => URL.revokeObjectURL(u)); memo.clear(); try { if (window.caches) await caches.delete(CACHE); } catch (e) { /* ignore */ } };
  S.stop = () => {
    token++;
    if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } }
    if (audio) { try { audio.pause(); } catch (e) { /* ignore */ } }
    if (pendingResolve) pendingResolve();
  };
  S.speaking = () => !!((synth && synth.speaking) || (audio && !audio.paused && !audio.ended));

  /* Listen once. Resolves { transcript, alts: [...] } or rejects { code } where code is
     unavailable | no-speech | denied | aborted | network | error. */
  S.listen = (opts) => new Promise((resolve, reject) => {
    opts = opts || {};
    if (!Rec) return reject({ code: "unavailable" });
    S.cancelListen();
    S.stop();
    const r = new Rec();
    rec = r;
    r.lang = opts.lang || "en-US";
    r.interimResults = false;
    r.maxAlternatives = 6;
    r.continuous = false;
    let settled = false;
    const settle = (fn, val) => { if (settled) return; settled = true; S.listening = false; rec = null; clearTimeout(timer); fn(val); };
    r.onresult = (ev) => {
      const alts = [];
      for (let i = 0; i < ev.results.length; i++) { const res = ev.results[i]; for (let j = 0; j < res.length; j++) alts.push(res[j].transcript); }
      settle(resolve, { transcript: alts[0] || "", alts });
    };
    r.onerror = (ev) => {
      const e = (ev && ev.error) || "error";
      const code = e === "not-allowed" || e === "service-not-allowed" ? "denied" : e === "no-speech" ? "no-speech" : e === "aborted" ? "aborted" : e === "network" ? "network" : "error";
      settle(reject, { code });
    };
    r.onend = () => settle(reject, { code: "no-speech" });
    const timer = setTimeout(() => { try { r.stop(); } catch (e) { /* ignore */ } }, opts.timeoutMs || 7000);
    try { S.listening = true; r.start(); if (opts.onStart) opts.onStart(); } catch (e) { settle(reject, { code: "error" }); }
  });
  S.cancelListen = () => { if (rec) { try { rec.onend = null; rec.onerror = null; rec.abort(); } catch (e) { /* ignore */ } rec = null; } S.listening = false; };

  // Short sound effects made with the Web Audio API, so there are no audio files to load.
  let ctx = null;
  const tone = (f, dur, type, when, gain) => {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = type || "sine"; o.frequency.value = f;
      const t = ctx.currentTime + (when || 0);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain || 0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) { /* no audio */ }
  };
  S.sfx = (name) => {
    if (window.GKA.Store && !window.GKA.Store.get().settings.sound) return;
    if (name === "ok") { tone(660, 0.12, "sine", 0); tone(880, 0.18, "sine", 0.1); }
    else if (name === "no") { tone(220, 0.25, "triangle", 0, 0.12); }
    else if (name === "tap") { tone(520, 0.06, "sine", 0, 0.08); }
    else if (name === "star") { tone(784, 0.1, "sine", 0); tone(988, 0.1, "sine", 0.1); tone(1319, 0.3, "sine", 0.2); }
    else if (name === "win") { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, "sine", i * 0.12)); }
    else if (name === "tick") { tone(1200, 0.03, "square", 0, 0.03); }
  };
  window.GKA.Speech = S;
})();
