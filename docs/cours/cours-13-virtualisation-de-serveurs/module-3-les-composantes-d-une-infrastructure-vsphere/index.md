# Module 3 : Les composantes d'une infrastructure vSphere

*Cours : [Cours 13 - Virtualisation de serveurs](../index.md)*

## 🎯 Objectif du module

Connaître les **composants** d'une infrastructure **VMware vSphere** (ESXi, vCenter, client vSphere) et ses grandes **fonctionnalités** (vMotion, DRS, HA, FT…).

!!! abstract "En clair"
    **vSphere** est le nom de toute la solution VMware. Sur chaque serveur physique tourne **ESXi** (l'hyperviseur). **vCenter** est le **chef d'orchestre** qui pilote tous les ESXi et rend possibles les fonctions avancées : déplacer une VM **à chaud** d'un serveur à l'autre, la **redémarrer ailleurs** si son serveur tombe…

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 2 · compétence 6 : Exploiter des serveurs dans une infrastructure virtualisée** et **CCP 3 · compétence 9 : Assurer la continuité** (HA, FT, vMotion).

**① Les composants de vSphere**

```mermaid
flowchart TD
    C["🌐 Client vSphere<br/>(navigateur web)"] --> V["vCenter Server<br/>appliance virtuelle (VCSA)<br/>gère tous les hôtes"]
    C -.->|"sans vCenter"| HC["Host Client<br/>d'un seul ESXi"]
    V --> E1["ESXi 1"]
    V --> E2["ESXi 2"]
    E1 --> VM1["VM · VM"]
    E2 --> VM2["VM · VM"]
```

**② Que se passe-t-il si un hôte tombe ?**

```mermaid
flowchart LR
    P["💥 Panne de l'ESXi 1"] --> HA["HA : les VM protégées<br/>REDÉMARRENT sur un autre hôte<br/>(courte coupure)"]
    P --> FT["FT : une copie de la VM<br/>tourne déjà ailleurs<br/>AUCUNE coupure"]
```

## 📖 Cours consolidé

### 1. Les composants

| Élément | Nom chez VMware | Rôle |
|---|---|---|
| Solution complète | **vSphere** | L'ensemble de la plateforme |
| Hyperviseur | **ESXi** | Installé sur chaque serveur physique (type 1) |
| Gestion centralisée | **vCenter Server** | Regroupe et pilote les ESXi ; fourni en **appliance virtuelle** (VCSA) |
| Client d'administration | **Client vSphere** (web, via vCenter) · **Host Client** (web, un seul ESXi) | L'interface d'administration |
| Machines | **VM** | Les serveurs virtuels |

- Depuis vSphere 6 : l'ancien **ESX** et le client **lourd** Windows ont disparu ; tout se fait par le **navigateur**.
- ⚠️ Les **versions** d'ESXi et de vCenter doivent être **compatibles** (vCenter au moins aussi récent que ses ESXi).

### 2. Les fonctionnalités

| Fonctionnalité | Ce qu'elle fait |
|---|---|
| **vMotion** | **Déplacer une VM allumée** d'un hôte à un autre, sans coupure |
| **Storage vMotion** | Déplacer **les disques** d'une VM vers une autre banque de données, à chaud |
| **DRS** | **Répartir automatiquement** les VM sur les hôtes les moins chargés (avec vMotion) |
| **Storage DRS** | Pareil pour les **banques de données** |
| **DPM** | Mettre en **veille** des hôtes quand la charge baisse, les réveiller ensuite |
| **HA** (*High Availability*) | Si un hôte tombe, ses VM **redémarrent** sur un autre hôte du **cluster** |
| **FT** (*Fault Tolerance*) | Une **copie synchronisée** de la VM tourne sur un autre hôte : **aucune** interruption |

Ces fonctions demandent **vCenter**, un **cluster** d'hôtes et un **stockage partagé** ([module 5](../module-5-gestion-du-stockage-sous-vsphere/index.md)) ; elles sont détaillées au [module 6](../module-6-gestion-du-datacenter/index.md).

### 3. Les licences

ESXi seul peut s'utiliser avec une licence de base ; les fonctions avancées (vMotion, HA, DRS, vSwitch distribué) dépendent du **niveau de licence** (Essentials, Standard, Enterprise Plus…). Depuis le rachat de VMware par **Broadcom** (2023), les offres sont passées en **abonnement** et ont été regroupées : les tarifs des supports de cours ne sont plus d'actualité.

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **vSphere** | La solution VMware complète |
| **ESXi** | L'hyperviseur, sur chaque hôte |
| **vCenter** | Gestion centralisée, appliance VCSA |
| **Client vSphere** | Interface web d'administration |
| **vMotion** | VM déplacée à chaud |
| **DRS** | Répartition automatique de la charge |
| **HA** | Redémarrage des VM sur un autre hôte |
| **FT** | Copie en direct, zéro coupure |

### ⚠️ Les pièges

- **HA ≠ FT** : HA **redémarre** la VM (courte coupure), FT n'a **aucune** coupure.
- Sans **vCenter** ni **stockage partagé** : pas de vMotion, HA ou DRS.
- **vMotion** déplace le **calcul** (CPU, RAM) ; **Storage vMotion** déplace les **disques**.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Tu dois redémarrer un ESXi pour une mise à jour sans arrêter ses VM. Quelle fonctionnalité utilises-tu ?"
    **vMotion** : on déplace à chaud les VM vers un autre hôte (ou on met l'hôte en **mode maintenance**, et DRS s'en charge), puis on met à jour et on redémarre l'hôte.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-13-virtualisation-de-serveurs-module-3-les-composantes-d-une-infrastructure-vsphere"></div>

<script type="application/json" id="quiz-cours-13-virtualisation-de-serveurs-module-3-les-composantes-d-une-infrastructure-vsphere-data">
[
  {
    "question": "Quel est le rôle de vCenter ?",
    "options": [
      "C'est l'hyperviseur installé sur chaque serveur",
      "Il gère de façon centralisée plusieurs hôtes ESXi",
      "C'est un antivirus",
      "C'est un format de disque"
    ],
    "correctIndex": 1,
    "explanation": "vCenter pilote les ESXi et rend possibles vMotion, DRS, HA."
  },
  {
    "question": "Quelle fonctionnalité déplace une VM allumée d'un hôte à un autre ?",
    "options": [
      "HA",
      "vMotion",
      "DPM",
      "Snapshot"
    ],
    "correctIndex": 1,
    "explanation": "vMotion déplace la VM à chaud ; Storage vMotion déplace ses disques."
  },
  {
    "question": "Un hôte tombe en panne : ses VM redémarrent sur un autre hôte. Quelle fonctionnalité ?",
    "options": [
      "FT",
      "HA",
      "DRS",
      "vMotion"
    ],
    "correctIndex": 1,
    "explanation": "HA redémarre les VM ; il y a une courte coupure."
  },
  {
    "question": "Quelle fonctionnalité évite toute interruption de service en cas de panne d'un hôte ?",
    "options": [
      "HA",
      "FT (Fault Tolerance)",
      "DPM",
      "DRS"
    ],
    "correctIndex": 1,
    "explanation": "FT maintient une copie synchronisée de la VM sur un autre hôte."
  },
  {
    "question": "Que fait DRS ?",
    "options": [
      "Il sauvegarde les VM",
      "Il répartit automatiquement les VM selon la charge des hôtes",
      "Il chiffre les disques",
      "Il crée des VLAN"
    ],
    "correctIndex": 1,
    "explanation": "Distributed Resource Scheduler utilise vMotion pour équilibrer la charge."
  },
  {
    "question": "Sous quelle forme vCenter est-il fourni aujourd'hui ?",
    "options": [
      "Un client lourd Windows",
      "Une appliance virtuelle (VCSA)",
      "Un module PowerShell",
      "Une clé USB"
    ],
    "correctIndex": 1,
    "explanation": "vCenter Server Appliance s'administre par le navigateur."
  },
  {
    "question": "What does HA stand for in vSphere?",
    "options": [
      "High Availability",
      "Hardware Acceleration",
      "Host Agent",
      "Hot Add"
    ],
    "correctIndex": 0,
    "explanation": "High Availability : redémarrage automatique des VM sur un autre hôte."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-13-virtualisation-de-serveurs-module-3-les-composantes-d-une-infrastructure-vsphere",
      dataId: "quiz-cours-13-virtualisation-de-serveurs-module-3-les-composantes-d-une-infrastructure-vsphere-data",
    });
  });
</script>
