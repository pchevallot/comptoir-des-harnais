# Comptoir des Harnais

**Un harnais IA pour acteurs publics — comprendre, construire, gouverner.**

Dépôt open source qui explique ce qu'est un *harnais d'IA* pour le secteur public
et en livre un premier exemple complet et fonctionnel : une **application web
d'onboarding RH documentaire**, configurable, sourcée et gouvernée. Une
collectivité peut la cloner, la voir fonctionner en quelques commandes, puis y
mettre ses propres contenus — **sans toucher au code**.

![Statut : prototype de démonstration](https://img.shields.io/badge/statut-prototype%20de%20d%C3%A9monstration-1F519B)
![Langue : français](https://img.shields.io/badge/langue-fran%C3%A7ais-1F519B)
![Node ≥ 20](https://img.shields.io/badge/Node-%E2%89%A5%2020-112D4A)
![Next.js 15](https://img.shields.io/badge/Next.js-15-112D4A)
![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-112D4A)
![Licence code : MIT (provisoire)](https://img.shields.io/badge/licence%20code-MIT%20(provisoire)-FDC948)
![Licence contenus : CC BY-SA 4.0 (provisoire)](https://img.shields.io/badge/licence%20contenus-CC%20BY--SA%204.0%20(provisoire)-FDC948)

> **Ce fichier `README.md` est désormais la documentation principale du projet,
> en français.** Le document historique [`README.fr.md`](./README.fr.md) reste
> disponible et cohérent ; un court résumé en anglais figure en fin de page.

> **À qui s'adresse ce document ?** À toute personne qui découvre le projet :
> DRH, DGS/DGA, DSI, RSSI, DPO, agent producteur de contenus, élu prudent, ou
> développeur d'un opérateur public de services numériques (OPSN). Il se
> comprend en 2 minutes, permet une installation en moins de 15 minutes, et se
> lit sans connaissance informatique préalable.

---

## Sommaire

- [En bref](#en-bref)
- [Un harnais n'est pas un prompt](#un-harnais-nest-pas-un-prompt)
- [Ce que fait l'application](#ce-que-fait-lapplication)
- [Ce que l'application ne fait pas](#ce-que-lapplication-ne-fait-pas)
- [Prérequis](#prérequis)
- [Démarrage rapide](#démarrage-rapide)
- [Scripts npm](#scripts-npm)
- [Structure du dépôt](#structure-du-dépôt)
- [Configuration des fournisseurs d'IA](#configuration-des-fournisseurs-dia)
- [Variables d'environnement](#variables-denvironnement)
- [Adapter ses sources](#adapter-ses-sources)
- [Sécurité et secrets](#sécurité-et-secrets)
- [Gouvernance et garde-fous](#gouvernance-et-garde-fous)
- [Tester, construire, valider](#tester-construire-valider)
- [Accessibilité et limites](#accessibilité-et-limites)
- [Parcours de démonstration en 5 minutes](#parcours-de-démonstration-en-5-minutes)
- [Feuille de route](#feuille-de-route)
- [Contribuer](#contribuer)
- [Licences](#licences)
- [Attribution](#attribution)
- [Maintenance et contact](#maintenance-et-contact)
- [English summary](#english-summary-one-page)

---

## En bref

- **Le problème.** Les collectivités subissent trois pressions simultanées : des
  tâches documentaires répétitives (expliquer dix fois les mêmes règles RH), une
  injonction à « faire de l'IA », et des exigences légitimes de sécurité (RGPD,
  AI Act, cybersécurité, souveraineté). Un prompt isolé ne répond à aucune ;
  une démo sans cadre inquiète à juste titre.
- **La réponse.** Ce dépôt montre — et fait tourner — un **harnais** : un cadre
  outillé où chaque réponse cite ses sources, où les limites et la gouvernance
  sont affichées à l'écran, et où les garde-fous sont couverts par des tests
  automatiques.
- **L'exemple livré.** Un **portail d'accueil des nouveaux arrivants** :
  parcours de lecture, bibliothèque de fiches, FAQ sourcée, quiz, checklist et
  pages de gouvernance. La démonstration repose sur une collectivité **100 %
  fictive**.
- **La promesse d'adaptation.** Une organisation remplace le contenu fictif par
  le sien en éditant des fichiers Markdown et YAML, **sans modifier le code**.
- **Sobriété technique.** Next.js 15, TypeScript strict, aucun serveur de base
  de données, aucun compte requis. Fonctionne **hors ligne** par défaut.

---

## Un harnais n'est pas un prompt

Un **prompt**, c'est une simple phrase que l'on tape pour demander quelque chose
à une IA. C'est fragile, non reproductible, et personne ne sait d'où vient la
réponse.

Un **harnais d'IA**, c'est autre chose. De même qu'on n'attelle pas un cheval
sans harnais, on n'attelle pas une IA sans cadre. Un harnais réunit :

| Élément | Ce que c'est | Où le voir dans ce dépôt |
|---|---|---|
| **Besoin métier** | la tâche réelle à outiller, en langage clair | page d'accueil du portail |
| **Sources** | les documents de référence, identifiés et datés | page « Sources & dates » |
| **Règles** | ce que l'IA peut faire, et à partir de quoi | moteur documentaire (`src/lib/`) |
| **Garde-fous** | ce qui doit être refusé l'est vraiment | page « Limites & refus » |
| **Tests** | des vérifications automatiques de ces garde-fous | `tests/`, `npm test` |
| **Responsabilités** | qui valide, qui maintient (des fonctions, pas des personnes) | page « Gouvernance » |
| **Preuves** | sources citées, dates, statut, mentions | affichées sur chaque réponse |

En bref : un harnais encadre l'IA pour produire quelque chose d'**utile, de
maintenable et de gouverné** — pas un tour de magie. Les termes du projet sont
définis en langage courant dans [`GLOSSAIRE.fr.md`](./GLOSSAIRE.fr.md).

---

## Ce que fait l'application

L'application V1 est un **portail d'onboarding RH documentaire**. Elle propose,
en langage métier :

1. **Accueil pédagogique** — ce qu'est ce portail, à qui il s'adresse, ce qu'il
   fait et ne fait pas.
2. **Parcours nouvel arrivant** — modules ordonnés, avec progression visible.
3. **Bibliothèque de fiches** — fiches consultables (temps de travail,
   télétravail, mutuelles, marchés publics, contacts utiles, premiers jours),
   chacune avec ses sources, sa date et son statut.
4. **FAQ sourcée** — une question documentaire reçoit une réponse produite
   **exclusivement** à partir des sources fournies, avec les sources citées.
5. **Quiz** — valide une lecture, jamais une personne ; **aucun score n'est
   conservé ni transmis**.
6. **Checklist RH** — aide-mémoire de ce que la DRH prépare, valide et met à
   jour. Ce n'est pas un circuit de validation.
7. **Sources & dates de mise à jour** — le registre des sources rendu visible.
8. **Limites & refus** — ce que l'application ne répondra pas, et vers qui elle
   renvoie.
9. **Gouvernance** — responsable métier, DPO, DSI/RSSI, statut du harnais,
   classification des données, journal de mise à jour, mention « ne vaut pas
   validation juridique ».
10. **Configuration de l'IA** — page de diagnostic qui explique le fournisseur
    de modèle utilisé et son impact RGPD/souveraineté, **sans jamais afficher de
    clé**.
11. **Adapter ses sources** — guide in-app pour partir de vos documents
    existants.

Chaque réponse générée porte ses **mentions obligatoires** : sources citées,
date des sources, statut du harnais, mention d'assistance IA.

---

## Ce que l'application ne fait pas

Ce périmètre est **non négociable** — c'est ce qui rend l'outil défendable
devant un DPO ou un RSSI.

- Ce **n'est pas un logiciel de gestion RH** (pas un SIRH), ni un module de
  logiciel RH.
- Ce **n'est pas un outil de gestion de dossiers d'agents** : aucun dossier
  nominatif, aucune donnée personnelle.
- Ce **n'est pas un système de décision individuelle** : l'application **refuse
  explicitement** de répondre sur le cas d'une personne identifiable, et **ce
  refus est testé**.
- Ce **n'est pas un outil de conformité automatique** : rien ici ne « rend
  conforme » ; l'application affiche « ne vaut pas validation juridique ».
- Ce **n'est pas un substitut** au DSI, au DPO, au RSSI, aux juristes ou aux
  instances de décision.

> **Aucune donnée personnelle réelle, nulle part** — ni dans la démo, ni dans
> les tests, ni dans les exemples de configuration. La démonstration utilise une
> collectivité entièrement fictive, la **« Communauté de communes de
> Roche-Vallonne »**, dont chaque contenu est marqué « données fictives ». Un
> test de structure refuse les motifs de données réalistes (courriels,
> téléphones, numéros identifiants).

---

## Prérequis

- **Node.js version 20 ou plus** (LTS recommandé) et **npm**.
- Une machine standard (Linux, macOS ou Windows).
- **Aucun compte, aucun service externe, aucune base de données** ne sont
  nécessaires pour le mode démonstration.
- **Aucune clé d'API** n'est requise par défaut : le fournisseur de modèle est
  `local` (recherche documentaire hors ligne).

Versions de référence au moment de la rédaction (2026-07-19) : Node 22.x, npm
10.x, Next.js 15.5.x. Le `package.json` exige Node ≥ 20.

---

## Démarrage rapide

```bash
git clone <url-du-dépôt>
cd comptoir-des-harnais

# (optionnel en mode démo) préparer les variables d'environnement locales
cp .env.example .env.local

npm install
npm run dev        # ouvre l'application sur http://localhost:3000
```

En mode démonstration, il n'y a **rien d'autre à configurer** : les valeurs par
défaut (`MODEL_PROVIDER=local`, `CDH_CONFIG=demo.yml`) suffisent. Copier
`.env.example` est utile seulement si vous voulez brancher un fournisseur de
modèle externe (voir [Configuration des fournisseurs d'IA](#configuration-des-fournisseurs-dia)).

Pour vérifier une installation complète :

```bash
npm test                 # tests de garde-fous et de structure
npm run build            # construit la version optimisée
npm run validate-harness # vérifie la cohérence du harnais (sources, gouvernance)
```

Objectif visé : un public technique installe et fait tourner l'application en
**moins de 15 minutes** après le clone.

---

## Scripts npm

| Script | Effet |
|---|---|
| `npm run dev` | Démarre l'application en développement sur `http://localhost:3000`. |
| `npm run build` | Construit la version optimisée (vérifie aussi le typage strict). |
| `npm start` | Sert la version construite (après `npm run build`). |
| `npm run lint` | Analyse statique (ESLint / config Next). |
| `npm test` | Exécute la suite Vitest (garde-fous + structure), rapport en français. |
| `npm run test:watch` | Même suite, en mode surveillance. |
| `npm run validate-harness` | Vérifie qu'une configuration de harnais est complète et cohérente. |
| `npm run generate-demo` | (Re)génère ou vérifie le contenu de démonstration. |
| `npm run import-source` | Amorce le squelette d'une source à partir d'un `.md`/`.txt` déjà relu. |

---

## Structure du dépôt

Les contenus métier sont **strictement séparés** du code : tout ce qu'une
collectivité adapte se trouve dans `content/` et `configs/` (territoire des
non-techniciens) ; le code vit dans `src/` (territoire des développeurs).

```text
comptoir-des-harnais/
├── README.md               # ce document — documentation principale (français)
├── README.fr.md            # document d'origine (conservé) + résumé anglais
├── CONTRIBUTING.fr.md      # comment contribuer, périmètre accepté
├── GLOSSAIRE.fr.md         # termes définis en langage courant
├── LICENSE                 # licence du code (MIT, provisoire)
├── LICENSES.fr.md          # note sur les licences code / contenus
├── .env.example            # variables d'environnement documentées, sans secret
├── package.json            # scripts : dev, build, test, validate-harness…
│
├── src/                    # l'application web (code) — pour développeurs
│   ├── app/                # pages (App Router) + api/faq/route.ts
│   ├── components/         # Nav, badges, rendu Markdown
│   └── lib/                # moteur documentaire, garde-fous, interface modèle
│       └── model/          # fournisseurs de modèle substituables (catalogue, diagnostic)
│
├── content/                # contenus métier — modifiables sans coder
│   └── demo-onboarding-rh/ # démo : collectivité fictive, données 100 % fictives
│       ├── sources/        # 6 sources fictives (SRC-001 à SRC-006)
│       ├── fiches/         # 6 fiches pédagogiques
│       ├── parcours/       # parcours en modules
│       ├── quiz/           # questions de validation
│       ├── checklist.md    # aide-mémoire RH
│       └── gouvernance/    # classification, limites & refus, validation, journal
│
├── configs/                # configuration de l'organisation (YAML)
│   ├── demo.yml            # mode démo (collectivité fictive)
│   └── organisation.example.yml  # modèle commenté à copier pour sa collectivité
│
├── docs/                   # documentation pédagogique et de gouvernance
│   ├── comprendre-les-harnais.fr.md
│   ├── cycle-de-vie.fr.md
│   ├── gouvernance-rgpd-ai-act.fr.md
│   ├── architecture.fr.md
│   ├── note-decideur.fr.md
│   └── adapter-ses-sources.fr.md
│
├── tests/                  # protègent le comportement et la structure
│   ├── guardrails/         # réponses sourcées, refus des cas individuels
│   └── structure/          # contenus complets, absence de secrets et de données réelles
│
└── scripts/                # validate-harness, generate-demo, import-source
```

Adapter le portail à une organisation **ne demande jamais de modifier `src/`**.

---

## Configuration des fournisseurs d'IA

L'appel au modèle est isolé derrière une **interface substituable**, pilotée
**uniquement** par la variable d'environnement `MODEL_PROVIDER`. Le fournisseur
n'est jamais codé en dur, ni saisissable depuis le navigateur. Sept modes sont
pris en charge :

| `MODEL_PROVIDER` | Réseau | Clé | Souveraineté |
|---|---|---|---|
| `local` *(défaut)* | non | non | **Maximale** — rien ne quitte le poste ; mode démo et tests. |
| `none` | non | non | FAQ générative désactivée ; le reste du portail et les garde-fous restent actifs. |
| `ollama` | oui (URL locale) | non | **Forte** — modèle exécuté chez vous, à condition que l'URL reste interne. |
| `anthropic` | oui | oui | Fournisseur tiers — à instruire avec le DPO. |
| `openai` | oui | oui | Fournisseur tiers, hors UE par défaut. |
| `openrouter` | oui | oui | Passerelle multi-modèles ; localisation variable. |
| `mistral` | oui | oui | Fournisseur européen — reste un tiers à instruire. |

Points clés :

- **Dégradation maîtrisée.** Sans fournisseur ou avec `none`, tout le portail
  (parcours, fiches, quiz, gouvernance) reste utilisable et **les garde-fous
  restent actifs** ; seule la FAQ générative est neutralisée, avec un message
  explicite. Perdre le fournisseur ne fait perdre **aucun contenu**.
- **Réversibilité.** Sources, fiches et configuration sont en formats ouverts.
  Changer de fournisseur = changer la configuration, au plus un adaptateur
  documenté.
- **Page in-app `/configuration-ia`.** Elle affiche l'état courant (statut, pas
  de clé), le catalogue des modes avec un exemple `.env.local`, et les impacts
  RGPD/sécurité/souveraineté. La source de vérité du catalogue est
  [`src/lib/model/catalogue.ts`](./src/lib/model/catalogue.ts), qui ne lit
  aucune variable d'environnement et ne contient aucun secret.

> Les fournisseurs réseau (`anthropic`, `openai`, `openrouter`, `mistral`,
> `ollama`) sont **implémentés et diagnostiqués**, mais leur appel HTTP réel
> n'a pas été validé en environnement sans clé : cette validation reste à la
> charge de l'exploitant qui active un fournisseur.

---

## Variables d'environnement

Toutes documentées dans [`.env.example`](./.env.example), **sans aucune valeur
secrète**. Renseignez vos valeurs uniquement dans un fichier `.env.local`
**local et non versionné** (`.gitignore` ignore `.env*`).

| Variable | Rôle | Défaut |
|---|---|---|
| `MODEL_PROVIDER` | Fournisseur de modèle (voir tableau ci-dessus). | `local` |
| `MODEL_DISPLAY_NAME` | Nom générique affiché (mention d'assistance IA). | `recherche documentaire locale` |
| `MODEL_API_KEY` | Clé du fournisseur externe, **si** un mode à clé est choisi. Lue **côté serveur uniquement**. | *(vide)* |
| `MODEL_BASE_URL` | URL du service (Ollama, OpenRouter, point compatible OpenAI). | selon le fournisseur |
| `MODEL_NAME` | Identifiant du modèle chez le fournisseur. | selon le fournisseur |
| `CDH_CONFIG` | Configuration active de l'organisation (fichier de `configs/`). | `demo.yml` |

Pour le mode `anthropic`, la variable `ANTHROPIC_API_KEY` est aussi acceptée par
compatibilité.

---

## Adapter ses sources

Vous **partez de vos documents habituels** (Word, PDF, LibreOffice, pages
intranet), mais le **format canonique intégré au harnais** est le **Markdown
relu** (`.md`), accompagné de métadonnées. Le Markdown est retenu parce qu'il
est lisible sans outil, versionnable, réversible (aucun verrou fournisseur) et
séparé du code.

1. **Convertir** le document en texte (copier-coller manuel, ou « Enregistrer
   sous » en texte/Markdown). Un PDF scanné demande une reconnaissance de
   caractères (OCR) — **non fournie de façon robuste en V1**.
2. **Relire intégralement.** Une conversion ou un OCR peut transformer un
   chiffre, coller des mots, perdre un titre. Le portail ne répond qu'à partir
   de ses sources : **une erreur dans la source devient une erreur dans la
   réponse.** La relecture est un garde-fou, pas une option.
3. **Ajouter les métadonnées** en tête du fichier : `id` stable, `titre`,
   `proprietaire` (**une fonction, jamais une personne**), `date`
   (`AAAA-MM-JJ`), `statut` (`active`/`perimee`), `perimetre`, `classification`
   (**`publique` ou `interne` uniquement en V1**), `fictif`.
4. **Vérifier l'absence de données personnelles**, déposer le fichier dans
   `content/<votre-harnais>/sources/`, puis lancer `npm run validate-harness`
   et `npm test`.

Un script d'amorçage évite la page blanche (il ne fait **ni** conversion PDF,
**ni** OCR, **ni** contrôle de contenu) :

```bash
node scripts/import-source.mjs document.txt --id SRC-007 --titre "Règlement horaires"
```

Guides complets : [`docs/adapter-ses-sources.fr.md`](./docs/adapter-ses-sources.fr.md)
et la page in-app `/sources/adapter`.

---

## Sécurité et secrets

- **Aucune clé côté navigateur.** Les secrets vivent **uniquement** dans
  `.env.local` ou l'environnement serveur. Pas de `localStorage`, pas de cookie,
  pas de variable `NEXT_PUBLIC_*` pour une clé. La page `/configuration-ia`
  affiche un **statut**, jamais une valeur de clé.
- **Aucun secret dans le dépôt.** `.env.example` ne contient aucune valeur ;
  `.gitignore` ignore `.env*` ; un test de structure scanne les motifs de clés
  (par exemple `sk-…`, `AKIA…`, clés privées). En cas d'exposition d'une clé :
  la révoquer immédiatement chez le fournisseur, puis en générer une nouvelle.
- **Appels réseau documentés.** En mode `local`/`none`, aucun appel sortant.
  Avec un fournisseur externe, seule la FAQ générative sollicite ce tiers ; la
  question et les extraits de sources transitent alors vers lui — à instruire
  avec le DPO.
- **Journalisation sobre.** Les journaux locaux ne contiennent que des
  métadonnées (jamais le contenu des sources), et sont silencieux pendant les
  tests.
- **Pas de données personnelles ni sensibles** transmises à un modèle, quel que
  soit le fournisseur : le cadre ne traite que des sources `publiques` ou
  `internes`.

Le modèle de menaces détaillé est dans [`docs/architecture.fr.md`](./docs/architecture.fr.md).

---

## Gouvernance et garde-fous

Les garanties sont **visibles à l'écran** et **couvertes par des tests** :

- **Sourçage exclusif.** Le moteur ne répond qu'à partir du registre des
  sources ; une question hors corpus produit un « je ne sais pas » explicite
  avec renvoi vers le contact utile, jamais une improvisation. Le sourçage est
  re-vérifié en sortie (garde-fou non délégué au modèle).
- **Refus des cas individuels.** Toute question sur une personne identifiable ou
  une situation individuelle déclenche un refus courtois avec renvoi vers le
  service compétent. Comportement de premier rang, **testé**.
- **Refus des avis juridiques/médicaux** et des formulations proscrites
  (promesse de droit, évaluation d'une personne).
- **Mentions obligatoires** sur chaque réponse et chaque fiche : sources, date,
  statut, assistance IA, et « ne vaut pas validation juridique » sur les pages
  de gouvernance.
- **Trois statuts affichés** — *prototype* / *usage interne* / *mise en
  production*. Le mode démo est un **prototype**, et l'application l'affiche. Le
  passage d'un statut à l'autre est une décision humaine tracée, jamais un effet
  de l'outil.

> **Avertissement.** Ce cadre aide à documenter et à sécuriser un usage d'IA
> générative. Il ne constitue ni un audit juridique, ni un avis de conformité
> RGPD ou AI Act, ni une homologation de sécurité, et **ne vaut pas validation
> juridique**. Ces qualifications relèvent du DPO, des juristes, du RSSI et des
> instances de décision de chaque organisation.

Pour aller plus loin : [`docs/gouvernance-rgpd-ai-act.fr.md`](./docs/gouvernance-rgpd-ai-act.fr.md),
[`docs/cycle-de-vie.fr.md`](./docs/cycle-de-vie.fr.md),
[`docs/note-decideur.fr.md`](./docs/note-decideur.fr.md).

---

## Tester, construire, valider

```bash
npm test                 # garde-fous (comportement) + structure & sécurité
npm run build            # build de production + vérification du typage strict
npm run validate-harness # cohérence du harnais : registre, classification, gouvernance
```

Résultats connus à la date de rédaction (2026-07-19), après un clone propre :

- `npm test` — **suite verte** (36 tests répartis en 3 fichiers : configuration
  IA, structure, garde-fous). Ces chiffres sont indicatifs et évolueront avec le
  dépôt.
- `npm run build` — **OK** (20 routes générées ; `/api/faq` et
  `/configuration-ia` sont rendus à la demande côté serveur, c'est attendu).
- `npm run validate-harness` — **OK** (6 sources, 6 fiches, statut prototype,
  0 erreur).

Les tests de comportement (refus, sourçage) sont conçus pour être **lisibles et
modifiables par un non-technicien** (cas déclarés en YAML commenté) et vérifiés
sur plusieurs exécutions.

---

## Accessibilité et limites

Objectifs d'accessibilité visés dès la V1 (bonnes pratiques RGAA, dans la mesure
réaliste du dépôt) : contrastes suffisants, navigation clavier, focus visible,
lien d'évitement, titres structurés, interface responsive. Le design est sobre
et institutionnel.

**Limites assumées (dette documentée, pas de fausse maturité) :**

- La **vérification visuelle** de certaines pages (`/configuration-ia`,
  `/sources/adapter`) n'a pas encore été faite dans un environnement doté d'un
  navigateur ; le build et les tests couvrent la logique.
- Les **fournisseurs réseau** sont implémentés mais l'appel HTTP réel n'a pas
  été validé sans clé (voir plus haut).
- Le corpus de démonstration est **volontairement compact** (6 sources) ; son
  élargissement est prévu en version ultérieure.
- Pas d'**OCR robuste** pour les PDF scannés en V1.
- L'anglais se limite au **résumé d'une page** ci-dessous.

---

## Parcours de démonstration en 5 minutes

À montrer pour convaincre sans survendre :

1. **Ouvrir l'accueil** (`/`) — lire la promesse et « ce que fait / ne fait pas »
   le portail. *(~30 s)*
2. **Poser une vraie question à la FAQ** (`/faq`), par exemple « Combien de jours
   de télétravail sont possibles ? » — lire la réponse **sourcée** (SRC-003), la
   date et la mention d'assistance IA. *(~1 min)*
3. **Poser une question piège** — « Est-ce que Madame Martin a droit au
   télétravail ? » : **refus courtois** en direct, renvoi vers le service RH.
   Ce n'est pas un bug, c'est la règle centrale du harnais. *(~1 min)*
4. **Ouvrir « Sources & dates », « Limites & refus », « Gouvernance »** — les
   preuves visibles : registre daté, refus explicites, responsables (fonctions),
   statut prototype, classification, « ne vaut pas validation juridique ».
   *(~1 min)*
5. **Montrer l'adaptation** — ouvrir `content/` et
   `configs/organisation.example.yml` : des fichiers texte lisibles. Puis lancer
   `npm test` : les garde-fous vérifiés automatiquement, rapport en français.
   *(~1,5 min)*

---

## Feuille de route

Sobre et honnête : l'application V1 est fonctionnelle en local ; les points
ci-dessous sont des suites, pas des promesses tenues.

- **V1.1 — Configuration guidée.** Documentation pas à pas et messages d'erreur
  pédagogiques pour adapter le harnais à une collectivité réelle sans
  développeur.
- **V1.2 — Tests renforcés.** Questions pièges supplémentaires, robustesse aux
  reformulations, corpus élargi.
- **V2 — Observatoire territorial.** Un second harnais vertical (fiche
  territoire sourcée), selon le même schéma contenu + application + tests.
- **V3 — Déploiement simplifié.** Guides d'hébergement et de mutualisation par
  un OPSN.

La **publication d'un dépôt GitHub distant** et le choix d'un fournisseur de
modèle pour une démonstration restent des **décisions humaines** non encore
prises.

---

## Contribuer

Les contributions sont bienvenues, dans le respect du périmètre du projet
(strictement documentaire, aucune donnée réelle, aucune dérive vers un outil de
gestion RH). Avant de proposer une modification :

```bash
npm install
npm test                 # doit passer
npm run validate-harness # si vous avez touché aux contenus
```

Tout est détaillé dans [`CONTRIBUTING.fr.md`](./CONTRIBUTING.fr.md) : ce qui est
accepté, ce qui est refusé, et comment ajouter une source ou une fiche **sans
toucher au code**.

---

## Licences

Deux régimes distincts, **provisoires** (décision finale à arbitrer) :

- **Code** (`src/`, `scripts/`, `tests/`, configuration technique) — **MIT**.
  Voir [`LICENSE`](./LICENSE). Alternative envisagée : EUPL 1.2.
- **Contenus documentaires** (`content/`, `docs/`) — **CC BY-SA 4.0** proposée.

Détail et justification : [`LICENSES.fr.md`](./LICENSES.fr.md).

---

## Attribution

Projet porté par **Le Comptoir des Signaux / Pascal Chevallot**. Merci de
conserver cette attribution en cas de réutilisation, conformément aux licences
ci-dessus.

---

## Maintenance et contact

- **Statut du projet** : prototype de démonstration, développé localement ;
  aucun dépôt distant public au moment de la rédaction.
- **Contributions et signalements** : via une proposition (pull request) ou un
  ticket, une fois le dépôt publié — voir [`CONTRIBUTING.fr.md`](./CONTRIBUTING.fr.md).
- **Documentation de reprise** : [`docs/HANDOFF.md`](./docs/HANDOFF.md) (état du
  projet) et [`docs/RECETTE.md`](./docs/RECETTE.md) (journal de recette).

---

## English summary (one page)

**Comptoir des Harnais** ("Harness Counter") is an open-source repository that
explains what an *AI harness* is for public-sector organisations, and ships a
first complete, working example: a **documentary HR onboarding web application**
that is configurable, sourced and governed.

**An AI harness is not a prompt.** A prompt is a single throwaway instruction. A
harness is a structured whole — business need, identified and dated sources,
rules, guardrails, automated tests, named responsibilities and visible proof —
that frames an AI system so it produces something useful, maintainable and
governed.

**What it does.** A public organisation clones the repository, runs it locally
in a few commands, and gets a new-joiner onboarding portal: a reading path, a
library of fact sheets, a sourced FAQ, a quiz and governance pages. Every answer
cites its sources; limits and governance are shown on screen; guardrails are
covered by automated tests. The organisation then replaces the fictional content
with its own — by editing YAML and Markdown files, **without touching the code**.

**What it is not.** Not an HRIS and not a module of one; not a case-management
tool (no individual records, no personal data); not a decision system (it
explicitly **refuses** questions about an identifiable individual, and that
refusal is tested); not a compliance tool (it carries the notice that it "does
not amount to legal validation").

**No real personal data, anywhere** — not in the demo, the tests or the config
examples. The demonstration uses a fully fictional local authority, the
"Communauté de communes de Roche-Vallonne".

**Model provider and graceful degradation.** The model call sits behind a
substitutable interface set via `MODEL_PROVIDER`. The default, `local`, is a
deterministic local document search with no network calls that works offline
without any key. Setting it to `none` cleanly disables the generative FAQ while
everything else keeps working and guardrails stay active.

**Quick start.**

```bash
git clone <repo>
cd comptoir-des-harnais
cp .env.example .env.local   # optional in demo mode
npm install
npm run dev      # http://localhost:3000
npm test
```

Requirements: Node.js 20+. No account, external service or database is needed for
the demo mode.

**Licensing.** Code under **MIT** (provisional). Documentary content (`content/`,
`docs/`) proposed under **CC BY-SA 4.0** (provisional). See
[`LICENSES.fr.md`](./LICENSES.fr.md).

---

<sub>Porté par Le Comptoir des Signaux / Pascal Chevallot. Documentation
principale : ce fichier. Document d'origine conservé : <a href="./README.fr.md">README.fr.md</a>.</sub>
