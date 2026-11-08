/**
 * tableaux-mobile.js
 * ---------------------------------------------------------------------
 * Sur téléphone, les tableaux larges (programme, fiches de révision,
 * comparatifs…) dépassaient de l'écran et paraissaient coupés.
 *
 * Ce script recopie le titre de chaque colonne dans les cellules
 * (attribut data-label) et marque le tableau avec data-cartes.
 * tableaux-mobile.css s'en sert sur petit écran pour afficher chaque
 * ligne comme une carte : « Titre de colonne : valeur ».
 * Sur grand écran, rien ne change.
 * ---------------------------------------------------------------------
 */
(function () {
  function preparer(table) {
    if (table.hasAttribute("data-cartes")) return;
    var entetes = table.querySelectorAll("thead th");
    if (!entetes.length) return;

    var titres = Array.prototype.map.call(entetes, function (th) {
      return th.textContent.trim();
    });

    table.querySelectorAll("tbody tr").forEach(function (tr) {
      Array.prototype.forEach.call(tr.children, function (td, i) {
        if (titres[i]) td.setAttribute("data-label", titres[i]);
      });
    });
    table.setAttribute("data-cartes", "");
  }

  function tout() {
    document.querySelectorAll(".md-typeset table:not([class])").forEach(preparer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tout);
  } else {
    tout();
  }
})();
