/* Turns word entries like ["go / went", "sentence"] or ["hot : cold", "sentence"] into ["went", "go / went: sentence"]
   so every word in a level can be spoken and typed. Run: node tools/fix-pairs.js <files...> */
const fs = require("fs");
for (const f of process.argv.slice(2)) {
  let s = fs.readFileSync(f, "utf8"); let n = 0;
  s = s.replace(/\["([^"\/:]+?) (\/|:) ([^"]+?)", "([^"]*)"\]/g, (m, a, sep, b, sent) => { n++; return '["' + b + '", "' + a + ' ' + sep + ' ' + b + ': ' + sent + '"]'; });
  fs.writeFileSync(f, s); console.log(f + ": " + n + " pairs fixed");
}
