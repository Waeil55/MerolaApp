/* Rewrites the content <script> tags in index.html and artifact.html from the content folder:
   shared files first, then each grade folder (kg, g1 ... g6) in file-name order.
   Run after adding or removing content files:  node tools/build-index.js */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const GRADES = ["kg", "g1", "g2", "g3", "g4", "g5", "g6"];
const files = ["content/pictures.js", "content/math-lib.js", "content/math-more.js"];
for (const g of GRADES) {
  const dir = path.join(root, "content", g);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".js")).sort()) files.push("content/" + g + "/" + f);
}
for (const shell of ["index.html", "artifact.html"]) {
  const p = path.join(root, shell);
  const lines = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n").split("\n").filter((l) => !/^<script src="content\//.test(l));
  const at = lines.findIndex((l) => l.startsWith('<script src="js/util.js"'));
  if (at < 0) throw new Error(shell + ": js/util.js script tag not found");
  lines.splice(at, 0, ...files.map((f) => '<script src="' + f + '"></script>'));
  fs.writeFileSync(p, lines.join("\n"));
}
console.log("content scripts: " + files.length);
