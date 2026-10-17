/* Inserts extra questions right after an anchor string in a content file.
   Usage: node tools/add-questions.js <file> <json file with [[anchor, insertText], ...]> */
const fs = require("fs");
const [file, spec] = process.argv.slice(2);
let s = fs.readFileSync(file, "utf8");
for (const [anchor, add] of JSON.parse(fs.readFileSync(spec, "utf8"))) {
  const i = s.indexOf(anchor);
  if (i < 0 || s.indexOf(anchor, i + 1) >= 0) { console.log("anchor not unique or missing: " + anchor); process.exitCode = 1; continue; }
  s = s.slice(0, i + anchor.length) + ", " + add + s.slice(i + anchor.length);
}
fs.writeFileSync(file, s);
