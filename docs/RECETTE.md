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
| D3 | **Licence : MIT (code) + CC BY-SA 4.0 (contenu), PROVISOIRE** | Défaut proposé par le PRD ; ne bloque pas le développement | Oui — décision finale (arbitrage n°2) |
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
3. Création/publication d'un dépôt GitHub distant — **non faite** (interdit sans
   instruction).
4. Logo officiel — **non intégré** ; emplacement réservé dans l'en-tête.
5. Nom définitif du projet et de la collectivité fictive (vérif. de collision).
