/* ==========================================================================
   mermaid-survol.js — animation au survol des cadres des diagrammes Mermaid.

   Material for MkDocs dessine chaque diagramme dans un « shadow root » fermé :
   les feuilles de style du site ne l'atteignent pas. On intercepte donc
   attachShadow() pour les conteneurs .mermaid et on y ajoute une feuille de
   style « adoptée » (elle survit au innerHTML posé ensuite par Material).
   Les variables CSS du thème (--md-accent-fg-color…) traversent le shadow DOM.
   ========================================================================== */
(function () {
  "use strict";

  if (!window.CSSStyleSheet || !("adoptedStyleSheets" in Document.prototype)) return;

  var formes = ":is(rect, path, polygon, circle, ellipse)";
  var css = [
    ".node { transition: translate 0.25s ease, filter 0.25s ease; }",
    ".node " + formes + " { transition: fill 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease; }",
    ".node:hover {",
    "  translate: 0 -4px;",
    "  filter: drop-shadow(0 0 10px var(--md-accent-fg-color)) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));",
    "}",
    ".node:hover " + formes + " {",
    "  stroke: var(--md-accent-fg-color) !important;",
    "  stroke-width: 2px !important;",
    "  fill: color-mix(in srgb, var(--md-accent-fg-color) 24%, transparent) !important;",
    "}",
    ".node:hover .nodeLabel, .node:hover text { color: #fff !important; fill: #fff !important; }",
    "@media (prefers-reduced-motion: reduce) { .node:hover { translate: none; } }"
  ].join("\n");

  var feuille = new CSSStyleSheet();
  feuille.replaceSync(css);

  /* Sur téléphone, Mermaid rétrécit le schéma à la largeur de l'écran : le
     texte devient illisible. On lui rend sa taille réelle ; le cadre .mermaid
     défile alors horizontalement (voir tableaux-mobile.css). */
  var mobile = window.matchMedia("(max-width: 44.9375em)");

  function tailleReelle(racine) {
    var svg = racine.querySelector("svg");
    if (!svg || svg.dataset.tssrTaille) return;
    var max = parseFloat(svg.style.maxWidth);
    if (!max) return;
    svg.dataset.tssrTaille = "1";
    if (mobile.matches) {
      svg.style.width = max + "px";
      svg.style.maxWidth = "none";
    }
  }

  var original = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (options) {
    var racine = original.call(this, options);
    if (this.classList && this.classList.contains("mermaid")) {
      try {
        racine.adoptedStyleSheets = racine.adoptedStyleSheets.concat(feuille);
      } catch (e) { /* navigateur trop ancien : pas d'animation, rien de cassé */ }
      try {
        new MutationObserver(function () { tailleReelle(racine); })
          .observe(racine, { childList: true, subtree: true });
      } catch (e) { /* rien de cassé : le schéma reste à la largeur de l'écran */ }
    }
    return racine;
  };
})();
