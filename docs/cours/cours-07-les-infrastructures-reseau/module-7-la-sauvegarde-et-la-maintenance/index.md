# Module 7 : La sauvegarde et la maintenance

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Sauvegarder et restaurer la **configuration** et l'**IOS** d'un équipement Cisco (serveur **TFTP**), réinitialiser un routeur ou un switch, utiliser le mode de secours **ROMMON** et **récupérer un mot de passe** perdu.

!!! abstract "En clair"
    Un équipement réseau se sauvegarde comme un serveur : sa **configuration** (un simple fichier texte) et son **système** (l'IOS) doivent avoir une copie **ailleurs**, sur un serveur. Et si l'on a perdu le mot de passe, il existe une procédure… à condition d'avoir un **accès physique** (console).

## 🗺️ L'essentiel en schémas

!!! info "Référentiel TSSR 2026"
    **CCP 3 · compétence 9 : Assurer la continuité et la reprise de l'infrastructure** et **compétence 10 : Mettre à jour** les éléments de l'infrastructure.

**① Les mémoires et les copies**

```mermaid
flowchart LR
    RAM["RAM<br/>running-config"] <-->|"copy run start /<br/>copy start run"| NV["NVRAM<br/>startup-config"]
    RAM -->|"copy running-config tftp:"| T["🖥️ Serveur TFTP<br/>R1-2026-11-23-1430.cfg<br/>image IOS"]
    T -->|"copy tftp: running-config"| RAM
    FL["Flash<br/>IOS, vlan.dat"] <-->|"copy flash: tftp: /<br/>copy tftp: flash:"| T
```

**② Mot de passe perdu : la récupération**

```mermaid
flowchart TD
    A["Câble console,<br/>redémarrage + Ctrl+Pause"] --> B["ROMMON :<br/>confreg 0x2142<br/>(ignorer la startup-config)"]
    B --> C["reset : démarre à vide,<br/>répondre no à l'assistant"]
    C --> D["enable puis<br/>copy startup-config running-config"]
    D --> E["Nouveau mot de passe :<br/>enable secret …"]
    E --> F["config-register 0x2102<br/>copy run start · reload"]
```

## 📖 Cours consolidé

### 1. Où est quoi

| Mémoire | Contenu | Perdue à l'extinction ? |
|---|---|---|
| **RAM** | running-config, tables en cours | Oui |
| **NVRAM** | startup-config | Non |
| **Flash** | IOS, `vlan.dat` (switch) | Non |
| **ROM** | POST, **ROMMON** (mode de secours) | Non |

### 2. Sauvegarder et restaurer

Un serveur **TFTP** (logiciel simple de transfert de fichiers, sans mot de passe : à réserver au réseau d'administration ; **SCP** ou **FTP** sont plus sûrs) reçoit les copies. Nommer les fichiers avec l'**équipement**, la **date** et l'**heure**.

| Commande (mode `#`) | Rôle |
|---|---|
| `copy running-config tftp:` | Sauvegarder la configuration sur le serveur |
| `show flash:` | Voir le nom du fichier IOS |
| `copy flash: tftp:` | Sauvegarder l'IOS |
| `copy tftp: running-config` | Restaurer une configuration (appliquée **immédiatement**, fusionnée avec l'existante) |
| `copy tftp: flash:` | Installer une image IOS (prise en compte au **prochain démarrage**) |

### 3. Réinitialiser un équipement

- **Routeur** : `erase startup-config` puis `reload` (répondre **no** à « Save? »).
- **Switch** : en plus, `delete flash:vlan.dat` pour effacer les VLAN, puis `reload`.

### 4. ROMMON, le mode de secours

Si l'IOS est absent ou abîmé, l'équipement démarre en **ROMMON** (invite `rommon 1 >`). On peut y télécharger une IOS depuis un serveur TFTP : on règle les variables `IP_ADDRESS`, `IP_SUBNET_MASK`, `DEFAULT_GATEWAY`, `TFTP_SERVER`, `TFTP_FILE` (`set` pour les voir), puis `tftpdnld` (efface la Flash et télécharge l'image), et enfin `reset`.

### 5. Récupérer un mot de passe perdu

Le **registre de configuration** indique comment démarrer : **0x2102** = normal (lit la startup-config) ; **0x2142** = **ignore** la startup-config (on démarre sans mot de passe).

1. Câble **console**, redémarrer, **interrompre** le démarrage (`Ctrl+Pause` dans PuTTY) → ROMMON.
2. `confreg 0x2142` puis `reset`.
3. Répondre **no** à l'assistant, `enable`, puis `copy startup-config running-config` (on récupère la configuration, **sans** perdre son contenu).
4. Définir un nouveau mot de passe (`enable secret …`), réactiver les interfaces si besoin (`no shutdown`).
5. `config-register 0x2102` (mode configuration), `copy running-config startup-config`, `reload`.

⚠️ D'où l'importance de **protéger l'accès physique** aux équipements (baie fermée à clé).

## 📝 Fiche de révision

| Notion | À retenir |
|---|---|
| **RAM / NVRAM / Flash / ROM** | running / startup / IOS + vlan.dat / ROMMON |
| **`copy running-config tftp:`** | Sauvegarder la configuration |
| **`copy flash: tftp:`** | Sauvegarder l'IOS |
| **`copy tftp: running-config`** | Restaurer (immédiat) |
| **Réinitialiser** | `erase startup-config` (+ `delete flash:vlan.dat`) + `reload` |
| **ROMMON** | Secours : `tftpdnld` pour recharger une IOS |
| **0x2102 / 0x2142** | Démarrage normal / sans startup-config |
| **Récupération** | Ctrl+Pause → confreg 0x2142 → copy start run → nouveau mot de passe → 0x2102 |

### ⚠️ Les pièges

- Faire `copy running-config startup-config` **avant** `copy startup-config running-config` pendant une récupération : on **écrase** la vraie configuration par une configuration vide.
- Oublier de remettre le registre à **0x2102** : au prochain démarrage, la configuration est encore ignorée.
- Oublier `delete flash:vlan.dat` sur un switch : les VLAN reviennent après réinitialisation.
- Garder les sauvegardes **uniquement** sur l'équipement lui-même.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Avant une mise à jour de l'IOS d'un routeur, que sauvegardes-tu et comment ?"
    La **configuration** (`copy running-config tftp:`, fichier nommé avec l'équipement et la date) et l'**IOS actuelle** (`show flash:` pour son nom, puis `copy flash: tftp:`), pour pouvoir revenir en arrière. Puis on installe la nouvelle image (`copy tftp: flash:`), on vérifie et on redémarre pendant une **fenêtre de maintenance**.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance-data">
[
  {
    "question": "Où se trouve l'image du système Cisco IOS ?",
    "options": [
      "En RAM",
      "En mémoire Flash",
      "En NVRAM",
      "Sur le câble console"
    ],
    "correctIndex": 1,
    "explanation": "La Flash garde l'IOS (et le fichier vlan.dat des switchs) même sans courant. La NVRAM garde la startup-config, et la RAM la configuration en cours, perdue à l'extinction."
  },
  {
    "question": "Quelle commande sauvegarde la configuration sur un serveur TFTP ?",
    "options": [
      "copy tftp: running-config",
      "copy running-config tftp:",
      "show flash:",
      "erase startup-config"
    ],
    "correctIndex": 1,
    "explanation": "La syntaxe est copy SOURCE DESTINATION : ici de la configuration en cours vers le serveur TFTP. copy tftp: running-config fait l'inverse : elle restaure depuis le serveur."
  },
  {
    "question": "Comment remettre un switch Cisco à zéro, VLAN compris ?",
    "options": [
      "reload seul",
      "erase startup-config, delete flash:vlan.dat, puis reload",
      "no hostname",
      "shutdown sur tous les ports"
    ],
    "correctIndex": 1,
    "explanation": "La configuration est dans la startup-config, mais les VLAN sont stockés à part, dans le fichier vlan.dat en Flash. Sans le supprimer, les VLAN reviennent après le redémarrage."
  },
  {
    "question": "Qu'est-ce que le mode ROMMON ?",
    "options": [
      "Un mode de configuration avancée",
      "Un mode de secours en mémoire ROM, utilisé quand l'IOS ne démarre pas ou pour récupérer un mot de passe",
      "Un protocole de routage",
      "Un type de VLAN"
    ],
    "correctIndex": 1,
    "explanation": "ROMMON est un petit programme en ROM, disponible même sans IOS. On y accède en interrompant le démarrage (Ctrl+Pause), et on peut y recharger une IOS (tftpdnld) ou changer le registre (confreg)."
  },
  {
    "question": "Quelle valeur du registre de configuration fait ignorer la startup-config au démarrage ?",
    "options": [
      "0x2102",
      "0x2142",
      "0x0000",
      "0xFFFF"
    ],
    "correctIndex": 1,
    "explanation": "0x2102 est la valeur normale : l'équipement lit sa startup-config. 0x2142 la fait ignorer, pour démarrer sans mot de passe lors d'une récupération. Il faut ensuite revenir à 0x2102."
  },
  {
    "question": "Pendant une récupération de mot de passe, pourquoi taper copy startup-config running-config ?",
    "options": [
      "Pour effacer la configuration",
      "Pour récupérer la configuration existante en mémoire, afin de changer seulement le mot de passe",
      "Pour mettre à jour l'IOS",
      "Pour sauvegarder sur TFTP"
    ],
    "correctIndex": 1,
    "explanation": "Le routeur a démarré à vide (registre 0x2142), mais sa configuration est toujours en NVRAM. Cette commande la recharge : on change ensuite le mot de passe sans perdre tout le reste, puis on enregistre."
  },
  {
    "question": "Pourquoi l'accès physique aux équipements réseau doit-il être protégé ?",
    "options": [
      "Pour éviter la poussière",
      "Parce qu'avec un câble console, on peut récupérer ou contourner les mots de passe",
      "Pour le Wi-Fi",
      "Ce n'est pas nécessaire"
    ],
    "correctIndex": 1,
    "explanation": "La procédure de récupération permet de reprendre le contrôle d'un équipement sans connaître ses mots de passe, à condition d'y brancher un câble console. Une baie fermée à clé fait donc partie de la sécurité."
  },
  {
    "question": "Which command copies the IOS image from flash memory to a TFTP server?",
    "options": [
      "copy tftp: flash:",
      "copy flash: tftp:",
      "copy run start",
      "show version"
    ],
    "correctIndex": 1,
    "explanation": "Traduction : « Quelle commande copie l'image IOS de la mémoire Flash vers un serveur TFTP ? » copy flash: tftp: (source puis destination). L'inverse, copy tftp: flash:, installe une image depuis le serveur."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance-data",
    });
  });
</script>
