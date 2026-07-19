# HANDOFF — Comptoir des Harnais

Document de reprise pour une nouvelle session Claude Code, **après nettoyage de
contexte**. Objectif : reprendre le projet sans perte d'information
opérationnelle. Rédigé le **2026-07-19**.

**Ordre de lecture recommandé :** `prd/PRD.md` (autorité fonctionnelle) → ce
fichier → `docs/RECETTE.md` (journal de recette) → le code.

> **Modèle exigé : `claude-opus-4-8` (Opus 4.8). Ne pas substituer.** Il était
> disponible au moment des sessions précédentes. Si une future session ne le
> trouve pas : s'arrêter et le signaler (PRD §12.1), ne jamais substituer
> silencieusement un autre modèle.

---

## 1. Synthèse exécutive

**Comptoir des Harnais** est un dépôt open source **pédagogique et applicatif**
(langue de référence : français) destiné aux **collectivités territoriales et
acteurs publics** (DSI, DPO, RSSI, directions métiers, DRH/DGS). Il explique ce
qu'est un *harnais d'IA* et en livre un premier exemple complet et fonctionnel :
une **application web d'onboarding RH documentaire**, configurable, sourcée et
gouvernée.

**Un harnais n'est pas un prompt.** C'est un ensemble structuré : besoin métier,
sources identifiées et datées, règles, garde-fous, tests automatisés,
responsabilités nommées et preuves visibles, qui encadrent un système d'IA pour
qu'il produise quelque chose d'utile, maintenable et gouverné.

**Ce que l'application EST :** un portail d'accueil pour nouvel arrivant —
parcours de lecture, fiches, FAQ sourcée, quiz, pages de gouvernance. Chaque
réponse cite ses sources ; les limites et la gouvernance sont affichées ; les
garde-fous sont couverts par des tests. Une organisation remplace le contenu
fictif par le sien en éditant YAML/Markdown, **sans toucher au code**.

**Ce que l'application N'EST PAS (périmètre non négociable) :** pas un SIRH ni un
module de SIRH ; pas un outil de gestion de cas individuels (aucun dossier
nominatif, aucune donnée personnelle) ; pas un système de décision (il **refuse**
les questions sur une personne identifiable, et ce refus est testé) ; pas un
outil de conformité (il porte la mention « ne vaut pas validation juridique »).

**Positionnement à préserver :** application **RH documentaire d'onboarding**,
pas SIRH, pas quasi-SIRH.

---

## 2. État Git local (vérifié)

- **Branche courante :** `main`.
- **HEAD attendu après la publication initiale :** dernier commit de documentation
  *« docs: publish pedagogical README and detailed handoff »*. Relancer
  `git log --oneline -5` pour obtenir le SHA exact du contexte courant.
- **Historique :**
  - commit documentation — README principal pédagogique + handoff détaillé + nettoyage d'un
    marqueur de fausse clé dans les tests.
  - `72fa4ff` — configuration IA multi-fournisseurs + adaptation des sources.
  - `56bc573` — H4 : recette adaptation tierce (§10.4) + vérification O1–O8 (§2.1).
  - `1508107` — V1 : webapp onboarding RH documentaire (Lots A–H), 108 fichiers.
- **Remote :** `origin` pointe vers
  `https://github.com/pchevallot/comptoir-des-harnais.git`. Le push a été demandé
  explicitement par Pascal pour publier une première version sur son GitHub.
- **Working tree :** propre côté code. Seuls des fichiers `claude-code-runs/*`
  (logs de sessions Claude Code) sont non suivis / modifiés ; ce sont des
  artefacts de session, pas du code produit.
- **Environnement :** Node **v22.22.3**, npm **10.9.8**, Next **15.5.20**
  (`package.json` exige Node ≥ 20).

> Ne pas inventer de SHA. Les valeurs ci-dessus ont été relevées le 2026-07-19 ;
> une session ultérieure doit relancer `git log --oneline -5` pour l'état réel.

---

## 3. Architecture du dépôt

Next.js 15 (App Router) + TypeScript **strict** + React 19 + Vitest. Pas de base
de données. Rendu Markdown maison. Séparation stricte **code / contenu**.

```
comptoir-des-harnais/
├─ src/                      Code applicatif — TERRITOIRE DÉVELOPPEUR (pas de contenu métier)
│  ├─ app/                   Pages (App Router) + api/faq/route.ts
│  ├─ components/            Nav.tsx, Badges.tsx, Markdown.tsx
│  └─ lib/                   Moteur : config, content, retrieval, guardrails,
│     └─ model/              answer, logging + interface modèle substituable
├─ content/                  CONTENU MÉTIER — territoire non-technicien (fictif en démo)
│  └─ demo-onboarding-rh/    sources/ fiches/ parcours/ quiz/ gouvernance/ checklist.md
├─ configs/                  demo.yml (démo) + organisation.example.yml (modèle commenté)
├─ tests/                    guardrails/ (comportement) + structure/ (structure & config IA)
├─ scripts/                  validate-harness.mjs, generate-demo.mjs, import-source.mjs
├─ docs/                     PRD est dans prd/. Ici : HANDOFF, RECETTE, guides .fr.md
├─ prd/                      PRD.md (autorité) + PRD.v0.1.backup.md
├─ templates/                gabarits de sources/fiches
├─ planning/                 notes de cadrage
└─ claude-code-runs/         logs de sessions Claude Code (artefacts, non pertinents pour le produit)
```

**Règle structurante :** le contenu métier vit dans `content/` et `configs/`,
jamais dans `src/`. Adapter le portail à une organisation ne demande aucune
compétence de développement (édition YAML/Markdown).

### Fichiers `src/lib` et leurs rôles

- `types.ts` — types partagés. `paths.ts` — chemins content/configs/logs.
- `config.ts` — chargement + validation **zod** de la config (messages FR).
- `content.ts` — chargement sources/fiches/parcours/quiz/gouvernance (avec cache).
- `retrieval.ts` — recherche par mots-clés (racines 6 caractères, `SCORE_MINIMAL=2`).
- `guardrails.ts` — **cœur anti-SIRH** : détection cas individuels, avis
  juridique/médical, formulations proscrites. Point sensible : les regex
  (`CIVILITE_NOM` en casse explicite ; `POSSESSIF_INDIVIDUEL`).
- `answer.ts` — orchestrateur FAQ : garde-fous → recherche → provider → mentions.
  Renvoie `ReponseFAQ` ; re-vérifie le sourçage en sortie (ne fait pas confiance
  au seul modèle).
- `logging.ts` — journal local sobre (métadonnées seules, jamais le contenu ;
  silencieux sous VITEST).
- `model/` — voir §6.

---

## 4. Pages et routes (20 routes, build vérifié)

| Route | Type | Rôle |
|---|---|---|
| `/` | statique | Accueil / présentation du harnais |
| `/parcours` | statique | Parcours de lecture du nouvel arrivant |
| `/fiches` + `/fiches/[slug]` | statique / SSG | Bibliothèque de fiches (6 fiches) |
| `/faq` (+ `FaqClient`) | statique + client | FAQ sourcée (appelle `/api/faq`) |
| `/api/faq` | **dynamique** | POST côté serveur : orchestrateur `answer.ts` |
| `/quiz` (+ `QuizClient`) | statique + client | Quiz d'auto-évaluation |
| `/checklist` | statique | Checklist d'onboarding |
| `/sources` | statique | Registre des sources (dérivé des fichiers) |
| `/sources/adapter` | statique | Guide in-app « Adapter ses sources » |
| `/limites` | statique | Ce que le cadre ne fait pas |
| `/gouvernance` | statique | Gouvernance, classification, validation |
| `/configuration-ia` | **dynamique** (`force-dynamic`) | Diagnostic serveur du fournisseur IA |
| `/_not-found` | statique | 404 |

> `/configuration-ia` et `/api/faq` sont `ƒ` (rendus à la demande côté serveur) :
> normal, ils lisent `process.env`. Tout le reste est prérendu.

---

## 5. Moteur documentaire et garde-fous

**Chaîne de réponse FAQ (`answer.ts`) :** question → garde-fous (`guardrails.ts`)
→ recherche sourcée (`retrieval.ts`) → fournisseur de modèle (`model/`) →
mentions obligatoires. Aucune réponse hors sources.

**Garde-fous vérifiés (tests verts) :**
- **Anti-SIRH** : refus des cas individuels / avis juridique / avis médical.
- **Aucune donnée personnelle réelle** : marquage `fictif` + test qui refuse les
  motifs réalistes (courriels, téléphones, NIR) dans `content/`.
- **Aucun secret** : `.env.example` sans valeur + test de motifs de clés.
- **Sourçage exclusif** : la consigne système impose de ne répondre qu'à partir
  des extraits ; `answer.ts` re-vérifie en sortie (garde-fou non délégué au modèle).
- **Mentions obligatoires** : « ne vaut pas validation juridique », renvoi au
  service RH en cas de doute.

Détail et cas de test : `docs/RECETTE.md` §4 et `tests/guardrails/comportement.yaml`.

---

## 6. Configuration des fournisseurs IA (`src/lib/model/`)

Le fournisseur de modèle est **substituable**, piloté **uniquement par variables
d'environnement** (`MODEL_PROVIDER`), jamais codé en dur ni saisissable via le
navigateur. **Aucune clé n'est jamais saisie ni stockée côté web** (pas de
`localStorage`, pas de cookie, pas de `NEXT_PUBLIC_*`) ; les clés vivent
uniquement dans `.env.local` / l'environnement serveur, sont lues côté serveur,
et ne sont **jamais** renvoyées à une page (PRD §9.2-12).

**Sept modes pris en charge :**

| `MODEL_PROVIDER` | Réseau | Clé | Souveraineté |
|---|---|---|---|
| `local` (défaut) | non | non | maximale — rien ne quitte le poste ; mode démo et tests |
| `none` | non | non | FAQ générative désactivée ; le reste du portail + garde-fous restent actifs |
| `ollama` | oui (URL locale) | non | forte — modèle exécuté chez soi |
| `anthropic` (Claude) | oui | oui | tiers — à instruire avec le DPO |
| `openai` | oui | oui | tiers hors UE par défaut |
| `openrouter` | oui | oui | passerelle multi-modèles (localisation variable) |
| `mistral` | oui | oui | fournisseur européen (reste un tiers) |

**Fichiers clés :**
- `model/catalogue.ts` — **source unique de vérité** : métadonnées publiques de
  chaque fournisseur (identité, besoin de clé, réseau, URL par défaut, note de
  souveraineté, exemple `.env`). Ne lit **aucune** variable d'environnement, ne
  contient **aucun** secret.
- `model/index.ts` — fabrique `getProvider()` pilotée par `MODEL_PROVIDER` :
  `none`→null, `anthropic`→`AnthropicProvider`, `openai|openrouter|mistral|ollama`
  →`OpenAiCompatibleProvider`, défaut→`LocalProvider`.
- `model/local.ts` — fournisseur par défaut, hors ligne, déterministe.
- `model/anthropic.ts` — API Messages (`POST {baseUrl}/v1/messages`), clé via
  `MODEL_API_KEY` **ou** `ANTHROPIC_API_KEY`.
- `model/openai-compatible.ts` — un seul adaptateur pour OpenAI / OpenRouter /
  Mistral / Ollama (`POST {baseUrl}/chat/completions`), timeout 30 s, `temperature 0`.
- `model/diagnostic.ts` — `diagnostiquerConfiguration()` : renvoie un **statut**
  (`hors-ligne` / `pret` / `cle-manquante` / `config-incomplete` / `desactive`) et
  un booléen `clefPresente` — **jamais** la valeur d'une clé. À appeler **côté
  serveur uniquement**.
- `model/types.ts` — interface `ModelProvider` (`composer`, `estDisponible`…).

**Page in-app `/configuration-ia`** (composant serveur) : affiche l'état courant
(statut, pas de clé), le catalogue des 7 modes avec exemple `.env`, et les impacts
RGPD/sécurité/souveraineté.

**Variables `.env` (voir `.env.example`, sans secret) :** `MODEL_PROVIDER`,
`MODEL_DISPLAY_NAME`, `MODEL_API_KEY` (vide dans le dépôt), `MODEL_BASE_URL`,
`MODEL_NAME`, `CDH_CONFIG` (config active, défaut `demo.yml`).

---

## 7. Gestion et adaptation des sources

**Formats en entrée :** Word (DOCX), PDF, LibreOffice, pages intranet — tous
possibles comme **point de départ**. **Format canonique intégré :** Markdown
(`.md`) **relu**, avec frontmatter de métadonnées. Le Markdown est choisi parce
qu'il est lisible sans outil, versionnable, réversible (aucun verrou fournisseur)
et séparé du code.

**Métadonnées d'une source (frontmatter) :** `id` (ex. `SRC-007`, stable),
`titre`, `proprietaire` (**une fonction, jamais une personne**), `date`
(`AAAA-MM-JJ`, sert à détecter l'obsolescence), `statut` (`active`/`perimee`),
`perimetre`, `classification` (**`publique` ou `interne` uniquement en V1**),
`fictif` (`true` en démo).

**Règle non négociable (PRD §9.2) :** aucune donnée personnelle ni sensible ; une
source qui en contient est inéligible en l'état (anonymiser/généraliser ou
renvoyer au DPO). La conversion/OCR **doit être relue intégralement** : une erreur
dans la source devient une erreur dans la réponse. La V1 **ne fournit pas d'OCR
robuste**.

**Outillage :** `scripts/import-source.mjs` amorce le squelette d'une source
depuis un `.md`/`.txt` déjà converti et relu (frontmatter pré-rempli + texte).
Il **ne fait ni conversion PDF, ni OCR, ni contrôle de contenu**. Aide :
`node scripts/import-source.mjs --help`.

**Références :** guide dépôt `docs/adapter-ses-sources.fr.md` ; page in-app
`/sources/adapter`.

---

## 8. Commandes de vérification à relancer

Toutes vertes au 2026-07-19 (résultats connus indiqués) :

```bash
npm install               # OK (Next 15.5.20)
npm test                  # 36/36  (3 fichiers : configuration-ia 18, structure 7, guardrails 11)
npm run build             # OK — 20 routes
npm run validate-harness  # OK — 6 sources, 6 fiches, cohérent
npm run generate-demo     # OK (régénère le contenu de démo)
npm run dev               # http://localhost:3000
```

**Vérification manuelle de la FAQ** (déjà réalisée, résultats connus) :
`npm start` puis POST sur `/api/faq` → réponse sourcée (SRC-003), refus d'un cas
individuel, et « je ne sais pas » quand la source manque.

---

## 9. Pièges connus

- **Chrome / navigateur absent de l'environnement** : la vérification visuelle de
  `/configuration-ia` et `/sources/adapter` n'a pas pu être faite en session
  headless ; à faire dans un environnement avec navigateur. Le build et les tests
  couvrent la logique (composant serveur + tests de non-fuite de clé).
- **Session Claude Code précédente stoppée au *max turns*** (session n°2, limite
  50 tours), puis vérifiée par un opérateur humain. Ne pas supposer qu'une tâche
  interrompue est terminée : relancer build + tests d'abord.
- **Publication GitHub** : vérifier systématiquement `git remote -v` et l'état du
  dépôt distant avant tout nouveau push.
- **Test « registre » sensible au temps** : il compare la date des sources à la
  date du jour (seuil 24 mois). Passe aujourd'hui ; deviendra un signal quand les
  sources fictives (datées 2025) franchiront le seuil. C'est le comportement
  attendu (détection d'obsolescence), pas un bug.
- **`/configuration-ia` en `force-dynamic`** : normal (lecture `process.env`) ; ne
  pas tenter de le prérendre statiquement.
- **Branche `main`** : la branche locale a été alignée sur la convention GitHub
  actuelle avant publication.

---

## 10. Dettes, risques et prochaines sessions

### Dette technique / documentaire
- Passe de **cohérence H3** à finaliser (mêmes intitulés d'étapes partout, liens
  internes, rubrique « ce que ce document ne couvre pas » dans chaque guide).
- **Scénario vidéo (O8)** : vérifier que chaque séquence correspond à un élément
  réel du dépôt ; consigner les écarts.
- Corpus volontairement compact (6 sources) — élargissement possible en V1.2.
- Fournisseurs réseau (`anthropic`, `openai-compatible`) **non testés en appel
  réel** (pas de clé en environnement) : logique et disponibilité testées, l'appel
  HTTP effectif reste à valider par l'exploitant.

### Risques / arbitrages Pascal (aucun ne bloque la poursuite technique)
- Licence finale validée : code en EUPL 1.2 ; contenus/documentation en CC BY-SA 4.0.
- Fournisseur de modèle retenu pour la démo/vidéo.
- Publication GitHub distante initiale demandée par Pascal sur son propre compte ;
  toute publication ultérieure doit rester explicite et vérifiée.
- Logo officiel (emplacement réservé) et noms définitifs.

### Prochaines sessions recommandées
1. **QA / UX** : vérifier visuellement `/configuration-ia` et `/sources/adapter`
   dans un environnement avec navigateur ; passe d'accessibilité.
2. **Cohérence documentaire H3** + scénario vidéo (O8).
3. **Optionnel** : élargir le corpus (V1.2) ; valider un appel réel d'un
   fournisseur réseau si retenu.

---

## 11. Règles à ne pas violer

- Ne **jamais** ajouter de données personnelles réelles (démo, tests, configs).
- Ne **jamais** ajouter de secret, token, clé API, URL sensible ou chaîne de
  connexion ; utiliser `[REDACTED]` si un exemple l'exige.
- **Aucune saisie de clé côté navigateur** : secrets uniquement en `.env.local` /
  environnement serveur.
- Ne **pas** modifier de remote, ne **pas** push sans décision explicite.
- Ne **pas** modifier le périmètre fonctionnel, sauf pour documenter l'existant.
- Ne **pas** renommer le projet.
- Ne **jamais** utiliser l'ancien nom interdit contenant le nom d'un concurrent
  direct ; conserver **Comptoir des Harnais**.
- Conserver le positionnement : **RH documentaire d'onboarding**, pas SIRH, pas
  quasi-SIRH.
- **Modèle `claude-opus-4-8` obligatoire**, aucune substitution silencieuse.
- Respecter la séparation **code (`src/`) / contenu (`content/`, `configs/`)**.

---

## 12. Plan de reprise après clean context

1. Lire `prd/PRD.md`, ce fichier, `docs/RECETTE.md`.
2. Relever l'état réel : `git log --oneline -5`, `git status --short`,
   `git remote -v` (attendu : `origin` sur le dépôt GitHub de Pascal, working
   tree propre hors éventuels artefacts `claude-code-runs/`).
3. Relancer les vérifications (§8) : `npm test` (attendu 36/36),
   `npm run build` (attendu 20 routes), `npm run validate-harness` (attendu OK).
   Si un écart apparaît, le documenter avant toute nouvelle modification.
4. Ne pas repartir de zéro sur ce qui est fait : Lots A–H terminés, configuration
   IA multi-fournisseurs et adaptation des sources livrées (commit `72fa4ff`).
5. Choisir la prochaine session selon §10 (privilégier QA/UX plutôt que nouvelles
   fonctionnalités), en respectant §11.
