/* One-time migration to per-grade content folders (content/<grade>/).
   Keeps every earlier level that fits its grade, merges its extra words, second story, extra questions and longer lesson,
   and renumbers it into the grade's 50-level path from the outline. Misplaced levels (for example the alphabet in Grade 3)
   are dropped. Run: node tools/migrate-grades.js <outline.md>  (then delete the old flat files with --clean) */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const outline = fs.readFileSync(process.argv[2], "utf8");
const clean = process.argv.includes("--clean");
const GRADES = ["kg", "g1", "g2", "g3", "g4", "g5", "g6"];
const gradeName = { kg: "Kindergarten", g1: "Grade 1", g2: "Grade 2", g3: "Grade 3", g4: "Grade 4", g5: "Grade 5", g6: "Grade 6" };

// ----- read the outline: old level -> new position, per subject and grade -----
const maps = { reading: {}, science: {}, understand: {} }; const stageNames = {};
let section = null;
for (const line of outline.split("\n")) {
  if (/^## READING/.test(line)) section = "reading"; else if (/^## SCIENCE/.test(line)) section = "science"; else if (/^## UNDERSTAND/.test(line)) section = "understand"; else if (/^## /.test(line)) section = null;
  const m = line.match(/^(KG|G\d)\s*(\[[^\]]*\])?:\s*(.*)$/); if (!section || !m) continue;
  const g = m[1].toLowerCase(); const map = maps[section][g] = {};
  if (m[2]) stageNames[g] = m[2].slice(1, -1).split(",").map((s) => s.trim());
  for (const seg of m[3].split("|").map((s) => s.trim())) {
    const range = seg.match(/^(\d+)-(\d+)\s+\*o(\d+)-o(\d+)/);
    if (range) { for (let i = 0; i <= +range[2] - +range[1]; i++) map[+range[3] + i] = +range[1] + i; continue; }
    const one = seg.match(/^(\d+)\b.*\*o(\d+)/); if (one) map[+one[2]] = +one[1];
  }
}

// ----- load the old flat content -----
global.window = { GKA: {} };
const oldFiles = fs.readdirSync(path.join(root, "content")).filter((f) => /\.js$/.test(f) && !["pictures.js", "math-lib.js"].includes(f));
new Function("window", fs.readFileSync(path.join(root, "content/math-lib.js"), "utf8"))(window);
for (const f of oldFiles) new Function("window", fs.readFileSync(path.join(root, "content", f), "utf8"))(window);
const parts = window.GKA.contentParts;
const base = {}, extra = {};
for (const p of parts) { const key = p.subject + ":" + p.grade; if (p.extra) extra[key] = p.levels; else (base[key] = base[key] || []).push(...p.levels); }

function merged(subject, grade, L) {
  const ex = (extra[subject + ":" + grade] || {})[L.n] || {};
  const out = Object.assign({}, L);
  delete out.gen;
  if (ex.words) out.words = (L.words || []).concat(ex.words);
  if (ex.story2) out.story2 = ex.story2;
  if (ex.questions) out.questions = (L.questions || []).concat(ex.questions);
  if (ex.lesson2) out.lesson = (L.lesson || "") + " " + ex.lesson2;
  return out;
}
const write = (grade, file, header, obj) => {
  const dir = path.join(root, "content", grade); fs.mkdirSync(dir, { recursive: true });
  const levels = obj.levels.map((L) => "  " + JSON.stringify(L)).join(",\n");
  const extraKeys = Object.keys(obj).filter((k) => !["subject", "grade", "levels"].includes(k)).map((k) => ", " + k + ": " + JSON.stringify(obj[k])).join("");
  fs.writeFileSync(path.join(dir, file), "/* " + header + " */\n(window.GKA = window.GKA || {}).contentParts = window.GKA.contentParts || [];\nwindow.GKA.contentParts.push({ subject: \"" + obj.subject + "\", grade: \"" + obj.grade + "\"" + extraKeys + ", levels: [\n" + levels + "\n] });\n");
};

const report = [];
for (const subject of ["reading", "science", "understand"]) for (const g of GRADES) {
  const map = maps[subject][g] || {};
  const src = subject === "understand" ? (base["understand:all"] || []) : (base[subject + ":" + g] || []);
  const kept = [];
  for (const L of src) { const nn = map[L.n]; if (!nn) continue; const out = merged(subject, subject === "understand" ? "all" : g, L); out.n = nn; if (subject === "understand") out.stage = Math.ceil(nn / 10); kept.push(out); }
  kept.sort((a, b) => a.n - b.n);
  const obj = { subject, grade: g, levels: kept };
  if (subject === "understand" && stageNames[g]) obj.stages = stageNames[g];
  const title = { reading: "Reading", science: "Science", understand: "Understand" }[subject];
  write(g, subject + "-01.js", title + " - " + gradeName[g] + ": levels kept from the earlier version, placed in this grade's 50-level path. New levels are in the other " + subject + " files of this folder.", obj);
  report.push(g + " " + subject + ": kept " + kept.length + " (" + kept.map((l) => l.n).join(",") + ")");
}
console.log(report.join("\n"));
if (clean) { for (const f of oldFiles) fs.unlinkSync(path.join(root, "content", f)); console.log("removed " + oldFiles.length + " old flat content files"); }
