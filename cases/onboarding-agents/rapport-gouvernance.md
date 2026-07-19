# Rapport de gouvernance — Portail d'accueil des nouveaux arrivants

> Ce document décrit l'état d'un harnais documentaire à une date donnée.
> **Il ne vaut pas validation juridique** ; il éclaire une décision de
> gouvernance (DPO / DSI / DGS), il ne s'y substitue pas.

## En-tête

- **Organisation** : Communauté de communes de Roche-Vallonne *(fictive)*
- **Type d'organisation** : Communauté de communes (fictive)
- **Harnais** : Portail d'accueil des nouveaux arrivants (cas `onboarding-agents`)
- **Type de harnais** : documentaire
- **Statut courant** : prototype
- **Date de génération** : 2026-07-19
- **Responsable métier** : Direction des ressources humaines
- **DPO** : Délégué à la protection des données (mutualisé)
- **DSI / RSSI** : Direction des systèmes d'information et sécurité (mutualisée)

## Besoin

Offrir aux nouveaux agents un point d'entrée documentaire clair, sourcé et à jour, pour éviter de répéter les mêmes explications à chaque arrivée, sans traiter aucune situation individuelle.

## Registre des sources

| id | titre | propriétaire | date | statut | classification |
|---|---|---|---|---|---|
| SRC-001 | Règlement du temps de travail | Direction des ressources humaines | 2025-06-30 | active | interne |
| SRC-002 | Protection sociale complémentaire — mutuelles labellisées | Direction des ressources humaines | 2025-04-10 | active | interne |
| SRC-003 | Note de service — télétravail | Direction des ressources humaines | 2025-09-15 | active | interne |
| SRC-004 | Fiche marchés publics — les bons réflexes achat | Direction des affaires juridiques et de la commande publique | 2025-05-20 | active | publique |
| SRC-005 | Contacts utiles du nouvel arrivant | Direction des ressources humaines | 2025-10-01 | active | interne |
| SRC-006 | Règles internes — premiers jours et vie de service | Secrétariat général | 2025-08-25 | active | interne |

## Refus et renvois

Socle non négociable (toujours refusé) : cas individuels, avis juridique/médical, affirmation sans source, promesse de droit.

*Aucun refus complémentaire au-delà du socle.*

## Mode IA et implications

- **Mode actif** : local (Local (recherche documentaire))
- **Statut** : hors-ligne
- **Appels réseau** : non
- **Clé requise / présente** : non / non *(valeur jamais affichée)*
- **Souveraineté** : Souveraineté maximale : aucune donnée ne quitte le poste. Rien n'est envoyé à un tiers.

## Synthèse des validations

### Corpus

- 0 erreur(s), 6 avertissement(s).
  - ! sources/SRC-001-temps-de-travail.md : source très courte (118 mots < 120) — à étoffer (bloquant à partir du corpus dense, Lot 4)
  - ! sources/SRC-002-mutuelles.md : source très courte (112 mots < 120) — à étoffer (bloquant à partir du corpus dense, Lot 4)
  - ! sources/SRC-003-teletravail.md : source maigre (158 mots < 400, cible 700–1 800)
  - ! sources/SRC-004-marches-publics.md : source maigre (142 mots < 400, cible 700–1 800)
  - ! sources/SRC-005-contacts.md : source très courte (102 mots < 120) — à étoffer (bloquant à partir du corpus dense, Lot 4)
  - ! sources/SRC-006-premiers-jours.md : source très courte (110 mots < 120) — à étoffer (bloquant à partir du corpus dense, Lot 4)

### Garde-fous

- 0 erreur(s), 1 avertissement(s).
  - ! 2 cas sourcés valides (< 5 attendus) — corpus/tests denses au Lot 7.

### Configuration IA (non bloquante)

- 0 erreur(s), 0 avertissement(s).

## Statuts du harnais

Trois statuts jalonnent la vie d'un harnais :
- **prototype** ← statut courant
- **interne**
- **production**

---

*Ce rapport ne vaut pas validation juridique. En cas de doute, renvoyer au service compétent (RH, juridique, DPO).*
