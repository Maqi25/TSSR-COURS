# Fiche · Réseau et sécurité

*Cours lié : [Cours 16 - Réseau et sécurité](../cours/cours-16-reseau-et-securite/index.md) · 15/03 → 26/03/2027 · 70 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 16<br/>Sécurité")) --> F["Pare-feu<br/>matrice de flux,<br/>règles, pfSense"]
    C --> E["Exposer<br/>NAT, DMZ,<br/>IDS/IPS, bastion"]
    C --> V["VPN nomade<br/>OpenVPN, WireGuard"]
    C --> S["VPN site à site<br/>IPsec, IKE"]
    C --> A["Sécuriser<br/>proxy, certificats,<br/>HTTPS, LDAPS"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **Matrice de flux** | Source, destination, port, action : avant toute règle |
| **Règles** | Lues de haut en bas, la première qui correspond gagne ; refus par défaut |
| **Block / reject** | Bloquer en silence / en prévenant l'émetteur |
| **Redirection de port** | IP WAN:443 → serveur interne:443 |
| **DMZ** | Zone des services exposés ; DMZ → LAN interdit |
| **IDS / IPS** | Détecte et alerte / détecte et bloque |
| **VPN** | Tunnel chiffré et authentifié |
| **OpenVPN / WireGuard** | Certificats, UDP 1194 / paires de clés, UDP 51820 |
| **IPsec** | Phase 1 IKE (UDP 500/4500) puis phase 2 (réseaux, ESP) |
| **Proxy Squid** | Port 3128, cache, filtrage, journaux conservés 1 an |
| **Asymétrique** | Clé publique diffusée, clé privée jamais partagée |
| **Certificat** | Clé publique + nom + signature d'une autorité |
| **TLS** | 1.2 et 1.3 seulement |
| **LDAPS** | Port 636 (LDAP en clair : 389) |

## ✅ Points clés

- Jamais de **RDP** ou de **SMB** directement exposé sur Internet : VPN ou bastion.
- PPTP est **obsolète** ; le réseau du tunnel ne doit chevaucher **aucun** autre réseau.
- En IPsec, les deux côtés sont des **miroirs** : mêmes algorithmes, réseaux local/distant inversés.
- Alerte de certificat : CA non approuvée, **nom** différent, certificat **expiré** ou chaîne incomplète.
- Apache : `a2enmod ssl`, `a2ensite`, puis **`apache2ctl configtest`** avant le reload.

## 🧠 Quiz express

<div id="quiz-revision-reseau-et-securite"></div>

<script type="application/json" id="quiz-revision-reseau-et-securite-data">
[
  {
    "question": "Que faut-il établir avant d'écrire les règles d'un pare-feu ?",
    "options": [
      "Le plan de sauvegarde",
      "La matrice de flux",
      "La liste des imprimantes",
      "Le schéma électrique"
    ],
    "correctIndex": 1,
    "explanation": "Elle liste les flux autorisés : source, destination, port, action."
  },
  {
    "question": "Où place-t-on un serveur web accessible depuis Internet ?",
    "options": [
      "Dans le LAN",
      "En DMZ",
      "Sur un poste client",
      "Dans le VLAN d'administration"
    ],
    "correctIndex": 1,
    "explanation": "S'il est compromis, l'attaquant reste bloqué dans la DMZ."
  },
  {
    "question": "Que négocie la phase 1 d'IPsec ?",
    "options": [
      "Les réseaux qui passent dans le tunnel",
      "L'authentification des passerelles et les clés (IKE)",
      "Les adresses DHCP",
      "Les règles NAT"
    ],
    "correctIndex": 1,
    "explanation": "La phase 2 définit les réseaux et chiffre les données en ESP."
  },
  {
    "question": "Quel est le port de LDAPS ?",
    "options": [
      "389",
      "443",
      "636",
      "3389"
    ],
    "correctIndex": 2,
    "explanation": "LDAPS chiffre les échanges avec l'annuaire."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-reseau-et-securite",
      dataId: "quiz-revision-reseau-et-securite-data",
    });
  });
</script>
