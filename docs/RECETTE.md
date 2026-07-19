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

## 5. Dette et suites (à traiter avant clôture V1)

Voir `docs/HANDOFF.md` §« Prochaines actions » pour la liste ordonnée. Points
saillants :

1. **Recette d'adaptation tierce (§10.4)** : réaliser une fois le remplacement des
   sources/config par une 2ᵉ collectivité fictive sans toucher au code, et le
   consigner.
2. **Vérification O1–O8 une à une** (§2.1) à consigner.
3. **Passe de cohérence H3** : liens internes, mêmes numéros d'étapes partout,
   rubriques « ce que ce document ne couvre pas » dans chaque guide.
4. **Scénario vidéo** (§13) à aligner sur le dépôt réel.
5. **Élargissement possible du corpus** (plus de sources/fiches) et robustesse aux
   reformulations (V1.2).

---

## 6. Risques / arbitrages humains requis (Pascal)

1. Licence finale (D3).
2. Fournisseur de modèle pour la démonstration vidéo (D2).
3. Création/publication d'un dépôt GitHub distant — **non faite** (interdit sans
   instruction).
4. Logo officiel — **non intégré** ; emplacement réservé dans l'en-tête.
5. Nom définitif du projet et de la collectivité fictive (vérif. de collision).
