/* Writes CURRICULUM.md: every level of every subject for every grade, read straight from the content files.
   Run: node tools/build-curriculum.js */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const GRADES = [["kg", "Kindergarten"], ["g1", "Grade 1"], ["g2", "Grade 2"], ["g3", "Grade 3"], ["g4", "Grade 4"], ["g5", "Grade 5"], ["g6", "Grade 6"]];
const SUBJECTS = [["reading", "Reading"], ["math", "Math"], ["science", "Science"], ["understand", "Understand"]];
global.window = { GKA: { U: { shuffle: (a) => a.slice() }, Store: {}, Engine: { MODE_INFO: {}, meta: {}, level: () => null } } };
for (const f of ["content/math-lib.js", "content/math-more.js"]) new Function("window", fs.readFileSync(path.join(root, f), "utf8"))(window);
for (const [g] of GRADES) for (const f of fs.readdirSync(path.join(root, "content", g)).filter((f) => f.endsWith(".js")).sort()) new Function("window", fs.readFileSync(path.join(root, "content", g, f), "utf8"))(window);
const table = {}, stages = {};
for (const p of window.GKA.contentParts) { if (p.extra) continue; const k = p.grade + ":" + p.subject; (table[k] = table[k] || []).push(...p.levels); if (p.stages) stages[k] = p.stages; }
const esc = (s) => String(s || "").replace(/\|/g, "\\|");
let md = "# Genius Kids Academy curriculum\n\nEvery grade has its own 50 levels in each of the four subjects: 7 grades x 4 subjects x 50 levels = 1,400 levels.\nThis file is generated from the content files by `node tools/build-curriculum.js`.\n";
for (const [g, gname] of GRADES) {
  md += "\n## " + gname + "\n";
  for (const [s, sname] of SUBJECTS) {
    const levels = (table[g + ":" + s] || []).slice().sort((a, b) => a.n - b.n);
    md += "\n### " + gname + " " + sname + " (" + levels.length + " levels)\n\n";
    if (s === "understand" && stages[g + ":" + s]) md += "Stages: " + stages[g + ":" + s].map((x, i) => (i + 1) + ". " + x).join(", ") + "\n\n";
    md += "| Level | Name | Skill |\n|---|---|---|\n";
    for (const L of levels) md += "| " + L.n + " | " + esc(L.name) + " | " + esc(L.skill) + " |\n";
  }
}
fs.writeFileSync(path.join(root, "CURRICULUM.md"), md);
console.log("CURRICULUM.md written: " + Object.values(table).reduce((a, l) => a + l.length, 0) + " levels");
