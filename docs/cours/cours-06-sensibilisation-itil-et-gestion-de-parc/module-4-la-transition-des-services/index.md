# Module 4 : La transition des services

*Cours : [Cours 6 - Sensibilisation ITIL et gestion de parc](../index.md)*

## 🎯 Objectif du module

Comprendre comment un service passe **en production** sans casser l'existant : la **gestion des changements** (RFC, CAB, types de changement), les **éléments de configuration** et la **CMDB**, les **déploiements** et la **gestion de la connaissance**.

!!! abstract "En clair"
    Mettre à jour un serveur, ajouter un logiciel, changer un pare-feu : chaque modification peut provoquer une panne. ITIL impose de **demander** (RFC), de **faire valider**, de **tester**, de **planifier**, puis de **mettre à jour l'inventaire** (CMDB). Rien ne change « en douce ».

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 3 · compétence 10 : Mettre à jour les éléments de l'infrastructure** (une mise à jour est un **changement**) et **CCP 1 · compétence 3** (traçabilité, base de connaissances).

**① La vie d'une demande de changement**

```mermaid
flowchart TD
    R["📝 RFC<br/>demande de changement"] --> F["Filtrage, classification,<br/>priorité = impact × urgence"]
    F --> Q{"Type ?"}
    Q -->|"standard"| S["Pré-approuvé :<br/>procédure connue"]
    Q -->|"normal"| CAB["CAB<br/>comité qui évalue"]
    Q -->|"urgent"| E["ECAB<br/>comité d'urgence"]
    CAB --> P["Préparation, tests,<br/>mise en production"]
    S --> P
    E --> P
    P --> PIR["PIR<br/>bilan après mise en production"]
    PIR --> M["Mise à jour de la CMDB"]
```

**② Changement standard, normal ou urgent ?**

```mermaid
flowchart TD
    A{"Action connue, documentée,<br/>déjà testée, peu risquée ?"} -- oui --> S["Standard<br/>pré-approuvé"]
    A -- non --> B{"Urgence exceptionnelle ?"}
    B -- oui --> U["Urgent<br/>validé par l'ECAB"]
    B -- non --> N["Normal<br/>évalué par le CAB"]
```

**③ Où sont rangées les informations ?**

```mermaid
flowchart LR
    CI["CI<br/>élément de configuration<br/>PC, serveur, logiciel, contrat…"] --> CMDB["CMDB<br/>base des CI et<br/>de leurs relations"]
    CMDB --> CMS["CMS<br/>outils qui regroupent<br/>plusieurs CMDB"]
    DML["DML<br/>bibliothèque sécurisée<br/>des logiciels et licences"] --> CMS
```

## 📖 Cours consolidé

### 1. La transition des services

**But** : **mettre en production** les services nouveaux ou modifiés, en respectant la conception, les coûts, la qualité, la sécurité et les délais. Tout commence par une **RFC** (*Request For Change*).

Ses processus : gestion des **changements** · gestion des **actifs et des configurations** · **planification** et support à la transition · **évaluation** des changements · **validation et tests** · gestion des **déploiements et mises en production** · gestion de la **connaissance**.

### 2. La gestion des changements

Un **changement** = l'**ajout**, la **modification** ou le **retrait** d'un élément du système d'information.

**Les 7 R** à se poser : **R**aised (qui demande ?) · **R**eason (pourquoi ?) · **R**eturn (quel gain ?) · **R**isks (quels risques ?) · **R**esources (quels moyens ?) · **R**esponsible (qui en répond ?) · **R**elationship (lien avec d'autres changements ?).

**Une RFC contient** : un identifiant unique, la date, le demandeur, une **priorité proposée (impact × urgence)**, la description, les **risques**, les dates de mise en place, les ressources nécessaires.

| Type | Caractéristiques | Qui autorise ? |
|---|---|---|
| **Standard** | Connu, documenté, testé, faible risque, dans un catalogue de changements pré-autorisés | **Pré-approuvé** |
| **Normal** | Évaluation complète nécessaire | Le **CAB** |
| **Urgent** | Exceptionnel, procédures raccourcies | L'**ECAB** |

| Sigle | Sens |
|---|---|
| **CAB** | *Change Advisory Board* : comité qui évalue les changements normaux |
| **ECAB** | *Emergency CAB* : comité qui autorise les changements urgents |
| **PIR** | *Post Implementation Review* : bilan après la mise en production |

### 3. Actifs et configurations

- Un **CI** (*Configuration Item*) = un composant qui contribue à un service : **matériel**, **logiciel**, équipement **réseau**, téléphonie, **contrat**, **documentation**, procédure… Il a un type, des **attributs** et des **relations** avec d'autres CI.
- La **CMDB** (*Configuration Management DataBase*) enregistre les CI ; le **CMS** regroupe plusieurs CMDB ; la **DML** (*Definitive Media Library*) stocke en sécurité les **logiciels** de référence, leurs médias et leurs **licences**.
- Activités : **identifier** (étiqueter, définir les attributs) · **contrôler** · suivre les **états** · **vérifier et auditer** (les données sont-elles à jour ?).

💡 Dans GLPI, le **parc** (ordinateurs, logiciels, réseau, contrats) joue le rôle de la CMDB.

### 4. Mises en production et déploiements

| Mode | Principe |
|---|---|
| **Push** | Le centre **envoie** la mise à jour vers les postes |
| **Pull** | La mise à jour est **mise à disposition** ; l'utilisateur la lance |
| **Big bang** | Tout le monde **en une fois** |
| **Par phases** | Par **groupes**, selon un plan |
| **Manuel / automatique** | Par un technicien / sans intervention (conseillé) |

Les autres processus : l'**évaluation** mesure l'impact et produit la **PIR** · la **validation et les tests** produisent les **procès-verbaux de recette** · la **planification** gère les ressources de la transition.

### 5. La gestion de la connaissance

But : donner **la bonne information**, au **bon niveau de détail**, à la **bonne personne**, pour décider vite et **ne pas résoudre deux fois le même problème**. L'outil : le **SKMS** (*Service Knowledge Management System*), dont fait partie la **base de connaissances**.

📌 Une base de connaissances **utilisée** vaut mieux qu'une base énorme que personne ne lit.

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **RFC** | Demande de changement formalisée |
| **Priorité** | Impact × urgence |
| **Standard / normal / urgent** | Pré-approuvé / CAB / ECAB |
| **PIR** | Bilan après mise en production |
| **CI** | Tout composant qui contribue à un service |
| **CMDB** | Base des CI et de leurs relations |
| **DML** | Bibliothèque des logiciels et licences de référence |
| **Push / pull** | Envoyé / mis à disposition |
| **SKMS** | Système de gestion de la connaissance |

### ⚠️ Les pièges

- Le **CAB** évalue les changements **normaux** ; l'**ECAB** autorise les **urgents** ; les **standards** sont **pré-approuvés**.
- Un **contrat** ou une **documentation** peuvent être des **CI**.
- Après un changement, on **met à jour la CMDB**, sinon l'inventaire devient faux.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Chaque mois, tu installes les correctifs Windows avec la même procédure testée. Quel type de changement ?"
    **Standard** : connu, documenté, testé, faible risque, donc **pré-approuvé**.

??? question "2. Une faille critique est exploitée sur le pare-feu ce matin. Le correctif doit passer avant ce soir. Qui autorise ?"
    C'est un changement **urgent** : il est autorisé par l'**ECAB**. On fera ensuite une **PIR** et on mettra à jour la **CMDB**.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-4-la-transition-des-services"></div>

<script type="application/json" id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-4-la-transition-des-services-data">
[
  {
    "question": "Que signifie RFC en ITIL ?",
    "options": [
      "Request For Change",
      "Rapid Fix Control",
      "Remote Function Call",
      "Release For Customer"
    ],
    "correctIndex": 0,
    "explanation": "Une RFC formalise toute demande de changement."
  },
  {
    "question": "Comment calcule-t-on la priorité d'un changement ou d'un incident ?",
    "options": [
      "Coût × durée",
      "Impact × urgence",
      "Nombre d'utilisateurs ÷ délai",
      "Risque + ressources"
    ],
    "correctIndex": 1,
    "explanation": "Priorité = impact × urgence."
  },
  {
    "question": "Qui évalue les changements normaux ?",
    "options": [
      "L'ECAB",
      "Le CAB",
      "Le centre de services seul",
      "L'utilisateur"
    ],
    "correctIndex": 1,
    "explanation": "Le CAB (Change Advisory Board) évalue les changements normaux ; l'ECAB autorise les urgents."
  },
  {
    "question": "Un changement connu, documenté, déjà testé et peu risqué est…",
    "options": [
      "Urgent",
      "Normal",
      "Standard",
      "Interdit"
    ],
    "correctIndex": 2,
    "explanation": "Le changement standard est pré-approuvé."
  },
  {
    "question": "Qu'est-ce qu'un CI ?",
    "options": [
      "Un incident critique",
      "Un composant qui contribue à un service (PC, logiciel, contrat…)",
      "Un comité de validation",
      "Un indicateur de qualité"
    ],
    "correctIndex": 1,
    "explanation": "Configuration Item : tout élément de configuration enregistré dans la CMDB."
  },
  {
    "question": "À quoi sert la CMDB ?",
    "options": [
      "À stocker les sauvegardes",
      "À enregistrer les éléments de configuration et leurs relations",
      "À envoyer les mises à jour",
      "À calculer le prix des services"
    ],
    "correctIndex": 1,
    "explanation": "La Configuration Management DataBase est l'inventaire des CI et de leurs liens."
  },
  {
    "question": "Une mise à jour est mise à disposition sur un serveur et l'utilisateur la lance quand il veut. Quel mode de déploiement ?",
    "options": [
      "Push",
      "Pull",
      "Big bang",
      "Manuel"
    ],
    "correctIndex": 1,
    "explanation": "En pull, l'utilisateur déclenche lui-même ; en push, le centre envoie."
  },
  {
    "question": "Que fait la PIR ?",
    "options": [
      "Elle autorise les changements urgents",
      "Elle analyse les résultats après la mise en production",
      "Elle stocke les licences",
      "Elle crée les tickets"
    ],
    "correctIndex": 1,
    "explanation": "Post Implementation Review : le bilan après la mise en production d'un changement."
  },
  {
    "question": "Which board approves emergency changes?",
    "options": [
      "The CAB",
      "The ECAB",
      "The service desk",
      "The DML"
    ],
    "correctIndex": 1,
    "explanation": "ECAB = Emergency Change Advisory Board."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-4-la-transition-des-services",
      dataId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-4-la-transition-des-services-data",
    });
  });
</script>
