# Fiche · Les infrastructures réseau

*Cours lié : [Cours 7 - Les infrastructures réseau](../cours/cours-07-les-infrastructures-reseau/index.md) · 21/12/2026 → 08/01/2027 · 63 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 7<br/>Cisco")) --> I["IOS<br/>modes, console,<br/>mots de passe"]
    C --> S["Commutation<br/>table MAC, VLAN,<br/>trunk, SSH"]
    C --> R["Routage<br/>statique, RIPv2,<br/>inter-VLAN"]
    C --> W["Wi-Fi<br/>802.11, SSID,<br/>WPA3"]
    C --> A["ACL et NAT<br/>filtrer, traduire"]
    C --> M["Maintenance<br/>TFTP, ROMMON,<br/>mot de passe perdu"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **Modes IOS** | `>` utilisateur → `enable` → `#` privilégié → `conf t` → `(config)#` |
| **Enregistrer** | `copy running-config startup-config` (RAM → NVRAM) |
| **`enable secret`** | Mot de passe privilégié haché |
| **VLAN** | 1 à 4094 · `switchport mode access` + `switchport access vlan 10` |
| **Trunk 802.1Q** | `switchport mode trunk` · VLAN natif identique des deux côtés |
| **SSH** | `ip domain-name` + `crypto key generate rsa` + `login local` + `transport input ssh` |
| **Route statique** | `ip route réseau masque saut-suivant` · défaut `0.0.0.0 0.0.0.0` |
| **Distance administrative** | Connecté 0 · statique 1 · OSPF 110 · RIP 120 |
| **Inter-VLAN** | Router-on-a-stick (`encapsulation dot1Q`) ou switch L3 (`ip routing`) |
| **Wi-Fi** | Wi-Fi 6 = 802.11ax · WPA3 recommandé · 802.1X en entreprise |
| **ACL** | Standard (source) près de la destination · étendue près de la source · `deny any` implicite |
| **Wildcard** | `0.0.0.255` pour un /24 |
| **PAT** | `ip nat inside/outside` + ACL + `ip nat inside source list … overload` |
| **Mot de passe perdu** | Ctrl+Pause → `confreg 0x2142` → `copy start run` → nouveau mot de passe → `0x2102` |

## ✅ Points clés

- Toujours **enregistrer** après une modification validée : la running-config est perdue à l'extinction.
- Les interfaces d'un **routeur** sont éteintes par défaut : `no shutdown`.
- Une route statique se pense **aller et retour** : chaque routeur doit connaître le chemin.
- Une ACL est lue **de haut en bas**, et sans `permit` final elle bloque tout.
- Vérifier avec les `show` : `show vlan brief`, `show interfaces trunk`, `show ip route`, `show access-lists`, `show ip nat translations`.

## 🧠 Quiz express

<div id="quiz-revision-infrastructures-reseau"></div>

<script type="application/json" id="quiz-revision-infrastructures-reseau-data">
[
  {
    "question": "Quelle commande enregistre la configuration d'un équipement Cisco ?",
    "options": ["show running-config", "copy running-config startup-config", "reload", "erase startup-config"],
    "correctIndex": 1,
    "explanation": "Elle copie la configuration en cours (RAM, perdue à l'extinction) vers la configuration de démarrage (NVRAM, conservée)."
  },
  {
    "question": "Sur un trunk 802.1Q, quel VLAN circule sans étiquette ?",
    "options": ["Le VLAN 4094", "Le VLAN natif", "Le VLAN voix", "Aucun"],
    "correctIndex": 1,
    "explanation": "Les trames du VLAN natif traversent le trunk sans étiquette. Il doit être le même des deux côtés."
  },
  {
    "question": "Une route statique (AD 1) et une route RIP (AD 120) mènent au même réseau. Laquelle gagne ?",
    "options": ["La RIP", "La statique", "Les deux", "La plus récente"],
    "correctIndex": 1,
    "explanation": "La distance administrative la plus petite gagne : elle indique l'origine la plus fiable."
  },
  {
    "question": "Où place-t-on une ACL étendue ?",
    "options": ["Près de la destination", "Près de la source", "Sur le switch", "Sur le PC"],
    "correctIndex": 1,
    "explanation": "Elle connaît la destination et le port : près de la source, elle arrête le trafic indésirable au plus tôt sans bloquer autre chose."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-infrastructures-reseau",
      dataId: "quiz-revision-infrastructures-reseau-data",
    });
  });
</script>
