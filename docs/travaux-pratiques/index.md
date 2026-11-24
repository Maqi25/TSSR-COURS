# Travaux pratiques

Tous tes TP, classés par cours. Utilise la recherche ou le filtre "Cours" pour retrouver rapidement un TP.

<div id="tssr-tp-filter"></div>

<script type="application/json" id="tssr-tp-data">
[
  {
    "title": "TP - Plan d'adressage IP",
    "description": "Concevoir un plan d'adressage IP pour un petit réseau d'entreprise à partir d'un cahier des charges.",
    "course": "Cours 1 - Bases des réseaux",
    "tags": ["adressage", "sous-réseaux"],
    "href": "cours-01-bases-des-reseaux/tp-plan-adressage/"
  },
  {
    "title": "TP - Gestion des paquets",
    "description": "Dépôts dans sources.list, mises à jour, installation avec « Logiciels » et apt (vim, openssh-server, terminator, cifs-utils), connexion PuTTY et configuration de vim.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "tags": ["apt", "dépôts", "ssh", "module 6"],
    "href": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-6-gestion-des-paquets-logiciels/#tp-gestion-des-paquets"
  },
  {
    "title": "TP - Manipuler les disques et LVM",
    "description": "Ajouter un disque de 40 Go, le partitionner avec fdisk, l'intégrer au VG, créer lvvar et agrandir lvhome.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "tags": ["lvm", "fdisk", "disques", "module 8"],
    "href": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-8-gestion-avancee-des-espaces-de-stockage-lvm/#tp-manipuler-les-disques-et-lvm"
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRFilter.init({
      containerId: "tssr-tp-filter",
      dataId: "tssr-tp-data",
      itemLabel: "TP",
      showCourseFilter: true,
      showModuleFilter: false,
      showAlpha: true,
    });
  });
</script>

!!! tip "Ajouter un TP"
    Les TP se rédigent **directement dans le module concerné**, dans une section `## 🛠️ TP — …` placée avant le quiz. Ajoute ensuite une ligne dans le tableau JSON ci-dessus (`title`, `description`, `course`, `tags`) avec un `href` qui pointe vers cette section : `../cours/<cours>/<module>/#<ancre-du-titre>`. Détails sur la page [+ Ajouter du contenu](../ajouter-du-contenu.md).
