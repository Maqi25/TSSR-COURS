# TP - Les ACL

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 6 : La sécurité NTFS et les ACL](../../cours/cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl/index.md).*

*TP du module 6 · durée estimée : 1 heure · VM Win10-XX (suite des TP stockage et utilisateurs) et VM Discovery.*

=== "📋 Ce qui est demandé"

    **Sur Win10-XX**

    | # | Consigne |
    |---|---|
    | 1 | Sur **DATA**, créer le dossier **Echange** |
    | 2 | Quelles sont ses **autorisations par défaut** ? |
    | 3 | Y créer fichiers et dossiers : **héritent**-ils des autorisations du parent ? |
    | 4 | ACL de **Echange** : collègues en **Modification**, administrateurs en **Contrôle total**, utilisateurs du poste en **Lecture** — puis **tester** |
    | 5 | Sur **TOOLS**, créer **logiciels** et **manuels d'utilisation** : Yann et François en **Modification**, utilisateurs en **Lecture**, administrateurs en **Contrôle total** — puis **tester** |

    **Sur Discovery, en PowerShell**

    | # | Consigne |
    |---|---|
    | 6 | Afficher les droits du dossier **M:\2022** |
    | 7 | Quelle cmdlet **modifie** les ACL ? |

=== "⌨️ Les commandes"

    Le TP se fait à la souris (clic droit → **Propriétés** → onglet **Sécurité**). Les équivalents en ligne de commande :

    ```bat
    icacls D:\Echange                                       :: voir les ACL
    icacls D:\ /remove "Utilisateurs authentifiés"          :: retirer une entrée
    icacls D:\Echange /grant L_Collegues:(OI)(CI)M          :: M = Modification, héritée
    icacls E:\logiciels /grant L_Informatiques:(OI)(CI)M
    ```

    `(OI)` = s'applique aux fichiers, `(CI)` = aux sous-dossiers · `F` contrôle total · `M` modification · `RX` lecture et exécution.

    ```powershell
    Get-Acl M:\2022
    Get-Acl M:\2022 | Format-List          # détail des entrées (Access)
    Set-Acl                                # modifie une ACL (avec un objet préparé par Get-Acl)
    ```

=== "✅ Corrigé expliqué"

    **1-2. Droits par défaut** — dans **Echange** → Propriétés → **Sécurité** :

    | Entité | Droit |
    |---|---|
    | Utilisateurs authentifiés | **Modification** |
    | Système | **Contrôle total** |
    | Administrateurs | **Contrôle total** |
    | Utilisateurs | **Lecture et exécution** |

    Les coches sont **grisées** : ces droits sont **hérités** de la racine du volume D:.

    **3. Héritage** — **oui**, un nouveau fichier reçoit les mêmes droits (coches grisées). Le bouton **Avancé** montre la colonne **Hérité de : D:\\**.

    **4. ACL d'Echange** (une méthode parmi d'autres)

    1. Sur la **racine D:** → Sécurité → **Modifier** → supprimer **Utilisateurs authentifiés** (sinon tout le monde garde la Modification par héritage). Garder **Système** et **Administrateurs** en Contrôle total et **Utilisateurs** en Lecture.
    2. Sur **Echange** → Sécurité → **Modifier** → **Ajouter…** → **L_Collegues** → cocher **Modification** (Écriture se coche toute seule).

    **Tester** — 2 méthodes :

    - **En vrai** : se connecter avec chaque compte.

        | Compte | Lire | Créer un fichier | Modifier les ACL |
        |---|---|---|---|
        | Romain (Utilisateurs) | ✅ | ❌ | ❌ |
        | Alix (L_Collegues) | ✅ | ✅ | ❌ |
        | francois (Administrateurs) | ✅ | ✅ | ✅ |

    - **Plus rapide** : Sécurité → **Avancé** → onglet **Accès effectif** → *Sélectionner un utilisateur* → **Afficher l'accès effectif**.

    **5. TOOLS** — même logique : retirer *Utilisateurs authentifiés* à la racine **E:**, créer **logiciels** et **manuels d'utilisation** (ils héritent : Système et Administrateurs en Contrôle total, Utilisateurs en Lecture), puis ajouter **L_Informatiques** en **Modification** sur les deux dossiers.

    !!! tip "Bonne pratique : des groupes, pas des comptes"
        On met **le groupe L_Informatiques** (dont Yann et François sont membres) dans l'ACL, et **pas** les deux comptes un par un. Un nouvel informaticien ? On l'ajoute au groupe, sans toucher aux ACL.

    **6.** **`Get-Acl M:\2022`** (ajouter `| Format-List` pour lire toutes les entrées).

    **7.** **`Set-Acl`**.
