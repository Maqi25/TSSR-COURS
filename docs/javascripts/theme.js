/**
 * theme.js
 * ---------------------------------------------------------------------
 * Habillage du site (styles : stylesheets/theme.css) :
 *   - bouton 🎨 dans l'en-tête pour choisir la couleur du site ; le choix
 *     est mémorisé dans le navigateur (localStorage) ;
 *   - icônes devant les entrées du menu de gauche, et titre « Mon espace ».
 *
 * L'IDÉE : la couleur n'est pas écrite « en dur » dans le CSS. Le CSS dit
 * « si <html> a l'attribut data-tssr-theme="violet", alors la couleur
 * principale est #7c3aed ». Le JavaScript n'a donc qu'une chose à faire :
 * changer cet attribut. Tout le site se recolore d'un coup.
 * ---------------------------------------------------------------------
 */

(function () {
  var STORAGE_KEY = "tssr-theme";

  var THEMES = [
    { id: "cyan", label: "Cyan", color: "#0891b2" },
    { id: "bleu", label: "Bleu", color: "#2563eb" },
    { id: "violet", label: "Violet", color: "#7c3aed" },
    { id: "rose", label: "Rose", color: "#db2777" },
    { id: "vert", label: "Vert", color: "#059669" },
    { id: "orange", label: "Orange", color: "#ea580c" },
  ];

  // Icônes du menu (tracés SVG de 24 × 24, dessinés au trait)
  var ICONS = {
    home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
    calendar: "M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM16 2v4M8 2v4M3 10h18",
    award: "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14 7 22l5-3 5 3-1.5-8",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5",
    tool: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z",
    sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
    terminal: "M4 17l6-6-6-6M12 19h8",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
    plus: "M12 5v14M5 12h14",
    dot: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  };

  // Quelle icône pour quelle page ? (d'après le dossier dans l'adresse)
  var NAV_ICONS = {
    "": "home",
    programme: "calendar",
    referentiel: "award",
    cours: "book",
    "travaux-pratiques": "tool",
    revisions: "sparkle",
    commandes: "terminal",
    glossaire: "search",
    "ajouter-du-contenu": "plus",
  };

  function readTheme() {
    try { return localStorage.getItem(STORAGE_KEY) || "cyan"; } catch (e) { return "cyan"; }
  }

  function applyTheme(id) {
    document.documentElement.setAttribute("data-tssr-theme", id);
    // la barre d'adresse du téléphone prend aussi la couleur
    var meta = document.querySelector('meta[name="theme-color"]');
    var theme = THEMES.filter(function (t) { return t.id === id; })[0];
    if (meta && theme) meta.setAttribute("content", theme.color);
  }

  function saveTheme(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
  }

  // On applique la couleur tout de suite, avant même que la page soit prête
  applyTheme(readTheme());

  function svgIcon(name, className) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", className);
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", ICONS[name] || ICONS.dot);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
  }

  // ------------------------------------------------------------------
  // Le bouton 🎨 et son menu de couleurs
  // ------------------------------------------------------------------
  function setupPicker() {
    var header = document.querySelector(".md-header__inner");
    if (!header) return;

    var wrap = document.createElement("div");
    wrap.className = "tssr-theme-picker";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "tssr-theme-btn";
    button.setAttribute("aria-label", "Changer la couleur du site");
    button.setAttribute("aria-expanded", "false");
    button.title = "Couleur du site";
    // icône « palette de peintre »
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c.8 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.2-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>';

    var menu = document.createElement("div");
    menu.className = "tssr-theme-menu";
    menu.innerHTML = "<p>Couleur du site</p>";
    var grid = document.createElement("div");
    grid.className = "tssr-theme-swatches";
    menu.appendChild(grid);

    var swatches = THEMES.map(function (theme) {
      var s = document.createElement("button");
      s.type = "button";
      s.className = "tssr-theme-swatch";
      s.style.setProperty("--swatch", theme.color);
      s.innerHTML = "<span></span>";
      s.appendChild(document.createTextNode(theme.label));
      s.addEventListener("click", function () {
        applyTheme(theme.id);
        saveTheme(theme.id);
        refresh();
      });
      grid.appendChild(s);
      return { el: s, id: theme.id };
    });

    // Le bouton de la couleur choisie apparaît « enfoncé »
    function refresh() {
      var current = readTheme();
      swatches.forEach(function (s) { s.el.setAttribute("aria-pressed", String(s.id === current)); });
    }

    function open(isOpen) {
      menu.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
    }

    button.addEventListener("click", function (e) {
      e.stopPropagation();
      open(!menu.classList.contains("is-open"));
    });
    menu.addEventListener("click", function (e) { e.stopPropagation(); });
    document.addEventListener("click", function () { open(false); });       // clic ailleurs : on ferme
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });

    wrap.appendChild(button);
    wrap.appendChild(menu);
    refresh();

    // On place le bouton juste avant celui du mode clair / sombre
    var palette = header.querySelector('[data-md-component="palette"]');
    header.insertBefore(wrap, palette || header.querySelector(".md-search"));
  }

  // ------------------------------------------------------------------
  // Le menu de gauche : icônes + titre « Mon espace »
  // ------------------------------------------------------------------
  function setupNav() {
    var nav = document.querySelector(".md-nav--primary");
    if (!nav) return;

    var title = nav.querySelector(":scope > .md-nav__title");
    if (title) {
      // on remplace seulement le texte, pas le logo
      Array.prototype.forEach.call(title.childNodes, function (node) {
        if (node.nodeType === 3 && node.textContent.trim()) node.textContent = " Mon espace ";
      });
    }

    var root = new URL(document.querySelector('[data-md-component="logo"]').href, location.href).pathname;
    nav.querySelectorAll(":scope > .md-nav__list > .md-nav__item").forEach(function (item) {
      var link = item.querySelector(":scope > a.md-nav__link, :scope > .md-nav__container > a.md-nav__link");
      if (!link) return;
      var path = new URL(link.href, location.href).pathname.slice(root.length);
      var folder = path.split("/")[0];
      link.insertBefore(svgIcon(NAV_ICONS[folder] || "dot", "tssr-nav-icon"), link.firstChild);
    });
  }

  // ------------------------------------------------------------------
  // Pastille « ✓ vu » sur les cartes des cours et modules déjà ouverts.
  // La liste des pages ouvertes est tenue par home.js (clé tssr-visited-pages).
  // ------------------------------------------------------------------
  function markSeenCards() {
    var visited;
    try { visited = JSON.parse(localStorage.getItem("tssr-visited-pages") || "[]"); } catch (e) { visited = []; }
    if (!Array.isArray(visited) || !visited.length) return;

    document.querySelectorAll("a.tssr-card").forEach(function (card) {
      var base = card.pathname;   // l'adresse complète de la carte
      var seen = visited.some(function (url) { return url.indexOf(base) === 0; });
      card.classList.toggle("is-seen", seen);
      if (seen) card.setAttribute("title", "Déjà ouvert");
    });
  }

  // ------------------------------------------------------------------
  // Barre de lecture sous « Sur cette page » : se remplit quand on descend
  // ------------------------------------------------------------------
  function setupTocProgress() {
    var title = document.querySelector(".md-sidebar--secondary .md-nav--secondary > .md-nav__title");
    if (!title) return;
    var bar = document.createElement("div");
    bar.className = "tssr-toc-progress";
    bar.setAttribute("aria-hidden", "true");
    bar.appendChild(document.createElement("span"));
    title.appendChild(bar);

    var pending = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 1;
      bar.style.setProperty("--read", Math.round(ratio * 100) + "%");
      bar.title = Math.round(ratio * 100) + " % lu";
      pending = false;
    }
    window.addEventListener("scroll", function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);   // au plus une mise à jour par image
    }, { passive: true });
    update();
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupPicker();
    setupNav();
    markSeenCards();
    setupTocProgress();
  });
})();
