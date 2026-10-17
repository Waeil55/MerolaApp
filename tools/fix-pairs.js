/* Turns word entries like ["go / went", "sentence"] into ["went", "go / went: sentence"] so every word can be spoken and typed. */
const fs = require("fs");
for (const f of process.argv.slice(2)) {
  let s = fs.readFileSync(f, "utf8"); let n = 0;
  s = s.replace(/\["([^"\/]+?) \/ ([^"]+?)", "([^"]*)"\]/g, (m, a, b, sent) => { n++; return '["' + b + '", "' + a + ' / ' + b + ': ' + sent + '"]'; });
  fs.writeFileSync(f, s); console.log(f + ": " + n + " pairs fixed");
}
