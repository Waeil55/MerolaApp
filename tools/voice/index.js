/* Lists the recorded voice clips in audio/v1/index.txt, which the app reads to know what it can play.
   Run after recording and before every commit: node tools/voice/index.js */
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "..", "audio", "v1");
const keys = [];
let bytes = 0;
for (const sub of fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []) {
  const p = path.join(dir, sub); if (!fs.statSync(p).isDirectory()) continue;
  for (const f of fs.readdirSync(p)) if (f.endsWith(".mp3")) { const size = fs.statSync(path.join(p, f)).size; if (size > 200) { keys.push(f.slice(0, -4)); bytes += size; } }
}
keys.sort();
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "index.txt"), keys.join("\n") + "\n");
let total = 0; try { total = JSON.parse(fs.readFileSync(path.join(__dirname, "texts.json"), "utf8")).length; } catch (e) { /* list not built */ }
console.log("index.txt: " + keys.length + " clips" + (total ? " of " + total + " (" + Math.round(keys.length / total * 100) + "%)" : "") + ", " + (bytes / 1048576).toFixed(1) + " MB");
