# Fiche · Utilisation d'une distribution GNU/Linux

*Cours lié : [Cours 3 - Utilisateur d'une distribution GNU/Linux](../cours/cours-03-utilisateur-d-une-distribution-gnu-linux/index.md) · 09/11 → 13/11/2026 · 28 h*

## 📝 L'essentiel

| Commande | À retenir |
| --- | --- |
| **pwd / ls / cd** | où suis-je / lister / se déplacer |
| **man cmd** | manuel |
| **grep -i / -r / -n** | insensible casse / récursif / n° de ligne |
| **find / -name** | chercher un fichier |
| **vim** | `i`, `Échap`, `:wq`, `:q!` |
| **tar -czvf** | créer une archive compressée |

## ✅ Points clés

- Tout est fichier ; la racine est `/`.
- stdout = 1, stderr = 2 : `2>` redirige les erreurs.
- `grep` filtre du texte, `find` cherche des fichiers.
- `>` écrase, `>>` ajoute.
- `tar -czvf` crée, `tar -xzvf` extrait.

## 🧠 Quiz express

<div id="quiz-revision-utilisation-gnu-linux"></div>

<script type="application/json" id="quiz-revision-utilisation-gnu-linux-data">
[
  {
    "question": "Quelle commande ajoute une sortie à la fin d'un fichier ?",
    "options": ["cmd > f", "cmd >> f", "cmd | f", "cmd 2> f"],
    "correctIndex": 1,
    "explanation": ">> ajoute, > écrase."
  },
  {
    "question": "Où se trouvent les fichiers de configuration ?",
    "options": ["/var", "/etc", "/tmp", "/usr"],
    "correctIndex": 1,
    "explanation": "/etc contient la configuration du système."
  },
  {
    "question": "Comment quitter vim sans sauvegarder ?",
    "options": [":wq", ":q!", ":x", "ZZ"],
    "correctIndex": 1,
    "explanation": ":q! force la sortie sans écrire."
  },
  {
    "question": "Quelle commande extrait une archive .tar.gz ?",
    "options": ["tar -czvf", "tar -xzvf", "gzip -c", "zip -x"],
    "correctIndex": 1,
    "explanation": "x = extract, c = create."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-utilisation-gnu-linux",
      dataId: "quiz-revision-utilisation-gnu-linux-data",
    });
  });
</script>
