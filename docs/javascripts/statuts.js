/**
 * statuts.js
 * ---------------------------------------------------------------------
 * Statut de chaque cours, choisi à la main :
 *   "verrouille" → carte grisée + 🔒, le clic affiche un message au lieu
 *                  d'ouvrir le cours (cartes, menu, accueil) ;
 *   "en-cours"   → badge lumineux EN COURS ;
 *   "en-cours-ferme" → badge EN COURS 🔒, mais accès fermé comme un cours
 *                  verrouillé (le clic affiche un message) ;
 *   "termine"    → badge ✓ Terminé ;
 *   (absent de la liste ou "" → aucun badge, accès normal).
 *
 * POUR CHANGER UN STATUT : modifier la ligne du cours dans STATUTS ci-dessous.
 *
 * PAR MODULE : une ligne "dossier-du-cours/dossier-du-module" donne au module
 * son propre statut, qui passe AVANT celui du cours. Ex. pour verrouiller le
 * module 6 du cours 1 :
 *   "cours-01-bases-des-reseaux/module-6-l-adressage-ipv6": "verrouille",
 * Laisser "" = le module suit le statut de son cours. Une date d'ouverture
 * peut aussi être ajoutée au module dans OUVERTURE.
 *
 * MODE PROPRIÉTAIRE (toi) : ouvre une fois le site avec #proprio à la fin
 * de l'adresse, ex. https://maqi25.github.io/TSSR-COURS/#proprio
 * Sur cet appareil, les cours verrouillés s'ouvrent normalement pour toi
 * (le cadenas reste affiché). #visiteur à la fin de l'adresse annule.
 *
 * ⚠️ Ce verrou est un confort d'affichage, pas une sécurité : le site est
 * public, une page verrouillée reste lisible par qui connaît son adresse.
 * ---------------------------------------------------------------------
 */

window.TSSRStatuts = (function () {
  var STATUTS = {
    "cours-01-bases-des-reseaux": "termine",
    // modules du cours 1 ("" = suit le statut du cours)
    "cours-01-bases-des-reseaux/module-1-le-modele-osi": "",
    "cours-01-bases-des-reseaux/module-2-les-unites-informatiques": "",
    "cours-01-bases-des-reseaux/module-3-l-adressage-ipv4": "",
    "cours-01-bases-des-reseaux/module-4-la-communication": "",
    "cours-01-bases-des-reseaux/module-5-les-premieres-commandes": "",
    "cours-01-bases-des-reseaux/module-6-l-adressage-ipv6": "",

    "cours-02-systeme-client-microsoft": "en-cours-ferme",
    "cours-03-utilisateur-d-une-distribution-gnu-linux": "verrouille",
    "cours-04-administration-d-une-distribution-gnu-linux": "verrouille",
    "cours-05-mise-en-situation-professionnelle-systeme-client": "verrouille",
    "cours-06-sensibilisation-itil-et-gestion-de-parc": "verrouille",
    "cours-07-les-infrastructures-reseau": "verrouille",
    "cours-08-les-services-reseau-en-environnement-microsoft": "verrouille",
    "cours-09-mise-en-situation-professionnelle-services-reseau": "verrouille",
    "cours-10-initiation-au-scripting-bash": "verrouille",
    "cours-11-initiation-a-powershell": "verrouille",
    "cours-12-automatisation-et-ia-appliquees-au-support-et-au-mco": "verrouille",
    "cours-13-virtualisation-de-serveurs": "verrouille",
    "cours-14-services-cloud": "verrouille",
    "cours-15-sauvegarde-et-restauration": "verrouille",
    "cours-16-reseau-et-securite": "verrouille",
    "cours-17-supervision": "verrouille",
  };

  // Date d'ouverture affichée sur les cours verrouillés (programme officiel)
  var OUVERTURE = {
    "cours-03-utilisateur-d-une-distribution-gnu-linux": "09/11/2026",
    "cours-04-administration-d-une-distribution-gnu-linux": "16/11/2026",
    "cours-05-mise-en-situation-professionnelle-systeme-client": "30/11/2026",
    "cours-06-sensibilisation-itil-et-gestion-de-parc": "07/12/2026",
    "cours-07-les-infrastructures-reseau": "21/12/2026",
    "cours-08-les-services-reseau-en-environnement-microsoft": "11/01/2027",
    "cours-09-mise-en-situation-professionnelle-services-reseau": "25/01/2027",
    "cours-10-initiation-au-scripting-bash": "01/02/2027",
    "cours-11-initiation-a-powershell": "08/02/2027",
    "cours-12-automatisation-et-ia-appliquees-au-support-et-au-mco": "15/02/2027",
    "cours-13-virtualisation-de-serveurs": "22/02/2027",
    "cours-14-services-cloud": "01/03/2027",
    "cours-15-sauvegarde-et-restauration": "08/03/2027",
    "cours-16-reseau-et-securite": "15/03/2027",
    "cours-17-supervision": "29/03/2027",
  };

  var OWNER_KEY = "tssr-mode-proprio";
  var root = "";

  // Mode propriétaire : #proprio l'active, #visiteur le désactive (mémorisé)
  function readOwner() {
    try {
      if (location.hash === "#proprio") localStorage.setItem(OWNER_KEY, "1");
      if (location.hash === "#visiteur") localStorage.removeItem(OWNER_KEY);
      return localStorage.getItem(OWNER_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  var owner = readOwner();

  // Adresse d'une page → ["cours-04-…", "module-3-…"] (le module peut manquer), ou null
  function partsOf(href) {
    var path = new URL(href, location.href).pathname;
    if (!root || path.indexOf(root + "cours/") !== 0) return null;
    var parts = path.slice((root + "cours/").length).split("/").filter(Boolean);
    return parts.length ? parts : null;
  }

  // Statut d'une page : celui du module s'il en a un, sinon celui du cours.
  // own = true si le statut appartient à cette page elle-même (pour le badge).
  function get(href) {
    var parts = partsOf(href);
    if (!parts) return null;
    var course = parts[0];
    var moduleKey = parts[1] ? course + "/" + parts[1] : null;
    if (moduleKey && STATUTS[moduleKey]) {
      return { course: course, statut: STATUTS[moduleKey], date: OUVERTURE[moduleKey] || null, own: true, isModule: true };
    }
    return { course: course, statut: STATUTS[course] || null, date: OUVERTURE[course] || null, own: !moduleKey, isModule: !!moduleKey };
  }

  function isLocked(href) {
    var s = get(href);
    return !!(s && (s.statut === "verrouille" || s.statut === "en-cours-ferme"));
  }

  // ------------------------------------------------------------------
  // Le message affiché quand on clique sur un cours verrouillé
  // ------------------------------------------------------------------
  var toast, toastTimer;
  function showLocked(info, title) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "tssr-lock-toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.innerHTML = "";
    var icon = document.createElement("span");
    icon.className = "tssr-lock-toast-icon";
    icon.textContent = "🔒";
    var text = document.createElement("div");
    var b = document.createElement("b");
    b.textContent = title || "Ce cours est verrouillé";
    var small = document.createElement("small");
    small.textContent = info.statut === "en-cours-ferme"
      ? "Le cours a lieu en ce moment, mais l'accès est fermé pour l'instant."
      : info.date ? "Il sera disponible le " + info.date + "." : "Il n'est pas encore ouvert.";
    text.appendChild(b);
    text.appendChild(small);
    toast.appendChild(icon);
    toast.appendChild(text);
    toast.classList.remove("is-on");
    void toast.offsetWidth;              // relance l'animation d'apparition
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 3800);
  }

  // ------------------------------------------------------------------
  // Badges sur les cartes, les tuiles de l'accueil et le menu
  // ------------------------------------------------------------------
  var LABELS = { "verrouille": "🔒 Verrouillé", "en-cours": "En cours", "en-cours-ferme": "En cours 🔒", "termine": "✓ Terminé" };

  // Classes CSS d'un statut : « en cours fermé » = style « en cours » + accès fermé
  function classesOf(statut) {
    return statut === "en-cours-ferme" ? ["is-en-cours", "is-ferme"] : ["is-" + statut];
  }

  function badge(statut, date) {
    var span = document.createElement("span");
    span.className = "tssr-statut tssr-statut--" + (statut === "en-cours-ferme" ? "en-cours" : statut);
    // verrouillé avec une date : juste « 🔒 09/11/2026 » (court, ne cache pas l'icône)
    span.textContent = statut === "verrouille" && date ? "🔒 " + date : LABELS[statut];
    if (statut === "verrouille") span.title = "Verrouillé" + (date ? " jusqu'au " + date : "");
    return span;
  }

  function decorate() {
    // cartes des cours (badge seulement sur la carte du cours lui-même)
    document.querySelectorAll("a.tssr-card, a.tssr-home-module").forEach(function (a) {
      var s = get(a.href);
      if (!s || !s.statut) return;
      classesOf(s.statut).forEach(function (c) { a.classList.add(c); });
      if (s.own) a.appendChild(badge(s.statut, s.date));   // badge seulement là où le statut est posé
    });

    // menu de gauche : cours et modules
    document.querySelectorAll(".md-nav--primary a.md-nav__link").forEach(function (a) {
      var s = get(a.href);
      if (s && s.statut) classesOf(s.statut).forEach(function (c) { a.classList.add(c); });
    });

    // page d'un cours verrouillé ouverte directement par son adresse
    var here = get(location.href);
    if (here && (here.statut === "verrouille" || here.statut === "en-cours-ferme")) {
      var h1 = document.querySelector(".md-content h1");
      if (h1) {
        var banner = document.createElement("div");
        banner.className = "tssr-lock-banner";
        banner.textContent = owner
          ? "🔓 Cours verrouillé pour les visiteurs (tu le vois car tu es en mode propriétaire)."
          : here.statut === "en-cours-ferme"
            ? "🔒 Ce " + (here.isModule ? "module" : "cours") + " a lieu en ce moment, mais l'accès est fermé pour l'instant."
            : "🔒 Ce " + (here.isModule ? "module" : "cours") + " est verrouillé" + (here.date ? " : il ouvrira le " + here.date + "." : ".");
        h1.insertAdjacentElement("afterend", banner);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var logo = document.querySelector('[data-md-component="logo"]');
    if (!logo) return;
    root = new URL(logo.href, location.href).pathname;
    if (owner) document.documentElement.classList.add("tssr-proprio");
    decorate();

    // Clic sur un lien vers un cours verrouillé : message au lieu d'ouvrir
    // (capture = on intercepte le clic avant que Material ne change de page)
    document.addEventListener("click", function (e) {
      if (owner) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || !isLocked(a.href)) return;
      e.preventDefault();
      e.stopPropagation();
      var info = get(a.href);
      var title = a.querySelector(".tssr-card-title, b, .md-ellipsis");
      var suffix = info.statut === "en-cours-ferme" ? " : accès fermé" : " est verrouillé";
      showLocked(info, title ? title.textContent.trim() + suffix : null);
    }, true);
  });

  return { get: get, isLocked: isLocked, isOwner: function () { return owner; } };
})();
