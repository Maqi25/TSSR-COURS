# Module 6 : Gestion du datacenter

*Cours : [Cours 13 - Virtualisation de serveurs](../index.md)*

## 🎯 Objectif du module

Administrer un **datacenter** vSphere avec **vCenter** : **pools de ressources** et réservations, **modèles** de VM (VMTX, OVF/OVA), **utilisateurs, rôles et privilèges**, et **déplacement** de VM avec **vMotion** et **Storage vMotion**.

!!! abstract "En clair"
    Avec vCenter, les hôtes ne sont plus gérés un par un : ils forment un **datacenter**. On y **réserve** des ressources pour les VM importantes, on crée de nouvelles VM en quelques clics à partir de **modèles**, on donne à chacun **juste les droits** nécessaires, et on **déplace** les VM sans les arrêter.

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 2 · compétence 6** (exploiter l'infrastructure virtualisée) et **compétence 7** (gérer les accès : rôles et privilèges), **CCP 1 · compétence 2** (déployer vite des serveurs à partir de modèles).

**① Créer des VM à partir d'un modèle**

```mermaid
flowchart LR
    R["VM de référence<br/>OS + pilotes + VMware Tools<br/>+ correctifs"] -->|"Convert to template<br/>ou Clone to template"| M["📦 Modèle (VMTX)"]
    M -->|"Deploy VM from template<br/>+ personnalisation"| V1["Nouvelle VM<br/>nom, IP, SID uniques"]
    M --> V2["Nouvelle VM"]
```

**② Donner des droits dans vCenter**

```mermaid
flowchart LR
    U["Utilisateurs"] --> G["Groupes"]
    G --> P["Permission sur un OBJET<br/>(datacenter, cluster, dossier, VM…)<br/>= groupe + RÔLE"]
    R["Rôle<br/>= liste de privilèges"] --> P
    P -->|"héritage"| E["Objets enfants"]
```

**③ vMotion : les conditions**

```mermaid
flowchart TD
    A{"vMotion activé sur un<br/>port VMkernel des 2 hôtes ?"} -- oui --> B{"Même réseau<br/>(domaine de diffusion) ?"}
    B -- oui --> C{"Stockage de la VM<br/>visible des 2 hôtes ?"}
    C -- oui --> D{"Pas d'ISO local monté,<br/>même groupe de ports,<br/>processeurs compatibles ?"}
    D -- oui --> OK["✅ Déplacement à chaud"]
```

## 📖 Cours consolidé

### 1. Hôte autonome ou datacenter

Certaines tâches marchent sur un **hôte autonome** (gestion des ressources de cet hôte) ; d'autres demandent **vCenter** : **vMotion**, **Storage vMotion**, **modèles VMTX**, objets réseau et stockage **communs**, **clusters** (HA, DRS). vCenter doit lui-même être **hautement disponible** : c'est une VM critique.

- **VCSA** (l'appliance Linux de VMware) est aujourd'hui **la seule forme** de vCenter (la version à installer sur Windows a disparu).
- Accès : **client vSphere** en HTTPS (port **443**) · administration de l'appliance sur le port **5480**.

### 2. Gérer les ressources

- On peut **promettre** aux VM plus de ressources que l'hôte n'en a (toutes ne tournent pas à fond en même temps).
- Risque : une VM **importante** ne démarre pas faute de ressources → **réservation** (RAM, CPU garantis) pour une VM, un **pool** ou le cluster.
- **Pool de ressources** : une part des CPU et de la RAM réservée ou **limitée** pour un ensemble de VM (ex. garantir la **production**, brider les **tests**).

### 3. Les modèles

| | **VMTX** (modèle vSphere) | **OVF / OVA** |
|---|---|---|
| Où ? | Dans un **datacenter** vCenter | **Format standard**, échangeable : Workstation, vSphere, VirtualBox… |
| Pour | Déployer de nouvelles VM **en série** | **Importer / exporter** une VM |
| Format | — | **OVF** = un dossier de fichiers · **OVA** = ces fichiers dans **une seule archive** |

**Créer et utiliser un modèle VMTX** :

1. Préparer une **VM de référence** (OS, pilotes, applications, correctifs) et y installer les **VMware Tools**.
2. La **convertir** en modèle (*Convert to template*, l'original devient le modèle) ou la **cloner** en modèle (*Clone to template*, l'original reste).
3. **Déployer** des VM depuis le modèle (*Deploy VM from this template*), avec une **spécification de personnalisation** : **nom**, **adresse IP**, **SID** régénéré (sysprep pour Windows, [cours 2 · module 12](../../cours-02-systeme-client-microsoft/module-12-introduction-a-la-capture-et-au-deploiement-d-images/index.md)).

### 4. Utilisateurs, rôles et privilèges

- Comptes créés sur **vCenter** (droits possibles sur **toute** l'infrastructure) ou sur un **ESXi** (droits sur cet hôte seulement). Avec le **SSO**, vCenter peut utiliser les comptes du **domaine Active Directory**.
- **Méthode** : créer les utilisateurs → les mettre dans des **groupes** → créer des **rôles** (une liste de **privilèges**) → sur un **objet** de l'inventaire, associer un **groupe** et un **rôle** = une **permission**.
- **Bonnes pratiques** : des **groupes** plutôt que des utilisateurs · le **moindre privilège** (dupliquer un rôle trop large et le réduire) · définir les permissions **en haut** de l'arborescence et laisser l'**héritage** agir.

### 5. Déplacer des VM

| Outil | Ce qui bouge |
|---|---|
| **vMotion** | La VM (CPU, RAM, réseau) **vers un autre hôte**, allumée |
| **Storage vMotion** | Les **disques** de la VM **vers une autre banque de données**, allumée |

**Prérequis vMotion** : vMotion activé sur un **port VMkernel** des hôtes source et destination, dans le **même domaine de diffusion** ; stockage de la VM **accessible aux deux hôtes**.

**Causes d'échec fréquentes** : un **ISO local** monté dans la VM, un **groupe de ports** absent sur l'hôte de destination, des **processeurs** de générations incompatibles (à régler avec le mode **EVC** du cluster).

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **Datacenter** | Hôtes regroupés sous vCenter |
| **VCSA** | vCenter en appliance, client web (443), admin (5480) |
| **Réservation** | Ressources garanties à une VM ou un pool |
| **Pool de ressources** | Part de CPU/RAM pour un groupe de VM |
| **VMTX** | Modèle vSphere pour déployer en série |
| **OVF / OVA** | Format d'échange : dossier / archive unique |
| **Personnalisation** | Nom, IP, SID uniques (sysprep) |
| **Permission** | Objet + groupe + rôle (privilèges), héritée |
| **vMotion / Storage vMotion** | Déplace la VM / ses disques, à chaud |

### ⚠️ Les pièges

- Déployer un modèle **sans personnalisation** : noms et **SID en double**.
- Donner le rôle **Administrateur** à tout le monde : ignore le **moindre privilège**.
- Un **ISO monté** depuis un datastore local bloque vMotion.
- vCenter en panne = plus de gestion centralisée (les VM continuent de tourner, HA aussi).

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Le vMotion d'une VM échoue : « le réseau VM-PROD n'existe pas sur l'hôte de destination ». Que corriges-tu ?"
    Créer le **même groupe de ports** (même nom, même VLAN) sur l'hôte de destination, ou mieux, utiliser un **vSwitch distribué** commun aux deux hôtes.

??? question "2. L'équipe support doit pouvoir allumer, éteindre et ouvrir la console des VM de test, rien d'autre. Comment faire ?"
    Créer un groupe **Support**, un **rôle** avec seulement les privilèges *alimentation* et *console*, puis une **permission** (groupe Support + ce rôle) sur le **dossier** ou le **pool** des VM de test.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-13-virtualisation-de-serveurs-module-6-gestion-du-datacenter"></div>

<script type="application/json" id="quiz-cours-13-virtualisation-de-serveurs-module-6-gestion-du-datacenter-data">
[
  {
    "question": "Quelle fonctionnalité demande obligatoirement vCenter ?",
    "options": [
      "Créer une VM sur un hôte",
      "vMotion",
      "Allumer une VM",
      "Monter un ISO"
    ],
    "correctIndex": 1,
    "explanation": "vMotion, Storage vMotion, les modèles VMTX et les clusters demandent vCenter."
  },
  {
    "question": "Quelle est la différence entre OVF et OVA ?",
    "options": [
      "OVA est une archive unique contenant les fichiers OVF",
      "OVF est réservé à Hyper-V",
      "Aucune",
      "OVA est un modèle VMTX"
    ],
    "correctIndex": 0,
    "explanation": "OVF = un dossier de fichiers, OVA = ces fichiers dans une seule archive."
  },
  {
    "question": "Pourquoi utiliser une spécification de personnalisation en déployant un modèle ?",
    "options": [
      "Pour changer la couleur du bureau",
      "Pour donner à chaque VM un nom, une IP et un SID uniques",
      "Pour accélérer le disque",
      "Pour activer vMotion"
    ],
    "correctIndex": 1,
    "explanation": "Sans personnalisation, les VM déployées seraient des copies identiques."
  },
  {
    "question": "Dans vCenter, qu'est-ce qu'une permission ?",
    "options": [
      "Un mot de passe",
      "L'association d'un utilisateur ou groupe et d'un rôle sur un objet de l'inventaire",
      "Une licence",
      "Un snapshot"
    ],
    "correctIndex": 1,
    "explanation": "Le rôle contient les privilèges ; la permission s'hérite vers les objets enfants."
  },
  {
    "question": "Que fait Storage vMotion ?",
    "options": [
      "Déplace la VM vers un autre hôte",
      "Déplace les disques de la VM vers une autre banque de données, à chaud",
      "Sauvegarde la VM",
      "Supprime les snapshots"
    ],
    "correctIndex": 1,
    "explanation": "vMotion déplace le calcul, Storage vMotion le stockage."
  },
  {
    "question": "À quoi sert un pool de ressources ?",
    "options": [
      "À stocker les ISO",
      "À réserver ou limiter une part de CPU et de RAM pour un ensemble de VM",
      "À créer des VLAN",
      "À gérer les licences"
    ],
    "correctIndex": 1,
    "explanation": "Par exemple garantir la production et brider les tests."
  },
  {
    "question": "Quelle cause empêche souvent un vMotion ?",
    "options": [
      "Une VM éteinte",
      "Un ISO local monté dans la VM",
      "Un trop grand nombre de vCPU",
      "Un nom de VM trop long"
    ],
    "correctIndex": 1,
    "explanation": "L'ISO doit être accessible depuis l'hôte de destination, ou démonté."
  },
  {
    "question": "Which vSphere feature migrates a running VM to another host without downtime?",
    "options": [
      "vMotion",
      "Snapshot",
      "Template",
      "DPM"
    ],
    "correctIndex": 0,
    "explanation": "vMotion moves the running VM; Storage vMotion moves its disks."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-13-virtualisation-de-serveurs-module-6-gestion-du-datacenter",
      dataId: "quiz-cours-13-virtualisation-de-serveurs-module-6-gestion-du-datacenter-data",
    });
  });
</script>
