# TP - Conversion en binaire

*Rattaché au cours [Cours 1 - Bases des réseaux, Module 3 : L'adressage IPv4](../../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md).*

!!! info "Correction type"
    La capture du TP du campus est illisible : voici une série d'exercices **du même type** (conversion décimal ⇄ binaire sur 8 bits), avec leur correction. Les questions du campus se résolvent exactement de la même façon.

=== "📋 Ce qui est demandé"

    **1. Convertis en binaire (8 bits)** : 10 · 25 · 64 · 127 · 128 · 172 · 192 · 200 · 224 · 240 · 248 · 252 · 255

    **2. Convertis en décimal** : 00000001 · 00010100 · 01100100 · 10101010 · 11001010 · 11111110

    **3. Écris en binaire** l'adresse `192.168.1.10` et le masque `255.255.255.192`.

=== "🧮 La méthode"

    On utilise le **tableau des poids** d'un octet :

    | Bit | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 |
    |---|---|---|---|---|---|---|---|---|
    | **Poids** | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

    - **Décimal → binaire** : de gauche à droite, si le nombre restant est ≥ au poids, on met **1** et on soustrait le poids, sinon **0**.
      Exemple 172 : 172−128=44 → **1** · 44<64 → **0** · 44−32=12 → **1** · 12<16 → **0** · 12−8=4 → **1** · 4−4=0 → **1** · **0** · **0** = `10101100`.
    - **Binaire → décimal** : on additionne les poids des bits à **1**.
      Exemple `01100100` = 64 + 32 + 4 = **100**.

    !!! tip "Les valeurs de masque à connaître par cœur"
        128 · 192 · 224 · 240 · 248 · 252 · 254 · 255 = des **1 qui se remplissent depuis la gauche** (10000000, 11000000, 11100000…).

=== "✅ Corrigé expliqué"

    **1. Décimal → binaire**

    | Décimal | Binaire | Décimal | Binaire |
    |---|---|---|---|
    | 10 | 00001010 | 192 | 11000000 |
    | 25 | 00011001 | 200 | 11001000 |
    | 64 | 01000000 | 224 | 11100000 |
    | 127 | 01111111 | 240 | 11110000 |
    | 128 | 10000000 | 248 | 11111000 |
    | 172 | 10101100 | 252 | 11111100 |
    | | | 255 | 11111111 |

    **2. Binaire → décimal**

    | Binaire | Calcul | Décimal |
    |---|---|---|
    | 00000001 | 1 | **1** |
    | 00010100 | 16 + 4 | **20** |
    | 01100100 | 64 + 32 + 4 | **100** |
    | 10101010 | 128 + 32 + 8 + 2 | **170** |
    | 11001010 | 128 + 64 + 8 + 2 | **202** |
    | 11111110 | 255 − 1 | **254** |

    **3. Adresse et masque**

    ```text
    192.168.1.10      = 11000000.10101000.00000001.00001010
    255.255.255.192   = 11111111.11111111.11111111.11000000   (/26)
    ```
