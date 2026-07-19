# Comptoir des Harnais

**Un harnais IA pour acteurs publics — comprendre, tester, adapter, gouverner.**

Comptoir des Harnais est un dépôt open source qui explique ce qu’est un **harnais d’IA** et fournit un premier exemple fonctionnel : une **application web d’onboarding RH documentaire**, sourcée, configurable et gouvernée.

Il s’adresse aux collectivités, établissements publics locaux, opérateurs publics numériques, DSI, DPO, RSSI, DRH, DGS/DGA et directions métiers qui veulent dépasser la démonstration IA fragile pour travailler sur des usages vérifiables.

![Statut : prototype de démonstration](https://img.shields.io/badge/statut-prototype%20de%20d%C3%A9monstration-1F519B)
![Langue : français](https://img.shields.io/badge/langue-fran%C3%A7ais-1F519B)
![Node ≥ 20](https://img.shields.io/badge/Node-%E2%89%A5%2020-112D4A)
![Next.js 15](https://img.shields.io/badge/Next.js-15-112D4A)
![Code : EUPL 1.2](https://img.shields.io/badge/code-EUPL%201.2-FDC948)
![Contenus : CC BY-SA 4.0](https://img.shields.io/badge/contenus-CC%20BY--SA%204.0-FDC948)

---

## En 30 secondes

Un prompt isolé ne suffit pas à produire un usage public responsable. Un **harnais IA** rassemble :

- un besoin métier clair ;
- des sources identifiées, datées et versionnées ;
- des règles de réponse ;
- des garde-fous testés ;
- des responsabilités visibles ;
- des preuves affichées à l’utilisateur.

La V1 montre ce principe avec un portail documentaire RH fictif : parcours nouvel arrivant, fiches, FAQ sourcée, quiz, checklist, sources, limites, gouvernance et configuration IA.

**Tout fonctionne en local, sans compte, sans base de données, sans clé API et sans appel réseau par défaut.**

---

## Ce que ce projet est — et n’est pas

### Il est

- un **commun numérique pédagogique** ;
- une application locale de démonstration ;
- un modèle de dépôt réplicable ;
- un exemple de séparation entre code, contenus, sources et gouvernance ;
- un support de discussion avec DSI, DPO, RSSI, directions métiers et décideurs.

### Il n’est pas

- un logiciel de gestion RH ;
- un SIRH ou quasi-SIRH ;
- un outil de dossier agent ;
- un système de décision individuelle ;
- une preuve de conformité RGPD, AI Act ou sécurité ;
- une incitation à envoyer des données personnelles vers un modèle.

L’application **refuse les questions sur des personnes identifiables**. Ce refus est testé automatiquement.

---

## Démarrage rapide

### Prérequis

- Node.js 20 ou plus ;
- npm ;
- une machine Linux, macOS ou Windows.

Aucun service externe n’est requis en mode démo.

### Installation

```bash
git clone https://github.com/pchevallot/comptoir-des-harnais.git
cd comptoir-des-harnais

# Optionnel en mode démo ; utile pour configurer un fournisseur IA
cp .env.example .env.local

npm install
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

### Vérifier l’installation

```bash
npm test
npm run build
npm run validate-harness
```

Résultat attendu à l’état actuel du dépôt : tests verts, build Next.js OK, harnais cohérent.

---

## Parcours de démonstration en 5 minutes

1. Ouvrir `/` : promesse, statut prototype, données fictives.
2. Ouvrir `/faq` et poser : « Combien de jours de télétravail sont possibles ? » — la réponse cite sa source.
3. Poser une question individuelle : « Est-ce que Madame Martin a droit au télétravail ? » — l’application refuse.
4. Ouvrir `/sources`, `/limites`, `/gouvernance` — preuves, limites, responsabilités.
5. Ouvrir `/configuration-ia` — voir le mode IA actif et les implications sécurité/souveraineté.
6. Ouvrir `/sources/adapter` — comprendre comment remplacer les sources fictives par celles d’une organisation.

---

## Adapter ses sources

Une collectivité peut partir de ses documents habituels : Word, PDF, LibreOffice, pages intranet.

Mais le format canonique intégré au harnais est volontairement plus sobre : **Markdown ou texte relu, avec métadonnées**.

Pourquoi :

- lisible sans outil propriétaire ;
- versionnable ;
- contrôlable ;
- plus facile à relire par un métier, un DPO ou une DSI ;
- moins risqué qu’un dépôt opaque de PDF ou de fichiers bureautiques.

La V1 ne fournit pas d’OCR robuste. Une conversion depuis PDF scanné doit être relue intégralement avant intégration.

Guide détaillé : [`docs/adapter-ses-sources.fr.md`](./docs/adapter-ses-sources.fr.md)

---

## Configuration IA

Le mode par défaut est :

```text
MODEL_PROVIDER=local
```

Il utilise une recherche documentaire locale déterministe : **aucune clé, aucun appel réseau, aucune donnée envoyée à un tiers**.

Modes prévus :

| Mode | Clé requise | Réseau | Usage typique |
|---|---:|---:|---|
| `local` | non | non | démonstration, tests, sobriété maximale |
| `none` | non | non | désactiver la FAQ générative |
| `ollama` | non | oui, local | modèle local ou serveur interne |
| `anthropic` | oui | oui | fournisseur tiers |
| `openai` | oui | oui | fournisseur tiers |
| `openrouter` | oui | oui | passerelle multi-modèles |
| `mistral` | oui | oui | fournisseur européen tiers |

Les clés ne sont **jamais saisies dans une page web**. Elles doivent rester côté serveur, dans `.env.local` ou l’environnement d’exécution.

Exemple :

```bash
MODEL_PROVIDER=ollama
MODEL_BASE_URL=http://localhost:11434/v1
MODEL_NAME=llama3.1
```

Page dédiée : `/configuration-ia`.

---

## Structure du dépôt

```text
src/        application Next.js, moteur documentaire, garde-fous, fournisseurs IA
content/    sources, fiches, parcours, quiz et gouvernance de démonstration
configs/    configuration de la collectivité fictive ou d’une organisation
docs/       documentation pédagogique, architecture, cycle de vie, RGPD/AI Act
tests/      tests de comportement, garde-fous, structure, absence de secrets
scripts/    validation du harnais, génération démo, import de source
```

La règle centrale : **adapter les contenus ne doit pas demander de modifier le code**.

---

## Scripts utiles

| Commande | Usage |
|---|---|
| `npm run dev` | lancer l’application localement |
| `npm test` | vérifier garde-fous et structure |
| `npm run build` | construire la version production |
| `npm run validate-harness` | contrôler cohérence sources/fiches/gouvernance |
| `npm run import-source` | amorcer une source `.md` ou `.txt` déjà relue |

---

## Documentation

- Comprendre le concept : [`docs/comprendre-les-harnais.fr.md`](./docs/comprendre-les-harnais.fr.md)
- Architecture : [`docs/architecture.fr.md`](./docs/architecture.fr.md)
- Adapter ses sources : [`docs/adapter-ses-sources.fr.md`](./docs/adapter-ses-sources.fr.md)
- Cycle de vie : [`docs/cycle-de-vie.fr.md`](./docs/cycle-de-vie.fr.md)
- Gouvernance, RGPD, AI Act : [`docs/gouvernance-rgpd-ai-act.fr.md`](./docs/gouvernance-rgpd-ai-act.fr.md)
- Note décideur : [`docs/note-decideur.fr.md`](./docs/note-decideur.fr.md)
- Contribution : [`CONTRIBUTING.fr.md`](./CONTRIBUTING.fr.md)
- Licences : [`LICENSES.fr.md`](./LICENSES.fr.md)

---

## Sécurité et gouvernance

Principes appliqués dans la V1 :

- données fictives uniquement ;
- pas de données personnelles réelles ;
- pas de comptes utilisateurs ;
- pas de base de données ;
- secrets exclus du dépôt ;
- clés côté serveur uniquement ;
- refus des cas individuels ;
- réponses sourcées ;
- mention « ne vaut pas validation juridique » ;
- tests automatisés.

Ce dépôt aide à cadrer un usage. Il ne remplace pas une analyse DPO, RSSI, juridique ou métier.

---

## Licences

Ce projet applique une double licence :

- **Code logiciel** : [EUPL 1.2](./LICENSE) ;
- **Documentation, contenus pédagogiques, corpus fictifs et supports méthodologiques** : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.fr), sauf mention contraire.

Ce choix reflète l’intention du projet : produire un commun numérique réutilisable et améliorable, tout en protégeant la circulation des améliorations.

Détail : [`LICENSES.fr.md`](./LICENSES.fr.md)

---

## Feuille de route courte

- Vérification visuelle complète dans un navigateur disponible ;
- scénario vidéo public ;
- élargissement du corpus de démonstration ;
- durcissement des tests de questions pièges ;
- guides d’hébergement et de mutualisation pour opérateurs publics numériques.

---

## Maintenance

Projet porté par **Le Comptoir des Signaux / Pascal Chevallot**.

Pour reprendre le contexte technique détaillé :

- [`docs/HANDOFF.md`](./docs/HANDOFF.md) ;
- [`docs/RECETTE.md`](./docs/RECETTE.md).

---

## English summary

**Comptoir des Harnais** is an open source repository for public-sector organisations. It explains what an AI harness is and ships a working example: a sourced, governed, configurable documentary HR onboarding web application.

It runs locally by default, without database, account, API key or external network call. It is not an HRIS, not a case-management tool and not a decision system. It refuses questions about identifiable individuals and cites its sources.

Code is licensed under **EUPL 1.2**. Documentation and educational content are licensed under **CC BY-SA 4.0**, unless otherwise stated.
