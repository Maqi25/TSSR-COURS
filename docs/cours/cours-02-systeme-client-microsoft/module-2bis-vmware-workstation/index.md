# Module 2bis : VMware Workstation

*Cours : [Cours 2 - Système client Microsoft](../index.md)*

## 🎯 Objectif du module

À la fin de ce module, tu sais :

- expliquer la **virtualisation** : hôte, machine virtuelle, hyperviseur ;
- **créer une VM** dans VMware Workstation et régler ses ressources (CPU, RAM, disque) ;
- choisir le bon **mode réseau** (Bridge, NAT, Host-only, LAN Segment) ;
- utiliser les **snapshots**, les **clones** et l'**import/export** de VM.

!!! abstract "En clair : c'est quoi la virtualisation ?"
    Normalement, un PC fait tourner **un seul** système d'exploitation. La **virtualisation** permet de faire tourner **plusieurs ordinateurs « faux »** (des **machines virtuelles**, ou **VM**) **à l'intérieur** de ton vrai PC, chacun avec son propre Windows ou Linux.

    C'est l'outil indispensable de la formation : tu pourras **tester, casser et recommencer** sans abîmer ton vrai PC.

## 🖼️ Résumé visuel

**① Qui fait quoi dans la virtualisation**

<div class="tssr-layers">
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">💻</span>
    <span class="tssr-layer-name">VM 1 · VM 2 · VM 3</span>
    <span class="tssr-layer-desc">Les ordinateurs virtuels, avec leur OS « invité » (Windows 10, Debian…)</span>
    <span class="tssr-layer-tag">Invités</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#0891b2;">
    <span class="tssr-layer-num">🧠</span>
    <span class="tssr-layer-name">Hyperviseur</span>
    <span class="tssr-layer-desc">Partage le matériel entre les VM et les isole les unes des autres (ici VMware Workstation)</span>
    <span class="tssr-layer-tag">Arbitre</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#10b981;">
    <span class="tssr-layer-num">🪟</span>
    <span class="tssr-layer-name">OS de l'hôte</span>
    <span class="tssr-layer-desc">Ton Windows habituel</span>
    <span class="tssr-layer-tag">Hôte</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#6b7280;">
    <span class="tssr-layer-num">🖥️</span>
    <span class="tssr-layer-name">Ton vrai PC</span>
    <span class="tssr-layer-desc">Processeur, RAM, disque, carte réseau, partagés entre tout le monde</span>
    <span class="tssr-layer-tag">Matériel</span>
  </div>
</div>

**② Les modes réseau : qui peut parler à qui ?**

```mermaid
flowchart TB
    subgraph PHY["🌍 Réseau physique (ta box, Internet)"]
        BOX["📶 Box / routeur"]
    end
    subgraph HOTE["🖥️ PC hôte"]
        H["Carte réseau de l'hôte"]
        VB["VM en <b>Bridge</b><br/>= une machine de plus<br/>sur le réseau de la box"]
        VN["VM en <b>NAT</b><br/>sort via l'IP de l'hôte"]
        VH["VM en <b>Host-only</b><br/>parle seulement à l'hôte<br/>et aux autres VM"]
        VL["VM en <b>LAN Segment</b><br/>parle seulement aux VM<br/>du même segment"]
    end
    VB <--> BOX
    VN --> H --> BOX
    VH <--> H
```

## 📖 Cours consolidé

### 1. Le vocabulaire

| Mot | En clair |
|---|---|
| **Hôte** | Le **vrai PC**, qui possède le matériel |
| **VM** (machine virtuelle) | Un **ordinateur virtuel** isolé, avec son propre OS (**OS invité**) |
| **Hyperviseur** | Le logiciel qui **fait tourner les VM** et partage le matériel |

| Hyperviseur | Installé… | Exemples | Usage |
|---|---|---|---|
| **Type 2** | **sur** un Windows / Linux | **VMware Workstation**, VirtualBox | Tests, formation |
| **Type 1** (« bare metal ») | **directement** sur le serveur | **ESXi**, Hyper-V | Production ([cours 13](../../cours-13-virtualisation-de-serveurs/index.md)) |

---

### 2. Les ressources d'une VM

| Ressource | À savoir |
|---|---|
| **CPU** | Trop de processeurs peut **ralentir** la VM. Se modifie **VM éteinte** |
| **RAM** | **Prise sur l'hôte** au démarrage de la VM (VM à 4 Go = 4 Go en moins). Libérée quand la VM est **en pause** ou **éteinte** |
| **Disque** | Un **fichier** `.vmdk`, **dynamique** : il grossit au fur et à mesure, jusqu'à sa taille maximale |

⚠️ Disque **de l'hôte** plein = VM qui **se figent** ou **s'abîment**. Range-les sur un disque avec de la place (SSD).

---

### 3. Les modes réseau

Chaque VM a une carte réseau virtuelle, branchée sur un **switch virtuel** (**VMnet**).

| Mode | Switch | La VM joint… | Quand ? |
|---|---|---|---|
| **Bridge** (pont) | VMnet0 | Le **vrai réseau** (IP donnée par ta box) | La VM doit être vue comme un vrai PC |
| **NAT** | **VMnet8** | Internet, **via l'IP de l'hôte** | Donner Internet simplement |
| **Host-only** | **VMnet1** | L'**hôte** et les autres VM, **pas Internet** | Labo isolé |
| **LAN Segment** | Nommé | **Seulement les VM du segment** | Simuler des réseaux séparés reliés par un routeur virtuel |

💡 20 switchs (VMnet0 à 19), réglables dans **Edit → Virtual Network Editor**. Côté hôte, les cartes « VMware Network Adapter VMnet1 / VMnet8 » sont dans `ncpa.cpl`.

---

### 4. Les fonctions qui font gagner du temps

| Fonction | À quoi ça sert |
|---|---|
| **Snapshot** | **Photo** de la VM pour **revenir en arrière** (à faire avant une mise à jour risquée) |
| **Clone** | **Dupliquer** une VM modèle (5 postes en quelques minutes) |
| **Pause** | Mettre en veille et **libérer les ressources** |
| **VMware Tools** | Pilotes **dans** la VM : affichage, copier-coller avec l'hôte. À installer sur chaque VM |

- ++ctrl+alt++ : **rendre la main** clavier/souris à l'hôte.
- ++ctrl+alt+insert++ : faire un ++ctrl+alt+del++ **dans** la VM.

---

### 5. Créer une VM

| # | Étape | Conseil |
|---|---|---|
| ① | **File → New Virtual Machine** → *Typical* | |
| ② | Source | **« I will install the operating system later »** (tu gardes la main) |
| ③ | OS invité | Ex. Windows 10 x64 → réglages adaptés proposés |
| ④ | Nom, dossier | Un dossier par VM, sur un disque rapide |
| ⑤ | Disque | Ex. 60 Go, **« single file »** |
| ⑥ | **Customize Hardware** | RAM, CPU, **ISO** dans le lecteur, **mode réseau** |
| ⑦ | Démarrer | Installation de l'OS ([module 2](../module-2-installation-de-windows-10/index.md)) |

Dans le dossier de la VM : **`.vmx`** = la **configuration** (fichier texte) · **`.vmdk`** = le **disque**.

---

### 6. Importer et exporter

| Je veux… | Comment |
|---|---|
| Ouvrir une VM | Double-clic sur le **`.vmx`** |
| Importer une VM toute prête | File → Open → **`.ova`** / **`.ovf`** (format standard) |
| Exporter | **File → Export to OVF** (`.ova` = un seul fichier) |
| Sauvegarder | Copier son dossier, **VM éteinte** |

- ⚠️ VM copiée : répondre **« I copied it »** si l'original existe encore → nouvelle **MAC**, pas de conflit réseau.
- 📌 Workstation = **tests et maquettes**, pas la production (ESXi, Hyper-V). **Gratuit** depuis fin 2024, même en entreprise.

## 📝 Fiche de révision

### 🧠 L'essentiel en un tableau

| Notion | À retenir |
|---|---|
| **Hyperviseur type 2** | Logiciel sur un OS : Workstation, VirtualBox |
| **Hyperviseur type 1** | Directement sur le serveur : ESXi, Hyper-V |
| **RAM** | Réservée sur l'hôte dès le démarrage de la VM |
| **Disque `.vmdk`** | Fichier dynamique, grossit à l'usage |
| **`.vmx`** | Configuration de la VM (texte) |
| **OVA / OVF** | Format d'import / export de VM |
| **Snapshot** | Point de retour en arrière |
| **Clone** | Copie d'une VM |
| ++ctrl+alt++ | Libérer souris et clavier |

### 🌐 Les modes réseau en un coup d'œil

| Mode | Internet ? | Hôte ? | Autres VM ? |
|---|---|---|---|
| **Bridge** | ✅ (IP de la box) | ✅ | ✅ |
| **NAT** (VMnet8) | ✅ (via l'hôte) | ✅ | ✅ (en NAT) |
| **Host-only** (VMnet1) | ❌ | ✅ | ✅ (en Host-only) |
| **LAN Segment** | ❌ | ❌ | ✅ (même segment) |

### ⚠️ Les pièges

- Trop de **CPU** pour une VM peut la **ralentir**.
- Lancer plusieurs VM **sans assez de RAM sur l'hôte** fait tout ramer.
- **LAN Segment** : **l'hôte ne voit pas** les VM.
- VM copiée : répondre **« I copied it »** pour éviter les **adresses MAC en double**.
- Un **snapshot n'est pas une sauvegarde** : s'il y a un problème sur le disque de l'hôte, tu perds tout.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Ton PC a 16 Go de RAM. Tu veux lancer 3 VM à 6 Go chacune. Que va-t-il se passer ?"
    3 × 6 = **18 Go**, alors que l'hôte n'en a que 16 (et en utilise lui-même). La RAM est réservée **au démarrage** de chaque VM : la 3ᵉ VM ne démarrera pas, ou tout sera très lent. Réduis la RAM de chaque VM (par exemple 4 Go).

??? question "2. Tu veux un labo avec un serveur et un client qui se parlent, isolés d'Internet, mais que tu puisses joindre depuis ton PC. Quel mode réseau ?"
    **Host-only (VMnet1)** : les VM se parlent entre elles et avec l'hôte, mais n'ont **pas accès à Internet**.

??? question "3. Tu vas installer une mise à jour risquée sur ta VM de TP. Quel réflexe ?"
    Prendre un **snapshot** juste avant. Si la mise à jour casse quelque chose, tu **reviens au snapshot** en quelques secondes.

??? question "4. Ta VM doit récupérer une IP de la box, comme un vrai PC du réseau. Quel mode ?"
    **Bridge** : la VM est branchée directement sur le réseau physique et reçoit une adresse du serveur DHCP de la box.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-2bis-vmware-workstation"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-2bis-vmware-workstation-data">
[
  {
    "question": "Quel élément fait tourner les machines virtuelles et partage le matériel de l'hôte entre elles ?",
    "options": [
      "Le BIOS",
      "L'hyperviseur",
      "Le pilote réseau",
      "Le fichier .vmx"
    ],
    "correctIndex": 1,
    "explanation": "L'hyperviseur est l'élément central de la virtualisation : il intercepte les demandes des VM, partage les ressources de l'hôte et isole les VM les unes des autres."
  },
  {
    "question": "VMware Workstation est un hyperviseur de quel type ?",
    "options": [
      "Type 1, installé directement sur le serveur",
      "Type 2, installé comme un logiciel sur un OS existant",
      "Ce n'est pas un hyperviseur",
      "Type 3, dans le cloud"
    ],
    "correctIndex": 1,
    "explanation": "Workstation s'installe sur un Windows ou un Linux existant : c'est un hyperviseur de type 2, fait pour les tests. ESXi et Hyper-V sont de type 1 (installés directement sur le matériel)."
  },
  {
    "question": "Quand la RAM attribuée à une VM est-elle prise sur l'hôte ?",
    "options": [
      "Seulement quand la VM en a besoin, petit à petit",
      "Dès que la VM démarre",
      "À la création de la VM, même éteinte",
      "Jamais : la VM a sa propre RAM"
    ],
    "correctIndex": 1,
    "explanation": "La RAM d'une VM est réservée sur l'hôte dès son démarrage. Il faut donc vérifier que l'hôte en a assez avant de lancer une VM."
  },
  {
    "question": "Un disque virtuel de 60 Go vient d'être créé. Combien pèse-t-il sur l'hôte avant l'installation de l'OS ?",
    "options": [
      "60 Go exactement",
      "Quelques Mo : il est dynamique et grossit à l'usage",
      "120 Go",
      "0 octet, il n'existe pas encore"
    ],
    "correctIndex": 1,
    "explanation": "Par défaut, le fichier .vmdk est dynamique : il ne prend que la place réellement utilisée, sans jamais dépasser la taille maximale définie."
  },
  {
    "question": "Quel fichier contient la configuration d'une VM (RAM, CPU, réseau) ?",
    "options": [
      ".vmdk",
      ".iso",
      ".vmx",
      ".ova"
    ],
    "correctIndex": 2,
    "explanation": "Le fichier .vmx est la configuration de la VM (un simple fichier texte). Le .vmdk est son disque dur, et l'.ova une archive d'export."
  },
  {
    "question": "Quel mode réseau connecte la VM directement au réseau physique, pour qu'elle reçoive une IP de la box comme un vrai PC ?",
    "options": [
      "Host-only",
      "NAT",
      "Bridge",
      "LAN Segment"
    ],
    "correctIndex": 2,
    "explanation": "En Bridge, la VM est reliée au réseau physique de l'hôte : elle apparaît comme une machine de plus et obtient une adresse du DHCP de la box."
  },
  {
    "question": "Quel mode réseau donne accès à Internet à la VM en empruntant l'adresse IP de l'hôte ?",
    "options": [
      "NAT (VMnet8)",
      "Host-only (VMnet1)",
      "LAN Segment",
      "Aucun"
    ],
    "correctIndex": 0,
    "explanation": "En NAT, la VM sort vers l'extérieur avec l'adresse de l'hôte, qui fait la traduction d'adresses. C'est le réseau VMnet8 par défaut."
  },
  {
    "question": "Quel mode réseau permet aux VM de communiquer entre elles et avec l'hôte, mais sans accès à Internet ?",
    "options": [
      "Bridge",
      "NAT",
      "Host-only (VMnet1)",
      "LAN Segment"
    ],
    "correctIndex": 2,
    "explanation": "Host-only (VMnet1 par défaut) crée un réseau privé entre l'hôte et les VM, sans sortie vers Internet. Idéal pour un labo isolé."
  },
  {
    "question": "Quelle particularité a un LAN Segment ?",
    "options": [
      "Il donne Internet aux VM",
      "Les VM du segment communiquent entre elles, mais pas avec l'hôte",
      "Il relie la VM à la box",
      "Il est réservé aux serveurs ESXi"
    ],
    "correctIndex": 1,
    "explanation": "Un LAN Segment est un réseau isolé : seules les VM du même segment se voient. L'hôte n'y a pas accès. Pratique pour simuler des réseaux d'entreprise séparés."
  },
  {
    "question": "Avant d'installer une mise à jour risquée sur une VM, quel est le bon réflexe ?",
    "options": [
      "Cloner l'hôte",
      "Prendre un snapshot",
      "Supprimer le .vmx",
      "Passer la VM en Bridge"
    ],
    "correctIndex": 1,
    "explanation": "Le snapshot enregistre l'état de la VM à un instant T. Si la mise à jour échoue, on revient à cet état en quelques secondes (rollback)."
  },
  {
    "question": "Quel raccourci permet de reprendre la souris et le clavier sur l'hôte quand ils sont capturés par la VM ?",
    "options": [
      "Ctrl + Alt",
      "Alt + F4",
      "Ctrl + C",
      "Windows + D"
    ],
    "correctIndex": 0,
    "explanation": "Quand on clique dans une VM, elle capture le clavier et la souris. Ctrl + Alt les rend à l'hôte."
  },
  {
    "question": "Sous quel format exporte-t-on une VM en un seul fichier facile à transférer ?",
    "options": [
      ".vmdk",
      ".ova",
      ".exe",
      ".iso"
    ],
    "correctIndex": 1,
    "explanation": "OVA (Open Virtual Appliance) est une archive unique contenant toute la VM. OVF est le même format, en plusieurs fichiers."
  },
  {
    "question": "Tu ouvres la copie d'une VM dont l'original fonctionne encore. Que réponds-tu à « I moved it / I copied it » ?",
    "options": [
      "I moved it",
      "I copied it, pour obtenir une nouvelle adresse MAC",
      "Peu importe",
      "On ne peut pas ouvrir une copie"
    ],
    "correctIndex": 1,
    "explanation": "« I copied it » génère une nouvelle adresse MAC pour la copie. Sinon, les deux VM auraient la même MAC, ce qui provoque des conflits sur le réseau."
  },
  {
    "question": "Pourquoi VMware Workstation n'est-il pas utilisé pour les serveurs de production ?",
    "options": [
      "Il ne sait pas faire tourner Windows",
      "C'est un outil de test et de maquette ; la production utilise des hyperviseurs de type 1 (ESXi, Hyper-V)",
      "Il est interdit par la loi",
      "Il ne gère pas le réseau"
    ],
    "correctIndex": 1,
    "explanation": "Workstation tourne au-dessus d'un OS de bureau : il convient aux tests. Pour la production, on utilise des hyperviseurs de type 1, plus performants et plus robustes."
  },
  {
    "question": "À quoi servent les VMware Tools installés dans une VM ?",
    "options": [
      "À créer des snapshots",
      "À améliorer l'intégration : affichage, copier-coller et glisser-déposer avec l'hôte",
      "À exporter la VM",
      "À activer Windows"
    ],
    "correctIndex": 1,
    "explanation": "Les VMware Tools sont des pilotes à installer dans l'OS invité : ils améliorent l'affichage, la souris, et permettent le copier-coller et le glisser-déposer entre l'hôte et la VM."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-2bis-vmware-workstation",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-2bis-vmware-workstation-data",
    });
  });
</script>
