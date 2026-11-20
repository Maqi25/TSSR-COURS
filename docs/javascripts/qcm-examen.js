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
 * BASE DE PROFILS (tout reste dans le navigateur, clé BASE_KEY) :
 *   - plusieurs profils (ex. « Ana », « Léo »), un profil actif à la fois ;
 *   - pour chaque profil : pseudo, date d'examen (facultative),
 *     historique de chaque tentative (score, score par compétence, durée,
 *     commentaire automatique, note personnelle) et questions ratées ;
 *   - export / import JSON d'un profil ou de toute la base.
 * L'ancien profil unique (clé PROFIL_KEY) est repris automatiquement.
 *
 * Deux pages utilisent ce script :
 *   <div id="qcm-examen">          → les épreuves (qcm-examen/)
 *   <div id="qcm-tableau-de-bord"> → le tableau de bord des profils
 * ---------------------------------------------------------------------
 */

(function () {
  var COMPETENCES = {
    1: { titre: "Exploiter l'intelligence artificielle et encadrer son usage", lien: "revisions/fiche-ia/",
         conseil: "Relis la fiche IA : les données à ne jamais envoyer (RGPD, secrets), la vérification des réponses et le cadre d'usage en entreprise." },
    2: { titre: "Assurer le déploiement des équipements numériques et accompagner à l'utilisation des outils collaboratifs", lien: "cours/cours-02-systeme-client-microsoft/module-12-introduction-a-la-capture-et-au-deploiement-d-images/",
         conseil: "Revois le déploiement d'images (capture, Sysprep, déploiement réseau) et l'accompagnement aux outils collaboratifs." },
    3: { titre: "Apporter une assistance technique", lien: "cours/cours-06-sensibilisation-itil-et-gestion-de-parc/",
         conseil: "Revois la méthode de diagnostic, la qualification et l'escalade des tickets (ITIL, GLPI) et la traçabilité." },
    4: { titre: "Exploiter un réseau IP", lien: "cours/cours-01-bases-des-reseaux/",
         conseil: "Entraîne-toi sur l'adressage et les sous-réseaux IPv4/IPv6, les VLAN, le routage, le NAT et les commandes de diagnostic." },
    5: { titre: "Installer et assurer l'exploitation de serveurs Windows et Linux", lien: "cours/cours-04-administration-d-une-distribution-gnu-linux/",
         conseil: "Revois AD, DNS, DHCP et GPO côté Windows ; services, paquets, droits et stockage côté Debian." },
    6: { titre: "Exploiter des serveurs dans une infrastructure virtualisée", lien: "cours/cours-13-virtualisation-de-serveurs/",
         conseil: "Revois vSphere : réseau virtuel, datastores, snapshots (qui ne sont pas des sauvegardes) et gestion du datacenter." },
    7: { titre: "Gérer les accès et la sécurité dans un environnement hybride", lien: "cours/cours-16-reseau-et-securite/",
         conseil: "Revois NTFS contre droits de partage, le moindre privilège, le MFA et la gestion hybride Active Directory + Entra ID." },
    8: { titre: "Optimiser des scripts à l'aide de l'intelligence artificielle", lien: "cours/cours-10-initiation-au-scripting-bash/",
         conseil: "Revois les bases Bash et PowerShell (variables, boucles, fonctions, erreurs) et la relecture critique d'un script proposé par une IA." },
    9: { titre: "Assurer la continuité et la reprise de l'infrastructure", lien: "cours/cours-15-sauvegarde-et-restauration/",
         conseil: "Revois les types de sauvegarde, la règle 3-2-1, RPO et RTO, les tests de restauration, le PCA et le PRA." },
    10: { titre: "Mettre à jour et superviser les éléments de l'infrastructure", lien: "cours/cours-17-supervision/",
          conseil: "Revois la gestion des mises à jour, la supervision (SNMP, seuils, alertes) et la journalisation." },
  };

  var EPREUVES = {
    ccp1: { nom: "CCP 1 · Assurer le support aux utilisateurs", court: "CCP 1", comps: [1, 2, 3], minutes: 30, nb: 20 },
    ccp2: { nom: "CCP 2 · Exploiter les éléments de l'infrastructure", court: "CCP 2", comps: [4, 5, 6, 7], minutes: 45, nb: 30 },
    ccp3: { nom: "CCP 3 · Maintenir en conditions opérationnelles l'infrastructure", court: "CCP 3", comps: [8, 9, 10], minutes: 45, nb: 30 },
  };

  var STORE_KEY = "tssr-qcm-examen-meilleurs";
  var PROFIL_KEY = "tssr-qcm-examen-profil";   // ancien profil unique (repris dans la base)
  var BASE_KEY = "tssr-qcm-examen-profils";    // base de profils
  var MAX_TENTATIVES = 300;
  var MAX_PROFILS = 50;

  // Adresse d'une page du site, quelle que soit la page courante (base fournie par MkDocs Material)
  function url(chemin) {
    var base = "..";
    try { base = JSON.parse(document.getElementById("__config").textContent).base || "."; } catch (e) { /* défaut */ }
    return base.replace(/\/$/, "") + "/" + chemin;
  }

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

  /* ---------- stockage : base de profils ---------- */
  function nouvelId() { return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function profilVide() {
    return { v: 2, id: nouvelId(), nom: "", dateExamen: "", cree: new Date().toISOString(), tentatives: [], erreurs: {} };
  }
  function nomDe(p) { return (p && p.nom) || "Profil sans nom"; }
  function normaliser(p) {
    if (!p || typeof p !== "object") return null;
    var n = profilVide();
    if (typeof p.id === "string" && /^[\w-]{1,40}$/.test(p.id)) n.id = p.id;
    n.nom = typeof p.nom === "string" ? p.nom.slice(0, 40) : "";
    n.dateExamen = typeof p.dateExamen === "string" ? p.dateExamen.slice(0, 10) : "";
    n.cree = typeof p.cree === "string" ? p.cree : n.cree;
    n.tentatives = Array.isArray(p.tentatives) ? p.tentatives.filter(function (t) {
      return t && typeof t.cle === "string" && typeof t.pct === "number" && t.comps && typeof t.comps === "object";
    }).slice(-MAX_TENTATIVES) : [];
    n.erreurs = p.erreurs && typeof p.erreurs === "object" && !Array.isArray(p.erreurs) ? p.erreurs : {};
    return n;
  }
  function ecrireBase(b) {
    try { localStorage.setItem(BASE_KEY, JSON.stringify(b)); return true; } catch (e) { return false; }
  }
  function lireBase() {
    var b = null;
    try { b = JSON.parse(localStorage.getItem(BASE_KEY)); } catch (e) { b = null; }
    var base = { v: 1, actif: "", profils: {} };
    if (b && typeof b === "object" && b.profils && typeof b.profils === "object") {
      Object.keys(b.profils).forEach(function (k) {
        var p = normaliser(b.profils[k]);
        if (p) base.profils[p.id] = p;
      });
      if (typeof b.actif === "string") base.actif = b.actif;
    }
    // reprise de l'ancien profil unique
    try {
      var ancien = localStorage.getItem(PROFIL_KEY);
      if (ancien) {
        var p = normaliser(JSON.parse(ancien));
        if (p) {
          base.profils[p.id] = p;
          if (!base.actif) base.actif = p.id;
        }
        if (!p || ecrireBase(base)) localStorage.removeItem(PROFIL_KEY);
      }
    } catch (e) { /* stockage indisponible */ }
    if (!base.profils[base.actif]) base.actif = Object.keys(base.profils)[0] || "";
    return base;
  }
  function listeProfils(base) {
    return Object.keys(base.profils).map(function (k) { return base.profils[k]; })
      .sort(function (a, b) { return nomDe(a).localeCompare(nomDe(b), "fr"); });
  }
  function lireProfil() {
    var b = lireBase();
    return b.profils[b.actif] || null;
  }
  function ecrireProfil(p) {
    var b = lireBase();
    if (!b.profils[p.id] && Object.keys(b.profils).length >= MAX_PROFILS) return false;
    b.profils[p.id] = p;
    b.actif = p.id;
    return ecrireBase(b);
  }
  function activerProfil(id) {
    var b = lireBase();
    if (!b.profils[id]) return false;
    b.actif = id;
    return ecrireBase(b);
  }
  function supprimerProfil(id) {
    var b = lireBase();
    delete b.profils[id];
    if (b.actif === id) b.actif = Object.keys(b.profils)[0] || "";
    return ecrireBase(b);
  }
  function profilDuMemeNom(nom, saufId) {
    var cle = nom.trim().toLowerCase();
    if (!cle) return null;
    return listeProfils(lireBase()).filter(function (p) { return p.id !== saufId && p.nom.trim().toLowerCase() === cle; })[0] || null;
  }

  // Import d'un fichier : un profil seul, ou toute une base. Renvoie le nombre de profils ajoutés ou remplacés.
  function importer(json) {
    var entrants = [];
    if (json && json.profils && typeof json.profils === "object") {
      Object.keys(json.profils).forEach(function (k) { var p = normaliser(json.profils[k]); if (p) entrants.push(p); });
    } else {
      var p = normaliser(json);
      if (p) entrants.push(p);
    }
    if (!entrants.length) return 0;
    var b = lireBase();
    var remplaces = entrants.filter(function (p) { return b.profils[p.id]; }).length;
    if (!confirm(entrants.length + " profil(s) dans le fichier : " + entrants.map(nomDe).join(", ") + "." +
      (remplaces ? "\n" + remplaces + " existe(nt) déjà dans ce navigateur et sera(ont) remplacé(s)." : "") + "\nImporter ?")) return -1;
    entrants.forEach(function (p) { b.profils[p.id] = p; });
    if (!b.profils[b.actif]) b.actif = entrants[0].id;
    return ecrireBase(b) ? entrants.length : 0;
  }
  function telecharger(objet, nomFichier) {
    var blob = new Blob([JSON.stringify(objet, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nomFichier;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function boutonImporter(apres) {
    var frag = document.createDocumentFragment();
    var fichier = el("input");
    fichier.type = "file"; fichier.accept = "application/json,.json"; fichier.hidden = true;
    fichier.addEventListener("change", function () {
      var f = fichier.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        var n = 0;
        try { n = importer(JSON.parse(r.result)); } catch (e) { n = 0; }
        fichier.value = "";
        if (n === 0) alert("Ce fichier ne contient pas de profil QCM valide (ou le stockage est bloqué).");
        if (n > 0) apres();
      };
      r.readAsText(f);
    });
    var imp = el("button", "md-button", "⬆️ Importer");
    imp.addEventListener("click", function () { fichier.click(); });
    frag.appendChild(imp); frag.appendChild(fichier);
    return frag;
  }
  function slug(t) { return (t || "profil").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profil"; }

  // Taux de réussite sur un ensemble de tentatives (questions réussies / questions posées)
  function tauxReussite(tentatives) {
    var ok = 0, total = 0;
    tentatives.forEach(function (t) { ok += t.score || 0; total += t.total || 0; });
    return total ? Math.round((ok / total) * 100) : null;
  }
  function joursAvant(dateExamen) {
    if (!dateExamen) return null;
    return Math.ceil((new Date(dateExamen + "T00:00:00") - new Date().setHours(0, 0, 0, 0)) / 86400000);
  }
  function texteJ(dateExamen) {
    var j = joursAvant(dateExamen);
    if (j == null) return "";
    return j > 0 ? "📅 J-" + j + " avant l'examen" : j === 0 ? "📅 C'est le jour J !" : "📅 Examen passé le " + dateFr(dateExamen);
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
      var lienTdb = el("a", "md-button", "📋 Tableau de bord des profils");
      lienTdb.href = url("qcm-examen/tableau-de-bord/");

      if (!profil) {
        carte.appendChild(el("h3", null, "👤 Crée ton profil de suivi"));
        carte.appendChild(el("p", "qcm-meta", "Chaque profil (ex. « Ana ») garde l'historique de ses épreuves, sa progression par compétence, un commentaire sur chaque tentative et ce qu'il reste à réviser. Plusieurs profils peuvent cohabiter dans ce navigateur."));
        carte.appendChild(formProfil(null, function () { accueil(); }));
        var a0 = el("div", "qcm-actions");
        a0.appendChild(lienTdb);
        a0.appendChild(boutonImporter(function () { accueil(); }));
        carte.appendChild(a0);
        return carte;
      }

      var entete = el("div", "qcm-profil-entete");
      entete.appendChild(el("h3", null, "👤 " + nomDe(profil)));
      if (profil.dateExamen) entete.appendChild(el("span", "qcm-badge", texteJ(profil.dateExamen)));
      carte.appendChild(entete);

      // changer de profil / en créer un autre
      var base = lireBase();
      var profils = listeProfils(base);
      var barre = el("div", "qcm-profil-choix");
      if (profils.length > 1) {
        var lab = el("label", null, "Profil actif ");
        var sel = el("select", "qcm-select");
        profils.forEach(function (p) {
          var o = el("option", null, nomDe(p) + " · " + p.tentatives.length + " tentative" + (p.tentatives.length > 1 ? "s" : ""));
          o.value = p.id;
          if (p.id === profil.id) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener("change", function () { activerProfil(sel.value); accueil(); });
        lab.appendChild(sel);
        barre.appendChild(lab);
      }
      var zoneNouveau = el("div");
      var btnNouveau = el("button", "md-button", "➕ Nouveau profil");
      btnNouveau.addEventListener("click", function () {
        zoneNouveau.innerHTML = "";
        zoneNouveau.appendChild(formProfil(null, function () { accueil(); }));
        btnNouveau.remove();
      });
      barre.appendChild(btnNouveau);
      carte.appendChild(barre);
      carte.appendChild(zoneNouveau);

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
      actions.appendChild(lienTdb);
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
      var ok = el("button", "md-button md-button--primary", profil ? "Enregistrer" : "Créer le profil");
      ok.type = "submit";
      form.appendChild(lNom);
      form.appendChild(lDate);
      form.appendChild(ok);
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var nv = nom.value.trim().slice(0, 40);
        if (!profil && !nv) { alert("Donne un pseudo à ce profil (ex. Ana)."); nom.focus(); return; }
        var double = profilDuMemeNom(nv, profil && profil.id);
        if (double) {
          if (!profil && confirm("Le profil « " + nomDe(double) + " » existe déjà. L'utiliser au lieu d'en créer un nouveau ?")) {
            activerProfil(double.id); apres(); return;
          }
          if (profil) { alert("Un autre profil s'appelle déjà « " + nv + " »."); return; }
          return;
        }
        var p = profil || profilVide();
        p.nom = nv;
        p.dateExamen = date.value || "";
        if (!ecrireProfil(p)) alert("Impossible d'enregistrer : stockage du navigateur bloqué (navigation privée ?) ou " + MAX_PROFILS + " profils atteints.");
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
        if (profil) {
          var passages = profil.tentatives.filter(function (t) { return t.cle === cle; });
          var der = passages[passages.length - 1];
          if (der) {
            carte.appendChild(el("p", "qcm-meilleur", "🏅 Meilleur score : " + Math.max.apply(null, passages.map(function (t) { return t.pct; })) + " %"));
            carte.appendChild(el("p", "qcm-meta", "Dernier passage : " + der.pct + " % le " + dateFr(der.date) + " · " + passages.length + " passage" + (passages.length > 1 ? "s" : "")));
          }
        } else if (meilleurs[cle] != null) {
          carte.appendChild(el("p", "qcm-meilleur", "🏅 Ton meilleur score : " + meilleurs[cle] + " %"));
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
      tete.appendChild(el("h2", null, "📊 Suivi de " + nomDe(profil)));
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
          lien.href = url(COMPETENCES[x.c].lien);
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
            a.href = url(COMPETENCES[x.c].lien);
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
      details.appendChild(el("p", "qcm-meta", "Les profils sont stockés uniquement dans ce navigateur. Exporte-les pour les garder ou les transférer sur un autre appareil."));
      var acts = el("div", "qcm-actions");
      var exp = el("button", "md-button", "⬇️ Exporter ce profil");
      exp.addEventListener("click", function () {
        telecharger(lireProfil(), "suivi-qcm-tssr-" + slug(profil.nom) + "-" + new Date().toISOString().slice(0, 10) + ".json");
      });
      var raz = el("button", "md-button qcm-danger", "🗑️ Supprimer ce profil");
      raz.addEventListener("click", function () {
        if (!confirm("Supprimer le profil « " + nomDe(profil) + " » avec tout son historique, ses notes et ses erreurs à revoir ? Exporte-le avant si tu veux le garder.")) return;
        supprimerProfil(profil.id);
        accueil(false);
      });
      acts.appendChild(exp); acts.appendChild(boutonImporter(function () { accueil(true); })); acts.appendChild(raz);
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
          var expl = el("div", "qcm-explication " + (ok ? "qcm-ok" : "qcm-ko"));
          if (ok) {
            expl.appendChild(el("p", "qcm-expl-titre", "✅ Bonne réponse !"));
          } else {
            expl.appendChild(el("p", "qcm-expl-titre", reponses[i] === null ? "⚪ Tu n'as pas répondu." : "❌ Ta réponse : « " + q.o[reponses[i]] + " »"));
            expl.appendChild(el("p", "qcm-expl-bonne", "✅ La bonne réponse : « " + q.o[q.a] + " »"));
          }
          var pq = el("p", "qcm-expl-pourquoi");
          pq.appendChild(el("strong", null, "💡 Pourquoi ? "));
          pq.appendChild(document.createTextNode(q.e));
          expl.appendChild(pq);
          if (!ok && COMPETENCES[q.c]) {
            var rev = el("p", "qcm-expl-revoir");
            rev.appendChild(document.createTextNode("📖 Pour revoir : "));
            var lr = el("a", null, "compétence " + q.c + " · " + COMPETENCES[q.c].titre);
            lr.href = url(COMPETENCES[q.c].lien);
            rev.appendChild(lr);
            expl.appendChild(rev);
          }
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
          lien.href = url(COMPETENCES[c].lien);
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
          com.appendChild(el("strong", null, "💬 Commentaire de suivi · profil « " + nomDe(profil) + " »"));
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

  /* =====================================================================
     TABLEAU DE BORD DES PROFILS (page qcm-examen/tableau-de-bord/)
     ===================================================================== */

  // Points forts / à consolider / faibles d'un profil, d'après la maîtrise de chaque compétence
  function forcesFaiblesses(profil) {
    var r = { forts: [], consolider: [], faibles: [], jamais: [], progres: [], recul: [] };
    Object.keys(COMPETENCES).forEach(function (k) {
      var c = Number(k), m = maitrise(profil, c);
      var x = { c: c, pct: m.pct, tendance: m.tendance };
      if (m.pct == null) r.jamais.push(x);
      else if (m.pct >= 80) r.forts.push(x);
      else if (m.pct >= 50) r.consolider.push(x);
      else r.faibles.push(x);
      if (m.tendance != null && m.tendance >= 10) r.progres.push(x);
      if (m.tendance != null && m.tendance <= -10) r.recul.push(x);
    });
    r.forts.sort(function (a, b) { return b.pct - a.pct; });
    r.consolider.sort(function (a, b) { return a.pct - b.pct; });
    r.faibles.sort(function (a, b) { return a.pct - b.pct; });
    return r;
  }
  function listeComps(xs) {
    return xs.map(function (x) { return x.c + (x.pct != null ? " (" + x.pct + " %)" : ""); }).join(", ");
  }

  // Commentaire de synthèse d'un profil
  function commentaireProfil(profil) {
    var ff = forcesFaiblesses(profil), lignes = [];
    var ccp = profil.tentatives.filter(function (t) { return EPREUVES[t.cle]; });
    if (!profil.tentatives.length) return ["Aucune tentative pour l'instant : commence par un examen blanc du CCP 1."];
    Object.keys(EPREUVES).forEach(function (cle) {
      var ts = ccp.filter(function (t) { return t.cle === cle; });
      if (ts.length > 1) {
        var d = ts[ts.length - 1].pct - ts[0].pct;
        lignes.push(EPREUVES[cle].court + " : " + ts.length + " passages, " + ts[0].pct + " % → " + ts[ts.length - 1].pct + " % (" + (d >= 0 ? "+" : "") + d + " pts)" +
          (d >= 15 ? ", belle progression." : d <= -10 ? ", en baisse : reprends les cours des compétences faibles." : "."));
      } else if (ts.length === 1) {
        lignes.push(EPREUVES[cle].court + " : passé une fois (" + ts[0].pct + " %). Repasse-le pour mesurer ta progression.");
      }
    });
    var pasPasse = Object.keys(EPREUVES).filter(function (cle) { return !ccp.some(function (t) { return t.cle === cle; }); });
    if (pasPasse.length) lignes.push("Pas encore passé : " + pasPasse.map(function (k) { return EPREUVES[k].court; }).join(", ") + ".");
    if (ff.forts.length) lignes.push("💪 Points forts : compétence" + (ff.forts.length > 1 ? "s " : " ") + listeComps(ff.forts) + ".");
    if (ff.faibles.length) lignes.push("🎯 Points faibles, à réviser en priorité : compétence" + (ff.faibles.length > 1 ? "s " : " ") + listeComps(ff.faibles) + ".");
    if (ff.consolider.length) lignes.push("🔧 À consolider : compétence" + (ff.consolider.length > 1 ? "s " : " ") + listeComps(ff.consolider) + ".");
    if (ff.progres.length) lignes.push("🚀 En progrès récent : compétence" + (ff.progres.length > 1 ? "s " : " ") + ff.progres.map(function (x) { return x.c; }).join(", ") + ".");
    if (ff.recul.length) lignes.push("⚠️ En recul récent : compétence" + (ff.recul.length > 1 ? "s " : " ") + ff.recul.map(function (x) { return x.c; }).join(", ") + ".");
    var j = joursAvant(profil.dateExamen);
    if (j != null && j > 0 && j <= 30 && ff.faibles.length) lignes.push("📅 Examen dans " + j + " jour" + (j > 1 ? "s" : "") + " : concentre-toi sur les points faibles et refais un examen blanc chronométré par semaine.");
    return lignes;
  }

  function cellule(tr, label, contenu, cls) {
    var td = el("td", cls || null);
    td.setAttribute("data-label", label);
    if (contenu instanceof Node) td.appendChild(contenu); else td.textContent = contenu;
    tr.appendChild(td);
    return td;
  }
  function tableau(entetes) {
    var wrap = el("div", "qcm-table-wrap");
    var table = el("table");
    table.setAttribute("data-cartes", "");
    var thead = el("thead"), tr = el("tr");
    entetes.forEach(function (h) { tr.appendChild(el("th", null, h)); });
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = el("tbody");
    table.appendChild(tbody);
    wrap.appendChild(table);
    return { wrap: wrap, tbody: tbody };
  }
  function scoreCcp(profil, cle) {
    var ts = profil.tentatives.filter(function (t) { return t.cle === cle; });
    var box = el("span", "qcm-td-ccp");
    if (!ts.length) { box.textContent = "-"; return box; }
    var der = ts[ts.length - 1], avant = ts[ts.length - 2];
    box.appendChild(el("strong", "qcm-niv " + niveau(der.pct), der.pct + " %"));
    if (avant) {
      var d = der.pct - avant.pct;
      box.appendChild(el("span", "qcm-delta " + (d > 0 ? "is-plus" : d < 0 ? "is-moins" : ""), (d > 0 ? " ▲+" : d < 0 ? " ▼" : " =") + (d === 0 ? "" : d)));
    }
    box.title = ts.length + " passage(s) · meilleur " + Math.max.apply(null, ts.map(function (t) { return t.pct; })) + " %";
    return box;
  }

  function initTableauDeBord() {
    var root = document.getElementById("qcm-tableau-de-bord");
    if (!root) return;

    function choisirDepuisAdresse() {
      var m = /profil=([\w-]+)/.exec(location.hash);
      return m ? m[1] : null;
    }

    function rendre(idDetail) {
      root.innerHTML = "";
      var base = lireBase();
      var profils = listeProfils(base);

      /* barre d'actions */
      var actions = el("div", "qcm-actions");
      var lienQcm = el("a", "md-button md-button--primary", "📝 Aller au QCM examen");
      lienQcm.href = url("qcm-examen/");
      actions.appendChild(lienQcm);
      var zoneNouveau = el("div", "qcm-carte qcm-tdb-nouveau");
      zoneNouveau.hidden = true;
      var btnNouveau = el("button", "md-button", "➕ Nouveau profil");
      btnNouveau.addEventListener("click", function () { zoneNouveau.hidden = !zoneNouveau.hidden; });
      actions.appendChild(btnNouveau);
      if (profils.length) {
        var expTout = el("button", "md-button", "⬇️ Exporter tous les profils");
        expTout.addEventListener("click", function () {
          telecharger(lireBase(), "profils-qcm-tssr-" + new Date().toISOString().slice(0, 10) + ".json");
        });
        actions.appendChild(expTout);
      }
      actions.appendChild(boutonImporter(function () { rendre(); }));
      root.appendChild(actions);

      // formulaire de création (même règles que sur la page du QCM)
      zoneNouveau.appendChild(el("h3", null, "➕ Nouveau profil"));
      var form = el("form", "qcm-form-profil");
      var lNom = el("label", null, "Pseudo ");
      var nom = el("input", "qcm-input"); nom.type = "text"; nom.maxLength = 40; nom.placeholder = "ex. Ana";
      lNom.appendChild(nom);
      var lDate = el("label", null, "Date de l'examen (facultatif) ");
      var date = el("input", "qcm-input"); date.type = "date";
      lDate.appendChild(date);
      var ok = el("button", "md-button md-button--primary", "Créer le profil"); ok.type = "submit";
      form.appendChild(lNom); form.appendChild(lDate); form.appendChild(ok);
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var nv = nom.value.trim().slice(0, 40);
        if (!nv) { alert("Donne un pseudo à ce profil (ex. Ana)."); return; }
        var double = profilDuMemeNom(nv);
        if (double) { alert("Le profil « " + nomDe(double) + " » existe déjà."); return; }
        var p = profilVide(); p.nom = nv; p.dateExamen = date.value || "";
        if (!ecrireProfil(p)) { alert("Impossible d'enregistrer : stockage bloqué ou " + MAX_PROFILS + " profils atteints."); return; }
        rendre(p.id);
      });
      zoneNouveau.appendChild(form);
      root.appendChild(zoneNouveau);

      if (!profils.length) {
        var vide = el("div", "qcm-carte");
        vide.appendChild(el("h3", null, "Aucun profil pour l'instant"));
        vide.appendChild(el("p", null, "Crée un profil (bouton « Nouveau profil »), puis passe le CCP 1, le CCP 2, le CCP 3 sur la page du QCM examen : chaque passage s'enregistre dans le profil actif et apparaît ici."));
        root.appendChild(vide);
        return;
      }

      /* 1. récapitulatif de tous les profils */
      root.appendChild(el("h2", null, "📋 Récapitulatif des profils"));
      root.appendChild(el("p", "qcm-meta", "Dernier score de chaque CCP (▲▼ = évolution depuis le passage précédent ; survole pour le meilleur score). Taux de réussite = questions réussies / questions posées, toutes tentatives confondues."));
      var t = tableau(["Profil", "Examen", "Passages", "CCP 1", "CCP 2", "CCP 3", "Taux de réussite", "Compétences maîtrisées", "Dernière activité", ""]);
      profils.forEach(function (p) {
        var tr = el("tr", p.id === base.actif ? "is-actif" : null);
        var n = el("span", null, nomDe(p) + (p.id === base.actif ? " ★" : ""));
        if (p.id === base.actif) n.title = "Profil actif sur la page du QCM";
        cellule(tr, "Profil", n, "qcm-td-nom");
        var j = joursAvant(p.dateExamen);
        cellule(tr, "Examen", j == null ? "-" : j > 0 ? "J-" + j : j === 0 ? "Jour J" : "Passé");
        cellule(tr, "Passages", String(p.tentatives.length));
        ["ccp1", "ccp2", "ccp3"].forEach(function (cle) { cellule(tr, EPREUVES[cle].court, scoreCcp(p, cle)); });
        var taux = tauxReussite(p.tentatives);
        cellule(tr, "Taux de réussite", taux == null ? "-" : el("strong", "qcm-niv " + niveau(taux), taux + " %"));
        var ff = forcesFaiblesses(p);
        cellule(tr, "Compétences maîtrisées", ff.forts.length + " / 10");
        var derniere = p.tentatives[p.tentatives.length - 1];
        cellule(tr, "Dernière activité", derniere ? dateFr(derniere.date) : "-");
        var voir = el("button", "md-button", "Voir le détail");
        voir.addEventListener("click", function () { location.hash = "profil=" + p.id; });
        cellule(tr, "", voir);
        t.tbody.appendChild(tr);
      });
      root.appendChild(t.wrap);

      /* 2. détail d'un profil */
      var id = idDetail || choisirDepuisAdresse() || base.actif;
      var p = base.profils[id] || base.profils[base.actif];
      if (p) root.appendChild(detail(p, base));
    }

    function detail(p, base) {
      var box = el("div", "qcm-suivi qcm-tdb-detail");
      box.id = "detail";
      var tete = el("div", "qcm-suivi-tete");
      tete.appendChild(el("h2", null, "📊 " + nomDe(p)));
      if (p.dateExamen) tete.appendChild(el("span", "qcm-badge", texteJ(p.dateExamen)));
      box.appendChild(tete);

      var acts = el("div", "qcm-actions");
      var passer = el("button", "md-button md-button--primary", p.id === base.actif ? "▶️ Passer un QCM (profil actif)" : "▶️ Passer un QCM avec ce profil");
      passer.addEventListener("click", function () { activerProfil(p.id); location.href = url("qcm-examen/"); });
      acts.appendChild(passer);
      var exp = el("button", "md-button", "⬇️ Exporter ce profil");
      exp.addEventListener("click", function () { telecharger(p, "suivi-qcm-tssr-" + slug(p.nom) + "-" + new Date().toISOString().slice(0, 10) + ".json"); });
      acts.appendChild(exp);
      var sup = el("button", "md-button qcm-danger", "🗑️ Supprimer");
      sup.addEventListener("click", function () {
        if (!confirm("Supprimer le profil « " + nomDe(p) + " » et tout son historique ? Exporte-le avant si tu veux le garder.")) return;
        supprimerProfil(p.id);
        history.replaceState(null, "", location.pathname);
        rendre();
      });
      acts.appendChild(sup);
      box.appendChild(acts);

      /* chiffres clés */
      var ccp = p.tentatives.filter(function (t) { return EPREUVES[t.cle]; });
      var ff = forcesFaiblesses(p);
      var stats = el("div", "qcm-stats");
      [
        [String(p.tentatives.length), "tentative" + (p.tentatives.length > 1 ? "s" : "") + " (dont " + ccp.length + " examen" + (ccp.length > 1 ? "s" : "") + " blanc" + (ccp.length > 1 ? "s" : "") + ")"],
        [tauxReussite(p.tentatives) == null ? "-" : tauxReussite(p.tentatives) + " %", "taux de réussite global"],
        [tauxReussite(ccp) == null ? "-" : tauxReussite(ccp) + " %", "taux de réussite aux examens blancs"],
        [ff.forts.length + " / 10", "compétences maîtrisées (≥ 80 %)"],
      ].forEach(function (s) {
        var b = el("div", "qcm-stat");
        b.appendChild(el("strong", null, s[0]));
        b.appendChild(el("span", null, s[1]));
        stats.appendChild(b);
      });
      box.appendChild(stats);

      /* commentaire de synthèse */
      var bilan = el("div", "qcm-bilan");
      bilan.appendChild(el("h3", null, "💬 Commentaire : points forts et points faibles"));
      var ul = el("ul");
      commentaireProfil(p).forEach(function (l) { ul.appendChild(el("li", null, l)); });
      bilan.appendChild(ul);
      box.appendChild(bilan);

      if (!p.tentatives.length) return box;

      /* évolution par CCP */
      box.appendChild(el("h3", null, "📈 Évolution par CCP"));
      var grille = el("div", "qcm-grille");
      Object.keys(EPREUVES).forEach(function (cle) {
        var ts = p.tentatives.filter(function (t) { return t.cle === cle; });
        var carte = el("div", "qcm-carte qcm-carte-progression");
        carte.appendChild(el("h4", null, EPREUVES[cle].court));
        if (!ts.length) {
          carte.appendChild(el("p", "qcm-meta", "Pas encore passé."));
        } else {
          var der = ts[ts.length - 1], prem = ts[0];
          var ligne = el("p", "qcm-progression-score");
          ligne.appendChild(el("strong", null, der.pct + " %"));
          if (ts.length > 1) {
            var d = der.pct - prem.pct;
            ligne.appendChild(el("span", "qcm-delta " + (d > 0 ? "is-plus" : d < 0 ? "is-moins" : ""), (d > 0 ? "▲ +" : d < 0 ? "▼ " : "= ") + d + " pts depuis le 1er passage"));
          }
          carte.appendChild(ligne);
          carte.appendChild(courbe(ts.slice(-10)));
          var moy = Math.round(ts.reduce(function (s, t) { return s + t.pct; }, 0) / ts.length);
          var best = Math.max.apply(null, ts.map(function (t) { return t.pct; }));
          carte.appendChild(el("p", "qcm-meta", ts.length + " passage" + (ts.length > 1 ? "s" : "") + " · 1er : " + prem.pct + " % · moyenne : " + moy + " % · meilleur : " + best + " %"));
        }
        grille.appendChild(carte);
      });
      box.appendChild(grille);

      /* maîtrise par compétence */
      box.appendChild(el("h3", null, "🧩 Maîtrise par compétence"));
      var comps = el("div", "qcm-comps");
      Object.keys(COMPETENCES).forEach(function (k) {
        var c = Number(k), m = maitrise(p, c);
        var ligne = el("div", "qcm-comp " + niveau(m.pct));
        var lien = el("a", null, "Compétence " + c + " · " + COMPETENCES[c].titre);
        lien.href = url(COMPETENCES[c].lien);
        ligne.appendChild(lien);
        var jauge = el("div", "qcm-jauge");
        var rempli = el("span");
        rempli.style.width = (m.pct || 0) + "%";
        jauge.appendChild(rempli);
        ligne.appendChild(jauge);
        ligne.appendChild(el("span", "qcm-comp-score", m.pct == null ? "-" : m.pct + " %" + (m.tendance == null ? "" : m.tendance >= 10 ? " ▲" : m.tendance <= -10 ? " ▼" : "")));
        comps.appendChild(ligne);
      });
      box.appendChild(comps);

      /* parcours : chaque passage avec son évolution et son commentaire */
      box.appendChild(el("h3", null, "🗂️ Parcours et commentaires"));
      box.appendChild(el("p", "qcm-meta", "Du plus récent au plus ancien. L'évolution compare chaque passage au précédent de la même épreuve."));
      var tp = tableau(["Date", "Épreuve", "Score", "Évolution", "Commentaire"]);
      var precedents = {};
      var lignes = p.tentatives.map(function (t) {
        var avant = precedents[t.cle];
        precedents[t.cle] = t;
        return { t: t, d: avant ? t.pct - avant.pct : null };
      }).reverse();
      lignes.forEach(function (x) {
        var tr = el("tr", "qcm-niv-ligne " + niveau(x.t.pct));
        cellule(tr, "Date", dateFr(x.t.date, true));
        cellule(tr, "Épreuve", titreCle(x.t.cle));
        cellule(tr, "Score", el("strong", "qcm-niv " + niveau(x.t.pct), x.t.score + " / " + x.t.total + " · " + x.t.pct + " %"));
        cellule(tr, "Évolution", x.d == null ? "1er passage" : el("span", "qcm-delta " + (x.d > 0 ? "is-plus" : x.d < 0 ? "is-moins" : ""), (x.d > 0 ? "▲ +" : x.d < 0 ? "▼ " : "= ") + x.d + " pts"));
        var com = el("div", "qcm-td-commentaire");
        com.appendChild(el("span", null, x.t.commentaire || ""));
        if (x.t.note) com.appendChild(el("em", "qcm-td-note", "✍️ " + x.t.note));
        cellule(tr, "Commentaire", com);
        tp.tbody.appendChild(tr);
      });
      box.appendChild(tp.wrap);
      return box;
    }

    window.addEventListener("hashchange", function () {
      rendre(choisirDepuisAdresse());
      var d = document.getElementById("detail");
      if (d) d.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    rendre();
  }

  function demarrer() { init(); initTableauDeBord(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer);
  else demarrer();
})();
