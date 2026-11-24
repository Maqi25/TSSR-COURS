# TP - Manipuler les disques et LVM

*Rattaché au cours [Cours 4 - Administration d'une distribution GNU/Linux, Module 8 : Gestion avancée des espaces de stockage - LVM](../../cours/cours-04-administration-d-une-distribution-gnu-linux/module-8-gestion-avancee-des-espaces-de-stockage-lvm/index.md).*

*TP M08TP01 · durée estimée : 15 à 20 minutes · sur la station Debian avec environnement graphique.*

=== "📋 Ce qui est demandé"

    | # | Consigne | Résultat attendu |
    |---|---|---|
    | 1 | **Ajouter un disque de 40 Go** à la VM et vérifier qu'il est dans `/dev` | `/dev/sdb` apparaît |
    | 2 | **Créer 1 partition** avec `fdisk` : principale, **tout le disque**, type **LVM** | `/dev/sdb1` de type « Linux LVM » (8e) |
    | 3 | **Intégrer la partition** au groupe de volumes existant | `vgsystem` grossit de 40 Go |
    | 4 | **Créer un LV de 20 Go** nommé **`lvvar`** | `lvvar` visible dans `lvs` |
    | 5 | **Agrandir `lvhome`** avec **tout l'espace restant** du VG | VFree = 0, `lvhome` ≈ 35 Go |

    !!! tip "Astuce : voir le nouveau disque sans redémarrer"
        Le disque ajouté à chaud n'apparaît pas tout de suite. On demande au contrôleur SCSI de **rescanner** :

        1. Trouver quel **host** gère les disques : `udevadm info --query=path --name=sda` → repérer `hostN` dans le chemin.
        2. Lancer le scan : `echo "- - -" > /sys/class/scsi_host/hostN/scan`

=== "⌨️ Les commandes"

    ```bash
    # 1. Le disque est-il là ?
    ls -l /dev/sd*                                   # seul sda au début
    udevadm info --query=path --name=sda             # → …/host2/… : c'est host2
    echo "- - -" > /sys/class/scsi_host/host2/scan   # rescan du bus SCSI
    ls /dev/sd*                                      # sda  sda1  sdb ✅

    # 2. Partition LVM sur tout le disque
    fdisk /dev/sdb        # n → p → 1 → Entrée → Entrée   puis   t → 8e   puis   w

    # 3. Ajouter la partition au VG existant
    pvcreate /dev/sdb1
    vgextend vgsystem /dev/sdb1

    # 4. Créer lvvar (20 Go)
    lvcreate -n lvvar -L 20G vgsystem
    lvs

    # 5. Donner tout le reste à lvhome
    lvextend -l +100%FREE /dev/vgsystem/lvhome
    ```

    !!! note "Le nom du VG"
        Ici le VG s'appelle **`vgsystem`** (celui créé à l'installation). Vérifie le tien avec **`vgs`** avant de taper les commandes.

=== "✅ Corrigé expliqué"

    **1. Ajouter le disque de 40 Go**

    Dans les **paramètres de la VM** → *Add* → *Hard Disk* → options par défaut, taille **40 Go**.
    `ls -l /dev/sd*` ne montre encore que `sda` et `sda1` : le système n'a pas vu le disque. `udevadm` indique que c'est **host2** qui gère les disques, on force donc le scan sur `host2` → **`/dev/sdb`** apparaît.

    **2. Partitionner avec fdisk**

    | Touche | Rôle |
    |---|---|
    | `n` | nouvelle partition |
    | `p` / `1` / Entrée / Entrée | primaire, numéro 1, du 1er au dernier secteur (choix par défaut = **tout le disque**) |
    | `t` puis `8e` | changer le **type** en **« Linux LVM »** |
    | `w` | **écrire** la table et quitter (rien n'est modifié avant !) |

    **3. Intégrer au groupe de volumes**

    - **`pvcreate /dev/sdb1`** → déclare la partition comme **volume physique** (PV) utilisable par LVM.
    - **`vgextend vgsystem /dev/sdb1`** → **verse** ce PV dans le pot existant : `Volume group "vgsystem" successfully extended`.

    **4. Créer lvvar**

    `lvcreate -n lvvar -L 20G vgsystem` : **`-n`** = nom, **`-L`** = taille fixe, et **ne pas oublier le VG cible** en dernier. `lvs` affiche ensuite `lvvar  vgsystem  20,00g` à côté de `lvhome`, `lvroot`, `lvswap`…

    **5. Agrandir lvhome**

    `lvextend -l +100%FREE /dev/vgsystem/lvhome` : **`-l` minuscule** (en *extents* / pourcentage) + **`100%FREE`** = toute la place libre. Pour un LV existant, on donne le **chemin complet** `/dev/<VG>/<LV>`.
    Résultat : `lvhome` passe de **< 14,86 Go à 34,85 Go**.

    !!! warning "Ne pas oublier le système de fichiers"
        Sans **`-r`**, seul le volume grandit : `df -h /home` affiche toujours l'ancienne taille. Soit on tape directement **`lvextend -r -l +100%FREE /dev/vgsystem/lvhome`**, soit on rattrape avec **`resize2fs /dev/vgsystem/lvhome`**.
