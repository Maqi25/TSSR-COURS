/**
 * quiz.js
 * ---------------------------------------------------------------------
 * Moteur de quiz réutilisable, utilisé à la fin de chaque module de cours.
 *
 * PRINCIPE :
 *   1. Dans la page du module, tu écris un <script type="application/json">
 *      contenant la liste des questions (voir cours/reseaux-bases/index.md
 *      pour un exemple concret à copier-coller).
 *   2. Un <div id="..."></div> vide sert de zone d'affichage du quiz.
 *   3. TSSRQuiz.init(...) construit les questions, gère les clics, corrige
 *      et affiche le score final.
 *   4. SUIVI : chaque correction est enregistrée pour le profil actif du
 *      QCM examen (clé tssr-quiz-suivi, synchronisée avec le compte) et
 *      l'historique s'affiche sous le quiz. Le tableau de suivi du QCM
 *      examen en fait le récapitulatif (TSSRQuiz.suivi).
 *
 * FORMAT ATTENDU pour une question :
 *   {
 *     "question": "Quel est le rôle du protocole DHCP ?",
 *     "options": ["Résoudre les noms de domaine", "Attribuer des adresses IP automatiquement", "Chiffrer le trafic"],
 *     "correctIndex": 1,
 *     "explanation": "DHCP distribue automatiquement une configuration IP aux postes du réseau."
 *   }
 * ---------------------------------------------------------------------
 */

window.TSSRQuiz = (function () {
  /* ---------- suivi des résultats, par profil du QCM examen ---------- */
  var SUIVI_KEY = "tssr-quiz-suivi";   // { idProfil: { idQuiz: { titre, page, essais: [{ d, score, total }] } } }

  function profilActif() {
    try {
      var b = JSON.parse(localStorage.getItem("tssr-qcm-examen-profils")) || {};
      var p = b.profils && (b.profils[b.actif] || b.profils[Object.keys(b.profils)[0]]);
      if (p) return { id: p.id, nom: p.nom || "Profil sans nom" };
    } catch (e) { /* pas de profil */ }
    return { id: "local", nom: "ce navigateur" };
  }
  function lireSuivi() {
    try { return JSON.parse(localStorage.getItem(SUIVI_KEY)) || {}; } catch (e) { return {}; }
  }
  function enregistrer(idQuiz, titre, score, total) {
    var tout = lireSuivi(), prof = profilActif();
    var mien = tout[prof.id] = tout[prof.id] || {};
    var q = mien[idQuiz] = mien[idQuiz] || { titre: titre, page: location.pathname, essais: [] };
    q.titre = titre; q.page = location.pathname;
    q.essais.push({ d: new Date().toISOString(), score: score, total: total });
    q.essais = q.essais.slice(-20);
    try { localStorage.setItem(SUIVI_KEY, JSON.stringify(tout)); } catch (e) { /* stockage plein */ }
    return q;
  }
  function pct(e) { return Math.round((e.score / e.total) * 100); }
  function resumeHistorique(q) {
    if (!q || !q.essais.length) return "";
    var n = q.essais.length, der = q.essais[n - 1];
    var meilleur = Math.max.apply(null, q.essais.map(pct));
    var txt = "📈 Profil « " + profilActif().nom + " » · " + n + " essai" + (n > 1 ? "s" : "") + " · meilleur " + meilleur + " %";
    if (n > 1) {
      var avant = pct(q.essais[n - 2]), maintenant = pct(der);
      txt += " · précédent " + avant + " %" + (maintenant > avant ? " ↗️" : maintenant < avant ? " ↘️" : " →");
    }
    return txt;
  }
  // pour le tableau de suivi du QCM examen
  function suivi(idProfil) { return lireSuivi()[idProfil || profilActif().id] || {}; }

  function init(options) {
    var config = Object.assign(
      { containerId: null, dataId: null, title: "Quiz", id: null, titre: null },
      options
    );
    var idQuiz = config.id || config.containerId;
    var h1 = document.querySelector(".md-content h1");
    var titreQuiz = config.titre || (h1 ? h1.textContent.replace(/¶/g, "").trim() : config.title);

    var root = document.getElementById(config.containerId);
    var dataEl = document.getElementById(config.dataId);
    if (!root || !dataEl) return;

    var questions = [];
    try {
      questions = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.error("TSSRQuiz: JSON invalide dans #" + config.dataId, e);
      root.innerHTML =
        '<p style="color:#c62828;">Erreur : le JSON de ce quiz contient une erreur de syntaxe.</p>';
      return;
    }

    var answers = new Array(questions.length).fill(null);
    var corrected = false;

    var wrap = document.createElement("div");
    wrap.className = "tssr-quiz";

    var list = document.createElement("div");
    questions.forEach(function (q, qIndex) {
      var qBlock = document.createElement("div");
      qBlock.className = "tssr-quiz-question";

      var qTitle = document.createElement("p");
      qTitle.className = "tssr-q-title";
      qTitle.textContent = (qIndex + 1) + ". " + q.question;
      qBlock.appendChild(qTitle);

      var optionsWrap = document.createElement("div");
      optionsWrap.className = "tssr-quiz-options";

      q.options.forEach(function (optionText, oIndex) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "tssr-quiz-q" + qIndex;
        input.value = oIndex;
        input.addEventListener("change", function () {
          answers[qIndex] = oIndex;
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(optionText));
        optionsWrap.appendChild(label);
      });

      qBlock.appendChild(optionsWrap);
      list.appendChild(qBlock);
    });
    wrap.appendChild(list);

    var submitBtn = document.createElement("button");
    submitBtn.className = "md-button md-button--primary tssr-quiz-submit";
    submitBtn.textContent = "Corriger le quiz";
    wrap.appendChild(submitBtn);

    var resultEl = document.createElement("div");
    resultEl.className = "tssr-quiz-result";
    wrap.appendChild(resultEl);

    var histoEl = document.createElement("p");
    histoEl.className = "tssr-quiz-histo";
    histoEl.textContent = resumeHistorique(suivi()[idQuiz]);
    wrap.appendChild(histoEl);

    function correctQuiz() {
      if (answers.indexOf(null) !== -1) {
        var ok = confirm(
          "Certaines questions n'ont pas de réponse sélectionnée. Corriger quand même ?"
        );
        if (!ok) return;
      }

      corrected = true;
      var score = 0;

      questions.forEach(function (q, qIndex) {
        var labels = list.children[qIndex].querySelectorAll(".tssr-quiz-options label");
        labels.forEach(function (label, oIndex) {
          label.classList.remove("correct", "incorrect");
          if (oIndex === q.correctIndex) {
            label.classList.add("correct");
          } else if (oIndex === answers[qIndex]) {
            label.classList.add("incorrect");
          }
          label.querySelector("input").disabled = true;
        });
        if (answers[qIndex] === q.correctIndex) score++;
        if (q.explanation) {
          var ex = document.createElement("p");
          ex.className = "tssr-quiz-expl";
          ex.textContent = "💡 " + q.explanation;
          list.children[qIndex].appendChild(ex);
        }
      });

      var pct = Math.round((score / questions.length) * 100);
      resultEl.textContent =
        "Score : " + score + " / " + questions.length + " (" + pct + " %)";
      resultEl.classList.add("show");
      histoEl.textContent = resumeHistorique(enregistrer(idQuiz, titreQuiz, score, questions.length));
      submitBtn.textContent = "Recommencer le quiz";
    }

    function resetQuiz() {
      corrected = false;
      answers = new Array(questions.length).fill(null);
      resultEl.classList.remove("show");
      resultEl.textContent = "";
      submitBtn.textContent = "Corriger le quiz";
      list.querySelectorAll(".tssr-quiz-expl").forEach(function (n) { n.remove(); });

      questions.forEach(function (q, qIndex) {
        var labels = list.children[qIndex].querySelectorAll(".tssr-quiz-options label");
        labels.forEach(function (label) {
          label.classList.remove("correct", "incorrect");
          var input = label.querySelector("input");
          input.checked = false;
          input.disabled = false;
        });
      });
    }

    submitBtn.addEventListener("click", function () {
      if (corrected) {
        resetQuiz();
      } else {
        correctQuiz();
      }
    });

    root.appendChild(wrap);
  }

  return { init: init, suivi: suivi, profilActif: profilActif };
})();
