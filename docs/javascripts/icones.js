/**
 * icones.js
 * ---------------------------------------------------------------------
 * Une icône « fun » pour chaque cours et chaque module, partout sur le site :
 *   - cartes des cours et des modules ;
 *   - tuiles « Mes modules » de l'accueil ;
 *   - menu de gauche ;
 *   - à côté du titre de la page du cours ou du module.
 *
 * Les icônes sont des Fluent Emoji (Microsoft, licence MIT) au format SVG,
 * rangées dans assets/icones/. Un SVG est un dessin vectoriel : il reste net
 * à n'importe quelle taille, même sur un écran 4K.
 *
 * POUR AJOUTER UN MODULE : ajouter une ligne dans ICONES ci-dessous
 *   "dossier-du-cours/dossier-du-module": "nom-de-l-icone",
 * puis déposer assets/icones/nom-de-l-icone.svg (sinon l'emoji d'origine reste).
 * ---------------------------------------------------------------------
 */

(function () {
  var ICONES = {
    // Cours 1 · Bases des réseaux
    "cours-01-bases-des-reseaux": "globe-with-meridians",
    "cours-01-bases-des-reseaux/module-1-le-modele-osi": "pancakes",
    "cours-01-bases-des-reseaux/module-2-les-unites-informatiques": "abacus",
    "cours-01-bases-des-reseaux/module-3-l-adressage-ipv4": "round-pushpin",
    "cours-01-bases-des-reseaux/module-4-la-communication": "speech-balloon",
    "cours-01-bases-des-reseaux/module-5-les-premieres-commandes": "keyboard",
    "cours-01-bases-des-reseaux/module-6-l-adressage-ipv6": "ringed-planet",

    // Cours 2 · Système client Microsoft
    "cours-02-systeme-client-microsoft": "desktop-computer",
    "cours-02-systeme-client-microsoft/module-1-les-systemes-d-exploitation-et-microsoft-windows-10": "window",
    "cours-02-systeme-client-microsoft/module-2-installation-de-windows-10": "optical-disk",
    "cours-02-systeme-client-microsoft/module-2bis-vmware-workstation": "nesting-dolls",
    "cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10": "computer-mouse",
    "cours-02-systeme-client-microsoft/module-4-la-gestion-du-stockage": "card-file-box",
    "cours-02-systeme-client-microsoft/module-5-les-utilisateurs-et-les-groupes": "busts-in-silhouette",
    "cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl": "locked-with-key",
    "cours-02-systeme-client-microsoft/module-7-la-gestion-du-reseau-et-du-pare-feu": "brick",
    "cours-02-systeme-client-microsoft/module-8-le-partage-de-ressources": "open-file-folder",
    "cours-02-systeme-client-microsoft/module-9-les-pilotes-et-imprimantes": "printer",
    "cours-02-systeme-client-microsoft/module-10-maintenance-du-systeme": "hammer-and-wrench",
    "cours-02-systeme-client-microsoft/module-11-aller-plus-loin-avec-powershell": "rocket",
    "cours-02-systeme-client-microsoft/module-12-introduction-a-la-capture-et-au-deploiement-d-images": "camera-with-flash",
    "cours-02-systeme-client-microsoft/module-13-les-strategies-de-groupe-locales": "bookmark-tabs",

    // Cours 3 · Utilisateur GNU/Linux
    "cours-03-utilisateur-d-une-distribution-gnu-linux": "penguin",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-1-introduction-a-unix-linux": "t-rex",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-2-decouverte-du-systeme-d-exploitation-linux": "compass",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-3-decouverte-du-shell-et-premieres-commandes": "spiral-shell",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-4-fichiers-et-dossiers-sous-linux": "file-folder",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-5-utiliser-des-fichiers-sous-linux": "page-facing-up",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-6-specificites-du-shell-bash": "sparkles",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-7-editer-du-texte-sous-linux": "memo",
    "cours-03-utilisateur-d-une-distribution-gnu-linux/module-8-mecanismes-avances-de-linux-et-bash": "gear",

    // Cours 4 · Administration GNU/Linux
    "cours-04-administration-d-une-distribution-gnu-linux": "hammer-and-wrench",
    "cours-04-administration-d-une-distribution-gnu-linux/module-1-presentation-de-debian-gnu-linux": "cyclone",
    "cours-04-administration-d-une-distribution-gnu-linux/module-2-installation-d-une-distribution-debian": "dvd",
    "cours-04-administration-d-une-distribution-gnu-linux/module-3-demarrage-d-une-distribution-debian": "rocket",
    "cours-04-administration-d-une-distribution-gnu-linux/module-4-debian-en-mode-maintenance": "adhesive-bandage",
    "cours-04-administration-d-une-distribution-gnu-linux/module-5-gestion-du-reseau": "link",
    "cours-04-administration-d-une-distribution-gnu-linux/module-6-gestion-des-paquets-logiciels": "package",
    "cours-04-administration-d-une-distribution-gnu-linux/module-7-gestion-des-espaces-de-stockage": "computer-disk",
    "cours-04-administration-d-une-distribution-gnu-linux/module-8-gestion-avancee-des-espaces-de-stockage-lvm": "building-construction",
    "cours-04-administration-d-une-distribution-gnu-linux/module-9-gestion-des-espaces-de-stockage-systemes-de-fichiers": "card-index-dividers",
    "cours-04-administration-d-une-distribution-gnu-linux/module-10-gestion-des-utilisateurs-et-des-groupes": "bust-in-silhouette",
    "cours-04-administration-d-une-distribution-gnu-linux/module-11-droits-sur-les-fichiers-et-repertoires": "old-key",
    "cours-04-administration-d-une-distribution-gnu-linux/module-12-maintenance-d-un-systeme-en-production": "toolbox",

    // Cours 5 · Mise en situation : système client
    "cours-05-mise-en-situation-professionnelle-systeme-client": "trophy",

    // Cours 6 · ITIL et gestion de parc
    "cours-06-sensibilisation-itil-et-gestion-de-parc": "admission-tickets",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-1-presentation-d-itil-et-gestion-de-parc": "books",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-2-la-gestion-des-services": "bellhop-bell",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-3-les-publications-centrales-strategie-et-conception-des-services": "bullseye",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-4-la-transition-des-services": "shuffle-tracks-button",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-5-glpi": "ticket",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-6-les-publications-centrales-exploitation-des-services": "factory",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-7-les-publications-centrales-amelioration-continue-des-services": "repeat-button",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-8-savoirs-savoir-faire-et-savoir-etre": "graduation-cap",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-9-assistance-avec-glpi": "telephone-receiver",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-10-presentation-de-l-environnement-installation-de-glpi": "inbox-tray",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-11-authentification-ad-habilitations": "identification-card",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-12-gestion-de-parc-inventaire-informatique": "clipboard",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-13-assistance-traitement-automatise-des-tickets": "incoming-envelope",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-14-les-bases-de-mysql-mariadb": "dolphin",
    "cours-06-sensibilisation-itil-et-gestion-de-parc/module-15-presentation-des-plugins-inventaire-avec-fusioninventory": "magnifying-glass-tilted-left",

    // Cours 7 · Infrastructures réseau
    "cours-07-les-infrastructures-reseau": "satellite-antenna",
    "cours-07-les-infrastructures-reseau/module-1-la-configuration-initiale-des-peripheriques": "control-knobs",
    "cours-07-les-infrastructures-reseau/module-2-la-commutation-ethernet": "electric-plug",
    "cours-07-les-infrastructures-reseau/module-3-le-routage": "world-map",
    "cours-07-les-infrastructures-reseau/module-4-les-reseaux-sans-fil": "antenna-bars",
    "cours-07-les-infrastructures-reseau/module-5-les-listes-de-controle-d-acces": "no-entry",
    "cours-07-les-infrastructures-reseau/module-6-la-traduction-d-adresses-reseau": "performing-arts",
    "cours-07-les-infrastructures-reseau/module-7-la-sauvegarde-et-la-maintenance": "nut-and-bolt",

    // Cours 8 · Services réseau Microsoft
    "cours-08-les-services-reseau-en-environnement-microsoft": "office-building",
    "cours-08-les-services-reseau-en-environnement-microsoft/module-1-administration-windows": "laptop",
    "cours-08-les-services-reseau-en-environnement-microsoft/module-2-active-directory": "classical-building",
    "cours-08-les-services-reseau-en-environnement-microsoft/module-3-les-strategies-de-groupe": "page-with-curl",
    "cours-08-les-services-reseau-en-environnement-microsoft/module-4-le-routage": "motorway",
    "cours-08-les-services-reseau-en-environnement-microsoft/module-5-le-service-dhcp": "label",
    "cours-08-les-services-reseau-en-environnement-microsoft/module-6-le-service-dns": "card-index",

    // Cours 9 · Mise en situation : services réseau
    "cours-09-mise-en-situation-professionnelle-services-reseau": "1st-place-medal",

    // Cours 10 · Scripting Bash
    "cours-10-initiation-au-scripting-bash": "scroll",
    "cours-10-initiation-au-scripting-bash/module-1-analyse": "magnifying-glass-tilted-right",
    "cours-10-initiation-au-scripting-bash/module-2-ecriture-des-scripts": "fountain-pen",
    "cours-10-initiation-au-scripting-bash/module-3-premieres-commandes-utiles-aux-scripts": "hammer",
    "cours-10-initiation-au-scripting-bash/module-4-les-variables-dans-les-scripts": "basket",
    "cours-10-initiation-au-scripting-bash/module-5-les-caracteres-speciaux-du-shell": "joker",
    "cours-10-initiation-au-scripting-bash/module-6-execution-conditionnelle": "vertical-traffic-light",
    "cours-10-initiation-au-scripting-bash/module-7-les-structures-de-boucle": "infinity",
    "cours-10-initiation-au-scripting-bash/module-8-les-fonctions": "puzzle-piece",

    // Cours 11 · PowerShell
    "cours-11-initiation-a-powershell": "high-voltage",
    "cours-11-initiation-a-powershell/module-1-decouverte-de-powershell-core": "magic-wand",
    "cours-11-initiation-a-powershell/module-2-structure-des-commandes": "triangular-ruler",
    "cours-11-initiation-a-powershell/module-3-proprietes-calculees": "input-numbers",
    "cours-11-initiation-a-powershell/module-4-passage-de-parametres": "level-slider",
    "cours-11-initiation-a-powershell/module-5-les-variables": "wrapped-gift",
    "cours-11-initiation-a-powershell/module-6-les-structures-de-controle": "joystick",
    "cours-11-initiation-a-powershell/module-7-gestion-des-erreurs": "bug",

    // Cours 12 · Automatisation et IA
    "cours-12-automatisation-et-ia-appliquees-au-support-et-au-mco": "robot",

    // Cours 13 · Virtualisation de serveurs
    "cours-13-virtualisation-de-serveurs": "milky-way",
    "cours-13-virtualisation-de-serveurs/module-1-presentation": "milky-way",
    "cours-13-virtualisation-de-serveurs/module-2-la-virtualisation-de-serveurs": "nesting-dolls",
    "cours-13-virtualisation-de-serveurs/module-2-les-applications-de-virtualisation": "window",
    "cours-13-virtualisation-de-serveurs/module-3-la-virtualisation-de-serveurs": "nesting-dolls",
    "cours-13-virtualisation-de-serveurs/module-3-les-composantes-d-une-infrastructure-vsphere": "puzzle-piece",
    "cours-13-virtualisation-de-serveurs/module-4-decouverte-d-hyper-v": "comet",
    "cours-13-virtualisation-de-serveurs/module-4-gestion-du-reseau-sous-vsphere": "link",
    "cours-13-virtualisation-de-serveurs/module-5-gestion-du-stockage-sous-vsphere": "computer-disk",
    "cours-13-virtualisation-de-serveurs/module-5-les-composants-de-l-infrastructure-vsphere": "puzzle-piece",
    "cours-13-virtualisation-de-serveurs/module-6-gestion-du-datacenter": "office-building",
    "cours-13-virtualisation-de-serveurs/module-6-la-gestion-du-reseau": "link",
    "cours-13-virtualisation-de-serveurs/module-7-la-gestion-du-stockage": "computer-disk",
    "cours-13-virtualisation-de-serveurs/module-8-la-gestion-du-datacenter": "office-building",

    // Cours 14 · Services Cloud
    "cours-14-services-cloud": "cloud",

    // Cours 15 · Sauvegarde et restauration
    "cours-15-sauvegarde-et-restauration": "floppy-disk",
    "cours-15-sauvegarde-et-restauration/module-1-concepts-enjeux-definitions": "light-bulb",
    "cours-15-sauvegarde-et-restauration/module-1-concepts-enjeux-et-definitions": "light-bulb",
    "cours-15-sauvegarde-et-restauration/module-2-types-de-sauvegarde": "card-index-dividers",
    "cours-15-sauvegarde-et-restauration/module-3-gestion-du-stockage": "file-cabinet",
    "cours-15-sauvegarde-et-restauration/module-3-stocker-les-sauvegardes": "file-cabinet",
    "cours-15-sauvegarde-et-restauration/module-4-la-redondance-des-donnees-raid": "mirror",
    "cours-15-sauvegarde-et-restauration/module-4-sauvegarder-des-machines-virtuelles": "nesting-dolls",
    "cours-15-sauvegarde-et-restauration/module-5-superviser-les-sauvegardes": "eyes",

    // Cours 16 · Réseau et sécurité
    "cours-16-reseau-et-securite": "shield",
    "cours-16-reseau-et-securite/module-1-rappels-de-notions-sur-le-reseau": "books",
    "cours-16-reseau-et-securite/module-1-securiser-les-acces-reseau": "locked-with-key",
    "cours-16-reseau-et-securite/module-2-exposer-des-services-vers-l-exterieur": "satellite",
    "cours-16-reseau-et-securite/module-2-le-pare-feu": "fire",
    "cours-16-reseau-et-securite/module-3-le-nat": "performing-arts",
    "cours-16-reseau-et-securite/module-3-les-collaborateurs-et-le-teletravail": "house-with-garden",
    "cours-16-reseau-et-securite/module-4-exposer-des-services-vers-l-exterieur": "satellite",
    "cours-16-reseau-et-securite/module-4-relier-des-sites-distants-de-maniere-securisee": "bridge-at-night",
    "cours-16-reseau-et-securite/module-5-authentifier-et-securiser-les-echanges": "key",
    "cours-16-reseau-et-securite/module-5-securiser-la-navigation-internet": "globe-showing-europe-africa",
    "cours-16-reseau-et-securite/module-6-centraliser-les-informations-de-journalisation": "ledger",
    "cours-16-reseau-et-securite/module-6-la-gestion-des-certificats": "rosette",
    "cours-16-reseau-et-securite/module-7-connecter-les-collaborateurs-pour-le-teletravail": "house-with-garden",
    "cours-16-reseau-et-securite/module-8-connecter-les-collaborateurs-entre-sites": "bridge-at-night",

    // Cours 17 · Supervision
    "cours-17-supervision": "chart-increasing",
  };

  var root = "";   // adresse de la racine du site, ex. /TSSR-COURS/

  // "/TSSR-COURS/cours/cours-01-…/module-3-…/" → nom de l'icône (ou null)
  function iconFor(href) {
    var path = new URL(href, location.href).pathname;
    if (path.indexOf(root + "cours/") !== 0) return null;
    var parts = path.slice((root + "cours/").length).split("/").filter(Boolean);
    if (!parts.length) return null;
    return ICONES[parts[0] + "/" + parts[1]] || ICONES[parts[0]] || null;
  }

  // size = taille en pixels. Elle est écrite dans l'image elle-même : même si
  // le navigateur garde une vieille version du CSS en cache, l'icône garde
  // la bonne taille (16 px dans le menu, plus grande sur les cartes).
  function makeImg(name, className, size) {
    var img = document.createElement("img");
    img.src = root + "assets/icones/" + name + ".svg";
    img.alt = "";                    // décorative : le titre à côté suffit
    img.className = className;
    img.decoding = "async";
    img.loading = "lazy";
    img.width = size;
    img.height = size;
    // si le fichier manque, on remet l'emoji d'origine
    img.addEventListener("error", function () { img.remove(); });
    return img;
  }

  // Remplace l'emoji d'un conteneur par l'icône (l'emoji revient si l'image manque)
  function swapEmoji(holder, name, className, size) {
    if (!holder || !name) return;
    var emoji = holder.textContent;
    var img = makeImg(name, className, size);
    img.addEventListener("error", function () { holder.textContent = emoji; });
    holder.textContent = "";
    holder.appendChild(img);
    holder.classList.add("has-icone");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var logo = document.querySelector('[data-md-component="logo"]');
    if (!logo) return;
    root = new URL(logo.href, location.href).pathname;

    // 1. Cartes des cours et des modules
    document.querySelectorAll("a.tssr-card").forEach(function (card) {
      swapEmoji(card.querySelector(".tssr-card-icon"), iconFor(card.href), "tssr-icone", 36);
    });

    // 2. Tuiles « Mes modules » de l'accueil
    document.querySelectorAll("a.tssr-home-module").forEach(function (tile) {
      swapEmoji(tile.querySelector(".tssr-home-micon"), iconFor(tile.href), "tssr-icone", 28);
    });

    // 3. Menu de gauche (cours et modules) : toutes petites, le texte passe avant
    document.querySelectorAll(".md-nav--primary a.md-nav__link").forEach(function (link) {
      var name = iconFor(link.href);
      if (name) link.insertBefore(makeImg(name, "tssr-icone-nav", 16), link.firstChild);
    });

    // 4. À côté du titre de la page
    var h1 = document.querySelector(".md-content h1");
    var name = iconFor(location.href);
    if (h1 && name) h1.insertBefore(makeImg(name, "tssr-icone-titre", 52), h1.firstChild);
  });
})();
