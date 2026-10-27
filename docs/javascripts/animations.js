/**
 * animations.js
 * ---------------------------------------------------------------------
 * Petits effets visuels du site (les styles sont dans animations.css) :
 *   - apparition des blocs au défilement de la page ;
 *   - cartes et couches de schéma qui arrivent en cascade ;
 *   - halo lumineux qui suit la souris sur les cartes ;
 *   - barre de progression de lecture en haut de l'écran ;
 *   - texte "tapé au clavier" dans le bandeau d'accueil.
 * Rien à modifier ici pour ajouter du contenu.
 * ---------------------------------------------------------------------
 */

(function () {
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Blocs qui apparaissent quand on les fait défiler à l'écran
  var REVEAL_SELECTOR = [
    ".md-typeset > h2",
    ".md-typeset > h3",
    ".md-typeset > .admonition",
    ".md-typeset > details",
    ".md-typeset > .highlight",
    ".md-typeset > .md-typeset__scrollwrap",
    ".md-typeset > .tabbed-set",
    ".md-typeset > .mermaid",
    ".md-typeset > .tssr-layers",
    ".md-typeset > .tssr-quiz",
    ".md-typeset .tssr-layers",
  ].join(",");

  function numberChildren(parent, childSelector) {
    parent.querySelectorAll(childSelector).forEach(function (el, i) {
      el.style.setProperty("--i", i);
    });
  }

  function setupReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("tssr-anim");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    document.querySelectorAll(REVEAL_SELECTOR).forEach(function (el) {
      if (!el.classList.contains("tssr-layers")) el.classList.add("tssr-reveal");
      observer.observe(el);
    });
  }

  function setupStagger() {
    document.querySelectorAll(".tssr-grid").forEach(function (grid) {
      numberChildren(grid, ":scope > .tssr-card");
    });
    document.querySelectorAll(".tssr-layers").forEach(function (layers) {
      numberChildren(layers, ":scope > .tssr-layer");
    });

    // Les cartes du glossaire / des commandes sont recréées à chaque filtre
    document.querySelectorAll(".tssr-result-grid").forEach(function (grid) {
      numberChildren(grid, ":scope > .tssr-result-card");
      new MutationObserver(function () {
        numberChildren(grid, ":scope > .tssr-result-card");
      }).observe(grid, { childList: true });
    });
  }

  // Halo qui suit la souris + carte qui penche vers elle (variables CSS
  // --mx/--my pour le halo, --rx/--ry pour l'inclinaison : theme.css § 5)
  function setupSpotlight() {
    var current = null;

    function flatten(card) {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    }

    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".tssr-card, .tssr-result-card");
      if (current && current !== card) flatten(current);   // la souris a quitté la carte
      current = card;
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;    // 0 à gauche → 1 à droite
      var y = (e.clientY - rect.top) / rect.height;    // 0 en haut → 1 en bas
      card.style.setProperty("--mx", e.clientX - rect.left + "px");
      card.style.setProperty("--my", e.clientY - rect.top + "px");
      if (reduceMotion) return;
      card.style.setProperty("--ry", ((x - 0.5) * 8).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 8).toFixed(2) + "deg");
    });
  }

  // Fond « salle de classe futuriste » (styles : animations.css § 1).
  // L'image glisse de quelques pixels à l'opposé de la souris : comme
  // elle est « loin » derrière les cadres, on a une impression de profondeur.
  function setupBackdrop() {
    var bg = document.createElement("div");
    bg.className = "tssr-bg";
    bg.setAttribute("aria-hidden", "true");
    bg.innerHTML = '<div class="tssr-bg__img"></div><div class="tssr-bg__veil"></div>';
    document.body.insertBefore(bg, document.body.firstChild);
    if (reduceMotion) return;

    var img = bg.firstChild;
    var pending = false;
    var x = 0, y = 0;
    document.addEventListener("pointermove", function (e) {
      x = (e.clientX / window.innerWidth - 0.5) * -24;    // de -12 px à +12 px
      y = (e.clientY / window.innerHeight - 0.5) * -16;
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {   // au plus une mise à jour par image
        img.style.setProperty("--bg-x", x.toFixed(1) + "px");
        img.style.setProperty("--bg-y", y.toFixed(1) + "px");
        pending = false;
      });
    });
  }

  function setupProgress() {
    var bar = document.createElement("div");
    bar.className = "tssr-progress";
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = "scaleX(" + ratio + ")";
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", update);
    update();
  }

  function setupTyping() {
    document.querySelectorAll(".tssr-typing[data-words]").forEach(function (el) {
      var words = el.getAttribute("data-words").split("|");
      if (reduceMotion || words.length < 2) {
        el.textContent = words[0];
        return;
      }
      var w = 0, c = 0, deleting = false;
      (function tick() {
        var word = words[w];
        c += deleting ? -1 : 1;
        el.textContent = word.slice(0, c);
        var delay = deleting ? 45 : 90;
        if (!deleting && c === word.length) {
          deleting = true;
          delay = 1600;
        } else if (deleting && c === 0) {
          deleting = false;
          w = (w + 1) % words.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      })();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupBackdrop();
    setupStagger();
    setupReveal();
    setupSpotlight();
    setupProgress();
    setupTyping();
  });
})();
