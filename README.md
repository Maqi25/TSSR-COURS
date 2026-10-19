# TSSR · Mon espace de révision

Mes cours, TP, fiches de révision, mémos de commandes et glossaire pour la formation **TSSR** (ENI, octobre 2026 – mai 2027).

**Site en ligne : <https://maqi25.github.io/TSSR-COURS/>**

Le site est construit avec [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) et publié automatiquement sur GitHub Pages à chaque `git push` sur `main`. Le moteur (thème, vignettes, quiz, filtres de recherche) est repris du projet [Maqi-25/tssr-cours](https://github.com/Maqi25/tssr-cours).

## Structure

```
tssr-cours/
├── mkdocs.yml                   → configuration du site (thème, menu)
├── requirements.txt             → versions de MkDocs / Material
├── .github/workflows/deploy.yml → publication automatique sur GitHub Pages
└── docs/                        → tout le contenu du site
    ├── index.md                 → page d'accueil
    ├── ajouter-du-contenu.md    → mode d'emploi pour compléter le site
    ├── cours/                   → 17 cours, un dossier par module
    ├── travaux-pratiques/       → les TP, classés par cours
    ├── revisions/               → fiches de révision
    ├── commandes/               → mémos PowerShell / Bash
    ├── glossaire/               → le glossaire
    ├── stylesheets/extra.css    → styles (couleurs, cartes, quiz, filtres)
    └── javascripts/             → moteurs du quiz et des filtres
```

## Tester en local

```bash
pip install -r requirements.txt
mkdocs serve
```

Puis ouvrir <http://127.0.0.1:8000>.

## Publier

```bash
git add .
git commit -m "Mon message"
git push
```

Suivi de la publication dans l'onglet **Actions** du dépôt. Prérequis (une seule fois) : **Settings → Pages → Source : GitHub Actions**.

Le mode d'emploi détaillé pour remplir les modules, quiz, glossaire et commandes est sur la page [+ Ajouter du contenu](docs/ajouter-du-contenu.md).
