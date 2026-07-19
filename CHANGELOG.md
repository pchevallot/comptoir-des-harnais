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

### Ajouté (Lots 2 à 8)

- **8 skills** de la fabrique (`skills/<nom>/SKILL.md`), une par étape du
  parcours (Lot 2) ;
- **couche déterministe** `scripts/lib/` (+ `scripts/lib/atelier/`) et les
  scripts de l'atelier : `interview` (15 étapes, `--demo` exécutable en CI),
  `scaffold`, `validate-corpus`, `validate-guardrails`, `validate-provider`,
  `rapport`, `generate-demo` ; orchestrateur `validate-harness` refondu (Lot 3) ;
- **corpus dense** du cas `onboarding-agents` : **16 sources** (`SRC-001` à
  `SRC-016`), 10 fiches, 7 modules de parcours, 14 questions de quiz ;
  organisation fictive « Syndicat mixte du Val de Brenne » ; contenu de référence
  versionné dans `scripts/demo/onboarding-agents/` (Lot 4) ;
- `/fabrique` **pédagogique** : état réel du manifeste + les 15 étapes (skill,
  script, preuve, encart « en coulisse ») ; navigation pilotée par les modules
  du manifeste ; bandeau « produit par la fabrique » sur l'accueil (Lot 5) ;
- **preuve d'adaptation par configuration** : un cas produit par le circuit
  officiel de la fabrique est servi par la même application via `CDH_CONFIG`,
  sans toucher à `src/` (Lot 6) ;
- **couverture de tests portée à 83** (structure, manifeste, scripts,
  garde-fous), fixtures négatives isolées, non-divergence manifeste TS ↔ script
  (Lot 7) ;
- **documentation refondue « fabrique d'abord »** : `README.md` (fabrique avant
  le portail, parcours en 15 étapes, structure exacte, 9 scripts npm),
  `docs/architecture.fr.md` et `docs/cycle-de-vie.fr.md` alignés sur les
  15 étapes, `cases/onboarding-agents/demo/plan-demo.md` (plan de démo vérifié),
  recette et handoff finalisés (Lot 8).

### Renommage effectif

Le renommage `demo-onboarding-rh` → `onboarding-agents` est appliqué dans tout
le dépôt (contenu, gouvernance, tests, configs, scripts, code). Les seules
occurrences résiduelles de l'ancien nom sont **documentaires/historiques** (PRD
v0.2, journal). Aucune couche de compatibilité.

### Non fait (réservé à une décision humaine)

- **Aucun push, aucun merge, aucun tag public.** La refonte est close **sur la
  branche `refonte-fabrique`** ; la fusion vers `main` relève de Pascal.
- L'**atelier guidé pas à pas dans le navigateur** (sous-routes `/fabrique/*` et
  API `/api/fabrique/*`, PRD v0.3 §3 bis) n'est **pas** implémenté : `/fabrique`
  reste un tableau de bord en lecture seule ; le circuit complet se joue par
  `npm run interview` puis les validateurs. Reporté à un lot ultérieur.

### Notes

- Le port applicatif reste `3010`, la sémantique `CDH_CONFIG` et les 7 modes IA
  sont inchangés ; les clés IA restent côté serveur (`.env.local`).
- Licence inchangée : code EUPL 1.2, contenus/documentation CC BY-SA 4.0.
