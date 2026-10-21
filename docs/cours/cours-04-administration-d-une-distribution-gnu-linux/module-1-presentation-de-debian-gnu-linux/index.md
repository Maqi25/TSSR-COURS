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

| Atout | En clair |
|---|---|
| **Stabilité** | Les logiciels sont **très testés** avant d'arriver en « stable » : un serveur peut tourner des années sans souci |
| **Gratuite et libre** | 100 % logiciel libre, pas de licence à payer |
| **Énorme catalogue** | Plus de **60 000 paquets** (logiciels prêts à installer) |
| **Base de nombreuses distributions** | **Ubuntu**, Linux Mint, Raspberry Pi OS, Kali… sont basées sur Debian : ce que tu apprends ici sert partout |
| **Communauté** | Développée par des milliers de bénévoles, sans entreprise derrière |

---

### 2. Les branches et les versions

| Branche | Contenu | Pour qui ? |
|---|---|---|
| **stable** | La version **officielle**, testée, avec mises à jour de **sécurité** | ✅ **Serveurs, production** |
| **testing** | La **future** stable, en préparation | Tests, curieux |
| **unstable** (« Sid ») | Les logiciels **les plus récents**, peu testés | Développeurs |

| Version | Nom | État en 2026 |
|---|---|---|
| Debian 11 | Bullseye | Fin du support standard, support longue durée (LTS) seulement |
| Debian 12 | Bookworm | **oldstable** |
| **Debian 13** | **Trixie** | **stable** (sortie en août 2025) |

📌 Une nouvelle version sort **environ tous les 2 ans**. Chacune est suivie **environ 3 ans**, puis **2 ans de plus** grâce à l'équipe **Debian LTS**, soit **~5 ans** au total. Les noms viennent des personnages de **Toy Story**.

💡 Connaître sa version : `cat /etc/debian_version` (→ `13.1`) ou `cat /etc/os-release`.

---

### 3. Le métier d'administrateur Linux

| Tâche | Module |
|---|---|
| Installer le système | 2 |
| Comprendre le démarrage, gérer les services | 3 |
| Réparer un système qui ne démarre plus | 4 |
| Configurer le réseau | 5 |
| Installer et mettre à jour des logiciels | 6 |
| Gérer les disques, LVM, systèmes de fichiers | 7 · 8 · 9 |
| Gérer les utilisateurs et les droits | 10 · 11 |
| Surveiller, planifier, lire les journaux | 12 |

---

### 4. root et sudo

!!! abstract "En clair"
    **root** est le compte **tout-puissant**. Plutôt que de se connecter en root (dangereux), on travaille avec **son propre compte** et on **emprunte les droits de root pour une seule commande** grâce à **`sudo`**. On garde ainsi une **trace** de qui a fait quoi, et on évite les erreurs.

| Méthode | Commande | Usage |
|---|---|---|
| **sudo** | `sudo apt update` | ✅ **Recommandé** : une commande en root, avec **ton** mot de passe. Il faut être dans le groupe **`sudo`** |
| **su -** | `su -` (puis `exit`) | Devenir root (mot de passe de **root**). Pratique pour une longue série de commandes |

📌 `sudo` est enregistré dans les journaux (`/var/log/auth.log` ou `journalctl`) : on sait **qui** a lancé **quoi**.

---

### 5. Où trouver de l'aide ?

| Source | Contenu |
|---|---|
| `man commande` / `commande --help` | L'aide intégrée ([cours 3, module 3](../../cours-03-utilisateur-d-une-distribution-gnu-linux/module-3-decouverte-du-shell-et-premieres-commandes/index.md)) |
| **wiki.debian.org** | Le wiki officiel, avec des pages en français |
| **debian.org/doc** | Le **manuel de l'administrateur Debian** (gratuit, en français) |
| `/usr/share/doc/paquet/` | La documentation installée avec chaque logiciel |

## ✅ Points clés à retenir

- **Debian** : libre, gratuite, **très stable** → idéale pour les **serveurs** ; base d'Ubuntu et de beaucoup d'autres.
- Branches : **stable** (production) · **testing** (future stable) · **unstable / Sid** (le plus récent).
- Version actuelle : **Debian 13 « Trixie »** ; une version tous les **~2 ans**, suivie **~5 ans** (avec LTS).
- Version installée : **`cat /etc/debian_version`**.
- **root** = tout-puissant ; on préfère **`sudo commande`** (groupe `sudo`, commande tracée) à `su -`.

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
