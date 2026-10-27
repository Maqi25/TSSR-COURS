# Module 10 : Maintenance du système

*Cours : [Cours 2 - Système client Microsoft](../index.md)*

## 🎯 Objectif du module

À la fin de ce module, tu sais :

- choisir le bon **outil de diagnostic** selon que le problème est **en cours** ou **passé** ;
- lire l'**Observateur d'événements** ;
- utiliser les **points de restauration** ;
- démarrer et utiliser **WinRE** (l'environnement de secours) quand Windows ne démarre plus ;
- réparer Windows avec **`sfc`**, **`DISM`** et **`chkdsk`**.

!!! abstract "En clair"
    Un PC peut avoir deux sortes de problèmes :

    - il est **lent** : un problème de **performance** (processeur, mémoire, disque ou réseau saturé) ;
    - il **plante** ou fonctionne mal : un problème de **fiabilité** (erreurs, services qui ne démarrent pas, écran bleu).

    Le technicien **enquête** avec les outils de Windows, **répare**, et en dernier recours **revient en arrière** (point de restauration) ou **démarre sur l'environnement de secours** (WinRE).

## 🖼️ Résumé visuel

**① Quel outil pour quel problème ?**

```mermaid
flowchart TD
    P(["🐞 Un problème"]) --> Q{"Il se passe<br/>maintenant ?"}
    Q -- "Oui, en direct" --> T["🔴 Temps réel<br/>Gestionnaire des tâches<br/>Moniteur de ressources (resmon)"]
    Q -- "Non, c'est arrivé avant" --> H["🕓 Historique<br/>Historique de fiabilité<br/>Observateur d'événements"]
    T --> E["📜 Dans les 2 cas :<br/>l'Observateur d'événements<br/>(eventvwr.msc)"]
    H --> E
```

**② Windows ne démarre plus : l'escalade**

```mermaid
flowchart LR
    A["⚠️ Windows<br/>plante au démarrage"] --> B["🛟 WinRE<br/>(se lance seul après<br/>2 échecs)"]
    B --> C["① Outil de<br/>réparation du<br/>démarrage"]
    C --> D["② Mode<br/>sans échec"]
    D --> E["③ Point de<br/>restauration"]
    E --> F["④ Désinstaller la<br/>dernière mise à jour"]
    F --> G["⑤ Réinitialiser<br/>le PC"]
```

## 📖 Cours consolidé

### 1. Les outils de diagnostic

On surveille **4 composants** : **CPU**, **RAM**, **disque**, **réseau**.

| Outil | Commande | Ce qu'il montre |
|---|---|---|
| **Gestionnaire des tâches** | ++ctrl+shift+esc++ | 🔴 **Maintenant** : programmes, % CPU / RAM / disque / réseau, démarrage |
| **Moniteur de ressources** | `resmon` | 🔴 Le détail : **quel programme** utilise le disque ou le réseau |
| **Observateur d'événements** | `eventvwr.msc` | 🔴🕓 Les **journaux** : ce qui s'est passé, avec date et code d'erreur |
| **Historique de fiabilité** | `perfmon /rel` | 🕓 Une **courbe** de stabilité jour par jour (plantages, installations) |
| **Analyseur de performances** | `perfmon` | 🕓 Des **compteurs** précis, enregistrés sur une période |
| **Diagnostic mémoire** | `mdsched` | Teste la **RAM** au redémarrage |

#### L'Observateur d'événements : le réflexe n°1

- **Journaux Windows** : **Système** (pilotes, services, arrêts) · **Application** (plantages de logiciels) · **Sécurité** (connexions, accès).
- **Niveaux** : ℹ️ Information · ⚠️ Avertissement · ❌ Erreur · 🛑 **Critique** (ex. arrêt brutal, **ID 41**).
- 💡 Méthode : **filtrer** sur **Erreur + Critique** autour de **l'heure du problème**, puis chercher **Source + ID** en ligne (souvent en anglais ; doc officielle : **Microsoft Learn**).

---

### 2. Réparer Windows en ligne de commande (en administrateur)

| Commande | Ce qu'elle fait |
|---|---|
| **`sfc /scannow`** | Vérifie et **répare les fichiers système** |
| **`DISM /Online /Cleanup-Image /RestoreHealth`** | Répare la **réserve** utilisée par `sfc` → puis **relancer sfc** |
| **`chkdsk C: /f`** | Répare le **système de fichiers** du disque (au redémarrage pour C:) |

---

### 3. Les points de restauration

Une **photo des réglages de Windows** pour **revenir en arrière** si une installation casse quelque chose.

| ✅ Sauvegarde | ❌ Ne sauvegarde **PAS** |
|---|---|
| **Registre**, fichiers système, pilotes, programmes | Les **documents** de l'utilisateur → ce n'est **pas une sauvegarde** |

- ⚠️ Souvent **désactivé** : l'activer disque par disque dans `sysdm.cpl` → **Protection du système**.
- Création **automatique** (avant une mise à jour, un pilote) ou **manuelle** (**avant** une manip risquée).
- Espace plein → les **plus anciens** points sont effacés.
- Restaurer : **`rstrui`**, ou depuis **WinRE** si Windows ne démarre plus.

---

### 4. WinRE : l'environnement de secours

Un **mini-Windows de secours** (partition cachée) qui démarre **quand Windows n'y arrive plus**.

**Le lancer** : ++shift++ + **Redémarrer** · `shutdown /r /o /t 0` · Paramètres → **Récupération** → *Démarrage avancé* · **automatiquement après 2 échecs de démarrage** · clé d'installation → *Réparer l'ordinateur*.

| Outil (Dépannage → Options avancées) | Rôle |
|---|---|
| **Outil de redémarrage système** | Répare **automatiquement** le démarrage (MBR/GPT, **BCD**) |
| **Paramètres** (de démarrage) | **Mode sans échec** (++f4++), **basse résolution**, **sans signature des pilotes** |
| **Restauration du système** | Revenir à un **point de restauration** |
| **Désinstaller des mises à jour** | Retirer la **dernière mise à jour** qui pose problème |
| **Récupération de l'image système** | Restaurer une **sauvegarde complète** |
| **Invite de commandes** | Réparer à la main (`sfc`, `chkdsk`, `bootrec`) |
| **Réinitialiser ce PC** | Réinstaller Windows, **en gardant ou non** les fichiers |

| Mode de démarrage | Pour quoi ? |
|---|---|
| **Sans échec** | Le **strict minimum** : si ça marche, le problème vient d'un **pilote** ou d'un **logiciel** |
| **Basse résolution** | Le **pilote graphique** empêche l'affichage |
| **Sans signature des pilotes** | Tester un pilote **non signé** |

## 📝 Fiche de révision

### 🧠 Les commandes à connaître

| Commande | Ouvre / fait |
|---|---|
| ++ctrl+shift+esc++ | Gestionnaire des tâches |
| `resmon` | Moniteur de ressources |
| `eventvwr.msc` | Observateur d'événements |
| `perfmon /rel` | Historique de fiabilité |
| `perfmon` | Analyseur de performances |
| `mdsched` | Test de la mémoire RAM |
| `sfc /scannow` | Répare les fichiers système |
| `DISM /Online /Cleanup-Image /RestoreHealth` | Répare l'image de Windows |
| `chkdsk C: /f` | Répare le système de fichiers |
| `sysdm.cpl` | Protection du système (points de restauration) |
| `rstrui` | Restaurer un point |
| `shutdown /r /o` | Redémarrer vers WinRE |

### 🩺 La démarche de dépannage

1. **Comprendre** : quoi, depuis quand, après quoi (mise à jour ? nouveau logiciel ?).
2. **Regarder les journaux** : `eventvwr.msc`, filtrés sur Erreur et Critique à la bonne heure.
3. **Réparer** : `sfc` / `DISM` / `chkdsk`, mise à jour ou **restauration du pilote**.
4. **Revenir en arrière** : point de restauration, ou désinstallation de la mise à jour.
5. **En dernier recours** : réinitialiser le PC.

### ⚠️ Les pièges

- Un **point de restauration ne sauvegarde pas les documents**.
- La protection du système est souvent **désactivée par défaut** : active-la !
- **Mode sans échec qui fonctionne** = le problème vient d'un **pilote ou d'un logiciel** chargé au démarrage normal.
- `sfc` et `DISM` doivent être lancés **en administrateur**.

### ✏️ Entraîne-toi (clique pour voir la correction)

??? question "1. Un PC est très lent depuis ce matin. Quels outils ouvres-tu, dans quel ordre ?"
    1. **Gestionnaire des tâches** : quel programme utilise le CPU, la RAM ou le disque à 100 % ?
    2. **`resmon`** pour le détail (quel processus écrit sur le disque, quelle connexion réseau).
    3. **`eventvwr.msc`** : des erreurs ce matin ? Par exemple une mise à jour, ou un service qui redémarre en boucle.

??? question "2. Après l'installation d'un pilote, Windows plante au démarrage en boucle. Que se passe-t-il, et que fais-tu ?"
    Après **2 échecs**, **WinRE** se lance tout seul. Dépannage → Options avancées → **Restauration du système** : on revient au point créé **automatiquement avant l'installation du pilote**. Autre option : **mode sans échec** (Paramètres de démarrage → ++f4++), puis **Restaurer le pilote** dans `devmgmt.msc`.

??? question "3. Un utilisateur a supprimé ses photos par erreur. Un point de restauration peut-il les récupérer ?"
    **Non.** Les points de restauration ne contiennent **pas les fichiers personnels**. Il faut une **vraie sauvegarde** : Historique des fichiers, sauvegarde de l'entreprise, OneDrive…

??? question "4. `sfc /scannow` indique « a trouvé des fichiers corrompus mais n'a pas pu en réparer certains ». Que fais-tu ?"
    Lancer **`DISM /Online /Cleanup-Image /RestoreHealth`** (il répare la source utilisée par sfc), **puis relancer `sfc /scannow`**.

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme-data">
[
  {
    "question": "Quels sont les 4 éléments matériels majeurs à surveiller pour évaluer la performance d'un ordinateur ?",
    "options": [
      "Le processeur, la mémoire vive, le stockage et la carte réseau",
      "L'écran, le clavier, la souris et le boîtier",
      "Le BIOS, le pilote graphique, le pare-feu et l'antivirus",
      "La carte mère, l'alimentation, le ventilateur et le disque optique"
    ],
    "correctIndex": 0,
    "explanation": "Le module identifie 4 éléments matériels majeurs à surveiller pour évaluer la performance d'un système : le processeur, la mémoire vive, le stockage et la carte réseau."
  },
  {
    "question": "Quel outil permet de lister les processus en cours d'exécution, l'état des services et les taux d'utilisation du matériel en temps réel ?",
    "options": [
      "L'observateur d'évènements",
      "Le gestionnaire des tâches",
      "WinRE",
      "L'analyseur de performance"
    ],
    "correctIndex": 1,
    "explanation": "Le gestionnaire des tâches permet de lister les processus en cours d'exécution, l'état des services et les taux d'utilisation du matériel."
  },
  {
    "question": "Pourquoi un technicien consulte-t-il systématiquement l'observateur d'évènements (les logs) lors d'un dysfonctionnement ?",
    "options": [
      "Parce que c'est le seul outil capable de redémarrer un service bloqué",
      "Parce que cela permet de restaurer automatiquement le système",
      "Parce que le dysfonctionnement en cours ou passé a probablement laissé des évènements récents dans les journaux, fournissant des indices",
      "Parce que c'est l'unique outil permettant de surveiller la carte réseau"
    ],
    "correctIndex": 2,
    "explanation": "Le module précise que tout bon technicien se doit de consulter les logs, car un dysfonctionnement en cours ou passé y laisse généralement des évènements récents permettant de trouver des indices."
  },
  {
    "question": "Quel outil, complémentaire au gestionnaire des tâches, donne du détail graphique sur l'utilisation actuelle des 4 composants matériels principaux ?",
    "options": [
      "L'historique de fiabilité",
      "WinRE",
      "Technet",
      "Le moniteur de ressources"
    ],
    "correctIndex": 3,
    "explanation": "Le moniteur de ressources est un tableau de bord complémentaire au gestionnaire des tâches, donnant du détail sur l'utilisation actuelle des 4 composants matériels principaux à l'aide de graphiques."
  },
  {
    "question": "Dans quel contexte le module recommande-t-il plutôt l'usage de l'analyseur de performance ?",
    "options": [
      "Plutôt sur les serveurs, et en dernier recours si les autres outils d'analyse n'ont pas porté leurs fruits",
      "Systématiquement, en premier réflexe sur tout type de poste",
      "Uniquement sur les imprimantes réseau",
      "Uniquement pour visualiser les pilotes installés"
    ],
    "correctIndex": 0,
    "explanation": "L'analyseur de performance est un outil puissant et complet, mais le module précise qu'il est généralement utilisé sur les serveurs, et en dernier recours lorsque les autres outils n'ont pas permis de résoudre le problème."
  },
  {
    "question": "Qu'apporte l'historique de fiabilité (reliability history) comme outil d'analyse sur l'historique du système ?",
    "options": [
      "Un journal détaillé de chaque frappe clavier effectuée",
      "Une vue synthétique résumant l'état de santé de Windows 10 dans le temps, recensant les évènements majeurs",
      "Un rapport exclusivement dédié à la consommation réseau",
      "La liste des pilotes signés installés sur le système"
    ],
    "correctIndex": 1,
    "explanation": "L'historique de fiabilité propose une vue synthétique de l'état de santé de Windows 10, en recensant les évènements majeurs survenus sur le système au fil du temps."
  },
  {
    "question": "Pourquoi les outils de diagnostic automatique de Windows sont-ils généralement peu utilisés par les équipes techniques, d'après le module ?",
    "options": [
      "Parce qu'ils sont payants et nécessitent une licence séparée",
      "Parce qu'ils ne fonctionnent que sur Windows Server",
      "Parce que leur process, leur mécanisme et leurs résultats ne sont pas assez transparents, voire inexistants",
      "Parce qu'ils sont incompatibles avec les pilotes signés"
    ],
    "correctIndex": 2,
    "explanation": "Le module précise que les outils de diagnostic automatique ne sont généralement pas utilisés par les équipes techniques car leur process, leur mécanisme et leurs résultats ne sont pas assez transparents, voire inexistants."
  },
  {
    "question": "Que sauvegarde précisément un point de restauration système ?",
    "options": [
      "Les données personnelles de l'utilisateur (documents, photos)",
      "La base de registre, certains fichiers système et des programmes, mais pas les données",
      "Uniquement les pilotes installés",
      "L'intégralité du disque dur, données comprises"
    ],
    "correctIndex": 1,
    "explanation": "Un point de restauration sauvegarde la base de registre, certains fichiers système et des programmes, mais ne sauvegarde pas les données : pour cela, il faut utiliser un outil de sauvegarde classique."
  },
  {
    "question": "La fonctionnalité des points de restauration système est-elle activée par défaut sur Windows 10 ?",
    "options": [
      "Oui, et de façon identique sur tous les volumes simultanément",
      "Oui, mais uniquement sur le volume système C:",
      "Non, elle est désactivée par défaut et s'active volume par volume",
      "Non, elle ne peut être activée que via WinRE"
    ],
    "correctIndex": 2,
    "explanation": "Le module précise que la fonctionnalité de point de restauration est désactivée par défaut, et qu'elle doit être activée volume par volume."
  },
  {
    "question": "Parmi les situations suivantes, laquelle déclenche la création automatique d'un point de restauration, selon le module ?",
    "options": [
      "Uniquement à la demande explicite de l'utilisateur",
      "Uniquement lors de l'arrêt complet de l'ordinateur",
      "Les points de restauration ne peuvent jamais être créés automatiquement",
      "À chaque évènement important comme l'installation d'un pilote, ou avant une mise à jour Windows Update"
    ],
    "correctIndex": 3,
    "explanation": "Les points de restauration peuvent se créer chaque jour, à chaque évènement important du système (comme l'installation d'un pilote ou avant une mise à jour Windows Update), ou manuellement."
  },
  {
    "question": "Que se passe-t-il lorsque l'espace alloué au stockage des points de restauration est totalement occupé ?",
    "options": [
      "Le point de restauration le plus récent prend la place du point le plus ancien",
      "Le système refuse de créer tout nouveau point de restauration",
      "Windows efface automatiquement toutes les données utilisateur",
      "Le système se bloque jusqu'à libération manuelle d'espace"
    ],
    "correctIndex": 0,
    "explanation": "Lorsque l'espace alloué est totalement occupé, le point de restauration le plus récent prend la place du point le plus ancien, fonctionnant ainsi en boucle."
  },
  {
    "question": "Que faire pour restaurer le système à l'aide d'un point de restauration si Windows 10 ne parvient plus à démarrer du tout ?",
    "options": [
      "C'est impossible, il faut obligatoirement réinstaller Windows depuis zéro",
      "Utiliser WinRE pour accéder aux outils de restauration",
      "Attendre que Windows Update répare automatiquement le problème",
      "Débrancher puis rebrancher le disque dur"
    ],
    "correctIndex": 1,
    "explanation": "Si le système entier ne démarre plus, il est possible d'utiliser un point de restauration via WinRE, l'outil de récupération natif qui reste accessible même lorsque l'OS principal ne répond plus."
  },
  {
    "question": "Qu'est-ce que WinRE, tel que décrit dans le module ?",
    "options": [
      "Un antivirus intégré nativement à Windows 10",
      "Un service cloud de sauvegarde Microsoft",
      "Un OS léger et secondaire, natif, permettant de diagnostiquer et réparer l'OS principal lorsqu'il ne répond plus",
      "Un pilote générique utilisé par le magasin de pilotes"
    ],
    "correctIndex": 2,
    "explanation": "WinRE est l'outil officiel et natif de récupération du système d'exploitation : un OS secondaire léger embarquant des outils de diagnostic et de réparation, capable même d'effectuer un retour à la configuration d'usine."
  },
  {
    "question": "Dans quelles circonstances WinRE peut-il se lancer automatiquement, sans action de l'utilisateur ?",
    "options": [
      "Après chaque redémarrage normal du système",
      "Uniquement lorsqu'un nouveau pilote est installé",
      "Jamais, WinRE doit toujours être lancé manuellement",
      "Après 2 échecs consécutifs du démarrage de l'OS principal, ou après 2 arrêts imprévus survenus moins de 2 minutes après le démarrage"
    ],
    "correctIndex": 3,
    "explanation": "WinRE peut se lancer automatiquement après 2 échecs consécutifs du démarrage de l'OS principal, ou après 2 arrêts imprévus de Windows 10 survenus moins de 2 minutes après le démarrage, le système étant alors jugé peu fiable."
  },
  {
    "question": "Quelle commande en ligne de commande permet de lancer WinRE ?",
    "options": [
      "shutdown /r /o",
      "msinfo32 /recovery",
      "pnputil /winre",
      "sfc /scannow /recovery"
    ],
    "correctIndex": 0,
    "explanation": "La commande shutdown /r /o permet de lancer WinRE depuis une invite de commande, en plus des méthodes via le menu Démarrer (MAJ + Redémarrer) ou les paramètres de récupération."
  },
  {
    "question": "Si un périphérique ne fonctionne pas faute de certificat valide pour son pilote, quelle option de démarrage de Windows 10 peut aider à investiguer le problème ?",
    "options": [
      "Le mode sans échec classique",
      "Le mode vidéo basse résolution",
      "Le démarrage en ne prenant pas en compte la signature des pilotes",
      "Le retour à la configuration d'usine"
    ],
    "correctIndex": 2,
    "explanation": "Le démarrage sans application de la signature des pilotes permet de faire fonctionner temporairement un périphérique dont le pilote ne possède pas de certificat valide, afin de poursuivre les investigations."
  },
  {
    "question": "Quels éléments les outils de diagnostic automatique de WinRE peuvent-ils notamment réparer ?",
    "options": [
      "Uniquement les fichiers de registre utilisateur",
      "Uniquement les pilotes d'imprimante",
      "Les fichiers de configuration du pare-feu",
      "Le MBR, la GUID Partition Table, ou le magasin BCD (Boot Configuration Data)"
    ],
    "correctIndex": 3,
    "explanation": "Les outils de diagnostic automatique de WinRE permettent notamment de réparer le MBR, la GUID Partition Table, ou le magasin BCD (Boot Configuration Data), cet ensemble de fichiers qui coordonne le démarrage habituel de Windows."
  },
  {
    "question": "Quelle commande vérifie et répare les fichiers système de Windows ?",
    "options": [
      "chkdsk /f",
      "sfc /scannow",
      "ipconfig /renew",
      "msinfo32"
    ],
    "correctIndex": 1,
    "explanation": "sfc /scannow (System File Checker) analyse les fichiers système protégés et remplace ceux qui sont corrompus. S'il n'y parvient pas, on lance DISM /RestoreHealth puis sfc à nouveau."
  },
  {
    "question": "Un point de restauration permet-il de récupérer des photos supprimées par l'utilisateur ?",
    "options": [
      "Oui, toujours",
      "Non, il ne sauvegarde pas les données personnelles",
      "Oui, si elles étaient sur le bureau",
      "Seulement en mode sans échec"
    ],
    "correctIndex": 1,
    "explanation": "Un point de restauration contient le registre, des fichiers système, les pilotes et les programmes, mais pas les documents de l'utilisateur. Pour eux, il faut une vraie sauvegarde."
  },
  {
    "question": "Quelle console ouvre l'Observateur d'événements ?",
    "options": [
      "eventvwr.msc",
      "services.msc",
      "resmon",
      "devmgmt.msc"
    ],
    "correctIndex": 0,
    "explanation": "eventvwr.msc ouvre l'Observateur d'événements, qui contient les journaux Système, Application et Sécurité : c'est le réflexe numéro 1 du technicien."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme-data",
    });
  });
</script>
