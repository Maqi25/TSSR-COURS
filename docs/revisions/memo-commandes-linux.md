# Mémo · Commandes Linux / Unix

*Administration, diagnostic, dépannage · cours liés : [Cours 3 - Utilisateur d'une distribution GNU/Linux](../cours/cours-03-utilisateur-d-une-distribution-gnu-linux/index.md) · [Cours 4 - Administration d'une distribution GNU/Linux](../cours/cours-04-administration-d-une-distribution-gnu-linux/index.md)*

!!! info "Des repères, pas une vérité universelle"
    Les options varient selon l'Unix, la distribution et les outils installés. Valider sur la machine : `man commande`, `commande --help`.

## 📁 Fichiers & navigation

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `pwd` | Afficher le répertoire courant | `pwd` |
| `ls` | Lister ; `-l` détails, `-a` fichiers cachés | `ls -lah /var/log` |
| `cd` | Changer de répertoire ; `~` = dossier perso | `cd /etc` ; `cd ..` |
| `find` | Rechercher selon des critères | `find /var -name "*.log"` |
| `stat` | Métadonnées : taille, dates, droits | `stat fichier.conf` |
| `file` | Identifier le type réel d'un fichier | `file archive.tar.gz` |

Commencer par situer le chemin ; les espaces dans un nom se protègent avec des guillemets.

## ✂️ Manipulation & lecture

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `touch` / `mkdir` | Créer un fichier vide / un répertoire | `mkdir -p /tmp/test` |
| `cp` / `mv` | Copier / déplacer ou renommer | `cp -a source/ copie/` |
| `rm` | Supprimer ; `-r` récursif, `-f` force | `rm -i fichier` |
| `cat` / `less` | Lire ; `less` permet de parcourir | `less /etc/hosts` |
| `head` / `tail` | Début / fin ; `-f` suit un journal | `tail -n 50 -f app.log` |
| `grep` | Filtrer les lignes qui correspondent à un motif | `grep -in "error" app.log` |
| `wc` / `sort` / `uniq` | Compter, trier, dédupliquer | `sort noms.txt | uniq -c` |

Chemin avec espaces : `cp "mon fichier" cible`. **Vérifier le chemin avant toute suppression.**

## 🔐 Droits, propriétaires & identité

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `ls -l` | Lire les bits rwx : utilisateur / groupe / autres | `ls -l fichier` |
| `chmod` | Modifier les permissions (symbolique ou octal) | `chmod 640 secret.txt` |
| `chown` | Changer propriétaire et groupe (souvent root) | `sudo chown alice:ops fichier` |
| `umask` | Masque des droits par défaut | `umask 027` |
| `id` / `groups` | UID, GID et groupes effectifs | `id alice` ; `groups` |
| `whoami` / `who` | Compte courant / sessions ouvertes | `whoami` ; `who` |

!!! tip "À connaître par cœur"
    `640` = `rw-r-----` · `755` = `rwxr-xr-x`. Un répertoire exige `x` pour être traversé.

## 👥 Utilisateurs & groupes

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `useradd` / `adduser` | Créer un compte ; l'interface varie selon le système | `sudo useradd -m alice` |
| `passwd` | Définir ou changer un mot de passe | `sudo passwd alice` |
| `usermod` | Modifier compte / groupes ; `-aG` ajoute **sans retirer** | `sudo usermod -aG sudo alice` |
| `userdel` | Supprimer un compte ; `-r` retire son home | `sudo userdel -r alice` |
| `groupadd` / `gpasswd` | Créer un groupe / administrer ses membres | `sudo groupadd ops` |
| `getent passwd` | Interroger la base des comptes via NSS | `getent passwd alice` |

Debian / Ubuntu : `adduser` est souvent interactif. BSD et autres Unix peuvent avoir des options différentes.

## ⚙️ Processus & ressources

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `ps` | Instantané des processus | `ps aux` ; `ps -ef` |
| `top` / `htop` | Activité CPU / mémoire en temps réel | `top` |
| `pgrep` / `pkill` | Rechercher un processus / envoyer un signal par nom | `pgrep -a sshd` |
| `kill` | Envoyer un signal ; **TERM d'abord, KILL en dernier** | `kill -TERM 1234` |
| `nice` / `renice` | Ajuster la priorité de planification | `nice -n 10 commande` |
| `free` / `uptime` | Mémoire disponible / durée et charge | `free -h` ; `uptime` |
| `lsof` | Lister les fichiers ouverts (si installé) | `sudo lsof -i :22` |

La charge (*load average*) n'est pas un pourcentage CPU. Vérifier PID et propriétaire avant `kill`.

## 🚦 Services & démarrage

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `systemctl status` | État détaillé d'une unité (systemd) | `systemctl status ssh` |
| `systemctl start` / `stop` / `restart` | Démarrer, arrêter, redémarrer une unité | `sudo systemctl restart nginx` |
| `systemctl enable` / `disable` | Activer / désactiver au démarrage | `sudo systemctl enable --now ssh` |
| `systemctl is-active` / `is-enabled` | Contrôles simples d'état | `systemctl is-active cron` |
| `service` | Interface historique, parfois simple wrapper | `sudo service ssh status` |
| `rc-service` / `rc-update` | OpenRC : état / configuration du démarrage | `rc-service sshd status` |

`systemctl` concerne systemd, pas tous les Unix. Le nom du service peut différer (`ssh` / `sshd`).

## 📦 Paquets & logiciels

| Commande | Distribution | Exemple |
| --- | --- | --- |
| `apt` / `apt-get` | Debian / Ubuntu : indexer, installer, mettre à jour | `sudo apt update && sudo apt install curl` |
| `dpkg` | Debian bas niveau : paquet local / inventaire | `dpkg -l | grep openssh` |
| `dnf` / `yum` | Fedora / RHEL : installer et interroger | `sudo dnf install curl` |
| `rpm` | RPM bas niveau : interroger un paquet | `rpm -q openssh-server` |
| `zypper` | openSUSE | `sudo zypper install curl` |
| `pkg` | FreeBSD : installer / rechercher | `sudo pkg install curl` |

Privilégier le gestionnaire natif. Ne pas mélanger les dépôts ou outils de distributions différentes.

## 🌐 Réseau

=== "Interfaces, routes, DNS"

    | Commande | Rôle / repère | Exemple |
    | --- | --- | --- |
    | `ip addr` / `ip link` | Adresses et état des interfaces | `ip -br addr` |
    | `ip route` | Table de routage et passerelle | `ip route` |
    | `ping` | Joignabilité / latence ICMP | `ping -c 4 1.1.1.1` |
    | `ss -lntup` | Sockets TCP/UDP en écoute et processus | `sudo ss -lntup` |
    | `getent hosts` | Résolution via NSS (DNS et autres sources) | `getent hosts example.org` |
    | `dig` / `nslookup` | Interroger le DNS (si installés) | `dig example.org A` |
    | `traceroute` / `tracepath` | Observer le chemin réseau | `traceroute example.org` |

=== "Diagnostic & config"

    | Commande | Rôle / repère | Exemple |
    | --- | --- | --- |
    | `curl -I` / `wget` | Tester HTTP(S) / récupérer une ressource | `curl -I https://example.org` |
    | `nc` / `ncat` | Tester une connexion TCP (si installé) | `nc -vz serveur 443` |
    | `tcpdump` | Capturer des paquets ; droits élevés souvent requis | `sudo tcpdump -ni eth0 port 53` |
    | `hostnamectl` | Nom système et infos hôte (systemd) | `hostnamectl` |
    | `resolvectl` | État / résolution DNS (systemd-resolved) | `resolvectl status` |
    | `ifconfig` / `netstat` | Outils historiques, remplacés par `ip` / `ss` | `ifconfig -a` ; `netstat -rn` |

    La configuration réseau **persistante** dépend de NetworkManager, Netplan, `/etc/network/interfaces`, BSD `rc.conf`…

Diagnostic par couches : **interface → adresse / route → connectivité IP → résolution DNS → port / service**.

## 💾 Stockage & systèmes de fichiers

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `df -hT` | Occupation des systèmes montés | `df -hT` |
| `du -sh` | Taille totale d'un dossier | `du -sh /var/log` |
| `lsblk -f` | Périphériques blocs, partitions et FS | `lsblk -f` |
| `mount` / `umount` | Monter / démonter un système de fichiers | `sudo mount /dev/sdb1 /mnt` |
| `findmnt` | Arbre des montages | `findmnt /` |
| `blkid` | Identifier UUID et type de partition | `sudo blkid` |
| `fsck` | Vérifier / réparer un FS, **démonté** | `sudo fsck /dev/sdb1` |

!!! danger "fsck"
    Ne jamais lancer `fsck` sur un système de fichiers monté en écriture. Vérifier soigneusement les noms de périphériques.

## 🔎 Journaux & diagnostic système

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `journalctl` | Lire journald ; `-u` unité, `-b` démarrage courant | `journalctl -u ssh -b` |
| `journalctl -f` | Suivre les nouveaux événements | `sudo journalctl -f` |
| `dmesg` | Messages du noyau ; `-T` dates lisibles | `dmesg -T | tail` |
| `/var/log` | Journaux texte classiques, selon configuration | `sudo less /var/log/syslog` |
| `logger` | Écrire un message dans le journal système | `logger "test TSSR"` |
| `last` / `lastb` | Connexions / échecs, si journaux présents | `last -n 10` |

Surveiller horodatage, unité concernée et période ; permissions et rotation des journaux varient.

## 🗜️ Archivage & transfert

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `tar` | Créer / lire une archive ; `z` = gzip, `J` = xz | `tar -czf sauvegarde.tgz dossier/` |
| `tar -tf` | Lister le contenu sans extraire | `tar -tf sauvegarde.tgz` |
| `gzip` / `gunzip` | Compresser / décompresser un fichier | `gzip fichier.log` |
| `zip` / `unzip` | Archives ZIP (si installé) | `zip -r site.zip site/` |
| `rsync` | Synchroniser ; `-a` conserve les attributs | `rsync -av source/ dest/` |
| `sha256sum` | Empreinte d'intégrité | `sha256sum fichier.iso` |

Tester le contenu et la destination avant extraction / synchronisation. Le `/` final de `rsync` change le sens : `source/` copie le **contenu**, `source` copie le **dossier**.

## 🔑 SSH : accès & clés

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `ssh` | Connexion distante ; préciser utilisateur et hôte | `ssh alice@serveur` |
| `ssh -p` | Port SSH non standard | `ssh -p 2222 alice@serveur` |
| `ssh-keygen` | Créer une paire de clés ; la protéger par une phrase | `ssh-keygen -t ed25519` |
| `ssh-copy-id` | Installer la clé publique sur l'hôte | `ssh-copy-id alice@serveur` |
| `scp` | Copie sécurisée simple | `scp fichier alice@serveur:/tmp/` |
| `ssh -v` | Diagnostic de connexion détaillé | `ssh -v alice@serveur` |

!!! warning "Sécurité"
    Ne jamais transmettre la clé **privée**. Vérifier la clé d'hôte ; ne pas désactiver la vérification pour « faire marcher ».

## ⌨️ Shell : raccourcis & redirections

| Commande | Rôle / repère | Exemple |
| --- | --- | --- |
| `man` / `--help` | Aide locale et options disponibles | `man chmod` ; `ip --help` |
| `history` / ++ctrl+r++ | Historique / recherche interactive | `history | tail` |
| `>` / `>>` / `2>` | Rediriger la sortie / ajouter / rediriger les erreurs | `commande >out 2>err` |
| `|` / `tee` | Enchaîner / dupliquer vers écran et fichier | `ip addr | tee etat.txt` |
| `&&` / `;` | Suite conditionnelle / inconditionnelle | `test -d /tmp && echo OK` |
| `$(...)` | Substitution de commande | `echo "$(date)"` |
| `env` / `export` | Voir / définir des variables d'environnement | `export LANG=C` |

Les guillemets protègent espaces et expansion.

## 🧭 Méthode rapide en TP

Avancer **du constat à la preuve**, sans modifier avant d'avoir compris.

| # | Étape | Ce qu'on fait |
| --- | --- | --- |
| 1 | **Cadrer** | Quel symptôme ? Depuis quand ? Un seul poste / service ? |
| 2 | **Observer** | `pwd` · `id` · `ip addr` · `df -h` · `systemctl status` |
| 3 | **Isoler** | Logs + processus + réseau ; formuler une hypothèse vérifiable. |
| 4 | **Agir** | Changement minimal, documenté ; `sudo` seulement si nécessaire. |
| 5 | **Valider** | Rejouer le test initial, vérifier logs / état, noter le résultat. |

Trace utile : **commande → résultat observé → hypothèse → action → contrôle final**. Si le diagnostic évolue, revenir à une observation mesurable plutôt que multiplier les changements.

## ⚠️ Précautions & différences Unix

- **`sudo` : un privilège, pas un réflexe.** Lire la commande avant exécution ; vérifier cible, compte, chemin et impact.
- **Destructif / irréversible :** `rm -r`, `dd`, `mkfs`, `fsck`, `userdel -r`, la redirection `>` et les synchronisations peuvent supprimer ou écraser. Relire les arguments, sauvegarder si besoin.
- **GNU/Linux ≠ BSD / Unix :** les options divergent (`stat`, `sed`, `date`, `ps`…) ; `systemctl` n'est pas universel.
- **Selon la distribution :** `apt` / `dnf` / `zypper` / `pkg`, noms de services et journaux diffèrent ; `htop`, `dig`, `lsof` ne sont pas toujours installés.
- **Privilèges et redirections :** dans `sudo commande > fichier`, c'est le shell courant (non root) qui écrit le fichier. Utiliser plutôt `commande | sudo tee fichier`.

## 🧠 Quiz express

<div id="quiz-memo-commandes-linux"></div>

<script type="application/json" id="quiz-memo-commandes-linux-data">
[
  {
    "question": "Que donne chmod 640 sur un fichier ?",
    "options": ["rwxr-xr-x", "rw-r-----", "rw-rw-r--", "r--r-----"],
    "correctIndex": 1,
    "explanation": "6 = rw-, 4 = r--, 0 = --- : propriétaire lecture/écriture, groupe lecture, autres rien."
  },
  {
    "question": "Pourquoi utiliser usermod -aG plutôt que usermod -G ?",
    "options": ["-aG est plus rapide", "-aG ajoute le groupe sans retirer les autres", "-G n'existe pas", "-aG crée le groupe s'il n'existe pas"],
    "correctIndex": 1,
    "explanation": "Sans -a, -G remplace la liste des groupes secondaires de l'utilisateur."
  },
  {
    "question": "Quelle commande liste les ports TCP/UDP en écoute avec le processus associé ?",
    "options": ["ip route", "ss -lntup", "ping -c 4", "lsblk -f"],
    "correctIndex": 1,
    "explanation": "ss -lntup : l = écoute, n = numérique, t = TCP, u = UDP, p = processus."
  },
  {
    "question": "Quel signal envoyer en premier pour arrêter un processus proprement ?",
    "options": ["KILL", "TERM", "STOP", "HUP"],
    "correctIndex": 1,
    "explanation": "TERM laisse le processus se terminer proprement ; KILL en dernier recours."
  },
  {
    "question": "Comment lire les journaux du service ssh depuis le démarrage courant ?",
    "options": ["dmesg -u ssh", "journalctl -u ssh -b", "tail /var/log/ssh", "systemctl log ssh"],
    "correctIndex": 1,
    "explanation": "journalctl -u filtre par unité, -b limite au démarrage courant."
  },
  {
    "question": "Quand peut-on lancer fsck sur une partition ?",
    "options": ["À tout moment", "Quand elle est démontée", "Seulement en root via sudo, monté", "Après un reboot uniquement"],
    "correctIndex": 1,
    "explanation": "Jamais sur un système de fichiers monté en écriture : risque de corruption."
  },
  {
    "question": "Quelle commande active ssh au démarrage ET le démarre tout de suite ?",
    "options": ["systemctl start ssh", "systemctl enable ssh", "systemctl enable --now ssh", "service ssh on"],
    "correctIndex": 2,
    "explanation": "enable active au démarrage ; --now démarre aussi le service immédiatement."
  },
  {
    "question": "Pourquoi « sudo echo test > /etc/fichier » échoue-t-il ?",
    "options": ["echo n'accepte pas sudo", "La redirection est faite par le shell courant, non root", "/etc est en lecture seule", "Il faut >> au lieu de >"],
    "correctIndex": 1,
    "explanation": "sudo ne s'applique qu'à echo. Solution : echo test | sudo tee /etc/fichier."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-memo-commandes-linux",
      dataId: "quiz-memo-commandes-linux-data",
    });
  });
</script>
