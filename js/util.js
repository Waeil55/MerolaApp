/* Genius Kids Academy - shared utilities: random helpers, HTML escaping, and forgiving speech matching. */
window.GKA = window.GKA || {};
(function () {
  const U = {};
  U.rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  U.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  U.shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  U.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  U.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  U.uid = () => Math.random().toString(36).slice(2, 10);
  U.dayKey = (d) => { d = d || new Date(); const p = (n) => (n < 10 ? "0" + n : "" + n); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); };
  U.cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  // Normalize spoken or typed text: lower case, letters/digits/space only, collapse spaces.
  U.norm = (s) => String(s == null ? "" : s).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9\/: ]+/g, " ").replace(/\s+/g, " ").trim();

  // Levenshtein distance.
  U.lev = (a, b) => {
    a = String(a); b = String(b);
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  };

  // A small sound key so that words that sound alike compare equal (sun/son, write/right, bear/bare).
  U.soundKey = (w) => {
    let s = U.norm(w).replace(/ /g, "");
    if (!s) return "";
    s = s.replace(/^kn/, "n").replace(/^wr/, "r").replace(/^wh/, "w").replace(/^ps/, "s").replace(/^gn/, "n");
    s = s.replace(/ph/g, "f").replace(/ck/g, "k").replace(/qu/g, "kw").replace(/x/g, "ks").replace(/gh(?![aeiou])/g, "").replace(/dge/g, "j").replace(/tch/g, "ch");
    s = s.replace(/c(?=[eiy])/g, "s").replace(/c/g, "k").replace(/z/g, "s").replace(/sh/g, "x").replace(/ch/g, "x").replace(/th/g, "0");
    s = s.replace(/e$/, "");
    s = s.replace(/([^aeiou])\1/g, "$1");
    s = s.replace(/[aeiouy]+/g, "a");
    s = s.replace(/a$/, "");
    return s;
  };

  const NUMS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, oh: 0 };
  // Turn spoken number words into digits: "forty two" -> "42", "one hundred and five" -> "105".
  U.wordsToNumber = (text) => {
    const t = U.norm(text).replace(/-/g, " ").replace(/\band\b/g, " ").trim();
    if (/^\d+$/.test(t)) return t;
    const parts = t.split(" ").filter(Boolean);
    let total = 0, cur = 0, any = false;
    for (const p of parts) {
      if (/^\d+$/.test(p)) { cur += parseInt(p, 10); any = true; continue; }
      if (!(p in NUMS)) return null;
      const v = NUMS[p];
      any = true;
      if (v === 100) { cur = (cur || 1) * 100; } else { cur += v; }
    }
    if (!any) return null;
    return String(total + cur);
  };

  const LETTER_NAMES = { a: ["a", "ay", "eh"], b: ["b", "bee", "be"], c: ["c", "see", "sea", "cee"], d: ["d", "dee", "de"], e: ["e", "ee"], f: ["f", "ef", "eff"], g: ["g", "gee", "jee"], h: ["h", "aitch", "ache"], i: ["i", "eye", "aye"], j: ["j", "jay"], k: ["k", "kay"], l: ["l", "el", "ell"], m: ["m", "em"], n: ["n", "en"], o: ["o", "oh", "owe"], p: ["p", "pee", "pea"], q: ["q", "cue", "queue"], r: ["r", "are", "ar"], s: ["s", "es", "ess"], t: ["t", "tee", "tea"], u: ["u", "you", "yoo"], v: ["v", "vee"], w: ["w", "double u", "double you"], x: ["x", "ex", "eks"], y: ["y", "why", "wye"], z: ["z", "zee", "zed"] };
  const HOMOPHONES = [["there", "their", "theyre"], ["to", "two", "too"], ["here", "hear"], ["see", "sea", "c"], ["right", "write", "rite"], ["know", "no"], ["sun", "son"], ["bee", "be", "b"], ["eye", "i"], ["for", "four"], ["ate", "eight"], ["one", "won"], ["red", "read"], ["blue", "blew"], ["flower", "flour"], ["hole", "whole"], ["knight", "night"], ["pair", "pear"], ["tail", "tale"], ["mail", "male"], ["road", "rode"], ["seed", "cede"], ["week", "weak"], ["meet", "meat"], ["hi", "high"], ["buy", "by", "bye"], ["wood", "would"], ["deer", "dear"], ["sail", "sale"], ["plane", "plain"], ["wait", "weight"], ["our", "hour"], ["new", "knew"], ["bare", "bear"], ["pen", "pin"]];
  const homoGroup = (w) => HOMOPHONES.find((g) => g.includes(w));

  /* Compare what the child said with the target.
     strictness: "strict" | "normal" | "forgiving". hint: a key word accepted for single letters (a -> apple).
     Returns { ok, how, heard } where how explains the match for the feedback line. */
  U.matchSpeech = (saidList, target, strictness, hint) => {
    strictness = strictness || "normal";
    const list = Array.isArray(saidList) ? saidList : [saidList];
    const tgt = U.norm(target);
    const tgtNoSpace = tgt.replace(/ /g, "");
    const tgtNum = U.wordsToNumber(tgt);
    let best = { ok: false, how: "", heard: U.norm(list[0] || "") };
    for (const raw of list) {
      const said = U.norm(raw);
      if (!said) continue;
      const words = said.split(" ");
      // exact
      if (said === tgt || said.replace(/ /g, "") === tgtNoSpace) return { ok: true, how: "exact", heard: said };
      // the target appears inside a longer phrase ("the word is sun")
      if (tgt.length >= 2 && (" " + said + " ").includes(" " + tgt + " ")) return { ok: true, how: "exact", heard: said };
      // numbers: "forty two" vs "42", or "4" vs "four"
      if (tgtNum != null) {
        const sn = U.wordsToNumber(said);
        if (sn != null && sn === tgtNum) return { ok: true, how: "number", heard: said };
        const digitsInSaid = said.match(/\d+/g);
        if (digitsInSaid && digitsInSaid.includes(tgtNum)) return { ok: true, how: "number", heard: said };
      }
      // fractions "3/4" said as "three fourths" or "three quarters" or "3 over 4"
      if (/^\d+\/\d+$/.test(tgt)) {
        const [n, d] = tgt.split("/");
        const dn = { 2: ["half", "halves", "halfs"], 3: ["third", "thirds"], 4: ["fourth", "fourths", "quarter", "quarters"], 6: ["sixth", "sixths"], 8: ["eighth", "eighths"] }[d] || [];
        const saidNums = words.map((w) => U.wordsToNumber(w)).filter((x) => x != null);
        if (saidNums[0] === n && (dn.some((x) => said.includes(x)) || (saidNums[1] === d && /over|out of|on/.test(said)))) return { ok: true, how: "number", heard: said };
      }
      // time "3:45" said as "three forty five" or "quarter to four"
      if (/^\d+:\d\d$/.test(tgt)) {
        const [h, m] = tgt.split(":");
        const saidNums = words.map((w) => U.wordsToNumber(w)).filter((x) => x != null);
        const mm = parseInt(m, 10);
        if (saidNums[0] === h && (mm === 0 ? (/o ?clock|oclock/.test(said) || saidNums.length === 1) : (saidNums.slice(1).join("") === String(mm) || (mm < 10 && saidNums.slice(1).join("") === "0" + mm) || (mm === 30 && /half/.test(said)) || (mm === 15 && /quarter/.test(said))))) return { ok: true, how: "number", heard: said };
      }
      // single letters: letter name, or the hint word, or a word starting with the letter
      if (tgt.length === 1 && /[a-z]/.test(tgt)) {
        const names = LETTER_NAMES[tgt] || [tgt];
        if (words.some((w) => names.includes(w))) return { ok: true, how: "letter", heard: said };
        if (hint && (said.includes(U.norm(hint)) || U.lev(said, U.norm(hint)) <= 1)) return { ok: true, how: "letter", heard: said };
        if (strictness !== "strict" && words.some((w) => w.length <= 3 && w[0] === tgt)) return { ok: true, how: "close", heard: said };
        continue;
      }
      // homophones always count: they sound identical
      const hg = homoGroup(tgtNoSpace);
      if (hg && words.some((w) => hg.includes(w))) return { ok: true, how: "homophone", heard: said };
      if (strictness === "strict") continue;
      // sound-alike key
      const candidates = words.concat([said.replace(/ /g, "")]);
      if (candidates.some((w) => w.length > 1 && U.soundKey(w) === U.soundKey(tgtNoSpace))) { best = { ok: true, how: "close", heard: said }; continue; }
      // small spelling distance
      const maxD = strictness === "forgiving" ? (tgtNoSpace.length <= 3 ? 1 : tgtNoSpace.length <= 6 ? 2 : 3) : (tgtNoSpace.length <= 4 ? 1 : tgtNoSpace.length <= 8 ? 2 : 3);
      if (candidates.some((w) => Math.abs(w.length - tgtNoSpace.length) <= maxD && U.lev(w, tgtNoSpace) <= maxD && w.length > 1)) { best = { ok: true, how: "close", heard: said }; continue; }
      // multiword answers: enough overlap of key words
      if (tgt.includes(" ")) {
        const tw = tgt.split(" ").filter((w) => w.length > 2);
        const hits = tw.filter((w) => words.some((s) => s === w || (w.length > 3 && U.lev(s, w) <= 1))).length;
        if (tw.length && hits / tw.length >= 0.6) { best = { ok: true, how: "close", heard: said }; continue; }
      }
    }
    return best;
  };

  /* Compare typed spelling with the target. Returns { ok, close } where close means one letter off. */
  U.matchSpelling = (typed, target) => {
    const a = U.norm(typed).replace(/ /g, ""), b = U.norm(target).replace(/ /g, "");
    return { ok: a === b, close: a !== b && b.length >= 4 && U.lev(a, b) === 1 };
  };

  /* Make look-alike distractor words for a target: vowel swaps, first-letter swaps, plus real words from a pool. */
  U.distractors = (word, pool, n) => {
    const w = String(word).toLowerCase();
    const out = new Set();
    const vowels = "aeiou";
    const alts = [];
    for (let i = 0; i < w.length; i++) {
      if (vowels.includes(w[i])) for (const v of vowels) if (v !== w[i]) alts.push(w.slice(0, i) + v + w.slice(i + 1));
    }
    const cons = "bcdfghjklmnprst";
    if (w.length >= 2) for (const c of cons) { if (c !== w[0]) alts.push(c + w.slice(1)); if (c !== w[w.length - 1]) alts.push(w.slice(0, -1) + c); }
    if (w.length >= 4) { alts.push(w.slice(0, 2) + w[3] + w[2] + w.slice(4)); alts.push(w.slice(0, -1)); }
    const fromPool = U.shuffle((pool || []).map((x) => String(x).toLowerCase()).filter((x) => x !== w && Math.abs(x.length - w.length) <= 2));
    const mixed = [];
    const altsS = U.shuffle(alts.filter((x) => x !== w));
    // alternate real pool words and look-alikes so the choice is fair but not trivial
    let i = 0, j = 0;
    while (mixed.length < n * 3 && (i < fromPool.length || j < altsS.length)) {
      if (i < fromPool.length) mixed.push(fromPool[i++]);
      if (j < altsS.length) mixed.push(altsS[j++]);
    }
    for (const m of mixed) { if (out.size >= n) break; if (m && m !== w) out.add(m); }
    let k = 0;
    while (out.size < n) out.add(w + "x".repeat(++k));
    return [...out];
  };

  U.pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
  U.fmtMin = (sec) => { const m = Math.floor(sec / 60), s = sec % 60; return m + ":" + (s < 10 ? "0" + s : s); };
  U.sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  window.GKA.U = U;
})();
