# TP - Prise en main de la cmd

*Rattaché au cours [Cours 2 - Système client Microsoft, Module 3 : Interagir avec Windows 10](../../cours/cours-02-systeme-client-microsoft/module-3-interagir-avec-windows-10/index.md).*

*TP du module 3 · durée estimée : 1 heure · VM Win10-XX.*

=== "📋 Ce qui est demandé"

    | # | Consigne |
    |---|---|
    | 1 | Personnaliser la fenêtre cmd : police **Consolas 24**, couleurs du texte et du fond |
    | 2 | Afficher les **commandes internes** disponibles |
    | 3 | Afficher l'**aide de `cd`** : à quoi sert-elle ? |
    | 4 | Se placer à la **racine de C:** |
    | 5 | Créer le dossier **C:\CommandList** |
    | 6 | Y créer **InternalCommands.txt** contenant la liste des commandes internes |
    | 7 | **Afficher** le contenu de ce fichier |
    | 8 | **Copier** le fichier sur le bureau |
    | 9 | Lister **tout** le contenu du bureau, **trié par taille croissante** — puis snapshot « TP03 terminé » |

=== "⌨️ Les commandes"

    ```bat
    help                                              :: commandes internes
    help cd                                           :: ou : cd /?
    cd c:\
    md CommandList                                    :: ou : mkdir CommandList
    help > c:\CommandList\InternalCommands.txt        :: > redirige l'affichage dans un fichier
    type c:\CommandList\InternalCommands.txt
    copy c:\CommandList\InternalCommands.txt c:\users\<login>\Desktop
    dir /A /OS c:\users\<login>\Desktop               :: /A = tout, /OS = tri par taille
    ```

=== "✅ Corrigé expliqué"

    **1. Personnaliser** — clic sur l'icône en haut à gauche de la fenêtre → **Propriétés** → onglets **Police** et **Couleurs**. (Ou ++ctrl++ + molette pour grossir vite.)

    **2. Commandes internes** — **`help`** liste les commandes intégrées à cmd.exe (cd, dir, copy, type…).

    **3. Aide de cd** — **`help cd`** ou **`cd /?`**. La **1re ligne** de l'aide (le *synopsis*) donne l'utilité : *« Affiche le nom ou change le répertoire en cours. »*

    **4. Racine** — **`cd c:\`**

    **5. Dossier** — **`md CommandList`** (ou `mkdir`).

    **6. Fichier** — **`help > c:\CommandList\InternalCommands.txt`** : le **`>`** envoie le résultat dans un fichier au lieu de l'écran (`>>` ajouterait à la fin sans écraser).

    **7. Afficher** — **`type c:\CommandList\InternalCommands.txt`** (l'équivalent de `cat` sous Linux).

    **8. Copier** — **`copy c:\CommandList\InternalCommands.txt c:\users\<login>\Desktop`**, où `<login>` est le compte créé à l'installation. On peut aussi utiliser `xcopy` ou `robocopy`.

    !!! note "Coquille du corrigé ENI"
        Le corrigé PDF écrit `InternalList.txt` : le bon nom est **InternalCommands.txt**.

    **9. Lister trié** — **`dir /A /OS c:\users\<login>\Desktop`** : **`/A`** affiche aussi les fichiers cachés et système, **`/OS`** trie par taille (*Order Size*), du plus petit au plus grand (`/O-S` pour l'inverse).
