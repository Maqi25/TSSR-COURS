# Module 2 : Types de sauvegarde

*Cours : [Cours 15 - Sauvegarde et restauration](../index.md)*

## 🎯 Objectif du module

Connaître les **types de sauvegarde** (complète, différentielle, incrémentale), le **bit d'archive**, la sauvegarde **à chaud** ou **à froid**, la **rotation** des supports (GFS), la sauvegarde des **bases de données**, et les **méthodes de restauration**.

!!! abstract "En clair"
    Tout sauvegarder chaque jour prend du temps et de la place. On fait donc **une sauvegarde complète** de temps en temps, puis seulement **ce qui a changé** : soit depuis la dernière complète (**différentielle**), soit depuis la dernière sauvegarde quelle qu'elle soit (**incrémentale**). Le choix est un compromis entre **vitesse de sauvegarde** et **facilité de restauration**.

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 3 · compétence 9 : Assurer la continuité et la reprise de l'infrastructure.**

**① Complète, différentielle, incrémentale (semaine type)**

```mermaid
flowchart LR
    L["LUNDI<br/>COMPLÈTE<br/>tout"] --> D["Mar → Ven<br/>DIFFÉRENTIELLE<br/>tout ce qui a changé<br/>DEPUIS LUNDI<br/>(grossit chaque jour)"]
    L --> I["Mar → Ven<br/>INCRÉMENTALE<br/>ce qui a changé<br/>DEPUIS LA VEILLE<br/>(petite chaque jour)"]
```

**② Restaurer vendredi : quels supports ?**

```mermaid
flowchart LR
    D["Différentielle"] --> D2["La complète de lundi<br/>+ la différentielle de jeudi<br/>= 2 supports"]
    I["Incrémentale"] --> I2["La complète de lundi<br/>+ mardi + mercredi + jeudi<br/>= toutes les incrémentales"]
```

**③ La rotation Grand-père / Père / Fils**

```mermaid
flowchart LR
    F["FILS<br/>quotidiens<br/>réutilisés chaque semaine"] --> P["PÈRE<br/>hebdomadaires<br/>gardés ~5 semaines"]
    P --> G["GRAND-PÈRE<br/>mensuels<br/>gardés 12 mois"]
```

## 📖 Cours consolidé

### 1. À chaud ou à froid

| | **À chaud** | **À froid** |
|---|---|---|
| Pendant la sauvegarde | Les données restent **utilisées** | Les utilisateurs **n'y ont plus accès** |
| ➕ | **Pas d'interruption** de service | Mise en œuvre **simple**, restauration facile |
| ➖ | Mise en œuvre **complexe** (fichiers ouverts, cohérence : Windows utilise **VSS**) | **Interruption** du service |

### 2. Comment savoir ce qui a changé ?

- **Bit d'archive** (Windows) : quand un fichier est **créé ou modifié**, son attribut « archive » passe à **1**. Une sauvegarde complète ou incrémentale le remet à **0**.
- **Date** (Unix/Linux) : on compare la date de **modification** du fichier à celle de la **dernière sauvegarde**.

### 3. Les trois types

| Type | Sauvegarde… | Bit d'archive | ➕ | ➖ |
|---|---|---|---|---|
| **Complète** | **Tout**, modifié ou non | Remis à 0 | Restauration **la plus simple et rapide**, la plus fiable | **Lente**, prend **beaucoup de place** |
| **Différentielle** | Ce qui a changé **depuis la dernière complète** | **Pas** remis à 0 (cumulative) | Restauration avec **2 supports** seulement | **Grossit** chaque jour |
| **Incrémentale** | Ce qui a changé **depuis la dernière sauvegarde** (complète ou incrémentale) | Remis à 0 | **Rapide**, **peu de place**, peu de bande passante | Restauration **plus longue** : il faut **toute la chaîne** |

### 4. La rotation des supports : GFS

**Grand-père / Père / Fils** (*Grandfather-Father-Son*), la rotation la plus utilisée : supports **quotidiens** (fils, réutilisés chaque semaine), **hebdomadaires** (père, gardés environ 5 semaines), **mensuels** (grand-père, gardés 12 mois). Sur 5 jours ouvrés, il faut environ **21 bandes** pour un an.

### 5. Les bases de données

Chaque base a **sa** méthode, pour obtenir une sauvegarde **cohérente** :

| Base | Sauvegarde | Restauration |
|---|---|---|
| **SQL Server** | SQL Server Management Studio (ou un agent compatible VSS) | SQL Server Management Studio |
| **MySQL / MariaDB** | `mysqldump -u utilisateur -p base > sauvegarde.sql` | `mysql -u utilisateur -p base < sauvegarde.sql` |
| **Oracle** | **RMAN** | RMAN, Data Pump |

### 6. La restauration

« On n'a jamais de problème de **sauvegarde**, que des problèmes de **restauration** » : les sauvegardes doivent **obligatoirement être testées** régulièrement.

| Restauration | Quand |
|---|---|
| **Sur l'emplacement d'origine** | Risque d'**écraser** les données actuelles |
| **À un autre emplacement** du même système | Le plus courant : aucun écrasement, on compare avant de remplacer |
| **Sur un autre système** | Vérifier avant de remettre en production, problème de place |
| **Une ancienne version** | Grâce au **versioning** |
| **Système complet** (*bare metal recovery*) | Reconstruire un serveur sur un disque **vierge** : matériel compatible, restauration de l'**image**, puis des données modifiées depuis |

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **Complète** | Tout · restauration simple · lente et volumineuse |
| **Différentielle** | Depuis la dernière **complète** · restauration : complète + dernière diff |
| **Incrémentale** | Depuis la dernière **sauvegarde** · restauration : complète + toutes les incr |
| **Bit d'archive** | 1 = modifié · remis à 0 par complète et incrémentale |
| **À chaud / à froid** | Sans / avec interruption de service |
| **GFS** | Fils (jour), Père (semaine), Grand-père (mois) |
| **MySQL** | `mysqldump` / `mysql < fichier.sql` |
| **Bare metal** | Restaurer un système complet sur un disque vierge |

### ⚠️ Les pièges

- **Différentielle ≠ incrémentale** : « depuis la dernière **complète** » contre « depuis la dernière **sauvegarde** ».
- Avec des incrémentales, **un seul support manquant** casse la chaîne de restauration.
- Restaurer **sur l'original** sans réfléchir écrase les fichiers actuels.
- Copier les fichiers d'une base **ouverte** donne une sauvegarde **incohérente** : utiliser l'outil de la base.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Complète le dimanche, incrémentales du lundi au samedi. Le serveur tombe jeudi midi. Quels supports pour restaurer ?"
    La **complète** du dimanche, puis les incrémentales du **lundi, mardi et mercredi** (celle de jeudi n'a pas encore été faite). Les données de jeudi matin sont perdues.

??? question "2. Même cas, mais avec des différentielles. Quels supports ?"
    La **complète** du dimanche et la **différentielle de mercredi** seulement.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-15-sauvegarde-et-restauration-module-2-types-de-sauvegarde"></div>

<script type="application/json" id="quiz-cours-15-sauvegarde-et-restauration-module-2-types-de-sauvegarde-data">
[
  {
    "question": "Que sauvegarde une sauvegarde différentielle ?",
    "options": [
      "Tout",
      "Ce qui a changé depuis la dernière sauvegarde complète",
      "Ce qui a changé depuis la veille",
      "Seulement les bases de données"
    ],
    "correctIndex": 1,
    "explanation": "Elle grossit chaque jour jusqu'à la prochaine complète."
  },
  {
    "question": "Que sauvegarde une sauvegarde incrémentale ?",
    "options": [
      "Ce qui a changé depuis la dernière sauvegarde, quelle qu'elle soit",
      "Tout le disque",
      "Ce qui a changé depuis la dernière complète",
      "Les fichiers système uniquement"
    ],
    "correctIndex": 0,
    "explanation": "Elle est petite et rapide, mais la restauration demande toute la chaîne."
  },
  {
    "question": "Complète dimanche, différentielles ensuite. Panne vendredi matin. Que faut-il pour restaurer ?",
    "options": [
      "Toutes les différentielles",
      "La complète + la différentielle de jeudi",
      "Seulement la différentielle de jeudi",
      "Seulement la complète"
    ],
    "correctIndex": 1,
    "explanation": "La dernière différentielle contient tous les changements depuis la complète."
  },
  {
    "question": "Que signifie un bit d'archive à 1 sous Windows ?",
    "options": [
      "Le fichier est en lecture seule",
      "Le fichier a été créé ou modifié depuis la dernière sauvegarde qui remet le bit à 0",
      "Le fichier est chiffré",
      "Le fichier est caché"
    ],
    "correctIndex": 1,
    "explanation": "La complète et l'incrémentale remettent le bit à 0, la différentielle non."
  },
  {
    "question": "Qu'est-ce qu'une sauvegarde à froid ?",
    "options": [
      "Une sauvegarde dans un local climatisé",
      "Une sauvegarde pendant laquelle les données ne sont pas accessibles aux utilisateurs",
      "Une sauvegarde sur bande",
      "Une sauvegarde incrémentale"
    ],
    "correctIndex": 1,
    "explanation": "Simple et cohérente, mais elle interrompt le service."
  },
  {
    "question": "Dans la rotation GFS, que représente le « père » ?",
    "options": [
      "Les supports quotidiens",
      "Les supports hebdomadaires",
      "Les supports mensuels",
      "Le serveur de sauvegarde"
    ],
    "correctIndex": 1,
    "explanation": "Fils = jour, Père = semaine, Grand-père = mois."
  },
  {
    "question": "Quelle commande sauvegarde une base MySQL ?",
    "options": [
      "mysql-backup",
      "mysqldump -u user -p base > sauvegarde.sql",
      "rman backup",
      "sqlcmd /backup"
    ],
    "correctIndex": 1,
    "explanation": "On restaure ensuite avec mysql -u user -p base < sauvegarde.sql."
  },
  {
    "question": "Which backup type is fastest to restore?",
    "options": [
      "Incremental",
      "Differential",
      "Full backup",
      "They are all the same"
    ],
    "correctIndex": 2,
    "explanation": "Une seule sauvegarde complète suffit : c'est la restauration la plus simple et la plus rapide."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-15-sauvegarde-et-restauration-module-2-types-de-sauvegarde",
      dataId: "quiz-cours-15-sauvegarde-et-restauration-module-2-types-de-sauvegarde-data",
    });
  });
</script>
