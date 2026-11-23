/**
 * methodologie.js
 * ---------------------------------------------------------------------
 * Planning de révision de la page Méthodologie (<div id="tssr-planning">).
 * Il part d'aujourd'hui, suit les dates des cours du programme et propose,
 * semaine par semaine, quoi réviser et combien de temps :
 *   - le cours de la semaine (schémas + fiche chaque soir, QCM et TP le week-end) ;
 *   - les révisions espacées J+7, J+30, J+90 des cours terminés ;
 *   - le rattrapage des cours déjà passés au démarrage ;
 *   - les examens blancs du QCM dès que les cours d'un CCP sont faits ;
 *   - le stage, puis le sprint final avant l'examen.
 * Modifiable : dates, temps disponible, cases cochées, tâches ajoutées ou
 * supprimées, notes. Enregistré dans le navigateur (clé PLAN_KEY).
 * ---------------------------------------------------------------------
 */
(function () {
  var PLAN_KEY = "tssr-planning-revision";

  // Cours du programme : n°, titre, dossier sur le site, début, fin, contenu disponible sur le site
  var COURS = [
    { n: "B", t: "Microsoft 365", d: "bonus-microsoft-365", debut: "2026-10-12", fin: "2026-10-16", site: true },
    { n: 1, t: "Bases des réseaux", d: "cours-01-bases-des-reseaux", debut: "2026-10-19", fin: "2026-10-23", site: true },
    { n: 2, t: "Système client Microsoft", d: "cours-02-systeme-client-microsoft", debut: "2026-10-26", fin: "2026-11-06", site: true },
    { n: 3, t: "Utilisation de GNU/Linux", d: "cours-03-utilisateur-d-une-distribution-gnu-linux", debut: "2026-11-09", fin: "2026-11-13", site: true },
    { n: 4, t: "Administration GNU/Linux", d: "cours-04-administration-d-une-distribution-gnu-linux", debut: "2026-11-16", fin: "2026-11-27", site: true },
    { n: 5, t: "Mise en situation : systèmes clients", d: "cours-05-mise-en-situation-professionnelle-systeme-client", debut: "2026-11-30", fin: "2026-12-04", site: true, msp: true },
    { n: 6, t: "ITIL et gestion de parc", d: "cours-06-sensibilisation-itil-et-gestion-de-parc", debut: "2026-12-07", fin: "2026-12-18", site: true },
    { n: 7, t: "Les infrastructures réseau", d: "cours-07-les-infrastructures-reseau", debut: "2026-12-21", fin: "2027-01-08", site: true },
    { n: 8, t: "Services réseau Microsoft", d: "cours-08-les-services-reseau-en-environnement-microsoft", debut: "2027-01-11", fin: "2027-01-22", site: true },
    { n: 9, t: "Mise en situation : services réseau", d: "cours-09-mise-en-situation-professionnelle-services-reseau", debut: "2027-01-25", fin: "2027-01-29", site: true, msp: true },
    { n: 10, t: "Scripting Bash", d: "cours-10-initiation-au-scripting-bash", debut: "2027-02-01", fin: "2027-02-05", site: true },
    { n: 11, t: "PowerShell", d: "cours-11-initiation-a-powershell", debut: "2027-02-08", fin: "2027-02-12", site: true },
    { n: 12, t: "Automatisation et IA", d: "cours-12-automatisation-et-ia-appliquees-au-support-et-au-mco", debut: "2027-02-15", fin: "2027-02-19", site: false },
    { n: 13, t: "Virtualisation de serveurs", d: "cours-13-virtualisation-de-serveurs", debut: "2027-02-22", fin: "2027-02-26", site: true },
    { n: 14, t: "Services Cloud", d: "cours-14-services-cloud", debut: "2027-03-01", fin: "2027-03-05", site: false },
    { n: 15, t: "Sauvegarde et restauration", d: "cours-15-sauvegarde-et-restauration", debut: "2027-03-08", fin: "2027-03-12", site: true },
    { n: 16, t: "Réseau et sécurité", d: "cours-16-reseau-et-securite", debut: "2027-03-15", fin: "2027-03-26", site: true },
    { n: 17, t: "Supervision", d: "cours-17-supervision", debut: "2027-03-29", fin: "2027-04-02", site: false },
  ];
  var STAGE = { debut: "2027-04-05", fin: "2027-05-28" };
  var PAUSE = { debut: "2026-12-28", fin: "2027-01-01" };   // pause des fêtes
  // Un examen blanc du CCP est proposé quand ses principaux cours sont terminés
  var CCP_PRET = { 1: "2026-12-18", 2: "2027-01-22", 3: "2027-03-12" };

  var DEFAUT = { debut: "", examen: "2027-05-28", heures: 5 };

  /* ---------- outils ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function d(iso) { return new Date(iso + "T00:00:00"); }
  function iso(dt) {
    var m = dt.getMonth() + 1, j = dt.getDate();
    return dt.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j;
  }
  function plusJours(dt, n) { var x = new Date(dt); x.setDate(x.getDate() + n); return x; }
  function lundi(dt) { var x = new Date(dt); var j = (x.getDay() + 6) % 7; x.setDate(x.getDate() - j); x.setHours(0, 0, 0, 0); return x; }
  function fr(dt) { return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }); }
  function duree(min) { var h = Math.floor(min / 60), m = min % 60; return h ? h + " h" + (m ? " " + (m < 10 ? "0" : "") + m : "") : m + " min"; }
  function chevauche(a1, a2, b1, b2) { return a1 <= b2 && b1 <= a2; }
  function nomCours(c) { return c.n === "B" ? "bonus Microsoft 365" : "cours " + c.n + " (" + c.t + ")"; }
  function url(chemin) {
    var base = "..";
    try { base = JSON.parse(document.getElementById("__config").textContent).base || "."; } catch (e) { /* défaut */ }
    return base.replace(/\/$/, "") + "/" + chemin;
  }

  /* ---------- stockage ---------- */
  function lire() {
    var p;
    try { p = JSON.parse(localStorage.getItem(PLAN_KEY)); } catch (e) { p = null; }
    p = p && typeof p === "object" ? p : {};
    return {
      reglages: Object.assign({}, DEFAUT, p.reglages || {}),
      faits: p.faits && typeof p.faits === "object" ? p.faits : {},
      masques: p.masques && typeof p.masques === "object" ? p.masques : {},
      ajouts: p.ajouts && typeof p.ajouts === "object" ? p.ajouts : {},
      notes: p.notes && typeof p.notes === "object" ? p.notes : {},
    };
  }
  function ecrire(p) { try { localStorage.setItem(PLAN_KEY, JSON.stringify(p)); return true; } catch (e) { return false; } }

  /* ---------- génération du planning ---------- */
  function generer(reglages) {
    var aujourdhui = new Date(); aujourdhui.setHours(0, 0, 0, 0);
    var debut = reglages.debut ? d(reglages.debut) : aujourdhui;
    var examen = d(reglages.examen || DEFAUT.examen);
    if (examen < debut) examen = plusJours(debut, 28);
    var semaines = [];
    // rattrapage dans l'ordre des cours : cours 1 d'abord, le bonus Microsoft 365 en dernier
    var rattrapage = COURS.filter(function (c) { return d(c.fin) < lundi(debut) && c.site && c.n !== "B"; })
      .concat(COURS.filter(function (c) { return c.n === "B" && d(c.fin) < lundi(debut); }));
    var lundiExamen = lundi(examen);
    var rotationCcp = 0;

    for (var l = lundi(debut), i = 0; l <= lundiExamen && i < 80; l = plusJours(l, 7), i++) {
      var dim = plusJours(l, 6), taches = [];
      var lIso = iso(l), dIso = iso(dim);
      var joursAvantExamen = Math.round((examen - l) / 86400000);

      // 1. sprint final (les deux dernières semaines)
      if (joursAvantExamen <= 13) {
        if (joursAvantExamen <= 6) {
          taches.push({ id: "fin1", m: 300, t: "🏁 Dernière semaine : un examen blanc chronométré par jour jusqu'à J-2 (CCP 1, 2, 3 à tour de rôle) puis « Revoir mes erreurs »", lien: "qcm-examen/" });
          taches.push({ id: "fin2", m: 60, t: "📄 Relire les fiches des 2 compétences les plus faibles (tableau de bord) ; J-1 : relecture légère et repos" , lien: "qcm-examen/tableau-de-bord/" });
        } else {
          taches.push({ id: "spr1", m: 240, t: "🏁 Sprint : un examen blanc chronométré tous les deux jours + « Revoir mes erreurs »", lien: "qcm-examen/" });
          taches.push({ id: "spr2", m: 90, t: "🗣️ Réexpliquer à voix haute 3 TP marquants (besoin, étapes, vérification)" });
          taches.push({ id: "spr3", m: 60, t: "📄 Fiches de révision des cours les moins maîtrisés", lien: "revisions/" });
        }
        semaines.push({ id: lIso, lundi: l, dimanche: dim, titre: joursAvantExamen <= 6 ? "Semaine de l'examen" : "Sprint final", taches: taches });
        continue;
      }

      // 2. cours de la semaine
      var enCours = COURS.filter(function (c) { return chevauche(c.debut, c.fin, lIso, dIso); });
      var pause = chevauche(PAUSE.debut, PAUSE.fin, lIso, dIso);
      var stage = chevauche(STAGE.debut, STAGE.fin, lIso, dIso);
      enCours.forEach(function (c) {
        if (c.msp) {
          taches.push({ id: "msp" + c.n, m: 120, t: "🧩 Mise en situation : pas de nouveau cours. Le soir, noter ta démarche ; le week-end, relire les fiches des cours utilisés", lien: "cours/" + c.d + "/" });
        } else if (c.site) {
          taches.push({ id: "soir" + c.n, m: 100, t: "📘 Chaque soir (20 min) : schémas + fiche du module vu dans la journée · " + nomCours(c), lien: "cours/" + c.d + "/" });
          taches.push({ id: "we" + c.n, m: 75, t: "✅ Le week-end : QCM des modules de la semaine (objectif 7/8) + refaire 1 TP sans la correction", lien: "cours/" + c.d + "/" });
        } else {
          taches.push({ id: "notes" + c.n, m: 120, t: "✍️ Pas encore sur le site (" + nomCours(c) + ") : chaque soir, mettre au propre tes notes et tes procédures de TP" });
        }
      });

      // 3. rattrapage des cours passés avant le démarrage (1 par semaine)
      if (rattrapage.length && !stage) {
        rattrapage.splice(0, 1).forEach(function (c) {
          taches.push({ id: "rat" + c.n, m: 90, t: "⏪ Rattrapage · " + nomCours(c) + " : fiche de révision, QCM de chaque module, puis 1 TP refait", lien: "cours/" + c.d + "/" });
        });
      }

      // 4. révisions espacées des cours terminés
      COURS.forEach(function (c) {
        if (!c.site || c.msp) return;
        var fin = d(c.fin);
        [[7, 45, "🔁 J+7", "fiche + QCM des modules"], [30, 60, "🔁 J+30", "fiche + quiz express + 1 TP refait"], [90, 20, "🔁 J+90", "fiche de révision en 20 min"]].forEach(function (r) {
          var jour = plusJours(fin, r[0]);
          if (jour >= l && jour <= dim && fin >= plusJours(debut, -r[0] - 6)) {
            taches.push({ id: "j" + r[0] + "-" + c.n, m: r[1], t: r[2] + " · " + nomCours(c) + " : " + r[3], lien: "cours/" + c.d + "/" });
          }
        });
      });

      // 5. QCM examen : examen blanc d'un CCP prêt, une semaine sur deux
      var ccpPrets = [1, 2, 3].filter(function (n) { return d(CCP_PRET[n]) <= dim; });
      if (stage) {
        var n = ccpPrets[rotationCcp++ % ccpPrets.length] || 1;
        taches.push({ id: "stage", m: 135, t: "🏢 Stage : 3 séances de 45 min : examen blanc du CCP " + n + " chronométré, « Revoir mes erreurs », fiches des 2 compétences les plus faibles", lien: "qcm-examen/" });
      } else if (ccpPrets.length && i % 2 === 1) {
        var c2 = ccpPrets[rotationCcp++ % ccpPrets.length];
        taches.push({ id: "blanc", m: 60, t: "📝 Examen blanc du CCP " + c2 + " chronométré, puis « Revoir mes erreurs » (objectif : 80 % par compétence)", lien: "qcm-examen/" });
      } else if (!ccpPrets.length && i % 2 === 1) {
        taches.push({ id: "entr", m: 20, t: "🎯 QCM examen : 2 entraînements par compétence sur les cours déjà vus", lien: "qcm-examen/" });
      }

      if (pause && !enCours.length) taches.unshift({ id: "pause", m: 60, t: "🎄 Pause des fêtes : repos ! Juste 2 petites séances de 30 min de fiches pour ne pas perdre le fil", lien: "revisions/" });

      var titre = stage ? "Stage en entreprise" : enCours.length ? enCours.map(function (c) { return c.n === "B" ? "Bonus M365" : "Cours " + c.n; }).join(" + ") : pause ? "Pause des fêtes" : "Révisions";
      semaines.push({ id: lIso, lundi: l, dimanche: dim, titre: titre, taches: taches });
    }
    return semaines;
  }

  /* ---------- affichage ---------- */
  function init() {
    var root = document.getElementById("tssr-planning");
    if (!root) return;

    function rendre() {
      var etat = lire();
      root.innerHTML = "";

      /* réglages modifiables */
      var form = el("form", "tssr-plan-reglages");
      function champ(label, type, valeur, attrs) {
        var lab = el("label", null, label + " ");
        var inp = el("input", "tssr-plan-input");
        inp.type = type; inp.value = valeur;
        Object.keys(attrs || {}).forEach(function (k) { inp.setAttribute(k, attrs[k]); });
        lab.appendChild(inp);
        form.appendChild(lab);
        return inp;
      }
      var fDebut = champ("Début des révisions", "date", etat.reglages.debut || iso(new Date()));
      var fExamen = champ("Date de l'examen", "date", etat.reglages.examen);
      var fHeures = champ("Temps disponible par semaine (heures)", "number", etat.reglages.heures, { min: 1, max: 40, step: 0.5 });
      var ok = el("button", "md-button md-button--primary", "Mettre à jour le planning");
      ok.type = "submit";
      form.appendChild(ok);
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var e = lire();
        e.reglages = { debut: fDebut.value, examen: fExamen.value || DEFAUT.examen, heures: Number(fHeures.value) || DEFAUT.heures };
        ecrire(e); rendre();
      });
      root.appendChild(form);
      root.appendChild(el("p", "tssr-plan-meta", "La date d'examen proposée est la fin du stage (28/05/2027) : remplace-la par ta vraie date dès que tu la connais."));

      var semaines = generer(etat.reglages);
      var dispo = etat.reglages.heures * 60;

      /* résumé */
      var total = 0, faits = 0, nb = 0;
      semaines.forEach(function (s) {
        tachesDe(s, etat).forEach(function (t) { total += t.m; nb++; if (etat.faits[s.id + "/" + t.id]) faits++; });
      });
      var resume = el("div", "tssr-plan-resume");
      [[String(semaines.length), "semaines jusqu'à l'examen"], [duree(total), "de révision au total"],
       [nb ? Math.round((faits / nb) * 100) + " %" : "-", "des étapes cochées (" + faits + " / " + nb + ")"]].forEach(function (x) {
        var b = el("div", "tssr-plan-stat");
        b.appendChild(el("strong", null, x[0])); b.appendChild(el("span", null, x[1]));
        resume.appendChild(b);
      });
      root.appendChild(resume);

      /* semaines */
      var cetteSemaine = iso(lundi(new Date()));
      var liste = el("ol", "tssr-plan-semaines");
      semaines.forEach(function (s, idx) {
        var taches = tachesDe(s, etat);
        var minutes = taches.reduce(function (a, t) { return a + t.m; }, 0);
        var li = el("li", "tssr-plan-semaine" + (s.id === cetteSemaine ? " is-maintenant" : "") + (s.lundi < lundi(new Date()) ? " is-passee" : ""));
        var tete = el("div", "tssr-plan-tete");
        tete.appendChild(el("span", "tssr-plan-num", "Étape " + (idx + 1)));
        tete.appendChild(el("strong", null, s.titre));
        tete.appendChild(el("span", "tssr-plan-dates", "du " + fr(s.lundi) + " au " + fr(s.dimanche)));
        var badge = el("span", "tssr-plan-duree" + (minutes > dispo ? " is-charge" : ""), "⏱️ " + duree(minutes));
        if (minutes > dispo) badge.title = "Plus que ton temps disponible (" + duree(dispo) + ") : décoche ou supprime une tâche";
        tete.appendChild(badge);
        if (s.id === cetteSemaine) tete.appendChild(el("span", "tssr-plan-badge", "▶ Cette semaine"));
        li.appendChild(tete);

        var ul = el("ul", "tssr-plan-taches");
        taches.forEach(function (t) {
          var cle = s.id + "/" + t.id;
          var tl = el("li", etat.faits[cle] ? "is-fait" : null);
          var lab = el("label");
          var cb = el("input"); cb.type = "checkbox"; cb.checked = !!etat.faits[cle];
          cb.addEventListener("change", function () {
            var e = lire();
            if (cb.checked) e.faits[cle] = true; else delete e.faits[cle];
            ecrire(e); rendre();
          });
          lab.appendChild(cb);
          lab.appendChild(el("span", null, t.t));
          tl.appendChild(lab);
          var droite = el("span", "tssr-plan-actions");
          droite.appendChild(el("span", "tssr-plan-m", duree(t.m)));
          if (t.lien) { var a = el("a", null, "Ouvrir"); a.href = url(t.lien); droite.appendChild(a); }
          var sup = el("button", "tssr-plan-suppr", "✕");
          sup.type = "button"; sup.title = "Supprimer cette tâche";
          sup.addEventListener("click", function () {
            var e = lire();
            if (t.perso) { e.ajouts[s.id] = (e.ajouts[s.id] || []).filter(function (x) { return x.id !== t.id; }); }
            else { e.masques[cle] = true; }
            delete e.faits[cle];
            ecrire(e); rendre();
          });
          droite.appendChild(sup);
          tl.appendChild(droite);
          ul.appendChild(tl);
        });
        if (!taches.length) ul.appendChild(el("li", "tssr-plan-vide", "Rien de prévu : ajoute une tâche si tu veux."));
        li.appendChild(ul);

        /* ajouter une tâche + note */
        var outils = el("details", "tssr-plan-outils");
        outils.appendChild(el("summary", null, "✏️ Modifier cette semaine"));
        var fa = el("form", "tssr-plan-ajout");
        var txt = el("input", "tssr-plan-input"); txt.placeholder = "Nouvelle tâche (ex. refaire le TP VLAN)"; txt.maxLength = 160;
        var min = el("input", "tssr-plan-input tssr-plan-min"); min.type = "number"; min.min = 5; min.max = 600; min.step = 5; min.value = 30; min.title = "Minutes";
        var add = el("button", "md-button", "Ajouter"); add.type = "submit";
        fa.appendChild(txt); fa.appendChild(min); fa.appendChild(el("span", "tssr-plan-meta", "min")); fa.appendChild(add);
        fa.addEventListener("submit", function (ev) {
          ev.preventDefault();
          if (!txt.value.trim()) return;
          var e = lire();
          (e.ajouts[s.id] = e.ajouts[s.id] || []).push({ id: "p" + Date.now().toString(36), t: "⭐ " + txt.value.trim(), m: Math.max(5, Number(min.value) || 30), perso: true });
          ecrire(e); rendre();
        });
        outils.appendChild(fa);
        var note = el("textarea", "tssr-plan-input tssr-plan-note");
        note.rows = 2; note.maxLength = 1000; note.placeholder = "Ma note pour cette semaine (ce qui bloque, ce qu'il faut revoir…)";
        note.value = etat.notes[s.id] || "";
        note.addEventListener("change", function () {
          var e = lire();
          if (note.value.trim()) e.notes[s.id] = note.value.trim(); else delete e.notes[s.id];
          ecrire(e);
        });
        outils.appendChild(note);
        if (Object.keys(etat.masques).some(function (k) { return k.indexOf(s.id + "/") === 0; })) {
          var rest = el("button", "md-button", "↺ Remettre les tâches supprimées");
          rest.type = "button";
          rest.addEventListener("click", function () {
            var e = lire();
            Object.keys(e.masques).forEach(function (k) { if (k.indexOf(s.id + "/") === 0) delete e.masques[k]; });
            ecrire(e); rendre();
          });
          outils.appendChild(rest);
        }
        if (etat.notes[s.id]) outils.open = true;
        li.appendChild(outils);
        liste.appendChild(li);
      });
      root.appendChild(liste);

      /* réinitialiser */
      var raz = el("button", "md-button tssr-plan-raz", "🗑️ Réinitialiser le planning");
      raz.type = "button";
      raz.addEventListener("click", function () {
        if (!confirm("Effacer tes réglages, cases cochées, tâches ajoutées et notes du planning ?")) return;
        try { localStorage.removeItem(PLAN_KEY); } catch (e) { /* rien */ }
        rendre();
      });
      root.appendChild(raz);

      var maintenant = root.querySelector(".is-maintenant");
      if (maintenant && !rendre.fait) { rendre.fait = true; }
    }

    function tachesDe(s, etat) {
      return s.taches.filter(function (t) { return !etat.masques[s.id + "/" + t.id]; })
        .concat((etat.ajouts[s.id] || []).map(function (t) { return { id: t.id, t: t.t, m: t.m, perso: true }; }));
    }

    rendre();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
