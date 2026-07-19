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
├── scripts/                          moteur déterministe (spec-scripts-deterministes.md)
│   └── lib/atelier/                  logique des 15 étapes, partagée entre
│                                     CLI, API locale et tests
├── templates/
│   ├── harnais-metier/               inchangé (gabarits génériques)
│   └── cases/documentaire/           gabarit d'un cas complet (ex-onboarding-rh-
│                                     documentaire, généralisé) : miroir de
│                                     cases/<slug>/ + content/cases/<slug>/
├── configs/
│   ├── demo.yml                      gagne `cas: onboarding-agents`
│   └── organisation.example.yml      idem, commenté
├── src/                              rendu web : portail du cas + atelier
│   ├── app/fabrique/                 ATELIER web guidé : tableau de bord,
│   │                                 nouveau, [slug], [slug]/etape/[numero],
│   │                                 [slug]/rapport
│   └── app/api/fabrique/             API serveur locale (handlers minces →
│                                     scripts/lib/atelier/)
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

## 2 bis. Les trois couches de l'expérience

1. **Interface atelier locale (`/fabrique`)** — l'expérience principale,
   pensée pour un utilisateur non technique : guidage pas à pas de type
   assistant, formulaires courts, progression visible, panneau « skill
   mobilisée », affichage des fichiers produits et des contrôles.
   La sauvegarde est locale, dans les fichiers du projet, via l'API serveur
   locale (`/api/fabrique/...`).
2. **Scripts déterministes (`scripts/*.mjs`)** — le moteur vérifiable de
   l'atelier : même logique qu'auparavant (génération, validations,
   rapport), mais consommée par trois clients — l'interface (via l'API), le
   CLI (développeurs, OPSN, CI) et les tests. Les validations ne sont jamais
   confiées au modèle.
3. **Application finale** — le portail d'onboarding des agents sur
   `localhost:3010`, sortie du harnais, servie par la même application
   Next.js que l'atelier.

**Où vit la logique partagée : `scripts/lib/atelier/*.mjs`** (et non
`src/lib/fabrique/`). Arbitrage : cette logique doit être importable par
trois consommateurs — les scripts CLI (`.mjs`, sans transpilation), les
handlers Next (`src/app/api/fabrique/`) et les tests. Next importe sans
difficulté un module ESM `.mjs` situé hors de `src/` ; l'inverse (importer
du TypeScript de `src/` depuis un `.mjs`) est précisément le problème
d'interop déjà identifié pour `diagnostic.ts` (spec scripts §5). On étend
donc la règle existante : les modules partagés vivent en `.mjs` sous
`scripts/lib/`, et `src/` les importe. `src/lib/manifest.ts` (zod) reste la
validation côté application ; le test de non-divergence du Lot 7 couvre les
deux.

## 3. Le manifeste `cases/<slug>/harnais.yaml`

Nouveau fichier, écrit par l'atelier (via l'API locale) ou par l'interview
CLI, lu par les scripts et par `/fabrique`.
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
- `etat.etape` n'avance que via l'atelier (API locale), le CLI ou les
  scripts — c'est ce qui rend la progression démontrable et vérifiable ;
- `configs/<x>.yml` garde l'identité de l'organisation et la gouvernance
  affichée (rôle inchangé) et gagne un champ `cas: <slug>` qui fait le lien.
  Arbitrage : on ne fusionne pas config et manifeste — la config est « qui je
  suis », le manifeste est « ce que la fabrique a décidé et produit ».

## 4. Modifications de `src/` (bornées à l'atelier et aux points de couplage)

1. `src/lib/paths.ts` : le chemin contenu devient
   `content/cases/<cas>` où `<cas>` est lu depuis la config active
   (`configs/${CDH_CONFIG}` → champ `cas`, défaut `onboarding-agents`).
   Le chemin gouvernance du cas devient `cases/<cas>/gouvernance/`.
2. `src/lib/manifest.ts` (nouveau) : chargement + validation zod du manifeste,
   messages d'erreur en français, cache comme `content.ts`.
3. `src/lib/config.ts` : champ optionnel `cas` (défaut `onboarding-agents`)
   + validation.
4. `src/app/fabrique/` (nouveau) : l'atelier web guidé — `page.tsx`
   (tableau de bord des harnais), `nouveau/page.tsx` (démarrage d'un cas),
   `[slug]/page.tsx` (progression des 15 étapes),
   `[slug]/etape/[numero]/page.tsx` (étape guidée : questions courtes,
   réponse proposée, panneau « skill mobilisée », encart « en coulisse »
   avec la commande équivalente, bouton valider/générer),
   `[slug]/rapport/page.tsx` (rapport de gouvernance). Rendu dynamique :
   l'état est lu à la requête (manifeste + API), pas figé au build. Aucun
   `process.env` secret côté client, aucun champ de saisie de clé.
5. `src/app/api/fabrique/` (nouveau) : handlers de l'API serveur locale.
   Chaque handler est une enveloppe mince autour de
   `scripts/lib/atelier/*.mjs` : validation des entrées (slug `[a-z0-9-]+`,
   numéro d'étape 1–15, réponses typées), appel de la fonction déterministe,
   réponse JSON `{ ok, erreurs, avertissements, fichiers }`. Contraintes non
   négociables : écritures confinées à `cases/`, `content/cases/` et
   `configs/` (chemins résolus côté serveur et vérifiés contre la racine du
   dépôt — **aucun chemin fourni par le client**) ; jamais d'écriture dans
   `.env.local` ; jamais de lecture ni d'affichage d'une valeur de secret ;
   aucun appel réseau sortant.
6. `src/app/page.tsx` : bandeau « produit par la fabrique » + lien `/fabrique`.
7. Navigation (`src/components/Nav.tsx`) : entrée `/fabrique` ; modules
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
- l'API locale de l'atelier écrit dans le workspace depuis le navigateur :
  risque borné par conception — chemins confinés au dépôt et résolus côté
  serveur, aucun chemin fourni par le client, serveur strictement local (pas
  d'exposition réseau, comme le reste de l'application), pas de secret
  accessible ; ces limites sont rappelées sur `/fabrique` ;
- deux clients (atelier et CLI) pour une même logique : la règle « toute
  logique d'étape vit dans `scripts/lib/atelier/`, jamais dupliquée dans un
  handler ou dans l'interview » est le garde-fou contre la divergence ;
- l'atelier et l'interview écrivent du YAML : tout écrit passe par `js-yaml`
  (`dump`), jamais par concaténation de chaînes, pour éviter les fichiers
  invalides.
