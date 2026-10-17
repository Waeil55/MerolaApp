/* Genius Kids Academy - Understand: a 50-level reading comprehension ladder.
   Stage 1 words with pictures, stage 2 single sentences, stage 3 mini stories, stage 4 paragraphs, stage 5 long stories.
   Every question carries a type (WHO, WHAT, WHERE, WHEN, WHY...) and, when the text holds the answer, the evidence sentence,
   so the lesson can teach the child to look back and find it. Also turns Reading story and Science lesson questions into
   the same look-back cards. Loaded after engine.js. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U, Store = window.GKA.Store, E = window.GKA.Engine;
  if (!E) return;

  E.UNDERSTAND_STAGES = ["Words", "Sentences", "Mini stories", "Paragraphs", "Long stories"];
  // Each grade names its own five stages (content part "stages"); this is the fallback.
  E.stageNames = (grade) => ((E.meta.understand || {})[grade || Store.grade()] || {}).stages || E.UNDERSTAND_STAGES;

  // Question types: chip label, icon, color, and the teaching text shown on tip cards and after a wrong answer.
  E.QTYPES = {
    look: { label: "LOOK", icon: "eye", tone: "blue", title: "Words have meanings", tip: "Every word stands for something. Look at the picture, listen to the word, and connect them in your mind." },
    sort: { label: "SORT", icon: "grid", tone: "grape", title: "Who, what, where, when", tip: "WHO is a person or an animal. WHAT is a thing. WHERE is a place. WHEN is a time. Question words tell you what kind of answer to look for.", ex: { t: "Sam plays with a ball at the park in the morning.", q: "Where does Sam play?", a: "at the park" } },
    who: { label: "WHO", icon: "parent", tone: "blue", title: "WHO questions", tip: "WHO asks about a person or an animal. Look for a name, like Sam, or words like the dog or my mom.", ex: { t: "Sam feeds the dog.", q: "Who feeds the dog?", a: "Sam" }, wrong: "Find the person or animal in the yellow sentence." },
    what: { label: "WHAT", icon: "box", tone: "green", title: "WHAT questions", tip: "WHAT asks about a thing, or about what someone does. Find the thing, or the doing word.", ex: { t: "Mia eats a red apple.", q: "What does Mia eat?", a: "a red apple" }, wrong: "Find the thing or the action in the yellow sentence." },
    where: { label: "WHERE", icon: "pin", tone: "orange", title: "WHERE questions", tip: "WHERE asks about a place. Look for words like in, on, under, at and by, and place names like the park.", ex: { t: "The cat hides under the bed.", q: "Where does the cat hide?", a: "under the bed" }, wrong: "Find the place words in the yellow sentence." },
    when: { label: "WHEN", icon: "clock", tone: "grape", title: "WHEN questions", tip: "WHEN asks about time. Look for words like morning, night, after lunch, on Monday or in summer.", ex: { t: "We go to the beach every summer.", q: "When do we go to the beach?", a: "every summer" }, wrong: "Find the time words in the yellow sentence." },
    why: { label: "WHY", icon: "bulb", tone: "gold", title: "WHY questions", tip: "WHY asks for a reason. The reason often comes right after the word because or so.", ex: { t: "Lily took an umbrella because it was raining.", q: "Why did Lily take an umbrella?", a: "it was raining" }, wrong: "Look for because or so near the yellow sentence." },
    how: { label: "HOW", icon: "hash", tone: "blue", title: "HOW and HOW MANY", tip: "HOW MANY asks for a number, like three or ten. HOW asks about the way something happens, like slowly or fast.", ex: { t: "Sam has three red balls.", q: "How many balls does Sam have?", a: "three" }, wrong: "Find the number or the describing word in the yellow sentence." },
    tf: { label: "TRUE?", icon: "check", tone: "green", title: "True or false", tip: "Find the sentence that talks about it. If the text says the same thing, it is true. If it says something different, it is false.", ex: { t: "The cup is full of milk.", q: "True or false: The cup is empty.", a: "False" }, wrong: "Read the yellow sentence. Does it say the same thing?" },
    pic: { label: "PICTURE", icon: "eye", tone: "green", title: "Match the picture", tip: "Read every word. Who is in it? What is there? Then find the picture that shows all of it.", ex: { t: "The girl eats an apple.", q: "Which picture matches?", a: "a girl and an apple" }, wrong: "Read it again. Who is in it, and what is there?" },
    order: { label: "ORDER", icon: "menu", tone: "grape", title: "What happened first?", tip: "Stories happen in order. Look for time words: first, next, then, after that, and last.", ex: { t: "First, Ben put on his socks. Then he put on his shoes.", q: "What did Ben do first?", a: "put on his socks" }, wrong: "Look for first, next, then and last." },
    feel: { label: "FEEL", icon: "heart", tone: "red", title: "How does someone feel?", tip: "Stories do not always name the feeling. Look for clues: smiling and jumping mean happy, crying means sad, hiding means scared.", ex: { t: "Tears rolled down Lily's cheeks.", q: "How did Lily feel?", a: "sad" }, wrong: "Look at what the character does. What feeling does that show?" },
    ref: { label: "WHO IS IT?", icon: "back", tone: "blue", title: "He, she, it, they", tip: "Words like he, she, it and they point back to someone or something you already met. Look in the sentence before.", ex: { t: "Mia has a cat. She feeds it every day.", q: "Who is she?", a: "Mia" }, wrong: "Look at the sentence before. Who or what was named there?" },
    word: { label: "WORD", icon: "abc", tone: "green", title: "What does the word mean?", tip: "If you do not know a word, read the words around it. They are clues. Try each answer in its place and see which one makes sense.", ex: { t: "The puppy was so tiny that it fit in Sam's hand.", q: "What does tiny mean?", a: "very small" }, wrong: "Read the words around it. They are clues to the meaning." },
    main: { label: "MAIN IDEA", icon: "target", tone: "orange", title: "What is it mostly about?", tip: "Think about the whole text, not one small part. What do most of the sentences talk about?", wrong: "Think about the whole text. What do most sentences talk about?" },
    infer: { label: "CLUES", icon: "sparkle", tone: "grape", title: "Read between the lines", tip: "Sometimes the text does not say the answer. Put the clues together, like a detective.", ex: { t: "The cookie plate was empty. Rocket the dog had crumbs on his nose.", q: "Who ate the cookies?", a: "Rocket" }, wrong: "Put the clues together, like a detective." },
    next: { label: "NEXT", icon: "next", tone: "grape", title: "What will happen next?", tip: "Use what happened in the story and what you already know to make a smart guess.", ex: { t: "Omar saved his coins for weeks. At last he had enough for the toy car.", q: "What will Omar do next?", a: "buy the toy car" }, wrong: "Use the clues in the story and make a smart guess." },
    compare: { label: "COMPARE", icon: "grid", tone: "orange", title: "Same and different", tip: "Find what the text says about each one. Same means true for both. Different means true for only one.", ex: { t: "Luna is quiet. Max is loud. Both love to be petted.", q: "How are they different?", a: "Luna is quiet, but Max is loud" }, wrong: "Find what the text says about each one." },
    fact: { label: "FACT", icon: "book", tone: "green", title: "Find the fact", tip: "Facts are things a text tells you are true. Go back and find the sentence with the fact.", ex: { t: "Camels can go many days without drinking water.", q: "How long can camels go without water?", a: "many days" }, wrong: "Find the sentence with the fact." },
    theme: { label: "LESSON", icon: "trophy", tone: "gold", title: "What is the lesson?", tip: "Many stories teach a lesson. Think about what the character learned by the end.", wrong: "Think about what the character learned by the end." },
    both: { label: "READ ALL", icon: "book", tone: "blue", title: "Read every sentence", tip: "When there are two or more sentences, the answer can be in any of them. Read them all before you choose.", ex: { t: "Kim has a little dog. The dog's name is Pip.", q: "What is the dog's name?", a: "Pip" } },
    lookback: { label: "LOOK BACK", icon: "eye", tone: "blue", title: "Good readers look back", tip: "You do not have to remember everything. Go back to the text, find the sentence with the answer, then choose." },
    chunk: { label: "LONG STORY", icon: "book", tone: "grape", title: "One part at a time", tip: "Long stories are read in parts. After each part, ask yourself: who is in it, what happened, and why?" }
  };

  Object.assign(E.MODE_INFO, {
    guided: { label: "Read together", blurb: "One part at a time, with tips. Show me where lights up the answer.", icon: "book", tone: "grape" },
    check: { label: "Show what you know", blurb: "Read it all, then answer. Your first answer counts.", icon: "target", tone: "orange" },
    placement: { label: "Find my level", blurb: "A few quick questions to find your starting level.", icon: "map", tone: "grape" }
  });

  // ----- text helpers -----
  // Split a text into paragraphs of sentences. Fragments that start with a small letter (said Ben.) join the sentence before.
  E.splitText = (text) => String(text || "").trim().split(/\n\s*\n/).map((p) => {
    const t = p.replace(/\s+/g, " ").trim(); const out = []; let cur = "";
    for (let i = 0; i < t.length; i++) {
      cur += t[i];
      if (/[.!?]/.test(t[i])) {
        while (i + 1 < t.length && /[.!?"'”’)]/.test(t[i + 1])) cur += t[++i];
        if (i + 1 >= t.length || t[i + 1] === " ") { out.push(cur.trim()); cur = ""; }
      }
    }
    if (cur.trim()) out.push(cur.trim());
    const merged = [];
    for (const s of out) { if (merged.length && /^[a-z]/.test(s)) merged[merged.length - 1] += " " + s; else merged.push(s); }
    return merged;
  }).filter((p) => p.length);
  E.passageOf = (it) => ({ title: it.title || "", notitle: !!it.notitle, pic: it.p || null, paras: E.splitText(it.text) });
  const locate = (paras, e) => { if (!e) return null; const needle = e.toLowerCase(); for (let pi = 0; pi < paras.length; pi++) for (let si = 0; si < paras[pi].length; si++) if (paras[pi][si].toLowerCase().includes(needle)) return [pi, si]; return null; };
  E.locate = locate;
  const STOP = new Set("a an the is are was were be been to of and or in on at by for with it its he she they them his her their this that these those what who whom where when why how did does do has have had i you we my your our as so but not no yes from into up out about after before then than there here which will would can could just very all some one".split(" "));
  E.stemWord = (w) => { const s = String(w).toLowerCase().replace(/[^a-z0-9]/g, ""); if (!s || STOP.has(s)) return ""; return s.length > 4 ? s.replace(/(ing|ed|es|s)$/, "") : s.replace(/s$/, ""); };
  E.keyTokens = (text) => String(text || "").split(/\s+/).map(E.stemWord).filter((w) => w.length > 1);
  // Best guess at the sentence that answers a question, when the content does not name one.
  E.autoEvidence = (paras, q, ans) => {
    const a = new Set(E.keyTokens(ans)), qq = new Set(E.keyTokens(q)); let best = null, bestScore = 0;
    paras.forEach((ss, pi) => ss.forEach((s, si) => { const toks = new Set(E.keyTokens(s)); let sc = 0; a.forEach((t) => { if (toks.has(t)) sc += 2; }); qq.forEach((t) => { if (toks.has(t)) sc += 1; }); if (sc > bestScore) { bestScore = sc; best = [pi, si]; } }));
    return bestScore >= 2 ? best : null;
  };
  const guessKind = (q) => { const s = q.toLowerCase(); if (/\bfeel|felt\b/.test(s)) return "feel"; if (/^who\b/.test(s)) return "who"; if (/^where\b/.test(s)) return "where"; if (/^when\b/.test(s)) return "when"; if (/^why\b/.test(s)) return "why"; if (/^how\b/.test(s)) return "how"; if (/mostly about|main idea|best title/.test(s)) return "main"; if (/lesson|learn/.test(s)) return "theme"; if (/what does .* mean/.test(s)) return "word"; if (/happen next|will .* probably/.test(s)) return "next"; return "what"; };
  const NO_EVIDENCE = ["main", "theme", "next", "infer", "compare"];
  const rotate = (arr, k, plays) => { if (arr.length <= k) return arr.slice(); const start = ((plays || 0) * k) % arr.length; const out = []; for (let i = 0; i < k; i++) out.push(arr[(start + i) % arr.length]); return out; };
  const shuffleNew = (items) => { let s = items.slice(); for (let i = 0; i < 12; i++) { s = U.shuffle(items); if (s.some((x, j) => x !== items[j])) break; } return s; };

  // One question card. q: { k, q, o (first is correct) | a (true/false) | items (in order), ev }.
  function qCard(q, passage, o) {
    const kind = q.k === "tf" ? "tf" : q.k === "order" && q.items ? "order" : "mc";
    const c = { type: "uq", k: q.k, kind, q: q.q, passage, ev: q.ev || null, show: o.show || "open", guided: !!o.guided, upto: o.upto, stage: o.stage || 3, graded: true, word: q.q, only: o.only };
    if (kind === "mc") { c.answer = q.o[0]; c.options = U.shuffle(q.o.slice()); }
    else if (kind === "tf") c.answer = !!q.a;
    else { c.items = q.items.slice(); c.shuffled = shuffleNew(q.items); }
    if (!c.ev && kind !== "order" && !NO_EVIDENCE.includes(q.k)) c.ev = E.autoEvidence(passage.paras, q.q, kind === "tf" ? q.q : String(c.answer));
    return c;
  }
  function sentenceCard(it, guided) {
    const passage = { title: "", pic: guided ? it.p || null : null, paras: [[it.t]] };
    if (it.k === "pic") return { type: "uq", k: "pic", kind: "picopt", q: "Which picture matches the sentence?", answer: it.o[0], options: U.shuffle(it.o.slice()), passage: { title: "", pic: null, paras: [[it.t]] }, ev: [0, 0], show: "open", guided, stage: 2, graded: true, word: it.t };
    return qCard({ k: it.k, q: it.q, o: it.o, a: it.a, ev: [0, 0] }, passage, { guided, show: "open", stage: 2 });
  }
  const vocabCards = (L, v, kind) => {
    const pics = L.vocab.map((x) => x[1]).filter((p) => p !== v[1]); const words = L.vocab.map((x) => x[0]).filter((w) => w !== v[0]);
    if (kind === "picword") return { type: "u-picword", word: v[0], pic: v[1], options: U.shuffle(U.shuffle(words).slice(0, 3).concat([v[0]])), graded: true };
    return { type: "u-wordpic", word: v[0], pic: v[1], listen: kind === "listen", options: U.shuffle(U.shuffle(pics).slice(0, 3).concat([v[1]])), graded: true };
  };

  /* Deck for an Understand level. guided = "Read together" (tips, chunks, Show me where); check = "Show what you know". */
  E.buildUnderstandDeck = (opts, L) => {
    if (opts.source === "placement") return E.placementDeck();
    if (!L) return [];
    const guided = opts.mode === "guided";
    const plays = (Store.levelPeek("understand", L.n) || { plays: 0 }).plays;
    const deck = [];
    if (guided && L.tip && E.QTYPES[L.tip]) deck.push({ type: "u-tip", tip: L.tip, graded: false });
    if (L.vocab || L.sort) {
      if (L.sort) { const items = guided ? rotate(L.sort, 8, plays) : U.shuffle(L.sort).slice(0, 10); for (const [w, p, k] of items) deck.push({ type: "u-sort", word: w, pic: p, answer: k, graded: true }); return deck; }
      if (guided) { const sel = rotate(L.vocab, 8, plays); for (let g = 0; g < sel.length; g += 4) { const grp = sel.slice(g, g + 4); for (const v of grp) deck.push({ type: "u-word", word: v[0], pic: v[1], graded: false }); for (const v of U.shuffle(grp)) deck.push(vocabCards(L, v, "wordpic")); } }
      else U.shuffle(L.vocab).slice(0, 8).forEach((v, i) => deck.push(vocabCards(L, v, ["wordpic", "picword", "listen"][i % 3])));
      return deck;
    }
    if (L.items && L.items.length && L.items[0].t) { const items = guided ? rotate(L.items, 8, plays) : U.shuffle(L.items).slice(0, 8); for (const it of items) deck.push(sentenceCard(it, guided)); return deck; }
    // Levels can hold many passages: each run takes a window of them (at least 6 questions), and the window moves on every replay.
    const pool = L.items; let start = pool.length > 1 ? (plays * 2) % pool.length : 0; const chosen = []; let qn = 0;
    for (let i = 0; i < pool.length && (qn < 6 || chosen.length < 1); i++) { const it = pool[(start + i) % pool.length]; chosen.push(it); qn += (it.qs || []).length; }
    for (const it of chosen) {
      const passage = E.passageOf(it);
      const qs = it.qs.map((q) => Object.assign({}, q, { ev: q.e ? locate(passage.paras, q.e) : null }));
      if (guided && passage.paras.length > 1) {
        for (let p = 0; p < passage.paras.length; p++) {
          deck.push({ type: "u-read", passage, focus: p, upto: p, part: p + 1, parts: passage.paras.length, graded: false });
          for (const q of qs.filter((x) => x.ev && x.ev[0] === p)) deck.push(qCard(q, passage, { guided: true, upto: p, only: p, show: "open", stage: 5 }));
        }
        for (const q of qs.filter((x) => !x.ev)) deck.push(qCard(q, passage, { guided: true, show: "open", stage: 5 }));
      } else {
        deck.push({ type: "u-read", passage, graded: false });
        const closed = !guided && passage.paras.flat().length >= 5;
        for (const q of qs) deck.push(qCard(q, passage, { guided, show: closed ? "closed" : "open", stage: L.stage }));
      }
    }
    return deck;
  };

  /* Placement check: two questions per stage, easiest first. The session stops at the first miss. */
  E.placementDeck = () => {
    const deck = [];
    [5, 15, 25, 35, 45].forEach((n, si) => {
      const L = E.level("understand", n); if (!L) return;
      const d = E.buildUnderstandDeck({ mode: "check", source: "level" }, L); let taken = 0, readAdded = false;
      for (const c of d) {
        if (taken >= 2) break;
        if (c.type === "u-read") { if (!readAdded && taken === 0) { deck.push(Object.assign({}, c, { probe: si + 1 })); readAdded = true; } continue; }
        if (!c.graded) continue;
        deck.push(Object.assign({}, c, { probe: si + 1, guided: false, show: "open" })); taken++;
      }
    });
    return deck;
  };

  // Reading stories and Science lessons get the same look-back question cards.
  E.storyQuestionCards = (story, guided) => {
    const passage = { title: story.title || "", pic: null, paras: E.splitText(story.text) };
    return (story.questions || []).map((q) => qCard({ k: guessKind(q.q), q: q.q, o: [q.o[q.a || 0]].concat(q.o.filter((_, i) => i !== (q.a || 0))) }, passage, { guided, show: "closed", stage: 4 }));
  };
  E.lessonQuestionCards = (lesson, name, questions, guided, fallback) => {
    const passage = { title: name || "The lesson", pic: null, paras: E.splitText(lesson) };
    return questions.map((q) => {
      if (q.t === "mc") return qCard({ k: guessKind(q.q), q: q.q, o: [q.o[q.a || 0]].concat(q.o.filter((_, i) => i !== (q.a || 0))) }, passage, { guided, show: "closed", stage: 4 });
      if (q.t === "tf") return qCard({ k: "tf", q: q.q, a: q.a }, passage, { guided, show: "closed", stage: 4 });
      return fallback(q);
    });
  };
})();
