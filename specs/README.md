# Specs — Refonte « harnais-fabrique » (V1.5 / V2)

Spécifications de repositionnement de **Comptoir des Harnais** : faire du dépôt
un **harnais / une fabrique pédagogique de harnais**, dont l'application web
d'onboarding devient le **premier cas d'usage généré, assemblé et gouverné** —
et non plus le sujet principal.

Rédigé le 2026-07-19 (session de spécification Fable 5). Aucun code applicatif
n'est modifié par cette session : la sortie est documentaire. L'implémentation
est prévue pour des sessions Opus 4.8, par lots (voir backlog).

## Ordre de lecture

| # | Fichier | Contenu |
|---|---|---|
| 1 | [`PRD-v0.3-harnais-fabrique.md`](./PRD-v0.3-harnais-fabrique.md) | Repositionnement produit, vocabulaire, parcours guidé en 15 étapes, non-objectifs |
| 2 | [`architecture-harnais-fabrique.md`](./architecture-harnais-fabrique.md) | Arborescence cible, manifeste `harnais.yaml`, migrations, compatibilité, dette |
| 3 | [`spec-skills.md`](./spec-skills.md) | Les 8 skills locales du projet (format, contrat, erreurs) |
| 4 | [`spec-scripts-deterministes.md`](./spec-scripts-deterministes.md) | Les 8 scripts (CLI, arguments, sorties, codes retour, frontière déterminisme/modèle) |
| 5 | [`spec-corpus-onboarding.md`](./spec-corpus-onboarding.md) | Corpus fictif dense : 16 sources spécifiées une à une |
| 6 | [`spec-parcours-video.md`](./spec-parcours-video.md) | Scénario vidéo aligné sur la refonte, plan par plan |
| 7 | [`backlog-implementation.md`](./backlog-implementation.md) | Lots 0 à 8 pour Opus 4.8, critères d'acceptation, commandes de vérification |

## Décisions majeures (résumé)

1. **La fabrique est pilotée en ligne de commande, pas par une seconde webapp.**
   Le guidage (« le harnais vous interroge ») est porté par
   `scripts/interview-harness.mjs`, sobre, résumable, en français. L'application
   web reste la **sortie** du cas d'usage. Une seule page web nouvelle :
   `/fabrique` (lecture seule, montre l'état du manifeste). Arbitrage : une
   webapp de fabrique doublerait la surface de code pour un gain démonstratif
   faible ; le terminal filme très bien et assume le côté « atelier ».
2. **Un cas d'usage = un dossier `cases/<slug>/` avec un manifeste
   `harnais.yaml`** qui est la source de vérité de tout ce que l'interview a
   collecté. Les scripts lisent le manifeste ; l'application lit le manifeste ;
   le rapport de gouvernance est dérivé du manifeste.
3. **Renommage du cas : `demo-onboarding-rh` → `onboarding-agents`** (corpus
   sous `content/cases/onboarding-agents/`). Migration en une fois, sans
   couche de compatibilité durable (le dépôt est jeune, un seul consommateur).
4. **Les skills sont des fichiers `skills/<nom>/SKILL.md`** au format
   frontmatter + procédure : lisibles par un humain, activables par un agent.
   Elles ne dépendent d'aucune skill externe à ce dépôt.
5. **Frontière stricte déterminisme / modèle** : tout ce qui est structure,
   validation, génération de fichiers, contrôles et rapport est fait par des
   scripts Node reproductibles. Le modèle n'intervient que pour composer des
   réponses FAQ (déjà le cas) et, en atelier, pour aider à rédiger — jamais
   pour valider.
6. **Le corpus passe de 6 sources courtes à 16 sources denses**
   (SRC-001 à SRC-016, 700 à 1 800 mots chacune), toutes fictives, toutes
   `publique` ou `interne`, aucune donnée personnelle. Le périmètre reste
   strictement documentaire : rien qui ressemble à un SIRH.
7. **`validate-harness.mjs` devient un orchestrateur** qui enchaîne
   corpus → garde-fous → configuration IA → cohérence du manifeste, avec un
   rapport agrégé en français et des codes de sortie distincts.

## Contraintes reconduites (non négociables)

- Français partout ; aucune donnée personnelle réelle ; aucun secret.
- Aucune mention publique de projet concurrent ni de l'ancien nom écarté.
- Le cas RH reste **onboarding documentaire** : pas de dossiers d'agents,
  pas de décision individuelle, refus testés.
- Clés IA uniquement côté serveur (`.env.local`), jamais dans une page web.
- Séparation code (`src/`) / contenu (`content/`, `configs/`, `cases/`).
