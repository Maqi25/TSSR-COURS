# Fiche · Services réseau en environnement Microsoft

*Cours lié : [Cours 8 - Les services réseau en environnement Microsoft](../cours/cours-08-les-services-reseau-en-environnement-microsoft/index.md) · 11/01 → 22/01/2027 · 70 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 8<br/>Windows Server")) --> W["Windows Server<br/>rôles, Core, RAID"]
    C --> AD["Active Directory<br/>forêt, DC, UO,<br/>groupes AGDLP"]
    C --> G["GPO<br/>LSDOU, gpupdate,<br/>gpresult"]
    C --> R["Routage et NAT<br/>routes, pfSense"]
    C --> DH["DHCP<br/>DORA, étendues,<br/>réservations"]
    C --> DN["DNS<br/>zones, enregistrements,<br/>redirecteurs"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **Rôle** | `Install-WindowsFeature Nom -IncludeManagementTools` |
| **RAID 1 / 5** | Miroir / 3 disques minimum, supporte la panne d'un disque |
| **AD DS** | DNS pour localiser, LDAP pour interroger, Kerberos pour authentifier |
| **AGDLP** | Comptes → groupe Global → groupe Domaine Local → Permissions |
| **FSMO** | 5 rôles : 2 de forêt, 3 de domaine |
| **LSDOU** | Ordre d'application des GPO : Locale, Site, Domaine, UO (la dernière gagne) |
| **GPO** | `gpmc.msc` · `gpupdate /force` · `gpresult /r` |
| **Route par défaut** | `0.0.0.0/0` · `route print` |
| **NAT / PAT** | IP privée → IP publique / plusieurs machines distinguées par le port |
| **DORA** | Discover, Offer, Request, Ack · UDP 67/68 |
| **Options DHCP** | 003 passerelle · 006 DNS · 015 domaine |
| **Agent relais** | Transmet le DHCP à un serveur d'un autre réseau |
| **DNS** | Cache → hosts → serveur · port 53 |
| **Enregistrements** | A, AAAA, CNAME (alias), MX (mail), PTR (inverse), SRV (services AD) |

## ✅ Points clés

- **Deux contrôleurs de domaine** au minimum ; le DNS de l'AD est indispensable.
- Un serveur DHCP Windows doit être **autorisé dans l'AD** pour distribuer des adresses.
- Haute disponibilité DHCP : règle **80/20** ou **basculement**.
- Une GPO **Ordinateur** s'applique au démarrage, une GPO **Utilisateur** à l'ouverture de session.
- **Bloquer l'héritage** sur une UO ; une liaison **Appliquée** passe outre ce blocage.

## 🧠 Quiz express

<div id="quiz-revision-services-reseau-microsoft"></div>

<script type="application/json" id="quiz-revision-services-reseau-microsoft-data">
[
  {
    "question": "Quel est l'ordre d'application des GPO ?",
    "options": [
      "UO, Domaine, Site, Locale",
      "Locale, Site, Domaine, UO",
      "Domaine, UO, Site, Locale",
      "Site, Locale, UO, Domaine"
    ],
    "correctIndex": 1,
    "explanation": "LSDOU : la dernière appliquée l'emporte en cas de conflit."
  },
  {
    "question": "Quelle option DHCP donne la passerelle par défaut ?",
    "options": [
      "006",
      "003",
      "015",
      "044"
    ],
    "correctIndex": 1,
    "explanation": "006 donne les serveurs DNS, 015 le nom de domaine."
  },
  {
    "question": "Quel enregistrement DNS fait correspondre une IP à un nom ?",
    "options": [
      "A",
      "MX",
      "PTR",
      "CNAME"
    ],
    "correctIndex": 2,
    "explanation": "PTR, dans une zone de recherche inversée."
  },
  {
    "question": "Dans AGDLP, à quel groupe donne-t-on les droits sur la ressource ?",
    "options": [
      "Au groupe global",
      "Au groupe domaine local",
      "Directement aux comptes",
      "Au groupe universel"
    ],
    "correctIndex": 1,
    "explanation": "Les comptes vont dans le groupe global, lui-même membre du domaine local."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-services-reseau-microsoft",
      dataId: "quiz-revision-services-reseau-microsoft-data",
    });
  });
</script>
