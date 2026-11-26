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

    **Le principe** : un poste ne connaît que **son adresse, son masque et sa passerelle**. Pour savoir si **X peut envoyer à Y**, on se met **à la place de X** et on se pose 4 questions dans l'ordre :

    | # | Question (vue par X) | Si oui | Si non |
    |---|---|---|---|
    | 1 | Avec **mon** masque, Y est-il dans **mon** réseau ? | Envoi **direct** (ARP) → question 2 | → question 3 |
    | 2 | Y est-il **physiquement** sur le même segment que moi ? | **V** | **F** (l'ARP ne trouve personne) |
    | 3 | Ma **passerelle** est-elle dans **mon** réseau (et existe-t-elle) ? | J'envoie au routeur → question 4 | **F** |
    | 4 | Le **routeur** a-t-il une interface (ou une route) vers le réseau de Y ? | **P** | **F** (le routeur jette le paquet) |

    ⚠️ Ce tableau dit **qui peut envoyer**. Pour un **dialogue** (partie A), il faut aussi que **la réponse** revienne : on refait les 4 questions **à la place de Y**, avec **son** masque.

    **Exemple pas à pas** (partie A, A → D) : A (172.16.10.10/16) calcule que D (172.16.11.100) est dans 172.16.0.0/16 → envoi direct, D le reçoit. Mais D (/24) calcule que A n'est **pas** dans 172.16.11.0/24 → il voudrait passer par une passerelle, qu'il n'a pas → **pas de réponse**. A **envoie**, mais il n'y a **pas de dialogue**.

    **Résumé de route** : on écrit les réseaux en binaire et on garde les bits **communs** à tous → c'est la longueur du préfixe.

    1. Écrire en binaire l'octet qui **change** (ex. 132 à 135).
    2. Compter les bits **identiques** au début : 132 = 100001**00**, 135 = 100001**11** → 6 bits communs.
    3. Préfixe = bits des octets fixes + bits communs : 8 + 8 + **6** = **/22**.
    4. Adresse du résumé = les bits communs suivis de **0** : 10000100 = **132** → 212.56.132.0/22.

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

    Le routeur relie **10.0.0.0/8** (réseau 1, interface X) et **192.168.1.0/24** (réseau 2, interface Y).

    | Poste | Son réseau (selon **son** masque) | Passerelle OK ? | Conséquence |
    |---|---|---|---|
    | **A** 10.11.2.1/8 | 10.0.0.0/8 | ✅ 10.0.0.254 | **V** vers C (même /8, même segment) · **P** vers D · **F** vers B (192.168.1.35 passe par le routeur, qui l'envoie sur le réseau 2 où B n'est pas) et vers E (192.168.2.x inconnu du routeur) |
    | **B** 192.168.1.35/8 | 192.0.0.0/8 | ❌ 10.0.0.254 hors de 192.0.0.0/8 | Mauvaise adresse (celle du réseau 2) sur le réseau 1 : **F partout**. Même vers D (« local » pour lui), l'ARP part sur le réseau 1, où D n'est pas |
    | **C** 10.0.2.4/16 | 10.0.0.0/16 | ✅ 10.0.0.254 | A (10.11.x) est **hors** de son /16 → passe par le routeur → **P** (alors que A → C est **V** : les masques différents donnent des chemins différents) · **P** vers D |
    | **D** 192.168.1.123/24 | 192.168.1.0/24 | ✅ 192.168.1.254 | **P** vers A et C · **F** vers E : 192.168.2.2 est hors de son /24, et le routeur ne connaît pas 192.168.2.0 |
    | **E** 192.168.2.2/16 | 192.168.0.0/16 | ✅ 192.168.1.254 | **V** vers D (dans son /16, même segment) · **P** vers A et C. Mais **personne ne peut lui répondre** : pour les autres, 192.168.2.2 n'appartient à aucun réseau connu |

    **C. Trois réseaux, un routeur**

    | X pev Y | A | B | C | D | E | F |
    |---|---|---|---|---|---|---|
    | **A** | V | F | F | F | F | F |
    | **B** | F | V | F | F | F | F |
    | **C** | F | F | V | F | F | F |
    | **D** | F | F | F | V | F | F |
    | **E** | F | P | F | V | V | P |
    | **F** | F | P | F | F | F | V |

    Presque tout est faux à cause d'erreurs de configuration volontaires. Le routeur relie **192.168.5.0/24** (réseau 1), **172.20.0.0/16** (réseau 2) et **172.19.0.0/16** (réseau 3).

    | Poste | L'erreur | Conséquence |
    |---|---|---|
    | **A** 192.**167**.5.1/24 | Adresse hors du réseau 1 (192.**168**.5) ; passerelle 192.168.5.254 hors de **son** réseau | Ne joint personne : **F partout** |
    | **B** 192.168.5.35/24 | Passerelle **172.20.0.254** hors de son réseau | Aucun autre poste dans 192.168.5.0/24 → **F partout** |
    | **C** 172.20.1.4/16 | Branché sur le **réseau 1** avec une adresse du réseau 2 ; passerelle hors de son réseau | Ses voisins « locaux » (172.20.x) sont sur un autre segment → **F partout** |
    | **D** 172.20.1.123/**24** | Passerelle **172.20.1.254** qui **n'existe pas** (le routeur est en 172.20.0.254) | E (172.20.0.7) est hors de son /24 → passerelle introuvable → **F partout** |
    | **E** 172.20.0.7/16 | ✅ bien configuré | **V** vers D (même /16, même segment) · **P** vers B (192.168.5.0 connu du routeur) et vers F (172.19.0.0 connu) · **F** vers A (192.167 inconnu) et vers C (local pour E, mais C est sur le réseau 1) |
    | **F** 172.19.2.2/**8** | Masque trop large : tout 172.x.x.x lui semble local | **P** vers B seulement · **F** vers C, D, E (172.20.x « local » → ARP sur le réseau 3, où ils ne sont pas) et vers A |

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

    **Comment trouver les routes de R1, pas à pas** :

    1. R1 est branché sur **13.107.0.0/20** et **13.107.16.0/20** : il les connaît déjà, **aucune route** à ajouter pour eux.
    2. Tous les autres réseaux sont **à droite**, donc derrière **R2**.
    3. On cherche les **plus gros blocs** du tableau de découpage qui ne contiennent **que** des réseaux de droite :
        - 13.107.32.0/**19** (son voisin 13.107.0.0/19 contient les réseaux de R1, on ne peut pas monter plus haut) ;
        - 13.107.64.0/**18** (64.0 et 96.0) ;
        - 13.107.128.0/**17** (toute la seconde moitié).
    4. Résultat : **3 routes** au lieu de 7.

    Même raisonnement pour chaque routeur : les réseaux **à gauche** vont vers le routeur de gauche, ceux **à droite** vers le routeur de droite, toujours avec les plus gros blocs possibles.

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
