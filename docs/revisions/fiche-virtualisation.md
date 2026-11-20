# Fiche · Virtualisation de serveurs

*Cours lié : [Cours 13 - Virtualisation de serveurs](../cours/cours-13-virtualisation-de-serveurs/index.md) · 22/02 → 26/02/2027 · 35 h*

## 🗺️ La carte du cours

```mermaid
flowchart LR
    C(("Cours 13<br/>Virtualisation")) --> H["Hyperviseurs<br/>type 1 / type 2,<br/>VT-x, Hyper-V"]
    C --> V["vSphere<br/>ESXi, vCenter,<br/>vMotion, HA, DRS"]
    C --> N["Réseau<br/>vSwitch, groupes de ports,<br/>VLAN, VMkernel"]
    C --> S["Stockage<br/>SAN, NAS, LUN,<br/>datastore, thin/thick"]
    C --> D["Datacenter<br/>pools, modèles,<br/>permissions"]
```

## 📝 L'essentiel

| Notion | À retenir |
| --- | --- |
| **Type 1 / type 2** | Sur le matériel (ESXi, Hyper-V, KVM) / sur un OS (Workstation, VirtualBox) |
| **VT-x / AMD-V** | Virtualisation processeur, à activer dans le BIOS |
| **Commutateurs Hyper-V** | Externe (réseau physique) · Interne (hôte + VM) · Privé (VM seules) |
| **Point de contrôle / snapshot** | Retour en arrière, **pas** une sauvegarde |
| **ESXi / vCenter** | L'hyperviseur / la gestion centralisée (appliance VCSA) |
| **vMotion / Storage vMotion** | Déplacer une VM / ses disques **à chaud** |
| **HA / FT / DRS** | Redémarrage sur un autre hôte / copie en direct sans coupure / équilibrage de charge |
| **VLAN** | ID 1 à 4094, étiquette 802.1Q ; port access / trunk |
| **VMkernel** | Trafic de l'hôte : gestion, vMotion, iSCSI |
| **SAN / NAS** | Mode bloc (FC, iSCSI) / mode fichier (NFS, SMB) |
| **Datastore** | VMFS (sur LUN) ou NFS |
| **Thick / thin** | Espace réservé d'avance / alloué à la demande |
| **Modèle / OVA** | Déploiement en série / format d'échange |

## ✅ Points clés

- Virtualiser = **consolider** : moins de serveurs physiques, moins d'énergie, plus de souplesse.
- Un snapshot qui grossit dégrade les performances : on le **supprime** après usage.
- Les fonctions avancées (vMotion, HA, DRS) demandent **vCenter** et un **stockage partagé**.
- Chaque VM issue d'un modèle Windows doit être **personnalisée** (nom, IP, SID via sysprep).
- En thin provisioning, **surveiller** l'espace réel du datastore.

## 🧠 Quiz express

<div id="quiz-revision-virtualisation"></div>

<script type="application/json" id="quiz-revision-virtualisation-data">
[
  {
    "question": "Quel hyperviseur est de type 1 ?",
    "options": [
      "VirtualBox",
      "VMware Workstation",
      "ESXi",
      "Parallels Desktop"
    ],
    "correctIndex": 2,
    "explanation": "Il s'installe directement sur le serveur."
  },
  {
    "question": "Quel commutateur Hyper-V relie les VM entre elles seulement, sans l'hôte ?",
    "options": [
      "Externe",
      "Interne",
      "Privé",
      "Trunk"
    ],
    "correctIndex": 2,
    "explanation": "L'interne relie aussi l'hôte, l'externe donne accès au réseau physique."
  },
  {
    "question": "Que fait vSphere HA ?",
    "options": [
      "Déplace une VM à chaud",
      "Redémarre les VM d'un hôte en panne sur un autre hôte",
      "Sauvegarde les VM",
      "Chiffre les disques"
    ],
    "correctIndex": 1,
    "explanation": "FT, lui, maintient une copie en direct sans coupure."
  },
  {
    "question": "Un snapshot est-il une sauvegarde ?",
    "options": [
      "Oui",
      "Non, il dépend des disques de la VM et ne protège pas d'une perte du stockage",
      "Oui, s'il a plus d'un jour",
      "Seulement sur Hyper-V"
    ],
    "correctIndex": 1,
    "explanation": "On sauvegarde avec un vrai outil (Veeam…), vers un autre support."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-revision-virtualisation",
      dataId: "quiz-revision-virtualisation-data",
    });
  });
</script>
