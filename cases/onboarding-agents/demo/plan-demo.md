# Plan de démonstration — cas `onboarding-agents`

Produit en suivant la skill [`preparer-demo-video`](../../../skills/preparer-demo-video/SKILL.md),
aligné sur [`specs/spec-parcours-video.md`](../../../specs/spec-parcours-video.md).
Règle absolue de la skill : **chaque plan correspond à une action réellement
exécutable du dépôt** ; tout écart entre le scénario et l'état réel est
**consigné**, jamais mis en scène.

- **Date de vérification** : 2026-07-19. Modèle d'implémentation : `claude-opus-4-8`.
- **Mode** : `MODEL_PROVIDER=local` (aucune clé, aucun réseau).
- **Toutes les commandes ci-dessous ont été exécutées ce jour** avec le résultat
  indiqué.

---

## ⚠️ Écart majeur assumé — l'atelier guidé navigateur n'existe pas encore

`specs/spec-parcours-video.md` (écrit pour la cible V1.5 du PRD v0.3 §3 bis)
filme des **sous-routes interactives** qui ne sont **pas implémentées** dans le
dépôt actuel :

| Route filmée par la spec | État réel du dépôt |
|---|---|
| `/fabrique/nouveau` | **absente** (aucune saisie de réponses au navigateur) |
| `/fabrique/[slug]/etape/[n]` | **absente** |
| `/fabrique/[slug]/rapport` | **absente** |
| `/api/fabrique/*` | **absente** |

Ce qui **existe** aujourd'hui (build 2026-07-19) :

- `/fabrique` : **tableau de bord en lecture seule** — état réel du manifeste
  (étape, statut, 16 sources, 10 fiches, modules), les 15 étapes reliées
  chacune à sa skill, son script et une preuve, plus un encart `<details>`
  « En coulisse » portant la commande équivalente (étapes 9, 10, 11, 13, 14, 15) ;
- les pages du portail : `/`, `/faq`, `/sources`, `/gouvernance`, `/limites`,
  `/configuration-ia`, `/parcours`, `/fiches`, `/quiz`, `/checklist` ;
- le **CLI de l'atelier** : `npm run interview` (15 étapes, refus d'éligibilité
  inclus), et les scripts déterministes (`scaffold`, `validate-corpus`,
  `validate-guardrails`, `rapport`).

**Conséquence pour le tournage.** Le parcours « fabrique d'abord » reste
filmable, mais l'atelier guidé se montre **au terminal** (`npm run interview`)
et via le **tableau de bord `/fabrique`** + ses encarts « en coulisse », et non
par une saisie de réponses au navigateur. Les moments « clic sur un bouton qui
génère/contrôle/produit » sont remplacés par la **commande équivalente
affichée dans `/fabrique`**, exécutée au terminal. On ne met en scène aucun
bouton d'écriture inexistant. Tant que les sous-routes ne sont pas livrées, le
plan adapté ci-dessous fait foi ; le plan cible de la spec reste la référence
pour le lot qui implémentera l'atelier navigateur.

---

## Checklist pré-tournage

1. Dépôt propre sur `refonte-fabrique`, vérifications du jour vertes :
   - `npm test` → **83/83** ;
   - `npm run build` → **OK** (24 pages, `/fabrique` `ƒ` dynamique) ;
   - `npm run validate-harness` → **OK** (corpus 0/0, garde-fous 0/0).
2. `MODEL_PROVIDER=local`, aucune clé dans l'environnement.
3. Port 3010 libre. Si occupé par un serveur d'une autre session, choisir un
   port libre dédié (`npx next start -p <port>`) et **ne pas** tuer les serveurs
   d'autres sessions. Attendre le log `✓ Ready` avant de croire un `curl` 200.
4. Terminal en police ≥ 16 pt, thème clair ; navigateur en fenêtre principale.
5. Répéter le refus d'éligibilité (plan 2, au terminal) et le dépliage d'un
   encart « en coulisse » de `/fabrique` (plan 4).
6. Contrôle image : aucune donnée personnelle, aucune clé, aucun onglet parasite.

---

## Plan par plan (adapté au dépôt réel)

### Plan 1 — La promesse (README « fabrique »)
- **Écran.** `README.md`, section d'ouverture : « Une fabrique de harnais d'IA
  pour acteurs publics » ; « Un harnais n'est pas un prompt ».
- **Vérifié.** `head -40 README.md` → le mot « fabrique » apparaît dès le titre,
  avant toute description du portail RH. ✅

### Plan 2 — L'atelier m'interroge — **au terminal (adapté)**
- **Spec (navigateur, non disponible).** `/fabrique/nouveau`, étapes 1-3 en
  direct, écran de refus d'éligibilité.
- **Adaptation exécutable.** Montrer `/fabrique` (tableau de bord, 15 étapes),
  puis dérouler l'atelier au terminal :
  ```bash
  npm run interview -- --demo
  ```
  - **Résultat vérifié (2026-07-19).** L'atelier déroule les 15 étapes, écrit un
    manifeste dans un cas jouet (`cases/demo-atelier/harnais.yaml`) et sort en
    **code 0**. Message de clôture « Cadrage terminé ». *(Cas jouet supprimé
    après essai : `rm -rf cases/demo-atelier configs/demo-atelier.yml`.)*
  - **Refus d'éligibilité.** Le CLI refuse un besoin « adapté à des situations
    individuelles » avec renvoi vers les limites, en **code 0** (comportement
    voulu). Filmable au terminal ; l'écran navigateur correspondant n'existe pas
    encore.
- **Phrase-clé conservée.** « J'ai été interrogé, une question à la fois. Quand
  j'ai voulu sortir du cadre, la fabrique a refusé — avant même qu'une IA soit
  dans la boucle. »

### Plan 3 — Une skill, expliquée — **fichier + `/fabrique` (adapté)**
- **Spec (non disponible).** Panneau « skill mobilisée » sur `/fabrique/<slug>/etape/8`.
- **Adaptation exécutable.** Sur `/fabrique`, ligne de l'étape 8 « Définir les
  refus » : la skill `concevoir-garde-fous` y est citée. Ouvrir le fichier
  versionné correspondant :
  ```bash
  sed -n '1,40p' skills/concevoir-garde-fous/SKILL.md
  ```
  - **Vérifié.** Le `SKILL.md` porte son frontmatter (nom, description,
    `etapes_parcours`, scripts, fichiers produits) et les sections « Ce que je
    demande / produis / refuse ». C'est un fichier du dépôt, pas un écran
    décoratif. ✅

### Plan 4 — Génération et contrôle déterministes — **`/fabrique` + terminal (adapté)**
- **Spec (non disponible).** Boutons « Générer la structure » / « Contrôler le
  corpus » dans l'atelier.
- **Adaptation exécutable.** Sur `/fabrique`, déplier les encarts « En coulisse »
  des étapes 10 et 11 : ils affichent les commandes équivalentes. Les exécuter :
  ```bash
  npm run validate-corpus -- --cas onboarding-agents
  ```
  - **Résultat vérifié (2026-07-19).** `16 source(s) contrôlée(s), 0 erreur(s),
    0 avertissement(s). Résultat : OK — corpus conforme.` ✅
  - Ouvrir une source dense dans `/sources` (ex. SRC-013, charte IA interne) :
    frontmatter + contenu, mention « données fictives ».
- **Phrase-clé conservée.** « Ce bouton n'appelle pas une IA : il lance un
  script. Même entrée, même sortie — et la commande équivalente est affichée. »

### Plan 5 — Configuration IA — **navigateur (réel)**
- **Action.** `/configuration-ia` : statut `local / hors-ligne`, catalogue des
  7 modes, exemple `.env.local` (clé représentée par `[REDACTED]`), **aucun
  champ de saisie de clé**.
  - **Vérifié.** `/configuration-ia` répond **200** ; la page affiche le mode
    courant sans jamais afficher de valeur de clé. ✅
- **Encart « en coulisse » de l'étape 9 sur `/fabrique`** :
  `npm run validate-provider -- --cas onboarding-agents` (diagnostic sans clé).

### Plan 6 — Les tests prouvent — **terminal (réel, seul passage terminal de la spec)**
- **Commandes.**
  ```bash
  npm test
  npm run validate-guardrails -- --cas onboarding-agents
  ```
  - **Résultat vérifié (2026-07-19).** `npm test` → **83 passed (83)** (5 fichiers :
    configuration-ia 18, structure 19, manifeste 19, scripts 7, garde-fous 20).
    `validate-guardrails` → **0 erreur, 0 avertissement — couverture cohérente**.
    Le refus des cas individuels est couvert, testé et affiché. ✅
- **Phrase-clé conservée.** « Si quelqu'un retire un garde-fou, les tests
  cassent. C'est ça, la différence entre une démo et un harnais. »

### Plan 7 — L'application tourne — **navigateur (réel)**
- **Action.** Depuis `/fabrique`, cliquer « Ouvrir l'application produite » → `/`
  (bandeau « produit par la fabrique »). Puis `/faq` :
  1. **Question sourcée** : « Combien de jours de télétravail sont possibles ? »
  2. **Question refusée** : « Est-ce que Madame Martin a droit au télétravail ? »
  - **Résultat vérifié (2026-07-19, serveur sur port libre dédié).**
    - `/` → identité **« Syndicat mixte du Val de Brenne »** + bandeau
      « produit par la fabrique ». ✅
    - FAQ télétravail → réponse citant **SRC-003 « Note de service — télétravail »
      (2025-09-15)**, mention d'assistance. ✅
    - FAQ « Madame Martin » → **refus** : « Ce portail est un outil documentaire :
      il n'examine aucune situation individuelle et ne se prononce jamais sur le
      cas d'une personne nommée ou identifiable » + renvoi RH. ✅
- **Phrase-clé conservée.** « Sur une personne : refus. Pas parce que le modèle
  est bien élevé — parce que le harnais l'interdit, et que ce refus est testé. »

### Plan 8 — La gouvernance est un document — **terminal + navigateur (adapté)**
- **Spec (non disponible).** Bouton « Produire le rapport » sur
  `/fabrique/onboarding-agents/rapport`.
- **Adaptation exécutable.** Encart « en coulisse » de l'étape 15 sur `/fabrique`,
  puis au terminal :
  ```bash
  npm run rapport -- --cas onboarding-agents
  ```
  - **Résultat vérifié (2026-07-19).** `Rapport de gouvernance écrit :
    cases/onboarding-agents/rapport-gouvernance.md`. Le fichier versionné porte
    le registre des sources, les refus, le mode IA, la synthèse des validations
    et la mention « ne vaut pas validation juridique ». ✅
  - Montrer le fichier et, dans le navigateur, `/gouvernance` (qui référence ce
    rapport). `/gouvernance` répond **200**. ✅
- **Conclusion conservée.** « Un fichier versionné, pas une page volatile. Tout
  est open source, en français, et tourne en local. »

---

## Récapitulatif des commandes (toutes exécutées le 2026-07-19)

| # | Commande | Résultat constaté |
|---|---|---|
| — | `head -40 README.md` | « fabrique » avant le portail ✅ |
| 2 | `npm run interview -- --demo` | 15 étapes, code 0 (cas jouet, supprimé) ✅ |
| 3 | `sed -n '1,40p' skills/concevoir-garde-fous/SKILL.md` | frontmatter + sections ✅ |
| 4 | `npm run validate-corpus -- --cas onboarding-agents` | 16 sources, 0/0 ✅ |
| 5 | `curl /configuration-ia` | 200, mode local, aucune clé affichée ✅ |
| 6 | `npm test` | 83/83 ✅ |
| 6 | `npm run validate-guardrails -- --cas onboarding-agents` | 0/0 ✅ |
| 7 | `curl /` + POST `/api/faq` | Val de Brenne ; SRC-003 cité ; Madame Martin refusée ✅ |
| 8 | `npm run rapport -- --cas onboarding-agents` | rapport écrit, mention juridique ✅ |

Tout écart avec `specs/spec-parcours-video.md` est consigné en tête de ce plan
(atelier guidé navigateur non implémenté) ; aucun résultat n'est mis en scène.
