# TP - Gestion des paquets

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 6 : Gestion des paquets logiciels](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-6-gestion-des-paquets-logiciels/index.md).*

*TP M06TP01 · durée estimée : 30 à 45 minutes · partie I sur la station Debian graphique, partie II sans interface graphique (en SSH).*

=== "📋 Ce qui est demandé"

    **Partie I — Avec l'interface graphique**

    | # | Consigne | Résultat attendu |
    |---|---|---|
    | 1 | Ouvrir **« Software & Updates »** et parcourir les onglets | Repérer les dépôts configurés |
    | 2 | **Désactiver le dépôt CD-ROM** si besoin | Cases `cdrom:` décochées |
    | 3 | Lire **`/etc/apt/sources.list`** : lignes des **binaires**, des **mises à jour**, du **code source** ? | `deb` · `…-updates` · `deb-src` |
    | 4 | **Désactiver les dépôts de code source** | Lignes `deb-src` commentées (`#`) |
    | 5 | **Mettre à jour** avec apt : combien de paquets, et pourquoi ? | Très peu, voire aucun |
    | 6 | Installer **GParted** avec l'outil **« Logiciels »** et le lancer depuis le menu GNOME | GParted s'ouvre (ne rien modifier) |
    | 7 | Installer avec **apt** : **vim**, un **serveur SSH** (chercher le nom du paquet), **terminator** | 3 paquets installés |
    | 8 | Afficher leurs infos avec **`apt show`** et **`dpkg -L`** | Version, dépendances, fichiers installés |
    | 9 | Se connecter à la VM avec **PuTTY** | Invite de commande à distance |

    **Partie II — Sans interface graphique**

    | # | Consigne | Résultat attendu |
    |---|---|---|
    | 10 | Écrire **à la main** les dépôts Internet dans `sources.list` (`bookworm`, `bookworm-updates`, garder `bookworm-security`) | 3 lignes `deb` |
    | 11 | **Vérifier puis appliquer** les mises à jour, redémarrer si besoin | Système à jour |
    | 12 | Installer **vim** et **cifs-utils** | 2 paquets (+ dépendances) installés |
    | 13 | **Configurer vim** : `syntax on` dans `/etc/vim/vimrc` + fichier **`/etc/vim/vimrc.local`** | Coloration + copier-coller qui marche dans PuTTY |

=== "⌨️ Les commandes"

    ```bash
    # --- Partie I ---
    cat /etc/apt/sources.list               # lire les dépôts
    su -                                    # passer root
    vi /etc/apt/sources.list                # puis, dans vi :  :g/^deb-src/s/^/#
    apt update                              # rafraîchir la liste des paquets
    apt upgrade                             # appliquer les mises à jour

    apt install vim
    apt search ssh-server                   # trouver le bon nom de paquet
    apt install openssh-server
    apt install terminator

    apt show vim                            # infos : version, taille, dépendances…
    dpkg -L vim                             # fichiers installés par le paquet
    ip a                                    # l'adresse IP à donner à PuTTY (port 22)

    # --- Partie II ---
    vi /etc/apt/sources.list                # les 3 lignes deb ci-dessous
    apt update && apt full-upgrade          # vérifier puis appliquer les mises à jour
    reboot                                  # si un nouveau noyau a été installé
    apt install vim cifs-utils              # plusieurs paquets d'un coup
    ls /usr/share/vim                       # repérer le dossier vimXX (vim90 sur Bookworm)
    vi /etc/vim/vimrc                       # décommenter : syntax on
    vi /etc/vim/vimrc.local                 # créer le fichier (contenu ci-dessous)
    ```

    **`/etc/apt/sources.list`** (partie II) :

    ```text
    deb http://deb.debian.org/debian/ bookworm main non-free-firmware
    deb http://deb.debian.org/debian/ bookworm-updates main non-free-firmware
    deb http://security.debian.org/debian-security bookworm-security main non-free-firmware
    ```

    `deb.debian.org` choisit tout seul un miroir proche (`ftp.fr.debian.org` marche aussi). **`non-free-firmware`** est la section des **micrologiciels** (Wi-Fi, cartes graphiques…), nouvelle dans Debian 12 et ajoutée par défaut par l'installateur.

    **`/etc/vim/vimrc.local`** :

    ```vim
    source /usr/share/vim/vim90/defaults.vim
    let skip_defaults_vim = 1
    if has('mouse')
      set mouse=r
    endif
    set paste
    ```

=== "✅ Corrigé expliqué"

    **1-2. Software & Updates**

    On le trouve en tapant *software* dans le menu GNOME.
    - Onglet **Debian Software** : le dépôt principal **`main`** est coché, ainsi que **`non-free-firmware`** sur Debian 12 (micrologiciels). On peut aussi cocher `contrib` et `non-free`.
    - Onglet **Updates** : les dépôts **`…-security`** (sécurité) et **`…-updates`** (mises à jour recommandées).
    - Onglet **Other Software** : **décocher** les lignes **`cdrom:[Debian GNU/Linux …]`**, sinon apt réclame le DVD à chaque installation.

    **3. Lire sources.list**

    | Ligne qui… | Rôle |
    |---|---|
    | commence par **`deb `** | dépôt de paquets **binaires** (prêts à installer) |
    | contient **`…-updates`** (et `…-security`) | dépôt des **mises à jour** |
    | commence par **`deb-src`** | dépôt du **code source** → oui, on peut récupérer les sources |
    | commence par **`#`** | ligne **désactivée** (commentaire) |

    **4. Désactiver le code source**

    Passer root (`su -`), ouvrir `vi /etc/apt/sources.list`, puis taper **`:g/^deb-src/s/^/#`** : sur **toutes** les lignes qui commencent par `deb-src` (`:g/^deb-src/`), remplacer le début de ligne `^` par `#` → *3 substitutions on 3 lines*. Enregistrer avec `:wq`.

    **5. Combien de mises à jour ?**

    Après `apt update` : **« Tous les paquets sont à jour »** (ou presque). **Pourquoi ?** L'installation *netinstall* a téléchargé des paquets **déjà à jour** depuis Internet.

    **6. GParted via « Logiciels »**

    Chercher *GParted* → **Installer** → le **mot de passe root** est demandé (élévation de droits). L'appli apparaît dans le menu GNOME ; au lancement, le mot de passe est redemandé. On regarde, **on ne modifie rien**, on quitte.

    **7. Installer avec apt**

    - **`apt install vim`** : apt ajoute la dépendance **`vim-runtime`**, puis demande confirmation **[O/n]**.
    - **Serveur SSH** : `apt search ssh` donne trop de résultats → **`apt search ssh-server`** montre **`openssh-server`**. À noter : le paquet **`ssh`** est un **métapaquet** qui installe `openssh-server` + `openssh-client`.
    - **`apt install terminator`** : un terminal graphique qui permet de **découper la fenêtre** en plusieurs terminaux.

    **8. Infos sur un paquet**

    **`apt show vim`** = la fiche du paquet (version, taille, dépendances, description) · **`dpkg -L vim`** = la **liste des fichiers** qu'il a posés sur le disque (`/usr/bin/vim.basic`, `/usr/share/doc/vim`…).

    **9. PuTTY**

    Sous Windows, lancer PuTTY → **Host Name** = l'**adresse IP de la VM**, port **22**, type **SSH** → *Open* → saisir login et mot de passe. Ça marche parce qu'on vient d'installer **`openssh-server`**.

    **10. Dépôts écrits à la main**

    On remplace le contenu de `sources.list` par les **3 lignes `deb`** : dépôt principal, `-updates` et `-security` (dans la capture ENI c'est encore **Bullseye** → on écrit **Bookworm**, le nom de la version Debian 12).

    **11. Mises à jour**

    `apt update` puis **`apt full-upgrade`**. Le nombre de paquets **dépend de l'écart** entre la date du DVD d'installation et aujourd'hui. On redémarre si le **noyau** a été mis à jour.

    **12. vim + cifs-utils**

    **`apt install vim cifs-utils`** : on peut installer **plusieurs paquets en une commande**. apt ajoute les dépendances (`keyutils`, `libtalloc2`, `vim-runtime`…) → *8 nouvellement installés*.

    **13. Configurer vim**

    - Dans **`/etc/vim/vimrc`**, enlever le **`"`** devant **`syntax on`** (le `"` est le commentaire de vim) → **coloration syntaxique**.
    - Créer **`/etc/vim/vimrc.local`** : il charge les réglages par défaut de vim, puis **`set mouse=r`** et **`set paste`** pour que la **sélection et le copier-coller** fonctionnent normalement dans PuTTY.

    !!! warning "Le dossier vimXX change selon la version"
        `vim90` sur Debian 12, `vim82` sur Debian 11… Vérifie avec **`ls /usr/share/vim`** avant d'écrire la ligne `source`, sinon vim affiche une erreur au démarrage.
