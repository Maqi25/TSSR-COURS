# TP - Prise en main de l'interface graphique

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 3 : Interagir avec Windows 10](../../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/index.md).*

*TP du module 3 · durée estimée : 30 minutes · VM Win10-XX puis VM Discovery.*

=== "📋 Ce qui est demandé"

    **Sur la VM Win10-XX**

    | # | Consigne |
    |---|---|
    | 1 | Ouvrir une session puis **changer le mot de passe** |
    | 2 | Retirer **Windows Store** et **Courrier** de la barre des tâches, y épingler **Windows PowerShell** |
    | 3 | **Suspendre Windows Update** 35 jours au plus |
    | 4 | Quel est le **nom du PC** ? (DESKTOP-…) |
    | 5 | **Renommer le PC** avec le nom de la VM |
    | 6 | Créer une **console MMC personnalisée** (disques, utilisateurs et groupes, partages) sur le bureau |
    | 7 | Changer le **papier peint** |
    | 8 | **Désactiver la mise en veille** — puis snapshot « TP02 terminé » |

    **Sur la VM Discovery** (session `adm`)

    | # | Consigne |
    |---|---|
    | 9 | Quels **composants logiciels enfichables** contient la console **admConsole** du bureau ? |
    | 10 | Renommer l'OS en **DiscoveryXX** |
    | 11 | Suspendre Windows Update 35 jours au plus |

=== "⌨️ Les raccourcis et commandes"

    | Action | Interface graphique | Équivalent en ligne de commande |
    |---|---|---|
    | Changer le mot de passe | ++ctrl+alt+del++ → *Modifier un mot de passe* | `net user <login> *` |
    | Nom du PC | Rechercher *Nom* → *Afficher le nom de votre PC* | `hostname` |
    | Renommer le PC | *Renommer ce PC* + redémarrage | `Rename-Computer -NewName "Win10-XX" -Restart` |
    | Console MMC | Exécuter (++win+r++) → `mmc` | `mmc` |
    | Gestion des disques | — | `diskmgmt.msc` |
    | Utilisateurs et groupes locaux | — | `lusrmgr.msc` |
    | Dossiers partagés | — | `fsmgmt.msc` |
    | Mise en veille | Rechercher *Veille* | `powercfg /change standby-timeout-ac 0` |

=== "✅ Corrigé expliqué"

    **1. Mot de passe** — ++ctrl+alt+del++ dans la VM (menu VMware *VM > Send Ctrl+Alt+Del*) → *Modifier un mot de passe*.

    **2. Barre des tâches** — clic droit sur l'icône → **Détacher de la barre des tâches**. Puis Rechercher *PowerShell* → clic droit → **Épingler à la barre des tâches**.

    **3. Windows Update** — Rechercher *Windows Update* → **Options avancées** → **Suspendre les mises à jour** → choisir la date maximale (35 jours).

    **4-5. Nom du PC** — Rechercher *Nom* → **Afficher le nom de votre PC** : un nom aléatoire `DESKTOP-XXXXXXX`. **Renommer ce PC** → nom de la VM → **redémarrage obligatoire**, puis vérifier.

    **6. Console MMC personnalisée**

    1. ++win+r++ → `mmc`
    2. **Fichier > Ajouter/Supprimer des composants logiciels enfichables**
    3. Ajouter **Gestion des disques** (cet ordinateur), **Utilisateurs et groupes locaux** (ordinateur local), **Dossiers partagés** (ordinateur local) → OK
    4. **Fichier > Enregistrer sous** → Bureau → **MaConsole.msc**

    Cette console resservira dans tous les TP suivants (stockage, utilisateurs, partages).

    **7. Papier peint** — clic droit sur le bureau → **Personnaliser**.

    **8. Veille** — Rechercher *Veille* → **Modifier les conditions de mise en veille** → Écran : **Jamais**, Veille : **Jamais**.

    **9. admConsole (Discovery)** — elle contient : **Gestion de l'ordinateur**, **Gestionnaire de périphériques**, **Services**.

    **10-11.** Mêmes manipulations que 5 et 3, sur Discovery.
