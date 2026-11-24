# TP - La communication

*Rattaché au cours [Cours 1 - Bases des réseaux, Module 4 : La communication](../../cours/cours-01-bases-des-reseaux/module-4-la-communication/index.md).*

*TP M04-01 · durée estimée : 2 heures · sur papier.*

=== "📋 Ce qui est demandé"

    | Partie | Consigne |
    |---|---|
    | **A** | 6 postes sur le même segment, sans routeur, avec des masques /16 ou /24 : **qui peut dialoguer avec qui** (avec réponse) et pourquoi ? |
    | **B** | 2 réseaux reliés par un routeur, 5 postes : remplir le tableau **V / F / P** (Vrai, Faux, Passerelle) |
    | **C** | 3 réseaux reliés par un routeur, 6 postes : même tableau |
    | **D** | Bloc découpé en 9 segments reliés par 8 routeurs en chaîne : écrire le **minimum de routes statiques** de chaque routeur |
    | **E** | Calculer des **résumés de routes** (agrégation) |

    **Les postes de la partie A**

    | Poste | Adresse | Masque |
    |---|---|---|
    | A | 172.16.10.10 | 255.255.0.0 |
    | B | 172.16.11.20 | 255.255.0.0 |
    | C | 172.16.100.30 | 255.255.0.0 |
    | D | 172.16.11.100 | 255.255.255.0 |
    | E | 172.16.100.150 | 255.255.255.0 |
    | F | 172.16.10.200 | 255.255.255.0 |

=== "🧮 La méthode"

    Pour savoir si **X peut parler à Y**, X applique **son propre masque** à l'adresse de Y :

    - Y est **dans le réseau de X** → X envoie **directement** (ARP).
    - Y est **hors du réseau de X** → X envoie à **sa passerelle**. Si la passerelle est joignable et connaît le réseau de Y → **P** ; sinon → **F**.

    Pour qu'il y ait **dialogue**, il faut que **la réponse** revienne aussi : Y refait le même calcul avec **son** masque.

    **Résumé de route** : on écrit les réseaux en binaire et on garde les bits **communs** à tous → c'est la longueur du préfixe.

=== "✅ Corrigé expliqué"

    **A. Même segment, sans routeur**

    | L'hôte | peut contacter | Pourquoi |
    |---|---|---|
    | A | B, C, F | Pour A (/16), tous les 172.16.x.x sont locaux. B et C répondent en /16 ; F répond car A est dans **son** /24 172.16.10.0. D et E (en /24) ne voient pas A dans leur réseau → pas de réponse. |
    | B | A, C, D | Même raisonnement ; D répond car B est dans son /24 172.16.11.0. |
    | C | A, B, E | E répond car C est dans son /24 172.16.100.0. |
    | D | B | Seul B est dans 172.16.11.0/24. |
    | E | C | Seul C est dans 172.16.100.0/24. |
    | F | A | Seul A est dans 172.16.10.0/24. |

    **B. Deux réseaux, un routeur**

    | X pev Y | A | B | C | D | E |
    |---|---|---|---|---|---|
    | **A** | V | F | V | P | F |
    | **B** | F | V | F | F | F |
    | **C** | P | F | V | P | F |
    | **D** | P | F | P | V | F |
    | **E** | P | F | P | V | V |

    - **B** (192.168.1.35) est branché sur le réseau 1 mais a une adresse du réseau 2 et une passerelle 10.0.0.254 hors de son réseau → il ne peut **rien** joindre.
    - **E** (192.168.2.2/16) n'est dans aucun réseau connu du routeur → **personne** ne peut lui répondre, mais lui peut envoyer.

    **C. Trois réseaux, un routeur**

    | X pev Y | A | B | C | D | E | F |
    |---|---|---|---|---|---|---|
    | **A** | V | F | F | F | F | F |
    | **B** | F | V | F | F | F | F |
    | **C** | F | F | V | F | F | F |
    | **D** | F | F | F | V | F | F |
    | **E** | F | P | F | V | V | P |
    | **F** | F | P | F | F | F | V |

    Presque tout est faux à cause d'erreurs de configuration volontaires : A est en 192.**167**.5.1, B a une passerelle hors de son réseau, C et D sont du mauvais côté ou ont une passerelle qui n'existe pas. Seuls **E** et **F** sont bien configurés.

    **D. Routes statiques minimales** (format : réseau/masque → routeur suivant)

    | Routeur | Routes à ajouter |
    |---|---|
    | R1 | 13.107.32.0/19 → R2 · 13.107.64.0/18 → R2 · 13.107.128.0/17 → R2 |
    | R2 | 13.107.0.0/20 → R1 · 13.107.64.0/18 → R3 · 13.107.128.0/17 → R3 |
    | R3 | 13.107.0.0/19 → R2 · 13.107.96.0/19 → R4 · 13.107.128.0/17 → R4 |
    | R4 | 13.107.0.0/18 → R3 · 13.107.128.0/17 → R5 |
    | R5 | 13.107.0.0/18 → R4 · 13.107.64.0/19 → R4 · 13.107.160.0/19 → R6 · 13.107.192.0/18 → R6 |
    | R6 | 13.107.0.0/17 → R5 · 13.107.192.0/18 → R7 |
    | R7 | 13.107.0.0/17 → R6 · 13.107.128.0/19 → R6 · 13.107.224.0/19 → R8 |
    | R8 | 13.107.0.0/17 → R7 · 13.107.128.0/18 → R7 |

    L'astuce : on **regroupe** tout ce qui est du même côté en un seul gros préfixe (/17, /18) au lieu d'une route par réseau. *(L'énoncé écrit « 131.107 » mais le schéma utilise 13.107.)*

    **E. Résumés de routes**

    | Réseaux à agréger | Bits communs | Résumé |
    |---|---|---|
    | 212.56.132.0 → 135.0 /24 | 132 = 100001**00** → 135 = 100001**11** : 6 bits communs | **212.56.132.0/22** |
    | 212.56.146.0 → 149.0 /24 | 146 = 10010**010** → 149 = 10010**101** : 5 bits communs | **212.56.144.0/21** |
    | 212.1.96.0 → 159.0 /24 | 96 = **0**1100000 → 159 = **1**0011111 : aucun bit commun | **212.1.0.0/16** |
    | Toute la classe A | 1er bit = 0 | **0.0.0.0/1** |
    | Toute la classe B | 2 premiers bits = 10 | **128.0.0.0/2** |
    | Toute la classe C | 3 premiers bits = 110 | **192.0.0.0/3** |

    !!! note "Résumé 2"
        212.56.144.0/21 couvre 144 → 151 : il englobe aussi 144, 145, 150 et 151, qui ne sont pas dans la liste. Un résumé peut être **plus large** que les réseaux réels.
