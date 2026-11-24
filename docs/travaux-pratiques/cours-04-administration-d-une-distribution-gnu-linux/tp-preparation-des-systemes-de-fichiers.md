# TP - Préparation des systèmes de fichiers

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 9 : Gestion des espaces de stockage - Systèmes de fichiers](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-9-gestion-des-espaces-de-stockage-systemes-de-fichiers/index.md).*

*TP M09TP01 · durée estimée : 30 à 45 minutes · suite du TP LVM (module 8), sur la station Debian graphique.*

=== "📋 Ce qui est demandé"

    | # | Consigne | Résultat attendu |
    |---|---|---|
    | 1 | Sur le LV **lvvar**, créer un système de fichiers **ext4** avec l'étiquette **VAR** | `blkid` affiche `LABEL="VAR" TYPE="ext4"` |
    | 2 | **Agrandir le FS** de **lvhome** pour qu'il occupe tout le LV | `df -h /home` montre la nouvelle taille |
    | 3 | **Migrer /var** vers lvvar **sans perdre de données** | `/var` est monté depuis lvvar, les logs continuent |
    | 4 | **Monter lvvar sur /var automatiquement** au démarrage | ligne dans `/etc/fstab`, redémarrage OK |

    **Conseils de l'énoncé pour la migration** : snapshot de la VM · vérifier l'utilisation de /var (`lsof`) · empêcher toute écriture dans /var pendant la copie · passer par un montage temporaire · copier en **préservant les permissions**.

=== "⌨️ Les commandes"

    ```bash
    # 1. Système de fichiers sur lvvar
    mkfs.ext4 -L VAR /dev/vgsystem/lvvar
    blkid | grep var                          # vérifier LABEL et TYPE

    # 2. Agrandir le FS de lvhome (le LV a été agrandi au TP précédent)
    resize2fs /dev/vgsystem/lvhome

    # 3. Migration de /var  (snapshot de la VM AVANT !)
    lsof | grep /var                          # qui utilise /var ?
    systemctl isolate rescue.target           # mode maintenance : presque tout s'arrête
    systemctl stop systemd-journald*          # si le journal écrit encore
    lsof | grep /var                          # doit être (quasi) vide
    mkdir /mnt/var
    mount -t ext4 /dev/vgsystem/lvvar /mnt/var
    findmnt                                   # /mnt/var bien monté ?
    cp -rpv /var/* /mnt/var/                  # -p garde droits et propriétaires
    umount /mnt/var
    mount -t ext4 /dev/vgsystem/lvvar /var
    systemctl isolate graphical.target
    findmnt /var
    tail -n 4 /var/log/auth.log               # les logs s'écrivent bien

    # 4. Montage automatique
    nano /etc/fstab                           # ajouter la ligne ci-dessous
    systemctl isolate rescue.target           # tester AVANT de redémarrer
    systemctl stop systemd-journald*
    umount /var
    mount /var                                # lit /etc/fstab : doit fonctionner
    reboot
    ```

    **Ligne à ajouter dans `/etc/fstab`** :

    ```text
    # /var dans son propre LV, appelé par l'étiquette du système de fichiers
    LABEL=VAR    /var    ext4    defaults    0    2
    ```

=== "✅ Corrigé expliqué"

    **1. ext4 avec étiquette**

    **`mkfs.ext4 -L VAR /dev/vgsystem/lvvar`** : `mkfs.ext4` choisit le type, **`-L`** pose l'étiquette (*label*). On vérifie avec **`blkid`** : `LABEL="VAR" … TYPE="ext4"`.
    Pour changer l'étiquette d'un FS **existant**, sans le reformater : `tune2fs -L VAR /dev/vgsystem/lvvar` (ou `e2label`).

    **2. Agrandir lvhome**

    Au TP LVM, on a agrandi le **volume** lvhome, mais pas le **système de fichiers** qu'il contient. **`resize2fs /dev/vgsystem/lvhome`** l'étend à toute la taille du LV, **à chaud** (même monté sur /home).
    Si le TP précédent a été fait avec `lvextend -r`, resize2fs répond *« Nothing to do! »* : c'est normal, c'est déjà fait.

    **3. Migrer /var**

    | Étape | Pourquoi |
    |---|---|
    | **Snapshot** de la VM | Pouvoir revenir en arrière si la migration casse le système |
    | **`lsof \| grep /var`** | *List Open Files* : des centaines de fichiers de /var sont ouverts (journaux, cron, rsyslog…) |
    | **`systemctl isolate rescue.target`** | Le mode *rescue* arrête presque tous les services : plus personne n'écrit dans /var pendant la copie |
    | **`systemctl stop systemd-journald*`** | Le journal système peut rester actif : on l'arrête aussi |
    | **Montage temporaire** sur `/mnt/var` | On ne peut pas copier /var « sur lui-même » : on monte le nouveau LV ailleurs le temps de la copie |
    | **`cp -rpv`** | **`-r`** récursif, **`-p`** préserve droits, propriétaires et dates, **`-v`** affiche la progression |
    | **`umount`** puis **`mount … /var`** | Le LV prend la place de /var. L'ancien contenu reste caché **dessous**, sur la partition racine |
    | **`isolate graphical.target`** | On relance l'interface et on vérifie que les logs s'écrivent (`tail /var/log/auth.log`) |

    !!! tip "Copie plus sûre"
        `cp -rpv /var/*` **oublie les fichiers cachés** (qui commencent par un point) à la racine de /var. Une copie complète : **`cp -a /var/. /mnt/var/`** (`-a` = récursif + tout préserver, y compris les liens) ou **`rsync -aAX /var/ /mnt/var/`**.

    **4. Montage automatique**

    On ajoute une ligne dans **`/etc/fstab`** qui désigne le volume par son **étiquette** (`LABEL=VAR`) : elle ne change pas, même si le nom du périphérique change.

    | Colonne | Valeur | Sens |
    |---|---|---|
    | Quoi | `LABEL=VAR` | le FS à monter (ou `/dev/mapper/vgsystem-lvvar`, ou `UUID=…`) |
    | Où | `/var` | le point de montage |
    | Type | `ext4` | le système de fichiers |
    | Options | `defaults` | options standards (le corrigé ENI met `auto`, qui fonctionne aussi) |
    | dump | `0` | pas de sauvegarde par `dump` |
    | pass | `2` | ordre de vérification `fsck` au démarrage (1 = racine, 2 = les autres, 0 = jamais) — le corrigé ENI met 0 |

    **Toujours tester avant de redémarrer** : en mode rescue, `umount /var` puis **`mount /var`** sans autre argument. mount va lire fstab : s'il n'y a pas d'erreur, la ligne est bonne. Une erreur dans fstab peut **empêcher le démarrage**, d'où le test et le snapshot.

    Enfin, **`reboot`** puis `findmnt /var` : /var doit être monté depuis `/dev/mapper/vgsystem-lvvar`.
