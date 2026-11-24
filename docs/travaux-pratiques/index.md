# Travaux pratiques

Tous tes TP, rangés par **cours** puis par **module**. Utilise la recherche ou les filtres « Cours » et « Module » pour retrouver rapidement un TP.

<div id="tssr-tp-filter"></div>

<script type="application/json" id="tssr-tp-data">
[
  {
    "title": "TP - Plan d'adressage IP",
    "description": "Concevoir un plan d'adressage IP pour un petit réseau d'entreprise à partir d'un cahier des charges.",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": ["adressage", "sous-réseaux"],
    "href": "cours-01-bases-des-reseaux/tp-plan-adressage/"
  },
  {
    "title": "TP - Gestion des paquets",
    "description": "Dépôts dans sources.list, mises à jour, installation avec « Logiciels » et apt (vim, openssh-server, terminator, cifs-utils), connexion PuTTY et configuration de vim.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "courseHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/",
    "module": "Module 6 : Gestion des paquets logiciels",
    "moduleHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-6-gestion-des-paquets-logiciels/",
    "tags": ["apt", "dépôts", "ssh"],
    "href": "cours-04-administration-d-une-distribution-gnu-linux/tp-gestion-des-paquets/"
  },
  {
    "title": "TP - Manipuler les disques et LVM",
    "description": "Ajouter un disque de 40 Go, le partitionner avec fdisk, l'intégrer au VG, créer lvvar et agrandir lvhome.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "courseHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/",
    "module": "Module 8 : Gestion avancée des espaces de stockage - LVM",
    "moduleHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-8-gestion-avancee-des-espaces-de-stockage-lvm/",
    "tags": ["lvm", "fdisk", "disques"],
    "href": "cours-04-administration-d-une-distribution-gnu-linux/tp-manipuler-les-disques-et-lvm/"
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
      showModuleFilter: true,
      showAlpha: false,
      groupByCourseModule: true,
    });
  });
</script>

!!! tip "Ajouter un TP"
    Crée la page du TP dans `docs/travaux-pratiques/<cours>/tp-nom-du-tp.md` et ajoute-la au menu dans `mkdocs.yml`, sous son cours. Ajoute ensuite un bloc dans le tableau JSON ci-dessus avec `title`, `description`, `course` + `courseHref`, `module` + `moduleHref`, `tags`, et `href` : `<cours>/tp-nom-du-tp/`. Le TP se range tout seul sous son cours et son module. Détails sur la page [+ Ajouter du contenu](../ajouter-du-contenu.md).
