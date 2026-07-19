# HANDOFF — Comptoir des Harnais

Document de reprise pour une nouvelle session Claude Code, **après nettoyage de
contexte**. Objectif : reprendre le projet sans perte d'information
opérationnelle. Rédigé le **2026-07-19**.

**Ordre de lecture recommandé :** `prd/PRD.md` (autorité fonctionnelle) → ce
fichier → `docs/RECETTE.md` (journal de recette) → le code.

<!-- ================================================================= -->
<!-- BLOC DE REPRISE — REFONTE FABRIQUE — LIRE EN PREMIER (Lot 3)      -->
<!-- Les §1 à §12 sous ce bloc décrivent l'état PRÉ-REFONTE (V1) et    -->
<!-- serviront de référence ; ils seront refondus au Lot 8. En cas de  -->
<!-- contradiction, CE BLOC fait foi pour la refonte en cours.         -->
<!-- ================================================================= -->

> # 🏭 Reprise de la refonte « harnais-fabrique » — **Lot 3 terminé**, au seuil du **Lot 4**
>
> > **Mise à jour 2026-07-19 (fin S3) : le Lot 3 est complet et vert** (couche
> > `scripts/lib/` + `scripts/lib/atelier/`, 3 validateurs, orchestrateur,
> > scaffold, rapport, interview CLI `--demo`, squelette generate-demo). Détail,
> > migration des contrôles et écarts documentés : `docs/RECETTE.md` § « Lot 3 ».
> > Les §E ci-dessous décrivent le Lot 3 tel qu'il a été **réalisé** ; la
> > prochaine session attaque le **Lot 4** (corpus dense 16 sources) —
> > **ne pas** commencer le Lot 4 sans relire `specs/backlog-implementation.md`
> > § Lot 4 et `specs/spec-corpus-onboarding.md`. Rappels Lot 4 : re-durcir le
> > seuil `< 120 mots` de `validate-corpus` en **erreur**, et supprimer
> > `scripts/generate-demo.mjs` une fois `scripts/demo/onboarding-agents/` peuplé.
>
> **Branche de travail : `refonte-fabrique` (et elle seule).** Ne jamais
> revenir sur `main` : `main` est l'état V1 publié, figé au tag
> `avant-refonte-fabrique`. Toute la refonte vit sur `refonte-fabrique`.
> Autorité fonctionnelle : `specs/README.md` → `specs/PRD-v0.3-harnais-fabrique.md`
> → architecture → `specs/backlog-implementation.md`. Pour le Lot 3, la spec de
> détail qui **prime** est `specs/spec-scripts-deterministes.md`.
>
> ## A. État Git exact (relevé le 2026-07-19)
>
> - **Branche courante :** `refonte-fabrique` (jamais `main`).
> - **HEAD à relever en début de session :** exécuter `git log --oneline -1`. Le
>   dernier commit attendu est le commit du **Lot 3** ou un commit de handoff/recette
>   postérieur ; ne pas dépendre d'un SHA recopié ici si ce fichier a été amendé.
> - **Historique de la refonte (du plus récent au plus ancien, hors éventuel amend du présent handoff) :**
>   - `8fa623d` — **Lot 3** : couche déterministe de la fabrique ;
>   - `427b9ce` — **Lot 2** : 8 skills locales + 2 renvois de docs ;
>   - `da4df9b` — note de reprise refonte dans le HANDOFF (fin S1) ;
>   - `109abed` — **Lot 1** : socle fabrique (manifeste, résolution par cas, `/fabrique`) ;
>   - `e2fec7c` — **Lot 1** : `git mv` du cas vers `cases/` et `content/cases/` ;
>   - `dde31a4` — **Lot 0** : gel de l'état de référence, ouverture de la refonte ;
>   - `85e5ffa` — dernier commit de `main` (**base du tag** `avant-refonte-fabrique`).
> - **Tag de retour arrière :** `avant-refonte-fabrique` sur `85e5ffa`. `git tag`
>   ne doit lister que celui-ci.
> - **Pas de push, pas de merge :** la branche n'a **jamais** été poussée ni
>   fusionnée dans `main`. Le merge/push sont hors backlog (décision de Pascal,
>   après Lot 8).
> - **Working tree :** propre côté code. Seuls des `claude-code-runs/*` (logs de
>   session) sont non suivis / modifiés — artefacts, **laissés non suivis**
>   (arbitrage Pascal). Ne pas les commiter, ne pas les supprimer.
>
> ## B. Lots terminés (0, 1, 2) — vérifiés verts
>
> - **Lot 0** — baseline : tag `avant-refonte-fabrique`, branche créée, état de
>   référence consigné (`docs/RECETTE.md` § « Lot 0 »), `CHANGELOG.md` annonçant
>   le renommage `demo-onboarding-rh` → `onboarding-agents`.
> - **Lot 1** — arborescence fabrique : `content/cases/onboarding-agents/`
>   (corpus), `cases/onboarding-agents/` (`harnais.yaml`, `gouvernance/`,
>   `tests/comportement.yaml`), `templates/cases/documentaire/` (gabarits
>   généralisés `{{...}}`), `src/lib/manifest.ts` (zod strict), route
>   `/fabrique` (dynamique, 15 étapes lues au manifeste), points de couplage
>   migrés (`paths.ts`, `config.ts`, `content.ts`, configs, scripts, tests, Nav).
> - **Lot 2** — 8 skills `skills/<nom>/SKILL.md` (frontmatter 5 clés, 5 sections),
>   + 2 renvois dans `docs/cycle-de-vie.fr.md` et `docs/adapter-ses-sources.fr.md`.
> - **Lot 3** — couche déterministe : `scripts/lib/` (motifs, manifeste,
>   diagnostic-env, cli) + `scripts/lib/atelier/` (etapes, reponses, actions,
>   importables sans TTY) ; scripts `validate-corpus`, `validate-guardrails`,
>   `validate-provider-config`, `scaffold-harness`, `build-harness-report`,
>   `interview-harness` (`--demo`), `generate-onboarding-demo` (squelette) ;
>   orchestrateur `validate-harness` ; 7 scripts npm. **Vert** (36/36, build OK).
>
> Détail lot par lot : `docs/RECETTE.md` § « Recette de la refonte fabrique ».
>
> ## C. Vérifications connues vertes (relancées le 2026-07-19, à ré-exécuter au démarrage)
>
> | Contrôle | Commande | Résultat attendu (constaté) |
> |---|---|---|
> | Skills présentes | `find skills -maxdepth 2 -name SKILL.md \| wc -l` | **8** |
> | Frontmatter skills | script `gray-matter` ci-dessous | **8/8 OK** (5 clés chacun) |
> | Tests | `npm test` | **36/36** (configuration-ia 18, structure 7, guardrails 11) |
> | Build | `npm run build` | **OK** — 20 pages statiques + `/fabrique` dynamique (`ƒ`) = 21 routes |
> | Harnais | `npm run validate-harness` | **OK** — cas `onboarding-agents`, 6 sources, 6 fiches, prototype |
> | Secrets | grep `sk-…`/`AKIA…`/`PRIVATE KEY` sur `skills content cases configs scripts src` | **0** |
> | Concurrent / ancien nom | grep interdits sur `docs specs skills` | **0** |
>
> Contrôle frontmatter (copiable) :
> ```bash
> node --input-type=module - <<'NODE'
> import fs from 'node:fs'; import matter from 'gray-matter';
> const required=['name','description','etapes_parcours','scripts_associes','fichiers_produits'];
> for (const d of fs.readdirSync('skills')) { const f=`skills/${d}/SKILL.md`;
>   const p=matter(fs.readFileSync(f,'utf8'));
>   for (const k of required) if (!(k in p.data)) throw new Error(`${f}: manque ${k}`);
>   console.log(d,'OK'); }
> NODE
> ```
>
> > ⚠️ Ne pas supposer qu'une session interrompue au *max turns* a fini son lot :
> > **rejouer d'abord `npm test` + `npm run build` + `npm run validate-harness`**
> > avant toute modification. Si un écart apparaît, le documenter dans
> > `docs/RECETTE.md` et s'arrêter pour signalement, ne pas « réparer » à l'aveugle.
>
> ## D. Contraintes non négociables (rappel condensé — détail §11)
>
> Pas de push, pas de merge dans `main`, pas de tag public sans décision de
> Pascal · aucune donnée personnelle réelle · aucun secret ni motif de clé
> (`[REDACTED]` dans les exemples) · aucune saisie de clé côté navigateur ·
> aucune mention de projet concurrent ni de l'ancien nom écarté · positionnement
> **onboarding documentaire, pas SIRH, pas quasi-SIRH** (inchangé) · **port 3010**
> · `CDH_CONFIG`, 7 modes IA, sémantique `MODEL_PROVIDER` inchangés · regex de
> `src/lib/guardrails.ts` et mentions obligatoires **intouchées** · `git mv` pour
> tout déplacement · YAML par `js-yaml.dump`, frontmatter par `gray-matter` ·
> **modèle `claude-opus-4-8` obligatoire**, aucune substitution silencieuse.
>
> ## E. Reprise Lot 3 — « Couche déterministe réutilisable et scripts »
>
> **Spec d'autorité : `specs/spec-scripts-deterministes.md` (§0 à §8).**
> Backlog : `specs/backlog-implementation.md` § Lot 3. Tout est reproductible
> (même entrée → même sortie), en français, **sans réseau, sans secret, sans
> appel au modèle** (frontière stricte : rien de ce qu'un script garantit n'est
> délégué à l'IA).
>
> ### E.1 Objectif
>
> Produire `scripts/lib/` (dont `scripts/lib/atelier/` = logique des 15 étapes
> consommée plus tard par l'API du Lot 5a, le CLI et les tests) **et** implémenter
> les 8 scripts : interview CLI, scaffold, 3 validateurs (corpus, guardrails,
> provider), rapport de gouvernance, régénération démo (squelette), + refonte de
> l'orchestrateur `validate-harness`.
>
> ### E.2 Fichiers à créer
>
> - `scripts/lib/motifs-interdits.mjs` — regex interdites (courriel plausible hors
>   `exemple.fr`, téléphone, NIR, IBAN, motif de clé), **extraites de
>   `tests/structure/structure.test.ts`** (source unique ; adapter le test pour
>   les importer — zéro divergence) ;
> - `scripts/lib/manifeste.mjs` — lecture/écriture du manifeste (js-yaml), **seul
>   point d'écriture** du `harnais.yaml` ; mêmes règles que `src/lib/manifest.ts`
>   (si le partage du schéma zod TS est impraticable en `.mjs`, dupliquer + prévoir
>   un test de non-divergence au Lot 7) ;
> - `scripts/lib/diagnostic-env.mjs` — **seulement si** l'import de
>   `src/lib/model/diagnostic.ts` depuis un `.mjs` pose problème : y extraire la
>   logique, importée des deux côtés (repli déjà arbitré par la spec §5) ;
> - `scripts/lib/atelier/etapes.mjs` — définition déclarative des 15 étapes (id,
>   libellé **verbatim PRD v0.3 §4**, skill associée, questions, validations de
>   forme, fichiers produits) ;
> - `scripts/lib/atelier/reponses.mjs` — validation d'une réponse (dates
>   `AAAA-MM-JJ`, heuristique anti-« Prénom Nom », slug `[a-z0-9-]+`, minimums
>   comme les 3 refus de l'étape 8) + application au manifeste/fichiers ;
> - `scripts/lib/atelier/actions.mjs` — exécution des actions déterministes d'une
>   étape → `{ ok, erreurs, avertissements, fichiers }` ;
> - `scripts/interview-harness.mjs` (spec §1) ;
> - `scripts/scaffold-harness.mjs` (spec §2) ;
> - `scripts/validate-corpus.mjs` (spec §3) ;
> - `scripts/validate-guardrails.mjs` (spec §4) ;
> - `scripts/validate-provider-config.mjs` (spec §5) ;
> - `scripts/build-harness-report.mjs` (spec §6) ;
> - `scripts/generate-onboarding-demo.mjs` (spec §7 — **squelette** modes
>   vérification/écriture ; son contenu de référence `scripts/demo/` arrive au
>   Lot 4) ;
> - `templates/cases/documentaire/reponses-demo.yaml` — réponses du mode `--demo`
>   de l'interview (ce qui rend l'interview testable en CI, sans TTY).
>
> ### E.3 Fichiers à modifier
>
> - `scripts/validate-harness.mjs` → **orchestrateur** (spec §8) : manifeste →
>   `validate-corpus` → `validate-guardrails` → `validate-provider-config` (non
>   bloquant) → contrôles config/manifeste. **Signature CLI actuelle conservée.**
>   Les contrôles corpus actuels migrent dans `validate-corpus` — **dresser la
>   liste avant/après dans `docs/RECETTE.md` pour prouver qu'aucun contrôle n'est
>   perdu.**
> - `package.json` → ajouter exactement ces 7 scripts npm (§en-tête de la spec) :
>   ```json
>   "interview": "node scripts/interview-harness.mjs",
>   "scaffold": "node scripts/scaffold-harness.mjs",
>   "validate-corpus": "node scripts/validate-corpus.mjs",
>   "validate-guardrails": "node scripts/validate-guardrails.mjs",
>   "validate-provider": "node scripts/validate-provider-config.mjs",
>   "rapport": "node scripts/build-harness-report.mjs",
>   "generate-demo": "node scripts/generate-onboarding-demo.mjs"
>   ```
>   ⚠️ `generate-demo` **change de cible** (pointe désormais vers
>   `generate-onboarding-demo.mjs`). **Ne pas** supprimer `scripts/generate-demo.mjs`
>   au Lot 3 : les deux coexistent jusqu'au Lot 4. Bien vérifier que la clé npm
>   `generate-demo` reste unique dans `package.json` (remplacement, pas doublon).
> - `tests/structure/structure.test.ts` → importer `motifs-interdits.mjs` au lieu
>   de redéfinir les regex localement.
>
> ### E.4 Ordre de réalisation recommandé
>
> 1. **`scripts/lib/` d'abord** (motifs → manifeste → diagnostic si besoin →
>    `atelier/`) : tout le reste s'appuie dessus. Adapter `tests/structure/`.
> 2. **Validateurs** (`validate-corpus`, `validate-guardrails`,
>    `validate-provider-config`) : implémenter **tous** les contrôles listés
>    (spec §3, §4, §5), codes de sortie 0/1/2, `--json`, messages FR préfixés du
>    fichier fautif.
> 3. **Orchestrateur** `validate-harness.mjs` (spec §8) + liste avant/après des
>    contrôles migrés dans la RECETTE.
> 4. **`scaffold-harness.mjs`** : substitution `{{...}}`, idempotence, `--dry-run`,
>    `--force` avec `.avant-force.bak`, refus d'écraser `onboarding-agents` sans
>    `--force`.
> 5. **`interview-harness.mjs`** (le plus gros morceau — le découper par étape) :
>    enveloppe **mince** autour de `scripts/lib/atelier/`, aucune logique dupliquée ;
>    15 étapes, valeurs par défaut `[…]`, récap `o/N`, reprise via `etat.etape`,
>    refus d'éligibilité (étape 1) **en code 0**, heuristique anti-« Prénom Nom »,
>    étapes 10/13/14/15 **affichent** la commande sans l'exécuter, mode `--demo`
>    lisant `reponses-demo.yaml`.
> 6. **`build-harness-report.mjs`** : agrège les `--json` des 3 validateurs, date
>    d'horloge **confinée à l'en-tête** (seule non-reproductibilité admise),
>    mention « ne vaut pas validation juridique ».
> 7. **`generate-onboarding-demo.mjs`** en squelette (modes vérif/écriture, pas de
>    contenu dense).
> 8. Vérif finale : `--help` sur chaque script, aucun réseau, aucun secret lu, code
>    2 sur invocation invalide. **Cohérence skills ↔ scripts dans les deux sens**
>    (chaque `scripts_associes` des 8 skills existe désormais ; chaque script est
>    référencé par au moins une skill) — c'est une exigence de fin de Lot 3.
>
> ### E.5 Contrôles d'acceptation (backlog Lot 3)
>
> - [ ] les 7 scripts npm répondent à `--help` ;
> - [ ] les fonctions de `scripts/lib/atelier/` sont importables **sans TTY**
>       (test d'import direct) — condition du Lot 5a ;
> - [ ] `npm run interview -- --demo` déroule les 15 étapes, sort en **0**, produit
>       des fichiers dans un cas jetable ;
> - [ ] `npm run scaffold -- --cas essai --dry-run` liste sans créer ; `… --cas
>       essai` crée ; relancé → « conservé » (rien détruit) ; `--force` →
>       `.avant-force.bak` ;
> - [ ] `npm run validate-corpus -- --cas onboarding-agents` vert (avertissements
>       « source maigre » **admis** jusqu'au Lot 4, corpus à 6 sources) ;
> - [ ] `npm run validate-guardrails -- --cas onboarding-agents` exécute ses 6
>       contrôles (écarts **admis** jusqu'au Lot 7, mais **nommés** correctement) ;
> - [ ] `MODEL_API_KEY=fausse-valeur-test npm run validate-provider` : la chaîne
>       n'apparaît **pas** dans la sortie (grep → 0) ;
> - [ ] `npm run rapport -- --cas onboarding-agents` produit
>       `cases/onboarding-agents/rapport-gouvernance.md` avec la mention juridique ;
> - [ ] `npm run validate-harness` garde sa sémantique et agrège les
>       sous-validateurs ; code 1 si erreur bloquante ;
> - [ ] deux exécutions successives de chaque validateur → même sortie (hors date
>       d'en-tête) ;
> - [ ] `npm test` **36/36** et `npm run build` (21 routes) restent verts.
>
> ### E.6 Commandes de test (copiables)
>
> ```bash
> for s in interview scaffold validate-corpus validate-guardrails validate-provider rapport generate-demo; do
>   npm run $s -- --help >/dev/null && echo "$s: --help OK"; done
> npm run interview -- --demo
> npm run scaffold -- --cas essai --dry-run && npm run scaffold -- --cas essai
> npm run validate-corpus -- --cas onboarding-agents
> npm run validate-guardrails -- --cas onboarding-agents
> MODEL_API_KEY=fausse-valeur-test npm run validate-provider | grep -c "fausse-valeur-test"  # attendu : 0
> npm run rapport -- --cas onboarding-agents
> npm run validate-harness && npm test && npm run build
> git clean -n   # relever le cas jetable "essai" AVANT commit, puis le supprimer
> ```
>
> ### E.7 Pièges connus
>
> - **Interop TS/ESM** (`diagnostic.ts` importé depuis un `.mjs`) : repli déjà
>   arbitré → extraire dans `scripts/lib/diagnostic-env.mjs`. L'appliquer sans
>   hésiter, ne pas s'acharner sur l'import direct.
> - **Divergence regex scripts/tests** : passer par `scripts/lib/motifs-interdits.mjs`,
>   ne jamais copier-coller les regex.
> - **Écriture concurrente du manifeste** (interview vs scaffold) : un seul point
>   d'écriture, `scripts/lib/manifeste.mjs`.
> - **Interview volumineuse** : la découper en modules par étape, sinon illisible.
> - **`generate-demo` dans `package.json`** : cible remplacée mais **`generate-demo.mjs`
>   pas supprimé** avant le Lot 4 ; vérifier l'unicité de la clé npm.
> - **Cas jetable `essai`** : le nettoyer (`git clean`) avant le commit du lot ; ne
>   pas polluer le dépôt.
> - **Refus d'éligibilité (étape 1)** : c'est un **succès** du cadre → code 0, pas
>   une exception ni une erreur.
>
> ### E.8 Non-objectifs du Lot 3
>
> - Aucun appel au modèle nulle part (frontière stricte) ;
> - pas de contenu de démo dense (Lot 4) ; pas d'OCR ni de conversion PDF ;
> - **ne pas** supprimer `scripts/generate-demo.mjs` (attend le Lot 4) ;
> - pas d'API `/api/fabrique/*` ni de sous-routes d'atelier (Lot 5a) ;
> - pas de nouvelles sources, pas de bascule d'organisation (Lot 4).
>
> ### E.9 Découpage si le contexte approche 50 %
>
> Le backlog scinde déjà le Lot 3 en deux sessions : **S3 = tout sauf l'interview**
> (libs partagées + 3 validateurs + scaffold + rapport + orchestrateur + squelette
> demo), **S4 = l'interview** (le script le plus long, avec `--demo` testable). Si
> `/context` approche 50 % : finir proprement l'unité en cours, laisser
> l'application **verte** (les scripts non finis n'empêchent pas `npm test`/`build`),
> **écrire un handoff de mi-lot dans `docs/RECETTE.md`** (tâches faites / restantes,
> fichiers créés, prochain script à écrire), commiter en l'état sur la branche, et
> s'arrêter. La reprise est conçue pour être possible à tout point inter-script.
>
> ## F. Instruction pour la prochaine session (après `/clear`)
>
> 1. Lire `specs/README.md`, `specs/spec-scripts-deterministes.md`, la section
>    Lot 3 du backlog, puis ce bloc.
> 2. Confirmer l'état : `git status --short --branch` (attendu : `refonte-fabrique`,
>    working tree propre hors `claude-code-runs/`), `git log --oneline -6`.
> 3. Rejouer les vérifications §C **avant** toute modification.
> 4. Piloter avec **`/goal`** (objectif du lot) et **`/loop`** (unités d'œuvre :
>    après chaque script → conformité spec, anti-SIRH, absence de secret/PII,
>    tests/build).
> 5. Surveiller **`/context`** ; écrire un handoff de mi-lot dans `docs/RECETTE.md`
>    dès **50 %**.
> 6. **Vérifier réellement** chaque affirmation (exécuter les commandes, ne pas
>    recopier des chiffres « attendus »).
> 7. Consigner le Lot 3 dans `docs/RECETTE.md` (date, commandes, résultats, écarts,
>    liste avant/après des contrôles migrés dans l'orchestrateur).
> 8. **Commit local** par lot/demi-lot, message français conventionnel. **Aucun
>    push, aucun merge.**
>
> **Ne pas commencer le Lot 4 (corpus dense) avant que le Lot 3 soit vert.**

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

## 2. État Git local (vérifié) — HISTORIQUE V1

> ⚠️ **Section historique (pré-refonte).** Elle décrit l'état de `main` au moment
> de la publication V1. **Pour la refonte en cours, c'est le bloc de reprise en
> tête de fichier (§A) qui fait foi : la branche de travail est `refonte-fabrique`,
> pas `main`.** Ne pas revenir sur `main` en croyant ce paragraphe d'actualité.

- **Branche courante (au moment de la V1) :** `main`.
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
│  └─ cases/onboarding-agents/  sources/ fiches/ parcours/ quiz/ checklist.md
│                            (gouvernance + tests déplacés sous cases/onboarding-agents/)
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
npm run dev               # http://localhost:3010
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
