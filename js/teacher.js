/* Genius Kids Academy - Nova, the AI teacher. A button on every screen opens a chat that knows exactly what the child
   is looking at (the card, the question, the passage, the level) and teaches like a patient teacher: hints first while a
   question is unsolved, a clear explanation after. Answers are read aloud with the app voice; the child can speak too.
   Where the AI comes from, best first:
   1. Inside the Claude app (claude.ai artifact): Claude through the page's sample capability, no key needed.
   2. A parent's own Anthropic key (Claude) or OpenAI key, saved only on this device.
   3. No AI: built-in help that still reads aloud, gives hints and shows where an answer is in the text. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U, Store = window.GKA.Store, Speech = window.GKA.Speech, UI = window.GKA.UI, E = window.GKA.Engine;
  const T = {};
  const settings = () => Store.settings();
  const esc = (s) => U.esc(String(s == null ? "" : s));
  const clip = (s, n) => { s = String(s || ""); return s.length > n ? s.slice(0, n) + "..." : s; };

  // ----- AI providers -----
  let sampleFn = null, sampleOff = false;
  if (window.claude && typeof window.claude.use === "function") window.claude.use("sample").then((f) => { sampleFn = f || null; T.refresh(); }).catch(() => { sampleFn = null; });
  T.provider = () => {
    if (sampleFn && !sampleOff) return "claude-app";
    const k = Speech.keys(); const pref = settings().aiProvider || "auto";
    if (pref === "openai" && k.openai) return "openai";
    if (pref === "anthropic" && k.anthropic) return "anthropic";
    if (k.anthropic) return "anthropic";
    if (k.openai) return "openai";
    if (Speech.puterOK()) return "puter";
    return null;
  };
  T.providerLabel = () => ({ "claude-app": "Claude AI", anthropic: "Claude AI", openai: "OpenAI", puter: "Claude AI (free with Puter)" })[T.provider()] || "Built-in help";

  const SUBJECT = { reading: "Reading", math: "Math", science: "Science", understand: "Reading comprehension (Understand)" };
  const rules = () => {
    const kid = Store.get().kid; const grade = Store.gradeName(Store.grade());
    return "You are Nova, the warm, patient and fun AI teacher inside the Genius Kids Academy learning app. You are talking with " + kid.name + ", a child in " + grade + ".\n" +
      "How to teach:\n" +
      "- Talk at a " + grade + " level: short sentences, simple words, one idea at a time. Keep answers under about 70 words unless the child asks for a story, a list of examples or a longer explanation.\n" +
      "- Be encouraging and specific. Praise effort. Never make the child feel bad about a mistake.\n" +
      "- Teach, do not just tell. While a question on screen is NOT solved yet, never say the answer or which option is right: give one small hint, point to where to look, or ask a guiding question. After it is solved, or when the screen shows no question, explain clearly and fully, using the text on screen when there is one.\n" +
      "- You can explain words, retell texts simply, give examples, make up practice questions (one at a time, then wait for the answer and check it), tell short stories that use the level's words, and help with homework in any subject step by step.\n" +
      "- Answer in the language the child writes in; use English when unsure.\n" +
      "- Write plain text for reading aloud: no markdown, no headings, no bullet symbols, at most one emoji.\n" +
      "- Keep everything safe and kind for children. Never ask for personal information. If the child brings up something unsafe, upsetting or private, gently suggest talking with a parent or teacher.";
  };

  // ----- What the child sees right now -----
  T.focus = null; // set by the Library when a level is opened
  T.setFocus = (f) => { T.focus = f; };
  const answerOf = (c) => {
    if (!c) return "";
    if (c.items && c.items.length) return c.items.join(" > ");
    if (typeof c.answer === "boolean") return c.answer ? "True" : "False";
    if (c.answer != null) return String(c.answer);
    if (c.a != null && typeof c.a === "boolean") return c.a ? "True" : "False";
    if (c.problem && c.problem.answer != null) return String(c.problem.answer);
    return c.word ? String(c.word) : "";
  };
  const passageText = (p) => p ? ((p.title ? p.title + ". " : "") + p.paras.map((x) => x.join(" ")).join("\n")) : "";
  function describeCard(c, cur) {
    const L = [];
    const done = !!(cur && cur.done), tried = !!(cur && cur.tries > 0);
    if (c.story) L.push("Story on screen: " + c.story.title + "\n" + clip(c.story.text, 3000));
    if (c.lesson) L.push("Lesson on screen (" + (c.name || "") + "):\n" + clip(c.lesson, 3000));
    if (c.passage && c.passage.paras) L.push("Text on screen:\n" + clip(passageText(c.passage), 3000));
    if (c.problem) L.push("Math problem: " + c.problem.q + (c.problem.hint ? "\nTeacher hint for this problem: " + c.problem.hint : ""));
    if (c.q) L.push("Question: " + c.q);
    if (c.options && c.options.length) L.push("Answer choices: " + c.options.join(" | "));
    if (c.shuffled && c.shuffled.length) L.push("Items to put in order: " + c.shuffled.join(" | "));
    if (c.pairs) L.push("Match these words to sentences: " + c.pairs.map((p) => p.w + " = " + p.s).join(" | "));
    if (c.word && !c.q && !c.problem && !c.pairs) L.push("Word on screen: " + c.word + (c.hint ? " (" + c.hint + ")" : ""));
    if (c.sentence) L.push("Sentence: " + c.sentence);
    if (c.graded) {
      const ans = answerOf(c);
      if (done) { L.push("Correct answer: " + ans); L.push(cur.first ? "The child answered correctly on the first try." : "The child got it wrong first" + (cur.last ? " (first said or chose: " + cur.last + ")" : "") + ", then found the correct answer."); }
      else if (tried) { L.push("Correct answer (SECRET until the child solves it, do not reveal): " + ans); L.push("The child tried and was wrong" + (cur.last ? " (said or chose: " + cur.last + ")" : "") + ". Help with a hint only."); }
      else { L.push("Correct answer (SECRET until the child solves it, do not reveal): " + ans); L.push("The child has not answered yet. Help with hints and guiding questions only."); }
    } else L.push("This card teaches; there is nothing to answer yet, so explain freely.");
    return L.join("\n");
  }
  function contextText() {
    const parts = (location.hash || "#home").slice(1).split("-");
    const name = parts[0] || "home";
    const sess = window.GKA.Session && window.GKA.Session.current ? window.GKA.Session.current() : null;
    if (name === "play" && sess && sess.card) {
      const head = sess.source === "level" ? SUBJECT[sess.subject] + " lesson, level " + sess.n + ' "' + sess.levelName + '" (' + sess.skill + ")" : SUBJECT[sess.subject] + " practice (" + sess.source + ")";
      return "The child is in a " + head + ", " + E.modeLabel(sess.mode) + " mode, card " + (sess.idx + 1) + " of " + sess.total + ".\n" + describeCard(sess.card, sess.cur);
    }
    const levelInfo = (subject, n) => {
      const L = E.level(subject, n); if (!L) return "";
      const bits = [SUBJECT[subject] + " level " + n + ': "' + L.name + '" - ' + L.skill];
      if (L.words && L.words.length) bits.push("Words: " + L.words.slice(0, 25).map((w) => w.w).join(", "));
      if (L.lesson) bits.push("Lesson: " + clip(L.lesson, 1500));
      if (L.stories && L.stories.length) bits.push("Stories: " + L.stories.map((s) => s.title).join(", "));
      if (L.items && L.items[0] && L.items[0].text) bits.push("Passages: " + L.items.map((i) => i.title || clip(i.text, 40)).join(", "));
      return bits.join("\n");
    };
    if (name === "hub") return "The child is looking at this level before starting it:\n" + levelInfo(parts[1], parseInt(parts[2], 10) || 1);
    if (name === "library") return "The child is browsing the Library (all study material for the grade)." + (T.focus ? "\nThey opened:\n" + levelInfo(T.focus.subject, T.focus.n) : "");
    if (name === "words") { const w = Store.myWords().slice(0, 30).map((x) => x.w); return "The child is on My Words, their own word list" + (w.length ? ": " + w.join(", ") : " (empty)") + "."; }
    if (name === "results") { const r = window.GKA.lastResult; return r ? "The child just finished a " + SUBJECT[r.subject] + " lesson with " + r.correct + " of " + r.total + " correct." + (r.missed && r.missed.length ? " Missed: " + r.missed.slice(0, 8).join(" | ") : "") : "The child is looking at lesson results."; }
    const subject = parts[1] || sessionStorage.getItem("gka.subject") || "reading";
    if (name === "home" && SUBJECT[subject]) { const n = Store.currentLevel(subject); return "The child is on the " + SUBJECT[subject] + " learning path. Their current level:\n" + levelInfo(subject, n); }
    return "The child is on the " + name + " screen of the app.";
  }

  // ----- Calling the AI -----
  async function readSSE(res, pick, onText, signal) {
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = "", text = "";
    while (true) {
      if (signal && signal.aborted) { try { reader.cancel(); } catch (e) { /* ignore */ } throw { code: "cancelled", text }; }
      const { done, value } = await reader.read(); if (done) break;
      buf += dec.decode(value, { stream: true });
      let i; while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith("data:")) continue; const data = line.slice(5).trim(); if (!data || data === "[DONE]") continue;
        try { const d = pick(JSON.parse(data)); if (d) { text += d; onText(text); } } catch (e) { if (e && e.code) throw e; }
      }
    }
    return text;
  }
  async function httpError(res) { let msg = "HTTP " + res.status; try { const j = await res.json(); msg = (j.error && (j.error.message || j.error.type)) || msg; } catch (e) { /* not json */ } return { code: "http", message: msg }; }
  async function callAI(history, onText, signal) {
    const p = T.provider(); const sys = rules() + "\n\nWhat the child sees right now:\n" + contextText();
    if (p === "claude-app") {
      try { const r = await sampleFn([{ role: "user", content: sys }].concat(history), { modelTier: "quick", cache: false, signal, onText: ({ text }) => onText(text) }); return r.text; }
      catch (e) {
        if (e && ["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed"].includes(e.code)) { sampleOff = true; T.refresh(); if (T.provider()) return callAI(history, onText, signal); }
        throw e;
      }
    }
    const k = Speech.keys();
    if (p === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", signal, headers: { "content-type": "application/json", "x-api-key": k.anthropic, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: settings().aiModel || "claude-haiku-5-5", max_tokens: 700, system: sys, messages: history, stream: true }) });
      if (!res.ok) throw await httpError(res);
      return readSSE(res, (d) => d.type === "content_block_delta" && d.delta && d.delta.type === "text_delta" ? d.delta.text : "", onText, signal);
    }
    if (p === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", signal, headers: { "Content-Type": "application/json", Authorization: "Bearer " + k.openai },
        body: JSON.stringify({ model: settings().openaiModel || "gpt-4o-mini", stream: true, messages: [{ role: "system", content: sys }].concat(history) }) });
      if (!res.ok) throw await httpError(res);
      return readSSE(res, (d) => d.choices && d.choices[0] && d.choices[0].delta ? d.choices[0].delta.content || "" : "", onText, signal);
    }
    if (p === "puter") {
      const resp = await window.puter.ai.chat([{ role: "system", content: sys }].concat(history), { model: "claude-sonnet-4-6", stream: true, signal });
      let text = "";
      for await (const part of resp) {
        if (signal && signal.aborted) throw { code: "cancelled", text };
        if (part && part.type === "error") throw { message: part.message || "Puter error" };
        const d = part && typeof part.text === "string" && (!part.type || part.type === "text") ? part.text : "";
        if (d) { text += d; onText(text); }
      }
      return text;
    }
    return null;
  }
  T.test = async () => { const t = await callAI([{ role: "user", content: "Say hello to me in one short, friendly sentence." }], () => {}, null); if (!t) throw { message: "No AI is set up yet." }; return t; };

  // ----- Built-in help when there is no AI -----
  function localReply(ask) {
    const sess = window.GKA.Session && window.GKA.Session.current ? window.GKA.Session.current() : null;
    const c = sess && sess.card; const cur = sess && sess.cur; const done = cur && cur.done;
    const noAI = "When a grown-up turns on AI help on the Parents page, I can answer any question like a real teacher.";
    if (!c) return "I can read things to you and help you find your way around. Try the Library to study any level, or Mix practice for a fresh set of questions. " + noAI;
    if (/why/i.test(ask) && done) {
      let s = "The answer is " + answerOf(c) + ".";
      if (c.ev && c.passage && c.passage.paras[c.ev[0]]) s += " The text says: " + c.passage.paras[c.ev[0]][c.ev[1]];
      return s + " Read it once more and you will see it. " + noAI;
    }
    if (/hint|help|stuck/i.test(ask) || !done) {
      if (c.ev && c.passage && c.passage.paras[c.ev[0]]) return "Look back at this sentence: " + c.passage.paras[c.ev[0]][c.ev[1]] + " The answer is hiding there.";
      if (c.problem) return (c.problem.hint || "Read the problem slowly and find the numbers you need.") + " Try it step by step.";
      if (c.word && !c.q) { const w = String(c.word); return "It starts with " + w[0].toUpperCase() + " and has " + w.replace(/[^a-z]/gi, "").length + " letters." + (c.sentence ? " Here it is in a sentence: " + c.sentence.replace(new RegExp(w, "i"), "...") : ""); }
      if (c.q) { const key = c.q.toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter((x) => x.length > 3 && !/what|which|where|when|does|that|this|with|from|they|their|about/.test(x)); return "Find these words in the text: " + key.slice(0, 3).join(", ") + ". The answer is close to them."; }
    }
    return "You can do it! Read it once more, slowly. " + noAI;
  }

  // ----- Panel -----
  let el = null, msgs = [], busy = null, voiceOn = null;
  const greetFor = () => {
    const sess = window.GKA.Session && window.GKA.Session.current ? window.GKA.Session.current() : null; const name = Store.get().kid.name;
    if (sess && sess.card) return sess.cur && sess.cur.done ? "Want to know why? Ask me anything about this one!" : "Stuck? I can give you a hint, explain a word or read it to you. I won't spoil the answer!";
    return "Hi " + name + "! I'm Nova, your teacher. Ask me anything: words, stories, math, science or your homework.";
  };
  function chips() {
    const parts = (location.hash || "#home").slice(1).split("-"); const name = parts[0];
    const sess = window.GKA.Session && window.GKA.Session.current ? window.GKA.Session.current() : null;
    if (name === "play" && sess && sess.card) return sess.cur && sess.cur.done ? ["Why is that the answer?", "Give me another example", "Quiz me on this", "Read it to me"] : ["Give me a hint", "Read it to me", "What does this word mean?", "Explain it simply"];
    if (name === "hub" || (name === "library" && T.focus)) return ["Teach me this level", "Quiz me", "Tell a story with these words", "Explain the hard words"];
    if (name === "words") return ["Make sentences with my words", "Quiz me on my words", "Tell a story with my words"];
    if (name === "results") return ["Help me with my mistakes", "What should I practice next?"];
    return ["What should I practice today?", "Help me with my homework", "Quiz me", "Tell me a fun fact"];
  }
  function draw() {
    if (!el) return;
    const box = el.querySelector(".np-msgs");
    box.innerHTML = msgs.map((m, i) => '<div class="np-msg ' + m.role + (m.err ? " err" : "") + '">' + (m.role === "assistant" ? '<span class="np-av">' + UI.mascot("nova") + "</span>" : "") + '<div class="np-bubble">' + esc(m.content || "") + (m.thinking ? '<span class="np-dots"><i></i><i></i><i></i></span>' : "") + (m.role === "assistant" && m.content && !m.thinking ? '<button class="np-say" data-i="' + i + '" aria-label="Read aloud">' + UI.icon("volume") + "</button>" : "") + "</div></div>").join("");
    box.scrollTop = box.scrollHeight;
    box.querySelectorAll(".np-say").forEach((b) => { b.onclick = () => speak(msgs[+b.dataset.i].content); });
    el.querySelector(".np-chips").innerHTML = chips().map((c) => '<button class="np-chip">' + esc(c) + "</button>").join("");
    el.querySelectorAll(".np-chip").forEach((b) => { b.onclick = () => send(b.textContent); });
    el.querySelector(".np-src").textContent = T.providerLabel();
    el.querySelector("#np-voice").innerHTML = UI.icon(voiceOn ? "volume" : "mute");
    el.querySelector("#np-voice").setAttribute("aria-pressed", voiceOn ? "true" : "false");
  }
  const speak = (t) => Speech.speak(String(t || "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ""), { rate: settings().rate, patient: true });
  // Tell the child once when the human voice has finished downloading.
  window.addEventListener("gka-voice", (e) => { const d = e.detail || {}; if (d.state === "ready" && !T._toldVoice) { T._toldVoice = true; try { if (!localStorage.getItem("gka.voiceReady")) { localStorage.setItem("gka.voiceReady", "1"); UI.toast("Nova's human voice is ready!", "ok"); } } catch (x) { /* ignore */ } } });
  function readCard() {
    const sess = window.GKA.Session && window.GKA.Session.current ? window.GKA.Session.current() : null; const c = sess && sess.card;
    if (!c) { const main = document.querySelector("#app h1"); return speak(main ? main.textContent : greetFor()); }
    const bits = [];
    if (c.story) bits.push(c.story.text); if (c.lesson) bits.push(c.lesson); if (c.passage && c.passage.paras) bits.push(passageText(c.passage));
    if (c.problem) bits.push(c.problem.say || c.problem.q);
    if (c.q) bits.push(c.q + (c.options ? " " + c.options.join(", or ") + "?" : ""));
    if (!bits.length && c.word) bits.push(c.word + (c.sentence ? ". " + c.sentence : ""));
    speak(bits.join(" ")); msgs.push({ role: "assistant", content: "Here it is. Listen carefully!" }); draw();
  }
  async function send(text) {
    text = String(text || "").trim(); if (!text) return;
    if (/^read it to me$/i.test(text)) return readCard();
    if (busy) busy.abort();
    msgs.push({ role: "user", content: text });
    const reply = { role: "assistant", content: "", thinking: true }; msgs.push(reply); draw();
    const history = msgs.filter((m) => !m.err && !m.thinking && m.content).slice(-12).map((m) => ({ role: m.role, content: m.content }));
    while (history.length && history[0].role === "assistant") history.shift(); // conversations must start with the child
    if (!T.provider()) { reply.thinking = false; reply.content = localReply(text); draw(); if (voiceOn) speak(reply.content); return; }
    const ctl = new AbortController(); busy = ctl;
    try {
      const full = await callAI(history, (t) => { reply.thinking = false; reply.content = t; draw(); }, ctl.signal);
      reply.thinking = false; reply.content = full || reply.content || localReply(text); draw();
      if (voiceOn && busy === ctl) speak(reply.content);
    } catch (e) {
      reply.thinking = false;
      if (e && e.code === "cancelled") { reply.content = e.text || reply.content || "(stopped)"; }
      else { reply.err = true; reply.content = (e && e.text) || localReply(text); const why = e && (e.message || e.code); if (why) reply.content += "\n(AI help is not working right now: " + clip(why, 120) + ")"; if (voiceOn) speak(localReply(text)); }
      draw();
    } finally { if (busy === ctl) busy = null; }
  }
  T.open = (opts) => {
    opts = opts || {};
    if (voiceOn === null) voiceOn = settings().teacherVoice !== false;
    if (!el) {
      el = document.createElement("div"); el.className = "nova-wrap";
      el.innerHTML = '<div class="nova-back"></div><section class="nova-panel" role="dialog" aria-label="Nova, your teacher"><header class="np-head"><span class="np-face">' + UI.mascot("nova") + '</span><div class="grow"><div class="np-name">Nova · your teacher</div><div class="small np-src"></div></div><button class="btn icon" id="np-voice" aria-label="Read answers aloud"></button><button class="xbtn" id="np-close" aria-label="Close">' + UI.icon("close") + '</button></header><div class="np-msgs" aria-live="polite"></div><div class="np-chips"></div><form class="np-input"><button type="button" class="btn icon" id="np-mic" aria-label="Speak your question">' + UI.icon("mic") + '</button><input class="input" id="np-text" placeholder="Ask Nova anything" autocomplete="off" enterkeyhint="send"><button class="btn primary icon" type="submit" aria-label="Send">' + UI.icon("send") + "</button></form></section>";
      document.body.appendChild(el);
      el.querySelector(".nova-back").onclick = T.close; el.querySelector("#np-close").onclick = T.close;
      el.querySelector("#np-voice").onclick = () => { voiceOn = !voiceOn; Store.setting("teacherVoice", voiceOn); if (!voiceOn) Speech.stop(); draw(); };
      el.querySelector(".np-input").onsubmit = (e) => { e.preventDefault(); const i = el.querySelector("#np-text"); const v = i.value; i.value = ""; send(v); };
      const mic = el.querySelector("#np-mic"); mic.hidden = !Speech.sttOK;
      mic.onclick = () => { mic.classList.add("hot"); Speech.listen({ timeoutMs: 9000 }).then((r) => { mic.classList.remove("hot"); send(r.transcript); }).catch(() => { mic.classList.remove("hot"); UI.toast("I didn't hear that. Try again or type it.", "warn"); }); };
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && el && el.classList.contains("on")) T.close(); });
    }
    el.classList.add("on"); document.body.classList.add("nova-open");
    if (!msgs.length) msgs.push({ role: "assistant", content: greetFor() });
    draw();
    if (opts.prompt) send(opts.prompt);
    else if (opts.ask === "why") send("Why is that the right answer? Can you explain it to me?");
    else if (opts.ask === "hint") send("Can I have a hint, please?");
    else setTimeout(() => { const i = el.querySelector("#np-text"); if (i && window.matchMedia("(pointer: fine)").matches) i.focus(); }, 60);
  };
  T.close = () => { if (!el) return; el.classList.remove("on"); document.body.classList.remove("nova-open"); if (busy) busy.abort(); };
  T.refresh = () => { if (el && el.classList.contains("on")) draw(); };
  // A new card or screen starts a fresh conversation about it.
  T.onCard = () => { if (busy) busy.abort(); msgs = []; if (el && el.classList.contains("on")) { msgs.push({ role: "assistant", content: greetFor() }); draw(); } };
  T.onRoute = (name) => {
    T.close(); msgs = []; if (name !== "library") T.focus = null;
    let fab = document.getElementById("nova-fab");
    if (!fab) { fab = document.createElement("button"); fab.id = "nova-fab"; fab.className = "nova-fab"; fab.setAttribute("aria-label", "Ask Nova, your teacher"); fab.innerHTML = '<span class="nf-face">' + UI.mascot("nova") + '</span><span class="nf-l">Ask</span>'; fab.onclick = () => T.open(); document.body.appendChild(fab); }
    fab.hidden = !Store.hasProfile() || ["profiles", "addkid", "editkid", "parent", "game"].includes(name);
    document.body.dataset.route = name;
  };
  window.GKA.Teacher = T;
})();
