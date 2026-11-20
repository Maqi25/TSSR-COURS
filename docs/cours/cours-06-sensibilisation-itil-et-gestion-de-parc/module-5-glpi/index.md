# Module 5 : GLPI

*Cours : [Cours 6 - Sensibilisation ITIL et gestion de parc](../index.md)*

## 🎯 Objectif du module

Découvrir **GLPI**, l'outil libre de **gestion de parc** et de **centre de services**, ses deux interfaces et surtout ses **recherches**.

!!! abstract "En clair"
    GLPI, c'est **l'inventaire** de tout le matériel et les logiciels de l'entreprise **et** l'outil de **tickets** du support, dans une seule application web. Savoir y **chercher vite** (« tous les PC Windows 10 achetés avant 2020 ») est une compétence de tous les jours.

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 1 · compétence 3 : Apporter une assistance technique** (outil de tickets, traçabilité) et **compétence 2 : Assurer le déploiement des équipements numériques** (inventaire et cycle de vie du matériel).

**① GLPI : deux interfaces, deux publics**

```mermaid
flowchart LR
    U["👤 Utilisateur"] --> S["Interface SIMPLIFIÉE<br/>créer et suivre ses tickets,<br/>réservations, FAQ"]
    T["🧑‍💻 Technicien, admin"] --> N["Interface STANDARD<br/>tous les modules selon les droits<br/>vues personnelle, groupe, globale"]
```

**② Ce que gère GLPI**

```mermaid
flowchart TD
    G["GLPI<br/>Gestion Libre de Parc Informatique<br/>libre (GPL), conforme ITIL"] --> P["Parc<br/>matériel, composants, réseau,<br/>logiciels, licences"]
    G --> A["Assistance<br/>tickets, SLA, base de connaissances"]
    G --> F["Administratif et financier<br/>contrats, garanties, cycle de vie"]
```

**③ Les caractères spéciaux de recherche**

```mermaid
flowchart LR
    A["^PC<br/>commence par PC"] --- B["2020$<br/>finit par 2020"]
    B --- C["^PC-COMPTA$<br/>valeur exacte"]
    C --- D["NULL<br/>champ vide"]
    D --- E["&lt;6 ou &gt;6<br/>dates : en mois"]
```

## 📖 Cours consolidé

### 1. GLPI en bref

- **GLPI** = *Gestion Libre de Parc Informatique* : logiciel **libre** (licence **GPL**), en plusieurs langues, avec des **plugins**, installable sous **Linux ou Windows**.
- C'est un outil **ITSM** (*IT Service Management*) **conforme à ITIL** : **gestion de parc** + **centre de services**.
- Pour les petits comme les grands systèmes d'information.

### 2. Ce que contient le parc

Inventaire **matériel** (vue détaillée, connexions), **composants** internes, **réseau** (cartographie), **systèmes d'exploitation**, **logiciels et licences**, **cycle de vie** et **historique** de chaque élément, **réservation** de matériel, informations **administratives et financières**.

### 3. Les deux interfaces

| Interface | Pour qui ? | Ce qu'on y fait |
|---|---|---|
| **Simplifiée** | Les **utilisateurs** | Créer un ticket, suivre ses tickets, réservations, **FAQ** |
| **Standard** | **Techniciens et administrateurs** | Tous les modules selon les droits · 3 vues : **personnelle**, **groupe**, **globale** |

### 4. Chercher dans GLPI

| Recherche | Principe |
|---|---|
| **Rapide** | Sur les champs **affichés** |
| **Multicritère** | Plusieurs critères reliés par **ET / OU / ET PAS / OU PAS** · opérateurs : *contient, est, n'est pas, sous, avant, après…* |
| **Avancée** | Avec des **caractères spéciaux** (ci-dessous) |
| **Sauvegardée** | Un nom, une visibilité, une entité : on la relance en un clic |

| Caractère | Effet | Exemple |
|---|---|---|
| `^` | **Commence** par | `^PC` |
| `$` | **Finit** par | `2020$` |
| `^…$` | Valeur **exacte** | `^PC-COMPTA$` |
| `NULL` | Champ **vide** | numéro de série manquant |
| `<6` / `>6` | Dates : il y a **moins / plus de 6 mois** | garanties qui expirent |
| `AAAA-MM-JJ` | Une date précise | `2026-11-20` |

### 5. Travailler sur une liste

- **Colonnes personnalisables**, nombre d'éléments par page, **export** (CSV, PDF…), **corbeille**.
- **Modification massive** : on cherche, on coche les résultats, on applique **la même action** à tous (changer le lieu, le statut, l'utilisateur…).
- **Fiche d'un élément** : tous ses onglets (composants, logiciels, réseau, historique, tickets liés…).

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **GLPI** | Gestion Libre de Parc Informatique, libre (GPL), ITSM conforme ITIL |
| **Interface simplifiée** | Utilisateurs : tickets, réservations, FAQ |
| **Interface standard** | Techniciens et admins : tous les modules |
| **`^` / `$` / `^…$`** | Commence / finit / exact |
| **`NULL`** | Champ vide |
| **`<6` sur une date** | Moins de 6 mois |
| **Modification massive** | Même action sur tous les résultats d'une recherche |

### ⚠️ Les pièges

- La recherche **rapide** ne porte que sur les champs **affichés**.
- `^PC$` cherche **exactement** « PC », pas « PC-01 ».
- Une modification massive s'applique à **tous** les résultats : vérifie la recherche avant.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Trouve tous les ordinateurs dont le numéro de série n'a jamais été saisi."
    Parc → Ordinateurs → critère **Numéro de série** → valeur **`NULL`**.

??? question "2. 40 PC déménagent du site de Lyon à celui de Nantes. Comment changer leur lieu sans ouvrir 40 fiches ?"
    Recherche **Lieu = Lyon**, coche les résultats, puis **Actions → Modifier** (modification massive) → Lieu = **Nantes**.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-5-glpi"></div>

<script type="application/json" id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-5-glpi-data">
[
  {
    "question": "Que signifie GLPI ?",
    "options": [
      "Gestion Libre de Parc Informatique",
      "Gestion Logicielle des Processus Internes",
      "Gestionnaire de Licences et de Produits Informatiques",
      "Guide Libre des Pratiques ITIL"
    ],
    "correctIndex": 0,
    "explanation": "GLPI = Gestion Libre de Parc Informatique, un logiciel libre sous licence GPL."
  },
  {
    "question": "Quelle interface de GLPI est destinée aux utilisateurs finaux ?",
    "options": [
      "L'interface standard",
      "L'interface simplifiée",
      "La console d'administration",
      "Aucune, ils appellent par téléphone"
    ],
    "correctIndex": 1,
    "explanation": "L'interface simplifiée permet de créer et suivre ses tickets, réserver du matériel et consulter la FAQ."
  },
  {
    "question": "Dans une recherche GLPI, que signifie ^PC ?",
    "options": [
      "Le champ finit par PC",
      "Le champ commence par PC",
      "Le champ est vide",
      "Le champ ne contient pas PC"
    ],
    "correctIndex": 1,
    "explanation": "^ = début du champ, $ = fin du champ, ^…$ = valeur exacte."
  },
  {
    "question": "Comment chercher les éléments dont un champ est vide ?",
    "options": [
      "Avec la valeur NULL",
      "Avec la valeur 0",
      "Avec *",
      "Avec ^$ seul"
    ],
    "correctIndex": 0,
    "explanation": "NULL permet de trouver les champs non renseignés."
  },
  {
    "question": "Quel outil permet de changer le lieu de 40 ordinateurs d'un seul coup ?",
    "options": [
      "La recherche sauvegardée",
      "La modification massive",
      "L'interface simplifiée",
      "La corbeille"
    ],
    "correctIndex": 1,
    "explanation": "On sélectionne les résultats d'une recherche puis on applique la même modification à tous."
  },
  {
    "question": "Sous quelle licence GLPI est-il distribué ?",
    "options": [
      "Propriétaire",
      "GPL (libre)",
      "Freeware sans sources",
      "Licence Microsoft"
    ],
    "correctIndex": 1,
    "explanation": "GLPI est un logiciel 100 % libre, sous licence GPL."
  },
  {
    "question": "In GLPI's advanced search, which character matches the end of a field?",
    "options": [
      "^",
      "$",
      "*",
      "#"
    ],
    "correctIndex": 1,
    "explanation": "$ marks the end of the field, ^ the beginning."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-5-glpi",
      dataId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-5-glpi-data",
    });
  });
</script>
