/* Copies the app into www/ for the iPhone and Android apps (Capacitor). Run: node tools/build-native.js
   The recorded voice clips are not copied: the apps stream them from the website and keep each one after it plays,
   so the store download stays small. The service worker is left out: the apps already have every file. */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const out = path.join(root, "www");
fs.rmSync(out, { recursive: true, force: true });
const copy = (rel) => {
  const src = path.join(root, rel), dst = path.join(out, rel);
  if (fs.statSync(src).isDirectory()) { for (const f of fs.readdirSync(src)) copy(path.join(rel, f)); return; }
  fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst);
};
["index.html", "styles.css", "manifest.webmanifest", "privacy.html", "fonts", "js", "content", "icons"].forEach((f) => { if (fs.existsSync(path.join(root, f))) copy(f); });
let files = 0, bytes = 0;
const count = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) count(p); else { files++; bytes += fs.statSync(p).size; } } };
count(out);
console.log("www: " + files + " files, " + (bytes / 1048576).toFixed(1) + " MB");
