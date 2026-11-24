# TP - Devenir autonome avec PowerShell

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 3 : Interagir avec Windows 10](../../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/index.md).*

*TP du module 3 · durée estimée : 1 h 30 · VM Win10-XX puis VM Discovery.*

=== "📋 Ce qui est demandé"

    **Sur Win10-XX**

    | # | Consigne |
    |---|---|
    | 1 | Afficher les **commandes disponibles** |
    | 2 | N'afficher que les **cmdlets** |
    | 3 | N'afficher que les cmdlets dont le verbe est **Get** |
    | 4 | Quelle cmdlet liste les **groupes locaux** ? |
    | 5 | Quelles sont les **2 propriétés** affichées par défaut ? |
    | 6 | Quelles sont les **autres propriétés**, non affichées ? |
    | 7 | Afficher le **SID** et la **source principale** du groupe *Utilisateurs du Bureau à distance* |

    **Sur Discovery**

    | # | Consigne |
    |---|---|
    | 8 | Quelle commande affiche les **disques durs** ? Combien y en a-t-il ? |
    | 9 | Afficher le **numéro** et le **modèle** des disques |
    | 10 | N'afficher que le **nom**, le **type de bus** et le **fabricant** du **disque 2** |
    | 11 | Afficher le **nom**, le **statut** et la **description du pilote** de la carte réseau |
    | 12 | Afficher les **membres du groupe Administrateurs** |
    | 13 | Même chose, **redirigé** dans **C:\Users\AdminMembers.txt** |

=== "⌨️ Les commandes"

    ```powershell
    Get-Command
    Get-Command -CommandType Cmdlet
    Get-Command -CommandType Cmdlet -Name Get-*
    Get-Command Get-*group*                         # pour trouver la bonne cmdlet
    Get-LocalGroup
    Get-LocalGroup | Select-Object *                # TOUTES les propriétés
    Get-LocalGroup -Name "Utilisateurs du Bureau*" | Select-Object SID, PrincipalSource

    Get-Disk
    Get-Disk | Select-Object Number, Model
    Get-Disk -Number 2 | Select-Object FriendlyName, BusType, Manufacturer
    Get-NetAdapter | Select-Object Name, Status, DriverDescription
    Get-LocalGroupMember -Name "Administrateurs"
    Get-LocalGroupMember -Name "Administrateurs" > C:\Users\AdminMembers.txt
    Get-Content C:\Users\AdminMembers.txt           # vérification
    ```

=== "✅ Corrigé expliqué"

    **La démarche à retenir** (le vrai but du TP) :

    1. **Trouver** la commande : `Get-Command *mot-clé*`
    2. **Lire** l'aide et les exemples : `Get-Help <cmdlet> -Examples`
    3. **Tester** la cmdlet seule
    4. **Découvrir** les propriétés avec `| Select-Object *`, puis ne garder que celles demandées

    **1-3.** **`Get-Command`** → **`-CommandType Cmdlet`** pour filtrer le type → **`-Name Get-*`** pour filtrer le verbe (forme courte : `Get-Command -Type Cmdlet Get-*`).

    **4.** **`Get-LocalGroup`** — trouvée avec `Get-Command Get-*group*`.

    **5.** Par défaut : **Name** et **Description**.

    **6.** `Get-LocalGroup | Select-Object *` révèle **SID**, **PrincipalSource** et **ObjectClass**. PowerShell n'affiche qu'une partie des propriétés d'un objet : `Select-Object *` montre tout.

    **7.** `Get-LocalGroup -Name "Utilisateurs du Bureau*" | Select-Object SID, PrincipalSource` → **S-1-5-32-555**, **Local**. Le `*` évite de taper le nom complet.

    **8.** **`Get-Disk`** → la VM Discovery a **4 disques**.

    **9.** `Get-Disk | Select-Object Number, Model` — *Model* n'est pas affiché par défaut, on le découvre avec `Select-Object *`.

    **10.** `Get-Disk -Number 2 | Select-Object FriendlyName, BusType, Manufacturer`.

    **11.** `Get-NetAdapter | Select-Object Name, Status, DriverDescription`.

    **12.** **`Get-LocalGroupMember -Name "Administrateurs"`** (ou `Get-LocalGroupMember Administrateurs`).

    **13.** On ajoute **`> C:\Users\AdminMembers.txt`** à la fin, puis on vérifie avec `Get-ChildItem C:\Users` (le fichier existe) et `Get-Content C:\Users\AdminMembers.txt` (son contenu).
