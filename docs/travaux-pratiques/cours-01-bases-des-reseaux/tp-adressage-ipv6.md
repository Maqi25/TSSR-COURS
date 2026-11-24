# TP - Adressage IPv6

*Rattaché au cours [Cours 1 - Bases des réseaux, Module 6 : L'adressage IPv6](../../cours/cours-01-bases-des-reseaux/module-6-l-adressage-ipv6/index.md).*

*TP en ligne (quiz du campus) · 3 questions.*

!!! info "Énoncé reconstitué"
    Les adresses sont relues sur la capture de ta tentative (peu lisible par endroits). En cas de doute sur une adresse, vérifie sur le campus : la **méthode** du corrigé reste la même.

=== "📋 Ce qui est demandé"

    **Questions 1 et 2 — Simplifier** les adresses (forme la plus courte), par exemple :

    - `fe80:0000:0000:0000:0000:4cff:fe4f:4f50`
    - `2001:0688:1f80:2000:0203:ffff:0018:ef1e`
    - `2001:0688:1f80:0000:0203:ffff:4c18:00e0`
    - `0000:0000:0000:0000:0000:0000:0000:0000` · `…:0001`
    - `1ffe:0000:0a88:85a3:0000:0000:0c10:8001`
    - `2001:0660:2402:1001:0000:0000:0000:0001`
    - `2001:0000:0000:0000:0208:02ff:fedc:5633`
    - `2001:0000:2402:1001:0000:0000:fedc:5633`

    **Question 3 — Écrire la forme développée** (8 groupes de 4 chiffres), ou répondre « impossible » :

    `::0` · `::208:19` · `2003::2` · `2001::45:0:6` · `fec0:0:0:ffff::1` · `fe80::1` · `fe80::4cd2:ffa1::1`

=== "🧮 La méthode"

    **Les 2 règles pour raccourcir**

    1. Dans chaque groupe, on **supprime les 0 de tête** : `0688` → `688`, `00e0` → `e0`, `0000` → `0`.
    2. On remplace **une seule** suite de groupes à zéro (la **plus longue**) par `::`.

    **Pour développer** : on compte les groupes présents, `::` remplace les groupes manquants pour arriver à **8**, puis on complète chaque groupe à 4 chiffres.

    !!! warning "Les pièges"
        - `::` **une seule fois** par adresse, sinon on ne sait pas combien de zéros mettre de chaque côté → **impossible**.
        - On ne supprime **que les 0 de tête**, jamais ceux de fin : `00e0` → `e0` (et pas `0e`), `fe4f` reste `fe4f`.

=== "✅ Corrigé expliqué"

    **Questions 1 et 2 — Simplification**

    | Adresse | Forme simplifiée |
    |---|---|
    | fe80:0000:0000:0000:0000:4cff:fe4f:4f50 | **fe80::4cff:fe4f:4f50** |
    | 2001:0688:1f80:2000:0203:ffff:0018:ef1e | **2001:688:1f80:2000:203:ffff:18:ef1e** |
    | 2001:0688:1f80:0000:0203:ffff:4c18:00e0 | **2001:688:1f80::203:ffff:4c18:e0** |
    | 0000:…:0000 (8 groupes à zéro) | **::** |
    | 0000:…:0000:0001 | **::1** (loopback) |
    | 1ffe:0000:0a88:85a3:0000:0000:0c10:8001 | **1ffe:0:a88:85a3::c10:8001** |
    | fe80:0000:…:0001 | **fe80::1** |
    | 2001:0660:2402:1001:0000:0000:0000:0001 | **2001:660:2402:1001::1** |
    | 2001:0000:0000:0000:0208:02ff:fedc:5633 | **2001::208:2ff:fedc:5633** |
    | 2001:0000:2402:1001:0000:0000:fedc:5633 | **2001:0:2402:1001::fedc:5633** |

    Les erreurs de ta tentative : `fe4f` écrit `fef` (on n'enlève pas un 4 du milieu !) et `00e0` laissé tel quel (il fallait `e0`).

    **Question 3 — Forme développée**

    | Adresse | Forme développée |
    |---|---|
    | ::0 | 0000:0000:0000:0000:0000:0000:0000:0000 |
    | ::208:19 | 0000:0000:0000:0000:0000:0000:0208:0019 |
    | 2003::2 | 2003:0000:0000:0000:0000:0000:0000:0002 |
    | 2001::45:0:6 | 2001:0000:0000:0000:0000:0045:0000:0006 |
    | fec0:0:0:ffff::1 | fec0:0000:0000:ffff:0000:0000:0000:0001 |
    | fe80::1 | fe80:0000:0000:0000:0000:0000:0000:0001 |
    | fe80::4cd2:ffa1::1 | **impossible** (deux `::`) |

    *Exemple* — `2001::45:0:6` : 4 groupes écrits (2001, 45, 0, 6) → il en manque 4, que `::` remplace → `2001:0:0:0:0:45:0:6`, puis on complète à 4 chiffres.
