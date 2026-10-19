# Fiche · Bases des réseaux

*Cours lié : [Cours 1 - Bases des réseaux](../cours/cours-01-bases-des-reseaux/index.md) · 19/10 → 23/10/2026 · 35 h*

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **CIDR /24 /25 /26 /27 /30** | 254 / 126 / 62 / 30 / 2 hôtes |
| **Ports** | HTTP 80, HTTPS 443, SSH 22, DNS 53, RDP 3389, DHCP 67-68 |
| **APIPA** | 169.254.0.0/16 |
| **Privé** | 10/8, 172.16/12, 192.168/16 |
| **8 bits** | 1 octet |
| **Diagnostic** | ping IP, ping nom, tracert, nslookup |

## ✅ Points clés

- Switch = couche 2 (MAC) ; routeur = couche 3 (IP).
- PDU : données, segment, paquet, trame, bits.
- Hôtes utilisables = 2^n − 2.
- TCP fiable (3-way handshake) ; UDP rapide sans garantie.
- Ping OK sur l'IP mais pas sur le nom : problème DNS.

## 🧠 Quiz express

<div id="quiz-revision-bases-des-reseaux"></div>

<script type="application/json" id="quiz-revision-bases-des-reseaux-data">
[
  {
    "question": "À quelle couche travaille un switch classique ?",
    "options": ["1", "2", "3", "4"],
    "correctIndex": 1,
    "explanation": "Il commute des trames d'après les adresses MAC."
  },
  {
    "question": "Combien d'hôtes utilisables dans un /26 ?",
    "options": ["30", "62", "64", "126"],
    "correctIndex": 1,
    "explanation": "6 bits hôte : 2^6 − 2 = 62."
  },
  {
    "question": "Quel est le PDU de la couche Transport ?",
    "options": ["Trame", "Paquet", "Segment", "Bit"],
    "correctIndex": 2,
    "explanation": "Segment (TCP) ou datagramme (UDP)."
  },
  {
    "question": "Une adresse 169.254.x.x indique…",
    "options": ["Une IP publique", "Un DHCP injoignable (APIPA)", "Un broadcast", "Un loopback"],
    "correctIndex": 1,
    "explanation": "Le poste s'auto-attribue une adresse sans serveur DHCP."
  },
  {
    "question": "Un lien de 100 Mbit/s transfère environ…",
    "options": ["100 Mo/s", "12,5 Mo/s", "1 Mo/s", "800 Mo/s"],
    "correctIndex": 1,
    "explanation": "100 / 8 = 12,5 Mo/s."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-bases-des-reseaux",
      dataId: "quiz-revision-bases-des-reseaux-data",
    });
  });
</script>
