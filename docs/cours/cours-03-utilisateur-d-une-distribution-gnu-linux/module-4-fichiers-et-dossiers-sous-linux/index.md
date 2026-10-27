# Module 4 : Fichiers et dossiers sous Linux

*Cours : [Cours 3 - Utilisateur d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

À la fin de ce module, tu sais :

- te repérer dans l'**arborescence** Linux (`/`, `/home`, `/etc`, `/var`…) ;
- écrire un **chemin absolu** et un **chemin relatif** ;
- te **déplacer** (`cd`) et **lister** (`ls`) ;
- **créer, copier, déplacer, renommer, supprimer** des fichiers et des dossiers ;
- reconnaître les **fichiers cachés** et les **types de fichiers**.

!!! abstract "En clair : pas de C:, tout part de /"
    Sous Windows, chaque disque a sa lettre (`C:`, `D:`). Sous Linux, il n'y a **qu'un seul arbre**, qui part de la **racine** notée **`/`**. Tout est rangé dedans, même les disques et les clés USB, qui apparaissent comme de simples **dossiers**.

    Et sous Linux, **« tout est fichier »** : un document, un dossier, un disque, une imprimante… sont tous vus comme des fichiers.

## 🖼️ Résumé visuel

**① L'arborescence Linux : les dossiers à connaître**

```mermaid
flowchart TD
    R["<b>/</b><br/>la racine"] --> HOME["<b>/home</b><br/>dossiers des utilisateurs<br/>/home/user30"]
    R --> ROOT["<b>/root</b><br/>dossier de root"]
    R --> ETC["<b>/etc</b><br/>fichiers de<br/>configuration"]
    R --> VAR["<b>/var</b><br/>données qui changent<br/>/var/log = journaux"]
    R --> BIN["<b>/usr/bin, /bin</b><br/>les commandes<br/>(ls, cp…)"]
    R --> TMP["<b>/tmp</b><br/>fichiers temporaires<br/>(vidé au redémarrage)"]
    R --> DEV["<b>/dev</b><br/>les périphériques<br/>(disques…)"]
    R --> MNT["<b>/media, /mnt</b><br/>clés USB,<br/>disques montés"]
```

**② Chemin absolu ou relatif ?**

```
Tu es dans /home/user30 et tu veux atteindre /home/user30/Documents/cv.txt

  Chemin ABSOLU  : /home/user30/Documents/cv.txt   ← part de la racine /, marche de partout
  Chemin RELATIF : Documents/cv.txt                ← part de là où tu es (pas de / au début)

  Les raccourcis :   .  = ici      ..  = le dossier parent      ~  = mon dossier personnel
```

## 📖 Cours consolidé

### 1. L'arborescence (norme FHS)

| Dossier | Contient | ≈ Windows |
|---|---|---|
| **`/`** | La **racine** | `C:\` |
| **`/home`** | Un dossier **par utilisateur** | `C:\Users` |
| **`/root`** | Le dossier de **root** | |
| **`/etc`** | Les **fichiers de configuration** | Le registre, en partie |
| **`/var`** | Ce qui **varie** : **`/var/log`** (**journaux**), sites web | |
| **`/usr/bin`**, `/bin` | Les **commandes** | `C:\Windows\System32` |
| **`/tmp`** | Fichiers **temporaires** | `C:\Windows\Temp` |
| **`/dev`** | **Périphériques** vus comme des fichiers (`/dev/sda` = 1ᵉʳ disque) | |
| **`/media`**, `/mnt` | Clés USB et disques **montés** | `D:`, `E:` |
| `/boot` · `/proc` | Noyau et démarrage · infos système **en direct** | |

---

### 2. Chemins absolus et relatifs

- **Absolu** : commence par **`/`** (`/etc/ssh/sshd_config`), marche **de partout**.
- **Relatif** : sans `/` (`Documents/cv.txt`), part **du dossier actuel**.
- **`.`** = ici · **`..`** = le parent · **`~`** = mon dossier · `cd -` = le dossier précédent.
- ⚠️ Séparateur **`/`** (pas `\`) et **casse** qui compte : `Documents` ≠ `documents`.

---

### 3. Se déplacer et regarder

| Commande | Effet |
|---|---|
| **`cd /etc`** · **`cd ..`** · **`cd`** | Aller dans `/etc` · remonter · revenir **chez moi** |
| **`ls -l`** | Liste **détaillée** |
| **`ls -a`** | Avec les fichiers **cachés** |
| **`ls -lh`** · `ls -lt` · `ls -R` | Tailles **lisibles** · tri par **date** · sous-dossiers aussi |

```text
-rw-r--r-- 1 user30 user30  2048 21 oct. 10:15 rapport.txt
drwxr-xr-x 2 user30 user30  4096 20 oct. 09:00 Documents
│└───┬───┘   └──┬─┘ └──┬─┘  └┬─┘ └─────┬─────┘ └────┬────┘
│  droits   propriétaire groupe taille   date        nom
└─ type : - = fichier · d = dossier · l = lien
```

- Les **droits** `rwx` : [module 8](../module-8-mecanismes-avances-de-linux-et-bash/index.md).
- **Fichier caché** = nom qui **commence par un point** (`.bashrc`, `.ssh`).
- 💡 Les **extensions ne comptent pas** : **`file rapport`** dit ce que contient vraiment le fichier.

---

### 4. Créer, copier, déplacer, supprimer

| Je veux… | Commande |
|---|---|
| Créer un **dossier** (plusieurs niveaux : **`-p`**) | `mkdir -p Projets/2026/Octobre` |
| Créer un **fichier vide** | `touch notes.txt` |
| **Copier** un fichier · un **dossier** | `cp notes.txt copie.txt` · `cp -r Projets /tmp/` |
| **Déplacer** ou **renommer** | `mv notes.txt Documents/` · `mv notes.txt idees.txt` |
| **Supprimer** un fichier · un dossier **vide** · un dossier **et son contenu** | `rm idees.txt` · `rmdir Vide` · `rm -r Projets` |
| Demander **confirmation** | **`-i`** : `rm -i *.txt` |

!!! danger "Pas de corbeille en ligne de commande"
    **`rm` supprime définitivement**, et **`rm -rf`** efface un dossier entier **sans question**. Relis **toujours** avant de valider, surtout en root.

- 📌 **`mv`** sert à **déplacer et à renommer**.
- ⚠️ `mkdir Mes Documents` crée **deux** dossiers : écrire `"Mes Documents"`, ou mieux, **éviter les espaces** (`Mes_Documents`).

## 📝 Fiche de révision

### 🧠 Les commandes du module

| Commande | Rôle |
|---|---|
| `pwd` | Où suis-je |
| `cd chemin` / `cd ..` / `cd` | Aller dans / remonter / revenir chez moi |
| `ls -la` / `ls -lh` | Lister tout (cachés compris) / avec tailles lisibles |
| `file fichier` | Type réel d'un fichier |
| `mkdir -p a/b/c` | Créer des dossiers (avec les parents) |
| `touch f` | Créer un fichier vide |
| `cp f1 f2` / `cp -r d1 d2` | Copier un fichier / un dossier |
| `mv f1 f2` | Déplacer **ou** renommer |
| `rm f` / `rm -r d` | Supprimer un fichier / un dossier |
| `rmdir d` | Supprimer un dossier vide |

### ⚠️ Les pièges

- **`rm` ne passe pas par la corbeille.**
- `cp dossier` **sans `-r`** → erreur « omission du répertoire ».
- `rmdir` refuse un dossier **qui n'est pas vide** → `rm -r`.
- `/` est le séparateur (pas `\`), et **la casse compte**.
- Un nom avec des **espaces** → guillemets obligatoires.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Tu es dans /home/user30/Documents. Donne le chemin absolu et le chemin relatif vers /home/user30/Images/photo.jpg."
    - Absolu : **`/home/user30/Images/photo.jpg`**
    - Relatif : **`../Images/photo.jpg`** (on remonte dans `/home/user30`, puis on descend dans `Images`)
    - Bonus : **`~/Images/photo.jpg`** marche aussi, de partout.

??? question "2. Crée en une commande l'arborescence ~/tp/linux/module4, puis places-y un fichier vide notes.txt."
    ```bash
    mkdir -p ~/tp/linux/module4
    touch ~/tp/linux/module4/notes.txt
    ```

??? question "3. Renomme rapport.txt en rapport-final.txt, puis copie-le dans /tmp."
    ```bash
    mv rapport.txt rapport-final.txt
    cp rapport-final.txt /tmp/
    ```

??? question "4. Où chercher les fichiers de configuration ? Et les journaux du système ?"
    - Configuration : **`/etc`**
    - Journaux : **`/var/log`**

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-4-fichiers-et-dossiers-sous-linux"></div>

<script type="application/json" id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-4-fichiers-et-dossiers-sous-linux-data">
[
  {
    "question": "Comment s'appelle le point de départ de toute l'arborescence Linux ?",
    "options": [
      "C:",
      "La racine, notée /",
      "Le dossier home",
      "Le noyau"
    ],
    "correctIndex": 1,
    "explanation": "Sous Linux, tout part de la racine /. Il n'y a pas de lettres de lecteur : disques et clés USB sont accessibles comme des dossiers de cet arbre."
  },
  {
    "question": "Dans quel dossier se trouvent les fichiers de configuration du système ?",
    "options": [
      "/home",
      "/etc",
      "/tmp",
      "/dev"
    ],
    "correctIndex": 1,
    "explanation": "/etc contient les fichiers de configuration (en texte) du système et des services, par exemple /etc/ssh/sshd_config."
  },
  {
    "question": "Où sont rangés les journaux (logs) du système ?",
    "options": [
      "/var/log",
      "/etc/log",
      "/home/log",
      "/bin"
    ],
    "correctIndex": 0,
    "explanation": "/var contient les données qui varient ; les journaux du système se trouvent dans /var/log."
  },
  {
    "question": "Lequel de ces chemins est un chemin absolu ?",
    "options": [
      "Documents/cv.txt",
      "../Images",
      "/home/user30/Documents",
      "./script.sh"
    ],
    "correctIndex": 2,
    "explanation": "Un chemin absolu commence par / (la racine) et fonctionne quel que soit le dossier où l'on se trouve. Les autres sont relatifs au dossier actuel."
  },
  {
    "question": "Que représente .. dans un chemin ?",
    "options": [
      "Le dossier actuel",
      "Le dossier parent",
      "Le dossier personnel",
      "La racine"
    ],
    "correctIndex": 1,
    "explanation": ". désigne le dossier actuel, .. le dossier parent (au-dessus), et ~ le dossier personnel."
  },
  {
    "question": "Quelle commande ramène directement dans ton dossier personnel ?",
    "options": [
      "cd /",
      "cd ..",
      "cd (seule) ou cd ~",
      "pwd"
    ],
    "correctIndex": 2,
    "explanation": "cd sans argument, ou cd ~, ramène dans le dossier personnel (/home/utilisateur). cd / va à la racine, cd .. remonte d'un niveau."
  },
  {
    "question": "Comment reconnaît-on un fichier caché sous Linux ?",
    "options": [
      "Il a l'attribut H",
      "Son nom commence par un point (ex. .bashrc)",
      "Il est dans /tmp",
      "Il se termine par .hidden"
    ],
    "correctIndex": 1,
    "explanation": "Tout fichier ou dossier dont le nom commence par un point est caché. On l'affiche avec ls -a."
  },
  {
    "question": "Quelle commande affiche la liste détaillée d'un dossier, avec les fichiers cachés ?",
    "options": [
      "ls",
      "ls -l",
      "ls -la",
      "ls -R"
    ],
    "correctIndex": 2,
    "explanation": "-l donne le format long (droits, propriétaire, taille, date) et -a montre aussi les fichiers cachés. Les options se regroupent : ls -la."
  },
  {
    "question": "Dans un ls -l, que signifie un d en tout premier caractère de la ligne ?",
    "options": [
      "Fichier supprimé",
      "Un dossier (directory)",
      "Un fichier de données",
      "Un disque"
    ],
    "correctIndex": 1,
    "explanation": "Le premier caractère indique le type : - pour un fichier ordinaire, d pour un dossier, l pour un lien symbolique."
  },
  {
    "question": "Quelle commande crée l'arborescence a/b/c en une seule fois, même si a et b n'existent pas ?",
    "options": [
      "mkdir a/b/c",
      "mkdir -p a/b/c",
      "touch a/b/c",
      "cd a/b/c"
    ],
    "correctIndex": 1,
    "explanation": "L'option -p (parents) crée tous les dossiers manquants du chemin. Sans -p, mkdir échoue si a ou b n'existent pas."
  },
  {
    "question": "Comment renommer le fichier notes.txt en idees.txt ?",
    "options": [
      "rename notes.txt idees.txt",
      "cp notes.txt idees.txt",
      "mv notes.txt idees.txt",
      "rm notes.txt idees.txt"
    ],
    "correctIndex": 2,
    "explanation": "mv sert à la fois à déplacer et à renommer. cp créerait une copie en gardant l'original."
  },
  {
    "question": "Pourquoi cp Projets /tmp/ échoue-t-il si Projets est un dossier ?",
    "options": [
      "Parce que /tmp est protégé",
      "Parce qu'il faut l'option -r pour copier un dossier et son contenu",
      "Parce que cp ne copie que des fichiers .txt",
      "Parce qu'il faut être root"
    ],
    "correctIndex": 1,
    "explanation": "Pour copier un dossier, il faut l'option récursive : cp -r Projets /tmp/."
  },
  {
    "question": "Que se passe-t-il avec un fichier supprimé par rm ?",
    "options": [
      "Il va dans la corbeille",
      "Il est supprimé définitivement, sans corbeille",
      "Il est déplacé dans /tmp",
      "Il est caché"
    ],
    "correctIndex": 1,
    "explanation": "En ligne de commande, rm supprime définitivement. Il faut relire sa commande avant de valider, et utiliser -i pour demander une confirmation."
  },
  {
    "question": "Quelle commande supprime un dossier qui contient des fichiers ?",
    "options": [
      "rmdir dossier",
      "rm dossier",
      "rm -r dossier",
      "del dossier"
    ],
    "correctIndex": 2,
    "explanation": "rmdir ne supprime que les dossiers vides, et rm sans -r refuse les dossiers. rm -r supprime le dossier et tout son contenu."
  },
  {
    "question": "Que fait la commande file rapport ?",
    "options": [
      "Crée un fichier rapport",
      "Indique le type réel du contenu du fichier",
      "Supprime le fichier",
      "Affiche son contenu"
    ],
    "correctIndex": 1,
    "explanation": "Linux ne se fie pas aux extensions : file analyse le contenu et indique son type (texte, image, exécutable…)."
  },
  {
    "question": "Que crée la commande mkdir Mes Documents ?",
    "options": [
      "Un dossier « Mes Documents »",
      "Deux dossiers : « Mes » et « Documents »",
      "Une erreur",
      "Un fichier"
    ],
    "correctIndex": 1,
    "explanation": "L'espace sépare les arguments : mkdir reçoit deux noms. Pour un seul dossier, il faut des guillemets : mkdir \"Mes Documents\"."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-4-fichiers-et-dossiers-sous-linux",
      dataId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-4-fichiers-et-dossiers-sous-linux-data",
    });
  });
</script>
