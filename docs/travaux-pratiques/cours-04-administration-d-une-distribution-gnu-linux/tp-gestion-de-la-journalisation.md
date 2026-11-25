# TP - Gestion de la journalisation

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 12 : Maintenance d'un système en production](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-12-maintenance-d-un-systeme-en-production/index.md).*

*TP M12TP01 · durée estimée : 30 à 45 minutes · sur le serveur Debian sans interface graphique, en root.*

=== "📋 Ce qui est demandé"

    | # | Partie | Consigne | Résultat attendu |
    |---|---|---|---|
    | 1 | Rechercher | Trouver les **ouvertures de session** dans les journaux | les copier dans **`/adm/sessions.txt`** |
    | 2 | Rechercher | Trouver les infos du disque **sda** | **nombre de secteurs** et **taille** du disque |
    | 3 | rsyslog | **Activer** la journalisation du service **cron** | les messages de cron sont enregistrés |
    | 4 | rsyslog | Envoyer les messages de cron dans **`/adm/logs/cron.log`** | le fichier se remplit |
    | 5 | rsyslog | Envoyer **tous les avertissements** dans **`/adm/logs/warnings.log`** | le fichier se remplit |
    | 6 | Tester | Créer des messages d'avertissement avec **`logger`** et vérifier les étapes 3 à 5 | chaque message arrive dans le bon fichier |

=== "⌨️ Les commandes"

    ```bash
    # 1. Ouvertures de session → /adm/sessions.txt
    ls -lrt /var/log | tail -n 5                  # les journaux modifiés en dernier
    mkdir -p /adm
    grep "session opened" /var/log/auth.log | grep -v CRON > /adm/sessions.txt
    head -n 3 /adm/sessions.txt
    # sans rsyslog (pas de auth.log) :
    # journalctl | grep "session opened" | grep -v CRON > /adm/sessions.txt

    # 2. Le disque sda
    journalctl --dmesg | grep sda                 # messages du noyau seulement
    # → [sda] 20971520 512-byte logical blocks: (10.7 GB/10.0 GiB)

    # 3 à 5. Configurer rsyslog
    mkdir -p /adm/logs
    nano /etc/rsyslog.conf                        # voir les lignes ci-dessous
    rsyslogd -N1                                  # vérifie la syntaxe
    systemctl restart rsyslog

    # 6. Tester
    logger -p user.warning "TEST avertissement"   # → warnings.log
    logger -p cron.warning "TEST cron avertissement"   # → cron.log ET warnings.log
    logger -p cron.info "TEST cron info"          # → cron.log seulement
    cat /adm/logs/warnings.log
    cat /adm/logs/cron.log
    ```

    **Lignes à avoir dans `/etc/rsyslog.conf`**, partie `RULES` :

    ```text
    # 3-4. cron : ligne décommentée, chemin remplacé
    cron.*          /adm/logs/cron.log

    # 5. tous les messages de priorité warning exactement, toutes origines
    *.=warning      /adm/logs/warnings.log
    ```

=== "✅ Corrigé expliqué"

    **1. Les ouvertures de session**

    **`ls -lrt /var/log`** trie les journaux par date (**`-t`**), du plus ancien au plus récent (**`-r`**) : les derniers modifiés apparaissent en bas. On repère **`auth.log`**, le journal des **authentifications**.

    | Étape | Rôle |
    |---|---|
    | **`grep "session opened"`** | garde les lignes d'ouverture de session (login, ssh, su…) |
    | **`grep -v CRON`** | **`-v`** inverse le filtre : retire les sessions ouvertes **automatiquement** par cron toutes les heures |
    | **`> /adm/sessions.txt`** | redirige le résultat dans le fichier (**`>>`** ajouterait à la fin au lieu de remplacer) |

    !!! info "Pas de `/var/log/auth.log` ?"
        Depuis Debian 12, **rsyslog n'est plus installé par défaut** : les journaux sont seulement dans **journald**. On lit alors avec `journalctl`, ou on installe rsyslog (`apt install rsyslog`), indispensable pour la suite du TP.

    **2. Le disque sda**

    Au démarrage, le noyau décrit chaque disque détecté. **`journalctl --dmesg`** (ou `-k`) ne montre que les messages du **noyau**, puis `grep sda` filtre :
    `[sda] 20971520 512-byte logical blocks: (10.7 GB/10.0 GiB)`
    → **20 971 520 secteurs** de **512 octets**, soit **10,7 Go** (puissances de 10) ou **10,0 Gio** (puissances de 2).
    Équivalent : `dmesg | grep sda`.

    **3 à 5. rsyslog : facility, priorité, destination**

    Chaque ligne de règle se lit **« sélecteur → destination »**. Le sélecteur s'écrit **`facility.priorité`** :

    | Élément | Sens | Exemples |
    |---|---|---|
    | **facility** | **qui** envoie le message | `auth`, `cron`, `kern`, `mail`, `user`, `*` (tous) |
    | **priorité** | **gravité** du message | du plus grave au moins grave : `emerg` · `alert` · `crit` · `err` · `warning` · `notice` · `info` · `debug` |
    | **`.prio`** | cette priorité **et les plus graves** | `*.warning` = warning, err, crit… |
    | **`.=prio`** | **seulement** cette priorité | `*.=warning` = les avertissements uniquement |
    | **`.*`** | toutes les priorités | `cron.*` |
    | **`-`** devant le chemin | écriture différée (plus rapide, risque de perte en cas de crash) | `-/var/log/syslog` |

    - **Activer cron** : sur Debian, la ligne `#cron.* /var/log/cron.log` existe mais est **commentée**. On retire le `#` et on remplace le chemin par **`/adm/logs/cron.log`**.
    - **Avertissements** : on ajoute **`*.=warning /adm/logs/warnings.log`**. Avec `*.warning` (sans `=`), le fichier recevrait aussi toutes les erreurs.
    - Le dossier **`/adm/logs`** doit exister, puis on **redémarre rsyslog** pour qu'il relise sa configuration. `rsyslogd -N1` vérifie la syntaxe avant.

    !!! tip "Bonne pratique"
        Plutôt que modifier `/etc/rsyslog.conf`, on peut écrire ses règles dans un fichier à part, par exemple **`/etc/rsyslog.d/tp.conf`** : il est lu automatiquement et ne sera pas écrasé par une mise à jour du paquet.

    **6. Tester avec `logger`**

    **`logger -p facility.priorité "message"`** envoie un message comme le ferait un service.

    | Message envoyé | cron.log | warnings.log | Pourquoi |
    |---|---|---|---|
    | `user.warning` | ❌ | ✅ | facility user, priorité warning |
    | `cron.warning` | ✅ | ✅ | vérifie **les deux** règles d'un coup |
    | `cron.info` | ✅ | ❌ | info n'est pas warning |

    Le corrigé ENI utilise `logger -p kern.warn` : un programme ordinaire **ne peut pas** écrire en facility `kern` (réservée au noyau), le message est classé en `user`. Il arrive quand même dans warnings.log, mais `user.warning` est plus juste. Il nomme aussi le fichier `warning.log` alors que l'énoncé demande **`warnings.log`**.
