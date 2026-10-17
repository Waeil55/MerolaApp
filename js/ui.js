/* Genius Kids Academy - UI helpers: icons, mascots, toasts, confetti, small components. */
window.GKA = window.GKA || {};
(function () {
  const UI = {};
  const stroke = (d, extra) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + d + "</svg>";
  UI.icons = {
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7z" fill="currentColor"/></svg>',
    flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z" fill="currentColor"/></svg>',
    crown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="currentColor"/></svg>',
    back: stroke('<path d="M15 5l-7 7 7 7"/>'),
    close: stroke('<path d="M6 6l12 12M18 6L6 18"/>'),
    next: stroke('<path d="M9 5l7 7-7 7"/>'),
    home: stroke('<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>'),
    map: stroke('<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>'),
    book: stroke('<path d="M4 5h6a3 3 0 0 1 3 3v11a2 2 0 0 0-2-2H4z"/><path d="M20 5h-6a3 3 0 0 0-3 3v11a2 2 0 0 1 2-2h7z"/>'),
    words: stroke('<path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M8 7h7M8 11h5"/>'),
    parent: stroke('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>'),
    chart: stroke('<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>'),
    eye: stroke('<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    mic: stroke('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>'),
    ear: stroke('<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>'),
    pencil: stroke('<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M13 7l3 3"/>'),
    retry: stroke('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'),
    check: stroke('<path d="M5 12l5 5 9-10"/>'),
    play: stroke('<path d="M6 4l12 8-12 8z"/>'),
    pause: stroke('<path d="M7 5v14M17 5v14"/>'),
    grid: stroke('<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>'),
    bulb: stroke('<path d="M9 18h6M10 21h4M8 13a5 5 0 1 1 8 0c-1 1-1.5 2-1.5 3h-5C9.5 15 9 14 8 13z"/>'),
    lock: stroke('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    plus: stroke('<path d="M12 5v14M5 12h14"/>'),
    trash: stroke('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    sparkle: stroke('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2"/>'),
    settings: stroke('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    trophy: stroke('<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>'),
    calc: stroke('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h2M8 16h2M12 16h2M16 16h2"/>'),
    flask: stroke('<path d="M9 3h6M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3"/>'),
    download: stroke('<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>'),
    upload: stroke('<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>'),
    clock: stroke('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    target: stroke('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'),
    menu: stroke('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    chev: stroke('<path d="M6 9l6 6 6-6"/>'),
    users: stroke('<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c3 0 5 2 5 5"/>'),
    abc: stroke('<path d="M3 17l3-10 3 10M4.5 13h3M12 7v10M12 12h3a2.5 2.5 0 0 1 0 5h-3M12 7h2.5a2.5 2.5 0 0 1 0 5M21 9a3 3 0 0 0-3-2 4 4 0 0 0 0 8 3 3 0 0 0 3-2"/>'),
    moon: stroke('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3.3 5 6.8 5c2 0 3.4 1.1 4.2 2.3C11.8 6.1 13.2 5 15.2 5c3.5 0 5.6 3.4 4.3 6.7C17.5 16.4 12 21 12 21z" fill="currentColor"/></svg>',
    gem: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10l4 6-9 12L3 9z" fill="currentColor"/><path d="M3 9h18M7 3l5 6 5-6M12 9l-3 12M12 9l3 12" stroke="rgba(255,255,255,.6)" stroke-width="1.5" fill="none"/></svg>',
    chest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2H3z" fill="currentColor"/><path d="M3 12h18v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="currentColor" opacity=".75"/><rect x="10" y="10" width="4" height="5" rx="1" fill="rgba(255,255,255,.9)"/></svg>',
    gift: stroke('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8c-2 0-4-1-4-3a2 2 0 0 1 4 0M12 8c2 0 4-1 4-3a2 2 0 0 0-4 0"/>'),
    snow: stroke('<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/>'),
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>',
    medal: stroke('<circle cx="12" cy="14" r="6"/><path d="M8 3l2 6M16 3l-2 6M9 3h6"/>'),
    sun: stroke('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>')
  };
  UI.icon = (name) => UI.icons[name] || "";

  // Cartoon mascots in the bright flat style of kids' learning apps. Simple shapes, big eyes.
  UI.mascots = {
    cat: '<svg viewBox="0 0 120 120" role="img" aria-label="Pip the cat"><path d="M28 40L22 14l22 14z" fill="#FF9600"/><path d="M92 40l6-26-22 14z" fill="#FF9600"/><circle cx="60" cy="62" r="40" fill="#FF9600"/><circle cx="60" cy="70" r="26" fill="#FFD9A8"/><circle cx="45" cy="56" r="7" fill="#FFF"/><circle cx="75" cy="56" r="7" fill="#FFF"/><circle cx="46" cy="57" r="3.5" fill="#1F2937"/><circle cx="76" cy="57" r="3.5" fill="#1F2937"/><path d="M56 68q4 4 8 0" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="60" cy="65" r="3" fill="#E58A00"/><path d="M30 70h12M30 76h12M78 70h12M78 76h12" stroke="#1F2937" stroke-width="2" stroke-linecap="round"/><path d="M42 22h36a4 4 0 0 1 4 4v4H38v-4a4 4 0 0 1 4-4z" fill="#235390"/><rect x="46" y="8" width="28" height="16" rx="4" fill="#235390"/></svg>',
    panda: '<svg viewBox="0 0 120 120" role="img" aria-label="Momo the panda"><circle cx="30" cy="30" r="14" fill="#A560E8"/><circle cx="90" cy="30" r="14" fill="#A560E8"/><circle cx="60" cy="64" r="40" fill="#CE82FF"/><ellipse cx="44" cy="58" rx="12" ry="14" fill="#A560E8"/><ellipse cx="76" cy="58" rx="12" ry="14" fill="#A560E8"/><circle cx="45" cy="58" r="6" fill="#FFF"/><circle cx="75" cy="58" r="6" fill="#FFF"/><circle cx="46" cy="59" r="3" fill="#1F2937"/><circle cx="76" cy="59" r="3" fill="#1F2937"/><ellipse cx="60" cy="74" rx="14" ry="10" fill="#F3E5FF"/><circle cx="60" cy="71" r="3.5" fill="#1F2937"/><path d="M55 78q5 4 10 0" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
    dog: '<svg viewBox="0 0 120 120" role="img" aria-label="Bo the dog"><path d="M22 44c-8 6-10 26-2 34 6 6 14 0 14-10z" fill="#A0522D"/><path d="M98 44c8 6 10 26 2 34-6 6-14 0-14-10z" fill="#A0522D"/><circle cx="60" cy="62" r="38" fill="#D2884A"/><ellipse cx="60" cy="74" rx="20" ry="16" fill="#F6D7B0"/><circle cx="46" cy="54" r="7" fill="#FFF"/><circle cx="74" cy="54" r="7" fill="#FFF"/><circle cx="47" cy="55" r="3.5" fill="#1F2937"/><circle cx="75" cy="55" r="3.5" fill="#1F2937"/><ellipse cx="60" cy="68" rx="6" ry="4.5" fill="#1F2937"/><path d="M52 78q8 6 16 0" stroke="#1F2937" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M60 82v6" stroke="#FF4B4B" stroke-width="5" stroke-linecap="round"/><path d="M40 100h40v8a6 6 0 0 1-6 6H46a6 6 0 0 1-6-6z" fill="#58CC02"/></svg>',
    nova: '<svg viewBox="0 0 120 120" role="img" aria-label="Nova the star"><path d="M60 26L71.8 53.8L101.8 56.4L79 76.2L85.9 105.6L60 90L34.1 105.6L41 76.2L18.2 56.4L48.2 53.8Z" fill="#E5B400" stroke="#E5B400" stroke-width="10" stroke-linejoin="round"/><path d="M60 22L71.8 49.8L101.8 52.4L79 72.2L85.9 101.6L60 86L34.1 101.6L41 72.2L18.2 52.4L48.2 49.8Z" fill="#FFC800" stroke="#FFC800" stroke-width="10" stroke-linejoin="round"/><circle cx="48" cy="64" r="9" fill="#FFFFFF"/><circle cx="72" cy="64" r="9" fill="#FFFFFF"/><circle cx="49.5" cy="65" r="4.5" fill="#1F2937"/><circle cx="73.5" cy="65" r="4.5" fill="#1F2937"/><circle cx="51.5" cy="63" r="1.6" fill="#FFFFFF"/><circle cx="75.5" cy="63" r="1.6" fill="#FFFFFF"/><circle cx="38" cy="76" r="5" fill="#FF9BB3" opacity=".85"/><circle cx="82" cy="76" r="5" fill="#FF9BB3" opacity=".85"/><path d="M50 78q10 9 20 0" stroke="#1F2937" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M42 27L62 15L84 23L64 35Z" fill="#1CB0F6"/><path d="M48 31l0 7q8 6 16 0l0-7" fill="#1899D6"/><path d="M82 24l3 12" stroke="#FF9600" stroke-width="3" stroke-linecap="round"/><circle cx="85.5" cy="38" r="3" fill="#FF9600"/></svg>'
  };
  UI.mascot = (name) => UI.mascots[name] || UI.mascots.cat;
  UI.subjectMascot = (id) => ({ reading: "nova", math: "panda", science: "dog" }[id] || "cat");

  UI.stars = (n, max) => { max = max || 3; let s = '<span class="stars" aria-label="' + n + ' of ' + max + ' stars">'; for (let i = 0; i < max; i++) s += '<span class="star ' + (i < n ? "on" : "") + '">' + UI.icons.star + "</span>"; return s + "</span>"; };

  UI.toast = (msg, kind) => {
    let host = document.getElementById("toasts");
    if (!host) { host = document.createElement("div"); host.id = "toasts"; document.body.appendChild(host); }
    const t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; host.appendChild(t);
    requestAnimationFrame(() => t.classList.add("in"));
    setTimeout(() => { t.classList.remove("in"); setTimeout(() => t.remove(), 300); }, 2400);
  };

  UI.confetti = (count) => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let c = document.getElementById("confetti");
    if (!c) { c = document.createElement("canvas"); c.id = "confetti"; document.body.appendChild(c); }
    const dpr = window.devicePixelRatio || 1;
    c.width = window.innerWidth * dpr; c.height = window.innerHeight * dpr; c.style.display = "block";
    const ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
    const colors = ["#FFC800", "#1CB0F6", "#58CC02", "#FF9600", "#CE82FF", "#FF4B4B"];
    const parts = [];
    for (let i = 0; i < (count || 140); i++) parts.push({ x: window.innerWidth / 2 + (Math.random() - 0.5) * 200, y: window.innerHeight * 0.4, vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4, g: 0.35 + Math.random() * 0.2, s: 6 + Math.random() * 8, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, col: colors[i % colors.length], life: 90 + Math.random() * 40 });
    let frame = 0;
    const tick = () => { ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); let alive = 0; for (const p of parts) { if (p.life <= 0) continue; alive++; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.99; p.r += p.vr; p.life--; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.col; ctx.globalAlpha = Math.min(1, p.life / 30); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); } if (alive && frame++ < 200) requestAnimationFrame(tick); else { ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); c.style.display = "none"; } };
    tick();
  };

  UI.ring = (el, seconds, onDone) => {
    const circ = 2 * Math.PI * 26;
    el.innerHTML = '<svg viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="26" class="ring-bg"/><circle cx="30" cy="30" r="26" class="ring-fg" stroke-dasharray="' + circ + '" stroke-dashoffset="0"/></svg><span class="ring-label"></span>';
    const fg = el.querySelector(".ring-fg"); const label = el.querySelector(".ring-label");
    let start = performance.now(), raf = 0, stopped = false;
    label.textContent = seconds + "s";
    const step = (t) => { if (stopped) return; const p = Math.min(1, (t - start) / (seconds * 1000)); fg.setAttribute("stroke-dashoffset", String(circ * p)); label.textContent = Math.max(0, Math.ceil(seconds - (t - start) / 1000)) + "s"; if (p < 1) raf = requestAnimationFrame(step); else if (onDone) onDone(); };
    raf = requestAnimationFrame(step);
    return { stop: () => { stopped = true; cancelAnimationFrame(raf); } };
  };

  UI.avatars = { star: "⭐", fox: "🦊", robot: "🤖", unicorn: "🦄", dino: "🦖", cat: "🐱", rocket: "🚀", panda: "🐼", lion: "🦁", frog: "🐸", bunny: "🐰", bee: "🐝" };
  UI.avatar = (key) => UI.avatars[key] || UI.avatars.star;
  UI.subjectIcon = (id) => ({ reading: UI.icons.book, math: UI.icons.calc, science: UI.icons.flask }[id] || UI.icons.book);
  UI.toneOf = (id) => ({ reading: "blue", math: "green", science: "orange" }[id] || "blue");

  UI.modal = (html, opts) => {
    opts = opts || {};
    const wrap = document.createElement("div"); wrap.className = "modal-wrap";
    wrap.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + html + "</div>";
    document.body.appendChild(wrap);
    const close = () => { wrap.classList.remove("in"); setTimeout(() => wrap.remove(), 200); };
    wrap.addEventListener("click", (e) => { if (e.target === wrap && !opts.sticky) close(); });
    requestAnimationFrame(() => wrap.classList.add("in"));
    return { el: wrap, close };
  };

  window.GKA.UI = UI;
})();
