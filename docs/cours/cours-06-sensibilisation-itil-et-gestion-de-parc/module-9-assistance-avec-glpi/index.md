# Module 9 : Assistance avec GLPI

*Cours : [Cours 6 - Sensibilisation ITIL et gestion de parc](../index.md)*

## 🎯 Objectif du module

Savoir **créer**, **traiter** et **clôturer** un ticket dans **GLPI**, et utiliser la **base de connaissances**.

!!! abstract "En clair"
    Tout passe par un **ticket** : il garde la **trace** de la demande, de ce qui a été fait, et de qui l'a fait. Un bon ticket permet à n'importe quel collègue de reprendre le dossier, et donne des **statistiques** pour améliorer le service.

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 1 · compétence 3 : Apporter une assistance technique** : « qualifier et traiter les demandes et incidents, appliquer les procédures de résolution et d'escalade, assurer la traçabilité ».

**① Le cycle de vie d'un ticket GLPI**

```mermaid
flowchart LR
    N["Nouveau<br/>personne d'attribué"] --> A["En cours (attribué)<br/>un technicien ou un groupe"]
    A --> P["En cours (planifié)<br/>une tâche est planifiée"]
    A --> W["En attente<br/>il manque une information"]
    W --> A
    P --> R["Résolu<br/>une solution est donnée"]
    A --> R
    R --> C["Clos<br/>le demandeur approuve"]
    R -->|"refus (commentaire obligatoire)"| A
```

**② Trois façons de créer un ticket**

```mermaid
flowchart LR
    G["🌐 Interface GLPI<br/>simplifiée, standard,<br/>ou anonyme"] --> T["🎫 Ticket"]
    M["✉️ Mail vers la boîte support<br/>(collecteur)"] --> T
    P["📞 Téléphone<br/>le technicien le saisit"] --> T
```

**③ Qui voit le ticket ?**

```mermaid
flowchart LR
    T["🎫 Ticket"] --> D["Demandeur<br/>a ouvert la demande"]
    T --> AT["Attribué à<br/>techniciens, groupes, fournisseurs<br/>(escalade fonctionnelle)"]
    T --> O["Observateurs<br/>suivent sans traiter<br/>(escalade hiérarchique)"]
```

## 📖 Cours consolidé

### 1. Pourquoi des tickets ?

Un ticket est soit un **incident**, soit une **demande** (module 6). Il apporte : **traçabilité**, **détection des problèmes** (incidents qui se répètent), **répartition des tâches**, **communication** avec l'utilisateur, et des **statistiques**.

Un ticket doit contenir au minimum : le **demandeur**, la **description** claire, la **catégorie**, l'**urgence**, et si possible l'**élément concerné** (son PC, son imprimante).

### 2. Le cycle de vie

| Statut | Signification |
|---|---|
| **Nouveau** | Aucun technicien ni groupe attribué |
| **En cours (attribué)** | Au moins un technicien ou un groupe s'en occupe |
| **En cours (planifié)** | Une **tâche** a été planifiée |
| **En attente** | Il manque un élément (réponse de l'utilisateur, pièce…) : statut mis **à la main** |
| **Résolu** | Une **solution** a été apportée |
| **Clos** | Le demandeur a **approuvé** la solution |

### 3. Traiter un ticket

| Élément | Rôle |
|---|---|
| **Attribution** | Techniciens, **groupes** ou **fournisseurs** chargés du ticket · sert à l'**escalade fonctionnelle** · peut être **automatique** selon des règles |
| **Observateurs** | Reçoivent les notifications **sans traiter** · servent à l'**escalade hiérarchique** |
| **SLA** | Temps de résolution maximum, avec des **niveaux d'escalade** · dépasser l'échéance n'est **pas bloquant**, seulement **signalé** |
| **Validation** | Accord **hiérarchique** demandé (ex. achat), manuel ou automatique, **non bloquant** |
| **Onglet Traitement** | **Suivi** (échanges), **Tâche** (travail réalisé, avec durée), **Solution**, **Document** |
| **Éléments liés** | Le **CI** concerné (PC, imprimante) : aide au diagnostic et aux statistiques, si la **CMDB** est à jour |

**Clôture** : le ticket est **clos** quand le **demandeur approuve** la solution (par le mail ou l'interface simplifiée). En cas de **refus**, un **commentaire est obligatoire** et le ticket repart en traitement.

### 4. La base de connaissances

- Centralise les **solutions** des techniciens et propose une **FAQ** aux utilisateurs.
- Dans GLPI : **Outils → Base de connaissances**.
- Un article a des **cibles** (entité, profil, groupe, utilisateur). **Sans cible, il n'est pas publié** : seul son créateur le voit.
- Gestion des **révisions**, **validation** avant publication, liens avec les **tickets** et le **parc**.
- La **FAQ** (publique) évite la création de tickets : l'utilisateur trouve la réponse seul.

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **Statuts** | Nouveau → En cours (attribué / planifié) → En attente → Résolu → Clos |
| **Résolu / clos** | Solution donnée / solution **approuvée** par le demandeur |
| **Attribué** | Traite le ticket (escalade fonctionnelle) |
| **Observateur** | Suit sans traiter (escalade hiérarchique) |
| **Suivi / tâche / solution** | Échange / travail réalisé / réponse finale |
| **SLA dans GLPI** | Échéance signalée, non bloquante |
| **Article sans cible** | Non publié |
| **FAQ** | Base de connaissances publique pour les utilisateurs |

### ⚠️ Les pièges

- **Résolu ≠ clos** : c'est le **demandeur** qui clôt en approuvant.
- Un **observateur** ne peut pas traiter le ticket.
- Un article **sans cible** reste invisible pour les autres.
- Un ticket mal rédigé = un collègue qui doit **tout redemander**.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Tu attends que l'utilisateur te rappelle avec le message d'erreur exact. Quel statut mets-tu ?"
    **En attente** (statut à mettre à la main). Ajoute un **suivi** qui explique ce que tu attends.

??? question "2. Le même problème d'imprimante revient chaque semaine et tu as trouvé la manipulation. Que fais-tu dans GLPI ?"
    Rédige un **article** dans la base de connaissances, donne-lui des **cibles** (le groupe support, voire la **FAQ** si l'utilisateur peut le faire seul), et **lie-le** au ticket. Si l'origine reste inconnue, signale-le pour l'ouverture d'un **problème**.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-9-assistance-avec-glpi"></div>

<script type="application/json" id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-9-assistance-avec-glpi-data">
[
  {
    "question": "Quel statut GLPI indique qu'une solution a été apportée mais pas encore approuvée ?",
    "options": [
      "Nouveau",
      "En attente",
      "Résolu",
      "Clos"
    ],
    "correctIndex": 2,
    "explanation": "Résolu = solution donnée ; Clos = solution approuvée par le demandeur."
  },
  {
    "question": "Qui clôt normalement un ticket ?",
    "options": [
      "Le technicien seul",
      "Le demandeur, en approuvant la solution",
      "L'observateur",
      "Le fournisseur"
    ],
    "correctIndex": 1,
    "explanation": "La clôture se fait à l'approbation de la solution par le demandeur (ou le rédacteur pour un ticket créé par téléphone)."
  },
  {
    "question": "À quoi servent les observateurs d'un ticket ?",
    "options": [
      "À traiter le ticket",
      "À suivre le ticket sans le traiter, par exemple lors d'une escalade hiérarchique",
      "À valider les achats",
      "À fermer le ticket"
    ],
    "correctIndex": 1,
    "explanation": "Les observateurs reçoivent les notifications sans pouvoir traiter."
  },
  {
    "question": "Un utilisateur refuse la solution. Que se passe-t-il ?",
    "options": [
      "Le ticket est supprimé",
      "Il doit laisser un commentaire et le ticket repart en traitement",
      "Le ticket est clos quand même",
      "Rien"
    ],
    "correctIndex": 1,
    "explanation": "Le commentaire est obligatoire en cas de refus."
  },
  {
    "question": "Que se passe-t-il quand l'échéance du SLA d'un ticket est dépassée dans GLPI ?",
    "options": [
      "Le ticket est bloqué",
      "C'est seulement signalé, ce n'est pas bloquant",
      "Le ticket est supprimé",
      "Il est réattribué au client"
    ],
    "correctIndex": 1,
    "explanation": "Le dépassement est informatif ; des niveaux d'escalade peuvent se déclencher."
  },
  {
    "question": "Un article de la base de connaissances sans cible…",
    "options": [
      "Est visible par tout le monde",
      "N'est pas publié : seul son créateur le voit",
      "Est supprimé",
      "Devient une FAQ"
    ],
    "correctIndex": 1,
    "explanation": "Il faut lui ajouter des cibles (entité, profil, groupe, utilisateur) pour le publier."
  },
  {
    "question": "Quelles sont les 3 grandes façons de créer un ticket dans GLPI ?",
    "options": [
      "Interface GLPI, mail, téléphone",
      "SMS, fax, courrier",
      "Uniquement l'interface standard",
      "Teams, Slack, SVI"
    ],
    "correctIndex": 0,
    "explanation": "Depuis GLPI (interfaces simplifiée, standard ou anonyme), par mail via un collecteur, ou par téléphone (le technicien saisit le ticket)."
  },
  {
    "question": "In GLPI, which ticket status means the requester has approved the solution?",
    "options": [
      "New",
      "Pending",
      "Solved",
      "Closed"
    ],
    "correctIndex": 3,
    "explanation": "Closed (Clos) : la solution a été approuvée. Solved (Résolu) : elle a seulement été proposée."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-9-assistance-avec-glpi",
      dataId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-9-assistance-avec-glpi-data",
    });
  });
</script>
