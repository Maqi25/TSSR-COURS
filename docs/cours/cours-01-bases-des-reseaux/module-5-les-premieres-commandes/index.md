# Module 5 : Les premières commandes

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Connaître **les 5 commandes de base** pour voir sa configuration réseau et trouver d'où vient une panne :

| Commande | Question à laquelle elle répond |
|---|---|
| `ipconfig` / `ip a` | **Quelle est ma configuration ?** (IP, masque, passerelle) |
| `ping` | **Est-ce que cette machine me répond ?** |
| `tracert` / `traceroute` | **Par où passent mes paquets, et où ça bloque ?** |
| `arp -a` | **Quelles adresses MAC mon poste connaît-il ?** |
| `netstat` | **Quelles connexions sont ouvertes sur mon poste ?** |

!!! tip "Où taper ces commandes ?"
    - **Windows** : touche ++win++, tape `cmd`, puis Entrée → l'**invite de commandes** s'ouvre.
    - **Linux** : ouvre le **Terminal** (++ctrl+alt+t++ sur Ubuntu/Debian).

## 🖼️ Résumé visuel

**La méthode de dépannage : on part de son poste et on s'éloigne, étape par étape.** La première étape qui échoue indique où est la panne.

```mermaid
flowchart TD
    A["① ipconfig<br/>J'ai une IP correcte ?"] -->|"✅"| B["② ping 127.0.0.1<br/>Ma carte réseau marche ?"]
    A -->|"❌ 169.254.x.x"| A1["🔧 Problème DHCP<br/>(câble, serveur DHCP)"]
    B -->|"✅"| C["③ ping passerelle<br/>ex. 192.168.1.1<br/>Mon réseau local marche ?"]
    B -->|"❌"| B1["🔧 Carte réseau / pilote"]
    C -->|"✅"| D["④ ping 8.8.8.8<br/>J'ai accès à Internet ?"]
    C -->|"❌"| C1["🔧 Câble, switch, Wi-Fi,<br/>ou mauvaise IP/masque"]
    D -->|"✅"| E["⑤ ping google.fr<br/>Les noms fonctionnent ?"]
    D -->|"❌"| D1["🔧 Box / FAI / routeur<br/>→ tracert 8.8.8.8"]
    E -->|"✅"| OK(["🎉 Tout fonctionne"])
    E -->|"❌"| E1["🔧 Problème DNS<br/>→ ipconfig /flushdns"]
```

## 📖 Cours consolidé

💡 Toutes les commandes Windows ↔ Linux sont regroupées dans la **fiche de révision**. Ici : à quoi sert chaque commande et **comment lire** ce qu'elle affiche.

### 1. `ipconfig` / `ip a` : voir sa configuration

La **première commande** en cas de problème : IP, masque, passerelle.

```
Carte Ethernet Ethernet :
   Adresse IPv4. . . . . . . . . . . . . .: 192.168.1.100    ← mon IP
   Masque de sous-réseau. . . . . . . . . : 255.255.255.0    ← donc réseau 192.168.1.0/24
   Passerelle par défaut. . . . . . . . . : 192.168.1.1      ← ma box / mon routeur
```

- Sous Linux : `ip a` (adresses) et `ip r` (passerelle sur la ligne `default via 192.168.1.1`).
- `ipconfig /all` ajoute la **MAC**, les **DNS** et le **DHCP**.
- 🩺 IP en **169.254.x.x** = pas de réponse **DHCP** → `ipconfig /release` puis `/renew`, vérifier câble ou Wi-Fi.

---

### 2. `ping` : la machine répond-elle ?

Envoie un **ICMP Echo Request** et attend l'**Echo Reply**. Windows s'arrête après **4 essais** ; Linux continue **sans fin** (++ctrl+c++).

```
Réponse de 8.8.8.8 : octets=32 temps=18 ms TTL=115
Paquets : envoyés = 4, reçus = 4, perdus = 0 (perte 0%)
```

| Je lis… | Ça veut dire… |
|---|---|
| `temps=18 ms` | Durée de l'**aller-retour** (< 50 ms = bien) |
| `TTL=115` | Nombre de routeurs que le paquet pouvait encore traverser |
| `Délai d'attente dépassé` | Machine éteinte, injoignable **ou pare-feu** qui bloque le ping |
| `Impossible de joindre l'hôte` | Pas de chemin : souvent une **passerelle** absente ou fausse |
| `ping 8.8.8.8` OK mais `ping google.fr` KO | Internet OK, **DNS** en panne |

⚠️ Pas de réponse **≠** machine éteinte : le pare-feu de Windows bloque le ping par défaut.

---

### 3. `tracert` / `traceroute` : où ça bloque ?

Affiche **chaque routeur traversé** (« saut ») jusqu'à la destination.

```
 1    <1 ms   <1 ms   <1 ms   192.168.1.1     ← ma box (1er saut)
 2    12 ms   10 ms   11 ms   10.0.0.1        ← le fournisseur d'accès
 3     *       *       *      Délai dépassé   ← routeur qui ne répond pas (souvent filtré)
 4    20 ms   19 ms   19 ms   8.8.8.8         ← arrivé !
```

- **1er saut** muet → problème **chez moi** (câble, box) · arrêt **plus loin** → problème **à l'extérieur**.
- `* * *` puis ça repart : **normal**, ce routeur ne répond juste pas aux tests.
- 💡 Principe : TTL = 1, puis 2, puis 3… Le routeur qui fait tomber le TTL à 0 renvoie une erreur et **révèle son adresse**.

---

### 4. `arp -a` : les MAC déjà connues

Affiche la **table ARP** : les couples **IP ↔ MAC** appris par le poste (voir le [module 4](../module-4-la-communication/index.md#2-ping-dans-le-meme-reseau-arp)).

```
  Adresse Internet      Adresse physique      Type
  192.168.1.1           a4-2b-b0-12-34-56     dynamique    ← la MAC de ma box
  192.168.1.255         ff-ff-ff-ff-ff-ff     statique     ← le broadcast
```

💡 Fais un `ping` vers un voisin, puis `arp -a` : sa MAC apparaît.

---

### 5. `netstat` / `ss` : les connexions ouvertes

Liste les **connexions en cours** et les **ports en écoute**.

```
  Proto  Adresse locale         Adresse distante       État
  TCP    0.0.0.0:3389           0.0.0.0:0              LISTENING     ← j'attends des connexions (bureau à distance)
  TCP    192.168.1.100:52314    142.250.74.68:443      ESTABLISHED   ← connexion ouverte vers un site HTTPS
```

- **LISTENING** = un programme **attend** des connexions · **ESTABLISHED** = connexion **active**.
- `netstat -ano` donne aussi le **n° du processus** ; sous Linux, `netstat` est remplacé par **`ss`**.

## 📝 Fiche de révision

### 🪟🐧 Windows ↔ Linux : la table d'équivalence

| Je veux… | Windows | Linux |
|---|---|---|
| Ma configuration (IP, masque) | `ipconfig` · `ipconfig /all` | `ip a` |
| Ma passerelle | `ipconfig` | `ip r` |
| Renouveler mon IP (DHCP) | `ipconfig /release` + `/renew` | — |
| Vider le cache DNS | `ipconfig /flushdns` | — |
| Tester une machine | `ping` (4 fois) · `-n 10` · `-t` | `ping` (sans fin) · `-c 10` |
| Voir le chemin | `tracert` | `traceroute` |
| Table ARP | `arp -a` | `ip neigh` |
| Connexions et ports | `netstat -an` · `-ano` | `ss -tuan` · `ss -tulpn` |

### 🩺 La méthode de dépannage en 5 étapes

| # | Je tape | Si ça échoue, le problème vient… |
|---|---|---|
| ① | `ipconfig` | d'une IP absente ou en **169.254** → **DHCP** |
| ② | `ping 127.0.0.1` | de la **carte réseau** ou de son pilote |
| ③ | `ping 192.168.1.1` (ma passerelle) | du **réseau local** (câble, Wi-Fi, switch, IP/masque) |
| ④ | `ping 8.8.8.8` | de la **box / du FAI** → `tracert 8.8.8.8` |
| ⑤ | `ping google.fr` | du **DNS** → `ipconfig /flushdns` |

### ⚠️ Les pièges

- Sous **Linux**, `ping` ne s'arrête pas tout seul : ++ctrl+c++.
- **Pas de réponse au ping ≠ machine éteinte** : un pare-feu peut bloquer l'ICMP.
- **`* * *`** dans un `tracert` n'est pas forcément une panne.
- `ipconfig` est **Windows** ; sous Linux c'est **`ip a`** (l'ancien `ifconfig` est obsolète).

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Ton PC affiche l'IP 169.254.23.7. Que se passe-t-il et que fais-tu ?"
    Le poste n'a reçu **aucune réponse du serveur DHCP** et s'est donné une adresse **APIPA**. Vérifie le câble ou le Wi-Fi, puis tape `ipconfig /release` et `ipconfig /renew`. Si ça ne marche toujours pas, le **serveur DHCP** (souvent la box) est en cause.

??? question "2. `ping 8.8.8.8` répond, mais `ping www.google.fr` affiche « hôte inconnu ». Où est le problème ?"
    Internet fonctionne (8.8.8.8 répond), mais le nom n'est pas traduit en adresse : c'est un problème de **DNS**. Commence par `ipconfig /flushdns`, puis vérifie les serveurs DNS avec `ipconfig /all`.

??? question "3. `ping 192.168.1.1` (ta passerelle) ne répond pas, `ping 127.0.0.1` répond. Où chercher ?"
    La carte réseau fonctionne (127.0.0.1 OK) mais tu n'atteins pas ta box : la panne est sur le **réseau local**. Vérifie le **câble ou le Wi-Fi**, et avec `ipconfig` que ton **IP et ton masque** sont bien dans le réseau de la passerelle.

??? question "4. Quelle commande pour savoir quel programme écoute sur le port 3389 sous Windows ?"
    `netstat -ano` : la colonne de droite donne le **numéro de processus (PID)** associé au port, que tu retrouves ensuite dans le Gestionnaire des tâches.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes-data">
[
  {
    "question": "À quoi sert la commande ARP dans un réseau local ?",
    "options": [
      "À faire correspondre une adresse IP à une adresse MAC",
      "À résoudre un nom de domaine en adresse IP",
      "À attribuer dynamiquement une adresse IP à un hôte",
      "À chiffrer les communications entre deux machines"
    ],
    "correctIndex": 0,
    "explanation": "ARP (Address Resolution Protocol) permet de faire correspondre une adresse IP (couche Réseau) à une adresse MAC (couche Liaison) afin que les données puissent être acheminées correctement au sein du réseau local."
  },
  {
    "question": "Quelle commande permet d'afficher la table ARP locale sous Windows ou Linux ?",
    "options": [
      "arp -s",
      "arp -a",
      "ipconfig /all",
      "netstat -r"
    ],
    "correctIndex": 1,
    "explanation": "La commande arp -a liste toutes les associations IP/MAC actuellement connues par le système, stockées dans le cache ARP local."
  },
  {
    "question": "Que se passe-t-il lorsqu'une machine ne trouve pas l'adresse MAC correspondant à une IP cible dans sa table ARP ?",
    "options": [
      "Elle transmet automatiquement le paquet à la passerelle par défaut sans résolution",
      "Elle interroge un serveur DNS pour obtenir l'adresse MAC",
      "Elle envoie une requête ARP en broadcast à tous les appareils du réseau local",
      "Elle abandonne la communication sans autre tentative"
    ],
    "correctIndex": 2,
    "explanation": "Si l'adresse MAC n'est pas connue, la machine envoie une requête ARP broadcast du type « Qui a l'adresse IP X ? », et l'appareil concerné répond avec son adresse MAC."
  },
  {
    "question": "Quelle commande Windows affiche l'adresse IP, le masque de sous-réseau et la passerelle par défaut d'une interface réseau ?",
    "options": [
      "ipconfig",
      "arp -a",
      "tracert",
      "netstat -e"
    ],
    "correctIndex": 0,
    "explanation": "ipconfig affiche un résumé des configurations réseau des interfaces actives, incluant l'adresse IPv4, le masque de sous-réseau et la passerelle par défaut."
  },
  {
    "question": "Quelle option de ipconfig permet d'obtenir des informations détaillées comme l'adresse MAC et les serveurs DNS utilisés ?",
    "options": [
      "ipconfig /release",
      "ipconfig /all",
      "ipconfig /flushdns",
      "ipconfig /renew"
    ],
    "correctIndex": 1,
    "explanation": "ipconfig /all fournit une vue exhaustive des paramètres réseau d'une interface, y compris l'adresse physique (MAC), les serveurs DNS et les informations de bail DHCP."
  },
  {
    "question": "Sous Windows, si une machine obtient une adresse commençant par 169.254.x.x via ipconfig, que cela indique-t-il généralement ?",
    "options": [
      "Une configuration IPv6 correcte",
      "Une adresse publique attribuée par le FAI",
      "Une adresse réservée au multicast",
      "Un problème avec le serveur DHCP : la machine s'est auto-attribué une adresse APIPA"
    ],
    "correctIndex": 3,
    "explanation": "Une adresse dans la plage 169.254.x.x correspond à une adresse APIPA, que la machine s'attribue automatiquement lorsqu'elle ne parvient pas à contacter un serveur DHCP."
  },
  {
    "question": "Quelle commande Linux permet d'afficher la table de routage du système ?",
    "options": [
      "ip link",
      "ip route",
      "ip addr",
      "ip neigh"
    ],
    "correctIndex": 1,
    "explanation": "La commande ip route affiche la table de routage, incluant la route par défaut et les réseaux directement connectés."
  },
  {
    "question": "Quel protocole est utilisé par la commande ping pour tester la connectivité vers une machine distante ?",
    "options": [
      "ARP (Address Resolution Protocol)",
      "TCP (Transmission Control Protocol)",
      "ICMP (Internet Control Message Protocol)",
      "DNS (Domain Name System)"
    ],
    "correctIndex": 2,
    "explanation": "ping envoie des paquets ICMP Echo Request à la machine cible et attend un ICMP Echo Reply pour vérifier la connectivité et mesurer la latence."
  },
  {
    "question": "Que mesure le temps affiché (time=) dans le résultat d'une commande ping ?",
    "options": [
      "La bande passante disponible entre les deux machines",
      "Le nombre de routeurs traversés par le paquet",
      "La taille du paquet ICMP envoyé",
      "Le temps aller-retour (RTT, Round-Trip Time) du paquet entre les deux machines"
    ],
    "correctIndex": 3,
    "explanation": "Le champ time= indique le temps aller-retour (Round-Trip Time) nécessaire pour que le paquet ICMP atteigne la destination et que la réponse revienne."
  },
  {
    "question": "La commande ping permet-elle de mesurer la bande passante d'une connexion réseau ?",
    "options": [
      "Oui, c'est sa fonction principale",
      "Non, elle mesure uniquement la latence et la perte de paquets",
      "Oui, mais uniquement avec l'option -s",
      "Oui, en combinaison avec tracert"
    ],
    "correctIndex": 1,
    "explanation": "ping est limité à la mesure de la latence (RTT) et du taux de perte de paquets ; il ne fournit aucune information sur la bande passante disponible d'une connexion."
  },
  {
    "question": "Quelle commande affiche les connexions réseau actives (TCP/UDP) et les ports d'écoute d'un système ?",
    "options": [
      "tracert",
      "arp",
      "netstat",
      "ipconfig"
    ],
    "correctIndex": 2,
    "explanation": "netstat (network statistics) fournit des informations détaillées sur les connexions réseau actives, les ports d'écoute et les statistiques d'interface d'un système."
  },
  {
    "question": "Dans les résultats de netstat, que signifie l'état ESTABLISHED pour une connexion TCP ?",
    "options": [
      "Le port attend des connexions entrantes sans qu'aucune ne soit établie",
      "La connexion a été fermée par l'autre partie et attend une fermeture locale",
      "Une requête de connexion a été envoyée mais n'est pas encore établie",
      "La connexion est active et opérationnelle"
    ],
    "correctIndex": 3,
    "explanation": "L'état ESTABLISHED indique qu'une connexion TCP est pleinement active entre les deux extrémités, contrairement à LISTEN (en attente) ou SYN_SENT (en cours d'établissement)."
  },
  {
    "question": "Quel est le rôle principal de la commande tracert (ou traceroute sous Linux) ?",
    "options": [
      "Afficher les ports en écoute sur la machine locale",
      "Identifier tous les routeurs intermédiaires traversés par les paquets jusqu'à une destination donnée",
      "Attribuer une adresse IP statique à une interface réseau",
      "Chiffrer les paquets envoyés vers une destination"
    ],
    "correctIndex": 1,
    "explanation": "tracert (ou traceroute) révèle le chemin réseau emprunté par les paquets en identifiant chaque routeur intermédiaire (« hop ») entre la machine locale et la destination."
  },
  {
    "question": "Comment tracert parvient-elle à identifier chaque routeur intermédiaire sur le chemin vers une destination ?",
    "options": [
      "En interrogeant directement chaque routeur via une requête ARP",
      "En consultant la table de routage du serveur DNS",
      "En augmentant progressivement la valeur du TTL des paquets envoyés, ce qui provoque une réponse ICMP « TTL exceeded » à chaque saut",
      "En demandant au serveur cible de lister les routeurs traversés"
    ],
    "correctIndex": 2,
    "explanation": "tracert envoie des paquets avec un TTL croissant (1, 2, 3...) ; chaque routeur qui décrémente le TTL à 0 renvoie un message ICMP « TTL exceeded », ce qui permet d'identifier les routeurs successifs."
  },
  {
    "question": "Dans un résultat de tracert, que signifie une ligne contenant des astérisques (* * *) ?",
    "options": [
      "Le paquet a atteint sa destination finale avec succès",
      "La connexion a été interrompue définitivement",
      "Le routeur a redirigé le trafic vers un autre chemin",
      "Le routeur intermédiaire correspondant n'a pas répondu, souvent en raison d'un filtrage ICMP"
    ],
    "correctIndex": 3,
    "explanation": "Des astérisques à la place des temps de réponse indiquent que le routeur à ce saut n'a pas répondu dans le délai imparti, souvent parce qu'il filtre ou bloque les messages ICMP."
  },
  {
    "question": "ping 8.8.8.8 répond, mais ping www.google.fr échoue. D'où vient le problème ?",
    "options": [
      "De la carte réseau",
      "Du câble",
      "Du DNS (résolution des noms)",
      "Du serveur DHCP"
    ],
    "correctIndex": 2,
    "explanation": "Si une IP d'Internet répond, la connexion fonctionne. Si le nom ne marche pas, c'est la traduction nom → IP qui échoue : le DNS."
  },
  {
    "question": "Dans la méthode de dépannage, ping 127.0.0.1 répond mais pas le ping vers la passerelle. Où est la panne ?",
    "options": [
      "Sur le réseau local (câble, Wi-Fi, IP/masque)",
      "Chez le fournisseur d'accès",
      "Sur le serveur DNS",
      "Sur le site web visité"
    ],
    "correctIndex": 0,
    "explanation": "127.0.0.1 teste la carte réseau du poste lui-même. Si elle répond mais pas la passerelle, le problème est entre le poste et la box : câble, Wi-Fi, switch ou mauvaise configuration IP/masque."
  },
  {
    "question": "Sous Linux, comment arrêter un ping lancé sans option ?",
    "options": [
      "Il s'arrête seul après 4 essais",
      "Avec Ctrl + C",
      "Avec la commande stop",
      "Avec Échap"
    ],
    "correctIndex": 1,
    "explanation": "Sous Linux, ping est continu par défaut : on l'arrête avec Ctrl + C (ou on limite le nombre d'essais avec -c). Sous Windows, il s'arrête seul après 4 essais."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes",
      dataId: "quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes-data",
    });
  });
</script>
