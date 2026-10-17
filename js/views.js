/* Genius Kids Academy - screens: kid profiles, the Duolingo-style learning path, level hub, results, My Words, parents. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U, Store = window.GKA.Store, Speech = window.GKA.Speech, UI = window.GKA.UI, E = window.GKA.Engine;
  const V = {};
  const go = (r) => window.GKA.App.go(r);
  const SUBJECTS = ["reading", "math", "science", "understand"];
  const ic = (n, style) => UI.icon(n).replace("<svg", '<svg style="' + (style || "") + '"');

  const R = () => window.GKA.Rewards;
  const questsHTML = (compact) => {
    const qs = R().quests(); const done = qs.filter((q) => q.done).length;
    return '<div class="quests"><div class="row between"><div class="qt">' + UI.icon("bolt") + ' Daily quests <span class="small muted num">' + done + ' / ' + qs.length + '</span></div>' + (compact ? '<a class="small" href="#me" style="color:var(--blue-fg)">See all</a>' : "") + "</div>" +
      qs.map((q) => '<div class="quest' + (q.done ? " done" : "") + '"><div class="qi">' + UI.icon(q.claimed ? "check" : q.done ? "gift" : "target") + '</div><div class="grow"><div class="t">' + q.text + '</div><div class="bar thin yellow"><i style="width:' + Math.round((q.progress / q.goal) * 100) + '%"></i><span class="bv num">' + q.progress + " / " + q.goal + "</span></div></div>" + (q.done && !q.claimed ? '<button class="btn primary claim" data-claim="' + q.id + '">Claim</button>' : q.claimed ? '<span class="chip green">Done</span>' : "") + "</div>").join("") + "</div>";
  };
  function bindQuests(root, rerender) {
    root.querySelectorAll("[data-claim]").forEach((b) => { b.onclick = () => { const got = R().claimQuest(b.dataset.claim); if (got) { Speech.sfx("win"); UI.confetti(90); UI.toast("+" + got + " stars and +5 gems", "ok"); rerender(); } }; });
  }

  // ----- Understand helpers -----
  const understandTop = () => {
    const hp = Store.highestPassed("understand"); const cur = Store.currentLevel("understand"); const L = E.level("understand", cur); const stageNo = L ? L.stage : 1;
    const ladder = '<div class="ladder" aria-label="Stage ' + stageNo + ' of 5">' + E.stageNames().map((s, i) => '<div class="lstep' + (i + 1 < stageNo ? " done" : i + 1 === stageNo ? " on" : "") + '"><i>' + (i + 1 < stageNo ? UI.icon("check") : i + 1) + "</i><span>" + s + "</span></div>").join("") + "</div>";
    const suggest = { kg: 1, g1: 11, g2: 16, g3: 21, g4: 26, g5: 31, g6: 36 }[Store.grade()] || 1;
    const place = !Store.placedAt("understand") && hp === 0 ? '<div class="place-card"><div class="row" style="align-items:flex-start"><span class="place-m">' + UI.mascot("wink") + '</span><div class="grow"><div class="t">Find my starting level</div><div class="small muted">Up to 10 quick questions. If you already know the early levels of this grade, you skip ahead.</div></div></div><div class="row wrap"><a class="btn primary" href="#play-placement">Find my level</a><a class="btn flat" href="#hub-understand-1">Start at Level 1</a></div></div>' : "";
    return '<div class="u-intro"><div class="u-intro-t">Understand what you read</div><div class="small muted">Five steps, from single words to long stories. Each step teaches how to find the answer in the text.</div>' + ladder + "</div>" + place;
  };
  const understandHubInfo = (L) => {
    const ks = []; const add = (k) => { if (k && E.QTYPES[k] && !ks.includes(k)) ks.push(k); };
    if (L.tip) add(L.tip); if (L.vocab) add("look"); if (L.sort) add("sort");
    (L.items || []).forEach((it) => { add(it.k); (it.qs || []).forEach((q) => add(q.k)); });
    const titles = (L.items || []).filter((it) => it.title && !it.notitle).map((it) => U.esc(it.title));
    return '<div class="small muted">Stage ' + L.stage + " of 5 · " + E.stageNames()[L.stage - 1] + '</div><div class="chips" style="margin-top:8px">' + ks.map((k) => UI.qchip(k)).join("") + "</div>" + (titles.length ? '<div class="small muted" style="margin-top:8px">Read: ' + titles.join(", ") + "</div>" : "");
  };
  const placementResult = (root, r) => {
    const p = r.placement || { start: 1, passed: 0 }; const stages = E.stageNames();
    const gotList = stages.slice(0, p.passed).map((s) => s.toLowerCase()); const got = gotList.length > 1 ? gotList.slice(0, -1).join(", ") + " and " + gotList[gotList.length - 1] : gotList.join("");
    root.innerHTML = '<div class="screen"><div class="results"><svg class="mascot" viewBox="0 0 120 120">' + UI.mascot("wink").replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + "</svg><h1>Start at Level " + p.start + '</h1><div class="sub">' + (p.passed ? "You already understand " + got + ". Levels 1 to " + (p.start - 1) + " stay open for practice any time." : "We will start with words and pictures. Every step builds the next one.") + '</div><div class="ladder big" style="width:100%;margin-top:18px">' + stages.map((s, i) => '<div class="lstep' + (i < p.passed ? " done" : i === Math.min(p.passed, 4) ? " on" : "") + '"><i>' + (i < p.passed ? UI.icon("check") : i + 1) + "</i><span>" + s + "</span></div>").join("") + '</div></div><div class="stack" style="margin-top:22px"><a class="btn primary lg" href="#hub-understand-' + p.start + '">Start Level ' + p.start + '</a><a class="btn flat" href="#home-understand">Back to the path</a></div></div>';
  };
  const heartsRow = (size) => { const n = R().hearts(); let s = '<div class="hearts' + (size ? " " + size : "") + '">'; for (let i = 0; i < R().MAX_HEARTS; i++) s += '<span class="' + (i < n ? "on" : "") + '">' + UI.icon("heart") + "</span>"; return s + "</div>"; };

  const bottomNav = (on) => {
    const p = Store.profile();
    return '<nav class="bottombar" aria-label="Main"><a href="#home" class="' + (on === "home" ? "on" : "") + '" aria-label="Learn">' + UI.icon("home") + '</a><a href="#library-' + (sessionStorage.getItem("gka.subject") || "reading") + '" class="' + (on === "library" ? "on" : "") + '" aria-label="Library">' + UI.icon("book") + '</a><a href="#words" class="' + (on === "words" ? "on" : "") + '" aria-label="My Words">' + UI.icon("abc") + '</a><a href="#parent" class="' + (on === "parent" ? "on" : "") + '" aria-label="Parents">' + UI.icon("chart") + '</a><a href="#me" class="' + (on === "me" || on === "profiles" ? "on" : "") + '" aria-label="My profile"><span class="avatar">' + (p ? UI.avatar(p.avatar) : UI.icon("users")) + "</span></a></nav>";
  };
  const topbar = () => {
    const s = Store.get(); const streak = Store.streak();
    return '<div class="topbar"><button class="stat grade" id="gradebtn" aria-label="Change grade"><i></i>' + Store.gradeShort(s.kid.grade) + " " + UI.icon("chev").replace("<svg", '<svg style="width:16px;height:16px"') + '</button><span class="stat flame' + (streak ? "" : " off") + '">' + UI.icon("flame") + "<span>" + streak + '</span></span><span class="stat star">' + UI.icon("star") + "<span>" + s.stars + '</span></span>' + (R().heartsOn() ? '<a class="stat heart" href="#me" aria-label="Hearts">' + UI.icon("heart") + "<span>" + R().hearts() + "</span></a>" : "") + '<a class="stat gem" href="#me" aria-label="Gems">' + UI.icon("gem") + "<span>" + R().gems() + '</span></a><button class="stat comfort" id="comfortbtn" aria-label="Text size, font and comfort">' + UI.icon("type") + '</button><a class="stat avatar-btn" href="#me" aria-label="My profile"><span class="avatar">' + UI.avatar(s.kid.avatar) + "</span></a></div>";
  };
  // Comfort panel: the child (or a grown-up) can make reading easier without the parent PIN.
  function comfortModal(onDone) {
    const st = Store.settings();
    const seg = (id, opts, val) => '<div class="seg" id="' + id + '">' + opts.map(([v, l]) => '<button class="btn' + (String(v) === String(val) ? " on" : "") + '" data-v="' + v + '">' + l + "</button>").join("") + "</div>";
    const m = UI.modal('<h2>Make it comfy</h2><div class="comfort-grid">' +
      '<div><div class="lbl">Text size</div>' + seg("c-size", [["normal", "Normal"], ["large", "Large"], ["xl", "Extra large"]], st.textSize || "normal") + "</div>" +
      '<div><div class="lbl">Letters</div>' + seg("c-font", [["normal", "Rounded"], ["easy", "Easy-read"]], st.font || "normal") + "</div>" +
      '<div><div class="lbl">Voice speed</div>' + seg("c-rate", [["0.7", "Slow"], ["0.9", "Normal"], ["1.1", "Quick"]], String(st.rate || 0.9)) + "</div>" +
      '<div><div class="lbl">Cards and questions</div>' + seg("c-order", [["shuffle", "Shuffle every time"], ["order", "Same order"]], st.order === "order" ? "order" : "shuffle") + "</div>" +
      '<div><div class="lbl">Nova reads answers aloud</div>' + seg("c-tv", [["1", "On"], ["0", "Off"]], st.teacherVoice === false ? "0" : "1") + "</div>" +
      '<div><div class="lbl">Calm mode (less moving)</div>' + seg("c-calm", [["0", "Off"], ["1", "On"]], st.calm ? "1" : "0") + "</div>" +
      '</div><div class="row" style="margin-top:6px"><button class="btn grow" id="c-hear">' + UI.icon("ear") + ' Hear the voice</button><button class="btn primary grow" id="c-ok">Done</button></div>');
    const apply = () => { window.GKA.App.applyTheme(); };
    const bindSeg = (id, fn) => m.el.querySelectorAll("#" + id + " .btn").forEach((b) => { b.onclick = () => { m.el.querySelectorAll("#" + id + " .btn").forEach((x) => x.classList.remove("on")); b.classList.add("on"); fn(b.dataset.v); apply(); }; });
    bindSeg("c-size", (v) => Store.setting("textSize", v)); bindSeg("c-font", (v) => Store.setting("font", v)); bindSeg("c-rate", (v) => Store.setting("rate", Number(v)));
    bindSeg("c-order", (v) => Store.setting("order", v)); bindSeg("c-tv", (v) => Store.setting("teacherVoice", v === "1")); bindSeg("c-calm", (v) => Store.setting("calm", v === "1"));
    m.el.querySelector("#c-hear").onclick = () => Speech.speak("This is how I sound. Learning is fun!", { rate: Store.settings().rate });
    m.el.querySelector("#c-ok").onclick = () => { m.close(); if (onDone) onDone(); };
  }
  V._comfort = comfortModal;
  function bindGrade(root) {
    const cb = root.querySelector("#comfortbtn"); if (cb) cb.onclick = () => comfortModal(() => window.GKA.App.go((location.hash || "#home").slice(1)));
    const b = root.querySelector("#gradebtn"); if (!b) return;
    b.onclick = () => {
      const g = Store.grade();
      const m = UI.modal('<h2>Which grade?</h2><p class="muted small">Every subject has its own 50 levels for each grade, and progress is saved separately for each grade.</p><div class="grade-pick" id="gp">' + E.GRADES.map(([id, name]) => '<button data-g="' + id + '" class="' + (id === g ? "on" : "") + '">' + Store.gradeShort(id) + "</button>").join("") + '</div><div class="small muted" id="gname">' + Store.gradeName(g) + "</div><button class=\"btn primary\" id=\"ok\">Done</button>");
      m.el.querySelectorAll("#gp button").forEach((x) => { x.onclick = () => { m.el.querySelectorAll("#gp button").forEach((y) => y.classList.remove("on")); x.classList.add("on"); m.el.querySelector("#gname").textContent = Store.gradeName(x.dataset.g); }; });
      m.el.querySelector("#ok").onclick = () => { const on = m.el.querySelector("#gp button.on"); if (on) Store.setGrade(on.dataset.g); m.close(); go("home"); };
    };
  }

  function bindInstall(root) { const A = window.GKA.App; root.querySelectorAll("[data-install]").forEach((b) => { b.hidden = !A.installPrompt; b.onclick = () => A.install(); }); const st = root.querySelector("#pwa-state"); if (st) st.textContent = window.matchMedia("(display-mode: standalone)").matches ? "Installed and running as an app." : A.installPrompt ? "Ready to install." : navigator.serviceWorker && navigator.serviceWorker.controller ? "Saved for offline use." : ""; }

  // ---------- Profiles ----------
  V.profiles = (root) => {
    const list = Store.profiles();
    root.innerHTML = '<div class="screen"><div class="hero-mascot" style="margin-top:28px">' + UI.mascot("wink") + '<div class="bubble">' + (list.length ? "Who is learning today?" : "Hi! Let's add your first kid.") + '</div></div><div class="profiles-grid">' +
      list.map((p) => '<button class="profile-card" data-id="' + p.id + '"><span class="avatar md">' + UI.avatar(p.avatar) + '</span><span class="nm">' + U.esc(p.name) + '</span><span class="chip blue">' + Store.gradeName(p.grade) + "</span></button>").join("") +
      '<a class="profile-card add" href="#addkid">' + UI.icon("plus") + "<span>Add a kid</span></a></div>" +
      (list.length ? '<div class="small muted" style="margin-top:18px;text-align:center">Parents can rename kids or change grades on the Parents page.</div>' : "") + "</div>" + (list.length ? bottomNav("profiles") : "");
    root.querySelectorAll(".profile-card[data-id]").forEach((b) => { b.onclick = () => { Store.setCurrent(b.dataset.id); Speech.sfx("ok"); go("home"); }; });
  };
  V.addkid = (root, editId) => {
    const editing = editId ? Store.profiles().find((p) => p.id === editId) : null;
    let avatar = editing ? editing.avatar : U.pick(Object.keys(UI.avatars)); let grade = editing ? editing.grade : "g3";
    root.innerHTML = '<div class="screen"><div class="hero-mascot" style="margin-top:28px">' + UI.mascot("nova") + '<div class="bubble">' + (editing ? "Update this kid." : "Tell me about the new learner!") + '</div></div>' +
      '<div class="card" style="margin-top:18px"><label class="lbl" for="kname">Name</label><input class="input" id="kname" placeholder="Kid\'s name" value="' + (editing ? U.esc(editing.name) : "") + '" maxlength="24"></div>' +
      '<div class="card" style="margin-top:12px"><label class="lbl">Pick an avatar</label><div class="avatar-pick" id="av">' + Object.keys(UI.avatars).map((k) => '<button data-a="' + k + '" class="' + (k === avatar ? "on" : "") + '" aria-label="' + k + '">' + UI.avatars[k] + "</button>").join("") + "</div></div>" +
      '<div class="card" style="margin-top:12px"><label class="lbl">Grade</label><div class="grade-pick" id="gp">' + E.GRADES.map(([id, name]) => '<button data-g="' + id + '" class="' + (id === grade ? "on" : "") + '">' + Store.gradeShort(id) + "</button>").join("") + '</div><div class="small muted" id="gname" style="margin-top:8px">' + Store.gradeName(grade) + "</div></div>" +
      '<div class="stack" style="margin-top:18px"><button class="btn primary lg" id="save">' + (editing ? "Save" : "Let's go!") + '</button><a class="btn flat" href="#' + (Store.hasProfile() ? "profiles" : "profiles") + '">Cancel</a></div></div>';
    root.querySelectorAll("#av button").forEach((b) => { b.onclick = () => { root.querySelectorAll("#av button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); avatar = b.dataset.a; }; });
    root.querySelectorAll("#gp button").forEach((b) => { b.onclick = () => { root.querySelectorAll("#gp button").forEach((x) => x.classList.remove("on")); b.classList.add("on"); grade = b.dataset.g; root.querySelector("#gname").textContent = Store.gradeName(grade); }; });
    root.querySelector("#save").onclick = () => { const name = root.querySelector("#kname").value.trim(); if (!name) { UI.toast("Please type a name", "warn"); root.querySelector("#kname").focus(); return; } if (editing) { Store.updateProfile(editing.id, { name, avatar, grade }); UI.toast("Saved", "ok"); go("parent"); } else { Store.addProfile(name, avatar, grade); Speech.sfx("win"); UI.confetti(120); go("home"); } };
    setTimeout(() => { const i = root.querySelector("#kname"); if (i && !editing) i.focus(); }, 50);
  };

  // ---------- Home: learning path ----------
  V.home = (root, subject) => {
    if (!Store.hasProfile()) return go("profiles");
    subject = SUBJECTS.includes(subject) ? subject : (sessionStorage.getItem("gka.subject") || "reading");
    try { sessionStorage.setItem("gka.subject", subject); } catch (e) { /* ignore */ }
    const C = E.subject(subject); const tone = UI.toneOf(subject);
    const levels = E.levels(subject);
    const cur = Store.currentLevel(subject);
    const offsets = [0, 50, 76, 50, 0, -50, -76, -50];
    let html = "";
    levels.forEach((l, i) => {
      if (i % 5 === 0) { const unit = Math.floor(i / 5) + 1; const last = levels[Math.min(i + 4, levels.length - 1)]; html += '<div class="unit ' + tone + '"><div class="grow"><div class="u1">Unit ' + unit + " · Levels " + l.n + "–" + last.n + (subject === "understand" ? " · " + E.stageNames()[(l.stage || 1) - 1] : "") + '</div><div class="u2">' + U.esc(l.name) + " to " + U.esc(last.name) + '</div></div><button class="guide" data-unit="' + unit + '">' + UI.icon("book") + " Guide</button></div>"; html += '<div class="path">'; }
      const p = Store.levelPeek(subject, l.n); const done = !!(p && p.passed); const isCur = !done && l.n === cur; const locked = !done && !isCur;
      const off = offsets[i % offsets.length];
      const inner = (locked ? UI.icon("lock") : done ? UI.icon("crown") : UI.subjectIcon(subject)) + (done ? '<span class="stars-mini">' + [0, 1, 2].map((k) => UI.icons.star.replace("<svg", '<svg class="' + (k < p.stars ? "on" : "") + '"')).join("") + "</span>" : "") + (isCur ? '<span class="start-bubble ' + tone + '">Start</span>' : "");
      const label = '<span class="node-label ' + (off > 0 ? "left" : "right") + '">' + U.esc(l.name) + "</span>";
      html += '<div class="node-wrap"><div style="position:relative;transform:translateX(' + off + 'px)">' + (locked ? '<div class="node locked" aria-label="Level ' + l.n + ' locked">' + inner + "</div>" : '<a class="node ' + tone + (done ? " done" : " current") + '" href="#hub-' + subject + "-" + l.n + '" aria-label="Level ' + l.n + " " + U.esc(l.name) + '">' + inner + "</a>") + label + "</div>" + (i % 5 === 2 ? '<div class="path-mascot" style="' + (off >= 0 ? "left:-6px" : "right:-6px") + ';top:-14px">' + UI.mascot(["nova", "wink", "panda", "dog"][Math.floor(i / 5) % 4]) + "</div>" : "") + "</div>";
      if (i % 5 === 4 || i === levels.length - 1) { const unit = Math.floor(i / 5) + 1; const ready = R().chestReady(subject, unit), opened = R().chestOpened(subject, unit); html += '<div class="node-wrap"><button class="chest' + (opened ? " opened" : ready ? " ready" : " locked") + '" data-chest="' + unit + '" aria-label="Treasure chest for unit ' + unit + '">' + UI.icon("chest") + (ready && !opened ? '<span class="start-bubble ' + tone + '">Open</span>' : "") + '</button></div>'; html += "</div>"; }
    });
    root.innerHTML = '<div class="screen">' + topbar() + '<div class="subject-tabs">' + SUBJECTS.map((id) => '<a href="#home-' + id + '" aria-label="' + E.subject(id).name + '" class="' + (id === subject ? "on " + UI.toneOf(id) : "") + '">' + UI.subjectIcon(id) + '<span class="tl">' + E.subject(id).name + "</span></a>").join("") + "</div>" + homeTools(subject) + questsHTML(true) + (subject === "understand" ? understandTop() : "") + html + (!Speech.sttOK ? '<div class="notice" style="margin-top:16px">' + UI.icon("mic") + "<div>This browser has no speech recognition, so I Speak uses a grown-up check instead. Chrome, Edge or Safari give the full mic experience.</div></div>" : "") + "</div>" + bottomNav("home");
    bindGrade(root);
    root.querySelectorAll(".guide").forEach((b) => { b.onclick = () => { const u = +b.dataset.unit; const ls = levels.slice((u - 1) * 5, u * 5); const m = UI.modal('<h2>Unit ' + u + ' guide</h2><div class="stack">' + ls.map((l) => '<div class="card flat"><div style="font-weight:900">Level ' + l.n + ": " + U.esc(l.name) + '</div><div class="small muted">' + U.esc(l.skill) + "</div>" + (l.words && l.words.length ? '<div class="chips" style="margin-top:8px">' + l.words.slice(0, 8).map((w) => '<span class="chip word">' + U.esc(w.w) + "</span>").join("") + "</div>" : "") + "</div>").join("") + '</div><button class="btn primary" id="c">Close</button>'); m.el.querySelector("#c").onclick = m.close; }; });
    bindQuests(root, () => V.home(root, subject)); bindHomeTools(root);
    root.querySelectorAll("[data-chest]").forEach((b) => { b.onclick = () => { const unit = +b.dataset.chest; if (R().chestOpened(subject, unit)) return UI.toast("You already opened this chest", "ok"); if (!R().chestReady(subject, unit)) return UI.toast("Pass level " + unit * 5 + " to open this chest", "warn"); const got = R().openChest(subject, unit); if (!got) return; Speech.sfx("win"); UI.confetti(200); const m = UI.modal('<div class="chest-open">' + UI.icon("chest") + '<h2>Treasure!</h2><div class="row" style="justify-content:center;gap:18px"><span class="pill">' + UI.icon("star") + "+" + got.stars + '</span><span class="pill gem">' + UI.icon("gem") + "+" + got.gems + '</span></div><p class="muted small">Unit ' + unit + " done. Keep going!</p></div>" + '<button class="btn primary" id="c">Awesome</button>'); m.el.querySelector("#c").onclick = () => { m.close(); V.home(root, subject); }; }; });
    const curNode = root.querySelector(".node.current"); if (curNode && curNode.scrollIntoView) setTimeout(() => curNode.scrollIntoView({ block: "center" }), 50);
  };

  // Quick ways to study: find anything, a fresh shuffled mix, mistakes, the Library and the teacher.
  const homeTools = (subject) => {
    const mix = subject === "reading" || subject === "science" ? '<a class="tool green" href="#play-mix-' + subject + '-read">' + UI.icon("shuffle") + '<span>Mix practice<span class="small">New shuffle of every level you reached</span></span></a>' : '<a class="tool green" href="#hub-' + subject + "-" + Store.currentLevel(subject) + '">' + UI.icon("shuffle") + '<span>Practice now<span class="small">A fresh set every time</span></span></a>';
    const weak = Store.weakWords(subject, 1).length;
    return '<label class="findbox">' + UI.icon("search") + '<input id="findany" type="search" placeholder="Find any word, story, lesson or passage" autocomplete="off" enterkeyhint="search"></label>' +
      '<div class="tool-row">' + mix + (weak && subject !== "math" && subject !== "understand" ? '<a class="tool orange" href="#play-review-' + subject + '-read">' + UI.icon("retry") + '<span>My mistakes<span class="small">Practice what was hard</span></span></a>' : "") +
      '<a class="tool blue" href="#library-' + subject + '">' + UI.icon("book") + '<span>Library<span class="small">Every word, story and lesson</span></span></a><button class="tool purple" data-nova>' + UI.icon("chat") + '<span>Ask Nova<span class="small">Your AI teacher</span></span></button></div>';
  };
  function bindHomeTools(root) {
    const f = root.querySelector("#findany"); if (f) f.onkeydown = (e) => { if (e.key === "Enter" && f.value.trim().length >= 2) { try { sessionStorage.setItem("gka.libq", f.value.trim()); } catch (x) { /* ignore */ } go("library-all"); } };
    root.querySelectorAll("[data-nova]").forEach((b) => { b.onclick = () => window.GKA.Teacher && window.GKA.Teacher.open(); });
  }
  V._bindHomeTools = bindHomeTools;

  // ---------- Level hub ----------
  V.hub = (root, subject, n) => {
    if (!Store.hasProfile()) return go("profiles");
    const C = E.subject(subject); const L = E.level(subject, n); if (!C || !L) return go("home-" + subject);
    if (!Store.isUnlocked(subject, n)) { UI.toast("Pass level " + (n - 1) + " first", "warn"); return go("home-" + subject); }
    const s = Store.get(); const rec = Store.level(subject, n); const status = Store.levelStatus(subject, n, E.requiredModes(subject)); const tone = UI.toneOf(subject);
    const words = (L.words || []).map((w) => w.w);
    const wordChips = subject === "understand" ? understandHubInfo(L) : subject === "math" ? '<div class="small muted">Fresh problems every time. Example: <b>' + U.esc(L.gen().q) + "</b></div>" : '<div class="chips" id="chips">' + words.slice(0, 6).map((w) => '<button class="chip word" data-w="' + U.esc(w) + '">' + U.esc(w) + "</button>").join("") + (words.length > 6 ? '<button class="chip soft" id="more">+' + (words.length - 6) + " more</button>" : "") + "</div>";
    const rows = C.modes.filter((m) => m !== "story").map((m) => { const info = E.MODE_INFO[m]; const best = rec.modes[m] ? rec.modes[m].best : null; return '<div class="mode-row"><div class="mi ' + info.tone + '">' + UI.icon(info.icon) + '</div><div class="grow"><div class="t">' + info.label + '</div><div class="n' + (best != null && best >= status.passMark ? " ok" : "") + '">' + (best != null ? "Best " + best + "%" : info.blurb) + '</div><div class="bar thin ' + info.tone + '"><i style="width:' + (best || 0) + '%"></i></div></div><a class="btn ' + (best != null && best >= status.passMark ? "" : "primary") + '" href="#play-' + subject + "-" + n + "-" + m + '">' + (best != null ? "Again" : "Start") + "</a></div>"; }).join("");
    const stories = (L.stories || []).filter(Boolean);
    const story = stories.length ? '<div class="section-title" style="font-size:15px">Stories in this level <span class="small muted">' + stories.length + "</span></div>" + stories.map((st, i) => '<div class="mode-row story"><div class="mi indigo">' + UI.icon("book") + '</div><div class="grow"><div class="t">' + U.esc(st.title) + '</div><div class="n">Listen, read it word by word, then ' + st.questions.length + " questions" + (i === 0 && rec.modes.story ? " · best " + rec.modes.story.best + "%" : "") + '</div></div><a class="btn ' + (i === 0 && !rec.modes.story ? "primary" : "") + '" href="#play-' + subject + "-" + n + "-story-" + i + '">Read</a></div>').join("") : "";
    const speeds = [["0", "Tap"], ["2", "Slow"], ["1", "Normal"], ["0.5", "Fast"], ["0.3", "Turbo"]]; const orders = [["shuffle", "Shuffle"], ["order", "In order"], ["story", "Story words"]];
    const donePct = Math.round((status.played.length / C.modes.length) * 100);
    root.innerHTML = '<div class="screen"><div class="hero ' + tone + '"><div class="appbar"><a class="ib" href="#home-' + subject + '" aria-label="Back">' + UI.icon("back") + '</a><span class="ttl">' + C.name + " · " + (subject === "understand" ? "Stage " + L.stage + " of 5" : Store.gradeName(Store.grade())) + '</span><a class="ib" href="#home" aria-label="Home">' + UI.icon("home") + '</a></div><div class="row" style="align-items:flex-start"><div class="grow stack" style="gap:8px"><div class="caps" style="opacity:.9">Level ' + n + " of " + E.levels(subject).length + "</div><h1>" + U.esc(L.name) + '</h1><div class="sub">' + U.esc(L.skill) + '</div><div class="row wrap" style="gap:8px"><span class="chip glass">' + UI.stars(rec.stars).replace('class="stars"', 'class="stars glass"') + '</span><span class="chip glass">' + (status.passed ? "Passed" : status.played.length + " of " + C.modes.length + " modes") + '</span></div></div><div class="ring-big" style="background:conic-gradient(#FFFFFF 0 ' + donePct + '%, rgba(255,255,255,.3) ' + donePct + '% 100%)"><div style="background:var(--' + tone + ')"><div class="v num">' + donePct + '%</div><div class="l">done</div></div></div></div></div>' +
      '<div style="margin-top:18px">' + wordChips + '</div><a class="btn soft-green" style="margin-top:12px;width:100%" href="#library-' + subject + '">' + UI.icon("book") + ' Study everything in the Library</a><div class="mode-list">' + rows + story + "</div>" +
      (subject !== "math" && subject !== "understand" ? '<div class="section-title" style="font-size:15px">Word speed <span class="small muted" id="speedlbl"></span></div><div class="choice-grid" id="speed" style="grid-template-columns:repeat(5,minmax(0,1fr));margin-top:8px">' + speeds.map(([v, l]) => '<button class="btn" data-v="' + v + '">' + l + "</button>").join("") + '</div><div class="section-title" style="font-size:15px;margin-top:16px">Word order</div><div class="choice-grid three" id="order" style="margin-top:8px">' + orders.map(([v, l]) => '<button class="btn" data-v="' + v + '">' + l + "</button>").join("") + "</div>" : "") +
      '<div class="card flat" style="margin-top:18px"><div class="status-line">' + (status.passed ? '<span class="chip green">' + ic("check", "width:16px;height:16px") + " Passed</span>" : '<span class="chip gold">' + status.played.length + " of " + C.modes.length + " modes played</span>") + (status.played.length ? "<span>Average " + status.accuracy + "%</span>" : "") + "<span>Pass mark " + status.passMark + '%</span></div><div class="small muted" style="margin-top:8px">' + (status.passed ? "Level " + Math.min(E.levels(subject).length, n + 1) + " is open. Replays here are review and earn no new stars." : "Play every mode once with " + status.passMark + "% or better on average to unlock Level " + (n + 1) + ".") + "</div></div></div>" + bottomNav("home");
    const chips = root.querySelector("#chips"); const bindChips = () => chips.querySelectorAll(".chip.word").forEach((b) => { b.onclick = () => Speech.speak(b.dataset.w, { rate: s.settings.rate }); });
    if (chips) { bindChips(); const more = root.querySelector("#more"); if (more) more.onclick = () => { chips.innerHTML = words.map((w) => '<button class="chip word" data-w="' + U.esc(w) + '">' + U.esc(w) + "</button>").join(""); bindChips(); }; }
    const drawChoice = () => { const sp = String(s.settings.speed === "level" ? L.speed : s.settings.speed); root.querySelectorAll("#speed .btn").forEach((b) => b.classList.toggle("on", b.dataset.v === sp || (s.settings.speed === "level" && Number(b.dataset.v) === L.speed))); root.querySelectorAll("#order .btn").forEach((b) => b.classList.toggle("on", b.dataset.v === ({ random: "shuffle" }[s.settings.order] || s.settings.order || "shuffle"))); const lbl = root.querySelector("#speedlbl"); if (lbl) { const v = s.settings.speed === "level" ? L.speed : Number(s.settings.speed); lbl.textContent = v > 0 ? "· " + v + " s per word" : "· tap to advance"; } };
    root.querySelectorAll("#speed .btn").forEach((b) => { b.onclick = () => { Store.setting("speed", b.dataset.v === "0" ? 0 : Number(b.dataset.v)); drawChoice(); }; });
    root.querySelectorAll("#order .btn").forEach((b) => { b.onclick = () => { Store.setting("order", b.dataset.v); drawChoice(); }; });
    drawChoice();
  };

  // ---------- Results ----------
  V.results = (root) => {
    const r = window.GKA.lastResult; if (!r) return go("home"); if (r.source === "placement") return placementResult(root, r);
    const C = E.subject(r.subject); const st = r.status; const passedNow = st && st.firstPass; const passed = st && st.passed;
    const rec = r.source === "level" ? Store.level(r.subject, r.n) : null;
    const rating = st ? st.rating : (r.accuracy >= 100 ? 3 : r.accuracy >= 95 ? 2 : r.accuracy >= 90 ? 1 : 0);
    const title = passedNow ? "Level " + r.n + " passed!" : r.accuracy >= 90 ? "Lesson complete!" : r.accuracy >= 70 ? "Good practice!" : "Keep practicing!";
    const sub = passedNow ? U.esc(E.level(r.subject, r.n).name) + " · Level " + Math.min(E.levels(r.subject).length, r.n + 1) + " is unlocked" : r.source === "level" ? E.modeLabel(r.mode) + " · Level " + r.n + (passed ? " · already passed" : "") : E.modeLabel(r.mode) + " · " + (r.source === "mywords" ? "My Words" : "Review");
    const modeRows = rec ? C.modes.map((m) => { const b = rec.modes[m]; return "<div><span>" + E.modeLabel(m) + '</span><span class="num ' + (b ? (b.best >= (st ? st.passMark : 90) ? "ok" : "meh") : "none") + '">' + (b ? b.best + "%" : "not yet") + "</span></div>"; }).join("") : "";
    let nextRoute = "hub-" + r.subject + "-" + r.n, nextLabel = "Continue";
    if (r.source === "level") { if (passedNow && r.n < E.levels(r.subject).length) { nextRoute = "hub-" + r.subject + "-" + (r.n + 1); nextLabel = "Start Level " + (r.n + 1); } else if (!passed) { const remaining = C.modes.filter((m) => !rec.modes[m]); if (remaining.length) { nextRoute = "play-" + r.subject + "-" + r.n + "-" + remaining[0]; nextLabel = "Next: " + E.modeLabel(remaining[0]); } else { const weakest = C.modes.slice().sort((a, b) => rec.modes[a].best - rec.modes[b].best)[0]; nextRoute = "play-" + r.subject + "-" + r.n + "-" + weakest; nextLabel = "Retry " + E.modeLabel(weakest); } } } else { nextRoute = r.source === "mywords" ? "words" : "hub-" + r.subject + "-" + r.n; nextLabel = "Continue"; }
    const accWord = r.accuracy >= 95 ? "Amazing" : r.accuracy >= 85 ? "Great" : r.accuracy >= 70 ? "Good" : "Keep going";
    root.innerHTML = '<div class="screen"><div class="results"><svg class="mascot" viewBox="0 0 120 120">' + UI.mascot(UI.subjectMascot(r.subject)).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + "</svg>" + '<div class="big-stars">' + [0, 1, 2].map((i) => UI.icons.star.replace("<svg", '<svg class="' + (i < rating ? "on" : "") + '"')).join("") + "</div><h1>" + title + '</h1><div class="sub">' + sub + "</div>" +
      '<div class="stat-tiles"><div class="stat-tile yellow"><div class="h">Total stars</div><div class="v">' + UI.icon("star") + "+" + (r.stars + r.bonus) + '</div></div><div class="stat-tile green"><div class="h">' + accWord + '</div><div class="v">' + UI.icon("target") + r.accuracy + '%</div></div><div class="stat-tile blue"><div class="h">Time</div><div class="v">' + UI.icon("clock") + U.fmtMin(r.secs) + "</div></div></div></div>" +
      (r.refilled && R().heartsOn() ? '<div class="notice green" style="margin-top:14px">' + UI.icon("heart") + "<div>Hearts refilled! Practice always brings them back.</div></div>" : "") +
      (r.rewards && r.rewards.badges.length ? '<div class="card gold" style="margin-top:14px"><div class="caps" style="margin-bottom:8px">New badge' + (r.rewards.badges.length > 1 ? "s" : "") + '!</div><div class="stack">' + r.rewards.badges.map((b) => '<div class="badge-row"><span class="badge on">' + UI.icon(b.icon) + '</span><div><div style="font-weight:900">' + b.name + '</div><div class="small muted">' + b.desc + " · +5 gems</div></div></div>").join("") + "</div></div>" : "") +
      (r.rewards && r.rewards.quests.length ? '<div class="card" style="margin-top:14px"><div class="caps muted" style="margin-bottom:8px">Quest complete</div>' + r.rewards.quests.map((q) => '<div class="quest done"><div class="qi">' + UI.icon("gift") + '</div><div class="grow"><div class="t">' + q.text + '</div></div><button class="btn primary claim" data-claim="' + q.id + '">Claim</button></div>').join("") + "</div>" : "") +
      (modeRows ? '<div class="card" style="margin-top:18px"><div class="caps muted" style="margin-bottom:8px">Level ' + r.n + ' progress</div><div class="mode-rows">' + modeRows + "</div>" + (r.bonus ? '<div class="small muted" style="margin-top:8px">+' + r.bonus + " bonus stars for passing the level.</div>" : "") + (r.review ? '<div class="small muted" style="margin-top:4px">' + r.review + " review cards earned no new stars.</div>" : "") + "</div>" : "") +
      (r.missed.length ? '<div class="card" style="margin-top:14px"><div style="font-weight:900">Practice these again</div><div class="chips" style="margin-top:8px">' + r.missed.slice(0, 8).map((w) => '<span class="chip orange word">' + U.esc(w.length > 40 ? w.slice(0, 40) + "…" : w) + "</span>").join("") + "</div></div>" : "") +
      '<div class="stack" style="margin-top:18px"><a class="btn primary lg" href="#' + nextRoute + '">' + nextLabel + '</a><a class="btn" href="#' + (r.source === "mywords" ? "words" : "hub-" + r.subject + "-" + r.n) + '">' + (r.source === "mywords" ? "My Words" : "Level " + r.n) + '</a><a class="btn flat" href="#home-' + r.subject + '">Back to the path</a></div></div>';
    bindQuests(root, () => { if (r.rewards) r.rewards.quests = []; V.results(root); });
  };

  // ---------- Me: profile, hearts, quests, badges, leaderboard, shop ----------
  V.me = (root) => {
    if (!Store.hasProfile()) return go("profiles");
    const s = Store.get(); const kid = Store.profile(); const c = R().counters(); const gems = R().gems();
    const hearts = R().hearts(); const wait = R().nextHeartIn();
    const board = R().leaderboard();
    const earned = R().BADGES.filter((b) => R().hasBadge(b.id)).length;
    root.innerHTML = '<div class="screen">' + topbar() +
      '<div class="me-head"><span class="avatar lg">' + UI.avatar(kid.avatar) + '</span><div class="grow"><h1>' + U.esc(kid.name) + '</h1><div class="muted small">' + Store.gradeName(kid.grade) + " · learning since " + new Date(kid.created || Date.now()).toLocaleDateString(undefined, { month: "short", year: "numeric" }) + '</div><div class="row wrap" style="margin-top:10px;gap:8px"><a class="btn soft-blue" href="#editkid-' + kid.id + '">' + UI.icon("pencil") + ' Edit</a><a class="btn soft-gold" href="#profiles">' + UI.icon("users") + ' Switch kid</a><button class="btn soft-blue" data-install hidden>' + UI.icon("download") + ' Install app</button></div></div></div>' +
      '<div class="me-stats"><div><b class="num">' + Store.streak() + "</b><span>" + UI.icon("flame") + ' Day streak</span></div><div><b class="num">' + s.stars + "</b><span>" + UI.icon("star") + ' Stars</span></div><div><b class="num">' + gems + "</b><span>" + UI.icon("gem") + ' Gems</span></div><div><b class="num">' + (c.lessons || 0) + "</b><span>" + UI.icon("check") + " Lessons</span></div></div>" +
      (R().heartsOn() ? '<div class="card" style="margin-top:16px"><div class="row between"><div style="font-weight:900">Hearts</div>' + heartsRow("lg") + '</div><div class="small muted" style="margin-top:6px">' + (hearts >= R().MAX_HEARTS ? "Full! Each mistake in a lesson costs one heart." : "Next heart in " + Math.ceil(wait / 60000) + " min. Practice a passed level or My Words to refill them now.") + "</div>" + (hearts < R().MAX_HEARTS ? '<button class="btn" id="refill" style="margin-top:10px">' + UI.icon("gem") + " Refill for 30 gems</button>" : "") + "</div>" : "") +
      '<div style="margin-top:16px">' + questsHTML(false) + "</div>" +
      '<div class="section-title">Badges <span class="small muted num">' + earned + " / " + R().BADGES.length + '</span></div><div class="badges">' + R().BADGES.map((b) => { const on = R().hasBadge(b.id); return '<div class="badge-card' + (on ? " on" : "") + '"><span class="badge' + (on ? " on" : "") + '">' + UI.icon(b.icon) + '</span><div class="bn">' + b.name + '</div><div class="bd">' + b.desc + "</div></div>"; }).join("") + "</div>" +
      '<div class="section-title">This week\'s leaderboard</div><div class="card flat" style="margin-top:10px"><div class="stack" style="gap:8px">' + board.map((p, i) => '<div class="lb-row' + (p.id === kid.id ? " me" : "") + '"><span class="rank' + (i < 3 ? " top" : "") + '">' + (i + 1) + '</span><span class="avatar">' + UI.avatar(p.avatar) + '</span><div class="grow"><div style="font-weight:900">' + U.esc(p.name) + (p.id === kid.id ? " (you)" : "") + '</div><div class="small muted">' + Store.gradeName(p.grade) + " · " + p.total + ' stars in total</div></div><span class="pill num">' + UI.icon("star") + p.week + "</span></div>").join("") + "</div>" + (board.length < 2 ? '<div class="small muted" style="margin-top:8px">Add a brother, sister or friend on the Parents page to race for stars each week.</div>' : "") + "</div>" +
      '<div class="section-title">Shop <span class="small muted">' + UI.icon("gem").replace("<svg", '<svg style="width:16px;height:16px;display:inline;vertical-align:-3px"') + " " + gems + " gems</span></div><div class=\"stack\" style=\"margin-top:10px\">" + R().SHOP.map((it) => { const owned = it.id === "freeze" ? R().freezes() : 0; const cant = it.id === "refill" && (hearts >= R().MAX_HEARTS || !R().heartsOn()); return '<div class="shop-row"><div class="mi ' + (it.id === "refill" ? "orange" : "blue") + '">' + UI.icon(it.icon) + '</div><div class="grow"><div class="t">' + it.name + (owned ? ' <span class="chip blue">' + owned + " ready</span>" : "") + '</div><div class="n">' + it.desc + '</div></div><button class="btn' + (gems >= it.cost && !cant && !(it.id === "freeze" && owned >= 2) ? " primary" : "") + '" data-buy="' + it.id + '"' + (cant || (it.id === "freeze" && owned >= 2) ? " disabled" : "") + ">" + UI.icon("gem") + " " + it.cost + "</button></div>"; }).join("") + "</div>" +
      '<div class="small muted" style="margin-top:14px">Gems come from daily quests, badges and treasure chests on the path.</div></div>' + bottomNav("me");
    bindGrade(root); bindInstall(root);
    bindQuests(root, () => V.me(root));
    const refill = root.querySelector("#refill"); if (refill) refill.onclick = () => { if (R().buy("refill")) { Speech.sfx("win"); UI.toast("Hearts refilled", "ok"); V.me(root); } else UI.toast("You need 30 gems for that", "warn"); };
    root.querySelectorAll("[data-buy]").forEach((b) => { b.onclick = () => { if (R().buy(b.dataset.buy)) { Speech.sfx("win"); UI.toast(b.dataset.buy === "refill" ? "Hearts refilled" : "Streak freeze ready", "ok"); V.me(root); } else UI.toast("Not enough gems yet. Finish a quest!", "warn"); }; });
  };

  // ---------- My Words ----------
  V.words = (root) => {
    if (!Store.hasProfile()) return go("profiles");
    const s = Store.get(); const list = Store.myWords();
    const rows = list.length ? list.map((w) => '<div class="word-row"><button class="btn icon soft-green" data-say="' + U.esc(w.w) + '" aria-label="Hear ' + U.esc(w.w) + '">' + UI.icon("ear") + '</button><div class="grow" style="min-width:0"><div class="w">' + U.esc(w.w) + '</div><div class="small muted">' + U.esc(w.from) + "</div></div>" + UI.stars(Store.wordStars("reading", w.w)) + '<button class="xbtn" data-del="' + w.id + '" aria-label="Remove ' + U.esc(w.w) + '">' + UI.icon("close") + "</button></div>").join("") : '<div class="empty">' + UI.icon("words") + "<div>No words yet. Add words from school, a book, or anything " + U.esc(s.kid.name) + " wants to learn.</div></div>";
    root.innerHTML = '<div class="screen">' + topbar() + '<h1 style="font-size:28px;margin-top:18px">' + U.esc(s.kid.name) + "'s words</h1><div class=\"small muted\">Words from school, books, or home. Practice them in every mode.</div>" +
      '<div class="card" style="margin-top:16px"><label class="lbl" for="newword">Add a word</label><div class="row"><input class="input grow" id="newword" type="text" placeholder="Type a word, like giraffe" autocomplete="off" autocapitalize="off"><button class="btn icon primary" id="add" aria-label="Add word">' + UI.icon("plus") + '</button></div><div class="row wrap" style="margin-top:10px"><button class="btn soft-orange" id="say">' + UI.icon("mic") + ' Say it to add it</button><button class="btn soft-green" id="paste">Paste a list</button><select class="input" id="from" style="min-height:40px;width:auto;flex:1 1 120px;font-size:14px"><option>School</option><option>Book</option><option>Home</option></select></div></div>' +
      '<div class="row between" style="margin-top:18px"><div style="font-weight:900">' + list.length + ' words saved</div></div><div class="word-list" style="margin-top:10px">' + rows + "</div>" +
      (list.length ? '<div class="section-title">Practice my words</div><div class="choice-grid" style="margin-top:10px">' + ["read", "speak", "listen", "write"].map((m) => '<a class="btn" href="#play-words-' + m + '" style="flex-direction:column;min-height:64px;gap:2px;font-size:12px">' + ic(E.MODE_INFO[m].icon, "color:var(--" + E.MODE_INFO[m].tone + ")") + E.MODE_INFO[m].label.replace("I ", "") + "</a>").join("") + "</div>" : "") + "</div>" + bottomNav("words");
    bindGrade(root);
    const input = root.querySelector("#newword");
    const add = () => { const v = input.value.trim(); if (!v) return; if (Store.addWord(v, "", root.querySelector("#from").value)) { UI.toast("Added " + v, "ok"); Speech.sfx("ok"); V.words(root); setTimeout(() => { const i = root.querySelector("#newword"); if (i) i.focus(); }, 0); } else UI.toast(v + " is already in your list", "warn"); };
    root.querySelector("#add").onclick = add; input.onkeydown = (e) => { if (e.key === "Enter") add(); };
    root.querySelector("#say").onclick = () => { if (!Speech.sttOK) return UI.toast("Speech recognition is not available in this browser", "warn"); const b = root.querySelector("#say"); b.classList.add("listening"); b.textContent = "Listening…"; Speech.listen({ timeoutMs: 6000 }).then((res) => { b.classList.remove("listening"); b.innerHTML = UI.icon("mic") + " Say it to add it"; const w = U.norm(res.transcript); if (w) { input.value = w; add(); } }).catch(() => { b.classList.remove("listening"); b.innerHTML = UI.icon("mic") + " Say it to add it"; UI.toast("I did not catch that. Try again.", "warn"); }); };
    root.querySelector("#paste").onclick = () => { const m = UI.modal('<h2>Paste a list</h2><p class="muted small">One word per line, or separated by commas.</p><textarea class="input" id="pl" placeholder="giraffe, because, thunder"></textarea><div class="row"><button class="btn grow" id="c">Cancel</button><button class="btn primary grow" id="ok">Add words</button></div>'); m.el.querySelector("#c").onclick = m.close; m.el.querySelector("#ok").onclick = () => { const txt = m.el.querySelector("#pl").value; let n = 0; txt.split(/[\n,;]+/).map((x) => x.trim()).filter(Boolean).forEach((w) => { if (Store.addWord(w, "", root.querySelector("#from").value)) n++; }); m.close(); UI.toast("Added " + n + " words", "ok"); V.words(root); }; };
    root.querySelectorAll("[data-say]").forEach((b) => { b.onclick = () => Speech.speak(b.dataset.say, { rate: s.settings.rate }); });
    root.querySelectorAll("[data-del]").forEach((b) => { b.onclick = () => { Store.removeWord(b.dataset.del); V.words(root); }; });
  };

  // ---------- Parents ----------
  let parentUnlocked = false;
  V.parent = (root) => {
    if (!parentUnlocked) return pinGate(root, () => { parentUnlocked = true; V.parent(root); });
    const s = Store.get(); const kid = Store.profile(); const week = Store.weekMinutes(); const totalMin = week.reduce((a, d) => a + d.min, 0); const maxMin = Math.max(15, ...week.map((d) => d.min)); const weak = Store.weakWords(null, 6);
    const kidRows = Store.profiles().map((p) => '<div class="kid-row' + (kid && p.id === kid.id ? " on" : "") + '"><span class="avatar">' + UI.avatar(p.avatar) + '</span><div class="grow"><div style="font-weight:900">' + U.esc(p.name) + '</div><div class="small muted">' + Store.gradeName(p.grade) + " · " + (Store.profiles().length ? "" : "") + '</div></div>' + (kid && p.id === kid.id ? '<span class="chip blue">Current</span>' : '<button class="btn plain" data-use="' + p.id + '" style="min-height:40px;font-size:13px">Use</button>') + '<a class="btn icon" href="#editkid-' + p.id + '" aria-label="Edit">' + UI.icon("pencil") + '</a><button class="xbtn" data-remove="' + p.id + '" aria-label="Remove">' + UI.icon("trash") + "</button></div>").join("");
    const subjCards = kid ? SUBJECTS.map((id) => { const C = E.subject(id); const cur = Store.currentLevel(id); const rec = Store.levelPeek(id, cur); const st = Store.levelStatus(id, cur, C.modes); const tone = UI.toneOf(id); let weakest = "–"; if (rec) { const played = C.modes.filter((m) => rec.modes[m]); if (played.length) weakest = E.modeLabel(played.sort((a, b) => rec.modes[a].best - rec.modes[b].best)[0]); } return '<div class="dash-card ' + tone + '"><div class="row between"><h3>' + C.name + '</h3><span class="small" style="color:var(--' + tone + '-fg)">Level ' + cur + ' of ' + E.levels(id).length + '</span></div><div class="bar thin ' + tone + '"><i style="width:' + Math.round((Store.highestPassed(id) / (E.levels(id).length || 20)) * 100) + '%"></i></div><div class="kv"><span>Current level average</span><b class="num">' + (st.played.length ? st.accuracy + "%" : "not started") + '</b></div><div class="kv"><span>Modes played</span><b class="num">' + st.played.length + " / " + C.modes.length + '</b></div><div class="kv"><span>Weakest mode</span><b>' + weakest + '</b></div><div class="kv"><span>Stars from this subject</span><b class="num">' + Store.starsFor(id) + "</b></div></div>"; }).join("") : "";
    const voices = Speech.voices.length ? Speech.voices : (Speech.pickVoice() ? [Speech.pickVoice()] : []);
    root.innerHTML = '<div class="screen wide">' + topbar() + '<div class="row between" style="margin-top:18px"><h1 style="font-size:28px">Parents</h1><button class="btn icon" id="lock" aria-label="Lock parent page">' + UI.icon("lock") + "</button></div>" +
      '<div class="dash-card" style="margin-top:16px"><h3>Kids</h3><div class="stack">' + kidRows + '</div><a class="btn" href="#addkid" style="align-self:flex-start">' + UI.icon("plus") + " Add a kid</a></div>" +
      (kid ? '<h2 style="font-size:22px;margin-top:24px">' + U.esc(kid.name) + " · " + Store.gradeName(kid.grade) + '</h2><div class="small muted">Last 7 days · ' + Store.streak() + "-day streak · " + totalMin + " minutes · " + s.stars + ' stars in total</div><div class="dash-grid" style="margin-top:16px">' + subjCards + "</div>" +
      '<div class="dash-grid two" style="margin-top:16px"><div class="dash-card"><h3>Minutes per day</h3><div class="week">' + week.map((d) => '<div><span class="num">' + d.min + '</span><i class="' + (d.min >= (s.settings.goalMin || 10) ? "goal" : d.min === 0 ? "zero" : "") + '" style="height:' + Math.max(4, Math.round((d.min / maxMin) * 100)) + 'px"></i><span>' + d.day + "</span></div>").join("") + '</div><div class="small muted">Goal: ' + (s.settings.goalMin || 10) + " minutes a day. Yellow bars met the goal.</div></div>" +
      '<div class="dash-card"><h3>Words to practice together</h3>' + (weak.length ? weak.map((w) => '<div class="kv" style="align-items:center"><span style="font-weight:900;font-size:17px;color:var(--fg)">' + U.esc(w.word.length > 28 ? w.word.slice(0, 28) + "…" : w.word) + '</span><span class="small">missed ' + w.n + "× in " + Object.keys(w.modes).map(E.modeLabel).join(", ") + "</span></div>").join("") + '<a class="btn soft-blue" href="#play-review-reading-speak" style="margin-top:6px">Practice the reading review list</a>' : '<div class="muted small">No misses yet. They will show up here.</div>') + "</div></div>" : "") +
      '<div class="dash-card" style="margin-top:16px"><h3>Settings</h3><div class="setting-grid">' +
        field("Pass mark to unlock the next level", sel("passmark", [["80", "80%"], ["85", "85%"], ["90", "90% (recommended)"], ["95", "95%"], ["100", "100%"]], String(s.settings.passMark))) +
        field("Mic matching", sel("matching", [["strict", "Strict: exact word only"], ["normal", "Normal: close sounds count"], ["forgiving", "Forgiving: best for young kids"]], s.settings.matching)) +
        field("Device voice (when no AI voice)", '<select class="input" id="voice"><option value="">Automatic: most natural voice</option>' + voices.map((v) => '<option value="' + U.esc(v.voiceURI) + '"' + (s.settings.voiceURI === v.voiceURI ? " selected" : "") + ">" + (Speech.isNatural(v) ? "★ " : "") + U.esc(v.name) + "</option>").join("") + "</select>") +
        field("Voice speed", sel("rate", [["0.7", "Slow"], ["0.9", "Normal"], ["1.1", "Quick"]], String(s.settings.rate))) +
        field("Daily goal (minutes)", sel("goalmin", [["5", "5"], ["10", "10"], ["15", "15"], ["20", "20"], ["30", "30"]], String(s.settings.goalMin))) +
        field("Daily goal (cards)", sel("goalcards", [["15", "15"], ["25", "25"], ["40", "40"], ["60", "60"]], String(s.settings.goalCards))) +
        field("Sounds", sel("sound", [["1", "On"], ["0", "Off"]], s.settings.sound ? "1" : "0")) +
        field("Hearts (lose one per mistake)", sel("hearts", [["1", "On, like Duolingo"], ["0", "Off: unlimited tries"]], s.settings.hearts === false ? "0" : "1")) +
        field("Math problems per lesson", sel("decksize", [["10", "10"], ["15", "15"], ["20", "20 (recommended)"], ["30", "30"]], String(s.settings.deckSize || 20))) +
        field("Theme", sel("theme", [["auto", "Match device"], ["light", "Light"], ["dark", "Dark"]], s.settings.theme || "auto")) +
        field("Parent PIN (4 digits)", '<input class="input" id="pin" inputmode="numeric" maxlength="4" value="' + U.esc(s.settings.pin) + '">') +
      '</div><div class="row wrap" style="margin-top:12px"><button class="btn primary" id="save">Save settings</button><button class="btn" id="testvoice">' + UI.icon("ear") + " Test voice</button></div></div>" +
      aiCard(s) + '<div class="dash-card" style="margin-top:16px"><h3>App on this device</h3><div class="small muted">After the first visit the whole app is saved on the device and works with no internet. Install it to get an icon on the home screen and a full-screen app.</div><div class="row wrap"><button class="btn primary" data-install hidden>' + UI.icon("download") + ' Install app</button><span class="small muted" id="pwa-state"></span></div></div><div class="dash-card" style="margin-top:16px"><h3>Backup</h3><div class="small muted">Progress for every kid is saved on this device. Copy a backup to move it to another device.</div><div class="row wrap"><button class="btn" id="export">' + UI.icon("download") + ' Copy backup</button><button class="btn" id="import">' + UI.icon("upload") + ' Restore backup</button><button class="btn flat" id="reset" style="color:var(--red-fg)">' + UI.icon("trash") + " Reset everything</button></div></div></div>" + bottomNav("parent");
    bindGrade(root); bindInstall(root);
    root.querySelector("#lock").onclick = () => { parentUnlocked = false; go("home"); };
    root.querySelectorAll("[data-use]").forEach((b) => { b.onclick = () => { Store.setCurrent(b.dataset.use); V.parent(root); }; });
    root.querySelectorAll("[data-remove]").forEach((b) => { b.onclick = () => { const p = Store.profiles().find((x) => x.id === b.dataset.remove); const m = UI.modal("<h2>Remove " + U.esc(p.name) + "?</h2><p class=\"muted small\">All of this kid's progress, stars and words will be erased.</p><div class=\"row\"><button class=\"btn grow\" id=\"c\">Keep</button><button class=\"btn red grow\" id=\"ok\">Remove</button></div>"); m.el.querySelector("#c").onclick = m.close; m.el.querySelector("#ok").onclick = () => { Store.removeProfile(p.id); m.close(); V.parent(root); }; }; });
    root.querySelector("#testvoice").onclick = () => { const v = root.querySelector("#voice").value; Speech.speak("Hi " + (kid ? kid.name : "there") + "! Let's learn something new today.", { voiceURI: v, rate: Number(root.querySelector("#rate").value) }); };
    root.querySelector("#save").onclick = () => { const g = (id) => root.querySelector("#" + id).value; Store.setting("passMark", Number(g("passmark"))); Store.setting("matching", g("matching")); Store.setting("voiceURI", g("voice")); Store.setting("rate", Number(g("rate"))); Store.setting("goalMin", Number(g("goalmin"))); Store.setting("goalCards", Number(g("goalcards"))); Store.setting("sound", g("sound") === "1"); Store.setting("hearts", g("hearts") === "1"); Store.setting("deckSize", Number(g("decksize"))); Store.setting("theme", g("theme")); const pin = g("pin").replace(/\D/g, ""); if (pin.length === 4) Store.setting("pin", pin); window.GKA.App.applyTheme(); UI.toast("Settings saved", "ok"); };
    bindAI(root);
    root.querySelector("#export").onclick = () => { const txt = Store.exportJSON(); const done = () => UI.toast("Backup copied. Paste it somewhere safe.", "ok"); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(() => showBackupText(txt)); else showBackupText(txt); };
    root.querySelector("#import").onclick = () => { const m = UI.modal('<h2>Restore backup</h2><p class="muted small">Paste the backup text here. This replaces the progress on this device.</p><textarea class="input" id="bk"></textarea><div class="row"><button class="btn grow" id="c">Cancel</button><button class="btn primary grow" id="ok">Restore</button></div>'); m.el.querySelector("#c").onclick = m.close; m.el.querySelector("#ok").onclick = () => { try { Store.importJSON(m.el.querySelector("#bk").value); m.close(); UI.toast("Progress restored", "ok"); window.GKA.App.applyTheme(); V.parent(root); } catch (e) { UI.toast("That is not a valid backup", "warn"); } }; };
    root.querySelector("#reset").onclick = () => { const m = UI.modal('<h2>Reset everything?</h2><p class="muted small">All kids, stars, levels, words and settings on this device will be erased. Copy a backup first if you want to keep it.</p><div class="row"><button class="btn grow" id="c">Keep it</button><button class="btn red grow" id="ok">Erase everything</button></div>'); m.el.querySelector("#c").onclick = m.close; m.el.querySelector("#ok").onclick = () => { Store.reset(); m.close(); parentUnlocked = false; window.GKA.App.applyTheme(); UI.toast("Everything was reset"); go("profiles"); }; };
  };
  // ---- Voice and AI teacher (parent only). Keys are typed by the parent and stay on this device, outside backups. ----
  function aiCard(s) {
    const k = Speech.keys(); const st = s.settings; const T = window.GKA.Teacher;
    const keyField = (id, label, val, help) => field(label, '<input class="input" id="' + id + '" type="password" autocomplete="off" spellcheck="false" placeholder="' + (val ? "Saved on this device (type to replace)" : "Paste key here") + '">' + '<div class="small muted" style="margin-top:4px">' + help + "</div>");
    return '<div class="dash-card" style="margin-top:16px"><h3>Voice and AI teacher</h3>' +
      '<div class="small muted">Now speaking with: <b id="ai-voice-now">' + U.esc(Speech.engineLabel()) + '</b> · Nova teacher: <b id="ai-teach-now">' + U.esc(T ? T.providerLabel() : "Built-in help") + "</b></div>" +
      '<div class="small muted" style="margin-top:6px">Free and instant: the app already picks the most natural voice on this device (Microsoft Edge and Safari have very human voices). For a studio-quality AI voice and a teacher who can answer anything, add your own key from OpenAI, ElevenLabs or Anthropic (Claude). Keys stay only on this device, are never in backups and are sent only to that company. Set a monthly spending limit in your account there.</div>' +
      '<div class="setting-grid" style="margin-top:12px">' +
        field("Voice", sel("ai-engine", [["device", "Natural device voice (free)"], ["openai", "OpenAI AI voice"], ["elevenlabs", "ElevenLabs AI voice (most human)"]], st.voiceEngine || "device")) +
        field("OpenAI voice", sel("ai-ovoice", Speech.AI_VOICES.openai, st.aiVoice || "nova")) +
        field("ElevenLabs voice", sel("ai-evoice", Speech.AI_VOICES.elevenlabs, st.elevenVoice || "21m00Tcm4TlvDq8ikWAM")) +
        field("Nova teacher uses", sel("ai-prov", [["auto", "Automatic (best available)"], ["anthropic", "Claude (Anthropic key)"], ["openai", "OpenAI (OpenAI key)"]], st.aiProvider || "auto")) +
        field("Claude model", sel("ai-model", [["claude-haiku-5-5", "Fastest: Claude Haiku 5.5"], ["claude-sonnet-5-5", "Smartest: Claude Sonnet 5.5"]], st.aiModel || "claude-haiku-5-5")) +
        field("OpenAI chat model", '<input class="input" id="ai-omodel" value="' + U.esc(st.openaiModel || "gpt-4o-mini") + '" autocomplete="off" spellcheck="false">') +
        keyField("key-openai", "OpenAI key (voice and teacher)", k.openai, "From platform.openai.com, API keys.") +
        keyField("key-eleven", "ElevenLabs key (voice)", k.elevenlabs, "From elevenlabs.io, Profile, API keys.") +
        keyField("key-anthropic", "Anthropic key (Claude teacher)", k.anthropic, "From console.anthropic.com, API keys.") +
      '</div><div class="row wrap" style="margin-top:12px"><button class="btn primary" id="ai-save">Save voice and AI</button><button class="btn" id="ai-testv">' + UI.icon("ear") + ' Test voice</button><button class="btn" id="ai-testt">' + UI.icon("chat") + ' Test teacher</button><button class="btn flat" id="ai-forget">Remove keys</button><button class="btn flat" id="ai-clear">Clear saved voice clips</button></div><div class="small" id="ai-status" style="margin-top:8px"></div>' +
      '<div class="small muted" style="margin-top:6px">In the Claude app version of Genius Kids, Nova uses Claude with no key: the first question asks you to allow it.</div></div>';
  }
  function bindAI(root) {
    const q = (id) => root.querySelector("#" + id);
    const status = (t, ok) => { const el = q("ai-status"); if (el) { el.textContent = t; el.style.color = ok === false ? "var(--red-fg)" : ok ? "var(--green-fg)" : ""; } };
    const labels = () => { q("ai-voice-now").textContent = Speech.engineLabel(); q("ai-teach-now").textContent = window.GKA.Teacher ? window.GKA.Teacher.providerLabel() : "Built-in help"; };
    const save = () => {
      Store.setting("voiceEngine", q("ai-engine").value); Store.setting("aiVoice", q("ai-ovoice").value); Store.setting("elevenVoice", q("ai-evoice").value);
      Store.setting("aiProvider", q("ai-prov").value); Store.setting("aiModel", q("ai-model").value); Store.setting("openaiModel", q("ai-omodel").value.trim() || "gpt-4o-mini");
      const nk = {}; const v1 = q("key-openai").value.trim(), v2 = q("key-eleven").value.trim(), v3 = q("key-anthropic").value.trim();
      if (v1) nk.openai = v1; if (v2) nk.elevenlabs = v2; if (v3) nk.anthropic = v3; if (Object.keys(nk).length) Speech.setKeys(nk);
      ["key-openai", "key-eleven", "key-anthropic"].forEach((id) => { q(id).value = ""; });
      Speech.aiBroken = false; labels();
      const e = q("ai-engine").value, k = Speech.keys();
      if (e === "openai" && !k.openai) return status("Add an OpenAI key to use the OpenAI voice. Until then the device voice speaks.", false);
      if (e === "elevenlabs" && !k.elevenlabs) return status("Add an ElevenLabs key to use that voice. Until then the device voice speaks.", false);
      status("Saved.", true);
    };
    q("ai-save").onclick = save;
    q("ai-testv").onclick = async () => {
      save(); const eng = Speech.engine(); status("Speaking with " + Speech.engineLabel() + "...");
      try { const ok = await Speech.test(eng); status(ok ? "That was " + Speech.engineLabel() + "." : "Could not play the voice." + (Speech.lastError ? " " + Speech.lastError : ""), ok); }
      catch (e) { status("Voice error: " + ((e && e.message) || e) + ". The device voice will be used.", false); }
    };
    q("ai-testt").onclick = async () => {
      save(); const T = window.GKA.Teacher;
      if (!T || !T.provider()) return status("No AI teacher yet: add an Anthropic or OpenAI key. Nova still gives built-in help.", false);
      status("Asking Nova...");
      try { const t = await T.test(); status("Nova says: " + t, true); } catch (e) { status("Teacher error: " + ((e && (e.message || e.code)) || e), false); }
    };
    q("ai-forget").onclick = () => { try { localStorage.removeItem("gka.keys.v1"); } catch (e) { /* ignore */ } labels(); status("Keys removed from this device.", true); };
    q("ai-clear").onclick = async () => { await Speech.clearVoiceCache(); status("Saved voice clips cleared.", true); };
  }
  function showBackupText(txt) { const m = UI.modal('<h2>Your backup</h2><p class="muted small">Select all the text below and copy it.</p><textarea class="input" id="bk" readonly></textarea><button class="btn primary" id="c">Done</button>'); m.el.querySelector("#bk").value = txt; m.el.querySelector("#bk").select(); m.el.querySelector("#c").onclick = m.close; }
  const field = (label, control) => '<div><label class="lbl">' + label + "</label>" + control + "</div>";
  const sel = (id, opts, val) => '<select class="input" id="' + id + '">' + opts.map(([v, l]) => '<option value="' + v + '"' + (v === val ? " selected" : "") + ">" + l + "</option>").join("") + "</select>";
  function pinGate(root, onOK) {
    let entered = "";
    root.innerHTML = '<div class="screen">' + topbar() + '<div class="card lg" style="margin-top:18px;text-align:center"><div style="font-weight:900;font-size:20px">Parents only</div><div class="small muted" style="margin-top:4px">Enter the parent PIN. The first PIN is 1234.</div><div class="pin-dots" style="margin:18px 0" id="dots"><i></i><i></i><i></i><i></i></div><div class="pinpad" id="pad">' + ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k) => k === "" ? "<span></span>" : k === "del" ? '<button class="key del" data-k="del" aria-label="Delete">' + UI.icon("back") + "</button>" : '<button class="key" data-k="' + k + '">' + k + "</button>").join("") + '</div><div id="pinmsg" class="small muted" style="margin-top:12px;min-height:20px"></div></div></div>' + bottomNav("parent");
    bindGrade(root);
    const draw = () => root.querySelectorAll("#dots i").forEach((d, i) => d.classList.toggle("on", i < entered.length));
    root.querySelectorAll("#pad .key").forEach((b) => { b.onclick = () => { const k = b.dataset.k; if (k === "del") entered = entered.slice(0, -1); else if (entered.length < 4) entered += k; draw(); if (entered.length === 4) { if (entered === String(Store.settings().pin)) onOK(); else { root.querySelector("#pinmsg").textContent = "That PIN is not right. Try again."; entered = ""; setTimeout(draw, 300); Speech.sfx("no"); } } }; });
  }

  V._topbar = topbar; V._bottomNav = bottomNav; V._bindGrade = bindGrade;
  window.GKA.Views = V;
})();
