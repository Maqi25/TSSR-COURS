# TP - Gestion de la planification des tâches

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 12 : Maintenance d'un système en production](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-12-maintenance-d-un-systeme-en-production/index.md).*

*TP M12TP02 · durée estimée : 30 à 45 minutes · sur le serveur Debian sans interface graphique · utilise le compte **francois** (TP du module 10) et le répertoire **/srv/depot** ([TP Gestion des permissions](tp-gestion-des-permissions.md)).*

=== "📋 Ce qui est demandé"

    | # | Type | Quand ? | Quoi ? |
    |---|---|---|---|
    | 1 | crontab **de francois** | du **lundi au vendredi à 9 h 15** | **mettre à jour** l'archive de son répertoire personnel : `/srv/depot/francois.tar` |
    | 2 | crontab **de francois** | **chaque samedi à 10 h** | **compresser** `francois.tar` en `francois.tar.bz2`, puis **créer une nouvelle** archive `francois.tar` |
    | 3 | crontab **système** | **toutes les 30 minutes, le mardi** | lister **tous les processus** en détail (dont **%CPU** et **%MEM**), **ajoutés** dans `/var/log/procstatus.log` |

=== "⌨️ Les commandes"

    ```bash
    # 1 et 2. Crontab de francois
    su - francois
    crontab -e                                # 1re fois : choisir l'éditeur (1 = nano)
    crontab -l                                # vérifier
    exit

    # (ou, depuis root : crontab -u francois -e)

    # 3. Crontab système
    nano /etc/crontab                         # ajouter la ligne ci-dessous

    # Vérifier que les tâches tournent
    journalctl -u cron -n 20                  # Debian 12 (sans rsyslog : pas de /var/log/syslog)
    tar -tvf /srv/depot/francois.tar | head   # contenu de l'archive
    head -n 5 /var/log/procstatus.log
    ```

    **Crontab de francois** (`crontab -e`) :

    ```text
    # m  h  jdm mois jds   commande
    # 1. Du lundi au vendredi à 9h15 : mise à jour de l'archive
    15  9  *   *    1-5   tar -uf /srv/depot/francois.tar -C / home/francois
    # 2. Le samedi à 10h : compression puis nouvelle archive
    0   10 *   *    6     bzip2 -f /srv/depot/francois.tar && tar -cf /srv/depot/francois.tar -C / home/francois
    ```

    **Ligne ajoutée dans `/etc/crontab`** (6e colonne = l'utilisateur) :

    ```text
    # 3. Toutes les 30 min le mardi : état des processus
    */30 *  *   *    2  root  (date; ps aux) >> /var/log/procstatus.log
    ```

=== "✅ Corrigé expliqué"

    **Lire une ligne de crontab : 5 champs de temps, puis la commande**

    | Champ | Valeurs | Dans ce TP |
    |---|---|---|
    | **minute** | 0-59 | `15`, `0`, `*/30` |
    | **heure** | 0-23 | `9`, `10`, `*` |
    | **jour du mois** | 1-31 | `*` (tous) |
    | **mois** | 1-12 | `*` (tous) |
    | **jour de la semaine** | 0-7 (**0 et 7 = dimanche**, 1 = lundi… 6 = samedi) | `1-5`, `6`, `2` |

    | Notation | Sens |
    |---|---|
    | `*` | toutes les valeurs |
    | `1-5` | de 1 à 5 (lundi → vendredi) |
    | `1,3,5` | liste (lundi, mercredi, vendredi) |
    | `*/30` | toutes les 30 unités (minute 0 et 30) |

    **Crontab utilisateur ou crontab système ?**

    | | **Crontab utilisateur** | **Crontab système** |
    |---|---|---|
    | Où | `crontab -e` (stockée dans `/var/spool/cron/crontabs/`) | **`/etc/crontab`** ou un fichier dans **`/etc/cron.d/`** |
    | Droits | ceux de **l'utilisateur** | on choisit l'utilisateur |
    | Format | 5 champs + commande | 5 champs + **utilisateur** + commande |

    On n'édite **jamais** directement le fichier dans `/var/spool/cron` : `crontab -e` vérifie la syntaxe et prévient cron.

    **1. L'archive mise à jour (9 h 15, lundi → vendredi)**

    **`15 9 * * 1-5`** : à 9 h **15**, tous les jours du mois, tous les mois, du **lundi (1) au vendredi (5)**.

    | Option de tar | Rôle |
    |---|---|
    | **`-u`** (*update*) | ajoute seulement les fichiers **nouveaux ou modifiés** depuis la dernière fois (crée l'archive si elle n'existe pas) |
    | **`-f`** | le fichier archive |
    | **`-C /`** | se place d'abord à la racine : l'archive contient `home/francois/…` (chemin **relatif**, restaurable n'importe où) |

    Le corrigé ENI écrit `cd / ; tar -uvf …` : ça marche, mais **`-v`** affiche chaque fichier, et cron envoie toute sortie **par mail** à l'utilisateur. Dans une tâche planifiée, on évite les sorties inutiles. Le `cd /` est remplacé ici par **`-C /`**, qui fait la même chose.

    **2. La compression du samedi (10 h)**

    **`0 10 * * 6`** : à 10 h **00** le **samedi (6)**.

    - **`bzip2 -f francois.tar`** compresse en **`francois.tar.bz2`** et **supprime** le `.tar` d'origine ; **`-f`** écrase le `.bz2` de la semaine précédente.
    - **`&&`** : la nouvelle archive n'est créée **que si** la compression a réussi.
    - **`tar -cf`** (*create*) repart d'une archive neuve, que les jours ouvrables suivants mettront à jour.

    **3. La surveillance des processus (mardi, toutes les 30 min)**

    **`*/30 * * * 2 root`** : aux minutes 0 et 30 de chaque heure, le **mardi (2)**, exécuté par **root**.

    - **`ps aux`** liste **tous** les processus (**a** : de tous les utilisateurs, **u** : format détaillé avec **%CPU**, **%MEM**, **x** : même ceux sans terminal). Le corrigé ENI met `ps -faux`, qui fonctionne mais mélange deux syntaxes ; `ps faux` (sans tiret) affiche en plus l'**arbre** des processus.
    - **`date`** horodate chaque relevé, pour s'y retrouver dans le fichier.
    - **`>>`** **ajoute** à la fin du fichier (« de façon durable ») ; avec `>`, chaque relevé effacerait le précédent.

    !!! warning "Pièges classiques de cron"
        - cron a un **PATH réduit** (`/usr/bin:/bin`) : en cas de doute, écrire le chemin complet des commandes (`/usr/bin/tar`).
        - Le caractère **`%`** a un sens spécial dans une crontab (retour à la ligne) : l'écrire **`\%`**, par exemple dans `date +\%F`.
        - Une crontab doit **finir par une ligne vide**, sinon la dernière tâche peut être ignorée.
        - Pour tester une ligne, régler une heure proche, puis regarder les journaux : **`journalctl -u cron`** sur Debian 12 (`grep CRON /var/log/syslog` si rsyslog est installé). Une ligne `(CRON) info (No MTA installed, discarding output)` signifie que la tâche a **affiché quelque chose** et que, faute de serveur mail, cette sortie est jetée : c'est le cas du `-v` de tar.
