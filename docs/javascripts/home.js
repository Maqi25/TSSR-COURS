/**
 * home.js
 * ---------------------------------------------------------------------
 * Tableau de bord de la page d'accueil (styles : home.css) :
 *   - date, heure et salutation en direct ;
 *   - anneau de progression calculé d'après les dates de la formation
 *     (attributs data-start / data-stage / data-end dans index.md) ;
 *   - « Reprendre où j'en étais » : les dernières pages consultées,
 *     mémorisées dans le navigateur (par appareil).
 * Rien à modifier ici pour ajouter du contenu.
 * ---------------------------------------------------------------------
 */

(function () {
  var STORAGE_KEY = "tssr-recent-pages";
  var MAX_RECENT = 4;
  var DAY = 24 * 60 * 60 * 1000;

  function readRecent() {
    try {
      var list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
    } catch (e) {}
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

    box.querySelector("[data-home-ring]").style.setProperty("--pct", pct + "%");
    box.querySelector("[data-home-pct]").textContent = pct + " %";
    box.querySelector("[data-home-week]").textContent = now < start ? "Pas commencée" : week + " / " + weeks;
    box.querySelector("[data-home-stage]").textContent = untilStage > 0 ? untilStage + " j" : "En stage 🎉";
    box.querySelector("[data-home-end]").textContent = untilEnd > 0 ? untilEnd + " j" : "Terminée 🎓";
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
  });
})();
