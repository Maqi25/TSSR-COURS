# Mémo · Commandes Windows essentielles

*CMD + PowerShell, du diagnostic aux bons réflexes · cours liés : [Cours 2 - Système client Microsoft](../cours/cours-02-systeme-client-microsoft/index.md) · [Cours 11 - Initiation à PowerShell](../cours/cours-11-initiation-a-powershell/index.md)*

!!! info "Une sélection, pas un inventaire"
    Une sélection pratique pour les TP et l'examen, pas une liste complète. Avant d'exécuter : vérifier la version de Windows, les droits et la syntaxe locale.

## 🧭 La méthode rapide en TP

Observer, formuler une hypothèse, tester **une seule couche à la fois**.

| # | Étape | Ce qu'on fait |
| --- | --- | --- |
| 1 | **Cadrer** | Quel symptôme ? Depuis quand ? Un poste ou plusieurs ? |
| 2 | **Observer** | Lire l'adresse, la passerelle, le DNS, l'état du service. |
| 3 | **Tester** | Du local vers le distant : interface → IP → nom → port → application. |
| 4 | **Corriger** | Une modification à la fois ; noter la commande et le résultat. |
| 5 | **Valider** | Rejouer le test, vérifier l'impact et documenter le retour arrière. |

!!! warning "Règle d'or"
    Commande de **lecture** d'abord ; commande de **modification** ensuite, avec droits et périmètre vérifiés.

## 📁 Fichiers & navigation

Dans PowerShell, les commandes natives sont en **verbe-nom** ; les alias CMD (`dir`, `copy`…) ne garantissent pas une syntaxe identique.

| CMD | PowerShell | À quoi ça sert · exemple | ⚠️ Vigilance |
| --- | --- | --- | --- |
| `cd` | `Get-Location` / `Set-Location` | Afficher / changer le dossier courant : `Set-Location C:\TP` | Vérifier le chemin courant avant toute action. |
| `dir` | `Get-ChildItem` | Lister ; `dir /a` affiche aussi les éléments cachés. | `dir` est un alias PowerShell : la sortie diffère. |
| `mkdir` | `New-Item -ItemType Directory` | Créer un dossier : `mkdir C:\TP\Logs` | Chemin et droits ; ne pas confondre fichier / dossier. |
| `copy` | `Copy-Item` | Copier : `Copy-Item .\a.txt D:\Sauvegarde\` | Confirmer source / destination ; `-Recurse` copie l'arborescence. |
| `move` | `Move-Item` | Déplacer ou renommer un fichier / dossier. | Peut écraser ou impacter l'emplacement cible. |
| `del`, `rmdir` | `Remove-Item` | Supprimer : `Remove-Item .\test.tmp` | **Destructif** ; `-Recurse -Force` supprime largement. |

## 🌐 Réseau · connectivité & DNS

Commencer par la configuration locale, puis tester passerelle, IP distante et résolution de nom.

| CMD | PowerShell | À quoi ça sert · exemple | ⚠️ Vigilance |
| --- | --- | --- | --- |
| `ipconfig /all` | `Get-NetIPConfiguration` | Voir adresse, masque, passerelle et DNS. | Lecture seule : à lancer en premier. |
| `ipconfig /release` · `/renew` | — | Renouveler un bail DHCP après avoir vérifié la config. | Peut **couper la connectivité** ; contexte adapté uniquement. |
| `ping` | `Test-Connection` | Tester l'IP puis la passerelle : `ping 192.168.1.1` | Échec ICMP ≠ hôte hors service : filtrage possible. |
| `tracert` | `Test-NetConnection -TraceRoute` | Repérer où le chemin IP s'interrompt. | Routeurs / pare-feu peuvent ne pas répondre. |
| `nslookup` | `Resolve-DnsName` | Résoudre un nom et voir le serveur DNS interrogé. | Comparer résolution par nom et connexion par IP. |

## 🔌 Réseau · routes, ports & cache

Exemple : `Test-NetConnection serveur.lab -Port 443` valide le **test TCP ciblé**, pas l'application complète.

| CMD | PowerShell | À quoi ça sert · exemple | ⚠️ Vigilance |
| --- | --- | --- | --- |
| `arp -a` | `Get-NetNeighbor` | Voisins IPv4/IPv6 et leurs adresses MAC. | Table locale et cache, pas un inventaire complet. |
| `route print` | `Get-NetRoute` | Examiner les routes et la route par défaut. | Une route plus spécifique prime sur la route par défaut. |
| `netstat -ano` | `Get-NetTCPConnection` | Connexions / ports ; `-o` donne le PID. | Écoute locale ≠ service joignable à travers le pare-feu. |
| — | `Test-NetConnection hôte -Port 443` | Tester la connectivité TCP vers un port précis. | Échec : service, pare-feu ou chemin réseau. |
| `ipconfig /flushdns` | `Clear-DnsClientCache` | Vider le cache DNS local. | Efface un indice : **noter le symptôme avant** de purger. |

## ⚙️ Processus & services

Astuce CMD : `tasklist /svc` associe processus et services ; `sc` interroge le gestionnaire de services.

| CMD | PowerShell | À quoi ça sert · exemple | ⚠️ Vigilance |
| --- | --- | --- | --- |
| `tasklist` | `Get-Process` | Lister les processus : `Get-Process -Name notepad` | Nom de processus ≠ nom du service Windows. |
| `taskkill` | `Stop-Process` | Terminer via PID : `Stop-Process -Id 1234` | Forcer l'arrêt peut perdre des données ; identifier le PID. |
| `sc query` | `Get-Service` | Lister / interroger les services et leur état. | Un service arrêté peut être normal ; voir ses dépendances. |
| `net start nom` | `Start-Service` | Démarrer un service : `Start-Service Spooler` | Droits admin parfois requis ; nom exact et dépendances. |
| `sc qc nom` | `Get-CimInstance Win32_Service` | Lire config, chemin de l'exécutable, compte de service. | Ne pas modifier démarrage / compte sans consigne ni plan de retour. |

## 💻 Système & stockage

Toujours relever **version, nom et contexte d'exécution** avant un diagnostic ou une intervention.

| CMD | PowerShell | À quoi ça sert · exemple | ⚠️ Vigilance |
| --- | --- | --- | --- |
| `hostname` | `$env:COMPUTERNAME` | Identifier le nom du poste. | Ne confirme ni le domaine ni la résolution DNS. |
| `systeminfo` | `Get-ComputerInfo` | OS, version, mémoire, infos système. | Commande verbeuse : lire les champs utiles. |
| `whoami` | `whoami` | Compte courant ; `whoami /all` détaille groupes et privilèges. | Contexte courant ≠ compte du service ou session distante. |
| `wmic` *(hérité)* | `Get-CimInstance` | Interroger matériel / OS : `Get-CimInstance Win32_OperatingSystem` | WMIC est **déprécié** : préférer CIM. |
| `chkdsk C: /scan` | `Get-Volume` | Contrôler le volume et l'espace disponible. | Pas de réparation hors ligne sans mesurer l'impact. |
| `shutdown /r /t 0` | `Restart-Computer` | Redémarrer immédiatement. | **Commande à impact** : cible, créneau, sauvegardes. |

## 🔐 Comptes & permissions

Droits effectifs = **identité + groupes + ACL NTFS + droits de partage + stratégie appliquée**.

| CMD | PowerShell | À quoi ça sert · exemple | ⚠️ Vigilance |
| --- | --- | --- | --- |
| `net user` | `Get-LocalUser` | Voir les comptes locaux. | Local ≠ compte de domaine ; ne pas exposer de mots de passe. |
| `net user utilisateur *` | — | Modifier le mot de passe (saisie interactive). | Sensible : seulement si autorisé, dans le bon périmètre. |
| `whoami /groups` | — | Groupes et jeton de sécurité actuel. | Élévation admin requise pour certaines opérations. |
| `icacls chemin` | `Get-Acl chemin` | Lire les ACL NTFS : `icacls C:\Partage` | NTFS se combine aux droits de partage ; héritage. |
| `icacls chemin /grant …` | — | Accorder des droits NTFS ciblés. | Privilège minimal ; vérifier syntaxe et héritage. |
| — | `Get-ExecutionPolicy -List` | Voir les stratégies PowerShell par portée. | Ne pas contourner une politique pour lancer un script. |

## 🪟 Consoles à taper dans ++win+r++

Ouvrent directement l'outil graphique, sans passer par les menus. Les `.msc` sont des consoles MMC, les `.cpl` des pages du Panneau de configuration.

| Raccourci | Ce qu'il ouvre | Usage typique en TP | Vu dans |
| --- | --- | --- | --- |
| `ncpa.cpl` | **Connexions réseau** (cartes réseau) | Propriétés de la carte → **TCP/IPv4** : IP, masque, passerelle, DNS. | [Module 7](../cours/cours-02-systeme-client-microsoft/module-7-la-gestion-du-reseau-et-du-pare-feu/index.md) |
| `sysdm.cpl` | **Propriétés système** | Nom du poste / groupe de travail, **Bureau à distance**, **Protection du système** (points de restauration), **Profils des utilisateurs**. | [Module 10](../cours/cours-02-systeme-client-microsoft/module-10-maintenance-du-systeme/index.md) |
| `firewall.cpl` | **Pare-feu Windows** (vue simple) | Activer / désactiver, autoriser une application. | [Module 7](../cours/cours-02-systeme-client-microsoft/module-7-la-gestion-du-reseau-et-du-pare-feu/index.md) |
| `wf.msc` | **Pare-feu avancé** | Règles entrantes / sortantes, ports, profils. | [Module 7](../cours/cours-02-systeme-client-microsoft/module-7-la-gestion-du-reseau-et-du-pare-feu/index.md) |
| `compmgmt.msc` | **Gestion de l'ordinateur** | Regroupe disques, périphériques, utilisateurs, services, journaux. | [Module 3](../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/index.md) |
| `diskmgmt.msc` | **Gestion des disques** | Initialiser, partitionner, formater, attribuer une lettre. | [Module 4](../cours/cours-02-systeme-client-microsoft/module-4-la-gestion-du-stockage/index.md) |
| `devmgmt.msc` | **Gestionnaire de périphériques** | Pilotes : mettre à jour, restaurer, désactiver. | [Module 9](../cours/cours-02-systeme-client-microsoft/module-9-les-pilotes-et-imprimantes/index.md) |
| `lusrmgr.msc` | **Utilisateurs et groupes locaux** | Créer un compte, l'ajouter à un groupe. | [Module 5](../cours/cours-02-systeme-client-microsoft/module-5-les-utilisateurs-et-les-groupes/index.md) |
| `fsmgmt.msc` | **Dossiers partagés** | Voir les partages, sessions et fichiers ouverts. | [Module 8](../cours/cours-02-systeme-client-microsoft/module-8-le-partage-de-ressources/index.md) |
| `services.msc` | **Services** | Démarrer / arrêter, type de démarrage. | [Module 3](../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/index.md) |
| `eventvwr.msc` | **Observateur d'événements** | Journaux Système / Application : erreur, source, ID. | [Module 10](../cours/cours-02-systeme-client-microsoft/module-10-maintenance-du-systeme/index.md) |
| `gpedit.msc` | **Stratégie de groupe locale** | Configuration ordinateur / utilisateur. | [Module 13](../cours/cours-02-systeme-client-microsoft/module-13-les-strategies-de-groupe-locales/index.md) |
| `secpol.msc` | **Stratégie de sécurité locale** | Mots de passe, verrouillage de compte, droits. | [Module 13](../cours/cours-02-systeme-client-microsoft/module-13-les-strategies-de-groupe-locales/index.md) |

!!! tip "Astuce"
    La plupart demandent des **droits administrateur** pour modifier quelque chose : ++win+r++, taper le raccourci, puis ++ctrl+shift+enter++ pour l'ouvrir en admin. `gpedit.msc` et `secpol.msc` n'existent pas sur les éditions **Famille**.

## 🔎 Dépannage & journaux

Conserver **l'erreur exacte, l'horodatage et les commandes exécutées** : ce sont des preuves de diagnostic.

| CMD | PowerShell | À quoi ça sert · exemple | ⚠️ Vigilance |
| --- | --- | --- | --- |
| `eventvwr.msc` | `Get-WinEvent` | Journaux : `Get-WinEvent -LogName System -MaxEvents 20` | Filtrer par heure, source, ID ; corréler avant de conclure. |
| `wevtutil qe System /q:…` | — | Interroger les journaux depuis CMD (collecte ciblée). | Filtre strict ; éviter une sortie non filtrée énorme. |
| `sfc /scannow` | — | Vérifier / réparer les fichiers système protégés. | Invite élevée ; peut durer ; lire le résultat. |
| `DISM /Online /Cleanup-Image /RestoreHealth` | — | Réparer l'image Windows ; relancer SFC ensuite si besoin. | Droits admin, parfois Internet ; **ne pas interrompre**. |
| `gpupdate /force` | — | Actualiser les stratégies de groupe. | Peut déclencher des changements ; domaine et périmètre. |

## 📝 L'essentiel à garder en tête

La réponse attendue est souvent **une démarche argumentée**, pas une commande magique.

=== "Chaîne de diagnostic réseau"

    1. **IP / masque / passerelle** : `ipconfig /all`
    2. **Ping passerelle**, puis IP cible : `ping`
    3. **DNS** : nom vs adresse IP : `nslookup`
    4. **Port ciblé** : TCP / pare-feu : `Test-NetConnection -Port`
    5. **Service / application / journaux** : `Get-Service`, `Get-WinEvent`

    À chaque étape : **hypothèse → test → résultat → conclusion**.

=== "Points de vigilance"

    | Point | À retenir |
    | --- | --- |
    | **Syntaxe** | CMD et PowerShell ne partagent pas toujours les mêmes options. |
    | **Contexte** | Noter hôte, compte, élévation et répertoire courant. |
    | **Portée** | Valider cible et chemin avant toute action destructive. |
    | **Preuve** | ICMP bloqué n'implique pas une panne : vérifier par un autre test. |
    | **Retour arrière** | Sauvegarder / consigner l'état avant une modification. |
    | **Précision** | Rapporter commande, sortie utile et conclusion, pas une supposition. |

## 🧠 Quiz express

<div id="quiz-memo-commandes-windows"></div>

<script type="application/json" id="quiz-memo-commandes-windows-data">
[
  {
    "question": "Un ping vers un serveur échoue. Que peut-on conclure ?",
    "options": ["Le serveur est éteint", "Le service est arrêté", "Rien de sûr : l'ICMP est peut-être filtré", "Le DNS est en panne"],
    "correctIndex": 2,
    "explanation": "Échec ICMP ≠ hôte hors service : un pare-feu peut bloquer le ping. Vérifier par un autre test (Test-NetConnection -Port)."
  },
  {
    "question": "Quel est l'équivalent PowerShell de nslookup ?",
    "options": ["Get-DnsClient", "Resolve-DnsName", "Test-Connection", "Get-NetRoute"],
    "correctIndex": 1,
    "explanation": "Resolve-DnsName résout un nom et indique le serveur DNS interrogé."
  },
  {
    "question": "Quelle commande teste la connexion TCP vers le port 443 d'un serveur ?",
    "options": ["ping serveur -p 443", "tracert serveur", "Test-NetConnection serveur -Port 443", "netstat -ano 443"],
    "correctIndex": 2,
    "explanation": "Test-NetConnection -Port valide le test TCP ciblé (pas l'application complète)."
  },
  {
    "question": "Avant de lancer ipconfig /flushdns, que faut-il faire ?",
    "options": ["Redémarrer le poste", "Noter le symptôme et le résultat initial", "Lancer gpupdate /force", "Rien, c'est sans effet"],
    "correctIndex": 1,
    "explanation": "Purger le cache efface un indice utile : on relève d'abord ce qu'on observe."
  },
  {
    "question": "Quelle option de netstat affiche le PID du processus ?",
    "options": ["-a", "-n", "-o", "-r"],
    "correctIndex": 2,
    "explanation": "netstat -ano : a = toutes les connexions, n = numérique, o = PID."
  },
  {
    "question": "Pourquoi préférer Get-CimInstance à wmic ?",
    "options": ["wmic est plus lent", "wmic est déprécié sur les Windows récents", "Get-CimInstance ne demande pas de droits", "wmic ne fonctionne qu'en PowerShell"],
    "correctIndex": 1,
    "explanation": "WMIC est déprécié ; CIM est l'interface moderne recommandée."
  },
  {
    "question": "Dans quel ordre lancer les réparations système ?",
    "options": ["sfc puis chkdsk", "DISM /RestoreHealth puis sfc /scannow si nécessaire", "gpupdate puis sfc", "sfc puis shutdown /r"],
    "correctIndex": 1,
    "explanation": "DISM répare l'image Windows ; SFC s'appuie ensuite sur cette image saine."
  },
  {
    "question": "Quelles commandes lisent les ACL NTFS d'un dossier ?",
    "options": ["net user / Get-LocalUser", "icacls / Get-Acl", "whoami /groups", "Get-ExecutionPolicy -List"],
    "correctIndex": 1,
    "explanation": "icacls chemin ou Get-Acl chemin. Les droits effectifs combinent aussi groupes et droits de partage."
  },
  {
    "question": "Quel raccourci Win+R ouvre directement les cartes réseau pour régler l'IPv4 ?",
    "options": ["sysdm.cpl", "ncpa.cpl", "devmgmt.msc", "wf.msc"],
    "correctIndex": 1,
    "explanation": "ncpa.cpl ouvre les Connexions réseau : clic droit sur la carte → Propriétés → TCP/IPv4."
  },
  {
    "question": "Où activer la protection du système (points de restauration) ?",
    "options": ["sysdm.cpl → Protection du système", "services.msc", "diskmgmt.msc", "eventvwr.msc"],
    "correctIndex": 0,
    "explanation": "sysdm.cpl ouvre les Propriétés système ; l'onglet Protection du système active les points de restauration disque par disque."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-memo-commandes-windows",
      dataId: "quiz-memo-commandes-windows-data",
    });
  });
</script>
