# Fiche · ITIL et gestion de parc

*Cours lié : [Cours 6 - Sensibilisation ITIL et gestion de parc](../cours/cours-06-sensibilisation-itil-et-gestion-de-parc/index.md) · 07/12 → 18/12/2026 · 70 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 6<br/>ITIL")) --> S["Stratégie et conception<br/>catalogue, SLA,<br/>disponibilité"]
    C --> T["Transition<br/>RFC, CAB, CMDB"]
    C --> E["Exploitation<br/>centre de services,<br/>incident, problème"]
    C --> A["Amélioration continue<br/>PDCA, KPI"]
    C --> G["GLPI<br/>tickets, parc,<br/>base de connaissances"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **ITIL** | Bonnes pratiques de gestion des services informatiques |
| **Cycle de vie** | Stratégie → Conception → Transition → Exploitation → Amélioration continue |
| **Valeur** | Utilité **et** garantie |
| **SLA / OLA / UC** | Engagement envers le client / contrat interne / contrat avec un sous-traitant |
| **RACI** | Réalise, Assume (un seul), Consulté, Informé |
| **Requête** | Une demande, pas une panne |
| **Incident** | Service arrêté ou dégradé → **rétablir** vite |
| **Problème** | **Cause** inconnue d'incidents qui se répètent |
| **Erreur connue** | Cause connue + contournement (KEDB) |
| **Priorité** | Impact × urgence |
| **RFC** | Demande de changement : standard / normal (CAB) / urgent (ECAB) |
| **CMDB** | Base des éléments de configuration (CI) et de leurs liens |
| **Escalade** | Fonctionnelle (plus expert) / hiérarchique (responsable) |
| **Ticket GLPI** | Nouveau → En cours → En attente → Résolu → **Clos** (validé par le demandeur) |

## ✅ Points clés

- Le **centre de services** est le **point de contact unique** des utilisateurs.
- Incident = rétablir le service ; problème = trouver la **cause** pour que ça ne revienne pas.
- PDCA : **Plan, Do, Check, Act** ; on mesure avec des **KPI** par rapport aux SLA.
- Savoir-être : **écoute active**, reformuler, ne pas couper la parole.
- Chaque solution trouvée alimente la **base de connaissances**.

## 🧠 Quiz express

<div id="quiz-revision-itil-gestion-de-parc"></div>

<script type="application/json" id="quiz-revision-itil-gestion-de-parc-data">
[
  {
    "question": "Plusieurs utilisateurs signalent chaque lundi la même panne d'imprimante. Pour ITIL, il s'agit…",
    "options": [
      "d'une requête",
      "d'un problème à analyser",
      "d'un changement",
      "d'un évènement normal"
    ],
    "correctIndex": 1,
    "explanation": "Des incidents récurrents dont on cherche la cause forment un problème."
  },
  {
    "question": "Comment calcule-t-on la priorité d'un ticket ?",
    "options": [
      "Ordre d'arrivée",
      "Impact × urgence",
      "Grade du demandeur",
      "Durée estimée"
    ],
    "correctIndex": 1,
    "explanation": "Une panne qui touche tout un service et bloque le travail est la plus prioritaire."
  },
  {
    "question": "Que contient la CMDB ?",
    "options": [
      "Les mots de passe",
      "Les éléments de configuration et leurs relations",
      "Les factures",
      "Les tickets clos uniquement"
    ],
    "correctIndex": 1,
    "explanation": "Elle permet d'évaluer l'impact d'un changement ou d'une panne."
  },
  {
    "question": "Quelle est la différence entre un ticket résolu et un ticket clos dans GLPI ?",
    "options": [
      "Aucune",
      "Clos = la solution a été approuvée par le demandeur",
      "Résolu = supprimé",
      "Clos = en attente"
    ],
    "correctIndex": 1,
    "explanation": "Le technicien résout, le demandeur valide."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-itil-gestion-de-parc",
      dataId: "quiz-revision-itil-gestion-de-parc-data",
    });
  });
</script>
