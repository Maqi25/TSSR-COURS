# Module 5 : Gestion du réseau

*Cours : [Cours 4 - Administration d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

- Voir la **configuration réseau** d'un serveur (`ip a`, `ip r`).
- Donner une **adresse IP fixe** à un serveur Debian (`/etc/network/interfaces`).
- Configurer le **DNS**, le **nom de la machine** et le fichier **`/etc/hosts`**.
- **Vérifier** et **dépanner** le réseau.

!!! abstract "En clair"
    Un serveur doit **toujours avoir la même adresse IP** : les postes et les autres serveurs doivent savoir où le trouver ([cours 2, module 7](../../cours-02-systeme-client-microsoft/module-7-la-gestion-du-reseau-et-du-pare-feu/index.md)). Sous Debian serveur, on l'écrit dans un **fichier texte** de configuration. C'est l'équivalent de la fenêtre « Propriétés IPv4 » de Windows, mais en texte.

## 🖼️ Résumé visuel

**Les 4 fichiers du réseau Debian**

```mermaid
flowchart LR
    S(["🐧 Serveur Debian"]) --> I["📄 <b>/etc/network/interfaces</b><br/>IP, masque, passerelle<br/>(DHCP ou fixe)"]
    S --> D["📄 <b>/etc/resolv.conf</b><br/>serveurs DNS"]
    S --> H["📄 <b>/etc/hostname</b><br/>nom de la machine"]
    S --> T["📄 <b>/etc/hosts</b><br/>noms ↔ IP connus<br/>localement"]
    I -->|"appliquer :<br/>systemctl restart networking"| OK["✅ Réseau"]
```

## 📖 Cours consolidé

### 1. Voir la configuration

| Je veux… | Linux | Windows |
|---|---|---|
| Les **adresses IP** | **`ip a`** | `ipconfig` |
| La **passerelle** | **`ip r`** | `ipconfig` |
| Les **DNS** | `cat /etc/resolv.conf` | `ipconfig /all` |
| Le **nom** | `hostname` · `hostnamectl` | `hostname` |
| Les **ports ouverts** | `ss -tulpn` | `netstat -ano` |

```text
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> ...       ← nom de la carte (UP = active)
    link/ether 00:0c:29:3a:0b:12                       ← adresse MAC
    inet 192.168.1.50/24 brd 192.168.1.255             ← IPv4 + masque + broadcast
    inet6 fe80::20c:29ff:fe3a:b12/64                   ← IPv6 lien-local
```

📌 Les cartes s'appellent **`ens33`**, **`enp0s3`**, `eth0`… : repère d'abord **la tienne** avec `ip a` (`lo` = la boucle locale).

---

### 2. Configurer l'IP : `/etc/network/interfaces`

Le fichier réseau de **Debian serveur** (`sudo nano /etc/network/interfaces`).

```text
# DHCP
auto ens33                 # activer la carte au démarrage
iface ens33 inet dhcp

# IP fixe (serveur) ✅
auto ens33
iface ens33 inet static
    address 192.168.1.50/24       # IP + masque en CIDR
    gateway 192.168.1.1           # la passerelle
    dns-nameservers 192.168.1.1   # DNS (si le paquet resolvconf est installé)
```

```bash
sudo systemctl restart networking      # appliquer (ou ifdown ens33 && ifup ens33)
```

- ⚠️ **En SSH**, changer l'IP **coupe ta connexion** : reconnecte-toi sur la nouvelle. Garde un **accès console** en cas d'erreur.
- 💡 IP de **test** (perdue au redémarrage) : `sudo ip addr add 192.168.1.60/24 dev ens33`.
- 📌 Sur les **postes avec bureau**, c'est **NetworkManager** (`nmcli`) qui gère le réseau.

---

### 3. DNS, nom de machine et `/etc/hosts`

| Fichier | Rôle | Exemple |
|---|---|---|
| **`/etc/resolv.conf`** | Les **serveurs DNS** | `nameserver 192.168.1.1` |
| **`/etc/hostname`** | Le **nom** de la machine | `srv-web01` |
| **`/etc/hosts`** | **Nom → IP** connus localement, lus **avant** le DNS | `192.168.1.50  srv-web01.entreprise.local srv-web01` |

```bash
sudo hostnamectl set-hostname srv-web01     # changer le nom (mettre /etc/hosts à jour aussi)
```

💡 `/etc/hosts` permet de nommer une machine **sans serveur DNS** (pratique en TP).

---

### 4. Vérifier et dépanner

La méthode du [cours 1, module 5](../../cours-01-bases-des-reseaux/module-5-les-premieres-commandes/index.md) :

| # | Commande | Si ça échoue… |
|---|---|---|
| ① | `ip a` | Pas d'IP ou carte `DOWN` → `/etc/network/interfaces` |
| ② | `ping -c 3 192.168.1.1` | Réseau local |
| ③ | `ping -c 3 8.8.8.8` | Passerelle / routeur → `ip r` |
| ④ | `ping -c 3 debian.org` | **DNS** → `/etc/resolv.conf` |
| ⑤ | `ss -tulpn` | Le service écoute-t-il sur le bon port ? |

```text
tcp LISTEN 0 128 0.0.0.0:22  users:(("sshd",pid=612))   ← SSH écoute bien sur le port 22
```

`ss -tulpn` : **t** TCP · **u** UDP · **l** en écoute · **p** programme · **n** numéros.

## 📝 Fiche de révision

| Commande / fichier | Rôle |
|---|---|
| `ip a` / `ip r` | Adresses / routes (passerelle) |
| `/etc/network/interfaces` | Configuration IP (DHCP ou static) |
| `systemctl restart networking` | Appliquer |
| `/etc/resolv.conf` | Serveurs DNS |
| `/etc/hostname` · `hostnamectl` | Nom de la machine |
| `/etc/hosts` | Résolution locale nom → IP |
| `ss -tulpn` | Ports en écoute |
| `ping -c 3` | Tester (3 essais) |

**⚠️ Les pièges**

- Un **mauvais nom de carte** (`eth0` au lieu de `ens33`) → le réseau ne démarre pas.
- Oublier la **passerelle** → le réseau local marche, mais pas Internet.
- Sous Linux, `ping` ne s'arrête pas tout seul : `-c 3` ou ++ctrl+c++.

??? question "1. Configure ens33 en IP fixe 10.0.0.10/24, passerelle 10.0.0.254."
    Dans `/etc/network/interfaces` :
    ```text
    auto ens33
    iface ens33 inet static
        address 10.0.0.10/24
        gateway 10.0.0.254
    ```
    Puis `sudo systemctl restart networking` et `ip a` pour vérifier.

??? question "2. Le serveur ping 8.8.8.8 mais pas debian.org. Où regarder ?"
    C'est un problème de **DNS** : vérifier `/etc/resolv.conf` (une ligne `nameserver` correcte).

??? question "3. Comment vérifier que le serveur web écoute sur le port 80 ?"
    `sudo ss -tulpn | grep :80`

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-5-gestion-du-reseau"></div>

<script type="application/json" id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-5-gestion-du-reseau-data">
[
  {
    "question": "Quelle commande Linux affiche les adresses IP des cartes réseau ?",
    "options": [
      "ipconfig",
      "ip a",
      "ifconfig /all",
      "netstat -r"
    ],
    "correctIndex": 1,
    "explanation": "ip a (ip address) affiche les cartes, leurs adresses MAC, IPv4 et IPv6. C'est l'équivalent de ipconfig sous Windows."
  },
  {
    "question": "Quelle commande affiche la passerelle par défaut ?",
    "options": [
      "ip a",
      "ip r",
      "cat /etc/hostname",
      "ss -tulpn"
    ],
    "correctIndex": 1,
    "explanation": "ip r (ip route) affiche la table de routage ; la ligne « default via » indique la passerelle."
  },
  {
    "question": "Dans quel fichier configure-t-on l'adresse IP d'un serveur Debian ?",
    "options": [
      "/etc/resolv.conf",
      "/etc/network/interfaces",
      "/etc/hosts",
      "/etc/ip.conf"
    ],
    "correctIndex": 1,
    "explanation": "/etc/network/interfaces décrit chaque carte : en dhcp, ou en static avec address et gateway."
  },
  {
    "question": "Quel mot-clé indique une adresse IP fixe dans /etc/network/interfaces ?",
    "options": [
      "inet dhcp",
      "inet static",
      "inet fixed",
      "inet manual-ip"
    ],
    "correctIndex": 1,
    "explanation": "iface ens33 inet static, suivi des lignes address et gateway, configure une IP fixe."
  },
  {
    "question": "Quelle commande applique la nouvelle configuration réseau ?",
    "options": [
      "sudo systemctl restart networking",
      "sudo apt update",
      "sudo reboot GRUB",
      "ip r"
    ],
    "correctIndex": 0,
    "explanation": "Redémarrer le service networking relit /etc/network/interfaces. ifdown puis ifup sur la carte fonctionne aussi."
  },
  {
    "question": "Quel fichier contient les serveurs DNS utilisés ?",
    "options": [
      "/etc/hosts",
      "/etc/resolv.conf",
      "/etc/hostname",
      "/etc/dns"
    ],
    "correctIndex": 1,
    "explanation": "/etc/resolv.conf liste les serveurs DNS avec des lignes « nameserver adresse »."
  },
  {
    "question": "À quoi sert le fichier /etc/hosts ?",
    "options": [
      "À lister les utilisateurs",
      "À associer localement des noms à des IP, consultés avant le DNS",
      "À configurer le pare-feu",
      "À définir la passerelle"
    ],
    "correctIndex": 1,
    "explanation": "/etc/hosts fait la résolution de noms en local, sans serveur DNS : pratique en TP ou pour forcer une adresse."
  },
  {
    "question": "Quelle commande change le nom de la machine ?",
    "options": [
      "hostname --delete",
      "hostnamectl set-hostname srv-web01",
      "ip name srv-web01",
      "rename srv-web01"
    ],
    "correctIndex": 1,
    "explanation": "hostnamectl set-hostname modifie /etc/hostname et le nom actif. On met aussi /etc/hosts à jour."
  },
  {
    "question": "Quelle commande liste les ports en écoute et les programmes associés ?",
    "options": [
      "ss -tulpn",
      "ip a",
      "ping -c 3",
      "cat /etc/hosts"
    ],
    "correctIndex": 0,
    "explanation": "ss -tulpn : TCP, UDP, en écoute (listening), programme (process), en numérique. C'est le remplaçant moderne de netstat."
  },
  {
    "question": "Dans /etc/network/interfaces, quelle ligne demande une adresse à un serveur DHCP ?",
    "options": [
      "iface ens33 inet static",
      "iface ens33 inet dhcp",
      "auto dhcp",
      "address dhcp"
    ],
    "correctIndex": 1,
    "explanation": "inet dhcp = adresse automatique. inet static = adresse fixe, avec les lignes address et gateway."
  },
  {
    "question": "Quel mot-clé indique la passerelle par défaut dans /etc/network/interfaces ?",
    "options": [
      "router",
      "route",
      "gateway",
      "default"
    ],
    "correctIndex": 2,
    "explanation": "La ligne gateway 192.168.1.1 désigne la passerelle, c'est-à-dire la sortie vers les autres réseaux."
  },
  {
    "question": "Dans ss -tulpn, que signifient t et u ?",
    "options": [
      "TCP et UDP",
      "Terminal et utilisateur",
      "Temps et uptime",
      "Total et unique"
    ],
    "correctIndex": 0,
    "explanation": "t = TCP, u = UDP, l = ports en écoute, p = programme associé, n = numéros au lieu des noms."
  },
  {
    "question": "ping 8.8.8.8 répond, mais ping debian.org échoue. Où se situe le problème ?",
    "options": [
      "Dans le câble",
      "Dans la carte réseau",
      "Dans la passerelle",
      "Dans le DNS (/etc/resolv.conf)"
    ],
    "correctIndex": 3,
    "explanation": "Internet est joignable par son adresse IP, donc le réseau marche. Seule la traduction des noms (DNS) pose problème."
  },
  {
    "question": "Le ping vers la passerelle 192.168.1.1 échoue. Quelle est la conclusion la plus probable ?",
    "options": [
      "Un problème sur le réseau local (câble, IP, masque, VLAN)",
      "Un problème DNS",
      "Un problème chez le serveur web",
      "Tout fonctionne"
    ],
    "correctIndex": 0,
    "explanation": "Si même la passerelle, sur le réseau local, ne répond pas, le problème est proche : configuration IP, câble ou switch."
  },
  {
    "question": "Dans quel fichier se trouve le nom de la machine ?",
    "options": [
      "/etc/hosts",
      "/etc/hostname",
      "/etc/resolv.conf",
      "/etc/machine.conf"
    ],
    "correctIndex": 1,
    "explanation": "/etc/hostname contient le nom. On le modifie proprement avec hostnamectl set-hostname, et on met aussi à jour /etc/hosts."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-5-gestion-du-reseau",
      dataId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-5-gestion-du-reseau-data",
    });
  });
</script>
