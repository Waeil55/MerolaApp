/* Genius Kids Academy - session runner in the Duolingo lesson style: X + progress bar on top, one task per screen,
   and a bottom sheet that turns green or red with Continue. Rules: first try counts for accuracy, the child may keep
   trying until it is right, review cards earn no new stars. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U, Store = window.GKA.Store, Speech = window.GKA.Speech, UI = window.GKA.UI, E = window.GKA.Engine;
  const RW = () => window.GKA.Rewards;
  const S = {};
  let st = null;
  let timers = [];
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; if (st && st.ring) { st.ring.stop(); st.ring = null; } };
  const settings = () => Store.get().settings;
  const tone = () => UI.toneOf(st.subject);

  S.start = (opts, root) => {
    clearTimers(); Speech.stop(); Speech.cancelListen();
    const deck = E.buildDeck(opts);
    st = Object.assign({}, opts, { deck, idx: 0, results: [], stars: 0, t0: Date.now(), root, cur: null, ring: null });
    saveResume();
    try { Speech.prefetch(deck.flatMap(cardTexts)); } catch (e) { /* prefetch is optional */ }
    if (!deck.length) { root.innerHTML = '<div class="screen"><div class="empty">' + UI.icon("words") + '<div>Nothing to practice here yet.</div><a class="btn primary" href="#' + (opts.source === "mywords" ? "words" : "hub-" + opts.subject + "-" + opts.n) + '">Back</a></div></div>'; return; }
    renderFrame(); renderCard();
  };
  // ----- Finish later: the lesson in progress is saved after every card, so a child can leave and come back. -----
  const RESUMABLE = ["level", "mix", "review", "brain", "mywords"];
  const resumeKey = () => "gka.resume." + ((Store.profile() || {}).id || "guest") + "." + Store.grade();
  function saveResume() {
    if (!st || !RESUMABLE.includes(st.source) || st.idx >= st.deck.length) return;
    try { const txt = JSON.stringify({ opts: { subject: st.subject, n: st.n, mode: st.mode, source: st.source, story: st.story }, deck: st.deck, idx: st.idx, results: st.results, stars: st.stars, at: Date.now() }); if (txt.length < 500000) localStorage.setItem(resumeKey(), txt); } catch (e) { /* storage full: no resume */ }
  }
  const clearResume = () => { try { localStorage.removeItem(resumeKey()); } catch (e) { /* ignore */ } };
  S.resumeInfo = () => {
    try { const d = JSON.parse(localStorage.getItem(resumeKey()) || "null"); if (!d || !d.deck || d.idx >= d.deck.length || Date.now() - d.at > 4 * 864e5) return null; return { subject: d.opts.subject, n: d.opts.n, mode: d.opts.mode, source: d.opts.source, idx: d.idx, total: d.deck.length }; } catch (e) { return null; }
  };
  S.resume = (root) => {
    let d = null; try { d = JSON.parse(localStorage.getItem(resumeKey()) || "null"); } catch (e) { d = null; }
    if (!d || !d.deck) return false;
    clearTimers(); Speech.stop(); Speech.cancelListen();
    st = Object.assign({}, d.opts, { deck: d.deck, idx: d.idx, results: d.results || [], stars: d.stars || 0, t0: Date.now(), root, cur: null, ring: null, resumed: true });
    renderFrame(); renderCard(); return true;
  };
  S.dropResume = clearResume;
  // What is on screen right now, for the AI teacher.
  S.current = () => { if (!st) return null; const c = st.deck[st.idx]; const L = E.level(st.subject, st.n); return { subject: st.subject, n: st.n, mode: st.mode, source: st.source, idx: st.idx, total: st.deck.length, card: c || null, cur: st.cur, levelName: L ? L.name : "", skill: L ? L.skill : "" }; };
  // Text a card will say, so an AI voice can fetch it before the card appears.
  const cardTexts = (c) => { if (!c) return []; const p = c.problem || {}; return [c.word, c.sentence, c.q, p.say, c.passage && c.passage.title].filter((x) => typeof x === "string" && x.length < 400); };
  S.abort = () => { clearTimers(); Speech.stop(); Speech.cancelListen(); if (st) Store.addSeconds(Math.round((Date.now() - st.t0) / 1000)); st = null; };
  S.next = () => { if (!st) return; const c = st.deck[st.idx]; if (st.source === "placement" && c && c.graded && st.cur && st.cur.first === false) return finishPlacement(); st.idx++; ease(); saveResume(); renderCard(); };
  // Two misses in a row: bring the easiest of the next few cards forward and say something kind.
  function ease() {
    if (!st || (st.missRun || 0) < 2) return; st.missRun = 0;
    const from = st.idx, to = Math.min(st.deck.length, st.idx + 6); let best = -1, bd = Infinity;
    for (let i = from; i < to; i++) { const c = st.deck[i]; if (!c || !c.graded || c.type === "u-read") continue; if (st.deck.slice(from, i).some((x) => x.type === "u-read")) break; const d = E.cardDifficulty(c); if (d < bd) { bd = d; best = i; } }
    if (best > from) { const [c] = st.deck.splice(best, 1); st.deck.splice(from, 0, c); }
    showCheer(U.pick(["Let's try an easier one. You've got this!", "Deep breath. Here's a friendlier one!", "Mistakes help your brain grow. Try this one!"]), "wink");
  }
  // Combo cheers: three, five, eight... right in a row.
  const COMBO = { 3: "3 in a row! Nice!", 5: "5 in a row! You're on fire!", 8: "8 in a row! Brain power!", 12: "12 in a row! Unstoppable!", 16: "16 in a row! Genius mode!", 20: "20 in a row! Legendary!" };
  function cheer(n) { showCheer(COMBO[n] || n + " in a row!", "nova"); Speech.sfx("win"); }
  function showCheer(text, face) {
    if (!st) return; const old = document.querySelector(".cheer"); if (old) old.remove();
    const el = document.createElement("div"); el.className = "cheer"; el.setAttribute("role", "status");
    el.innerHTML = '<span class="ch-face">' + UI.mascot(face || "nova") + '</span><span class="ch-t">' + U.esc(text) + "</span>";
    document.body.appendChild(el); setTimeout(() => el.classList.add("out"), 1900); setTimeout(() => el.remove(), 2400);
  }

  const speedSeconds = () => { const sp = settings().speed; if (sp === "level" || sp == null) { const L = E.level(st.subject, st.n); return L ? L.speed : 1; } return Number(sp) || 0; };
  const modeLabel = () => E.modeLabel(st.mode);
  const levelLabel = () => st.source === "placement" ? "Level check" : st.source === "mywords" ? "My Words" : st.source === "review" ? "Review" : st.source === "mix" ? "Mix practice" : st.source === "brain" ? "Brain Boost" : "Level " + st.n;
  const $ = (sel) => st.root.querySelector(sel);

  function renderFrame() {
    st.root.innerHTML =
      '<div class="screen play">' +
        '<div class="lesson-top"><button class="xbtn" id="exit" aria-label="Close">' + UI.icon("close") + '</button><div class="bar"><i id="prog" style="width:0%"></i></div><div class="hearts" id="hearts" aria-label="Hearts"></div><div class="pill num" id="starpill">' + UI.icon("star") + "<span>+0</span></div></div>" +
        '<h1 class="lesson-head" id="heading">Lesson</h1><div class="lesson-meta" id="meta-r"></div>' +
        '<div class="stage fade-in" id="stage" style="position:relative"></div>' +
        '<div id="below" class="stack" style="margin-top:14px"></div>' +
      "</div>" +
      '<div class="actionbar" id="actions"><div class="btns"></div></div>';
    $("#exit").onclick = confirmExit;
  }
  function confirmExit() {
    saveResume();
    const m = UI.modal('<h2>Take a break?</h2><p class="muted">Your place is saved. Tap Continue on the Learn page to finish this lesson later.</p><div class="row"><button class="btn primary grow" id="m-no">Keep going</button><button class="btn grow" id="m-yes">Leave for now</button></div>');
    m.el.querySelector("#m-no").onclick = m.close;
    m.el.querySelector("#m-yes").onclick = () => { m.close(); const back = st.source === "placement" ? "home-understand" : st.source === "mywords" ? "words" : st.source === "mix" || st.source === "review" || st.source === "brain" ? "practice" : "hub-" + st.subject + "-" + st.n; S.abort(); window.GKA.App.go(back); };
  }
  const HEADINGS = { flash: "Read this word out loud", readcheck: "Which one did you just see?", speak: "Say this word", write: "Look at the word", "story-listen": "Listen to the story", "story-words": "Read it word by word", question: "Answer the question", truefalse: "True or false?", order: "Put it in order", lesson: "Listen and read along", picmatch: "Which word is this picture?", blank: "Fill in the blank", match: "Match the pairs", unscramble: "Unscramble the letters", dictation: "Listen and type the sentence", sentence: "Build the sentence", trace: "Trace the letter", readaloud: "Read the sentence out loud" };
  function heading(text) { const h = $("#heading"); if (h) h.textContent = text; }
  function drawHearts() { const h = $("#hearts"); if (!h) return; if (!RW().heartsOn()) { h.innerHTML = ""; return; } const n = RW().hearts(); let s = ""; for (let i = 0; i < RW().MAX_HEARTS; i++) s += '<span class="' + (i < n ? "on" : "") + '">' + UI.icon("heart") + "</span>"; h.innerHTML = s; }
  function setHead() {
    const c = st.deck[st.idx];
    $("#meta-r").textContent = (c && c.warm ? "Warm-up from Level " + c.warmFrom + " · " : "") + "Card " + (st.idx + 1) + " of " + st.deck.length + " · " + modeLabel() + " · " + levelLabel();
    $("#prog").style.width = Math.round((st.idx / st.deck.length) * 100) + "%";
    $("#starpill span").textContent = "+" + st.stars;
    drawHearts();
    if (c && c.type === "picmatch" && c.listen) { heading("Listen, then tap the picture"); return; }
    if (c) { let h = HEADINGS[c.type] || modeLabel(); if (c.type === "listen") h = c.sub === "pick" ? "Listen, then tap the word" : "Listen, then spell the word"; if (c.type === "math") h = c.sub === "listen" ? "Listen to the problem" : c.sub === "say" ? "Say the answer" : c.sub === "pick" ? "Pick the answer" : c.sub === "words" ? "Solve the word problem" : "Solve it"; heading(h); }
  }
  function actions(html) { const bar = $("#actions"); let b = bar.querySelector(".btns"); if (!b) { b = document.createElement("div"); b.className = "btns"; bar.appendChild(b); } b.innerHTML = html; }
  function resetBar() { const bar = $("#actions"); bar.className = "actionbar"; bar.innerHTML = '<div class="btns"></div>'; }
  function below(html) { $("#below").innerHTML = html || ""; }
  function stage(html) { const s = $("#stage"); s.innerHTML = html; s.classList.remove("fade-in"); void s.offsetWidth; s.classList.add("fade-in"); }

  function renderCard() {
    clearTimers();
    if (st.cleanup) { st.cleanup(); st.cleanup = null; }
    Speech.stop(); Speech.cancelListen();
    if (st.idx >= st.deck.length) return finish();
    const c = st.deck[st.idx];
    st.cur = { tries: 0, first: null, done: false, review: c.graded ? E.isReviewCard(st.subject, st.n, st.mode, c.word) : false };
    if (st.source === "mywords" || st.source === "review" || st.source === "mix" || st.source === "brain") st.cur.review = c.graded ? Store.isMastered(Store.masteryKey(st.subject, st.mode, c.word)) : false;
    if (st.source === "placement") st.cur.review = true;
    st.reading = false;
    resetBar(); setHead(); below("");
    window.scrollTo(0, 0);
    try { Speech.prefetch(cardTexts(st.deck[st.idx + 1]).concat(cardTexts(st.deck[st.idx + 2]))); } catch (e) { /* prefetch is optional */ }
    if (window.GKA.Teacher) window.GKA.Teacher.onCard();
    const r = RENDER[c.type];
    if (r) r(c); else { stage('<div class="label">Unknown card</div>'); actions(nextBtn()); bindNext(); }
  }

  function answer(ok, info) {
    const c = st.deck[st.idx];
    const first = st.cur.tries === 0;
    st.cur.tries++; st.cur.last = info && info.heard != null ? String(info.heard) : st.cur.last;
    if (first) {
      st.cur.first = ok;
      const key = Store.masteryKey(st.subject, st.mode, c.word);
      let stars = 0;
      if (c.warm) { stars = 0; }
      else if (ok) { if (st.source !== "placement") Store.bumpMastery(key); stars = st.cur.review ? 0 : 1; st.stars += stars; }
      else if (st.source !== "placement" && !c.warm) { Store.logMistake({ subject: st.subject, level: st.n, mode: st.mode, word: c.word, said: info && info.heard ? info.heard : "" }); if (RW().heartsOn()) { const left = RW().loseHeart(); const h = $("#hearts"); if (h) { h.classList.add("shake"); later(() => h.classList.remove("shake"), 600); } if (left <= 0) later(outOfHearts, 1200); } }
      st.results.push({ word: c.word, ok, review: st.cur.review, stars, type: c.type, probe: c.probe, warm: !!c.warm });
      if (st.source !== "placement" && Store.srsMark && !c.warm) Store.srsMark(c.srsSubject || st.subject, c.srsLevel || st.n, c.word, ok);
      if (ok) { st.combo = (st.combo || 0) + 1; st.missRun = 0; if ([3, 5, 8, 12, 16, 20].includes(st.combo)) cheer(st.combo); } else { st.combo = 0; st.missRun = (st.missRun || 0) + 1; }
      setHead();
    }
    if (ok) { st.cur.done = true; Speech.sfx(first && !st.cur.review ? "star" : "ok"); } else Speech.sfx("no");
    return first;
  }
  // Green or red bottom sheet for graded answers; blue in-card notes for information.
  function showFeedback(kind, title, sub) {
    if (kind === "info") { let f = $("#fb"); if (!f) { f = document.createElement("div"); f.id = "fb"; f.style.width = "100%"; $("#stage").appendChild(f); } f.innerHTML = '<div class="feedback info">' + UI.icon("bulb") + '<div><div class="t">' + U.esc(title) + "</div>" + (sub ? '<div class="s">' + U.esc(sub) + "</div>" : "") + "</div></div>"; return; }
    const bar = $("#actions");
    bar.className = "actionbar sheet " + kind;
    let m = bar.querySelector(".sheet-msg");
    if (!m) { m = document.createElement("div"); m.className = "sheet-msg"; bar.insertBefore(m, bar.firstChild); }
    const ic = kind === "ok" ? UI.icon("check") : kind === "close" ? UI.icon("sparkle") : UI.icon("close");
    const why = kind !== "ok" && window.GKA.Teacher ? '<button class="nova-why" id="novawhy">' + UI.icon("chat") + (st.cur && st.cur.done ? " Why? Ask Nova" : " Get a hint from Nova") + "</button>" : "";
    m.innerHTML = '<div class="ico">' + ic + '</div><div class="grow"><div class="t">' + U.esc(title) + "</div>" + (sub ? '<div class="s">' + U.esc(sub) + "</div>" : "") + why + "</div>";
    const wb = m.querySelector("#novawhy"); if (wb) wb.onclick = () => window.GKA.Teacher.open({ ask: st.cur && st.cur.done ? "why" : "hint" });
    const n = $("#next"); if (n) n.disabled = false;
  }
  function outOfHearts() {
    if (!st || st.ending) return; st.ending = true;
    const m = UI.modal('<div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px"><svg viewBox="0 0 120 120" style="width:110px;height:110px">' + UI.mascot("wink").replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + '</svg><h2>Out of hearts!</h2><p class="muted small">Hearts come back one every 15 minutes. Practicing a level you already passed, or your own words, refills them all right away.</p></div><div class="stack"><button class="btn primary" id="m-end">Finish for now</button><button class="btn" id="m-refill">Refill with 30 gems (' + RW().gems() + ' gems)</button></div>', { sticky: true });
    m.el.querySelector("#m-end").onclick = () => { m.close(); finish(); };
    m.el.querySelector("#m-refill").onclick = () => { if (RW().buy("refill")) { m.close(); st.ending = false; drawHearts(); UI.toast("Hearts refilled", "ok"); } else UI.toast("Not enough gems yet", "warn"); };
  }
  const picHTML = (c, size) => (c.pic ? '<div class="pic' + (size ? " " + size : "") + '" aria-hidden="true">' + c.pic + "</div>" : "");
  const nextBtn = (label) => '<button class="btn main" id="next">' + U.esc(label || "Continue") + "</button>";
  const bindNext = () => { const b = $("#next"); if (b) b.onclick = () => S.next(); };
  const autoNext = (ms) => later(() => S.next(), ms || 1500);
  const reviewTag = () => (st.deck[st.idx] && st.deck[st.idx].warm ? '<span class="review-tag warm">Warm-up · from Level ' + st.deck[st.idx].warmFrom + "</span>" : st.cur.review ? '<span class="review-tag">Review · no new stars</span>' : "");
  const praise = () => U.pick(["Nicely done!", "Excellent!", "You got it!", "Great job!", "Super!", "Brilliant!", "Amazing!"]);
  const encourage = () => U.pick(["Not quite. Try again!", "Almost! One more time.", "Keep going, you can do it!", "Listen once more and try again."]);

  function giantWord(word, letter) {
    const w = String(word);
    if (!letter && (w.length > 8 || /\s/.test(w))) return '<div class="giant">' + U.esc(w) + "</div>";
    return '<div class="letter-row' + (w.length >= 6 ? " many" : "") + '" id="letters">' + w.split("").map((ch, i) => '<button class="letter-btn" data-i="' + i + '" aria-label="Hear the sound of ' + U.esc(ch) + '">' + U.esc(ch) + "</button>").join("") + "</div>";
  }
  function bindLetters() { const host = $("#letters"); if (!host) return; host.querySelectorAll(".letter-btn").forEach((b) => { b.onclick = () => { b.classList.add("hot"); later(() => b.classList.remove("hot"), 500); Speech.speak(b.textContent, { rate: 0.8 }); }; }); }
  const sayWord = (c, slow) => { const text = c.letter && c.hint ? c.word + ". " + c.word + " is for " + c.hint + "." : c.word; return Speech.speak(text, { rate: slow ? 0.55 : settings().rate }); };
  const saySentence = (c) => Speech.speak(c.sentence || ("The word is | " + c.word + "."), { rate: settings().rate });

  const RENDER = {};

  // ---------- I Read ----------
  RENDER.flash = (c) => {
    const secs = speedSeconds();
    stage(picHTML(c) + giantWord(c.word, c.letter) + (c.hint ? '<div class="label">' + U.esc(c.word) + " is for " + U.esc(c.hint) + "</div>" : c.sentence ? '<div class="label">' + U.esc(c.sentence) + "</div>" : "") + (secs > 0 ? '<div class="ring" id="ring"></div>' : ""));
    bindLetters();
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn(secs > 0 ? "Continue" : "I read it"));
    $("#hear").onclick = () => { if (st.ring) { st.ring.stop(); st.ring = null; } sayWord(c); };
    bindNext();
    if (secs > 0) st.ring = UI.ring($("#ring"), secs, () => S.next());
  };
  RENDER.readcheck = (c) => {
    stage(reviewTag() + '<div class="options" id="opts">' + c.options.map((o) => '<button class="option" data-w="' + U.esc(o) + '">' + U.esc(o) + "</button>").join("") + "</div>");
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn()); $("#next").disabled = true; bindNext();
    $("#hear").onclick = () => sayWord(c);
    $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const ok = b.dataset.w.toLowerCase() === c.word.toLowerCase(); const first = answer(ok, { heard: b.dataset.w }); if (ok) { b.classList.add("correct"); $("#opts").querySelectorAll(".option").forEach((x) => { if (x !== b) x.classList.add("dim"); }); showFeedback("ok", praise(), first && !st.cur.review ? "+1 star" : ""); autoNext(); } else { b.classList.add("wrong"); showFeedback("no", "That says " + b.dataset.w, "Tap the word you saw: " + c.word); sayWord(c); } }; });
  };

  // ---------- I Speak ----------
  RENDER.speak = (c) => {
    const micOK = Speech.sttOK;
    stage(reviewTag() + picHTML(c) + giantWord(c.word, c.letter) + (c.hint ? '<div class="label">' + U.esc(c.word) + " is for " + U.esc(c.hint) + "</div>" : '<div class="label">Tap a letter to hear it</div>') + '<div id="fb" style="width:100%"></div>');
    bindLetters();
    below('<div class="mic-row"><button class="btn icon big" id="hear" aria-label="Hear the word">' + UI.icon("ear") + '</button><button class="btn round orange" id="mic" aria-label="Tap and say the word">' + UI.icon("mic") + '</button><button class="btn icon big" id="retry" aria-label="Try again">' + UI.icon("retry") + '</button></div><div class="hint-row"><span>Hear it</span><span>Tap, then say it</span><span>Try again</span></div>' + (micOK ? "" : parentCheckHTML()));
    actions('<button class="btn" id="skip">Skip</button>' + nextBtn()); $("#next").disabled = true; bindNext();
    $("#hear").onclick = () => sayWord(c);
    $("#retry").onclick = () => { Speech.cancelListen(); $("#fb").innerHTML = ""; $("#mic").classList.remove("listening"); };
    $("#skip").onclick = () => { if (st.cur.tries === 0) answer(false, { heard: "(skipped)" }); S.next(); };
    bindParentCheck(c);
    $("#mic").onclick = () => micOK ? listenFor(c, c.word, c.hint) : showFeedback("info", "The mic is not available here", "Use the two buttons below to check it yourself.");
  };
  function parentCheckHTML() { return '<div class="notice">' + UI.icon("mic") + '<div>Speech recognition is not available in this browser or page. Say it out loud, then a grown-up taps one of these.</div></div><div class="row"><button class="btn green grow" id="pc-ok">' + UI.icon("check") + ' Said it right</button><button class="btn grow" id="pc-no">' + UI.icon("retry") + " Not yet</button></div>"; }
  function bindParentCheck(c) {
    const ok = $("#pc-ok"), no = $("#pc-no"); if (!ok) return;
    ok.onclick = () => { if (st.cur.done) return; const first = answer(true, {}); showFeedback("ok", praise(), first && !st.cur.review ? "+1 star" : ""); autoNext(); };
    no.onclick = () => { if (st.cur.done) return; answer(false, { heard: "(parent check)" }); showFeedback("no", encourage(), ""); };
  }
  function listenFor(c, target, hint, onDone) {
    const mic = $("#mic"); if (!mic) return;
    mic.classList.add("listening");
    if ($("#fb")) $("#fb").innerHTML = '<div class="listening-pill"><i></i> Listening…</div>';
    Speech.listen({ timeoutMs: 6000 }).then((res) => {
      mic.classList.remove("listening"); if ($("#fb")) $("#fb").innerHTML = "";
      const m = U.matchSpeech(res.alts, target, settings().matching, hint);
      if (onDone) return onDone(m, res);
      const first = answer(m.ok, { heard: m.heard });
      if (m.ok) { showFeedback(m.how === "close" || m.how === "homophone" ? "close" : "ok", m.how === "close" ? "Close enough! I heard \"" + m.heard + "\"" : praise() + " You said \"" + target + "\"", first && !st.cur.review ? "+1 star" : m.how === "close" ? "That sounds like " + target + ". It counts!" : ""); autoNext(1600); }
      else { showFeedback("no", "I heard \"" + (m.heard || "…") + "\"", "Tap Hear it, then try again."); if (st.cur.tries >= 2) sayWord(c); }
    }).catch((err) => {
      mic.classList.remove("listening"); if ($("#fb")) $("#fb").innerHTML = "";
      const addParentCheck = () => { if (!$("#pc-ok")) { below($("#below").innerHTML + parentCheckHTML()); bindParentCheck(c); } };
      if (err.code === "no-speech") showFeedback("info", "I did not hear anything", "Tap the mic and say it a little louder.");
      else if (err.code === "denied") { showFeedback("info", "The mic is blocked", "Allow the microphone in your browser, or use the check buttons."); addParentCheck(); }
      else if (err.code === "network") { showFeedback("info", "Speech needs the internet", "The browser sends audio to its speech service. Connect, or use the check buttons."); addParentCheck(); }
      else if (err.code !== "aborted") { showFeedback("info", "The mic did not start", "Try again, or use the check buttons."); addParentCheck(); }
    });
  }

  // ---------- I Listen ----------
  RENDER.listen = (c) => {
    const head = '<button class="btn round md green" id="hear" aria-label="Hear the word">' + UI.icon("ear") + '</button><div class="row"><button class="btn soft-green" id="slow">Say it slowly</button><button class="btn soft-blue" id="sent">In a sentence</button></div>' + reviewTag();
    if (c.sub === "pick") {
      stage(head + '<div class="options" id="opts">' + c.options.map((o) => '<button class="option" data-w="' + U.esc(o) + '">' + U.esc(o) + "</button>").join("") + '</div><div id="fb" style="width:100%"></div>');
      actions('<button class="btn" id="again">' + UI.icon("retry") + " Again</button>" + nextBtn()); $("#next").disabled = true; bindNext();
      $("#again").onclick = () => { if (st.cur.done) return; $("#opts").querySelectorAll(".option").forEach((x) => x.classList.remove("wrong", "dim")); sayWord(c); };
      $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const ok = b.dataset.w.toLowerCase() === c.word.toLowerCase(); const first = answer(ok, { heard: b.dataset.w }); if (ok) { b.classList.add("correct"); $("#opts").querySelectorAll(".option").forEach((x) => { if (x !== b) x.classList.add("dim"); }); showFeedback("ok", praise() + " That is " + c.word, first && !st.cur.review ? "+1 star" : ""); autoNext(); } else { b.classList.add("wrong"); showFeedback("no", "That says " + b.dataset.w, "Listen again and try once more."); later(() => sayWord(c), 600); } }; });
    } else {
      stage(head + spellerHTML(c));
      actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>');
      bindSpeller(c);
    }
    $("#hear").onclick = () => sayWord(c); $("#slow").onclick = () => sayWord(c, true); $("#sent").onclick = () => saySentence(c);
    later(() => sayWord(c), 350);
  };
  function spellerHTML(c) {
    const len = c.word.replace(/[^a-z]/gi, "").length;
    if (c.sub === "type" || !c.tiles) return '<input class="typebox" id="typed" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type it here" aria-label="Type the word"><div id="fb" style="width:100%"></div>';
    let slots = ""; for (let i = 0; i < len; i++) slots += '<div class="slot" data-i="' + i + '"></div>';
    return '<div class="slots" id="slots">' + slots + '</div><div class="tiles" id="tiles">' + c.tiles.map((t, i) => '<button class="tile" data-i="' + i + '" data-ch="' + U.esc(t) + '">' + U.esc(t) + "</button>").join("") + '</div><div id="fb" style="width:100%"></div>';
  }
  function bindSpeller(c) {
    const target = c.word.toLowerCase().replace(/[^a-z]/g, "");
    const typed = $("#typed");
    const check = () => {
      if (st.cur.done) return;
      let val; if (typed) val = typed.value; else val = [...$("#slots").querySelectorAll(".slot")].map((s) => s.textContent).join("");
      if (!val.trim()) return;
      const m = U.matchSpelling(val, target);
      const first = answer(m.ok, { heard: val });
      if (m.ok) { if (!typed) $("#slots").querySelectorAll(".slot").forEach((s) => s.classList.add("ok")); actions(nextBtn()); bindNext(); showFeedback("ok", praise(), spellOut(c.word) + " spells " + c.word + (first && !st.cur.review ? " · +1 star" : "")); autoNext(1700); }
      else { if (!typed) $("#slots").querySelectorAll(".slot").forEach((s, i) => s.classList.add(s.textContent === target[i] ? "ok" : "bad")); actions('<button class="btn" id="clear">Clear</button>' + nextBtn("Skip")); bindNext(); bindClear(); showFeedback(m.close ? "close" : "no", m.close ? "So close! One letter is different" : "Correct spelling:", c.word); sayWord(c); }
    };
    const bindClear = () => { const cl = $("#clear"); if (cl) cl.onclick = () => { if (typed) { typed.value = ""; typed.focus(); } else { $("#slots").querySelectorAll(".slot").forEach((s) => { s.textContent = ""; s.className = "slot"; }); $("#tiles").querySelectorAll(".tile").forEach((t) => t.classList.remove("used")); } const bar = $("#actions"); bar.className = "actionbar"; const msg = bar.querySelector(".sheet-msg"); if (msg) msg.remove(); }; };
    bindClear();
    const ck = $("#check"); if (ck) ck.onclick = check;
    if (typed) { typed.focus(); typed.onkeydown = (e) => { if (e.key === "Enter") check(); }; }
    else {
      $("#tiles").querySelectorAll(".tile").forEach((t) => { t.onclick = () => { const empty = [...$("#slots").querySelectorAll(".slot")].find((s) => !s.textContent); if (!empty) return; Speech.sfx("tap"); empty.textContent = t.dataset.ch; empty.classList.add("filled"); empty.dataset.tile = t.dataset.i; t.classList.add("used"); if (![...$("#slots").querySelectorAll(".slot")].some((s) => !s.textContent)) later(check, 250); }; });
      $("#slots").querySelectorAll(".slot").forEach((s) => { s.onclick = () => { if (!s.textContent || st.cur.done) return; const t = $("#tiles").querySelector('.tile[data-i="' + s.dataset.tile + '"]'); if (t) t.classList.remove("used"); s.textContent = ""; s.className = "slot"; }; });
    }
  }
  const spellOut = (w) => w.toLowerCase().split("").join("-");

  // ---------- I Write ----------
  RENDER.write = (c) => {
    const look = Math.max(2, Math.min(5, speedSeconds() * 2 || 3));
    stage('<div class="label">It will hide soon!</div>' + giantWord(c.word, c.letter) + (c.sentence ? '<div class="label">' + U.esc(c.sentence) + "</div>" : "") + '<div class="ring" id="ring"></div>');
    bindLetters();
    actions('<button class="btn" id="hear">' + UI.icon("ear") + ' Hear it</button><button class="btn main" id="cover">Cover it</button>');
    $("#hear").onclick = () => sayWord(c);
    const toWrite = () => { if (st.ring) { st.ring.stop(); st.ring = null; } heading("Now write it"); stage('<button class="btn round md green" id="hear2" aria-label="Hear the word">' + UI.icon("ear") + "</button>" + reviewTag() + spellerHTML(c)); actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>'); $("#hear2").onclick = () => sayWord(c); bindSpeller(c); };
    $("#cover").onclick = toWrite;
    sayWord(c);
    st.ring = UI.ring($("#ring"), look, toWrite);
  };

  // ---------- Story ----------
  function storyWords(text) { const out = []; let pos = 0; text.split("\n\n").forEach((p, pi) => { if (pi > 0) { out.push({ para: true }); pos += 2; } for (const tok of p.split(" ")) { if (tok) out.push({ t: tok, start: pos, clean: tok.replace(/[^A-Za-z0-9']/g, "") }); pos += tok.length + 1; } }); return out; }
  function storyHTML(story, cur) { const ws = storyWords(story.text); return '<div class="story-text" id="story">' + ws.map((w, i) => w.para ? '<span class="para"></span>' : '<button class="sw' + (cur === i ? " cur" : cur != null && i < cur ? " done" : "") + '" data-i="' + i + '" data-start="' + w.start + '">' + U.esc(w.t) + "</button>").join("") + "</div>"; }
  RENDER["story-listen"] = (c) => {
    const story = c.story;
    stage('<h2 style="text-align:center">' + U.esc(story.title) + "</h2>" + storyHTML(story, null));
    actions('<button class="btn blue" id="play">' + UI.icon("play") + " Play</button>" + nextBtn("Read it myself")); bindNext();
    let playing = false;
    $("#play").onclick = () => {
      if (playing) { Speech.stop(); playing = false; $("#play").innerHTML = UI.icon("play") + " Play"; return; }
      playing = true; $("#play").innerHTML = UI.icon("pause") + " Stop";
      const btns = [...$("#story").querySelectorAll(".sw")]; let last = null;
      Speech.speak(story.text.replace(/\n\n/g, " "), { rate: settings().rate, onBoundary: (ci) => { let b = null; for (const x of btns) { if (+x.dataset.start <= ci) b = x; else break; } if (b && b !== last) { if (last) { last.classList.remove("hl"); last.classList.add("done"); } b.classList.add("hl"); last = b; } } }).then(() => { playing = false; btns.forEach((x) => { x.classList.remove("hl"); x.classList.add("done"); }); if (st && $("#play")) $("#play").innerHTML = UI.icon("play") + " Again"; });
    };
    $("#story").querySelectorAll(".sw").forEach((b) => { b.onclick = () => Speech.speak(b.textContent.replace(/[^A-Za-z0-9']/g, ""), { rate: settings().rate }); });
    later(() => { if ($("#play")) $("#play").click(); }, 400);
  };
  RENDER["story-words"] = (c) => {
    const story = c.story;
    const ws = storyWords(story.text).map((w, i) => Object.assign(w, { i })).filter((w) => !w.para);
    let pos = 0, auto = null;
    const secs = speedSeconds();
    const draw = () => { const cur = ws[pos]; $("#story").querySelectorAll(".sw").forEach((b) => { const i = +b.dataset.i; b.className = "sw" + (i === cur.i ? " cur" : i < cur.i ? " done" : ""); }); $("#curword").textContent = cur.clean || cur.t; $("#spos").textContent = (pos + 1) + " / " + ws.length; $("#sbar").style.width = Math.round(((pos + 1) / ws.length) * 100) + "%"; };
    stage(storyHTML(story, ws[0].i) + '<div class="row" style="width:100%"><div class="bar thin blue grow"><i id="sbar"></i></div><span class="small muted num" id="spos"></span></div><div class="label">Now say</div><div class="giant tone-blue sm" id="curword"></div><div id="fb" style="width:100%"></div>');
    below('<div class="mic-row"><button class="btn icon big" id="prev" aria-label="Previous word">' + UI.icon("back") + '</button><button class="btn round md green" id="auto" aria-label="Play at my speed">' + UI.icon("play") + '</button><button class="btn round md orange" id="mic" aria-label="Say the word">' + UI.icon("mic") + '</button><button class="btn icon big" id="nextw" aria-label="Next word">' + UI.icon("next") + '</button></div><div class="hint-row"><span>Back</span><span>Auto</span><span>Say it</span><span>Next</span></div>');
    actions('<button class="btn" id="again">Start over</button>' + nextBtn("Questions")); bindNext();
    const stopAuto = () => { if (auto) { clearInterval(auto); auto = null; $("#auto").innerHTML = UI.icon("play"); } };
    const step = (d) => { pos = U.clamp(pos + d, 0, ws.length - 1); draw(); Speech.speak(ws[pos].clean, { rate: settings().rate }); if (pos === ws.length - 1) stopAuto(); };
    $("#prev").onclick = () => { stopAuto(); step(-1); }; $("#nextw").onclick = () => { stopAuto(); step(1); }; $("#again").onclick = () => { stopAuto(); pos = 0; draw(); };
    $("#auto").onclick = () => { if (auto) return stopAuto(); $("#auto").innerHTML = UI.icon("pause"); Speech.speak(ws[pos].clean); auto = setInterval(() => step(1), Math.max(400, (secs || 1) * 1000)); timers.push(auto); };
    $("#story").querySelectorAll(".sw").forEach((b) => { b.onclick = () => { stopAuto(); const k = ws.findIndex((w) => w.i === +b.dataset.i); if (k >= 0) { pos = k; draw(); Speech.speak(ws[pos].clean); } }; });
    $("#mic").onclick = () => { stopAuto(); if (!Speech.sttOK) return showFeedback("info", "The mic is not available here", "Read the word out loud and tap Next."); listenFor(c, ws[pos].clean, "", (m) => { if (m.ok) { showFeedback("info", praise() + " You said " + ws[pos].clean, ""); Speech.sfx("ok"); later(() => { if ($("#fb")) $("#fb").innerHTML = ""; step(1); }, 900); } else { showFeedback("info", "I heard \"" + (m.heard || "…") + "\"", "Try again, or tap Next."); Speech.sfx("no"); } }); };
    draw();
  };

  // ---------- Questions ----------
  RENDER.question = (c) => {
    stage('<div class="question-card card dark"><div class="caps muted">Question' + (st.cur.review ? " · Review" : "") + '</div><div class="q">' + U.esc(c.q) + '</div><div class="row" style="margin-top:10px"><button class="btn navy plain" id="hearq" style="min-height:42px;font-size:13px">' + UI.icon("ear") + ' Hear it</button><button class="btn orange plain" id="mic" style="min-height:42px;font-size:13px">' + UI.icon("mic") + ' Answer by voice</button></div></div><div class="options one" id="opts">' + c.options.map((o) => '<button class="option text" data-w="' + U.esc(o) + '">' + U.esc(o) + "</button>").join("") + '</div><div id="fb" style="width:100%"></div>');
    actions(nextBtn()); $("#next").disabled = true; bindNext();
    const choose = (val) => { if (st.cur.done) return; const ok = val === c.answer; const first = answer(ok, { heard: val }); $("#opts").querySelectorAll(".option").forEach((x) => { if (x.dataset.w === val) x.classList.add(ok ? "correct" : "wrong"); if (ok && x.dataset.w !== val) x.classList.add("dim"); }); if (ok) { showFeedback("ok", praise(), first && !st.cur.review ? "+1 star" : ""); autoNext(1500); } else showFeedback("no", encourage(), "Think about what you read and try again."); };
    $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => choose(b.dataset.w); });
    $("#hearq").onclick = () => Speech.speak(c.q + " | " + c.options.map((o, i) => (i === 0 ? "Is it | " : "or | ") + o + "?").join(" | "), { rate: settings().rate });
    $("#mic").onclick = () => { if (!Speech.sttOK) return showFeedback("info", "The mic is not available here", "Tap your answer instead."); listenFor(c, c.answer, "", (m, res) => { let bestOpt = null; for (const o of c.options) { const mm = U.matchSpeech(res.alts, o, "forgiving"); if (mm.ok) { bestOpt = o; break; } } if (bestOpt) choose(bestOpt); else showFeedback("info", "I heard \"" + (res.transcript || "…") + "\"", "Say one of the answers, or tap it."); }); };
    later(() => $("#hearq") && $("#hearq").click(), 300);
  };
  RENDER.truefalse = (c) => {
    stage('<div class="question-card card dark"><div class="caps muted">True or false?' + (st.cur.review ? " · Review" : "") + '</div><div class="q">' + U.esc(c.q) + '</div><div class="row" style="margin-top:10px"><button class="btn navy plain" id="hearq" style="min-height:42px;font-size:13px">' + UI.icon("ear") + ' Hear it</button></div></div><div class="options" id="opts"><button class="option" data-v="true">True</button><button class="option" data-v="false">False</button></div><div id="fb" style="width:100%"></div>');
    actions(nextBtn()); $("#next").disabled = true; bindNext();
    $("#hearq").onclick = () => Speech.speak("True or false? " + c.q, { rate: settings().rate });
    $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const ok = (b.dataset.v === "true") === c.answer; const first = answer(ok, { heard: b.dataset.v }); b.classList.add(ok ? "correct" : "wrong"); if (ok) { showFeedback("ok", praise(), first && !st.cur.review ? "+1 star" : ""); autoNext(1400); } else showFeedback("no", "Not quite.", "It is " + (c.answer ? "true" : "false") + "."); }; });
    later(() => $("#hearq") && $("#hearq").click(), 300);
  };
  RENDER.order = (c) => {
    let picked = [];
    stage('<div class="question-card card dark"><div class="caps muted">Put in order' + (st.cur.review ? " · Review" : "") + '</div><div class="q">' + U.esc(c.q) + '</div><div class="small muted" style="margin-top:6px">Tap the steps in order. Tap again to undo.</div></div><div class="order-list" id="list">' + c.shuffled.map((it, i) => '<button class="order-item" data-i="' + i + '"><span class="num"></span><span class="grow">' + U.esc(it) + "</span></button>").join("") + '</div><div id="fb" style="width:100%"></div>');
    actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>');
    const draw = () => { $("#list").querySelectorAll(".order-item").forEach((b) => { const k = picked.indexOf(+b.dataset.i); b.classList.toggle("on", k >= 0); b.querySelector(".num").textContent = k >= 0 ? k + 1 : ""; }); };
    $("#list").querySelectorAll(".order-item").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const i = +b.dataset.i; const k = picked.indexOf(i); if (k >= 0) picked.splice(k, 1); else picked.push(i); Speech.sfx("tap"); draw(); if (picked.length === c.shuffled.length) later(check, 300); }; });
    const check = () => { if (st.cur.done) return; if (picked.length !== c.shuffled.length) return showFeedback("info", "Tap every step first", ""); const order = picked.map((i) => c.shuffled[i]); const ok = order.every((x, i) => x === c.items[i]); const first = answer(ok, { heard: order.join(" > ") }); $("#list").querySelectorAll(".order-item").forEach((b) => { const k = picked.indexOf(+b.dataset.i); b.classList.add(c.shuffled[+b.dataset.i] === c.items[k] ? "ok" : "bad"); }); if (ok) { actions(nextBtn()); bindNext(); showFeedback("ok", praise(), first && !st.cur.review ? "+1 star" : ""); autoNext(1600); } else { actions('<button class="btn" id="clear">Clear</button>' + nextBtn("Skip")); bindNext(); bindClear(); showFeedback("no", "Not yet. Green steps are right.", "First comes: " + c.items[0]); } };
    const bindClear = () => { const cl = $("#clear"); if (cl) cl.onclick = () => { if (st.cur.done) return; picked = []; $("#list").querySelectorAll(".order-item").forEach((b) => b.classList.remove("ok", "bad")); draw(); resetBar(); actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>'); bindClear(); $("#check").onclick = check; }; };
    bindClear(); $("#check").onclick = check;
  };
  RENDER.lesson = (c) => {
    const sentences = c.lesson.match(/[^.!?]+[.!?]+/g) || [c.lesson];
    stage('<h2 style="text-align:center">' + U.esc(c.name) + '</h2><div class="lesson-text" id="lesson">' + sentences.map((s, i) => '<span data-i="' + i + '">' + U.esc(s) + " </span>").join("") + '</div><div class="chips">' + c.words.map((w) => '<span class="chip orange word">' + U.esc(w) + "</span>").join("") + "</div>");
    actions('<button class="btn blue" id="play">' + UI.icon("play") + " Read to me</button>" + nextBtn("Questions")); bindNext();
    let playing = false;
    $("#play").onclick = async () => { if (playing) { playing = false; Speech.stop(); $("#play").innerHTML = UI.icon("play") + " Read to me"; return; } playing = true; $("#play").innerHTML = UI.icon("pause") + " Stop"; for (let i = 0; i < sentences.length && playing; i++) { const host = st && $("#lesson"); if (!host) { playing = false; break; } host.querySelectorAll("span").forEach((s) => s.classList.toggle("hl", +s.dataset.i === i)); await Speech.speak(sentences[i], { rate: settings().rate }); } const host = st && $("#lesson"); if (host) host.querySelectorAll("span").forEach((s) => s.classList.remove("hl")); playing = false; if (st && $("#play")) $("#play").innerHTML = UI.icon("play") + " Again"; };
    $("#lesson").querySelectorAll("span").forEach((s) => { s.style.cursor = "pointer"; s.onclick = () => Speech.speak(s.textContent, { rate: settings().rate }); });
    later(() => $("#play") && $("#play").click(), 400);
  };

  // ---------- Math ----------
  function visualHTML(v) {
    if (!v) return "";
    const dot = (cls) => '<span class="dot ' + cls + '"></span>';
    const grid = (n, h) => '<div class="visual"><div class="dots-v" style="grid-template-columns:repeat(' + n + ',24px)">' + h + "</div></div>";
    if (v.type === "dots") { let h = ""; for (let i = 0; i < v.n; i++) h += dot("c" + (Math.floor(i / (v.group || 5)) % 5)); return grid(Math.min(v.n, v.group || 5), h); }
    if (v.type === "twogroups") { let h = ""; for (let i = 0; i < v.a; i++) h += dot("c0"); for (let i = 0; i < v.b; i++) h += dot("c1"); return v.a + v.b ? grid(Math.min(10, Math.max(1, v.a + v.b)), h) : ""; }
    if (v.type === "takeaway") { let h = ""; for (let i = 0; i < v.a; i++) h += dot(i >= v.a - v.b ? "x" : "c0"); return grid(Math.min(10, Math.max(1, v.a)), h); }
    if (v.type === "array") { let h = ""; for (let i = 0; i < v.rows * v.cols; i++) h += dot("c" + (Math.floor(i / v.cols) % 5)); return '<div class="visual"><div class="dots-v" style="grid-template-columns:repeat(' + v.cols + ',' + (v.cols > 8 ? 18 : 24) + 'px);gap:' + (v.cols > 8 ? 5 : 8) + 'px">' + h + "</div></div>"; }
    if (v.type === "blocks") { const t = Math.floor(v.n / 10), o = v.n % 10; let h = ""; for (let i = 0; i < t; i++) h += '<span class="rod"></span>'; h += '<span class="cubes">'; for (let i = 0; i < o; i++) h += '<span class="cube"></span>'; h += "</span>"; return '<div class="visual"><div class="blocks">' + h + "</div></div>"; }
    if (v.type === "fraction") { let h = ""; for (let i = 0; i < v.den; i++) h += '<i class="' + (i < v.num ? "on" : "") + '"></i>'; return '<div class="visual"><div class="fraction-box" style="grid-template-columns:repeat(' + (v.den > 4 ? v.den / 2 : v.den) + ',1fr)">' + h + "</div></div>"; }
    if (v.type === "coins") { const names = { 25: ["q", "25¢"], 10: ["d", "10¢"], 5: ["n", "5¢"], 1: ["p", "1¢"] }; return '<div class="visual"><div class="coins">' + v.coins.map((c) => '<span class="coin ' + names[c][0] + '">' + names[c][1] + "</span>").join("") + "</div></div>"; }
    if (v.type === "clock") { const ha = ((v.h % 12) + v.m / 60) * 30, ma = v.m * 6; let ticks = ""; for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; const x = 100 + Math.sin(a) * 78, y = 100 - Math.cos(a) * 78; ticks += '<text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" font-size="16" font-weight="800" fill="currentColor" font-family="Nunito, sans-serif">' + (i === 0 ? 12 : i) + "</text>"; } return '<div class="visual"><svg class="clock" viewBox="0 0 200 200" role="img" aria-label="Clock"><circle cx="100" cy="100" r="94" fill="var(--surface-2)" stroke="var(--line)" stroke-width="6"/>' + ticks + '<line x1="100" y1="100" x2="' + (100 + Math.sin(ha * Math.PI / 180) * 48) + '" y2="' + (100 - Math.cos(ha * Math.PI / 180) * 48) + '" stroke="var(--fg)" stroke-width="8" stroke-linecap="round"/><line x1="100" y1="100" x2="' + (100 + Math.sin(ma * Math.PI / 180) * 70) + '" y2="' + (100 - Math.cos(ma * Math.PI / 180) * 70) + '" stroke="var(--blue)" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="var(--fg)"/></svg></div>'; }
    if (v.type === "grid") { const q = v.quadrants; const min = q ? -6 : 0, max = q ? 6 : 8; const n = max - min; const px = (x) => 20 + ((x - min) / n) * 180, py = (y) => 200 - ((y - min) / n) * 180; let lines = ""; for (let i = min; i <= max; i++) lines += '<line x1="' + px(i) + '" y1="20" x2="' + px(i) + '" y2="200" stroke="var(--line)" stroke-width="1"/><line x1="20" y1="' + py(i) + '" x2="200" y2="' + py(i) + '" stroke="var(--line)" stroke-width="1"/>'; return '<div class="visual"><svg class="gridv" viewBox="0 0 220 220" role="img" aria-label="Coordinate grid">' + lines + '<line x1="' + px(0) + '" y1="20" x2="' + px(0) + '" y2="200" stroke="var(--fg)" stroke-width="2"/><line x1="20" y1="' + py(0) + '" x2="200" y2="' + py(0) + '" stroke="var(--fg)" stroke-width="2"/><text x="' + (px(max) - 4) + '" y="' + (py(0) + 14) + '" font-size="11" fill="var(--muted)" font-family="Nunito">' + max + '</text><text x="' + (px(0) + 4) + '" y="' + (py(max) + 10) + '" font-size="11" fill="var(--muted)" font-family="Nunito">' + max + '</text><circle cx="' + px(v.x) + '" cy="' + py(v.y) + '" r="7" fill="var(--red)" stroke="#fff" stroke-width="2"/></svg></div>'; }
    if (v.type === "shape") { const n = v.sides; const pts = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2; pts.push((70 + Math.cos(a) * 55).toFixed(1) + "," + (70 + Math.sin(a) * 55).toFixed(1)); } return '<div class="visual"><svg class="shapev" viewBox="0 0 140 140" role="img" aria-label="A shape with ' + n + ' sides"><polygon points="' + pts.join(" ") + '" fill="var(--blue-lt)" stroke="var(--blue)" stroke-width="5" stroke-linejoin="round"/></svg></div>'; }
    return "";
  }
  function keypadHTML(answer) {
    const extras = ["/", ":", ".", "-", ",", "R"].filter((ch) => String(answer).includes(ch));
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].concat(extras).concat(["del", "0", "ok"]);
    return '<div class="keypad" id="pad">' + keys.map((k) => k === "del" ? '<button class="key del" data-k="del" aria-label="Delete">' + UI.icon("back") + "</button>" : k === "ok" ? '<button class="key ok" data-k="ok" aria-label="Check">' + UI.icon("check") + "</button>" : '<button class="key" data-k="' + k + '">' + k + "</button>").join("") + "</div>";
  }
  function fmtAnswer(a) { if (/^\d+\/\d+$/.test(a)) { const [n, d] = a.split("/"); return '<span class="frac"><b>' + n + "</b><span>" + d + "</span></span>"; } return U.esc(a); }
  const sameAnswer = (val, ans) => { const a = String(val).toLowerCase().replace(/\s+/g, "").replace(/^\+/, ""), b = String(ans).toLowerCase().replace(/\s+/g, ""); if (a === b) return true; if (/^-?\d*\.?\d+$/.test(a) && /^-?\d*\.?\d+$/.test(b)) return Math.abs(parseFloat(a) - parseFloat(b)) < 1e-9; return false; };
  RENDER.math = (c) => {
    const p = c.problem; let sub = c.sub;
    if (p.kind === "choice" && sub !== "listen") sub = "pick";
    const eq = /=\s*\?$/.test(p.q);
    const shown = sub === "listen" ? '<button class="btn round md green" id="hear" aria-label="Hear the problem">' + UI.icon("ear") + "</button>" :
      (eq ? '<div class="answer-line">' + p.q.replace(/=\s*\?$/, "").split(/\s+/).map((t) => /^[+×÷−-]$/.test(t) ? '<span class="op">' + t + "</span>" : "<span>" + U.esc(t) + "</span>").join("") + '<span class="eq">=</span><span class="ans" id="ans">?</span></div>' : '<div class="problem-text">' + U.esc(p.q) + "</div>" + (sub !== "pick" && sub !== "say" ? '<div class="answer-line"><span class="ans" id="ans">?</span></div>' : ""));
    let body = "";
    if (sub === "pick" && p.options) body = '<div class="options" id="opts">' + p.options.map((o) => '<button class="option" data-w="' + U.esc(o) + '">' + fmtAnswer(o) + "</button>").join("") + "</div>";
    else if (sub === "say") body = '<div class="mic-row"><button class="btn icon big" id="hear" aria-label="Hear the problem">' + UI.icon("ear") + '</button><button class="btn round orange" id="mic" aria-label="Say the answer">' + UI.icon("mic") + '</button><button class="btn icon big" id="hintb" aria-label="Hint">' + UI.icon("bulb") + '</button></div><div class="hint-row"><span>Hear it</span><span>Say the answer</span><span>Hint</span></div>' + (Speech.sttOK ? "" : parentCheckHTML());
    else if (sub === "listen" && p.kind === "choice" && p.options) body = '<div class="options" id="opts">' + p.options.map((o) => '<button class="option" data-w="' + U.esc(o) + '">' + fmtAnswer(o) + "</button>").join("") + "</div>";
    else body = (sub === "listen" ? '<div class="answer-line"><span class="ans" id="ans">?</span></div>' : "") + keypadHTML(p.answer);
    stage(shown + (sub === "listen" ? "" : visualHTML(p.visual)) + reviewTag() + body + '<div id="fb" style="width:100%"></div>');
    actions('<button class="btn" id="hintbtn">' + UI.icon("bulb") + " Hint</button>" + (sub === "listen" || c.sub === "words" ? '<button class="btn" id="hearbtn">' + UI.icon("ear") + " Hear</button>" : "") + nextBtn()); $("#next").disabled = true; bindNext();
    const sayProblem = () => Speech.speak(p.say, { rate: settings().rate });
    const showHint = () => showFeedback("info", "Hint", p.hint || "Take your time.");
    $("#hintbtn").onclick = showHint; if ($("#hearbtn")) $("#hearbtn").onclick = sayProblem; if ($("#hear")) $("#hear").onclick = sayProblem; if ($("#hintb")) $("#hintb").onclick = showHint;
    if (sub === "listen" || c.sub === "words") later(sayProblem, 300);
    const grade = (val) => { if (st.cur.done) return; const ok = sameAnswer(val, p.answer); const first = answer(ok, { heard: val }); if (ok) { if ($("#ans")) { $("#ans").textContent = p.answer; $("#ans").classList.add("has"); } showFeedback("ok", praise(), (eq ? p.q.replace(/\s*=\s*\?$/, "") + " = " + p.answer : "Answer: " + p.answer) + (first && !st.cur.review ? " · +1 star" : "")); autoNext(1500); } else { if (st.cur.tries >= 2) showFeedback("no", "Correct answer: " + p.answer, "Type it to move on, or tap Continue."); else showFeedback("no", encourage(), p.hint || ""); } };
    if ($("#opts")) $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const ok = sameAnswer(b.dataset.w, p.answer); b.classList.add(ok ? "correct" : "wrong"); if (ok) $("#opts").querySelectorAll(".option").forEach((x) => { if (x !== b) x.classList.add("dim"); }); grade(b.dataset.w); }; });
    else if (sub === "say") { bindParentCheck(c); $("#mic").onclick = () => { if (!Speech.sttOK) return showFeedback("info", "The mic is not available here", "Use the check buttons below."); const target = String(p.answer).startsWith("-") ? "negative " + String(p.answer).slice(1) : String(p.answer); listenFor(c, target, "", (m, res) => { let ok = m.ok; if (!ok && String(p.answer).startsWith("-")) ok = res.alts.some((a) => /minus|negative/.test(U.norm(a)) && U.matchSpeech([a.replace(/minus|negative/gi, "")], String(p.answer).slice(1), "normal").ok); const first = answer(ok, { heard: m.heard }); if (ok) { showFeedback("ok", praise(), "The answer is " + p.answer + (first && !st.cur.review ? " · +1 star" : "")); autoNext(1500); } else showFeedback("no", "I heard \"" + (m.heard || "…") + "\"", "Try again, or tap Hint."); }); }; }
    else {
      let val = "";
      const draw = () => { const a = $("#ans"); if (a) { a.textContent = val || "?"; a.classList.toggle("has", !!val); } };
      $("#pad").querySelectorAll(".key").forEach((k) => { k.onclick = () => { if (st.cur.done) return; const key = k.dataset.k; Speech.sfx("tap"); if (key === "del") val = val.slice(0, -1); else if (key === "ok") { if (val) grade(val); return; } else if (val.length < 9) val += key; draw(); }; });
      const handler = (e) => { if (!st || st.cur.done) return; if (/^[0-9\/:.,R-]$/i.test(e.key) && val.length < 9) { val += e.key.toUpperCase(); draw(); } else if (e.key === "Backspace") { val = val.slice(0, -1); draw(); } else if (e.key === "Enter" && val) grade(val); };
      document.addEventListener("keydown", handler);
      st.cleanup = () => document.removeEventListener("keydown", handler);
    }
  };

  // ---------- Picture match ----------
  RENDER.picmatch = (c) => {
    const asPics = !!c.listen;
    stage(reviewTag() + (asPics ? "" : picHTML(c, "big")) + '<div class="options" id="opts">' + c.options.map((o) => '<button class="option' + (asPics ? " picopt" : "") + '" data-w="' + U.esc(o) + '">' + (asPics ? '<span class="pic">' + (E.pictureFor(o) || "?") + "</span>" : U.esc(o)) + "</button>").join("") + "</div>");
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn()); $("#next").disabled = true; bindNext();
    $("#hear").onclick = () => Speech.speak(c.word, { rate: settings().rate });
    if (asPics) later(() => Speech.speak(c.word, { rate: settings().rate }), 350);
    $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const ok = b.dataset.w.toLowerCase() === c.word.toLowerCase(); const first = answer(ok, { heard: b.dataset.w }); if (ok) { b.classList.add("correct"); $("#opts").querySelectorAll(".option").forEach((x) => { if (x !== b) x.classList.add("dim"); }); showFeedback("ok", praise() + " It is " + c.word, first && !st.cur.review ? "+1 star" : ""); Speech.speak(c.word, { rate: settings().rate }); autoNext(1500); } else { b.classList.add("wrong"); showFeedback("no", "That is " + b.dataset.w, "Try again. The picture shows " + (asPics ? "the word you heard" : c.word.length + " letters") + "."); } }; });
  };

  // ---------- Fill in the blank ----------
  RENDER.blank = (c) => {
    const re = new RegExp("\\b" + c.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
    const shown = U.esc(c.sentence).replace(re, '<span class="blank-slot" id="slot">____</span>');
    stage(reviewTag() + '<div class="sentence-line" id="sent">' + shown + '</div><div class="options" id="opts">' + c.options.map((o) => '<button class="option" data-w="' + U.esc(o) + '">' + U.esc(o) + "</button>").join("") + "</div>");
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn()); $("#next").disabled = true; bindNext();
    $("#hear").onclick = () => Speech.speak(c.sentence.replace(re, "blank"), { rate: settings().rate });
    $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const ok = b.dataset.w.toLowerCase() === c.word.toLowerCase(); const first = answer(ok, { heard: b.dataset.w }); const slot = $("#slot"); if (slot) { slot.textContent = b.dataset.w; slot.className = "blank-slot " + (ok ? "ok" : "bad"); } if (ok) { b.classList.add("correct"); $("#opts").querySelectorAll(".option").forEach((x) => { if (x !== b) x.classList.add("dim"); }); showFeedback("ok", praise(), c.sentence + (first && !st.cur.review ? " · +1 star" : "")); Speech.speak(c.sentence, { rate: settings().rate }); autoNext(1800); } else { b.classList.add("wrong"); showFeedback("no", "Not that one", "Read the sentence again. Which word fits?"); } }; });
  };

  // ---------- Match the pairs ----------
  RENDER.match = (c) => {
    const left = U.shuffle(c.pairs.map((p, i) => ({ i, t: p.w }))); const right = U.shuffle(c.pairs.map((p, i) => ({ i, t: p.s.replace(new RegExp("\\b" + p.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"), "____") })));
    stage(reviewTag() + '<div class="match-grid"><div class="match-col" id="ml">' + left.map((x) => '<button class="match-item word" data-i="' + x.i + '">' + U.esc(x.t) + "</button>").join("") + '</div><div class="match-col" id="mr">' + right.map((x) => '<button class="match-item" data-i="' + x.i + '">' + U.esc(x.t) + "</button>").join("") + "</div></div>");
    actions(nextBtn()); $("#next").disabled = true; bindNext();
    let sel = null, matched = 0, mistakes = 0;
    const pick = (btn, side) => {
      if (btn.classList.contains("done")) return;
      Speech.sfx("tap");
      if (side === "l") Speech.speak(btn.textContent, { rate: settings().rate });
      if (sel && sel.side === side) { sel.btn.classList.remove("sel"); sel = { btn, side }; btn.classList.add("sel"); return; }
      if (!sel) { sel = { btn, side }; btn.classList.add("sel"); return; }
      const a = sel.btn, b = btn;
      if (a.dataset.i === b.dataset.i) { a.classList.remove("sel"); a.classList.add("done"); b.classList.add("done"); matched++; Speech.sfx("ok"); if (matched === c.pairs.length) { const first = answer(mistakes === 0, { heard: mistakes + " mistakes" }); showFeedback(mistakes === 0 ? "ok" : "close", mistakes === 0 ? praise() + " All pairs matched" : "All matched, with " + mistakes + " slip" + (mistakes > 1 ? "s" : ""), mistakes === 0 && first && !st.cur.review ? "+1 star" : "Next time try to match with no slips."); autoNext(1700); } }
      else { mistakes++; a.classList.add("bad"); b.classList.add("bad"); Speech.sfx("no"); later(() => { a.classList.remove("bad", "sel"); b.classList.remove("bad"); }, 500); }
      sel = null;
    };
    $("#ml").querySelectorAll(".match-item").forEach((b) => { b.onclick = () => pick(b, "l"); });
    $("#mr").querySelectorAll(".match-item").forEach((b) => { b.onclick = () => pick(b, "r"); });
  };

  // ---------- Unscramble ----------
  RENDER.unscramble = (c) => {
    const cc = Object.assign({}, c, { sub: "tiles" });
    const re = c.sentence ? new RegExp("\\b" + c.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i") : null;
    stage(reviewTag() + picHTML(c) + (c.sentence ? '<div class="label">' + U.esc(c.sentence.replace(re, "____")) + "</div>" : "") + '<button class="btn soft-green" id="hear">' + UI.icon("ear") + " Hear the word</button>" + spellerHTML(cc));
    actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>');
    $("#hear").onclick = () => sayWord(c);
    bindSpeller(cc);
  };

  // ---------- Dictation ----------
  RENDER.dictation = (c) => {
    stage(reviewTag() + '<button class="btn round md green" id="hear" aria-label="Hear the sentence">' + UI.icon("ear") + '</button><div class="row"><button class="btn soft-green" id="slow">Slower</button></div><input class="typebox sentence" id="typed" type="text" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="Type what you hear" aria-label="Type the sentence"><div id="fb" style="width:100%"></div>');
    actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>');
    const say = (slow) => Speech.speak(c.sentence, { rate: slow ? 0.6 : settings().rate });
    $("#hear").onclick = () => say(false); $("#slow").onclick = () => say(true);
    const typed = $("#typed"); typed.focus();
    const norm = (s) => U.norm(s).replace(/[^a-z0-9 ]/g, "");
    const check = () => { if (st.cur.done) return; const v = typed.value; if (!v.trim()) return; const a = norm(v), b = norm(c.sentence); const ratio = 1 - U.lev(a, b) / Math.max(1, b.length); const ok = ratio >= 0.85; const first = answer(ok, { heard: v }); if (ok) { actions(nextBtn()); bindNext(); showFeedback(ratio >= 0.98 ? "ok" : "close", ratio >= 0.98 ? praise() : "Close enough!", c.sentence + (first && !st.cur.review ? " · +1 star" : "")); autoNext(1900); } else { actions('<button class="btn" id="clear">Clear</button>' + nextBtn("Skip")); bindNext(); bindClear(); showFeedback("no", "Correct sentence:", c.sentence); } };
    const bindClear = () => { const cl = $("#clear"); if (cl) cl.onclick = () => { typed.value = ""; typed.focus(); resetBar(); actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>'); bindClear(); $("#check").onclick = check; }; };
    bindClear(); $("#check").onclick = check; typed.onkeydown = (e) => { if (e.key === "Enter") check(); };
    later(() => say(false), 350);
  };

  // ---------- Build the sentence ----------
  RENDER.sentence = (c) => {
    const target = c.sentence.replace(/\s+/g, " ").trim().split(" ");
    let placed = [];
    stage(reviewTag() + '<div class="label">Tap the words in order</div><div class="sent-slots" id="sslots"></div><div class="word-tiles" id="wtiles">' + c.tiles.map((t, i) => '<button class="wtile" data-i="' + i + '">' + U.esc(t) + "</button>").join("") + '</div><div id="fb" style="width:100%"></div>');
    actions('<button class="btn" id="hear">' + UI.icon("ear") + ' Hear it</button><button class="btn main" id="check">Check</button>');
    $("#hear").onclick = () => Speech.speak(c.sentence, { rate: settings().rate });
    const draw = () => { $("#sslots").innerHTML = placed.length ? placed.map((i, k) => '<button class="wtile placed" data-k="' + k + '">' + U.esc(c.tiles[i]) + "</button>").join("") : '<span class="sent-empty">Your sentence goes here</span>'; $("#wtiles").querySelectorAll(".wtile").forEach((t) => t.classList.toggle("used", placed.includes(+t.dataset.i))); $("#sslots").querySelectorAll(".placed").forEach((p) => { p.onclick = () => { if (st.cur.done) return; placed.splice(+p.dataset.k, 1); draw(); }; }); };
    $("#wtiles").querySelectorAll(".wtile").forEach((t) => { t.onclick = () => { if (st.cur.done || placed.includes(+t.dataset.i)) return; Speech.sfx("tap"); placed.push(+t.dataset.i); draw(); }; });
    const clean = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, "");
    const check = () => { if (st.cur.done) return; if (placed.length !== target.length) return showFeedback("info", "Use every word", (target.length - placed.length) + " more to place."); const ok = placed.every((i, k) => clean(c.tiles[i]) === clean(target[k])); const first = answer(ok, { heard: placed.map((i) => c.tiles[i]).join(" ") }); if (ok) { actions(nextBtn()); bindNext(); showFeedback("ok", praise(), c.sentence + (first && !st.cur.review ? " · +1 star" : "")); Speech.speak(c.sentence, { rate: settings().rate }); autoNext(1900); } else { actions('<button class="btn" id="clear">Clear</button>' + nextBtn("Skip")); bindNext(); showFeedback("no", "Correct sentence:", c.sentence); $("#clear").onclick = () => { if (st.cur.done) return; placed = []; draw(); resetBar(); actions('<button class="btn" id="hear">' + UI.icon("ear") + ' Hear it</button><button class="btn main" id="check">Check</button>'); $("#hear").onclick = () => Speech.speak(c.sentence, { rate: settings().rate }); $("#check").onclick = check; }; } };
    $("#check").onclick = check; draw();
  };

  // ---------- Trace the letter ----------
  RENDER.trace = (c) => {
    stage(reviewTag() + '<div class="label">' + U.esc(c.word) + (c.hint ? " is for " + U.esc(c.hint) : "") + '</div><div class="trace-wrap"><canvas id="tracecv" class="trace" width="520" height="520" aria-label="Trace the letter ' + U.esc(c.word) + '"></canvas></div><div class="label">Draw over the grey letter with your finger</div><div id="fb" style="width:100%"></div>');
    actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>');
    const cv = $("#tracecv"), ctx = cv.getContext("2d"); const W = 520;
    const glyph = document.createElement("canvas"); glyph.width = W; glyph.height = W; const g = glyph.getContext("2d");
    const drawGlyph = (target, color) => { target.font = "900 400px Nunito, 'Segoe UI', sans-serif"; target.textAlign = "center"; target.textBaseline = "middle"; target.fillStyle = color; target.fillText(c.word, W / 2, W / 2 + 20); };
    const base = () => { ctx.clearRect(0, 0, W, W); drawGlyph(ctx, "#E5E5E5"); ctx.font = "900 400px Nunito, 'Segoe UI', sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.strokeStyle = "#AFAFAF"; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.strokeText(c.word, W / 2, W / 2 + 20); ctx.setLineDash([]); };
    drawGlyph(g, "#000"); base();
    const ink = document.createElement("canvas"); ink.width = W; ink.height = W; const ic = ink.getContext("2d"); ic.lineCap = "round"; ic.lineJoin = "round";
    let drawing = false, last = null, strokes = 0;
    const pos = (e) => { const r = cv.getBoundingClientRect(); const p = e.touches ? e.touches[0] : e; return { x: (p.clientX - r.left) * (W / r.width), y: (p.clientY - r.top) * (W / r.height) }; };
    const line = (a, b) => { ctx.strokeStyle = "#1CB0F6"; ctx.lineWidth = 26; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ic.strokeStyle = "#000"; ic.lineWidth = 44; ic.beginPath(); ic.moveTo(a.x, a.y); ic.lineTo(b.x, b.y); ic.stroke(); };
    const down = (e) => { if (st.cur.done) return; e.preventDefault(); drawing = true; last = pos(e); line(last, last); strokes++; };
    const move = (e) => { if (!drawing) return; e.preventDefault(); const p = pos(e); line(last, p); last = p; };
    const up = () => { drawing = false; };
    cv.addEventListener("pointerdown", down); cv.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
    st.cleanup = () => window.removeEventListener("pointerup", up);
    const check = () => { if (st.cur.done) return; if (!strokes) return showFeedback("info", "Draw the letter first", "Use your finger or the mouse."); const gd = g.getImageData(0, 0, W, W).data, id = ic.getImageData(0, 0, W, W).data; let total = 0, hit = 0, inkTotal = 0, inkOut = 0; for (let y = 0; y < W; y += 4) for (let x = 0; x < W; x += 4) { const k = (y * W + x) * 4 + 3; const onGlyph = gd[k] > 0, onInk = id[k] > 0; if (onGlyph) { total++; if (onInk) hit++; } if (onInk) { inkTotal++; if (!onGlyph) inkOut++; } } const coverage = total ? hit / total : 0, stray = inkTotal ? inkOut / inkTotal : 0; const ok = coverage >= 0.55 && stray < 0.7; const first = answer(ok, { heard: Math.round(coverage * 100) + "% covered" }); if (ok) { actions(nextBtn()); bindNext(); showFeedback(coverage >= 0.8 ? "ok" : "close", coverage >= 0.8 ? praise() + " Beautiful " + c.word : "Good! Try to cover the whole letter", first && !st.cur.review ? "+1 star" : ""); Speech.speak(c.word, { rate: 0.8 }); autoNext(1800); } else { actions('<button class="btn" id="clear">Clear</button>' + nextBtn("Skip")); bindNext(); bindClear(); showFeedback("no", "Stay on the grey letter", "Clear and trace it slowly, from top to bottom."); } };
    const bindClear = () => { const cl = $("#clear"); if (cl) cl.onclick = () => { if (st.cur.done) return; base(); ic.clearRect(0, 0, W, W); strokes = 0; resetBar(); actions('<button class="btn" id="clear">Clear</button><button class="btn main" id="check">Check</button>'); bindClear(); $("#check").onclick = check; }; };
    bindClear(); $("#check").onclick = check;
    Speech.speak(c.word, { rate: 0.8 });
  };

  // ---------- Read the sentence aloud ----------
  RENDER.readaloud = (c) => {
    const micOK = Speech.sttOK;
    stage(reviewTag() + '<div class="sentence-line big">' + U.esc(c.sentence) + '</div><div id="fb" style="width:100%"></div>');
    below('<div class="mic-row"><button class="btn icon big" id="hear" aria-label="Hear the sentence">' + UI.icon("ear") + '</button><button class="btn round orange" id="mic" aria-label="Tap and read the sentence">' + UI.icon("mic") + '</button><button class="btn icon big" id="retry" aria-label="Try again">' + UI.icon("retry") + '</button></div><div class="hint-row"><span>Hear it</span><span>Tap, then read it</span><span>Try again</span></div>' + (micOK ? "" : parentCheckHTML()));
    actions('<button class="btn" id="skip">Skip</button>' + nextBtn()); $("#next").disabled = true; bindNext();
    $("#hear").onclick = () => Speech.speak(c.sentence, { rate: settings().rate });
    $("#retry").onclick = () => { Speech.cancelListen(); $("#fb").innerHTML = ""; $("#mic").classList.remove("listening"); };
    $("#skip").onclick = () => { if (st.cur.tries === 0) answer(false, { heard: "(skipped)" }); S.next(); };
    bindParentCheck(c);
    $("#mic").onclick = () => { if (!micOK) return showFeedback("info", "The mic is not available here", "Use the two buttons below to check it yourself."); listenFor(c, c.sentence, "", (m, res) => { const mm = U.matchSpeech(res.alts, c.sentence, "forgiving"); const first = answer(mm.ok, { heard: mm.heard }); if (mm.ok) { showFeedback("ok", praise() + " You read it", first && !st.cur.review ? "+1 star" : ""); autoNext(1600); } else showFeedback("no", "I heard \"" + (mm.heard || "…") + "\"", "Tap Hear it, then read the whole sentence."); }); };
  };

  // ---------- Understand: comprehension cards ----------
  const QT = (k) => E.QTYPES[k] || E.QTYPES.what;
  const qchip = (k, big) => { const t = QT(k); return '<span class="qchip ' + t.tone + (big ? " big" : "") + '">' + UI.icon(t.icon) + "<span>" + U.esc(t.label) + "</span></span>"; };
  const markIn = (sentence, ans) => { const s = U.esc(sentence); if (!ans) return s; const a = U.esc(ans); const i = s.toLowerCase().indexOf(a.toLowerCase()); return i < 0 ? s : s.slice(0, i) + "<mark>" + s.slice(i, i + a.length) + "</mark>" + s.slice(i + a.length); };
  const markWords = (sentence, ans) => { const keys = new Set(E.keyTokens(ans)); return sentence.split(/(\s+)/).map((w) => { const k = E.stemWord(w); return k && keys.has(k) ? "<mark>" + U.esc(w) + "</mark>" : U.esc(w); }).join(""); };
  function passageHTML(p, o) {
    o = o || {};
    const upto = o.upto == null ? p.paras.length - 1 : o.upto;
    const idx = o.only != null ? [o.only] : p.paras.slice(0, upto + 1).map((_, i) => i);
    const paras = idx.map((i) => p.paras[i]);
    const many = p.paras.length > 1 || p.paras[0].length > 1;
    const body = (p.pic && !o.nopic ? '<div class="psg-pic" aria-hidden="true">' + p.pic + "</div>" : "") + paras.map((ss, k) => { const pi = idx[k]; return '<p class="psg-p' + (o.focus != null && pi !== o.focus ? " dim" : "") + (o.focus === pi ? " focus" : "") + '">' + ss.map((s, si) => '<span class="ps" data-p="' + pi + '" data-s="' + si + '">' + U.esc(s) + "</span>").join(" ") + "</p>"; }).join("");
    const closed = o.show === "closed";
    const title = (p.title && !p.notitle ? U.esc(p.title) : many ? "The story" : "The sentence") + (o.only != null && p.paras.length > 1 ? " · part " + (o.only + 1) : "");
    return '<div class="passage' + (closed ? " closed" : "") + (many ? "" : " one") + (o.full ? " full" : "") + '" id="psg"><div class="psg-head"><span class="psg-title">' + title + "</span>" + (closed ? '<button type="button" class="btn soft-blue psg-btn" id="psg-look">' + UI.icon("eye") + " Look back</button>" : '<button type="button" class="btn soft-blue psg-btn" id="psg-hear">' + UI.icon("ear") + " Read to me</button>") + '</div><div class="psg-body" id="psg-body">' + body + "</div></div>";
  }
  function bindPassage(c) {
    const look = $("#psg-look"); if (look) look.onclick = () => openPassage(true);
    const hear = $("#psg-hear"); if (hear) hear.onclick = () => readPassage(c.focus);
    st.root.querySelectorAll("#psg .ps").forEach((s) => { s.onclick = () => Speech.speak(s.textContent, { rate: settings().rate }); });
  }
  function openPassage(scroll) {
    const p = $("#psg"); if (!p || !p.classList.contains("closed")) return;
    p.classList.remove("closed");
    const b = $("#psg-look"); if (b) { b.id = "psg-hear"; b.innerHTML = UI.icon("ear") + " Read to me"; b.onclick = () => readPassage(); }
    if (scroll) p.scrollIntoView({ block: "start", behavior: "smooth" });
  }
  async function readPassage(focus) {
    if (!st) return; const token = st.idx;
    if (st.reading) { st.reading = false; Speech.stop(); return; }
    st.reading = true;
    const spans = [...st.root.querySelectorAll("#psg .ps")].filter((s) => focus == null || +s.dataset.p === focus);
    for (const s of spans) { if (!st || st.idx !== token || !st.reading) break; spans.forEach((x) => x.classList.remove("reading")); s.classList.add("reading"); await Speech.speak(s.textContent, { rate: settings().rate }); }
    spans.forEach((x) => x.classList.remove("reading")); if (st && st.idx === token) st.reading = false;
  }
  function showEvidence(c, words, ok) {
    openPassage(false);
    st.root.querySelectorAll("#psg .ps.ev").forEach((x) => { x.classList.remove("ev", "ev-ok"); x.textContent = x.textContent; });
    if (!c.ev) return false;
    const s = st.root.querySelector('#psg .ps[data-p="' + c.ev[0] + '"][data-s="' + c.ev[1] + '"]'); if (!s) return false;
    s.classList.add("ev"); if (ok) s.classList.add("ev-ok");
    if (words && c.kind === "mc" && typeof c.answer === "string") s.innerHTML = markWords(s.textContent, c.answer);
    s.scrollIntoView({ block: "center", behavior: "smooth" });
    return true;
  }

  RENDER["u-tip"] = (c) => {
    const t = QT(c.tip); heading("Reading tip");
    stage('<div class="tip-card">' + qchip(c.tip, true) + "<h2>" + U.esc(t.title) + "</h2><p>" + U.esc(t.tip) + "</p>" + (t.ex ? '<div class="tip-ex"><div class="tip-ex-l">Example</div><div class="tip-ex-s">' + markIn(t.ex.t, t.ex.a) + '</div><div class="tip-ex-q">' + U.esc(t.ex.q) + '</div><div class="tip-ex-a">' + UI.icon("check") + "<span>" + U.esc(t.ex.a.charAt(0).toUpperCase() + t.ex.a.slice(1)) + "</span></div></div>" : "") + "</div>");
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn("Got it")); bindNext();
    const say = () => Speech.speak(t.title + ". " + t.tip + (t.ex ? " For example. " + t.ex.t + " " + t.ex.q + " " + t.ex.a + "." : ""), { rate: settings().rate });
    $("#hear").onclick = say; later(say, 400);
  };
  RENDER["u-word"] = (c) => {
    heading("Learn the word");
    stage('<div class="pic big" aria-hidden="true">' + c.pic + '</div><div class="giant">' + U.esc(c.word) + "</div>");
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn("Got it")); bindNext();
    const say = () => Speech.speak(c.word, { rate: settings().rate }); $("#hear").onclick = say; later(say, 300);
  };
  function bindChoice(c, isOk, wrongTitle, wrongSub, say) {
    const placement = st.source === "placement";
    $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => {
      if (st.cur.done || b.disabled) return;
      const val = b.dataset.w; const ok = isOk(val); const first = answer(ok, { heard: val });
      if (ok) { b.classList.add("correct"); $("#opts").querySelectorAll(".option").forEach((x) => { if (x !== b) x.classList.add("dim"); }); showFeedback("ok", praise(), first && !st.cur.review ? "+1 star" : ""); if (say) say(); autoNext(1600); return; }
      b.classList.add("wrong"); b.disabled = true;
      if (placement) { st.cur.done = true; $("#opts").querySelectorAll(".option").forEach((x) => { if (isOk(x.dataset.w)) x.classList.add("correct"); x.disabled = true; }); showFeedback("no", "Good try!", "Let's see where to start."); return; }
      showFeedback("no", typeof wrongTitle === "function" ? wrongTitle(val) : wrongTitle, typeof wrongSub === "function" ? wrongSub(val) : wrongSub);
    }; });
  }
  RENDER["u-wordpic"] = (c) => {
    heading(c.listen ? "Listen, then tap the picture" : "Which picture shows the word?");
    stage((st.source === "placement" ? "" : reviewTag()) + (c.listen ? '<button class="btn round md green" id="hearbig" aria-label="Hear the word">' + UI.icon("ear") + "</button>" : '<div class="giant">' + U.esc(c.word) + "</div>") + '<div class="options pic-opts" id="opts">' + c.options.map((o) => '<button class="option picopt" data-w="' + U.esc(o) + '"><span class="pic">' + o + "</span></button>").join("") + "</div>");
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn()); $("#next").disabled = true; bindNext();
    const say = () => Speech.speak(c.word, { rate: settings().rate }); $("#hear").onclick = say; if ($("#hearbig")) $("#hearbig").onclick = say; later(say, 300);
    bindChoice(c, (v) => v === c.pic, "That is not it", "Listen again: " + c.word + ". Which picture is it?", say);
  };
  RENDER["u-picword"] = (c) => {
    heading("Which word matches the picture?");
    stage(reviewTag() + '<div class="pic big" aria-hidden="true">' + c.pic + '</div><div class="options" id="opts">' + c.options.map((o) => '<button class="option" data-w="' + U.esc(o) + '">' + U.esc(o) + "</button>").join("") + "</div>");
    actions(nextBtn()); $("#next").disabled = true; bindNext();
    bindChoice(c, (v) => v === c.word, (v) => "That says " + v, "Look at the picture again. Read each word.", () => Speech.speak(c.word, { rate: settings().rate }));
  };
  RENDER["u-sort"] = (c) => {
    const desc = { who: "a person or an animal", what: "a thing", where: "a place", when: "a time" };
    heading("Who, what, where or when?");
    stage(reviewTag() + '<div class="pic big" aria-hidden="true">' + c.pic + '</div><div class="giant sm">' + U.esc(c.word) + '</div><div class="options sort-opts" id="opts">' + ["who", "what", "where", "when"].map((k) => '<button class="option sortopt ' + QT(k).tone + '" data-w="' + k + '">' + UI.icon(QT(k).icon) + "<span>" + k.toUpperCase() + "</span><small>" + desc[k] + "</small></button>").join("") + "</div>");
    actions('<button class="btn" id="hear">' + UI.icon("ear") + " Hear it</button>" + nextBtn()); $("#next").disabled = true; bindNext();
    const say = () => Speech.speak(c.word, { rate: settings().rate }); $("#hear").onclick = say; later(say, 300);
    bindChoice(c, (v) => v === c.answer, "Not quite", '"' + c.word + '" is ' + desc[c.answer] + ", so it is a " + c.answer.toUpperCase() + " word.");
  };
  RENDER["u-read"] = (c) => {
    st.reading = false;
    heading(c.part ? "Read part " + c.part + " of " + c.parts : c.passage.paras.length > 1 ? "Read the story" : "Read carefully");
    stage(passageHTML(c.passage, { upto: c.upto, focus: c.focus, full: true }) + '<div class="read-tip">' + UI.icon("bulb") + "<span>" + (c.part ? "Read this part. Then ask yourself: who is in it, what happened, and why?" : "Read every sentence. Then answer the questions. You can look back any time.") + "</span></div>");
    bindPassage(c);
    actions('<button class="btn blue" id="play">' + UI.icon("play") + " Read to me</button>" + nextBtn("I read it")); bindNext();
    $("#play").onclick = () => readPassage(c.focus);
  };
  RENDER.uq = (c) => {
    st.reading = false;
    const t = QT(c.k); const placement = st.source === "placement";
    heading(c.kind === "tf" ? "True or false?" : c.kind === "order" ? "Put it in order" : c.kind === "picopt" ? "Which picture matches?" : "Answer the question");
    let ans = "";
    if (c.kind === "mc") ans = '<div class="options one" id="opts">' + c.options.map((o) => '<button class="option text" data-w="' + U.esc(o) + '">' + U.esc(o) + "</button>").join("") + "</div>";
    else if (c.kind === "picopt") ans = '<div class="options pic-opts" id="opts">' + c.options.map((o, i) => '<button class="option picopt" data-w="' + U.esc(o) + '" aria-label="Picture ' + (i + 1) + '"><span class="pic">' + o + "</span></button>").join("") + "</div>";
    else if (c.kind === "tf") ans = '<div class="options" id="opts"><button class="option tfopt" data-w="true">' + UI.icon("check") + '<span>True</span></button><button class="option tfopt" data-w="false">' + UI.icon("close") + "<span>False</span></button></div>";
    else ans = '<div class="small muted" style="text-align:center">Tap the events in the order they happened. Tap again to undo.</div><div class="order-list" id="list">' + c.shuffled.map((it, i) => '<button class="order-item" data-i="' + i + '"><span class="num"></span><span class="grow">' + U.esc(it) + "</span></button>").join("") + "</div>";
    stage((placement ? "" : reviewTag()) + passageHTML(c.passage, { upto: c.upto, show: c.show, only: c.only, nopic: (c.stage || 3) >= 3 }) + '<div class="uq-card"><div class="uq-top">' + qchip(c.k) + '<button type="button" class="btn icon uq-hear" id="hearq" aria-label="Hear the question">' + UI.icon("ear") + '</button></div><div class="uq-q">' + U.esc(c.q) + "</div></div>" + ans + '<div id="fb" style="width:100%"></div>');
    bindPassage(c);
    const showWhere = c.guided && !placement;
    const whereBtn = () => (showWhere ? '<button class="btn" id="where">' + UI.icon("eye") + " Show me where</button>" : "");
    const baseActions = () => whereBtn() + (c.kind === "order" ? '<button class="btn main" id="check">Check</button>' : nextBtn());
    actions(baseActions());
    if ($("#next")) { $("#next").disabled = true; bindNext(); }
    const bindWhere = () => { const w = $("#where"); if (w) w.onclick = () => { if (!showEvidence(c, true)) showFeedback("info", t.title, t.tip); }; };
    bindWhere();
    const sayQ = () => Speech.speak(c.kind === "tf" ? "True or false? " + c.q : c.q + (c.kind === "mc" ? " | " + c.options.map((o, i) => (i === 0 ? "Is it | " : "or | ") + o + "?").join(" | ") : ""), { rate: settings().rate });
    $("#hearq").onclick = sayQ;
    if ((c.stage || 3) <= 3 || c.guided || ["kg", "g1", "g2"].includes(Store.grade())) later(sayQ, 450);
    function markCorrect() { const o = $("#opts"); if (!o) return; o.querySelectorAll(".option").forEach((x) => { const v = x.dataset.w; const isAns = c.kind === "tf" ? (v === "true") === c.answer : v === c.answer; x.classList.add(isAns ? "correct" : "dim"); x.disabled = true; }); }
    function done(ok, first) {
      if (ok) {
        const had = showEvidence(c, false, true);
        if (!$("#next")) { actions(nextBtn()); bindNext(); }
        showFeedback("ok", praise(), first && !st.cur.review ? "+1 star" : had ? "The green sentence shows where the answer is." : "");
        autoNext(2600); return;
      }
      if (placement) { st.cur.done = true; markCorrect(); if (!$("#next")) { actions(nextBtn()); bindNext(); } showFeedback("no", "Good try!", "Let's see where to start."); return; }
      const shown = showEvidence(c, c.guided);
      showFeedback("no", shown ? "Look at the yellow sentence" : "Not quite. Try again!", t.wrong || "Read it again and try once more.");
    }
    if (c.kind === "order") {
      let picked = [];
      const draw = () => $("#list").querySelectorAll(".order-item").forEach((b) => { const k = picked.indexOf(+b.dataset.i); b.classList.toggle("on", k >= 0); b.querySelector(".num").textContent = k >= 0 ? k + 1 : ""; });
      const check = () => {
        if (st.cur.done) return;
        if (picked.length !== c.shuffled.length) return showFeedback("info", "Tap every event first", "");
        const order = picked.map((i) => c.shuffled[i]); const ok = order.every((x, i) => x === c.items[i]);
        const first = answer(ok, { heard: order.join(" > ") });
        $("#list").querySelectorAll(".order-item").forEach((b) => { const k = picked.indexOf(+b.dataset.i); b.classList.remove("ok", "bad"); b.classList.add(c.shuffled[+b.dataset.i] === c.items[k] ? "ok" : "bad"); });
        if (ok || placement) return done(ok, first);
        actions(whereBtn() + '<button class="btn" id="clear">Try again</button>' + nextBtn("Skip")); bindNext(); bindWhere();
        $("#clear").onclick = () => { picked = []; $("#list").querySelectorAll(".order-item").forEach((b) => b.classList.remove("ok", "bad")); draw(); resetBar(); actions(baseActions()); bindWhere(); $("#check").onclick = check; };
        showFeedback("no", "Not yet. Green ones are in the right place.", "Look for first, next, then and last. It starts with: " + c.items[0]);
      };
      $("#list").querySelectorAll(".order-item").forEach((b) => { b.onclick = () => { if (st.cur.done) return; const i = +b.dataset.i; const k = picked.indexOf(i); if (k >= 0) picked.splice(k, 1); else picked.push(i); Speech.sfx("tap"); draw(); if (picked.length === c.shuffled.length) later(check, 350); }; });
      $("#check").onclick = check;
      return;
    }
    $("#opts").querySelectorAll(".option").forEach((b) => { b.onclick = () => {
      if (st.cur.done || b.disabled) return;
      const val = b.dataset.w;
      const ok = c.kind === "tf" ? (val === "true") === c.answer : val === c.answer;
      const first = answer(ok, { heard: val });
      b.classList.add(ok ? "correct" : "wrong"); if (!ok) b.disabled = true;
      if (ok) $("#opts").querySelectorAll(".option").forEach((x) => { if (x !== b) x.classList.add("dim"); });
      done(ok, first);
    }; });
  };

  function finishPlacement() {
    const res = st.results; const secs = Math.round((Date.now() - st.t0) / 1000);
    let passed = 0;
    for (let s = 1; s <= 5; s++) { const need = st.deck.filter((c) => c.graded && c.probe === s).length; const rs = res.filter((r) => r.probe === s); if (!need || rs.length < need || rs.some((r) => !r.ok)) break; passed++; }
    const start = Math.min(41, passed * 10 + 1);
    Store.placeAt("understand", start); Store.addSeconds(secs);
    const correct = res.filter((r) => r.ok).length;
    window.GKA.lastResult = { subject: "understand", n: start, mode: "placement", source: "placement", correct, total: res.length, accuracy: U.pct(correct, res.length), stars: 0, bonus: 0, review: 0, secs, missed: [], status: null, graded: res.length > 0, placement: { start, passed } };
    st = null; clearTimers(); Speech.sfx("win"); UI.confetti(120);
    window.GKA.App.go("results");
  }

  // ---------- finish ----------
  function finish() {
    if (st.source === "placement") return finishPlacement();
    clearResume();
    const graded = st.results.filter((r) => !r.warm);
    const correct = graded.filter((r) => r.ok).length, total = graded.length;
    const review = graded.filter((r) => r.review).length;
    const secs = Math.round((Date.now() - st.t0) / 1000);
    const missed = graded.filter((r) => !r.ok).map((r) => r.word);
    let status = null, bonus = 0;
    if (st.source === "level") { status = Store.recordRun(st.subject, st.n, st.mode, correct, total, E.requiredModes(st.subject)); if (status.firstPass) bonus = 5 * status.rating + 5; }
    Store.addStars(st.stars + bonus);
    Store.addSeconds(secs);
    window.GKA.lastResult = { subject: st.subject, n: st.n, mode: st.mode, source: st.source, correct, total, accuracy: U.pct(correct, total), stars: st.stars, bonus, review, secs, missed, status, graded: total > 0 };
    const payload = window.GKA.lastResult;
    // Practicing something already passed, or your own words, refills hearts.
    const wasPassed = st.source === "level" && status && status.passed && !status.firstPass;
    if ((st.source !== "level" || wasPassed) && payload.accuracy >= 70 && total > 0) { RW().refillHearts(); payload.refilled = true; }
    payload.rewards = RW().afterLesson(payload);
    st = null; clearTimers();
    if (payload.accuracy >= 90 && payload.graded) { Speech.sfx("win"); UI.confetti(payload.status && payload.status.firstPass ? 220 : 120); }
    window.GKA.App.go("results");
  }

  window.GKA.Session = S;
})();
