# Fiche · Scripting Bash

*Cours lié : [Cours 10 - Initiation au scripting Bash](../cours/cours-10-initiation-au-scripting-bash/index.md) · 01/02 → 05/02/2027 · 35 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 10<br/>Bash")) --> A["Analyser<br/>cahier des charges,<br/>algorithme"]
    C --> E["Écrire et lancer<br/>shebang, chmod +x,<br/>bash -x"]
    C --> V["Variables<br/>arguments, code retour,<br/>read"]
    C --> T["Tests et boucles<br/>if, case, for, while"]
    C --> F["Fonctions<br/>local, return, source"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **Shebang** | `#!/bin/bash` en première ligne |
| **Lancer** | `chmod +x script.sh` puis `./script.sh` |
| **Déboguer** | `bash -x script.sh` (trace) · `bash -n` (syntaxe) |
| **Variable** | `nom=valeur` (sans espace) · lire avec `"$nom"` |
| **Arguments** | `$1`… · `$#` nombre · `$@` tous · `$0` le script |
| **Code retour** | `$?` : 0 = succès · `exit n` |
| **Saisie** | `read -p "Question : " var` |
| **Enchaîner** | `&&` si succès · **\|\|** si échec · `;` toujours |
| **Test** | `if [[ $a -gt 5 ]] ; then … fi` (espaces obligatoires) |
| **Nombres / chaînes** | `-eq -ne -gt -lt` / `=`, `!=`, `-z` (vide) |
| **Fichiers** | `-f` fichier · `-d` dossier · `-e` existe |
| **Boucles** | `for x in liste ; do … done` · `while read l ; do … done < f` |
| **Calcul** | `$(( a + b ))` |
| **Fonction** | `func_nom() { local v=$1 ; … ; return 0 ; }` |

## ✅ Points clés

- On **analyse** avant d'écrire : entrées, sorties, erreurs, algorithme.
- Toujours mettre les variables **entre guillemets** : `"$var"`.
- Une fonction se déclare **avant** d'être appelée.
- Lire un CSV : `while IFS=";" read a b ; do … done < fichier.csv`.
- Un script propre **vérifie ses arguments** et sort avec un code d'erreur s'il en manque.

## 🧠 Quiz express

<div id="quiz-revision-scripting-bash"></div>

<script type="application/json" id="quiz-revision-scripting-bash-data">
[
  {
    "question": "Que contient $# ?",
    "options": [
      "Le nom du script",
      "Le nombre d'arguments",
      "Le code retour",
      "Le PID"
    ],
    "correctIndex": 1,
    "explanation": "$0 est le nom du script, $? le code retour."
  },
  {
    "question": "Quel opérateur compare deux nombres pour l'égalité dans [[ ]] ?",
    "options": [
      "==",
      "-eq",
      "=",
      "-is"
    ],
    "correctIndex": 1,
    "explanation": "= et != servent aux chaînes."
  },
  {
    "question": "Que fait cmd1 && cmd2 ?",
    "options": [
      "Lance cmd2 si cmd1 échoue",
      "Lance cmd2 si cmd1 réussit",
      "Lance les deux en parallèle",
      "Redirige cmd1 vers cmd2"
    ],
    "correctIndex": 1,
    "explanation": "|| lance la seconde commande seulement en cas d'échec."
  },
  {
    "question": "Comment afficher chaque commande exécutée par un script ?",
    "options": [
      "bash -n script.sh",
      "bash -x script.sh",
      "chmod +x script.sh",
      "echo $?"
    ],
    "correctIndex": 1,
    "explanation": "bash -n vérifie seulement la syntaxe."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-scripting-bash",
      dataId: "quiz-revision-scripting-bash-data",
    });
  });
</script>
