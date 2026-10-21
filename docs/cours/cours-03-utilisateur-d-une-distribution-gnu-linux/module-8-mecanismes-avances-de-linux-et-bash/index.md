# Module 8 : Mécanismes avancés de Linux et Bash

*Cours : [Cours 3 - Utilisateur d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

À la fin de ce module, tu sais :

- lire et modifier les **droits** d'un fichier (`rwx`, `chmod`) ;
- créer des **liens** (`ln -s`) ;
- surveiller et arrêter des **processus** (`ps`, `top`, `kill`), lancer une tâche en **arrière-plan** ;
- chercher avec des **expressions régulières** (`grep -E`, `^`, `$`) ;
- **archiver et compresser** (`tar`, `gzip`).

!!! abstract "En clair"
    Ce module rassemble les outils qui font passer de « je tape des commandes » à « **je maîtrise mon système** » :

    - **qui a le droit** de lire ou modifier un fichier ;
    - **quels programmes tournent**, et comment arrêter celui qui bloque ;
    - **chercher intelligemment** dans du texte ;
    - **regrouper et compresser** des fichiers, par exemple pour une sauvegarde.

## 🖼️ Résumé visuel

**① Les droits d'un fichier : 3 publics × 3 droits**

```text
-rwxr-x---  1  user30  compta  2048  21 oct.  script.sh
 └┬┘└┬┘└┬┘      └──┬─┘ └──┬─┘
  │  │  │          │      └── le GROUPE propriétaire
  │  │  │          └───────── l'UTILISATEUR propriétaire
  │  │  └── o (others) : les AUTRES       → ---  : aucun droit
  │  └───── g (group)  : le GROUPE        → r-x  : lire + exécuter
  └──────── u (user)   : le PROPRIÉTAIRE  → rwx  : lire + écrire + exécuter

   r = read (lire) = 4      w = write (écrire) = 2      x = execute (exécuter) = 1
   rwx = 4+2+1 = 7          r-x = 4+0+1 = 5             --- = 0            →  chmod 750
```

**② La vie d'un processus**

```mermaid
flowchart LR
    A["▶️ commande<br/>premier plan<br/>(le terminal attend)"] -- "Ctrl+Z" --> B["⏸️ suspendu"]
    B -- "bg" --> C["🔄 arrière-plan<br/>(le terminal est libre)"]
    C -- "fg" --> A
    D["commande &"] --> C
    A -- "Ctrl+C" --> X["⛔ arrêté"]
    C -- "kill PID" --> X
```

## 📖 Cours consolidé

### 1. Les droits sur les fichiers

Chaque fichier a **un propriétaire** (un utilisateur), **un groupe**, et des **droits** pour **3 publics** :

| Public | Lettre | Qui ? |
|---|---|---|
| **Propriétaire** | **u** (*user*) | Celui à qui appartient le fichier |
| **Groupe** | **g** (*group*) | Les membres du groupe du fichier |
| **Autres** | **o** (*others*) | Tout le monde, sauf les deux précédents |

| Droit | Lettre | Valeur | Sur un **fichier** | Sur un **dossier** |
|---|---|---|---|---|
| **Lecture** | **r** | **4** | Lire le contenu | **Lister** le contenu (`ls`) |
| **Écriture** | **w** | **2** | Modifier | **Créer / supprimer** des fichiers dedans |
| **Exécution** | **x** | **1** | **Lancer** (script, programme) | **Entrer** dedans (`cd`) |

#### Modifier les droits avec `chmod`

**Méthode en chiffres (octale)** : on additionne les valeurs pour chaque public.

| Chiffres | Droits | Usage courant |
|---|---|---|
| **755** | `rwxr-xr-x` | Script ou dossier : tout le monde lit et exécute, seul le propriétaire modifie |
| **644** | `rw-r--r--` | Fichier normal : le propriétaire modifie, les autres lisent |
| **700** | `rwx------` | **Privé** : seulement le propriétaire |
| **600** | `rw-------` | Fichier **secret** (ex. une clé SSH) |

```bash
chmod 755 script.sh
chmod 600 ~/.ssh/id_ed25519
```

**Méthode en lettres (symbolique)** : `qui` `+` ou `-` `quoi`.

```bash
chmod u+x script.sh         # ajouter l'exécution au propriétaire
chmod go-w rapport.txt      # retirer l'écriture au groupe et aux autres
chmod o= secret.txt         # retirer TOUS les droits aux autres
```

💡 Pour lancer un script du dossier courant : `./script.sh` (il faut le droit **x**).

📌 **Changer le propriétaire** (`chown`) nécessite les droits d'administration : vu au cours 4.

---

### 2. Les liens

| | **Lien symbolique** (`ln -s`) | **Lien physique** (`ln`) |
|---|---|---|
| **Image** | Un **raccourci** Windows | Un **deuxième nom** pour le même fichier |
| **Si l'original est supprimé** | Le lien est **cassé** | Le fichier **reste accessible** par l'autre nom |
| **Sur un dossier ?** | ✅ Oui | ❌ Non |
| **Dans `ls -l`** | `l` + flèche : `rapport -> /home/user30/Documents/rapport.txt` | Un fichier normal (le compteur de liens augmente) |

```bash
ln -s /var/log/apache2 ~/logs-web       # raccourci vers les journaux Apache
ls -l ~/logs-web                        # lrwxrwxrwx ... logs-web -> /var/log/apache2
```

✅ Dans la pratique, on utilise surtout les **liens symboliques** (`ln -s`).

---

### 3. Les processus

Un **processus**, c'est **un programme en cours d'exécution**. Chacun a un numéro unique : le **PID** (*Process ID*).

| Commande | Effet |
|---|---|
| **`ps`** | Les processus **de ton terminal** |
| **`ps aux`** | **Tous** les processus de la machine |
| `ps aux | grep apache` | Trouver un processus précis (et son PID) |
| **`top`** (ou **`htop`**, plus lisible) | Les processus **en direct**, triés par usage du processeur (`q` pour quitter) |
| **`kill PID`** | Demander **poliment** à un processus de s'arrêter |
| **`kill -9 PID`** | **Forcer** l'arrêt (si le processus ne répond plus) |
| `pkill firefox` | Arrêter les processus **par leur nom** |

**Premier plan et arrière-plan**

| Action | Effet |
|---|---|
| `commande &` | Lancer **directement en arrière-plan** : le terminal reste disponible |
| ++ctrl+c++ | **Arrêter** la commande en cours |
| ++ctrl+z++ | **Mettre en pause** la commande en cours |
| **`jobs`** | Lister les tâches de ce terminal |
| **`bg`** | Relancer la tâche en pause **en arrière-plan** |
| **`fg`** | Ramener une tâche **au premier plan** |

```bash
sleep 300 &        # [1] 4521  ← n° de tâche et PID
jobs               # [1]+  En cours d'exécution   sleep 300 &
kill 4521          # l'arrêter
```

⚠️ Toujours essayer **`kill`** avant **`kill -9`** : `-9` coupe brutalement, sans laisser le programme enregistrer ses données.

---

### 4. Les expressions régulières (avec `grep`)

!!! abstract "En clair"
    Une **expression régulière** (*regex*) est un **motif** qui décrit **la forme** d'un texte : « une ligne qui **commence** par… », « un mot qui **finit** par… », « **un chiffre**, puis… ». C'est `grep` en version **super-puissante**.

⚠️ Ne pas confondre avec les **jokers** du module 6 (`*.txt`), qui servent à désigner des **noms de fichiers**. Dans une regex, `*` a un **autre** sens.

| Symbole | Signifie | Exemple | Trouve… |
|---|---|---|---|
| **`^`** | **Début** de ligne | `grep "^root" /etc/passwd` | Les lignes qui **commencent** par root |
| **`$`** | **Fin** de ligne | `grep "bash$" /etc/passwd` | Les lignes qui **finissent** par bash |
| **`.`** | **Un** caractère quelconque | `grep "r..t"` | root, rest, r2dt… |
| **`*`** | Le caractère d'avant, **0 fois ou plus** | `grep "ab*c"` | ac, abc, abbbc |
| **`[0-9]`** | **Un chiffre** | `grep "[0-9]"` | Les lignes avec un chiffre |
| **`[a-z]`** | Une **lettre minuscule** | | |
| `[^…]` | **Sauf** ces caractères | `grep "[^0-9]"` | |
| **`|`** (avec `-E`) | **OU** | `grep -E "error|fail"` | error **ou** fail |
| `+` (avec `-E`) | **1 fois ou plus** | `grep -E "[0-9]+"` | Un nombre |

**Exemples utiles**

```bash
grep -v "^#" /etc/ssh/sshd_config | grep -v "^$"     # la config SANS commentaires ni lignes vides
grep "bash$" /etc/passwd                              # les comptes qui utilisent bash
grep -E "error|warning" /var/log/syslog               # les erreurs OU les avertissements
grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" fichier   # les lignes contenant une adresse IPv4
```

💡 **`grep -E`** (ou `egrep`) active les **regex étendues** : `|`, `+`, `?`, `{n,m}` sans antislash.

---

### 5. Archiver et compresser

!!! abstract "En clair"
    - **Archiver** = **regrouper** plusieurs fichiers en **un seul** (un « carton »). C'est le rôle de **`tar`**.
    - **Compresser** = **réduire la taille** (« mettre le carton sous vide »). C'est le rôle de **`gzip`**, `bzip2`, `xz`.
    - `tar` sait faire **les deux en même temps** : on obtient un fichier **`.tar.gz`** (l'équivalent du `.zip` de Windows).

| Option de `tar` | Signifie | Moyen mnémotechnique |
|---|---|---|
| **`c`** | **Créer** une archive | *create* |
| **`x`** | **Extraire** | *extract* |
| **`t`** | **Lister** le contenu | *table* |
| **`z`** | Compresser / décompresser avec **gzip** | g**z**ip |
| **`v`** | Afficher les fichiers traités | *verbose* |
| **`f`** | Le **nom de l'archive** suit (toujours en **dernier**) | *file* |

```bash
tar -czvf sauvegarde.tar.gz Documents/       # CRÉER une archive compressée du dossier Documents
tar -tzvf sauvegarde.tar.gz                  # VOIR ce qu'elle contient
tar -xzvf sauvegarde.tar.gz                  # EXTRAIRE ici
tar -xzvf sauvegarde.tar.gz -C /tmp          # EXTRAIRE dans /tmp
```

**Moyen mnémotechnique** : **c**réer = **czvf**, e**x**traire = **xzvf**.

| Outil | Compresse | Décompresse | Extension |
|---|---|---|---|
| **gzip** | `gzip fichier` | `gunzip fichier.gz` | `.gz` (le plus courant) |
| bzip2 | `bzip2 fichier` | `bunzip2 fichier.bz2` | `.bz2` (plus compact, plus lent) |
| xz | `xz fichier` | `unxz fichier.xz` | `.xz` (encore plus compact) |
| zip | `zip -r a.zip dossier` | `unzip a.zip` | `.zip` (compatible Windows) |

⚠️ **`gzip` remplace le fichier** d'origine par sa version `.gz`, et ne compresse qu'**un seul fichier**. Pour un **dossier**, on utilise **`tar -czf`**.

## ✅ Points clés à retenir

- Droits **`rwx`** pour **u** (propriétaire), **g** (groupe), **o** (autres) ; **r = 4, w = 2, x = 1**. `chmod 755`, `chmod 644`, `chmod u+x`.
- Sur un dossier : **r** = lister, **w** = créer/supprimer dedans, **x** = entrer.
- **`ln -s cible lien`** = raccourci (cassé si la cible disparaît).
- Processus : **`ps aux`**, **`top`**, **`kill PID`** (puis `kill -9` en dernier recours) ; **`&`**, ++ctrl+z++, **`bg`**, **`fg`**, **`jobs`**.
- Regex : **`^`** début, **`$`** fin, **`.`** un caractère, **`*`** répétition, **`[0-9]`** ; **`grep -E "a|b"`** pour OU.
- **`tar -czvf archive.tar.gz dossier`** (créer), **`tar -xzvf archive.tar.gz`** (extraire), **`tar -tzvf`** (lister).

## 📝 Fiche de révision

### 🧠 Les commandes du module

| Commande | Rôle |
|---|---|
| `chmod 755 f` / `chmod u+x f` | Changer les droits |
| `ln -s cible lien` | Lien symbolique |
| `ps aux` | Tous les processus |
| `top` / `htop` | Processus en direct |
| `kill PID` / `kill -9 PID` | Arrêter / forcer |
| `cmd &` / `jobs` / `fg` / `bg` | Arrière-plan |
| `grep "^motif"` / `grep "motif$"` | Début / fin de ligne |
| `grep -E "a|b"` | a OU b |
| `tar -czvf a.tar.gz dossier` | Créer une archive compressée |
| `tar -xzvf a.tar.gz` | Extraire |
| `gzip` / `gunzip` | Compresser / décompresser un fichier |

### 🔢 Calculer des droits

| Droits | Calcul | Chiffre |
|---|---|---|
| `rwx` | 4+2+1 | 7 |
| `rw-` | 4+2 | 6 |
| `r-x` | 4+1 | 5 |
| `r--` | 4 | 4 |
| `---` | 0 | 0 |

### ⚠️ Les pièges

- **`*` dans une regex ≠ `*` joker** de Bash.
- Pas de droit **x** sur un dossier → impossible d'y **entrer**, même avec r.
- **`kill -9`** en dernier recours seulement.
- Avec `tar`, l'option **`f` doit être la dernière**, juste avant le nom de l'archive.
- `gzip` **remplace** le fichier d'origine.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Quels droits donne chmod 640 rapport.txt ?"
    6 = `rw-` (propriétaire), 4 = `r--` (groupe), 0 = `---` (autres) → **`rw-r-----`** : le propriétaire lit et modifie, le groupe lit, les autres n'ont rien.

??? question "2. Rends le script sauvegarde.sh exécutable par son propriétaire, puis lance-le."
    ```bash
    chmod u+x sauvegarde.sh
    ./sauvegarde.sh
    ```

??? question "3. Le navigateur est figé. Trouve son PID et arrête-le."
    ```bash
    ps aux | grep firefox       # repérer le PID (2ᵉ colonne), ex. 3810
    kill 3810                   # arrêt normal
    kill -9 3810                # seulement s'il ne s'arrête pas
    ```

??? question "4. Affiche les lignes de /etc/passwd qui commencent par « user »."
    ```bash
    grep "^user" /etc/passwd
    ```

??? question "5. Archive et compresse le dossier ~/projets dans projets.tar.gz, puis extrais-le dans /tmp."
    ```bash
    tar -czvf projets.tar.gz ~/projets
    tar -xzvf projets.tar.gz -C /tmp
    ```

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-8-mecanismes-avances-de-linux-et-bash"></div>

<script type="application/json" id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-8-mecanismes-avances-de-linux-et-bash-data">
[
  {
    "question": "Que signifie rwxr-x--- ?",
    "options": [
      "Tout le monde a tous les droits",
      "Propriétaire : tout ; groupe : lire et exécuter ; autres : rien",
      "Propriétaire : lire ; groupe : écrire ; autres : exécuter",
      "Fichier caché"
    ],
    "correctIndex": 1,
    "explanation": "Les 3 groupes de 3 caractères concernent, dans l'ordre, le propriétaire (rwx), le groupe (r-x) et les autres (---)."
  },
  {
    "question": "Quelle valeur numérique correspond aux droits rwx ?",
    "options": [
      "3",
      "5",
      "7",
      "9"
    ],
    "correctIndex": 2,
    "explanation": "r = 4, w = 2, x = 1 : 4 + 2 + 1 = 7."
  },
  {
    "question": "Que donne chmod 644 fichier ?",
    "options": [
      "rw-r--r--",
      "rwxr-xr-x",
      "rw-------",
      "r--r--r--"
    ],
    "correctIndex": 0,
    "explanation": "6 = rw- pour le propriétaire, 4 = r-- pour le groupe et 4 = r-- pour les autres : c'est le réglage habituel d'un fichier."
  },
  {
    "question": "Sur un dossier, à quoi sert le droit x ?",
    "options": [
      "Supprimer le dossier",
      "Entrer dans le dossier (cd)",
      "Lister son contenu",
      "Rien"
    ],
    "correctIndex": 1,
    "explanation": "Sur un dossier, r permet de lister, w de créer ou supprimer des fichiers dedans, et x d'y entrer."
  },
  {
    "question": "Quelle commande ajoute le droit d'exécution au propriétaire d'un script ?",
    "options": [
      "chmod o+x script.sh",
      "chmod u+x script.sh",
      "chmod 000 script.sh",
      "chown u+x script.sh"
    ],
    "correctIndex": 1,
    "explanation": "u = propriétaire (user), + = ajouter, x = exécution."
  },
  {
    "question": "Que se passe-t-il si on supprime le fichier vers lequel pointe un lien symbolique ?",
    "options": [
      "Le lien devient une copie",
      "Le lien est cassé",
      "Le fichier est restauré",
      "Rien, le lien contient les données"
    ],
    "correctIndex": 1,
    "explanation": "Un lien symbolique (ln -s) n'est qu'un raccourci vers un chemin : si la cible disparaît, le lien ne mène plus nulle part."
  },
  {
    "question": "Quelle commande affiche tous les processus de la machine ?",
    "options": [
      "ps",
      "ps aux",
      "jobs",
      "pwd"
    ],
    "correctIndex": 1,
    "explanation": "ps seul ne montre que les processus du terminal courant ; ps aux les montre tous, avec leur PID, leur propriétaire et leur consommation."
  },
  {
    "question": "Qu'est-ce qu'un PID ?",
    "options": [
      "Un mot de passe",
      "Le numéro unique d'un processus",
      "Un type de fichier",
      "Un port réseau"
    ],
    "correctIndex": 1,
    "explanation": "PID (Process ID) est le numéro unique attribué à chaque processus. C'est lui qu'on donne à kill."
  },
  {
    "question": "Pourquoi essayer kill PID avant kill -9 PID ?",
    "options": [
      "kill -9 n'existe pas",
      "kill demande un arrêt propre ; kill -9 coupe brutalement sans laisser le programme enregistrer",
      "kill -9 est plus lent",
      "kill redémarre le processus"
    ],
    "correctIndex": 1,
    "explanation": "kill envoie un signal d'arrêt que le programme peut traiter proprement. kill -9 le tue immédiatement, au risque de perdre des données : c'est le dernier recours."
  },
  {
    "question": "Comment lancer une commande directement en arrière-plan ?",
    "options": [
      "En ajoutant & à la fin",
      "Avec Ctrl + C",
      "Avec fg",
      "En la tapant en majuscules"
    ],
    "correctIndex": 0,
    "explanation": "Le & final lance la commande en arrière-plan : le terminal reste disponible. jobs liste les tâches, fg en ramène une au premier plan."
  },
  {
    "question": "Dans une expression régulière, que signifie ^ en début de motif ?",
    "options": [
      "Fin de ligne",
      "Début de ligne",
      "N'importe quel caractère",
      "Un chiffre"
    ],
    "correctIndex": 1,
    "explanation": "^ ancre le motif en début de ligne : grep \"^root\" trouve les lignes qui commencent par root. $ ancre en fin de ligne."
  },
  {
    "question": "Quelle commande affiche les lignes de /etc/passwd qui se terminent par bash ?",
    "options": [
      "grep \"^bash\" /etc/passwd",
      "grep \"bash$\" /etc/passwd",
      "grep -v bash /etc/passwd",
      "find bash /etc/passwd"
    ],
    "correctIndex": 1,
    "explanation": "$ signifie fin de ligne. Ces lignes correspondent aux comptes dont le shell est /bin/bash."
  },
  {
    "question": "Comment chercher les lignes contenant « error » OU « fail » ?",
    "options": [
      "grep error fail fichier",
      "grep -E \"error|fail\" fichier",
      "grep \"error&fail\" fichier",
      "grep -v error fichier"
    ],
    "correctIndex": 1,
    "explanation": "Avec -E (regex étendues), | signifie OU. Sans -E, grep prendrait « fail » pour un nom de fichier."
  },
  {
    "question": "Quelle commande crée une archive compressée projets.tar.gz du dossier projets ?",
    "options": [
      "tar -xzvf projets.tar.gz projets",
      "tar -czvf projets.tar.gz projets",
      "gzip projets",
      "zip projets.tar.gz"
    ],
    "correctIndex": 1,
    "explanation": "c = créer, z = compression gzip, v = afficher, f = nom de l'archive (toujours suivi du nom). x servirait à extraire."
  },
  {
    "question": "Quelle commande extrait l'archive sauvegarde.tar.gz dans le dossier courant ?",
    "options": [
      "tar -czvf sauvegarde.tar.gz",
      "tar -xzvf sauvegarde.tar.gz",
      "gzip sauvegarde.tar.gz",
      "tar -tzvf sauvegarde.tar.gz"
    ],
    "correctIndex": 1,
    "explanation": "x = extraire. -tzvf ne fait que lister le contenu, sans rien extraire."
  },
  {
    "question": "Quelle est la différence entre archiver et compresser ?",
    "options": [
      "Aucune",
      "Archiver regroupe plusieurs fichiers en un seul ; compresser réduit la taille",
      "Archiver réduit la taille ; compresser regroupe",
      "Archiver supprime les fichiers"
    ],
    "correctIndex": 1,
    "explanation": "tar regroupe des fichiers (archive) ; gzip, bzip2 ou xz réduisent la taille (compression). tar -z fait les deux à la fois."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-8-mecanismes-avances-de-linux-et-bash",
      dataId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-8-mecanismes-avances-de-linux-et-bash-data",
    });
  });
</script>
