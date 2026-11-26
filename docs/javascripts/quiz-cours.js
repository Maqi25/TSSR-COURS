/**
 * quiz-cours.js
 * ---------------------------------------------------------------------
 * « Quiz du cours » : sur la page d'accueil de chaque cours, 3 boutons
 * (optionnels) lancent un quiz tiré au hasard parmi les quiz de TOUS les
 * modules du cours : Débutant (10 q.), Intermédiaire (15 q., 15 min),
 * Confirmé (25 q., 20 min, copie rendue à la fin du temps).
 *
 * PRINCIPE :
 *   - on repère les cartes des modules (.tssr-grid a.tssr-card) ;
 *   - au clic, on télécharge les pages des modules et on y lit le JSON
 *     de leur quiz (<script type="application/json" id="quiz-…-data">) ;
 *   - on tire 15 questions en répartissant entre les modules, on mélange
 *     les réponses, puis on affiche le quiz avec le moteur quiz.js
 *     (score, explications et suivi par profil compris).
 * Rien à écrire pour ajouter un cours : il suffit que ses modules aient un quiz.
 * ---------------------------------------------------------------------
 */
(function () {
  "use strict";

  // 3 niveaux : la difficulté vient du nombre de questions et du temps imparti
  var NIVEAUX = {
    debutant:      { nom: "🟢 Débutant",      nb: 10, minutes: 0,  seuil: 50, aide: "10 questions, sans chrono : prends ton temps." },
    intermediaire: { nom: "🟠 Intermédiaire", nb: 15, minutes: 15, seuil: 70, aide: "15 questions en 15 min : le rythme de l'examen." },
    confirme:      { nom: "🔴 Confirmé",      nb: 25, minutes: 20, seuil: 80, aide: "25 questions en 20 min, copie rendue à la fin du temps. 80 % pour valider." },
  };

  function melanger(t) {
    var a = t.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var x = a[i]; a[i] = a[j]; a[j] = x;
    }
    return a;
  }

  // questions du quiz d'une page de module
  function lireModule(url) {
    return fetch(url).then(function (r) { return r.ok ? r.text() : ""; }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, "text/html");
      var qs = [];
      doc.querySelectorAll('script[type="application/json"][id^="quiz-"]').forEach(function (s) {
        try {
          JSON.parse(s.textContent).forEach(function (q) {
            if (q && q.question && Array.isArray(q.options) && q.options[q.correctIndex] !== undefined) qs.push(q);
          });
        } catch (e) { /* JSON invalide : on ignore ce module */ }
      });
      return qs;
    }).catch(function () { return []; });
  }

  // tirage équilibré : on prend à tour de rôle dans chaque module
  function tirer(parModule, NB) {
    var piles = parModule.map(melanger).filter(function (p) { return p.length; });
    piles = melanger(piles);
    var choix = [];
    while (choix.length < NB && piles.some(function (p) { return p.length; })) {
      piles.forEach(function (p) { if (p.length && choix.length < NB) choix.push(p.pop()); });
    }
    // réponses mélangées, bonne réponse recalculée
    return melanger(choix).map(function (q) {
      var ordre = melanger(q.options.map(function (_, i) { return i; }));
      return {
        question: q.question,
        options: ordre.map(function (i) { return q.options[i]; }),
        correctIndex: ordre.indexOf(q.correctIndex),
        explanation: q.explanation || "",
      };
    });
  }

  function init() {
    var grille = document.querySelector(".md-content .tssr-grid");
    if (!grille || !/\/cours\/[^/]+\/$/.test(location.pathname)) return;
    var liens = Array.prototype.filter.call(grille.querySelectorAll("a.tssr-card[href]"), function (a) {
      return /module-/.test(a.getAttribute("href"));
    });
    if (!liens.length) return;

    var h1 = document.querySelector(".md-content h1");
    var nomCours = h1 ? h1.textContent.replace(/¶/g, "").trim() : "ce cours";
    var idCours = "quiz-cours-" + location.pathname.replace(/\/$/, "").split("/").pop();

    var bloc = document.createElement("div");
    bloc.className = "tssr-quiz-cours";
    bloc.innerHTML =
      '<div class="tssr-quiz-cours-tete"><strong>🎯 Quiz du cours</strong>' +
      "<p>Optionnel : des questions tirées au hasard parmi les quiz de tous les modules, pour réviser le cours d'un coup. Choisis ton niveau :</p></div>" +
      '<div class="tssr-quiz-cours-niveaux"></div>' +
      '<div class="tssr-quiz-cours-zone"></div>';
    grille.parentNode.insertBefore(bloc, grille.nextSibling);

    var choix = bloc.querySelector(".tssr-quiz-cours-niveaux");
    var zone = bloc.querySelector(".tssr-quiz-cours-zone");
    var cache = null;      // questions des modules, chargées une seule fois
    var chrono = null;

    Object.keys(NIVEAUX).forEach(function (cle) {
      var n = NIVEAUX[cle];
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tssr-quiz-niveau is-" + cle;
      b.innerHTML = "<b>" + n.nom + "</b><span>" + n.aide + "</span>";
      b.addEventListener("click", function () { lancer(cle, b); });
      choix.appendChild(b);
    });

    function lancer(cle, bouton) {
      var niv = NIVEAUX[cle];
      var boutons = choix.querySelectorAll("button");
      boutons.forEach(function (x) { x.disabled = true; x.classList.toggle("is-actif", x === bouton); });
      clearInterval(chrono);
      zone.innerHTML = "<p class='tssr-quiz-cours-info'>Chargement des questions…</p>";
      var charge = cache ? Promise.resolve(cache) : Promise.all(liens.map(function (a) { return lireModule(a.href); }));
      charge.then(function (parModule) {
        cache = parModule;
        var questions = tirer(parModule, niv.nb);
        zone.innerHTML = "";
        if (!questions.length) {
          zone.textContent = "Aucun quiz trouvé dans les modules de ce cours pour l'instant.";
          return;
        }
        var total = parModule.reduce(function (n, p) { return n + p.length; }, 0);
        var info = document.createElement("p");
        info.className = "tssr-quiz-cours-info";
        info.textContent = niv.nom + " · " + questions.length + " questions tirées parmi " + total +
          " · objectif " + niv.seuil + " %" + (niv.minutes ? " · ⏱️ " + niv.minutes + " min" : "");
        zone.appendChild(info);

        var id = idCours + "-" + cle;
        var cible = document.createElement("div");
        cible.id = id;
        var data = document.createElement("script");
        data.type = "application/json";
        data.id = id + "-data";
        data.textContent = JSON.stringify(questions);
        zone.appendChild(cible);
        zone.appendChild(data);
        window.TSSRQuiz.init({ containerId: id, dataId: data.id, id: id, titre: "Quiz du cours (" + niv.nom.replace(/^\S+ /, "") + ") · " + nomCours });

        var valider = cible.querySelector(".tssr-quiz-submit");
        // verdict par rapport à l'objectif du niveau, à chaque correction
        valider.addEventListener("click", function () {
          setTimeout(function () {
            var res = cible.querySelector(".tssr-quiz-result");
            var m = res && res.textContent.match(/\((\d+) %\)/);
            if (!m || res.querySelector(".tssr-quiz-verdict")) return;
            clearInterval(chrono);
            var v = document.createElement("span");
            v.className = "tssr-quiz-verdict";
            v.textContent = Number(m[1]) >= niv.seuil ? " ✅ Objectif atteint" : " · objectif " + niv.seuil + " % pas encore atteint";
            res.appendChild(v);
          }, 0);
        });

        // chrono (niveaux intermédiaire et confirmé)
        if (niv.minutes) {
          var reste = niv.minutes * 60;
          var horloge = document.createElement("p");
          horloge.className = "tssr-quiz-chrono";
          info.after(horloge);
          var tic = function () {
            horloge.textContent = "⏱️ " + Math.floor(reste / 60) + ":" + String(reste % 60).padStart(2, "0");
            horloge.classList.toggle("is-urgent", reste <= 60);
            if (reste-- <= 0) {
              clearInterval(chrono);
              horloge.textContent = "⏰ Temps écoulé : copie rendue.";
              var confirmer = window.confirm;
              window.confirm = function () { return true; };   // pas de question sur les réponses vides
              if (valider.textContent.indexOf("Corriger") === 0) valider.click();
              window.confirm = confirmer;
            }
          };
          tic();
          chrono = setInterval(tic, 1000);
        }
        cible.scrollIntoView({ behavior: "smooth", block: "start" });
      }).finally(function () {
        boutons.forEach(function (x) { x.disabled = false; });
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
