/* Measures how hard every level is and reports steps that are too big.
   Reading: word length, syllables and story sentence length. Science: lesson sentence length and word length.
   Understand: words per passage and sentence length. Math: size of the answers from many generated problems.
   Usage: node tools/difficulty.js [--json] */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
global.window = { GKA: { contentParts: [] } };
global.document = undefined;
const load = (f) => new Function("window", fs.readFileSync(path.join(root, f), "utf8"))(window);
["content/pictures.js", "content/math-lib.js", "content/math-more.js"].forEach((f) => { try { load(f); } catch (e) { /* optional */ } });
for (const g of ["kg", "g1", "g2", "g3", "g4", "g5", "g6"]) for (const f of fs.readdirSync(path.join(root, "content", g)).sort()) load("content/" + g + "/" + f);

const syll = (w) => { w = String(w).toLowerCase().replace(/[^a-z]/g, ""); if (!w) return 0; if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, ""); const m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; };
const words = (t) => String(t || "").split(/\s+/).filter((x) => /[a-z]/i.test(x));
const sentences = (t) => String(t || "").split(/(?<=[.!?])\s+/).filter((s) => s.trim());
const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const median = (a) => { if (!a.length) return 0; const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)]; };

// Merge parts the same way the app does (base levels, then extras).
const table = {};
for (const p of window.GKA.contentParts) if (!p.extra) { const k = p.grade + ":" + p.subject; table[k] = (table[k] || []).concat(p.levels); }
for (const p of window.GKA.contentParts) if (p.extra) { const levels = table[p.grade + ":" + p.subject] || []; for (const n in p.levels) { const L = levels.find((x) => x.n === +n); const ex = p.levels[n]; if (!L) continue; if (ex.words) L.words = (L.words || []).concat(ex.words.map((w) => Array.isArray(w) ? { w: w[0], s: w[1] } : w)); if (ex.stories) L.stories = (L.stories || []).concat(ex.stories); if (ex.lesson2) L.lesson = (L.lesson || "") + " " + ex.lesson2; if (ex.items) L.items = (L.items || []).concat(ex.items); } }
const norm = (w) => Array.isArray(w) ? { w: w[0], s: w[1] } : w;

function score(subject, L) {
  if (subject === "reading") {
    const ws = (L.words || []).map(norm).map((w) => String(w.w));
    const st = (L.stories || (L.story ? [L.story] : [])).map((s) => s.text).join(" ");
    const sl = sentences(st).map((s) => words(s).length);
    return { wordLen: avg(ws.map((w) => w.replace(/[^a-z]/gi, "").length)), syll: avg(ws.map(syll)), sentLen: avg(sl), score: avg(ws.map(syll)) * 2 + avg(sl) * 0.35 };
  }
  if (subject === "science") {
    const sl = sentences(L.lesson).map((s) => words(s).length); const wl = avg(words(L.lesson).map((w) => w.replace(/[^a-z]/gi, "").length));
    return { sentLen: avg(sl), wordLen: wl, score: avg(sl) * 0.4 + wl * 1.2 };
  }
  if (subject === "understand") {
    const its = L.items || [];
    if (L.vocab || L.sort) return { stage: L.stage, score: L.stage * 2 };
    const texts = its.map((i) => i.text || i.t || "");
    const wc = median(texts.map((t) => words(t).length)); const sl = avg(texts.flatMap((t) => sentences(t).map((s) => words(s).length)));
    return { stage: L.stage, words: wc, sentLen: sl, score: L.stage * 2 + Math.log2(1 + wc) + sl * 0.25 };
  }
  if (subject === "math") {
    const vals = []; for (let i = 0; i < 60; i++) { try { const p = L.gen(); const n = parseFloat(String(p.answer).replace(/[^0-9.\-]/g, "")); if (isFinite(n)) vals.push(Math.abs(n)); } catch (e) { /* skip */ } }
    const m = median(vals); return { answer: m, score: Math.log10(1 + m) * 3 };
  }
  return { score: 0 };
}
const out = []; const jumps = [];
for (const g of ["kg", "g1", "g2", "g3", "g4", "g5", "g6"]) for (const subject of ["reading", "science", "understand", "math"]) {
  const levels = (table[g + ":" + subject] || []).slice().sort((a, b) => a.n - b.n);
  const rows = levels.map((L) => Object.assign({ n: L.n, name: L.name }, score(subject, L)));
  out.push({ g, subject, rows });
  // A jump: a level more than 35% harder than the average of the three before it (and not a review level).
  for (let i = 3; i < rows.length; i++) {
    const base = avg(rows.slice(i - 3, i).map((r) => r.score)); const r = rows[i];
    if (base > 0 && r.score > base * 1.35 && !/review/i.test(r.name)) jumps.push({ g, subject, n: r.n, name: r.name, from: +base.toFixed(2), to: +r.score.toFixed(2), rise: Math.round((r.score / base - 1) * 100) + "%" });
  }
}
if (process.argv.includes("--json")) console.log(JSON.stringify({ out, jumps }, null, 1));
else {
  for (const s of out) console.log(s.g.toUpperCase().padEnd(3), s.subject.padEnd(10), s.rows.map((r) => r.score.toFixed(1)).join(" "));
  console.log("\nbig steps (" + jumps.length + "):"); for (const j of jumps) console.log(" ", j.g, j.subject, "L" + j.n, j.name, j.from, "->", j.to, "(+" + j.rise + ")");
}
