# TP - Premiers pas avec PowerShell

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 3 : Interagir avec Windows 10](../../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/index.md).*

*TP du module 3 · durée estimée : 30 minutes · VM Win10-XX puis VM Discovery.*

=== "📋 Ce qui est demandé"

    **Sur la VM Win10-XX**

    | # | Consigne |
    |---|---|
    | 1 | Personnaliser la fenêtre PowerShell (police, taille, fenêtre) |
    | 2 | Quelle **version de PowerShell** est installée ? |
    | 3 | Afficher le contenu du **répertoire courant** : quelle cmdlet ? |
    | 4 | Afficher le contenu de **C:\Users** : quelle cmdlet ? |
    | 5 | Afficher la **liste des alias** : quelle cmdlet ? Quels sont les alias de **Get-ChildItem** ? — puis snapshot « TP04 terminé » |

    **Sur la VM Discovery** (session `adm`)

    | # | Consigne |
    |---|---|
    | 6 | Afficher le contenu de **C:\PowerShell\Intro.txt** : quelle cmdlet ? |
    | 7 | Dans quel répertoire es-tu ? Se déplacer à la **racine de C:\\** |

=== "⌨️ Les commandes"

    ```powershell
    $PSVersionTable                    # ou : Get-Host
    Get-ChildItem                      # contenu du dossier courant
    Get-ChildItem -Path C:\Users
    Get-Alias                          # tous les alias
    Get-Alias -Definition Get-ChildItem   # seulement ceux de Get-ChildItem
    Get-Content C:\PowerShell\Intro.txt
    Get-Location                       # où suis-je ? (alias : pwd)
    Set-Location C:\                   # alias : cd
    ```

=== "✅ Corrigé expliqué"

    **1. Personnaliser** — ++ctrl++ + molette vers le haut grossit police et fenêtre ensemble (ou clic sur l'icône → Propriétés).

    **2. Version** — **`$PSVersionTable`** (ligne *PSVersion*, 5.1 sur Windows 10) ou **`Get-Host`**.

    **3. Répertoire courant** — **`Get-ChildItem`**.

    **4. C:\Users** — **`Get-ChildItem -Path C:\Users`**.

    **5. Alias** — **`Get-Alias`**. Les alias de Get-ChildItem sont **`dir`**, **`gci`** et **`ls`** : PowerShell reprend les noms connus de cmd (dir) et de Linux (ls) pour faciliter la transition.

    **6. Lire un fichier** — **`Get-Content`** (alias **`gc`**, **`type`**, **`cat`**).

    **7. Se déplacer** — l'invite `PS C:\Users\adm>` indique le dossier courant (ou **`Get-Location`**). On va à la racine avec **`Set-Location C:\`** (alias `cd`, vu au TP cmd).

    !!! tip "Retenir la logique Verbe-Nom"
        Toutes les cmdlets s'écrivent **Verbe-Nom** : `Get-` lit, `Set-` modifie, `New-` crée, `Remove-` supprime. Avec ça, on devine souvent le nom d'une commande.
