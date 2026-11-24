# TP - Les classes IPv4

*Rattaché au cours [Cours 1 - Bases des réseaux, Module 3 : L'adressage IPv4](../../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md).*

!!! info "Correction type"
    La capture du TP du campus est illisible : voici une série d'exercices **du même type** (retrouver la classe et le masque par défaut d'une adresse), avec leur correction.

=== "📋 Ce qui est demandé"

    Pour chaque adresse, indique sa **classe**, son **masque par défaut** et si elle est **publique**, **privée** ou **spéciale**.

    `10.0.0.1` · `172.20.5.4` · `192.168.1.1` · `130.12.1.1` · `200.1.1.1` · `1.2.3.4` · `191.255.1.1` · `223.10.10.10` · `127.0.0.1` · `169.254.10.5` · `224.0.0.5` · `245.1.1.1`

=== "🧮 La méthode"

    On regarde **uniquement le 1er octet** :

    | Classe | 1er octet | Bits de tête | Masque par défaut | Plage privée |
    |---|---|---|---|---|
    | **A** | 1 – 126 | `0…` | 255.0.0.0 (/8) | 10.0.0.0/8 |
    | **B** | 128 – 191 | `10…` | 255.255.0.0 (/16) | 172.16.0.0 → 172.31.255.255 (/12) |
    | **C** | 192 – 223 | `110…` | 255.255.255.0 (/24) | 192.168.0.0/16 |
    | **D** | 224 – 239 | `1110…` | — (multicast) | — |
    | **E** | 240 – 255 | `1111…` | — (expérimental) | — |

    Cas spéciaux : **127.x.x.x** = boucle locale (loopback) · **169.254.x.x** = APIPA (pas de DHCP).

=== "✅ Corrigé expliqué"

    | Adresse | Classe | Masque par défaut | Type |
    |---|---|---|---|
    | 10.0.0.1 | A | 255.0.0.0 | **Privée** |
    | 172.20.5.4 | B | 255.255.0.0 | **Privée** (172.16 → 172.31) |
    | 192.168.1.1 | C | 255.255.255.0 | **Privée** |
    | 130.12.1.1 | B | 255.255.0.0 | Publique |
    | 200.1.1.1 | C | 255.255.255.0 | Publique |
    | 1.2.3.4 | A | 255.0.0.0 | Publique |
    | 191.255.1.1 | B | 255.255.0.0 | Publique (dernière valeur de la classe B) |
    | 223.10.10.10 | C | 255.255.255.0 | Publique (dernière valeur de la classe C) |
    | 127.0.0.1 | (A) | — | **Loopback** : la machine elle-même |
    | 169.254.10.5 | B | 255.255.0.0 | **APIPA** : le poste n'a pas eu de DHCP |
    | 224.0.0.5 | D | — | **Multicast** |
    | 245.1.1.1 | E | — | **Expérimental** (inutilisable) |

    !!! warning "Les pièges"
        - **172.32.0.1** n'est **pas** privée : la plage privée s'arrête à 172.31.
        - **127** n'est ni A « normale » ni utilisable sur le réseau : c'est le loopback.
