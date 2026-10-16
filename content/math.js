/* Genius Kids Academy - Math content: 20 levels of generators plus word problems.
   Each level: gen() returns a problem { q, say, answer, options, visual, hint, kind }.
   q = text shown, say = text read aloud, answer = string, options = 4 choices for Pick mode. */
window.GKA = window.GKA || {};
window.GKA.content = window.GKA.content || {};
(function () {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const NUM_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function numWord(n) {
    if (n <= 20) return NUM_WORDS[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? "-" + NUM_WORDS[n % 10] : "");
    if (n < 1000) return NUM_WORDS[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numWord(n % 100) : "");
    return String(n);
  }
  // Build 4 options around the answer, all distinct and non-negative.
  function opts(answer, spread, min) {
    min = min == null ? 0 : min;
    const set = new Set([answer]);
    let guard = 0;
    while (set.size < 4 && guard++ < 60) {
      const d = R(1, spread) * (Math.random() < 0.5 ? -1 : 1);
      const v = answer + d;
      if (v >= min) set.add(v);
    }
    while (set.size < 4) set.add(answer + set.size + 1);
    return shuffle([...set]).map(String);
  }
  function wordOpts(answer, pool) {
    const set = new Set([answer]);
    const p = shuffle(pool.filter((x) => x !== answer));
    for (const x of p) { if (set.size >= 4) break; set.add(x); }
    return shuffle([...set]);
  }
  const P = (o) => Object.assign({ kind: "number" }, o);

  const levels = [
    {
      n: 1, name: "Count to 10", skill: "Count objects up to 10", speed: 2,
      gen() { const n = R(1, 10); const thing = pick(["apples", "stars", "cats", "balls", "fish"]);
        return P({ q: "How many " + thing + "?", say: "Count the " + thing + ". How many are there?", answer: String(n), options: opts(n, 2, 1), visual: { type: "dots", n, group: 5 }, hint: "Touch each one as you count." }); },
      words: [
        { q: "Ana has 3 red balls and 2 blue balls. How many balls does she have?", answer: "5" },
        { q: "There are 4 ducks in the pond. 1 more duck comes. How many ducks now?", answer: "5" },
        { q: "Sam sees 6 birds on a wire. 2 fly away. How many birds are left?", answer: "4" },
        { q: "A box has 7 crayons. Mia adds 3 more. How many crayons are in the box?", answer: "10" }
      ]
    },
    {
      n: 2, name: "Numbers to 20", skill: "Read number words and count to 20", speed: 2,
      gen() {
        if (Math.random() < 0.5) { const n = R(0, 20); return P({ q: numWord(n), say: "Which number is " + numWord(n) + "?", answer: String(n), options: opts(n, 3, 0), hint: "Say the word slowly, then find the number.", kind: "numberword" }); }
        const n = R(11, 20); return P({ q: "How many dots?", say: "Count the dots. How many are there?", answer: String(n), options: opts(n, 2, 1), visual: { type: "dots", n, group: 5 }, hint: "Count a row of 5, then keep going." });
      },
      words: [
        { q: "Leo has 10 marbles. His friend gives him 5 more. How many marbles does Leo have?", answer: "15" },
        { q: "There are 12 eggs in a box. 2 eggs break. How many good eggs are left?", answer: "10" },
        { q: "A bus has 14 kids. 6 more get on. How many kids are on the bus?", answer: "20" },
        { q: "Zoe counts 18 steps up and then 10 steps down. How many steps is she above the start?", answer: "8" }
      ]
    },
    {
      n: 3, name: "Add within 10", skill: "Add two small numbers", speed: 2,
      gen() { const a = R(0, 9), b = R(0, 10 - a); const s = a + b;
        return P({ q: a + " + " + b + " = ?", say: "What is " + a + " plus " + b + "?", answer: String(s), options: opts(s, 2, 0), visual: { type: "twogroups", a, b }, hint: "Count all the dots together." }); },
      words: [
        { q: "Ben has 4 cookies. Mom gives him 3 more. How many cookies does Ben have?", answer: "7" },
        { q: "There are 5 frogs on a log and 4 frogs in the water. How many frogs in all?", answer: "9" },
        { q: "Lily picked 2 flowers. Then she picked 6 more. How many flowers did she pick?", answer: "8" },
        { q: "A team scores 3 goals in the first half and 3 in the second half. How many goals in all?", answer: "6" }
      ]
    },
    {
      n: 4, name: "Subtract within 10", skill: "Take away from small numbers", speed: 2,
      gen() { const a = R(1, 10), b = R(0, a); const s = a - b;
        return P({ q: a + " − " + b + " = ?", say: "What is " + a + " minus " + b + "?", answer: String(s), options: opts(s, 2, 0), visual: { type: "takeaway", a, b }, hint: "Start with " + a + " and cross out " + b + "." }); },
      words: [
        { q: "There are 9 apples on a tree. 4 fall down. How many apples are still on the tree?", answer: "5" },
        { q: "Tom has 8 stickers. He gives 3 to his sister. How many stickers does Tom have now?", answer: "5" },
        { q: "10 kids are playing. 6 go home. How many kids are still playing?", answer: "4" },
        { q: "A cat had 7 toys. It lost 2 under the couch. How many toys can the cat find?", answer: "5" }
      ]
    },
    {
      n: 5, name: "Add within 20", skill: "Add across ten", speed: 1.5,
      gen() { const a = R(5, 12), b = R(3, 20 - a); const s = a + b;
        return P({ q: a + " + " + b + " = ?", say: "What is " + a + " plus " + b + "?", answer: String(s), options: opts(s, 3, 0), visual: { type: "twogroups", a, b }, hint: "Make a ten first. " + a + " plus " + (10 - a > 0 ? (10 - a) : 0) + " is ten." }); },
      words: [
        { q: "Maya read 8 pages on Monday and 7 pages on Tuesday. How many pages did she read?", answer: "15" },
        { q: "A jar has 9 red beads and 9 blue beads. How many beads are in the jar?", answer: "18" },
        { q: "Dad baked 12 muffins. Grandma baked 6 more. How many muffins are there?", answer: "18" },
        { q: "In a race, Ali ran 7 laps and then 5 more laps. How many laps did he run?", answer: "12" }
      ]
    },
    {
      n: 6, name: "Subtract within 20", skill: "Subtract across ten", speed: 1.5,
      gen() { const a = R(11, 20), b = R(2, a - 1); const s = a - b;
        return P({ q: a + " − " + b + " = ?", say: "What is " + a + " minus " + b + "?", answer: String(s), options: opts(s, 3, 0), visual: { type: "takeaway", a, b }, hint: "Take away to ten first, then take the rest." }); },
      words: [
        { q: "There were 15 balloons. 7 popped. How many balloons are left?", answer: "8" },
        { q: "Nina had 18 grapes. She ate 9. How many grapes are left?", answer: "9" },
        { q: "A shelf holds 20 books. 13 are checked out. How many books are on the shelf?", answer: "7" },
        { q: "Omar had 16 coins. He spent 8. How many coins does he have now?", answer: "8" }
      ]
    },
    {
      n: 7, name: "Tens and ones", skill: "Place value to 99", speed: 1.5,
      gen() {
        const n = R(10, 99); const t = Math.floor(n / 10), o = n % 10;
        const kind = R(1, 3);
        if (kind === 1) return P({ q: "How many tens in " + n + "?", say: "How many tens are in " + n + "?", answer: String(t), options: opts(t, 2, 0), visual: { type: "blocks", n }, hint: "Each long rod is one ten." });
        if (kind === 2) return P({ q: "How many ones in " + n + "?", say: "How many ones are in " + n + "?", answer: String(o), options: opts(o, 2, 0), visual: { type: "blocks", n }, hint: "The small cubes are ones." });
        return P({ q: t + " tens and " + o + " ones = ?", say: t + " tens and " + o + " ones make what number?", answer: String(n), options: opts(n, 10, 0), visual: { type: "blocks", n }, hint: "Count the rods by tens, then add the cubes." });
      },
      words: [
        { q: "Jada has 3 bags of 10 marbles and 4 loose marbles. How many marbles does she have?", answer: "34" },
        { q: "A number has 6 tens and 2 ones. What is the number?", answer: "62" },
        { q: "How many tens are in 85?", answer: "8" },
        { q: "Which number is 10 more than 47?", answer: "57" }
      ]
    },
    {
      n: 8, name: "Add 2-digit numbers", skill: "Add without carrying", speed: 1.2,
      gen() { let a, b; do { a = R(10, 88); b = R(10, 99 - a); } while ((a % 10) + (b % 10) > 9); const s = a + b;
        return P({ q: a + " + " + b + " = ?", say: "What is " + a + " plus " + b + "?", answer: String(s), options: opts(s, 10, 0), hint: "Add the ones, then add the tens." }); },
      words: [
        { q: "A farmer has 23 cows and 45 sheep. How many animals does the farmer have?", answer: "68" },
        { q: "Kim scored 31 points. Lee scored 26 points. How many points together?", answer: "57" },
        { q: "A library got 42 new books in March and 35 in April. How many new books?", answer: "77" },
        { q: "There are 14 red cars and 52 blue cars in the lot. How many cars?", answer: "66" }
      ]
    },
    {
      n: 9, name: "Add with regrouping", skill: "Carry a ten when the ones go over 9", speed: 1.2,
      gen() { let a, b; do { a = R(15, 89); b = R(15, 99 - a); } while ((a % 10) + (b % 10) <= 9); const s = a + b;
        return P({ q: a + " + " + b + " = ?", say: "What is " + a + " plus " + b + "?", answer: String(s), options: opts(s, 10, 0), hint: "The ones make more than 9. Carry one ten over." }); },
      words: [
        { q: "Sara collected 38 shells on Saturday and 27 on Sunday. How many shells did she collect?", answer: "65" },
        { q: "A bakery sold 49 cupcakes in the morning and 36 in the afternoon. How many cupcakes?", answer: "85" },
        { q: "Amir has 57 stamps. He gets 28 more. How many stamps now?", answer: "85" },
        { q: "The first bus holds 46 kids and the second holds 47. How many kids fit on both?", answer: "93" }
      ]
    },
    {
      n: 10, name: "Subtract 2-digit numbers", skill: "Subtract with borrowing", speed: 1.2,
      gen() { const a = R(30, 99), b = R(11, a - 5); const s = a - b;
        return P({ q: a + " − " + b + " = ?", say: "What is " + a + " minus " + b + "?", answer: String(s), options: opts(s, 10, 0), hint: (a % 10) < (b % 10) ? "Not enough ones. Borrow a ten." : "Subtract the ones, then the tens." }); },
      words: [
        { q: "A store had 72 toys. It sold 35. How many toys are left?", answer: "37" },
        { q: "Mark had 90 cents. He spent 54 cents. How much does he have left?", answer: "36" },
        { q: "The pool is 81 steps away. Eva has walked 47 steps. How many steps are left?", answer: "34" },
        { q: "There are 64 birds in a tree. 29 fly away. How many birds remain?", answer: "35" }
      ]
    },
    {
      n: 11, name: "Skip counting", skill: "Count by 2s, 5s and 10s", speed: 1,
      gen() { const step = pick([2, 5, 10]); const start = step * R(1, 6); const seq = [start, start + step, start + step * 2]; const next = start + step * 3;
        return P({ q: seq.join(", ") + ", ?", say: "Count by " + step + "s. " + seq.join(", ") + ". What comes next?", answer: String(next), options: opts(next, step, 0), hint: "Add " + step + " each time.", kind: "sequence" }); },
      words: [
        { q: "Each hand has 5 fingers. How many fingers on 4 hands?", answer: "20" },
        { q: "Socks come in pairs. How many socks are in 6 pairs?", answer: "12" },
        { q: "There are 10 pencils in a box. How many pencils in 7 boxes?", answer: "70" },
        { q: "Count by 5s: 5, 10, 15, 20. What number comes next?", answer: "25" }
      ]
    },
    {
      n: 12, name: "Multiply by 2, 5, 10", skill: "Groups of 2, 5 and 10", speed: 1,
      gen() { const a = pick([2, 5, 10]), b = R(1, 10); const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a]; const s = x * y;
        return P({ q: x + " × " + y + " = ?", say: "What is " + x + " times " + y + "?", answer: String(s), options: opts(s, 5, 0), visual: { type: "array", rows: Math.min(x, y), cols: Math.max(x, y) }, hint: "Count the rows in the array." }); },
      words: [
        { q: "There are 5 tables with 4 chairs at each table. How many chairs?", answer: "20" },
        { q: "A spider has 8 legs. How many legs do 2 spiders have?", answer: "16" },
        { q: "Each pack has 10 cards. How many cards in 6 packs?", answer: "60" },
        { q: "Rania buys 7 bags with 5 oranges in each. How many oranges?", answer: "35" }
      ]
    },
    {
      n: 13, name: "Multiply by 3 and 4", skill: "Groups of 3 and 4", speed: 1,
      gen() { const a = pick([3, 4]), b = R(1, 10); const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a]; const s = x * y;
        return P({ q: x + " × " + y + " = ?", say: "What is " + x + " times " + y + "?", answer: String(s), options: opts(s, 4, 0), visual: { type: "array", rows: Math.min(x, y), cols: Math.max(x, y) }, hint: "Skip count: " + a + ", " + (a * 2) + ", " + (a * 3) + "..." }); },
      words: [
        { q: "A tricycle has 3 wheels. How many wheels do 6 tricycles have?", answer: "18" },
        { q: "There are 4 rows of 7 plants. How many plants?", answer: "28" },
        { q: "Each box holds 3 balls. How many balls in 9 boxes?", answer: "27" },
        { q: "A dog has 4 legs. How many legs do 8 dogs have?", answer: "32" }
      ]
    },
    {
      n: 14, name: "Multiply by 6 to 9", skill: "The harder times tables", speed: 0.9,
      gen() { const a = R(6, 9), b = R(2, 10); const [x, y] = Math.random() < 0.5 ? [a, b] : [b, a]; const s = x * y;
        return P({ q: x + " × " + y + " = ?", say: "What is " + x + " times " + y + "?", answer: String(s), options: opts(s, 6, 0), visual: { type: "array", rows: Math.min(x, y), cols: Math.max(x, y) }, hint: "Break it apart: " + x + " × " + y + " is " + x + " × 5 plus " + x + " × " + (y - 5) + "." }); },
      words: [
        { q: "A week has 7 days. How many days are in 6 weeks?", answer: "42" },
        { q: "There are 8 crayons in each box and 9 boxes. How many crayons?", answer: "72" },
        { q: "A bee has 6 legs. How many legs do 7 bees have?", answer: "42" },
        { q: "Each shelf has 9 books. There are 8 shelves. How many books?", answer: "72" }
      ]
    },
    {
      n: 15, name: "Division facts", skill: "Share into equal groups", speed: 0.9,
      gen() { const d = R(2, 9), qn = R(1, 10); const n = d * qn;
        return P({ q: n + " ÷ " + d + " = ?", say: "What is " + n + " divided by " + d + "?", answer: String(qn), options: opts(qn, 3, 0), visual: { type: "array", rows: d, cols: qn }, hint: "Think: " + d + " times what makes " + n + "?" }); },
      words: [
        { q: "20 cookies are shared equally among 4 friends. How many cookies does each friend get?", answer: "5" },
        { q: "There are 18 students in 3 equal rows. How many students in each row?", answer: "6" },
        { q: "36 eggs are packed in boxes of 6. How many boxes?", answer: "6" },
        { q: "A rope 24 meters long is cut into 8 equal pieces. How long is each piece?", answer: "3" }
      ]
    },
    {
      n: 16, name: "Fractions", skill: "Halves, thirds, quarters and more", speed: 0.9,
      gen() { const den = pick([2, 3, 4, 6, 8]); const num = R(1, den - 1); const ans = num + "/" + den;
        const pool = []; for (let d of [2, 3, 4, 6, 8]) for (let nn = 1; nn < d; nn++) pool.push(nn + "/" + d);
        return P({ q: "What fraction is shaded?", say: "What fraction of the shape is shaded?", answer: ans, options: wordOpts(ans, pool), visual: { type: "fraction", num, den }, hint: "Count the shaded parts over all the parts.", kind: "fraction" }); },
      words: [
        { q: "A pizza is cut into 4 equal slices. Ava eats 1 slice. What fraction did she eat? Type it like 1/4.", answer: "1/4" },
        { q: "A chocolate bar has 8 equal pieces. Ben eats 3. What fraction did he eat?", answer: "3/8" },
        { q: "A cake is cut into 6 equal pieces and 5 are eaten. What fraction is left?", answer: "1/6" },
        { q: "Half of 10 apples are red. How many apples are red?", answer: "5" }
      ]
    },
    {
      n: 17, name: "Telling time", skill: "Read a clock to 5 minutes", speed: 0.8,
      gen() { const h = R(1, 12), m = pick([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]); const ans = h + ":" + (m < 10 ? "0" + m : m);
        const pool = []; for (let i = 0; i < 4; i++) { const hh = R(1, 12), mm = pick([0, 15, 30, 45, 5, 10, 20, 50]); pool.push(hh + ":" + (mm < 10 ? "0" + mm : mm)); }
        return P({ q: "What time is it?", say: "Look at the clock. What time is it?", answer: ans, options: wordOpts(ans, pool.concat([((h % 12) + 1) + ":" + (m < 10 ? "0" + m : m), h + ":" + ((m + 30) % 60 < 10 ? "0" + (m + 30) % 60 : (m + 30) % 60)])), visual: { type: "clock", h, m }, hint: "Short hand is the hour. Long hand counts by fives.", kind: "time" }); },
      words: [
        { q: "School starts at 8:00. Lunch is 4 hours later. What time is lunch? Type it like 12:00.", answer: "12:00" },
        { q: "A movie starts at 2:30 and lasts 1 hour. What time does it end?", answer: "3:30" },
        { q: "Mia wakes up at 7:00 and leaves 45 minutes later. What time does she leave?", answer: "7:45" },
        { q: "How many minutes are in one hour?", answer: "60" }
      ]
    },
    {
      n: 18, name: "Money", skill: "Count coins and make change", speed: 0.8,
      gen() { const coins = []; const n = R(2, 5); const vals = [25, 10, 5, 1]; let total = 0;
        for (let i = 0; i < n; i++) { const v = pick(vals); coins.push(v); total += v; }
        return P({ q: "How many cents?", say: "Count the coins. How many cents in all?", answer: String(total), options: opts(total, 10, 1), visual: { type: "coins", coins }, hint: "Start with the biggest coin. Quarters are 25, dimes 10, nickels 5, pennies 1." }); },
      words: [
        { q: "A pencil costs 35 cents. Lena pays with 50 cents. How much change does she get?", answer: "15" },
        { q: "Two quarters and one dime make how many cents?", answer: "60" },
        { q: "A toy costs 4 dollars. Jon has 10 dollars. How many dollars are left after he buys it?", answer: "6" },
        { q: "Three nickels and four pennies make how many cents?", answer: "19" }
      ]
    },
    {
      n: 19, name: "Big numbers and rounding", skill: "Add and subtract to 1000, round to tens", speed: 0.8,
      gen() { const k = R(1, 3);
        if (k === 1) { const a = R(120, 650), b = R(100, 999 - a); return P({ q: a + " + " + b + " = ?", say: "What is " + a + " plus " + b + "?", answer: String(a + b), options: opts(a + b, 100, 0), hint: "Add ones, then tens, then hundreds. Carry when needed." }); }
        if (k === 2) { const a = R(300, 999), b = R(100, a - 50); return P({ q: a + " − " + b + " = ?", say: "What is " + a + " minus " + b + "?", answer: String(a - b), options: opts(a - b, 100, 0), hint: "Line up the places. Borrow when the top digit is smaller." }); }
        const n = R(11, 989); const r = Math.round(n / 10) * 10; return P({ q: "Round " + n + " to the nearest ten", say: "Round " + n + " to the nearest ten.", answer: String(r), options: opts(r, 10, 0), hint: "Look at the ones digit. 5 or more rounds up.", kind: "round" }); },
      words: [
        { q: "A school has 248 girls and 265 boys. How many students in all?", answer: "513" },
        { q: "A plane flies 725 miles, then 150 more miles. How far did it fly?", answer: "875" },
        { q: "A tank holds 900 liters. 340 liters are used. How many liters are left?", answer: "560" },
        { q: "Round 376 to the nearest hundred.", answer: "400" }
      ]
    },
    {
      n: 20, name: "Two-step problems", skill: "Solve problems that need two steps", speed: 0.7,
      gen() { const k = R(1, 3);
        if (k === 1) { const g = R(2, 6), each = R(3, 9), extra = R(1, 9); const s = g * each + extra; return P({ q: g + " × " + each + " + " + extra + " = ?", say: "What is " + g + " times " + each + ", plus " + extra + "?", answer: String(s), options: opts(s, 6, 0), hint: "Multiply first, then add." }); }
        if (k === 2) { const a = R(40, 99), b = R(5, 20), c = R(5, 20); const s = a - b - c; return P({ q: a + " − " + b + " − " + c + " = ?", say: a + " minus " + b + " minus " + c + ". What is left?", answer: String(s), options: opts(s, 8, 0), hint: "Take away one number, then the other." }); }
        const d = R(2, 6), q = R(2, 9), add = R(1, 9); const s = q + add; return P({ q: (d * q) + " ÷ " + d + " + " + add + " = ?", say: (d * q) + " divided by " + d + ", plus " + add + ". What is the answer?", answer: String(s), options: opts(s, 4, 0), hint: "Divide first, then add." }); },
      words: [
        { q: "Noah buys 3 packs of 8 stickers and gives 5 stickers to a friend. How many stickers does he keep?", answer: "19" },
        { q: "A baker makes 48 cookies and puts them in boxes of 6. She sells 5 boxes. How many boxes are left?", answer: "3" },
        { q: "Tara had 60 dollars. She bought a book for 12 dollars and a game for 25 dollars. How much money is left?", answer: "23" },
        { q: "There are 4 teams with 6 players each. 3 players go home. How many players are still playing?", answer: "21" },
        { q: "A bus makes 5 trips with 9 passengers each, then 1 trip with 4 passengers. How many passengers in all?", answer: "49" }
      ]
    }
  ];

  window.GKA.content.math = {
    id: "math", name: "Math", color: "teal",
    modes: ["solve", "pick", "say", "listen", "words"],
    numWord,
    levels
  };
})();

/* Register as Grade 3 */
(window.GKA.contentParts = window.GKA.contentParts || []).push({ subject: "math", grade: "g3", levels: window.GKA.content.math.levels });
