# PRD v0.3 — Comptoir des Harnais, harnais-fabrique

| Champ | Valeur |
|---|---|
| Version | 0.3 — repositionnement « fabrique » (complète le PRD v0.2, ne le remplace pas ligne à ligne) |
| Date | 19 juillet 2026 |
| Phase | Spécification (aucun développement dans cette session) |
| Autorité | Ce document + `prd/PRD.md` (v0.2). En cas de conflit, v0.3 prime sur le positionnement et l'arborescence ; v0.2 reste l'autorité sur les exigences RGPD/AI Act/cybersécurité (§9) et les personas (§3). |
| Implémentation prévue | Opus 4.8, par lots (`specs/backlog-implementation.md`) |

---

## 1. Le problème que corrige cette version

L'état actuel du dépôt donne à voir **une webapp verticale déjà remplie** :
un portail d'onboarding qui fonctionne, avec ses sources, ses tests et sa
gouvernance. C'est solide, mais cela raconte l'histoire à l'envers. Un visiteur
en conclut « c'est une appli RH open source », alors que la promesse est :
**« c'est une fabrique qui vous guide pour construire, valider et gouverner
votre propre harnais — et voici le premier harnais qu'elle a produit »**.

Ce qui manque aujourd'hui, concrètement :

- aucun **guidage exécutable** : le parcours en 10 étapes du PRD v0.2 n'existe
  que dans la documentation ; rien n'interroge l'utilisateur ;
- aucune **génération** : on ne peut pas produire la structure d'un nouveau
  harnais autrement qu'en copiant des fichiers à la main ;
- des **skills implicites** : le savoir-faire (cadrer, classifier, concevoir
  les refus…) est dilué dans `docs/`, non activable étape par étape ;
- un **corpus trop maigre** (6 sources courtes) pour que la démonstration
  « FAQ sourcée sur un vrai fonds documentaire » soit crédible ;
- un **récit inversé** dans le README et sur la page d'accueil : l'application
  d'abord, la méthode ensuite.

## 2. Vocabulaire officiel (à employer partout, sans variation)

| Terme | Définition contractuelle |
|---|---|
| **Comptoir des Harnais** | La **fabrique pédagogique de harnais IA** pour acteurs publics : un dépôt qui interroge, guide, génère, valide et documente. C'est le produit. |
| **Harnais** | L'ensemble structuré produit par la fabrique pour un besoin métier donné : manifeste, corpus, règles, garde-fous, tests, gouvernance, application. Matérialisé par un dossier `cases/<slug>/`. |
| **Cas d'usage `onboarding-agents`** | Le **premier harnais vertical** produit par la fabrique : accueil documentaire des nouveaux agents d'un syndicat mixte ou d'une collectivité. Strictement documentaire. |
| **Application web** | La **sortie** assemblée par le harnais (`src/app` + contenu du cas). Ce n'est pas le cœur conceptuel : c'est la preuve visible. |
| **Skill** | Un savoir-faire procédural du projet, fichier `skills/<nom>/SKILL.md`, activé à une étape précise du parcours. Une skill pose des questions, produit des fichiers, connaît ses refus. |
| **Script déterministe** | Un programme Node (`scripts/*.mjs`) reproductible : scaffolding, validations, génération de fichiers, rapport. Même entrée → même sortie. Rien de ce qu'un script garantit n'est délégué au modèle. |
| **Corpus** | La matière documentaire du cas : sources Markdown fictives, denses et réalistes, avec frontmatter complet (`content/cases/<slug>/sources/`). |
| **Tests** | La preuve que le harnais tient ses promesses : refus, sourçage, mentions, structure, absence de secrets. `npm test` + validateurs. |

Formulation d'accroche retenue (README, accueil, vidéo) :

> **Comptoir des Harnais est une fabrique pédagogique de harnais IA pour
> acteurs publics. Elle vous interroge sur votre besoin, génère la structure de
> votre harnais, contrôle vos sources et vos garde-fous, puis assemble une
> application locale sourcée et gouvernée. Premier harnais produit :
> l'accueil documentaire des nouveaux agents.**

## 3. Ce qui change à l'accueil et dans le README

### README (`README.md`)

- Le titre et les 30 premières lignes présentent **la fabrique**, pas le
  portail. Nouvel ordre : ① définition de la fabrique et du harnais,
  ② le parcours en 15 étapes en un schéma texte (`besoin → interview →
  génération → corpus → validation → application → rapport`), ③ démarrage
  rapide **de la fabrique** (`npm run interview`), ④ le cas `onboarding-agents`
  comme résultat, avec son propre démarrage (`npm run dev`), ⑤ le reste
  (configuration IA, licences, gouvernance) inchangé sur le fond.
- Le « Parcours de démonstration en 5 minutes » devient un parcours **fabrique
  d'abord** : lancer l'interview sur un cas jouet, montrer la génération, puis
  seulement ouvrir l'application du cas complet.
- La section « Structure du dépôt » adopte l'arborescence cible
  (`cases/`, `skills/`, `content/cases/`), voir architecture.

### Accueil de l'application (`/`)

- L'accueil du portail reste l'accueil **du cas** (c'est l'application d'une
  collectivité fictive), mais il gagne un bandeau sobre : « Ce portail a été
  produit par la fabrique Comptoir des Harnais — voir comment » pointant vers
  la nouvelle page `/fabrique`.
- Nouvelle page **`/fabrique`** (statique, lecture seule) : les 15 étapes, ce
  que chacune a produit pour ce cas (fichiers réels, liens vers `/sources`,
  `/gouvernance`, `/limites`), l'état du manifeste (`etat.etape`,
  `harnais.statut`). Aucune action possible depuis le navigateur : la fabrique
  se manipule en CLI. C'est un choix de sécurité (pas d'écriture de fichiers
  depuis le web) autant que de sobriété.

## 4. Parcours guidé en 15 étapes

Le parcours est porté par `scripts/interview-harness.mjs` (une question à la
fois, langage métier, réponse proposée par défaut, reprise possible à tout
moment). Chaque étape est journalisée dans le manifeste
`cases/<slug>/harnais.yaml` (`etat.etape`). Conventions du tableau détaillé :
« Preuve » = ce qui est visible dans l'application finale.

| # | Étape | Skill | Script | Fichiers produits/modifiés |
|---|---|---|---|---|
| 1 | Choisir le type de harnais | `cadrer-besoin-public` | `interview-harness` | `harnais.yaml` (`type`) |
| 2 | Cadrer le besoin | `cadrer-besoin-public` | `interview-harness` | `gouvernance/fiche-besoin.md`, `harnais.yaml` (`besoin`) |
| 3 | Décrire l'organisation | `cadrer-besoin-public` | `interview-harness` | `configs/<slug>.yml` (`organisation`) |
| 4 | Déclarer les sources | `classifier-sources` | `interview-harness` | `harnais.yaml` (`sources_declarees`) |
| 5 | Classer les données | `classifier-sources` | `interview-harness` | `gouvernance/classification.md` |
| 6 | Définir les publics | `cadrer-besoin-public` | `interview-harness` | `harnais.yaml` (`publics`) |
| 7 | Questions autorisées | `concevoir-garde-fous` | `interview-harness` | `tests/comportement.yaml` (cas « réponse attendue ») |
| 8 | Définir les refus | `concevoir-garde-fous` | `interview-harness` | `gouvernance/limites-refus.md`, `tests/comportement.yaml` (cas « refus ») |
| 9 | Choisir le fournisseur IA | `configurer-fournisseur-ia` | `validate-provider-config` | `.env.local` (manuel), `harnais.yaml` (`fournisseur.mode`) |
| 10 | Générer la structure | — | `scaffold-harness` | arborescence `cases/<slug>/` + `content/cases/<slug>/` complètes |
| 11 | Importer/contrôler le corpus | `adapter-corpus-onboarding` | `import-source`, `validate-corpus` | `content/cases/<slug>/sources/*.md` |
| 12 | Générer/assembler l'application | — | `generate-onboarding-demo` (démo) ou branchement config (cas réel) | `configs/<slug>.yml` (`cas`), contenu servi par `src/app` |
| 13 | Exécuter les tests | `generer-tests-harnais` | `npm test`, `validate-guardrails` | rapport de tests |
| 14 | Lancer localement | — | `npm run dev` | application sur `http://localhost:3010` |
| 15 | Produire le rapport de gouvernance | `verifier-securite-rgpd` | `build-harness-report` | `cases/<slug>/rapport-gouvernance.md` |

### Détail étape par étape

**Étape 1 — Choisir le type de harnais.**
Question : « Votre besoin est-il plutôt “expliquer et transmettre” (harnais
documentaire) ou “observer et synthétiser” (harnais d'observation, prévu plus
tard) ? Le résultat doit-il être identique pour tous les lecteurs ? »
Réponses attendues : `documentaire` (seul type implémenté en V2 ; choisir
`observation` affiche « prévu, non disponible » et arrête proprement). Une
réponse « adapté à des situations individuelles » déclenche un **refus
d'éligibilité** avec renvoi vers `gouvernance/limites-refus.md` — le parcours
s'arrête, c'est un comportement voulu et filmable.
Preuve dans l'application : le type est affiché sur `/fabrique` et `/gouvernance`.

**Étape 2 — Cadrer le besoin.**
Questions (une à la fois) : tâche répétée et fréquence ; qui la fait, combien de
temps ; conséquence quand elle est mal faite ; qui consomme le résultat ; à quoi
verrait-on qu'elle est bien outillée. Réponses : texte libre court, reformulé et
confirmé (« Voici la fiche besoin que je vais écrire — d'accord ? o/N »).
Fichiers : `gouvernance/fiche-besoin.md` (une page), champ `besoin` du manifeste.
Preuve : l'accueil du portail énonce ce besoin mot pour mot.

**Étape 3 — Décrire l'organisation.**
Questions : nom (fictif ou réel), type (commune, EPCI, syndicat mixte, CDG,
OPSN…), caractère fictif o/n, fonctions de gouvernance (responsable métier,
DPO, DSI/RSSI — **des fonctions, jamais des noms de personnes** ; l'interview
refuse une réponse qui ressemble à « Prénom Nom »). Fichier :
`configs/<slug>.yml`. Preuve : en-tête du portail et page `/gouvernance`.

**Étape 4 — Déclarer les sources.**
Questions, en boucle jusqu'à « terminé » : titre du document existant ;
fonction propriétaire ; date de dernière mise à jour connue ; que faire si deux
sources se contredisent (réponse guidée : la plus récente du propriétaire le
plus légitime, tracée au registre). Sortie : `sources_declarees` dans le
manifeste (liste titre/propriétaire/date), qui servira de **liste de contrôle**
à l'étape 11 (le validateur signale toute source déclarée non importée et
inversement). Preuve : page `/sources` (registre).

**Étape 5 — Classer les données.**
Questions : vos sources contiennent-elles des noms, situations individuelles,
éléments de santé, éléments RH nominatifs ? (oui → la source est marquée
`ineligible` avec renvoi DPO ; l'interview continue sans elle). Classification
retenue par source : `publique` ou `interne` uniquement. Fichier :
`gouvernance/classification.md`. Preuve : `/gouvernance` (classification) et
frontmatter de chaque source.

**Étape 6 — Définir les publics.**
Questions : qui lira (nouveaux agents, encadrants, tous agents) ; faut-il un
parcours ordonné, une FAQ, un quiz, une checklist (o/n pour chaque module).
Sortie : `publics` et `modules` dans le manifeste — l'application n'affiche que
les modules retenus. Preuve : la navigation du portail reflète exactement ces
choix.

**Étape 7 — Définir les questions autorisées.**
Question : « Quelles sont les cinq questions que votre public pose vraiment ? »
Pour chacune : quelle source doit répondre (choix dans `sources_declarees`),
quels mots doivent apparaître dans la réponse. Sortie : cinq cas
`type: comportement` avec `doit_citer_source` dans
`cases/<slug>/tests/comportement.yaml`. Preuve : ces questions sont proposées
comme suggestions sur `/faq`, et testées par `npm test`.

**Étape 8 — Définir les refus.**
Le socle non négociable est affiché (cas individuels, avis juridique/médical,
affirmation sans source, promesse de droit) puis : « Dans votre métier, quelles
questions ne doivent jamais recevoir de réponse automatique ? Vers quelle
fonction renvoyer ? » Sortie : `gouvernance/limites-refus.md` + au minimum
**trois cas de refus** dans `comportement.yaml` (l'interview refuse de passer à
l'étape suivante en dessous de trois). Preuve : `/limites`, et le refus en
direct dans la FAQ.

**Étape 9 — Choisir le fournisseur IA.**
Question : « local (rien ne sort du poste), Ollama (modèle chez vous), ou API
tierce (à instruire avec le DPO) ? » L'interview écrit `fournisseur.mode` dans
le manifeste et **affiche** les lignes `.env.local` à écrire — elle n'écrit
jamais de clé, ne demande jamais de clé, ne lit jamais de clé. Contrôle :
`node scripts/validate-provider-config.mjs` (statut sans valeur de secret).
Preuve : `/configuration-ia`.

**Étape 10 — Générer la structure.**
Aucune question : `scaffold-harness` matérialise `cases/<slug>/` et
`content/cases/<slug>/` depuis `templates/`, pré-remplis avec tout ce que
l'interview a collecté. Idempotent : relancer ne détruit jamais un fichier
modifié (voir spec scripts). Preuve : l'arborescence existe, montrable au
terminal ; `/fabrique` passe l'étape à 10.

**Étape 11 — Importer et contrôler le corpus.**
L'utilisateur convertit et relit ses documents (guide existant
`docs/adapter-ses-sources.fr.md`), les amorce avec `import-source`, puis
`validate-corpus` contrôle : frontmatter complet, identifiants uniques,
classification autorisée, longueur minimale, motifs interdits (courriel
plausible, téléphone, NIR, nom propre suspect), correspondance avec
`sources_declarees`. Preuve : `/sources` liste le registre réel, daté.

**Étape 12 — Générer ou assembler l'application.**
Pour le cas de démonstration : `generate-onboarding-demo` (ré)génère le corpus
complet. Pour un cas réel : rien à générer côté code — la config
`configs/<slug>.yml` (champ `cas: <slug>`) suffit, `CDH_CONFIG=<slug>.yml`
sélectionne le cas. C'est l'engagement historique du projet : **assembler une
application = pointer une config vers un contenu**, jamais toucher `src/`.
Preuve : l'application affiche l'identité et le contenu du cas.

**Étape 13 — Exécuter les tests.**
`npm test` (comportement + structure) et `validate-guardrails` (couverture :
chaque refus déclaré à l'étape 8 a son cas de test ; chaque question de
l'étape 7 aussi). Preuve : rapport en français, vert, filmable.

**Étape 14 — Lancer localement.**
`npm run dev` → `http://localhost:3010`. Démonstration type : une question
sourcée (« Combien de jours de télétravail sont possibles ? » → réponse citant
SRC-003), une question refusée (« Est-ce que Madame Martin a droit au
télétravail ? » → refus courtois, renvoi service RH).

**Étape 15 — Produire le rapport de gouvernance.**
`build-harness-report` agrège manifeste, registre des sources, classification,
refus, mode IA, résultats de validation, et écrit
`cases/<slug>/rapport-gouvernance.md` : le document qu'on remet au DPO/DSI/DGS.
Preuve : le rapport est versionné et référencé sur `/gouvernance`.

## 5. Non-objectifs de la refonte

1. Pas de seconde application web « fabrique » : le guidage est en CLI.
2. Pas de génération de code par le modèle : `src/` reste écrit et versionné ;
   « générer une application » = générer structure + contenus + configuration.
3. Pas d'élargissement du périmètre RH : tout le corpus reste documentaire,
   les non-objectifs du PRD v0.2 §2.2 s'appliquent intégralement.
4. Pas de dépendance à des skills externes au dépôt.
5. Pas de base de données, pas de compte, pas de réseau par défaut : inchangé.
6. Pas de second type de harnais implémenté (`observation` reste annoncé).

## 6. Critères d'acceptation de la refonte

- [ ] `npm run interview` conduit les 15 étapes sur un cas neuf, avec reprise
      après interruption, sans jamais demander ni écrire de secret ;
- [ ] `npm run scaffold -- --cas essai` produit une arborescence valide que
      `npm run validate-harness -- --cas essai` sait évaluer (échec attendu
      tant que le corpus est vide, avec messages explicites) ;
- [ ] le cas `onboarding-agents` compte 16 sources conformes à
      `specs/spec-corpus-onboarding.md`, et `npm test` reste vert ;
- [ ] chaque skill de `specs/spec-skills.md` existe dans `skills/` et est citée
      par l'étape du parcours qui l'active ;
- [ ] la page `/fabrique` existe et reflète l'état réel du manifeste ;
- [ ] le README raconte la fabrique d'abord ; le mot « fabrique » apparaît
      avant toute description du portail RH ;
- [ ] chaque plan de `specs/spec-parcours-video.md` correspond à un élément
      réellement exécutable du dépôt.
