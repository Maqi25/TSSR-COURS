# Fiche · PowerShell

*Cours lié : [Cours 11 - Initiation à PowerShell](../cours/cours-11-initiation-a-powershell/index.md) · 08/02 → 12/02/2027 · 35 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 11<br/>PowerShell")) --> D["Découvrir<br/>Verbe-Nom, Get-Help,<br/>Get-Command"]
    C --> O["Objets et pipeline<br/>Get-Member, Where,<br/>Select, Sort"]
    C --> X["Exporter<br/>Format, Export-Csv,<br/>propriétés calculées"]
    C --> S["Scripts<br/>param, variables,<br/>if, foreach"]
    C --> E["Erreurs et distance<br/>try/catch,<br/>Invoke-Command"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **Versions** | 5.1 `powershell.exe` (Windows) / 7 `pwsh` (multiplateforme) |
| **Cmdlet** | Verbe-Nom au singulier : `Get-Service` |
| **Trouver / aide** | `Get-Command *mot*` · `Get-Help cmd -Examples` |
| **Objet** | Propriétés + méthodes : `cmd` **\|** `Get-Member` |
| **Filtrer / choisir** | `Where-Object { $_.Status -eq 'Running' }` · `Select-Object Name, Id` |
| **Trier / compter** | `Sort-Object -Descending` · `Measure-Object -Sum` |
| **Exporter** | `Export-Csv -Delimiter ";" -NoTypeInformation` · `Import-Csv` |
| **Propriété calculée** | `@{ n='Mo'; e={ $_.Length / 1MB } }` |
| **Variables** | `$nom = valeur` · `Read-Host` · `$env:COMPUTERNAME` |
| **Tableau** | `$t = "a","b"` · `$t += "c"` · `$t[0]` |
| **Contrôle** | `if () {} elseif () {} else {}` · `foreach ($x in $liste) {}` · `switch` |
| **Paramètres** | `param([Parameter(Mandatory=$true)][string]$Nom)` |
| **Erreurs** | `try {} catch { $_.Exception.Message } finally {}` · `-ErrorAction Stop` |
| **À distance** | `Enter-PSSession` · `Invoke-Command -ComputerName A,B -ScriptBlock {}` |

## ✅ Points clés

- PowerShell manipule des **objets**, pas du texte : on filtre sur des **propriétés**.
- **Filtrer tôt** (`Where-Object`), **formater à la fin** (`Format-Table` ne s'exporte pas).
- Scripts bloqués : `Set-ExecutionPolicy RemoteSigned` (en administrateur).
- Pour qu'une erreur soit attrapée par `catch`, elle doit être **bloquante** : `-ErrorAction Stop`.
- À distance, une variable locale s'utilise avec `$Using:variable`.

## 🧠 Quiz express

<div id="quiz-revision-powershell"></div>

<script type="application/json" id="quiz-revision-powershell-data">
[
  {
    "question": "Quelle cmdlet affiche les propriétés et méthodes d'un objet ?",
    "options": [
      "Get-Help",
      "Get-Member",
      "Get-Command",
      "Select-Object"
    ],
    "correctIndex": 1,
    "explanation": "On lui passe l'objet par le pipeline."
  },
  {
    "question": "Que représente $_ dans un Where-Object ?",
    "options": [
      "Le dernier résultat",
      "L'objet en cours dans le pipeline",
      "Une variable d'environnement",
      "Une erreur"
    ],
    "correctIndex": 1,
    "explanation": "Synonyme : $PSItem."
  },
  {
    "question": "Pourquoi ajouter -ErrorAction Stop dans un bloc try ?",
    "options": [
      "Pour accélérer",
      "Pour rendre l'erreur bloquante et qu'elle soit attrapée par catch",
      "Pour masquer l'erreur",
      "Pour quitter PowerShell"
    ],
    "correctIndex": 1,
    "explanation": "Les erreurs non bloquantes ne déclenchent pas le catch."
  },
  {
    "question": "Quelle commande exécute un bloc de code sur plusieurs ordinateurs ?",
    "options": [
      "Enter-PSSession",
      "Invoke-Command",
      "Start-Process",
      "Get-Credential"
    ],
    "correctIndex": 1,
    "explanation": "Enter-PSSession ouvre une session interactive sur une seule machine."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-powershell",
      dataId: "quiz-revision-powershell-data",
    });
  });
</script>
