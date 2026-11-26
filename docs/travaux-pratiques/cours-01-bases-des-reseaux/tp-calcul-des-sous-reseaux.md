# TP - Calcul des sous-réseaux

*Rattaché au cours [Cours 1 - Bases des réseaux, Module 3 : L'adressage IPv4](../../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md).*

*TP M03-04 · durée estimée : 3 heures · sur papier.*

=== "📋 Ce qui est demandé"

    | Partie | Consigne |
    |---|---|
    | **A** | Pour 14 adresses en notation CIDR : sont-elles **valides pour un hôte** ? Donner réseau, diffusion et masque en notation standard |
    | **B** | Trouver le **masque CIDR** qui donne le nombre de sous-réseaux / d'hôtes demandé (on part du masque de classe) |
    | **C** | 7 scénarios : nb de segments + nb d'hôtes par segment → **masque**, **nb de sous-réseaux**, **nb d'hôtes** |
    | **D** | Donner les 7 segments d'un découpage de `199.210.15.0/24` (schéma en camembert) |
    | **E** | Découper 3 réseaux /24 pour des besoins donnés (VLSM) |
    | **F** | Retrouver les **segments inutilisés** de 6 réseaux |

=== "🧮 La méthode"

    **Les 3 formules à connaître**

    - Nb de **sous-réseaux** = 2^(bits empruntés)
    - Nb d'**hôtes** par sous-réseau = 2^(bits hôte) − 2 (on retire l'adresse réseau et la diffusion)
    - **Pas** (taille d'un bloc) = 256 − valeur du masque dans l'**octet intéressant** (le dernier octet du masque qui n'est ni 255 ni 0)

    | CIDR (dans l'octet) | /…1 | /…2 | /…3 | /…4 | /…5 | /…6 | /…7 | /…8 |
    |---|---|---|---|---|---|---|---|---|
    | Valeur du masque | 128 | 192 | 224 | 240 | 248 | 252 | 254 | 255 |
    | Pas | 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1 |

    Exemples : /25, /17 et /9 donnent tous un masque à **128** (dans le 4e, 3e et 2e octet) ; /20 → 255.255.**240**.0 ; /11 → 255.**224**.0.0.

    | CIDR | /25 | /26 | /27 | /28 | /29 | /30 |
    |---|---|---|---|---|---|---|
    | Masque | .128 | .192 | .224 | .240 | .248 | .252 |
    | Pas | 128 | 64 | 32 | 16 | 8 | 4 |
    | Hôtes | 126 | 62 | 30 | 14 | 6 | 2 |

    ---

    **A · Une adresse est-elle valide pour un hôte ? (méthode du pas)**

    1. Trouver l'**octet intéressant** et le **pas** : 192.0.35.12 /26 → 4e octet, masque 192, pas = 256 − 192 = **64**.
    2. Lister les **débuts de blocs** de ce pas : 0, **64**, 128, 192.
    3. Le bloc qui contient la valeur (12) commence à **0** → **réseau 192.0.35.0**.
    4. **Diffusion** = début du bloc suivant − 1 = 64 − 1 → **192.0.35.63**.
    5. Les octets **après** l'octet intéressant valent **0** pour le réseau et **255** pour la diffusion.
    6. L'adresse est valide **si elle n'est ni le réseau ni la diffusion**.

    Exemple sur le 3e octet : 120.146.80.1 /20 → masque 255.255.240.0, pas 16 → blocs 64, **80**, 96 → réseau **120.146.80.0**, diffusion **120.146.95.255** (96 − 1 = 95, puis 255).

    ---

    **B · Trouver le masque pour N sous-réseaux**

    1. Partir du **masque de classe** : A = /8, B = /16, C = /24.
    2. Chercher la plus petite puissance de 2 **≥ N** : 2ⁿ ≥ N → on **emprunte n bits**.
    3. Nouveau masque = masque de classe + n.

    Exemple : ≈ 2020 sous-réseaux dans 10.0.0.0 (classe A, /8) → 2¹¹ = 2048 ≥ 2020 → **/8 + 11 = /19**.

    Pour un nombre d'**hôtes** : chercher h bits tels que 2ʰ − 2 ≥ hôtes, puis masque = **32 − h**. Ex. 2 adresses (point à point) → 2² − 2 = 2 → /30.

    ---

    **C · Masque pour N segments de H hôtes : la double vérification**

    1. Bits **réseau** : plus petit n avec 2ⁿ ≥ N segments.
    2. Bits **hôte** restants = 32 − (masque de classe + n).
    3. **Vérifier** : 2^(bits hôte) − 2 ≥ H ? Si non → impossible avec ce réseau (cas « X » de la partie B).

    Exemple, scénario 1 : 5 segments de 25 hôtes dans 192.177.4.0 (classe C, /24) → 2³ = 8 ≥ 5 → **/27** → 5 bits hôte → 2⁵ − 2 = **30 ≥ 25** ✅.

    ---

    **D et E · Découpage VLSM (masques de tailles différentes)**

    1. Pour chaque besoin, prendre le **plus petit bloc** qui suffit : 115 postes → /25 (126) ; 58 → /26 (62) ; 25 → /27 (30) ; 12 → /28 (14) ; 5 → /29 (6).
    2. Ranger les besoins **du plus gros au plus petit**.
    3. Placer chaque bloc sur la **première adresse libre**, en partant de .0. Un bloc commence toujours sur un **multiple de son pas** (un /27 commence à 0, 32, 64…).
    4. Le bloc suivant commence **là où le précédent finit** : .0/25 → le suivant démarre à .128.

    Exemple 195.220.12.0/24 : **.0/25** (115) → **.128/26** (58) → **.192/27** (25) → **.224/28** (12) → **.240/29** et **.248/29** (5 et 5). Le /24 est rempli exactement.

    ---

    **F · Trouver les segments inutilisés**

    1. Dessiner le **tableau de découpage** (/24 → /25 → /26…) et colorier les blocs utilisés.
    2. Un bloc est **libre** s'il n'est ni utilisé, ni **à l'intérieur** d'un bloc utilisé, ni **découpé** en blocs utilisés.
    3. Regrouper les morceaux libres voisins en **un seul bloc** quand c'est possible (deux /28 voisins et alignés = un /27).

    Méthode rapide pour un « réseau de classe C » sans adresses : additionner les tailles utilisées (/26 = 64, /27 = 32, /28 = 16), retirer de 256, puis découper le reste en puissances de 2.

=== "✅ Corrigé expliqué"

    **A. Validité des adresses**

    | Adresse | Valide | @ réseau | @ diffusion | Masque |
    |---|---|---|---|---|
    | 12.1.1.1 /8 | OUI | 12.0.0.0 | 12.255.255.255 | 255.0.0.0 |
    | 209.207.177.100 /30 | **NON** (= réseau) | 209.207.177.100 | 209.207.177.103 | 255.255.255.252 |
    | 192.0.35.12 /26 | OUI | 192.0.35.0 | 192.0.35.63 | 255.255.255.192 |
    | 120.146.80.1 /20 | OUI | 120.146.80.0 | 120.146.95.255 | 255.255.240.0 |
    | 120.80.1.0 /11 | OUI | 120.64.0.0 | 120.95.255.255 | 255.224.0.0 |
    | 211.104.16.17 /29 | OUI | 211.104.16.16 | 211.104.16.23 | 255.255.255.248 |
    | 172.168.0.1 /24 | OUI | 172.168.0.0 | 172.168.0.255 | 255.255.255.0 |
    | 109.168.248.32 /21 | OUI | 109.168.248.0 | 109.168.255.255 | 255.255.248.0 |
    | 96.139.84.12 /21 | OUI | 96.139.80.0 | 96.139.87.255 | 255.255.248.0 |
    | 172.16.32.0 /25 | **NON** (= réseau) | 172.16.32.0 | 172.16.32.127 | 255.255.255.128 |
    | 172.16.0.127 /25 | **NON** (= diffusion) | 172.16.0.0 | 172.16.0.127 | 255.255.255.128 |
    | 192.168.19.87 /29 | **NON** (= diffusion) | 192.168.19.80 | 192.168.19.87 | 255.255.255.248 |
    | 172.16.32.1 /18 | OUI | 172.16.0.0 | 172.16.63.255 | 255.255.192.0 |
    | 210.71.10.128 /28 | **NON** (= réseau) | 210.71.10.128 | 210.71.10.143 | 255.255.255.240 |

    *Exemple de raisonnement* — 120.80.1.0 /11 : l'octet intéressant est le 2e, pas = 256 − 224 = 32 → blocs 0, 32, **64**, 96… 80 est dans le bloc 64-95 → réseau 120.64.0.0, diffusion 120.95.255.255. L'adresse 120.80.1.0 est au milieu du bloc : **valide** (même si elle finit par .0).

    **B. Calcul de masque**

    | Besoin | Réseau de départ | Calcul | CIDR |
    |---|---|---|---|
    | ≥ 120 sous-réseaux | 172.16.0.0 (B, /16) | 2⁷ = 128 | **/23** |
    | 2 adresses par sous-réseau | 192.168.1.0 (C) | 2 bits hôte | **/30** |
    | ≥ 31 sous-réseaux | 185.221.0.0 (B) | 2⁵ = 32 | **/21** |
    | ≥ 15 sous-réseaux | 131.107.0.0 (B) | 2⁴ = 16 | **/20** |
    | ≈ 500 sous-réseaux | 140.10.0.0 (B) | 2⁹ = 512 | **/25** |
    | Exactement 8 | 192.168.10.0 (C) | 2³ = 8 | **/27** |
    | 10 sous-réseaux de ≥ 17 hôtes | 214.12.33.0 (C) | 4 bits réseau → 14 hôtes < 17 | **impossible** |
    | ≈ 2020 sous-réseaux | 10.0.0.0 (A, /8) | 2¹¹ = 2048 | **/19** |
    | 127 sous-réseaux | 188.23.0.0 (B) | 2⁷ = 128 | **/23** |

    **C. Masque, nombre de réseaux et d'hôtes**

    | Scénario | Besoin | Masque | Sous-réseaux | Hôtes / segment |
    |---|---|---|---|---|
    | 1 · 192.177.4.0 (C) | 5 seg. × 25 hôtes | **255.255.255.224** (/27) | 8 | 30 |
    | 2 · 39.0.0.0 (A) | 100 seg. × 88 000 | **255.254.0.0** (/15) | 128 | 131 070 |
    | 3 · 171.133.0.0 (B) | 100 seg. × 350 | **255.255.254.0** (/23) | 128 | 510 |
    | 4 · 128.199.0.0 (B) | 16 seg. × 1 500 | **255.255.240.0** (/20) | 16 | 4 094 |
    | 5 · 191.254.0.0 (B) | 250 seg. × 100 | **255.255.255.0** (/24) | 256 | 254 |
    | 6 · 216.121.44.0 (C) | 12 seg. × 12 | **255.255.255.240** (/28) | 16 | 14 |
    | 7 · 134.119.0.0 (B) | 50 seg. × 600 | **255.255.252.0** (/22) | 64 | 1 022 |

    !!! warning "Écart avec le corrigé ENI"
        Le corrigé PDF de la partie C emprunte **un bit de trop** à chaque scénario (ex. scénario 1 : /28 → 14 hôtes, alors qu'il en faut 25). Ses réponses ne respectent pas le nombre d'hôtes demandé.
        La règle : prendre **le minimum de bits** pour les segments, puis **vérifier** que les hôtes restants suffisent.
        Scénarios 4 et 5 : /21 et /25 marchent aussi (plus de sous-réseaux, toujours assez d'hôtes).

    **D. Découpage de 199.210.15.0 /24**

    On coupe en 2, on garde la 1re moitié, on recoupe la 2e, etc. :

    | Segment | Adresse | Hôtes |
    |---|---|---|
    | 1 | 199.210.15.0 /25 | 126 |
    | 2 | 199.210.15.128 /26 | 62 |
    | 3 | 199.210.15.192 /27 | 30 |
    | 4 | 199.210.15.224 /29 | 6 |
    | 5 | 199.210.15.232 /29 | 6 |
    | 6 | 199.210.15.240 /29 | 6 |
    | 7 | 199.210.15.248 /29 | 6 |

    **E. Découpage VLSM**

    | Réseau | Besoin | Segment | Hôtes valides |
    |---|---|---|---|
    | **195.220.12.0/24** | 115 postes | 195.220.12.0 /25 | 126 |
    | | 58 postes | 195.220.12.128 /26 | 62 |
    | | 25 machines | 195.220.12.192 /27 | 30 |
    | | ~12 hôtes | 195.220.12.224 /28 | 14 |
    | | 5 machines | 195.220.12.240 /29 | 6 |
    | | 5 machines | 195.220.12.248 /29 | 6 |
    | **192.168.10.0/24** | ~60 hôtes ×3 | .0 /26 · .64 /26 · .128 /26 | 62 chacun |
    | | ~30 postes | 192.168.10.192 /27 | 30 |
    | | ≥ 11 machines ×2 | .224 /28 · .240 /28 | 14 chacun |
    | **222.8.15.0/24** | ~100 hôtes | 222.8.15.0 /25 | 126 |
    | | 28 hôtes ×4 | .128 /27 · .160 /27 · .192 /27 · .224 /27 | 30 chacun |

    Total des adresses valides : 244 · 244 · 246.

    **F. Segments inutilisés**

    | Réseau | Utilisés | **Libres** |
    |---|---|---|
    | 1 · 112.19.0.0/16 | 0/18, 64/18, 128/19, 160/20, 176/20, 224/20, 240/20 | **112.19.192.0 /19** |
    | 2 · 192.168.10.0/24 | .0/25, .128/27, .160/27, .224/28 | **.192 /27** et **.240 /28** |
    | 3 · 199.1.1.0/24 | .0/26, .128/27, .160/27, .192/28, .224/28, .240/28 | **.64 /26** et **.208 /28** |
    | 4 · classe C | 1×/26 + 3×/27 + 4×/28 = 224 adresses | **un /27** (32 adresses, ex. .224/27) |
    | 5 · classe C | 3×/27 + 3×/28 = 144 adresses | **un /26 + un /27 + un /28** (112 adresses) |
    | 6 · classe C | 1×/26 + 1×/28 = 80 adresses | **deux /26 + un /27 + un /28** (176 adresses) |

    *Astuce* : additionne les tailles des blocs utilisés (64, 32, 16…), retire-les de 256, puis découpe le reste en blocs de puissances de 2.

    *Exemple détaillé, réseau 2* : le /25 utilisé prend .0 à .127. Dans la 2e moitié (.128/25) : .128/27 et .160/27 sont pris → le /26 .128 est plein. Le /26 .192 contient .224/28 (pris) : il reste **.192/27** (32 adresses) et **.240/28** (16 adresses).

    **Erreurs fréquentes** (relevées dans des copies de ce TP)

    | Erreur | Exemple | La bonne réponse |
    |---|---|---|
    | Recopier l'adresse comme adresse **réseau** | 192.0.35.12 /26 → « réseau 192.0.35.12 » | Le réseau est le **début du bloc** : 192.0.35.**0** |
    | **Inverser** réseau et diffusion | 120.80.1.0 /11 → « réseau 120.80.1.0, diffusion 120.64.0.0 » | Réseau 120.**64**.0.0, diffusion 120.**95**.255.255 |
    | Oublier les octets **après** l'octet intéressant | 120.146.80.1 /20 → diffusion « 120.146.0 » | Après l'octet intéressant : **0** (réseau) ou **255** (diffusion) → 120.146.95.**255** |
    | Écrire une **adresse** dans la colonne masque | 172.16.32.0 /25 → masque « 172.16.32.128 » | Le masque d'un /25 est **255.255.255.128** |
    | Oublier l'**octet intéressant** dans l'écriture | 210.71.10.128 /28 → « 210.71.128 » | Toujours **4 octets** : 210.71.**10**.128 |
    | Dire « .0 = toujours invalide » | 120.80.1.0 /11 | **Valide** : avec un /11, le réseau est 120.64.0.0 ; .0 au dernier octet n'est pas forcément le réseau |
    | Masque hors limites | 10.0.0.0 « /119 » | Un masque va de **/0 à /32** : ici **/19** |
