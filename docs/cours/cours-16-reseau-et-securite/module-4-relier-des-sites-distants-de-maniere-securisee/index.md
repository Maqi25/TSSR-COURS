# Module 4 : Relier des sites distants de manière sécurisée

*Cours : [Cours 16 - Réseau et sécurité](../index.md)*

## 🎯 Objectif du module

Relier **deux sites** (siège et agence) par un **VPN site à site IPsec** : comprendre les **deux phases** (IKE puis IPsec), les paramètres à faire **correspondre** des deux côtés, et vérifier le tunnel sur **pfSense**.

!!! abstract "En clair"
    Plutôt que d'installer un client VPN sur chaque poste de l'agence, on relie **les deux pare-feux** entre eux. Les postes n'ont rien à faire : quand un PC de l'agence veut joindre un serveur du siège, son pare-feu **chiffre** le paquet et l'envoie dans le tunnel.

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 2 · compétence 4 : Exploiter un réseau IP** et **compétence 7 : Gérer les accès et la sécurité** : interconnecter des sites de façon sécurisée.

**① Le VPN site à site**

```mermaid
flowchart LR
    LA["LAN siège<br/>192.168.10.0/24"] --> FA["🔥 pfSense siège<br/>IP publique A"]
    FA == "🔒 tunnel IPsec<br/>à travers Internet" ==> FB["🔥 pfSense agence<br/>IP publique B"]
    FB --> LB["LAN agence<br/>192.168.20.0/24"]
```

**② Les deux phases d'IPsec**

```mermaid
flowchart TD
    P1["PHASE 1 · IKE<br/>les deux pare-feux s'authentifient<br/>(clé partagée ou certificat)<br/>et créent un canal sûr<br/>UDP 500 (4500 si NAT)"]
    P1 --> P2["PHASE 2 · IPsec<br/>quels réseaux passent dans le tunnel<br/>(local ↔ distant)<br/>données chiffrées en ESP"]
    P2 --> OK["✅ Les deux LAN<br/>communiquent"]
```

## 📖 Cours consolidé

### 1. IPsec en deux phases

| Phase | Rôle | Paramètres (identiques **des deux côtés**) |
|---|---|---|
| **Phase 1 – IKE** (*Internet Key Exchange*) | Les deux passerelles **s'authentifient** et **négocient les clés** : c'est le canal de contrôle | Version **IKEv2**, **adresse publique** du pair, **authentification** (clé pré-partagée *PSK* ou certificat), **chiffrement** (AES), **hachage** (SHA-256), **groupe Diffie-Hellman**, durée de vie |
| **Phase 2 – IPsec** | Le tunnel qui **transporte les données** | **Réseau local** et **réseau distant**, protocole **ESP** (chiffrement), algorithmes, PFS, durée de vie |

| Flux à autoriser sur le WAN | Usage |
|---|---|
| **UDP 500** | IKE |
| **UDP 4500** | NAT-T (IPsec quand un **NAT** se trouve sur le chemin) |
| Protocole **ESP** (IP 50) | Les données chiffrées |

### 2. Sur pfSense

1. *VPN → IPsec → Tunnels* : **ajouter une phase 1** (IKEv2, interface **WAN**, IP publique **du site d'en face**, clé pré-partagée **longue**, AES/SHA-256/DH).
2. Sous ce tunnel, **ajouter une phase 2** : réseau **local** (ex. 192.168.10.0/24) et réseau **distant** (192.168.20.0/24).
3. Faire **la même chose en miroir** sur l'autre pare-feu (local et distant **inversés**, mêmes algorithmes, même clé).
4. *Pare-feu → Règles → IPsec* : autoriser les flux entre les deux LAN (selon la **matrice de flux**).
5. *Statut → IPsec* : le tunnel doit être **établi** ; tester par un `ping` d'un poste à l'autre.

### 3. Dépanner un tunnel

| Symptôme | Piste |
|---|---|
| Phase 1 ne monte pas | **Clé**, **IP du pair**, algorithmes ou version IKE **différents** ; UDP 500/4500 bloqué |
| Phase 1 OK, phase 2 non | Les **réseaux** local/distant ne sont pas **le miroir** l'un de l'autre |
| Tunnel établi mais pas de ping | **Règles** de l'onglet IPsec, pare-feu **Windows** du poste, passerelle des postes |
| Les deux LAN ont la même plage | **Impossible à router** : il faut des plages **différentes** sur chaque site |

Les journaux sont dans *Statut → Journaux système → IPsec*.

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **Site à site** | Passerelle ↔ passerelle, rien sur les postes |
| **Phase 1 (IKE)** | Authentification des pairs et clés, UDP 500 / 4500 |
| **Phase 2 (IPsec)** | Réseaux local ↔ distant, données en ESP |
| **PSK** | Clé pré-partagée, identique des deux côtés |
| **Miroir** | Local d'un côté = distant de l'autre |
| **NAT-T** | UDP 4500 quand un NAT est sur le chemin |
| **Vérifier** | Statut → IPsec, journaux IPsec, `ping` |

### ⚠️ Les pièges

- Deux sites avec **la même plage** IP (192.168.1.0/24 partout).
- Un seul paramètre différent en phase 1 (version, hachage, groupe DH) et le tunnel ne monte pas.
- Oublier les **règles de l'onglet IPsec** : tunnel « vert » mais rien ne passe.
- Une **clé pré-partagée** courte ou envoyée par mail en clair.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Le tunnel entre le siège (192.168.10.0/24) et l'agence (192.168.20.0/24) est établi en phase 1, mais pas en phase 2. Que vérifies-tu ?"
    Les **réseaux** de la phase 2 : au siège local 192.168.10.0/24 → distant 192.168.20.0/24, à l'agence **l'inverse** exact. Puis les **algorithmes** de phase 2 (identiques des deux côtés) et les journaux *IPsec*.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-16-reseau-et-securite-module-4-relier-des-sites-distants-de-maniere-securisee"></div>

<script type="application/json" id="quiz-cours-16-reseau-et-securite-module-4-relier-des-sites-distants-de-maniere-securisee-data">
[
  {
    "question": "Quelle est la différence entre un VPN site à site et un VPN d'accès distant ?",
    "options": [
      "Aucune",
      "Le site à site relie deux réseaux par leurs passerelles, sans client sur les postes",
      "Le site à site n'est pas chiffré",
      "L'accès distant relie deux agences"
    ],
    "correctIndex": 1,
    "explanation": "Les postes de l'agence n'ont rien à installer."
  },
  {
    "question": "Que fait la phase 1 (IKE) d'IPsec ?",
    "options": [
      "Elle transporte les données",
      "Elle authentifie les deux passerelles et négocie les clés",
      "Elle attribue les adresses IP",
      "Elle filtre le Web"
    ],
    "correctIndex": 1,
    "explanation": "La phase 2 transporte ensuite les données."
  },
  {
    "question": "Que définit la phase 2 ?",
    "options": [
      "Le mot de passe administrateur",
      "Les réseaux local et distant qui passent dans le tunnel",
      "Le nom d'hôte",
      "Le DNS"
    ],
    "correctIndex": 1,
    "explanation": "Les données y sont chiffrées en ESP."
  },
  {
    "question": "Quel port UDP utilise IKE ?",
    "options": [
      "53",
      "500",
      "1194",
      "3389"
    ],
    "correctIndex": 1,
    "explanation": "Et UDP 4500 pour le NAT-T."
  },
  {
    "question": "Qu'est-ce qu'une PSK ?",
    "options": [
      "Un protocole de routage",
      "Une clé pré-partagée, identique sur les deux passerelles",
      "Un certificat public",
      "Un port"
    ],
    "correctIndex": 1,
    "explanation": "Elle doit être longue et transmise de façon sûre."
  },
  {
    "question": "Le tunnel est établi mais aucun ping ne passe. Que vérifier en premier ?",
    "options": [
      "La version de Windows",
      "Les règles de l'onglet IPsec du pare-feu",
      "Le câble d'alimentation",
      "Le DHCP"
    ],
    "correctIndex": 1,
    "explanation": "Sans règle, le trafic du tunnel est bloqué."
  },
  {
    "question": "Pourquoi les deux sites doivent-ils avoir des plages IP différentes ?",
    "options": [
      "Pour le DHCP",
      "Sinon le routage entre les deux LAN est impossible",
      "Pour le Wi-Fi",
      "Ce n'est pas nécessaire"
    ],
    "correctIndex": 1,
    "explanation": "Une même plage des deux côtés empêche de savoir où envoyer les paquets."
  },
  {
    "question": "In IPsec, which protocol carries the encrypted data?",
    "options": [
      "ESP",
      "ARP",
      "ICMP",
      "DHCP"
    ],
    "correctIndex": 0,
    "explanation": "ESP (Encapsulating Security Payload), protocole IP 50."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-16-reseau-et-securite-module-4-relier-des-sites-distants-de-maniere-securisee",
      dataId: "quiz-cours-16-reseau-et-securite-module-4-relier-des-sites-distants-de-maniere-securisee-data",
    });
  });
</script>
