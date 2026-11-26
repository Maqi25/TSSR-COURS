# TP - Automatisation et planification (crontab)

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 12 : Maintenance d'un système en production](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-12-maintenance-d-un-systeme-en-production/index.md).*

*TP guidé du formateur · Debian 12 · complète le [TP Gestion de la planification des tâches](tp-gestion-de-la-planification-des-taches.md) · utilise le compte **francois** (TP du module 10).*

=== "📋 Ce qui est demandé"

    **Partie I · Crontab de francois** (`crontab -e`, chemins **absolus**)

    | # | Quand ? | Quoi ? | Fichier |
    |---|---|---|---|
    | 1 | **toutes les 15 min**, de **8 h à 17 h**, du **lundi au vendredi** | espace disque (`df -h`) | `/home/francois/espace_disque.log` |
    | 2 | **toutes les 10 min**, du **lundi au vendredi** | ses processus (`ps -u francois`) | `/home/francois/mes_processus.log` |
    | 3 | **toutes les minutes** | la date puis le message « Prise de poste » | `/home/francois/journal.txt` |

    Pour l'exercice 3 : **construire la commande dans le terminal** (date, puis message, puis les deux avec `&&`), la planifier, puis **observer** son déclenchement.

    **Partie II · Crontab système** : savoir consulter `/etc/crontab`, l'état du service cron et ses journaux.

    **Exercice en autonomie**

    | Tâche | Compte | Quand ? | Quoi ? | Fichier |
    |---|---|---|---|---|
    | 1 | **devuser** (à créer), sa crontab | **toutes les 5 min**, **8 h-17 h**, **lundi → vendredi** | `uptime` | `/home/devuser/system_status.log` |
    | 2 | **root**, `/etc/crontab` | **toutes les 10 min**, **8 h-18 h**, **lundi → vendredi** | `free -h` | `/var/log/memoire.log` |

=== "⌨️ Les commandes"

    ```bash
    # --- Partie I : en francois ---
    su - francois
    crontab -e                                # ajouter les 3 lignes ci-dessous

    # Exercice 3 : construire la commande pas à pas, dans le terminal
    date >> /home/francois/journal.txt
    echo "Prise de poste" >> /home/francois/journal.txt
    date >> /home/francois/journal.txt && echo "Prise de poste" >> /home/francois/journal.txt
    cat /home/francois/journal.txt            # 3 ajouts visibles

    # Observer le déclenchement (après l'avoir mis dans crontab -e)
    tail -f /home/francois/journal.txt        # un bloc par minute, Ctrl+C pour quitter
    crontab -l                                # les 3 tâches de francois
    exit

    # --- Partie II : en root ---
    cat /etc/crontab                          # la table système
    systemctl status cron                     # le service tourne ?
    journalctl -u cron -f                     # exécutions en direct, Ctrl+C pour quitter

    # --- Exercice en autonomie ---
    adduser devuser                           # interactif : mot de passe, nom…
    su - devuser
    crontab -e                                # tâche 1
    exit
    nano /etc/crontab                         # tâche 2
    ```

    **Crontab de francois** :

    ```text
    # m    h     jdm mois jds  commande
    */15   8-17  *   *    1-5  df -h >> /home/francois/espace_disque.log
    */10   *     *   *    1-5  ps -u francois >> /home/francois/mes_processus.log
    *      *     *   *    *    date >> /home/francois/journal.txt && echo "Prise de poste" >> /home/francois/journal.txt
    ```

    **Solution de l'exercice en autonomie** :

    ```text
    # Tâche 1 : crontab de devuser (crontab -e, 5 champs)
    */5    8-17  *   *    1-5  uptime >> /home/devuser/system_status.log

    # Tâche 2 : /etc/crontab (6 champs : l'utilisateur en plus)
    */10   8-18  *   *    1-5  root  free -h >> /var/log/memoire.log
    ```

=== "✅ Corrigé expliqué"

    **Les champs utilisés ici**

    | Notation | Sens | Exemple du TP |
    |---|---|---|
    | **`*/15`** dans les minutes | toutes les 15 min : **0, 15, 30, 45** | exercice 1 |
    | **`8-17`** dans les heures | de 8 h à 17 h **inclus** | exercice 1, tâche 1 |
    | **`1-5`** dans les jours | du **lundi (1)** au **vendredi (5)** | exercices 1-2, tâches 1-2 |
    | **`* * * * *`** | **toutes les minutes**, tout le temps | exercice 3 |

    !!! info "« Entre 8 h et 17 h » : jusqu'à quand exactement ?"
        L'heure **`8-17`** couvre toutes les minutes de **8 h 00 à 17 h 59**. Avec `*/15`, la dernière exécution a donc lieu à **17 h 45**. Pour s'arrêter pile à 17 h 00, il faudrait deux lignes : `*/15 8-16 * * 1-5 …` et `0 17 * * 1-5 …`. Au TP, `8-17` est la réponse attendue.

    **Crontab utilisateur ou système ?**

    | | **Crontab utilisateur** | **Crontab système** |
    |---|---|---|
    | Éditer | `crontab -e` (root : `crontab -u francois -e`) | `nano /etc/crontab` en root |
    | Lire | `crontab -l` | `cat /etc/crontab` |
    | Format | **5 champs** + commande | 5 champs + **utilisateur** + commande |
    | Exécutée avec | les droits **du propriétaire de la table** | les droits de l'utilisateur **indiqué** |

    C'est pour ça que la tâche 1 n'a **pas** de colonne utilisateur (elle tourne forcément en devuser) et que la tâche 2 en a une (**`root`**, nécessaire pour écrire dans `/var/log`).

    **Exercice 3 : pourquoi construire la commande dans le terminal d'abord ?**

    Une tâche cron qui échoue ne prévient pas : pas de message à l'écran. On valide donc la commande **à la main**, puis on la colle dans la crontab.

    - **`>>`** ajoute à la fin du fichier (`>` l'écraserait à chaque minute).
    - **`&&`** lance la 2e commande **seulement si** la 1re a réussi. Avec **`;`**, elle serait lancée dans tous les cas.
    - **`tail -f`** affiche la fin du fichier et **continue de suivre** les ajouts : un nouveau bloc apparaît à chaque minute.
    - **`journalctl -u cron -f`** montre cron qui lance la tâche : une ligne `(francois) CMD (date >> …)` par exécution.

    !!! warning "Après le test, retire la ligne `* * * * *`"
        Elle tourne **toutes les minutes, sans fin** : 1 440 blocs par jour dans `journal.txt`. Une fois le test vu, supprime-la avec `crontab -e` (ou commente-la avec `#`).

    **Points Debian 12**

    - **`sudo` n'est pas installé** si tu as donné un mot de passe root à l'installation : `sudo nano /etc/crontab` échoue. Passe root avec **`su -`**, puis `nano /etc/crontab`.
    - **`su - devuser`** (avec le tiret) charge le vrai environnement de devuser : son dossier `/home/devuser`, son PATH. Sans tiret, on garde celui du compte précédent.
    - **`adduser`** (propre à Debian) est **interactif** et crée tout d'un coup : home, groupe, mot de passe. `useradd` demande les options à la main (TP du module 10).
    - Les journaux de cron sont dans **journald** (`journalctl -u cron`), pas dans `/var/log/syslog` : rsyslog n'est pas installé par défaut.
    - **Chemins absolus partout** : cron se lance avec un PATH réduit et depuis le dossier personnel, donc `/home/francois/journal.txt` plutôt que `journal.txt`.
