/* Genius Kids Academy - router and boot. Routes: profiles, addkid, editkid-<id>, home, home-<subject>, hub-<subject>-<n>,
   play-<subject>-<n>-<mode>, play-words-<mode>, play-review-<subject>-<mode>, results, words, parent. */
window.GKA = window.GKA || {};
(function () {
  const Store = window.GKA.Store, V = window.GKA.Views, Session = window.GKA.Session, Speech = window.GKA.Speech, UI = window.GKA.UI;
  const App = {};
  let inPlay = false;
  const root = () => document.getElementById("app");
  App.go = (route) => { if (location.hash === "#" + route) render(); else location.hash = route; };
  App.applyTheme = () => { const t = Store.settings().theme || "auto"; if (t === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t); };

  function render() {
    const raw = (location.hash || "#home").slice(1);
    const parts = raw.split("-");
    const name = parts[0] || "home";
    if (inPlay && name !== "play") { Session.abort(); inPlay = false; }
    Speech.stop(); Speech.cancelListen();
    const el = root();
    window.scrollTo(0, 0);
    try {
      if (name === "profiles") V.profiles(el);
      else if (name === "addkid") V.addkid(el);
      else if (name === "editkid") V.addkid(el, parts[1]);
      else if (!Store.hasProfile()) V.profiles(el);
      else if (name === "home") V.home(el, parts[1]);
      else if (name === "map") V.home(el, parts[1]);
      else if (name === "hub") V.hub(el, parts[1], parseInt(parts[2], 10) || 1);
      else if (name === "play") {
        inPlay = true;
        if (parts[1] === "words") Session.start({ subject: "reading", n: Store.currentLevel("reading"), mode: parts[2] || "read", source: "mywords" }, el);
        else if (parts[1] === "review") Session.start({ subject: parts[2] || "reading", n: Store.currentLevel(parts[2] || "reading"), mode: parts[3] || "speak", source: "review" }, el);
        else { const subject = parts[1], n = parseInt(parts[2], 10) || 1, mode = parts[3] || "read"; if (!Store.isUnlocked(subject, n)) { inPlay = false; UI.toast("That level is still locked", "warn"); return App.go("home-" + subject); } Session.start({ subject, n, mode, source: "level" }, el); }
      }
      else if (name === "results") { inPlay = false; V.results(el); }
      else if (name === "words") V.words(el);
      else if (name === "me") V.me(el);
      else if (name === "parent") V.parent(el);
      else V.home(el);
    } catch (e) {
      console.error(e);
      el.innerHTML = '<div class="screen"><div class="empty">' + UI.icon("retry") + '<div>Something went wrong on this screen.</div><a class="btn primary" href="#home">Go home</a></div></div>';
    }
  }
  function boot() {
    Store.load();
    App.applyTheme();
    window.addEventListener("hashchange", render);
    const warm = () => { if (Speech.ttsOK) { try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch (e) { /* ignore */ } } document.removeEventListener("pointerdown", warm); };
    document.addEventListener("pointerdown", warm);
    document.addEventListener("pointerdown", (e) => { const t = e.target && e.target.closest ? e.target.closest(".btn, .option, .tile, .key, .node, .letter-btn, .wtile, .match-item, .chest, .profile-card, .subject-tabs a, .bottombar a, .claim") : null; if (t && !t.disabled && !t.classList.contains("used")) Speech.sfx("tap"); }, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) { Speech.stop(); Speech.cancelListen(); } });
    if (!location.hash) location.hash = Store.hasProfile() ? "home" : "profiles"; else render();
    // PWA: offline cache + install button. Skipped when opened from a file or inside an artifact frame.
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && window.top === window) {
      navigator.serviceWorker.register("sw.js").then((reg) => {
        reg.addEventListener("updatefound", () => { const nw = reg.installing; if (!nw) return; nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) { App.updateReady = reg; UI.toast("A new version is ready. Reopen the app to update.", "ok"); } }); });
      }).catch(() => { /* offline mode unavailable, the app still runs */ });
      let refreshing = false; navigator.serviceWorker.addEventListener("controllerchange", () => { if (refreshing) return; refreshing = true; location.reload(); });
    }
    window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); App.installPrompt = e; document.querySelectorAll("[data-install]").forEach((b) => { b.hidden = false; }); });
    window.addEventListener("appinstalled", () => { App.installPrompt = null; UI.toast("Genius Kids Academy is installed", "ok"); document.querySelectorAll("[data-install]").forEach((b) => { b.hidden = true; }); });
    App.install = () => { const p = App.installPrompt; if (!p) return UI.toast("Use your browser menu: Add to Home screen / Install app", "warn"); p.prompt(); p.userChoice.then(() => { App.installPrompt = null; }); };
  }
  window.GKA.App = App;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
