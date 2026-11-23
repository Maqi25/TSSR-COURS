/**
 * menu-anime.js
 * ---------------------------------------------------------------------
 * Animations du menu de gauche (styles dans menu-anime.css) :
 *   - une onde lumineuse part de l'endroit cliqué ;
 *   - l'icône de l'entrée fait un petit saut ;
 *   - les sous-entrées reçoivent leur rang (--tssr-rang) pour apparaître
 *     en cascade à l'ouverture d'un sous-menu.
 * Rien ne se passe si l'appareil demande moins d'animations.
 * ---------------------------------------------------------------------
 */
(function () {
  var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function numeroter() {
    document.querySelectorAll(".md-sidebar--primary .md-nav > .md-nav__list").forEach(function (liste) {
      var rang = 0;
      Array.prototype.forEach.call(liste.children, function (li) {
        if (li.classList && li.classList.contains("md-nav__item")) li.style.setProperty("--tssr-rang", Math.min(rang++, 12));
      });
    });
  }

  function onde(ev) {
    var lien = ev.target.closest && ev.target.closest(".md-sidebar--primary .md-nav__link");
    if (!lien) return;
    // sur une entrée avec sous-menu, l'onde se dessine sur le bouton entier
    var cible = lien.closest(".md-nav__container") ? lien.closest(".md-nav__item > .md-nav__link") || lien : lien;
    var r = cible.getBoundingClientRect();
    var o = document.createElement("span");
    o.className = "tssr-onde";
    o.style.left = (ev.clientX - r.left) + "px";
    o.style.top = (ev.clientY - r.top) + "px";
    cible.appendChild(o);
    setTimeout(function () { o.remove(); }, 650);

    cible.classList.remove("tssr-menu-saut");
    void cible.offsetWidth; // relance l'animation même sur un double clic
    cible.classList.add("tssr-menu-saut");
    setTimeout(function () { cible.classList.remove("tssr-menu-saut"); }, 550);
  }

  function demarrer() {
    if (reduit) return;
    numeroter();
    document.addEventListener("pointerdown", onde, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
