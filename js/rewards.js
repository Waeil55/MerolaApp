/* Genius Kids Academy - rewards: hearts, gems, daily quests, badges, treasure chests, streak freeze, shop. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U, Store = window.GKA.Store;
  const R = {};
  R.MAX_HEARTS = 5;
  R.HEART_REGEN_MS = 15 * 60 * 1000;
  const data = () => Store.rewards();

  // ----- hearts -----
  R.heartsOn = () => Store.settings().hearts !== false;
  R.hearts = () => { const d = data(); const now = Date.now(); if (d.hearts.count < R.MAX_HEARTS && d.hearts.last) { const regen = Math.floor((now - d.hearts.last) / R.HEART_REGEN_MS); if (regen > 0) { d.hearts.count = Math.min(R.MAX_HEARTS, d.hearts.count + regen); d.hearts.last = d.hearts.count >= R.MAX_HEARTS ? 0 : d.hearts.last + regen * R.HEART_REGEN_MS; Store.save(); } } return d.hearts.count; };
  R.loseHeart = () => { if (!R.heartsOn()) return R.MAX_HEARTS; const d = data(); if (d.hearts.count > 0) { if (d.hearts.count === R.MAX_HEARTS) d.hearts.last = Date.now(); d.hearts.count--; Store.save(); } return d.hearts.count; };
  R.refillHearts = () => { const d = data(); d.hearts.count = R.MAX_HEARTS; d.hearts.last = 0; Store.save(); };
  R.nextHeartIn = () => { const d = data(); if (d.hearts.count >= R.MAX_HEARTS || !d.hearts.last) return 0; return Math.max(0, R.HEART_REGEN_MS - ((Date.now() - d.hearts.last) % R.HEART_REGEN_MS)); };

  // ----- gems -----
  R.gems = () => data().gems;
  R.addGems = (n) => { data().gems += n; Store.save(); };
  R.spendGems = (n) => { const d = data(); if (d.gems < n) return false; d.gems -= n; Store.save(); return true; };

  // ----- daily quests -----
  const QUEST_POOL = [
    { id: "stars20", text: "Earn 20 stars", goal: 20, key: "stars" },
    { id: "stars40", text: "Earn 40 stars", goal: 40, key: "stars" },
    { id: "lessons2", text: "Finish 2 lessons", goal: 2, key: "lessons" },
    { id: "lessons3", text: "Finish 3 lessons", goal: 3, key: "lessons" },
    { id: "perfect1", text: "Get 100% in a lesson", goal: 1, key: "perfect" },
    { id: "speak5", text: "Say 5 words into the mic", goal: 5, key: "speak" },
    { id: "write5", text: "Spell 5 words", goal: 5, key: "write" },
    { id: "story1", text: "Finish a story", goal: 1, key: "story" },
    { id: "math10", text: "Solve 10 math problems", goal: 10, key: "math" },
    { id: "science1", text: "Finish a science lesson", goal: 1, key: "science" },
    { id: "minutes10", text: "Practice for 10 minutes", goal: 10, key: "minutes" }
  ];
  R.quests = () => {
    const d = data(); const today = U.dayKey();
    if (!d.quests || d.quests.day !== today) {
      const seed = today.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
      const pool = QUEST_POOL.slice(); const picked = [];
      // deterministic daily pick so every kid sees a sensible mix: one star quest, one lesson quest, one skill quest
      picked.push(pool[seed % 2]); picked.push(pool[2 + (seed % 2)]); picked.push(pool[4 + (seed % 7)]);
      d.quests = { day: today, items: picked.map((q) => ({ id: q.id, text: q.text, goal: q.goal, key: q.key, progress: 0, done: false, claimed: false })) };
      Store.save();
    }
    return d.quests.items;
  };
  R.questProgress = (key, amount) => { const items = R.quests(); let completed = []; for (const q of items) { if (q.key !== key || q.done) continue; q.progress = Math.min(q.goal, q.progress + amount); if (q.progress >= q.goal) { q.done = true; completed.push(q); } } Store.save(); return completed; };
  R.claimQuest = (id) => { const q = R.quests().find((x) => x.id === id); if (!q || !q.done || q.claimed) return 0; q.claimed = true; R.addGems(5); Store.addStars(10); Store.save(); return 10; };

  // ----- badges -----
  const BADGES = [
    { id: "first", name: "First steps", desc: "Finish your first lesson", icon: "play", test: (c) => c.lessons >= 1 },
    { id: "ten", name: "Ten lessons", desc: "Finish 10 lessons", icon: "trophy", test: (c) => c.lessons >= 10 },
    { id: "fifty", name: "Scholar", desc: "Finish 50 lessons", icon: "book", test: (c) => c.lessons >= 50 },
    { id: "perfect", name: "Perfect!", desc: "Get 100% in a lesson", icon: "target", test: (c) => c.perfect >= 1 },
    { id: "perfect10", name: "Sharp shooter", desc: "Get 100% ten times", icon: "target", test: (c) => c.perfect >= 10 },
    { id: "streak3", name: "On a roll", desc: "3-day streak", icon: "flame", test: (c) => c.streak >= 3 },
    { id: "streak7", name: "Week warrior", desc: "7-day streak", icon: "flame", test: (c) => c.streak >= 7 },
    { id: "stars100", name: "Star collector", desc: "Earn 100 stars", icon: "star", test: (c) => c.stars >= 100 },
    { id: "stars500", name: "Star champion", desc: "Earn 500 stars", icon: "star", test: (c) => c.stars >= 500 },
    { id: "speaker", name: "Big voice", desc: "Say 50 words into the mic", icon: "mic", test: (c) => c.speak >= 50 },
    { id: "writer", name: "Speller", desc: "Spell 50 words", icon: "pencil", test: (c) => c.write >= 50 },
    { id: "reader", name: "Bookworm", desc: "Finish 10 stories", icon: "book", test: (c) => c.story >= 10 },
    { id: "mathwiz", name: "Math whiz", desc: "Solve 200 math problems", icon: "calc", test: (c) => c.math >= 200 },
    { id: "scientist", name: "Scientist", desc: "Finish 10 science lessons", icon: "flask", test: (c) => c.science >= 10 },
    { id: "level10", name: "Halfway", desc: "Reach level 25 in any subject", icon: "map", test: (c) => c.maxLevel >= 25 },
    { id: "level20", name: "Road done", desc: "Finish all 50 levels in a subject", icon: "crown", test: (c) => c.maxLevel >= 50 },
    { id: "words10", name: "Word collector", desc: "Add 10 of your own words", icon: "words", test: (c) => c.myWords >= 10 },
    { id: "chest", name: "Treasure hunter", desc: "Open a treasure chest", icon: "gift", test: (c) => c.chests >= 1 },
    { id: "detective", name: "Story detective", desc: "Pass 10 Understand levels", icon: "bulb", test: (c) => c.understand >= 10 },
    { id: "thinker", name: "Deep thinker", desc: "Finish all 50 Understand levels", icon: "crown", test: (c) => c.understandAll }
  ];
  R.BADGES = BADGES;
  R.counters = () => { const d = data(); const s = Store.get(); const maxLevel = Math.max(Store.highestPassed("reading"), Store.highestPassed("math"), Store.highestPassed("science"), Store.highestPassed("understand")); return Object.assign({ stars: s.stars, streak: Store.streak(), maxLevel, understand: Store.passedCount("understand"), understandAll: Store.highestPassed("understand") >= 50, myWords: Store.myWords().length, chests: Object.keys(d.chests || {}).length }, d.counts); };
  R.checkBadges = () => { const d = data(); const c = R.counters(); const fresh = []; for (const b of BADGES) { if (!d.badges[b.id] && b.test(c)) { d.badges[b.id] = Date.now(); fresh.push(b); } } if (fresh.length) { R.addGems(fresh.length * 5); Store.save(); } return fresh; };
  R.hasBadge = (id) => !!data().badges[id];

  // ----- treasure chests on the path (one per unit of 5 levels) -----
  R.chestKey = (subject, unit) => subject + ":" + Store.gradeKey(subject) + ":" + unit;
  R.chestOpened = (subject, unit) => !!data().chests[R.chestKey(subject, unit)];
  R.chestReady = (subject, unit) => { if (Store.highestPassed(subject) < unit * 5) return false; const L = Store.levelPeek(subject, unit * 5); return !(L && L.placed); };
  R.openChest = (subject, unit) => { if (!R.chestReady(subject, unit) || R.chestOpened(subject, unit)) return null; data().chests[R.chestKey(subject, unit)] = Date.now(); const stars = 25, gems = 10; Store.addStars(stars); R.addGems(gems); R.bump("chests", 1); Store.save(); return { stars, gems }; };

  // ----- streak freeze and shop -----
  R.SHOP = [
    { id: "refill", name: "Refill hearts", desc: "Back to 5 hearts right now", cost: 30, icon: "heart" },
    { id: "freeze", name: "Streak freeze", desc: "Keeps your streak if you miss a day", cost: 40, icon: "snow" }
  ];
  R.buy = (id) => { const item = R.SHOP.find((x) => x.id === id); if (!item) return false; const d = data(); if (id === "refill" && R.hearts() >= R.MAX_HEARTS) return false; if (id === "freeze" && d.freeze >= 2) return false; if (!R.spendGems(item.cost)) return false; if (id === "refill") R.refillHearts(); if (id === "freeze") { d.freeze = (d.freeze || 0) + 1; Store.save(); } return true; };
  R.freezes = () => data().freeze || 0;

  // ----- counters and lesson events -----
  R.bump = (key, n) => { const d = data(); d.counts[key] = (d.counts[key] || 0) + (n == null ? 1 : n); };
  /* Called when a lesson ends. Returns { badges, quests } that were newly earned. */
  R.afterLesson = (r) => {
    const d = data();
    R.bump("lessons", 1);
    if (r.graded && r.accuracy >= 100) R.bump("perfect", 1);
    if (r.mode === "speak" || r.mode === "say") R.bump("speak", r.correct);
    if (r.mode === "write") R.bump("write", r.correct);
    if (r.mode === "story" || (r.subject === "understand" && r.mode === "check")) R.bump("story", 1);
    if (r.subject === "math") R.bump("math", r.correct);
    if (r.subject === "science") R.bump("science", 1);
    const day = U.dayKey(); d.starsByDay[day] = (d.starsByDay[day] || 0) + r.stars + r.bonus;
    const quests = [].concat(R.questProgress("stars", r.stars + r.bonus), R.questProgress("lessons", 1), r.graded && r.accuracy >= 100 ? R.questProgress("perfect", 1) : [], (r.mode === "speak" || r.mode === "say") ? R.questProgress("speak", r.correct) : [], r.mode === "write" ? R.questProgress("write", r.correct) : [], (r.mode === "story" || (r.subject === "understand" && r.mode === "check")) ? R.questProgress("story", 1) : [], r.subject === "math" ? R.questProgress("math", r.correct) : [], r.subject === "science" ? R.questProgress("science", 1) : [], R.questProgress("minutes", Math.round(r.secs / 60)));
    const badges = R.checkBadges();
    Store.save();
    return { badges, quests };
  };
  R.weekStars = (profileId) => { const d = Store.rewardsFor(profileId); let t = 0; for (let i = 0; i < 7; i++) { const dt = new Date(); dt.setDate(dt.getDate() - i); t += d.starsByDay[U.dayKey(dt)] || 0; } return t; };
  R.leaderboard = () => Store.profiles().map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, grade: p.grade, week: R.weekStars(p.id), total: Store.dataFor(p.id).stars })).sort((a, b) => b.week - a.week || b.total - a.total);

  window.GKA.Rewards = R;
})();
