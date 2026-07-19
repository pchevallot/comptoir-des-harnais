# Journal des modifications — Comptoir des Harnais

Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).
Les dates sont au format `AAAA-MM-JJ`. La langue de référence est le français.

## [Non publié] — refonte « harnais-fabrique » (en cours)

Repositionnement du dépôt : passer d'une application d'onboarding montrée
directement à une **fabrique pédagogique de harnais** (atelier web guidé +
moteur déterministe + application finale). Spécifications :
[`specs/README.md`](specs/README.md) (PRD v0.3, architecture, backlog par lots).
Travaux menés sur la branche `refonte-fabrique` ; `main` reste l'état publié.

### Avis de renommage (migration en une fois, sans couche de compatibilité)

- `content/demo-onboarding-rh/` → `content/cases/onboarding-agents/`
  (le cas de démonstration devient le premier harnais produit par la fabrique) ;
- la gouvernance du cas quitte le contenu : `content/demo-onboarding-rh/gouvernance/`
  → `cases/onboarding-agents/gouvernance/` ;
- les cas de garde-fous du cas rejoignent le cas :
  `tests/guardrails/comportement.yaml` → `cases/onboarding-agents/tests/comportement.yaml`.

Aucun symlink, aucune double lecture de chemins : le dépôt est jeune, avec un
seul cas et un seul consommateur (architecture §5). Un tag local
`avant-refonte-fabrique` marque l'état de départ.

### Ajouté (Lot 1)

- arborescence cible `cases/<slug>/` (décisions/gouvernance) et
  `content/cases/<slug>/` (corpus) ;
- manifeste `cases/onboarding-agents/harnais.yaml`, source de vérité du cas ;
- module `src/lib/manifest.ts` (chargement + validation zod, messages français) ;
- route `/fabrique` : tableau de bord de l'atelier (15 étapes, état lu au
  manifeste) ;
- champ `cas` dans les configurations (`configs/demo.yml`, défaut
  `onboarding-agents`).

### Notes

- Le port applicatif reste `3010`, la sémantique `CDH_CONFIG` et les 7 modes IA
  sont inchangés ; les clés IA restent côté serveur (`.env.local`).
- Licence inchangée : code EUPL 1.2, contenus/documentation CC BY-SA 4.0.
</content>
</invoke>
