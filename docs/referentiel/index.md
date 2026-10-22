---
title: Référentiel TSSR (REAC 2026)
---

# Référentiel TSSR (REAC 2026)

Ce que le jury attend de toi le jour du titre, et **où le réviser sur ce site**.

!!! abstract "Quelle version te concerne ?"
    Le titre **Technicien supérieur systèmes et réseaux** (niveau 5, bac + 2) a été **révisé par l'arrêté du 16 juin 2026** (JORF du 19 juin 2026). La nouvelle version, enregistrée sous le code **RNCP 42463**, s'applique aux parcours **commencés à partir du 1ᵉʳ septembre 2026**, pour 5 ans (jusqu'au 31/08/2031).

    Ta formation a commencé le **12/10/2026** : c'est **cette version** qui s'applique. L'ancienne (arrêté du 26 avril 2023, RNCP 37682, 2 blocs) ne concerne que les parcours commencés avant. **Fais-le confirmer par ton centre (ENI)**, qui organise ta session d'examen.

## 🧭 Les 3 CCP et les 10 compétences

Le titre est découpé en **3 blocs**, chacun validé par un **CCP** (*certificat de compétences professionnelles*). Pour avoir le titre, il faut valider les 3.

```mermaid
flowchart LR
    T(["🎓 Titre TSSR<br/>RNCP 42463"]) --> C1["<b>CCP 1</b><br/>Assurer le support<br/>aux utilisateurs"]
    T --> C2["<b>CCP 2</b><br/>Exploiter les éléments<br/>de l'infrastructure"]
    T --> C3["<b>CCP 3</b><br/>Maintenir en conditions<br/>opérationnelles l'infrastructure"]
```

| CCP | N° | Compétence |
|---|---|---|
| **1 · Assurer le support aux utilisateurs** | 1 | Exploiter l'**intelligence artificielle** et encadrer son usage |
| | 2 | Assurer le **déploiement des équipements numériques** et accompagner à l'utilisation des **outils collaboratifs** |
| | 3 | Apporter une **assistance technique** |
| **2 · Exploiter les éléments de l'infrastructure** | 4 | Exploiter un **réseau IP** |
| | 5 | Installer et assurer l'exploitation de **serveurs Windows et Linux** |
| | 6 | Exploiter des serveurs dans une **infrastructure virtualisée** |
| | 7 | Gérer les **accès et la sécurité** dans un environnement **hybride** |
| **3 · Maintenir en conditions opérationnelles** | 8 | Optimiser des **scripts** à l'aide de l'**intelligence artificielle** |
| | 9 | Assurer la **continuité et la reprise** de l'infrastructure |
| | 10 | **Mettre à jour et superviser** les éléments de l'infrastructure |

## 📝 Les épreuves

D'après la fiche officielle France Compétences (RNCP 42463), chaque CCP s'évalue par **3 épreuves** :

| CCP | Mise en situation professionnelle | Entretien technique | Questionnaire professionnel | Total |
|---|---|---|---|---|
| **1** | 2 h 15 : manipulations sur machines virtuelles, présentation orale, **incident traité devant le jury** | 30 min | 30 min | **3 h 15** |
| **2** | 2 h 15 : manipulations sur serveurs et clients virtuels, **incident réseau devant le jury** | 30 min | 45 min | **3 h 30** |
| **3** | 1 h 45 : manipulations et présentation orale (sans incident en direct) | 30 min | 45 min | **3 h** |

⚠️ Chaque questionnaire contient **au moins une question en anglais** : habitue-toi à lire la documentation technique en anglais (les pages `man`, l'aide PowerShell, Microsoft Learn).

📌 Il faut aussi rédiger ton **Dossier Professionnel (DP)**, qui décrit des situations réelles que tu as vécues, notamment en **stage** (du 05/04 au 28/05/2027). Commence à noter tes interventions dès maintenant.

## 🗺️ Où réviser chaque compétence sur ce site

✅ = cours rédigé · ⏳ = à venir dans le planning

| N° | Compétence | Cours et fiches du site |
|---|---|---|
| 1 | IA et encadrement de son usage | ✅ [Fiche « L'IA au service du technicien »](../revisions/fiche-ia.md) — ⚠️ **aucun cours du programme ENI ne la couvre** |
| 2 | Déploiement des équipements, outils collaboratifs | ✅ [Cours 2](../cours/cours-02-systeme-client-microsoft/index.md) (installation, VMware, images) · ⏳ Cours 14 (Microsoft 365, MDM, BYOD) · ⏳ Cours 17 (WDS, MDT) |
| 3 | Assistance technique | ✅ [Cours 1, module 5](../cours/cours-01-bases-des-reseaux/module-5-les-premieres-commandes/index.md) (méthode de dépannage) · ✅ [Cours 2, modules 9-10](../cours/cours-02-systeme-client-microsoft/module-10-maintenance-du-systeme/index.md) · ⏳ Cours 5 (mise en situation) · ⏳ Cours 6 (ITIL, GLPI) |
| 4 | Réseau IP | ✅ [Cours 1](../cours/cours-01-bases-des-reseaux/index.md) · ⏳ Cours 7 (switchs, VLAN, routage, ACL, NAT) · ⏳ Cours 16 |
| 5 | Serveurs Windows et Linux | ✅ [Cours 3](../cours/cours-03-utilisateur-d-une-distribution-gnu-linux/index.md) · ✅ [Cours 4](../cours/cours-04-administration-d-une-distribution-gnu-linux/index.md) · ⏳ Cours 8 (Windows Server, AD, DHCP, DNS) · ⏳ Cours 9 (services Linux) |
| 6 | Infrastructure virtualisée | ✅ [Cours 2, module 2bis](../cours/cours-02-systeme-client-microsoft/module-2bis-vmware-workstation/index.md) · ⏳ Cours 13 (Hyper-V, vSphere) |
| 7 | Accès et sécurité en environnement hybride | ✅ [Cours 2, modules 5-6-8](../cours/cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl/index.md) · ✅ [Cours 4, modules 10-11](../cours/cours-04-administration-d-une-distribution-gnu-linux/module-11-droits-sur-les-fichiers-et-repertoires/index.md) · ⏳ Cours 8 (AD, GPO) · ⏳ Cours 14 (Microsoft 365, identités cloud) · ⏳ Cours 16 (pare-feu, VPN, certificats) |
| 8 | Scripts optimisés avec l'IA | ✅ [Cours 2, modules 3 et 11](../cours/cours-02-systeme-client-microsoft/module-11-aller-plus-loin-avec-powershell/index.md) (PowerShell) · ✅ [Cours 3, module 6](../cours/cours-03-utilisateur-d-une-distribution-gnu-linux/module-6-specificites-du-shell-bash/index.md) (Bash) · ⏳ Cours 11-12 · ✅ [Fiche IA](../revisions/fiche-ia.md) |
| 9 | Continuité et reprise | ✅ [Cours 2, module 10](../cours/cours-02-systeme-client-microsoft/module-10-maintenance-du-systeme/index.md) (WinRE, restauration) · ✅ [Cours 4, modules 4 et 12](../cours/cours-04-administration-d-une-distribution-gnu-linux/module-4-debian-en-mode-maintenance/index.md) · ⏳ Cours 15 (sauvegarde, RAID) |
| 10 | Mises à jour et supervision | ✅ [Cours 2, module 1](../cours/cours-02-systeme-client-microsoft/module-1-les-systemes-d-exploitation-et-microsoft-windows-10/index.md) (mises à jour Windows) · ✅ [Cours 4, modules 6 et 12](../cours/cours-04-administration-d-une-distribution-gnu-linux/module-12-maintenance-d-un-systeme-en-production/index.md) · ⏳ Cours 16 (journalisation centralisée) |

## ⚠️ Points de vigilance par rapport au programme

En comparant le REAC 2026 avec le planning de ta formation, plusieurs sujets **évalués à l'examen** ne figurent pas clairement dans un cours dédié :

| Sujet du REAC | Constat | Que faire ? |
|---|---|---|
| **Intelligence artificielle** (compétences 1 et 8) | Nouveauté de 2026, **absente** des intitulés des 17 cours | Réviser la [fiche IA](../revisions/fiche-ia.md) ; demander à ENI comment elle sera abordée |
| **Supervision** (compétence 10) | Pas de cours de supervision dans le planning (seul le cours 16 parle de journalisation) | Demander si un outil (Zabbix, Centreon, PRTG…) sera vu ; connaître au minimum **SNMP** (ports 161/162) et le principe des **alertes** |
| **Environnement hybride** (compétence 7) | Le planning parle d'Active Directory (cours 8) et de Microsoft 365 (cours 14), mais pas explicitement de leur **synchronisation** | Retenir le principe : les comptes AD locaux sont **synchronisés** vers le cloud (Microsoft Entra ID, avec l'outil **Entra Connect**) |
| **Continuité et reprise** (compétence 9) | Le cours 15 couvre la sauvegarde ; le REAC parle aussi de **reprise d'activité** | Connaître les sigles **PCA** (plan de continuité), **PRA** (plan de reprise), **RPO** (données qu'on accepte de perdre) et **RTO** (durée d'arrêt acceptable) |
| **Anglais technique** | Une question en anglais dans chaque questionnaire | Lire régulièrement la documentation en anglais |

## 📚 Sources officielles

- [Arrêté du 16 juin 2026 relatif au titre professionnel de technicien supérieur systèmes et réseaux (Légifrance)](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000054273839)
- [Fiche RNCP 42463 (France Compétences)](https://www.francecompetences.fr/recherche/rncp/42463/), avec le *référentiel d'activités, de compétences et d'évaluation* en téléchargement
- Pour comparaison, l'ancienne version : [arrêté du 26 avril 2023 (Légifrance)](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047541115)
