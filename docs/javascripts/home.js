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

  // ------------------------------------------------------------------
  // Le coin proverbe : une bulle discrète, en bas du menu de gauche.
  // Un proverbe par jour (le même toute la journée), ↻ pour en voir un autre.
  // Des proverbes de motivation du monde entier : effort, patience,
  // apprentissage, entraide. Rien qui vise ou caricature un peuple, une
  // religion ou un groupe.
  // terre : 🌍 Europe / Afrique · 🌏 Asie / Océanie · 🌎 Amériques
  // ------------------------------------------------------------------
  var PROVERBES = [
    { texte: "Un voyage de mille lieues commence par un premier pas.", source: "Lao-tseu, Tao-tö-king", pays: "Chine", terre: "🌏" },
    { texte: "Apprendre, c'est ramer à contre-courant : dès qu'on cesse, on recule.", source: "Proverbe chinois", pays: "Chine", terre: "🌏" },
    { texte: "N'aie pas peur d'avancer lentement, aie peur de t'arrêter.", source: "Proverbe chinois", pays: "Chine", terre: "🌏" },
    { texte: "L'habileté naît de la pratique.", source: "Proverbe chinois", pays: "Chine", terre: "🌏" },
    { texte: "Tombe sept fois, relève-toi huit.", source: "Proverbe japonais", pays: "Japon", terre: "🌏" },
    { texte: "La poussière accumulée finit par former une montagne.", source: "Proverbe japonais", pays: "Japon", terre: "🌏" },
    { texte: "Commencer, c'est déjà avoir fait la moitié du chemin.", source: "Proverbe coréen", pays: "Corée", terre: "🌏" },
    { texte: "Même si le ciel s'écroule, il reste un trou par où s'en sortir.", source: "Proverbe coréen", pays: "Corée", terre: "🌏" },
    { texte: "À force de limer une barre de fer, on finit par en faire une aiguille.", source: "Proverbe vietnamien", pays: "Viêt Nam", terre: "🌏" },
    { texte: "Goutte après goutte, la cruche se remplit.", source: "Dhammapada", pays: "Inde", terre: "🌏" },
    { texte: "Le savoir donne l'humilité ; l'humilité donne la valeur.", source: "Hitopadesha", pays: "Inde", terre: "🌏" },
    { texte: "Goutte à goutte, on finit par faire un lac.", source: "Proverbe turc", pays: "Turquie", terre: "🌏" },
    { texte: "Qui persévère réussit.", source: "Proverbe arabe", pays: "Monde arabe", terre: "🌍" },
    { texte: "Peu à peu, on remplit la mesure.", source: "Proverbe swahili", pays: "Afrique de l'Est", terre: "🌍" },
    { texte: "Doucement, doucement, on attrape le singe dans la forêt.", source: "Proverbe wolof", pays: "Sénégal", terre: "🌍" },
    { texte: "Quand les toiles d'araignée s'unissent, elles peuvent arrêter un lion.", source: "Proverbe éthiopien", pays: "Éthiopie", terre: "🌍" },
    { texte: "Il n'est jamais trop tard pour revenir chercher ce qu'on a oublié.", source: "Sankofa, proverbe akan", pays: "Ghana", terre: "🌍" },
    { texte: "Petit à petit, l'oiseau fait son nid.", source: "Proverbe français", pays: "France", terre: "🌍" },
    { texte: "C'est en forgeant qu'on devient forgeron.", source: "Proverbe français", pays: "France", terre: "🌍" },
    { texte: "Qui va doucement va sûrement, et va loin.", source: "Proverbe italien", pays: "Italie", terre: "🌍" },
    { texte: "Peu à peu, on va loin.", source: "Proverbe espagnol", pays: "Espagne", terre: "🌍" },
    { texte: "C'est l'exercice qui fait le maître.", source: "Proverbe allemand", pays: "Allemagne", terre: "🌍" },
    { texte: "Là où il y a une volonté, il y a un chemin.", source: "Proverbe anglais", pays: "Royaume-Uni", terre: "🌍" },
    { texte: "La répétition est la mère de l'apprentissage.", source: "Proverbe russe", pays: "Russie", terre: "🌍" },
    { texte: "Par des chemins difficiles, jusqu'aux étoiles.", source: "Locution latine", pays: "Rome antique", terre: "🌍" },
    { texte: "Eau tendre sur pierre dure, tant elle frappe qu'elle la perce.", source: "Proverbe brésilien", pays: "Brésil", terre: "🌎" },
    { texte: "Qui persévère finit par atteindre son but.", source: "Proverbe hispano-américain", pays: "Amérique latine", terre: "🌎" },
  ];

  // Le petit hibou savant, perché sur la bulle. Il est fait de deux calques :
  // le corps (assets/images/hibou-corps.png) et la tête (hibou-tete.png), pour
  // que la tête bouge pendant que les pattes restent plantées sur la bulle.
  // Les paupières (.tssr-hibou-paupiere) sont posées sur ses yeux.
  // Les gestes sont dans home.css ; animerHibou() les déclenche au hasard.
  function hibouHTML() {
    var logo = document.querySelector('[data-md-component="logo"]');
    function src(nom) { return new URL("assets/images/" + nom, logo ? logo.href : location.href).href; }
    var img = function (nom) {
      return '<img src="' + src(nom) + '" alt="" width="185" height="240" draggable="false" decoding="async">';
    };
    return '<span class="tssr-hibou" role="img" aria-label="Un petit hibou">' +
      '<span class="tssr-hibou-souffle"><span class="tssr-hibou-plumes">' +
      '<span class="tssr-hibou-corps">' + img("hibou-corps.png") + '</span>' +
      '<span class="tssr-hibou-tete">' + img("hibou-tete.png") +
      '<span class="tssr-hibou-paupiere is-gauche"></span>' +
      '<span class="tssr-hibou-paupiere is-droite"></span></span>' +
      '</span></span>' +
      '<span class="tssr-hibou-bulle">Hou hou !</span>' +
      '</span>';
  }

  // Gestes du hibou : nom → durée (ms). Le clignement revient plus souvent.
  var GESTES = {
    "cligne": 220, "double": 580, "penche-g": 1750, "penche-d": 1750,
    "regarde": 2350, "ebouriffe": 650, "hop": 700, "dodo": 2850,
  };
  var TIRAGE = ["cligne", "cligne", "cligne", "double", "penche-g", "penche-d",
    "regarde", "regarde", "ebouriffe", "hop", "dodo"];

  function animerHibou(hibou) {
    var occupe = false;

    function geste(nom, puis) {
      if (occupe) return;
      occupe = true;
      hibou.classList.remove("is-" + nom);
      void hibou.offsetWidth;                // relance l'animation CSS
      hibou.classList.add("is-" + nom);
      setTimeout(function () {
        hibou.classList.remove("is-" + nom);
        occupe = false;
        if (puis) geste(puis);
      }, GESTES[nom]);
    }

    function parler() {
      hibou.classList.add("is-parle");
      clearTimeout(parler.t);
      parler.t = setTimeout(function () { hibou.classList.remove("is-parle"); }, 1400);
    }

    // un geste au hasard toutes les 2,5 à 6 s (rien si l'onglet est caché)
    function suivant() {
      if (!document.hidden) {
        var nom = TIRAGE[Math.floor(Math.random() * TIRAGE.length)];
        geste(nom, nom === "dodo" ? "ebouriffe" : null);   // il se réveille en s'ébrouant
      }
      setTimeout(suivant, 2500 + Math.random() * 3500);
    }

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) setTimeout(suivant, 2200);

    hibou.addEventListener("click", function () {
      occupe = false;
      geste("hop");
      parler();
    });

    return { hop: function () { occupe = false; geste("hop"); } };
  }

  function setupProverbe() {
    // numéro du jour depuis 1970 : change à minuit, identique toute la journée
    var day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / DAY);
    var index = day % PROVERBES.length;

    var bubble = document.createElement("aside");
    bubble.className = "tssr-proverbe";
    bubble.setAttribute("aria-label", "Proverbe du jour");
    bubble.innerHTML =
      '<div class="tssr-proverbe-head"><span class="tssr-proverbe-titre"></span>' +
      '<button type="button" class="tssr-proverbe-next" title="Un autre proverbe" aria-label="Un autre proverbe">↻</button></div>' +
      '<p class="tssr-proverbe-texte"></p><p class="tssr-proverbe-source"></p>' +
      hibouHTML();

    function show(i) {
      var p = PROVERBES[i];
      bubble.querySelector(".tssr-proverbe-titre").textContent = p.terre + " " + p.pays;
      bubble.querySelector(".tssr-proverbe-texte").textContent = "« " + p.texte + " »";
      bubble.querySelector(".tssr-proverbe-source").textContent = "— " + p.source;
      bubble.classList.remove("is-new");
      void bubble.offsetWidth;          // relance la petite animation d'apparition
      bubble.classList.add("is-new");
    }

    // le hibou vit sa vie ; il sautille quand on demande un autre proverbe
    var hibou = animerHibou(bubble.querySelector(".tssr-hibou"));
    function hop() { hibou.hop(); }

    bubble.querySelector(".tssr-proverbe-next").addEventListener("click", function () {
      index = (index + 1) % PROVERBES.length;
      show(index);
      hop();
    });
    show(index);

    // Grand écran : en bas du menu de gauche. Sinon : dans la page, sous la progression.
    var sidebar = document.querySelector(".md-sidebar--primary .md-sidebar__inner");
    var wide = window.matchMedia("(min-width: 76.25em)").matches;
    if (wide && sidebar) sidebar.appendChild(bubble);
    else {
      var row = document.querySelector(".tssr-home-row");
      if (row) row.insertAdjacentElement("afterend", bubble);
    }
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
    setupProverbe();
  });
})();
