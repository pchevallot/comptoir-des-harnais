# RECETTE — Comptoir des Harnais (V1)

Trace de recette et de décisions de la session d'implémentation. Référence
d'autorité : `prd/PRD.md` (v0.2). À lire aussi : `docs/HANDOFF.md`.

- **Modèle d'implémentation** : Opus 4.8 (`claude-opus-4-8`) — disponible, aucune
  substitution. La règle « ne pas substituer silencieusement » (PRD §12.1) est donc
  satisfaite.
- **Date de session** : 2026-07-19.
- **Pilotage** : `/goal` + `/loop` adoptés comme discipline interne (voir §12.5 du
  PRD). Après chaque unité d'œuvre : conformité PRD, anti-SIRH, absence de données
  réelles, séparation contenu/code, tests, build.

---

## 1. Décisions prises (défauts raisonnables, documentés)

| # | Décision | Justification | À arbitrer par Pascal ? |
|---|---|---|---|
| D1 | **Stack : Next.js 15 (App Router) + TypeScript strict + Vitest** | Recommandation PRD §7.2 ; un serveur est requis pour garder la clé de modèle côté serveur (§9.2-12) ; sobre et pérenne | Non (confirmable) |
| D2 | **Fournisseur de modèle par défaut : `local`** (recherche documentaire déterministe, zéro appel réseau) | Démo et tests fonctionnent hors ligne et sans clé ; renforce réversibilité et « aucun appel réseau non documenté » (§7.4). Fournisseur externe = point de substitution documenté (`src/lib/model/anthropic.ts`) | Oui pour le fournisseur de la vidéo (§Points à confirmer n°5) |
| D3 | **Licence : EUPL 1.2 (code) + CC BY-SA 4.0 (contenus)** | Décision finale validée par Pascal : cohérence avec les communs numériques publics et les autres projets CdS | Non |
| D4 | **Collectivité fictive : « Communauté de communes de Roche-Vallonne »** | Nom manifestement inventé, réduit le risque de collision (le PRD proposait « Val d'Ancelle » ; « Ancelle » est un lieu réel, écarté par prudence) | Non |
| D5 | **Pas de base de données** (contenus en Markdown/YAML) | PRD §7.1-3 | Non |
| D6 | **Rendu Markdown maison minimal** (`src/components/Markdown.tsx`) | Éviter une dépendance de plus (sobriété §7.1) ; contenus contrôlés | Non |
| D7 | **Registre des sources dérivé des fichiers `sources/`** | Source unique de vérité, évite la duplication | Non |

---

## 2. Lots réalisés (réf. PRD §12.2)

- **Lot A — Socle** : `git init` local, `.gitignore`, `.env.example` (sans secret),
  `package.json` (scripts dev/build/test/validate-harness/generate-demo),
  `tsconfig.json` (strict + `noUncheckedIndexedAccess`), `next.config.mjs`,
  `vitest.config.ts`. README / GLOSSAIRE / `docs/architecture.fr.md` : rédigés
  (couche documentaire) — voir §5.
- **Lot B — App web** : mise en page (`layout.tsx`), navigation métier (`Nav.tsx`),
  9 rubriques, bandeau « Données fictives », affichage du statut, design sobre CdS
  (`globals.css` : tokens `#1F519B`, `#FDC948`, `#112D4A`, `#FFFFFF`, `#F5F5F5`,
  `#333333`), focus visible, lien d'évitement, responsive.
- **Lot C — Contenu démo** : 6 sources fictives (SRC-001..006), 6 fiches, parcours
  (4 modules), quiz (4 questions), checklist RH, gouvernance (limites-refus,
  classification, fiche-validation, journal). Templates : voir §5.
- **Lot D — UI pédagogique** : accueil (fait/ne fait pas), parcours, bibliothèque de
  fiches (sources/date/statut affichés), quiz corrigé sans score conservé, pages
  sources, limites & refus, gouvernance (fonctions, statut, classification,
  avertissement juridique).
- **Lot E — Moteur documentaire** : interface modèle substituable
  (`src/lib/model/`), recherche sourcée (`retrieval.ts`, seuil de pertinence →
  « je ne sais pas » hors corpus), mentions systématiques, journalisation sobre.
- **Lot F — Garde-fous** : `src/lib/guardrails.ts` — refus des cas individuels
  (civilité+nom, possessif individuel, cas nommé), avis juridique, avis médical,
  formulations proscrites en sortie. Page « limites & refus » alignée.
- **Lot G — Tests** : cas YAML lisibles (`tests/guardrails/comportement.yaml`),
  runner comportement + stabilité 3× (`behavior.test.ts`), structure & sécurité
  (`structure.test.ts`), script `validate-harness`.
- **Lot H — Documentation** : docs pédagogiques, README, CONTRIBUTING, GLOSSAIRE,
  templates — rédigés dans cette session (couche documentaire) ; recette (ce
  fichier) ; passe de cohérence et recette d'adaptation tierce : voir HANDOFF.

---

## 3. Commandes exécutées et résultats

| Commande | Résultat |
|---|---|
| `npm install` | OK (exit 0). Next.js 15.5.20 installé. |
| `npx vitest run` | **18 tests / 18 passés** (2 fichiers). |
| `node scripts/validate-harness.mjs` | **OK** — 6 sources, 6 fiches, statut prototype, 0 erreur. |
| `node scripts/generate-demo.mjs` | **OK** — contenu de démonstration complet. |
| `npx next build` | **OK (exit 0)** — 19 routes générées, TypeScript strict validé. |
| `npx next start` + `curl /api/faq` | FAQ sourcée cite SRC-003 ; cas individuel « Madame Martin » → refus + renvoi RH ; hors corpus (RIFSEEP) → « je ne sais pas ». |

Reproduire : `npm install && npm test && npm run build`.

---

## 4. Garde-fous vérifiés

- **Anti-SIRH** : aucune fonction de gestion individuelle. L'app refuse les cas
  individuels (comportement testé : 3 cas nominatifs/individualisés + avis
  juridique). Pieds de page et pages « limites »/« gouvernance » l'affichent.
- **Aucune donnée personnelle réelle** : corpus 100 % fictif, marqué `fictif: true`
  et bandeau « Données fictives ». Test de structure : rejette courriels réels,
  téléphones et numéros de sécurité sociale réalistes dans `content/`.
- **Absence de secrets** : `.env.example` sans valeur ; `.gitignore` ignore `.env` ;
  test de structure scanne les motifs de clés (sk-…, AKIA…, clés privées).
- **Sourçage exclusif** : réponses uniquement à partir du registre ; hors corpus →
  « je ne sais pas » + renvoi. Chaque fiche cite des sources présentes dans le
  registre (test).
- **Mentions systématiques** : sources, date, statut, assistance IA, « ne vaut pas
  validation juridique ».

---

## 5. Recette d'adaptation tierce (§10.4) — RÉALISÉE

Preuve que l'adaptation à une **2ᵉ collectivité fictive** se fait sans toucher au
code (`src/`), uniquement par la configuration :

- Création d'un `configs/organisation.yml` fictif (« Syndicat mixte des Coteaux de
  Bellerive », statut `interne`).
- `CDH_CONFIG=organisation.yml node scripts/validate-harness.mjs` → **OK**.
- `CDH_CONFIG=organisation.yml npx next build` → **OK**.
- Rendu vérifié en exécution : la page d'accueil affiche « Syndicat mixte des
  Coteaux de Bellerive » et la page gouvernance « Statut : usage interne ».
- Aucune modification de `src/`. L'artefact `organisation.yml` a été retiré ; le
  dépôt ne livre que `demo.yml` et `organisation.example.yml`.

Le remplacement des **sources** se fait de la même façon : on édite les fichiers de
`content/demo-onboarding-rh/` (le registre en est dérivé), sans toucher au code.

## 6. Vérification des objectifs O1–O8 (§2.1)

| Obj. | Vérifié | Preuve |
|---|---|---|
| O1 — dépôt lisible et autoportant | Oui | README.fr.md + docs pédagogiques + GLOSSAIRE |
| O2 — app locale fonctionnelle | Oui | `npm install` → `npm run dev`/`build` → app visible (19 routes) |
| O3 — configurable sans code | Oui | Recette tierce §5 (config + contenus en MD/YAML) |
| O4 — garde-fous démontrables | Oui | FAQ sourcée (SRC-003) / refus cas individuel / hors-corpus ; tests |
| O5 — RGPD/AI Act/cyber dès V1 | Oui | classification affichée, sources datées, limites, gouvernance, « ne vaut pas validation juridique », threat model |
| O6 — couche pédagogique générique | Oui | `docs/*.fr.md` lisibles sans exécuter de code |
| O7 — réplicabilité | Oui | `npm test` (18/18) après clone propre ; scripts reproductibles |
| O8 — préparer la diffusion | Partiel | scénario vidéo (§13) à aligner finement — voir dette |

## 7. Dette et suites (à traiter avant clôture V1)

Voir `docs/HANDOFF.md` §« Prochaines actions ». Points saillants restants :

1. **Passe de cohérence H3** : liens internes, mêmes numéros d'étapes partout,
   rubriques « ce que ce document ne couvre pas » (présentes dans les guides ;
   revue croisée à finaliser).
2. **Scénario vidéo** (§13) à aligner plan par plan sur le dépôt réel.
3. **Élargissement possible du corpus** (plus de sources/fiches) et robustesse aux
   reformulations (V1.2).
4. **FAQ générative externe** : `src/lib/model/anthropic.ts` laissé non câblé
   (intégration documentée) — à activer si un fournisseur est retenu pour la vidéo.

---

## 8. Risques / arbitrages humains requis (Pascal)

1. Licence finale (D3).
2. Fournisseur de modèle pour la démonstration vidéo (D2).
3. Création/publication d'un dépôt GitHub distant — **faite** après instruction
   explicite de Pascal : `https://github.com/pchevallot/comptoir-des-harnais`.
4. Logo officiel — **non intégré** ; emplacement réservé dans l'en-tête.
5. Nom définitif du projet et de la collectivité fictive (vérif. de collision).

---

## 9. Session n°2 — Configuration IA et adaptation des sources

Session lancée avec Opus 4.8 (`claude-opus-4-8`). Elle a atteint la limite de tours Claude Code (`Reached max turns (50)`) avant de produire un résumé final complet, mais les artefacts produits ont été vérifiés manuellement après coup.

### 9.1 Réponse produit : formats de sources

- État V1 : le format **canonique intégré au harnais** est Markdown (`.md`) avec frontmatter, plus YAML/JSON pour configuration, parcours, quiz et tests.
- Décision : une collectivité **peut partir de Word/PDF/LibreOffice/pages intranet**, mais doit convertir, relire et nettoyer ces contenus en Markdown ou texte contrôlé avant intégration.
- Raison : traçabilité, versionnement, réversibilité, lisibilité GitHub, absence de métadonnées cachées, contrôle DPO/DSI.
- Ajout : `docs/adapter-ses-sources.fr.md` et page applicative `/sources/adapter`.
- Ajout : `scripts/import-source.mjs` pour amorcer une source depuis `.md` ou `.txt`. Il ne fait pas d'OCR/PDF robuste en V1.

### 9.2 Réponse produit : configuration IA

- Ajout d'une page visible : `/configuration-ia`.
- La page affiche le fournisseur courant, le statut de configuration, les modes disponibles et les exemples `.env.local`, **sans jamais afficher de clé**.
- Règle sécurité : aucune clé API côté navigateur, localStorage, cookie, Markdown, YAML ou fichier commité. Les secrets restent dans `.env.local` ou variables d'environnement serveur.
- Fournisseurs décrits/supportés : `local`, `none`, `anthropic`, `openai`, `openrouter`, `mistral`, `ollama`.
- Ajouts techniques : `src/lib/model/catalogue.ts`, `diagnostic.ts`, `openai-compatible.ts`, mise à jour `index.ts`, `anthropic.ts`, `.env.example`.

### 9.3 Vérifications post-session exécutées par Hermes

| Commande | Résultat |
|---|---|
| `npm test` | **OK** — 3 fichiers, 36 tests passés |
| `npm run build` | **OK** — Next.js build, 20 routes générées, dont `/configuration-ia` et `/sources/adapter` |

### 9.4 Dette restante

- Claude Code n'a pas commité automatiquement la session n°2 car il a atteint `max turns`. Commit réalisé ensuite après vérification.
- Vérification visuelle navigateur encore à faire dans un environnement disposant de Chrome/Playwright ou navigateur agent.

---

# Recette de la refonte fabrique (V1.5 / V2)

Journal de la refonte spécifiée dans `specs/` (PRD v0.3, architecture, backlog).
Une section par lot : date, commandes, résultats, écarts. Modèle
d'implémentation : Opus 4.8 (`claude-opus-4-8`), sans substitution. Travaux sur
la branche `refonte-fabrique`. Session S1 = Lot 0 + Lot 1.

## Lot 0 — Sauvegarde, branche, état de référence

- **Date** : 2026-07-19.
- **SHA de départ (`main`)** : `85e5ffa` (`docs: make harness factory web-guided`).
  `main` alignée avec `origin/main` (0 en avance, 0 en retard) avant branche.
- **Fichiers non suivis** : les artefacts `claude-code-runs/*` sont **laissés
  non suivis** (défaut du backlog, arbitrage Pascal n°2). Les `specs/` étaient
  déjà suivies sur `main` (aucune action requise).
- **Tag posé** : `avant-refonte-fabrique` sur `85e5ffa`.
- **Branche créée** : `refonte-fabrique` (via `git switch -c`).

### Environnement de référence

| Outil | Version |
|---|---|
| Node | v22.22.3 |
| npm | 10.9.8 |
| Next | ^15.5.0 (15.5.20 installé) |

### Commandes de référence (état de départ, avant toute modification)

| Commande | Résultat constaté | Attendu (backlog) | Écart |
|---|---|---|---|
| `npm test` | **36/36** (configuration-ia 18, structure 7, guardrails 11) | 36/36 | aucun |
| `npm run build` | **OK — 20 routes** | 20 routes | aucun |
| `npm run validate-harness` | **OK** — 6 sources, 6 fiches, statut prototype, 0 erreur | OK, 6 sources, 6 fiches | aucun |

Aucun écart avec l'état attendu (HANDOFF §8). État de départ conforme,
migration engageable.

- **CHANGELOG.md** créé : annonce du renommage
  `demo-onboarding-rh` → `onboarding-agents` (migration en une fois, sans
  couche de compatibilité) et périmètre de la refonte.

## Lot 1 — Architecture fabrique : `cases/`, `content/cases/`, manifeste, `/fabrique`

- **Date** : 2026-07-19 (session S1, à la suite du Lot 0).

### Déplacements (`git mv`, historique préservé)

| Depuis | Vers |
|---|---|
| `content/demo-onboarding-rh/` | `content/cases/onboarding-agents/` |
| `content/cases/onboarding-agents/gouvernance/` | `cases/onboarding-agents/gouvernance/` |
| `tests/guardrails/comportement.yaml` | `cases/onboarding-agents/tests/comportement.yaml` |
| `templates/onboarding-rh-documentaire/` | `templates/cases/documentaire/` (README généralisé, variables `{{...}}`) |

Commit de déplacement séparé (`e2fec7c`) pour garder la détection de renommage
git propre ; les points de couplage du code sont mis à jour dans le commit
suivant.

### Créations

- `cases/onboarding-agents/harnais.yaml` — manifeste rétro-rempli **à la main**
  depuis l'existant : `besoin` (de `configs/demo.yml`), `sources_declarees`
  (6 entrées, des frontmatters), `classification_autorisee`
  (`publique`/`interne`), `fournisseur.mode: local`, `etat.etape: 15`,
  `etat.statut: prototype`, `modules` tous à `true`. `refus_complementaires: []`
  (le cas ne déclare aucun refus au-delà du socle non négociable : liste vide,
  honnête et traçable, plutôt qu'inventer un motif).
- `src/lib/manifest.ts` — chargement + validation zod **stricte** (toute clé
  inconnue = erreur), messages français, cache par slug ; exporte `Manifeste`
  et `chargerManifeste(slug)`.
- `src/app/fabrique/page.tsx` — tableau de bord de l'atelier, **rendu dynamique**
  (`force-dynamic`) : les 15 étapes (libellés PRD v0.3 §4), l'état lu au
  manifeste (`etat.etape`, statut, date), une preuve par étape (lien ou chemin).

### Modifications des points de couplage

- `src/lib/paths.ts` — chemins résolus par cas : `CONTENT_DIR =
  content/cases/<cas>`, `CASE_DIR = cases/<cas>`, `GOUVERNANCE_DIR =
  cases/<cas>/gouvernance`. Le cas actif est lu directement depuis la config
  (champ `cas`, défaut `onboarding-agents`) **sans importer `config.ts`** pour
  éviter un cycle. Nouvel export `CONTENT_REL` (chemin d'affichage).
- `src/lib/content.ts` — chemins d'affichage dérivés de `CONTENT_REL` (plus de
  chaîne codée en dur).
- `src/lib/config.ts` — champ optionnel `cas` (zod, `[a-z0-9-]`, défaut
  `onboarding-agents`).
- `configs/demo.yml` — ajout de `cas: onboarding-agents` ;
  `configs/organisation.example.yml` — champ `cas` commenté + circuit fabrique
  documenté.
- `scripts/validate-harness.mjs` — suppression du chemin codé en dur ;
  résolution par `--cas`/config ; gouvernance lue dans `cases/<cas>/gouvernance`.
- `scripts/import-source.mjs` — défaut `--out` = `content/cases/onboarding-agents/sources`.
- `scripts/generate-demo.mjs` (transitoire, remplacé au Lot 4) — chemins alignés
  sur la nouvelle arborescence pour rester un inventaire utile.
- `tests/guardrails/behavior.test.ts` — runner lit
  `cases/<cas>/tests/comportement.yaml` via `CASE_DIR`.
- `src/components/Nav.tsx` — entrée `/fabrique` ajoutée (pilotage par `modules`
  au Lot 5).
- `src/app/sources/page.tsx` — libellé de registre dérivé de `CONTENT_REL`.

### Vérifications (toutes exécutées ce jour)

| Commande | Résultat |
|---|---|
| `npm test` | **36/36** (configuration-ia 18, structure 7, guardrails 11), aucun test supprimé |
| `npm run build` | **OK** — la table des routes liste désormais `/fabrique` (21ᵉ route), rendue **dynamiquement** (`ƒ`). Le compteur « Generating static pages (20/20) » reste à 20 précisément parce que `/fabrique` est dynamique et n'est pas prérendu (conforme à l'exigence). |
| `npm run validate-harness` | **OK** — cas `onboarding-agents`, 6 sources, 6 fiches, prototype |
| `npm run validate-harness -- --cas onboarding-agents` | **OK** (résolution par `--cas`) |
| Manifeste vs `src/lib/manifest.ts` | valide (chargé et rendu sur `/fabrique`) |
| `npm run start` + `curl` | `/`, `/fabrique`, `/sources`, `/faq`, `/gouvernance`, `/limites` → **200** ; `/fabrique` affiche statut/besoin/étapes **lus au manifeste** ; `/sources` = mêmes 6 sources |
| grep `demo-onboarding-rh` | aucune occurrence **active** (voir écart ci-dessous) |
| scan secrets (sk-…/AKIA…/PRIVATE KEY) | **aucun** |

### Écart documenté (grep `demo-onboarding-rh`)

Occurrences restantes, toutes **documentaires/historiques**, aucune n'est un
chemin actif du code ou du contenu :

- `prd/PRD.md` (5 occurrences) : PRD **v0.2**, document d'autorité qui décrit
  l'état **antérieur** à la refonte (arborescence et parcours en 10 étapes).
  L'architecture (§Autorité) préserve v0.2 comme référence ; le réécrire
  fausserait ce document. Assimilé à « historique ».
- `docs/RECETTE.md` : la ligne du §5 (recette V1 « RÉALISÉE ») est un
  enregistrement historique ; la ligne du Lot 0 **nomme** le renommage (rôle de
  changelog). Toutes deux légitimes.

La refonte narrative du README principal et du HANDOFF est explicitement prévue
au **Lot 8** (backlog) ; les références de chemins fonctionnelles et
utilisateur (guides, gabarit, page `/sources`, configs, scripts) ont, elles,
été corrigées dans ce lot.

### Points non traités (conformes aux non-objectifs du Lot 1)

Pas de nouveau script (Lot 3), pas de nouvelle source (Lot 4), pas d'API locale
ni de sous-routes d'atelier (Lots 5a/5b), pas de navigation par modules
(Lot 5b), pas de couche de compatibilité (architecture §5).

## Lot 2 — Skills locales (`skills/<nom>/SKILL.md`)

- **Date** : 2026-07-19 (session S2).
- **Périmètre** : extraire des guides existants (`docs/cycle-de-vie.fr.md`,
  `docs/adapter-ses-sources.fr.md`, PRD) les 8 skills de `specs/spec-skills.md`.
  Aucune modification de `src/`, `content/`, `configs/`, `scripts/`.

### Fichiers créés (8 skills)

| Skill | `etapes_parcours` | Scripts associés (spec, Lot 3) |
|---|---|---|
| `skills/cadrer-besoin-public/SKILL.md` | [1, 2, 3, 6] | `interview-harness` |
| `skills/classifier-sources/SKILL.md` | [4, 5] | `interview-harness`, `validate-corpus` |
| `skills/concevoir-garde-fous/SKILL.md` | [7, 8] | `interview-harness`, `validate-guardrails` |
| `skills/configurer-fournisseur-ia/SKILL.md` | [9] | `validate-provider-config` |
| `skills/adapter-corpus-onboarding/SKILL.md` | [11] | `import-source`, `validate-corpus` |
| `skills/generer-tests-harnais/SKILL.md` | [13] | `validate-guardrails` |
| `skills/verifier-securite-rgpd/SKILL.md` | [15] | `validate-harness`, `build-harness-report` |
| `skills/preparer-demo-video/SKILL.md` | [] (hors parcours) | `validate-harness`, `build-harness-report` |

Chaque `SKILL.md` : frontmatter (`name`, `description`, `etapes_parcours`,
`scripts_associes`, `fichiers_produits`) + les 5 sections obligatoires
(« Quand l'activer », « Ce que je demande », « Ce que je produis », « Ce que je
refuse », « Réussite »), questions une à la fois avec exemples
`onboarding-agents`, refus verbatim du stockage de clé, refus des données
personnelles réelles, refus des cas individuels RH, renvoi aux scripts
déterministes du Lot 3 (écrits contre leur spec, non encore implémentés).

### Fichiers modifiés

- `docs/cycle-de-vie.fr.md` : encart « Version opérationnelle » renvoyant vers
  les 7 skills du parcours.
- `docs/adapter-ses-sources.fr.md` : encart renvoyant vers
  `classifier-sources` et `adapter-corpus-onboarding`.

### Vérifications (toutes exécutées ce jour)

| Commande / contrôle | Résultat |
|---|---|
| `ls skills/*/SKILL.md \| wc -l` | **8** |
| `gray-matter` parse des 8 | **OK** — 8/8, les 5 clés de frontmatter présentes |
| 5 sections obligatoires par skill | **5/5** sur les 8 |
| Union des `etapes_parcours` | `[1,2,3,4,5,6,7,8,9,11,13,15]` = exactement les étapes du PRD v0.3 §4 déclarant une skill (10/12/14 = « — », aucune orpheline, aucune surnuméraire) |
| Motifs de secrets/clés dans `skills/` | **aucun** ; `[REDACTED]` utilisé pour l'exemple de clé |
| Civilité + Nom | uniquement « Madame Martin » (cas de refus fictif) |
| Courriels littéraux | **aucun** |
| Mention concurrentielle / ancien nom écarté | **aucune** |
| `npm test` | **36/36** (inchangé — skills hors `src/`) |
| `npm run build` | **OK** (table de routes inchangée, `/fabrique` dynamique) |
| `npm run validate-harness` | **OK** — 6 sources, 6 fiches, prototype |

### Écarts

Aucun. `scripts_associes` référence des scripts encore à implémenter (Lot 3) :
c'est conforme au backlog (« la skill est écrite contre sa spec »).

### Points non traités (non-objectifs du Lot 2)

Pas d'implémentation des scripts appelés (Lot 3) ; pas de mécanique
d'activation spéciale (le format fichier suffit).


## Lot 3 — Couche déterministe réutilisable et scripts

- **Date** : 2026-07-19 (session S3, après `/clear`). Modèle : `claude-opus-4-8`.
- **Spec d'autorité** : `specs/spec-scripts-deterministes.md` (§0 à §8).
- **Portée réalisée** : Lot 3 **complet** (S3 + interview) — la couche partagée,
  les 3 validateurs, l'orchestrateur, le scaffold, le rapport, le squelette de
  régénération démo, **et** l'interview CLI (`--demo` testable sans TTY).

### Fichiers créés

Couche partagée (`scripts/lib/`) :
- `motifs-interdits.mjs` — source unique des motifs interdits (secrets + PII :
  courriel plausible hors `exemple.fr`, téléphone, NIR, IBAN, clés). Importé par
  les scripts **et** par `tests/structure/structure.test.ts` (zéro divergence).
- `manifeste.mjs` — lecture/validation/écriture du manifeste (**seul point
  d'écriture** de `harnais.yaml`). Validation ré-implémentée en JS pur, **miroir**
  de `src/lib/manifest.ts` (zod) ; test de non-divergence prévu au Lot 7.
- `diagnostic-env.mjs` — miroir `.mjs` de `src/lib/model/{index,catalogue,diagnostic}.ts`
  (repli arbitré spec §5 : import TS impraticable en `.mjs`) ; test de
  non-divergence prévu au Lot 7. Ne renvoie jamais la valeur d'une clé.
- `cli.mjs` — utilitaires partagés (`--help`, `--cas`, `--json`, résolution du cas).
- `atelier/etapes.mjs` — définition déclarative des 15 étapes (libellés verbatim
  PRD v0.3 §4, skill, script, fichiers, genre, questions). Garde-fou : 15 étapes.
- `atelier/reponses.mjs` — validation de forme (dates, slug, heuristique
  anti-« Prénom Nom », énumérations, booléens, listes, minimums) **et** application
  d'une collecte complète aux fichiers (manifeste, config, gouvernance, tests).
- `atelier/actions.mjs` — dispatch des actions déterministes d'une étape →
  `{ ok, erreurs, avertissements, fichiers }` (consommé par l'API du Lot 5a).

Scripts (`scripts/`) :
- `validate-corpus.mjs`, `validate-guardrails.mjs`, `validate-provider-config.mjs`,
  `scaffold-harness.mjs`, `build-harness-report.mjs`, `interview-harness.mjs`,
  `generate-onboarding-demo.mjs` (squelette : contenu de référence au Lot 4).
- `templates/cases/documentaire/reponses-demo.yaml` — réponses du mode `--demo`
  (cas jetable `demo-atelier`, jamais `onboarding-agents`).

### Fichiers modifiés

- `scripts/validate-harness.mjs` → **orchestrateur** (spec §8) : conserve la
  signature CLI et l'en-tête historique (Configuration/Cas/Sources/Fiches/Statut),
  ajoute une synthèse par sous-validateur. La configuration IA est **non bloquante**.
- `package.json` → 7 scripts npm ajoutés ; `generate-demo` **retargeté** vers
  `generate-onboarding-demo.mjs` (clé unique ; `scripts/generate-demo.mjs`
  **conservé** jusqu'au Lot 4).
- `tests/structure/structure.test.ts` → importe `motifs-interdits.mjs` (plus
  aucune regex locale).

### Migration des contrôles vers `validate-corpus` (aucun contrôle perdu)

| Contrôle (ancien `validate-harness`) | Devenu |
|---|---|
| Config présente + sections + statut valide | **Reste** dans l'orchestrateur |
| `content/cases/<cas>/` existe | **Reste** (via `validate-corpus`, + cohérence `config.cas`↔dossier dans l'orchestrateur) |
| ≥ 1 source | `validate-corpus` (contrôle 1/frontmatter) |
| Frontmatter source (id, titre, proprietaire, date, perimetre) | `validate-corpus` — **élargi** aux 8 champs (statut, classification, fictif) |
| `fictif: true` | `validate-corpus` — **conditionné** à `organisation.fictive: true` (spec §3.3 ; pour `onboarding-agents` la config a `fictive: true` → comportement identique) |
| id unique | `validate-corpus` — **+ format `SRC-\d{3}` + préfixe de nom de fichier** |
| classification ∈ {publique, interne} | `validate-corpus` |
| Obsolescence (date < seuil) | `validate-corpus` (avertissement) |
| Fiches → sources présentes + `limites` | `validate-corpus` |
| Gouvernance présente (limites-refus, classification, fiche-validation, journal) | **Reste** dans l'orchestrateur (avertissements) |
| — (nouveau) | Manifeste chargé/validé ; cohérence `config.cas` ↔ dossier |

### Écarts documentés (décisions délibérées, à ré-arbitrer au Lot 4/7)

- **Longueur de source (spec §3.4 : `< 120 mots → erreur`)** — implémenté en
  **avertissement** au Lot 3 (« source très courte »), car le corpus d'amorce
  (`onboarding-agents`) fait 102–158 mots : une erreur bloquante rendrait
  `validate-harness` rouge, en contradiction avec le critère « vert, avertissements
  admis ». **À re-durcir au Lot 4** quand le corpus dense (700–1 800 mots) est en
  place (message d'avertissement le rappelle explicitement).
- **Garde-fous — minimums de volume** (≥ 5 cas sourcés, ≥ 1 hors-corpus, socle) :
  émis en **avertissements nommés** (admis jusqu'au Lot 7) ; seules les
  **incohérences structurelles** (refus déclaré non testé, refus testé non affiché,
  renvoi vers une personne) sont **bloquantes**. L'appariement refus↔affichage se
  fait par **catégorie** (nominatif/individuel/juridique/médical) et non par
  mot-clé littéral, pour que le refus nominatif fictif (« Madame Martin ») corresponde
  à « cas individuel » de `limites-refus.md`.

### Cohérence skills ↔ scripts (deux sens)

- Sens 1 : chaque `scripts_associes` des 8 skills désigne un script qui **existe**
  désormais (import-source, validate-corpus, validate-guardrails,
  validate-provider-config, validate-harness, build-harness-report,
  interview-harness). **OK.**
- Sens 2 : `scaffold-harness.mjs` et `generate-onboarding-demo.mjs` ne sont
  associés à **aucune** skill — **par conception** : ils portent les étapes 10 et
  12 du parcours (PRD v0.3 §4), dont la colonne « Skill » vaut « — ». Ce ne sont
  pas des orphelins : ils sont référencés par le parcours (`etapes.mjs`) et par
  l'orchestrateur/l'atelier.

### Vérifications (toutes exécutées ce jour)

| Contrôle | Commande | Résultat |
|---|---|---|
| `--help` des 7 scripts npm | `for s in … npm run $s -- --help` | **7/7 OK** |
| Atelier importable sans TTY | import direct `etapes/reponses/actions` | **OK** (15 étapes, actions ok) |
| Interview `--demo` | `npm run interview -- --demo` | **6 fichiers, code 0** (cas jetable `demo-atelier`) |
| Chaîne complète sur cas produit | scaffold → validate-guardrails → rapport | **OK** (manifeste valide, 3 refus couverts) |
| Refus d'éligibilité (étape 1) | démo patchée `eligibilite: o` | **code 0**, manifeste `etape: 1` |
| Scaffold idempotent / `--force` | `--dry-run` → `--cas essai` → relance → `--force` | **créé / conservé / `.avant-force.bak`** ; refus d'écraser `onboarding-agents` sans `--force` |
| `validate-corpus onboarding-agents` | — | **vert** (0 erreur, 6 avertissements « maigre/courte ») |
| `validate-guardrails onboarding-agents` | — | **vert** (0 erreur, 1 avertissement « < 5 sourcés ») |
| Non-fuite de clé | `MODEL_API_KEY=fausse-valeur-test npm run validate-provider \| grep -c` | **0** |
| `rapport onboarding-agents` | — | `cases/onboarding-agents/rapport-gouvernance.md` (mention juridique présente) |
| `validate-harness` | — | **OK** (agrège les sous-validateurs, config IA non bloquante) |
| Déterminisme | deux runs `validate-corpus --json` | **identiques** |
| Secrets dans les nouveaux fichiers | grep motifs | **0** |
| Tests | `npm test` | **36/36** |
| Build | `npm run build` | **OK** (routes inchangées) |
| Cas jetables nettoyés | `essai`, `demo-atelier`, `demo-refus` | **supprimés avant commit** |

### Points non traités (non-objectifs du Lot 3)

Aucun appel au modèle (frontière stricte respectée) ; pas de contenu de démo
dense (Lot 4) ; pas d'OCR/PDF ; `scripts/generate-demo.mjs` **conservé** (retiré
au Lot 4) ; pas d'API `/api/fabrique/*` (Lot 5a) ; pas de nouvelle source.


## Lot 4 — Corpus dense « onboarding-agents » (16 sources)

- **Date** : 2026-07-19 (session S4, après `/clear`). Modèle : `claude-opus-4-8`.
- **Spec d'autorité** : `specs/spec-corpus-onboarding.md`. Backlog : § Lot 4.
- **Portée réalisée** : Lot 4 **complet** — corpus dense 16 sources, 10 fiches,
  7 modules de parcours, 14 questions de quiz, bascule vers l'organisation
  fictive **« Syndicat mixte du Val de Brenne »**, référence versionnée
  `scripts/demo/onboarding-agents/`, `generate-demo` branché.

### Contenu de référence versionné

`scripts/demo/onboarding-agents/` devient le **miroir de vérité** du cas démo
(34 fichiers : `content/…` = corpus, `case/…` = manifeste + gouvernance).
`npm run generate-demo` **vérifie** l'égalité octet à octet ; `-- --ecrire`
**réécrit** le cas déployé depuis la référence. Les 16 sources ont été rédigées
dans la référence puis déployées ; `generate-demo` (mode vérification) ne
signale **aucun écart**.

### Corpus (16 sources, `SRC-001` à `SRC-016`)

- 6 sources existantes **densifiées** (ids/thèmes conservés) + 10 **créées**,
  conformes au tableau `spec-corpus-onboarding.md` §2 (titres, propriétaires
  fonction, classifications).
- **Total ≈ 16 279 mots** (cible 17 500 ±15 % = 14 875–20 125 → dans la
  fourchette). Chaque source vise 700–1 800 mots (fourchette respectée : la
  plus courte, SRC-005 « Contacts », ≈ 658 mots de corps, admise par la
  tolérance ±20 % pour une source volontairement tabulaire).
- Frontmatter complet (8 champs), `fictif: true`, dates 2025–2026 (aucune sous
  le seuil d'obsolescence), fonctions uniquement, courriels
  `@valdebrenne.exemple.fr`, poste neutralisé `01 00 00 00 0X` **uniquement**
  dans SRC-005. SRC-003 conserve « 2 jours max/semaine » et « 3 jours de
  présence ».

### Fiches / parcours / quiz / gouvernance

- **10 fiches** (ajouts : `informatique-securite`, `frais-deplacement`,
  `formation`, `ia-interne`) ; chacune cite ≥ 1 source et porte un champ
  `limites`.
- **Parcours : 7 modules** (premiers-jours, temps-de-travail,
  environnement-professionnel, protection-sociale, numerique-securite,
  deplacements-frais, formation).
- **Quiz : 14 questions** sourcées (renvoi fiche + source).
- `configs/demo.yml` → organisation « Syndicat mixte du Val de Brenne ».
  `configs/organisation.example.yml` → Roche-Vallonne conservé en **exemple
  secondaire commenté**. `harnais.yaml` → 16 `sources_declarees` alignées sur
  les frontmatters. Gouvernance (classification, journal, limites-refus,
  fiche-validation) réalignée sur 16 sources. Rapport régénéré.

### Scripts

- `scripts/generate-demo.mjs` **supprimé** (`git rm`) ; la clé npm
  `generate-demo` pointe vers `generate-onboarding-demo.mjs` (inchangée).
- `validate-corpus.mjs` : seuil `< 120 mots` **re-durci en erreur bloquante**
  (était un avertissement au Lot 3).
- `scripts/lib/motifs-interdits.mjs` : la tolérance du motif « courriel
  plausible » est étendue aux **sous-domaines** d'exemple (le négatif accepte
  désormais `rh@valdebrenne.exemple.fr`, pas seulement `x@exemple.fr`). Motif
  partagé avec `tests/structure/` → un seul point de changement, zéro
  divergence ; la sémantique reste : tout courriel **réel** est rejeté.

### Écart de recherche documentaire corrigé (contraste RIFSEEP)

La définition de **RIFSEEP** ajoutée au glossaire (SRC-015, exigée par la spec)
faisait passer la question hors-corpus « quel est le montant du RIFSEEP pour un
attaché principal ? » de `je-ne-sais-pas` à `sourcee` (le test existant
`hors-corpus-rifseep` échouait). Cause : la recherche par mots-clés
(`retrieval.ts`, seuil 2 racines distinctes) trouvait des passages combinant les
racines génériques `montan` + `princi` (SRC-004) ou `rifsee` + `montan`
(glossaire). **Correction sans toucher au code** : découpler ces mots dans le
corpus (SRC-004 « quelle que soit la dépense », « les règles d'égalité » ;
SRC-015 « aucun chiffrage » au lieu de « aucun montant »). Vérifié : plus aucun
passage ne score ≥ 2 pour cette question → `je-ne-sais-pas` rétabli. Le montant
du RIFSEEP reste donc **hors corpus** (cas existant conservé), sa définition
reste disponible pour la démonstration.

### Vérifications (toutes exécutées ce jour)

| Contrôle | Commande | Résultat |
|---|---|---|
| Nombre de sources | `ls …/sources \| wc -l` | **16** |
| Corpus | `npm run validate-corpus -- --cas onboarding-agents` | **16 sources, 0 erreur, 0 avertissement** |
| Référence ↔ disque | `npm run generate-demo` | **aucun écart** |
| Rapport | `npm run rapport -- --cas onboarding-agents` | régénéré (mention juridique présente) |
| Harnais | `npm run validate-harness` | **OK** (corpus 0/0 ; garde-fous 1 avert. « < 5 cas sourcés », non bloquant, admis jusqu'au Lot 7) |
| Tests | `npm test` | **36/36** |
| Build | `npm run build` | **OK (exit 0)** — 24 pages statiques (10 fiches), `/fabrique` dynamique |
| Civilité + Nom dans sources | grep | **aucun** |
| Motif concurrent / ancien nom | grep sur tout le dépôt | **aucun** |
| Roche-Vallonne dans le corpus | grep | **aucun** (présent seulement en exemple commenté de `organisation.example.yml`) |

### Points non traités (non-objectifs du Lot 4)

Lot 5 non entamé ; pas de nouveaux cas comportementaux détaillés du Lot 7 (les
tests existants restent verts) ; interface `/fabrique` non modifiée.


## Lot 5 — Interface guidée et pédagogie visible

- **Date** : 2026-07-19 (session S5, après `/clear`). Modèle : `claude-opus-4-8`.
- **Spec d'autorité** : `specs/backlog-implementation.md` § Lot 5,
  `specs/spec-parcours-video.md`, `specs/spec-skills.md`.
- **Portée réalisée** : rendre la fabrique lisible et démontrable dans le
  navigateur pour un public non technique (DGS/DRH/agents/élus), **sans** la
  transformer en expérience CLI-first. Aucune API d'écriture, aucune sous-route
  d'atelier (réservées à un lot ultérieur).

### Fichiers modifiés (6, tous du territoire code `src/` + scripts)

- `src/app/fabrique/page.tsx` — page **enrichie** : synthèse réelle du manifeste
  (slug, type, statut, étape, date, organisation, mode IA, nombre de sources et
  de fiches réels, modules actifs) ; les 15 étapes avec, pour chacune, **skill +
  script/action + preuve réelle** (lien applicatif ou chemin de fichier
  versionné) + statut visuel franchi/à faire + un encart `<details>` « en
  coulisse » portant la **commande équivalente** (étapes 9, 10, 11, 13, 14, 15) ;
  bouton « Ouvrir l'application produite » (`/`) ; lien vers `/gouvernance` +
  rapport si présent (vérifié par `fs.existsSync`) ; note sobre « l'état est lu
  depuis les fichiers du dépôt ». Reformulation du cadrage CLI : « les mêmes
  actions sont rejouables en ligne de commande pour les équipes techniques »
  (plus de phrase suggérant une fabrique CLI-first).
- `src/app/page.tsx` — **bandeau d'accueil** sobre en tête : « Ce portail a été
  produit par la fabrique Comptoir des Harnais — Voir comment » → `/fabrique`.
- `src/components/Nav.tsx` — **navigation pilotée par modules** (composant
  serveur, aucun `use client`) : lit `config.cas` puis `chargerManifeste`, et
  masque `Parcours d'accueil`, `Questions / réponses`, `Quiz`, `Checklist RH`
  quand le module correspondant est `false` dans `manifeste.modules`. La route
  directe reste servie.
- `src/app/gouvernance/page.tsx` — section **« Synthèse du harnais »** :
  type, statut, nombre de sources/fiches, mode IA, et **référence au rapport**
  `cases/onboarding-agents/rapport-gouvernance.md` (existence vérifiée), sans
  ré-afficher le rapport complet (déjà versionné).
- `src/app/globals.css` — deux styles sobres ajoutés : `.bandeau-fabrique`
  (accueil) et `.coulisse` (encart commande de `/fabrique`). Pas de dépendance
  front nouvelle.
- `scripts/interview-harness.mjs` — **finition UX uniquement** (textes
  filmables, moins de jargon) : accroche d'ouverture « je vais vous poser
  quelques questions… », refus d'éligibilité reformulé (courtois, renvoi
  RH/SIRH + limites, « le harnais joue son rôle »), en-tête « Fabrique de
  harnais », clôture « Cadrage terminé ». **Aucune** modification d'architecture
  (enveloppe mince autour de `scripts/lib/atelier/` inchangée).

### Décision UX structurante (navigation par modules)

La navigation est **rendue au build** avec les autres pages statiques : le
`RootLayout` (donc `Nav`) ne fait que des lectures `fs` synchrones, qui n'optent
pas la page dans le rendu dynamique de Next. La nav reflète donc le manifeste
**tel qu'au build/déploiement** — cohérent avec le modèle « contenu figé au
build, pas de base de données » du projet. Conséquence de recette : le test du
basculement de module se fait par **rebuild**, pas par simple redémarrage
serveur (un redémarrage ne régénère pas les pages statiques). Documenté ici pour
éviter le faux négatif.

### Vérifications (toutes exécutées ce jour)

| Contrôle | Commande / méthode | Résultat |
|---|---|---|
| Tests | `npm test` | **36/36** |
| Build | `npm run build` | **OK** — routes inchangées (`/fabrique` dynamique) |
| Harnais | `npm run validate-harness` | **OK** (corpus 0/0 ; garde-fous 1 avert. non bloquant) |
| Interview démo | `npm run interview -- --demo` | **6 fichiers, code 0** (cas jetable `demo-atelier` nettoyé) |
| Refus d'éligibilité | démo patchée `eligibilite: o` | **code 0**, manifeste `etape: 1`, message reformulé affiché ; démo restaurée |
| HTTP (serveur propre, port 3015) | `curl` `/`, `/fabrique`, `/gouvernance`, `/sources`, `/faq` | **200** partout |
| `/fabrique` filmable | grep du HTML servi | contient « 15 étapes », « onboarding-agents », « rapport », « Skill », « Script », « En coulisse », « Modules actifs », « Ouvrir l'application » |
| Bandeau accueil | grep `/` | « produit par la fabrique » + lien « Voir comment » présents |
| Nav par modules | `quiz: false` → **rebuild** → grep pages prérendues | nav `index/sources/gouvernance` sans `href="/quiz"`, `/parcours` conservé ; `quiz.html` **toujours généré** (route directe servie) ; manifeste **restauré**, rebuild propre → `/quiz` de retour |
| Motifs interdits / ancien nom | scan des libellés explicitement exclus du projet | **aucun** |
| Secrets | grep `sk-…/AKIA…/PRIVATE KEY/ghp_` sur `src scripts docs cases content configs skills tests` | **aucun** |

> ⚠️ Port 3010 occupé par des serveurs d'autres sessions (relevés `next-server`
> anciens) — **non tués** (arbitrage). Les vérifications HTTP ont utilisé une
> instance propre sur un port libre (3015/3016), ensuite arrêtée.

### Écarts / points d'attention

- Nav par modules **statique au build** (voir « Décision UX » ci-dessus) : ce
  n'est pas un bug, c'est le modèle du projet. Si un rendu par requête devient
  nécessaire, il faudra opter le layout en dynamique — hors périmètre Lot 5.
- Le fichier `claude-code-runs/*-dev-session1-*.txt` apparaît modifié : artefact
  de session, **non commité** (arbitrage HANDOFF).

### Points non traités (non-objectifs du Lot 5)

Pas d'API `/api/fabrique/*` ni d'écriture navigateur ; pas de sous-routes
`/fabrique/nouveau` ni `/fabrique/[slug]/etape/[n]` ; pas de refonte graphique ;
aucune dépendance front nouvelle ; **Lot 6 non entamé**.


## Lot 6 — Intégration de l'application finale existante

- **Date** : 2026-07-19 (session S6, après `/clear`). Modèle : `claude-opus-4-8`.
- **Spec d'autorité** : `specs/backlog-implementation.md` § Lot 6. Héritier direct
  de la recette d'adaptation tierce V1 (§5 ci-dessus).
- **Objectif prouvé** : *assembler une application = pointer une config vers un
  cas*, **sans toucher au code applicatif** (`src/`). Un cas jetable `essai`,
  produit par le circuit officiel de la fabrique, est servi par la **même**
  application via `CDH_CONFIG=essai.yml`, puis supprimé. La preuve durable est
  cette recette ; les artefacts `essai` ne sont **pas** versionnés (dépôt propre
  en fin de lot).

### Circuit officiel déroulé de bout en bout (cas jetable `essai`)

Toutes les commandes ci-dessous ont été **réellement exécutées** ce jour.

1. **Interview guidée (mode démo, slug `essai`).** Le gabarit
   `templates/cases/documentaire/reponses-demo.yaml` porte durablement le slug
   `demo-atelier` ; pour le Lot 6, il a été **patché temporairement** en
   `slug: "essai"`, l'interview lancée, puis le fichier **restauré à l'identique**
   (`git checkout -- templates/cases/documentaire/reponses-demo.yaml`, `git diff`
   vide vérifié). `onboarding-agents` n'a jamais été touché.

   ```bash
   npm run interview -- --demo      # slug patché en « essai »
   ```

   → **6 fichiers produits, code 0** : `cases/essai/harnais.yaml` (manifeste),
   `configs/essai.yml` (config du cas, `cas: essai`, organisation
   « Communauté de communes de Roche-Vallonne », fictive), et la gouvernance
   amorcée (`cases/essai/gouvernance/{fiche-besoin,classification,limites-refus}.md`,
   `cases/essai/tests/comportement.yaml`).

2. **Scaffold de l'arborescence.**

   ```bash
   npm run scaffold -- --cas essai
   ```

   → **9 fichiers créés** (structure `content/cases/essai/` : `sources/`,
   `fiches/`, `parcours/`, `quiz/`, `checklist.md`, `README.fr.md`, +
   `cases/essai/gouvernance/{fiche-validation,journal}.md`) ; **2 conservés/ignorés**
   (`classification.md`, `limites-refus.md` déjà écrits par l'interview, non
   réécrits sans `--force` — comportement idempotent attendu).

3. **Corpus minimal, échec attendu d'abord.** Sur l'arborescence de gabarit
   seule (les fichiers `EXEMPLE-*` sont **ignorés** par `validate-corpus`), le
   corpus est vide :

   ```bash
   npm run validate-corpus -- --cas essai
   ```

   → **ÉCHEC attendu, nommé** : `✗ sources/ : aucune source dans
   content/cases/essai/sources/` (+ 3 avertissements « source déclarée non
   importée » : les 3 sources déclarées à l'étape 4 de l'interview n'ont pas
   encore de fichier). C'est le message d'échec explicite exigé par le critère
   d'acceptation (« corpus vide → erreurs nommées »).

4. **Import d'une source d'exemple fictive.** Une source minimale (≈ 450 mots,
   100 % fictive, fonctions uniquement, aucune donnée personnelle) a été rédigée
   hors dépôt (`/tmp`) puis amorcée par le script officiel, avec un titre
   correspondant à l'une des sources déclarées au manifeste :

   ```bash
   node scripts/import-source.mjs <doc.txt> --id SRC-001 \
     --titre "Règlement du temps de travail" \
     --proprietaire "Direction des ressources humaines" \
     --date 2025-06-30 --statut active --classification interne \
     --perimetre "Agents de la collectivité (règle générale, hors cas individuel)" \
     --fictif true --out content/cases/essai/sources
   ```

   → `content/cases/essai/sources/SRC-001-reglement-temps-travail.md`.

5. **Corpus conforme.**

   ```bash
   npm run validate-corpus -- --cas essai
   ```

   → **OK — 1 source, 0 erreur, 2 avertissements** (les 2 sources déclarées
   restantes, volontairement non importées : corpus minimal assumé).

6. **Orchestrateur sur le cas d'essai.**

   ```bash
   npm run validate-harness -- --cas essai
   ```

   → **OK** (aucune erreur bloquante). Synthèse : Corpus 0 erreur / 2 avert. ;
   Garde-fous 0 erreur / **8 avertissements nommés** (socle de refus nominatif
   et possessif non encore présent dans le corpus minimal, sources SRC-002…005
   citées par les tests d'amorce mais non importées, « < 5 cas sourcés »,
   « aucun cas hors-corpus ») ; Config. IA `local`/hors-ligne, non bloquante.
   Ces avertissements sont **exactement** le retour attendu d'un cas neuf au
   corpus minimal : ils nomment ce qui reste à faire, sans faux positif.

### Preuve `CDH_CONFIG=essai.yml` puis bascule inverse

Servi par la **même** application (aucune modification de `src/`) :

| Config active | Commande | Identité servie sur `/` et `/gouvernance` | `/sources` |
|---|---|---|---|
| `essai.yml` | `CDH_CONFIG=essai.yml npx next dev -p <port>` | **Communauté de communes de Roche-Vallonne** | **SRC-001** (« Règlement du temps de travail ») + le `EXEMPLE-source.md` du gabarit (id placeholder `SRC-000`) |
| *(aucune)* → `demo.yml` | `npx next dev -p <port>` | **Syndicat mixte du Val de Brenne** | **SRC-001 … SRC-016** (corpus dense `onboarding-agents`) |

Vérifié par `curl` sur la page servie (`grep` de l'identité, des ids de sources
et de la mention de gouvernance). La bascule est **totale et étanche** : le cas
`essai` n'expose que son unique source, le cas par défaut ses 16 ; aucun mélange
(les caches sont indexés par cas via `paths.ts`/`content.ts`).

### Écart de recette : port 3010 squatté (aucun impact fonctionnel)

Le port **3010** (port officiel du projet) était **occupé par un serveur
`next dev` orphelin d'une session antérieure** (pré-Lot 4 : il sert encore
l'ancienne organisation « Roche-Vallonne » avec un corpus à 6 sources). Toute
tentative de démarrage sur 3010 renvoyait `EADDRINUSE`, et une première lecture
`curl` a été **trompée** par cet orphelin (fausse identité). Correctif de
recette : les deux vérifications HTTP ci-dessus ont été refaites sur un **port
libre dédié (3021)**, serveur démarré proprement (`✓ Ready`, `✓ Compiled`), puis
arrêté. L'orphelin d'une autre session **n'a pas été tué** (même arbitrage qu'au
Lot 5 : ne pas interférer avec les serveurs d'autres sessions). Aucune incidence
sur le produit : le port est un paramètre d'exécution, pas du code.

### Aucun couplage résiduel `src/` ↔ cas découvert

Le Lot 6 avait aussi pour rôle de **révéler** un éventuel couplage résiduel
(cache global, chemin de cas codé en dur) qui aurait empêché
`CDH_CONFIG=essai.yml`. **Aucun** n'a été trouvé : l'application a servi le cas
`essai` sans la moindre retouche de `src/`. `git diff --stat -- src/` ne liste
donc que `src/app/sources/adapter/page.tsx` (mise à jour documentaire de ce lot),
conformément au critère d'acceptation.

### Fichiers permanents modifiés (Lot 6)

- `docs/RECETTE.md` — cette section (la preuve durable).
- `docs/adapter-ses-sources.fr.md` — nouveau §0 « Deux chemins d'adaptation » et
  encart « Version opérationnelle » alignés sur le circuit fabrique (interview →
  scaffold → import-source → validate-corpus → `CDH_CONFIG` → dev/build) ;
  chemins `content/cases/<slug>/sources/` corrigés.
- `src/app/sources/adapter/page.tsx` — bloc « Repartir de la fabrique » (le
  circuit officiel) + chemin `content/cases/<slug>/…` corrigé.
- `configs/organisation.example.yml` — champ `cas` et **circuit complet**
  documentés (renvoi vers l'interview/scaffold, `CDH_CONFIG`).
- `docs/HANDOFF.md` — bloc de reprise mis à jour (Lot 6 terminé, cap Lot 7).

### Nettoyage final (artefacts `essai` supprimés)

```bash
rm -rf cases/essai content/cases/essai configs/essai.yml
```

→ `git status --short` ne liste plus aucun artefact `essai` (seuls subsistent
les `claude-code-runs/*` non suivis, arbitrage HANDOFF). La procédure ci-dessus
est la trace durable ; le cas jetable ne pollue pas le dépôt.

### Vérifications finales sur le cas par défaut (toutes exécutées ce jour)

| Contrôle | Commande | Résultat |
|---|---|---|
| Corpus défaut | `npm run validate-corpus -- --cas onboarding-agents` | **16 sources, 0 erreur, 0 avertissement** |
| Garde-fous défaut | `npm run validate-guardrails -- --cas onboarding-agents` | **0 erreur** (1 avert. « < 5 cas sourcés », admis jusqu'au Lot 7) |
| Harnais défaut | `npm run validate-harness` | **OK** (corpus 0/0 ; garde-fous 1 avert. non bloquant) |
| Tests | `npm test` | **36/36** |
| Build | `npm run build` | **OK** — routes inchangées (`/fabrique` dynamique) |
| Référence démo | `npm run generate-demo` | **aucun écart** (cas `onboarding-agents` intact) |
| `git diff --stat -- src/` | — | **uniquement `src/app/sources/adapter/page.tsx`** |
| Secrets / PII / ancien nom / concurrent | grep sur le dépôt | **aucun** |

### Points non traités (non-objectifs du Lot 6)

Aucun second cas d'usage **publié** (l'essai est jetable) ; aucun multi-cas
simultané ni sélecteur de cas dans le navigateur ; **Lot 7 non entamé** (tests
massifs, sécurité, RGPD, absence de secrets).


## Lot 7 — Tests, sécurité, RGPD, absence de secrets

- **Date** : 2026-07-19 (session S7, après `/clear`). Modèle : `claude-opus-4-8`.
- **Spec d'autorité** : `specs/backlog-implementation.md` § Lot 7 ;
  `specs/spec-corpus-onboarding.md` §4 (cas induits).
- **Correction préalable** : le commit `dc8c340` (Hermes) avait retiré de
  `docs/RECETTE.md` une mention indésirable de libellés exclus. HEAD de départ de
  la session = `dc8c340`. Règle tenue : aucun libellé exclu écrit dans le dépôt.
- **Objectif prouvé** : porter la couverture au niveau de la refonte —
  **36 → 83 tests** —, solder les avertissements tolérés jusqu'ici, et prouver
  par des fixtures négatives que les scripts échouent proprement.

### Compte de tests (avant / après)

| Fichier de test | Avant | Après |
|---|---|---|
| `tests/structure/configuration-ia.test.ts` | 18 | 18 |
| `tests/structure/structure.test.ts` | 7 | **19** (arborescence fabrique, manifeste valide, 8 skills) |
| `tests/structure/manifest.test.ts` *(nouveau)* | — | **19** (schéma strict + non-divergence TS ↔ script) |
| `tests/scripts/scripts.test.ts` *(nouveau)* | — | **7** (scripts via `--json` / codes de sortie) |
| `tests/guardrails/behavior.test.ts` | 11 | **20** (9 cas de comportement induits par le corpus dense) |
| **Total** | **36** | **83** |

### Nouveaux cas de comportement (moteur réel, mode `local`)

Chaque attente a été **vérifiée empiriquement** contre le moteur avant d'être
écrite (jamais d'attente inventée : lecture des sources d'abord). Ajouts :

| Cas | Comportement réel constaté |
|---|---|
| logiciel sur le poste | sourcé **SRC-007** (installation réservée à la DSI) |
| courriel suspect | sourcé **SRC-007** (règles de réaction) |
| remboursement d'un déplacement | sourcé **SRC-009** |
| formation obligatoire | sourcé **SRC-010** |
| « qui est le directeur ? » | sourcé **SRC-011** : la **fonction** de direction existe, mais l'identité du titulaire **n'est pas une donnée** du portail (refus nominatif « inversé », aucune personne) |
| usage de l'IA | sourcé **SRC-013** |
| sécurité au travail (incendie) | sourcé **SRC-016** |
| « ai-je droit au CPF … ma situation ? » | **refus** cas individuel (renvoi RH) |
| « que veut dire RIFSEEP ? » | sourcé **SRC-015** (définition) — **contraste** conservé avec « montant du RIFSEEP » qui reste **hors corpus** (`je-ne-sais-pas`) |

**Écart de recherche documentaire assumé** : le mot « accident » n'existe **nulle
part** dans le corpus (vérifié par `grep`). Conformément à la consigne « ne pas
inventer une réponse si la source ne la porte pas », le cas prévu « accident de
travail » a été **reformulé** sur le contenu réel de **SRC-016** (consignes de
sécurité / incendie / droit de retrait), au lieu de forcer une réponse absente.

Champ **`couvre:`** ajouté aux cas de refus (traçabilité de la triple cohérence).
`gouvernance/limites-refus.md` **inchangé** : toutes les catégories de refus
testées (nominatif, possessif individuel, avis juridique) y sont déjà affichées
(la triple cohérence est **vérifiée** par `validate-guardrails`, non ajoutée).

### Tests de scripts (non interactifs, robustes)

`tests/scripts/scripts.test.ts` — via `spawnSync`, `--json`, codes de sortie et
racines de projet isolées (`CDH_PROJECT_ROOT`), jamais de simulation de TTY :

- **validate-corpus** : nominal `onboarding-agents` → **code 0, ok** ; fixture
  piégée `corpus-motif-interdit/` (courriel plausible synthétique dans une
  source) → **code 1** + erreur « motif interdit détecté ».
- **validate-guardrails** : nominal → **code 0, ok** ; fixture
  `guardrails-refus-non-teste/` (un refus **déclaré** au manifeste mais **non
  couvert** par les tests) → **code 1** + erreur « refus déclaré non testé ».
- **scaffold** : première génération → **code 0**, fichiers créés ; relance →
  **code 0**, **0 fichier créé**, « Conservé (inchangé) » (idempotence prouvée).
- **interview `--demo`** : déroulé complet sans TTY → **code 0**, manifeste du cas
  jetable produit. Exécuté dans une racine temporaire (aucune pollution du dépôt).

### Fixtures négatives isolées (RGPD / anti-motifs)

`tests/scripts/fixtures/` (voir `LISEZ-MOI.md`) contient des racines de projet
miniatures **volontairement fautives**. Le dossier `fixtures` est **exclu du
balayage anti-motifs** de `tests/structure/structure.test.ts` (jeu de dossiers
ignorés) : la fixture de corpus contient **à dessein** un motif interdit (un
courriel plausible **synthétique** — aucune personne réelle, aucun libellé
exclu) pour prouver que `validate-corpus` le détecte. Aucun secret, aucune donnée
personnelle réelle, aucun libellé exclu dans les fixtures.

### Manifeste : schéma strict et non-divergence

- `src/lib/manifest.ts` : ajout **additif** d'une fonction pure exportée
  `validerManifeste(objet)` (miroir de la fonction homonyme de
  `scripts/lib/manifeste.mjs`), sans changement de comportement des appelants.
- `tests/structure/manifest.test.ts` : 4 cas valides + 14 cas invalides passés
  **aux deux** validateurs (TS zod et script JS pur) → **verdict identique** sur
  chacun (non-divergence prouvée). Le manifeste réel `onboarding-agents` est
  valide des deux côtés.

### Solde des avertissements tolérés jusqu'au Lot 7

`validate-guardrails -- --cas onboarding-agents` : **0 erreur, 0 avertissement**.
L'avertissement « < 5 cas sourcés » (admis depuis le Lot 3) est **soldé** :
**10 cas sourcés valides** (SRC-001, 003, 007×2, 009, 010, 011, 013, 015, 016),
≥ 3 refus (nominatif fictif, possessif individuel, avis juridique), ≥ 1
hors-corpus. Aucun renvoi vers une personne.

### Vérifications finales (toutes exécutées ce jour)

| Contrôle | Commande | Résultat |
|---|---|---|
| Tests (3× consécutifs) | `npm test` ×3 | **83/83** à chaque exécution |
| Garde-fous | `npm run validate-guardrails -- --cas onboarding-agents` | **0 erreur, 0 avertissement** |
| Corpus | `npm run validate-corpus -- --cas onboarding-agents` | **16 sources, 0 erreur, 0 avertissement** |
| Harnais | `npm run validate-harness` | **OK** (corpus 0/0 ; garde-fous 0/0 ; config IA non bloquante) |
| Build | `npm run build` | **OK** (routes inchangées, `/fabrique` dynamique) |
| Référence démo | `npm run generate-demo` | **aucun écart** |
| Secrets (chemins actifs, 206 fichiers) | scan motifs partagés | **0** |
| PII (chemins actifs) | scan motifs partagés | **0** ; les 2 seules occurrences PII sont les **fixtures négatives** isolées et documentées |
| Libellés exclus | non introduits (additions neutres, fonctionnelles) | **0** |

### Points non traités (non-objectifs du Lot 7)

Aucun appel réseau réel aux fournisseurs IA ; aucune modification des regex de
`src/lib/guardrails.ts` ; pas de test de charge ; **Lot 8 non entamé** (README,
scénario vidéo, recette finale, handoff refondu).


## Lot 8 — README, scénario vidéo, recette finale, handoff

- **Date** : 2026-07-19 (session S8, après `/clear`). Modèle : `claude-opus-4-8`.
- **Spec d'autorité** : `specs/backlog-implementation.md` § Lot 8 ;
  `specs/PRD-v0.3-harnais-fabrique.md` §3 et §6 ; `specs/spec-parcours-video.md`.
- **HEAD de départ** : `5c2c6b5` (`test: renforcer la couverture sécurité et
  garde-fous (Lot 7)`).
- **Objectif** : rendre le dépôt lisible à froid et raconter la fabrique
  d'abord, partout, sans surpromettre — chaque affirmation reliée à un fichier
  ou une commande réellement exécutée.

### Chiffres réels relevés ce jour (jamais recopiés)

| Élément | Valeur constatée | Commande |
|---|---|---|
| Tests | **83/83** (configuration-ia 18, structure 19, manifeste 19, scripts 7, garde-fous 20) | `npm test` |
| Build | **OK** — 24 pages prérendues, `/fabrique` `ƒ` dynamique ; 16 entrées de route dont 3 dynamiques (`/api/faq`, `/configuration-ia`, `/fabrique`) | `npm run build` |
| Corpus | **16 sources, 0 erreur, 0 avertissement** | `npm run validate-corpus -- --cas onboarding-agents` |
| Garde-fous | **0 erreur, 0 avertissement** | `npm run validate-guardrails -- --cas onboarding-agents` |
| Harnais | **OK** — corpus 0/0, garde-fous 0/0, config IA `local` non bloquante | `npm run validate-harness` |
| Référence démo | **aucun écart** | `npm run generate-demo` |
| Fiches | **10** | `getFiches()` / `/fabrique` |
| Modules de parcours | **7** | `content/cases/onboarding-agents/parcours/parcours.yml` |
| Questions de quiz | **14** | `content/cases/onboarding-agents/quiz/quiz.yml` |
| Skills | **8** | `ls skills` |
| Scripts npm harnais | **9** (`interview`, `scaffold`, `validate-corpus`, `validate-guardrails`, `validate-provider`, `validate-harness`, `rapport`, `generate-demo`, `import-source`) | `package.json` |

### Fichiers modifiés (permanents, Lot 8)

- `README.md` — **refonte fabrique d'abord** : titre et ouverture présentent la
  fabrique avant le portail ; « Un harnais n'est pas un prompt » ; parcours en
  15 étapes (schéma texte `besoin → atelier → génération → corpus → validation →
  application → rapport` + tableau des 15 libellés verbatim) ; démarrage rapide
  commençant par `npm run interview -- --demo`, puis `/fabrique` (décrit
  honnêtement comme **tableau de bord en lecture seule**), puis `npm run dev`
  pour l'application ; structure du dépôt exacte (`cases/`, `content/cases/`,
  `skills/`, `scripts/lib/`) ; tableau des 9 scripts npm ; configuration IA
  (7 modes) ; sécurité/gouvernance ; licences ; English summary réécrit
  « fabrique d'abord ». Badges, licences et maintenance conservés.
- `docs/architecture.fr.md` — §1 : rôle de la fabrique, arborescence par
  territoires (`cases/`, `content/cases/`, `skills/`, `scripts/lib/`), manifeste
  par cas ; §2 : corpus 16 sources, chemin `content/cases/<cas>/` ; §3 : 7 modes
  IA (catalogue) au lieu de 3.
- `docs/cycle-de-vie.fr.md` — nouvelle section « Le parcours opérationnel en
  15 étapes » (15 libellés verbatim + correspondance aux 10 grandes étapes
  pédagogiques) ; intro alignée (dix étapes pédagogiques → quinze opérationnelles).
- `cases/onboarding-agents/demo/plan-demo.md` — **créé** (nouveau dossier
  `demo/`) : plan de démonstration vérifié commande par commande, conforme au
  dépôt réel, avec **écart majeur consigné** (voir ci-dessous).
- `docs/RECETTE.md` — cette section + synthèse finale + tableau PRD §6.
- `docs/HANDOFF.md` — bloc de reprise à froid finale (Lots 0–8).
- `CHANGELOG.md` — entrée de refonte finalisée (Lots 2–8).
- `cases/onboarding-agents/rapport-gouvernance.md` — **régénéré** par
  `npm run rapport` : l'avertissement « < 5 cas sourcés » (soldé au Lot 7) y
  était encore inscrit ; le rapport affiche désormais **0 erreur / 0
  avertissement**, cohérent avec l'état réel des garde-fous. Seule modification :
  cette ligne (le reste, dont la date d'en-tête, inchangé).

### Écart majeur consigné : atelier guidé navigateur non implémenté

`specs/spec-parcours-video.md` et le PRD v0.3 §3 bis décrivent des **sous-routes
d'atelier** (`/fabrique/nouveau`, `/fabrique/[slug]/etape/[n]`,
`/fabrique/[slug]/rapport`) et une **API `/api/fabrique/*`** qui **n'existent
pas** dans le dépôt (non-objectifs explicites du Lot 5, réservés à un lot
ultérieur). Ce qui existe : `/fabrique` en **lecture seule** (état du manifeste
+ 15 étapes + encarts « en coulisse »), le portail complet, et le **CLI de
l'atelier** (`npm run interview`). Conformément à la skill `preparer-demo-video`
(« je ne mets pas en scène un résultat qui n'existe pas »), `plan-demo.md`
**adapte** chaque plan concerné : l'atelier guidé se montre au terminal et via
`/fabrique`, jamais par une saisie de réponses au navigateur. L'écart est
documenté en tête de `plan-demo.md`, pas masqué.

### Plan de démo — commandes réellement exécutées

Toutes le 2026-07-19, mode `local` (voir `cases/onboarding-agents/demo/plan-demo.md`) :

| Plan | Commande / action | Résultat |
|---|---|---|
| 1 | `head -40 README.md` | « fabrique » avant le portail |
| 2 | `npm run interview -- --demo` | 15 étapes, code 0 (cas jouet `demo-atelier` supprimé après essai) |
| 3 | ouverture `skills/concevoir-garde-fous/SKILL.md` | frontmatter + 5 sections |
| 4 | `npm run validate-corpus -- --cas onboarding-agents` | 16 sources, 0/0 |
| 5 | `curl /configuration-ia` (serveur port libre) | 200, mode `local`, aucune clé affichée |
| 6 | `npm test` + `npm run validate-guardrails -- --cas onboarding-agents` | 83/83 ; 0/0 |
| 7 | `curl /` + POST `/api/faq` | Val de Brenne + bandeau fabrique ; télétravail → **SRC-003** cité ; « Madame Martin » → **refus** cas individuel |
| 8 | `npm run rapport -- --cas onboarding-agents` | rapport écrit, mention « ne vaut pas validation juridique » |

> Serveur de vérification HTTP lancé sur un **port libre dédié (3018)**, `✓ Ready`
> attendu avant tout `curl`, puis **arrêté** (process identifié par `PORT=3018`
> dans son `environ`). Les serveurs `next-server` orphelins d'**autres sessions**
> (dont le squat historique du port 3010) n'ont **pas** été tués (même arbitrage
> que Lots 5/6). Cas jouet `demo-atelier` supprimé (`git status` propre).

### Tableau de correspondance — critères d'acceptation PRD v0.3 §6 → preuves

| # | Critère PRD v0.3 §6 | Statut | Preuve (2026-07-19) |
|---|---|---|---|
| 1 | l'atelier `/fabrique` conduit les 15 étapes **dans le navigateur** avec reprise, sans secret | **Non atteint (assumé)** | `/fabrique` existe en **lecture seule** (200, 15 étapes, aucun champ de clé) ; la conduite guidée navigateur (saisie) est un lot ultérieur — cf. `plan-demo.md` §écart et Lot 5 non-objectifs |
| 2 | `npm run interview` déroule les 15 étapes, `--demo` exécutable en CI | **Atteint** | `npm run interview -- --demo` → 15 étapes, code 0 ; testé par `tests/scripts/scripts.test.ts` |
| 3 | `npm run scaffold -- --cas essai` produit une arborescence que `validate-harness -- --cas essai` sait évaluer (échec attendu si corpus vide) | **Atteint** | prouvé au Lot 6 (circuit `essai` : scaffold → corpus vide « erreurs nommées » → import → OK) et par `tests/scripts/scripts.test.ts` (scaffold idempotent) |
| 4 | `onboarding-agents` = 16 sources conformes, `npm test` vert | **Atteint** | `validate-corpus` 16 sources 0/0 ; `npm test` 83/83 |
| 5 | chaque skill de `spec-skills.md` existe et est citée par son étape | **Atteint** | 8 `skills/*/SKILL.md` ; union des `etapes_parcours` = étapes du parcours (test structure) ; citées sur `/fabrique` |
| 6 | routes `/fabrique/nouveau`, `[slug]`, `etape/[n]`, `rapport` + handlers `/api/fabrique/*` testés | **Non atteint (assumé)** | sous-routes et API **absentes** (non-objectif Lot 5, lot ultérieur) — cf. `plan-demo.md` §écart |
| 7 | le README raconte la fabrique d'abord ; « fabrique » avant le portail | **Atteint** | `head -40 README.md` : titre et ouverture = fabrique |
| 8 | chaque plan de `spec-parcours-video.md` correspond à un élément exécutable | **Atteint par adaptation** | `plan-demo.md` : chaque plan mappé à une action réelle ; les plans reposant sur les sous-routes absentes sont **adaptés** (terminal + `/fabrique`), l'écart consigné |

**Bilan honnête** : 6 critères sur 8 atteints ; **2 non atteints assumés**
(critères 1 et 6 : l'atelier guidé navigateur et ses sous-routes/API, hors
périmètre des lots livrés — le PRD les cadre en V1.5, le backlog les a
explicitement reportés). Aucun critère n'est présenté comme atteint s'il ne
l'est pas.

### Synthèse finale de la refonte (Lots 0 → 8)

| Lot | Livrable | Preuve durable |
|---|---|---|
| 0 | Branche `refonte-fabrique`, tag `avant-refonte-fabrique`, CHANGELOG d'ouverture | §« Lot 0 » |
| 1 | Arborescence fabrique (`cases/`, `content/cases/`), manifeste, `/fabrique`, `src/lib/manifest.ts` | §« Lot 1 » |
| 2 | 8 skills `skills/<nom>/SKILL.md` | §« Lot 2 » |
| 3 | Couche déterministe `scripts/lib/` + atelier + 3 validateurs + orchestrateur + interview | §« Lot 3 » |
| 4 | Corpus dense 16 sources, 10 fiches, 7 modules, 14 quiz ; référence versionnée | §« Lot 4 » |
| 5 | `/fabrique` pédagogique (état réel + 15 étapes + preuves) ; nav par modules ; bandeau accueil | §« Lot 5 » |
| 6 | Preuve d'adaptation par configuration (cas jetable `essai` via le circuit officiel) | §« Lot 6 » |
| 7 | Couverture 36 → **83 tests** ; avertissements soldés ; fixtures négatives | §« Lot 7 » |
| 8 | README fabrique d'abord, docs alignées, `plan-demo.md` vérifié, recette + handoff finalisés | cette section |

**État final vérifié le 2026-07-19** : `npm test` **83/83**, `npm run build`
**OK**, `validate-harness` **OK** (0/0/0), `generate-demo` **aucun écart**. Scan
secrets/PII/libellés exclus sur les chemins actifs : **0** (les 2 seules
occurrences PII sont les fixtures négatives isolées et documentées du Lot 7).
**Aucun push, aucun merge, aucun tag** : la refonte est close **sur la branche**,
la décision de fusion revient à Pascal.

### Points non traités (non-objectifs du Lot 8)

Aucun tournage vidéo (le lot livre le **plan** vérifié) ; aucune implémentation
des sous-routes d'atelier ni de l'API `/api/fabrique/*` (lot ultérieur) ; aucun
push, merge ou changement de licence.
