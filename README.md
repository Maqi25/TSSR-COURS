<div align="center">

# 🎓 TSSR · Mon espace de révision

**Cours, TP, fiches, mémos et examens blancs pour le titre professionnel<br>Technicien Supérieur Systèmes et Réseaux (REAC 2026 · RNCP 42463)**

[![Site en ligne](https://img.shields.io/badge/🌐_Site_en_ligne-maqi25.github.io%2FTSSR--COURS-22d3ee?style=for-the-badge)](https://maqi25.github.io/TSSR-COURS/)

[![Publication](https://img.shields.io/github/actions/workflow/status/Maqi25/TSSR-COURS/deploy.yml?branch=main&label=publication&style=flat-square)](https://github.com/Maqi25/TSSR-COURS/actions)
![MkDocs Material](https://img.shields.io/badge/MkDocs_Material-9.7-526cfe?style=flat-square&logo=materialformkdocs&logoColor=white)
![Formation](https://img.shields.io/badge/formation-oct._2026_→_mai_2027-f472b6?style=flat-square)
![Dernier commit](https://img.shields.io/github/last-commit/Maqi25/TSSR-COURS?style=flat-square&label=mis%20à%20jour)

<img src=".github/demo/accueil.webp" alt="Page d'accueil du site : salutation, technicien animé, compte à rebours jusqu'au stage et raccourcis" width="860">

</div>

---

## ✨ Ce que contient le site

| | | |
|---|---|---|
| 📚 **17 cours · 105 modules** | Cours consolidés, schémas, résumés visuels et quiz en fin de module | du réseau à la supervision |
| 🛠️ **Travaux pratiques** | Chaque TP en 3 onglets : consigne · commandes · corrigé expliqué | rangés par cours et module |
| 🎯 **QCM examen** | Examens blancs par CCP, chronométrés aux durées officielles, suivi par compétence | questions en anglais incluses |
| 🧠 **14 fiches de révision** | L'essentiel de chaque cours sur une page | + mémos de commandes Linux / Windows |
| 🧭 **Référentiel & méthodo** | Les 3 CCP et 10 compétences reliés aux cours, planning de révision espacée | J+7 · J+30 · J+90 |
| 🔎 **Recherche & glossaire** | Recherche plein texte instantanée, glossaire filtrable | tout le site |

## 🎬 En images

<table>
<tr>
<td width="50%" valign="top">

### 🔎 Recherche instantanée
Une commande, un sigle, une notion : le résultat s'affiche pendant la frappe.

<img src=".github/demo/recherche.webp" alt="Recherche de la commande useradd" width="100%">

</td>
<td width="50%" valign="top">

### 🛠️ Un TP en 3 onglets
Ce qui est demandé, les commandes à taper, puis le corrigé expliqué.

<img src=".github/demo/tp.webp" alt="Navigation dans les onglets d'un TP" width="100%">

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎯 Examen blanc chronométré
Profil de suivi, épreuve par CCP, correction détaillée et progression par compétence.

<img src=".github/demo/qcm.webp" alt="Passage d'un QCM examen et correction" width="100%">

</td>
<td width="50%" valign="top">

### 🧮 Calculatrice IPv4
Réseau, broadcast, plage d'hôtes et binaire recalculés à chaque frappe.

<img src=".github/demo/calculatrice-ip.webp" alt="Calculatrice IPv4 interactive" width="100%">

</td>
</tr>
<tr>
<td colspan="2" align="center">

### 🎨 À tes couleurs
6 couleurs de thème et un mode clair / sombre, mémorisés dans le navigateur.

<img src=".github/demo/themes.webp" alt="Changement de couleur du site et mode clair" width="70%">

</td>
</tr>
</table>

## 🗺️ Le parcours

```mermaid
flowchart LR
    A["📖 Cours<br>du module"] --> B["🧠 Quiz<br>de fin de module"]
    B --> C["🛠️ TP<br>refait en VM"]
    C --> D["📝 Fiche<br>de révision"]
    D --> E["🎯 QCM examen<br>par CCP"]
    E -->|erreurs| A
```

## 🧱 Structure du dépôt

```text
tssr-cours/
├── mkdocs.yml                    → configuration du site (thème, menu, scripts)
├── requirements.txt              → versions de MkDocs / Material
├── .github/
│   ├── workflows/deploy.yml      → publication automatique sur GitHub Pages
│   └── demo/                     → les animations de ce README
└── docs/
    ├── index.md                  → page d'accueil
    ├── programme/ · referentiel/ · methodologie/
    ├── cours/                    → 17 cours + bonus Microsoft 365, un dossier par module
    ├── travaux-pratiques/        → les TP, classés par cours
    ├── qcm-examen/               → examens blancs et tableau de bord des profils
    ├── revisions/                → fiches de révision et mémos de commandes
    ├── commandes/ · memo/ · glossaire/
    ├── stylesheets/              → thème, animations, accueil
    └── javascripts/              → quiz, QCM, filtres, calculatrice IP, thèmes…
```

## 🚀 Lancer le site en local

```bash
pip install -r requirements.txt
python -m mkdocs serve
```

Puis ouvrir <http://127.0.0.1:8000/TSSR-COURS/>.

## 📤 Publier

Chaque `git push` sur `main` reconstruit et publie le site (onglet **Actions**).
Prérequis, une seule fois : **Settings → Pages → Source : GitHub Actions**.

Le mode d'emploi pour ajouter modules, quiz, TP, glossaire et commandes est sur la page [+ Ajouter du contenu](docs/ajouter-du-contenu.md).

## 🙏 Crédits

- Site construit avec [MkDocs Material](https://squidfunk.github.io/mkdocs-material/). Le moteur (thème, vignettes, quiz, filtres de recherche) est repris du projet [Maqi-25/tssr-cours](https://github.com/Maqi25/tssr-cours).
- Icônes des cours et des modules : [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) de Microsoft (licence MIT, voir `docs/assets/icones/LICENCE.txt`).
- Les TP s'appuient sur les supports de la formation ; leurs énoncés et corrigés originaux restent la propriété de leurs auteurs.
