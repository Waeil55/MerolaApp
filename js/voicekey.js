/* Recorded voice: how a text is split into sentences and how each sentence finds its recording.
   Used by the app (js/speech.js) and by the recorder (tools/voice/), so both always agree.
   A "|" in a text is a break that is not said: the app writes "Is it | Very cold? | or | Hot?" so each part has one recording. */
(function (root) {
  // A 53-bit hash: safe for tens of thousands of clips without two sentences sharing a file.
  function cyrb53(str) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) { const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  const tidy = (s) => String(s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
  const hasWord = (s) => /[A-Za-z0-9]/.test(s);
  // Sentences with their place in the original text. A full stop between digits (3.5) does not end a sentence.
  function segments(text) {
    const t = String(text || ""); const out = []; let start = 0;
    const push = (a, b) => { const raw = t.slice(a, b); const lead = raw.length - raw.replace(/^\s+/, "").length; const s = raw.trim(); if (s && hasWord(s)) out.push({ t: s, at: a + lead }); };
    for (let i = 0; i < t.length; i++) {
      const ch = t[i];
      if (ch === "\n" || ch === "|") { push(start, i); start = i + 1; continue; }
      if (ch !== "." && ch !== "!" && ch !== "?") continue;
      let j = i + 1; while (j < t.length && /[.!?]/.test(t[j])) j++;
      while (j < t.length && /["'”’)\]]/.test(t[j])) j++;
      if (j < t.length && !/\s/.test(t[j])) { i = j - 1; continue; }
      push(start, j); start = j; i = j - 1;
    }
    push(start, t.length);
    return out;
  }
  // The text a recording is made for: one word loses its punctuation, a sentence keeps it.
  function spoken(seg) {
    let s = tidy(seg);
    if (!/\s/.test(s)) s = s.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
    return s;
  }
  // The same words with or without end punctuation share one recording ("Very cold" and "Very cold.").
  const key = (seg) => cyrb53(spoken(seg).toLowerCase().replace(/^["'(]+/, "").replace(/[\s.!?,;:"')]+$/, "")).toString(36);
  const api = { segments, spoken, key, cyrb53 };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else (root.GKA = root.GKA || {}).VoiceKey = api;
})(typeof window !== "undefined" ? window : this);
