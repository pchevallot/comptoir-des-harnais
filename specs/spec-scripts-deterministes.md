# Spec — Scripts déterministes

Les scripts sont la colonne vertébrale reproductible de la fabrique : même
entrée → même sortie, exécutables seuls, rapport en français, codes de sortie
exploitables. **Rien de ce qu'un script garantit n'est délégué au modèle.**

Ils sont le **moteur vérifiable de l'atelier web** : les handlers
`/api/fabrique/*` appellent les mêmes fonctions, exposées par
`scripts/lib/atelier/*.mjs` (§0). Le CLI reste disponible pour développeurs,
OPSN et CI — c'est une interface alternative sur la même logique, pas
l'expérience principale.

Conventions communes :

- Node ≥ 20, ESM (`.mjs`), dépendances limitées à celles du projet
  (`js-yaml`, `gray-matter`) + `node:readline` pour l'interactif ;
- `--help` sur chacun ; `--cas <slug>` sélectionne le cas (défaut : champ
  `cas` de la config active, sinon `onboarding-agents`) ;
- codes de sortie : `0` OK, `1` erreur bloquante de validation, `2` mauvaise
  invocation (argument invalide, fichier introuvable) ;
- aucun script ne lit ni n'écrit de valeur de secret ; aucun accès réseau ;
- écriture YAML via `js-yaml.dump`, jamais par concaténation ;
- sortie machine optionnelle : `--json` imprime un objet
  `{ ok, erreurs: [], avertissements: [] }` sur stdout (pour l'orchestrateur
  et les tests).

Scripts npm à ajouter dans `package.json` :

```json
"interview": "node scripts/interview-harness.mjs",
"scaffold": "node scripts/scaffold-harness.mjs",
"validate-corpus": "node scripts/validate-corpus.mjs",
"validate-guardrails": "node scripts/validate-guardrails.mjs",
"validate-provider": "node scripts/validate-provider-config.mjs",
"rapport": "node scripts/build-harness-report.mjs",
"generate-demo": "node scripts/generate-onboarding-demo.mjs"
```

---

## 0. `scripts/lib/atelier/` — la logique partagée du parcours

**Rôle.** Porter la logique des 15 étapes **une seule fois**, sous forme de
fonctions à effets confinés au workspace, consommées par trois clients :
les handlers `/api/fabrique/*` (l'atelier web, expérience principale),
l'interview CLI (§1) et les tests.

**Modules.**

- `etapes.mjs` — définition déclarative des 15 étapes : id, libellé
  (verbatim PRD v0.3 §4), skill associée, questions (texte, type de réponse,
  valeur proposée), validations de forme, fichiers produits. C'est la source
  unique reprise par l'atelier, le CLI et la page de progression ;
- `reponses.mjs` — validation d'une réponse (dates `AAAA-MM-JJ`, heuristique
  anti-« Prénom Nom », slug `[a-z0-9-]+`, minimums exigés comme les 3 refus
  de l'étape 8) et application au manifeste et aux fichiers du cas (via
  `scripts/lib/manifeste.mjs`) ;
- `actions.mjs` — exécution des actions déterministes d'une étape
  (scaffold, validations, rapport) en appelant les fonctions des scripts
  correspondants, avec retour structuré
  `{ ok, erreurs, avertissements, fichiers }`.

**Règles.** Aucune lecture ni écriture de secret ; aucune E/S hors du
workspace du dépôt ; aucune dépendance à un TTY ; mêmes messages français
que les scripts ; le refus d'éligibilité (étape 1) est un résultat normal,
pas une exception. Chaque script CLI ci-dessous est une **enveloppe mince**
(arguments + affichage) autour de ces fonctions : aucune logique d'étape ni
de validation n'est dupliquée dans un script ou un handler.

## 1. `scripts/interview-harness.mjs` — le mode CLI du parcours

**Rôle.** Conduire les 15 étapes du parcours (PRD v0.3 §4) en questions/
réponses au terminal, et matérialiser chaque réponse en fichiers.
**Mode alternatif** à l'atelier web `/fabrique`, à logique strictement
identique (`scripts/lib/atelier/`) ; publics : développeurs, OPSN, CI
(mode `--demo`).

**CLI.**
```text
npm run interview                        # nouveau cas ou reprise du cas en cours
npm run interview -- --cas onboarding-agents --etape 8   # reprendre à l'étape 8
npm run interview -- --demo              # déroule avec les réponses du cas démo (non interactif)
```

**Entrées.** Réponses au clavier ; `templates/cases/documentaire/` ;
manifeste existant si reprise.

**Sorties.** `cases/<slug>/harnais.yaml` (mis à jour à chaque étape franchie),
`gouvernance/fiche-besoin.md`, `gouvernance/classification.md`,
`gouvernance/limites-refus.md`, `configs/<slug>.yml`,
`cases/<slug>/tests/comportement.yaml`.

**Comportements exigés.**
- une question à la fois, valeur par défaut affichée entre crochets, `Entrée`
  = accepter ; récapitulatif et confirmation `o/N` à chaque fin d'étape ;
- reprise : à l'ouverture, si `etat.etape < 15`, proposer « reprendre à
  l'étape N+1 ? » ;
- refus d'éligibilité (étape 1 : cas individuels) → message explicite, écrit
  `etat.etape: 1` et sort en code 0 (ce n'est pas une erreur, c'est le cadre
  qui fonctionne) ;
- validation de forme immédiate : dates `AAAA-MM-JJ`, fonctions ≠ noms de
  personnes (heuristique : deux mots capitalisés consécutifs → redemander),
  slug `[a-z0-9-]+` ;
- étapes 10, 13, 14, 15 : l'interview n'exécute pas elle-même — elle affiche
  la commande exacte à lancer (`npm run scaffold -- --cas <slug>`…), pour que
  chaque action reste explicite et scriptable (dans l'atelier web, ces mêmes
  actions sont déclenchées par le bouton valider/générer via l'API) ;
- mode `--demo` : réponses lues depuis
  `templates/cases/documentaire/reponses-demo.yaml` — c'est ce qui rend
  l'interview **testable en CI** sans TTY.

**Déterministe / non déterministe.** Tout est déterministe : questions fixes,
ordre fixe, fichiers générés depuis gabarits. Le modèle n'intervient pas. (La
reformulation « jolie » d'une fiche besoin est un usage d'atelier optionnel
via skill, jamais dans ce script.)

## 2. `scripts/scaffold-harness.mjs` — la génération de structure

**Rôle.** Matérialiser l'arborescence complète d'un cas depuis
`templates/cases/documentaire/`, pré-remplie avec le manifeste.

**CLI.**
```text
npm run scaffold -- --cas mon-cas             # génère cases/mon-cas + content/cases/mon-cas
npm run scaffold -- --cas mon-cas --force     # réécrit aussi les fichiers non modifiés
npm run scaffold -- --cas mon-cas --dry-run   # liste ce qui serait créé, ne crée rien
```

**Entrées.** `cases/<slug>/harnais.yaml` (obligatoire — sinon code 2 avec
« lancez d'abord npm run interview ») ; gabarits.

**Sorties.** Arborescence §2 de l'architecture ; substitution de variables
`{{slug}}`, `{{besoin}}`, `{{organisation.nom}}`… dans les gabarits ;
rapport : liste `créé / conservé / ignoré (déjà modifié)`.

**Comportements exigés.**
- **idempotent et non destructif** : un fichier existant différent du gabarit
  n'est jamais écrasé sans `--force` ; avec `--force`, l'ancien est copié en
  `.bak` horodaté par le nom (`<fichier>.avant-force.bak`) ;
- refuse un slug qui écraserait `onboarding-agents` sans `--force` ;
- sort en 0 avec le décompte des fichiers créés.

## 3. `scripts/validate-corpus.mjs` — le contrôle du corpus

**Rôle.** Garantir que chaque source du cas est conforme, sans jugement de
fond (le fond relève de la relecture humaine).

**CLI.** `npm run validate-corpus -- --cas onboarding-agents [--json]`

**Contrôles (tous déterministes, bloquants sauf mention).**
1. frontmatter complet : `id`, `titre`, `proprietaire`, `date`, `statut`,
   `perimetre`, `classification`, `fictif` ;
2. `id` unique, format `SRC-\d{3}` ; nom de fichier commençant par l'id ;
3. `classification` ∈ {publique, interne} ; `fictif: true` obligatoire si
   `organisation.fictive: true` dans la config ;
4. longueur : corps < 400 mots → avertissement « source maigre » (le corpus
   cible vise 700–1 800 mots, voir spec corpus) ; < 120 mots → erreur ;
5. motifs interdits (mêmes regex que `tests/structure/` — factorisées dans
   `scripts/lib/motifs-interdits.mjs`, nouveau module partagé) : courriel
   plausible non `exemple.fr`, numéro de téléphone, NIR, IBAN, motif de clé
   d'API ;
6. cohérence avec le manifeste : chaque entrée de `sources_declarees` a une
   source importée correspondante (avertissement sinon), et inversement toute
   source du dossier est déclarée (avertissement) ;
7. fiches : chaque fiche cite ≥ 1 source existante ; champ `limites` présent ;
8. `--template` (optionnel) : compare l'arborescence du cas au gabarit,
   avertissement en cas de divergence.

**Sorties.** Rapport français : `N sources contrôlées, E erreurs,
A avertissements`, chaque message préfixé du fichier fautif.

## 4. `scripts/validate-guardrails.mjs` — le contrôle de couverture des refus

**Rôle.** Vérifier la **triple cohérence** : ce qui est déclaré
(`harnais.yaml` : refus), ce qui est affiché
(`gouvernance/limites-refus.md`), ce qui est testé
(`tests/comportement.yaml`). C'est le contrôle que personne ne fait à la main.

**CLI.** `npm run validate-guardrails -- --cas onboarding-agents [--json]`

**Contrôles.**
1. socle minimal testé : ≥ 3 cas de refus type `comportement` avec
   `attendu.refuse: true`, dont ≥ 1 nominatif fictif et ≥ 1 possessif
   individuel (« ma rémunération ») ; ≥ 1 cas avis juridique ;
2. chaque `refus_complementaires[].motif` du manifeste a au moins un cas de
   test dont l'`id` ou un champ `couvre:` le référence — sinon erreur
   « refus déclaré non testé » ;
3. chaque refus testé apparaît (par mot-clé du motif) dans
   `limites-refus.md` — sinon erreur « refus testé non affiché » ;
4. ≥ 5 cas sourcés (`doit_citer_source`) pointant vers des `SRC-` existants ;
5. ≥ 1 cas hors-corpus (« je ne sais pas » attendu) ;
6. les renvois (`renvoi_contient`) désignent des fonctions, pas des personnes.

**Note d'implémentation.** Ce script lit les YAML, il n'exécute pas le moteur
(c'est le rôle de `npm test`). Il valide la couverture, pas le comportement.

## 5. `scripts/validate-provider-config.mjs` — le contrôle de configuration IA

**Rôle.** Diagnostiquer la configuration IA depuis l'environnement, sans
jamais afficher une valeur de secret.

**CLI.**
```text
npm run validate-provider                 # lit .env.local + environnement
npm run validate-provider -- --attendu ollama   # erreur si le mode actif diffère
```

**Contrôles.** Réutilise `diagnostiquerConfiguration()` de
`src/lib/model/diagnostic.ts` (import direct ; si l'import TS pose problème en
`.mjs`, extraire la logique dans `scripts/lib/diagnostic-env.mjs` partagé —
décision au Lot 3). Affiche : mode actif, statut (`hors-ligne` / `pret` /
`cle-manquante` / `config-incomplete` / `desactive`), clé présente **oui/non
seulement**, URL de base (autorisée à l'affichage : ce n'est pas un secret),
et les implications (réseau, sous-traitance) reprises du catalogue.
Codes : `0` si `pret` ou `hors-ligne` ou `desactive` (états sains), `1` si
`cle-manquante` / `config-incomplete` ou si `--attendu` diffère.

## 6. `scripts/build-harness-report.mjs` — le rapport de gouvernance

**Rôle.** Produire le document remis au DPO/DSI/DGS : l'état complet et daté
du harnais.

**CLI.** `npm run rapport -- --cas onboarding-agents [--sortie <chemin>]`

**Entrées.** Manifeste, config, corpus (frontmatters), `limites-refus.md`,
résultats `--json` des trois validateurs (le script les exécute lui-même).

**Sortie.** `cases/<slug>/rapport-gouvernance.md` :
en-tête (organisation, harnais, statut, date de génération — la date vient de
l'horloge, c'est la seule non-reproductibilité admise et elle est confinée à
l'en-tête) ; registre des sources (tableau id/titre/propriétaire/date/statut/
classification) ; refus et renvois ; mode IA et implications ; synthèse des
validations (OK/écarts, reprise verbatim des messages) ; mention obligatoire
« ne vaut pas validation juridique » ; rappel des trois statuts et du statut
courant. Code `0` même s'il y a des écarts (le rapport les documente) ; `1`
seulement si une entrée est illisible.

## 7. `scripts/generate-onboarding-demo.mjs` — la régénération du cas démo

**Rôle.** (Ré)générer intégralement le cas `onboarding-agents` de
démonstration : les 16 sources, fiches, parcours, quiz, gouvernance, manifeste
— conformes à `specs/spec-corpus-onboarding.md`. Remplace
`generate-demo.mjs` (supprimé au Lot 4).

**CLI.**
```text
npm run generate-demo                    # vérifie : écarts entre disque et référence
npm run generate-demo -- --ecrire        # (ré)écrit les fichiers du cas démo
```

**Conception.** Le contenu de référence vit dans
`scripts/demo/onboarding-agents/` (fichiers sources complets, versionnés) ; le
script copie/vérifie, il ne « rédige » rien à l'exécution. Arbitrage : du
contenu long ne se génère pas par concaténation de chaînes dans du JS — on
versionne le contenu, le script garantit l'intégrité (mode vérification =
comparaison octet à octet, écarts listés fichier par fichier).

## 8. Évolution de `scripts/validate-harness.mjs` — l'orchestrateur

**Rôle nouveau.** Enchaîner : lecture du manifeste (schéma zod partagé) →
`validate-corpus` → `validate-guardrails` → `validate-provider-config`
(non bloquant : un poste sans `.env.local` reste sain) → contrôles propres
(config complète, statut valide, cohérence `configs/<x>.yml.cas` ↔ dossiers).

**CLI.** `npm run validate-harness [-- --cas <slug>] [--json]` — signature
actuelle conservée (sans argument = cas de la config active, comme
aujourd'hui).

**Sortie.** Rapport agrégé façon actuelle (conservée : Configuration /
Sources / Fiches / Statut) enrichi de trois lignes de synthèse par
sous-validateur. Code `1` si au moins une erreur bloquante n'importe où.

**Migration.** Les contrôles actuels (frontmatters, fiches→sources,
gouvernance présente) partent dans `validate-corpus` ; ce fichier ne garde que
l'orchestration et les contrôles de config/manifeste. Les chemins codés en dur
(`content/demo-onboarding-rh`) disparaissent au profit de `--cas`.

---

## Récapitulatif : ce qui est déterministe, ce qui ne l'est jamais

| Garanti par script (jamais par le modèle) | Laissé à l'humain (jamais au script) | Confié au modèle (encadré) |
|---|---|---|
| Structure des dossiers et fichiers | Relecture du fond des sources | Composer une réponse FAQ à partir des extraits |
| Frontmatters, ids, classifications | Décision de passage de statut | Aider à reformuler en atelier (via skill) |
| Couverture refus déclarés/testés/affichés | Validation DPO/DSI | — |
| Absence de motifs de secrets/PII | Choix du fournisseur IA | — |
| Rapport de gouvernance | Signature de la fiche de validation | — |
