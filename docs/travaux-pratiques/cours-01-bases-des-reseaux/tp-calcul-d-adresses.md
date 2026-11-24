# TP - Calcul d'adresses

*Rattaché au cours [Cours 1 - Bases des réseaux, Module 3 : L'adressage IPv4](../../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md).*

*TP en ligne (quiz du campus) · masques par défaut des classes A, B et C.*

=== "📋 Ce qui est demandé"

    Pour chaque adresse et son masque, indique :

    1. le **numéro de réseau** ;
    2. le **nombre d'hôtes** par réseau ;
    3. l'**adresse de diffusion** (broadcast).

    | Adresse | Masque |
    |---|---|
    | 10.44.160.1 *(exemple)* | 255.0.0.0 |
    | 164.2.34.35 | 255.255.0.0 |
    | 101.2.3.18 | 255.0.0.0 |
    | 210.222.5.121 | 255.255.255.0 |
    | 11.107.56.23 | 255.0.0.0 |
    | 223.254.254.254 | 255.255.255.0 |
    | 152.91.10.150 | 255.255.0.0 |
    | 81.17.66.38 | 255.0.0.0 |
    | 128.21.30.253 | 255.255.0.0 |
    | 192.168.18.69 | 255.255.255.0 |
    | 98.54.56.23 | 255.0.0.0 |
    | 194.224.199.234 | 255.255.255.0 |
    | 191.255.252.20 | 255.255.0.0 |

=== "🧮 La méthode"

    | Masque | Partie réseau | Nb d'hôtes | Réseau | Diffusion |
    |---|---|---|---|---|
    | `255.0.0.0` (/8) | 1er octet | 2²⁴ − 2 = **16 777 214** | `X.0.0.0` | `X.255.255.255` |
    | `255.255.0.0` (/16) | 2 premiers octets | 2¹⁶ − 2 = **65 534** | `X.Y.0.0` | `X.Y.255.255` |
    | `255.255.255.0` (/24) | 3 premiers octets | 2⁸ − 2 = **254** | `X.Y.Z.0` | `X.Y.Z.255` |

    - **Réseau** : on garde les octets où le masque vaut 255, on met **0** ailleurs.
    - **Diffusion** : on garde les mêmes octets, on met **255** ailleurs.
    - **Hôtes** : 2^(bits hôte) − 2 (on retire l'adresse réseau et la diffusion).

=== "✅ Corrigé expliqué"

    | Adresse | @ réseau | Nb hôtes | @ diffusion |
    |---|---|---|---|
    | 10.44.160.1 /8 | 10.0.0.0 | 16 777 214 | 10.255.255.255 |
    | 164.2.34.35 /16 | 164.2.0.0 | 65 534 | 164.2.255.255 |
    | 101.2.3.18 /8 | 101.0.0.0 | 16 777 214 | 101.255.255.255 |
    | 210.222.5.121 /24 | 210.222.5.0 | 254 | 210.222.5.255 |
    | 11.107.56.23 /8 | 11.0.0.0 | 16 777 214 | 11.255.255.255 |
    | 223.254.254.254 /24 | 223.254.254.0 | 254 | 223.254.254.255 |
    | 152.91.10.150 /16 | 152.91.0.0 | 65 534 | 152.91.255.255 |
    | 81.17.66.38 /8 | 81.0.0.0 | 16 777 214 | 81.255.255.255 |
    | 128.21.30.253 /16 | 128.21.0.0 | 65 534 | 128.21.255.255 |
    | 192.168.18.69 /24 | 192.168.18.0 | 254 | 192.168.18.255 |
    | 98.54.56.23 /8 | 98.0.0.0 | 16 777 214 | 98.255.255.255 |
    | 194.224.199.234 /24 | 194.224.199.0 | 254 | 194.224.199.255 |
    | 191.255.252.20 /16 | 191.255.0.0 | 65 534 | 191.255.255.255 |

    !!! tip "Le piège"
        Le nombre d'hôtes ne dépend **que du masque**, jamais de l'adresse : tous les /16 ont 65 534 hôtes, quelle que soit l'adresse.
