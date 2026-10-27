# Module 1 : Le modèle OSI

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Ce module présente le modèle OSI : sa logique en 7 couches, le vocabulaire de l'encapsulation (PDU, SDU, PCI), le rôle, les protocoles et les équipements associés à chaque couche, ainsi que le déroulé concret de l'encapsulation/désencapsulation à travers l'exemple d'un envoi d'email.

!!! abstract "En clair"
    Pour qu'un message aille d'un ordinateur à un autre, il faut résoudre plein de problèmes : le câble, les adresses, le chemin, la fiabilité, le format… Le **modèle OSI** range ces problèmes en **7 étages**, chacun avec **un seul travail**. Comme à la poste : on écrit la lettre, on la met dans une enveloppe avec l'adresse, le centre de tri choisit la route, le camion la transporte.

    En pratique, Internet utilise le **modèle TCP/IP** (4 couches), plus simple : il est expliqué en section 6.

## 🖼️ Résumé visuel

Le modèle OSI découpe une communication en **sept responsabilités complémentaires**. À l’émission, chaque couche prépare les données pour la couche inférieure ; à la réception, le traitement se fait dans l’ordre inverse.

<div class="tssr-layers">
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">7</span>
    <span class="tssr-layer-name">Application</span>
    <span class="tssr-layer-desc">Services visibles : HTTP, DNS, SMTP</span>
    <span class="tssr-layer-tag">Données</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">6</span>
    <span class="tssr-layer-name">Présentation</span>
    <span class="tssr-layer-desc">Format, chiffrement TLS, compression</span>
    <span class="tssr-layer-tag">Données</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">5</span>
    <span class="tssr-layer-name">Session</span>
    <span class="tssr-layer-desc">Ouverture, maintien et reprise du dialogue</span>
    <span class="tssr-layer-tag">Données</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#f59e0b;">
    <span class="tssr-layer-num">4</span>
    <span class="tssr-layer-name">Transport</span>
    <span class="tssr-layer-desc">TCP/UDP, fiabilité et numéros de port</span>
    <span class="tssr-layer-tag">Segment</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#3b82f6;">
    <span class="tssr-layer-num">3</span>
    <span class="tssr-layer-name">Réseau</span>
    <span class="tssr-layer-desc">IPv4/IPv6, choix du chemin, routeur</span>
    <span class="tssr-layer-tag">Paquet</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#10b981;">
    <span class="tssr-layer-num">2</span>
    <span class="tssr-layer-name">Liaison</span>
    <span class="tssr-layer-desc">Ethernet, adresse MAC, commutateur</span>
    <span class="tssr-layer-tag">Trame</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#6b7280;">
    <span class="tssr-layer-num">1</span>
    <span class="tssr-layer-name">Physique</span>
    <span class="tssr-layer-desc">Câble, fibre, radio et signaux</span>
    <span class="tssr-layer-tag">Bits</span>
  </div>
</div>

## 📖 Cours consolidé

### 1. Le modèle OSI en bref

- **OSI** (*Open Systems Interconnection*) : modèle **théorique** qui découpe une communication réseau en **7 couches**.
- Chaque couche a **un seul travail** et ne parle qu'à ses **voisines directes**.
- Intérêt : on peut **faire évoluer** ou **dépanner** une couche sans toucher aux autres (« le problème est en couche 2 »).

---

### 2. Encapsulation : PDU, SDU, PCI

| Terme | En clair |
|---|---|
| **SDU** (*Service Data Unit*) | Ce que la couche **reçoit** de la couche du dessus |
| **PCI** (*Protocol Control Information*) | Ce qu'elle **ajoute** : adresses, ports, contrôle d'erreur… |
| **PDU** (*Protocol Data Unit*) | Le résultat : **SDU + PCI**, transmis à la couche du dessous |

**Exemple (couche 4 → couche 3)** : le **segment TCP** devient le SDU de la couche Réseau, qui ajoute les **adresses IP** (PCI) → on obtient un **paquet IP**.

- **Envoi** : on descend de 7 à 1, chaque couche **ajoute** son en-tête (= encapsulation).
- **Réception** : on remonte de 1 à 7, chaque couche **retire** le sien (= désencapsulation).

---

### 3. Les 7 couches

#### Vue d'ensemble

| N° | Couche | PDU | Rôle en un mot | Protocoles / normes | Équipements |
|---|---|---|---|---|---|
| 7 | **Application** | Données | Services à l'utilisateur | HTTP(S), FTP, SMTP, DNS | — (logiciel) |
| 6 | **Présentation** | Données | Traduire, compresser, **chiffrer** | TLS, JPEG, MPEG | — (logiciel) |
| 5 | **Session** | Données | Ouvrir / gérer / fermer les **sessions** | RPC, NetBIOS | — (logiciel) |
| 4 | **Transport** | **Segment** | Livraison **de bout en bout**, **ports** | TCP, UDP | Pare-feu (filtrage par port) |
| 3 | **Réseau** | **Paquet** | **Routage** entre réseaux, adresse **IP** | IP, ICMP, ARP, OSPF, RIP | **Routeur** |
| 2 | **Liaison** | **Trame** | Transfert **local**, adresse **MAC**, erreurs | Ethernet, Wi-Fi, PPP | **Switch**, pont |
| 1 | **Physique** | **Bits** | Signaux sur le support | Ethernet 802.3, Wi-Fi 802.11 | Câbles, hub, répéteur |

💡 Les noms longs (APDU, PPDU, SPDU, TPDU, RPDU, LPDU) existent, mais on dit surtout **données, segment, paquet, trame, bits**.

---

#### 3.1 Couche Physique (1)

- Transporte les **bits** sous forme de **signaux** (électriques, lumineux, radio). C'est la **route** : elle ne regarde pas ce qui circule.
- Ne gère **ni les erreurs ni la destination**.

##### Focus pratique : les câbles à paires torsadées

- Le plus courant en Ethernet : **CAT5e, CAT6, CAT6a** (jusqu'à 10 Gbit/s), **100 m maximum**.
- **UTP** = non blindé (léger, pas cher) · **STP** = blindé (protège des interférences).

| Câble | Pour relier | Câblage |
|---|---|---|
| **Droit** | Appareils **différents** (PC ↔ switch, switch ↔ routeur) | Même norme aux 2 bouts (T568B) |
| **Croisé** | Appareils **identiques** (PC ↔ PC, switch ↔ switch) | T568A d'un côté, T568B de l'autre |

- **T568A / T568B** : seules les paires **orange** et **verte** sont inversées. En entreprise : **T568B** partout (blanc-orange, orange, blanc-vert, bleu, blanc-bleu, vert, blanc-marron, marron).
- **Auto MDI-X** : les équipements récents s'adaptent seuls → un câble droit marche partout.

---

#### 3.2 Couche Liaison de données (2)

- Transfert **fiable** entre deux équipements **du même réseau local**, en **trames**, avec l'adresse **MAC**.
- 2 sous-couches : **LLC** (lien avec la couche 3) et **MAC** (accès au support, adressage physique).
- Seule couche qui ajoute une **fin de trame** : le **FCS** (calcul **CRC**). Si le calcul ne correspond pas à l'arrivée, la trame est **jetée**.
- ⚠️ Limitée au **réseau local** : pour aller plus loin, il faut la couche 3.

---

#### 3.3 Couche Réseau (3)

- Achemine les **paquets** **d'un réseau à l'autre** grâce aux adresses **IP** (IPv4 = 32 bits, IPv6 = 128 bits).
- **Routage** (meilleur chemin), **adressage**, **fragmentation** des paquets trop gros.
- **ICMP** = diagnostic (`ping`) · **ARP** = trouve la MAC qui correspond à une IP.
- ⚠️ Ne **garantit pas** la livraison : c'est le rôle de la couche 4.

---

#### 3.4 Couche Transport (4)

- Livraison **de bout en bout** : découpe en **segments numérotés**, remet dans l'ordre, contrôle le **débit** et les **erreurs**.
- **Ports** = le numéro de l'**application** visée (l'IP est l'immeuble, le port l'appartement).

| | **TCP** | **UDP** |
|---|---|---|
| Connexion | Oui (établie avant l'envoi) | Non |
| Fiabilité | Ordre + intégrité **garantis** | Aucune garantie |
| Vitesse | Plus lent | **Rapide** |
| Exemples | Web, fichiers, e-mails | Streaming, VoIP, **DNS (53)**, **DHCP (67/68)**, SNMP |

- **Serveur** : port **fixe** connu (443 = HTTPS, 25 = SMTP). **Client** : port **temporaire** (> 1024), pour recevoir la réponse au bon endroit.
- La liste des ports à connaître est dans la **fiche de révision**.

---

#### 3.5 · 3.6 · 3.7 Couches hautes (5, 6, 7) : logicielles

| Couche | Rôle | Exemples |
|---|---|---|
| **5 Session** | Ouvre, synchronise, ferme et reprend les **sessions** entre 2 applications | RPC, NetBIOS |
| **6 Présentation** | « Traductrice » : format des données, **compression**, **chiffrement** | **TLS** (le S de HTTPS), JPEG, MPEG |
| **7 Application** | Les services utilisés directement | HTTP(S), FTP, SMTP, DNS |

---

### 4. L'encapsulation en image : un email qui descend les couches

Comme des **poupées russes** : chaque couche emballe le colis de la couche du dessus, avec son étiquette.

<div class="tssr-encap">
  <div class="tssr-encap-row"><span class="tssr-encap-lvl">7 · 6 · 5</span><span class="tssr-encap-box is-data">📧 Email (texte + pièce jointe)</span></div>
  <div class="tssr-encap-row"><span class="tssr-encap-lvl">4 · Segment</span><span class="tssr-encap-box is-l4">TCP<small>port 25</small></span><span class="tssr-encap-box is-data">📧</span></div>
  <div class="tssr-encap-row"><span class="tssr-encap-lvl">3 · Paquet</span><span class="tssr-encap-box is-l3">IP<small>src → dst</small></span><span class="tssr-encap-box is-l4">TCP</span><span class="tssr-encap-box is-data">📧</span></div>
  <div class="tssr-encap-row"><span class="tssr-encap-lvl">2 · Trame</span><span class="tssr-encap-box is-l2">MAC<small>src → dst</small></span><span class="tssr-encap-box is-l3">IP</span><span class="tssr-encap-box is-l4">TCP</span><span class="tssr-encap-box is-data">📧</span><span class="tssr-encap-box is-l2">FCS<small>contrôle</small></span></div>
  <div class="tssr-encap-row"><span class="tssr-encap-lvl">1 · Bits</span><span class="tssr-encap-box is-bits">0110 1001 0011 1100 0101 1010 …</span></div>
</div>

À la réception, chaque couche **vérifie puis retire** son en-tête : la **MAC** (« c'est pour moi ? »), puis l'**IP**, puis le **port** (à quel logiciel donner les données). Si une vérification échoue, la donnée **ne remonte pas**.

---

### 5. Exemple vécu : tu ouvres un site web en HTTPS

```mermaid
sequenceDiagram
    participant PC as 💻 Ton PC
    participant Box as 📦 Box / passerelle
    participant Web as 🌐 Serveur web
    PC->>Box: ARP : « Quelle est ta MAC ? » (couche 2/3)
    Box-->>PC: « Voici ma MAC »
    PC->>Web: Trame vers la MAC de la box, paquet vers l'IP du serveur,<br/>segment TCP du port 51000 vers le port 443
    Web-->>PC: Réponse du port 443 vers le port 51000
    Note over PC,Web: TLS chiffre l'échange (couche 6),<br/>le navigateur affiche la page (couche 7)
```

- **MAC de destination** = la **box** (le prochain saut) · **IP de destination** = le **serveur** (le but final). La MAC change à chaque saut, l'IP jamais.
- **Port de destination** = le service (**443**) · **port source** = numéro temporaire du PC. La réponse inverse les deux.

---

### 6. Le modèle TCP/IP : celui qu'on utilise vraiment

L'OSI sert à **expliquer** et **dépanner** ; Internet fonctionne avec le modèle **TCP/IP**, en **4 couches**.

| Couches OSI | Couche TCP/IP | Protocoles | PDU |
|---|---|---|---|
| 7 · 6 · 5 | **4 – Application** | HTTP(S), DNS, DHCP, SMTP, SSH, FTP | Données |
| 4 Transport | **3 – Transport** | TCP, UDP | Segment |
| 3 Réseau | **2 – Internet** | IP, ICMP | Paquet |
| 2 · 1 | **1 – Accès réseau** | Ethernet, Wi-Fi | Trame / bits |

- ⚠️ La couche Transport est la **4** en OSI mais la **3** en TCP/IP. « Switch de niveau 2 », « routeur de niveau 3 » : c'est la numérotation **OSI**.
- **ARP** fait le lien IP (couche 3) ↔ MAC (couche 2) : retiens qu'il est « **entre les deux** ».

## 📝 Fiche de révision

**Moyen mnémotechnique** (de la couche 1 à 7) : **P**our **L**e **R**éseau, **T**out **S**e **P**asse **A**utomatiquement → Physique, Liaison, Réseau, Transport, Session, Présentation, Application.

| Couche | PDU | Rôle en un mot | Protocoles / normes | Équipements |
|---|---|---|---|---|
| 7 – Application | Données (APDU) | Services utilisateur | HTTP/HTTPS, FTP, SMTP, DNS | — |
| 6 – Présentation | Données (PPDU) | Format, chiffrement, compression | SSL/TLS, JPEG, MPEG | — |
| 5 – Session | Données (SPDU) | Ouvrir / maintenir / reprendre le dialogue | RPC, NetBIOS | — |
| 4 – Transport | **Segment** | Bout en bout, ports, fiabilité | TCP, UDP | Pare-feu (filtrage par port) |
| 3 – Réseau | **Paquet** | Routage, adressage logique | IPv4, IPv6, ICMP, ARP, OSPF, RIP | Routeur, passerelle |
| 2 – Liaison | **Trame** | Réseau local, adresse MAC, erreurs | Ethernet 802.3, Wi-Fi 802.11, PPP | Switch, pont |
| 1 – Physique | **Bits** | Signaux sur le support | Normes Ethernet / Wi-Fi / Bluetooth | Câbles, hub, répéteur, modem |

| À ne pas confondre | |
|---|---|
| **SDU / PCI / PDU** | SDU (reçu de N+1) + PCI (en-tête de N) = PDU de N |
| **Encapsulation / désencapsulation** | Envoi : 7 → 1, on ajoute des en-têtes · Réception : 1 → 7, on les retire |
| **TCP / UDP** | Fiable, orienté connexion · Rapide, sans connexion (streaming, VoIP) |
| **Adresse MAC / adresse IP** | Physique, couche 2, change à chaque saut · Logique, couche 3, reste la même de bout en bout |
| **En-tête / FCS** | Toutes les couches ajoutent un en-tête · Seule la couche 2 ajoute une fin de trame (FCS, contrôle CRC) |
| **Port source / destination** | Temporaire (> 1024), choisi par le client · Fixe, celui du service (ex. 443) |
| **Câble droit / croisé** | Appareils différents (PC ↔ switch) · Appareils identiques (PC ↔ PC), sauf Auto MDI-X |
| **UTP / STP** | Non blindé, économique · Blindé, résiste mieux aux interférences |

**OSI ↔ TCP/IP** : 7-6-5 → **Application** · 4 → **Transport** · 3 → **Internet** · 2-1 → **Accès réseau**.

**Ports à connaître** (souvent demandés à l'examen) :

| Port | Service | | Port | Service |
|---|---|---|---|---|
| 20/21 | FTP | | 143 | IMAP |
| 22 | SSH (et SFTP) | | 161/162 | SNMP (supervision) |
| 23 | Telnet (non chiffré, à bannir) | | 389 / 636 | LDAP / LDAPS |
| 25 | SMTP | | 443 | HTTPS |
| 53 | DNS | | 445 | SMB (partages Windows) |
| 67/68 | DHCP | | 587 | SMTP authentifié (envoi de mails) |
| 80 | HTTP | | 993 / 995 | IMAPS / POP3S |
| 88 | Kerberos (Active Directory) | | 3389 | RDP (Bureau à distance) |
| 110 | POP3 | | 123 | NTP (heure) |

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Remets dans l'ordre, de la couche 1 à la couche 7 : Transport · Physique · Application · Réseau · Session · Liaison · Présentation"
    **1 Physique · 2 Liaison · 3 Réseau · 4 Transport · 5 Session · 6 Présentation · 7 Application**

    Moyen mnémotechnique : « **P**our **L**e **R**éseau, **T**out **S**e **P**asse **A**utomatiquement ».

??? question "2. À quelle couche OSI associes-tu : switch · routeur · hub · adresse IP · adresse MAC · port 443 · câble RJ45 · chiffrement TLS ?"
    | Élément | Couche |
    |---|---|
    | Hub, câble RJ45 | **1** – Physique |
    | Switch, adresse MAC | **2** – Liaison |
    | Routeur, adresse IP | **3** – Réseau |
    | Port 443 | **4** – Transport |
    | Chiffrement TLS | **6** – Présentation (dans le modèle OSI) |

??? question "3. Un PC envoie une page web. Dans quel ordre ajoute-t-il les en-têtes TCP, IP et MAC ? Laquelle de ces couches ajoute aussi une fin ?"
    On descend les couches : **TCP** (couche 4) → **IP** (couche 3) → **MAC** (couche 2).

    Seule la couche **2** ajoute aussi une **fin de trame (FCS)**, qui sert à vérifier que la trame n'a pas été abîmée. À la réception, on retire dans l'ordre inverse : MAC, puis IP, puis TCP.

??? question "4. Ton PC (192.168.1.10) ouvre https://www.exemple.fr. Donne : la MAC de destination, l'IP de destination, le port de destination, le port source."
    - **MAC de destination** : celle de la **box** (passerelle), car le serveur n'est pas sur ton réseau local.
    - **IP de destination** : celle du **serveur web** (trouvée grâce au DNS).
    - **Port de destination** : **443** (HTTPS).
    - **Port source** : un numéro **temporaire au-dessus de 1024**, choisi par ton PC.

??? question "5. Dépannage : à quelle couche commences-tu à chercher ? a) le voyant de la prise réseau est éteint · b) le ping vers 8.8.8.8 répond, mais aucun site ne s'ouvre par son nom"
    - **a)** Pas de voyant = pas de signal → **couche 1** : câble débranché ou abîmé, prise morte, carte réseau désactivée.
    - **b)** Internet répond par son adresse IP (couches 1 à 3 OK), mais pas par les noms → le **DNS** ne marche pas, service de la **couche 7**. On vérifie le serveur DNS configuré (`ipconfig /all`) et on teste avec `nslookup`.

    💡 Règle du technicien : on dépanne **de bas en haut**, en commençant par la couche 1.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi-data">
[
  {
    "question": "Que signifie l'acronyme PDU dans le modèle OSI ?",
    "options": [
      "Protocol Data Unit",
      "Physical Data Unit",
      "Packet Distribution Unit",
      "Protocol Description Unit"
    ],
    "correctIndex": 0,
    "explanation": "PDU signifie « Protocol Data Unit » : c'est l'unité de données échangée entre deux entités réseau à une couche donnée du modèle OSI, comprenant les données utilisateur et les informations de contrôle ajoutées par le protocole de cette couche."
  },
  {
    "question": "Dans le passage d'une couche N+1 à une couche N, comment est appelée la donnée brute que la couche N+1 transmet à la couche N avant tout traitement ?",
    "options": [
      "Un PCI (Protocol Control Information)",
      "Un SDU (Service Data Unit)",
      "Un PDU (Protocol Data Unit)",
      "Un en-tête de couche"
    ],
    "correctIndex": 1,
    "explanation": "Le SDU est la donnée fournie par la couche N+1 à la couche N sous forme brute, sans information spécifique à la couche N. La couche N y ajoute ensuite son PCI pour former un nouveau PDU."
  },
  {
    "question": "Dans l'exemple d'encapsulation d'un email à travers les couches OSI, comment est nommé le PDU au niveau de la couche Application ?",
    "options": [
      "PPDU (Presentation Protocol Data Unit)",
      "SPDU (Session Protocol Data Unit)",
      "APDU (Application Protocol Data Unit)",
      "TPDU (Transport Protocol Data Unit)"
    ],
    "correctIndex": 2,
    "explanation": "Au niveau de la couche Application, les données brutes de l'email (texte et pièces jointes) sont appelées APDU. Cet APDU est ensuite encapsulé en PPDU par la couche Présentation, puis en SPDU par la couche Session, et ainsi de suite."
  },
  {
    "question": "Combien de couches compte le modèle OSI ?",
    "options": [
      "4",
      "5",
      "9",
      "7"
    ],
    "correctIndex": 3,
    "explanation": "Le modèle OSI est structuré en 7 couches distinctes, chacune ayant une fonction spécifique et communiquant uniquement avec les couches directement adjacentes."
  },
  {
    "question": "Quelle couche du modèle OSI est directement responsable de la transmission des bits sous forme de signaux électriques, optiques ou radio ?",
    "options": [
      "La couche Physique",
      "La couche Liaison de données",
      "La couche Réseau",
      "La couche Transport"
    ],
    "correctIndex": 0,
    "explanation": "La couche Physique transforme les données en impulsions électriques, signaux lumineux ou ondes radio et les transmet sur le support physique (câbles, fibres, ondes)."
  },
  {
    "question": "Quel type de câble à paires torsadées utilise le même schéma de câblage (par exemple T568B) aux deux extrémités ?",
    "options": [
      "Le câble croisé (crossover)",
      "Le câble droit (straight-through)",
      "Le câble coaxial",
      "Le câble à fibre optique"
    ],
    "correctIndex": 1,
    "explanation": "Un câble droit conserve le même ordre de connexion des fils aux deux extrémités ; il sert à relier des équipements de types différents, comme un ordinateur à un commutateur."
  },
  {
    "question": "Pour relier directement deux ordinateurs entre eux sans passer par un commutateur (en l'absence d'Auto MDI-X), quel type de câble à paires torsadées faut-il utiliser ?",
    "options": [
      "Le câble droit",
      "Le câble STP simple",
      "Le câble croisé",
      "Le câble RJ11"
    ],
    "correctIndex": 2,
    "explanation": "Le câble croisé inverse les fils de transmission et de réception entre les deux extrémités (une extrémité en T568A, l'autre en T568B), ce qui permet à deux appareils de même type de communiquer directement."
  },
  {
    "question": "Quelle est la principale différence entre un câble UTP et un câble STP ?",
    "options": [
      "L'UTP transmet uniquement en fibre optique",
      "Le STP fonctionne uniquement en réseau sans fil",
      "L'UTP ne peut pas dépasser 10 mètres de longueur",
      "Le STP dispose d'un blindage contre les interférences électromagnétiques, contrairement à l'UTP"
    ],
    "correctIndex": 3,
    "explanation": "STP (Shielded Twisted Pair) intègre un blindage qui protège mieux contre les interférences électromagnétiques, mais il est plus coûteux ; UTP (Unshielded Twisted Pair) est plus léger et économique mais plus sensible aux interférences."
  },
  {
    "question": "Quelles sont les deux sous-couches qui composent la couche Liaison de données ?",
    "options": [
      "LLC (Logical Link Control) et MAC (Media Access Control)",
      "TCP et UDP",
      "IP et ICMP",
      "SSL et TLS"
    ],
    "correctIndex": 0,
    "explanation": "La couche Liaison de données se subdivise en sous-couche LLC, qui gère les connexions logiques et le multiplexage des protocoles, et en sous-couche MAC, qui contrôle l'accès au support physique et l'adressage physique."
  },
  {
    "question": "Quel type d'adresse est utilisé par la sous-couche MAC pour identifier de façon unique chaque appareil sur un réseau local ?",
    "options": [
      "L'adresse IP",
      "L'adresse MAC",
      "Le numéro de port",
      "L'adresse logique de session"
    ],
    "correctIndex": 1,
    "explanation": "La sous-couche MAC gère l'adressage physique : chaque trame comporte une adresse MAC source et une adresse MAC de destination permettant d'identifier les équipements sur le réseau local."
  },
  {
    "question": "Quel équipement fonctionne typiquement au niveau de la couche Liaison de données en utilisant les adresses MAC pour transférer les trames ?",
    "options": [
      "Le routeur",
      "Le modem",
      "Le commutateur (switch)",
      "Le pare-feu applicatif"
    ],
    "correctIndex": 2,
    "explanation": "Les commutateurs opèrent au niveau de la couche Liaison de données et utilisent les adresses MAC pour acheminer les trames entre les dispositifs d'un même réseau local."
  },
  {
    "question": "Quelle est la fonction principale de la couche Réseau dans le modèle OSI ?",
    "options": [
      "Transmettre les bits sous forme de signaux physiques",
      "Chiffrer et compresser les données",
      "Gérer les sessions entre applications",
      "Acheminer les paquets entre différents réseaux via le routage et l'adressage logique (IP)"
    ],
    "correctIndex": 3,
    "explanation": "La couche Réseau détermine le chemin optimal pour acheminer les paquets d'un réseau à un autre, en s'appuyant sur des adresses logiques comme les adresses IP."
  },
  {
    "question": "Quel protocole de la couche Réseau est utilisé pour envoyer des messages de diagnostic tels que le ping ?",
    "options": [
      "ICMP (Internet Control Message Protocol)",
      "ARP (Address Resolution Protocol)",
      "OSPF (Open Shortest Path First)",
      "TCP (Transmission Control Protocol)"
    ],
    "correctIndex": 0,
    "explanation": "ICMP est utilisé pour les messages de contrôle et de diagnostic sur le réseau, comme les erreurs de routage ou les requêtes ping, qui permettent de vérifier la connectivité entre deux hôtes."
  },
  {
    "question": "Quel équipement de la couche Réseau prend des décisions d'acheminement basées sur les adresses IP et les tables de routage ?",
    "options": [
      "Le commutateur",
      "Le routeur",
      "Le hub",
      "Le répéteur"
    ],
    "correctIndex": 1,
    "explanation": "Les routeurs acheminent les paquets entre différents réseaux en s'appuyant sur les adresses IP de destination et leurs tables de routage."
  },
  {
    "question": "Quelle unité de données, spécifique à la couche Transport, est numérotée pour permettre son réassemblage dans le bon ordre à l'arrivée ?",
    "options": [
      "La trame",
      "Le paquet",
      "Le segment",
      "Le bit"
    ],
    "correctIndex": 2,
    "explanation": "La couche Transport découpe les données en segments numérotés, ce qui permet à la couche Transport du récepteur de les réassembler dans le bon ordre, même si le réseau introduit des pertes ou des variations de débit."
  },
  {
    "question": "Quel protocole de la couche Transport garantit la livraison des segments dans le bon ordre et sans erreur, au prix d'une latence potentiellement plus élevée ?",
    "options": [
      "UDP (User Datagram Protocol)",
      "IP (Internet Protocol)",
      "ARP (Address Resolution Protocol)",
      "TCP (Transmission Control Protocol)"
    ],
    "correctIndex": 3,
    "explanation": "TCP est un protocole orienté connexion qui assure la fiabilité de la transmission (ordre, absence d'erreurs) grâce à des mécanismes de contrôle et de retransmission, ce qui peut introduire de la latence par rapport à UDP."
  },
  {
    "question": "Pourquoi UDP est-il souvent préféré à TCP pour des applications comme le streaming vidéo ou la VoIP ?",
    "options": [
      "Parce qu'il est plus rapide et sans vérification systématique de la réception des segments, ce qui convient aux flux temps réel tolérant quelques pertes",
      "Parce qu'il chiffre systématiquement les données transmises",
      "Parce qu'il garantit l'ordre et l'intégrité de chaque paquet",
      "Parce qu'il fonctionne uniquement sur le port 443"
    ],
    "correctIndex": 0,
    "explanation": "UDP est un protocole sans connexion, plus léger que TCP car il n'implémente pas de contrôle d'ordre ni de vérification systématique de la réception, ce qui le rend adapté aux applications temps réel où la rapidité prime sur la fiabilité totale."
  },
  {
    "question": "À quoi servent les numéros de port utilisés par la couche Transport ?",
    "options": [
      "À identifier de façon unique chaque carte réseau sur le marché",
      "À identifier les différentes applications qui communiquent sur un même appareil (multiplexage)",
      "À définir la topologie physique du réseau",
      "À chiffrer les échanges entre deux couches Session"
    ],
    "correctIndex": 1,
    "explanation": "Les ports permettent à plusieurs applications de partager la même connexion réseau en distinguant leurs flux de données respectifs ; par exemple, le port 80 est associé au HTTP et le port 443 au HTTPS."
  },
  {
    "question": "Quelle couche du modèle OSI est chargée d'établir, gérer et terminer les sessions de communication entre deux applications, notamment en assurant leur synchronisation ?",
    "options": [
      "La couche Présentation",
      "La couche Application",
      "La couche Session",
      "La couche Transport"
    ],
    "correctIndex": 2,
    "explanation": "La couche Session établit, gère et termine les sessions entre applications communicantes et assure la synchronisation des échanges, permettant une reprise en cas d'interruption."
  },
  {
    "question": "Quel est le rôle principal de la couche Présentation dans le modèle OSI ?",
    "options": [
      "Acheminer les paquets entre réseaux différents",
      "Gérer l'adressage physique des équipements",
      "Détecter les collisions sur le support physique partagé",
      "Convertir les données dans un format compréhensible par l'application, en gérant compression et chiffrement"
    ],
    "correctIndex": 3,
    "explanation": "La couche Présentation agit comme une « traductrice de données » : elle convertit les données dans un format exploitable par l'application et prend en charge la compression ainsi que la cryptographie, par exemple via SSL/TLS."
  },
  {
    "question": "Combien de couches compte le modèle TCP/IP ?",
    "options": [
      "7",
      "5",
      "4",
      "3"
    ],
    "correctIndex": 2,
    "explanation": "TCP/IP compte 4 couches : Application, Transport, Internet et Accès réseau. Il regroupe les couches 5-6-7 d'OSI en une seule (Application) et les couches 1-2 en une seule (Accès réseau)."
  },
  {
    "question": "Quel port utilise le partage de fichiers Windows (SMB) ?",
    "options": [
      "21",
      "445",
      "3389",
      "8080"
    ],
    "correctIndex": 1,
    "explanation": "SMB, utilisé par les partages Windows (\\\\serveur\\partage), fonctionne sur le port TCP 445. 21 = FTP, 3389 = Bureau à distance."
  },
  {
    "question": "Quelle couche est la seule à ajouter une fin (FCS) en plus de son en-tête ?",
    "options": [
      "La couche Transport",
      "La couche Réseau",
      "La couche Liaison de données",
      "La couche Application"
    ],
    "correctIndex": 2,
    "explanation": "La trame (couche 2) se termine par le FCS, un calcul de contrôle (CRC). Le récepteur refait le calcul : si le résultat diffère, la trame abîmée est jetée."
  },
  {
    "question": "Ton PC ouvre un site web hébergé sur Internet. Quelle est l'adresse MAC de destination de la trame qu'il envoie ?",
    "options": [
      "La MAC du serveur web",
      "La MAC de la box (passerelle par défaut)",
      "La MAC de diffusion FF:FF:FF:FF:FF:FF",
      "Sa propre MAC"
    ],
    "correctIndex": 1,
    "explanation": "La MAC ne sert que sur le réseau local : la trame est adressée au prochain saut, la box. L'IP de destination, elle, reste celle du serveur web jusqu'au bout."
  },
  {
    "question": "Quel protocole de transport utilisent principalement DNS, DHCP et SNMP ?",
    "options": [
      "TCP",
      "UDP",
      "ICMP",
      "ARP"
    ],
    "correctIndex": 1,
    "explanation": "Ce sont des échanges courts où la rapidité compte : ils passent surtout par UDP (DNS sur le port 53, DHCP sur 67/68, SNMP sur 161/162)."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi",
      dataId: "quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi-data",
    });
  });
</script>
