# Module 1 : Introduction à Unix/Linux

*Cours : [Cours 3 - Utilisateur d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

À la fin de ce module, tu sais :

- raconter en quelques dates **d'où vient Linux** (Unix, GNU, Linus Torvalds) ;
- expliquer pourquoi on dit **GNU/Linux** ;
- dire ce qu'est une **distribution** et citer les principales (Debian, Ubuntu, Red Hat…) ;
- expliquer ce qu'est un **logiciel libre** et les grandes **licences**.

!!! abstract "En clair : c'est quoi Linux ?"
    **Linux** est un système d'exploitation, comme Windows, mais **gratuit**, **libre** (tout le monde peut lire et modifier son code) et **très léger**.

    Tu l'utilises sans le savoir : la plupart des **sites web**, des **serveurs**, les **box Internet**, les **téléphones Android** et beaucoup d'**objets connectés** tournent sous Linux.

    En tant que technicien, tu l'utiliseras surtout **au clavier, en ligne de commande**, sur des **serveurs**.

## 🖼️ Résumé visuel

**① De Unix à Linux en 6 dates**

```mermaid
flowchart LR
    A["1969-1973<br/>🧪 <b>Unix</b><br/>créé aux Bell Labs,<br/>réécrit en langage C"] --> B["1983<br/>🗽 <b>GNU</b><br/>Stallman veut un OS<br/>100 % libre…<br/>mais sans noyau"]
    B --> C["1991<br/>🐧 <b>Linux</b><br/>Linus Torvalds écrit<br/>un noyau libre"]
    C --> D["GNU + Linux<br/>= un OS complet<br/>et libre"]
    D --> E["1993<br/>📦 <b>Debian</b><br/>et les premières<br/>distributions"]
    E --> F["2004<br/>🟠 <b>Ubuntu</b><br/>Linux pour<br/>le grand public"]
```

**② Une distribution = le noyau + les outils + un emballage**

<div class="tssr-layers">
  <div class="tssr-layer" style="--layer-color:#f59e0b;">
    <span class="tssr-layer-num">📦</span>
    <span class="tssr-layer-name">La distribution</span>
    <span class="tssr-layer-desc">Debian, Ubuntu, Red Hat… : choisit, assemble, teste et met à jour le tout</span>
    <span class="tssr-layer-tag">Le paquet cadeau</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">🖥️</span>
    <span class="tssr-layer-name">Logiciels et bureau (facultatif)</span>
    <span class="tssr-layer-desc">Apache, LibreOffice, bureau GNOME ou KDE…</span>
    <span class="tssr-layer-tag">Applications</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#0891b2;">
    <span class="tssr-layer-num">🗽</span>
    <span class="tssr-layer-name">Outils GNU</span>
    <span class="tssr-layer-desc">Le shell Bash, les commandes ls, cp, grep…</span>
    <span class="tssr-layer-tag">GNU</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#10b981;">
    <span class="tssr-layer-num">🐧</span>
    <span class="tssr-layer-name">Noyau Linux</span>
    <span class="tssr-layer-desc">Le cœur, qui pilote le matériel</span>
    <span class="tssr-layer-tag">Linux</span>
  </div>
</div>

## 📖 Cours consolidé

### 1. D'Unix à GNU/Linux

| Année | Ce qui se passe |
|---|---|
| **1969** | Aux **Bell Labs**, **Ken Thompson** et **Dennis Ritchie** créent **Unix** |
| **1973** | Unix est **réécrit en C** (langage inventé par Ritchie) → **portable** sur d'autres machines |
| **1977** | **BSD** à Berkeley (toujours vivant : FreeBSD, une partie de macOS), qui apporte l'éditeur **vi** |
| **1983** | **Richard Stallman** lance **GNU** : un système **100 % libre** (puis la **FSF** en 1985) |
| **1991** | **Linus Torvalds** écrit un **noyau** libre : **Linux** |

- Linux hérite d'Unix : **tout est fichier**, de petites commandes qu'on **enchaîne**, le manuel **`man`**.
- **« GNU/Linux »** : GNU avait **tous les outils sauf le noyau**, Linus avait **le noyau** → ensemble, un système complet. Strictement, **Linux = le noyau**.
- Premières distributions encore vivantes : **Slackware**, **Debian** (1993), **Red Hat**, **SuSE** (1994) ; puis **Ubuntu** (2004), grand public.

---

### 2. Linux aujourd'hui

| Domaine | Exemples |
|---|---|
| **Serveurs web** et **bases de données** | Apache, Nginx · MySQL, MariaDB, PostgreSQL |
| **Cloud** | La plupart des VM chez Amazon, Google, Azure |
| **Smartphones**, objets connectés | **Android** (noyau Linux), box, TV, Raspberry Pi |
| **Superordinateurs** | 100 % des 500 plus puissants |

Un technicien l'utilise surtout **en ligne de commande** (**CLI**), souvent **à distance**. Les bureaux graphiques (**GNOME**, **KDE**, **XFCE**) servent aux postes de travail et aux vieux PC.

| Distribution | À savoir |
|---|---|
| **Debian** | Libre, gratuite, **stable**. ✅ **Celle de la formation** |
| **Ubuntu** | Basée sur Debian, très répandue. Prendre une **LTS** |
| **Red Hat (RHEL)** | Leader en entreprise, **payante** (support) |
| **Rocky / AlmaLinux** | Copies **gratuites** de Red Hat (remplacent CentOS, arrêté en 2021) |
| **SUSE / openSUSE** | Payante / gratuite |
| **Linux Mint**, Zorin OS | Bureau, faciles pour qui vient de Windows |
| **Kali Linux** | **Tests d'intrusion** ⚠️ jamais sur un réseau d'entreprise sans autorisation |
| **SystemRescue** | Clé de secours (réparer, récupérer des données) |

- ⚠️ **Libre ≠ gratuit** : Red Hat est libre, mais son support est payant.
- 📌 **Durée de support** : Ubuntu **LTS** = **5 ans**, version intermédiaire = **9 mois**. En entreprise : **toujours une LTS**.
- **Debian** : noms tirés de **Toy Story** — 10 Buster (supports de cours) · 12 Bookworm · **13 Trixie** (**stable actuelle**, août 2025). Son **contrat social** : rester **totalement libre**, priorité aux utilisateurs.

---

### 3. Les licences libres

**« *Free as in free speech, not as in free beer* »** : libre comme **liberté**, pas comme **gratuit**. Un logiciel libre donne le droit de l'**utiliser, étudier, modifier, partager**.

| Licence | Règle |
|---|---|
| **GNU GPL** | Les **4 libertés** + **copyleft** : une version modifiée et redistribuée **doit rester libre** |
| **BSD** | Presque **sans condition**, **sans copyleft** : on peut en faire un logiciel **fermé** (macOS) |
| **Apache** | Libre, en gardant les mentions de copyright |
| **CeCILL** | Licence libre **française** (CEA, CNRS, INRIA) |
| **Creative Commons** | Pour les **œuvres** (images, textes), pas le code |

## 📝 Fiche de révision

### 🧠 L'essentiel en un tableau

| Notion | À retenir |
|---|---|
| **Unix** | 1969, Bell Labs, réécrit en C en 1973 |
| **BSD** | Branche d'Unix née à Berkeley (1977) |
| **GNU** | Projet d'OS libre de Stallman (1983) |
| **Linux** | Noyau de Linus Torvalds (1991) |
| **GNU/Linux** | Outils GNU + noyau Linux |
| **Distribution** | Le système complet, emballé et maintenu |
| **Debian** | Libre, stable ; noms tirés de Toy Story |
| **LTS** | Version à support long (Ubuntu : 5 ans) |
| **CLI** | La ligne de commande |
| **GPL / copyleft** | Les modifications redistribuées doivent rester libres |

### 🗓️ Les dates à connaître

**1969** Unix · **1973** Unix en C · **1983** GNU · **1991** Linux · **1993** Debian · **2004** Ubuntu

### ⚠️ Les pièges

- **Linux** = seulement le **noyau** ; le système complet est **GNU/Linux**.
- **Libre ≠ gratuit** (Red Hat).
- **CentOS** n'est plus une copie de Red Hat : on utilise **Rocky Linux** ou **AlmaLinux**.
- Ne pas confondre **GPL** (copyleft obligatoire) et **BSD** (pas de copyleft).

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Explique en une phrase pourquoi on dit « GNU/Linux »."
    Parce que le système complet associe les **outils du projet GNU** (shell, commandes) et le **noyau Linux** de Linus Torvalds. Linux seul n'est que le noyau.

??? question "2. Ton entreprise veut installer un serveur Ubuntu pour 5 ans. Quelle version choisir ?"
    Une version **LTS** (*Long Term Support*), suivie **5 ans**. Une version intermédiaire n'est suivie que 9 mois.

??? question "3. Une entreprise modifie un logiciel sous licence GPL et veut vendre sa version en gardant le code secret. Est-ce permis ?"
    **Non.** La GPL a un **copyleft** : une version modifiée et **redistribuée** doit rester sous GPL, avec son code source. (Avec une licence **BSD**, ce serait permis.)

??? question "4. Cite 4 endroits où l'on trouve Linux en dehors des PC."
    Les **serveurs web**, le **cloud**, les **smartphones Android**, les **box Internet**, les **TV et objets connectés**, les **superordinateurs**…

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux"></div>

<script type="application/json" id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux-data">
[
  {
    "question": "De quel projet les membres des Bell Labs se retirent-ils avant de lancer Unics, qui deviendra Unix ?",
    "options": [
      "Multics",
      "Minix",
      "GNU",
      "BSD"
    ],
    "correctIndex": 0,
    "explanation": "En 1969/1970, les membres des Bell Labs se retirent du projet Multics, dont les performances n'étaient pas à la hauteur des attentes, et poursuivent leurs recherches avec un nouveau projet nommé Unics, en clin d'œil à Multics."
  },
  {
    "question": "Quels sont les trois chercheurs principalement associés à la création d'Unix ?",
    "options": [
      "Linus Torvalds, Richard Stallman et Mark Shuttleworth",
      "Ken Thompson, Dennis Ritchie et Brian Kernighan",
      "Bill Joy, Andrew Tanenbaum et Bill Gates",
      "Steve Jobs, Steve Wozniak et Dennis Ritchie"
    ],
    "correctIndex": 1,
    "explanation": "L'équipe menée par Ken Thompson, Dennis Ritchie et Brian Kernighan est à l'origine du projet Unics, qui deviendra Unix à partir de 1970."
  },
  {
    "question": "Dans quel langage le noyau Unix a-t-il été réécrit en 1973, le rendant plus portable ?",
    "options": [
      "Le langage B",
      "Le langage Pascal",
      "Le langage C",
      "Le langage assembleur uniquement"
    ],
    "correctIndex": 2,
    "explanation": "Dennis Ritchie crée le langage C en 1972 comme amélioration du langage B, et c'est dans ce langage C que Thompson, aidé de Ritchie, réécrit le noyau Unix en 1973, le rendant beaucoup plus portable."
  },
  {
    "question": "Pourquoi la disponibilité des sources d'Unix V6 (1976) auprès des universités a-t-elle été importante ?",
    "options": [
      "Parce qu'elle a permis de réduire drastiquement le prix du matériel informatique",
      "Parce qu'elle a rendu Unix immédiatement gratuit pour toutes les entreprises",
      "Parce qu'elle a mis fin au développement du langage C",
      "Parce que les sources permettent de comprendre le fonctionnement du système et éventuellement de l'améliorer ou l'adapter"
    ],
    "correctIndex": 3,
    "explanation": "La présence des sources est importante car ce sont les éléments de programmation qui permettent à chacun de comprendre comment le système fonctionne, de l'améliorer et de l'adapter à ses propres besoins."
  },
  {
    "question": "Quelle branche des systèmes Unix, toujours active aujourd'hui, est née des travaux de Bill Joy à l'université de Berkeley en 1977 ?",
    "options": [
      "BSD",
      "GNU",
      "Minix",
      "Slackware"
    ],
    "correctIndex": 0,
    "explanation": "En 1977, Bill Joy, étudiant à Berkeley, travaille à la compilation de BSD sur la base d'Unix V6, créant ainsi une nouvelle branche des systèmes Unix, toujours active aujourd'hui."
  },
  {
    "question": "Quel est le but du projet GNU lancé par Richard Stallman en 1983 ?",
    "options": [
      "Commercialiser une version propriétaire d'Unix pour les entreprises",
      "Créer un OS entièrement composé de logiciels libres, avec du code source accessible et modifiable",
      "Développer un nouveau langage de programmation concurrent du C",
      "Créer une mascotte reconnaissable pour Unix"
    ],
    "correctIndex": 1,
    "explanation": "Le projet GNU, lancé par Richard Stallman en réponse à la fermeture des sources par de nombreux industriels, vise à créer un OS entièrement composé de logiciels libres, dont le code source est accessible et modifiable à l'envie."
  },
  {
    "question": "Qu'est-ce qui manquait au projet GNU jusqu'à ce qu'il trouve une solution grâce au projet de Linus Torvalds ?",
    "options": [
      "Un environnement graphique",
      "Un éditeur de texte",
      "Un noyau",
      "Une licence libre"
    ],
    "correctIndex": 2,
    "explanation": "Le projet GNU s'est développé sans noyau jusque dans les années 90, noyau qu'il trouvera finalement grâce au projet Linux initié par Linus Torvalds."
  },
  {
    "question": "En quelle année Linus Torvalds annonce-t-il travailler sur un OS libre pour architecture i386, point de départ du projet Linux ?",
    "options": [
      "1983",
      "1987",
      "1996",
      "1991"
    ],
    "correctIndex": 3,
    "explanation": "Le 25 août 1991, Linus Torvalds, alors étudiant à Helsinki, annonce aux utilisateurs de Minix qu'il travaille sur un OS libre pour architecture i386, dans un but initialement présenté comme un simple hobby."
  },
  {
    "question": "Comment appelle-t-on les différentes versions du système complet GNU/Linux, comme Debian, Ubuntu ou Red Hat ?",
    "options": [
      "Des distributions",
      "Des noyaux",
      "Des licences",
      "Des environnements graphiques"
    ],
    "correctIndex": 0,
    "explanation": "On appelle \"distribution\" les différentes versions du système complet GNU/Linux, comme SLS (la première, en 1992), Slackware, Debian, Red Hat ou SuSE."
  },
  {
    "question": "Parmi les distributions suivantes, lesquelles sont citées comme étant apparues entre 1992 et 1994 et toujours présentes aujourd'hui ?",
    "options": [
      "Ubuntu, Linux Mint, Kali Linux et ZorinOS",
      "Slackware, Debian, SuSE et Red Hat",
      "CentOS, Raspbian, PrimTux et 3CX",
      "Gnome, KDE, XFCE et LXDE"
    ],
    "correctIndex": 1,
    "explanation": "Le module cite Slackware (1993), Debian (1993), puis Red Hat et SuSE (1994) comme des distributions majeures, toutes les quatre encore présentes trois décennies plus tard."
  },
  {
    "question": "Quelle interface est principalement utilisée par les professionnels pour interagir avec Linux au quotidien ?",
    "options": [
      "Une interface graphique de type bureau obligatoirement",
      "Une interface vocale",
      "Un navigateur web uniquement",
      "La ligne de commande (CLI, Command Line Interface)"
    ],
    "correctIndex": 3,
    "explanation": "En tant que professionnel, Linux est principalement utilisé à travers la ligne de commande (CLI), qu'il s'agisse d'une connexion directe à une machine ou via un logiciel permettant de s'y connecter."
  },
  {
    "question": "Pourquoi les interfaces graphiques (GUI) restent-elles plutôt anecdotiques dans le monde de l'entreprise sous Linux, malgré leur existence ?",
    "options": [
      "Parce que la ligne de commande reste l'interface principale en entreprise, les GUI étant surtout utiles pour redonner vie à de vieux ordinateurs",
      "Parce qu'elles n'existent techniquement pas sous Linux",
      "Parce qu'elles sont payantes contrairement au CLI",
      "Parce qu'elles ne fonctionnent que sur Windows"
    ],
    "correctIndex": 0,
    "explanation": "Les GUI existent bel et bien sous Linux (Gnome, KDE, XFCE, LXDE), mais restent anecdotiques en entreprise, où le CLI domine ; elles sont en revanche intéressantes pour redonner vie à des ordinateurs vieillissants grâce à leur faible consommation de ressources."
  },
  {
    "question": "Qu'est-ce qui distingue la distribution Red Hat (RHEL) pour une utilisation en production en entreprise ?",
    "options": [
      "Elle est entièrement libre et gratuite, sans aucune licence",
      "Elle est soumise à licence, et nécessite un abonnement donnant accès à un support privilégié",
      "Elle ne peut fonctionner que sur Raspberry Pi",
      "Elle est spécialisée exclusivement dans la sécurité informatique"
    ],
    "correctIndex": 1,
    "explanation": "RHEL (Red Hat Enterprise Linux) est soumise à licence : les entreprises souhaitant l'utiliser en production doivent souscrire un abonnement donnant accès à un support privilégié de la part de Red Hat."
  },
  {
    "question": "Quelle évolution a connu CentOS en 2021, modifiant son positionnement pour les entreprises ?",
    "options": [
      "CentOS est devenue totalement gratuite, sans aucune restriction",
      "CentOS a été rachetée par Debian",
      "CentOS a évolué vers CentOS Stream, moins adaptée à une utilisation classique en entreprise",
      "CentOS a été renommée en Ubuntu Server"
    ],
    "correctIndex": 2,
    "explanation": "Jusqu'en 2021, CentOS était une version downstream de Red Hat, compatible mais sans support officiel ; en 2021, elle a évolué vers CentOS Stream, un positionnement moins adapté à une utilisation classique en entreprise."
  },
  {
    "question": "Que signifie le sigle LTS pour une distribution comme Ubuntu, et pourquoi est-il recommandé en entreprise ?",
    "options": [
      "Light Terminal System, une version allégée sans interface graphique",
      "Linux Testing Server, une version réservée aux environnements de test",
      "Licensed Total Software, une version nécessitant obligatoirement une licence payante",
      "Long Term Support, pour bénéficier de mises à jour et d'un support généralement pendant 5 ans"
    ],
    "correctIndex": 3,
    "explanation": "LTS signifie Long Term Support : une version LTS d'Ubuntu garantit généralement 5 ans de mises à jour et de support, contrairement aux versions intermédiaires qui ne garantissent qu'un an."
  },
  {
    "question": "Sur quel noyau le système d'exploitation Android, utilisé sur de nombreux smartphones, est-il basé ?",
    "options": [
      "Un noyau Linux",
      "Un noyau Windows",
      "Un noyau BSD",
      "Un noyau propriétaire sans lien avec Unix ou Linux"
    ],
    "correctIndex": 0,
    "explanation": "Le module précise qu'Android, système présent sur de nombreux smartphones, est basé sur un noyau Linux, illustrant la présence majoritaire de Linux dans le monde aujourd'hui."
  },
  {
    "question": "Pourquoi la distribution Kali Linux doit-elle être manipulée avec précaution en environnement professionnel ?",
    "options": [
      "Parce qu'elle est extrêmement instable et plante régulièrement",
      "Parce que certains des outils orientés sécurité qu'elle inclut pourraient être perçus comme une tentative de piratage interne",
      "Parce qu'elle nécessite obligatoirement une licence payante",
      "Parce qu'elle n'est compatible qu'avec le matériel Raspberry Pi"
    ],
    "correctIndex": 1,
    "explanation": "Kali Linux, distribution orientée sécurité très connue des spécialistes, inclut de nombreux outils qui pourraient, si utilisés à la légère en entreprise, être considérés comme une tentative de piratage interne."
  },
  {
    "question": "Quelles sont les quatre libertés fondamentales définies par la licence GNU General Public License (GPL) ?",
    "options": [
      "Vendre le logiciel sans restriction, le modifier uniquement en interne, le garder secret, et interdire sa redistribution",
      "Utiliser le logiciel uniquement à des fins non commerciales, ne jamais le modifier, et le redistribuer uniquement sous forme compilée",
      "Exécuter le logiciel pour n'importe quel usage, l'étudier et l'adapter via le code source, redistribuer des copies, et faire bénéficier la communauté des versions modifiées",
      "Étudier uniquement le code source sans droit de modification ni de redistribution"
    ],
    "correctIndex": 2,
    "explanation": "La licence GNU GPL définit quatre libertés : exécuter le logiciel pour n'importe quel usage, l'étudier et l'adapter grâce à l'accès au code source, redistribuer des copies, et faire bénéficier la communauté des versions modifiées."
  },
  {
    "question": "Quelle licence libre, sans copyleft et autorisant une réutilisation sans restriction, a notamment permis à Steve Jobs de créer Mac OS X ?",
    "options": [
      "La licence GNU GPL",
      "La licence Apache",
      "La licence CeCILL",
      "La licence BSD"
    ],
    "correctIndex": 3,
    "explanation": "La licence BSD, qui autorise une réutilisation sans restriction et ne comporte pas de copyleft, est la licence grâce à laquelle Steve Jobs a pu s'appuyer sur du code existant pour créer Mac OS X."
  },
  {
    "question": "Pourquoi dit-on « GNU/Linux » plutôt que « Linux » ?",
    "options": [
      "Parce que GNU est le nom de l'entreprise qui vend Linux",
      "Parce que le système associe les outils du projet GNU et le noyau Linux",
      "Parce que Linux ne fonctionne que sur les serveurs GNU",
      "C'est une marque déposée par Red Hat"
    ],
    "correctIndex": 1,
    "explanation": "Le projet GNU avait les outils (shell, commandes, compilateur) mais pas de noyau ; Linus Torvalds a apporté le noyau Linux. Ensemble, ils forment un système complet."
  },
  {
    "question": "Quelles distributions remplacent aujourd'hui CentOS comme copies gratuites de Red Hat ?",
    "options": [
      "Ubuntu et Mint",
      "Rocky Linux et AlmaLinux",
      "Kali et Parrot",
      "Debian et Slackware"
    ],
    "correctIndex": 1,
    "explanation": "Depuis que CentOS est devenu CentOS Stream (2021), Rocky Linux et AlmaLinux sont les copies gratuites et compatibles de Red Hat Enterprise Linux."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux",
      dataId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux-data",
    });
  });
</script>
