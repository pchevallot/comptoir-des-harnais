# Comptoir des Harnais

**Une fabrique de harnais d'IA pour acteurs publics — elle vous pose les questions, elle produit votre harnais.**

Comptoir des Harnais est un dépôt open source qui explique ce qu'est un **harnais d'IA** et, surtout, en **fabrique** un : un atelier guidé vous interroge sur votre besoin, une question à la fois, génère la structure du harnais, contrôle vos sources et vos garde-fous par des scripts déterministes, puis assemble une **application locale sourcée et gouvernée**. Le premier harnais produit par la fabrique — le cas `onboarding-agents` — est livré complet : un portail d'accueil documentaire pour une collectivité fictive.

Il s'adresse aux collectivités, établissements publics locaux, opérateurs publics numériques (OPSN), DSI, DPO, RSSI, DRH, DGS/DGA et directions métiers qui veulent dépasser la démonstration IA fragile pour construire des usages vérifiables.

![Statut : prototype de démonstration](https://img.shields.io/badge/statut-prototype%20de%20d%C3%A9monstration-1F519B)
![Langue : français](https://img.shields.io/badge/langue-fran%C3%A7ais-1F519B)
![Node ≥ 20](https://img.shields.io/badge/Node-%E2%89%A5%2020-112D4A)
![Next.js 15](https://img.shields.io/badge/Next.js-15-112D4A)
![Code : EUPL 1.2](https://img.shields.io/badge/code-EUPL%201.2-FDC948)
![Contenus : CC BY-SA 4.0](https://img.shields.io/badge/contenus-CC%20BY--SA%204.0-FDC948)

---

## Un harnais n'est pas un prompt

Un **prompt** est une phrase tapée pour demander quelque chose à une IA : fragile, non reproductible, sans traçabilité de la réponse.

Un **harnais d'IA** est tout ce qu'on met autour pour qu'un usage soit utile, maintenable et gouverné :

- un besoin métier clair ;
- des sources identifiées, datées et versionnées ;
- des règles de réponse et des **refus testés** ;
- des responsabilités nommées (par fonction, jamais par personne) ;
- des preuves affichées à l'utilisateur.

**La fabrique** est l'atelier qui construit ce harnais avec vous : elle pose les questions qu'un accompagnateur poserait, et chaque réponse produit un fichier réel du dépôt (manifeste, gouvernance, corpus, tests).

---

## Le parcours de la fabrique en 15 étapes

```text
besoin → atelier → génération → corpus → validation → application → rapport
```

L'atelier conduit 15 étapes, mêmes intitulés dans le PRD, la page `/fabrique`, la documentation et les skills :

| # | Étape | # | Étape |
|---|---|---|---|
| 1 | Choisir le type de harnais | 9 | Choisir le fournisseur IA |
| 2 | Cadrer le besoin | 10 | Générer la structure |
| 3 | Décrire l'organisation | 11 | Importer/contrôler le corpus |
| 4 | Déclarer les sources | 12 | Générer/assembler l'application |
| 5 | Classer les données | 13 | Exécuter les tests |
| 6 | Définir les publics | 14 | Ouvrir l'application du cas |
| 7 | Questions autorisées | 15 | Produire le rapport de gouvernance |
| 8 | Définir les refus | | |

Chaque étape mobilise une **skill** (savoir-faire versionné sous `skills/<nom>/SKILL.md`) et un **script déterministe** (même entrée, même sortie ; aucun appel au modèle pour la structure, le contrôle ou la preuve). Détail : [`docs/cycle-de-vie.fr.md`](./docs/cycle-de-vie.fr.md).

---

## Démarrage rapide — la fabrique d'abord

### Prérequis

Node.js 20 ou plus, npm, une machine Linux, macOS ou Windows. Aucun service externe requis en mode démo.

### Installation

```bash
git clone https://github.com/pchevallot/comptoir-des-harnais.git
cd comptoir-des-harnais
npm install
```

### 1. Dérouler la fabrique sur un cas neuf

Le CLI de l'atelier déroule les 15 étapes, une question à la fois (mode démo non interactif, exécutable en CI) :

```bash
npm run interview -- --demo
```

Il produit un cas jouet (manifeste, gouvernance amorcée, tests) et sort en code 0. En mode réel (`npm run interview`), l'atelier vous interroge et écrit dans `cases/`, `content/cases/` et `configs/` — **jamais** de clé ni de secret, jamais dans `.env.local`.

Vous pouvez aussi **voir l'état de la fabrique dans le navigateur** :

```bash
npm run dev        # puis ouvrir http://localhost:3010/fabrique
```

`/fabrique` est un **tableau de bord en lecture seule** : il montre l'état réel du harnais `onboarding-agents` (étape franchie, statut, sources, fiches, modules) et les 15 étapes, chacune reliée à sa skill, son script et une preuve consultable. L'atelier guidé pas à pas dans le navigateur (saisie des réponses) est prévu pour un lot ultérieur ; en attendant, le circuit complet se joue par `npm run interview` puis `npm run validate-harness`.

### 2. Ouvrir l'application produite (cas `onboarding-agents`)

Le premier harnais complet est servi par la **même** application :

```bash
npm run dev        # puis ouvrir http://localhost:3010
```

C'est le portail d'accueil documentaire d'une collectivité fictive (**Syndicat mixte du Val de Brenne**) : parcours nouvel arrivant, fiches, FAQ sourcée, quiz, checklist, registre des sources, limites, gouvernance et configuration IA. **Tout fonctionne en local, sans compte, sans base de données, sans clé API et sans appel réseau par défaut.**

### 3. Vérifier le harnais

```bash
npm test                                              # garde-fous, structure, scripts
npm run build                                         # build Next.js
npm run validate-harness                              # cohérence corpus/garde-fous/config
npm run validate-corpus     -- --cas onboarding-agents
npm run validate-guardrails -- --cas onboarding-agents
```

État actuel du dépôt : **83 tests verts**, build OK, corpus **16 sources 0 erreur**, garde-fous **0 erreur**.

---

## Le cas `onboarding-agents` (résultat de la fabrique)

- **16 sources** fictives (`SRC-001` à `SRC-016`, frontmatter daté, propriétaires par fonction), **10 fiches**, **7 modules** de parcours, **14 questions** de quiz.
- Chaque réponse de la FAQ cite ses sources et leur date ; hors corpus, l'application répond « je ne sais pas ».
- L'application **refuse les questions sur une personne identifiable** (cas individuel, avis juridique, avis médical). Ce refus est **testé automatiquement**.
- Le contenu est réécrit depuis une référence versionnée : `npm run generate-demo` vérifie l'égalité octet à octet.

Adapter le portail à une autre organisation ne demande **aucune modification du code** : on édite YAML/Markdown sous `content/cases/<slug>/` et `configs/<slug>.yml`, puis on pointe la config vers le cas (`CDH_CONFIG=<slug>.yml`). Voir [`docs/adapter-ses-sources.fr.md`](./docs/adapter-ses-sources.fr.md) et la page in-app `/sources/adapter`.

---

## Ce que ce projet est — et n'est pas

**Il est** un commun numérique pédagogique, une fabrique locale de harnais, un exemple de séparation stricte code / contenus / sources / gouvernance, et un support de discussion avec DSI, DPO, RSSI et directions métiers.

**Il n'est pas** un logiciel de gestion RH, un SIRH ou quasi-SIRH, un outil de dossier agent, un système de décision individuelle, ni une preuve de conformité RGPD / AI Act / sécurité. Il porte la mention « ne vaut pas validation juridique ».

---

## Configuration IA

Le mode par défaut est `MODEL_PROVIDER=local` : recherche documentaire déterministe, **aucune clé, aucun appel réseau, aucune donnée envoyée à un tiers**. Sept modes sont pris en charge :

| Mode | Clé requise | Réseau | Usage typique |
|---|---:|---:|---|
| `local` | non | non | démonstration, tests, sobriété maximale |
| `none` | non | non | désactiver la FAQ générative |
| `ollama` | non | oui, local | modèle local ou serveur interne |
| `anthropic` | oui | oui | fournisseur tiers |
| `openai` | oui | oui | fournisseur tiers |
| `openrouter` | oui | oui | passerelle multi-modèles |
| `mistral` | oui | oui | fournisseur européen tiers |

Les clés ne sont **jamais saisies dans une page web** : elles restent côté serveur, dans `.env.local` ou l'environnement d'exécution, et ne sont jamais renvoyées au navigateur. Page dédiée : `/configuration-ia`.

```bash
MODEL_PROVIDER=ollama
MODEL_BASE_URL=http://localhost:11434/v1
MODEL_NAME=llama3.1
```

---

## Structure du dépôt

```text
src/            application Next.js, moteur documentaire, garde-fous, fournisseurs IA (TERRITOIRE CODE)
content/cases/  corpus par cas : sources, fiches, parcours, quiz, checklist (TERRITOIRE CONTENU)
cases/          décisions par cas : harnais.yaml (manifeste), gouvernance/, tests/, rapport
configs/        configuration active (demo.yml) et modèle commenté (organisation.example.yml)
skills/         8 skills de la fabrique (savoir-faire versionné, un SKILL.md par étape)
scripts/        atelier CLI + validateurs déterministes + couche partagée (scripts/lib/)
templates/      gabarits de cas généralisés ({{...}})
docs/           documentation pédagogique, architecture, cycle de vie, HANDOFF, RECETTE
specs/          spécifications de la refonte (PRD v0.3, architecture, backlog)
prd/            PRD historique (v0.2) conservé comme référence
tests/          garde-fous, structure, manifeste, scripts (fixtures négatives isolées)
```

Règle centrale : **le contenu métier vit dans `content/`, `cases/` et `configs/`, jamais dans `src/`.**

---

## Scripts npm

| Commande | Usage |
|---|---|
| `npm run dev` | lancer l'application et l'atelier localement (port 3010) |
| `npm run build` | construire la version production |
| `npm test` | garde-fous, structure, manifeste, scripts |
| `npm run interview` | dérouler l'atelier (15 étapes) ; `-- --demo` non interactif (CI) |
| `npm run scaffold` | générer l'arborescence d'un cas (`-- --cas <slug>`) |
| `npm run validate-corpus` | contrôler le corpus d'un cas (`-- --cas <slug>`) |
| `npm run validate-guardrails` | contrôler la couverture des refus (`-- --cas <slug>`) |
| `npm run validate-provider` | diagnostiquer le fournisseur IA (sans afficher de clé) |
| `npm run validate-harness` | orchestrateur : corpus + garde-fous + config |
| `npm run rapport` | produire le rapport de gouvernance (`-- --cas <slug>`) |
| `npm run generate-demo` | vérifier le cas démo vs sa référence ; `-- --ecrire` régénère |
| `npm run import-source` | amorcer une source `.md`/`.txt` déjà relue |

---

## Sécurité et gouvernance

Principes appliqués : données fictives uniquement ; aucune donnée personnelle réelle ; aucun compte ni base de données ; secrets exclus du dépôt et clés côté serveur uniquement ; refus des cas individuels ; réponses sourcées ; mention « ne vaut pas validation juridique » ; tests automatisés (dont non-fuite de clé et anti-motifs de secrets/PII). Ce dépôt aide à cadrer un usage ; il ne remplace pas une analyse DPO, RSSI, juridique ou métier. Voir [`docs/gouvernance-rgpd-ai-act.fr.md`](./docs/gouvernance-rgpd-ai-act.fr.md) et [`docs/architecture.fr.md`](./docs/architecture.fr.md) (threat model).

---

## Documentation

- Comprendre le concept : [`docs/comprendre-les-harnais.fr.md`](./docs/comprendre-les-harnais.fr.md)
- Cycle de vie (15 étapes) : [`docs/cycle-de-vie.fr.md`](./docs/cycle-de-vie.fr.md)
- Architecture et threat model : [`docs/architecture.fr.md`](./docs/architecture.fr.md)
- Adapter ses sources : [`docs/adapter-ses-sources.fr.md`](./docs/adapter-ses-sources.fr.md)
- Gouvernance, RGPD, AI Act : [`docs/gouvernance-rgpd-ai-act.fr.md`](./docs/gouvernance-rgpd-ai-act.fr.md)
- Note décideur : [`docs/note-decideur.fr.md`](./docs/note-decideur.fr.md)
- Reprise technique : [`docs/HANDOFF.md`](./docs/HANDOFF.md) · [`docs/RECETTE.md`](./docs/RECETTE.md)
- Contribution : [`CONTRIBUTING.fr.md`](./CONTRIBUTING.fr.md) · Licences : [`LICENSES.fr.md`](./LICENSES.fr.md)

---

## Licences

Double licence : **code** en [EUPL 1.2](./LICENSE) ; **documentation, contenus pédagogiques, corpus fictifs et supports méthodologiques** en [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr), sauf mention contraire. Ce choix reflète l'intention du projet : un commun numérique réutilisable et améliorable, protégeant la circulation des améliorations. Détail : [`LICENSES.fr.md`](./LICENSES.fr.md).

---

## Maintenance

Projet porté par **Le Comptoir des Signaux / Pascal Chevallot**. Pour reprendre le contexte technique : [`docs/HANDOFF.md`](./docs/HANDOFF.md) et [`docs/RECETTE.md`](./docs/RECETTE.md).

---

## English summary

**Comptoir des Harnais** is an open source **factory of AI harnesses** for public-sector organisations. A guided workshop interviews you about your need, one question at a time, generates the harness structure, checks your sources and guardrails with deterministic scripts, then assembles a local, sourced and governed web application. Its first output — the `onboarding-agents` case — is a complete documentary HR onboarding portal for a fictional local authority.

Everything runs locally by default: no database, no account, no API key, no external network call. It is **not** an HRIS, a case-management tool or a decision system. It refuses questions about identifiable individuals (a tested guardrail) and cites its sources. Run `npm run interview -- --demo` to walk the factory, `npm run dev` to open the produced application.

Code is licensed under **EUPL 1.2**; documentation and educational content under **CC BY-SA 4.0**, unless otherwise stated.
