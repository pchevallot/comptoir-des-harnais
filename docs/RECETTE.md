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

