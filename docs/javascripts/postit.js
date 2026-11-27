/**
 * postit.js
 * ---------------------------------------------------------------------
 * Post-it « reprendre là où j'en étais », lié au compte connecté
 * (styles : stylesheets/postit.css).
 *
 *   - bouton flottant 📝 (seulement si l'on est connecté, bouton 👤) :
 *     colle un post-it à l'endroit qu'on est en train de lire (le titre
 *     de section le plus proche), avec une note et une couleur ;
 *   - le post-it s'affiche dans la page, à cet endroit ; ✕ pour le retirer ;
 *   - un seul post-it par page (un nouveau remplace l'ancien), 30 au plus ;
 *   - liste « Mes post-its » dans la carte du compte et sur l'accueil
 *     (TSSRPostit.liste / TSSRPostit.lien) ;
 *   - le lien « reprendre » ramène au bon endroit (#ancre ou position
 *     relative) et fait frétiller le post-it.
 *
 * Stockage : clé tssr-postits, synchronisée avec le compte (compte.js).
 * ---------------------------------------------------------------------
 */
(function () {
  "use strict";

  var KEY = "tssr-postits";
  var MAX = 30;
  var COULEURS = { jaune: "Jaune", rose: "Rose", vert: "Vert", bleu: "Bleu" };

  function lire() { try { var l = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(l) ? l : []; } catch (e) { return []; } }
  function ecrire(l) { try { localStorage.setItem(KEY, JSON.stringify(l.slice(0, MAX))); } catch (e) { /* plein */ } }
  function connecte() { return !!(window.TSSRCompte && window.TSSRCompte.connecte()); }
  function page() { try { return decodeURI(location.pathname); } catch (e) { return location.pathname; } }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }

  function contenu() { return document.querySelector(".md-content__inner"); }
  function titrePage() {
    var h1 = document.querySelector(".md-content h1");
    return h1 ? h1.textContent.replace(/¶/g, "").trim() : document.title;
  }

  // titre de section le plus proche au-dessus de la zone de lecture
  function sectionCourante() {
    var hs = Array.prototype.slice.call(document.querySelectorAll(".md-content__inner h2[id], .md-content__inner h3[id]"));
    var choisi = null;
    hs.forEach(function (h) { if (h.getBoundingClientRect().top <= 140) choisi = h; });
    return choisi;
  }

  // lien pour revenir au post-it d'une page
  function lien(p) {
    return p.url + "?reprendre=1" + (p.ancre ? "#" + encodeURIComponent(p.ancre) : "");
  }

  function fmt(d) {
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) + " à " +
      new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  /* ---------- le post-it affiché dans la page ---------- */
  function afficher(p, animer) {
    var ancien = document.querySelector(".tssr-postit");
    if (ancien) ancien.remove();
    if (!p) return null;
    var zone = contenu();
    if (!zone) return null;
    var cible = p.ancre ? document.getElementById(p.ancre) : null;
    var note = el("aside", "tssr-postit is-" + (p.couleur || "jaune"));
    note.setAttribute("aria-label", "Post-it : j'en étais là");
    note.appendChild(el("strong", null, "📌 J'en étais là"));
    if (p.note) note.appendChild(el("p", null, p.note));
    note.appendChild(el("small", null, "Collé le " + fmt(p.date)));
    var x = el("button", "tssr-postit-retirer", "✕");
    x.type = "button";
    x.title = "Retirer ce post-it";
    x.setAttribute("aria-label", "Retirer ce post-it");
    x.addEventListener("click", function () {
      ecrire(lire().filter(function (q) { return q.url !== p.url; }));
      note.classList.add("is-decolle");
      setTimeout(function () { note.remove(); }, 350);
      majBouton();
    });
    note.appendChild(x);
    if (cible) cible.parentNode.insertBefore(note, cible);
    else {
      var h1 = zone.querySelector("h1");
      if (h1 && h1.nextSibling) h1.parentNode.insertBefore(note, h1.nextSibling); else zone.prepend(note);
    }
    if (animer) note.classList.add("is-colle");
    return note;
  }

  /* ---------- bouton flottant et petit formulaire ---------- */
  var bouton, panneau;

  function majBouton() {
    if (!bouton) return;
    var existe = lire().some(function (q) { return q.url === page(); });
    bouton.classList.toggle("a-postit", existe);
    bouton.title = existe ? "Déplacer mon post-it ici" : "Coller un post-it ici pour reprendre plus tard";
  }

  function construireBouton() {
    if (!contenu() || document.querySelector(".tssr-home")) return;   // pas sur l'accueil
    bouton = el("button", "tssr-postit-btn");
    bouton.type = "button";
    bouton.innerHTML = '<span aria-hidden="true">📝</span>';
    bouton.setAttribute("aria-label", "Coller un post-it ici");
    panneau = el("div", "tssr-postit-panneau");
    panneau.hidden = true;
    panneau.setAttribute("role", "dialog");
    panneau.setAttribute("aria-label", "Coller un post-it");
    var form = el("form");
    form.appendChild(el("strong", null, "📝 Coller un post-it ici"));
    var info = el("p", "tssr-postit-info");
    form.appendChild(info);
    var zone = el("textarea");
    zone.name = "note";
    zone.rows = 3;
    zone.maxLength = 200;
    zone.placeholder = "Note facultative : « reprendre à l'exercice 3 », « revoir le masque /27 »…";
    form.appendChild(zone);
    var couleurs = el("div", "tssr-postit-couleurs");
    Object.keys(COULEURS).forEach(function (c, i) {
      var l = el("label", "is-" + c);
      var r = el("input");
      r.type = "radio"; r.name = "couleur"; r.value = c; r.checked = i === 0;
      l.appendChild(r);
      l.appendChild(el("span", null, COULEURS[c]));
      couleurs.appendChild(l);
    });
    form.appendChild(couleurs);
    var actions = el("div", "tssr-postit-actions");
    var ok = el("button", "md-button md-button--primary", "Coller");
    ok.type = "submit";
    var annuler = el("button", "md-button", "Annuler");
    annuler.type = "button";
    actions.appendChild(ok); actions.appendChild(annuler);
    form.appendChild(actions);
    panneau.appendChild(form);
    document.body.appendChild(bouton);
    document.body.appendChild(panneau);

    function fermer() { panneau.hidden = true; bouton.setAttribute("aria-expanded", "false"); }
    bouton.addEventListener("click", function () {
      if (!panneau.hidden) { fermer(); return; }
      var s = sectionCourante();
      info.textContent = "À l'endroit : « " + (s ? s.textContent.replace(/¶/g, "").trim() : "début de la page") + " »";
      var actuel = lire().filter(function (q) { return q.url === page(); })[0];
      zone.value = actuel ? actuel.note || "" : "";
      panneau.hidden = false;
      bouton.setAttribute("aria-expanded", "true");
      zone.focus();
    });
    annuler.addEventListener("click", fermer);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panneau.hidden) fermer(); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var s = sectionCourante();
      var doc = document.documentElement;
      var p = {
        url: page(),
        titre: titrePage(),
        ancre: s ? s.id : "",
        section: s ? s.textContent.replace(/¶/g, "").trim() : "",
        position: Math.round(scrollY / Math.max(1, doc.scrollHeight - innerHeight) * 1000) / 1000,
        note: zone.value.trim(),
        couleur: form.couleur.value,
        date: new Date().toISOString(),
      };
      ecrire([p].concat(lire().filter(function (q) { return q.url !== p.url; })));
      fermer();
      var n = afficher(p, true);
      if (n) n.scrollIntoView({ behavior: "smooth", block: "center" });
      majBouton();
    });
    majBouton();
  }

  /* ---------- démarrage ---------- */
  function demarrer() {
    if (!connecte()) return;                      // fonction réservée au compte connecté
    var p = lire().filter(function (q) { return q.url === page(); })[0];
    var note = afficher(p, false);
    construireBouton();
    // arrivée par le lien « reprendre »
    if (note && /[?&]reprendre=1/.test(location.search)) {
      setTimeout(function () {
        if (!p.ancre) scrollTo(0, p.position * (document.documentElement.scrollHeight - innerHeight));
        else note.scrollIntoView({ block: "center" });
        note.classList.add("is-retrouve");
      }, 150);
      history.replaceState(null, "", location.pathname + location.hash);
    }
  }

  window.TSSRPostit = { liste: lire, lien: lien };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(demarrer, 0); });
  else setTimeout(demarrer, 0);
})();
