# TP - Gestion des utilisateurs et des groupes

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 5 : Les utilisateurs et les groupes](../../cours/cours-02-systeme-client-microsoft/module-5-les-utilisateurs-et-les-groupes/index.md).*

*TP du module 5 · durée estimée : 1 h 30 · VM Win10-XX (console, cmd) et VM Discovery (PowerShell).*

=== "📋 Ce qui est demandé"

    **Avec la console des utilisateurs (Win10-XX)**

    | # | Consigne |
    |---|---|
    | 1 | **François** : mot de passe **sans expiration**, membre de **L_Informatiques** et **L_Responsables** (créer les groupes avant) |
    | 2 | **Yann** : mêmes groupes que François |
    | 3 | **2 collègues** (nom, prénom, login, mot de passe au choix) dans **L_Collegues** |

    **Privilèges d'administration**

    | # | Consigne |
    |---|---|
    | 4 | François **administre tout** le poste |
    | 5 | Yann **consulte les journaux** et **configure la carte réseau** |
    | 6 | Les collègues peuvent **sauvegarder** le poste |
    | 7 | **Retirer** un collègue du groupe **Utilisateurs** |

    **Informations** — lister les propriétés d'un **utilisateur** et d'un **groupe** dans la console.

    **En cmd.exe**

    | # | Consigne |
    |---|---|
    | 8 | Afficher les infos du compte **François** |
    | 9 | Afficher les membres du groupe **Administrateurs** |
    | 10 | Créer **Romain** avec un mot de passe **invisible à l'écran** |
    | 11 | Ajouter Romain à **L_Responsables** |

    **Manipulations** — fermer la session · qui peut ouvrir une session ? · pourquoi un collègue ne le peut pas ? · se connecter en François et observer les **profils** · afficher son **SID** et ceux de ses groupes.

    **En PowerShell (Discovery)**

    | # | Consigne |
    |---|---|
    | 12 | Lister les utilisateurs : **nom**, **SID**, **description** |
    | 13 | Pour **james** : nom complet, description, classe d'objet, dernière connexion |
    | 14 | Description **« Compte générique avec privilèges d'administration »** pour **adm** |
    | 15 | **Nom** et **SID** des membres de **L_SupportInfo** |

=== "⌨️ Les commandes"

    **cmd.exe** (lancé **en administrateur** pour créer ou modifier)

    ```bat
    net user francois                          :: infos du compte
    net localgroup administrateurs             :: membres du groupe
    net user Romain * /add                     :: * = mot de passe demandé sans affichage
    net localgroup L_Responsables Romain /add
    logoff
    whoami /user                               :: SID de l'utilisateur connecté
    whoami /groups                             :: SID de ses groupes
    ```

    **PowerShell (Discovery)**

    ```powershell
    Get-LocalUser | Select-Object Name, SID, Description
    Get-LocalUser -Name james | Select-Object FullName, Description, ObjectClass, LastLogon
    Set-LocalUser -Name adm -Description "Compte générique avec privilèges d'administration"
    Get-LocalGroupMember -Name L_SupportInfo | Select-Object Name, SID
    ```

    **Équivalents PowerShell des créations** (pour info)

    ```powershell
    New-LocalGroup -Name L_Informatiques
    New-LocalUser -Name francois -Password (Read-Host -AsSecureString) -PasswordNeverExpires
    Add-LocalGroupMember -Group L_Informatiques -Member francois
    ```

=== "✅ Corrigé expliqué"

    **1. François** — MaConsole → **Utilisateurs et groupes locaux** → *Utilisateurs* → clic droit **Nouvel utilisateur** → login `francois`, mot de passe → décocher *doit changer le mot de passe* → cocher **Le mot de passe n'expire jamais** → Créer.
    Puis *Groupes* → **Nouveau groupe** → **L_Informatiques** → **Ajouter…** → `francois` → Créer. Idem **L_Responsables**.

    **2. Yann** — créer l'utilisateur, puis **Propriétés** → onglet **Membre de** → **Ajouter…** → `L_Informatiques;L_Responsables` (le `;` permet d'en saisir plusieurs).

    **3. Collègues** — créer 2 comptes (ex. Alix et Pauline), puis le groupe **L_Collegues** avec ces deux membres.

    **4-6. Privilèges** — on utilise les **groupes prédéfinis** de Windows :

    | Besoin | Groupe prédéfini |
    |---|---|
    | François administre tout | **Administrateurs** |
    | Yann lit les journaux | **Lecteurs des journaux d'événements** |
    | Yann configure le réseau | **Opérateurs de configuration réseau** |
    | Les collègues sauvegardent | **Opérateurs de sauvegarde** (on y met les 2 comptes) |

    On ajoute les **comptes** directement : sur un poste client, on ne peut pas imbriquer un groupe local dans un autre groupe local depuis l'interface.

    **7.** Groupe **Utilisateurs** → retirer l'un des collègues.

    **Propriétés d'un utilisateur** — nom complet, description, 3 options de mot de passe (changer à la prochaine ouverture, n'expire jamais, ne peut pas changer), 2 options de compte (désactivé, verrouillé), **Membre de**, **Profil** (chemin du profil, script d'ouverture de session, dossier de base / lecteur réseau).
    **Propriétés d'un groupe** — description et liste des membres.

    **8.** **`net user francois`** — affiche bien plus d'infos que la console (dernière connexion, expiration, heures d'accès…).

    **9.** **`net localgroup administrateurs`**.

    **10.** **`net user Romain * /add`** — l'**`*`** fait demander le mot de passe sans l'afficher. Il faut une invite **en administrateur** : créer un compte modifie le système.

    **11.** **`net localgroup L_Responsables Romain /add`**.

    **Session** — **`logoff`**. Peuvent ouvrir une session locale : les membres de **Utilisateurs**, **Administrateurs** ou **Invités**. Le collègue retiré de *Utilisateurs* (et membre d'aucun de ces groupes) **n'apparaît plus** sur l'écran de connexion.

    **Profils** — à la 1re connexion de François, Windows crée son profil **C:\Users\francois** à partir du **Profil par défaut**. Pour les voir : `sysdm.cpl` → **Paramètres système avancés** → **Profils des utilisateurs**. Il y a **moins de profils que d'utilisateurs** : Yann ou Romain, qui ne se sont jamais connectés, n'en ont pas encore.

    **SID** — **`whoami /user`** puis **`whoami /groups`**. Ensemble, ces SID forment le **jeton d'accès** de l'utilisateur, utilisé pour vérifier ses droits (ACL, module 6).

    **12-15.** Voir l'onglet commandes. Pour la 14, mets bien le texte demandé par l'énoncé.

    !!! note "Écart avec le corrigé ENI"
        Le PDF met la description « Compte générique administrateur de secours » : l'énoncé demande **« Compte générique avec privilèges d'administration »**.
