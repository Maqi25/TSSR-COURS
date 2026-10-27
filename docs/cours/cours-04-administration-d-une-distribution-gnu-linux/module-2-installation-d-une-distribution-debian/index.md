# Module 2 : Installation d'une distribution Debian

*Cours : [Cours 4 - Administration d'une distribution GNU/Linux](../index.md)*

## 🎯 Objectif du module

- Préparer une **machine virtuelle** et l'**image ISO** de Debian.
- Dérouler l'**installateur** étape par étape, en faisant les bons choix pour un **serveur**.
- Faire les **premières actions** après l'installation.

!!! abstract "En clair"
    On installe Debian comme Windows ([cours 2, module 2](../../cours-02-systeme-client-microsoft/module-2-installation-de-windows-10/index.md)) : on démarre sur une **ISO**, un assistant pose des questions, puis on redémarre. La différence : pour un **serveur**, on n'installe **pas d'interface graphique**, seulement le strict nécessaire et le **serveur SSH** pour l'administrer à distance.

## 🖼️ Résumé visuel

**Les étapes de l'installateur Debian**

```mermaid
flowchart LR
    A["💿 Démarrer<br/>sur l'ISO<br/><b>netinst</b>"] --> B["🌍 Langue,<br/>pays,<br/>clavier"]
    B --> C["🌐 Réseau<br/>nom de machine<br/>+ domaine"]
    C --> D["👤 Mot de passe root<br/>+ 1er utilisateur"]
    D --> E["💽 Partitionnement<br/>(assisté)"]
    E --> F["📦 Miroir +<br/>logiciels :<br/>☑ SSH ☑ utilitaires<br/>☐ bureau"]
    F --> G["🚀 GRUB<br/>puis<br/>redémarrage"]
```

## 📖 Cours consolidé

### 1. Avant d'installer

| Élément | Choix pour un serveur de TP |
|---|---|
| **Image** | **`debian-13.x-amd64-netinst.iso`** (~ 700 Mo) sur **debian.org** : l'installateur télécharge le reste sur Internet |
| **Machine virtuelle** | 1 à 2 processeurs, **2 Go** de RAM, disque de **20 Go**, réseau **NAT** ou **Bridge** ([cours 2, module 2bis](../../cours-02-systeme-client-microsoft/module-2bis-vmware-workstation/index.md)) |
| **Prérequis minimum** | 1 Go de RAM et 10 Go de disque sans interface graphique |

💡 **netinst** = petite image qui installe par le réseau. Il existe aussi les **DVD complets** (sans Internet) et les images **« live »** (pour essayer sans installer).

---

### 2. L'installation, étape par étape

| # | Écran | Ton choix (et pourquoi) |
|---|---|---|
| ① | Menu de démarrage | **Install** (en mode texte, plus léger) ou *Graphical install* |
| ② | Langue / pays / clavier | Français · France · Français |
| ③ | **Nom de machine** | Un nom clair : `srv-web01` |
| ④ | **Nom de domaine** | `entreprise.local` (ou vide en TP) |
| ⑤ | **Mot de passe root** | Un mot de passe **fort**. 💡 Si tu le laisses **vide**, root est **désactivé** et ton 1ᵉʳ utilisateur reçoit **`sudo`** automatiquement |
| ⑥ | **Utilisateur** | Ton nom, identifiant (`tech`) et mot de passe |
| ⑦ | Fuseau horaire | Europe/Paris (choisi d'après le pays) |
| ⑧ | **Partitionnement** | **Assisté – utiliser un disque entier** → *Tout dans une seule partition* (débutant) ; ou *avec LVM* (plus souple, module 8) |
| ⑨ | Miroir | France → **`deb.debian.org`** |
| ⑩ | **Sélection des logiciels** | ☐ Environnement de bureau · ☐ GNOME · ☑ **Serveur SSH** · ☑ **Utilitaires usuels du système** |
| ⑪ | **GRUB** | **Oui**, sur le disque principal (`/dev/sda`) : c'est le programme qui démarre Linux (module 3) |
| ⑫ | Fin | Retirer l'ISO → **Continuer** → redémarrage |

⚠️ À l'étape ⑩, **décoche le bureau** : un serveur n'a pas besoin d'interface graphique. C'est plus léger, plus rapide, et plus sûr (moins de logiciels = moins de failles).

---

### 3. Après l'installation : les premiers réflexes

```bash
ip a                          # 1. noter l'adresse IP du serveur
su -                          # 2. devenir root (si root a un mot de passe)
apt update && apt upgrade     # 3. mettre le système à jour (module 6)
apt install sudo              # 4. installer sudo s'il n'y est pas…
usermod -aG sudo tech         #    …et autoriser l'utilisateur « tech » à l'utiliser
exit                          #    (tech doit se reconnecter pour que ce soit pris en compte)
```

Ensuite, **tout se fait à distance** depuis ton PC : `ssh tech@IP-du-serveur` ([cours 3, module 2](../../cours-03-utilisateur-d-une-distribution-gnu-linux/module-2-decouverte-du-systeme-d-exploitation-linux/index.md)).

💡 **Dans une VM VMware** : `apt install open-vm-tools` améliore l'intégration (l'équivalent des VMware Tools).

## 📝 Fiche de révision

| Étape | À retenir |
|---|---|
| **ISO** | `debian-13-amd64-netinst.iso` |
| **Nom de machine** | Nom clair : `srv-web01` |
| **root vide** | root désactivé, 1ᵉʳ utilisateur dans le groupe `sudo` |
| **Partitionnement** | Assisté, disque entier (LVM en option) |
| **Logiciels serveur** | SSH + utilitaires usuels, **sans bureau** |
| **GRUB** | Chargeur de démarrage, sur `/dev/sda` |
| **Après** | `apt update && apt upgrade`, `sudo`, SSH |

**⚠️ Les pièges**

- Oublier de **cocher le serveur SSH** → impossible d'administrer à distance (`apt install openssh-server` pour rattraper).
- Laisser le **bureau** coché sur un serveur.
- Après `usermod -aG sudo`, il faut **se reconnecter**.

??? question "1. Quels logiciels cocher à l'installation d'un serveur ?"
    **Serveur SSH** et **utilitaires usuels du système**, sans environnement de bureau.

??? question "2. Tu as oublié de cocher SSH. Comment rattraper ?"
    Sur la console du serveur, en root : `apt install openssh-server`. Le service démarre tout seul.

??? question "3. L'utilisateur tech ne peut pas utiliser sudo. Que faire ?"
    En root : `usermod -aG sudo tech`, puis tech **se déconnecte et se reconnecte**.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-2-installation-d-une-distribution-debian"></div>

<script type="application/json" id="quiz-cours-04-administration-d-une-distribution-gnu-linux-module-2-installation-d-une-distribution-debian-data">
[
  {
    "question": "Qu'est-ce qu'une image « netinst » de Debian ?",
    "options": [
      "Une image qui installe Windows",
      "Une petite image qui télécharge le reste du système par le réseau pendant l'installation",
      "Une image sans noyau",
      "Une sauvegarde complète d'un serveur"
    ],
    "correctIndex": 1,
    "explanation": "netinst (network install) contient le minimum pour démarrer l'installateur ; les paquets sont ensuite téléchargés depuis un miroir Debian."
  },
  {
    "question": "Que se passe-t-il si on laisse le mot de passe root vide à l'installation ?",
    "options": [
      "L'installation échoue",
      "root est désactivé et le premier utilisateur peut utiliser sudo",
      "root n'a pas de mot de passe et tout le monde peut se connecter",
      "Le serveur redémarre"
    ],
    "correctIndex": 1,
    "explanation": "Avec un mot de passe root vide, Debian désactive le compte root et ajoute le premier utilisateur au groupe sudo."
  },
  {
    "question": "Quels logiciels cocher pour un serveur ?",
    "options": [
      "Bureau GNOME uniquement",
      "Serveur SSH et utilitaires usuels, sans environnement de bureau",
      "Tous les logiciels",
      "Aucun"
    ],
    "correctIndex": 1,
    "explanation": "Un serveur s'administre à distance en SSH et n'a pas besoin d'interface graphique : moins de logiciels, c'est plus léger et plus sûr."
  },
  {
    "question": "À quoi sert GRUB, installé à la fin ?",
    "options": [
      "À gérer les utilisateurs",
      "À démarrer le système (chargeur de démarrage)",
      "À configurer le réseau",
      "À installer des paquets"
    ],
    "correctIndex": 1,
    "explanation": "GRUB est le chargeur de démarrage : il démarre le noyau Linux quand la machine s'allume (détails au module 3)."
  },
  {
    "question": "Quelle est la première commande à lancer après l'installation pour mettre le système à jour ?",
    "options": [
      "apt update && apt upgrade",
      "ipconfig /all",
      "sudo reboot now",
      "dpkg -l"
    ],
    "correctIndex": 0,
    "explanation": "apt update télécharge la liste des mises à jour, puis apt upgrade les installe (détails au module 6)."
  },
  {
    "question": "Comment autoriser l'utilisateur tech à utiliser sudo ?",
    "options": [
      "chmod +s tech",
      "usermod -aG sudo tech",
      "sudo add tech",
      "passwd sudo tech"
    ],
    "correctIndex": 1,
    "explanation": "usermod -aG sudo tech ajoute (-a) tech au groupe (-G) sudo. tech doit ensuite se reconnecter."
  },
  {
    "question": "Quelle commande installe le serveur SSH si on a oublié de le cocher ?",
    "options": [
      "apt install ssh-client",
      "apt install openssh-server",
      "systemctl ssh",
      "ssh --install"
    ],
    "correctIndex": 1,
    "explanation": "Le paquet openssh-server fournit le service SSH qui permet de se connecter à distance au serveur."
  },
  {
    "question": "Quel type d'image ISO télécharge-t-on le plus souvent pour installer un serveur Debian ?",
    "options": [
      "Une image DVD de 20 Go",
      "Une image netinst (installation par le réseau)",
      "Une image Windows",
      "Une image live uniquement"
    ],
    "correctIndex": 1,
    "explanation": "L'image netinst est petite : elle contient le minimum et télécharge le reste depuis Internet, donc les paquets sont déjà à jour."
  },
  {
    "question": "Pourquoi ne pas installer d'environnement de bureau sur un serveur ?",
    "options": [
      "C'est interdit par Debian",
      "Il consomme des ressources et ajoute des logiciels inutiles à maintenir",
      "Sinon SSH ne fonctionne pas",
      "Le bureau efface les journaux"
    ],
    "correctIndex": 1,
    "explanation": "Un serveur s'administre en ligne de commande, souvent à distance par SSH. Un bureau gaspille de la mémoire et augmente le nombre de logiciels à mettre à jour."
  },
  {
    "question": "Comment te connecter depuis ton PC Windows au serveur Debian (IP 192.168.1.50, utilisateur tech) ?",
    "options": [
      "rdp tech@192.168.1.50",
      "telnet 192.168.1.50 80",
      "ssh tech@192.168.1.50",
      "ping tech@192.168.1.50"
    ],
    "correctIndex": 2,
    "explanation": "Le client ssh est intégré à Windows (PowerShell ou Invite de commandes). Il ouvre un terminal sécurisé sur le serveur, à condition que le serveur SSH soit installé."
  },
  {
    "question": "Tu viens d'ajouter tech au groupe sudo, mais sudo refuse encore. Que faire ?",
    "options": [
      "Réinstaller Debian",
      "Supprimer le groupe sudo",
      "Redémarrer la box",
      "Se déconnecter puis se reconnecter"
    ],
    "correctIndex": 3,
    "explanation": "Les groupes d'un utilisateur sont lus à l'ouverture de session. Il faut se reconnecter pour que le nouveau groupe soit pris en compte."
  },
  {
    "question": "Quelle commande affiche l'adresse IP obtenue par le serveur après l'installation ?",
    "options": [
      "ipconfig",
      "ip a",
      "getip",
      "show ip"
    ],
    "correctIndex": 1,
    "explanation": "Sous Linux, ip a (ip address) liste les cartes réseau et leurs adresses. ipconfig est la commande Windows."
  },
  {
    "question": "Quel compte faut-il éviter d'utiliser au quotidien sur le serveur ?",
    "options": [
      "root",
      "tech",
      "Un compte avec sudo",
      "Un compte sans droits"
    ],
    "correctIndex": 0,
    "explanation": "root a tous les droits sans garde-fou. On travaille avec un compte normal et on utilise sudo seulement pour les tâches d'administration."
  },
  {
    "question": "Quelle commande redémarre le serveur ?",
    "options": [
      "sudo restart-pc",
      "sudo exit",
      "sudo reboot",
      "sudo logout"
    ],
    "correctIndex": 2,
    "explanation": "sudo reboot (ou sudo systemctl reboot) redémarre la machine. exit et logout ne font que fermer la session."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-2-installation-d-une-distribution-debian",
      dataId: "quiz-cours-04-administration-d-une-distribution-gnu-linux-module-2-installation-d-une-distribution-debian-data",
    });
  });
</script>
