# Mémo · toutes les commandes

Une seule page pour retrouver vite **la bonne commande**, avec son équivalent sur chaque système. Une ligne = un besoin. `—` = pas d'équivalent direct.

!!! tip "Détails, exemples, pièges et quiz"
    Voir les fiches complètes : [Mémo Windows](../revisions/memo-commandes-windows.md) · [Mémo Linux / Unix](../revisions/memo-commandes-linux.md).

## 🧭 Réflexes

| Réflexe | À retenir |
| --- | --- |
| **Méthode** | Cadrer → Observer → Tester / Isoler → Corriger (une chose à la fois) → Valider |
| **Diagnostic réseau** | IP / masque / passerelle → ping passerelle → ping IP cible → DNS (nom vs IP) → port → service / journaux |
| **Règle d'or** | Commande de **lecture** d'abord, **modification** ensuite (droits, cible et retour arrière vérifiés) |
| **Preuve** | Noter commande → résultat → hypothèse → action → contrôle. Ping KO ≠ panne (ICMP filtré ?) |

## 📁 Fichiers & navigation

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Où suis-je ? | `cd` | `Get-Location` | `pwd` |
| Changer de dossier | `cd C:\TP` | `Set-Location C:\TP` | `cd /etc` · `cd ..` · `cd ~` |
| Lister (avec cachés) | `dir /a` | `Get-ChildItem -Force` | `ls -lah` |
| Chercher un fichier | `dir /s *.log` | `Get-ChildItem -Recurse -Filter *.log` | `find /var -name "*.log"` |
| Infos sur un fichier | — | `Get-Item f.txt | Format-List *` | `stat f` · `file f` |
| Créer un dossier | `mkdir C:\TP\Logs` | `New-Item -ItemType Directory C:\TP\Logs` | `mkdir -p /tmp/test` |
| Créer un fichier vide | `type nul > f.txt` | `New-Item f.txt` | `touch f.txt` |
| Copier | `copy a.txt D:\` · `xcopy /e` | `Copy-Item a.txt D:\` (`-Recurse`) | `cp -a source/ copie/` |
| Déplacer / renommer | `move` · `ren` | `Move-Item` · `Rename-Item` | `mv` |
| Supprimer ⚠️ | `del f` · `rmdir /s dossier` | `Remove-Item f` (`-Recurse`) | `rm -i f` · `rm -r dossier` |

## 📖 Lire, filtrer, rediriger

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Lire un fichier | `type f.txt` · `more` | `Get-Content f.txt` | `cat f` · `less f` |
| Début / fin | — | `Get-Content f -TotalCount 10` · `-Tail 50` | `head -n 10` · `tail -n 50` |
| Suivre un journal | — | `Get-Content app.log -Wait` | `tail -f app.log` |
| Chercher un motif | `findstr /i "error" app.log` | `Select-String "error" app.log` | `grep -in "error" app.log` |
| Compter les lignes | `find /c /v "" f.txt` | `(Get-Content f).Count` | `wc -l f` |
| Trier / dédupliquer | `sort` | `Sort-Object -Unique` | `sort f | uniq -c` |
| Écrire dans un fichier | `>` écrase · `>>` ajoute | `Out-File` · `>` · `>>` | `>` écrase · `>>` ajoute |
| Écran + fichier | — | `Tee-Object etat.txt` | `tee etat.txt` |
| Rediriger les erreurs | `2> err.txt` | `2> err.txt` | `2> err.txt` |
| Aide | `commande /?` | `Get-Help commande` | `man commande` · `--help` |

## 🌐 Réseau

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Config IP / passerelle / DNS | `ipconfig /all` | `Get-NetIPConfiguration` | `ip -br addr` · `ip a` |
| Renouveler le bail DHCP ⚠️ | `ipconfig /release` · `/renew` | — | `dhclient -r` · `dhclient` |
| État des interfaces | `netsh interface show interface` | `Get-NetAdapter` | `ip link` |
| Ping | `ping 192.168.1.1` | `Test-Connection 192.168.1.1` | `ping -c 4 192.168.1.1` |
| Chemin réseau | `tracert` | `Test-NetConnection -TraceRoute` | `traceroute` · `tracepath` |
| Résolution DNS | `nslookup nom` | `Resolve-DnsName nom` | `dig nom A` · `nslookup` · `getent hosts` |
| Vider le cache DNS | `ipconfig /flushdns` | `Clear-DnsClientCache` | `resolvectl flush-caches` |
| Voisins / MAC (ARP) | `arp -a` | `Get-NetNeighbor` | `ip neigh` |
| Table de routage | `route print` | `Get-NetRoute` | `ip route` |
| Ports ouverts / connexions | `netstat -ano` | `Get-NetTCPConnection` | `ss -lntup` |
| Tester un port TCP | — | `Test-NetConnection hôte -Port 443` | `nc -vz hôte 443` |
| Tester HTTP(S) | `curl -I https://site` | `Invoke-WebRequest https://site` | `curl -I https://site` · `wget` |
| Capturer des paquets | `pktmon` | — | `tcpdump -ni eth0 port 53` |

## ⚙️ Processus & services

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Lister les processus | `tasklist` (`/svc` = services liés) | `Get-Process` | `ps aux` · `ps -ef` |
| Temps réel CPU / RAM | `taskmgr` | — | `top` · `htop` |
| Trouver par nom | `tasklist /fi "imagename eq notepad.exe"` | `Get-Process -Name notepad` | `pgrep -a sshd` |
| Arrêter un processus ⚠️ | `taskkill /PID 1234` (`/f` force) | `Stop-Process -Id 1234` | `kill -TERM 1234` (KILL en dernier) · `pkill` |
| Priorité | `start /low` | — | `nice -n 10` · `renice` |
| Mémoire / charge | `systeminfo` | — | `free -h` · `uptime` |
| État d'un service | `sc query nom` | `Get-Service nom` | `systemctl status ssh` |
| Démarrer / arrêter | `net start nom` · `net stop nom` | `Start-Service` · `Stop-Service` · `Restart-Service` | `systemctl start` · `stop` · `restart` |
| Lancer au démarrage | `sc config nom start= auto` | `Set-Service nom -StartupType Automatic` | `systemctl enable --now ssh` |
| Est-il actif ? | `sc query nom` | `(Get-Service nom).Status` | `systemctl is-active` · `is-enabled` |
| Config d'un service | `sc qc nom` | `Get-CimInstance Win32_Service` | `systemctl cat ssh` |

## 💻 Système & stockage

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Nom du poste | `hostname` | `$env:COMPUTERNAME` | `hostname` · `hostnamectl` |
| Infos système / version | `systeminfo` · `winver` | `Get-ComputerInfo` | `hostnamectl` · `uname -a` · `cat /etc/os-release` |
| Matériel / OS (WMI) | `wmic` *(déprécié)* | `Get-CimInstance Win32_OperatingSystem` | `lscpu` · `lsblk` |
| Espace disque | — | `Get-Volume` | `df -hT` |
| Taille d'un dossier | `dir /s` | `(Get-ChildItem -Recurse | Measure-Object Length -Sum).Sum` | `du -sh /var/log` |
| Disques / partitions | `diskpart` → `list disk` | `Get-Disk` · `Get-Partition` | `lsblk -f` · `sudo blkid` |
| Monter / démonter | `mountvol` | — | `mount /dev/sdb1 /mnt` · `umount` · `findmnt` |
| Vérifier le disque ⚠️ | `chkdsk C: /scan` | `Repair-Volume -DriveLetter C -Scan` | `fsck /dev/sdb1` (**démonté**) |
| Redémarrer ⚠️ | `shutdown /r /t 0` | `Restart-Computer` | `sudo reboot` · `systemctl reboot` |
| Éteindre ⚠️ | `shutdown /s /t 0` | `Stop-Computer` | `sudo poweroff` |

## 🔐 Comptes & droits

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Qui suis-je ? | `whoami` (`/all`) | `whoami` | `whoami` · `id` |
| Mes groupes | `whoami /groups` | — | `groups` · `id` |
| Sessions ouvertes | `query user` | — | `who` |
| Lister les comptes | `net user` | `Get-LocalUser` | `getent passwd` |
| Créer un compte | `net user alice * /add` | `New-LocalUser alice` | `sudo useradd -m alice` · `adduser` |
| Changer le mot de passe | `net user alice *` | `Set-LocalUser alice -Password …` | `sudo passwd alice` |
| Ajouter à un groupe | `net localgroup Administrateurs alice /add` | `Add-LocalGroupMember -Group ops -Member alice` | `sudo usermod -aG ops alice` (**-a** !) |
| Créer un groupe | `net localgroup ops /add` | `New-LocalGroup ops` | `sudo groupadd ops` |
| Supprimer un compte ⚠️ | `net user alice /delete` | `Remove-LocalUser alice` | `sudo userdel -r alice` |
| Lire les droits | `icacls C:\Partage` | `Get-Acl C:\Partage` | `ls -l` |
| Modifier les droits | `icacls chemin /grant alice:(R)` | `Set-Acl` | `chmod 640 f` · `chmod u+x f` |
| Changer le propriétaire | `icacls chemin /setowner alice` | — | `sudo chown alice:ops f` |
| Droits par défaut | — | — | `umask 027` |
| Exécuter en admin | `runas /user:Administrateur cmd` | `Start-Process powershell -Verb RunAs` | `sudo commande` |
| Stratégie d'exécution | — | `Get-ExecutionPolicy -List` | — |

**Octal Linux :** r = 4, w = 2, x = 1 · `640` = `rw-r-----` · `755` = `rwxr-xr-x` · un dossier exige `x` pour être traversé.
**Windows :** droits effectifs = NTFS **et** partage → le plus restrictif l'emporte.

## 🔎 Journaux & dépannage

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Lire les journaux | `eventvwr.msc` · `wevtutil qe System /c:20 /rd:true /f:text` | `Get-WinEvent -LogName System -MaxEvents 20` | `journalctl -u ssh -b` · `/var/log/` |
| Suivre en direct | — | `Get-Content app.log -Wait` | `journalctl -f` · `tail -f` |
| Messages du noyau | — | — | `dmesg -T` |
| Écrire dans le journal | `eventcreate /t information /id 100 /l application /d "test"` | — | `logger "test TSSR"` |
| Historique des connexions | — | — | `last -n 10` · `lastb` |
| Réparer les fichiers système | `DISM /Online /Cleanup-Image /RestoreHealth` puis `sfc /scannow` | — | `sudo apt --fix-broken install` |
| Appliquer les GPO | `gpupdate /force` · `gpresult /r` | — | — |

## 📦 Paquets, archives & transfert

| Besoin | CMD | PowerShell | Linux |
| --- | --- | --- | --- |
| Installer un logiciel | `winget install Git.Git` | `winget install …` | `sudo apt install curl` (Debian) · `dnf` · `zypper` · `pkg` |
| Mettre à jour | `winget upgrade --all` | — | `sudo apt update && sudo apt upgrade` |
| Lister les paquets installés | `winget list` | `Get-Package` | `dpkg -l | grep ssh` · `rpm -qa` |
| Créer une archive | `tar -czf s.tgz dossier` | `Compress-Archive dossier s.zip` | `tar -czf s.tgz dossier/` · `zip -r` |
| Extraire / lister | `tar -xzf s.tgz` | `Expand-Archive s.zip` | `tar -xzf s.tgz` · `tar -tf` · `unzip` |
| Compresser un fichier | — | — | `gzip f` · `gunzip f.gz` |
| Synchroniser des dossiers | `robocopy src dst /mir` ⚠️ | — | `rsync -av src/ dst/` (le `/` final compte) |
| Empreinte d'intégrité | `certutil -hashfile f SHA256` | `Get-FileHash f` | `sha256sum f` |
| Connexion SSH | `ssh alice@serveur` | `ssh alice@serveur` | `ssh alice@serveur` · `-p 2222` · `-v` |
| Créer une paire de clés | `ssh-keygen -t ed25519` | `ssh-keygen -t ed25519` | `ssh-keygen -t ed25519` · `ssh-copy-id` |
| Copier vers un serveur | `scp f alice@serveur:/tmp/` | `scp …` | `scp f alice@serveur:/tmp/` |

## ⌨️ Shell & raccourcis

| Besoin | CMD | PowerShell | Linux (Bash) |
| --- | --- | --- | --- |
| Enchaîner si succès | `cmd1 && cmd2` | `cmd1; if ($?) { cmd2 }` (PS 7 : `&&`) | `cmd1 && cmd2` |
| Enchaîner toujours | `cmd1 & cmd2` | `cmd1; cmd2` | `cmd1; cmd2` |
| Pipe | `|` (texte) | `|` (**objets**) | `|` (texte) |
| Variables d'environnement | `set` · `echo %PATH%` | `$env:PATH` · `Get-ChildItem env:` | `env` · `echo $PATH` · `export LANG=C` |
| Résultat d'une commande | — | `$(Get-Date)` | `$(date)` |
| Historique | `doskey /history` · ++f7++ | `Get-History` · ++ctrl+r++ | `history` · ++ctrl+r++ |
| Effacer l'écran | `cls` | `cls` · `Clear-Host` | `clear` · ++ctrl+l++ |

!!! warning "Pièges classiques"
    - Les alias PowerShell (`dir`, `ls`, `cd`, `copy`) n'acceptent **pas** les options CMD ou Linux.
    - `sudo commande > fichier` : la redirection est faite **sans** les droits root → `commande | sudo tee fichier`.
    - `usermod -G` sans `-a` **remplace** tous les groupes secondaires.
    - Noter le symptôme **avant** `ipconfig /flushdns`, un redémarrage ou un `restart` de service.
    - `fsck` jamais sur un système monté ; `rm -r`, `Remove-Item -Recurse -Force`, `robocopy /mir` : relire la cible.
