# TP - Gestion de la planification des tâches (cron)

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 12 : Maintenance d'un système en production](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-12-maintenance-d-un-systeme-en-production/index.md).*

*TP M12TP02 (ENI) + TP guidé du formateur, réunis · Debian 12 sans interface graphique · utilise le compte **francois** (TP du module 10) et le répertoire **/srv/depot** ([TP Gestion des permissions](tp-gestion-des-permissions.md)).*

=== "📋 Ce qui est demandé"

    **Partie I · Le TP ENI**

    | # | Table | Quand ? | Quoi ? |
    |---|---|---|---|
    | 1 | crontab **de francois** | du **lundi au vendredi à 9 h 15** | **mettre à jour** l'archive de son répertoire personnel : `/srv/depot/francois.tar` |
    | 2 | crontab **de francois** | **chaque samedi à 10 h** | **compresser** `francois.tar` en `francois.tar.bz2`, puis **créer une nouvelle** archive `francois.tar` |
    | 3 | **`/etc/crontab`** | **toutes les 30 min, le mardi** | lister **tous les processus** en détail (dont **%CPU** et **%MEM**), **ajoutés** dans `/var/log/procstatus.log` |

    **Partie II · Entraînement guidé** (chemins **absolus** partout)

    | # | Table | Quand ? | Quoi ? | Fichier |
    |---|---|---|---|---|
    | 4 | crontab de francois | **toutes les 15 min**, **8 h-17 h**, lundi → vendredi | espace disque (`df -h`) | `/home/francois/espace_disque.log` |
    | 5 | crontab de francois | **toutes les 10 min**, lundi → vendredi | ses processus (`ps -u francois`) | `/home/francois/mes_processus.log` |
    | 6 | crontab de francois | **toutes les minutes** | la date puis « Prise de poste » | `/home/francois/journal.txt` |

    Pour le n° 6 : **construire la commande dans le terminal** d'abord (date, puis message, puis les deux avec `&&`), la planifier, puis **observer** son déclenchement.

    **Partie III · En autonomie**

    | # | Table | Quand ? | Quoi ? | Fichier |
    |---|---|---|---|---|
    | 7 | crontab de **devuser** (à créer) | **toutes les 5 min**, **8 h-17 h**, lundi → vendredi | `uptime` | `/home/devuser/system_status.log` |
    | 8 | **`/etc/crontab`** (root) | **toutes les 10 min**, **8 h-18 h**, lundi → vendredi | `free -h` | `/var/log/memoire.log` |

=== "⌨️ Les commandes"

    ```bash
    # --- Crontab de francois (parties I et II) ---
    su - francois
    crontab -e                                # 1re fois : choisir l'éditeur (1 = nano)
    crontab -l                                # vérifier
    exit
    # ou, en restant root :
    crontab -u francois -e                    # -u : la table d'un autre utilisateur
    crontab -u francois -l

    # N° 6 : construire la commande pas à pas, dans le terminal (en francois)
    date >> /home/francois/journal.txt
    echo "Prise de poste" >> /home/francois/journal.txt
    date >> /home/francois/journal.txt && echo "Prise de poste" >> /home/francois/journal.txt
    cat /home/francois/journal.txt            # 3 ajouts visibles

    # --- Crontab système (root) ---
    nano /etc/crontab                         # ajouter les lignes ci-dessous

    # --- Partie III : devuser ---
    adduser devuser                           # interactif : mot de passe, nom…
    su - devuser
    crontab -e
    exit

    # --- Vérifier que tout tourne ---
    systemctl status cron                     # le service est actif ?
    journalctl -u cron -f                     # exécutions en direct, Ctrl+C pour quitter
    tail -f /home/francois/journal.txt        # un bloc par minute (n° 6), Ctrl+C
    tar -tvf /srv/depot/francois.tar | head   # contenu de l'archive (n° 1)
    head -n 5 /var/log/procstatus.log         # le relevé (n° 3)
    ```

    **Crontab de francois** :

    ```text
    # m    h     jdm mois jds  commande
    # 1. Lundi → vendredi à 9h15 : mise à jour de l'archive
    15     9     *   *    1-5  tar -uf /srv/depot/francois.tar -C / home/francois
    # 2. Samedi à 10h : compression puis nouvelle archive
    0      10    *   *    6    bzip2 -f /srv/depot/francois.tar && tar -cf /srv/depot/francois.tar -C / home/francois
    # 4. Toutes les 15 min, 8h-17h, en semaine : espace disque
    */15   8-17  *   *    1-5  df -h >> /home/francois/espace_disque.log
    # 5. Toutes les 10 min, en semaine : ses processus
    */10   *     *   *    1-5  ps -u francois >> /home/francois/mes_processus.log
    # 6. Toutes les minutes (À RETIRER après le test)
    *      *     *   *    *    date >> /home/francois/journal.txt && echo "Prise de poste" >> /home/francois/journal.txt
    ```

    **Crontab de devuser** (n° 7) :

    ```text
    */5    8-17  *   *    1-5  uptime >> /home/devuser/system_status.log
    ```

    **Lignes ajoutées dans `/etc/crontab`** (6e colonne = l'utilisateur) :

    ```text
    # 3. Toutes les 30 min le mardi : état des processus
    */30   *     *   *    2    root  (date; ps faux) >> /var/log/procstatus.log
    # 8. Toutes les 10 min, 8h-18h, en semaine : mémoire
    */10   8-18  *   *    1-5  root  free -h >> /var/log/memoire.log
    ```

=== "✅ Corrigé expliqué"

    **Lire une ligne de crontab : 5 champs de temps, puis la commande**

    | Champ | Valeurs | Dans ce TP |
    |---|---|---|
    | **minute** | 0-59 | `15`, `0`, `*/30`, `*/15`, `*/10`, `*/5` |
    | **heure** | 0-23 | `9`, `10`, `8-17`, `8-18`, `*` |
    | **jour du mois** | 1-31 | `*` (tous) |
    | **mois** | 1-12 | `*` (tous) |
    | **jour de la semaine** | 0-7 (**0 et 7 = dimanche**, 1 = lundi… 6 = samedi) | `1-5`, `6`, `2` |

    | Notation | Sens | Exemple |
    |---|---|---|
    | `*` | toutes les valeurs | `* * * * *` = **chaque minute** |
    | `1-5` | de 1 à 5 inclus | lundi → vendredi |
    | `1,3,5` | liste | lundi, mercredi, vendredi |
    | `*/15` | toutes les 15 unités | minutes 0, 15, 30, 45 |

    !!! info "« Entre 8 h et 17 h » : jusqu'à quand exactement ?"
        L'heure **`8-17`** couvre toutes les minutes de **8 h 00 à 17 h 59**. Avec `*/15`, la dernière exécution a lieu à **17 h 45**. Pour s'arrêter pile à 17 h 00, il faudrait deux lignes : `*/15 8-16 * * 1-5 …` et `0 17 * * 1-5 …`. Au TP, `8-17` est la réponse attendue.

    **Crontab utilisateur ou crontab système ?**

    | | **Crontab utilisateur** | **Crontab système** |
    |---|---|---|
    | Éditer | `crontab -e` (root : `crontab -u francois -e`) | `nano /etc/crontab` en root (ou un fichier dans `/etc/cron.d/`) |
    | Lire | `crontab -l` | `cat /etc/crontab` |
    | Format | **5 champs** + commande | 5 champs + **utilisateur** + commande |
    | Exécutée avec | les droits **du propriétaire de la table** | les droits de l'utilisateur **indiqué** |
    | Stockée dans | `/var/spool/cron/crontabs/` (ne **jamais** l'éditer à la main : `crontab -e` vérifie la syntaxe) | le fichier lui-même |

    C'est pour ça que les n° 1, 2, 4 à 7 n'ont **pas** de colonne utilisateur (elles tournent avec le compte de la table), et que les n° 3 et 8 en ont une (**`root`**, nécessaire pour écrire dans `/var/log`).

    ---

    **N° 1 · L'archive mise à jour** (`15 9 * * 1-5` : 9 h 15, lundi → vendredi)

    | Option de tar | Rôle |
    |---|---|
    | **`-u`** (*update*) | ajoute seulement les fichiers **nouveaux ou modifiés** depuis la dernière fois (crée l'archive si elle n'existe pas) |
    | **`-f`** | le fichier archive |
    | **`-C /`** | se place d'abord à la racine : l'archive contient `home/francois/…` (chemin **relatif**, restaurable n'importe où) |

    Le corrigé ENI écrit `cd / ; tar -uvf …` : ça marche, mais **`-v`** affiche chaque fichier, et cron envoie toute sortie **par mail** (ou la jette, voir les pièges). Dans une tâche planifiée, on évite les sorties inutiles. Le `cd /` est remplacé par **`-C /`**, qui fait la même chose.

    **N° 2 · La compression du samedi** (`0 10 * * 6` : 10 h 00 le samedi)

    - **`bzip2 -f francois.tar`** compresse en **`francois.tar.bz2`** et **supprime** le `.tar` d'origine ; **`-f`** écrase le `.bz2` de la semaine précédente.
    - **`&&`** : la nouvelle archive n'est créée **que si** la compression a réussi.
    - **`tar -cf`** (*create*) repart d'une archive neuve, que les jours ouvrables suivants mettront à jour.

    **N° 3 · La surveillance des processus** (`*/30 * * * 2 root` : minutes 0 et 30, le mardi, en root)

    | Élément | Rôle |
    |---|---|
    | **`( … )`** | **sous-shell** : regroupe les deux commandes pour que **leurs deux sorties** partent ensemble dans le fichier |
    | **`date`** | horodate chaque relevé |
    | **`;`** | enchaîne les commandes **quel que soit** le résultat |
    | **`ps faux`** | tous les processus en **arborescence** : **f** (*forest*) arbre, **a** tous les utilisateurs, **u** colonnes USER / **%CPU** / **%MEM**, **x** aussi les démons sans terminal |
    | **`>>`** | **ajoute** à la fin du fichier (« de façon durable ») ; `>` effacerait le relevé précédent |

    `ps faux` est en syntaxe **BSD**, **sans tiret**. Le corrigé ENI écrit `ps -faux` : Debian affiche alors un **avertissement** (*bad ps syntax, perhaps a bogus '-'?*) avant de deviner ce qu'on voulait.

    ---

    **N° 4 à 6 · Pourquoi construire la commande dans le terminal d'abord ?**

    Une tâche cron qui échoue ne prévient pas : pas de message à l'écran. On valide donc la commande **à la main**, puis on la colle dans la crontab.

    - **`&&`** lance la 2e commande **seulement si** la 1re a réussi ; **`;`** la lance dans tous les cas.
    - **`tail -f`** affiche la fin du fichier et **continue de suivre** les ajouts : un nouveau bloc apparaît à chaque minute.
    - **`journalctl -u cron -f`** montre cron au travail : une ligne `(francois) CMD (date >> …)` par exécution.

    !!! warning "Après le test, retire la ligne `* * * * *`"
        Elle tourne **toutes les minutes, sans fin** : 1 440 blocs par jour dans `journal.txt`. Une fois le test vu, supprime-la avec `crontab -e` (ou commente-la avec `#`).

    **N° 7 et 8 · La correction de l'exercice en autonomie**

    - **N° 7** : `*/5 8-17 * * 1-5 uptime >> /home/devuser/system_status.log` dans la crontab **de devuser** → **5 champs**, pas de colonne utilisateur. `uptime` donne l'heure, la durée depuis le démarrage, le nombre de sessions et la **charge**.
    - **N° 8** : `*/10 8-18 * * 1-5 root free -h >> /var/log/memoire.log` dans **`/etc/crontab`** → **6 champs** avec `root`.

    **Question type d'examen** : dans `/etc/crontab`, lancer `/usr/local/bin/backup.sh` tous les jours à 23 h 15 →
    `15 23 * * * root /usr/local/bin/backup.sh`.

    ---

    !!! tip "Debian 12"
        - **`sudo` n'est pas installé** si tu as donné un mot de passe root à l'installation : passe root avec **`su -`**, puis `nano /etc/crontab`.
        - **`su - devuser`** (avec le tiret) charge le vrai environnement de devuser : son dossier `/home/devuser`, son PATH.
        - **`adduser`** (propre à Debian) est **interactif** et crée tout d'un coup : home, groupe, mot de passe. `useradd` demande les options à la main (TP du module 10).
        - Les journaux de cron sont dans **journald** (`journalctl -u cron`) : sans rsyslog, pas de `/var/log/syslog`.

    !!! warning "Pièges classiques de cron"
        - cron a un **PATH réduit** (`/usr/bin:/bin`) et démarre dans le dossier personnel : écrire des **chemins absolus** (`/home/francois/journal.txt`, voire `/usr/bin/tar`).
        - Le caractère **`%`** a un sens spécial dans une crontab (retour à la ligne) : l'écrire **`\%`**, par exemple dans `date +\%F`.
        - Une crontab doit **finir par une ligne vide**, sinon la dernière tâche peut être ignorée.
        - Une ligne `(CRON) info (No MTA installed, discarding output)` dans les journaux signifie que la tâche a **affiché quelque chose** et que, faute de serveur mail, cette sortie est jetée (c'est le cas du `-v` de tar).
