/* Checks all study content: every grade (KG-G6) must have levels 1-50 in Reading, Math, Science and Understand,
   and every level must be well formed (words, stories, lessons, questions, evidence, math generators).
   Run: node tools/check-content.js [--quiet]   (exit code 1 when there are errors) */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const GRADES = ["kg", "g1", "g2", "g3", "g4", "g5", "g6"];
const SUBJECTS = ["reading", "math", "science", "understand"];
const quiet = process.argv.includes("--quiet");
global.window = { GKA: { U: { shuffle: (a) => a.slice() }, Store: {}, Engine: { MODE_INFO: {}, meta: {}, level: () => null } } };
new Function("window", fs.readFileSync(path.join(root, "content/math-lib.js"), "utf8"))(window);
new Function("window", fs.readFileSync(path.join(root, "content/math-more.js"), "utf8"))(window);
for (const g of GRADES) { const dir = path.join(root, "content", g); if (!fs.existsSync(dir)) continue; for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort()) { try { new Function("window", fs.readFileSync(path.join(dir, f), "utf8"))(window); } catch (e) { console.log("x " + g + "/" + f + ": " + e.message); process.exitCode = 1; } } }
new Function("window", fs.readFileSync(path.join(root, "js/understand.js"), "utf8"))(window);
const E = window.GKA.Engine;
const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);
const uniq = (a) => new Set(a.map((x) => String(x).toLowerCase())).size === a.length;
const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const LITERAL = ["who", "what", "where", "when", "how", "why", "fact"];
const table = {};
for (const g of GRADES) for (const s of SUBJECTS) table[g + ":" + s] = [];
for (const p of window.GKA.contentParts) { if (!table[p.grade + ":" + p.subject]) { err("unknown grade or subject " + p.grade + "/" + p.subject); continue; } table[p.grade + ":" + p.subject].push(...p.levels); }

function checkStory(at, st) {
  if (!st || !st.title || !st.text) return err(at + " story needs title and text");
  if (!st.questions || st.questions.length < 3) err(at + " story \"" + st.title + "\" needs 3+ questions");
  for (const q of st.questions || []) { const a = q.a || 0; if (!q.q || !q.o || q.o.length < 3 || !uniq(q.o) || !q.o[a]) err(at + " story question bad: " + q.q); }
}
function checkReading(at, L) {
  if (!L.words || L.words.length < (L.letters ? 8 : 12)) err(at + " needs " + (L.letters ? 8 : 12) + "+ words (has " + (L.words || []).length + ")");
  for (const w of L.words || []) { const ok = Array.isArray(w) ? w.length >= 2 && w[0] && w[w.length - 1] : w && w.w && w.s; if (!ok) err(at + " bad word entry " + JSON.stringify(w)); }
  const ws = (L.words || []).map((w) => String(Array.isArray(w) ? w[0] : w.w).toLowerCase()); if (!L.letters && !uniq(ws)) warn(at + " repeats a word: " + ws.filter((w, i) => ws.indexOf(w) !== i).join(", "));
  checkStory(at, L.story); if (L.story2) checkStory(at, L.story2); else warn(at + " has one story");
  if (typeof L.speed !== "number") err(at + " needs speed");
}
function checkScience(at, L) {
  if (words(L.lesson) < 35) err(at + " lesson too short (" + words(L.lesson) + " words)");
  if (!L.words || L.words.length < 5) err(at + " needs 5+ key words");
  if (!L.questions || L.questions.length < 8) err(at + " needs 8+ questions (has " + (L.questions || []).length + ")");
  for (const q of L.questions || []) {
    if (q.t === "mc") { const a = q.a || 0; if (!q.o || q.o.length < 3 || !uniq(q.o) || !q.o[a]) err(at + " mc bad: " + q.q); }
    else if (q.t === "tf") { if (typeof q.a !== "boolean") err(at + " tf needs a: " + q.q); }
    else if (q.t === "order") { if (!q.items || q.items.length < 3) err(at + " order needs 3+ items: " + q.q); }
    else err(at + " unknown question type " + q.t);
  }
  if (typeof L.speed !== "number") err(at + " needs speed");
}
function checkMath(at, L) {
  if (typeof L.gen !== "function") return err(at + " needs gen");
  if (typeof L.wp !== "function") err(at + " needs wp (word problems)");
  for (const [name, fn] of [["gen", L.gen], ["wp", L.wp]]) {
    if (typeof fn !== "function") continue;
    for (let i = 0; i < 25; i++) {
      let p; try { p = fn(); } catch (e) { err(at + " " + name + " throws: " + e.message); break; }
      if (!p || !p.q || p.answer == null || String(p.answer) === "" || String(p.answer) === "NaN" || /undefined|NaN/.test(p.q)) { err(at + " " + name + " bad problem: " + JSON.stringify(p && { q: p.q, a: p.answer })); break; }
      if (p.options && !p.options.map(String).includes(String(p.answer))) { err(at + " " + name + " options miss the answer: " + p.q + " -> " + p.answer); break; }
    }
  }
}
function checkUnderstand(at, L) {
  if (!L.stage || L.stage < 1 || L.stage > 5) err(at + " needs stage 1-5");
  if (L.tip && !E.QTYPES[L.tip]) err(at + " unknown tip " + L.tip);
  if (L.vocab) { if (L.vocab.length < 8) err(at + " needs 8+ picture words"); if (!uniq(L.vocab.map((v) => v[0])) || !uniq(L.vocab.map((v) => v[1]))) err(at + " repeats a word or picture"); return; }
  if (L.sort) { for (const s of L.sort) if (!["who", "what", "where", "when"].includes(s[2])) err(at + " bad sort " + s); if (L.sort.length < 8) err(at + " needs 8+ sort words"); return; }
  if (!L.items || !L.items.length) return err(at + " needs items");
  if (L.items[0].t) {
    if (L.items.length < 8) err(at + " needs 8+ sentences");
    for (const it of L.items) {
      if (!E.QTYPES[it.k]) err(at + " unknown type " + it.k);
      if (it.k === "tf") { if (typeof it.a !== "boolean" || !it.q) err(at + " tf needs q and a: " + it.t); continue; }
      if (!it.o || it.o.length < 3 || !uniq(it.o)) err(at + " needs 3 different options: " + it.t);
      if (it.k !== "pic" && !it.q) err(at + " missing question: " + it.t);
    }
    return;
  }
  let qn = 0;
  for (const it of L.items) {
    if (!it.text) { err(at + " passage needs text"); continue; }
    const paras = E.splitText(it.text); const sentences = paras.flat();
    for (const q of it.qs || []) {
      qn++; const tag = at + " \"" + q.q + "\"";
      if (!E.QTYPES[q.k]) err(tag + " unknown type " + q.k);
      if (q.items) { if (q.items.length < 3 || !uniq(q.items)) err(tag + " order needs 3+ items"); continue; }
      if (q.k === "tf") { if (typeof q.a !== "boolean") err(tag + " tf needs a"); }
      else if (!q.o || q.o.length < 3 || !uniq(q.o)) err(tag + " needs 3 different options");
      if (q.e) { const hits = sentences.filter((s) => s.toLowerCase().includes(q.e.toLowerCase())); if (!hits.length) err(tag + " evidence not found: \"" + q.e + "\""); }
      else if (LITERAL.includes(q.k) || q.k === "tf") warn(tag + " has no evidence words");
    }
  }
  if (qn < 6) err(at + " needs 6+ questions (has " + qn + ")");
}
const CHECK = { reading: checkReading, math: checkMath, science: checkScience, understand: checkUnderstand };
const lines = [];
let total = 0, done = 0;
for (const g of GRADES) {
  const row = [];
  for (const s of SUBJECTS) {
    const levels = table[g + ":" + s]; const ns = levels.map((l) => l.n);
    const missing = []; for (let i = 1; i <= 50; i++) if (!ns.includes(i)) missing.push(i);
    const dups = ns.filter((n, i) => ns.indexOf(n) !== i); if (dups.length) err(g + " " + s + " duplicate levels " + dups.join(","));
    const extra = ns.filter((n) => n < 1 || n > 50); if (extra.length) err(g + " " + s + " levels out of range " + extra.join(","));
    for (const L of levels) { if (!L.name || !L.skill) err(g + " " + s + " L" + L.n + " needs name and skill"); CHECK[s](g + " " + s + " L" + L.n, L); }
    total += 50; done += 50 - missing.length;
    row.push(s + " " + (50 - missing.length) + "/50" + (missing.length && missing.length < 50 ? " (missing " + compact(missing) + ")" : ""));
    if (missing.length) err(g + " " + s + " missing " + missing.length + " levels");
  }
  lines.push(g.toUpperCase().padEnd(3) + " " + row.join(" | "));
}
function compact(a) { const out = []; for (let i = 0; i < a.length; i++) { let j = i; while (j + 1 < a.length && a[j + 1] === a[j] + 1) j++; out.push(i === j ? a[i] : a[i] + "-" + a[j]); i = j; } return out.join(","); }
console.log(lines.join("\n"));
console.log("\nlevels: " + done + " / " + total);
const missingOnly = errors.filter((e) => /missing \d+ levels/.test(e)).length;
if (!quiet && warns.length) { console.log("\nwarnings (" + warns.length + "):"); warns.slice(0, 40).forEach((w) => console.log("  - " + w)); if (warns.length > 40) console.log("  ..."); }
const real = errors.filter((e) => !/missing \d+ levels/.test(e));
if (real.length) { console.log("\nERRORS (" + real.length + "):"); real.slice(0, 60).forEach((e) => console.log("  x " + e)); if (real.length > 60) console.log("  ..."); }
if (errors.length) process.exitCode = 1; else console.log("\nall content complete, no errors");
if (missingOnly && !real.length) console.log("\n(no errors in the levels that exist; " + missingOnly + " grade/subject paths still incomplete)");
