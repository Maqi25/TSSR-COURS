/**
 * suivi-tp.js
 * ---------------------------------------------------------------------
 * Suivi des TP refaits (styles : stylesheets/compte.css).
 *
 *   - sur chaque page de TP : un bloc « Mon suivi de ce TP » avec 3 boutons
 *     (✅ sans aide · 🟠 avec le corrigé · ❌ pas réussi), l'historique et la
 *     date de la prochaine révision conseillée ;
 *   - sur la page « Travaux pratiques » : la progression globale, les TP à
 *     refaire, et une pastille de couleur sur chaque carte.
 *
 * RÉVISION ESPACÉE : après un résultat, le TP revient à refaire dans
 *   ❌ 3 jours · 🟠 7 jours · ✅ 7, puis 30, puis 90 jours (réussites de suite).
 *
 * Les données sont dans le navigateur (clé tssr-suivi-tp) et sont
 * synchronisées avec le compte si l'on est connecté (compte.js).
 * Rien à modifier ici pour ajouter un TP : les pages de
 * travaux-pratiques/<cours>/<tp>/ sont reconnues toutes seules.
 * ---------------------------------------------------------------------
 */
(function () {
  "use strict";

  var KEY = "tssr-suivi-tp";
  var JOUR = 86400000;
  var RESULTATS = {
    ok:    { emoji: "✅", label: "Refait sans aide", court: "sans aide" },
    aide:  { emoji: "🟠", label: "Refait avec le corrigé", court: "avec le corrigé" },
    echec: { emoji: "❌", label: "Pas réussi", court: "pas réussi" },
  };

  function lire() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function ecrire(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }

  // identifiant d'un TP : la fin de son adresse, ex. "cours-04-…/tp-gestion-des-permissions/"
  function idDepuisChemin(chemin) {
    var m = decodeURI(chemin).match(/\/travaux-pratiques\/([^/]+\/[^/]+\/)/);
    return m ? m[1] : null;
  }

  // date de la prochaine révision d'après l'historique (le plus récent en premier)
  function prochaine(hist) {
    if (!hist || !hist.length) return null;
    var dernier = hist[0];
    var delai;
    if (dernier.r === "echec") delai = 3;
    else if (dernier.r === "aide") delai = 7;
    else {
      var suite = 0;
      for (var i = 0; i < hist.length && hist[i].r === "ok"; i++) suite++;
      delai = suite >= 3 ? 90 : suite === 2 ? 30 : 7;
    }
    return new Date(new Date(dernier.d).getTime() + delai * JOUR);
  }

  // état d'un TP : jamais, ok (maîtrisé), aide, echec, et s'il est à refaire
  function etat(hist) {
    if (!hist || !hist.length) return { code: "jamais", aRefaire: false };
    var p = prochaine(hist);
    return { code: hist[0].r, aRefaire: p && p.getTime() <= Date.now(), prochaine: p };
  }

  function fmt(d) {
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  // ------------------------------------------------------------------
  // Page d'un TP
  // ------------------------------------------------------------------
  function pageTP() {
    var id = idDepuisChemin(location.pathname);
    if (!id) return;
    var article = document.querySelector(".md-content__inner");
    var onglets = article && article.querySelector(".tabbed-set");
    if (!onglets) return;

    var box = document.createElement("div");
    box.className = "tssr-suivi-tp";
    onglets.parentNode.insertBefore(box, onglets);

    function rendre() {
      var d = lire();
      var hist = d[id] || [];
      var e = etat(hist);
      var html = '<div class="tssr-suivi-tete"><strong>🔁 Mon suivi de ce TP</strong>';
      if (e.code !== "jamais") {
        html += '<span class="tssr-suivi-prochaine' + (e.aRefaire ? " is-due" : "") + '">' +
          (e.aRefaire ? "🔔 À refaire maintenant" : "Prochaine révision : " + fmt(e.prochaine)) + "</span>";
      }
      html += "</div>";
      html += '<p class="tssr-suivi-aide">Refais le TP en VM avec le seul onglet « Ce qui est demandé », puis note ton résultat :</p>';
      html += '<div class="tssr-suivi-boutons">';
      Object.keys(RESULTATS).forEach(function (r) {
        html += '<button type="button" class="md-button tssr-suivi-btn is-' + r + '" data-r="' + r + '">' +
          RESULTATS[r].emoji + " " + RESULTATS[r].label + "</button>";
      });
      html += "</div>";
      if (hist.length) {
        html += '<p class="tssr-suivi-histo">Historique : ' + hist.slice(0, 6).map(function (h, i) {
          return '<span>' + RESULTATS[h.r].emoji + " " + fmt(h.d) + " " + RESULTATS[h.r].court +
            (i === 0 ? ' <button type="button" class="tssr-suivi-annuler" title="Annuler ce résultat">✕</button>' : "") + "</span>";
        }).join(" · ") + (hist.length > 6 ? " · …" : "") + "</p>";
      } else {
        html += '<p class="tssr-suivi-histo">Pas encore refait.</p>';
      }
      box.innerHTML = html;
      box.setAttribute("data-etat", e.code);

      box.querySelectorAll(".tssr-suivi-btn").forEach(function (b) {
        b.addEventListener("click", function () {
          var d2 = lire();
          d2[id] = [{ r: b.dataset.r, d: new Date().toISOString() }].concat(d2[id] || []).slice(0, 30);
          ecrire(d2);
          rendre();
        });
      });
      var annuler = box.querySelector(".tssr-suivi-annuler");
      if (annuler) annuler.addEventListener("click", function () {
        var d2 = lire();
        (d2[id] || []).shift();
        if (d2[id] && !d2[id].length) delete d2[id];
        ecrire(d2);
        rendre();
      });
    }
    rendre();
  }

  // ------------------------------------------------------------------
  // Page « Travaux pratiques »
  // ------------------------------------------------------------------
  function pageListe() {
    var zone = document.getElementById("tssr-tp-filter");
    var data = document.getElementById("tssr-tp-data");
    if (!zone || !data) return;
    var items;
    try { items = JSON.parse(data.textContent); } catch (e) { return; }

    var base = location.pathname.replace(/[^/]*$/, "");
    var tps = items.filter(function (it) { return it.href; }).map(function (it) {
      return { id: idDepuisChemin(base + it.href), titre: it.title.replace(/^TP - /, ""), href: it.href };
    }).filter(function (t) { return t.id; });

    var tableau = document.createElement("div");
    tableau.className = "tssr-suivi-tableau";
    zone.parentNode.insertBefore(tableau, zone);

    function resume() {
      var d = lire();
      var n = { ok: 0, aide: 0, echec: 0, jamais: 0 }, aRefaire = [];
      tps.forEach(function (t) {
        var e = etat(d[t.id]);
        n[e.code]++;
        if (e.aRefaire) aRefaire.push(t);
      });
      var faits = tps.length - n.jamais;
      var pct = tps.length ? Math.round((n.ok / tps.length) * 100) : 0;
      var html = '<div class="tssr-suivi-tete"><strong>📊 Mon suivi des TP</strong><span>' +
        faits + " refait" + (faits > 1 ? "s" : "") + " sur " + tps.length + "</span></div>" +
        '<div class="tssr-suivi-barre" title="' + pct + ' % maîtrisés">' +
        ["ok", "aide", "echec"].map(function (c) {
          return '<span class="is-' + c + '" style="width:' + (tps.length ? (n[c] / tps.length) * 100 : 0) + '%"></span>';
        }).join("") + "</div>" +
        '<p class="tssr-suivi-legende"><span class="is-ok">✅ ' + n.ok + " maîtrisé" + (n.ok > 1 ? "s" : "") +
        '</span><span class="is-aide">🟠 ' + n.aide + ' avec aide</span><span class="is-echec">❌ ' + n.echec +
        ' à retravailler</span><span class="is-jamais">⚪ ' + n.jamais + " jamais faits</span></p>";
      if (aRefaire.length) {
        html += '<p class="tssr-suivi-due">🔔 <strong>À refaire maintenant :</strong> ' +
          aRefaire.map(function (t) { return '<a href="' + t.href + '">' + t.titre + "</a>"; }).join(" · ") + "</p>";
      } else if (faits) {
        html += '<p class="tssr-suivi-due is-calme">👌 Aucun TP à refaire pour l\'instant.</p>';
      }
      tableau.innerHTML = html;
    }

    // pastille sur chaque carte (les cartes sont recréées à chaque filtrage)
    function pastilles() {
      var d = lire();
      zone.querySelectorAll(".tssr-result-card h3 > a[href]").forEach(function (a) {
        if (a.querySelector(".tssr-suivi-pastille")) return;
        var e = etat(d[idDepuisChemin(a.pathname)]);
        var p = document.createElement("span");
        p.className = "tssr-suivi-pastille is-" + e.code + (e.aRefaire ? " is-due" : "");
        p.title = e.code === "jamais" ? "Jamais refait" :
          RESULTATS[e.code].label + (e.aRefaire ? " · à refaire" : " · prochaine révision le " + fmt(e.prochaine));
        a.insertBefore(p, a.firstChild);
      });
    }

    resume();
    pastilles();
    new MutationObserver(pastilles).observe(zone, { childList: true, subtree: true });
  }

  function init() { pageTP(); pageListe(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
