/* Genius Kids Academy - progress store with kid profiles. Each kid has a name, avatar and grade, and their own
   progress per subject and grade. Parent settings are shared. Everything lives in localStorage. */
window.GKA = window.GKA || {};
(function () {
  const KEY = "gka.progress.v2";
  const OLD_KEY = "gka.progress.v1";
  const U = window.GKA.U;
  const GRADES = ["kg", "g1", "g2", "g3", "g4", "g5", "g6"];
  const defaultSettings = () => ({ passMark: 90, speed: "level", order: "order", matching: "normal", voiceURI: "", rate: 0.9, pin: "1234", goalMin: 10, goalCards: 25, sound: true, theme: "auto", hearts: true, deckSize: 20 });
  const emptyRewards = () => ({ gems: 0, hearts: { count: 5, last: 0 }, starsByDay: {}, quests: null, badges: {}, chests: {}, freeze: 0, counts: {} });
  const emptyProfileData = () => ({ stars: 0, streak: { last: "", count: 0 }, minutes: {}, cardsByDay: {}, subjects: {}, mastery: {}, mistakes: [], myWords: [], rewards: emptyRewards() });
  const DEFAULTS = () => ({ v: 2, profiles: [], current: null, data: {}, settings: defaultSettings() });

  let state = DEFAULTS();
  const Store = {};
  Store.GRADES = GRADES;
  Store.gradeName = (g) => ({ kg: "Kindergarten", g1: "Grade 1", g2: "Grade 2", g3: "Grade 3", g4: "Grade 4", g5: "Grade 5", g6: "Grade 6" }[g] || g);
  Store.gradeShort = (g) => ({ kg: "KG", g1: "G1", g2: "G2", g3: "G3", g4: "G4", g5: "G5", g6: "G6" }[g] || g);

  Store.load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        state = Object.assign(DEFAULTS(), p);
        state.settings = Object.assign(defaultSettings(), p.settings || {});
      } else {
        const old = localStorage.getItem(OLD_KEY);
        if (old) migrate(JSON.parse(old));
      }
    } catch (e) { state = DEFAULTS(); }
    for (const pr of state.profiles) { if (!state.data[pr.id]) state.data[pr.id] = emptyProfileData(); if (!state.data[pr.id].rewards) state.data[pr.id].rewards = emptyRewards(); }
    return state;
  };
  Store.rewards = () => { const d = P(); if (!d.rewards) d.rewards = emptyRewards(); return d.rewards; };
  Store.rewardsFor = (id) => { const d = state.data[id] || emptyProfileData(); if (!d.rewards) d.rewards = emptyRewards(); return d.rewards; };
  Store.dataFor = (id) => state.data[id] || emptyProfileData();
  function migrate(old) {
    state = DEFAULTS();
    state.settings = Object.assign(defaultSettings(), old.settings || {});
    const id = U.uid();
    state.profiles.push({ id, name: (old.kid && old.kid.name) || "Explorer", avatar: (old.kid && old.kid.avatar) || "star", grade: "g3", created: Date.now() });
    state.current = id;
    const d = emptyProfileData();
    d.stars = old.stars || 0; d.streak = old.streak || d.streak; d.minutes = old.minutes || {}; d.cardsByDay = old.cardsByDay || {}; d.mastery = {}; d.mistakes = old.mistakes || []; d.myWords = old.myWords || [];
    for (const s of ["reading", "math", "science"]) { d.subjects[s] = { g3: { levels: (old.subjects && old.subjects[s] && old.subjects[s].levels) || {} } }; }
    for (const k in (old.mastery || {})) { const parts = k.split(":"); d.mastery[parts[0] + ":g3:" + parts.slice(1).join(":")] = old.mastery[k]; }
    state.data[id] = d;
    Store.save();
  }
  Store.save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage may be blocked */ } };
  Store.reset = () => { state = DEFAULTS(); Store.save(); };
  Store.exportJSON = () => JSON.stringify(state);
  Store.importJSON = (txt) => { const p = JSON.parse(txt); if (!p || typeof p !== "object" || !p.profiles) { if (p && p.subjects) { migrate(p); return; } throw new Error("Not a Genius Kids backup"); } state = Object.assign(DEFAULTS(), p); state.settings = Object.assign(defaultSettings(), p.settings || {}); Store.save(); };
  Store.setting = (k, v) => { state.settings[k] = v; Store.save(); };
  Store.settings = () => state.settings;

  // ----- profiles -----
  Store.profiles = () => state.profiles;
  Store.profile = () => state.profiles.find((p) => p.id === state.current) || null;
  Store.hasProfile = () => !!Store.profile();
  Store.setCurrent = (id) => { if (state.profiles.some((p) => p.id === id)) { state.current = id; Store.save(); } };
  Store.addProfile = (name, avatar, grade) => { const id = U.uid(); state.profiles.push({ id, name: String(name || "Explorer").trim().slice(0, 24), avatar: avatar || "star", grade: GRADES.includes(grade) ? grade : "g3", created: Date.now() }); state.data[id] = emptyProfileData(); state.current = id; Store.save(); return id; };
  Store.updateProfile = (id, patch) => { const p = state.profiles.find((x) => x.id === id); if (p) { Object.assign(p, patch); Store.save(); } };
  Store.removeProfile = (id) => { state.profiles = state.profiles.filter((p) => p.id !== id); delete state.data[id]; if (state.current === id) state.current = state.profiles.length ? state.profiles[0].id : null; Store.save(); };
  Store.grade = () => { const p = Store.profile(); return p ? p.grade : "g3"; };
  Store.setGrade = (g) => { const p = Store.profile(); if (p && GRADES.includes(g)) { p.grade = g; Store.save(); } };
  const P = () => { const p = Store.profile(); if (!p) return emptyProfileData(); return state.data[p.id] || (state.data[p.id] = emptyProfileData()); };
  // A read-only view used by the screens.
  Store.get = () => Object.assign({}, P(), { settings: state.settings, kid: Store.profile() || { name: "Explorer", avatar: "star", grade: "g3" } });
  Store.setKid = (name, avatar) => { const p = Store.profile(); if (!p) return; if (name) p.name = name; if (avatar) p.avatar = avatar; Store.save(); };

  // ----- levels (per subject and grade) -----
  // Understand is one path for every grade; the other subjects keep progress per grade.
  const gk = (subject) => (subject === "understand" ? "all" : Store.grade());
  Store.gradeKey = gk;
  const maxLv = (subject) => { const En = window.GKA.Engine; const n = En ? En.levels(subject).length : 0; return n || 20; };
  const subj = (subject, grade) => { const d = P(); const s = d.subjects[subject] || (d.subjects[subject] = {}); return s[grade || gk(subject)] || (s[grade || gk(subject)] = { levels: {} }); };
  Store.level = (subject, n) => { const g = subj(subject); return g.levels[n] || (g.levels[n] = { modes: {}, passed: false, stars: 0, accuracy: 0, plays: 0 }); };
  Store.levelPeek = (subject, n) => { const d = P(); const s = d.subjects[subject]; const g = s && s[gk(subject)]; return (g && g.levels[n]) || null; };
  Store.highestPassed = (subject) => { let h = 0; const lv = subj(subject).levels; for (const k in lv) if (lv[k].passed) h = Math.max(h, parseInt(k, 10)); return h; };
  Store.isUnlocked = (subject, n) => n <= 1 || Store.highestPassed(subject) >= n - 1;
  Store.currentLevel = (subject) => Math.min(maxLv(subject), Store.highestPassed(subject) + 1);
  Store.maxLevel = maxLv;
  // Placement opens every level below the start. Placed levels earn no stars and no chests.
  Store.placeAt = (subject, start) => { for (let n = 1; n < start; n++) { const L = Store.level(subject, n); if (!L.passed) { L.passed = true; L.placed = true; } } const d = P(); d.placed = d.placed || {}; d.placed[subject] = start; Store.save(); };
  Store.placedAt = (subject) => ((P().placed || {})[subject]) || 0;
  Store.passedCount = (subject) => { let c = 0; const lv = subj(subject).levels; for (const k in lv) if (lv[k].passed && !lv[k].placed) c++; return c; };
  Store.starsFor = (subject) => { let t = 0; const lv = subj(subject).levels; for (const k in lv) t += lv[k].stars || 0; return t; };

  Store.recordRun = (subject, n, mode, correct, total, requiredModes) => {
    const L = Store.level(subject, n);
    const acc = U.pct(correct, total);
    const m = L.modes[mode] || (L.modes[mode] = { best: 0, plays: 0, last: 0 });
    m.plays++; m.last = acc; m.best = Math.max(m.best, acc);
    L.plays++;
    const status = Store.levelStatus(subject, n, requiredModes);
    const wasPassed = L.passed;
    L.accuracy = status.accuracy;
    if (status.passed) { L.passed = true; L.stars = Math.max(L.stars, status.rating); }
    const day = U.dayKey(); const d = P();
    d.cardsByDay[day] = (d.cardsByDay[day] || 0) + total;
    Store.save();
    return Object.assign(status, { firstPass: status.passed && !wasPassed, rating: status.rating });
  };
  Store.levelStatus = (subject, n, requiredModes) => {
    const L = Store.level(subject, n);
    const played = requiredModes.filter((mo) => L.modes[mo] && L.modes[mo].plays > 0);
    const allPlayed = played.length === requiredModes.length;
    const accuracy = played.length ? Math.round(played.reduce((s, mo) => s + L.modes[mo].best, 0) / played.length) : 0;
    const passMark = state.settings.passMark || 90;
    const passed = L.passed || (allPlayed && accuracy >= passMark);
    const rating = accuracy >= 100 ? 3 : accuracy >= 95 ? 2 : accuracy >= passMark ? 1 : 0;
    return { played, allPlayed, accuracy, passed, rating: passed ? Math.max(1, rating) : 0, passMark };
  };

  // ----- stars and mastery -----
  Store.addStars = (n) => { P().stars += n; Store.save(); };
  Store.masteryKey = (subject, mode, word) => subject + ":" + gk(subject) + ":" + mode + ":" + U.norm(word);
  Store.bumpMastery = (key) => { const d = P(); d.mastery[key] = (d.mastery[key] || 0) + 1; };
  Store.isMastered = (key) => (P().mastery[key] || 0) >= 2;
  Store.wordStars = (subject, word) => { const modes = ["read", "speak", "listen", "write"]; const done = modes.filter((m) => Store.isMastered(Store.masteryKey(subject, m, word))).length; return Math.min(3, Math.round((done / modes.length) * 3)); };
  Store.logMistake = (entry) => { const d = P(); d.mistakes.unshift(Object.assign({ t: Date.now(), grade: Store.grade() }, entry)); if (d.mistakes.length > 300) d.mistakes.length = 300; };
  Store.recentMistakes = (subject, limit) => P().mistakes.filter((m) => !subject || m.subject === subject).slice(0, limit || 10);
  Store.weakWords = (subject, limit) => { const counts = {}; for (const m of P().mistakes) { if (subject && m.subject !== subject) continue; const k = m.word; counts[k] = counts[k] || { word: k, n: 0, modes: {}, subject: m.subject }; counts[k].n++; counts[k].modes[m.mode] = (counts[k].modes[m.mode] || 0) + 1; } return Object.values(counts).sort((a, b) => b.n - a.n).slice(0, limit || 6); };

  // ----- time and streak -----
  Store.addSeconds = (sec) => { const d = P(); const k = U.dayKey(); d.minutes[k] = (d.minutes[k] || 0) + sec; Store.touchStreak(); Store.save(); };
  Store.todaySeconds = () => P().minutes[U.dayKey()] || 0;
  Store.todayCards = () => P().cardsByDay[U.dayKey()] || 0;
  // A streak freeze (bought in the shop) covers one missed day.
  Store.touchStreak = () => { const d = P(); const today = U.dayKey(); if (d.streak.last === today) return; const y = new Date(); y.setDate(y.getDate() - 1); const y2 = new Date(); y2.setDate(y2.getDate() - 2); const rw = Store.rewards(); if (d.streak.last === U.dayKey(y)) d.streak.count++; else if (d.streak.last === U.dayKey(y2) && rw.freeze > 0) { rw.freeze--; d.streak.count++; } else d.streak.count = 1; d.streak.last = today; };
  Store.streak = () => { const d = P(); const today = U.dayKey(); const y = new Date(); y.setDate(y.getDate() - 1); const y2 = new Date(); y2.setDate(y2.getDate() - 2); if (d.streak.last === today || d.streak.last === U.dayKey(y)) return d.streak.count; if (d.streak.last === U.dayKey(y2) && Store.rewards().freeze > 0) return d.streak.count; return 0; };
  Store.weekMinutes = () => { const d = P(); const out = []; for (let i = 6; i >= 0; i--) { const dt = new Date(); dt.setDate(dt.getDate() - i); const k = U.dayKey(dt); out.push({ day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dt.getDay()], key: k, min: Math.round((d.minutes[k] || 0) / 60), cards: d.cardsByDay[k] || 0 }); } return out; };

  // ----- my words -----
  Store.addWord = (w, s, from) => { const word = String(w || "").trim(); if (!word) return false; const d = P(); if (d.myWords.some((x) => x.w.toLowerCase() === word.toLowerCase())) return false; d.myWords.unshift({ id: U.uid(), w: word, s: s || "", from: from || "Home", added: Date.now() }); Store.save(); return true; };
  Store.removeWord = (id) => { const d = P(); d.myWords = d.myWords.filter((x) => x.id !== id); Store.save(); };
  Store.myWords = () => P().myWords;

  window.GKA.Store = Store;
})();
