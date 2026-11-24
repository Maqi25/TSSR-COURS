# TP - Manipuler l'aide de PowerShell

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 3 : Interagir avec Windows 10](../../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/index.md).*

*TP du module 3 · durée estimée : 1 heure · VM Discovery puis VM Win10-XX.*

=== "📋 Ce qui est demandé"

    | # | Consigne |
    |---|---|
    | 1 | Sur **Discovery** : afficher l'aide **complète** de `Get-Alias` — quelle cmdlet ? |
    | 2 | Même chose sur **Win10-XX** : pourquoi une telle **différence** entre les deux VM ? |
    | 3 | **Mettre à jour l'aide** : vérifier que Windows Update est suspendu 35 jours, passer la VM en **Bridge**, mettre à jour, revenir en **Host-Only** |
    | 4 | Quelle cmdlet affiche les **exemples** de `Get-Help` ? |
    | 5 | Grâce aux exemples, afficher la liste de tous les **concepts** PowerShell |
    | 6 | Quelle cmdlet explique le concept d'**alias** ? L'afficher dans une **fenêtre séparée** |
    | 7 | Les alias créés sont-ils **conservés** à la fermeture ? Quelle **section de l'aide** explique comment les sauvegarder ? |
    | 8 | Quelle **variable** fixe le nombre de commandes gardées dans l'**historique** ? |
    | 9 | Sa **valeur par défaut** ? Peut-on la modifier ? |

=== "⌨️ Les commandes"

    ```powershell
    Get-Help Get-Alias -Full              # aide complète
    Get-Help Get-Alias -ShowWindow        # aide dans une fenêtre à part
    Update-Help                           # PowerShell lancé EN ADMINISTRATEUR
    Get-Help Get-Help -Examples           # les exemples d'une cmdlet
    Get-Help about_*                      # tous les concepts
    Get-Help about_Aliases -ShowWindow
    Get-Help about_History
    $MaximumHistoryCount                  # affiche la valeur
    $MaximumHistoryCount = 100            # la modifie (pour la session)
    ```

=== "✅ Corrigé expliqué"

    **1. Aide complète** — **`Get-Help Get-Alias -Full`** (ou `-ShowWindow` pour une fenêtre).

    **2. La différence** — sur Win10-XX l'aide est **squelettique** : pas d'exemples, et une section **REMARQUES** indique que les **fichiers d'aide ne sont pas téléchargés**. Windows est livré sans l'aide complète ; Discovery, elle, a déjà été mise à jour.

    **3. Mettre à jour l'aide**

    1. Windows Update : *Options avancées* → **Suspendre les mises à jour** jusqu'à la date maximale (sinon la VM en profite pour se mettre à jour en Bridge).
    2. VMware : clic droit sur la VM → **Settings** → **Network Adapter** → **Bridged**. Accepter le réseau privé (*Oui*).
    3. Ouvrir PowerShell **en tant qu'administrateur** → **`Update-Help`**. Une barre de progression apparaît (sinon : faute de frappe).
    4. Des erreurs rouges sur quelques modules sont **normales** (module absent ou langue indisponible) : ce n'est pas bloquant.
    5. Vérifier avec `Get-Help Get-Alias -Full` (exemples présents), puis **repasser la VM en Host-Only**.

    **4. Exemples** — **`Get-Help Get-Help -Examples`**.

    **5. Concepts** — l'exemple 8 de l'aide donne **`Get-Help about_*`** : les rubriques *about_* expliquent des notions (alias, variables, boucles…) et non des cmdlets.

    **6. Alias** — **`Get-Help about_Aliases -ShowWindow`**.

    **7. Persistance** — **non**, les alias créés disparaissent à la fermeture de la session. La section **SAVING ALIASES** explique de les mettre dans le **profil PowerShell** (voir `about_Profiles`) ou de les exporter avec **`Export-Alias`**.

    **8. Historique** — `Get-Help about_History` → variable **`$MaximumHistoryCount`**.

    **9. Valeur** — **4096** par défaut. Modifiable : **`$MaximumHistoryCount = 100`** (à mettre dans le profil pour que ce soit permanent).
