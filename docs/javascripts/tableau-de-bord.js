/**
 * tableau-de-bord.js
 * ---------------------------------------------------------------------
 * « Mon tableau de bord » : grand panneau ouvert depuis la carte du compte 👤
 * (ou l'adresse #tableau-de-bord). Styles : tableau-de-bord.css
 *
 * Tableau de bord personnel calculé DANS LE NAVIGATEUR, à partir des
 * données déjà enregistrées par le site (et synchronisées avec le compte) :
 *   - QCM examen : tentatives du profil actif (tssr-qcm-examen-profils) ;
 *   - quiz des modules / fiches / cours : tssr-quiz-suivi ;
 *   - TP refaits : tssr-suivi-tp ;
 *   - pages ouvertes : tssr-visited-pages ;
 *   - temps d'étude : tssr-activite (activite.js) ;
 *   - réglages et historique du score : tssr-tableau-reglages, tssr-tableau-historique.
 * Le programme (cours, modules, TP) est lu dans le menu du site : rien à
 * maintenir à la main quand on ajoute un module ou un TP.
 *
 * Score de préparation = pondération réglable de 4 indicateurs :
 *   résultats (QCM + quiz) · TP maîtrisés · couverture du programme · régularité.
 * ---------------------------------------------------------------------
 */
(function () {
  "use strict";

  // Le tableau de bord vit dans le compte : un grand panneau (dialog) ouvert
  // depuis la carte 👤 (bouton « Mon tableau de bord ») ou via l'adresse #tableau-de-bord.
  var racine = null, modal = null;

  var JOUR = 86400000;
  var DEBUT_FORMATION = "2026-10-12";
  var REGLAGES_DEFAUT = {
    examen: "2027-06-15",       // date d'examen cible (mi-juin 2027)
    objectif: 85,               // score de préparation visé le jour de l'examen
    seuil: 70,                  // en dessous : point à revoir
    heures: 6,                  // heures d'étude disponibles par semaine
    joursVises: 4,              // jours d'étude visés par semaine (régularité)
    poids: { resultats: 40, tp: 30, couverture: 20, regularite: 10 },
  };
  var COMPETENCES = {
    1: "IA et encadrement de son usage", 2: "Déploiement, outils collaboratifs", 3: "Assistance technique",
    4: "Réseau IP", 5: "Serveurs Windows et Linux", 6: "Infrastructure virtualisée",
    7: "Accès et sécurité hybride", 8: "Scripts avec l'IA", 9: "Continuité et reprise", 10: "Mises à jour et supervision",
  };
  var CLES_DONNEES = ["tssr-qcm-examen-profils", "tssr-qcm-examen-meilleurs", "tssr-qcm-examen-vues", "tssr-quiz-suivi",
    "tssr-suivi-tp", "tssr-visited-pages", "tssr-recent-pages", "tssr-activite", "tssr-planning-revision",
    "tssr-tableau-reglages", "tssr-tableau-historique", "tssr-avatar", "tssr-theme"];

  /* ------------------------------------------------------------------
   * Outils
   * ------------------------------------------------------------------ */
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* plein */ } }
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dateDe(s) { var p = String(s).slice(0, 10).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function auj() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function fmtDate(d) { return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }); }
  function fmtCourt(d) { return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }); }
  function fmtDuree(s) { var h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h ? h + " h " + String(m).padStart(2, "0") : m + " min"; }
  function moyenne(t) { return t.length ? t.reduce(function (a, b) { return a + b; }, 0) / t.length : null; }
  function borne(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function pctEssai(e) { return Math.round((e.score / e.total) * 100); }
  function base() {
    var b = ".";
    try { b = JSON.parse(document.getElementById("__config").textContent).base || "."; } catch (e) { /* défaut */ }
    return b.replace(/\/$/, "") + "/";
  }
  function nomCours(slug) {
    var m = slug.match(/^cours-(\d+)/);
    return m ? "Cours " + Number(m[1]) : slug === "bonus-microsoft-365" ? "Bonus M365" : slug;
  }

  function reglages() {
    var r = Object.assign({}, REGLAGES_DEFAUT, lire("tssr-tableau-reglages", {}));
    r.poids = Object.assign({}, REGLAGES_DEFAUT.poids, r.poids || {});
    return r;
  }

  /* ------------------------------------------------------------------
   * Collecte : le programme (lu dans le menu) et les activités
   * ------------------------------------------------------------------ */
  function programme() {
    var modules = {}, tps = {};
    document.querySelectorAll(".md-nav--primary a.md-nav__link[href]").forEach(function (a) {
      var p = decodeURI(a.pathname);
      var m = p.match(/\/cours\/([^/]+)\/(module-[^/]+)\/$/);
      if (m && !modules[p]) {
        var st = window.TSSRStatuts ? window.TSSRStatuts.get(a.getAttribute("href")) : null;
        modules[p] = { page: p, cours: m[1], titre: a.textContent.replace(/[✓🔒]/g, "").trim(), statut: st ? st.statut : null };
      }
      var t = p.match(/\/travaux-pratiques\/([^/]+)\/(tp-[^/]+)\/$/);
      if (t && !tps[p]) tps[p] = { page: p, id: t[1] + "/" + t[2] + "/", cours: t[1], titre: a.textContent.trim().replace(/^TP - /, "") };
    });
    return { modules: Object.keys(modules).map(function (k) { return modules[k]; }), tps: Object.keys(tps).map(function (k) { return tps[k]; }) };
  }

  function activites() {
    var b = lire("tssr-qcm-examen-profils", {});
    var profils = b.profils || {};
    var profil = profils[b.actif] || profils[Object.keys(profils)[0]] || null;
    var idProfil = profil ? profil.id : "local";
    var quizBrut = lire("tssr-quiz-suivi", {})[idProfil] || {};
    var quiz = Object.keys(quizBrut).map(function (k) {
      var q = quizBrut[k];
      return { id: k, titre: q.titre || k, page: q.page || "", essais: (q.essais || []).filter(function (e) { return e.total; }) };
    }).filter(function (q) { return q.essais.length; });
    return {
      profil: profil,
      qcm: (profil && profil.tentatives || []).filter(function (t) { return t.date && typeof t.pct === "number"; }),
      quiz: quiz,
      tp: lire("tssr-suivi-tp", {}),
      vues: lire("tssr-visited-pages", []).map(function (u) { try { return decodeURI(u); } catch (e) { return u; } }),
      activite: lire("tssr-activite", {}),
    };
  }

  /* ------------------------------------------------------------------
   * Calculs : indicateurs, score de préparation, trajectoire
   * ------------------------------------------------------------------ */
  function calculer() {
    var r = reglages(), prog = programme(), a = activites();
    var aujourd = auj(), examen = dateDe(r.examen), debut = dateDe(DEBUT_FORMATION);
    var joursRestants = Math.max(0, Math.round((examen - aujourd) / JOUR));

    // jours actifs : temps mesuré (≥ 5 min) ou une activité ce jour-là
    var actifs = {};
    Object.keys(a.activite).forEach(function (j) { if (a.activite[j] >= 300) actifs[j] = true; });
    a.qcm.forEach(function (t) { actifs[iso(new Date(t.date))] = true; });
    a.quiz.forEach(function (q) { q.essais.forEach(function (e) { actifs[iso(new Date(e.d))] = true; }); });
    Object.keys(a.tp).forEach(function (id) { (a.tp[id] || []).forEach(function (h) { actifs[iso(new Date(h.d))] = true; }); });

    var serie = 0, d = new Date(aujourd);
    if (!actifs[iso(d)]) d = new Date(d - JOUR);           // la série tient encore si on a étudié hier
    while (actifs[iso(d)]) { serie++; d = new Date(d - JOUR); }
    var actifs28 = 0;
    for (var i = 0; i < 28; i++) if (actifs[iso(new Date(aujourd - i * JOUR))]) actifs28++;
    var joursParSemaine = actifs28 / 4;

    var tempsTotal = Object.keys(a.activite).reduce(function (s, k) { return s + a.activite[k]; }, 0);
    var temps7 = 0;
    for (var k = 0; k < 7; k++) temps7 += a.activite[iso(new Date(aujourd - k * JOUR))] || 0;

    // résultats : 5 derniers QCM et dernier essai de chaque quiz
    var qcmTri = a.qcm.slice().sort(function (x, y) { return x.date < y.date ? -1 : 1; });
    var moyQcm = moyenne(qcmTri.slice(-5).map(function (t) { return t.pct; }));
    var moyQuiz = moyenne(a.quiz.map(function (q) { return pctEssai(q.essais[q.essais.length - 1]); }));
    var resultats = moyQcm != null && moyQuiz != null ? (moyQcm + moyQuiz) / 2 : moyQcm != null ? moyQcm : moyQuiz;

    // TP
    var tpEtat = prog.tps.map(function (t) {
      var h = a.tp[t.id] || [];
      return Object.assign({}, t, { histo: h, dernier: h[0] || null });
    });
    var tpFaits = tpEtat.filter(function (t) { return t.dernier; }).length;
    var tpMaitrises = tpEtat.filter(function (t) { return t.dernier && t.dernier.r === "ok"; }).length;

    // couverture : module ouvert ou quiz du module fait
    var quizParPage = {};
    a.quiz.forEach(function (q) { quizParPage[q.page] = q; });
    var modules = prog.modules.map(function (m) {
      var q = quizParPage[m.page];
      var dernierQuiz = q ? q.essais[q.essais.length - 1] : null;
      return Object.assign({}, m, {
        vu: a.vues.indexOf(m.page) >= 0 || !!q,
        quiz: q || null,
        scoreQuiz: dernierQuiz ? pctEssai(dernierQuiz) : null,
        revuLe: dernierQuiz ? new Date(dernierQuiz.d) : null,
      });
    });
    var travailles = modules.filter(function (m) { return m.vu; }).length;
    var couverture = modules.length ? travailles / modules.length * 100 : 0;
    var attendusModules = modules.filter(function (m) { return m.statut === "termine" || m.statut === "en-cours"; });

    // compétences du QCM (cumul de toutes les tentatives)
    var comps = {};
    a.qcm.forEach(function (t) {
      Object.keys(t.comps || {}).forEach(function (c) {
        comps[c] = comps[c] || { ok: 0, total: 0 };
        comps[c].ok += t.comps[c].ok || 0;
        comps[c].total += t.comps[c].total || 0;
      });
    });

    // score de préparation
    var reg = borne(joursParSemaine / r.joursVises, 0, 1) * 100;
    var tpPct = prog.tps.length ? tpMaitrises / prog.tps.length * 100 : 0;
    var p = r.poids, somme = p.resultats + p.tp + p.couverture + p.regularite || 1;
    var composantes = { resultats: resultats || 0, tp: tpPct, couverture: couverture, regularite: reg };
    var preparation = Math.round((composantes.resultats * p.resultats + tpPct * p.tp + couverture * p.couverture + reg * p.regularite) / somme);

    // trajectoire cible : linéaire de 0 (début de formation) à l'objectif (jour de l'examen)
    function attendu(date) { return borne((date - debut) / (examen - debut), 0, 1) * r.objectif; }
    var attenduAuj = Math.round(attendu(aujourd));

    // historique du score (1 point par jour, mis à jour à chaque visite)
    var hist = lire("tssr-tableau-historique", {});
    hist[iso(aujourd)] = preparation;
    ecrire("tssr-tableau-historique", hist);

    return {
      r: r, prog: prog, a: a, aujourd: aujourd, examen: examen, debut: debut, joursRestants: joursRestants,
      actifs: actifs, serie: serie, joursParSemaine: joursParSemaine, tempsTotal: tempsTotal, temps7: temps7,
      moyQcm: moyQcm, moyQuiz: moyQuiz, tpEtat: tpEtat, tpFaits: tpFaits, tpMaitrises: tpMaitrises,
      modules: modules, travailles: travailles, couverture: couverture, attendusModules: attendusModules,
      comps: comps, composantes: composantes, preparation: preparation, attenduAuj: attenduAuj, attendu: attendu, hist: hist,
    };
  }

  /* ------------------------------------------------------------------
   * Points à revoir et recommandations (moteur de règles V1)
   * ------------------------------------------------------------------ */
  function pointsARevoir(c) {
    var r = c.r, liste = [], B = base();
    c.a.quiz.forEach(function (q) {
      var s = pctEssai(q.essais[q.essais.length - 1]);
      if (s < r.seuil) liste.push({ score: s, icone: "🧠", titre: q.titre, raison: "dernier quiz " + s + " %", lien: q.page });
    });
    Object.keys(c.comps).forEach(function (n) {
      var x = c.comps[n];
      if (x.total >= 3) {
        var s = Math.round(x.ok / x.total * 100);
        if (s < r.seuil) liste.push({ score: s, icone: "🎯", titre: "Compétence " + n + " · " + COMPETENCES[n], raison: s + " % au QCM (" + x.total + " questions)", lien: B + "qcm-examen/" });
      }
    });
    c.tpEtat.forEach(function (t) {
      if (t.dernier && t.dernier.r !== "ok") liste.push({ score: t.dernier.r === "echec" ? 20 : 50, icone: "🛠️", titre: "TP · " + t.titre, raison: t.dernier.r === "echec" ? "pas réussi" : "réussi avec le corrigé", lien: t.page });
    });
    var limite = new Date(c.aujourd - 30 * JOUR);
    c.modules.forEach(function (m) {
      if (m.revuLe && m.revuLe < limite && (m.scoreQuiz == null || m.scoreQuiz >= r.seuil)) {
        var j = Math.round((c.aujourd - m.revuLe) / JOUR);
        liste.push({ score: 75, icone: "⏳", titre: nomCours(m.cours) + " · " + m.titre, raison: "pas révisé depuis " + j + " jours", lien: m.page });
      }
    });
    return liste.sort(function (x, y) { return x.score - y.score; });
  }

  function recommandations(c, points) {
    var reco = [], r = c.r, B = base();
    // 1. TP des cours passés jamais refaits ou à reprendre
    var tpAFaire = c.tpEtat.filter(function (t) { return !t.dernier; });
    if (tpAFaire.length) reco.push({ icone: "🛠️", texte: "Refais en VM le TP « " + tpAFaire[0].titre + " » : " + c.tpMaitrises + " TP maîtrisé" + (c.tpMaitrises > 1 ? "s" : "") + " sur " + c.prog.tps.length + ".", lien: tpAFaire[0].page });
    // 2. le point le plus faible
    if (points.length) reco.push({ icone: points[0].icone, texte: "Priorité : « " + points[0].titre + " » (" + points[0].raison + "). Relis la fiche du cours avant de le refaire.", lien: points[0].lien });
    // 3. modules des cours passés jamais ouverts
    var oublies = c.attendusModules.filter(function (m) { return !m.vu; });
    if (oublies.length) reco.push({ icone: "📖", texte: oublies.length + " module" + (oublies.length > 1 ? "s" : "") + " des cours déjà vus jamais ouvert" + (oublies.length > 1 ? "s" : "") + " ici, dont « " + oublies[0].titre + " ».", lien: oublies[0].page });
    // 4. projection de couverture avant l'examen
    var semainesRestantes = Math.max(1, c.joursRestants / 7);
    var restants = c.modules.length - c.travailles;
    var rythme = 0;   // modules travaillés sur les 4 dernières semaines (via les quiz)
    var il28 = new Date(c.aujourd - 28 * JOUR);
    c.modules.forEach(function (m) { if (m.revuLe && m.revuLe >= il28) rythme++; });
    var projection = Math.min(100, Math.round((c.travailles + rythme / 4 * semainesRestantes) / (c.modules.length || 1) * 100));
    // repère : environ 1 h 30 de révision par module (cours relu + quiz + fiche)
    var parSemaine = Math.ceil(restants / semainesRestantes);
    var heuresNecessaires = Math.ceil(parSemaine * 1.5);
    if (restants > 0 && projection < 100) {
      reco.push({ icone: "📈", texte: "À ce rythme (" + rythme + " module" + (rythme > 1 ? "s" : "") + " révisé" + (rythme > 1 ? "s" : "") + " en 4 semaines), tu couvriras environ " + projection +
        " % du programme avant le " + fmtDate(c.examen) + ". Pour tout couvrir, vise " + parSemaine + " module" + (parSemaine > 1 ? "s" : "") + " par semaine, soit environ " + heuresNecessaires + " h" +
        (heuresNecessaires > r.heures ? " (tu en prévois " + r.heures + " : augmente un peu ou concentre-toi sur les points faibles)." : " : c'est faisable avec tes " + r.heures + " h prévues."), lien: null });
    }
    // 5. régularité
    if (c.joursParSemaine < r.joursVises) reco.push({ icone: "📅", texte: "Régularité : " + c.joursParSemaine.toFixed(1).replace(".", ",") + " jour(s) d'étude par semaine sur le dernier mois. Vise " + r.joursVises + " jours, même 30 minutes.", lien: null });
    // 6. examen blanc récent ?
    var dernierQcm = c.a.qcm.map(function (t) { return t.date; }).sort().pop();
    if (!dernierQcm || (c.aujourd - new Date(dernierQcm)) / JOUR > 14) reco.push({ icone: "🎯", texte: dernierQcm ? "Pas d'examen blanc depuis plus de 2 semaines : passe une épreuve CCP chronométrée." : "Passe un premier examen blanc pour mesurer ton niveau par compétence.", lien: B + "qcm-examen/" });
    // compléments pour en avoir au moins 3
    if (reco.length < 3) reco.push({ icone: "🧠", texte: "Fais le quiz du cours en niveau Intermédiaire pour le cours en cours.", lien: B + "cours/" });
    if (reco.length < 3) reco.push({ icone: "📝", texte: "Relis la fiche de révision d'un cours terminé (révision espacée J+7 / J+30).", lien: B + "revisions/" });
    return reco.slice(0, 6);
  }

  function planning(c, points) {
    var B = base(), semaines = [];
    var tpAFaire = c.tpEtat.filter(function (t) { return !t.dernier || t.dernier.r !== "ok"; });
    var faibles = points.slice(0, 4);
    for (var i = 0; i < 4; i++) {
      var debut = new Date(c.aujourd.getTime() + i * 7 * JOUR);
      if (debut > c.examen) break;
      var taches = [];
      if (faibles[i]) taches.push({ t: faibles[i].icone + " " + faibles[i].titre, l: faibles[i].lien });
      if (tpAFaire[i]) taches.push({ t: "🛠️ Refaire le TP « " + tpAFaire[i].titre + " »", l: tpAFaire[i].page });
      taches.push(i % 2 ? { t: "🎯 Examen blanc CCP (QCM examen)", l: B + "qcm-examen/" } : { t: "🧠 Quiz du cours en cours (niveau Intermédiaire)", l: B + "cours/" });
      semaines.push({ debut: debut, taches: taches });
    }
    return semaines;
  }

  /* ------------------------------------------------------------------
   * Graphiques SVG (accessibles : titre, survol, focus clavier, tableau)
   * ------------------------------------------------------------------ */
  var NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs) { var n = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); }); return n; }

  function infobulle(carte) {
    var tip = el("div", "tdb-tip");
    tip.setAttribute("role", "status");
    carte.appendChild(tip);
    return {
      montrer: function (txt, x, y) {
        tip.textContent = txt;
        tip.classList.add("is-visible");
        var w = carte.clientWidth;
        tip.style.left = Math.min(Math.max(x, 60), w - 60) + "px";
        tip.style.top = y + "px";
      },
      cacher: function () { tip.classList.remove("is-visible"); },
    };
  }

  function survolable(noeud, txt, tip, carte) {
    noeud.setAttribute("tabindex", "0");
    noeud.setAttribute("aria-label", txt);
    function montrer() {
      var r = noeud.getBoundingClientRect(), rc = carte.getBoundingClientRect();
      tip.montrer(txt, r.left - rc.left + r.width / 2, r.top - rc.top);
    }
    noeud.addEventListener("mouseenter", montrer);
    noeud.addEventListener("focus", montrer);
    noeud.addEventListener("mouseleave", tip.cacher);
    noeud.addEventListener("blur", tip.cacher);
  }

  // courbe(s) dans le temps : séries [{ nom, cls, points: [{ x: Date, y: 0-100, txt }] }]
  function courbe(carte, series, opt) {
    var W = 640, H = 220, g = { h: 14, d: 14, b: 26, gauche: 34 };
    var xs = [];
    series.forEach(function (s) { s.points.forEach(function (p) { xs.push(+p.x); }); });
    var x0 = opt.x0 ? +opt.x0 : Math.min.apply(null, xs), x1 = opt.x1 ? +opt.x1 : Math.max.apply(null, xs);
    if (x1 - x0 < JOUR) { x0 -= JOUR; x1 += JOUR; }
    var X = function (v) { return g.gauche + (v - x0) / (x1 - x0) * (W - g.gauche - g.d); };
    var Y = function (v) { return g.h + (100 - v) / 100 * (H - g.h - g.b); };
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "tdb-svg", role: "img", "aria-label": opt.label });
    [0, 25, 50, 75, 100].forEach(function (v) {
      svg.appendChild(svgEl("line", { x1: g.gauche, x2: W - g.d, y1: Y(v), y2: Y(v), class: v === 0 ? "tdb-axe" : "tdb-grille" }));
      var t = svgEl("text", { x: g.gauche - 6, y: Y(v) + 4, class: "tdb-graduation", "text-anchor": "end" });
      t.textContent = v;
      svg.appendChild(t);
    });
    for (var i = 0; i <= 3; i++) {
      var v = x0 + (x1 - x0) * i / 3;
      var t = svgEl("text", { x: X(v), y: H - 6, class: "tdb-graduation", "text-anchor": i === 0 ? "start" : i === 3 ? "end" : "middle" });
      t.textContent = fmtCourt(new Date(v));
      svg.appendChild(t);
    }
    if (opt.seuil) {
      svg.appendChild(svgEl("line", { x1: g.gauche, x2: W - g.d, y1: Y(opt.seuil), y2: Y(opt.seuil), class: "tdb-seuil" }));
      var ts = svgEl("text", { x: W - g.d, y: Y(opt.seuil) - 5, class: "tdb-graduation", "text-anchor": "end" });
      ts.textContent = "objectif " + opt.seuil + " %";
      svg.appendChild(ts);
    }
    var tip = infobulle(carte);
    series.forEach(function (s) {
      var pts = s.points.slice().sort(function (a, b) { return a.x - b.x; });
      if (s.ligne !== false && pts.length > 1) {
        svg.appendChild(svgEl("polyline", { points: pts.map(function (p) { return X(+p.x) + "," + Y(p.y); }).join(" "), class: "tdb-ligne " + s.cls }));
      }
      if (s.marqueurs !== false) pts.forEach(function (p) {
        var grp = svgEl("g", { class: "tdb-point" });
        grp.appendChild(svgEl("circle", { cx: X(+p.x), cy: Y(p.y), r: 12, class: "tdb-cible" }));
        grp.appendChild(svgEl("circle", { cx: X(+p.x), cy: Y(p.y), r: 4.5, class: "tdb-marqueur " + s.cls }));
        survolable(grp, s.nom + " · " + fmtDate(p.x) + " · " + p.y + " %" + (p.txt ? " · " + p.txt : ""), tip, carte);
        svg.appendChild(grp);
      });
      // étiquette directe en bout de courbe
      if (pts.length && s.etiquette !== false) {
        var der = pts[pts.length - 1];
        var et = svgEl("text", { x: Math.min(X(+der.x) + 8, W - g.d), y: Y(der.y) - 8, class: "tdb-etiquette", "text-anchor": X(+der.x) > W - 90 ? "end" : "start" });
        et.textContent = s.nom + " " + der.y + " %";
        svg.appendChild(et);
      }
    });
    return svg;
  }

  // barres horizontales : [{ label, valeur (0-100) | null, sous, lien }]
  function barres(carte, items, opt) {
    var ligneH = 30, W = 640, gauche = 210, droite = 54, H = items.length * ligneH + 26;
    var X = function (v) { return gauche + v / 100 * (W - gauche - droite); };
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "tdb-svg", role: "img", "aria-label": opt.label });
    [0, 50, 100].forEach(function (v) {
      svg.appendChild(svgEl("line", { x1: X(v), x2: X(v), y1: 0, y2: H - 22, class: v === 0 ? "tdb-axe" : "tdb-grille" }));
      var t = svgEl("text", { x: X(v), y: H - 6, class: "tdb-graduation", "text-anchor": "middle" });
      t.textContent = v + " %";
      svg.appendChild(t);
    });
    if (opt.seuil) svg.appendChild(svgEl("line", { x1: X(opt.seuil), x2: X(opt.seuil), y1: 0, y2: H - 22, class: "tdb-seuil" }));
    var tip = infobulle(carte);
    items.forEach(function (it, i) {
      var y = i * ligneH + 6;
      var lab = svgEl("text", { x: gauche - 10, y: y + 13, class: "tdb-libelle", "text-anchor": "end" });
      lab.textContent = it.label.length > 30 ? it.label.slice(0, 29) + "…" : it.label;
      svg.appendChild(lab);
      var grp = svgEl("g", { class: "tdb-barre-groupe" });
      grp.appendChild(svgEl("rect", { x: gauche, y: y - 2, width: W - gauche - droite, height: ligneH - 6, class: "tdb-cible" }));
      if (it.valeur == null) {
        var vide = svgEl("text", { x: gauche + 6, y: y + 13, class: "tdb-graduation" });
        vide.textContent = "pas encore de données";
        grp.appendChild(vide);
      } else {
        var w = Math.max(4, X(it.valeur) - gauche);
        grp.appendChild(svgEl("rect", { x: gauche, y: y + 2, width: w, height: ligneH - 14, rx: 4, class: "tdb-barre" }));
        var val = svgEl("text", { x: X(it.valeur) + 6, y: y + 13, class: "tdb-valeur" });
        val.textContent = (it.valeur < opt.seuil ? "⚠ " : "") + it.valeur + " %";
        grp.appendChild(val);
      }
      survolable(grp, it.label + " · " + (it.valeur == null ? "pas encore de données" : it.valeur + " %") + (it.sous ? " · " + it.sous : ""), tip, carte);
      svg.appendChild(grp);
    });
    return svg;
  }

  // calendrier d'activité : 26 semaines, une case par jour
  function calendrier(carte, c) {
    var semaines = 26, case_ = 13, pas = 15, gauche = 26, haut = 16;
    var W = gauche + semaines * pas + 4, H = haut + 7 * pas + 4;
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, class: "tdb-svg tdb-calendrier", role: "img", "aria-label": "Calendrier d'activité des 26 dernières semaines" });
    var fin = new Date(c.aujourd);
    var lundi = new Date(fin - ((fin.getDay() + 6) % 7) * JOUR);
    var depart = new Date(lundi - (semaines - 1) * 7 * JOUR);
    ["L", "", "M", "", "V", "", "D"].forEach(function (j, i) {
      if (!j) return;
      var t = svgEl("text", { x: 0, y: haut + i * pas + 10, class: "tdb-graduation" });
      t.textContent = j;
      svg.appendChild(t);
    });
    var tip = infobulle(carte), moisPrec = -1;
    for (var s = 0; s < semaines; s++) {
      for (var j = 0; j < 7; j++) {
        var d = new Date(depart.getTime() + (s * 7 + j) * JOUR);
        if (d > fin) continue;
        if (j === 0 && d.getMonth() !== moisPrec) {
          moisPrec = d.getMonth();
          var m = svgEl("text", { x: gauche + s * pas, y: 10, class: "tdb-graduation" });
          m.textContent = d.toLocaleDateString("fr-FR", { month: "short" });
          svg.appendChild(m);
        }
        var sec = c.a.activite[iso(d)] || 0, actif = !!c.actifs[iso(d)];
        var niveau = sec >= 3600 ? 4 : sec >= 1800 ? 3 : sec >= 900 ? 2 : sec > 0 || actif ? 1 : 0;
        var rect = svgEl("rect", { x: gauche + s * pas, y: haut + j * pas, width: case_, height: case_, rx: 3, class: "tdb-jour n" + niveau });
        survolable(rect, fmtDate(d) + " · " + (sec ? fmtDuree(sec) + " d'étude" : actif ? "activité enregistrée" : "aucune activité"), tip, carte);
        svg.appendChild(rect);
      }
    }
    return svg;
  }

  function tableau(entetes, lignes) {
    var det = el("details", "tdb-donnees");
    det.appendChild(el("summary", null, "Voir les données"));
    var t = el("table");
    var tr = el("tr");
    entetes.forEach(function (h) { tr.appendChild(el("th", null, h)); });
    var th = el("thead"); th.appendChild(tr); t.appendChild(th);
    var tb = el("tbody");
    lignes.forEach(function (l) { var r = el("tr"); l.forEach(function (v) { r.appendChild(el("td", null, v)); }); tb.appendChild(r); });
    t.appendChild(tb);
    det.appendChild(t);
    return det;
  }

  function carte(titre, sous) {
    var c = el("section", "tdb-carte");
    c.appendChild(el("h3", null, titre));
    if (sous) c.appendChild(el("p", "tdb-sous", sous));
    return c;
  }

  function vide(texte) { return el("p", "tdb-vide", texte); }

  /* ------------------------------------------------------------------
   * Rendu de la page
   * ------------------------------------------------------------------ */
  var periode = "30";

  function rendre() {
    var c = calculer(), r = c.r, B = base();
    var points = pointsARevoir(c), reco = recommandations(c, points);
    racine.innerHTML = "";
    racine.classList.add("tdb");

    var entete = el("p", "tdb-intro");
    entete.textContent = (c.a.profil ? "Profil « " + (c.a.profil.nom || "sans nom") + " »" : "Aucun profil QCM : les quiz sont comptés pour ce navigateur") +
      " · calculé à partir de tes QCM, quiz, TP et de ton temps d'étude" + (window.TSSRCompte && window.TSSRCompte.connecte() ? ", synchronisé avec ton compte." : ", enregistrés dans ce navigateur.");
    racine.appendChild(entete);

    /* --- 1. indicateurs clés --- */
    var kpi = el("div", "tdb-kpi");
    function tuile(titre, valeur, detail, extra) {
      var t = el("div", "tdb-tuile");
      t.appendChild(el("span", "tdb-tuile-titre", titre));
      t.appendChild(el("strong", "tdb-tuile-valeur", valeur));
      if (detail) t.appendChild(el("span", "tdb-tuile-detail", detail));
      if (extra) t.appendChild(extra);
      kpi.appendChild(t);
    }
    // jauge de préparation : barre + repère de la progression attendue aujourd'hui
    var jauge = el("div", "tdb-jauge");
    jauge.setAttribute("role", "meter");
    jauge.setAttribute("aria-valuemin", "0"); jauge.setAttribute("aria-valuemax", "100"); jauge.setAttribute("aria-valuenow", String(c.preparation));
    jauge.setAttribute("aria-label", "Préparation " + c.preparation + " %, attendu aujourd'hui " + c.attenduAuj + " %");
    var rempli = el("span", "tdb-jauge-rempli"); rempli.style.width = c.preparation + "%"; jauge.appendChild(rempli);
    var repere = el("span", "tdb-jauge-repere"); repere.style.left = c.attenduAuj + "%"; repere.title = "Attendu aujourd'hui : " + c.attenduAuj + " %"; jauge.appendChild(repere);
    var ecart = c.preparation - c.attenduAuj;
    tuile("Préparation à l'examen", c.preparation + " %",
      (ecart >= 0 ? "✅ En avance de " + ecart + " pts" : "⚠️ " + (-ecart) + " pts sous la trajectoire") + " (attendu " + c.attenduAuj + " %)", jauge);
    tuile("Examen", "J-" + c.joursRestants, fmtDate(c.examen) + " · " + Math.ceil(c.joursRestants / 7) + " semaines");
    tuile("QCM examen", c.moyQcm == null ? "-" : Math.round(c.moyQcm) + " %", c.a.qcm.length + " épreuve" + (c.a.qcm.length > 1 ? "s" : "") + " · moyenne des 5 dernières");
    tuile("Quiz", c.moyQuiz == null ? "-" : Math.round(c.moyQuiz) + " %", c.a.quiz.length + " quiz fait" + (c.a.quiz.length > 1 ? "s" : "") + " (modules, fiches, cours)");
    tuile("TP maîtrisés", c.tpMaitrises + " / " + c.prog.tps.length, c.tpFaits + " refait" + (c.tpFaits > 1 ? "s" : "") + " au moins une fois");
    tuile("Couverture", Math.round(c.couverture) + " %", c.travailles + " module" + (c.travailles > 1 ? "s" : "") + " sur " + c.modules.length + " ouvert" + (c.travailles > 1 ? "s" : "") + " ou testé" + (c.travailles > 1 ? "s" : ""));
    tuile("Temps d'étude", fmtDuree(c.tempsTotal), fmtDuree(c.temps7) + " ces 7 derniers jours");
    tuile("Régularité", c.serie + " j", "jours d'affilée · " + c.joursParSemaine.toFixed(1).replace(".", ",") + " j/semaine (objectif " + r.joursVises + ")");
    racine.appendChild(kpi);

    var compo = el("p", "tdb-meta");
    compo.textContent = "Score de préparation = " + r.poids.resultats + " % résultats (" + Math.round(c.composantes.resultats) + ") + " + r.poids.tp + " % TP maîtrisés (" + Math.round(c.composantes.tp) + ") + " +
      r.poids.couverture + " % couverture (" + Math.round(c.composantes.couverture) + ") + " + r.poids.regularite + " % régularité (" + Math.round(c.composantes.regularite) + "). Pondérations réglables en bas de page.";
    racine.appendChild(compo);

    /* --- 2. recommandations --- */
    var cReco = carte("💡 Mes recommandations", "Calculées à partir de tes résultats, de tes TP et du temps qu'il reste.");
    var ul = el("ul", "tdb-reco");
    reco.forEach(function (x) {
      var li = el("li");
      li.appendChild(el("span", "tdb-reco-icone", x.icone));
      var span = el("span", null, x.texte + " ");
      if (x.lien) { var a = el("a", null, "Y aller →"); a.href = x.lien; span.appendChild(a); }
      li.appendChild(span);
      ul.appendChild(li);
    });
    cReco.appendChild(ul);
    racine.appendChild(cReco);

    /* --- 3. filtres + évolution --- */
    var filtres = el("div", "tdb-filtres");
    filtres.appendChild(el("span", null, "Période :"));
    [["7", "7 jours"], ["30", "30 jours"], ["tout", "Tout"]].forEach(function (f) {
      var b = el("button", "tdb-filtre", f[1]);
      b.type = "button";
      b.setAttribute("aria-pressed", String(periode === f[0]));
      b.addEventListener("click", function () { periode = f[0]; rendre(); });
      filtres.appendChild(b);
    });
    racine.appendChild(filtres);

    var grille = el("div", "tdb-grille2");
    var depuis = periode === "tout" ? null : new Date(c.aujourd - (Number(periode) - 1) * JOUR);
    var dans = function (d) { return !depuis || d >= depuis; };
    var ptsQcm = c.a.qcm.map(function (t) { return { x: new Date(t.date), y: t.pct, txt: t.cle.replace("ccp", "CCP ").replace("comp", "compétence ") }; }).filter(function (p) { return dans(p.x); });
    var ptsQuiz = [];
    c.a.quiz.forEach(function (q) { q.essais.forEach(function (e) { var d = new Date(e.d); if (dans(d)) ptsQuiz.push({ x: d, y: pctEssai(e), txt: q.titre }); }); });
    var cEvo = carte("📈 Évolution de mes scores", "Chaque point est une tentative. Survole ou parcours au clavier pour le détail.");
    if (!ptsQcm.length && !ptsQuiz.length) cEvo.appendChild(vide("Aucune tentative sur cette période."));
    else {
      var leg = el("p", "tdb-legende");
      leg.innerHTML = '<span class="tdb-pastille s1"></span>QCM examen <span class="tdb-pastille s2"></span>Quiz';
      cEvo.appendChild(leg);
      cEvo.appendChild(courbe(cEvo, [
        { nom: "QCM", cls: "s1", points: ptsQcm },
        { nom: "Quiz", cls: "s2", points: ptsQuiz, ligne: false, etiquette: false },
      ], { label: "Évolution des scores QCM et quiz", seuil: r.seuil, x0: depuis, x1: c.aujourd }));
      cEvo.appendChild(tableau(["Date", "Type", "Détail", "Score"],
        ptsQcm.map(function (p) { return [fmtDate(p.x), "QCM", p.txt, p.y + " %"]; })
          .concat(ptsQuiz.map(function (p) { return [fmtDate(p.x), "Quiz", p.txt, p.y + " %"]; }))
          .sort(function (x, y) { return x[0] < y[0] ? -1 : 1; })));
    }
    grille.appendChild(cEvo);

    // trajectoire : score réel (historique) vs cible
    var cTraj = carte("🧭 Trajectoire vers l'examen", "Ligne : progression attendue jusqu'à " + r.objectif + " % le jour de l'examen. Points : ton score de préparation.");
    var histPts = Object.keys(c.hist).sort().map(function (j) { return { x: dateDe(j), y: c.hist[j] }; });
    var cible = [{ x: c.debut, y: 0 }, { x: c.examen, y: r.objectif }];
    var legT = el("p", "tdb-legende");
    legT.innerHTML = '<span class="tdb-pastille s1"></span>Mon score <span class="tdb-pastille cible"></span>Trajectoire cible';
    cTraj.appendChild(legT);
    cTraj.appendChild(courbe(cTraj, [
      { nom: "Cible", cls: "cible", points: cible, marqueurs: false, etiquette: false },
      { nom: "Mon score", cls: "s1", points: histPts },
    ], { label: "Score de préparation comparé à la trajectoire cible", x0: c.debut, x1: c.examen }));
    cTraj.appendChild(tableau(["Date", "Mon score", "Attendu"], histPts.map(function (p) { return [fmtDate(p.x), p.y + " %", Math.round(c.attendu(p.x)) + " %"]; })));
    grille.appendChild(cTraj);
    racine.appendChild(grille);

    /* --- 4. forces et faiblesses --- */
    var grille2 = el("div", "tdb-grille2");
    var cComp = carte("🧩 Compétences du référentiel (QCM examen)", "Taux de bonnes réponses cumulé par compétence. Ligne : seuil de " + r.seuil + " %.");
    var itemsComp = Object.keys(COMPETENCES).map(function (n) {
      var x = c.comps[n];
      return { label: n + " · " + COMPETENCES[n], valeur: x && x.total ? Math.round(x.ok / x.total * 100) : null, sous: x ? x.total + " questions" : "" };
    });
    cComp.appendChild(barres(cComp, itemsComp, { label: "Taux de réussite par compétence", seuil: r.seuil }));
    cComp.appendChild(tableau(["Compétence", "Score", "Questions"], itemsComp.map(function (x) { return [x.label, x.valeur == null ? "-" : x.valeur + " %", x.sous || "0"]; })));
    grille2.appendChild(cComp);

    var parCours = {};
    c.modules.forEach(function (m) {
      parCours[m.cours] = parCours[m.cours] || { total: 0, vus: 0, scores: [] };
      parCours[m.cours].total++;
      if (m.vu) parCours[m.cours].vus++;
      if (m.scoreQuiz != null) parCours[m.cours].scores.push(m.scoreQuiz);
    });
    c.a.quiz.forEach(function (q) {
      var cle = Object.keys(parCours).filter(function (k) { return q.page.indexOf("/cours/" + k + "/") >= 0 && !/module-/.test(q.page); })[0];
      if (cle) parCours[cle].scores.push(pctEssai(q.essais[q.essais.length - 1]));
    });
    var cCours = carte("📚 Par cours (quiz)", "Moyenne des derniers essais de quiz, et modules ouverts.");
    var itemsCours = Object.keys(parCours).sort().filter(function (k) { return parCours[k].vus || parCours[k].scores.length; }).map(function (k) {
      var x = parCours[k], moy = moyenne(x.scores);
      return { label: nomCours(k), valeur: moy == null ? null : Math.round(moy), sous: x.vus + "/" + x.total + " modules ouverts" };
    });
    if (!itemsCours.length) cCours.appendChild(vide("Ouvre un module ou fais un quiz pour voir tes résultats par cours."));
    else {
      cCours.appendChild(barres(cCours, itemsCours, { label: "Score moyen des quiz par cours", seuil: r.seuil }));
      cCours.appendChild(tableau(["Cours", "Score quiz", "Modules"], itemsCours.map(function (x) { return [x.label, x.valeur == null ? "-" : x.valeur + " %", x.sous]; })));
    }
    grille2.appendChild(cCours);
    racine.appendChild(grille2);

    /* --- 5. calendrier d'activité --- */
    var cCal = carte("🗓️ Mon activité", "Temps d'étude mesuré par jour (page ouverte et active). " + c.serie + " jour" + (c.serie > 1 ? "s" : "") + " d'affilée en ce moment.");
    cCal.appendChild(calendrier(cCal, c));
    var legC = el("p", "tdb-legende tdb-echelle");
    legC.innerHTML = 'Moins <span class="tdb-jour-leg n0"></span><span class="tdb-jour-leg n1"></span><span class="tdb-jour-leg n2"></span><span class="tdb-jour-leg n3"></span><span class="tdb-jour-leg n4"></span> Plus (0 · &lt;15 min · 15-30 min · 30-60 min · 1 h et +)';
    cCal.appendChild(legC);
    var jours = Object.keys(c.a.activite).sort().reverse().slice(0, 60);
    cCal.appendChild(tableau(["Jour", "Temps d'étude"], jours.map(function (j) { return [fmtDate(dateDe(j)), fmtDuree(c.a.activite[j])]; })));
    racine.appendChild(cCal);

    /* --- 6. points à revoir --- */
    var cPts = carte("🔁 Points à revoir", "Du plus urgent au moins urgent : scores sous " + r.seuil + " %, TP à reprendre, modules non révisés depuis 30 jours.");
    if (!points.length) cPts.appendChild(vide(c.a.qcm.length || c.a.quiz.length ? "Rien sous le seuil pour l'instant 👌" : "Fais quelques quiz ou un QCM pour repérer tes points faibles."));
    else {
      var ol = el("ol", "tdb-points");
      points.slice(0, 12).forEach(function (p) {
        var li = el("li");
        li.appendChild(el("span", "tdb-reco-icone", p.icone));
        var a = el("a", null, p.titre); a.href = p.lien;
        li.appendChild(a);
        li.appendChild(el("span", "tdb-point-raison", " · " + p.raison));
        ol.appendChild(li);
      });
      cPts.appendChild(ol);
    }
    racine.appendChild(cPts);

    /* --- 7. planning suggéré --- */
    var cPlan = carte("📅 Planning suggéré (4 prochaines semaines)", "Avec " + r.heures + " h par semaine. Le planning détaillé jour par jour est dans la page Méthodologie.");
    var grillePlan = el("div", "tdb-planning");
    planning(c, points).forEach(function (s, i) {
      var col = el("div", "tdb-semaine");
      col.appendChild(el("strong", null, "Semaine " + (i + 1) + " · " + fmtCourt(s.debut)));
      var u = el("ul");
      s.taches.forEach(function (t) { var li = el("li"); var a = el("a", null, t.t); a.href = t.l; li.appendChild(a); u.appendChild(li); });
      col.appendChild(u);
      grillePlan.appendChild(col);
    });
    cPlan.appendChild(grillePlan);
    racine.appendChild(cPlan);

    /* --- 8. réglages et données --- */
    racine.appendChild(blocReglages(r));
    racine.appendChild(blocDonnees());
  }

  function blocReglages(r) {
    var det = el("details", "tdb-carte tdb-reglages");
    det.appendChild(el("summary", null, "⚙️ Réglages (date d'examen, objectifs, pondérations)"));
    var f = el("form");
    function champ(nom, label, type, valeur, attrs) {
      var l = el("label", null, label);
      var i = el("input"); i.type = type; i.name = nom; i.value = valeur;
      Object.keys(attrs || {}).forEach(function (k) { i.setAttribute(k, attrs[k]); });
      l.appendChild(i);
      f.appendChild(l);
    }
    champ("examen", "Date d'examen", "date", r.examen);
    champ("objectif", "Score visé le jour J (%)", "number", r.objectif, { min: 50, max: 100 });
    champ("seuil", "Seuil « à revoir » (%)", "number", r.seuil, { min: 30, max: 95 });
    champ("heures", "Heures d'étude par semaine", "number", r.heures, { min: 1, max: 40 });
    champ("joursVises", "Jours d'étude visés par semaine", "number", r.joursVises, { min: 1, max: 7 });
    f.appendChild(el("p", "tdb-meta", "Pondération du score de préparation (le total est ramené à 100) :"));
    champ("p_resultats", "Résultats QCM et quiz", "number", r.poids.resultats, { min: 0, max: 100 });
    champ("p_tp", "TP maîtrisés", "number", r.poids.tp, { min: 0, max: 100 });
    champ("p_couverture", "Couverture du programme", "number", r.poids.couverture, { min: 0, max: 100 });
    champ("p_regularite", "Régularité", "number", r.poids.regularite, { min: 0, max: 100 });
    var actions = el("div", "tdb-actions");
    var ok = el("button", "md-button md-button--primary", "Enregistrer"); ok.type = "submit";
    var raz = el("button", "md-button", "Valeurs par défaut"); raz.type = "button";
    actions.appendChild(ok); actions.appendChild(raz);
    f.appendChild(actions);
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = function (n) { return Number(f.elements[n].value); };
      ecrire("tssr-tableau-reglages", {
        examen: f.elements.examen.value || REGLAGES_DEFAUT.examen, objectif: v("objectif"), seuil: v("seuil"), heures: v("heures"), joursVises: v("joursVises"),
        poids: { resultats: v("p_resultats"), tp: v("p_tp"), couverture: v("p_couverture"), regularite: v("p_regularite") },
      });
      rendre();
    });
    raz.addEventListener("click", function () { localStorage.removeItem("tssr-tableau-reglages"); rendre(); });
    det.appendChild(f);
    return det;
  }

  function blocDonnees() {
    var det = el("details", "tdb-carte tdb-reglages");
    det.appendChild(el("summary", null, "🔐 Mes données (export et suppression, RGPD)"));
    det.appendChild(el("p", "tdb-meta", "Toutes tes données de révision : QCM, quiz, TP, temps d'étude, réglages. Elles restent dans ce navigateur et, si tu es connecté, sur ton compte (visible par toi seul)."));
    var actions = el("div", "tdb-actions");
    var exp = el("button", "md-button", "⬇️ Exporter mes données (JSON)");
    exp.type = "button";
    exp.addEventListener("click", function () {
      var data = { exporteLe: new Date().toISOString(), donnees: {} };
      CLES_DONNEES.forEach(function (k) { var v = localStorage.getItem(k); if (v != null) data.donnees[k] = lire(k, v); });
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "mes-donnees-tssr-" + iso(new Date()) + ".json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
    var sup = el("button", "md-button qcm-danger", "🗑️ Supprimer toutes mes données");
    sup.type = "button";
    var msg = el("p", "tdb-meta");
    sup.addEventListener("click", function () {
      var compte = window.TSSRCompte && window.TSSRCompte.connecte();
      if (!confirm("Supprimer définitivement toutes tes données de révision" + (compte ? " (dans ce navigateur ET sur ton compte)" : " de ce navigateur") + " ? Exporte-les avant si tu veux les garder.")) return;
      if (compte) {
        // le compte supprime ses lignes puis efface ce navigateur, sans renvoyer de données vides
        window.TSSRCompte.supprimerDonnees().then(rendre).catch(function (e) { msg.textContent = "⚠️ Suppression sur le compte impossible : " + e.message; });
      } else {
        CLES_DONNEES.forEach(function (k) { localStorage.removeItem(k); });
        rendre();
      }
    });
    actions.appendChild(exp); actions.appendChild(sup);
    det.appendChild(actions);
    det.appendChild(msg);
    return det;
  }

  /* ------------------------------------------------------------------
   * Le panneau
   * ------------------------------------------------------------------ */
  function creerPanneau() {
    modal = document.createElement("dialog");
    modal.className = "tdb-modal";
    modal.setAttribute("aria-labelledby", "tdb-modal-titre");
    modal.innerHTML =
      '<div class="md-typeset tdb-modal-corps">' +
      '<div class="tdb-modal-tete"><h2 id="tdb-modal-titre">📊 Mon tableau de bord</h2>' +
      '<button type="button" class="tdb-fermer" aria-label="Fermer le tableau de bord">✕</button></div>' +
      '<div class="tdb-racine"></div>' +
      '<details class="tdb-carte tdb-reglages"><summary>ℹ️ D\'où viennent les chiffres ?</summary><ul class="tdb-meta">' +
      "<li><b>Résultats</b> : moyenne de tes 5 derniers QCM examen et du dernier essai de chaque quiz (modules, fiches, cours).</li>" +
      "<li><b>TP maîtrisés</b> : TP notés « ✅ refait sans aide » dans leur bloc de suivi.</li>" +
      "<li><b>Couverture</b> : modules ouverts sur ce site ou dont tu as fait le quiz.</li>" +
      "<li><b>Régularité</b> : jours d'étude par semaine sur les 4 dernières semaines (un jour compte dès 5 minutes d'activité, ou un QCM, quiz ou TP).</li>" +
      "<li><b>Temps d'étude</b> : mesuré quand une page du site est affichée et que tu es actif.</li>" +
      "<li>Les données restent dans ce navigateur et sur ton compte (visibles par toi seul) : connecte-toi pour retrouver le même tableau de bord partout.</li>" +
      "</ul></details></div>";
    document.body.appendChild(modal);
    racine = modal.querySelector(".tdb-racine");
    modal.querySelector(".tdb-fermer").addEventListener("click", fermer);
    modal.addEventListener("click", function (e) { if (e.target === modal) fermer(); });   // clic sur le fond
    modal.addEventListener("close", function () {
      document.documentElement.classList.remove("tdb-ouvert");
      if (location.hash === "#tableau-de-bord") history.replaceState(null, "", location.pathname + location.search);
    });
  }

  function ouvrir() {
    if (!modal) creerPanneau();
    rendre();
    if (!modal.open) modal.showModal();
    document.documentElement.classList.add("tdb-ouvert");
    if (location.hash !== "#tableau-de-bord") history.replaceState(null, "", location.pathname + location.search + "#tableau-de-bord");
    modal.querySelector(".tdb-modal-corps").scrollTop = 0;
  }

  function fermer() { if (modal && modal.open) modal.close(); }

  window.TSSRTableauDeBord = { ouvrir: ouvrir, fermer: fermer };

  // ouverture directe par l'adresse …#tableau-de-bord (après l'initialisation des autres scripts)
  function auDemarrage() { if (location.hash === "#tableau-de-bord") ouvrir(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(auDemarrage, 0); });
  else setTimeout(auDemarrage, 0);
  addEventListener("hashchange", auDemarrage);
  // mise à jour si des données arrivent du compte ou d'un autre onglet
  addEventListener("storage", function (e) { if (modal && modal.open && e.key && CLES_DONNEES.indexOf(e.key) >= 0) rendre(); });
})();
