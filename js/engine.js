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
    science: { id: "science", name: "Science", modes: ["learn", "read", "speak", "listen", "write", "quiz"] },
    understand: { id: "understand", name: "Understand", modes: ["guided", "check"] }
  };
  E.GRADES = [["kg", "Kindergarten"], ["g1", "Grade 1"], ["g2", "Grade 2"], ["g3", "Grade 3"], ["g4", "Grade 4"], ["g5", "Grade 5"], ["g6", "Grade 6"]];
  const GRADE_ORDER = ["kg", "g1", "g2", "g3", "g4", "g5", "g6"];
  const gradeIndex = (g) => Math.max(0, GRADE_ORDER.indexOf(g || Store.grade()));
  const normWord = (x) => { if (typeof x === "string") return { w: x, h: "", s: "" }; if (Array.isArray(x)) return x.length >= 3 ? { w: x[0], h: x[1], s: x[2] } : { w: x[0], h: "", s: x[1] || "" }; return Object.assign({ h: "", s: "" }, x); };
  const registry = {};
  E.meta = {};
  function build() {
    const parts = window.GKA.contentParts || [];
    for (const part of parts) { if (part.extra) continue; registry[part.subject] = registry[part.subject] || {}; { const mapped = part.levels.map((L) => Object.assign({}, L, { words: (L.words || []).map(normWord), stories: L.stories || [L.story, L.story2].filter(Boolean) })); if (part.stages) (E.meta[part.subject] = E.meta[part.subject] || {})[part.grade] = { stages: part.stages }; const cur = registry[part.subject][part.grade]; registry[part.subject][part.grade] = cur ? cur.concat(mapped).sort((a, b) => a.n - b.n) : mapped; } }
    for (const part of parts) {
      if (!part.extra) continue;
      const levels = (registry[part.subject] || {})[part.grade]; if (!levels) continue;
      for (const n in part.levels) {
        const L = levels.find((x) => x.n === +n); const ex = part.levels[n]; if (!L) continue;
        const addWords = (list) => { const have = new Set(L.words.map((w) => String(w.w).toLowerCase())); for (const w of list.map(normWord)) { const k = String(w.w).toLowerCase(); if (!have.has(k)) { have.add(k); L.words.push(w); } } };
        if (ex.words) addWords(ex.words);
        if (ex.story2) L.stories = L.stories.concat([ex.story2]);
        if (ex.stories) L.stories = L.stories.concat(ex.stories);
        if (ex.items) L.items = (L.items || []).concat(ex.items);
        if (ex.vocab) L.vocab = (L.vocab || []).concat(ex.vocab);
        if (ex.sort) L.sort = (L.sort || []).concat(ex.sort);
        // A question already in the level (same wording and answer) is not added twice.
        if (ex.questions) { const qSig = (q) => [q.q, q.o ? q.o[0] : q.items ? q.items.join("/") : String(q.a)].join("|").toLowerCase(); const have = new Set((L.questions || []).map(qSig)); L.questions = (L.questions || []).concat(ex.questions.filter((q) => !have.has(qSig(q)) && have.add(qSig(q)))); }
        if (ex.lesson2) L.lesson = (L.lesson || "") + " " + ex.lesson2;
        if (ex.words2) addWords(ex.words2);
      }
    }
  }
  build();
  E.subject = (id) => META[id] ? Object.assign({}, META[id], { grades: Object.keys(registry[id] || {}) }) : null;
  E.subjects = () => ["reading", "math", "science", "understand"].map(E.subject);
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
    // Mix practice: words from every level the child has reached, shuffled, so each run is a new set.
    else if (source === "mix") { const top = Math.max(1, Store.currentLevel(subject)); const all = []; for (let k = 1; k <= top; k++) { const l = E.level(subject, k); if (l && l.words && !l.letters) all.push(...l.words); } words = U.shuffle(all).slice(0, 12); }
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
  const rotate = (arr, k, plays) => { if (arr.length <= k) return arr.slice(); const start = ((plays || 0) * k) % arr.length; const out = []; for (let i = 0; i < k; i++) out.push(arr[(start + i) % arr.length]); return out; };
  const take = (words, k, order, plays) => { if (words.length <= k) return words.slice(); if (order === "random") return U.shuffle(words).slice(0, k); const start = ((plays || 0) * k) % words.length; const out = []; for (let i = 0; i < k; i++) out.push(words[(start + i) % words.length]); return out; };

  /* Shuffle bag: every level keeps the items it has not shown yet. Each run draws from the bag and it refills, freshly
     shuffled, only when empty, so a child sees everything in a level, in a new order, before anything repeats. */
  const BAGS = "gka.bags.v1"; let bags = null;
  const loadBags = () => { if (bags) return bags; try { bags = JSON.parse(localStorage.getItem(BAGS) || "{}") || {}; } catch (e) { bags = {}; } return bags; };
  const saveBags = () => { try { const txt = JSON.stringify(bags); if (txt.length > 300000) { bags = {}; localStorage.removeItem(BAGS); } else localStorage.setItem(BAGS, txt); } catch (e) { /* storage blocked: still random */ } };
  E.shuffleOn = () => (Store.get().settings.order || "shuffle") !== "order";
  E.drawIdx = (key, len, k) => {
    if (len <= 0) return [];
    const b = loadBags(); const p = Store.profile(); const id = (p ? p.id : "guest") + ":" + Store.grade() + ":" + key;
    let bag = (b[id] || []).filter((i) => i < len); const out = [];
    while (out.length < Math.min(k, len)) {
      if (!bag.length) { bag = U.shuffle([...Array(len).keys()].filter((i) => !out.includes(i))); if (!bag.length) break; }
      out.push(bag.pop());
    }
    b[id] = bag; saveBags(); return out;
  };
  E.draw = (key, arr, k) => E.drawIdx(key, arr.length, k).map((i) => arr[i]);
  const shuffleAfter = (deck, keepFirst) => { const head = deck.filter(keepFirst), rest = U.shuffle(deck.filter((c) => !keepFirst(c))); deck.length = 0; deck.push(...head, ...rest); return deck; };

  /* Build the deck. opts: { subject, n, mode, order, source, size } */
  /* ----- Smooth difficulty -----
     No jumps: a lesson starts with two warm-up cards from the previous level (no stars, not scored), then its own
     cards go from easier to harder in three bands (shuffled inside each band), and the first level of a new
     Understand stage opens with a bridge item in the old style. The session also eases off after two misses. */
  const syllables = (w) => { w = String(w).toLowerCase().replace(/[^a-z]/g, ""); if (!w) return 0; if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, ""); const m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; };
  E.cardDifficulty = (c) => {
    if (!c) return 0;
    if (c.problem) { const a = parseFloat(String(c.problem.answer).replace(/[^0-9.\-]/g, "")); return Math.log10(1 + Math.abs(a || 0)) * 2 + String(c.problem.q || "").length / 30 + (c.sub === "words" ? 2 : 0); }
    if (c.sentence && ["blank", "dictation", "sentence", "readaloud"].includes(c.type)) return sentenceWords(c.sentence).length * 0.6 + (c.type === "dictation" ? 3 : 2);
    if (c.pairs) return 4;
    if (c.q) return String(c.q).length / 25 + (c.options ? c.options.join(" ").length / 40 : 0) + (c.kind === "order" || c.type === "order" ? 1.5 : 0) + (c.passage ? 0.5 : 0);
    if (c.word) { const w = String(c.word); return w.split(/\s+/).reduce((a, x) => a + syllables(x), 0) * 1.2 + w.replace(/[^a-z]/gi, "").length / 4 + ({ speak: 0.5, write: 1.5, unscramble: 1, listen: 0.7, trace: 0 }[c.type] || 0); }
    return 3;
  };
  const RAMPABLE = new Set(["readcheck", "picmatch", "blank", "match", "speak", "readaloud", "listen", "unscramble", "dictation", "write", "sentence", "math", "question", "truefalse", "order", "uq", "u-sort", "u-wordpic", "u-picword"]);
  E.ramp = (deck, mix) => {
    if (deck.some((c) => c.type === "u-read" || c.type === "story-listen")) return deck; // questions that follow a text keep the text's order
    const idx = []; deck.forEach((c, i) => { if (c.graded && !c.warm && RAMPABLE.has(c.type)) idx.push(i); });
    if (idx.length < 3) return deck;
    const cards = idx.map((i) => deck[i]).sort((a, b) => E.cardDifficulty(a) - E.cardDifficulty(b));
    const band = Math.ceil(cards.length / 3); const out = [];
    for (let b = 0; b < 3; b++) { const part = cards.slice(b * band, (b + 1) * band); out.push(...(mix ? U.shuffle(part) : part)); }
    idx.forEach((pos, k) => { deck[pos] = out[k]; });
    return deck;
  };
  function warmUp(opts, deck) {
    const n = opts.n; if (!n || n <= 1 || opts.source !== "level" || ["story", "placement", "guided"].includes(opts.mode)) return [];
    const L = E.level(opts.subject, n), P = E.level(opts.subject, n - 1); if (!L || !P) return [];
    const isPassage = (x) => !!(x.items && x.items[0] && x.items[0].text);
    let prev;
    try { prev = buildCore(Object.assign({}, opts, { n: n - 1, warm: true })); } catch (e) { return []; }
    let pick;
    if (opts.subject === "understand") {
      const stageStart = (P.stage || 0) < (L.stage || 0);
      if (isPassage(P)) {
        if (!stageStart) return []; // passage to passage inside a stage: the passages already ramp
        // Bridge at a new stage: one short passage from the old stage with its first two questions.
        const read = prev.findIndex((c) => c.type === "u-read"); if (read < 0) return [];
        pick = [prev[read]].concat(prev.slice(read + 1).filter((c) => c.graded && c.type === "uq").slice(0, 2));
      } else pick = prev.filter((c) => c.graded).sort((a, b) => E.cardDifficulty(a) - E.cardDifficulty(b)).slice(0, stageStart ? 3 : 2);
    } else pick = prev.filter((c) => c.graded && RAMPABLE.has(c.type)).sort((a, b) => E.cardDifficulty(a) - E.cardDifficulty(b)).slice(0, 2);
    return pick.map((c) => Object.assign({}, c, { warm: true, warmFrom: n - 1 }));
  }
  /* Brain Boost: what is due for review today across every subject (spaced repetition), topped up with a few fresh
     cards from levels already reached, and two math problems. Cards go easier to harder. */
  E.brainDeck = () => {
    const out = []; const seen = new Set();
    const wordCard = (subject, L, w) => {
      const pool = poolFor(subject, L.n, L.words || []); const opts = () => U.shuffle(U.distractors(w.w, pool, 3).concat([w.w]));
      if (w.s && hasWordIn(w) && Math.random() < 0.45) return { type: "blank", word: w.w, sentence: w.s, options: opts(), graded: true };
      return { type: "listen", sub: "pick", word: w.w, hint: w.h || "", sentence: w.s || "", graded: true, pic: E.pictureFor(w.w), options: opts() };
    };
    const cardFor = (subject, L, key) => {
      if (subject === "understand") return E.uqCardFor ? E.uqCardFor(L, key) : null;
      const w = (L.words || []).find((x) => x.w === key); if (w) return wordCard(subject, L, w);
      const q = (L.questions || []).find((x) => x.q === key); if (q) return quizCard(q);
      for (const st of L.stories || []) { const sq = st.questions.find((x) => x.q === key); if (sq) return { type: "question", q: sq.q, options: U.shuffle(sq.o.slice()), answer: sq.o[sq.a || 0], graded: true, word: sq.q }; }
      return null;
    };
    for (const r of Store.srsDue(14)) {
      const L = E.level(r.s, r.n); if (!L) continue; const c = cardFor(r.s, L, r.w);
      if (c && !seen.has(r.s + c.word)) { seen.add(r.s + c.word); out.push(Object.assign(c, { srsSubject: r.s, srsLevel: r.n })); }
    }
    let guard = 0;
    while (out.length < 10 && guard++ < 60) {
      const subject = U.pick(["reading", "science", "reading", "understand"]); const top = Math.max(1, Store.currentLevel(subject));
      const L = E.level(subject, 1 + Math.floor(Math.random() * top)); if (!L) continue;
      let c = null;
      if (subject === "understand") { const its = (L.items || []).filter((i) => i.text && i.qs && i.qs.length); if (its.length) { const it = U.pick(its); c = E.uqCardFor ? E.uqCardFor(L, U.pick(it.qs).q) : null; } }
      else if (L.words && L.words.length && !L.letters) c = wordCard(subject, L, U.pick(L.words));
      if (c && !seen.has(subject + c.word)) { seen.add(subject + c.word); out.push(Object.assign(c, { srsSubject: subject, srsLevel: L.n })); }
    }
    const M = E.level("math", Math.max(1, Store.currentLevel("math"))); if (M) for (let i = 0; i < 2; i++) { try { const p = M.gen(); out.push({ type: "math", sub: "pick", problem: p, graded: true, word: p.q, srsSubject: "math" }); } catch (e) { /* skip */ } }
    return E.ramp(U.shuffle(out), true);
  };
  E.buildDeck = (opts) => {
    if (opts.source === "brain") return E.brainDeck();
    const deck = buildCore(opts);
    if (opts.warm || !deck.length) return deck;
    if (opts.source !== "placement") E.ramp(deck, (opts.order || Store.get().settings.order || "shuffle") !== "order");
    if (opts.source === "level") { const w = warmUp(opts, deck); if (w.length) { const lead = deck[0] && ["u-tip", "lesson"].includes(deck[0].type) ? 1 : 0; deck.splice(lead, 0, ...w); } }
    return deck;
  };
  function buildCore(opts) {
    const { subject, n, mode } = opts;
    const settings = Store.get().settings;
    const order = opts.order || settings.order || "shuffle";
    const mix = order !== "order";
    const source = opts.source || "level";
    const L = E.level(subject, n);
    const g = gradeIndex();
    const deck = [];
    if ((subject === "understand" || source === "placement") && E.buildUnderstandDeck) return E.buildUnderstandDeck(opts, L);
    if (subject === "math") return buildMath(L, mode, opts.size || settings.deckSize || 20);
    const all = E.wordsFor(subject, n, order, source);
    const plays = source === "level" ? (Store.levelPeek(subject, n) || { plays: 0 }).plays : 0;
    const words = order === "story" ? all.slice(0, 10) : !mix ? take(all, 10, order, plays) : source === "level" ? E.draw(subject + ":" + n + ":words", all, 10) : U.shuffle(all).slice(0, 10);
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
        for (const w of words.slice(0, 6)) {
          const parts = sentenceWords(w.w);
          if (parts.length >= 2 && parts.length <= 9) { deck.push({ type: "sentence", sentence: w.w, word: w.w, tiles: U.shuffle(parts), graded: true, phrase: true }); continue; }
          const canTile = !/\s/.test(w.w) && w.w.replace(/[^a-z]/gi, "").length <= 8; deck.push({ type: "write", sub: canTile ? "tiles" : "type", word: w.w, hint: w.h || "", sentence: w.s || "", graded: true, letter: false, tiles: canTile ? tilesFor(w.w) : null, pic: withPic(w) });
        }
        for (const w of U.shuffle(words.filter((x) => !/\s/.test(x.w) && x.w.length >= 4 && x.w.length <= 9)).slice(0, 1)) deck.push({ type: "unscramble", word: w.w, sentence: w.s || "", tiles: tilesFor(w.w, true), pic: withPic(w), graded: true });
        if (g >= 1) for (const w of U.shuffle(withSentence.filter((x) => { const c = sentenceWords(x.s).length; return c >= 3 && c <= 8; })).slice(0, 2)) deck.push({ type: "sentence", sentence: w.s, word: w.w, tiles: U.shuffle(sentenceWords(w.s)), graded: true });
      }
    } else if (mode === "story" && L && L.stories && L.stories.length) {
      const pick = Number.isInteger(opts.story) ? opts.story : mix ? E.drawIdx(subject + ":" + n + ":story", L.stories.length, 1)[0] : plays; const story = L.stories[((pick % L.stories.length) + L.stories.length) % L.stories.length];
      deck.push({ type: "story-listen", story, graded: false });
      deck.push({ type: "story-words", story, graded: false });
      if (E.storyQuestionCards) deck.push(...E.storyQuestionCards(story, true));
      else for (const q of story.questions) deck.push({ type: "question", q: q.q, options: U.shuffle(q.o), answer: q.o[q.a], graded: true, word: q.q });
    } else if (mode === "learn" && L && L.lesson) {
      deck.push({ type: "lesson", lesson: L.lesson, words: L.words.map((w) => w.w), name: L.name, graded: false });
      const qs = mix ? E.draw(subject + ":" + n + ":learn", L.questions || [], 6) : rotate(L.questions || [], 6, plays);
      if (E.lessonQuestionCards) deck.push(...E.lessonQuestionCards(L.lesson, L.name, qs, true, quizCard));
      else for (const q of qs) deck.push(quizCard(q));
    } else if (mode === "quiz" && L && L.questions) {
      const qs = E.draw(subject + ":" + n + ":quiz", L.questions, 10);
      if (E.lessonQuestionCards && L.lesson) deck.push(...E.lessonQuestionCards(L.lesson, L.name, qs, false, quizCard));
      else for (const q of qs) deck.push(quizCard(q));
    }
    // Cards come in a new order every run; word cards that teach (flash) still come before the checks.
    if (mix && ["read", "speak", "listen", "write"].includes(mode)) shuffleAfter(deck, (c) => c.type === "flash" || c.type === "trace");
    return deck;
  }
  function quizCard(q) {
    if (q.t === "mc") return { type: "question", q: q.q, options: U.shuffle(q.o), answer: q.o[q.a || 0], graded: true, word: q.q };
    if (q.t === "tf") return { type: "truefalse", q: q.q, answer: q.a, graded: true, word: q.q };
    return { type: "order", q: q.q, items: q.items, shuffled: U.shuffle(q.items), graded: true, word: q.q };
  }
  function buildMath(L, mode, size) {
    const deck = []; if (!L) return deck;
    if (mode === "words" && L.wp) { const seen = new Set(); let guard = 0; while (deck.length < Math.min(size, 10) && guard++ < 100) { const p = L.wp(); if (seen.has(p.q)) continue; seen.add(p.q); deck.push({ type: "math", sub: "words", problem: Object.assign({ hint: "Read it twice. What is the question asking? Which numbers do you need?" }, p), graded: true, word: p.q }); } return deck; }
    if (mode === "words") { for (const wp of U.shuffle(L.words || [])) deck.push({ type: "math", sub: "words", problem: { q: wp.q, say: wp.q, answer: wp.answer, options: null, hint: "Read it twice. What is the question asking?", kind: "number" }, graded: true, word: wp.q }); return deck; }
    const seen = new Set(); let guard = 0;
    while (deck.length < size && guard++ < size * 8) { const p = L.gen(); const key = p.q + "|" + p.answer + "|" + JSON.stringify(p.visual || ""); if (seen.has(key)) continue; seen.add(key); deck.push({ type: "math", sub: mode, problem: p, graded: true, word: p.q }); }
    return deck;
  }
  E.starsForCard = (subject, n, mode, word) => { const L = Store.levelPeek(subject, n); if (L && L.passed) return 0; if (Store.isMastered(Store.masteryKey(subject, mode, word))) return 0; return 1; };
  E.isReviewCard = (subject, n, mode, word) => E.starsForCard(subject, n, mode, word) === 0;
  window.GKA.Engine = E;
})();
