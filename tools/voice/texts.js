/* Lists every sentence and word the app reads aloud from its lessons, so each can be recorded once.
   Run: node tools/voice/texts.js   -> writes tools/voice/texts.json ([{k, t, g}] in recording order) and prints totals.
   Order: words first, then sentences, grade by grade (KG first), so the most used clips are ready soonest. */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "..");
const VK = require(path.join(root, "js/voicekey.js"));
const GRADES = ["kg", "g1", "g2", "g3", "g4", "g5", "g6"];

global.window = { GKA: { U: { shuffle: (a) => a.slice() }, Store: {}, Engine: { MODE_INFO: {}, meta: {}, level: () => null } } };
const run = (f) => new Function("window", fs.readFileSync(path.join(root, f), "utf8"))(window);
run("content/math-lib.js"); run("content/math-more.js");
for (const g of GRADES) for (const f of fs.readdirSync(path.join(root, "content", g)).filter((f) => f.endsWith(".js")).sort()) run("content/" + g + "/" + f);
run("js/understand.js");
const E = window.GKA.Engine;

const clips = new Map(); // key -> { t, g, word, p }
let tier = 2; // 1 words, 2 lesson sentences, 3 fill-the-gap sentences (recorded last)
const add = (text, g) => {
  for (const s of VK.segments(text)) {
    const t = VK.spoken(s.t); if (!t || !/[A-Za-z]/.test(t)) continue;
    const k = VK.key(s.t); const word = !/\s/.test(t); const p = word ? 1 : tier; const old = clips.get(k); if (!old || p < old.p) clips.set(k, { t, g, word, p });
  }
};
const addWords = (text, g) => { for (const tok of String(text || "").split(/\s+/)) { const c = tok.replace(/[^A-Za-z0-9']/g, ""); if (c && /[A-Za-z]/.test(c)) add(c, g); } };
const addAll = (text, g) => { add(text, g); addWords(text, g); };

// Keys whose strings are read aloud (others hold emoji, evidence snippets, labels or ids).
const SPOKEN = new Set(["o", "words", "q", "t", "a", "text", "title", "items", "vocab", "lesson", "lesson2", "w", "s", "sort", "name", "skill", "sentence", "say"]);
const walk = (o, k, g) => {
  if (typeof o === "string") { if (SPOKEN.has(k)) addAll(o, g); return; }
  if (Array.isArray(o)) { o.forEach((x) => walk(x, k, g)); return; }
  if (o && typeof o === "object") for (const x in o) if (typeof o[x] !== "function") walk(o[x], /^\d+$/.test(x) ? k : x, g);
};

for (const g of GRADES) {
  const parts = window.GKA.contentParts.filter((p) => p.grade === g && p.subject !== "math");
  for (const p of parts) {
    walk(p.levels, "", g);
    const levels = Array.isArray(p.levels) ? p.levels : Object.values(p.levels);
    for (const L of levels) {
      // Word cards: "The word is ...", and the fill-the-gap sentence with the word said as "blank".
      for (const w of L.words || []) {
        const word = Array.isArray(w) ? w[0] : w.w, sent = Array.isArray(w) ? w[1] : w.s; if (!word) continue;
        if (sent) { const re = new RegExp("\\b" + String(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"); if (re.test(sent)) { tier = 3; add(sent.replace(re, "blank"), g); tier = 2; } }
      }
      // A story read with its title, as the library does.
      for (const st of [L.story, L.story2, ...(L.stories || [])].filter(Boolean)) if (st.title) add(st.title + ".", g);
    }
  }
}
// Reading tips (Understand) with their examples.
for (const t of Object.values(E.QTYPES || {})) { add(t.title + ".", "kg"); add(t.tip || "", "kg"); add("For example.", "kg"); if (t.ex) { addAll(t.ex.t, "kg"); add(t.ex.q, "kg"); add(t.ex.a + ".", "kg"); } }
// Fixed phrases, letters and small numbers.
["True or false?", "Is it", "or", "The word is", "This is how I sound.", "Learning is fun!", "Let's learn something new today."].forEach((s) => add(s, "kg"));
"abcdefghijklmnopqrstuvwxyz".split("").forEach((c) => add(c, "kg"));
for (let i = 0; i <= 100; i++) add(String(i), "kg");

const rank = (c) => c.p * 10 + GRADES.indexOf(c.g);
const list = [...clips.entries()].map(([k, c]) => ({ k, t: c.t, g: c.g, w: c.word ? 1 : 0, p: c.p })).sort((a, b) => rank(a) - rank(b));
fs.writeFileSync(path.join(__dirname, "texts.json"), JSON.stringify(list));
const chars = list.reduce((n, c) => n + c.t.length, 0);
const words = list.filter((c) => c.w).length;
console.log("clips: " + list.length + " (" + words + " single words, " + (list.length - words) + " sentences), " + chars + " characters, about " + Math.round(chars / 14 / 3600 + list.length * 0.25 / 3600) + " hours of speech");
for (const p of [1, 2, 3]) { const l = list.filter((c) => c.p === p); console.log("  tier " + p + ": " + l.length + " clips, " + l.reduce((n, c) => n + c.t.length, 0) + " chars"); }
for (const g of GRADES) { const l = list.filter((c) => c.g === g); console.log("  " + g + ": " + l.length + " clips, " + l.reduce((n, c) => n + c.t.length, 0) + " chars"); }
