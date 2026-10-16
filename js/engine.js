/* Genius Kids Academy - level engine. Assembles content for every grade (base packs plus extra packs), builds a mixed deck of
   cards for a subject, level and mode, and applies the scoring rules: first try counts, review cards earn no new stars. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U;
  const Store = window.GKA.Store;
  const E = {};

  const META = {
    reading: { id: "reading", name: "Reading", modes: ["read", "speak", "listen", "write", "story"] },
    math: { id: "math", name: "Math", modes: ["solve", "pick", "say", "listen", "words"] },
    science: { id: "science", name: "Science", modes: ["learn", "read", "speak", "listen", "write", "quiz"] }
  };
  E.GRADES = [["kg", "Kindergarten"], ["g1", "Grade 1"], ["g2", "Grade 2"], ["g3", "Grade 3"], ["g4", "Grade 4"], ["g5", "Grade 5"], ["g6", "Grade 6"]];
  const GRADE_ORDER = ["kg", "g1", "g2", "g3", "g4", "g5", "g6"];
  const gradeIndex = (g) => Math.max(0, GRADE_ORDER.indexOf(g || Store.grade()));
  const normWord = (x) => { if (typeof x === "string") return { w: x, h: "", s: "" }; if (Array.isArray(x)) return x.length >= 3 ? { w: x[0], h: x[1], s: x[2] } : { w: x[0], h: "", s: x[1] || "" }; return Object.assign({ h: "", s: "" }, x); };
  const registry = {};
  function build() {
    const parts = window.GKA.contentParts || [];
    for (const part of parts) { if (part.extra) continue; registry[part.subject] = registry[part.subject] || {}; registry[part.subject][part.grade] = part.levels.map((L) => Object.assign({}, L, { words: (L.words || []).map(normWord), stories: L.story ? [L.story] : [] })); }
    for (const part of parts) {
      if (!part.extra) continue;
      const levels = (registry[part.subject] || {})[part.grade]; if (!levels) continue;
      for (const n in part.levels) {
        const L = levels.find((x) => x.n === +n); const ex = part.levels[n]; if (!L) continue;
        if (ex.words) L.words = L.words.concat(ex.words.map(normWord));
        if (ex.story2) L.stories = L.stories.concat([ex.story2]);
        if (ex.questions) L.questions = (L.questions || []).concat(ex.questions);
        if (ex.lesson2) L.lesson = (L.lesson || "") + " " + ex.lesson2;
        if (ex.words2) L.words = L.words.concat(ex.words2.map(normWord));
      }
    }
  }
  build();
  E.subject = (id) => META[id] ? Object.assign({}, META[id], { grades: Object.keys(registry[id] || {}) }) : null;
  E.subjects = () => ["reading", "math", "science"].map(E.subject);
  E.levels = (subject, grade) => (registry[subject] && registry[subject][grade || Store.grade()]) || [];
  E.level = (subject, n, grade) => E.levels(subject, grade).find((l) => l.n === n) || null;
  E.levelNames = (subject, grade) => E.levels(subject, grade).map((l) => ({ n: l.n, name: l.name, skill: l.skill }));
  E.hasGrade = (subject, grade) => !!(registry[subject] && registry[subject][grade]);
  E.requiredModes = (subject) => META[subject].modes.slice();
  E.pictureFor = (word) => { const p = window.GKA.pictures || {}; const k = String(word || "").toLowerCase().replace(/[^a-z]/g, ""); return p[k] || null; };

  E.MODE_INFO = {
    read: { label: "I Read", blurb: "Flash cards, picture match, fill the blank and match pairs.", icon: "eye", tone: "blue" },
    speak: { label: "I Speak", blurb: "Say words and whole sentences into the mic.", icon: "mic", tone: "orange" },
    listen: { label: "I Listen", blurb: "Hear it, then pick, spell, unscramble or type it.", icon: "ear", tone: "green" },
    write: { label: "I Write", blurb: "Look, cover, spell, trace letters and build sentences.", icon: "pencil", tone: "purple" },
    story: { label: "Story", blurb: "Listen to the story, read it word by word, then answer questions.", icon: "book", tone: "indigo" },
    solve: { label: "Solve", blurb: "Type the answer on the number pad.", icon: "grid", tone: "green" },
    pick: { label: "Pick it", blurb: "Choose the right answer from four.", icon: "check", tone: "blue" },
    say: { label: "Say it", blurb: "Say the answer out loud into the mic.", icon: "mic", tone: "orange" },
    words: { label: "Word problems", blurb: "Read or listen to a story problem and solve it.", icon: "book", tone: "purple" },
    learn: { label: "Learn", blurb: "Hear the lesson read aloud, then answer the questions.", icon: "bulb", tone: "indigo" },
    quiz: { label: "Quiz", blurb: "Mixed questions: choose, true or false, and put in order.", icon: "check", tone: "blue" }
  };
  E.modeLabel = (m) => (E.MODE_INFO[m] || { label: m }).label;

  E.wordsFor = (subject, n, order, source) => {
    let words;
    if (source === "mywords") words = Store.myWords().map((x) => ({ w: x.w, s: x.s, h: "" }));
    else if (source === "review") words = Store.weakWords(subject, 12).map((x) => ({ w: x.word, s: "", h: "" }));
    else {
      const L = E.level(subject, n);
      words = (L && L.words || []).slice();
      if (order === "story" && L && L.stories && L.stories.length) { const seen = new Set(); const sw = []; for (const t of L.stories[0].text.replace(/\n/g, " ").split(/\s+/)) { const c = t.replace(/[^A-Za-z']/g, "").toLowerCase(); if (c.length >= 2 && !seen.has(c)) { seen.add(c); sw.push({ w: c, s: "", h: "" }); } } words = sw.slice(0, 16); }
    }
    if (order === "random") words = U.shuffle(words);
    return words;
  };
  const poolFor = (subject, n, words) => { const near = []; for (const k of [n - 1, n, n + 1]) { const l = E.level(subject, k); if (l && l.words) for (const x of l.words) near.push(x.w); } for (const w of words) near.push(w.w); return near.filter((x) => x && !/\s/.test(x)); };
  const tilesFor = (word, exact) => { const letters = word.toLowerCase().replace(/[^a-z]/g, "").split(""); if (exact) return U.shuffle(letters); const extra = U.shuffle("abcdefghijklmnoprstuvwy".split("").filter((c) => !letters.includes(c))).slice(0, Math.min(4, Math.max(2, 8 - letters.length))); return U.shuffle(letters.concat(extra)); };
  const hasWordIn = (w) => w.s && new RegExp("\\b" + w.w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(w.s);
  const sentenceWords = (s) => s.replace(/\s+/g, " ").trim().split(" ");
  // Take k words for this run, rotating through the level so replays cover everything.
  const take = (words, k, order, plays) => { if (words.length <= k) return words.slice(); if (order === "random") return U.shuffle(words).slice(0, k); const start = ((plays || 0) * k) % words.length; const out = []; for (let i = 0; i < k; i++) out.push(words[(start + i) % words.length]); return out; };

  /* Build the deck. opts: { subject, n, mode, order, source, size } */
  E.buildDeck = (opts) => {
    const { subject, n, mode } = opts;
    const settings = Store.get().settings;
    const order = opts.order || settings.order || "order";
    const source = opts.source || "level";
    const L = E.level(subject, n);
    const g = gradeIndex();
    const deck = [];
    if (subject === "math") return buildMath(L, mode, opts.size || settings.deckSize || 20);
    const all = E.wordsFor(subject, n, order, source);
    const plays = source === "level" ? (Store.levelPeek(subject, n) || { plays: 0 }).plays : 0;
    const words = take(all, 10, order, plays);
    const pool = poolFor(subject, n, all);
    const isLetters = !!(L && L.letters) && source === "level";
    const letterPool = "abcdefghijklmnopqrstuvwxyz".split("");
    const withPic = (w) => E.pictureFor(w.w);
    const withSentence = words.filter((w) => hasWordIn(w) && !isLetters);
    const picOpts = (w) => U.shuffle(U.distractors(w.w, pool.filter((x) => E.pictureFor(x) && x !== w.w), 3).concat([w.w]));

    if (mode === "read") {
      for (const w of words) deck.push({ type: "flash", word: w.w, hint: w.h || "", sentence: w.s || "", graded: false, letter: isLetters, pic: withPic(w) });
      for (const w of U.shuffle(words).slice(0, Math.min(words.length, 6))) deck.push({ type: "readcheck", word: w.w, hint: w.h || "", options: U.shuffle(U.distractors(w.w, isLetters ? letterPool : pool, 3).concat([w.w])), graded: true, letter: isLetters, pic: withPic(w) });
      for (const w of U.shuffle(words.filter(withPic)).slice(0, 2)) deck.push({ type: "picmatch", word: w.w, pic: withPic(w), options: picOpts(w), graded: true });
      for (const w of U.shuffle(withSentence).slice(0, 3)) deck.push({ type: "blank", word: w.w, sentence: w.s, options: U.shuffle(U.distractors(w.w, pool, 3).concat([w.w])), graded: true });
      if (withSentence.length >= 4) { const pairs = U.shuffle(withSentence).slice(0, 4).map((w) => ({ w: w.w, s: w.s })); deck.push({ type: "match", pairs, graded: true, word: "pairs: " + pairs.map((p) => p.w).join(", ") }); }
    } else if (mode === "speak") {
      for (const w of words.slice(0, 8)) deck.push({ type: "speak", word: w.w, hint: w.h || "", sentence: w.s || "", graded: true, letter: isLetters, pic: withPic(w) });
      if (g >= 1) for (const w of U.shuffle(withSentence).slice(0, 2)) deck.push({ type: "readaloud", sentence: w.s, word: w.w, graded: true });
    } else if (mode === "listen") {
      words.slice(0, 6).forEach((w, i) => { const canTile = !/\s/.test(w.w) && w.w.replace(/[^a-z]/gi, "").length <= 9; const sub = (i % 2 === 1 && canTile) ? "tiles" : "pick"; deck.push({ type: "listen", sub, word: w.w, hint: w.h || "", sentence: w.s || "", graded: true, letter: isLetters, pic: withPic(w), options: sub === "pick" ? U.shuffle(U.distractors(w.w, isLetters ? letterPool : pool, 3).concat([w.w])) : null, tiles: sub === "tiles" ? tilesFor(w.w) : null }); });
      if (!isLetters) for (const w of U.shuffle(words.filter((x) => !/\s/.test(x.w) && x.w.length >= 3 && x.w.length <= 9)).slice(0, 2)) deck.push({ type: "unscramble", word: w.w, sentence: w.s || "", tiles: tilesFor(w.w, true), pic: withPic(w), graded: true });
      if (g >= 2) { for (const w of U.shuffle(withSentence.filter((x) => sentenceWords(x.s).length <= 9)).slice(0, 2)) deck.push({ type: "dictation", sentence: w.s, word: w.w, graded: true }); }
      else for (const w of U.shuffle(words.filter(withPic)).slice(0, 2)) deck.push({ type: "picmatch", word: w.w, pic: withPic(w), options: picOpts(w), graded: true, listen: true });
    } else if (mode === "write") {
      if (isLetters) { for (const w of words.slice(0, 6)) deck.push({ type: "trace", word: w.w, hint: w.h || "", graded: true }); for (const w of words.slice(6, 10)) deck.push({ type: "write", sub: "tiles", word: w.w, hint: w.h || "", sentence: w.s || "", graded: true, letter: true, tiles: tilesFor(w.w) }); }
      else {
        for (const w of words.slice(0, 6)) { const canTile = !/\s/.test(w.w) && w.w.replace(/[^a-z]/gi, "").length <= 8; deck.push({ type: "write", sub: canTile ? "tiles" : "type", word: w.w, hint: w.h || "", sentence: w.s || "", graded: true, letter: false, tiles: canTile ? tilesFor(w.w) : null, pic: withPic(w) }); }
        for (const w of U.shuffle(words.filter((x) => !/\s/.test(x.w) && x.w.length >= 4 && x.w.length <= 9)).slice(0, 1)) deck.push({ type: "unscramble", word: w.w, sentence: w.s || "", tiles: tilesFor(w.w, true), pic: withPic(w), graded: true });
        if (g >= 1) for (const w of U.shuffle(withSentence.filter((x) => { const c = sentenceWords(x.s).length; return c >= 3 && c <= 8; })).slice(0, 2)) deck.push({ type: "sentence", sentence: w.s, word: w.w, tiles: U.shuffle(sentenceWords(w.s)), graded: true });
      }
    } else if (mode === "story" && L && L.stories && L.stories.length) {
      const story = L.stories[plays % L.stories.length];
      deck.push({ type: "story-listen", story, graded: false });
      deck.push({ type: "story-words", story, graded: false });
      for (const q of story.questions) deck.push({ type: "question", q: q.q, options: U.shuffle(q.o), answer: q.o[q.a], graded: true, word: q.q });
    } else if (mode === "learn" && L && L.lesson) {
      deck.push({ type: "lesson", lesson: L.lesson, words: L.words.map((w) => w.w), name: L.name, graded: false });
      for (const q of (L.questions || []).slice(0, 6)) deck.push(quizCard(q));
    } else if (mode === "quiz" && L && L.questions) {
      for (const q of U.shuffle(L.questions).slice(0, 10)) deck.push(quizCard(q));
    }
    return deck;
  };
  function quizCard(q) {
    if (q.t === "mc") return { type: "question", q: q.q, options: U.shuffle(q.o), answer: q.o[q.a], graded: true, word: q.q };
    if (q.t === "tf") return { type: "truefalse", q: q.q, answer: q.a, graded: true, word: q.q };
    return { type: "order", q: q.q, items: q.items, shuffled: U.shuffle(q.items), graded: true, word: q.q };
  }
  function buildMath(L, mode, size) {
    const deck = []; if (!L) return deck;
    if (mode === "words") { for (const wp of U.shuffle(L.words || [])) deck.push({ type: "math", sub: "words", problem: { q: wp.q, say: wp.q, answer: wp.answer, options: null, hint: "Read it twice. What is the question asking?", kind: "number" }, graded: true, word: wp.q }); return deck; }
    const seen = new Set(); let guard = 0;
    while (deck.length < size && guard++ < size * 8) { const p = L.gen(); const key = p.q + "|" + p.answer + "|" + JSON.stringify(p.visual || ""); if (seen.has(key)) continue; seen.add(key); deck.push({ type: "math", sub: mode, problem: p, graded: true, word: p.q }); }
    return deck;
  }
  E.starsForCard = (subject, n, mode, word) => { const L = Store.levelPeek(subject, n); if (L && L.passed) return 0; if (Store.isMastered(Store.masteryKey(subject, mode, word))) return 0; return 1; };
  E.isReviewCard = (subject, n, mode, word) => E.starsForCard(subject, n, mode, word) === 0;
  window.GKA.Engine = E;
})();
