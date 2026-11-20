# Module 2 : Les bases de Word

*Cours : [Bonus - Microsoft 365](../index.md)*

## 🎯 Objectif du module

Connaître l'**interface** de Word et produire un document **propre** : **styles** de titres et de paragraphes, **numérotation** multiniveau, **espacements**, **tabulations**, **sauts** et **table des matières** automatique.

!!! abstract "En clair"
    Un utilisateur te dira : « ma table des matières ne marche pas » ou « ma mise en page part dans tous les sens ». La réponse est presque toujours la même : il a mis en forme **à la main** (lignes vides, espaces, gras) au lieu d'utiliser les **styles**. Les styles, c'est ce qui rend un document **automatique**.

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 1 · compétence 2 : accompagner à l'utilisation des outils collaboratifs**, et **compétence 3 : Apporter une assistance technique** (aider un utilisateur sur la bureautique).

**① La bonne méthode pour un document**

```mermaid
flowchart LR
    A["1 · Taper le texte<br/>au kilomètre,<br/>sans mise en forme"] --> B["2 · Appliquer les STYLES<br/>Titre 1, Titre 2…<br/>et un style de paragraphe"]
    B --> C["3 · Numérotation<br/>multiniveau liée<br/>aux titres"]
    C --> D["4 · Sauts de page<br/>et de section"]
    D --> E["5 · Table des matières<br/>automatique<br/>(Références)"]
```

**② Pourquoi les styles comptent**

```mermaid
flowchart TD
    S["Style « Titre 1 »<br/>modifié UNE fois"] --> T1["tous les Titres 1<br/>du document changent"]
    S --> TM["la table des matières<br/>les retrouve (style TM 1)"]
    S --> NV["le volet de navigation<br/>affiche le plan"]
```

## 📖 Cours consolidé

### 1. L'interface

| Zone | Rôle |
|---|---|
| **Barre de titre** | Nom du fichier |
| **Barre d'accès rapide** | Commandes les plus utilisées, **personnalisable** |
| **Ruban** | Les commandes rangées par **onglets** (Accueil, Insertion, Mise en page, Références, Affichage…) |
| **Règle** | Positionner retraits et **taquets de tabulation** (*Affichage → Règle*, masquée par défaut) |
| **Barre d'état** | Nombre de pages, de mots, langue, zoom |

Au démarrage : **nouveau document vide**, **modèle** ou **document récent**.

### 2. Les bons réflexes

- Afficher les **caractères non imprimables** (*Accueil → ¶*) : on voit les espaces, tabulations, sauts.
- **Ne pas** créer d'espace avec des **paragraphes vides** (touche Entrée répétée) : on règle l'**espacement avant / après** du paragraphe.
- **Ne pas** aligner avec des espaces : on utilise les **retraits** et les **tabulations**.
- Tout le texte reçoit un **style** (pas de « Normal » partout).

### 3. Les styles et la numérotation

| Action | Comment |
|---|---|
| **Appliquer un style** | *Accueil → Styles* : Titre 1, Titre 2… |
| **Modifier un style** | Mettre en forme un titre puis clic droit sur le style → **Mettre à jour pour correspondre à la sélection**, ou clic droit → **Modifier** → *Format* (police, paragraphe, tabulations) |
| **Créer un style** | Mettre en forme un paragraphe → *Styles → Créer un style* et le nommer |
| **Enchaîner les styles** | Dans *Modifier le style* : **style du paragraphe suivant** (après un Titre 1 vient automatiquement le style du corps de texte) |
| **Numéroter les titres** | **Liste à plusieurs niveaux** → *Définir une nouvelle liste* → bouton **Plus** → **lier chaque niveau** à son style (niveau 1 ↔ Titre 1…) |

### 4. Paragraphes, espacements, tabulations

| Réglage | Options |
|---|---|
| **Alignement** | Gauche, centré, droite, **justifié** (aligné à gauche **et** à droite) |
| **Retraits** | Marge du paragraphe à gauche, à droite, première ligne |
| **Espacement** | **Avant** et **après** le paragraphe, **interligne** |
| **Taquets de tabulation** | **Gauche**, **centré**, **droit**, **décimal** (aligne sur la virgule) ; un appui sur `Tab` par taquet |

### 5. Les sauts

| Saut | Usage |
|---|---|
| **Saut de page** (`Ctrl + Entrée`) | Forcer le passage à la page suivante (page de garde, sommaire) |
| **Saut de colonne** | Passer le texte dans la colonne suivante |
| **Saut de section (page suivante)** | Nouvelle page **avec une mise en page différente** : orientation **paysage**, **en-tête / pied de page**, **numérotation** différents |
| **Saut de section (continu)** | Changer la mise en page **sur la même page** (marges, colonnes) |

### 6. La table des matières

*Références → Table des matières* : automatique, ou **personnalisée** (niveaux affichés, caractères de suite, format). Elle repose sur les styles **Titre X** ; son apparence dépend des styles **TM X**. Après des modifications : clic droit → **Mettre à jour les champs** (ou `F9`).

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **Caractères non imprimables** | Le bouton ¶ pour voir ce qui se passe |
| **Style** | Mise en forme nommée, modifiée une fois pour tout le document |
| **Liste à plusieurs niveaux** | Numérotation des titres, chaque niveau lié à un style |
| **Espacement** | Avant / après le paragraphe, pas de lignes vides |
| **Tabulations** | Gauche, centré, droit, décimal |
| **Saut de page** | `Ctrl + Entrée` |
| **Saut de section** | Changer orientation, en-tête, numérotation |
| **Table des matières** | Références → basée sur les styles Titre X ; `F9` pour mettre à jour |

### ⚠️ Les pièges

- Un titre en **gras taille 16** sans style **n'apparaît pas** dans la table des matières.
- Des **lignes vides** pour espacer : tout se décale à la moindre modification.
- Mettre une page en paysage **sans saut de section** : tout le document bascule.
- Oublier de **mettre à jour** la table des matières après des changements.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Un utilisateur se plaint : certains de ses titres n'apparaissent pas dans la table des matières. Que fais-tu ?"
    Afficher les styles : ces titres sont sans doute en **Normal** mis en gras. Leur appliquer le style **Titre 1 / Titre 2**, puis **mettre à jour** la table des matières (clic droit → Mettre à jour les champs → toute la table).

## 🧠 Quiz — entraîne-toi

<div id="quiz-bonus-microsoft-365-module-2-les-bases-de-word"></div>

<script type="application/json" id="quiz-bonus-microsoft-365-module-2-les-bases-de-word-data">
[
  {
    "question": "Pourquoi utiliser les styles dans Word ?",
    "options": [
      "Pour changer la langue",
      "Pour mettre en forme automatiquement et générer la table des matières",
      "Pour protéger le document",
      "Pour imprimer plus vite"
    ],
    "correctIndex": 1,
    "explanation": "Modifier un style met à jour tous les paragraphes qui l'utilisent."
  },
  {
    "question": "Sur quoi repose la table des matières automatique ?",
    "options": [
      "Le texte en gras",
      "Les styles de titres (Titre 1, Titre 2…)",
      "Les sauts de page",
      "Les tabulations"
    ],
    "correctIndex": 1,
    "explanation": "Son apparence dépend des styles TM 1, TM 2…"
  },
  {
    "question": "Quel saut permet de mettre une seule page en paysage ?",
    "options": [
      "Saut de ligne",
      "Saut de colonne",
      "Saut de section",
      "Saut de page simple"
    ],
    "correctIndex": 2,
    "explanation": "Chaque section peut avoir son orientation, ses en-têtes et sa numérotation."
  },
  {
    "question": "Quel raccourci insère un saut de page ?",
    "options": [
      "Ctrl + S",
      "Ctrl + Entrée",
      "Maj + Tab",
      "Alt + F4"
    ],
    "correctIndex": 1,
    "explanation": "Il se trouve aussi dans le menu Insertion."
  },
  {
    "question": "Comment espacer proprement deux paragraphes ?",
    "options": [
      "Avec plusieurs lignes vides",
      "Avec l'espacement avant/après du paragraphe",
      "Avec des espaces",
      "Avec des tabulations"
    ],
    "correctIndex": 1,
    "explanation": "Les paragraphes vides décalent tout le document."
  },
  {
    "question": "Quel taquet de tabulation aligne des nombres sur la virgule ?",
    "options": [
      "Gauche",
      "Centré",
      "Droit",
      "Décimal"
    ],
    "correctIndex": 3,
    "explanation": "Pratique pour des montants."
  },
  {
    "question": "Comment numéroter automatiquement les titres (1, 1.1, 1.1.1) ?",
    "options": [
      "À la main",
      "Avec une liste à plusieurs niveaux liée aux styles de titres",
      "Avec un tableau",
      "Avec un saut de section"
    ],
    "correctIndex": 1,
    "explanation": "Chaque niveau de la liste est lié à son style Titre X."
  },
  {
    "question": "What does a section break allow you to change?",
    "options": [
      "Only the font",
      "Page orientation, headers, footers and page numbering for part of the document",
      "The file format",
      "The spelling language only"
    ],
    "correctIndex": 1,
    "explanation": "Le saut de section découpe le document en parties à la mise en page indépendante."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-bonus-microsoft-365-module-2-les-bases-de-word",
      dataId: "quiz-bonus-microsoft-365-module-2-les-bases-de-word-data",
    });
  });
</script>
