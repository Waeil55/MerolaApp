/* Genius Kids Academy - Practice tab and games. Everything uses the child's own grade and the levels already reached.
   Brain Boost (spaced repetition review), three quick games (Word Pop, Math Sprint, Memory Match), mix practice,
   mistakes, My Words and a thinking challenge from Nova. */
window.GKA = window.GKA || {};
(function () {
  const U = window.GKA.U, Store = window.GKA.Store, Speech = window.GKA.Speech, UI = window.GKA.UI, E = window.GKA.Engine, V = window.GKA.Views;
  const esc = (s) => U.esc(String(s == null ? "" : s));
  const go = (r) => window.GKA.App.go(r);
  const bestKey = (id) => "gka.best." + ((Store.profile() || {}).id || "guest") + "." + Store.grade() + "." + id;
  const best = (id) => { try { return +localStorage.getItem(bestKey(id)) || 0; } catch (e) { return 0; } };
  const setBest = (id, v) => { try { localStorage.setItem(bestKey(id), String(v)); } catch (e) { /* ignore */ } };
  const GAMES = {
    pop: { name: "Word Pop", icon: "ear", tone: "blue", blurb: "Hear a word, pop the right bubble. 60 seconds!" },
    sprint: { name: "Math Sprint", icon: "bolt", tone: "green", blurb: "How many problems can you solve in 60 seconds?" },
    memory: { name: "Memory Match", icon: "cards", tone: "purple", blurb: "Flip cards and find the pairs." }
  };

  // Words the child has reached: current reading level and the ones before it (no phrases).
  function wordPool() {
    const top = Math.max(1, Store.currentLevel("reading")); const out = [];
    for (let n = Math.max(1, top - 8); n <= top; n++) { const L = E.level("reading", n); if (L && L.words) for (const w of L.words) if (!/\s/.test(w.w) && w.w.length <= 14) out.push(w); }
    if (out.length < 8) { const S = E.level("science", Math.max(1, Store.currentLevel("science"))); if (S && S.words) for (const w of S.words) if (!/\s/.test(w.w)) out.push(w); }
    return out;
  }

  // ---------- Practice tab ----------
  V.practice = (root) => {
    if (!Store.hasProfile()) return go("profiles");
    const srs = Store.srsCount ? Store.srsCount() : { due: 0, known: 0 }; const weak = Store.weakWords(null, 1).length; const words = Store.myWords().length;
    const gameCard = (id) => { const g = GAMES[id]; const b = best(id); return '<a class="game-card ' + g.tone + '" href="#game-' + id + '"><span class="gc-i">' + UI.icon(g.icon) + '</span><span class="gc-n">' + g.name + '</span><span class="gc-b">' + esc(g.blurb) + "</span>" + (b ? '<span class="gc-best">' + UI.icon("trophy") + " Best " + b + "</span>" : '<span class="gc-best">New!</span>') + "</a>"; };
    const row = (href, icon, tone, title, sub, attr) => (href ? '<a class="list-row" href="' + href + '"' : '<button class="list-row"' + (attr || "")) + '><span class="lr-i ' + tone + '">' + UI.icon(icon) + '</span><span class="grow"><b>' + title + '</b><span class="small muted">' + sub + "</span></span>" + UI.icon("next") + (href ? "</a>" : "</button>");
    root.innerHTML = '<div class="screen">' + V._topbar() +
      '<h1 class="page-title">Practice</h1><div class="small muted">Short, fun and different every time.</div>' +
      '<a class="brain-card" href="#play-brain"><span class="bc-face">' + UI.mascot("nova") + '</span><span class="grow"><span class="bc-t">Brain Boost</span><span class="bc-s">' + (srs.due ? srs.due + " cards are ready to review today." : "A fresh mix of what you learned.") + ' Reviewing at the right time makes memories stick.</span>' + (srs.known ? '<span class="bc-meta">' + UI.icon("star") + " " + srs.known + ' things you know well</span>' : "") + '</span><span class="btn primary">Go</span></a>' +
      '<div class="section-title">Games</div><div class="game-grid">' + gameCard("pop") + gameCard("sprint") + gameCard("memory") + "</div>" +
      '<div class="section-title">More practice</div><div class="list">' +
        row("#play-mix-reading-read", "shuffle", "blue", "Reading mix", "Words from every level you reached") +
        row("#play-mix-science-read", "flask", "orange", "Science mix", "Key words from your science levels") +
        (weak ? row("#play-review-reading-read", "retry", "red", "My mistakes", "The words that were tricky") : "") +
        row("#words", "abc", "green", "My Words" + (words ? " · " + words : ""), "Add words from school or books and practice them") +
        row(null, "bulb", "purple", "Thinking challenge", "Nova asks you a brain-teaser about what you learned", ' data-challenge="1"') +
      "</div></div>" + V._bottomNav("practice");
    V._bindGrade(root);
    const ch = root.querySelector("[data-challenge]"); if (ch) ch.onclick = () => { const T = window.GKA.Teacher; if (T) T.open({ prompt: "Give me one fun thinking challenge about something I learned recently. Make it a little hard but not too hard for my grade. Wait for my answer before telling me." }); };
  };

  // ---------- Games ----------
  let timer = null;
  const stopTimer = () => { if (timer) { clearInterval(timer); timer = null; } };
  window.addEventListener("hashchange", () => { if (!/^#game-/.test(location.hash)) stopTimer(); });
  function frame(root, id, inner) {
    const g = GAMES[id];
    root.innerHTML = '<div class="screen game ' + g.tone + '"><div class="game-top"><a class="xbtn" href="#practice" aria-label="Back to Practice">' + UI.icon("close") + '</a><div class="g-name">' + g.name + '</div><div class="g-stat" id="g-time">' + UI.icon("clock") + '<span>60</span></div><div class="g-stat" id="g-score">' + UI.icon("star") + '<span>0</span></div></div><div class="g-combo" id="g-combo"></div>' + inner + "</div>";
  }
  function startClock(root, secs, onEnd) {
    stopTimer(); let left = secs; const el = root.querySelector("#g-time span");
    timer = setInterval(() => { left--; if (el) el.textContent = Math.max(0, left); if (left <= 5 && left > 0) Speech.sfx("tick"); if (left <= 0) { stopTimer(); onEnd(); } }, 1000);
    return { penalty: (s) => { left = Math.max(1, left - s); if (el) el.textContent = left; } };
  }
  function endScreen(root, id, score, unit) {
    stopTimer(); Speech.stop();
    const prev = best(id); const isBest = score > prev; if (isBest) setBest(id, score);
    const stars = Math.min(10, Math.floor(score / 3)); if (stars) Store.addStars(stars);
    Store.addSeconds(60);
    Speech.sfx(isBest ? "win" : "star"); if (isBest && score) UI.confetti(140);
    const msg = score === 0 ? "Warm-up done! Try again?" : isBest ? "New best score!" : score >= prev * 0.8 ? "So close to your best!" : "Nice playing!";
    root.innerHTML = '<div class="screen"><div class="results"><svg class="mascot" viewBox="0 0 120 120">' + UI.mascot(isBest ? "nova" : "wink").replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "") + "</svg><h1>" + esc(msg) + '</h1><div class="sub">' + GAMES[id].name + '</div><div class="stat-tiles"><div class="stat-tile green"><div class="h">' + unit + '</div><div class="v">' + UI.icon("target") + score + '</div></div><div class="stat-tile yellow"><div class="h">Stars</div><div class="v">' + UI.icon("star") + "+" + stars + '</div></div><div class="stat-tile blue"><div class="h">Best</div><div class="v">' + UI.icon("trophy") + Math.max(score, prev) + '</div></div></div></div><div class="stack" style="margin-top:18px"><a class="btn primary lg" href="#game-' + id + '" id="again">Play again</a><a class="btn" href="#practice">Back to Practice</a></div></div>';
    root.querySelector("#again").onclick = (e) => { e.preventDefault(); V.game(root, id); };
  }
  function combo(root, n) { const el = root.querySelector("#g-combo"); if (!el) return; el.textContent = n >= 3 ? n + " in a row! x" + (n >= 6 ? 3 : 2) + " points" : ""; el.classList.toggle("on", n >= 3); }

  V.game = (root, id) => {
    if (!Store.hasProfile()) return go("profiles");
    if (!GAMES[id]) return go("practice");
    stopTimer();
    if (id === "pop") return wordPop(root);
    if (id === "sprint") return mathSprint(root);
    return memory(root);
  };

  // Word Pop: hear a word, tap its bubble. Wrong taps cost 2 seconds; streaks score double or triple.
  function wordPop(root) {
    const pool = wordPool(); if (pool.length < 4) { UI.toast("Play a few reading levels first", "warn"); return go("practice"); }
    frame(root, "pop", '<div class="pop-field" id="field"></div><div class="row" style="justify-content:center;margin-top:12px"><button class="btn" id="again">' + UI.icon("ear") + ' Hear it again</button></div>');
    let score = 0, streak = 0, target = null; const n = ["kg", "g1", "g2"].includes(Store.grade()) ? 4 : 6;
    const field = root.querySelector("#field");
    const clock = startClock(root, 60, () => endScreen(root, "pop", score, "Words popped"));
    const round = () => {
      target = U.pick(pool); const others = U.shuffle(pool.filter((w) => w.w !== target.w)).slice(0, n - 1);
      const opts = U.shuffle(others.concat([target]));
      field.innerHTML = opts.map((w, i) => '<button class="gbubble b' + (i % 6) + '" data-w="' + esc(w.w) + '" style="animation-delay:' + (i * 0.08) + 's">' + esc(w.w) + "</button>").join("");
      field.querySelectorAll(".gbubble").forEach((b) => { b.onclick = () => {
        if (b.dataset.w === target.w) { streak++; score += streak >= 6 ? 3 : streak >= 3 ? 2 : 1; Speech.sfx("ok"); b.classList.add("popped"); root.querySelector("#g-score span").textContent = score; combo(root, streak); setTimeout(round, 260); }
        else { streak = 0; combo(root, 0); Speech.sfx("no"); b.classList.add("shake"); clock.penalty(2); setTimeout(() => b.classList.remove("shake"), 400); }
      }; });
      Speech.speak(target.w, { rate: Store.settings().rate });
    };
    root.querySelector("#again").onclick = () => target && Speech.speak(target.w, { rate: Store.settings().rate });
    round();
  }

  // Math Sprint: problems from the current math level and the two before it, easiest first.
  function mathSprint(root) {
    const top = Math.max(1, Store.currentLevel("math")); const levels = [top - 2, top - 1, top].filter((n) => n >= 1).map((n) => E.level("math", n)).filter(Boolean);
    const next = () => { for (let i = 0; i < 30; i++) { const L = U.pick(levels); try { const p = L.gen(); if (!p.options || p.options.length < 2) continue; if (p.visual && !/\d/.test(p.q)) continue; return p; } catch (e) { /* try again */ } } return null; };
    if (!next()) { UI.toast("Math Sprint needs a math level first", "warn"); return go("practice"); }
    frame(root, "sprint", '<div class="sprint-q" id="q"></div><div class="sprint-opts" id="opts"></div>');
    let score = 0, streak = 0, p = null;
    startClock(root, 60, () => endScreen(root, "sprint", score, "Problems solved"));
    const round = () => {
      p = next(); if (!p) return;
      root.querySelector("#q").textContent = p.q;
      const opts = U.shuffle(p.options.map(String).filter((x, i, a) => a.indexOf(x) === i));
      root.querySelector("#opts").innerHTML = opts.map((o) => '<button class="option" data-v="' + esc(o) + '">' + esc(o) + "</button>").join("");
      root.querySelectorAll("#opts .option").forEach((b) => { b.onclick = () => {
        if (b.dataset.v === String(p.answer)) { streak++; score += streak >= 6 ? 3 : streak >= 3 ? 2 : 1; Speech.sfx("ok"); b.classList.add("ok"); root.querySelector("#g-score span").textContent = score; combo(root, streak); setTimeout(round, 220); }
        else { streak = 0; combo(root, 0); Speech.sfx("no"); b.classList.add("bad"); b.disabled = true; }
      }; });
    };
    round();
  }

  // Memory Match: word and picture pairs when the words have pictures, otherwise word and sentence-with-a-blank pairs.
  function memory(root) {
    const pool = wordPool(); const withPic = U.shuffle(pool.filter((w) => E.pictureFor(w.w)));
    let pairs;
    if (withPic.length >= 6) pairs = withPic.slice(0, 6).map((w) => [w.w, E.pictureFor(w.w), true]);
    else { const ws = U.shuffle(pool.filter((w) => w.s && w.s.split(" ").length <= 9 && new RegExp("\\b" + w.w + "\\b", "i").test(w.s))); if (ws.length < 4) { UI.toast("Play a few reading levels first", "warn"); return go("practice"); } pairs = ws.slice(0, 6).map((w) => [w.w, w.s.replace(new RegExp("\\b" + w.w + "\\b", "i"), "___"), false]); }
    const cards = U.shuffle(pairs.flatMap((p, i) => [{ id: i, face: p[0], word: true }, { id: i, face: p[1], pic: p[2] }]));
    frame(root, "memory", '<div class="mem-grid" id="grid">' + cards.map((c, k) => '<button class="mem" data-k="' + k + '" aria-label="Card ' + (k + 1) + '"><span class="mem-back">?</span><span class="mem-face' + (c.pic ? " pic" : c.word ? "" : " txt") + '">' + esc(c.face) + "</span></button>").join("") + "</div>");
    root.querySelector("#g-time span").textContent = "0"; let secs = 0; timer = setInterval(() => { secs++; const el = root.querySelector("#g-time span"); if (el) el.textContent = secs; }, 1000);
    let open = [], found = 0, moves = 0, lock = false;
    root.querySelectorAll(".mem").forEach((b) => { b.onclick = () => {
      if (lock || b.classList.contains("up") || b.classList.contains("done")) return;
      b.classList.add("up"); Speech.sfx("tap"); const c = cards[+b.dataset.k]; if (c.word) Speech.speak(c.face, { rate: Store.settings().rate });
      open.push(b); if (open.length < 2) return;
      moves++; const [a, d] = open; open = [];
      if (cards[+a.dataset.k].id === cards[+d.dataset.k].id) { a.classList.add("done"); d.classList.add("done"); found++; Speech.sfx("ok"); root.querySelector("#g-score span").textContent = found; if (found === pairs.length) setTimeout(() => endScreen(root, "memory", Math.max(1, 30 - Math.max(0, moves - pairs.length) * 2 - Math.floor(secs / 10)), "Memory score"), 500); }
      else { lock = true; setTimeout(() => { a.classList.remove("up"); d.classList.remove("up"); lock = false; }, 800); }
    }; });
  }
})();
