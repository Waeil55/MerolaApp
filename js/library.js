/* Genius Kids Academy - Library: browse and study everything in the child's grade, level by level.
   Reading: every word with its sentence and every story. Science: every lesson, key word and question.
   Understand: every passage and sentence with its questions. Math: worked examples for every level. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U, Store = window.GKA.Store, Speech = window.GKA.Speech, UI = window.GKA.UI, E = window.GKA.Engine, V = window.GKA.Views;
  const SUBJECTS = ["reading", "math", "science", "understand"];
  const esc = (s) => U.esc(String(s == null ? "" : s));
  const fmt = (n) => Number(n).toLocaleString("en-US");
  const hear = (text) => '<button class="lib-hear" data-say="' + esc(text) + '" aria-label="Read aloud">' + UI.icon("ear") + "</button>";
  const answerOf = (q) => (q.k === "tf" || q.t === "tf") ? (q.a ? "True" : "False") : q.items ? q.items.join(" → ") : (q.o || [])[q.a || 0];
  const qRow = (q, i) => '<li class="lib-q"><div class="lq">' + (i + 1) + ". " + esc(q.q || q.t) + '</div><button class="lib-ans" data-ans="' + esc(answerOf(q)) + '">Show answer</button></li>';

  // Count everything in one subject for the current grade.
  const totals = (subject, levels) => {
    const t = { levels: levels.length, words: 0, stories: 0, questions: 0, passages: 0, sentences: 0, lessonWords: 0 };
    for (const L of levels) {
      t.words += (L.words || []).length;
      for (const st of L.stories || []) { t.stories++; t.questions += st.questions.length; }
      if (L.questions) t.questions += L.questions.length;
      if (L.lesson) t.lessonWords += L.lesson.split(/\s+/).length;
      for (const it of L.items || []) { if (it.text) { t.passages++; t.questions += (it.qs || []).length; } else { t.sentences++; t.questions++; } }
      t.sentences += (L.vocab || []).length + (L.sort || []).length;
    }
    return t;
  };
  const totalsLine = (subject, t) => {
    if (subject === "reading") return fmt(t.words) + " words · " + fmt(t.stories) + " stories · " + fmt(t.questions) + " story questions";
    if (subject === "science") return fmt(t.levels) + " lessons · " + fmt(t.lessonWords) + " lesson words · " + fmt(t.words) + " key words · " + fmt(t.questions) + " questions";
    if (subject === "understand") return fmt(t.passages) + " passages · " + fmt(t.sentences) + " sentences and picture words · " + fmt(t.questions) + " questions";
    return fmt(t.levels) + " skills · new problems every time · word problems in every level";
  };

  // Body of one level, built only when the level is opened.
  function levelBody(subject, L) {
    if (subject === "reading") {
      const words = '<div class="lib-words">' + (L.words || []).map((w) => '<div class="lib-word">' + hear(w.w + ". " + (w.s || "")) + '<div class="grow"><b>' + esc(w.w) + "</b>" + (w.s ? '<div class="small muted">' + esc(w.s) + "</div>" : "") + "</div></div>").join("") + "</div>";
      const stories = (L.stories || []).map((st) => '<details class="lib-sub"><summary>' + UI.icon("book") + " " + esc(st.title) + '</summary><div class="lib-text">' + hear(st.text) + "<p>" + esc(st.text) + '</p></div><ol class="lib-qs">' + st.questions.map(qRow).join("") + "</ol></details>").join("");
      return '<div class="lib-h">Words (' + (L.words || []).length + ")</div>" + words + '<div class="lib-h">Stories (' + (L.stories || []).length + ")</div>" + stories;
    }
    if (subject === "science") {
      return '<div class="lib-text">' + hear(L.lesson) + "<p>" + esc(L.lesson) + "</p></div>" +
        '<div class="lib-h">Key words</div><div class="lib-words">' + (L.words || []).map((w) => '<div class="lib-word">' + hear(w.w + ". " + (w.s || "")) + '<div class="grow"><b>' + esc(w.w) + '</b><div class="small muted">' + esc(w.s) + "</div></div></div>").join("") + "</div>" +
        '<div class="lib-h">Questions (' + (L.questions || []).length + ')</div><ol class="lib-qs">' + (L.questions || []).map(qRow).join("") + "</ol>";
    }
    if (subject === "understand") {
      if (L.vocab) return '<div class="lib-pics">' + L.vocab.map((v) => '<button class="lib-pic" data-say="' + esc(v[0]) + '"><span>' + v[1] + "</span>" + esc(v[0]) + "</button>").join("") + "</div>";
      if (L.sort) return ["who", "what", "where", "when"].map((k) => '<div class="lib-h">' + k.toUpperCase() + '</div><div class="lib-pics">' + L.sort.filter((s) => s[2] === k).map((s) => '<button class="lib-pic" data-say="' + esc(s[0]) + '"><span>' + s[1] + "</span>" + esc(s[0]) + "</button>").join("") + "</div>").join("");
      const items = L.items || [];
      if (items.length && items[0].t) return '<ol class="lib-qs">' + items.map((it, i) => '<li class="lib-q"><div class="lq">' + (it.p ? it.p + " " : "") + esc(it.t) + '</div><div class="small muted">' + esc(it.k === "pic" ? "Which picture matches?" : it.q) + '</div><button class="lib-ans" data-ans="' + esc(it.k === "tf" ? (it.a ? "Yes" : "No") : it.o[0]) + '">Show answer</button></li>').join("") + "</ol>";
      return items.map((it, i) => '<details class="lib-sub"' + (items.length === 1 ? " open" : "") + "><summary>" + (it.p ? it.p + " " : "") + esc(it.title || "Passage " + (i + 1)) + '</summary><div class="lib-text">' + hear(it.text) + E.splitText(it.text).map((p) => "<p>" + esc(p.join(" ")) + "</p>").join("") + '</div><ol class="lib-qs">' + (it.qs || []).map(qRow).join("") + "</ol></details>").join("");
    }
    // Math: worked examples, refreshed on demand.
    const ex = []; for (let i = 0; i < 5; i++) { try { const p = L.gen(); ex.push(p); } catch (e) { /* skip */ } }
    let wp = null; try { wp = L.wp(); } catch (e) { /* skip */ }
    return '<ol class="lib-qs">' + ex.map((p, i) => '<li class="lib-q"><div class="lq">' + esc(p.q) + '</div><button class="lib-ans" data-ans="' + esc(p.answer) + '">Show answer</button></li>').join("") + (wp ? '<li class="lib-q"><div class="lq">' + esc(wp.q) + '</div><button class="lib-ans" data-ans="' + esc(wp.answer) + '">Show answer</button></li>' : "") + '</ol><button class="btn" data-more="' + L.n + '">' + UI.icon("retry") + " New examples</button>";
  }

  const countLabel = (subject, L) => {
    if (subject === "reading") return (L.words || []).length + " words · " + (L.stories || []).length + " stories";
    if (subject === "science") return (L.questions || []).length + " questions · " + (L.words || []).length + " key words";
    if (subject === "understand") { const it = L.items || []; const p = it.filter((x) => x.text).length; return p ? p + " passages" : (it.length || (L.vocab || L.sort || []).length) + " items"; }
    return L.skill;
  };

  V.library = (root, subject) => {
    if (!Store.hasProfile()) return window.GKA.App.go("profiles");
    subject = SUBJECTS.includes(subject) ? subject : "reading";
    const levels = E.levels(subject); const tone = UI.toneOf(subject); const t = totals(subject, levels);
    root.innerHTML = '<div class="screen">' + V._topbar() +
      '<h1 style="font-size:28px;margin-top:18px">Library</h1><div class="small muted">Everything ' + esc(Store.get().kid.name) + " can study in " + esc(Store.gradeName(Store.grade())) + ". Tap a level to open it, tap the ear to hear it.</div>" +
      '<div class="subject-tabs" style="margin-top:14px">' + SUBJECTS.map((id) => '<a href="#library-' + id + '" class="' + (id === subject ? "on " + UI.toneOf(id) : "") + '" aria-label="' + E.subject(id).name + '">' + UI.subjectIcon(id) + '<span class="tl">' + E.subject(id).name + "</span></a>").join("") + "</div>" +
      '<div class="card flat lib-total ' + tone + '"><div style="font-weight:900">' + E.subject(subject).name + " · " + t.levels + ' levels</div><div class="small">' + totalsLine(subject, t) + "</div></div>" +
      (subject !== "math" ? '<input class="input" id="libsearch" type="search" placeholder="Search words, stories and lessons" autocomplete="off" style="margin-top:12px">' : "") +
      '<div id="libresults"></div><div class="lib-levels">' + levels.map((L) => '<details class="lib-level" data-n="' + L.n + '"><summary><span class="lib-n ' + tone + '">' + L.n + '</span><span class="grow"><b>' + esc(L.name) + '</b><span class="small muted">' + esc(countLabel(subject, L)) + "</span></span>" + UI.icon("chev") + '</summary><div class="lib-body"></div></details>').join("") + "</div></div>" + V._bottomNav("library");
    V._bindGrade(root);
    const rate = Store.get().settings.rate;
    const bindBody = (el) => {
      el.querySelectorAll("[data-say]").forEach((b) => { b.onclick = (e) => { e.preventDefault(); Speech.speak(b.dataset.say, { rate }); }; });
      el.querySelectorAll("[data-ans]").forEach((b) => { b.onclick = () => { b.outerHTML = '<div class="lib-answer">' + UI.icon("check") + " " + esc(b.dataset.ans) + "</div>"; }; });
      el.querySelectorAll("[data-more]").forEach((b) => { b.onclick = () => { const body = b.closest(".lib-body"); body.innerHTML = levelBody(subject, E.level(subject, +b.dataset.more)); bindBody(body); }; });
    };
    root.querySelectorAll(".lib-level").forEach((d) => { d.addEventListener("toggle", () => { const body = d.querySelector(".lib-body"); if (d.open && !body.dataset.ready) { body.innerHTML = levelBody(subject, E.level(subject, +d.dataset.n)); body.dataset.ready = "1"; bindBody(body); } }); });
    const search = root.querySelector("#libsearch"); const out = root.querySelector("#libresults");
    if (search) search.oninput = () => {
      const q = search.value.trim().toLowerCase(); if (q.length < 2) { out.innerHTML = ""; return; }
      const hits = [];
      for (const L of levels) {
        for (const w of L.words || []) if (w.w.toLowerCase().includes(q) || (w.s || "").toLowerCase().includes(q)) hits.push({ n: L.n, label: w.w, sub: w.s, say: w.w + ". " + (w.s || "") });
        for (const st of L.stories || []) if ((st.title + " " + st.text).toLowerCase().includes(q)) hits.push({ n: L.n, label: "Story: " + st.title, sub: L.name });
        if (L.lesson && L.lesson.toLowerCase().includes(q)) hits.push({ n: L.n, label: "Lesson: " + L.name, sub: L.skill });
        for (const it of L.items || []) { const txt = it.text || it.t || ""; if (((it.title || "") + " " + txt).toLowerCase().includes(q)) hits.push({ n: L.n, label: it.title || txt.slice(0, 60), sub: L.name }); }
        for (const v of (L.vocab || []).concat(L.sort || [])) if (v[0].toLowerCase().includes(q)) hits.push({ n: L.n, label: v[1] + " " + v[0], sub: L.name, say: v[0] });
        if (hits.length > 60) break;
      }
      out.innerHTML = '<div class="small muted" style="margin:10px 2px">' + (hits.length ? hits.length + (hits.length > 60 ? "+" : "") + " found" : "Nothing found") + "</div>" + hits.slice(0, 60).map((h) => '<div class="lib-word">' + (h.say ? hear(h.say) : "") + '<div class="grow"><b>' + esc(h.label) + '</b><div class="small muted">Level ' + h.n + (h.sub ? " · " + esc(h.sub) : "") + '</div></div><button class="lib-ans" data-open="' + h.n + '">Open</button></div>').join("");
      bindBody(out);
      out.querySelectorAll("[data-open]").forEach((b) => { b.onclick = () => { const d = root.querySelector('.lib-level[data-n="' + b.dataset.open + '"]'); if (d) { d.open = true; d.scrollIntoView({ block: "start", behavior: "smooth" }); } }; });
    };
  };
})();
