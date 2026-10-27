# Module 3 : Découverte du shell et premières commandes

*Cours : [Cours 3 - Utilisateur d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

À la fin de ce module, tu sais :

- répondre à **« qui suis-je ? »** (`logname`, `id`, `who`, `w`) et **« où suis-je ? »** (`pwd`, `tty`) ;
- changer ton **mot de passe** (`passwd`) ;
- afficher la **date** et le **calendrier** ;
- créer et lire une **variable**, et connaître les **variables d'environnement** (`$HOME`, `$PATH`…) ;
- gagner du temps avec l'**historique**, l'**autocomplétion** ++tab++ et l'**aide** (`--help`, `man`).

!!! abstract "En clair"
    Ce module est ta **trousse de survie** dans le terminal : savoir **qui tu es**, **où tu es**, **retrouver une commande déjà tapée**, et surtout **trouver de l'aide tout seul**. Avec `man` et `--help`, tu n'as pas besoin de tout retenir par cœur.

## 🖼️ Résumé visuel

**Les questions que tu te poses → la commande qui répond**

```mermaid
flowchart LR
    Q1["👤 Qui suis-je ?"] --> C1["logname · id"]
    Q2["👥 Qui est connecté ?"] --> C2["who · w"]
    Q3["📍 Où suis-je ?"] --> C3["pwd · tty"]
    Q4["🕐 Quelle heure ?<br/>Depuis quand ça tourne ?"] --> C4["date · cal · uptime"]
    Q5["🔁 Qu'est-ce que j'ai tapé ?"] --> C5["history · ↑ · !!"]
    Q6["❓ Comment ça marche ?"] --> C6["commande --help<br/>man commande"]
```

## 📖 Cours consolidé

### 1. Root : l'administrateur tout-puissant

**root** peut **tout** faire, y compris tout casser. Son prompt finit par **`#`** (utilisateur normal : **`$`**).

⚠️ **Jamais** root au quotidien : son compte normal, puis **`sudo`** quand c'est nécessaire ([cours 4](../../cours-04-administration-d-une-distribution-gnu-linux/index.md)). **Pas de SSH direct en root** (interdit par défaut sous Debian).

---

### 2. Qui suis-je, qui est là ?

| Commande | Répond à… | Exemple |
|---|---|---|
| **`logname`** | Mon nom | `user30` |
| **`id`** | Mon **UID**, mon **GID** et mes **groupes** | `uid=1031(user01) gid=1031(user01) groupes=…,1002(tssr)` |
| `id -u` · `-g` · `-G` | Seulement UID · GID · groupes ; `id -u user5` = UID d'un autre | `1031` |
| **`who`** / **`w`** | Qui est connecté / **plus** ce qu'il fait et la charge | `user30  pts/0  …` |
| **`uptime`** | Depuis **combien de temps** la machine tourne | `up 12 days, 3:14` |
| **`passwd`** | **Changer** mon mot de passe (`-S` = son état) | |

💡 **UID / GID** = l'équivalent Linux du **SID** de Windows : Linux travaille avec ces **numéros**.

---

### 3. Où suis-je ?

- **`pwd`** : dans quel **dossier** je suis (`/home/user30`).
- **`tty`** : quel **terminal** (`/dev/tty1` = console · `/dev/pts/0` = SSH ou fenêtre).
- 📌 **`~`** dans le prompt (`user30@deb:~$`) = **mon dossier personnel**.

---

### 4. Date et calendrier

| Commande | Effet |
|---|---|
| `date` | Date et heure actuelles |
| `date +"%d/%m/%Y"` | Format perso : `21/10/2026` |
| `date +"%Y-%m-%d_%H%M"` | Pour **nommer un fichier** : `2026-10-21_1420` |
| `cal` · `cal 03 2027` · `cal 2027` | Calendrier du mois · d'un mois · d'une année |

Codes : **`%d`** jour · **`%m`** mois · **`%Y`** année · **`%H`** heure · **`%M`** minutes · **`%S`** secondes · **`%A`** / **`%B`** jour / mois en lettres.

---

### 5. Les variables

Une **boîte avec une étiquette** : **remplir** avec `nom=contenu` (**sans `$`, sans espaces**), **lire** avec **`$nom`**.

```bash
prenom="Sophie"            # créer (pas d'espace autour du = !)
echo "Bonjour $prenom"     # → Bonjour Sophie
unset prenom               # supprimer
```

⚠️ `prenom = "Sophie"` (avec espaces) **échoue** : Bash prend `prenom` pour une commande.

**Variables d'environnement** (automatiques, en **MAJUSCULES**, sensibles à la casse) :

| Variable | Contient |
|---|---|
| **`$HOME`** | Mon dossier personnel (= `~`) |
| **`$USER`** | Mon nom d'utilisateur |
| **`$PATH`** | Les dossiers où Linux **cherche les commandes** |
| **`$SHELL`** · **`$PWD`** · **`$LANG`** | Mon shell · le dossier actuel · la langue |

- `env` = variables d'environnement · `set` = **toutes** les variables (très long).
- 💡 Grâce à **`$PATH`**, on tape `ls` au lieu de `/usr/bin/ls`. « Commande introuvable » = absente de tous ces dossiers.

---

### 6. Aller plus vite

| Raccourci | Effet |
|---|---|
| ++arrow-up++ / ++arrow-down++ | Parcourir les commandes déjà tapées |
| **`history`** | Liste numérotée (enregistrée dans **`~/.bash_history`**) |
| **`!!`** · `!73` · `!ssh` | Relancer la dernière · la n° 73 · la dernière commençant par « ssh » |
| ++ctrl+r++ | **Rechercher** dans l'historique |
| ++tab++ | **Compléter** (commande, fichier, variable) ; ++tab++ ++tab++ = **lister** les choix |

⚠️ Jamais de **mot de passe** dans une commande : il resterait dans l'historique. ✅ Utilise ++tab++ **tout le temps**.

**L'aide** : **`commande --help`** (résumé) · **`man commande`** (manuel complet) · `help cd` (commandes intégrées à Bash).

- Dans `man` : ++space++ défiler · **`/mot`** chercher · **`n`** suivant · **`q`** quitter.
- Sections : **1** = commandes · **5** = fichiers de configuration · **8** = administration. Ex. `man 5 passwd` = le **fichier** `/etc/passwd`.

## 📝 Fiche de révision

### 🧠 Les commandes du module

| Commande | Rôle |
|---|---|
| `logname` | Mon nom d'utilisateur |
| `id` | UID, GID, groupes |
| `who` / `w` | Qui est connecté (+ détails) |
| `uptime` | Depuis quand la machine tourne |
| `passwd` | Changer mon mot de passe |
| `pwd` | Mon dossier actuel |
| `tty` | Mon terminal |
| `date` / `cal` | Date / calendrier |
| `env` | Variables d'environnement |
| `unset nom` | Supprimer une variable |
| `history` / `!!` | Historique / relancer la dernière |
| `man` / `--help` | Aide |

### ⚠️ Les pièges

- `nom = valeur` avec des espaces → **erreur**. Écrire `nom=valeur`.
- **`$` pour lire**, **pas de `$` pour créer**.
- `$home` ≠ `$HOME` : la casse compte.
- Pour **quitter `man`** : la touche **`q`**.
- `man passwd` = la **commande** ; `man 5 passwd` = le **fichier**.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Affiche la date sous la forme 21-10-2026."
    ```bash
    date +"%d-%m-%Y"
    ```

??? question "2. Crée une variable ville contenant « Nantes », puis affiche « J'habite à Nantes » en l'utilisant."
    ```bash
    ville="Nantes"
    echo "J'habite à $ville"
    ```

??? question "3. Tu as tapé une longue commande ssh il y a 20 minutes. Comment la relancer sans la retaper ?"
    Plusieurs solutions :

    - `!ssh` relance la dernière commande commençant par « ssh » ;
    - ++ctrl+r++, puis taper `ssh`, puis Entrée ;
    - `history`, repérer son numéro (ex. 42), puis `!42`.

??? question "4. Comment connaître ton UID et la liste de tes groupes ?"
    `id` (ou `id -u` pour l'UID seul, `id -G` pour les groupes seuls).

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes"></div>

<script type="application/json" id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes-data">
[
  {
    "question": "Par quel caractère se termine généralement le prompt d'un utilisateur standard, par opposition au compte root ?",
    "options": [
      "Le caractère $",
      "Le caractère %",
      "Le caractère #",
      "Le caractère @"
    ],
    "correctIndex": 0,
    "explanation": "Le prompt d'un utilisateur standard se termine généralement par le caractère $, tandis que celui du compte root se termine par le caractère #, ce qui permet de le reconnaître facilement."
  },
  {
    "question": "Pourquoi est-il fortement déconseillé de se connecter directement avec le compte root, en particulier en session SSH ?",
    "options": [
      "Parce que root ne peut pas exécuter de commandes en ligne de commande",
      "Pour des raisons de sécurité, et certaines distributions comme Debian désactivent même cette connexion par défaut",
      "Parce que le compte root n'existe pas sous Linux",
      "Parce que cela ralentit considérablement le système"
    ],
    "correctIndex": 1,
    "explanation": "Pour des raisons de sécurité, il est déconseillé de se connecter directement en root, notamment en SSH ; certaines distributions comme Debian désactivent même cette possibilité par défaut, préférant une connexion via un compte utilisateur suivie d'une élévation de privilèges si nécessaire."
  },
  {
    "question": "Quelle commande permet d'obtenir uniquement le nom de l'utilisateur actuellement connecté ?",
    "options": [
      "who",
      "id",
      "logname",
      "env"
    ],
    "correctIndex": 2,
    "explanation": "La commande logname permet d'obtenir simplement le nom de l'utilisateur actuellement connecté, par exemple user30."
  },
  {
    "question": "Quelle commande, utilisée avec l'option -u suivie d'un nom d'utilisateur, permet d'obtenir uniquement l'UID de cet utilisateur ?",
    "options": [
      "logname -u",
      "who -u",
      "passwd -u",
      "id -u"
    ],
    "correctIndex": 3,
    "explanation": "La commande id -u, suivie éventuellement d'un nom d'utilisateur (comme id -u user5), permet d'obtenir uniquement l'UID (identifiant numérique) de l'utilisateur concerné."
  },
  {
    "question": "Quelles informations supplémentaires la commande w fournit-elle par rapport à la commande who ?",
    "options": [
      "La charge système, le temps d'inactivité des utilisateurs, les commandes en cours et le CPU consommé",
      "Uniquement la liste des fichiers ouverts par chaque utilisateur",
      "Le mot de passe actuel de chaque utilisateur connecté",
      "La date d'installation du système"
    ],
    "correctIndex": 0,
    "explanation": "En complément de who, la commande w ajoute des informations telles que la charge système, le temps d'inactivité de l'utilisateur, les commandes actuellement en cours (WHAT) et le CPU consommé par les processus."
  },
  {
    "question": "Quelle commande permet de connaître depuis combien de temps le système fonctionne sans interruption ?",
    "options": [
      "tty",
      "uptime",
      "date",
      "cal"
    ],
    "correctIndex": 1,
    "explanation": "La commande uptime indique depuis combien de temps le système fonctionne, sans avoir été redémarré."
  },
  {
    "question": "Quelle option de la commande passwd permet d'obtenir des informations détaillées sur l'état du mot de passe d'un compte, sans le modifier ?",
    "options": [
      "passwd -l",
      "passwd -d",
      "passwd -S",
      "passwd -i"
    ],
    "correctIndex": 2,
    "explanation": "L'option -S de la commande passwd permet de vérifier et d'afficher des informations sur l'état actuel du mot de passe d'un compte, sans procéder à sa modification."
  },
  {
    "question": "Parmi les exigences de complexité des mots de passe mentionnées dans le module, laquelle est correcte ?",
    "options": [
      "Le mot de passe doit obligatoirement comporter uniquement des chiffres",
      "Le mot de passe doit être strictement identique au nom d'utilisateur",
      "Le mot de passe ne doit comporter aucune majuscule",
      "Le mot de passe doit contenir au moins un caractère spécial et ne pas être trop similaire au précédent"
    ],
    "correctIndex": 3,
    "explanation": "Le module mentionne notamment qu'un bon mot de passe doit contenir au moins un caractère spécial, ne pas être trop similaire au précédent, et ne pas utiliser de mots du dictionnaire."
  },
  {
    "question": "Dans le formatage de la commande date, quel symbole permet d'obtenir le nom complet du jour de la semaine ?",
    "options": [
      "%a",
      "%A",
      "%d",
      "%D"
    ],
    "correctIndex": 1,
    "explanation": "Le symbole %A (majuscule) permet d'obtenir le nom complet du jour (par exemple \"mardi\"), tandis que %a donne la version abrégée du nom du jour."
  },
  {
    "question": "Que permet de faire la commande cal lorsqu'on l'utilise sans aucun argument ?",
    "options": [
      "Modifier la date système",
      "Afficher la liste des utilisateurs connectés",
      "Afficher le calendrier du mois en cours, avec le jour actuel en surbrillance",
      "Afficher l'historique des commandes exécutées"
    ],
    "correctIndex": 2,
    "explanation": "Utilisée sans argument, la commande cal affiche le calendrier du mois en cours, avec le jour actuel mis en surbrillance."
  },
  {
    "question": "Que renseigne la commande tty lorsqu'elle est exécutée ?",
    "options": [
      "Le nom d'utilisateur actuellement connecté",
      "L'adresse IP de la machine",
      "La date et l'heure du système",
      "Le nom du terminal ou pseudo-terminal utilisé pour la session en cours"
    ],
    "correctIndex": 3,
    "explanation": "La commande tty renseigne sur le type de terminal ou pseudo-terminal utilisé (par exemple /dev/tty1 en console directe, ou /dev/pts/2 en connexion SSH ou graphique)."
  },
  {
    "question": "Que signifie l'acronyme de la commande pwd, et à quoi sert-elle ?",
    "options": [
      "Print Working Directory, elle affiche le répertoire courant dans l'arborescence",
      "Password, elle sert à changer le mot de passe",
      "Print Weekly Data, elle affiche un résumé hebdomadaire d'activité",
      "Public Working Domain, elle affiche le domaine réseau courant"
    ],
    "correctIndex": 0,
    "explanation": "pwd signifie Print Working Directory : elle affiche le chemin du répertoire courant dans lequel se trouve l'utilisateur."
  },
  {
    "question": "Dans l'exemple var=\"contenu de la variable\" suivi de echo $var, que récupère-t-on concrètement en exécutant echo $var ?",
    "options": [
      "Le nom de la variable, c'est-à-dire \"var\"",
      "Le contenu stocké dans la variable, c'est-à-dire \"contenu de la variable\"",
      "Une erreur, car $var n'existe pas tant qu'on ne l'a pas exportée",
      "Le type de données de la variable"
    ],
    "correctIndex": 1,
    "explanation": "echo $var affiche le contenu stocké dans la variable (le contenant), et non le nom de la variable lui-même : $var est le moyen d'accéder à la donnée mémorisée."
  },
  {
    "question": "Pourquoi la commande echo $home (en minuscules) ne renvoie-t-elle rien, alors que echo $HOME fonctionne ?",
    "options": [
      "Parce qu'il manque des guillemets autour de $home",
      "Parce que la commande echo ne reconnaît que les variables numériques",
      "Parce que la variable $home n'existe pas, les noms de variables d'environnement étant sensibles à la casse et écrits en majuscules par convention",
      "Parce que $home est réservé exclusivement au compte root"
    ],
    "correctIndex": 2,
    "explanation": "Les noms de variables sont sensibles à la casse, et les variables d'environnement sont par convention écrites en majuscules : $home (en minuscules) n'existe donc pas, contrairement à $HOME."
  },
  {
    "question": "Quelle variable d'environnement contient le chemin des répertoires où se trouvent les commandes et scripts utilisables par l'utilisateur ?",
    "options": [
      "$HOME",
      "$LANG",
      "$SHELL",
      "$PATH"
    ],
    "correctIndex": 3,
    "explanation": "La variable $PATH précise les répertoires dans lesquels se trouvent les commandes et scripts utilisables par l'utilisateur courant ; son équivalent sous Windows se récupère avec %PATH%."
  },
  {
    "question": "Quelle commande permet de supprimer (libérer) une variable existante en mémoire ?",
    "options": [
      "unset",
      "clear",
      "rm",
      "delvar"
    ],
    "correctIndex": 0,
    "explanation": "La commande unset (par exemple unset monNom) permet de supprimer une variable existante, dont le contenu ne sera alors plus accessible."
  },
  {
    "question": "Quel raccourci permet de réexécuter directement la dernière commande saisie dans l'historique Bash ?",
    "options": [
      "!?",
      "!!",
      "!n",
      "Ctrl+R"
    ],
    "correctIndex": 1,
    "explanation": "Le double point d'exclamation !! permet de réexécuter immédiatement la dernière commande saisie ; !string rappelle la dernière commande commençant par cette chaîne, et !n rappelle la commande numéro n de l'historique."
  },
  {
    "question": "Dans quel fichier l'historique des commandes Bash est-il mémorisé pour chaque utilisateur ?",
    "options": [
      "/etc/passwd",
      "~/.bashrc",
      "~/.bash_history",
      "/var/log/history.log"
    ],
    "correctIndex": 2,
    "explanation": "L'historique des commandes est mémorisé dans le fichier .bash_history, situé dans le répertoire personnel de chaque utilisateur ; il convient de ne pas y laisser d'informations sensibles."
  },
  {
    "question": "Quelle commande, suivie du nom d'une commande, permet de consulter la documentation détaillée de celle-ci, avec recherche possible via \"/mot\" et sortie via \"q\" ?",
    "options": [
      "help",
      "info",
      "--help",
      "man"
    ],
    "correctIndex": 3,
    "explanation": "La commande man (manuel), suivie du nom de la commande recherchée, permet d'accéder à sa documentation détaillée ; on peut y rechercher un terme avec /mot, passer à l'occurrence suivante avec n, et quitter avec q."
  },
  {
    "question": "Pourquoi la commande prenom = \"Sophie\" provoque-t-elle une erreur ?",
    "options": [
      "Parce que les variables doivent être en majuscules",
      "Parce qu'il ne faut pas d'espaces autour du = : Bash prend « prenom » pour une commande",
      "Parce qu'il faut écrire $prenom = \"Sophie\"",
      "Parce que les guillemets sont interdits"
    ],
    "correctIndex": 1,
    "explanation": "En Bash, on affecte une variable sans espaces : prenom=\"Sophie\". Avec des espaces, Bash cherche une commande nommée « prenom »."
  },
  {
    "question": "Comment quitter l'affichage d'une page de manuel (man) ?",
    "options": [
      "Ctrl + Z",
      "Taper exit",
      "Appuyer sur q",
      "Appuyer sur Échap"
    ],
    "correctIndex": 2,
    "explanation": "Dans man, la touche q (quit) ferme le manuel. On cherche avec /mot et on passe à l'occurrence suivante avec n."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes",
      dataId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes-data",
    });
  });
</script>
