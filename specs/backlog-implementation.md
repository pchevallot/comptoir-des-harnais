# Backlog d'implémentation — refonte « harnais-fabrique »

Plan d'exécution de la refonte spécifiée dans `specs/` (PRD v0.3, architecture,
skills, scripts, corpus, vidéo), découpé en **9 lots (0 à 8)** destinés à des
sessions **Claude Code Opus 4.8**. Rédigé le 2026-07-19 (session Fable 5).

Ce document est fait pour qu'une session d'implémentation **n'ait rien à
redemander** : chaque lot dit quoi lire, quoi produire, comment vérifier, quoi
ne pas faire. En cas de conflit apparent entre ce backlog et une spec de
détail, la spec de détail prime (`spec-scripts-deterministes.md` pour les
scripts, `spec-corpus-onboarding.md` pour le corpus, etc.) ; ce backlog prime
sur l'ordre et le découpage.

## Règles valables pour tous les lots

1. **Branche `refonte-fabrique` uniquement.** Aucun commit sur `main`.
   Commits atomiques par lot (ou par demi-lot), messages en français, préfixe
   conventionnel (`feat:`, `refactor:`, `docs:`, `test:`, `chore:`).
   **Aucun push** sans demande explicite de Pascal.
2. **Interdits absolus** (repris de `docs/HANDOFF.md` §11) : aucune donnée
   personnelle réelle ; aucun secret ni motif de clé ; aucune saisie de clé
   côté navigateur ; aucune mention de projet concurrent ni de l'ancien nom
   écarté ; positionnement « onboarding documentaire, pas SIRH » inchangé ;
   français partout.
3. **Fin de chaque lot** : `npm test`, `npm run build`,
   `npm run validate-harness` doivent passer (sauf mention explicite d'un état
   intermédiaire admis dans le lot), et le journal du lot est consigné dans
   `docs/RECETTE.md` (une section par lot : date, commandes, résultats, écarts).
4. **Aucune régénération destructive** : on migre l'existant (`git mv`), on ne
   régénère pas ce qui est déjà validé. `generate-onboarding-demo --ecrire`
   n'est utilisé qu'au Lot 4, une fois son contenu de référence relu.
5. **Toute écriture YAML passe par `js-yaml.dump`** ; toute lecture de
   frontmatter par `gray-matter`. Jamais de concaténation de chaînes pour
   produire du YAML.
6. Les regex de `src/lib/guardrails.ts` et les mentions obligatoires ne sont
   modifiées par **aucun** lot (invariant, architecture §6).

---

## Lot 0 — Sauvegarde, branche, état de référence

### Objectif

Geler un état de référence vérifiable avant toute modification, ouvrir la
branche de refonte, et poser les documents de suivi de migration. À la fin du
lot, on sait exactement d'où l'on part et on peut y revenir.

### Fichiers à créer / modifier

- créer : `CHANGELOG.md` (s'il n'existe pas) avec une entrée « refonte
  fabrique — en cours » et l'avis de renommage à venir
  (`demo-onboarding-rh` → `onboarding-agents`, sans couche de compatibilité) ;
- créer : `docs/RECETTE.md` — nouvelle section « Recette de la refonte
  fabrique » avec le relevé de l'état de référence ;
- aucun fichier de `src/`, `content/`, `configs/`, `tests/`, `scripts/` n'est
  modifié dans ce lot.

### Tâches atomiques

1. Relever l'état réel : `git log --oneline -5`, `git status --short`,
   `git remote -v`. Consigner le SHA de départ dans `docs/RECETTE.md`.
2. Traiter les fichiers non suivis : les artefacts `claude-code-runs/*` et
   `specs/` doivent être commités sur `main` **ou** explicitement laissés non
   suivis — décision consignée. (Recommandation : commiter `specs/` sur `main`
   avant de brancher, pour que la branche de refonte contienne ses propres
   specs ; les logs `claude-code-runs/` restent non suivis ou sont commités en
   un commit `chore:` séparé.)
3. Créer un tag local `avant-refonte-fabrique` sur le dernier commit de `main`.
4. Créer la branche : `git switch -c refonte-fabrique`.
5. Exécuter et consigner les résultats de référence : `npm test` (attendu
   36/36), `npm run build` (attendu 20 routes), `npm run validate-harness`
   (attendu OK, 6 sources, 6 fiches), versions Node/npm/Next.
6. Écrire l'entrée `CHANGELOG.md` (renommage annoncé, périmètre de la refonte,
   lien vers `specs/README.md`).

### Critères d'acceptation

- [ ] branche `refonte-fabrique` active, tag `avant-refonte-fabrique` posé ;
- [ ] état de référence consigné dans `docs/RECETTE.md` avec les chiffres
      réels constatés (pas les chiffres « attendus » recopiés) ;
- [ ] `CHANGELOG.md` existe et annonce le renommage ;
- [ ] aucun écart non documenté entre l'état constaté et l'état attendu du
      HANDOFF §8 (si écart : le documenter et s'arrêter pour signalement).

### Commandes de vérification

```bash
git branch --show-current          # refonte-fabrique
git tag --list 'avant-*'           # avant-refonte-fabrique
npm test && npm run build && npm run validate-harness
```

### Risques

- Partir d'un état déjà divergent (tests rouges, fichiers modifiés non
  compris) : dans ce cas, **s'arrêter et signaler**, ne pas « réparer » avant
  d'avoir compris.

### Non-objectifs

- Aucun renommage, aucun déplacement de fichier, aucune modification de code.

### Dépendances

- Aucune. Ce lot conditionne tous les autres.

### Livrable démontrable en vidéo

Non applicable (lot d'infrastructure).

---

## Lot 1 — Architecture fabrique : `cases/`, `content/cases/`, manifeste, `/fabrique`

### Objectif

Faire exister l'arborescence cible (architecture §2) avec le cas renommé
`onboarding-agents`, son manifeste `harnais.yaml` rétro-rempli, les points de
couplage du code mis à jour, et la **première version du tableau de bord de
l'atelier `/fabrique`** — minimale mais déjà orientée interface : c'est le
socle sur lequel les Lots 5a/5b brancheront les étapes guidées et l'API. À la
fin du lot, l'application fonctionne exactement comme avant, sur la nouvelle
arborescence, plus la route `/fabrique`.

### Fichiers à créer / modifier

**Déplacements (`git mv`, jamais copie) :**

- `content/demo-onboarding-rh/` → `content/cases/onboarding-agents/` ;
- `content/cases/onboarding-agents/gouvernance/` →
  `cases/onboarding-agents/gouvernance/` (la gouvernance quitte le contenu) ;
- `tests/guardrails/comportement.yaml` →
  `cases/onboarding-agents/tests/comportement.yaml` ;
- `templates/onboarding-rh-documentaire/` → `templates/cases/documentaire/`
  (généralisation des intitulés dans les gabarits : remplacer les libellés
  spécifiques RH par des variables `{{...}}` ; structure miroir de
  `cases/<slug>/` + `content/cases/<slug>/`).

**Créations :**

- `cases/onboarding-agents/harnais.yaml` — écrit **à la main**, conforme au
  schéma de l'architecture §3, rétro-rempli depuis l'existant : `besoin`
  reformulé depuis `configs/demo.yml`, `sources_declarees` depuis les 6
  frontmatters actuels, `refus_complementaires` depuis la page limites
  actuelle, `fournisseur.mode: local`, `etat.etape: 15`,
  `etat.statut: prototype`, `modules` tous à `true` ;
- `src/lib/manifest.ts` — chargement + validation zod du manifeste, messages
  d'erreur en français, cache calqué sur `content.ts` ; exporte le type
  `Manifeste` et `chargerManifeste(slug)` ;
- `src/app/fabrique/page.tsx` — tableau de bord de l'atelier, version
  minimale : titre, le cas `onboarding-agents` avec les 15 étapes du parcours
  (libellés du PRD v0.3 §4), l'état courant (`etat.etape`), le statut, et un
  lien par preuve existante (`/sources`, `/gouvernance`, `/limites`,
  `/configuration-ia`). **Rendu dynamique** (état lu à la requête, pas figé
  au build) pour que les Lots 5a/5b y branchent les actions sans changer de
  modèle de rendu. Les sous-routes (`/fabrique/nouveau`, `/fabrique/[slug]`,
  étapes, rapport) et l'API arrivent aux Lots 5a/5b.

**Modifications :**

- `src/lib/paths.ts` : chemin contenu = `content/cases/<cas>`, chemin
  gouvernance = `cases/<cas>/gouvernance/`, où `<cas>` vient du champ `cas` de
  la config active (défaut `onboarding-agents`) ;
- `src/lib/config.ts` : champ optionnel `cas` (zod, défaut
  `onboarding-agents`, format `[a-z0-9-]+`) ;
- `configs/demo.yml` et `configs/organisation.example.yml` : ajout du champ
  `cas: onboarding-agents` (commenté dans l'example) ;
- `scripts/validate-harness.mjs` : suppression du chemin codé en dur
  (ligne `CONTENT`, cf. architecture §1) au profit de la résolution par
  config/`--cas` (refonte complète du script au Lot 3 — ici, uniquement le
  minimum pour qu'il repasse au vert) ;
- `scripts/import-source.mjs` : valeur par défaut de `--out` mise à jour ;
- `tests/structure/structure.test.ts` : chemins mis à jour ;
- `tests/guardrails/behavior.test.ts` (runner) : lit
  `cases/<cas>/tests/comportement.yaml` via la config active ;
- `src/components/Nav.tsx` : entrée `/fabrique` ajoutée (le pilotage par
  `modules` attend le Lot 5).

### Tâches atomiques

1. Déplacements `git mv` dans l'ordre ci-dessus, un commit par déplacement
   cohérent (l'application peut être temporairement rouge entre les étapes de
   ce lot, jamais en fin de lot).
2. Écrire `cases/onboarding-agents/harnais.yaml` (à la main, relu).
3. Créer `src/lib/manifest.ts` + schéma zod (miroir exact du format
   architecture §3 : toute clé inconnue = erreur explicite en français).
4. Mettre à jour `paths.ts`, `config.ts`, les deux configs.
5. Mettre à jour les scripts et tests listés (minimum vital).
6. Créer `/fabrique` (version minimale) + entrée de navigation.
7. Vérifier le build : **21 routes attendues** (20 + `/fabrique`).
8. Consigner le lot dans `docs/RECETTE.md`.

### Critères d'acceptation

- [ ] `content/demo-onboarding-rh/` n'existe plus ; aucun fichier du dépôt
      (hors `claude-code-runs/`, historique git et CHANGELOG) ne contient la
      chaîne `demo-onboarding-rh` — vérifié par grep ;
- [ ] `cases/onboarding-agents/harnais.yaml` valide au sens de
      `src/lib/manifest.ts` ;
- [ ] `npm test` vert (36/36, chemins ajustés — aucun test supprimé) ;
- [ ] `npm run build` : 21 routes, `/fabrique` rendue dynamiquement ;
- [ ] `npm run validate-harness` vert sur la nouvelle arborescence ;
- [ ] l'application rend exactement les mêmes contenus qu'avant (mêmes 6
      sources sur `/sources`, même FAQ) ;
- [ ] `/fabrique` affiche `etat.etape: 15` et `statut: prototype` lus depuis
      le manifeste réel, sans valeur codée en dur.

### Commandes de vérification

```bash
grep -rn "demo-onboarding-rh" --exclude-dir=node_modules --exclude-dir=.git \
  --exclude-dir=claude-code-runs --exclude=CHANGELOG.md . ; echo "attendu: aucun résultat"
npm test && npm run build && npm run validate-harness
npm run dev &   # puis vérifier /, /sources, /faq, /fabrique sur :3010
```

### Risques

- Oublier un chemin codé en dur (les 4 points d'ancrage de l'architecture §1
  sont la liste de contrôle ; le grep ci-dessus est le filet) ;
- casser le cache de `content.ts` en changeant les chemins (vérifier que le
  cache est indexé par cas) ;
- rétro-remplir le manifeste avec des valeurs inventées : chaque champ doit
  être traçable à un fichier existant.

### Non-objectifs

- Pas de nouveau script (Lot 3), pas de nouvelle source (Lot 4), pas d'API
  locale ni de sous-routes d'atelier (Lots 5a/5b), pas de bandeau d'accueil
  ni de navigation par modules (Lot 5b), pas de couche de compatibilité
  (décision d'architecture §5 : migration en une fois).

### Dépendances

- Requiert Lot 0. Conditionne tous les lots suivants.

### Livrable démontrable en vidéo

`/fabrique` (les 15 étapes, l'état du manifeste) — préfiguration du tableau
de bord du plan 2 du scénario vidéo.

---

## Lot 2 — Skills locales (`skills/<nom>/SKILL.md`)

### Objectif

Créer les 8 skills de `specs/spec-skills.md`, en **extrayant** les procédures
des guides existants (`docs/cycle-de-vie.fr.md`, `docs/adapter-ses-sources.fr.md`,
PRD v0.2), pas en les réinventant. Chaque skill est lisible par un humain et
activable par un agent (Claude Code charge `skills/` comme skills projet).

### Fichiers à créer / modifier

Créer les 8 dossiers/fichiers :

| Skill | Étapes du parcours |
|---|---|
| `skills/cadrer-besoin-public/SKILL.md` | 1, 2, 3, 6 |
| `skills/classifier-sources/SKILL.md` | 4, 5 |
| `skills/concevoir-garde-fous/SKILL.md` | 7, 8 |
| `skills/configurer-fournisseur-ia/SKILL.md` | 9 |
| `skills/adapter-corpus-onboarding/SKILL.md` | 11 |
| `skills/generer-tests-harnais/SKILL.md` | 13 |
| `skills/verifier-securite-rgpd/SKILL.md` | 15 |
| `skills/preparer-demo-video/SKILL.md` | hors parcours (après 15) |

Modifier : `docs/cycle-de-vie.fr.md` et `docs/adapter-ses-sources.fr.md`
gagnent chacun un renvoi vers la skill opérationnelle correspondante (une
ligne, pas de duplication de contenu).

### Tâches atomiques

1. Pour chaque skill : frontmatter conforme au format commun (spec-skills §1 :
   `name`, `description`, `etapes_parcours`, `scripts_associes`,
   `fichiers_produits`) puis les 5 sections obligatoires (« Quand l'activer »,
   « Ce que je demande », « Ce que je produis », « Ce que je refuse »,
   « Réussite »), avec le contenu détaillé de spec-skills §2.1 à §2.8.
2. Chaque question de skill inclut un exemple de réponse tiré du cas
   `onboarding-agents`.
3. Chaque section « Ce que je refuse » contient le message type verbatim
   (dont, pour toutes : le refus de stocker une clé).
4. Vérification croisée : chaque étape 1–15 du PRD v0.3 §4 qui déclare une
   skill est couverte, et chaque `scripts_associes` référence un script
   spécifié au Lot 3 (le script peut ne pas exister encore : la skill est
   écrite contre sa spec).

### Critères d'acceptation

- [ ] 8 fichiers `skills/<nom>/SKILL.md`, noms exactement conformes à
      spec-skills §2 ;
- [ ] frontmatter YAML valide sur les 8 (parsable par `gray-matter`) ;
- [ ] la colonne « Skill » du tableau PRD v0.3 §4 correspond exactement aux
      champs `etapes_parcours` (aucune étape orpheline, aucune skill
      surnuméraire) ;
- [ ] aucune skill ne mentionne de dépendance externe au dépôt ;
- [ ] aucune skill ne contient de nom de personne, de secret ni de motif de
      clé ;
- [ ] `npm test` / `npm run build` inchangés (les skills sont hors `src/`).

### Commandes de vérification

```bash
ls skills/*/SKILL.md | wc -l    # attendu : 8
node -e "const m=require('gray-matter');const fs=require('fs');
  for (const f of fs.readdirSync('skills'))
    m.read('skills/'+f+'/SKILL.md'), console.log(f, 'OK')"
npm test && npm run build
```

### Risques

- Réécrire au lieu d'extraire : les skills doivent renvoyer aux guides longs,
  pas les remplacer (spec-skills §3) ;
- promesses non tenables : une skill ne doit citer que des scripts et fichiers
  spécifiés (spec scripts / architecture), sinon elle ment sur l'outillage.

### Non-objectifs

- Pas d'implémentation des scripts appelés (Lot 3) ; pas de mécanique
  d'activation spéciale (le format fichier suffit).

### Dépendances

- Requiert Lot 1 (les chemins `cases/<slug>/...` cités dans les skills doivent
  exister). Le Lot 3 dépend de la cohérence skills ↔ scripts.

### Livrable démontrable en vidéo

Le contenu de `skills/concevoir-garde-fous/SKILL.md` — c'est ce que le
panneau « skill mobilisée » de l'atelier affichera au plan 3 du scénario
vidéo (le fichier est la source, le panneau du Lot 5b le rend visible).

---

## Lot 3 — Couche déterministe réutilisable et scripts

### Objectif

Produire la **couche déterministe réutilisable** de la fabrique
(`scripts/lib/`, dont `scripts/lib/atelier/` — la logique des 15 étapes
consommée ensuite par l'API du Lot 5a, par le CLI et par les tests) et
implémenter les 8 scripts de `specs/spec-scripts-deterministes.md` :
l'interview CLI en 15 étapes (mode alternatif à l'atelier web), le
scaffolding, les trois validateurs, le rapport de gouvernance, la
régénération démo, et la refonte de l'orchestrateur. Tout est reproductible,
en français, sans réseau, sans secret.

### Fichiers à créer / modifier

**Créer :**

- `scripts/interview-harness.mjs` (spec §1) ;
- `scripts/scaffold-harness.mjs` (spec §2) ;
- `scripts/validate-corpus.mjs` (spec §3) ;
- `scripts/validate-guardrails.mjs` (spec §4) ;
- `scripts/validate-provider-config.mjs` (spec §5) ;
- `scripts/build-harness-report.mjs` (spec §6) ;
- `scripts/generate-onboarding-demo.mjs` (spec §7 — squelette : modes
  vérification/écriture ; son contenu de référence `scripts/demo/` arrive au
  Lot 4) ;
- `scripts/lib/atelier/` — la logique partagée des 15 étapes (spec §0) :
  `etapes.mjs` (définition déclarative : libellés, questions, skill associée,
  validations, fichiers produits), `reponses.mjs` (validation et application
  d'une réponse), `actions.mjs` (exécution des actions déterministes, retour
  `{ ok, erreurs, avertissements, fichiers }`) — importable sans TTY ni
  transpilation, car consommée par les handlers `/api/fabrique/*` au Lot 5a ;
- `scripts/lib/motifs-interdits.mjs` — module partagé des regex interdites
  (courriel plausible, téléphone, NIR, IBAN, motif de clé), **extraites de
  `tests/structure/`** pour une source unique de vérité ;
- `scripts/lib/manifeste.mjs` — lecture/écriture du manifeste côté scripts
  (js-yaml + mêmes règles de validation que `src/lib/manifest.ts` ; si le
  partage direct du schéma zod TS s'avère impraticable en `.mjs`, dupliquer le
  schéma avec un test de non-divergence au Lot 7) ;
- `scripts/lib/diagnostic-env.mjs` — si l'import de
  `src/lib/model/diagnostic.ts` depuis un `.mjs` pose problème : extraction de
  la logique, importée par les deux côtés (décision prévue par la spec §5) ;
- `templates/cases/documentaire/reponses-demo.yaml` — réponses du mode
  `--demo` de l'interview.

**Modifier :**

- `scripts/validate-harness.mjs` → orchestrateur (spec §8) : manifeste →
  `validate-corpus` → `validate-guardrails` → `validate-provider-config`
  (non bloquant) → contrôles de config ; signature CLI actuelle conservée ;
- `package.json` : ajout des scripts npm exactement comme spec (en-tête) :
  `interview`, `scaffold`, `validate-corpus`, `validate-guardrails`,
  `validate-provider`, `rapport`, `generate-demo` ;
- supprimer `scripts/generate-demo.mjs` **seulement au Lot 4**, quand son
  remplaçant produit un contenu vérifié (d'ici là, les deux coexistent).

### Tâches atomiques

1. Créer `scripts/lib/` (motifs, manifeste, diagnostic, **atelier/**) en
   premier — tout le reste s'appuie dessus ; adapter `tests/structure/` pour
   importer les motifs partagés (mêmes regex, zéro divergence).
2. Implémenter les validateurs (`validate-corpus`, `validate-guardrails`,
   `validate-provider-config`) : contrôles, codes de sortie 0/1/2, `--json`,
   messages français préfixés du fichier fautif — liste exhaustive des
   contrôles dans la spec §3, §4, §5, à implémenter **tous**.
3. Refondre `validate-harness.mjs` en orchestrateur ; les contrôles corpus
   actuels migrent dans `validate-corpus` (aucun contrôle perdu : dresser la
   liste avant/après dans `docs/RECETTE.md`).
4. Implémenter `scaffold-harness.mjs` : substitution `{{...}}`, idempotence,
   `--dry-run`, `--force` avec `.avant-force.bak`, refus d'écraser
   `onboarding-agents` sans `--force`.
5. Implémenter `interview-harness.mjs` : les 15 étapes (questions, valeurs par
   défaut, récapitulatif `o/N`, reprise via `etat.etape`, refus d'éligibilité
   en code 0, heuristique anti-« Prénom Nom », validation dates/slug) ; les
   étapes 10/13/14/15 affichent la commande à lancer sans l'exécuter ;
   mode `--demo` non interactif lisant `reponses-demo.yaml`. L'interview est
   une **enveloppe mince** autour de `scripts/lib/atelier/` : aucune logique
   d'étape ni de validation dupliquée dans le script.
6. Implémenter `build-harness-report.mjs` : agrégation des `--json` des trois
   validateurs, rapport conforme spec §6, date d'horloge confinée à l'en-tête.
7. Vérifier chaque script : `--help` présent, aucun accès réseau, aucun
   secret lu/écrit, code 2 sur invocation invalide.

### Critères d'acceptation

- [ ] les 7 scripts npm nouveaux répondent à `--help` ;
- [ ] les fonctions de `scripts/lib/atelier/` sont importables et exécutables
      sans TTY (vérifié par un test d'import direct) — condition du Lot 5a ;
- [ ] `npm run interview -- --demo` déroule les 15 étapes sans TTY et sort en
      0, en produisant des fichiers dans un cas jetable ;
- [ ] `npm run scaffold -- --cas essai --dry-run` liste sans créer ;
      `npm run scaffold -- --cas essai` crée ; relancé, il ne détruit rien
      (« conservé ») ; `--force` sauvegarde en `.avant-force.bak` ;
- [ ] `npm run validate-corpus -- --cas onboarding-agents` vert sur le corpus
      migré (6 sources à ce stade : les avertissements « source maigre » sont
      attendus et admis jusqu'au Lot 4) ;
- [ ] `npm run validate-guardrails -- --cas onboarding-agents` exécute ses 6
      contrôles (des écarts sont admis jusqu'au Lot 7, mais le script les
      nomme correctement) ;
- [ ] `npm run validate-provider` affiche mode/statut sans jamais imprimer une
      valeur de clé (test : lancer avec `MODEL_API_KEY=fausse-valeur-test` et
      vérifier que la chaîne n'apparaît pas dans la sortie) ;
- [ ] `npm run rapport -- --cas onboarding-agents` produit
      `cases/onboarding-agents/rapport-gouvernance.md` avec la mention « ne
      vaut pas validation juridique » ;
- [ ] `npm run validate-harness` (sans argument) garde sa sémantique et
      agrège les sous-validateurs ; code 1 si une erreur bloquante existe ;
- [ ] deux exécutions successives de chaque validateur donnent la même sortie
      (hors date d'en-tête du rapport) ;
- [ ] `npm test` et `npm run build` restent verts.

### Commandes de vérification

```bash
for s in interview scaffold validate-corpus validate-guardrails validate-provider rapport generate-demo; do
  npm run $s -- --help >/dev/null && echo "$s: --help OK"; done
npm run interview -- --demo
npm run scaffold -- --cas essai --dry-run && npm run scaffold -- --cas essai
npm run validate-harness
MODEL_API_KEY=fausse-valeur-test npm run validate-provider | grep -c "fausse-valeur-test"  # attendu : 0
git clean -n  # relever puis supprimer le cas "essai" de test avant commit
```

### Risques

- L'interview est le plus gros morceau (15 étapes, reprise, refus) : la
  découper en modules par étape dans le script, sinon illisible ;
- divergence regex scripts/tests : le module partagé est là pour ça, ne pas
  copier-coller ;
- interop TS/ESM (`diagnostic.ts` importé en `.mjs`) : la décision de repli
  (extraction en `.mjs` partagé) est déjà arbitrée, l'appliquer sans hésiter
  si le problème se présente ;
- écriture du manifeste concurrente entre interview et scaffold : un seul
  point d'écriture (`scripts/lib/manifeste.mjs`).

### Non-objectifs

- Pas d'appel au modèle nulle part dans les scripts (frontière stricte) ;
- pas de contenu de démo dense (Lot 4) ; pas d'OCR ni de conversion PDF ;
- pas de suppression de `generate-demo.mjs` (attend le Lot 4).

### Dépendances

- Requiert Lots 1 (arborescence, manifeste) et 2 (cohérence skills ↔ scripts,
  vérifiée dans les deux sens à la fin du lot).
- Conditionne Lots 4 (validation du corpus), 5a/5b (l'API et l'atelier
  consomment `scripts/lib/atelier/`), 7 (tests des scripts), 8 (rapport dans
  la vidéo).

### Livrable démontrable en vidéo

Le moteur des plans 2, 4, 5 et 8 du scénario (les actions que l'atelier
déclenchera via l'API) ; en attendant les Lots 5a/5b, le circuit est
démontrable en CLI (`interview --demo`, `scaffold --dry-run`,
`validate-corpus`, `rapport`).

---

## Lot 4 — Corpus dense `onboarding-agents` (16 sources)

### Objectif

Porter le corpus de 6 sources courtes à 16 sources denses (700–1 800 mots)
conformes à `specs/spec-corpus-onboarding.md`, avec la nouvelle organisation
fictive **Syndicat mixte du Val de Brenne**, les fiches passées à 10, le
parcours à 7 modules, le quiz à ≥ 12 questions — le tout versionné comme
contenu de référence de `generate-onboarding-demo`.

### Fichiers à créer / modifier

- `scripts/demo/onboarding-agents/` — **le contenu de référence versionné**
  (miroir complet de `content/cases/onboarding-agents/` +
  `cases/onboarding-agents/` hors manifeste) : c'est ici que les sources sont
  rédigées ;
- `content/cases/onboarding-agents/sources/SRC-001…016-<slug>.md` — les 6
  existantes **densifiées** (mêmes ids, mêmes thèmes, frontmatter conservé,
  dates 2024–2026), les 10 nouvelles créées, chacune conforme à sa section de
  spec-corpus §3 (structure, FAQ couvertes, exclusions, paragraphe de clôture
  type) ;
- `content/cases/onboarding-agents/fiches/` — 4 fiches ajoutées
  (informatique-securite, frais-deplacement, formation, ia-interne), chacune
  citant ses sources et portant un champ `limites` ;
- `content/cases/onboarding-agents/parcours/parcours.yml` — 7 modules ;
- `content/cases/onboarding-agents/quiz/quiz.yml` — ≥ 12 questions sourcées ;
- `configs/demo.yml` — organisation mise à jour : Syndicat mixte du Val de
  Brenne (fictif) ; `configs/organisation.example.yml` — conserve
  Roche-Vallonne en second exemple commenté ;
- `cases/onboarding-agents/harnais.yaml` — `sources_declarees` étendu aux 16
  entrées ; `cases/onboarding-agents/gouvernance/` — classification et
  registre mis à jour ;
- `scripts/generate-onboarding-demo.mjs` — branché sur le contenu de
  référence (mode vérification octet à octet + mode `--ecrire`) ;
- supprimer `scripts/generate-demo.mjs` et sa référence dans `package.json`
  (le remplaçant est en place).

### Tâches atomiques

1. Rédiger les 16 sources dans `scripts/demo/onboarding-agents/`, une par une,
   dans l'ordre de la spec, en respectant pour chacune : cible de mots ±20 %,
   sections listées, exclusions, ton « administratif sobre, manifestement
   générique », paragraphe final type, zéro nom de personne, courriels
   uniquement `@valdebrenne.exemple.fr`, téléphone neutralisé uniquement dans
   SRC-005, aucun numéro de texte réglementaire inventé.
2. Vérifier que les tests existants qui citent SRC-003 (télétravail, 2 jours)
   restent vrais dans la version densifiée.
3. Déployer via `npm run generate-demo -- --ecrire` puis contrôler avec
   `npm run validate-corpus -- --cas onboarding-agents` (0 erreur, 0
   avertissement « source maigre »).
4. Mettre à jour fiches, parcours, quiz, registre, classification,
   `sources_declarees` (16 entrées alignées titre/propriétaire/date sur les
   frontmatters).
5. Basculer l'organisation de `configs/demo.yml` vers Val de Brenne ;
   vérifier le rendu (en-tête du portail, `/gouvernance`).
6. Ajouter au corpus les éléments nécessaires aux nouveaux cas de test induits
   (spec-corpus §4) — les cas de test eux-mêmes sont écrits au Lot 7.
7. Supprimer `generate-demo.mjs` ; `npm run generate-demo` (mode vérification)
   sort en 0 avec « aucun écart ».

### Critères d'acceptation

- [ ] 16 fichiers `SRC-001` à `SRC-016`, ids et titres exactement conformes au
      tableau spec-corpus §2 ;
- [ ] `npm run validate-corpus -- --cas onboarding-agents` : 16 sources
      contrôlées, 0 erreur, 0 avertissement ;
- [ ] total du corpus ≈ 17 500 mots (tolérance ±15 %, compté par script) ;
- [ ] aucun motif interdit (le validateur fait foi) ; grep manuel
      supplémentaire sur « Madame », « Monsieur » suivi d'une majuscule dans
      `content/` : uniquement dans les cas de test de refus, jamais dans les
      sources ;
- [ ] `npm run generate-demo` (vérification) : aucun écart entre disque et
      référence ;
- [ ] 10 fiches, 7 modules de parcours, ≥ 12 questions de quiz, tous sourcés ;
- [ ] `npm test` vert (les tests existants passent sur le corpus densifié) ;
- [ ] `npm run validate-harness` vert.

### Commandes de vérification

```bash
ls content/cases/onboarding-agents/sources/ | wc -l   # 16
npm run validate-corpus -- --cas onboarding-agents
npm run generate-demo                                  # aucun écart
npm test && npm run build && npm run validate-harness
```

### Risques

- Le volume rédactionnel (≈ 17 500 mots) est le vrai coût du lot : prévoir
  éventuellement deux sessions (SRC-001–008 puis SRC-009–016) avec un état
  intermédiaire vert (le validateur tolère un corpus partiel tant que
  `sources_declarees` est aligné) ;
- SRC-005 (contacts) et SRC-016 (santé/sécurité) sont les plus proches des
  lignes rouges : relire spécifiquement contre les exclusions de la spec ;
- désynchronisation contenu de référence / contenu déployé : le mode
  vérification de `generate-demo` doit être exécuté à chaque fin de tâche.

### Non-objectifs

- Aucun nouveau cas de test (Lot 7) ; aucune modification de `src/` ; aucune
  référence réglementaire chiffrée précise ; pas de second cas d'usage.

### Dépendances

- Requiert Lot 3 (`validate-corpus`, `generate-onboarding-demo`).
- Conditionne Lots 5 (démo réaliste), 7 (nouveaux tests), 8 (vidéo).

### Livrable démontrable en vidéo

Plan 4 : « 16 sources contrôlées, 0 erreur » + ouverture de SRC-013 (charte
IA interne, l'effet miroir pédagogique).

---

## Lot 5 — Interface guidée et pédagogie visible

### Objectif

Rendre la fabrique **visible et racontable** : page `/fabrique` complète,
bandeau d'accueil, navigation pilotée par les modules du manifeste, et
finition de l'expérience d'interview (messages, reprise, moment du refus
d'éligibilité). C'est le lot qui transforme la refonte technique en
démonstration pédagogique.

### Fichiers à créer / modifier

- `src/app/fabrique/page.tsx` — version complète : pour chacune des 15
  étapes : libellé, skill associée (nom du fichier), script associé, ce que
  l'étape a produit **pour ce cas** (liens vers les preuves réelles :
  `/sources`, `/gouvernance`, `/limites`, `/configuration-ia`, et le chemin
  du fichier pour ce qui n'a pas de page) ; état du manifeste (étape, statut,
  date de mise à jour) ; encart « pourquoi la fabrique est en ligne de
  commande » (arbitrage du specs/README) ; note « état lu au démarrage —
  relancer `npm run dev` après une interview » ;
- `src/app/page.tsx` — bandeau sobre « Ce portail a été produit par la
  fabrique Comptoir des Harnais — voir comment » → `/fabrique` ;
- `src/components/Nav.tsx` — les entrées Parcours / FAQ / Quiz / Checklist ne
  s'affichent que si le module correspondant est `true` dans le manifeste ;
- `src/app/gouvernance/page.tsx` — référence le rapport de gouvernance
  (`cases/<slug>/rapport-gouvernance.md`) et le type de harnais ;
- `scripts/interview-harness.mjs` — passe de finition UX : relecture de
  toutes les questions et messages (langage métier, pas de jargon), textes du
  refus d'éligibilité et du récapitulatif soignés (ils seront filmés en gros
  plan), vérification de la reprise après interruption (Ctrl-C au milieu de
  l'étape 5 → relance → « reprendre à l'étape 6 ? »).

### Tâches atomiques

1. Compléter `/fabrique` (tableau des 15 étapes = source : PRD v0.3 §4, repris
   verbatim, pas paraphrasé).
2. Ajouter le bandeau d'accueil (une ligne, pas une bannière envahissante).
3. Brancher la navigation sur `modules` ; tester avec un manifeste où
   `quiz: false` (l'entrée disparaît, la route directe `/quiz` reste servie —
   comportement documenté).
4. Enrichir `/gouvernance`.
5. Passe UX de l'interview : dérouler manuellement les 15 étapes une fois en
   entier, corriger chaque message maladroit ; rejouer le scénario « refus
   d'éligibilité puis reprise » du plan 2 de la vidéo.
6. Vérifier le français de toutes les sorties de scripts (orthographe,
   accents, cohérence de ton).

### Critères d'acceptation

- [ ] `/fabrique` reflète l'état réel du manifeste (modifier `etat.etape` à la
      main → rebuild → la page change) ;
- [ ] chaque étape affichée sur `/fabrique` référence la même skill et le même
      script que le tableau PRD v0.3 §4 ;
- [ ] le bandeau d'accueil apparaît sur `/` et le mot « fabrique » y figure ;
- [ ] navigation : `modules.quiz: false` masque l'entrée Quiz ;
- [ ] scénario filmable du plan 2 rejoué avec succès : réponse « oui » à
      « adapté à des situations individuelles » → refus d'éligibilité propre
      (code 0), puis reprise correcte ;
- [ ] `npm test` + `npm run build` (21 routes) + `npm run validate-harness`
      verts.

### Commandes de vérification

```bash
npm run build && npm run dev &
# vérifier : / (bandeau), /fabrique (15 étapes, état réel), /gouvernance
npm run interview -- --demo    # relire chaque sortie affichée
```

### Risques

- Transformer `/fabrique` en documentation redondante avec le README : la
  page montre **l'état de ce cas**, le README raconte la méthode ;
- oublier que la page lit le manifeste au build (dette assumée, architecture
  §7) : la note explicative doit être visible sur la page.

### Non-objectifs

- Aucune action d'écriture depuis le navigateur (décision de sécurité) ; pas
  de refonte graphique générale ; pas de nouvelle dépendance front.

### Dépendances

- Requiert Lots 1 (page minimale, manifeste), 3 (interview), 4 (contenu
  réaliste à montrer). Conditionne le Lot 8 (vidéo).

### Livrable démontrable en vidéo

Plans 2 (interview finie et fluide) et 7 (bandeau, `/fabrique`, 15 étapes
franchies) du scénario.

---

## Lot 6 — Intégration de l'application finale existante

### Objectif

Prouver l'engagement central : **assembler une application = pointer une
config vers un cas**, sans toucher `src/`. Un second cas généré par la
fabrique (cas d'essai) doit être servi par la même application via
`CDH_CONFIG`, et le cas `onboarding-agents` doit être intégralement porté par
le circuit officiel (config → manifeste → contenu).

### Fichiers à créer / modifier

- `configs/essai.yml` — config d'un cas d'essai généré via
  `npm run interview -- --demo` + `npm run scaffold` (organisation fictive
  distincte, corpus minimal de 1–2 sources d'exemple issues des gabarits) ;
  **fichier temporaire de recette : supprimé en fin de lot**, la procédure
  restant consignée dans `docs/RECETTE.md` ;
- `cases/essai/` + `content/cases/essai/` — idem, temporaires de recette ;
- `configs/organisation.example.yml` — mis à jour pour documenter le circuit
  complet (champ `cas`, renvoi vers l'interview) ;
- `docs/adapter-ses-sources.fr.md` et `/sources/adapter`
  (`src/app/sources/adapter/page.tsx`) — mis à jour : le chemin d'adaptation
  passe désormais par la fabrique (interview → scaffold → import-source →
  validate-corpus), chemins `content/cases/<slug>/` corrects ;
- aucun autre fichier de `src/` (c'est le critère du lot).

### Tâches atomiques

1. Dérouler le circuit complet du cas d'essai : interview `--demo` (slug
   `essai`), scaffold, import d'une source d'exemple, `validate-corpus`
   (échecs attendus documentés tant que le corpus est minimal),
   `CDH_CONFIG=essai.yml npm run dev` → l'application affiche l'identité et le
   contenu du cas d'essai sur le port 3010.
2. Vérifier la bascule inverse : sans `CDH_CONFIG`, l'application sert
   `onboarding-agents` (défaut).
3. Consigner la recette pas à pas dans `docs/RECETTE.md` (c'est la preuve
   d'adaptation tierce, héritière du §10.4 de la V1).
4. Mettre à jour le guide et la page « adapter ses sources ».
5. Supprimer les artefacts du cas d'essai (`git status` propre), la recette
   écrite en tenant lieu.

### Critères d'acceptation

- [ ] le circuit interview → scaffold → config → `npm run dev` fonctionne de
      bout en bout sur un cas neuf **sans aucune modification de `src/`**
      (vérifiable par `git diff --stat -- src/` vide sur ce lot, hors
      `sources/adapter/page.tsx` listé ci-dessus) ;
- [ ] `CDH_CONFIG=essai.yml` sert le cas d'essai ; sans variable, le cas
      par défaut ; aucune fuite d'un cas dans l'autre (caches indexés par
      cas) ;
- [ ] `npm run validate-harness -- --cas essai` évalue le cas d'essai et ses
      messages d'échec sont explicites (corpus vide → erreurs nommées) ;
- [ ] recette consignée dans `docs/RECETTE.md` ;
- [ ] dépôt propre en fin de lot (cas d'essai supprimé), `npm test` /
      `npm run build` / `npm run validate-harness` verts sur le cas par
      défaut.

### Commandes de vérification

```bash
npm run interview -- --demo            # slug essai (réponses-demo dédiées ou --cas essai)
npm run scaffold -- --cas essai
CDH_CONFIG=essai.yml npm run dev &     # vérifier l'identité affichée sur :3010
npm run validate-harness -- --cas essai
git status --short                      # propre après nettoyage
```

### Risques

- Découvrir ici un couplage `src/` ↔ cas résiduel (cache global, chemin
  oublié) : c'est précisément le rôle du lot de le révéler ; le corriger
  compte comme correction du Lot 1, pas comme entorse au critère « pas de
  modification de src/ » — le documenter ;
- laisser traîner le cas d'essai dans le dépôt (pollution) : nettoyage
  vérifié par `git status`.

### Non-objectifs

- Pas de second cas d'usage **publié** (l'essai est jetable) ; pas de
  multi-cas simultané servi par une même instance ; pas d'interface de
  sélection de cas dans le navigateur.

### Dépendances

- Requiert Lots 1, 3, 4, 5. Conditionne le Lot 8 (le README décrira ce
  circuit).

### Livrable démontrable en vidéo

Non repris dans le scénario 9 minutes (il montre le cas complet), mais c'est
la démonstration « adaptez-le chez vous » à garder en réserve pour une démo
live.

---

## Lot 7 — Tests, sécurité, RGPD, absence de secrets

### Objectif

Étendre la couverture de tests à la hauteur de la refonte : nouveaux cas de
comportement induits par le corpus dense, tests des nouveaux scripts et du
manifeste, triple cohérence des refus, contrôles d'absence de secrets et de
données personnelles sur la nouvelle arborescence.

### Fichiers à créer / modifier

- `cases/onboarding-agents/tests/comportement.yaml` — ajout des cas induits
  (spec-corpus §4) : « logiciel » (SRC-007), « courriel suspect »
  (SRC-007/012), « remboursement déplacement » (SRC-009), « formation
  obligatoire » (SRC-010), « qui est le directeur ? » (refus nominatif
  inversé), « IA au travail » (SRC-013), « accident de travail » (SRC-016),
  « ai-je droit au CPF ? » (refus individuel), contraste « que veut dire
  RIFSEEP ? » (sourcé SRC-015) vs montant RIFSEEP (hors corpus, cas existant
  conservé) ;
- `tests/structure/structure.test.ts` — étendu : présence et validité du
  manifeste, arborescence `cases/` + `content/cases/`, skills présentes (8,
  frontmatter valide), motifs interdits balayant aussi `cases/`, `skills/`,
  `scripts/demo/`, `templates/` ;
- `tests/structure/manifest.test.ts` (nouveau) — schéma zod du manifeste :
  cas valides/invalides, non-divergence entre `src/lib/manifest.ts` et
  `scripts/lib/manifeste.mjs` (mêmes fichiers acceptés/refusés) ;
- `tests/scripts/` (nouveau) — tests des scripts via `--json` et codes de
  sortie : scaffold idempotent, validate-corpus détecte une source piégée
  (fixture avec courriel plausible), validate-guardrails détecte un refus
  déclaré non testé, interview `--demo` complet en CI ; fixtures dans
  `tests/scripts/fixtures/` (données fictives, motifs interdits uniquement
  dans les fixtures négatives, exclues du balayage anti-motifs) ;
- `package.json` — `npm test` inclut les nouveaux répertoires de tests.

### Tâches atomiques

1. Écrire les nouveaux cas de comportement (types existants uniquement :
   `comportement` / `contenu` / `registre` — aucun nouveau format sans
   modification signalée du runner).
2. Ajouter le champ `couvre:` aux cas de refus pour la traçabilité exigée par
   `validate-guardrails` (contrôle §4.2) et compléter
   `gouvernance/limites-refus.md` en conséquence (triple cohérence).
3. Étendre les tests de structure (manifeste, skills, motifs sur la nouvelle
   arborescence).
4. Écrire les tests de scripts (chaque script : au moins un cas nominal et un
   cas d'échec).
5. `npm run validate-guardrails -- --cas onboarding-agents` : passer au vert
   complet (tous les écarts tolérés au Lot 3 sont soldés ici).
6. Exécuter `npm test` **trois fois consécutives** (règle de variabilité,
   PRD v0.2 §10.4) et consigner.
7. Balayage final absence de secrets/PII : le test structure + un grep manuel
   des motifs sur tout le dépôt hors `node_modules`/`.git`.

### Critères d'acceptation

- [ ] `npm test` vert 3 exécutions consécutives, nombre total de tests en
      nette hausse par rapport aux 36 de référence (compte exact consigné dans
      `docs/RECETTE.md`) ;
- [ ] tous les nouveaux cas de comportement passent sur le moteur réel
      (mode `local`) ;
- [ ] `npm run validate-guardrails` : 0 erreur — chaque refus déclaré est
      testé et affiché, ≥ 5 cas sourcés, ≥ 3 refus (nominatif fictif,
      possessif individuel, avis juridique), ≥ 1 hors-corpus ;
- [ ] une fixture piégée est bien rejetée par `validate-corpus` (test
      automatisé, pas vérification manuelle) ;
- [ ] aucun motif de secret/PII hors fixtures négatives, `[REDACTED]` pour
      tout exemple de clé ;
- [ ] `npm run build` et `npm run validate-harness` verts.

### Commandes de vérification

```bash
npm test && npm test && npm test
npm run validate-guardrails -- --cas onboarding-agents
npm run validate-corpus -- --cas onboarding-agents
npm run validate-harness && npm run build
```

### Risques

- Tests de scripts interactifs fragiles : tout passe par `--demo` / `--json` /
  codes de sortie, jamais par simulation de TTY ;
- fixtures négatives déclenchant les contrôles anti-motifs du dépôt : les
  isoler dans un chemin explicitement exclu et commenté ;
- le test « registre » sensible au temps (seuil 24 mois) : les dates du
  corpus densifié (2024–2026) lui redonnent de la marge — vérifier.

### Non-objectifs

- Pas d'appel réseau réel aux fournisseurs IA (la logique reste testée sans
  clé, comme aujourd'hui) ; pas de tests de charge ; pas de modification des
  regex de `guardrails.ts`.

### Dépendances

- Requiert Lots 3 et 4 (scripts et corpus à tester), 6 souhaitable avant
  (les découvertes du circuit complet nourrissent les tests).
- Conditionne le Lot 8 (la vidéo montre `npm test` vert).

### Livrable démontrable en vidéo

Plan 6 : `npm test` + `npm run validate-guardrails`, rapport en français,
« refus des cas individuels : couvert, testé, affiché ».

---

## Lot 8 — README, scénario vidéo, recette, handoff

### Objectif

Raconter la fabrique d'abord, partout : README refondu, documentation alignée,
plan de démo vérifié commande par commande, recette complète de la refonte et
handoff mis à jour pour les sessions suivantes.

### Fichiers à créer / modifier

- `README.md` — refonte selon PRD v0.3 §3 : ① définition fabrique/harnais,
  ② schéma texte du parcours en 15 étapes, ③ démarrage rapide de la fabrique
  (`npm run interview`), ④ le cas `onboarding-agents` et son démarrage
  (`npm run dev`), ⑤ sections conservées (configuration IA, licences,
  gouvernance, English summary — l'English summary est réécrit dans la même
  logique fabrique d'abord) ; structure du dépôt mise à jour (`cases/`,
  `skills/`, `content/cases/`) ; tableau des scripts npm complété ;
- `docs/HANDOFF.md` — mis à jour : nouvelle synthèse (fabrique), nouvelle
  arborescence, nouveaux scripts et commandes de vérification avec les
  chiffres réels post-refonte, pièges connus enrichis (page `/fabrique` lue au
  build, mode `--demo`, contenu de référence `scripts/demo/`), plan de
  reprise pointant vers `specs/` ;
- `docs/RECETTE.md` — synthèse finale de la recette des 8 lots + tableau de
  correspondance critères d'acceptation PRD v0.3 §6 → preuve ;
- `docs/architecture.fr.md` — mise à jour de l'arborescence et du rôle de la
  fabrique ;
- `docs/cycle-de-vie.fr.md` — aligné sur les 15 étapes (mêmes intitulés que
  PRD v0.3 §4 et `/fabrique`, partout) ;
- `cases/onboarding-agents/demo/plan-demo.md` — produit en suivant la skill
  `preparer-demo-video` : checklist pré-tournage, commandes exactes plan par
  plan, résultats attendus, conforme à `specs/spec-parcours-video.md` ;
- `CHANGELOG.md` — entrée de refonte finalisée (renommage effectif, nouveaux
  scripts, corpus 16 sources).

### Tâches atomiques

1. Réécrire le README (garder les badges, licences, maintenance ; le mot
   « fabrique » apparaît avant toute description du portail RH).
2. Mettre à jour HANDOFF (relever les chiffres réels : nombre de tests,
   routes, sources — jamais recopier des valeurs attendues).
3. Passe de cohérence des intitulés d'étapes : PRD v0.3 §4, `/fabrique`,
   `docs/cycle-de-vie.fr.md`, skills et README utilisent mot pour mot les
   mêmes 15 libellés.
4. Dérouler `specs/spec-parcours-video.md` plan par plan, exécuter chaque
   commande, consigner chaque résultat dans `plan-demo.md` ; tout écart entre
   scénario et dépôt est soit corrigé, soit consigné comme écart assumé
   (jamais passé sous silence).
5. Compléter la recette finale et cocher un à un les critères PRD v0.3 §6.
6. Relecture globale anti-interdits : grep de l'ancien nom écarté et des noms
   de projets concurrents sur tout le dépôt (résultat attendu : néant).

### Critères d'acceptation

- [ ] README : « fabrique » avant toute description du portail ; le démarrage
      rapide commence par `npm run interview` ; structure du dépôt exacte ;
- [ ] chaque commande de `plan-demo.md` a été exécutée avec le résultat
      attendu, daté ;
- [ ] les 7 critères d'acceptation du PRD v0.3 §6 sont cochés avec, pour
      chacun, la preuve (commande + résultat) dans `docs/RECETTE.md` ;
- [ ] HANDOFF permet une reprise à froid : une session qui ne lirait que lui
      saurait relancer toutes les vérifications avec les bons chiffres ;
- [ ] mêmes intitulés d'étapes partout (contrôle par grep sur 2 ou 3 libellés
      caractéristiques) ;
- [ ] `npm test`, `npm run build`, `npm run validate-harness`,
      `npm run validate-corpus`, `npm run validate-guardrails`,
      `npm run generate-demo` (vérification) : tous verts le même jour,
      résultats consignés.

### Commandes de vérification

```bash
npm test && npm run build && npm run validate-harness
npm run validate-corpus -- --cas onboarding-agents
npm run validate-guardrails -- --cas onboarding-agents
npm run generate-demo
head -40 README.md          # la fabrique d'abord
```

### Risques

- README trop long : la refonte réordonne, elle ne double pas le volume ;
- documentation qui promet plus que le dépôt : chaque affirmation du README
  doit correspondre à une commande exécutable (même règle que la vidéo).

### Non-objectifs

- Pas de tournage vidéo dans ce lot (le lot livre le **plan** vérifié) ; pas
  de push ni de publication ; pas de changement de licence.

### Dépendances

- Requiert tous les lots précédents. Clôt la refonte.

### Livrable démontrable en vidéo

Plan 1 (README « fabrique » à l'écran) et la checklist de préparation
technique complète du scénario (`plan-demo.md`).

---

## Stratégie de migration depuis l'état actuel

Reprise de l'architecture §5, ordonnée sur les lots :

1. **Tout se passe sur `refonte-fabrique`** ; `main` reste l'état publié
   fonctionnel. Retour arrière possible à tout moment via le tag
   `avant-refonte-fabrique`.
2. **Migration en une fois, sans couche de compatibilité** : pas de symlink,
   pas de double lecture de chemins. Le renommage
   `demo-onboarding-rh` → `onboarding-agents` est annoncé dans le CHANGELOG et
   le README. Justification : dépôt jeune, un seul cas, un seul consommateur ;
   les symlinks se comportent mal sous Windows et la double lecture crée des
   états ambigus.
3. **Le cas existant devient le premier produit officiel de la fabrique par
   rétro-remplissage manuel du manifeste** (Lot 1), jamais par régénération :
   ce qui est validé (36 tests, contenu relu) n'est pas rejoué.
4. **L'application reste verte à chaque fin de lot** : la refonte est une
   succession d'états démontrables, pas un tunnel. Les seuls états rouges
   admis sont internes à un lot.
5. **Ordre de fusion** : pas de merge dans `main` avant la fin du Lot 8 et la
   décision explicite de Pascal (le merge et l'éventuel push sont hors
   backlog).
6. **En cas de blocage majeur en cours de refonte** (ex. : interop TS/ESM
   insoluble, volume du Lot 4 sous-estimé) : consigner l'état dans
   `docs/RECETTE.md`, commiter le travail en l'état sur la branche, et
   s'arrêter proprement — la reprise est conçue pour être possible à tout
   point inter-lot.

## Definition of Done globale

La refonte est terminée quand, sur la branche `refonte-fabrique`, **le même
jour, dans le même environnement** :

1. `npm test` vert, trois exécutions consécutives, compte de tests consigné ;
2. `npm run build` vert, 21 routes dont `/fabrique` ;
3. `npm run validate-harness` vert (orchestrateur complet) ;
4. `npm run validate-corpus -- --cas onboarding-agents` : 16 sources, 0
   erreur, 0 avertissement ;
5. `npm run validate-guardrails -- --cas onboarding-agents` : 0 erreur ;
6. `npm run interview -- --demo` déroule les 15 étapes et sort en 0 ;
7. `npm run scaffold -- --cas <neuf> --dry-run` fonctionne, et le circuit
   complet cas neuf → application servie a été exécuté une fois (Lot 6,
   recette consignée) ;
8. `npm run rapport -- --cas onboarding-agents` produit un rapport sans écart
   bloquant, mention « ne vaut pas validation juridique » incluse ;
9. `npm run generate-demo` (mode vérification) : aucun écart ;
10. les 7 critères du PRD v0.3 §6 sont cochés avec preuves dans
    `docs/RECETTE.md` ;
11. les 8 skills existent, frontmatter valide, cohérentes avec le tableau des
    étapes ;
12. `cases/onboarding-agents/demo/plan-demo.md` existe et chaque commande y a
    été exécutée avec succès ;
13. greps d'hygiène tous vides : `demo-onboarding-rh` (hors CHANGELOG et
    historique), ancien nom écarté, noms de concurrents, motifs de
    secrets/PII hors fixtures négatives ;
14. aucun fichier parasite (`git status` propre, cas d'essai supprimés) ;
15. README, HANDOFF, RECETTE, CHANGELOG à jour et datés.

## Ordre recommandé des sessions Claude Code Opus 4.8

Découpage pensé pour des sessions bornées (risque connu : arrêt au *max
turns* — ne jamais supposer qu'une session interrompue a fini son lot ;
chaque session commence par rejouer les vérifications du lot précédent).

| Session | Contenu | Taille estimée | Note |
|---|---|---|---|
| S1 | Lot 0 + Lot 1 | moyenne | la migration structurale d'un bloc, app verte en fin de session |
| S2 | Lot 2 | petite | rédactionnel, 8 fichiers, sans risque de casse |
| S3 | Lot 3 (scripts sauf interview) | moyenne | lib partagées + validateurs + scaffold + rapport + orchestrateur |
| S4 | Lot 3 (interview) | moyenne | le script le plus long, avec `--demo` testable en fin de session |
| S5 | Lot 4 (SRC-001 à 008) | grande (rédactionnel) | état intermédiaire vert admis |
| S6 | Lot 4 (SRC-009 à 016 + fiches/parcours/quiz + bascule Val de Brenne) | grande (rédactionnel) | clôt le corpus, `generate-demo` branché |
| S7 | Lot 5 + Lot 6 | moyenne | pédagogie visible puis preuve du circuit complet |
| S8 | Lot 7 | moyenne | tests étendus, triple cohérence au vert |
| S9 | Lot 8 | moyenne | documentation, plan de démo vérifié, recette finale |

Chaque session : lire `specs/README.md` + la ou les specs du lot + la section
du lot dans ce backlog ; finir par la mise à jour de `docs/RECETTE.md` et un
commit propre. Si une session ne peut pas finir son lot, elle le dit
explicitement dans la RECETTE (tâches faites / restantes).

## Points à ne pas laisser au modèle

Décisions déjà arbitrées : une session d'implémentation les **applique**, elle
ne les rediscute pas et n'improvise pas dessus.

1. **Noms et chemins exacts** : `cases/`, `content/cases/`, `harnais.yaml`,
   `skills/<nom>/SKILL.md`, ids `SRC-\d{3}`, slug `onboarding-agents`, noms
   des 8 skills et des 8 scripts, noms des scripts npm — tout est fixé par les
   specs, au caractère près.
2. **Pas de couche de compatibilité** pour le renommage (ni symlink, ni
   double chemin) — décision d'architecture, ne pas « améliorer ».
3. **Regex de `guardrails.ts` et mentions obligatoires intouchées.**
4. **Codes de sortie des scripts** (0/1/2) et format `--json`
   (`{ ok, erreurs, avertissements }`) — contractuels.
5. **YAML par `js-yaml.dump` uniquement** ; frontmatter par `gray-matter`.
6. **Aucun secret nulle part** : les scripts ne lisent ni n'affichent de
   valeur de clé ; `[REDACTED]` dans tout exemple ; l'interview refuse une clé
   collée.
7. **Fonctions, jamais des noms de personnes** — dans le corpus, les configs,
   les manifestes, les exemples, les tests (sauf noms explicitement fictifs
   dans les cas de refus, type « Madame Martin »).
8. **Aucune référence réglementaire chiffrée inventée** dans le corpus (pas de
   faux numéro de décret, pas de seuil précis) — ordres de grandeur datés.
9. **Le refus d'éligibilité sort en code 0** : c'est le cadre qui fonctionne,
   pas une erreur.
10. **Port 3010, `CDH_CONFIG`, les 7 modes IA, la sémantique
    `MODEL_PROVIDER`** : inchangés.
11. **`git mv` pour les déplacements**, jamais copie + suppression (préserver
    l'historique).
12. **Le contenu long est versionné** (`scripts/demo/`), jamais généré par
    concaténation dans du JS.
13. **Pas de push, pas de merge dans `main`, pas de tag public** sans demande
    explicite.
14. **Modèle d'implémentation : Opus 4.8** (`claude-opus-4-8`), sans
    substitution silencieuse ; s'il est indisponible, s'arrêter et signaler.
15. **Vocabulaire officiel du PRD v0.3 §2** employé partout sans variation
    (fabrique, harnais, cas d'usage, skill, script déterministe, corpus).

## Points qui exigent arbitrage Pascal

À trancher par Pascal — de préférence avant la session indiquée ; en
l'absence d'arbitrage, appliquer la valeur par défaut notée, en le consignant.

1. **Bascule de l'organisation de démo vers « Syndicat mixte du Val de
   Brenne »** (spec corpus §0) : confirmer le nom et la bascule de
   `configs/demo.yml` (Roche-Vallonne restant en second exemple). *Défaut :
   appliquer la spec.* — avant S5.
2. **Sort des fichiers `claude-code-runs/`** : commiter sur `main`, ignorer
   via `.gitignore`, ou laisser non suivis. *Défaut : laisser non suivis.*
   — avant S1.
3. **Merge de `refonte-fabrique` dans `main` et push** : décision
   exclusivement humaine, après revue. — après S9.
4. **Fournisseur IA pour la vidéo** : le scénario impose le mode `local` au
   tournage ; montrer en plus un appel réel (Ollama ou API) est une décision
   d'exposition à part. *Défaut : `local` uniquement.* — avant tournage.
5. **Passage de statut du cas** (`prototype` → `interne`) : le passage de
   statut est une décision humaine tracée (fiche de validation) ; la refonte
   laisse `prototype`. — hors backlog.
6. **Licence des nouveaux contenus** : le corpus dense et les skills relèvent
   de CC BY-SA 4.0 comme le reste des contenus. *Défaut : oui, conformément à
   `LICENSES.fr.md`.* — avant S5.
7. **Ton et signature de la vidéo** (voix off vs face caméra au plan 1, durée
   exacte) : le plan technique est prêt, l'incarnation est un choix d'auteur.
   — avant tournage.
8. **Date de péremption des sources fictives** : le corpus densifié est daté
   2024–2026 ; décider quand une passe de « rafraîchissement des dates » sera
   faite pour éviter le signal d'obsolescence du test registre (~2027).
   — hors backlog, à noter dans la feuille de route.
