# TP - Gérer le stockage

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 4 : La gestion du stockage](../../cours/cours-02-systeme-client-microsoft/module-4-la-gestion-du-stockage/index.md).*

*TP du module 4 · durée estimée : 1 h 30 · VM Win10-XX (graphique puis diskpart) et VM Discovery (PowerShell).*

=== "📋 Ce qui est demandé"

    **Préparation** — Avec VMware Workstation, ajouter **2 disques de 60 Go** à Win10-XX (*Store virtual disk as a single file*).

    **Avec la console graphique**

    | # | Consigne |
    |---|---|
    | 1 | Disque 1 : **3 partitions principales de 15 Go**, sans lettre, sans formater |
    | 2 | Une **4e partition de 7 Go**, sans lettre, sans formater |
    | 3 | Formater les 2 premières en **NTFS** : **DATA** et **TOOLS** |
    | 4 | Lettre **D** pour DATA, **E** pour TOOLS |
    | 5 | Formater la partition de 7 Go en **FAT32**, nommée **ARCHIVE**, lettre au choix |
    | 6 | **Étendre DATA de 15 Go** en utilisant **seulement le disque 2** |

    **En ligne de commande (diskpart)**

    | # | Consigne |
    |---|---|
    | 7 | Formater la 3e partition de 15 Go en NTFS, nommée **COMMUN**, lettre au choix |
    | 8 | **Étendre COMMUN** avec l'espace libre restant du **disque 1** |
    | 9 | **Supprimer** le volume DATA |
    | 10 | **Recréer DATA** avec tout l'espace libre des **deux disques** |
    | 11 | Rédiger la procédure **GestionDuStockage** (psr, traitement de texte…) dans le dossier *Procédures* |

    **Sur Discovery, en PowerShell**

    | # | Consigne |
    |---|---|
    | 12 | Afficher le **numéro**, la **taille** et le **type de table de partitionnement** des disques |
    | 13 | Afficher la **lettre**, le **nom** et la **taille** des volumes qui ont un **nom** (FriendlyName) |
    | 14 | Nommer le volume C: **System** |

=== "⌨️ Les commandes"

    **diskpart** (cmd lancé **en administrateur**)

    ```bat
    diskpart
    list disk
    list volume
    select volume 1                          :: le volume RAW de 15 Go (vérifie son numéro !)
    format fs=ntfs label=COMMUN quick
    assign letter=K
    extend                                   :: prend l'espace libre du disque
    list volume                              :: COMMUN passe à 22 Go

    select volume D
    delete volume                            :: supprime DATA

    select disk 1
    create volume simple                     :: tout l'espace libre du disque 1
    extend disk=2                            :: + tout l'espace libre du disque 2
    format label=DATA quick
    assign letter=D
    ```

    **PowerShell (Discovery)**

    ```powershell
    Get-Disk | Select-Object Number, Size, PartitionStyle
    Get-Volume
    Get-Volume | Where-Object FileSystemLabel | Select-Object DriveLetter, FileSystemLabel, Size
    Set-Volume -DriveLetter C -NewFileSystemLabel "System"
    ```

    **Consoles utiles** : `diskmgmt.msc` (gestion des disques) · `psr` (enregistreur d'actions pour la procédure).

=== "✅ Corrigé expliqué"

    **Préparation** — VMware : clic droit sur la VM → **Settings** → **Add…** → **Hard Disk** → **SCSI** → **Create a new virtual disk** → **60 Go** → **Store virtual disk as a single file** → nom parlant → **Finish**. Deux fois.

    **Initialiser** — dans la gestion des disques (MaConsole ou `diskmgmt.msc`), les 2 disques sont *Non initialisés* : clic droit → **Initialiser le disque** → **GPT**.

    **1-2. Partitions** — clic droit sur l'espace non alloué → **Nouveau volume simple** → taille **15360 Mo** (15 Go) → **Ne pas attribuer de lettre** → **Ne pas formater**. Trois fois, puis une 4e de **7168 Mo** (7 Go).

    En **GPT**, on peut avoir 4 partitions principales (et bien plus). En **MBR**, on aurait 3 principales + 1 étendue avec un lecteur logique.

    **3. Formater** — clic droit → **Formater** → nom **DATA**, **NTFS**, formatage rapide. Idem **TOOLS**.

    **4. Lettres** — la lettre **D** est prise par le **lecteur DVD** : clic droit sur le DVD → **Modifier la lettre de lecteur** → **Supprimer** (ou lui donner Z). Puis DATA → **Ajouter** → **D**, TOOLS → **E**.

    **5. ARCHIVE** — Formater en **FAT32**, nom **ARCHIVE**, puis attribuer une lettre.

    **6. Étendre DATA** — clic droit sur DATA → **Étendre le volume** → ajouter le **disque 2**, retirer le disque 1 → **15360 Mo**. Windows prévient que les disques vont passer en **dynamiques** → **Oui**. DATA devient un **volume fractionné** (réparti sur 2 disques).

    **7. COMMUN** — `list volume` pour repérer le volume **RAW** de 15 Go, `select volume`, `format fs=ntfs label=COMMUN quick`, `assign letter=K`.

    **8. Étendre COMMUN** — volume toujours sélectionné : **`extend`** → il passe de 15 à **22 Go**.

    **9. Supprimer DATA** — `select volume D` puis **`delete volume`**.

    **10. Recréer DATA** — `select disk 1` → `create volume simple` (les 15 Go libérés sur le disque 1) → **`extend disk=2`** (+ 59 Go du disque 2) → `format label=DATA quick` → `assign letter=D` : DATA fait **74 Go**, volume **fractionné**.

    **11. Procédure** — `psr` (Enregistrement des actions utilisateur) capture chaque clic avec une capture d'écran : pratique pour rédiger une procédure.

    **12.** `Get-Disk | Select-Object Number, Size, PartitionStyle`.

    **13.** `Get-Volume` montre les volumes ; ceux avec un nom ont une colonne *FriendlyName* remplie (sur Discovery : Informatique, Achat-Ventes, Compta). Pour les afficher sans les nommer un par un :
    `Get-Volume | Where-Object FileSystemLabel | Select-Object DriveLetter, FileSystemLabel, Size`

    !!! note "Coquille du corrigé ENI"
        Le PDF écrit `Select DriveLetter, FileSystem,LabelSize` : il faut **`FileSystemLabel, Size`** (deux propriétés distinctes).

    **14.** **`Set-Volume -DriveLetter C -NewFileSystemLabel "System"`**.
