# Spec — Parcours vidéo « du besoin au harnais, du harnais à l'application »

Scénario aligné sur la refonte : la vidéo montre **Pascal manipulant la
fabrique**, interrogé et guidé, puis l'application qui en sort. Elle remplace
le plan vidéo du PRD v0.2 §13 (qui filmait l'application seule).

- **Durée cible : 9 minutes** (fourchette 8–11).
- **Décor** : deux fenêtres — un terminal (police ≥ 16 pt, thème clair) et un
  navigateur sur `localhost:3010`. Captation 1080p. Aucun autre outil visible.
- **Règle absolue** : chaque plan correspond à une commande réellement
  exécutable du dépôt (vérifié par la skill `preparer-demo-video` juste avant
  tournage). Pas de montage qui simule un résultat.
- **Interdits** : toute mention de projet concurrent ou de l'ancien nom
  écarté ; toute donnée réelle ; toute clé à l'écran (le tournage se fait en
  mode `local`).

## Fil narratif

> Besoin métier → la fabrique m'interroge → elle génère → elle contrôle →
> les tests prouvent → l'application tourne → la gouvernance est un document.

## Plan par plan

### Plan 1 — La promesse (0:00 – 0:50, face caméra ou voix off sur README)
- **Écran.** `README.md` sur GitHub, section d'ouverture « fabrique ».
- **Phrases-clés.** « Un harnais d'IA, ce n'est pas un prompt. C'est tout ce
  qu'on met autour : les sources, les règles, les refus, les tests, les
  responsabilités. » — « Comptoir des Harnais est une fabrique : elle vous
  pose les questions qu'un accompagnateur poserait, et elle produit votre
  harnais. Je vais en construire un devant vous. »

### Plan 2 — La fabrique m'interroge (0:50 – 3:00, terminal)
- **Commande.** `npm run interview`
- **Action.** Dérouler les étapes 1 à 3 en direct (type `documentaire`, besoin
  « arrêter de répéter les mêmes explications à chaque arrivée », organisation
  « Syndicat mixte du Val de Brenne, fictif ») ; montrer une reformulation
  confirmée (`o/N`). Puis **le moment fort** : à « le résultat doit-il être
  adapté à des situations individuelles ? », répondre « oui » sur un cas jouet
  pour montrer le refus d'éligibilité, puis reprendre correctement.
- **Phrases-clés.** « Vous voyez : je n'ai pas rempli un formulaire, j'ai été
  interrogé. Et quand j'ai voulu sortir du cadre, la fabrique a refusé —
  avant même qu'une IA soit dans la boucle. »

### Plan 3 — Une skill, expliquée (3:00 – 4:00, éditeur ou `cat`)
- **Commande.** `cat skills/concevoir-garde-fous/SKILL.md`
- **Action.** Montrer le fichier : objectif, questions, refus, critères.
- **Phrases-clés.** « Une skill, c'est le savoir-faire d'un accompagnateur,
  écrit noir sur blanc : ce qu'elle demande, ce qu'elle produit, et ce
  qu'elle refuse de faire. Ici : transformer “ce qu'on ne veut jamais voir
  répondre” en tests exécutables. C'est lisible par ma DRH comme par la
  machine. »

### Plan 4 — Génération et contrôle déterministes (4:00 – 5:20, terminal)
- **Commandes.**
  ```bash
  npm run scaffold -- --cas onboarding-agents --dry-run
  npm run validate-corpus -- --cas onboarding-agents
  ```
- **Action.** Montrer la liste des fichiers générables, puis le rapport de
  validation : « 16 sources contrôlées, 0 erreur ». Ouvrir une source
  (`SRC-013` charte IA interne) : frontmatter + contenu dense, « données
  fictives ».
- **Phrases-clés.** « Ça, ce n'est pas de l'IA : c'est un script. Même
  entrée, même sortie, tous les jours. Tout ce qui est structure, contrôle et
  preuve est déterministe ; l'IA n'a pas le droit d'y toucher. » — « Le
  corpus : seize documents fictifs mais réalistes — temps de travail, charte
  informatique, frais de déplacement, jusqu'à la charte IA interne. »

### Plan 5 — Configuration IA (5:20 – 6:00, terminal + navigateur)
- **Commandes.** `npm run validate-provider` puis navigateur
  `/configuration-ia`.
- **Action.** Statut `hors-ligne — mode local`, catalogue des 7 modes à
  l'écran.
- **Phrases-clés.** « Aujourd'hui : mode local. Rien ne sort de ce poste, pas
  de clé, pas de réseau. Le jour où la collectivité veut brancher un modèle —
  chez elle avec Ollama, ou une API — c'est une variable d'environnement, et
  c'est une décision instruite avec le DPO, pas un réglage caché. »

### Plan 6 — Les tests prouvent (6:00 – 6:40, terminal)
- **Commandes.** `npm test` puis `npm run validate-guardrails`.
- **Action.** Suite verte, rapport en français ; pointer un cas : « refus des
  cas individuels : couvert, testé, affiché ».
- **Phrases-clés.** « Les promesses sont testées. Si quelqu'un retire un
  garde-fou, les tests cassent. C'est ça, la différence entre une démo et un
  harnais. »

### Plan 7 — L'application tourne (6:40 – 8:20, terminal puis navigateur)
- **Commandes.** `npm run dev` → `http://localhost:3010`.
- **Action.** Accueil (bandeau « produit par la fabrique », clic vers
  `/fabrique` : les 15 étapes, toutes franchies). Puis `/faq` :
  1. **Question sourcée** : « Combien de jours de télétravail sont
     possibles ? » → réponse, **source SRC-003 citée, datée**, mention
     d'assistance.
  2. **Question refusée** : « Est-ce que Madame Martin a droit au
     télétravail ? » → refus courtois, renvoi service RH.
- **Phrases-clés.** « Voilà la sortie de la fabrique : un portail d'accueil.
  Chaque réponse cite sa source et sa date. » — « Et sur une personne : refus.
  Pas parce que le modèle est bien élevé — parce que le harnais l'interdit,
  et que ce refus est testé. »

### Plan 8 — La gouvernance est un document (8:20 – 9:00, terminal + éditeur)
- **Commande.** `npm run rapport -- --cas onboarding-agents` puis ouvrir
  `cases/onboarding-agents/rapport-gouvernance.md`.
- **Action.** Faire défiler : registre des sources, refus, mode IA, synthèse
  des validations, « ne vaut pas validation juridique ».
- **Phrases-clés.** « Une commande, et voici le document que j'apporte à mon
  DPO, ma DSI, ma direction : qui est responsable, quelles sources, quels
  refus, quel mode d'IA, quelles preuves. » — conclusion : « Tout est open
  source, en français, et tourne en local. Clonez la fabrique, elle vous
  posera les questions. »

## Préparation technique (checklist tournage)

1. Dépôt propre sur la branche de refonte, `npm test` + `npm run build` +
   `npm run validate-harness` verts le jour même ;
2. `MODEL_PROVIDER=local` (aucune clé dans l'environnement) ;
3. port 3010 libre ; cache Next chaud (`npm run dev` lancé une fois avant) ;
4. exécuter la skill `preparer-demo-video` → `cases/onboarding-agents/demo/plan-demo.md`
   imprimé/affiché hors champ ;
5. répéter une fois le plan 2 (le refus d'éligibilité doit tomber juste) ;
6. vérifier à l'image : aucune donnée personnelle, aucun chemin révélant autre
   chose que le projet, aucune notification système.
