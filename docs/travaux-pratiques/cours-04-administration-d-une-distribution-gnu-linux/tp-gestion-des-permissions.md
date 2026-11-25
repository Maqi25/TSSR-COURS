# TP - Gestion des permissions

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 11 : Droits sur les fichiers et répertoires](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-11-droits-sur-les-fichiers-et-repertoires/index.md).*

*TP M11TP01 · durée estimée : 45 minutes à 1 heure · sur le serveur Debian sans interface graphique, en root · suite du TP du module 10 (groupes **admin** et **documentation**, comptes francois, frederic…).*

=== "📋 Ce qui est demandé"

    Créer une **structure de stockage** pour les fichiers des utilisateurs, avec 4 répertoires :

    | Répertoire | Qui lit ? | Qui écrit ? | Règle en plus |
    |---|---|---|---|
    | **public** | tout le monde | tout le monde | — |
    | **depot** | tout le monde | tout le monde | seul le **propriétaire d'un fichier** peut le **supprimer** |
    | **admin** | groupe **admin** uniquement | groupe **admin** uniquement | les autres n'ont **aucun** accès |
    | **documentation** | tout le monde | groupe **documentation** | tout nouveau fichier **appartient au groupe documentation** |

    **Contraintes de l'énoncé** :

    - certains répertoires demandent des **droits spéciaux** ;
    - l'emplacement doit respecter la norme **FHS** (où ranger ces données sur un serveur ?) ;
    - **tester** avec plusieurs types de comptes : administrateur, simple utilisateur, gestionnaire de la documentation.

=== "⌨️ Les commandes"

    ```bash
    # Où ? /srv = données servies par la machine (norme FHS)

    # 1. public : lecture/écriture pour tous
    mkdir -p /srv/public
    chmod 777 /srv/public                     # ou : chmod go+w /srv/public
    ls -ld /srv/public                        # drwxrwxrwx root root

    # 2. depot : écriture pour tous + sticky bit
    mkdir /srv/depot
    chmod 1777 /srv/depot                     # ou : chmod go+w,+t /srv/depot
    ls -ld /srv/depot                         # drwxrwxrwt root root

    # 3. admin : groupe admin uniquement
    mkdir /srv/admin
    chown :admin /srv/admin                   # groupe propriétaire = admin
    chmod 770 /srv/admin                      # ou : chmod g+w,o-rx /srv/admin
    ls -ld /srv/admin                         # drwxrwx--- root admin

    # 4. documentation : lecture pour tous, écriture pour le groupe + SetGID
    mkdir /srv/documentation
    chown :documentation /srv/documentation   # indispensable (oublié dans le corrigé ENI)
    chmod 2775 /srv/documentation             # ou : chmod g+ws /srv/documentation
    ls -ld /srv/documentation                 # drwxrwsr-x root documentation

    # Vue d'ensemble
    ls -l /srv
    ```

    **Les tests, compte par compte** (comptes du TP du module 10) :

    ```bash
    # francois : groupe admin + documentation
    su - francois
    touch /srv/public/f.txt /srv/depot/f.txt  # OK
    touch /srv/admin/f.txt                    # OK (groupe admin)
    touch /srv/documentation/f.txt            # OK (groupe documentation)
    ls -l /srv/documentation/f.txt            # groupe = documentation grâce au SetGID
    exit

    # un simple utilisateur, sans groupe particulier
    useradd -m -s /bin/bash test              # compte de test
    su - test
    rm /srv/depot/f.txt                       # REFUSÉ : sticky bit
    rm /srv/public/f.txt                      # accepté (répondre « o » à la question) : pas de sticky bit sur public
    ls /srv/admin                             # REFUSÉ : Permission non accordée
    cat /srv/documentation/f.txt              # OK en lecture
    touch /srv/documentation/t.txt            # REFUSÉ en écriture
    exit
    ```

=== "✅ Corrigé expliqué"

    **Où créer la structure ? `/srv`**

    La norme **FHS** (*Filesystem Hierarchy Standard*) range dans **`/srv`** les données **servies** par la machine : partages d'un serveur de fichiers, site web, dépôt FTP. Ce n'est ni `/home` (données personnelles d'un compte), ni `/var` (données qui changent pour le système : journaux, files d'attente), ni `/tmp`.
    `mkdir -p` crée aussi `/srv` s'il n'existait pas ; ensuite, `-p` ne sert plus.

    **Rappel : lire les droits d'un répertoire**

    Sur un **répertoire**, les droits n'ont pas le même sens que sur un fichier :

    | Droit | Sur un répertoire, permet de… |
    |---|---|
    | **r** (4) | **lister** son contenu (`ls`) |
    | **w** (2) | **créer, renommer, supprimer** des fichiers dedans |
    | **x** (1) | **entrer** dedans (`cd`) et accéder aux fichiers |

    👉 Supprimer un fichier dépend des droits **du répertoire**, pas de ceux du fichier. C'est pour ça qu'il faut un droit spécial pour **depot**.

    **1. public → `777`**

    Par défaut, `mkdir` donne `rwxr-xr-x` (755) : les autres lisent mais n'écrivent pas. On ajoute **w** au groupe et aux autres : **`rwxrwxrwx`**. Tout le monde peut créer, lire **et supprimer les fichiers des autres**.

    **2. depot → `1777`, le sticky bit**

    Même chose que public, plus le **sticky bit** (`t`, valeur **1000**) : dans ce répertoire, un fichier ne peut être supprimé ou renommé **que par son propriétaire** (ou par le propriétaire du répertoire, ou root).
    Il se voit à la place du dernier `x` : **`drwxrwxrwt`**. C'est exactement le réglage de **`/tmp`**.
    Le corrigé ENI fait `chmod o+wt` : les **autres** peuvent écrire, mais le **groupe** reste en `r-x`. Ça fonctionne ici, car le groupe propriétaire est root, mais `1777` est plus clair.

    **3. admin → `770` et groupe admin**

    | Commande | Effet |
    |---|---|
    | **`chown :admin /srv/admin`** | le **groupe propriétaire** devient admin (le `:` devant = on ne change que le groupe ; équivalent : `chgrp admin`) |
    | **`chmod 770`** | propriétaire (root) `rwx`, groupe admin `rwx`, autres **rien** (`---`) |

    Sans `x` ni `r` pour les autres, un utilisateur hors du groupe ne peut ni lister ni entrer : *« Permission non accordée »*.

    **4. documentation → `2775`, groupe documentation et SetGID**

    | Élément | Rôle |
    |---|---|
    | **`chown :documentation`** | le groupe documentation devient propriétaire du répertoire |
    | **`775`** | groupe `rwx` (écrit), autres `r-x` (lisent seulement) |
    | **SetGID** (`s`, valeur **2000**) | tout fichier créé dedans **hérite du groupe du répertoire** (documentation), au lieu du groupe principal de son créateur |

    On le voit à la place du `x` du groupe : **`drwxrwsr-x`**. Sans SetGID, un fichier créé par francois appartiendrait au groupe **admin** (son groupe principal) et ses collègues de la documentation ne pourraient pas forcément le modifier.

    !!! warning "Erreur dans le corrigé ENI"
        Le corrigé fait seulement `chmod g+ws /srv/documentation` : le résultat est **`drwxrwsr-x root root`**. Le groupe propriétaire est resté **root**, donc les fichiers héritent du groupe root et le groupe documentation **ne peut pas écrire**. Il manque **`chown :documentation /srv/documentation`**.

    **Les droits spéciaux en résumé**

    | Droit | Valeur | Lettre (`ls -l`) | Sur un répertoire |
    |---|---|---|---|
    | **SetUID** | 4000 | `s` à la place du `x` du propriétaire | sans effet sous Linux (utile sur un exécutable, ex. `passwd`) |
    | **SetGID** | 2000 | `s` à la place du `x` du groupe | les nouveaux fichiers prennent le groupe du répertoire |
    | **Sticky bit** | 1000 | `t` à la place du `x` des autres | seul le propriétaire d'un fichier peut le supprimer |

    Une lettre **majuscule** (`S` ou `T`) signale un droit spécial posé **sans** le `x` en dessous : en général, c'est une erreur.

    **Pourquoi tester avec plusieurs comptes ?**

    root **ignore** les droits : un test fait en root réussit toujours et ne prouve rien. On teste avec `su - <compte>` : un membre d'admin, un membre de documentation, un simple utilisateur. Attention, un compte ajouté à un groupe **pendant** qu'il est connecté doit **se reconnecter** pour que le nouveau groupe soit pris en compte (`id` pour vérifier).
