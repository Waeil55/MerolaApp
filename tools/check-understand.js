/* Checks the Understand content (content/understand-*.js): 50 levels, valid question types and options,
   evidence words that really appear in the text, long-story questions that land in a paragraph, and placement items.
   Run:  node tools/check-understand.js   (exit code 1 when there are errors) */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = { GKA: { U: { shuffle: (a) => a.slice() }, Store: {}, Engine: { MODE_INFO: {}, level: () => null } } };
for (const f of fs.readdirSync(path.join(root, "content")).filter((f) => /^understand-\d+\.js$/.test(f)).sort()) new Function("window", fs.readFileSync(path.join(root, "content", f), "utf8"))(window);
new Function("window", fs.readFileSync(path.join(root, "js/understand.js"), "utf8"))(window);
const E = window.GKA.Engine;
const levels = window.GKA.contentParts.filter((p) => p.subject === "understand").flatMap((p) => p.levels).sort((a, b) => a.n - b.n);
const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);
const LITERAL = ["who", "what", "where", "when", "how", "why", "fact"];
const uniq = (a) => new Set(a.map((x) => String(x).toLowerCase())).size === a.length;

const ns = levels.map((l) => l.n);
for (let i = 1; i <= 50; i++) if (ns.filter((n) => n === i).length !== 1) err("level " + i + " missing or duplicated");
let questions = 0, words = 0;
for (const L of levels) {
  const at = "L" + L.n;
  if (!L.name || !L.skill || !L.stage) err(at + " needs name, skill and stage");
  if (L.tip && !E.QTYPES[L.tip]) err(at + " unknown tip " + L.tip);
  if (L.stage === 1) {
    if (L.vocab) { if (L.vocab.length < 8) err(at + " needs 8+ words"); if (!uniq(L.vocab.map((v) => v[0])) || !uniq(L.vocab.map((v) => v[1]))) err(at + " duplicate word or picture"); words += L.vocab.length; }
    else if (L.sort) { for (const s of L.sort) if (!["who", "what", "where", "when"].includes(s[2])) err(at + " bad sort type " + s); words += L.sort.length; }
    else err(at + " stage 1 needs vocab or sort");
    continue;
  }
  if (L.stage === 2) {
    if (!L.items || L.items.length < 8) err(at + " needs 8+ sentences");
    for (const it of L.items) {
      questions++;
      if (!E.QTYPES[it.k]) err(at + " unknown type " + it.k);
      if (it.k === "tf") { if (typeof it.a !== "boolean" || !it.q) err(at + " tf needs q and a: " + it.t); continue; }
      if (!it.o || it.o.length < 3 || !uniq(it.o)) err(at + " needs 3 different options: " + it.t);
      if (it.k === "pic") continue;
      if (!it.q) err(at + " missing question: " + it.t);
      if (LITERAL.includes(it.k)) { const keys = E.keyTokens(it.o[0]); const toks = new Set(E.keyTokens(it.t)); if (keys.length && !keys.some((k) => toks.has(k))) warn(at + " answer words not in sentence: \"" + it.o[0] + "\" / " + it.t); }
    }
    continue;
  }
  for (const it of L.items || []) {
    const paras = E.splitText(it.text); const sentences = paras.flat();
    if (L.stage === 5 && paras.length < 3) err(at + " long story needs 3+ parts");
    if (L.stage === 5 && it.qs.length < 7) err(at + " long story needs 7+ questions");
    if (L.stage <= 4 && paras.length !== 1) err(at + " short text should be one paragraph: " + (it.title || it.text.slice(0, 30)));
    for (const q of it.qs) {
      questions++;
      const tag = at + " \"" + q.q + "\"";
      if (!E.QTYPES[q.k]) err(tag + " unknown type " + q.k);
      if (q.items) { if (q.items.length < 3 || !uniq(q.items)) err(tag + " order needs 3+ different items"); continue; }
      if (q.k === "tf") { if (typeof q.a !== "boolean") err(tag + " tf needs a: true/false"); }
      else if (!q.o || q.o.length < 3 || !uniq(q.o)) err(tag + " needs 3 different options");
      if (q.e) {
        const hits = sentences.filter((s) => s.toLowerCase().includes(q.e.toLowerCase()));
        if (!hits.length) err(tag + " evidence not found: \"" + q.e + "\"");
        else if (hits.length > 1) warn(tag + " evidence matches " + hits.length + " sentences: \"" + q.e + "\"");
        if (hits.length && q.o && LITERAL.includes(q.k)) { const keys = E.keyTokens(q.o[0]); const toks = new Set(E.keyTokens(hits[0])); if (keys.length && !keys.some((k) => toks.has(k))) warn(tag + " answer words not in its evidence sentence: \"" + q.o[0] + "\""); }
      } else if (LITERAL.includes(q.k) || q.k === "tf") warn(tag + " has no evidence words");
    }
  }
}
// placement items the engine uses
const lv = (n) => levels.find((l) => l.n === n);
for (const [n, item, qs, firstPara] of [[23, 0, [0, 1]], [35, 0, [2, 3]], [41, 0, [0, 1], true]]) {
  const it = lv(n) && lv(n).items[item]; if (!it) { err("placement item missing L" + n); continue; }
  const paras = E.splitText(it.text);
  for (const qi of qs) { const q = it.qs[qi]; if (!q || !q.e || !q.o) { err("placement L" + n + " q" + qi + " needs options and evidence"); continue; } const loc = E.locate(firstPara ? paras.slice(0, 1) : paras, q.e); if (!loc) err("placement L" + n + " q" + qi + " evidence not in the shown text"); }
}
if (!lv(15) || !lv(15).items[1] || !lv(15).items[3]) err("placement needs L15 items 1 and 3");
if (!lv(5) || !lv(8)) err("placement needs L5 and L8");

console.log("Understand content: " + levels.length + " levels, " + words + " words, " + questions + " questions");
const per = [1, 2, 3, 4, 5].map((s) => levels.filter((l) => l.stage === s).length);
console.log("levels per stage: " + per.join(" / "));
if (warns.length) { console.log("\nwarnings (" + warns.length + "):"); warns.forEach((w) => console.log("  - " + w)); }
if (errors.length) { console.log("\nERRORS (" + errors.length + "):"); errors.forEach((e) => console.log("  x " + e)); process.exit(1); }
console.log("\nno errors");
