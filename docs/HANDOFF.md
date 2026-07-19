# HANDOFF — Comptoir des Harnais

Document de reprise pour une nouvelle session Claude Code. **Lire dans l'ordre :**
`prd/PRD.md` (autorité), ce fichier, puis `docs/RECETTE.md`.

> Modèle demandé : Opus 4.8 (`claude-opus-4-8`). Il était disponible ; aucune
> substitution. Si une future session ne le trouve pas : s'arrêter et le signaler
> (PRD §12.1), ne pas substituer silencieusement.

---

## 1. Objectif global (`/goal`)

Développer la V1 de Comptoir des Harnais conformément au PRD v0.2 : webapp
d'onboarding RH **documentaire**, configurable, sourcée, gouvernée, testée,
sobrement brandée CdS, **sans données personnelles réelles, sans dérive SIRH**,
avec documentation pédagogique et parcours de réplication.

`/loop` : après chaque unité d'œuvre → vérifier conformité PRD, anti-SIRH, absence
de données réelles, séparation contenu/code, UX/UI, accessibilité, sécurité, tests,
build ; documenter ; continuer si les critères sont remplis.

---

## 2. État des lots (A→H)

| Lot | État | Détail |
|---|---|---|
| A — Socle | **terminé** | git init local, config, scripts, README/GLOSSAIRE/architecture rédigés |
| B — App web minimale | **terminé** | 9 rubriques, design CdS, bandeau démo, statut, accessibilité de base |
| C — Contenu onboarding RH | **terminé** | 6 sources, 6 fiches, parcours, quiz, checklist, gouvernance ; templates créés |
| D — UI pédagogique | **terminé** | accueil, parcours, fiches, quiz, pages sources/limites/gouvernance |
| E — Moteur documentaire | **terminé** | interface modèle substituable, recherche sourcée, mentions, journalisation |
| F — Garde-fous | **terminé** | refus cas individuels / juridique / médical ; formulations proscrites |
| G — Tests | **terminé** | 18 tests verts ; runner YAML ; validate-harness |
| H — Doc & scénario | **quasi terminé** | docs pédagogiques + README + templates rédigés ; recette tierce + O1–O8 consignées ; RESTE : passe cohérence H3 fine, scénario vidéo (O8) |

**Critère de session atteint** : `npm install`, `npm test` (18/18), `npm run build`
(19 routes), `npm run dev`/`start` fonctionnent ; app visible et cohérente ; aucune
donnée réelle ni secret ; aucune dérive SIRH.

---

## 3. Fichiers créés (rôles)

**Configuration / socle**
- `package.json` — scripts `dev/build/start/test/validate-harness/generate-demo`.
- `tsconfig.json` — TS strict (`noUncheckedIndexedAccess`, `noUnusedLocals`…).
- `next.config.mjs`, `vitest.config.ts`, `.gitignore`, `.env.example` (sans secret).
- `configs/demo.yml` — config du mode démo (collectivité fictive).
- `configs/organisation.example.yml` — modèle commenté pour une vraie structure.

**Code applicatif (`src/`)** — territoire développeur, ne pas y mettre de contenu métier.
- `src/lib/types.ts` — types partagés.
- `src/lib/paths.ts` — chemins content/configs/logs.
- `src/lib/config.ts` — chargement + validation zod de la config (messages FR).
- `src/lib/content.ts` — chargement sources/fiches/parcours/quiz/gouvernance (caches).
- `src/lib/retrieval.ts` — recherche par mots-clés (racines 6 car., `SCORE_MINIMAL=2`).
- `src/lib/guardrails.ts` — **cœur anti-SIRH** : détection cas individuels, avis
  juridique/médical, formulations proscrites. Point sensible : les regex
  (`CIVILITE_NOM` casse explicite ; `POSSESSIF_INDIVIDUEL`).
- `src/lib/model/{types,local,anthropic,index}.ts` — interface modèle substituable ;
  `local` = défaut hors ligne ; `anthropic` = point de substitution (non câblé en
  V1, volontairement) ; `index` = fabrique via `MODEL_PROVIDER`.
- `src/lib/answer.ts` — orchestrateur FAQ : garde-fous → recherche → provider →
  mentions. Renvoie `ReponseFAQ`.
- `src/lib/logging.ts` — journal local sobre (métadonnées seules, jamais le contenu ;
  silencieux sous VITEST).
- `src/app/*` — pages (accueil, parcours, fiches, fiches/[slug], faq (+FaqClient),
  quiz (+QuizClient), checklist, sources, limites, gouvernance), `layout.tsx`,
  `globals.css`, `api/faq/route.ts` (POST, côté serveur).
- `src/components/*` — `Nav.tsx`, `Badges.tsx`, `Markdown.tsx`.

**Contenu (`content/demo-onboarding-rh/`)** — territoire non-technicien (fictif).
- `sources/SRC-00{1..6}-*.md`, `fiches/*.md`, `parcours/parcours.yml`,
  `quiz/quiz.yml`, `checklist.md`, `gouvernance/{limites-refus,classification,
  fiche-validation,journal}.md`.

**Tests / scripts**
- `tests/guardrails/comportement.yaml` (cas lisibles), `tests/guardrails/behavior.test.ts`,
  `tests/structure/structure.test.ts`, `scripts/validate-harness.mjs`,
  `scripts/generate-demo.mjs`.

**Docs** — `docs/RECETTE.md`, `docs/HANDOFF.md`, `docs/architecture.fr.md`,
`docs/comprendre-les-harnais.fr.md`, `docs/cycle-de-vie.fr.md`,
`docs/gouvernance-rgpd-ai-act.fr.md`, `docs/note-decideur.fr.md`, `README.fr.md`,
`README.md`, `CONTRIBUTING.fr.md`, `GLOSSAIRE.fr.md`, `LICENSE`, `templates/…`.

> Note : au moment d'écrire ce handoff, les fichiers de la ligne « Docs » hors
> RECETTE/HANDOFF/architecture étaient produits par des sous-agents en parallèle.
> **Première action de reprise : vérifier leur présence et relancer build + tests.**

---

## 4. Décisions (voir RECETTE §1 pour le détail)

Next.js 15 + TS strict + Vitest ; fournisseur modèle `local` par défaut (hors
ligne) ; pas de BDD ; licence MIT+CC BY-SA provisoire ; collectivité fictive
« Roche-Vallonne » ; registre dérivé des fichiers sources ; rendu Markdown maison.

---

## 5. Commandes exécutées (résultats)

- `npm install` → OK (Next 15.5.20).
- `npx vitest run` → **18/18**.
- `npx next build` → OK, 19 routes.
- `node scripts/validate-harness.mjs` → OK. `generate-demo` → OK.
- `npx next start` + curl `/api/faq` → sourcée (SRC-003) / refus / je-ne-sais-pas.

---

## 6. État tests et build

Vert. Aucun test instable. Tests de comportement critiques exécutés 3× (stables).
Point de vigilance : le test « registre » compare les dates de sources à la date du
jour (seuil 24 mois) — passe aujourd'hui ; deviendra un signal si les sources
fictives (datées 2025) dépassent le seuil dans le futur. C'est le comportement
attendu (détection d'obsolescence).

---

## 7. Garde-fous vérifiés

Anti-SIRH (refus testés), aucune donnée réelle (marquage + test), aucun secret
(.env.example vide + test motifs), sourçage exclusif, mentions obligatoires,
« ne vaut pas validation juridique ». Voir RECETTE §4.

---

## 8. Dette

- Recette d'adaptation à une **2ᵉ collectivité fictive** non encore réalisée (§10.4).
- Vérification **O1–O8** non encore consignée point par point.
- Passe de **cohérence H3** (liens internes, rubriques « ne couvre pas ») à finaliser
  après retour des docs.
- Corpus volontairement compact (6 sources) — élargissement possible (V1.2).
- FAQ générative externe : `anthropic.ts` laissé non câblé (intégration documentée).

---

## 9. Risques / arbitrages Pascal

Licence finale ; fournisseur de modèle pour la vidéo ; publication GitHub distante
(non faite) ; logo officiel (emplacement réservé) ; noms définitifs. Aucun ne bloque
la poursuite technique.

---

## 10. Prochaines actions (ordre + critères de vérification)

1. **Vérifier les livrables des sous-agents** : `ls README.fr.md README.md
   CONTRIBUTING.fr.md GLOSSAIRE.fr.md LICENSE docs/*.fr.md templates/**` puis
   `npm run build && npm test`. *Critère : présents, build+tests verts.*
2. **Contrôle anti-jargon / anti-SIRH sur les nouveaux docs** : `grep -rniE
   'LLM|RAG|fine-tuning|embedding|SIRH' docs README*.md GLOSSAIRE.fr.md` — chaque
   occurrence doit être définie/encadrée ou retirée. *Critère : aucune occurrence
   non maîtrisée.*
3. ~~Recette d'adaptation tierce (§10.4)~~ — **FAIT** (voir RECETTE §5).
4. ~~Consigner O1–O8~~ — **FAIT** (voir RECETTE §6 ; O8 partiel).
5. ~~Premier commit atomique local~~ — **FAIT** (commit `1508107`, 108 fichiers).
6. **Passe de cohérence H3** : mêmes intitulés d'étapes partout, liens internes,
   rubrique « ce que ce document ne couvre pas » présente dans chaque guide
   (revue croisée à finaliser).
7. **Scénario vidéo** (§13) : vérifier que chaque séquence correspond à un élément
   réel du dépôt ; noter les écarts (O8).
8. **Optionnel** : élargir le corpus (V1.2) ; câbler un fournisseur externe dans
   `src/lib/model/anthropic.ts` si retenu pour la vidéo.

---

## 11. Mise à jour session n°2 — configuration IA et sources

Session Opus 4.8 n°2 réalisée partiellement jusqu'à `max turns (50)`, puis vérifiée par Hermes.

### Ajouts réalisés

- Page `/configuration-ia` : diagnostic côté serveur du fournisseur courant, statut sans exposition de clé, explications RGPD/souveraineté.
- Fournisseurs pris en charge dans le catalogue : `local`, `none`, `anthropic`, `openai`, `openrouter`, `mistral`, `ollama`.
- `.env.example` enrichi : `MODEL_PROVIDER`, `MODEL_DISPLAY_NAME`, `MODEL_API_KEY`, `MODEL_BASE_URL`, `MODEL_NAME`, `CDH_CONFIG`.
- Adapters : `src/lib/model/openai-compatible.ts`, `catalogue.ts`, `diagnostic.ts`, mise à jour `index.ts` et `anthropic.ts`.
- Guide `docs/adapter-ses-sources.fr.md` et page `/sources/adapter` : Word/PDF/LibreOffice possibles en entrée, mais Markdown/texte relu comme format canonique intégré.
- Script `scripts/import-source.mjs` pour amorcer une source depuis `.md` ou `.txt`, sans OCR/PDF robuste.
- Tests de configuration IA : `tests/structure/configuration-ia.test.ts`.

### Vérification post-session

- `npm test` → **36/36 tests passés**.
- `npm run build` → **OK**, 20 routes, dont `/configuration-ia` et `/sources/adapter`.

### Point de reprise

Si une prochaine session reprend ici :

1. lire `prd/PRD.md`, `docs/HANDOFF.md`, `docs/RECETTE.md` ;
2. vérifier visuellement `/configuration-ia` et `/sources/adapter` avec navigateur disponible ;
3. envisager une session de QA UX/vidéo plutôt que nouvelles fonctionnalités ;
4. ne pas ajouter de saisie directe de clés API côté navigateur : secrets uniquement `.env.local` / serveur.
