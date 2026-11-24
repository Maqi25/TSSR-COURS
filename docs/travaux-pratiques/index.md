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
    "tags": [
      "adressage",
      "sous-réseaux"
    ],
    "href": "cours-01-bases-des-reseaux/tp-plan-adressage/"
  },
  {
    "title": "TP - Gestion des paquets",
    "description": "Dépôts dans sources.list, mises à jour, installation avec « Logiciels » et apt (vim, openssh-server, terminator, cifs-utils), connexion PuTTY et configuration de vim.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "courseHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/",
    "module": "Module 6 : Gestion des paquets logiciels",
    "moduleHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-6-gestion-des-paquets-logiciels/",
    "tags": [
      "apt",
      "dépôts",
      "ssh"
    ],
    "href": "cours-04-administration-d-une-distribution-gnu-linux/tp-gestion-des-paquets/"
  },
  {
    "title": "TP - Manipuler les disques et LVM",
    "description": "Ajouter un disque de 40 Go, le partitionner avec fdisk, l'intégrer au VG, créer lvvar et agrandir lvhome.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "courseHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/",
    "module": "Module 8 : Gestion avancée des espaces de stockage - LVM",
    "moduleHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-8-gestion-avancee-des-espaces-de-stockage-lvm/",
    "tags": [
      "lvm",
      "fdisk",
      "disques"
    ],
    "href": "cours-04-administration-d-une-distribution-gnu-linux/tp-manipuler-les-disques-et-lvm/"
  },
  {
    "title": "TP - Préparation des systèmes de fichiers",
    "description": "Créer un FS ext4 étiqueté, agrandir lvhome avec resize2fs, migrer /var vers son propre LV et le monter via /etc/fstab.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "courseHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/",
    "module": "Module 9 : Gestion des espaces de stockage - Systèmes de fichiers",
    "moduleHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-9-gestion-des-espaces-de-stockage-systemes-de-fichiers/",
    "tags": ["ext4", "fstab", "resize2fs"],
    "href": "cours-04-administration-d-une-distribution-gnu-linux/tp-preparation-des-systemes-de-fichiers/"
  },
  {
    "title": "TP - Gérer les groupes et utilisateurs",
    "description": "Créer groupes et comptes avec useradd (shell, home, groupe principal et secondaires), forcer le changement de mot de passe, désactiver un compte.",
    "course": "Cours 4 - Administration d'une distribution GNU/Linux",
    "courseHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/",
    "module": "Module 10 : Gestion des utilisateurs et des groupes",
    "moduleHref": "../cours/cours-04-administration-d-une-distribution-gnu-linux/module-10-gestion-des-utilisateurs-et-des-groupes/",
    "tags": ["useradd", "groupadd", "passwd", "usermod"],
    "href": "cours-04-administration-d-une-distribution-gnu-linux/tp-gerer-les-groupes-et-utilisateurs/"
  },
  {
    "title": "TP - Conversion en binaire",
    "description": "Convertir des octets du décimal au binaire et inversement (correction type).",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": [
      "binaire",
      "conversion"
    ],
    "href": "cours-01-bases-des-reseaux/tp-conversion-en-binaire/"
  },
  {
    "title": "TP - Les classes IPv4",
    "description": "Retrouver la classe, le masque par défaut et le type (privée, publique, spéciale) d'une adresse (correction type).",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": [
      "classes",
      "adresses privées"
    ],
    "href": "cours-01-bases-des-reseaux/tp-les-classes-ipv4/"
  },
  {
    "title": "TP - Calcul d'adresses",
    "description": "Trouver l'adresse réseau, le nombre d'hôtes et l'adresse de diffusion avec les masques de classe.",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": [
      "réseau",
      "diffusion",
      "masque"
    ],
    "href": "cours-01-bases-des-reseaux/tp-calcul-d-adresses/"
  },
  {
    "title": "TP - Calcul des sous-réseaux",
    "description": "Validité CIDR, calcul de masques, découpages VLSM et recherche de segments inutilisés.",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": [
      "sous-réseaux",
      "CIDR",
      "VLSM"
    ],
    "href": "cours-01-bases-des-reseaux/tp-calcul-des-sous-reseaux/"
  },
  {
    "title": "TP - La communication",
    "description": "Qui peut communiquer avec qui selon les masques et passerelles, routes statiques minimales, résumés de routes.",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 4 : La communication",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-4-la-communication/",
    "tags": [
      "passerelle",
      "routage",
      "agrégation"
    ],
    "href": "cours-01-bases-des-reseaux/tp-la-communication/"
  },
  {
    "title": "TP - Adressage IPv6",
    "description": "Simplifier et développer des adresses IPv6.",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 6 : L'adressage IPv6",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-6-l-adressage-ipv6/",
    "tags": [
      "IPv6",
      "notation"
    ],
    "href": "cours-01-bases-des-reseaux/tp-adressage-ipv6/"
  },
  {
    "title": "TP - Prise en main de l'interface graphique",
    "description": "Mot de passe, Windows Update, nom du PC et console MMC personnalisée.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 3 : Interagir avec Windows 10",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/",
    "tags": [
      "MMC",
      "Windows 10"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-prise-en-main-de-l-interface-graphique/"
  },
  {
    "title": "TP - Prise en main de la cmd",
    "description": "help, cd, md, redirection >, type, copy et dir trié par taille.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 3 : Interagir avec Windows 10",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/",
    "tags": [
      "cmd",
      "redirection"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-prise-en-main-de-la-cmd/"
  },
  {
    "title": "TP - Premiers pas avec PowerShell",
    "description": "Version de PowerShell, Get-ChildItem, Get-Alias, Get-Content, Set-Location.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 3 : Interagir avec Windows 10",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/",
    "tags": [
      "PowerShell",
      "alias"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-premiers-pas-avec-powershell/"
  },
  {
    "title": "TP - Manipuler l'aide de PowerShell",
    "description": "Get-Help -Full / -Examples / -ShowWindow, Update-Help, rubriques about_*.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 3 : Interagir avec Windows 10",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/",
    "tags": [
      "PowerShell",
      "Get-Help"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-manipuler-l-aide-de-powershell/"
  },
  {
    "title": "TP - Devenir autonome avec PowerShell",
    "description": "Trouver une cmdlet avec Get-Command, explorer ses propriétés avec Select-Object *.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 3 : Interagir avec Windows 10",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/",
    "tags": [
      "PowerShell",
      "Get-Command"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-devenir-autonome-avec-powershell/"
  },
  {
    "title": "TP - Gérer le stockage",
    "description": "Partitions, formatage, lettres, volumes fractionnés avec la console, diskpart et PowerShell.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 4 : La gestion du stockage",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-4-la-gestion-du-stockage/",
    "tags": [
      "diskpart",
      "volumes",
      "NTFS"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-gestion-du-stockage/"
  },
  {
    "title": "TP - Gestion des utilisateurs et des groupes",
    "description": "Comptes et groupes locaux, groupes prédéfinis, net user / net localgroup, whoami, Get-LocalUser.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 5 : Les utilisateurs et les groupes",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-5-les-utilisateurs-et-les-groupes/",
    "tags": [
      "utilisateurs",
      "groupes",
      "SID"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-gestion-des-utilisateurs-et-des-groupes/"
  },
  {
    "title": "TP - Les ACL",
    "description": "Autorisations NTFS, héritage, accès effectif, Get-Acl et Set-Acl.",
    "course": "Cours 2 - Système client Microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 6 : La sécurité NTFS et les ACL",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl/",
    "tags": [
      "NTFS",
      "ACL",
      "héritage"
    ],
    "href": "cours-02-systeme-client-microsoft/tp-les-acl/"
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
