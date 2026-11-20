# Fiche · Sauvegarde et restauration

*Cours lié : [Cours 15 - Sauvegarde et restauration](../cours/cours-15-sauvegarde-et-restauration/index.md) · 08/03 → 12/03/2027 · 35 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 15<br/>Sauvegarde")) --> P["Plan<br/>3-2-1, PCA/PRA,<br/>RPO/RTO"]
    C --> T["Types<br/>complète, différentielle,<br/>incrémentale, GFS"]
    C --> S["Supports<br/>LTO, NAS, SAN, RAID"]
    C --> V["VM<br/>Veeam, job, réplica"]
    C --> SU["Supervision<br/>alertes, tests<br/>de restauration"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **3-2-1** | 3 copies, 2 supports différents, 1 hors site |
| **PCA / PRA** | Continuer l'activité pendant la crise / redémarrer le SI |
| **RPO / RTO** | Perte de données acceptable / durée d'arrêt acceptable |
| **Complète** | Tout ; restauration la plus simple |
| **Différentielle** | Depuis la dernière **complète** → restaurer : complète + **dernière** différentielle |
| **Incrémentale** | Depuis la dernière **sauvegarde** → restaurer : complète + **toutes** les incrémentales |
| **GFS** | Fils (jour), Père (semaine), Grand-père (mois) |
| **À chaud / à froid** | Sans / avec arrêt du service |
| **LTO** | Bande, grande capacité, **hors ligne** (protège des rançongiciels) |
| **RAID** | 0 vitesse · 1 miroir · 5 parité (3 disques) · 10 (4 disques) ; **pas** une sauvegarde |
| **MySQL** | `mysqldump base > f.sql` / `mysql base < f.sql` |
| **Veeam** | Job (VM, dépôt, rétention), restauration granulaire, réplica |
| **VSS** | Sauvegarde cohérente des fichiers ouverts sous Windows |

## ✅ Points clés

- Une sauvegarde **non testée** ne vaut rien : tester régulièrement la **restauration**, noter le résultat et la durée.
- Une copie **hors ligne** ou **hors site** protège d'un rançongiciel ou d'un incendie.
- Vérifier **chaque jour** l'état des travaux (succès, avertissement, échec) et l'espace des dépôts.
- Utiliser un **compte de service dédié** pour les sauvegardes.
- Le RPO fixe la **fréquence** des sauvegardes, le RTO le **moyen** de reprise (réplica, restauration…).

## 🧠 Quiz express

<div id="quiz-revision-sauvegarde"></div>

<script type="application/json" id="quiz-revision-sauvegarde-data">
[
  {
    "question": "Que signifie la règle 3-2-1 ?",
    "options": [
      "3 serveurs, 2 sites, 1 bande",
      "3 copies, 2 supports différents, 1 copie hors site",
      "3 sauvegardes par jour",
      "3 disques en RAID 1"
    ],
    "correctIndex": 1,
    "explanation": "Elle protège contre la panne, le vol, l'incendie et les rançongiciels."
  },
  {
    "question": "Pour restaurer avec des sauvegardes incrémentales, il faut…",
    "options": [
      "la dernière incrémentale seulement",
      "la complète et toutes les incrémentales qui suivent",
      "la complète seulement",
      "la dernière différentielle"
    ],
    "correctIndex": 1,
    "explanation": "Avec des différentielles, la complète + la dernière différentielle suffisent."
  },
  {
    "question": "Qu'est-ce que le RPO ?",
    "options": [
      "La durée d'arrêt acceptable",
      "La quantité de données qu'on accepte de perdre",
      "Le prix d'une bande",
      "Le nombre de copies"
    ],
    "correctIndex": 1,
    "explanation": "Le RTO est la durée d'arrêt acceptable."
  },
  {
    "question": "Un RAID 1 remplace-t-il une sauvegarde ?",
    "options": [
      "Oui",
      "Non : une suppression ou un chiffrement est copié aussitôt sur les deux disques",
      "Oui, en RAID 5",
      "Seulement sur un NAS"
    ],
    "correctIndex": 1,
    "explanation": "Le RAID protège de la panne d'un disque, pas de la perte de données."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-sauvegarde",
      dataId: "quiz-revision-sauvegarde-data",
    });
  });
</script>
