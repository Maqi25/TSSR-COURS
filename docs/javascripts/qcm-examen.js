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
 * Seul le meilleur score de chaque épreuve est gardé dans le navigateur.
 * ---------------------------------------------------------------------
 */

(function () {
  var COMPETENCES = {
    1: { titre: "Exploiter l'intelligence artificielle et encadrer son usage", lien: "../revisions/fiche-ia/" },
    2: { titre: "Assurer le déploiement des équipements numériques et accompagner à l'utilisation des outils collaboratifs", lien: "../cours/cours-02-systeme-client-microsoft/module-12-introduction-a-la-capture-et-au-deploiement-d-images/" },
    3: { titre: "Apporter une assistance technique", lien: "../cours/cours-06-sensibilisation-itil-et-gestion-de-parc/" },
    4: { titre: "Exploiter un réseau IP", lien: "../cours/cours-01-bases-des-reseaux/" },
    5: { titre: "Installer et assurer l'exploitation de serveurs Windows et Linux", lien: "../cours/cours-04-administration-d-une-distribution-gnu-linux/" },
    6: { titre: "Exploiter des serveurs dans une infrastructure virtualisée", lien: "../cours/cours-13-virtualisation-de-serveurs/" },
    7: { titre: "Gérer les accès et la sécurité dans un environnement hybride", lien: "../cours/cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl/" },
    8: { titre: "Optimiser des scripts à l'aide de l'intelligence artificielle", lien: "../cours/cours-10-initiation-au-scripting-bash/" },
    9: { titre: "Assurer la continuité et la reprise de l'infrastructure", lien: "../cours/cours-15-sauvegarde-et-restauration/" },
    10: { titre: "Mettre à jour et superviser les éléments de l'infrastructure", lien: "../cours/cours-17-supervision/" },
  };

  var EPREUVES = {
    ccp1: { nom: "CCP 1 · Assurer le support aux utilisateurs", comps: [1, 2, 3], minutes: 30, nb: 20 },
    ccp2: { nom: "CCP 2 · Exploiter les éléments de l'infrastructure", comps: [4, 5, 6, 7], minutes: 45, nb: 30 },
    ccp3: { nom: "CCP 3 · Maintenir en conditions opérationnelles l'infrastructure", comps: [8, 9, 10], minutes: 45, nb: 30 },
  };

  var STORE_KEY = "tssr-qcm-examen-meilleurs";

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
  function lireMeilleurs() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function ecrireMeilleur(cle, pct) {
    try {
      var m = lireMeilleurs();
      if (m[cle] == null || pct > m[cle]) { m[cle] = pct; localStorage.setItem(STORE_KEY, JSON.stringify(m)); }
    } catch (e) { /* stockage indisponible : tant pis */ }
  }

  /* ---------- tirage des questions ---------- */
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
    return shuffle(choix).map(function (q) {
      var ordre = shuffle(q.o.map(function (_, i) { return i; }));
      return {
        c: q.c, en: !!q.en, q: q.q, e: q.e,
        o: ordre.map(function (i) { return q.o[i]; }),
        a: ordre.indexOf(q.a),
      };
    });
  }

  /* ---------- écrans ---------- */
  function init() {
    var root = document.getElementById("qcm-examen");
    var banque = window.TSSR_QCM_BANQUE;
    if (!root || !banque) return;

    var timerId = null;

    function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

    function accueil() {
      stopTimer();
      root.innerHTML = "";
      var meilleurs = lireMeilleurs();

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
      btnE.addEventListener("click", function () {
        var c = Number(select.value);
        lancer({ cle: "comp" + c, titre: "Entraînement · compétence " + c, questions: tirer(banque, [c], 10), minutes: 0 });
      });
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
    }

    function lancer(examen) {
      stopTimer();
      root.innerHTML = "";
      var reponses = new Array(examen.questions.length).fill(null);
      var nom = "qcm-" + Date.now();

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
        var score = 0, parComp = {};
        examen.questions.forEach(function (q, i) {
          var ok = reponses[i] === q.a;
          if (ok) score++;
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

        var res = el("div", "qcm-resultat");
        if (tempsEcoule) res.appendChild(el("p", "qcm-alerte", "⏰ Temps écoulé : ta copie a été rendue automatiquement."));
        res.appendChild(el("p", "qcm-score", score + " / " + examen.questions.length + " · " + pct + " %"));
        res.appendChild(el("p", null, pct >= 80 ? "Excellent, tu maîtrises ce bloc 💪" :
          pct >= 60 ? "Bonne base : revois les compétences en orange ou rouge." :
          "Il faut encore réviser : commence par les compétences en rouge."));

        var tableau = el("div", "qcm-comps");
        Object.keys(parComp).sort(function (a, b) { return a - b; }).forEach(function (c) {
          var r = parComp[c], p = Math.round((r.ok / r.total) * 100);
          var ligne = el("div", "qcm-comp " + (p >= 80 ? "is-bon" : p >= 50 ? "is-moyen" : "is-faible"));
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

        var boutons = el("div", "qcm-actions");
        var refaire = el("button", "md-button md-button--primary", "Nouveau tirage");
        refaire.addEventListener("click", function () {
          var ep = EPREUVES[examen.cle];
          var comps = ep ? ep.comps : [Number(examen.cle.replace("comp", ""))];
          lancer({ cle: examen.cle, titre: examen.titre, questions: tirer(banque, comps, examen.questions.length), minutes: examen.minutes });
        });
        var retour = el("button", "md-button", "Choisir une autre épreuve");
        retour.addEventListener("click", accueil);
        boutons.appendChild(refaire);
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
