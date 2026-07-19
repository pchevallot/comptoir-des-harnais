# Architecture cible — harnais-fabrique

Comment passer de l'état actuel (webapp verticale remplie) à la fabrique, sans
casser ce qui marche (36 tests verts, build 20 routes, `validate-harness` OK).

---

## 1. État actuel (constaté au 2026-07-19)

```text
src/                 Next.js 15 App Router + TS strict ; lib/ = moteur (config,
                     content, retrieval, guardrails, answer, logging, model/)
content/demo-onboarding-rh/   6 sources, 6 fiches, parcours.yml, quiz.yml,
                              gouvernance/, checklist.md
configs/             demo.yml + organisation.example.yml (CDH_CONFIG les sélectionne)
templates/           harnais-metier/ + onboarding-rh-documentaire/
tests/               guardrails/ (comportement.yaml + runner) + structure/
scripts/             validate-harness.mjs, generate-demo.mjs, import-source.mjs
docs/, prd/          couche pédagogique + autorité fonctionnelle
```

Points d'ancrage dans le code (à connaître avant migration) :

- `src/lib/paths.ts` : chemins codés vers `content/demo-onboarding-rh` — **le**
  point de couplage à casser ;
- `src/lib/config.ts` : zod, sections `organisation/harnais/gouvernance/modele` ;
- `scripts/validate-harness.mjs:14` : `CONTENT` codé en dur sur le même chemin ;
- `tests/structure/structure.test.ts` : chemins de contenu également codés.

## 2. Arborescence cible

```text
comptoir-des-harnais/                 LA FABRIQUE
├── cases/                            un dossier par harnais produit
│   └── onboarding-agents/
│       ├── harnais.yaml              MANIFESTE — source de vérité du cas
│       ├── gouvernance/              fiche-besoin, classification, limites-refus,
│       │                             fiche-validation, journal
│       ├── tests/comportement.yaml   cas de garde-fous du cas (déplacé ici)
│       └── rapport-gouvernance.md    généré par build-harness-report (étape 15)
├── content/
│   └── cases/
│       └── onboarding-agents/        CORPUS du cas : sources/ fiches/ parcours/
│                                     quiz/ checklist.md
├── skills/                           8 skills projet (spec-skills.md)
│   └── <nom>/SKILL.md
├── scripts/                          déterminisme (spec-scripts-deterministes.md)
├── templates/
│   ├── harnais-metier/               inchangé (gabarits génériques)
│   └── cases/documentaire/           gabarit d'un cas complet (ex-onboarding-rh-
│                                     documentaire, généralisé) : miroir de
│                                     cases/<slug>/ + content/cases/<slug>/
├── configs/
│   ├── demo.yml                      gagne `cas: onboarding-agents`
│   └── organisation.example.yml      idem, commenté
├── src/                              rendu web final — inchangé dans son rôle
│   └── app/fabrique/page.tsx         nouvelle page lecture seule
├── tests/                            runner + tests transverses (structure,
│                                     config IA, absence de secrets)
└── docs/, prd/, specs/               inchangés dans leur rôle
```

Répartition des responsabilités :

- `cases/<slug>/` = **le harnais** (décisions, gouvernance, tests du cas) ;
- `content/cases/<slug>/` = **la matière** (corpus, fiches, parcours, quiz) ;
- la séparation en deux racines est volontaire : `cases/` est le territoire des
  décisions (relu par DPO/DSI), `content/` celui des contenus métier (relu par
  le métier). Les deux restent hors de `src/`.

## 3. Le manifeste `cases/<slug>/harnais.yaml`

Nouveau fichier, écrit par l'interview, lu par les scripts et par `/fabrique`.
Schéma zod dans `src/lib/manifest.ts` (nouveau module). Format :

```yaml
version: 1
slug: "onboarding-agents"
type: "documentaire"            # documentaire | observation (non implémenté)
besoin: >-
  Offrir aux nouveaux agents un point d'entrée documentaire clair, sourcé et
  à jour, sans traiter aucune situation individuelle.
publics: ["nouveaux agents", "encadrants"]
modules:                        # pilote la navigation de l'application
  parcours: true
  faq: true
  quiz: true
  checklist: true
sources_declarees:              # étape 4 — liste de contrôle pour l'étape 11
  - titre: "Règlement du temps de travail"
    proprietaire: "Direction des ressources humaines"
    date_connue: "2025-06-30"
classification_autorisee: ["publique", "interne"]
refus_complementaires:          # s'ajoutent au socle non négociable
  - motif: "situation de handicap ou d'aménagement de poste"
    renvoi: "service des ressources humaines"
fournisseur:
  mode: "local"                 # local | none | ollama | anthropic | openai | openrouter | mistral
etat:
  etape: 15                     # dernière étape franchie (1..15)
  statut: "prototype"           # prototype | interne | production
  mis_a_jour: "2026-07-19"
```

Règles :

- **aucun secret, jamais** dans le manifeste (le mode IA oui, la clé non) ;
- `etat.etape` n'avance que via l'interview ou les scripts — c'est ce qui rend
  la progression filmable et vérifiable ;
- `configs/<x>.yml` garde l'identité de l'organisation et la gouvernance
  affichée (rôle inchangé) et gagne un champ `cas: <slug>` qui fait le lien.
  Arbitrage : on ne fusionne pas config et manifeste — la config est « qui je
  suis », le manifeste est « ce que la fabrique a décidé et produit ».

## 4. Modifications de `src/` (minimales)

1. `src/lib/paths.ts` : le chemin contenu devient
   `content/cases/<cas>` où `<cas>` est lu depuis la config active
   (`configs/${CDH_CONFIG}` → champ `cas`, défaut `onboarding-agents`).
   Le chemin gouvernance du cas devient `cases/<cas>/gouvernance/`.
2. `src/lib/manifest.ts` (nouveau) : chargement + validation zod du manifeste,
   messages d'erreur en français, cache comme `content.ts`.
3. `src/lib/config.ts` : champ optionnel `cas` (défaut `onboarding-agents`)
   + validation.
4. `src/app/fabrique/page.tsx` (nouveau, statique) : les 15 étapes, l'état du
   manifeste, liens vers les preuves. Aucune écriture, aucun `process.env`
   secret.
5. `src/app/page.tsx` : bandeau « produit par la fabrique » + lien `/fabrique`.
6. Navigation (`src/components/Nav.tsx`) : entrée `/fabrique` ; modules
   affichés selon `modules` du manifeste (parcours/faq/quiz/checklist).

Tout le reste de `src/lib` (retrieval, guardrails, answer, logging, model/)
est **inchangé** : la refonte ne touche pas au moteur de réponse ni aux
garde-fous.

## 5. Plan de migration (repris tel quel par le backlog, Lot 0–1)

1. **Branche** `refonte-fabrique` ; aucun travail sur `main`.
2. `git mv content/demo-onboarding-rh content/cases/onboarding-agents`, puis
   déplacement de `gouvernance/` du contenu vers `cases/onboarding-agents/`
   et de `tests/guardrails/comportement.yaml` vers
   `cases/onboarding-agents/tests/comportement.yaml` (le runner
   `tests/guardrails/behavior.test.ts` lit désormais le chemin du cas actif).
3. Créer `cases/onboarding-agents/harnais.yaml` **à la main** (rétro-remplir
   depuis l'existant : besoin de `configs/demo.yml`, sources actuelles, refus
   actuels, `etat.etape: 15`) — le cas existant devient ainsi le premier
   produit « officiel » de la fabrique, sans régénération risquée.
4. Mettre à jour les 4 points de couplage (§4.1–4.3, `scripts/validate-harness.mjs`,
   `tests/structure/structure.test.ts`, `scripts/import-source.mjs` défaut `--out`).
5. `templates/onboarding-rh-documentaire/` → `templates/cases/documentaire/`
   (généralisation des intitulés, structure miroir du §2).
6. Vérifier : `npm test` (36/36 attendu, chemins ajustés), `npm run build`
   (21 routes avec `/fabrique`), `npm run validate-harness`.

**Pas de couche de compatibilité** (pas de symlink, pas de double lecture de
chemins) : le dépôt est jeune, publié depuis quelques jours, avec un seul cas.
Un avis de renommage dans le CHANGELOG/README suffit. C'est l'arbitrage le
moins coûteux et le moins piégeux (les symlinks se comportent mal sous
Windows, et une double lecture crée des états ambigus).

## 6. Compatibilité et invariants à préserver

- `npm run dev` / `build` / `start` inchangés, port 3010 inchangé ;
- `CDH_CONFIG` garde exactement sa sémantique (sélection de la config) ;
- les 7 modes IA et la règle « clé côté serveur uniquement » inchangés ;
- adapter un cas ne demande toujours **aucune** modification de `src/` ;
- toutes les mentions obligatoires et les refus testés sont conservés à
  l'identique (aucune regex de `guardrails.ts` modifiée par la refonte).

## 7. Dette créée / résorbée

**Résorbée** : chemins codés en dur vers `demo-onboarding-rh` ; corpus trop
maigre ; parcours en 10 étapes purement documentaire ; `generate-demo.mjs`
ad hoc (remplacé par `generate-onboarding-demo.mjs` spécifié).

**Créée, assumée et bornée** :
- le type `observation` est annoncé dans l'interview mais non implémenté
  (message explicite, pas de stub silencieux) ;
- `templates/cases/documentaire/` et `content/cases/onboarding-agents/`
  peuvent diverger ; garde-fou : `validate-corpus --template` compare les
  structures (avertissement, non bloquant) ;
- la page `/fabrique` lit le manifeste au build : après une interview, il faut
  relancer `npm run dev` pour voir l'état à jour — documenté, acceptable en
  local ;
- l'interview écrit du YAML : tout écrit passe par `js-yaml` (`dump`), jamais
  par concaténation de chaînes, pour éviter les fichiers invalides.
