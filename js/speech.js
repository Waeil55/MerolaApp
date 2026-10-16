/* Genius Kids Academy - speech layer. Text to speech and speech recognition from the browser, no keys, no cost.
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
  let rec = null;
  let currentUtter = null;

  function loadVoices() {
    if (!synth) return;
    const v = synth.getVoices() || [];
    if (v.length) S.voices = v.filter((x) => /^en/i.test(x.lang));
  }
  if (synth) { loadVoices(); if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = loadVoices; }

  // Prefer a natural, friendly English voice. The parent can override in settings.
  S.pickVoice = (uri) => {
    loadVoices();
    if (!S.voices.length) return null;
    if (uri) { const v = S.voices.find((x) => x.voiceURI === uri || x.name === uri); if (v) return v; }
    const prefs = [/Google US English/i, /Samantha/i, /Microsoft Aria/i, /Microsoft Jenny/i, /Microsoft Zira/i, /Karen/i, /Daniel/i, /en-US/i, /en-GB/i, /en/i];
    for (const p of prefs) { const v = S.voices.find((x) => p.test(x.name) || p.test(x.lang)); if (v) return v; }
    return S.voices[0];
  };

  /* Speak text. Resolves when done. opts: rate, pitch, voiceURI, onBoundary(charIndex). */
  S.speak = (text, opts) => new Promise((resolve) => {
    opts = opts || {};
    if (!synth || !text) return resolve(false);
    try { synth.cancel(); } catch (e) { /* ignore */ }
    const u = new SpeechSynthesisUtterance(String(text));
    const v = S.pickVoice(opts.voiceURI);
    if (v) u.voice = v;
    u.lang = (v && v.lang) || "en-US";
    u.rate = opts.rate || 0.9;
    u.pitch = opts.pitch || 1.05;
    u.volume = 1;
    let done = false;
    const finish = (ok) => { if (done) return; done = true; currentUtter = null; resolve(ok); };
    u.onend = () => finish(true);
    u.onerror = () => finish(false);
    if (opts.onBoundary) u.onboundary = (ev) => { if (ev.name === "word" || ev.charIndex != null) opts.onBoundary(ev.charIndex, ev.charLength); };
    currentUtter = u;
    synth.speak(u);
    // Safety: some browsers never fire onend for short strings.
    const est = 1500 + String(text).length * 90 / (u.rate || 1);
    setTimeout(() => { if (!done && !synth.speaking) finish(true); }, est);
    setTimeout(() => finish(true), est + 20000);
  });
  S.stop = () => { if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } } currentUtter = null; };
  S.speaking = () => !!(synth && synth.speaking);

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
