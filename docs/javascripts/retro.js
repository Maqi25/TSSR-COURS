/**
 * retro.js
 * ---------------------------------------------------------------------
 * Habillage « années 80 / voyage dans le temps » (styles : retro.css) :
 *   - sol en grille 3D et ciel étoilé dans le fond du site ;
 *   - sur l'accueil : grille sous le bandeau, qui penche un peu vers la souris ;
 *   - circuits temporels : DESTINATION (le stage), PRÉSENT (maintenant),
 *     DÉPART (début de la formation). Les dates sont lues dans index.md
 *     (attributs data-dest et data-depart du bloc .tssr-tc) ;
 *   - clic sur les circuits : le compteur monte jusqu'à 88, traînées de
 *     feu, éclair… et l'afficheur du présent montre la date d'arrivée.
 * Rien à modifier ici pour ajouter du contenu.
 * ---------------------------------------------------------------------
 */

(function () {
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var MOIS = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"];

  function el(tag, className) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  // Fond du site : grille + étoiles, ajoutées dans .tssr-bg (créé par animations.js)
  function setupBackdrop() {
    var bg = document.querySelector(".tssr-bg");
    if (!bg) return;
    bg.appendChild(el("div", "tssr-retro-stars"));
    bg.appendChild(el("div", "tssr-retro-floor"));
  }

  // Bandeau d'accueil : grille au sol + légère inclinaison 3D vers la souris
  function setupHero() {
    var hero = document.querySelector(".tssr-home-hero");
    if (!hero) return null;
    var floor = el("div", "tssr-retro-floor");
    floor.setAttribute("aria-hidden", "true");
    hero.insertBefore(floor, hero.firstChild);
    if (reduceMotion) return hero;

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;   // -0,5 à gauche → +0,5 à droite
      var y = (e.clientY - r.top) / r.height - 0.5;
      hero.style.setProperty("--hero-ry", (x * 4).toFixed(2) + "deg");
      hero.style.setProperty("--hero-rx", (-y * 3).toFixed(2) + "deg");
    });
    hero.addEventListener("pointerleave", function () {
      hero.style.setProperty("--hero-rx", "0deg");
      hero.style.setProperty("--hero-ry", "0deg");
    });
    return hero;
  }

  // ------------------------------------------------------------------
  // Les circuits temporels
  // ------------------------------------------------------------------
  function parseDateTime(s) {
    // "2027-04-05T08:00" → Date (heure locale)
    var m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(s || "");
    if (!m) return null;
    return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0));
  }

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  var FIELDS = [
    { label: "MOIS", ghost: "888", value: function (d) { return MOIS[d.getMonth()]; } },
    { label: "JOUR", ghost: "88", value: function (d) { return pad(d.getDate()); } },
    { label: "ANNÉE", ghost: "8888", value: function (d) { return String(d.getFullYear()); } },
    { label: "HEURE", ghost: "88", value: function (d) { return pad(d.getHours()); } },
    { label: "MIN", ghost: "88", value: function (d) { return pad(d.getMinutes()); } },
  ];

  function buildRow(kind, label) {
    var row = el("div", "tssr-tc-row is-" + kind);
    var fields = el("div", "tssr-tc-fields");
    var leds = FIELDS.map(function (f) {
      var field = el("div", "tssr-tc-field");
      var small = el("small");
      small.textContent = f.label;
      var led = el("span", "tssr-tc-led");
      led.setAttribute("data-ghost", f.ghost);
      var lit = el("span");
      led.appendChild(lit);
      field.appendChild(small);
      field.appendChild(led);
      fields.appendChild(field);
      return lit;
    });
    var tag = el("span", "tssr-tc-label");
    tag.textContent = label;
    row.appendChild(fields);
    row.appendChild(tag);
    return {
      el: row,
      label: tag,
      show: function (d) {
        FIELDS.forEach(function (f, i) { leds[i].textContent = f.value(d); });
      },
    };
  }

  function setupCircuits(hero) {
    var box = document.querySelector(".tssr-tc");
    if (!box) return;
    var dest = parseDateTime(box.dataset.dest);
    var depart = parseDateTime(box.dataset.depart);
    if (!dest || !depart) return;

    box.innerHTML = "";
    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.setAttribute("aria-label", "Circuits temporels : destination " + dest.toLocaleDateString("fr-FR") +
      ", départ " + depart.toLocaleDateString("fr-FR") + ". Appuie pour faire un saut dans le temps.");

    var rows = {
      dest: buildRow("dest", "DESTINATION · STAGE"),
      present: buildRow("present", "PRÉSENT"),
      depart: buildRow("depart", "DÉPART · DÉBUT DE FORMATION"),
    };
    box.appendChild(rows.dest.el);
    box.appendChild(rows.present.el);
    box.appendChild(rows.depart.el);

    var speed = el("span", "tssr-tc-speed");
    speed.textContent = "00 KM/H";
    var hint = el("p", "tssr-tc-hint");
    hint.textContent = "Clique pour faire un saut dans le temps ⚡";
    var foot = el("div");
    foot.style.display = "flex";
    foot.style.justifyContent = "space-between";
    foot.style.alignItems = "center";
    foot.appendChild(hint);
    foot.appendChild(speed);
    box.appendChild(foot);

    rows.dest.show(dest);
    rows.depart.show(depart);

    var arrived = false;   // pendant quelques secondes après un saut, le présent affiche la destination
    function tick() { if (!arrived) rows.present.show(new Date()); }
    tick();
    setInterval(tick, 1000);

    var jumping = false;
    function jump() {
      if (jumping) return;
      jumping = true;
      box.classList.add("is-jumping");

      function land() {
        arrived = true;
        rows.present.show(dest);
        rows.present.label.textContent = "ARRIVÉE · BON STAGE !";
        setTimeout(function () {
          arrived = false;
          rows.present.label.textContent = "PRÉSENT";
          speed.textContent = "00 KM/H";
          box.classList.remove("is-jumping");
          jumping = false;
          tick();
        }, 3500);
      }

      if (reduceMotion) { speed.textContent = "88 KM/H"; land(); return; }

      // le compteur grimpe jusqu'à 88
      var start = performance.now();
      var DURATION = 1300;
      (function step() {
        var t = Math.min((performance.now() - start) / DURATION, 1);
        speed.textContent = pad(Math.round(88 * t * t)) + " KM/H";
        if (t < 1) { requestAnimationFrame(step); return; }

        // traînées de feu sur la grille + secousse + éclair
        if (hero) {
          [10, 16].forEach(function (b, i) {
            var trail = el("span", "tssr-retro-trail");
            trail.style.setProperty("--b", b + "%");
            trail.style.animationDelay = i * 60 + "ms";
            hero.appendChild(trail);
            setTimeout(function () { trail.remove(); }, 1200);
          });
          hero.classList.remove("is-shaking");
          void hero.offsetWidth;
          hero.classList.add("is-shaking");
        }
        var r = box.getBoundingClientRect();
        var flash = el("div", "tssr-retro-flash");
        flash.style.setProperty("--fx", r.left + r.width / 2 + "px");
        flash.style.setProperty("--fy", r.top + r.height / 2 + "px");
        setTimeout(function () {
          document.body.appendChild(flash);
          setTimeout(function () { flash.remove(); }, 1000);
          land();
        }, 350);
      })();
    }

    box.addEventListener("click", jump);
    box.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jump(); }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupBackdrop();
    setupCircuits(setupHero());
  });
})();
