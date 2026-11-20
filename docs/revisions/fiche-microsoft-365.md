# Fiche · Microsoft 365

*Cours lié : [Bonus - Microsoft 365](../cours/bonus-microsoft-365/index.md)*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Bonus<br/>Microsoft 365")) --> T["Tenant<br/>SaaS, licences,<br/>domaine"]
    C --> W["Word<br/>styles, sauts,<br/>table des matières"]
    C --> X["Excel<br/>fonctions,<br/>références absolues"]
    C --> O["Outlook<br/>SMTP/IMAP,<br/>Autodiscover, dépannage"]
    C --> TE["Teams · SharePoint ·<br/>OneDrive"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **SaaS** | Logiciel hébergé par le fournisseur, payé par abonnement |
| **Tenant** | `nom.onmicrosoft.com`, non modifiable ; administrateur global |
| **Licence** | Attribuée **par utilisateur** |
| **Domaine personnalisé** | Vérifié par un enregistrement **TXT**, puis MX, CNAME autodiscover |
| **Word** | Styles Titre X → table des matières ; saut de section pour changer la mise en page |
| **Excel** | `=SI()`, `=RECHERCHEV(…;FAUX)`, `$A$1` avec `F4` |
| **SMTP** | Envoi : 25 entre serveurs, 587 soumission |
| **IMAP / POP** | 993 sur le serveur / 995 téléchargé |
| **Autodiscover** | Outlook se configure avec la seule adresse mail |
| **.ost / .pst** | Cache Exchange reconstructible / données locales à sauvegarder |
| **Dépanner Outlook** | Webmail → `outlook.exe /safe` → SCANPST → nouveau profil |
| **OneDrive / SharePoint** | Mes fichiers / les fichiers de l'équipe |
| **Équipe Teams** | Crée un groupe M365, un site SharePoint, une boîte partagée, un OneNote |

## ✅ Points clés

- Sans **licence**, un utilisateur n'a ni boîte mail ni applications.
- Si le **webmail** fonctionne, le problème est sur le **poste**, pas sur le compte.
- Le fichier **.pst** contient les seules copies des mails : on ne le supprime pas.
- Les fichiers d'une équipe Teams sont dans **SharePoint**, un dossier par canal.
- **Historique des versions** et **corbeille** pour récupérer un fichier écrasé ou supprimé.

## 🧠 Quiz express

<div id="quiz-revision-microsoft-365"></div>

<script type="application/json" id="quiz-revision-microsoft-365-data">
[
  {
    "question": "Le webmail d'un utilisateur fonctionne mais pas son Outlook. Où chercher ?",
    "options": [
      "Dans la licence",
      "Sur le poste : compléments, fichier de données, profil",
      "Dans le DNS public",
      "Sur le serveur Exchange"
    ],
    "correctIndex": 1,
    "explanation": "Le compte et le serveur fonctionnent puisque le webmail marche."
  },
  {
    "question": "Où sont stockés les fichiers d'un canal Teams ?",
    "options": [
      "Dans OneDrive",
      "Dans la bibliothèque SharePoint de l'équipe",
      "Sur le PC du propriétaire",
      "Dans Exchange"
    ],
    "correctIndex": 1,
    "explanation": "Un dossier par canal."
  },
  {
    "question": "Que signifie $A$1 dans une formule Excel ?",
    "options": [
      "Un montant",
      "Une référence absolue",
      "Une cellule masquée",
      "Une erreur"
    ],
    "correctIndex": 1,
    "explanation": "Elle ne change pas quand on recopie la formule."
  },
  {
    "question": "Comment prouve-t-on à Microsoft qu'on possède un domaine ?",
    "options": [
      "Par mail",
      "Avec un enregistrement TXT dans le DNS",
      "En appelant le support",
      "En changeant le tenant"
    ],
    "correctIndex": 1,
    "explanation": "Microsoft fournit la valeur à créer dans la zone DNS."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-microsoft-365",
      dataId: "quiz-revision-microsoft-365-data",
    });
  });
</script>
