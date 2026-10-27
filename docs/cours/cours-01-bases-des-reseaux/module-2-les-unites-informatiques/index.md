# Module 2 : Les unités informatiques

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Savoir passer d'une base à l'autre (binaire, octal, décimal, hexadécimal) et ne plus confondre bits, octets, Go et Gio.

!!! abstract "En clair"
    Un ordinateur ne connaît que deux états : courant ou pas de courant, **1** ou **0**. Tout ce qu'il manipule (une adresse IP, une photo, un mot de passe) est une suite de 0 et de 1. Pour que les humains s'y retrouvent, on réécrit ces suites en **décimal** (adresses IPv4) ou en **hexadécimal** (adresses MAC, IPv6). En réseau, la compétence clé est de **convertir un octet** (8 bits) entre décimal et binaire : c'est la base du calcul des masques au module 3.

## 🖼️ Résumé visuel

Les 4 bases à connaître, de la plus « machine » à la plus « humaine », et les unités qui en découlent :

<div class="tssr-layers">
  <div class="tssr-layer" style="--layer-color:#6b7280;">
    <span class="tssr-layer-num">2</span>
    <span class="tssr-layer-name">Binaire</span>
    <span class="tssr-layer-desc">0 et 1 · 1 chiffre = 1 bit</span>
    <span class="tssr-layer-tag">1011</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#10b981;">
    <span class="tssr-layer-num">8</span>
    <span class="tssr-layer-name">Octal</span>
    <span class="tssr-layer-desc">0 à 7 · 1 chiffre = 3 bits · droits Linux</span>
    <span class="tssr-layer-tag">755</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#3b82f6;">
    <span class="tssr-layer-num">10</span>
    <span class="tssr-layer-name">Décimal</span>
    <span class="tssr-layer-desc">0 à 9 · base « humaine » · adresses IPv4</span>
    <span class="tssr-layer-tag">192</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">16</span>
    <span class="tssr-layer-name">Hexadécimal</span>
    <span class="tssr-layer-desc">0 à F · 1 chiffre = 4 bits · IPv6, MAC</span>
    <span class="tssr-layer-tag">FE</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#f59e0b;">
    <span class="tssr-layer-num">8b</span>
    <span class="tssr-layer-name">Octet</span>
    <span class="tssr-layer-desc">8 bits · stockage en o, débit en bit/s (÷ 8)</span>
    <span class="tssr-layer-tag">1 o</span>
  </div>
</div>

## 📖 Cours consolidé

### 1. Les 4 bases en un coup d'œil

Une **base**, c'est le nombre de chiffres différents dont on dispose avant de « passer à la colonne suivante ». En base 10, après 9 on écrit 10 ; en base 2, après 1 on écrit déjà 10.

- **Base 2 (binaire)** : 0 et 1. C'est la langue de la machine : un transistor laisse passer le courant (**1**) ou non (**0**). Un chiffre binaire = un **bit**.
- **Base 8 (octal)** : 0 à 7. Un chiffre = **3 bits**. On le croise surtout dans les **droits Linux** (`chmod 755`).
- **Base 10 (décimal)** : 0 à 9. La base des humains, et celle des **adresses IPv4** (`192.168.1.10`).
- **Base 16 (hexadécimal)** : 0 à 9 puis **A=10, B=11, C=12, D=13, E=14, F=15**. Un chiffre = **4 bits**. Partout en réseau : **adresses MAC** (`00:1A:2B:3C:4D:5E`), **IPv6** (`2001:db8::1`), et aussi les couleurs web (`#FF5733`).

💡 L'octal et l'hexa ne servent qu'à **écrire le binaire en plus court**. 8 bits = 2 chiffres hexa : `11111111` = `FF`.

**La table à connaître par cœur** (de 0 à 15) :

| Déc. | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Hexa** | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | A | B | C | D | E | F |
| **Binaire** | 0000 | 0001 | 0010 | 0011 | 0100 | 0101 | 0110 | 0111 | 1000 | 1001 | 1010 | 1011 | 1100 | 1101 | 1110 | 1111 |

---

### 2. Lire un nombre : chaque position a un poids

Dans toutes les bases, c'est la même règle : le chiffre le plus à droite est en **position 0**, et chaque position vaut **base^position**. On multiplie chaque chiffre par son poids, puis on additionne.

```
Décimal   407   = 4×10² + 0×10¹ + 7×10⁰  = 400 + 0 + 7     = 407
Binaire   1101  = 1×2³  + 1×2²  + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13
Octal     52    = 5×8¹  + 2×8⁰           = 40 + 2          = 42
Hexa      1B4   = 1×16² + B(11)×16¹ + 4×16⁰ = 256 + 176 + 4 = 436
```

👉 C'est aussi la méthode pour convertir **n'importe quelle base vers le décimal**.

---

### 3. Convertir : 3 méthodes, du plus général au plus rapide

#### a) Décimal → n'importe quelle base : les divisions successives

On divise par la base, on garde le **reste**, on recommence avec le quotient jusqu'à 0. Le résultat se lit **de bas en haut**.

```
45 → binaire               45 → hexa
45 ÷ 2 = 22  reste 1  ↑    45 ÷ 16 = 2  reste 13 → D  ↑
22 ÷ 2 = 11  reste 0  │     2 ÷ 16 = 0  reste 2       │
11 ÷ 2 =  5  reste 1  │                                └─ 2D
 5 ÷ 2 =  2  reste 1  │
 2 ÷ 2 =  1  reste 0  │
 1 ÷ 2 =  0  reste 1  └─ 101101
```

#### b) ⭐ Décimal ↔ binaire sur un octet : le tableau des poids

C'est **la méthode du technicien réseau** : on l'utilise pour chaque octet d'une adresse IP ou d'un masque. On écrit les 8 poids, puis on « remplit » de gauche à droite : si le poids rentre dans ce qui reste, on met **1** et on le soustrait, sinon **0**.

```
150 → binaire
Poids :   128   64   32   16    8    4    2    1
Reste :   150   22   22   22    6    6    2    0
Rentre ?  oui  non  non  oui  non  oui  oui  non
Bit :      1    0    0    1    0    1    1    0     → 10010110
```

Dans l'autre sens, c'est encore plus simple : on **additionne les poids des bits à 1**. `11000000` = 128 + 64 = **192**.

#### c) Binaire ↔ hexa / octal : on fait des paquets

Pas besoin de passer par le décimal : on coupe le binaire **depuis la droite**, en paquets de **4 bits** pour l'hexa et de **3 bits** pour l'octal (on complète à gauche avec des 0 si besoin).

```
300 en binaire = 100101100
Hexa  (par 4) :  0001 | 0010 | 1100  →  1 | 2 | C  →  12C
Octal (par 3) :   100 |  101 |  100  →  4 | 5 | 4  →  454
```

💡 **Astuce** : pour aller du décimal vers l'octal ou l'hexa, passer par le binaire est souvent plus sûr que les divisions par 8 ou par 16.

---

### 4. Les unités : stocker en octets, transmettre en bits

- **bit** (`b`) : un 0 ou un 1, la plus petite information.
- **octet** (`o`, en anglais *byte*, `B`) : **8 bits**, de 0 à 255. Environ 1 caractère de texte simple.

**Deux façons de compter les multiples**, et c'est la source d'une confusion classique :

| Préfixe décimal (×1 000) | | Préfixe binaire (×1 024) | |
|---|---|---|---|
| 1 **Ko** | 10³ = 1 000 o | 1 **Kio** | 2¹⁰ = 1 024 o |
| 1 **Mo** | 10⁶ o | 1 **Mio** | 2²⁰ o |
| 1 **Go** | 10⁹ o | 1 **Gio** | 2³⁰ o (≈ 1,07 Go) |
| 1 **To** | 10¹² o | 1 **Tio** | 2⁴⁰ o (≈ 1,1 To) |

- Les **fabricants** de disques comptent en décimal, **Windows** compte en binaire (mais écrit « Go »). Un disque de 1 To s'affiche donc environ **931 Go**. Rien n'est perdu, c'est l'unité qui change.
- Les **débits** réseau se comptent en **bits par seconde** (`bit/s`, `Mbit/s`, `Gbit/s`), avec des multiples de 1 000. Pour passer d'un débit à une vitesse de téléchargement, on **divise par 8** : une fibre à 100 Mbit/s télécharge au mieux à **12,5 Mo/s**.

⚠️ Petit **b** = bit, grand **B** = byte (octet). `Mb` ≠ `MB`.

---

### 5. Application réseau : la classe d'une IPv4 d'après son 1er octet

Une IPv4 = 4 octets écrits en décimal. Le **premier octet** donne la classe, donc le masque par défaut :

| Classe | 1er octet | Commence en binaire par | Masque par défaut |
|---|---|---|---|
| **A** | 1 à 126 | `0` | 255.0.0.0 (/8) |
| **B** | 128 à 191 | `10` | 255.255.0.0 (/16) |
| **C** | 192 à 223 | `110` | 255.255.255.0 (/24) |
| D · E | 224 à 239 · 240 à 255 | `1110` · `1111` | multicast · expérimental (pas pour des postes) |

**127.x.x.x** est réservé à la **boucle locale** (`127.0.0.1` = la machine elle-même). Exemple : `172.16.45.10` → 172 est entre 128 et 191 → **classe B**, réseau `172.16`, hôte `45.10`. La suite est vue au [module 3](../module-3-l-adressage-ipv4/index.md).

---

## 📝 Fiche de révision

| À retenir | |
|---|---|
| **Bases** | Binaire (2) · Octal (8) · Décimal (10) · Hexadécimal (16) |
| **Bits par chiffre** | Octal = 3 bits · Hexa = 4 bits |
| **Décimal → base N** | Divisions successives par N, restes lus **de bas en haut** |
| **Base N → décimal** | Somme de chiffre × N^position (position 0 à droite) |
| **Binaire ↔ octal / hexa** | Grouper par 3 / par 4 bits **depuis la droite** |
| **Hexa** | A=10 · B=11 · C=12 · D=13 · E=14 · F=15 |
| **Octet** | 8 bits · valeur de 0 à 255 |
| **Ko / Kio** | 1 Ko = 1 000 o · 1 Kio = 1 024 o (2¹⁰) |
| **Débit** | En **bits**/s : 100 Mbit/s ≈ 12,5 Mo/s (÷ 8) |
| **Classes IPv4** | A 1–126 (/8) · B 128–191 (/16) · C 192–223 (/24) · D 224–239 · E 240–255 |

**Puissances de 2 à connaître par cœur** (valeurs des bits d'un octet, de gauche à droite) :

| 2⁷ | 2⁶ | 2⁵ | 2⁴ | 2³ | 2² | 2¹ | 2⁰ |
|---|---|---|---|---|---|---|---|
| 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

**Exemples du cours** : 45 = `101101`₂ = `2D`₁₆ · `1101`₂ = 13 · 150 = `10010110`₂ · 300 = `12C`₁₆ = `454`₈ · `1B4`₁₆ = 436.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Convertis 200 en binaire, puis en hexadécimal."
    On place 200 dans le tableau des puissances de 2 : 200 = **128 + 64 + 8**.

    | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |
    |---|---|---|---|---|---|---|---|
    | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 |

    → **11001000**₂. On coupe en deux groupes de 4 : `1100` = 12 = **C**, `1000` = **8** → **C8**₁₆.

??? question "2. Quelle valeur décimale représente l'octet 10101100 ?"
    On additionne les poids des bits à 1 : **128 + 32 + 8 + 4 = 172**.

    En hexadécimal : `1010` = A, `1100` = C → **AC**.

??? question "3. Convertis 2F (hexadécimal) en décimal, puis en binaire."
    - Décimal : 2 × 16 + F (15) × 1 = 32 + 15 = **47**.
    - Binaire : chaque chiffre hexa vaut 4 bits → `2` = `0010`, `F` = `1111` → **00101111**.

??? question "4. Ta fibre affiche 500 Mbit/s. Combien de temps, au mieux, pour télécharger un fichier de 2 Go ?"
    On met tout en **bits** : 2 Go = 2 000 Mo = 2 000 × 8 = **16 000 Mbit**.

    16 000 ÷ 500 = **32 secondes** (en théorie : le débit réel est toujours un peu plus faible).

??? question "5. Tu branches un disque vendu « 500 Go ». Pourquoi Windows affiche-t-il environ 465 Go ?"
    Le fabricant compte en **décimal** : 500 Go = 500 000 000 000 octets.

    Windows divise par **2³⁰** (1 073 741 824) : 500 000 000 000 ÷ 1 073 741 824 ≈ **465,7**. Il affiche « Go » mais ce sont en réalité des **Gio**. Rien n'a disparu, c'est juste une autre unité.

??? question "6. Donne la classe de : 10.5.3.2 · 172.16.1.1 · 192.168.0.1 · 230.1.1.1"
    - **10**.5.3.2 → entre 1 et 126 → **classe A** (/8)
    - **172**.16.1.1 → entre 128 et 191 → **classe B** (/16)
    - **192**.168.0.1 → entre 192 et 223 → **classe C** (/24)
    - **230**.1.1.1 → entre 224 et 239 → **classe D** (multicast, jamais attribuée à un poste)

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques-data">
[
  {
    "question": "Combien de chiffres sont utilisés dans le système de numération binaire ?",
    "options": ["2 (0 et 1)", "8 (de 0 à 7)", "10 (de 0 à 9)", "16 (de 0 à F)"],
    "correctIndex": 0,
    "explanation": "Le système binaire, ou base 2, utilise uniquement deux chiffres, 0 et 1 (bits), car il correspond directement aux deux états électriques des circuits informatiques (activé/désactivé)."
  },
  {
    "question": "Quels symboles sont utilisés dans le système de numération hexadécimale ?",
    "options": ["Les chiffres de 0 à 7", "Les chiffres de 0 à 9 et les lettres de A à F", "Les chiffres de 0 à 9 uniquement", "Les lettres de A à P"],
    "correctIndex": 1,
    "explanation": "L'hexadécimal (base 16) utilise seize symboles : les dix chiffres de 0 à 9 puis les lettres A à F, où A vaut 10 et F vaut 15."
  },
  {
    "question": "À combien de bits binaires correspond un chiffre hexadécimal ?",
    "options": ["2 bits", "3 bits", "4 bits", "8 bits"],
    "correctIndex": 2,
    "explanation": "Chaque chiffre hexadécimal représente exactement quatre bits (un demi-octet), ce qui permet de regrouper un nombre binaire par blocs de quatre pour le convertir facilement en hexadécimal."
  },
  {
    "question": "À combien de bits binaires correspond un chiffre octal ?",
    "options": ["2 bits", "4 bits", "8 bits", "3 bits"],
    "correctIndex": 3,
    "explanation": "Un chiffre octal se traduit directement en trois bits binaires (2³ = 8), ce qui permet de regrouper les bits par paquets de trois pour convertir un nombre binaire en octal."
  },
  {
    "question": "Quel est le résultat de la conversion du nombre décimal 25 en binaire ?",
    "options": ["11001", "11010", "10101", "11100"],
    "correctIndex": 0,
    "explanation": "En divisant successivement 25 par 2, on obtient les restes 1, 0, 0, 1, 1 ; lus de bas en haut, ils forment 11001, l'équivalent binaire de 25."
  },
  {
    "question": "Quel est l'équivalent décimal du nombre binaire 10110 ?",
    "options": ["20", "22", "24", "18"],
    "correctIndex": 1,
    "explanation": "10110 correspond à (1×2⁴)+(0×2³)+(1×2²)+(1×2¹)+(0×2⁰) = 16+0+4+2+0 = 22."
  },
  {
    "question": "Quel est l'équivalent octal du nombre décimal 156 ?",
    "options": ["236", "244", "234", "232"],
    "correctIndex": 2,
    "explanation": "En divisant successivement 156 par 8, on obtient les restes 4, 3, 2 ; lus de bas en haut, ils donnent 234 en base 8."
  },
  {
    "question": "Quel est l'équivalent décimal du nombre hexadécimal 3F ?",
    "options": ["61", "65", "58", "63"],
    "correctIndex": 3,
    "explanation": "3F correspond à (3×16¹)+(15×16⁰) = 48+15 = 63, puisque F représente la valeur 15 en hexadécimal."
  },
  {
    "question": "Quel est l'équivalent hexadécimal du nombre décimal 254 ?",
    "options": ["FE", "EF", "FD", "F4"],
    "correctIndex": 0,
    "explanation": "En divisant successivement 254 par 16, on obtient les restes 14 (E) puis 15 (F) ; lus de bas en haut, cela donne FE."
  },
  {
    "question": "Pour convertir un nombre binaire en octal, comment regroupe-t-on les bits ?",
    "options": ["Par paquets de quatre bits, en partant de la droite", "Par paquets de trois bits, en partant de la droite", "Par paquets de deux bits, en partant de la gauche", "Par paquets de huit bits, en partant de la droite"],
    "correctIndex": 1,
    "explanation": "Comme un chiffre octal équivaut à trois bits, la conversion binaire-octal regroupe les bits par trois en partant de la droite, chaque groupe étant ensuite remplacé par sa valeur octale."
  },
  {
    "question": "Quelle est la méthode générale pour convertir un nombre décimal vers une autre base (binaire, octale ou hexadécimale) ?",
    "options": ["Des multiplications successives par la base cible", "Une simple addition des chiffres du nombre décimal", "Des divisions successives par la base cible, en lisant les restes de bas en haut", "Une conversion directe caractère par caractère"],
    "correctIndex": 2,
    "explanation": "Quelle que soit la base cible, on divise successivement le nombre décimal par cette base, on note les restes à chaque étape, puis on lit ces restes de bas en haut pour obtenir le résultat converti."
  },
  {
    "question": "Combien de bits compose un octet ?",
    "options": ["4 bits", "16 bits", "10 bits", "8 bits"],
    "correctIndex": 3,
    "explanation": "Un octet (byte) est constitué de 8 bits et sert souvent à représenter un caractère ou une petite unité d'information."
  },
  {
    "question": "Combien d'octets représente 1 Kio (kibioctet) ?",
    "options": ["1 024 octets", "1 000 octets", "1 048 576 octets", "1 100 octets"],
    "correctIndex": 0,
    "explanation": "Le Kio (kibioctet) suit la notation binaire : 1 Kio = 2¹⁰ octets, soit 1 024 octets, contrairement au Ko (kilooctet) décimal qui vaut 1 000 octets."
  },
  {
    "question": "Quelle est la principale différence entre le Ko (kilooctet) et le Kio (kibioctet) ?",
    "options": ["Le Ko et le Kio désignent exactement la même quantité d'octets", "Le Ko utilise la base 10 (1 000 octets) tandis que le Kio utilise la base 2 (1 024 octets)", "Le Ko mesure une vitesse de transfert alors que le Kio mesure une capacité de stockage", "Le Kio est utilisé uniquement pour les vitesses réseau"],
    "correctIndex": 1,
    "explanation": "Le Ko (système décimal, base 10) vaut 1 000 octets, alors que le Kio (système binaire, base 2) vaut 1 024 octets ; cette différence est source de confusion, notamment pour les capacités de disques durs annoncées par les fabricants."
  },
  {
    "question": "Quelle unité est utilisée pour mesurer la vitesse de transfert de données sur un réseau ?",
    "options": ["L'octet (B) et ses multiples (Ko, Mo, Go)", "Le Kio et le Mio", "Le bps (bits par seconde) et ses multiples (Kbps, Mbps, Gbps)", "Le hertz (Hz) uniquement"],
    "correctIndex": 2,
    "explanation": "Le débit réseau se mesure en bits par seconde (bps), avec des multiples comme Kbps, Mbps ou Gbps, à ne pas confondre avec les unités de capacité de stockage exprimées en octets."
  },
  {
    "question": "Dans quel contexte réseau la numération hexadécimale est-elle couramment utilisée ?",
    "options": ["Pour écrire les adresses IPv4 uniquement", "Pour définir les masques de sous-réseau en notation décimale", "Pour configurer les tables de routage OSPF", "Pour écrire les adresses IPv6 et les adresses MAC"],
    "correctIndex": 3,
    "explanation": "L'hexadécimal permet de représenter de façon compacte des adresses longues comme les adresses IPv6 (128 bits) ou les adresses MAC, chaque groupe de quatre bits étant représenté par un seul symbole hexadécimal."
  },
  {
    "question": "Dans quel système Unix/Linux la numération octale est-elle traditionnellement utilisée ?",
    "options": ["Pour définir les permissions des fichiers et dossiers (par exemple 755 ou 644)", "Pour définir les adresses IP des interfaces réseau", "Pour chiffrer les mots de passe utilisateurs", "Pour numéroter les ports TCP/UDP"],
    "correctIndex": 0,
    "explanation": "Sous Unix/Linux, les permissions de fichiers et de dossiers sont couramment exprimées en notation octale, avec des valeurs comme 755 ou 644 indiquant les droits de lecture, d'écriture et d'exécution."
  },
  {
    "question": "Comment une couleur web comme #FF5733 est-elle représentée ?",
    "options": ["En binaire, sous forme de 24 bits consécutifs sans séparation", "En hexadécimal, sous forme de trois paires de chiffres correspondant au rouge, au vert et au bleu", "En octal, sous forme de trois groupes de deux chiffres", "En décimal, sous forme de trois nombres séparés par des virgules"],
    "correctIndex": 1,
    "explanation": "Les couleurs web en hexadécimal codent les niveaux de rouge, vert et bleu (RGB) sur deux chiffres hexadécimaux chacun ; par exemple #FF5733 indique un niveau élevé de rouge (FF), moyen de vert (57) et faible de bleu (33)."
  },
  {
    "question": "Que représente un bit au niveau électronique dans un circuit informatique ?",
    "options": ["Une tension variable pouvant prendre dix niveaux différents", "Une fréquence radio spécifique", "Deux états possibles d'un transistor : passage de courant (1) ou absence de courant (0)", "Une adresse mémoire physique fixe"],
    "correctIndex": 2,
    "explanation": "Le binaire correspond directement aux deux états électriques d'un transistor : le passage de courant est représenté par 1, et son absence par 0, ce qui en fait le système naturel des circuits informatiques."
  },
  {
    "question": "Pourquoi la numération hexadécimale permet-elle une représentation plus compacte des nombres binaires que la numération octale ?",
    "options": ["Parce que l'octal ne peut pas représenter de nombres supérieurs à 100", "Parce que l'hexadécimal n'utilise que des chiffres, sans lettres", "Parce que l'octal a été abandonné par tous les systèmes d'exploitation modernes", "Parce qu'un chiffre hexadécimal représente quatre bits, contre trois bits pour un chiffre octal"],
    "correctIndex": 3,
    "explanation": "Un chiffre hexadécimal correspond à quatre bits contre trois pour l'octal, ce qui rend l'hexadécimal plus compact et plus largement utilisé aujourd'hui pour représenter adresses mémoire, adresses IP ou codes couleurs."
  },
  {
    "question": "À quelle classe appartient l'adresse 172.16.45.10 ?",
    "options": ["Classe A", "Classe B", "Classe C", "Classe D"],
    "correctIndex": 1,
    "explanation": "Le premier octet vaut 172, compris entre 128 et 191 : c'est une adresse de classe B, de masque par défaut 255.255.0.0 (/16)."
  },
  {
    "question": "Pour une adresse de classe C comme 192.168.1.10, quelle est la partie hôte ?",
    "options": ["192", "192.168", "1.10", "10"],
    "correctIndex": 3,
    "explanation": "En classe C, le masque par défaut est 255.255.255.0 : les 3 premiers octets (192.168.1) forment la partie réseau, le dernier octet (10) la partie hôte."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques",
      dataId: "quiz-cours-01-bases-des-reseaux-module-2-les-unites-informatiques-data",
    });
  });
</script>
