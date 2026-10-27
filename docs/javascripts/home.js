/**
 * home.js
 * ---------------------------------------------------------------------
 * Tableau de bord de la page d'accueil (styles : home.css) :
 *   - date, heure et salutation en direct ;
 *   - anneau de progression calculé d'après les dates de la formation
 *     (attributs data-start / data-stage / data-end dans index.md) ;
 *   - « Reprendre où j'en étais » : les dernières pages consultées,
 *     mémorisées dans le navigateur (par appareil) ;
 *   - chiffres de progression qui défilent jusqu'à leur valeur ;
 *   - cartes qui s'inclinent en 3D et s'éclairent sous la souris ;
 *   - blocs qui arrivent en cascade ;
 *   - pastille ✓ sur les cours déjà ouverts, et suggestion du prochain.
 * Rien à modifier ici pour ajouter du contenu.
 * ---------------------------------------------------------------------
 */

(function () {
  var STORAGE_KEY = "tssr-recent-pages";
  var VISITED_KEY = "tssr-visited-pages";
  var MAX_RECENT = 4;
  var MAX_VISITED = 500;
  var DAY = 24 * 60 * 60 * 1000;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // localStorage ne garde que du texte : on y range des listes en JSON
  function readList(key) {
    try {
      var list = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function readRecent() { return readList(STORAGE_KEY); }

  // Mémorise la page courante (sauf l'accueil)
  function rememberPage() {
    if (document.querySelector(".tssr-home")) return;
    var h1 = document.querySelector(".md-content h1");
    var title = h1 ? h1.textContent.replace(/¶/g, "").trim() : document.title;
    var section = document.querySelector(".md-nav__item--active > .md-nav__link");
    var entry = {
      url: location.pathname,
      title: title,
      section: section ? section.textContent.trim() : "",
    };
    var list = readRecent().filter(function (p) { return p.url !== entry.url; });
    list.unshift(entry);
    // toutes les pages déjà ouvertes (sert aux pastilles ✓ des modules)
    var visited = readList(VISITED_KEY).filter(function (url) { return url !== entry.url; });
    visited.unshift(entry.url);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
      localStorage.setItem(VISITED_KEY, JSON.stringify(visited.slice(0, MAX_VISITED)));
    } catch (e) {}
  }

  // Fait défiler un nombre de 0 jusqu'à sa valeur ; draw(v) affiche chaque étape
  function countUp(to, duration, draw) {
    if (reduceMotion) { draw(to); return; }
    var start = performance.now();
    (function step() {
      var t = Math.min((performance.now() - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);   // rapide au début, ralentit à la fin
      draw(Math.round(to * eased));
      if (t < 1) requestAnimationFrame(step);
    })();
  }

  function parseDate(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function updateClock() {
    var now = new Date();
    var date = document.querySelector("[data-home-date]");
    var clock = document.querySelector("[data-home-clock]");
    if (date) {
      date.textContent = "▣ " + now.toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
    }
    if (clock) {
      clock.textContent = "◷ " + now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }
  }

  // Salutation qui défile : français → japonais → chinois → anglais.
  // Bonjour la journée, bonsoir à partir de 18 h (et jusqu'à 5 h).
  var GREETINGS = [
    { lang: "fr", day: "Bonjour !", evening: "Bonsoir !" },
    { lang: "ja", day: "こんにちは！", evening: "こんばんは！" },
    { lang: "zh", day: "你好！", evening: "晚上好！" },
    { lang: "en", day: "Hello!", evening: "Good evening!" },
  ];
  var GREET_DELAY = 3500;   // temps d'affichage de chaque langue (ms)
  var GREET_SWAP = 450;     // durée de l'animation de sortie (ms), voir home.css

  function greetingText(i) {
    var h = new Date().getHours();
    var g = GREETINGS[i];
    return h >= 18 || h < 5 ? g.evening : g.day;
  }

  function setupGreeting() {
    var el = document.querySelector("[data-home-greeting]");
    if (!el) return;
    var i = 0;
    el.textContent = greetingText(i);
    el.lang = GREETINGS[i].lang;

    setInterval(function () {
      el.classList.remove("is-in");
      el.classList.add("is-out");
      setTimeout(function () {
        i = (i + 1) % GREETINGS.length;
        el.textContent = greetingText(i);
        el.lang = GREETINGS[i].lang;
        el.classList.remove("is-out");
        void el.offsetWidth;          // relance l'animation d'entrée
        el.classList.add("is-in");
      }, GREET_SWAP);
    }, GREET_DELAY);
  }

  function updateProgress() {
    var box = document.querySelector("[data-home-progress]");
    if (!box) return;
    var start = parseDate(box.dataset.start);
    var stage = parseDate(box.dataset.stage);
    var end = parseDate(box.dataset.end);
    var now = new Date();
    var ratio = Math.min(Math.max((now - start) / (end - start), 0), 1);
    var pct = Math.round(ratio * 100);
    var weeks = Math.ceil((end - start) / (7 * DAY));
    var week = Math.min(Math.max(Math.floor((now - start) / (7 * DAY)) + 1, 0), weeks);
    var untilStage = Math.ceil((stage - now) / DAY);
    var untilEnd = Math.ceil((end - now) / DAY);

    var ring = box.querySelector("[data-home-ring]");
    var pctEl = box.querySelector("[data-home-pct]");
    var weekEl = box.querySelector("[data-home-week]");
    var stageEl = box.querySelector("[data-home-stage]");
    var endEl = box.querySelector("[data-home-end]");

    countUp(pct, 1400, function (v) {
      ring.style.setProperty("--pct", v + "%");
      pctEl.textContent = v + " %";
    });
    if (now < start) weekEl.textContent = "Pas commencée";
    else countUp(week, 1000, function (v) { weekEl.textContent = v + " / " + weeks; });
    if (untilStage > 0) countUp(untilStage, 1200, function (v) { stageEl.textContent = v + " j"; });
    else stageEl.textContent = "En stage 🎉";
    if (untilEnd > 0) countUp(untilEnd, 1200, function (v) { endEl.textContent = v + " j"; });
    else endEl.textContent = "Terminée 🎓";
  }

  // Inclinaison 3D : la carte « penche » vers la souris
  function setupTilt() {
    var cards = document.querySelectorAll(".tssr-home-shortcut, .tssr-home-module, .tssr-home-memo, .tssr-home-recent-item");
    cards.forEach(function (card) {
      card.classList.add("tssr-tilt");
      if (reduceMotion) return;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;    // 0 à gauche → 1 à droite
        var y = (e.clientY - r.top) / r.height;    // 0 en haut → 1 en bas
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        card.style.setProperty("--ry", (x - 0.5) * 10 + "deg");
        card.style.setProperty("--rx", (0.5 - y) * 10 + "deg");
      });
      card.addEventListener("pointerleave", function () {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  // Les blocs de l'accueil arrivent l'un après l'autre
  function setupEntrance() {
    var blocks = document.querySelectorAll(
      ".tssr-home-shortcut, .tssr-home-row > .tssr-home-panel, .tssr-home > .tssr-home-panel, .tssr-home-module, .tssr-home-memo"
    );
    blocks.forEach(function (el, i) {
      el.style.setProperty("--i", Math.min(i, 20));
      el.classList.add("tssr-home-enter");
    });
  }

  // Pastille ✓ sur les cours dont au moins une page a été ouverte
  function markSeenModules() {
    var visited = readList(VISITED_KEY);
    var modules = document.querySelectorAll(".tssr-home-module");
    var seen = 0;
    var next = null;
    modules.forEach(function (a) {
      var base = a.pathname;   // l'adresse complète du cours, ex. /TSSR-COURS/cours/cours-01-…/
      var isSeen = visited.some(function (url) { return url.indexOf(base) === 0; });
      a.classList.toggle("is-seen", isSeen);
      if (isSeen) seen++;
      else if (!next && !a.classList.contains("is-verrouille")) next = a;
    });

    // le cours marqué « en cours » (statuts.js) passe avant tout le reste
    var current = document.querySelector(".tssr-home-module.is-en-cours");
    if (current) next = current;

    var sub = document.querySelector("[data-home-modules-count]");
    if (sub) sub.textContent = seen + " cours ouvert" + (seen > 1 ? "s" : "") + " sur " + modules.length;
    return next;
  }

  // « Reprendre » vide : on propose le premier cours pas encore ouvert
  function suggestNext(next) {
    var box = document.querySelector("[data-home-recent]");
    if (!box || readRecent().length || !next) return;
    var a = document.createElement("a");
    a.className = "tssr-home-suggest";
    a.href = next.href;
    var icon = document.createElement("span");
    icon.textContent = "🚀";
    var text = document.createElement("span");
    text.innerHTML = next.classList.contains("is-en-cours")
      ? "<small>Ton cours du moment</small>"
      : "<small>Par où commencer ?</small>";
    var b = document.createElement("b");
    b.textContent = "Cours " + next.querySelector(".tssr-home-num").textContent + " · " + next.querySelector("b").textContent;
    text.appendChild(b);
    a.appendChild(icon);
    a.appendChild(text);
    box.appendChild(a);
  }

  function renderRecent() {
    var box = document.querySelector("[data-home-recent]");
    if (!box) return;
    var list = readRecent();
    if (!list.length) return;
    box.innerHTML = "";
    list.forEach(function (p) {
      var a = document.createElement("a");
      a.className = "tssr-home-recent-item";
      a.href = p.url;
      var icon = document.createElement("span");
      icon.className = "tssr-home-recent-icon";
      icon.textContent = "▤";
      var text = document.createElement("span");
      var b = document.createElement("b");
      b.textContent = p.title;
      var small = document.createElement("small");
      small.textContent = p.section && p.section !== p.title ? p.section : "Page consultée";
      text.appendChild(b);
      text.appendChild(small);
      var chev = document.createElement("span");
      chev.className = "tssr-home-chevron";
      chev.textContent = "›";
      a.appendChild(icon);
      a.appendChild(text);
      a.appendChild(chev);
      box.appendChild(a);
    });
  }

  // Page Programme : repère l'étape en cours et celles déjà passées
  function markProgramme() {
    var steps = document.querySelectorAll(".tssr-prog-step[data-start]");
    if (!steps.length) return;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    steps.forEach(function (step) {
      var start = parseDate(step.dataset.start);
      var end = parseDate(step.dataset.end);
      end.setHours(23, 59, 59);
      if (today > end) step.classList.add("is-done");
      else if (today >= start) step.classList.add("is-current");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    rememberPage();
    markProgramme();
    if (!document.querySelector(".tssr-home")) return;
    updateClock();
    setInterval(updateClock, 15000);
    setupGreeting();
    updateProgress();
    renderRecent();
    suggestNext(markSeenModules());
    setupEntrance();
    setupTilt();
  });
})();
