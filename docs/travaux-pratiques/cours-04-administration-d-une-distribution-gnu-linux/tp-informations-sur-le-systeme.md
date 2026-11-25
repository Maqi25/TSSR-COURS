# TP - Informations sur le système

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 12 : Maintenance d'un système en production](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-12-maintenance-d-un-systeme-en-production/index.md).*

*TP M12TP03 · durée estimée : 20 à 45 minutes · sur le serveur Debian sans interface graphique · partie II en SSH avec PuTTY, sous ton compte utilisateur (pas root).*

=== "📋 Ce qui est demandé"

    **I. Relever des informations**

    | # | Consigne | Question à laquelle répondre |
    |---|---|---|
    | 1 | Infos sur la **mémoire** | RAM **utilisée** ? SWAP **utilisé** ? RAM **réellement libre** ? |
    | 2 | Infos détaillées **processeur** et **mémoire** | Quel **processeur** est détecté ? |
    | 3 | Processus des **démons** (nom finissant par **d**) | **Combien** y en a-t-il ? |

    **II. Agir sur les processus** (en SSH, compte utilisateur)

    | # | Consigne |
    |---|---|
    | 4 | Lister en détail **tous tes processus** |
    | 5 | Enregistrer dans un **fichier** les processus des **connexions PuTTY** (SSH) |
    | 6 | Ouvrir une **2e session PuTTY** et repérer le **PID** de son shell |
    | 7 | Depuis la 1re session, **tenter** d'arrêter ce shell avec le **signal par défaut** |
    | 8 | Depuis la 1re session, l'arrêter **définitivement** avec le **signal adapté** |

=== "⌨️ Les commandes"

    ```bash
    # 1. Mémoire
    free -h                                   # -h : unités lisibles (Mi, Gi)

    # 2. Processeur et mémoire en détail
    lscpu                                     # ligne « Nom de modèle »
    lscpu | grep -i "nom de modèle"           # (en anglais : "Model name")
    lsmem -a                                  # blocs de mémoire
    cat /proc/cpuinfo ; cat /proc/meminfo     # les infos brutes du noyau

    # 3. Les démons
    ps -eo comm= | grep 'd$'                  # noms qui finissent par d
    ps -eo comm= | grep -c 'd$'               # leur nombre
    ps -eo pid,user,comm | awk '$3 ~ /d$/'    # avec PID et utilisateur

    # --- Partie II : en SSH, sous ton compte ---

    # 4. Mes processus, en détail
    ps -fu $USER                              # ou : ps ux

    # 5. Les connexions SSH dans un fichier
    ps -ef | grep sshd | grep -v grep > liste-putty.txt
    # ou : pgrep -a sshd > liste-putty.txt

    # 6. Dans la 2e session : PID de son shell
    echo $$                                   # ou : ps
    tty                                       # ex. /dev/pts/1

    # 7. Depuis la 1re session : signal par défaut
    ps -fu $USER | grep pts/1                 # vérifier le PID avant de tuer
    kill 954                                  # SIGTERM (15) : le shell reste ouvert

    # 8. Arrêt définitif
    kill -HUP 954                             # SIGHUP (1) : « raccrocher », la session se ferme
    # en dernier recours : kill -KILL 954     # SIGKILL (9) : impossible à ignorer
    ps -p 954 || echo "terminé"               # vérifier
    ```

=== "✅ Corrigé expliqué"

    **1. Lire `free`**

    ```text
                   total   utilisé   libre   partagé   tamp/cache   disponible
    Mem:           1951       117    1729         0          104         1708
    Partition d'échange:  975   0     975
    ```

    | Question | Réponse | Colonne |
    |---|---|---|
    | RAM utilisée | **117 Mo** | `utilisé` |
    | SWAP utilisé | **0 Mo** (sur 975 Mo) | `utilisé` de la ligne *Partition d'échange* |
    | RAM réellement libre | **1708 Mo** | **`disponible`** |

    La colonne **`libre`** est trompeuse : Linux se sert de la RAM inutilisée comme **cache disque** (`tamp/cache`), qu'il rend dès qu'un programme en a besoin. La mémoire réellement utilisable est la colonne **`disponible`** (*available*), qui en tient compte.

    !!! warning "Erreur dans le corrigé ENI"
        Le corrigé dit que « 975 Mo de swap sont utilisés » : 975 Mo est la **taille totale** du swap, **0** est utilisé. Une machine qui utilise beaucoup de swap manque de RAM.

    **2. Processeur et mémoire**

    - **`lscpu`** résume le processeur : architecture (`x86_64`), nombre de cœurs et de threads, et la ligne **Nom de modèle**, par exemple `Intel(R) Core(TM) i5-6600 CPU @ 3.30GHz`.
    - **`lsmem -a`** montre la mémoire découpée en **blocs** (ici 16 blocs de 128 Mo = 2 Go).
    - Ces outils lisent **`/proc/cpuinfo`** et **`/proc/meminfo`** : des fichiers virtuels tenus à jour par le noyau.

    **3. Compter les démons**

    Un **démon** est un programme qui tourne en arrière-plan, sans terminal : `sshd`, `rsyslogd`, `systemd-journald`… Par convention, leur nom finit souvent par **d** (*daemon*).

    | Partie | Rôle |
    |---|---|
    | **`ps -eo comm=`** | **tous** les processus (`-e`), seulement la colonne **nom** (`-o comm`), sans en-tête (`=`) |
    | **`grep 'd$'`** | garde les noms dont la **fin de ligne** (`$`) est précédée d'un **d** |
    | **`grep -c`** | **compte** les lignes au lieu de les afficher (comme `\| wc -l`) |

    Le corrigé ENI part de `ps -ef | grep -e 'd ' -e 'd$'` : ce filtre cherche un « d » **n'importe où** dans la ligne (dans les arguments aussi) et attrape la commande **`grep` elle-même**, d'où le `grep -v grep`. Filtrer **uniquement la colonne du nom** évite ces faux positifs. Le compte inclut aussi des processus du noyau comme `kthreadd` : c'est normal. Attention, `comm` coupe les noms à **15 caractères** : `systemd-journald` devient `systemd-journal` et échappe au filtre.

    **4. Mes processus**

    **`ps -fu $USER`** : **`-u`** filtre sur un utilisateur, **`-f`** donne le format complet (UID, PID, **PPID** = processus parent, heure, terminal, commande). Pour une connexion SSH, on voit la chaîne : `sshd: camille@pts/0` → `-bash` → `ps`.

    **5. Les connexions PuTTY**

    Chaque connexion SSH crée des processus **`sshd`** (un par connexion, plus le service qui écoute). `ps -ef | grep sshd` les liste ; **`grep -v grep`** retire la ligne du `grep` lui-même ; **`>`** écrit le tout dans un fichier. **`pgrep -a sshd`** fait la même chose en une commande, sans faux positif.

    **6. Le PID du shell de la 2e session**

    **`echo $$`** affiche le PID du shell courant. **`ps`** sans option affiche les processus du terminal courant : la ligne `bash` donne le PID. **`tty`** affiche le terminal (`/dev/pts/1`), utile pour retrouver la bonne session depuis la 1re.

    **7 et 8. Les signaux**

    | Signal | N° | Commande | Effet |
    |---|---|---|---|
    | **SIGTERM** | 15 | `kill PID` (**par défaut**) | demande **poliment** de s'arrêter ; le programme peut l'**ignorer** |
    | **SIGHUP** | 1 | `kill -HUP PID` ou `kill -1` | « **raccrocher** » : le terminal est fermé ; un shell interactif se termine proprement |
    | **SIGKILL** | 9 | `kill -KILL PID` ou `kill -9` | arrêt **immédiat** par le noyau, **impossible** à ignorer, aucun nettoyage |

    - **Étape 7** : un **bash interactif ignore SIGTERM**. `kill 954` ne fait donc rien, la 2e session reste ouverte.
    - **Étape 8** : **SIGHUP** est le signal **adapté** : c'est celui qu'envoie le système quand une connexion se coupe, le shell se ferme proprement (sauvegarde de l'historique, arrêt de ses processus enfants). **SIGKILL** marche aussi, mais **en dernier recours**, car il ne laisse aucune chance au programme de faire le ménage.
    - Un utilisateur ne peut envoyer de signal **qu'à ses propres processus**. root peut viser n'importe lequel, d'où l'importance de **vérifier le PID** avant (`ps -p PID -o pid,tty,cmd`).
