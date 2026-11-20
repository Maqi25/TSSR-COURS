# Module 7 : Les publications centrales - Amélioration continue des services

*Cours : [Cours 6 - Sensibilisation ITIL et gestion de parc](../index.md)*

## 🎯 Objectif du module

Comprendre l'**amélioration continue des services** et la **roue de Deming** (PDCA).

!!! abstract "En clair"
    Un service n'est jamais « fini » : on **mesure** ce qu'il donne, on **compare** avec ce qu'on a promis (SLA), on **corrige**, puis on recommence. C'est la **roue de Deming** : **P**lanifier, **D**éployer, **C**ontrôler, **A**juster.

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 3 · compétence 10 : Superviser** (les mesures et indicateurs) et **CCP 1 · compétence 3** (enquêtes de satisfaction, amélioration du support).

**① La roue de Deming (PDCA)**

```mermaid
flowchart LR
    P["PLAN<br/>planifier :<br/>objectif, actions"] --> D["DO<br/>faire :<br/>mettre en œuvre"]
    D --> C["CHECK<br/>vérifier :<br/>mesurer les résultats"]
    C --> A["ACT<br/>ajuster :<br/>corriger, standardiser"]
    A --> P
```

**② Quelles mesures, pour qui ?**

```mermaid
flowchart LR
    T["Métriques techniques<br/>CPU, disque, temps de réponse"] --> I["Interne à la DSI<br/>(pas pour le client)"]
    PR["Métriques de processus<br/>délai de traitement des tickets"] --> I
    S["Métriques de service<br/>disponibilité, respect du SLA"] --> C["Communiquées au client"]
```

## 📖 Cours consolidé

### 1. Les objectifs

- **Analyser** les résultats des contrats (**SLA**, **OLA**, **UC**).
- Trouver et mettre en œuvre les actions qui **améliorent** les services.
- Améliorer la **rentabilité sans baisser la qualité** (efficience) et la **relation client**.
- Vérifier que les méthodes de gestion sont **efficaces**.

### 2. Les missions

Analyser les **tendances**, mener des **enquêtes de satisfaction** et des **audits internes**, faire des **recommandations**, conduire des **revues** d'amélioration.

### 3. Les indicateurs

| Sigle | Sens |
|---|---|
| **KPI** (*Key Performance Indicator*) | Indicateur **chiffré** de performance (ex. % de tickets résolus en moins de 8 h) |
| **CSF** (*Critical Success Factor*) | Facteur **clé de succès** : ce qui doit absolument réussir (ex. « un support réactif ») |
| **Base de référence** (*baseline*) | Le **point de départ** mesuré, pour comparer ensuite |

| Type de mesure | Exemple | Pour qui ? |
|---|---|---|
| **Technique** | Charge CPU, espace disque | DSI seulement |
| **De processus** | Temps moyen de traitement d'un ticket | DSI |
| **De service** | Disponibilité de la messagerie sur le mois | **Le client** |

### 4. La roue de Deming

| Étape | En clair | Exemple au support |
|---|---|---|
| **Plan** | Fixer un objectif et un plan | « Résoudre 80 % des tickets en N1 » |
| **Do** | Agir | Rédiger 20 articles de base de connaissances |
| **Check** | Mesurer | Taux de résolution en N1 le mois suivant |
| **Act** | Corriger, généraliser | Ajouter les articles manquants, former l'équipe |

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **Amélioration continue** | Mesurer → comparer aux SLA → améliorer |
| **PDCA** | Plan, Do, Check, Act |
| **KPI** | Indicateur chiffré de performance |
| **CSF** | Facteur clé de succès |
| **Baseline** | Point de départ mesuré |
| **Métriques de service** | Les seules communiquées au client |

### ⚠️ Les pièges

- **KPI** = un **chiffre** · **CSF** = un **objectif qualitatif** à atteindre.
- On ne montre **pas** les métriques **techniques** au client : il veut savoir si **son service** marche.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Les utilisateurs se plaignent du support. Applique le PDCA."
    **Plan** : mesurer la satisfaction actuelle (baseline) et viser un objectif · **Do** : actions (base de connaissances, formation, horaires) · **Check** : nouvelle enquête, KPI de délai · **Act** : garder ce qui marche, corriger le reste, et recommencer.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-7-les-publications-centrales-amelioration-continue-des-services"></div>

<script type="application/json" id="quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-7-les-publications-centrales-amelioration-continue-des-services-data">
[
  {
    "question": "Que signifie PDCA ?",
    "options": [
      "Plan, Do, Check, Act",
      "Prepare, Deploy, Control, Audit",
      "Process, Data, Change, Action",
      "Plan, Design, Create, Apply"
    ],
    "correctIndex": 0,
    "explanation": "La roue de Deming : planifier, faire, vérifier, ajuster, puis recommencer."
  },
  {
    "question": "Quelles métriques communique-t-on au client ?",
    "options": [
      "Les métriques techniques",
      "Les métriques de service",
      "Les métriques de processus internes",
      "Aucune"
    ],
    "correctIndex": 1,
    "explanation": "Le client s'intéresse à son service (disponibilité, respect du SLA), pas à la charge CPU."
  },
  {
    "question": "Qu'est-ce qu'un KPI ?",
    "options": [
      "Un contrat avec un fournisseur",
      "Un indicateur clé de performance chiffré",
      "Un type de changement",
      "Une base de connaissances"
    ],
    "correctIndex": 1,
    "explanation": "Key Performance Indicator : par exemple le pourcentage de tickets résolus dans les délais."
  },
  {
    "question": "Dans le PDCA, à quelle étape mesure-t-on les résultats ?",
    "options": [
      "Plan",
      "Do",
      "Check",
      "Act"
    ],
    "correctIndex": 2,
    "explanation": "Check = vérifier, mesurer. Act = corriger et généraliser."
  },
  {
    "question": "Quels contrats l'amélioration continue analyse-t-elle ?",
    "options": [
      "SLA, OLA et UC",
      "Seulement les licences",
      "Les contrats de travail",
      "Les RFC"
    ],
    "correctIndex": 0,
    "explanation": "Elle compare les résultats aux engagements pris avec le client (SLA), en interne (OLA) et avec les prestataires (UC)."
  },
  {
    "question": "In the Deming cycle, what comes after Check?",
    "options": [
      "Plan",
      "Do",
      "Act",
      "Close"
    ],
    "correctIndex": 2,
    "explanation": "Plan → Do → Check → Act, then the cycle starts again."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-7-les-publications-centrales-amelioration-continue-des-services",
      dataId: "quiz-cours-06-sensibilisation-itil-et-gestion-de-parc-module-7-les-publications-centrales-amelioration-continue-des-services-data",
    });
  });
</script>
