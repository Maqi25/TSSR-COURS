# Module 8 : Gestion avancée des espaces de stockage - LVM

*Cours : [Cours 4 - Administration d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

- Comprendre **LVM** et ses 3 niveaux : **PV**, **VG**, **LV**.
- **Créer** un volume LVM de A à Z.
- **Agrandir** un volume **sans arrêter** le serveur.

!!! abstract "En clair : LVM, des disques en pâte à modeler"
    Avec des partitions classiques, la taille est **figée** : si `/var` est plein, c'est compliqué. **LVM** (*Logical Volume Manager*) met **tous les disques dans un même pot** (le **groupe de volumes**), puis on y découpe des **volumes** de la taille qu'on veut.

    Un volume est trop petit ? On l'**agrandit en une commande**, même pendant que le serveur tourne. Plus de place dans le pot ? On **ajoute un disque**, et le pot grossit.

## 🖼️ Résumé visuel

**Les 3 étages de LVM**

```mermaid
flowchart BT
    D1["💽 /dev/sdb"] --> PV1["<b>PV</b> /dev/sdb<br/>volume physique"]
    D2["💽 /dev/sdc"] --> PV2["<b>PV</b> /dev/sdc<br/>volume physique"]
    PV1 --> VG["🫙 <b>VG</b> « vg_data »<br/>groupe de volumes = le POT<br/>10 Go + 10 Go = 20 Go"]
    PV2 --> VG
    VG --> LV1["📦 <b>LV</b> « lv_web »<br/>8 Go → /var/www"]
    VG --> LV2["📦 <b>LV</b> « lv_backup »<br/>10 Go → /backup"]
    VG --> F["2 Go libres<br/>pour agrandir plus tard"]
```

## 📖 Cours consolidé

### 1. Les 3 niveaux

| Niveau | Image | Exemple |
|---|---|---|
| **PV** (*Physical Volume*) | Les **ingrédients** : disque ou partition préparé pour LVM | `/dev/sdb` |
| **VG** (*Volume Group*) | Le **pot** où l'on verse les PV | `vg_data` (20 Go) |
| **LV** (*Logical Volume*) | Les **parts** servies : on les **formate** et les **monte** | `lv_web` (8 Go) |

Un LV s'utilise **comme une partition** : **`/dev/vg_data/lv_web`** (ou `/dev/mapper/vg_data-lv_web`).

| ✅ Avantages | ⚠️ Limites |
|---|---|
| **Agrandir à chaud**, sans arrêter | Une couche de plus à comprendre |
| **Ajouter un disque** au pot | Un disque du pot qui meurt = données perdues : **pas une sauvegarde**, pas du RAID |
| Des **noms clairs**, des **instantanés** | |

---

### 2. Créer un volume LVM

**Situation** : disque neuf `/dev/sdb` (10 Go) → volume de 8 Go monté sur `/var/www` (paquet `lvm2` si besoin).

```bash
sudo pvcreate /dev/sdb                    # ① préparer le disque (PV)
sudo vgcreate vg_data /dev/sdb            # ② créer le pot (VG)
sudo lvcreate -n lv_web -L 8G vg_data     # ③ découper un volume (LV) de 8 Go
sudo mkfs.ext4 /dev/vg_data/lv_web        # ④ formater…
sudo mkdir -p /var/www && sudo mount /dev/vg_data/lv_web /var/www   # …et monter (module 9)
```

`-n` = **nom** · `-L 8G` = **taille fixe** · `-l 100%FREE` = **toute** la place restante.

---

### 3. Voir où on en est

**`pvs`** · **`vgs`** · **`lvs`** (résumés) — `pvdisplay` · `vgdisplay` · `lvdisplay` (détails).

```text
$ sudo vgs
  VG      #PV #LV #SN Attr   VSize   VFree
  vg_data   1   1   0 wz--n- <10,00g <2,00g      ← VFree : 2 Go encore libres dans le pot
```

---

### 4. Agrandir : le vrai super-pouvoir

**`/var/www` est plein** → +2 Go, **sans arrêter** le serveur :

```bash
sudo lvextend -r -L +2G /dev/vg_data/lv_web
```

**`-L +2G`** = **ajouter** 2 Go (sans `+` = taille **totale**) · `-l +100%FREE` = toute la place libre · **`-r`** = agrandir **aussi le système de fichiers** ⚠️ **ne pas l'oublier**. Vérifier : `df -h /var/www`.

**Le pot est plein ?** On ajoute un disque :

```bash
sudo pvcreate /dev/sdc
sudo vgextend vg_data /dev/sdc
sudo lvextend -r -l +100%FREE /dev/vg_data/lv_web
```

⚠️ **Réduire** est **risqué** (et impossible à chaud en ext4) : mieux vaut créer des volumes un peu petits et les **agrandir** au besoin.

## 📝 Fiche de révision

| Étape | Commande |
|---|---|
| Disque → PV | `pvcreate /dev/sdb` |
| PV → VG | `vgcreate vg_data /dev/sdb` |
| VG → LV | `lvcreate -n lv_web -L 8G vg_data` |
| Formater | `mkfs.ext4 /dev/vg_data/lv_web` |
| Agrandir le LV (+ système de fichiers) | `lvextend -r -L +2G /dev/vg_data/lv_web` |
| Ajouter un disque au VG | `pvcreate /dev/sdc` + `vgextend vg_data /dev/sdc` |
| Voir | `pvs` · `vgs` · `lvs` |

**⚠️ Les pièges**

- **`lvextend` sans `-r`** : le volume grandit, mais **pas le système de fichiers** → `df -h` ne change pas (rattrapage : `resize2fs /dev/vg_data/lv_web`).
- `-L 2G` = taille **totale** de 2 Go ; `-L +2G` = **ajouter** 2 Go.
- **Réduire** un LV est risqué.

??? question "1. Crée un VG « vg_srv » avec /dev/sdb, puis un LV « lv_logs » de 5 Go."
    ```bash
    sudo pvcreate /dev/sdb
    sudo vgcreate vg_srv /dev/sdb
    sudo lvcreate -n lv_logs -L 5G vg_srv
    ```

??? question "2. lv_logs est plein. Ajoute-lui 3 Go, système de fichiers compris."
    `sudo lvextend -r -L +3G /dev/vg_srv/lv_logs`

??? question "3. vgs indique VFree = 0. Comment donner plus de place ?"
    Ajouter un disque au VG : `sudo pvcreate /dev/sdc` puis `sudo vgextend vg_srv /dev/sdc`. Ensuite, `lvextend` sur le volume concerné.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-8-gestion-avancee-des-espaces-de-stockage-lvm"></div>

<script type="application/json" id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-8-gestion-avancee-des-espaces-de-stockage-lvm-data">
[
  {
    "question": "Dans quel ordre s'empilent les niveaux de LVM ?",
    "options": [
      "LV → VG → PV",
      "PV → VG → LV",
      "VG → PV → LV",
      "PV → LV → VG"
    ],
    "correctIndex": 1,
    "explanation": "On prépare des disques (PV), on les réunit dans un groupe (VG), puis on y découpe des volumes logiques (LV)."
  },
  {
    "question": "Que représente le VG (Volume Group) ?",
    "options": [
      "Un disque physique",
      "Le « pot » commun qui réunit l'espace de plusieurs PV",
      "Un système de fichiers",
      "Un utilisateur"
    ],
    "correctIndex": 1,
    "explanation": "Le groupe de volumes additionne l'espace de tous ses volumes physiques ; on y découpe ensuite des LV."
  },
  {
    "question": "Sur quel niveau LVM crée-t-on un système de fichiers (mkfs) ?",
    "options": [
      "Le PV",
      "Le VG",
      "Le LV",
      "Aucun"
    ],
    "correctIndex": 2,
    "explanation": "Le volume logique (LV) s'utilise comme une partition : on le formate (mkfs.ext4) puis on le monte."
  },
  {
    "question": "Quelle commande prépare le disque /dev/sdb pour LVM ?",
    "options": [
      "vgcreate /dev/sdb",
      "pvcreate /dev/sdb",
      "lvcreate /dev/sdb",
      "mkfs.lvm /dev/sdb"
    ],
    "correctIndex": 1,
    "explanation": "pvcreate transforme un disque ou une partition en volume physique (PV) utilisable par LVM."
  },
  {
    "question": "Quelle commande crée un LV de 8 Go nommé lv_web dans le VG vg_data ?",
    "options": [
      "lvcreate -n lv_web -L 8G vg_data",
      "lvcreate vg_data 8G",
      "vgcreate -n lv_web 8G",
      "lvextend -L 8G lv_web"
    ],
    "correctIndex": 0,
    "explanation": "-n donne le nom, -L la taille ; le dernier argument est le VG dans lequel découper."
  },
  {
    "question": "Que fait l'option -r de lvextend ?",
    "options": [
      "Elle réduit le volume",
      "Elle agrandit aussi le système de fichiers",
      "Elle redémarre le serveur",
      "Elle supprime le volume"
    ],
    "correctIndex": 1,
    "explanation": "-r (resize) agrandit le système de fichiers en même temps que le volume. Sans elle, df -h ne montre pas la nouvelle place."
  },
  {
    "question": "Quelle est la différence entre -L 5G et -L +5G avec lvextend ?",
    "options": [
      "Aucune",
      "-L 5G fixe une taille totale de 5 Go ; -L +5G ajoute 5 Go",
      "-L +5G réduit de 5 Go",
      "-L 5G ajoute 5 Go"
    ],
    "correctIndex": 1,
    "explanation": "Avec le +, on ajoute à la taille actuelle ; sans, on donne la taille finale voulue."
  },
  {
    "question": "Le VG est plein. Comment l'agrandir ?",
    "options": [
      "lvextend sur le VG",
      "Ajouter un disque : pvcreate puis vgextend",
      "Formater le VG",
      "Ce n'est pas possible"
    ],
    "correctIndex": 1,
    "explanation": "On prépare un nouveau disque avec pvcreate, puis vgextend l'ajoute au groupe : le VG gagne sa place."
  },
  {
    "question": "Quelle commande montre la place libre restante dans un VG ?",
    "options": [
      "lvs",
      "vgs (colonne VFree)",
      "pvdisplay -free",
      "df -h"
    ],
    "correctIndex": 1,
    "explanation": "vgs affiche un résumé de chaque groupe ; la colonne VFree indique l'espace encore disponible pour créer ou agrandir des LV."
  },
  {
    "question": "Quelle commande crée le VG vg_data à partir du disque /dev/sdb ?",
    "options": [
      "lvcreate vg_data /dev/sdb",
      "vgcreate vg_data /dev/sdb",
      "pvcreate vg_data",
      "mkfs.vg /dev/sdb"
    ],
    "correctIndex": 1,
    "explanation": "Après pvcreate /dev/sdb, vgcreate vg_data /dev/sdb crée le groupe de volumes qui rassemble l'espace disque."
  },
  {
    "question": "Quelles commandes donnent un résumé rapide des PV, VG et LV ?",
    "options": [
      "pvs, vgs, lvs",
      "ls, cd, pwd",
      "df, du, free",
      "lsblk -lvm"
    ],
    "correctIndex": 0,
    "explanation": "pvs (volumes physiques), vgs (groupes) et lvs (volumes logiques) affichent un tableau par niveau."
  },
  {
    "question": "Par quel chemin accède-t-on au volume lv_web du groupe vg_data ?",
    "options": [
      "/dev/sdb/lv_web",
      "/mnt/vg_data",
      "/dev/vg_data/lv_web",
      "/lvm/lv_web"
    ],
    "correctIndex": 2,
    "explanation": "Un LV apparaît dans /dev/<VG>/<LV> (et aussi /dev/mapper/vg_data-lv_web). C'est ce chemin qu'on formate et qu'on monte."
  },
  {
    "question": "Quelle commande ajoute le disque /dev/sdc au VG vg_data ?",
    "options": [
      "vgextend vg_data /dev/sdc",
      "lvextend vg_data /dev/sdc",
      "vgcreate vg_data /dev/sdc",
      "pvmove /dev/sdc"
    ],
    "correctIndex": 0,
    "explanation": "On prépare le disque avec pvcreate /dev/sdc, puis vgextend vg_data /dev/sdc ajoute sa place au groupe."
  },
  {
    "question": "Quel est le principal avantage de LVM par rapport à des partitions classiques ?",
    "options": [
      "Il est plus rapide à installer",
      "Il remplace la sauvegarde",
      "On peut agrandir un volume, même à chaud, et réunir plusieurs disques",
      "Il chiffre automatiquement les données"
    ],
    "correctIndex": 2,
    "explanation": "LVM sépare l'espace physique des volumes : on ajoute un disque au VG puis on agrandit le LV, sans réinstaller."
  },
  {
    "question": "Avant une mise à jour risquée, quelle fonction de LVM permet de revenir en arrière ?",
    "options": [
      "Les instantanés (snapshots)",
      "Le umask",
      "Le sticky bit",
      "Le RAID 0"
    ],
    "correctIndex": 0,
    "explanation": "Un instantané fige l'état d'un volume à un moment donné. Ce n'est pas une sauvegarde : il est stocké dans le même VG."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-8-gestion-avancee-des-espaces-de-stockage-lvm",
      dataId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-8-gestion-avancee-des-espaces-de-stockage-lvm-data",
    });
  });
</script>
