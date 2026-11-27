/**
 * activite.js
 * ---------------------------------------------------------------------
 * Mesure du temps d'étude, pour le tableau de bord (tableau-de-bord.js).
 *
 * On compte une seconde d'étude quand la page est VISIBLE et que la
 * personne a fait quelque chose (souris, clavier, défilement, toucher)
 * dans les 2 dernières minutes : un onglet oublié ne compte pas.
 *
 * Stockage : clé tssr-activite = { "2026-11-27": secondes, … }, écrite
 * au plus une fois par minute (et en quittant la page), synchronisée avec
 * le compte. On garde 400 jours au maximum.
 * ---------------------------------------------------------------------
 */
(function () {
  "use strict";

  var KEY = "tssr-activite";
  var INACTIF = 120;          // secondes sans action avant de mettre le compteur en pause
  var derniereAction = Date.now();
  var enAttente = 0;          // secondes comptées pas encore écrites

  function jour(d) {
    var x = d || new Date();
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }

  function ecrire() {
    if (!enAttente) return;
    try {
      var a = JSON.parse(localStorage.getItem(KEY)) || {};
      var j = jour();
      a[j] = (a[j] || 0) + enAttente;
      var jours = Object.keys(a).sort();
      jours.slice(0, Math.max(0, jours.length - 400)).forEach(function (k) { delete a[k]; });
      localStorage.setItem(KEY, JSON.stringify(a));
      enAttente = 0;
    } catch (e) { /* stockage indisponible : on réessaiera */ }
  }

  ["mousemove", "keydown", "scroll", "touchstart", "click"].forEach(function (ev) {
    addEventListener(ev, function () { derniereAction = Date.now(); }, { passive: true });
  });

  setInterval(function () {
    if (document.visibilityState === "visible" && Date.now() - derniereAction < INACTIF * 1000) enAttente++;
  }, 1000);
  setInterval(ecrire, 60000);
  addEventListener("pagehide", ecrire);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") ecrire(); });

  window.TSSRActivite = { jour: jour, ecrire: ecrire };
})();
