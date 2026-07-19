# Spec — Parcours vidéo « du besoin au harnais, du harnais à l'application »

Scénario aligné sur la refonte : la vidéo montre **Pascal manipulant
l'atelier de la fabrique dans son navigateur**, interrogé et guidé, puis
l'application qui en sort. Elle remplace le plan vidéo du PRD v0.2 §13 (qui
filmait l'application seule). Public visé : DGS, DRH, agents, élus — la
démonstration doit être lisible sans aucune culture terminal.

- **Durée cible : 9 minutes** (fourchette 8–11).
- **Décor** : un navigateur sur `localhost:3010` en fenêtre principale ;
  un terminal en appoint (police ≥ 16 pt, thème clair), montré **brièvement
  et uniquement** pour `npm test` et la preuve de reproductibilité.
  Captation 1080p. Aucun autre outil visible.
- **Règle absolue** : chaque plan correspond à une action réellement
  exécutable du dépôt — un bouton de l'atelier ou une commande (vérifié par
  la skill `preparer-demo-video` juste avant tournage). Pas de montage qui
  simule un résultat.
- **Interdits** : toute mention de projet concurrent ou de l'ancien nom
  écarté ; toute donnée réelle ; toute clé à l'écran (le tournage se fait en
  mode `local` ; l'interface ne comporte de toute façon aucun champ de clé).

## Fil narratif

> Besoin métier → l'atelier m'interroge dans le navigateur → il génère →
> il contrôle → les tests prouvent → l'application tourne → la gouvernance
> est un document.

## Plan par plan

### Plan 1 — La promesse (0:00 – 0:50, face caméra ou voix off sur README)
- **Écran.** `README.md` sur GitHub, section d'ouverture « fabrique ».
- **Phrases-clés.** « Un harnais d'IA, ce n'est pas un prompt. C'est tout ce
  qu'on met autour : les sources, les règles, les refus, les tests, les
  responsabilités. » — « Comptoir des Harnais est une fabrique : elle vous
  pose les questions qu'un accompagnateur poserait, et elle produit votre
  harnais. Je vais en construire un devant vous, dans mon navigateur. »

### Plan 2 — L'atelier m'interroge (0:50 – 3:00, navigateur)
- **Action.** Ouvrir `http://localhost:3010/fabrique` : le tableau de bord de
  l'atelier. Cliquer « Nouveau harnais » (`/fabrique/nouveau`) et dérouler
  les étapes 1 à 3 en direct : type `documentaire`, besoin « arrêter de
  répéter les mêmes explications à chaque arrivée », organisation « Syndicat
  mixte du Val de Brenne, fictif ». Montrer une reformulation confirmée
  (bouton « D'accord, écrire la fiche »). Puis **le moment fort** : à « le
  résultat doit-il être adapté à des situations individuelles ? », répondre
  « oui » sur un cas jouet pour montrer l'écran de refus d'éligibilité
  (message courtois, renvoi vers les limites), puis reprendre correctement.
- **Phrases-clés.** « Vous voyez : je n'ai pas rempli un formulaire
  administratif, j'ai été interrogé, une question à la fois, dans mon
  navigateur. Et quand j'ai voulu sortir du cadre, la fabrique a refusé —
  avant même qu'une IA soit dans la boucle. »

### Plan 3 — Une skill, expliquée (3:00 – 4:00, navigateur)
- **Action.** Sur l'étape 8 (`/fabrique/<slug>/etape/8`), ouvrir le panneau
  « skill mobilisée » : nom (`concevoir-garde-fous`), description, ce qu'elle
  demande, ce qu'elle produit, ce qu'elle refuse. Montrer que ce panneau
  reflète un fichier versionné du dépôt
  (`skills/concevoir-garde-fous/SKILL.md`), affiché dans l'interface.
- **Phrases-clés.** « Une skill, c'est le savoir-faire d'un accompagnateur,
  écrit noir sur blanc : ce qu'elle demande, ce qu'elle produit, et ce
  qu'elle refuse de faire. Ici : transformer “ce qu'on ne veut jamais voir
  répondre” en tests exécutables. C'est lisible par ma DRH comme par la
  machine — et c'est un fichier du dépôt, pas un écran décoratif. »

### Plan 4 — Génération et contrôle déterministes (4:00 – 5:20, navigateur)
- **Action.** Étape 10 : cliquer « Générer la structure » — l'interface liste
  les fichiers créés. Puis étape 11 : cliquer « Contrôler le corpus » —
  rapport « 16 sources contrôlées, 0 erreur ». Déplier l'encart « en
  coulisse » : la commande équivalente
  (`npm run validate-corpus -- --cas onboarding-agents`) est affichée — ce
  qui vient de s'exécuter est un script, pas un modèle. Ouvrir une source
  (`SRC-013`, charte IA interne) : frontmatter + contenu dense, « données
  fictives ».
- **Phrases-clés.** « Ce bouton n'appelle pas une IA : il lance un script.
  Même entrée, même sortie, tous les jours — et la commande équivalente est
  affichée, pour ceux qui préfèrent le terminal. Tout ce qui est structure,
  contrôle et preuve est déterministe ; l'IA n'a pas le droit d'y toucher. »
  — « Le corpus : seize documents fictifs mais réalistes — temps de travail,
  charte informatique, frais de déplacement, jusqu'à la charte IA interne. »

### Plan 5 — Configuration IA (5:20 – 6:00, navigateur)
- **Action.** Étape 9 dans l'atelier : choix du mode (`local` retenu),
  affichage du bloc `.env.local` à recopier à la main (clé représentée par
  `[REDACTED]`), **aucun champ de saisie de clé**. Puis `/configuration-ia` :
  statut `hors-ligne — mode local`, catalogue des 7 modes.
- **Phrases-clés.** « Aujourd'hui : mode local. Rien ne sort de ce poste, pas
  de clé, pas de réseau — et remarquez : l'interface ne me demande jamais de
  clé, c'est un fichier côté serveur. Le jour où la collectivité veut
  brancher un modèle — chez elle avec Ollama, ou une API — c'est une
  variable d'environnement, et c'est une décision instruite avec le DPO, pas
  un réglage caché. »

### Plan 6 — Les tests prouvent (6:00 – 6:40, terminal — seul passage terminal)
- **Commandes.** `npm test` puis `npm run validate-guardrails`.
- **Action.** Le seul moment terminal de la vidéo, assumé comme tel : suite
  verte, rapport en français ; pointer un cas : « refus des cas
  individuels : couvert, testé, affiché ».
- **Phrases-clés.** « Une fois n'est pas coutume : le terminal. Pas pour
  piloter — pour prouver. Tout ce que les boutons de l'atelier ont fait est
  rejouable en ligne de commande, à l'identique, y compris en intégration
  continue. Les promesses sont testées : si quelqu'un retire un garde-fou,
  les tests cassent. C'est ça, la différence entre une démo et un harnais. »

### Plan 7 — L'application tourne (6:40 – 8:20, navigateur)
- **Action.** Depuis `/fabrique/onboarding-agents` (les 15 étapes franchies),
  suivre le lien « ouvrir l'application » vers l'accueil du cas sur
  `http://localhost:3010` (bandeau « produit par la fabrique »). Puis
  `/faq` :
  1. **Question sourcée** : « Combien de jours de télétravail sont
     possibles ? » → réponse, **source SRC-003 citée, datée**, mention
     d'assistance.
  2. **Question refusée** : « Est-ce que Madame Martin a droit au
     télétravail ? » → refus courtois, renvoi service RH.
- **Phrases-clés.** « Voilà la sortie de la fabrique : un portail d'accueil.
  Chaque réponse cite sa source et sa date. » — « Et sur une personne : refus.
  Pas parce que le modèle est bien élevé — parce que le harnais l'interdit,
  et que ce refus est testé. »

### Plan 8 — La gouvernance est un document (8:20 – 9:00, navigateur)
- **Action.** `/fabrique/onboarding-agents/rapport` : cliquer « Produire le
  rapport », faire défiler le rapport affiché — registre des sources, refus,
  mode IA, synthèse des validations, « ne vaut pas validation juridique » —
  et montrer le chemin du fichier versionné
  (`cases/onboarding-agents/rapport-gouvernance.md`).
- **Phrases-clés.** « Un clic, et voici le document que j'apporte à mon DPO,
  ma DSI, ma direction : qui est responsable, quelles sources, quels refus,
  quel mode d'IA, quelles preuves. C'est un fichier versionné, pas une page
  volatile. » — conclusion : « Tout est open source, en français, et tourne
  en local. Clonez la fabrique, ouvrez l'atelier : elle vous posera les
  questions. »

## Préparation technique (checklist tournage)

1. Dépôt propre sur la branche de refonte, `npm test` + `npm run build` +
   `npm run validate-harness` verts le jour même ;
2. `MODEL_PROVIDER=local` (aucune clé dans l'environnement) ;
3. port 3010 libre ; `npm run dev` lancé avant tournage (cache Next chaud,
   l'atelier et le portail sont servis par le même serveur) ;
4. exécuter la skill `preparer-demo-video` → `cases/onboarding-agents/demo/plan-demo.md`
   imprimé/affiché hors champ ;
5. répéter une fois le plan 2 (le refus d'éligibilité doit tomber juste) et
   le plan 4 (l'encart « en coulisse » doit être déplié sans hésitation) ;
6. vérifier à l'image : aucune donnée personnelle, aucun chemin révélant autre
   chose que le projet, aucune notification système, aucun onglet parasite.
