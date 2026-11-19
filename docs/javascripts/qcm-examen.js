/**
 * qcm-examen.js
 * ---------------------------------------------------------------------
 * Examen blanc « questionnaire professionnel » calé sur le référentiel
 * TSSR 2026 (RNCP 42463) : 3 CCP, 10 compétences, durées officielles
 * (30 min pour le CCP 1, 45 min pour les CCP 2 et 3), au moins une
 * question en anglais par épreuve.
 *
 * Les questions sont dans qcm-examen-banque.js. Ce script ne fait rien
 * si la page ne contient pas <div id="qcm-examen"></div>.
 *
 * PROFIL ET SUIVI (tout reste dans le navigateur, clé PROFIL_KEY) :
 *   - pseudo et date d'examen (facultatifs) ;
 *   - historique de chaque tentative : score, score par compétence,
 *     durée, commentaire automatique et note personnelle ;
 *   - questions ratées, à revoir jusqu'à ce qu'elles soient réussies ;
 *   - export / import JSON pour changer de navigateur.
 * ---------------------------------------------------------------------
 */

(function () {
  var COMPETENCES = {
    1: { titre: "Exploiter l'intelligence artificielle et encadrer son usage", lien: "../revisions/fiche-ia/",
         conseil: "Relis la fiche IA : les données à ne jamais envoyer (RGPD, secrets), la vérification des réponses et le cadre d'usage en entreprise." },
    2: { titre: "Assurer le déploiement des équipements numériques et accompagner à l'utilisation des outils collaboratifs", lien: "../cours/cours-02-systeme-client-microsoft/module-12-introduction-a-la-capture-et-au-deploiement-d-images/",
         conseil: "Revois le déploiement d'images (capture, Sysprep, déploiement réseau) et l'accompagnement aux outils collaboratifs." },
    3: { titre: "Apporter une assistance technique", lien: "../cours/cours-06-sensibilisation-itil-et-gestion-de-parc/",
         conseil: "Revois la méthode de diagnostic, la qualification et l'escalade des tickets (ITIL, GLPI) et la traçabilité." },
    4: { titre: "Exploiter un réseau IP", lien: "../cours/cours-01-bases-des-reseaux/",
         conseil: "Entraîne-toi sur l'adressage et les sous-réseaux IPv4/IPv6, les VLAN, le routage, le NAT et les commandes de diagnostic." },
    5: { titre: "Installer et assurer l'exploitation de serveurs Windows et Linux", lien: "../cours/cours-04-administration-d-une-distribution-gnu-linux/",
         conseil: "Revois AD, DNS, DHCP et GPO côté Windows ; services, paquets, droits et stockage côté Debian." },
    6: { titre: "Exploiter des serveurs dans une infrastructure virtualisée", lien: "../cours/cours-13-virtualisation-de-serveurs/",
         conseil: "Revois vSphere : réseau virtuel, datastores, snapshots (qui ne sont pas des sauvegardes) et gestion du datacenter." },
    7: { titre: "Gérer les accès et la sécurité dans un environnement hybride", lien: "../cours/cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl/",
         conseil: "Revois NTFS contre droits de partage, le moindre privilège, le MFA et la gestion hybride Active Directory + Entra ID." },
    8: { titre: "Optimiser des scripts à l'aide de l'intelligence artificielle", lien: "../cours/cours-10-initiation-au-scripting-bash/",
         conseil: "Revois les bases Bash et PowerShell (variables, boucles, fonctions, erreurs) et la relecture critique d'un script proposé par une IA." },
    9: { titre: "Assurer la continuité et la reprise de l'infrastructure", lien: "../cours/cours-15-sauvegarde-et-restauration/",
         conseil: "Revois les types de sauvegarde, la règle 3-2-1, RPO et RTO, les tests de restauration, le PCA et le PRA." },
    10: { titre: "Mettre à jour et superviser les éléments de l'infrastructure", lien: "../cours/cours-17-supervision/",
          conseil: "Revois la gestion des mises à jour, la supervision (SNMP, seuils, alertes) et la journalisation." },
  };

  var EPREUVES = {
    ccp1: { nom: "CCP 1 · Assurer le support aux utilisateurs", court: "CCP 1", comps: [1, 2, 3], minutes: 30, nb: 20 },
    ccp2: { nom: "CCP 2 · Exploiter les éléments de l'infrastructure", court: "CCP 2", comps: [4, 5, 6, 7], minutes: 45, nb: 30 },
    ccp3: { nom: "CCP 3 · Maintenir en conditions opérationnelles l'infrastructure", court: "CCP 3", comps: [8, 9, 10], minutes: 45, nb: 30 },
  };

  var STORE_KEY = "tssr-qcm-examen-meilleurs";
  var PROFIL_KEY = "tssr-qcm-examen-profil";
  var MAX_TENTATIVES = 300;

  /* ---------- outils ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function fmt(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }
  function dateFr(iso, avecHeure) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    var txt = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    if (avecHeure) txt += " à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return txt;
  }
  function pctDe(r) { return r && r.total ? Math.round((r.ok / r.total) * 100) : null; }
  function niveau(p) { return p == null ? "is-vide" : p >= 80 ? "is-bon" : p >= 50 ? "is-moyen" : "is-faible"; }
  function titreCle(cle) {
    if (EPREUVES[cle]) return EPREUVES[cle].court;
    if (cle === "erreurs") return "Révision des erreurs";
    return "Entraînement compétence " + cle.replace("comp", "");
  }

  /* ---------- stockage : meilleurs scores (ancien format, conservé) ---------- */
  function lireMeilleurs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function ecrireMeilleur(cle, pct) {
    try {
      var m = lireMeilleurs();
      if (m[cle] == null || pct > m[cle]) { m[cle] = pct; localStorage.setItem(STORE_KEY, JSON.stringify(m)); }
    } catch (e) { /* stockage indisponible : tant pis */ }
  }

  /* ---------- stockage : profil ---------- */
  function profilVide() {
    return { v: 1, nom: "", dateExamen: "", cree: new Date().toISOString(), tentatives: [], erreurs: {} };
  }
  function normaliser(p) {
    if (!p || typeof p !== "object") return null;
    var n = profilVide();
    n.nom = typeof p.nom === "string" ? p.nom.slice(0, 40) : "";
    n.dateExamen = typeof p.dateExamen === "string" ? p.dateExamen.slice(0, 10) : "";
    n.cree = typeof p.cree === "string" ? p.cree : n.cree;
    n.tentatives = Array.isArray(p.tentatives) ? p.tentatives.filter(function (t) {
      return t && typeof t.cle === "string" && typeof t.pct === "number" && t.comps && typeof t.comps === "object";
    }).slice(-MAX_TENTATIVES) : [];
    n.erreurs = p.erreurs && typeof p.erreurs === "object" && !Array.isArray(p.erreurs) ? p.erreurs : {};
    return n;
  }
  function lireProfil() {
    try {
      var brut = localStorage.getItem(PROFIL_KEY);
      return brut ? normaliser(JSON.parse(brut)) : null;
    } catch (e) { return null; }
  }
  function ecrireProfil(p) {
    try { localStorage.setItem(PROFIL_KEY, JSON.stringify(p)); return true; } catch (e) { return false; }
  }

  /* ---------- analyse de la progression ---------- */

  // Maîtrise d'une compétence : ses ~20 dernières questions (toutes tentatives confondues).
  // tendance = écart entre les ~10 plus récentes et les ~10 d'avant.
  function maitrise(profil, c) {
    var recent = { ok: 0, total: 0 }, ancien = { ok: 0, total: 0 }, global = { ok: 0, total: 0 };
    for (var i = profil.tentatives.length - 1; i >= 0; i--) {
      var r = profil.tentatives[i].comps[c];
      if (!r || !r.total) continue;
      if (global.total < 20) { global.ok += r.ok; global.total += r.total; }
      if (recent.total < 10) { recent.ok += r.ok; recent.total += r.total; }
      else if (ancien.total < 10) { ancien.ok += r.ok; ancien.total += r.total; }
      else if (global.total >= 20) break;
    }
    var p = pctDe(global), pr = pctDe(recent), pa = pctDe(ancien);
    return { pct: p, questions: global.total, tendance: pr != null && pa != null ? pr - pa : null };
  }

  function nbErreurs(profil, c) {
    return Object.keys(profil.erreurs).filter(function (k) { return c == null || profil.erreurs[k].c === c; }).length;
  }

  // Commentaire automatique écrit à la fin de chaque tentative.
  function commenter(profil, t, precedente, avecAnglais) {
    var lignes = [];
    if (precedente) {
      var d = t.pct - precedente.pct;
      lignes.push(d > 0 ? "📈 +" + d + " points depuis ta dernière tentative (" + precedente.pct + " % → " + t.pct + " %)."
        : d < 0 ? "📉 " + d + " points par rapport à ta dernière tentative (" + precedente.pct + " % → " + t.pct + " %)."
        : "➡️ Même score que ta dernière tentative (" + t.pct + " %).");
    } else {
      lignes.push("🆕 Premier passage sur " + titreCle(t.cle) + " : ce score sert de point de départ.");
    }

    var forts = [], faibles = [], progres = [];
    Object.keys(t.comps).forEach(function (c) {
      var p = pctDe(t.comps[c]);
      if (p >= 80) forts.push(c);
      else if (p < 50) faibles.push(c);
      if (precedente && precedente.comps[c]) {
        var avant = pctDe(precedente.comps[c]);
        if (p - avant >= 20) progres.push(c);
      }
    });
    if (forts.length) lignes.push("💪 Points forts : compétence" + (forts.length > 1 ? "s " : " ") + forts.join(", ") + ".");
    if (progres.length) lignes.push("🚀 Nette progression sur la compétence" + (progres.length > 1 ? "s " : " ") + progres.join(", ") + ".");
    if (faibles.length) lignes.push("🎯 À réviser en priorité : compétence" + (faibles.length > 1 ? "s " : " ") + faibles.join(", ") + ".");

    if (avecAnglais === false) lignes.push("🇬🇧 Question en anglais ratée : lis un peu de documentation en anglais chaque semaine (pages man, Microsoft Learn).");

    if (t.tempsEcoule) lignes.push("⏰ Temps écoulé : entraîne-toi à répondre plus vite, puis reviens sur les questions difficiles.");
    else if (t.minutes && t.duree && t.duree < t.minutes * 60 * 0.4 && t.pct < 70)
      lignes.push("⏱️ Tu as rendu ta copie en " + Math.round(t.duree / 60) + " min sur " + t.minutes + " : prends le temps de relire.");

    var reste = nbErreurs(profil);
    if (reste) lignes.push("🔁 " + reste + " question" + (reste > 1 ? "s" : "") + " ratée" + (reste > 1 ? "s" : "") + " à revoir dans « Revoir mes erreurs ».");
    return lignes.join(" ");
  }

  /* ---------- tirage des questions ---------- */
  function preparer(q) {
    var ordre = shuffle(q.o.map(function (_, i) { return i; }));
    return {
      c: q.c, en: !!q.en, q: q.q, e: q.e,
      o: ordre.map(function (i) { return q.o[i]; }),
      a: ordre.indexOf(q.a),
    };
  }

  function tirer(banque, comps, nb) {
    var parComp = {};
    comps.forEach(function (c) {
      parComp[c] = shuffle(banque.filter(function (q) { return q.c === c; }));
    });
    // quotas équilibrés entre compétences
    var quotas = {}, base = Math.floor(nb / comps.length), reste = nb % comps.length;
    shuffle(comps).forEach(function (c, i) { quotas[c] = Math.min(base + (i < reste ? 1 : 0), parComp[c].length); });

    var choix = [];
    comps.forEach(function (c) { choix = choix.concat(parComp[c].slice(0, quotas[c])); });

    // au moins une question en anglais, comme à l'examen
    if (!choix.some(function (q) { return q.en; })) {
      var c = comps[Math.floor(Math.random() * comps.length)];
      var en = parComp[c].slice(quotas[c]).filter(function (q) { return q.en; })[0];
      if (en) {
        var idx = choix.findIndex(function (q) { return q.c === c && !q.en; });
        if (idx !== -1) choix[idx] = en;
      }
    }

    // ordre aléatoire des questions, puis des propositions
    return shuffle(choix).map(preparer);
  }

  function tirerErreurs(banque, profil, nb) {
    var choix = banque.filter(function (q) { return profil.erreurs[q.q]; });
    return shuffle(choix).slice(0, nb).map(preparer);
  }

  /* ---------- petit graphique SVG de progression ---------- */
  function courbe(scores) {
    var NS = "http://www.w3.org/2000/svg";
    var W = 240, H = 70, pad = 6;
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("class", "qcm-courbe");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "Évolution des scores : " + scores.map(function (s) { return s.pct + " %"; }).join(", "));

    function y(p) { return H - pad - (p / 100) * (H - 2 * pad); }
    function x(i) { return scores.length === 1 ? W / 2 : pad + (i * (W - 2 * pad)) / (scores.length - 1); }

    var seuil = document.createElementNS(NS, "line");
    seuil.setAttribute("x1", pad); seuil.setAttribute("x2", W - pad);
    seuil.setAttribute("y1", y(80)); seuil.setAttribute("y2", y(80));
    seuil.setAttribute("class", "qcm-courbe-seuil");
    svg.appendChild(seuil);

    if (scores.length > 1) {
      var ligne = document.createElementNS(NS, "polyline");
      ligne.setAttribute("points", scores.map(function (s, i) { return x(i) + "," + y(s.pct); }).join(" "));
      ligne.setAttribute("class", "qcm-courbe-ligne");
      svg.appendChild(ligne);
    }
    scores.forEach(function (s, i) {
      var pt = document.createElementNS(NS, "circle");
      pt.setAttribute("cx", x(i)); pt.setAttribute("cy", y(s.pct)); pt.setAttribute("r", 3.5);
      pt.setAttribute("class", "qcm-courbe-point " + niveau(s.pct));
      var tt = document.createElementNS(NS, "title");
      tt.textContent = dateFr(s.date, true) + " : " + s.pct + " %";
      pt.appendChild(tt);
      svg.appendChild(pt);
    });
    return svg;
  }

  /* ---------- écrans ---------- */
  function init() {
    var root = document.getElementById("qcm-examen");
    var banque = window.TSSR_QCM_BANQUE;
    if (!root || !banque) return;

    var timerId = null;

    function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

    /* ---- carte profil ---- */
    function carteProfil(profil, ouvrirSuivi) {
      var carte = el("div", "qcm-carte qcm-profil");

      if (!profil) {
        carte.appendChild(el("h3", null, "👤 Crée ton profil de suivi"));
        carte.appendChild(el("p", "qcm-meta", "Garde l'historique de tes épreuves, ta progression par compétence, des commentaires sur chaque tentative et la liste de ce qu'il te reste à réviser. Tout reste dans ce navigateur."));
        carte.appendChild(formProfil(null, function () { accueil(true); }));
        return carte;
      }

      var entete = el("div", "qcm-profil-entete");
      entete.appendChild(el("h3", null, "👤 " + (profil.nom || "Mon profil")));
      if (profil.dateExamen) {
        var j = Math.ceil((new Date(profil.dateExamen + "T00:00:00") - new Date().setHours(0, 0, 0, 0)) / 86400000);
        entete.appendChild(el("span", "qcm-badge", j > 0 ? "📅 J-" + j + " avant l'examen" : j === 0 ? "📅 C'est le jour J !" : "📅 Examen passé le " + dateFr(profil.dateExamen)));
      }
      carte.appendChild(entete);

      var ccp = profil.tentatives.filter(function (t) { return EPREUVES[t.cle]; });
      var derniers = ccp.slice(-5);
      var moyenne = derniers.length ? Math.round(derniers.reduce(function (s, t) { return s + t.pct; }, 0) / derniers.length) : null;
      var stats = el("div", "qcm-stats");
      [
        [String(profil.tentatives.length), "tentative" + (profil.tentatives.length > 1 ? "s" : "")],
        [moyenne == null ? "-" : moyenne + " %", "moyenne des 5 derniers examens blancs"],
        [String(nbErreurs(profil)), "question" + (nbErreurs(profil) > 1 ? "s" : "") + " à revoir"],
      ].forEach(function (s) {
        var b = el("div", "qcm-stat");
        b.appendChild(el("strong", null, s[0]));
        b.appendChild(el("span", null, s[1]));
        stats.appendChild(b);
      });
      carte.appendChild(stats);

      var actions = el("div", "qcm-actions");
      var btnSuivi = el("button", "md-button md-button--primary", "📊 Voir mon suivi");
      btnSuivi.addEventListener("click", ouvrirSuivi);
      actions.appendChild(btnSuivi);
      var n = nbErreurs(profil);
      if (n) {
        var btnErr = el("button", "md-button", "🔁 Revoir mes erreurs (" + n + ")");
        btnErr.addEventListener("click", function () { lancerErreurs(profil); });
        actions.appendChild(btnErr);
      }
      carte.appendChild(actions);
      return carte;
    }

    function formProfil(profil, apres) {
      var form = el("form", "qcm-form-profil");
      var lNom = el("label", null, "Pseudo ");
      var nom = el("input", "qcm-input");
      nom.type = "text"; nom.maxLength = 40; nom.placeholder = "ex. Alex"; nom.value = profil ? profil.nom : "";
      lNom.appendChild(nom);
      var lDate = el("label", null, "Date de ton examen (facultatif) ");
      var date = el("input", "qcm-input");
      date.type = "date"; date.value = profil ? profil.dateExamen : "";
      lDate.appendChild(date);
      var ok = el("button", "md-button md-button--primary", profil ? "Enregistrer" : "Créer mon profil");
      ok.type = "submit";
      form.appendChild(lNom);
      form.appendChild(lDate);
      form.appendChild(ok);
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var p = profil || profilVide();
        p.nom = nom.value.trim().slice(0, 40);
        p.dateExamen = date.value || "";
        if (!ecrireProfil(p)) alert("Impossible d'enregistrer : le stockage du navigateur est bloqué (navigation privée ?).");
        apres();
      });
      return form;
    }

    /* ---- accueil ---- */
    function accueil(afficherSuivi) {
      stopTimer();
      root.innerHTML = "";
      var meilleurs = lireMeilleurs();
      var profil = lireProfil();

      var zoneSuivi = el("div", "qcm-suivi-zone");
      function ouvrirSuivi() {
        zoneSuivi.innerHTML = "";
        zoneSuivi.appendChild(suivi(lireProfil()));
        zoneSuivi.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      root.appendChild(carteProfil(profil, ouvrirSuivi));

      var grille = el("div", "qcm-grille");
      Object.keys(EPREUVES).forEach(function (cle) {
        var ep = EPREUVES[cle];
        var carte = el("div", "qcm-carte");
        carte.appendChild(el("h3", null, ep.nom));
        var ul = el("ul");
        ep.comps.forEach(function (c) { ul.appendChild(el("li", null, c + ". " + COMPETENCES[c].titre)); });
        carte.appendChild(ul);
        carte.appendChild(el("p", "qcm-meta", "⏱️ " + ep.minutes + " min · " + ep.nb + " questions · dont au moins 1 en anglais"));
        if (meilleurs[cle] != null) carte.appendChild(el("p", "qcm-meilleur", "🏅 Ton meilleur score : " + meilleurs[cle] + " %"));
        if (profil) {
          var der = profil.tentatives.filter(function (t) { return t.cle === cle; }).pop();
          if (der) carte.appendChild(el("p", "qcm-meta", "Dernier passage : " + der.pct + " % le " + dateFr(der.date)));
        }
        var btn = el("button", "md-button md-button--primary", "Commencer l'épreuve");
        btn.addEventListener("click", function () {
          lancer({ cle: cle, titre: ep.nom, questions: tirer(banque, ep.comps, ep.nb), minutes: chrono.checked ? ep.minutes : 0 });
        });
        carte.appendChild(btn);
        grille.appendChild(carte);
      });

      // entraînement ciblé sur une compétence
      var carteEntr = el("div", "qcm-carte qcm-carte-entrainement");
      carteEntr.appendChild(el("h3", null, "🎯 Entraînement par compétence"));
      carteEntr.appendChild(el("p", null, "10 questions sur une seule compétence, sans chrono, pour cibler tes points faibles."));
      var select = el("select", "qcm-select");
      Object.keys(COMPETENCES).forEach(function (c) {
        var opt = el("option", null, "Compétence " + c + " · " + COMPETENCES[c].titre);
        opt.value = c;
        select.appendChild(opt);
      });
      carteEntr.appendChild(select);
      var btnE = el("button", "md-button", "S'entraîner");
      btnE.addEventListener("click", function () { lancerCompetence(Number(select.value)); });
      carteEntr.appendChild(btnE);

      var options = el("label", "qcm-option-chrono");
      var chrono = el("input");
      chrono.type = "checkbox";
      chrono.checked = true;
      options.appendChild(chrono);
      options.appendChild(document.createTextNode(" Chronomètre aux durées officielles (copie rendue automatiquement à la fin du temps)"));

      root.appendChild(options);
      root.appendChild(grille);
      root.appendChild(carteEntr);
      root.appendChild(zoneSuivi);

      if (afficherSuivi && profil) ouvrirSuivi();
    }

    function lancerCompetence(c) {
      lancer({ cle: "comp" + c, titre: "Entraînement · compétence " + c, questions: tirer(banque, [c], 10), minutes: 0 });
    }
    function lancerErreurs(profil) {
      var qs = tirerErreurs(banque, profil, 20);
      if (!qs.length) { alert("Aucune question à revoir : bravo !"); return; }
      lancer({ cle: "erreurs", titre: "🔁 Révision de mes erreurs", questions: qs, minutes: 0 });
    }

    /* ---- tableau de bord du suivi ---- */
    function suivi(profil) {
      var box = el("div", "qcm-suivi");
      if (!profil) return box;

      var tete = el("div", "qcm-suivi-tete");
      tete.appendChild(el("h2", null, "📊 Suivi de " + (profil.nom || "mon profil")));
      var fermer = el("button", "md-button", "Fermer");
      fermer.addEventListener("click", function () { box.remove(); root.scrollIntoView({ behavior: "smooth" }); });
      tete.appendChild(fermer);
      box.appendChild(tete);

      if (!profil.tentatives.length) {
        box.appendChild(el("p", null, "Aucune tentative pour l'instant. Lance une épreuve ou un entraînement : ton suivi se remplira automatiquement."));
      } else {
        /* 1. bilan global */
        var ms = Object.keys(COMPETENCES).map(function (c) { return { c: Number(c), m: maitrise(profil, Number(c)) }; });
        var evaluees = ms.filter(function (x) { return x.m.pct != null; });
        var aReviser = evaluees.filter(function (x) { return x.m.pct < 80; }).sort(function (a, b) { return a.m.pct - b.m.pct; });
        var jamais = ms.filter(function (x) { return x.m.pct == null; });

        var bilan = el("div", "qcm-bilan");
        bilan.appendChild(el("h3", null, "🧭 Où tu en es"));
        var phrases = [];
        var maitrisees = evaluees.filter(function (x) { return x.m.pct >= 80; }).length;
        phrases.push(maitrisees + " compétence" + (maitrisees > 1 ? "s" : "") + " maîtrisée" + (maitrisees > 1 ? "s" : "") + " sur 10.");
        if (aReviser.length) phrases.push("Priorité : la compétence " + aReviser[0].c + " (" + aReviser[0].m.pct + " %).");
        if (jamais.length) phrases.push("Pas encore évaluée" + (jamais.length > 1 ? "s" : "") + " : compétence" + (jamais.length > 1 ? "s " : " ") + jamais.map(function (x) { return x.c; }).join(", ") + ".");
        if (!aReviser.length && !jamais.length) phrases.push("Toutes tes compétences sont au-dessus de 80 % : continue les examens blancs chronométrés pour rester au niveau.");
        bilan.appendChild(el("p", null, phrases.join(" ")));
        box.appendChild(bilan);

        /* 2. progression par CCP */
        box.appendChild(el("h3", null, "📈 Progression aux examens blancs"));
        var grille = el("div", "qcm-grille");
        Object.keys(EPREUVES).forEach(function (cle) {
          var ts = profil.tentatives.filter(function (t) { return t.cle === cle; });
          var carte = el("div", "qcm-carte qcm-carte-progression");
          carte.appendChild(el("h4", null, EPREUVES[cle].court));
          if (!ts.length) {
            carte.appendChild(el("p", "qcm-meta", "Pas encore passé."));
          } else {
            var der = ts[ts.length - 1], avant = ts[ts.length - 2];
            var ligne = el("p", "qcm-progression-score");
            ligne.appendChild(el("strong", null, der.pct + " %"));
            if (avant) {
              var d = der.pct - avant.pct;
              ligne.appendChild(el("span", "qcm-delta " + (d > 0 ? "is-plus" : d < 0 ? "is-moins" : ""), (d > 0 ? "▲ +" : d < 0 ? "▼ " : "= ") + d + " pts"));
            }
            carte.appendChild(ligne);
            carte.appendChild(courbe(ts.slice(-10)));
            var best = Math.max.apply(null, ts.map(function (t) { return t.pct; }));
            carte.appendChild(el("p", "qcm-meta", ts.length + " passage" + (ts.length > 1 ? "s" : "") + " · meilleur : " + best + " % · ligne pointillée : 80 %"));
          }
          grille.appendChild(carte);
        });
        box.appendChild(grille);

        /* 3. maîtrise par compétence */
        box.appendChild(el("h3", null, "🧩 Maîtrise par compétence"));
        box.appendChild(el("p", "qcm-meta", "Calculée sur tes 20 dernières questions de chaque compétence (examens blancs et entraînements)."));
        var tableau = el("div", "qcm-comps");
        ms.forEach(function (x) {
          var ligne = el("div", "qcm-comp " + niveau(x.m.pct));
          var lien = el("a", null, "Compétence " + x.c + " · " + COMPETENCES[x.c].titre);
          lien.href = COMPETENCES[x.c].lien;
          ligne.appendChild(lien);
          var jauge = el("div", "qcm-jauge");
          var rempli = el("span");
          rempli.style.width = (x.m.pct || 0) + "%";
          jauge.appendChild(rempli);
          ligne.appendChild(jauge);
          var t = x.m.tendance;
          var txt = x.m.pct == null ? "-" : x.m.pct + " %" + (t == null ? "" : t >= 10 ? " ▲" : t <= -10 ? " ▼" : "");
          var sc = el("span", "qcm-comp-score", txt);
          if (t != null) sc.title = "Tendance récente : " + (t > 0 ? "+" : "") + t + " pts";
          ligne.appendChild(sc);
          tableau.appendChild(ligne);
        });
        box.appendChild(tableau);

        /* 4. ce qu'il faut réviser */
        box.appendChild(el("h3", null, "🎯 Ce qu'il faut réviser"));
        var liste = aReviser.concat(jamais);
        if (!liste.length) {
          box.appendChild(el("p", null, "Rien en priorité. Refais un examen blanc complet de temps en temps pour vérifier que c'est acquis."));
        } else {
          var ol = el("ol", "qcm-a-reviser");
          liste.forEach(function (x) {
            var li = el("li", niveau(x.m.pct));
            var h = el("p", "qcm-a-reviser-titre");
            h.appendChild(el("strong", null, "Compétence " + x.c + " · " + COMPETENCES[x.c].titre));
            h.appendChild(el("span", "qcm-badge", x.m.pct == null ? "non évaluée" : x.m.pct < 50 ? x.m.pct + " % · priorité" : x.m.pct + " % · à consolider"));
            li.appendChild(h);
            li.appendChild(el("p", null, COMPETENCES[x.c].conseil));
            var nErr = nbErreurs(profil, x.c);
            if (nErr) li.appendChild(el("p", "qcm-meta", "🔁 " + nErr + " question" + (nErr > 1 ? "s" : "") + " ratée" + (nErr > 1 ? "s" : "") + " sur cette compétence."));
            var acts = el("div", "qcm-actions");
            var a = el("a", "md-button", "📖 Réviser le cours");
            a.href = COMPETENCES[x.c].lien;
            var b = el("button", "md-button md-button--primary", "🎯 S'entraîner (10 questions)");
            b.addEventListener("click", function () { lancerCompetence(x.c); });
            acts.appendChild(a);
            acts.appendChild(b);
            li.appendChild(acts);
            ol.appendChild(li);
          });
          box.appendChild(ol);
        }

        /* 5. journal des tentatives avec commentaires */
        box.appendChild(el("h3", null, "📝 Journal et commentaires"));
        box.appendChild(el("p", "qcm-meta", "Le commentaire automatique résume chaque tentative. Ajoute ta propre note (ce qui t'a bloqué, ce que tu dois relire…) : elle est enregistrée dès que tu quittes le champ."));
        var journal = el("div", "qcm-journal");
        var aAfficher = profil.tentatives.slice().reverse();
        var LIMITE = 15;
        function rendreJournal(n) {
          journal.innerHTML = "";
          aAfficher.slice(0, n).forEach(function (t) { journal.appendChild(entreeJournal(t)); });
          if (aAfficher.length > n) {
            var plus = el("button", "md-button", "Afficher les " + (aAfficher.length - n) + " tentatives plus anciennes");
            plus.addEventListener("click", function () { rendreJournal(aAfficher.length); });
            journal.appendChild(plus);
          }
        }
        rendreJournal(LIMITE);
        box.appendChild(journal);
      }

      /* 6. profil : modifier, sauvegarder, réinitialiser */
      var details = el("details", "qcm-reglages");
      details.appendChild(el("summary", null, "⚙️ Profil et sauvegarde"));
      details.appendChild(formProfil(profil, function () { accueil(true); }));
      details.appendChild(el("p", "qcm-meta", "Ton suivi est stocké uniquement dans ce navigateur. Exporte-le pour le garder ou le transférer sur un autre appareil."));
      var acts = el("div", "qcm-actions");
      var exp = el("button", "md-button", "⬇️ Exporter (JSON)");
      exp.addEventListener("click", function () {
        var blob = new Blob([JSON.stringify(lireProfil(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "suivi-qcm-tssr-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      });
      var fichier = el("input");
      fichier.type = "file"; fichier.accept = "application/json,.json"; fichier.hidden = true;
      fichier.addEventListener("change", function () {
        var f = fichier.files[0];
        if (!f) return;
        var r = new FileReader();
        r.onload = function () {
          var p = null;
          try { p = normaliser(JSON.parse(r.result)); } catch (e) { p = null; }
          if (!p) { alert("Ce fichier n'est pas un suivi QCM valide."); return; }
          if (!confirm("Remplacer ton suivi actuel par celui du fichier (" + p.tentatives.length + " tentatives) ?")) return;
          ecrireProfil(p);
          accueil(true);
        };
        r.readAsText(f);
      });
      var imp = el("button", "md-button", "⬆️ Importer");
      imp.addEventListener("click", function () { fichier.click(); });
      var raz = el("button", "md-button qcm-danger", "🗑️ Réinitialiser le suivi");
      raz.addEventListener("click", function () {
        if (!confirm("Effacer tout ton historique, tes notes et tes erreurs à revoir ? Exporte-le avant si tu veux le garder.")) return;
        try { localStorage.removeItem(PROFIL_KEY); } catch (e) { /* rien */ }
        accueil(false);
      });
      acts.appendChild(exp); acts.appendChild(imp); acts.appendChild(fichier); acts.appendChild(raz);
      details.appendChild(acts);
      box.appendChild(details);

      return box;
    }

    function zoneNote(t) {
      var wrap = el("label", "qcm-note");
      wrap.appendChild(el("span", null, "✍️ Ma note"));
      var ta = el("textarea", "qcm-input");
      ta.rows = 2; ta.maxLength = 1000;
      ta.placeholder = "Ex. : confondu RPO et RTO, relire le module 1 du cours 15";
      ta.value = t.note || "";
      var etat = el("span", "qcm-note-etat");
      ta.addEventListener("change", function () {
        var p = lireProfil();
        if (!p) return;
        var cible = p.tentatives.filter(function (x) { return x.id === t.id; })[0];
        if (!cible) return;
        cible.note = ta.value.trim();
        t.note = cible.note;
        etat.textContent = ecrireProfil(p) ? "✔ Enregistrée" : "Impossible d'enregistrer";
      });
      wrap.appendChild(ta);
      wrap.appendChild(etat);
      return wrap;
    }

    function entreeJournal(t) {
      var e = el("div", "qcm-entree " + niveau(t.pct));
      var tete = el("div", "qcm-entree-tete");
      tete.appendChild(el("strong", null, titreCle(t.cle)));
      tete.appendChild(el("span", "qcm-entree-score", t.score + " / " + t.total + " · " + t.pct + " %"));
      tete.appendChild(el("span", "qcm-meta", dateFr(t.date, true) + (t.duree ? " · " + Math.max(1, Math.round(t.duree / 60)) + " min" : "")));
      e.appendChild(tete);
      if (t.commentaire) e.appendChild(el("p", "qcm-commentaire", t.commentaire));
      e.appendChild(zoneNote(t));
      return e;
    }

    /* ---- passage d'une épreuve ---- */
    function lancer(examen) {
      stopTimer();
      root.innerHTML = "";
      var reponses = new Array(examen.questions.length).fill(null);
      var nom = "qcm-" + Date.now();
      var debut = Date.now();

      var barre = el("div", "qcm-barre");
      var titre = el("strong", null, examen.titre);
      var progression = el("span", "qcm-progression");
      var temps = el("span", "qcm-temps");
      barre.appendChild(titre);
      barre.appendChild(progression);
      if (examen.minutes) barre.appendChild(temps);
      root.appendChild(barre);

      function majProgression() {
        var n = reponses.filter(function (r) { return r !== null; }).length;
        progression.textContent = n + " / " + reponses.length + " répondues";
      }
      majProgression();

      var wrap = el("div", "tssr-quiz qcm-copie");
      var blocs = [];
      examen.questions.forEach(function (q, i) {
        var bloc = el("div", "tssr-quiz-question");
        var tags = el("div", "qcm-tags");
        tags.appendChild(el("span", "qcm-tag", "Compétence " + q.c));
        if (q.en) tags.appendChild(el("span", "qcm-tag qcm-tag-en", "🇬🇧 English"));
        bloc.appendChild(tags);
        var t = el("p", "tssr-q-title", (i + 1) + ". " + q.q);
        if (q.en) t.lang = "en";
        bloc.appendChild(t);
        var opts = el("div", "tssr-quiz-options");
        q.o.forEach(function (txt, j) {
          var label = el("label");
          var input = el("input");
          input.type = "radio";
          input.name = nom + "-q" + i;
          input.value = j;
          input.addEventListener("change", function () { reponses[i] = j; majProgression(); });
          label.appendChild(input);
          label.appendChild(document.createTextNode(txt));
          opts.appendChild(label);
        });
        bloc.appendChild(opts);
        wrap.appendChild(bloc);
        blocs.push(bloc);
      });

      var actions = el("div", "qcm-actions");
      var rendre = el("button", "md-button md-button--primary tssr-quiz-submit", "Rendre ma copie");
      var abandon = el("button", "md-button tssr-quiz-submit", "Abandonner");
      actions.appendChild(rendre);
      actions.appendChild(abandon);
      wrap.appendChild(actions);
      root.appendChild(wrap);
      root.scrollIntoView({ behavior: "smooth", block: "start" });

      var fin = examen.minutes ? Date.now() + examen.minutes * 60000 : 0;
      if (fin) {
        var tick = function () {
          var restant = Math.max(0, Math.round((fin - Date.now()) / 1000));
          temps.textContent = "⏱️ " + fmt(restant);
          temps.classList.toggle("qcm-temps-urgent", restant <= 300);
          if (restant === 0) { stopTimer(); corriger(true); }
        };
        tick();
        timerId = setInterval(tick, 1000);
      }

      abandon.addEventListener("click", function () {
        if (confirm("Abandonner l'épreuve ? Tes réponses seront perdues.")) accueil();
      });

      rendre.addEventListener("click", function () {
        var vides = reponses.filter(function (r) { return r === null; }).length;
        if (vides && !confirm(vides + " question(s) sans réponse. Rendre ta copie quand même ?")) return;
        corriger(false);
      });

      function corriger(tempsEcoule) {
        stopTimer();
        var score = 0, parComp = {}, anglaisOk = null, ratees = [], reussies = [];
        examen.questions.forEach(function (q, i) {
          var ok = reponses[i] === q.a;
          if (ok) { score++; reussies.push(q); } else ratees.push(q);
          if (q.en) anglaisOk = anglaisOk === false ? false : ok;
          parComp[q.c] = parComp[q.c] || { ok: 0, total: 0 };
          parComp[q.c].total++;
          if (ok) parComp[q.c].ok++;

          var labels = blocs[i].querySelectorAll(".tssr-quiz-options label");
          labels.forEach(function (label, j) {
            label.querySelector("input").disabled = true;
            if (j === q.a) label.classList.add("correct");
            else if (j === reponses[i]) label.classList.add("incorrect");
          });
          var expl = el("p", "qcm-explication " + (ok ? "qcm-ok" : "qcm-ko"),
            (ok ? "✅ " : reponses[i] === null ? "⚪ Sans réponse. " : "❌ ") + q.e);
          blocs[i].appendChild(expl);
        });

        var pct = Math.round((score / examen.questions.length) * 100);
        ecrireMeilleur(examen.cle, pct);
        actions.remove();
        temps.textContent = tempsEcoule ? "⏱️ Temps écoulé" : "";
        progression.textContent = "Corrigé";

        // enregistrement dans le profil (créé au besoin, sans pseudo)
        var profil = lireProfil() || profilVide();
        var precedente = profil.tentatives.filter(function (t) { return t.cle === examen.cle; }).pop() || null;
        var maintenant = new Date().toISOString();
        reussies.forEach(function (q) { delete profil.erreurs[q.q]; });
        ratees.forEach(function (q) {
          var prev = profil.erreurs[q.q];
          profil.erreurs[q.q] = { c: q.c, fois: (prev ? prev.fois : 0) + 1, derniere: maintenant };
        });
        var tentative = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          date: maintenant, cle: examen.cle, score: score, total: examen.questions.length, pct: pct,
          duree: Math.round((Date.now() - debut) / 1000), minutes: examen.minutes || 0,
          tempsEcoule: !!tempsEcoule, comps: parComp, note: "",
        };
        tentative.commentaire = commenter(profil, tentative, precedente, anglaisOk);
        profil.tentatives.push(tentative);
        if (profil.tentatives.length > MAX_TENTATIVES) profil.tentatives = profil.tentatives.slice(-MAX_TENTATIVES);
        var enregistre = ecrireProfil(profil);

        var res = el("div", "qcm-resultat");
        if (tempsEcoule) res.appendChild(el("p", "qcm-alerte", "⏰ Temps écoulé : ta copie a été rendue automatiquement."));
        res.appendChild(el("p", "qcm-score", score + " / " + examen.questions.length + " · " + pct + " %"));
        res.appendChild(el("p", null, pct >= 80 ? "Excellent, tu maîtrises ce bloc 💪" :
          pct >= 60 ? "Bonne base : revois les compétences en orange ou rouge." :
          "Il faut encore réviser : commence par les compétences en rouge."));

        var tableau = el("div", "qcm-comps");
        Object.keys(parComp).sort(function (a, b) { return a - b; }).forEach(function (c) {
          var r = parComp[c], p = pctDe(r);
          var ligne = el("div", "qcm-comp " + niveau(p));
          var lien = el("a", null, "Compétence " + c + " · " + COMPETENCES[c].titre);
          lien.href = COMPETENCES[c].lien;
          ligne.appendChild(lien);
          var jauge = el("div", "qcm-jauge");
          var rempli = el("span");
          rempli.style.width = p + "%";
          jauge.appendChild(rempli);
          ligne.appendChild(jauge);
          ligne.appendChild(el("span", "qcm-comp-score", r.ok + " / " + r.total));
          tableau.appendChild(ligne);
        });
        res.appendChild(tableau);

        if (enregistre) {
          var com = el("div", "qcm-entree " + niveau(pct));
          com.appendChild(el("strong", null, "💬 Commentaire de suivi"));
          com.appendChild(el("p", "qcm-commentaire", tentative.commentaire));
          com.appendChild(zoneNote(tentative));
          res.appendChild(com);
        } else {
          res.appendChild(el("p", "qcm-meta", "Le suivi n'a pas pu être enregistré : le stockage du navigateur est bloqué."));
        }

        var boutons = el("div", "qcm-actions");
        var refaire = el("button", "md-button md-button--primary", examen.cle === "erreurs" ? "Revoir les erreurs restantes" : "Nouveau tirage");
        refaire.addEventListener("click", function () {
          if (examen.cle === "erreurs") { lancerErreurs(lireProfil() || profilVide()); return; }
          var ep = EPREUVES[examen.cle];
          var comps = ep ? ep.comps : [Number(examen.cle.replace("comp", ""))];
          lancer({ cle: examen.cle, titre: examen.titre, questions: tirer(banque, comps, examen.questions.length), minutes: examen.minutes });
        });
        var voirSuivi = el("button", "md-button", "📊 Voir mon suivi");
        voirSuivi.addEventListener("click", function () { accueil(true); });
        var retour = el("button", "md-button", "Choisir une autre épreuve");
        retour.addEventListener("click", function () { accueil(); });
        boutons.appendChild(refaire);
        if (enregistre) boutons.appendChild(voirSuivi);
        boutons.appendChild(retour);
        res.appendChild(boutons);
        res.appendChild(el("p", "qcm-meta", "La correction détaillée de chaque question est affichée ci-dessous."));

        root.insertBefore(res, wrap);
        res.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    accueil();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
