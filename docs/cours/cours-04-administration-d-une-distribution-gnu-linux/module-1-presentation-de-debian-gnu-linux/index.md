# Module 1 : Présentation de Debian GNU/Linux

*Cours : [Cours 4 - Administration d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

- Comprendre ce qu'est **Debian** et pourquoi on l'utilise sur les **serveurs**.
- Connaître les **branches** (stable, testing, unstable) et le **cycle de vie** d'une version.
- Savoir ce que fait un **administrateur Linux**, et la différence entre **root** et **sudo**.

!!! abstract "En clair"
    Au [cours 3](../../cours-03-utilisateur-d-une-distribution-gnu-linux/index.md), tu as appris à **utiliser** Linux. Dans ce cours, tu apprends à l'**administrer** : l'installer, le configurer, créer les comptes, gérer les disques et le réseau, et le **maintenir en état de marche**. La distribution utilisée est **Debian**, réputée pour sa **stabilité** : c'est pour ça qu'on la met sur les serveurs.

## 🖼️ Résumé visuel

**Le parcours d'un logiciel dans Debian, du plus récent au plus sûr**

```mermaid
flowchart LR
    U["🧪 <b>unstable</b><br/>« Sid »<br/>tout nouveau,<br/>peut casser"] -->|"quelques jours<br/>sans bug grave"| T["🔧 <b>testing</b><br/>future version<br/>stable"]
    T -->|"tous les ~2 ans :<br/>« gel » puis sortie"| S["🛡️ <b>stable</b><br/>Debian 13 « Trixie »<br/>✅ pour les SERVEURS"]
    S -->|"la version<br/>suivante sort"| O["📦 <b>oldstable</b><br/>Debian 12 « Bookworm »<br/>encore suivie ~1 an"]
```

## 📖 Cours consolidé

### 1. Pourquoi Debian ?

- **Stable** : logiciels **très testés**, un serveur tourne des années sans souci.
- **Libre et gratuite**, développée par des **bénévoles**, sans entreprise derrière.
- **Plus de 60 000 paquets** prêts à installer.
- **Base de nombreuses distributions** (Ubuntu, Mint, Raspberry Pi OS, Kali) : ce que tu apprends ici sert partout.

---

### 2. Les branches et les versions

| Branche | Contenu | Pour qui ? |
|---|---|---|
| **stable** | Version **officielle**, testée, avec **correctifs de sécurité** | ✅ **Serveurs** |
| **testing** | La **future** stable | Tests |
| **unstable** (« Sid ») | Les logiciels **les plus récents**, peu testés | Développeurs |

| Version | Nom | En 2026 |
|---|---|---|
| Debian 11 | Bullseye | Support longue durée (LTS) seulement |
| Debian 12 | Bookworm | **oldstable** |
| **Debian 13** | **Trixie** | **stable** (août 2025) |

- 📌 Une version **tous les ~2 ans**, suivie **~3 ans + 2 ans de LTS** = **~5 ans**. Noms tirés de **Toy Story**.
- 💡 Ta version : `cat /etc/debian_version` (→ `13.1`) ou `cat /etc/os-release`.

---

### 3. Le métier d'administrateur Linux (le plan du cours)

Installer (**module 2**) · démarrage et services (**3**) · réparer (**4**) · réseau (**5**) · logiciels (**6**) · disques, LVM, systèmes de fichiers (**7 · 8 · 9**) · utilisateurs et droits (**10 · 11**) · surveiller et planifier (**12**).

---

### 4. root et sudo

On ne se connecte **pas** en root : on travaille avec **son compte** et on **emprunte les droits de root pour une commande** avec **`sudo`**.

| Méthode | Usage |
|---|---|
| **`sudo apt update`** | ✅ **Recommandé** : une commande en root, avec **ton** mot de passe (il faut être dans le groupe **`sudo`**) |
| **`su -`** (puis `exit`) | Devenir root (mot de passe **de root**) pour une longue série de commandes |

📌 `sudo` est **journalisé** (`/var/log/auth.log`, `journalctl`) : on sait **qui** a lancé **quoi**.

---

### 5. Où trouver de l'aide ?

- **`man`** / **`--help`** ([cours 3, module 3](../../cours-03-utilisateur-d-une-distribution-gnu-linux/module-3-decouverte-du-shell-et-premieres-commandes/index.md)) · **`/usr/share/doc/paquet/`**
- **wiki.debian.org** (pages en français) · **debian.org/doc** : le **manuel de l'administrateur Debian** (gratuit, en français)

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **stable** | Pour les serveurs |
| **testing** | La future stable |
| **unstable (Sid)** | Le plus récent, peut casser |
| **Debian 13** | Trixie, stable actuelle |
| **LTS** | Support longue durée (~5 ans au total) |
| **`sudo`** | Une commande avec les droits root, tracée |
| **`su -`** | Devenir root |
| **`/etc/debian_version`** | Numéro de version |

**⚠️ Les pièges**

- **unstable** n'est **jamais** pour un serveur de production.
- `sudo` demande **ton** mot de passe ; `su` demande celui de **root**.
- Un utilisateur **hors du groupe `sudo`** ne peut pas utiliser `sudo`.

??? question "1. Ton entreprise installe un nouveau serveur web. Quelle branche de Debian ?"
    **stable** (Debian 13 « Trixie ») : testée, stable, avec des mises à jour de sécurité.

??? question "2. Comment connaître la version de Debian d'un serveur ?"
    `cat /etc/debian_version`, ou `cat /etc/os-release` pour le nom complet.

??? question "3. Pourquoi utiliser sudo plutôt que se connecter en root ?"
    On ne prend les pleins pouvoirs **que pour une commande** (moins de risque d'erreur), et chaque commande `sudo` est **enregistrée** avec le nom de la personne.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-1-presentation-de-debian-gnu-linux"></div>

<script type="application/json" id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-1-presentation-de-debian-gnu-linux-data">
[
  {
    "question": "Quelle branche de Debian utilise-t-on sur un serveur de production ?",
    "options": [
      "unstable",
      "testing",
      "stable",
      "experimental"
    ],
    "correctIndex": 2,
    "explanation": "stable est la version officielle, testée, avec des mises à jour de sécurité. testing et unstable contiennent des logiciels plus récents mais moins testés."
  },
  {
    "question": "Comment s'appelle la branche unstable de Debian ?",
    "options": [
      "Buster",
      "Sid",
      "Trixie",
      "Bookworm"
    ],
    "correctIndex": 1,
    "explanation": "unstable porte toujours le nom de Sid (le garçon qui casse les jouets dans Toy Story). Trixie est Debian 13, Bookworm Debian 12."
  },
  {
    "question": "Quelle est la version stable de Debian en 2026 ?",
    "options": [
      "Debian 10 Buster",
      "Debian 11 Bullseye",
      "Debian 12 Bookworm",
      "Debian 13 Trixie"
    ],
    "correctIndex": 3,
    "explanation": "Debian 13 « Trixie » est sortie en août 2025 et c'est la version stable actuelle. Debian 12 est devenue oldstable."
  },
  {
    "question": "Quel fichier contient le numéro de version de Debian ?",
    "options": [
      "/etc/version",
      "/etc/debian_version",
      "/var/debian",
      "/boot/version"
    ],
    "correctIndex": 1,
    "explanation": "cat /etc/debian_version affiche par exemple 13.1. /etc/os-release donne des informations plus complètes."
  },
  {
    "question": "Quelle distribution très répandue est basée sur Debian ?",
    "options": [
      "Red Hat",
      "Ubuntu",
      "Fedora",
      "Arch Linux"
    ],
    "correctIndex": 1,
    "explanation": "Ubuntu (et donc Linux Mint) est basée sur Debian : on y retrouve les mêmes outils, comme apt et dpkg."
  },
  {
    "question": "Que permet la commande sudo ?",
    "options": [
      "Supprimer un utilisateur",
      "Exécuter une commande avec les droits de root, en tapant son propre mot de passe",
      "Redémarrer le serveur",
      "Changer de shell"
    ],
    "correctIndex": 1,
    "explanation": "sudo exécute une seule commande en tant que root. L'utilisateur doit appartenir au groupe sudo, et la commande est enregistrée dans les journaux."
  },
  {
    "question": "Pourquoi préfère-t-on sudo à une connexion permanente en root ?",
    "options": [
      "Parce que sudo est plus rapide",
      "Pour limiter les erreurs et garder une trace de qui a fait quoi",
      "Parce que root n'existe pas sur Debian",
      "Parce que sudo ne demande pas de mot de passe"
    ],
    "correctIndex": 1,
    "explanation": "Avec sudo, on n'a les pleins pouvoirs que pour une commande, et chaque utilisation est journalisée avec le nom de l'utilisateur."
  },
  {
    "question": "Quel mot de passe demande la commande su - ?",
    "options": [
      "Celui de l'utilisateur courant",
      "Celui de root",
      "Aucun",
      "Celui de l'administrateur Windows"
    ],
    "correctIndex": 1,
    "explanation": "su - fait devenir root et demande donc le mot de passe de root. sudo, lui, demande le mot de passe de l'utilisateur."
  },
  {
    "question": "Combien de temps une version de Debian est-elle suivie au total, avec le support LTS ?",
    "options": [
      "6 mois",
      "Environ 2 ans",
      "Environ 5 ans",
      "10 ans"
    ],
    "correctIndex": 2,
    "explanation": "Environ 3 ans de support standard, puis 2 ans de plus grâce à l'équipe Debian LTS : soit environ 5 ans."
  },
  {
    "question": "À quel rythme sort une nouvelle version stable de Debian ?",
    "options": [
      "Tous les 6 mois",
      "Environ tous les 2 ans",
      "Tous les 5 ans",
      "Chaque mois"
    ],
    "correctIndex": 1,
    "explanation": "Debian sort une version stable environ tous les 2 ans, ce qui laisse le temps de bien la tester."
  },
  {
    "question": "D'où viennent les noms de code des versions de Debian (Bookworm, Trixie…) ?",
    "options": [
      "Des personnages de Toy Story",
      "De villes françaises",
      "De planètes",
      "De races de chiens"
    ],
    "correctIndex": 0,
    "explanation": "Chaque version porte le nom d'un personnage de Toy Story : Buster, Bullseye, Bookworm, Trixie…"
  },
  {
    "question": "Quel symbole de l'invite de commande indique que tu es connecté en root ?",
    "options": [
      "$",
      ">",
      "%",
      "#"
    ],
    "correctIndex": 3,
    "explanation": "Le # signale l'administrateur root ; le $ un utilisateur normal. Un rappel visuel pour faire attention à ce qu'on tape."
  },
  {
    "question": "Comment obtenir l'aide intégrée d'une commande sous Linux ?",
    "options": [
      "help.exe commande",
      "man commande ou commande --help",
      "info.bat commande",
      "commande /?"
    ],
    "correctIndex": 1,
    "explanation": "man affiche le manuel complet, --help un résumé des options. commande /? est la syntaxe de Windows."
  },
  {
    "question": "Quelle est la version de Debian « oldstable » en 2026 ?",
    "options": [
      "Debian 13 Trixie",
      "Debian 10 Buster",
      "Debian 11 Bullseye",
      "Debian 12 Bookworm"
    ],
    "correctIndex": 3,
    "explanation": "Depuis la sortie de Debian 13 Trixie (stable), Debian 12 Bookworm est devenue oldstable : toujours suivie, mais plus la version de référence."
  },
  {
    "question": "Pourquoi Debian est-elle très utilisée sur les serveurs ?",
    "options": [
      "Elle est payante et donc mieux supportée",
      "Elle est stable, gratuite et très bien testée",
      "Elle n'a pas besoin de mises à jour",
      "Elle fonctionne uniquement avec une interface graphique"
    ],
    "correctIndex": 1,
    "explanation": "Debian est libre et gratuite, et sa branche stable privilégie la fiabilité : c'est exactement ce qu'on attend d'un serveur."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-1-presentation-de-debian-gnu-linux",
      dataId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-1-presentation-de-debian-gnu-linux-data",
    });
  });
</script>
