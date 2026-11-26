# TP - Gérer les groupes et utilisateurs

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 10 : Gestion des utilisateurs et des groupes](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-10-gestion-des-utilisateurs-et-des-groupes/index.md).*

*TP M10TP01 · durée estimée : 20 à 30 minutes · sur le serveur Debian sans interface graphique, en root.*

=== "📋 Ce qui est demandé"

    Créer **3 comptes** avec les caractéristiques ci-dessous. Il faut **d'abord créer les groupes** dont ils ont besoin.

    | Compte | Shell | Répertoire personnel | Mot de passe | Groupe principal | Groupes secondaires |
    |---|---|---|---|---|---|
    | **francois** | `sh` | `/home/francois` | `password` | **admin** | stagiaires, documentation |
    | **frederic** | `bash` | `/home/frederic` | `AchAngEr`, **à changer à la 1re connexion** | *(par défaut)* | stagiaires, documentation |
    | **fabrice** | `bash` | `/home/fabrice` | `password`, **compte désactivé** | *(par défaut)* | vip |

    **Indice** : pour le mot de passe de Frédéric, lire `man passwd`.

    !!! danger "Interdit"
        Ne **jamais** modifier à la main `/etc/passwd`, `/etc/group`, `/etc/shadow` ou `/etc/gshadow` : tout se fait avec les commandes.

=== "⌨️ Les commandes"

    ```bash
    # 0. Les groupes d'abord
    groupadd admin
    groupadd stagiaires
    groupadd documentation
    groupadd vip

    # 1. François : shell sh, groupe principal admin
    useradd -m -s /bin/sh -g admin -G stagiaires,documentation francois
    passwd francois                           # saisir : password
    id francois                               # vérifier les groupes

    # 2. Frédéric : mot de passe à changer à la 1re connexion
    useradd -m -d /home/frederic -s /bin/bash -G stagiaires,documentation frederic
    passwd frederic                           # saisir : AchAngEr
    passwd -e frederic                        # mot de passe expiré tout de suite
    su - frederic                             # test : il doit demander un nouveau mot de passe (Ctrl+C pour sortir)

    # 3. Fabrice : compte désactivé
    useradd -m -s /bin/bash -G vip fabrice
    passwd fabrice                            # saisir : password
    usermod -L -e 1 fabrice                   # verrouiller + faire expirer le compte
    su - fabrice                              # test : « Votre compte a expiré »

    # Vérifications
    getent passwd francois frederic fabrice   # shell et répertoire personnel
    getent group admin stagiaires documentation vip
    chage -l frederic                         # « Dernier changement : le mot de passe doit être changé »
    passwd -S fabrice                         # « L » = verrouillé
    ```

=== "✅ Corrigé expliqué"

    !!! warning "Debian 12 : `su -` et pas `su`"
        Les commandes d'administration (`useradd`, `groupadd`, `usermod`…) sont dans **`/usr/sbin`**. Sur Debian 12, **`su`** tout seul garde le PATH de l'utilisateur, qui ne contient pas `/usr/sbin` → *« useradd : commande introuvable »*. Il faut **`su -`** (avec le tiret), qui ouvre un vrai environnement root.
        Autre différence : sans `-s`, `useradd` donne le shell **`/bin/sh`** (réglage de `/etc/default/useradd`), d'où l'option `-s /bin/bash`. La commande **`adduser`**, propre à Debian, est interactive et fait tout d'un coup (home, groupe, mot de passe).

    **0. Créer les groupes avant les comptes**

    `useradd` refuse un groupe qui n'existe pas. On crée donc **admin**, **stagiaires**, **documentation** et **vip** avec **`groupadd`**.

    **Les options de `useradd` utilisées**

    | Option | Rôle | Exemple |
    |---|---|---|
    | **`-m`** | crée le répertoire personnel (sinon il n'existe pas sur Debian) | `-m` |
    | **`-d`** | choisit le chemin du répertoire personnel (par défaut `/home/<nom>`) | `-d /home/frederic` |
    | **`-s`** | le shell lancé à la connexion | `-s /bin/sh` |
    | **`-g`** | le **groupe principal** (un seul) | `-g admin` |
    | **`-G`** | les **groupes secondaires**, séparés par des virgules **sans espace** | `-G stagiaires,documentation` |

    `useradd` ne pose **pas** de mot de passe : il faut toujours enchaîner avec **`passwd <compte>`**.

    **1. François**

    Avec **`-g admin`**, son groupe principal est admin. **`id francois`** le confirme :
    `uid=1001(francois) gid=1001(admin) groupes=1001(admin),1002(stagiaires),1003(documentation)`.

    **2. Frédéric**

    Sans `-g`, Debian crée un **groupe personnel** du même nom (`gid=…(frederic)`) qui devient son groupe principal.
    **`passwd -e frederic`** (*expire*) annule tout de suite la validité du mot de passe : à la prochaine connexion, il doit le changer. Test avec **`su - frederic`** : *« Vous devez changer votre mot de passe immédiatement »*. On annule avec **Ctrl+C**.
    Le corrigé ENI met `-d /home/fred` : l'énoncé demande **`/home/frederic`**, c'est cette valeur qu'il faut utiliser.

    **3. Fabrice**

    On crée le compte normalement, puis on le désactive avec **`usermod -L -e 1 fabrice`** :

    | Option | Effet |
    |---|---|
    | **`-L`** (*lock*) | ajoute un `!` devant le mot de passe dans `/etc/shadow` : le mot de passe ne fonctionne plus |
    | **`-e 1`** (*expire*) | date d'expiration du compte au **2 janvier 1970** : le compte est expiré, **toutes** les connexions sont refusées |

    Les deux ensemble sont plus sûrs : `-L` seul n'empêche pas une connexion SSH **par clé**, l'expiration si.
    Test : `su - fabrice` → *« Votre compte a expiré ; veuillez contacter votre administrateur système »*.
    Pour le réactiver : **`usermod -U -e "" fabrice`**.

    !!! tip "Les commandes de vérification"
        **`id <compte>`** : UID, groupe principal et groupes secondaires · **`getent passwd <compte>`** : shell et répertoire personnel · **`chage -l <compte>`** : dates du mot de passe et du compte · **`passwd -S <compte>`** : état du mot de passe (`P` = actif, `L` = verrouillé).
