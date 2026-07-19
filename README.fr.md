# Comptoir des Harnais

> **Note.** La documentation principale du projet est désormais
> [`README.md`](./README.md) (en français, plus complète et à jour). Le présent
> document est conservé comme version d'origine ; en cas de divergence, se
> référer à [`README.md`](./README.md).

**Un harnais IA pour acteurs publics — comprendre, construire, gouverner.**

Ce dépôt open source explique ce qu'est un harnais IA pour le secteur public et
fournit un premier harnais complet et fonctionnel : une **application web
d'onboarding RH documentaire**, configurable, sourcée et gouvernée. Une
collectivité peut la cloner, la voir fonctionner en quelques commandes, puis y
mettre ses propres contenus, sans toucher au code.

> **À qui s'adresse ce document ?** À toute personne qui découvre le projet :
> DRH, DGS, DSI, RSSI, DPO, agent producteur de contenus, développeur d'un
> opérateur public de services numériques (OPSN). Il se lit en moins de dix
> minutes, sans connaissance informatique.

---

## Un harnais n'est pas un prompt

Un **prompt**, c'est une simple phrase que l'on tape pour demander quelque chose
à une intelligence artificielle. C'est fragile, non reproductible, et personne
ne sait d'où vient la réponse.

Un **harnais IA**, c'est autre chose. Comme on n'attelle pas un cheval sans
harnais, on n'attelle pas une IA sans cadre. Un harnais, c'est un ensemble
structuré qui réunit :

- un **besoin métier** clairement exprimé,
- des **sources** identifiées et datées,
- des **règles** (ce que l'IA peut faire, ce qu'elle ne peut pas faire),
- des **garde-fous** qui refusent ce qui doit être refusé,
- des **tests** automatiques qui vérifient ces garde-fous,
- des **responsabilités** nommées (qui valide, qui maintient),
- des **preuves** visibles (sources citées, dates, statut, gouvernance).

En bref : un harnais encadre l'IA pour produire quelque chose d'utile, de
maintenable et de gouverné — pas un tour de magie.

---

## La promesse

Comptoir des Harnais permet à une collectivité de créer son propre **portail
d'accueil des nouveaux arrivants** à partir de ses sources internes : chaque
réponse est sourcée, les limites et la gouvernance sont affichées, et les
garde-fous sont vérifiés par des tests. Le tout **sans traiter aucun dossier
individuel** et **sans se substituer à un logiciel RH**.

---

## Ce que ce produit est / n'est pas

**Ce que c'est :**

- une application **strictement documentaire** : elle explique, transmet,
  oriente vers les bonnes sources ;
- un **exemple concret et gouverné** de ce qu'est un harnais IA ;
- un dépôt que chaque organisation **clone, configure et gouverne chez elle**.

**Ce que ce n'est pas :**

- ce **n'est pas un logiciel de gestion RH** (pas un SIRH), ni un module de
  logiciel RH ;
- ce **n'est pas un outil de gestion de dossiers d'agents** : aucune donnée
  individuelle, aucun dossier nominatif ;
- ce **n'est pas un outil de décision** (recrutement, carrière, paie,
  discipline, rémunération, absences, santé) ;
- ce **n'est pas un système de décision individuelle** : l'application **refuse
  explicitement** de répondre sur le cas d'une personne, et ce refus est testé ;
- ce **n'est pas un outil de conformité automatique** : rien ici ne « rend
  conforme » ; l'application porte la mention « ne vaut pas validation
  juridique » ;
- ce **n'est pas un substitut** au DSI, au DPO, au RSSI, aux juristes ou aux
  instances de décision.

---

## Démarrage rapide (parcours de réplication)

Prérequis : **Node.js version 20 ou plus** sur une machine standard (Linux,
macOS ou Windows). Aucun compte, aucun service externe, aucune base de données
ne sont nécessaires pour le mode démonstration.

```bash
git clone <repo>
cd comptoir-des-harnais
cp .env.example .env
npm install
npm run dev      # ouvre l'application sur http://localhost:3000
npm test         # exécute les tests de garde-fous et de structure
```

Autres commandes utiles :

```bash
npm run build            # construit une version optimisée
npm run validate-harness # vérifie qu'une configuration de harnais est complète
npm run generate-demo    # (re)génère ou vérifie le contenu de démonstration
```

Par défaut, l'application démarre en **mode démonstration** avec une collectivité
100 % fictive (voir plus bas). Il n'y a rien d'autre à configurer pour la voir
fonctionner.

---

## Les rubriques de l'application

L'application propose douze fonctions, toutes en langage métier :

1. **Accueil pédagogique** — ce qu'est ce portail, à qui il s'adresse, ce qu'il
   fait et ne fait pas.
2. **Parcours nouvel arrivant** — quatre modules ordonnés, avec progression
   visible.
3. **Bibliothèque de fiches** — fiches consultables (temps de travail,
   télétravail, mutuelles, marchés publics, contacts utiles, premiers jours),
   chacune avec sources, date et statut.
4. **FAQ sourcée** — une question documentaire reçoit une réponse produite
   **exclusivement** à partir des sources fournies, avec les sources citées.
5. **Quiz nouvel arrivant** — questions de validation d'une lecture ; aucun
   score n'est conservé ni transmis. Le quiz valide une lecture, jamais une
   personne.
6. **Checklist RH** — aide-mémoire de ce que la DRH doit préparer, valider et
   mettre à jour. Ce n'est pas un circuit de validation.
7. **Sources et dates de mise à jour** — le registre des sources rendu visible.
8. **Limites et refus** — ce que l'application ne répondra pas, et vers qui elle
   renvoie.
9. **Gouvernance** — responsable métier, DPO, DSI/RSSI, statut du harnais,
   classification des données, journal de mise à jour, mention « ne vaut pas
   validation juridique ».
10. **Mode démonstration** — l'application fonctionne immédiatement avec la
    collectivité fictive, clairement marquée « données fictives ».
11. **Mode configuration** — une collectivité adapte le portail en éditant des
    fichiers YAML et Markdown, **sans modifier le code**.
12. **Tests de garde-fous** — `npm test` vérifie que les réponses citent leurs
    sources, que les cas individuels sont refusés, et que les mentions
    obligatoires sont présentes.

---

## Le fournisseur de modèle et le mode dégradé

L'appel au modèle est isolé derrière une interface substituable, configurée dans
le fichier `.env` par la variable `MODEL_PROVIDER` :

- **`local`** (valeur par défaut) — **recherche documentaire locale**,
  déterministe. **Aucun appel réseau.** La FAQ fonctionne hors ligne, sans clé.
  C'est le mode utilisé pour la démonstration et les tests.
- **`anthropic`** — modèle d'IA générative externe (nécessite une clé et des
  appels réseau). Le point de substitution est documenté dans le code.
- **`none`** — **mode dégradé** : la FAQ générative est désactivée proprement,
  avec un message explicite. Le reste de l'application (parcours, fiches, quiz,
  pages de gouvernance) reste pleinement utilisable, et **les garde-fous restent
  actifs**.

Autrement dit : perdre le fournisseur de modèle ne fait perdre aucun contenu.
L'application reste utile même sans aucun accès réseau.

---

## Plan de lecture par persona

| Vous êtes… | Commencez par | Puis regardez |
|---|---|---|
| **DRH** (Claire) | ce README, puis lancez la démo et parcourez fiches et FAQ | la **checklist RH** et la page **limites et refus** dans l'application |
| **DGS / DGA** (Marc) | ce README, section « Ce que ce produit est / n'est pas » | la page **gouvernance** et les trois statuts (prototype / interne / production) |
| **DSI / RSSI** (Sofia) | le démarrage rapide, lancez `npm run dev` puis `npm test` | la configuration `.env`, les tests dans `tests/`, la gestion des secrets |
| **DPO** (Thomas) | ce README, la règle « aucune donnée réelle » ci-dessous | la **classification des données** et le **registre des sources** à l'écran |
| **Développeur OPSN** (Yann) | le démarrage rapide et la structure du dépôt | `src/` (code), `content/` et `configs/` (contenus), `tests/` (garde-fous) |

---

## Structure du dépôt

Les contenus métier sont **strictement séparés** du code : tout ce qu'une
collectivité adapte se trouve dans `content/` et `configs/` (territoire des
non-techniciens) ; le code vit dans `src/` (territoire des développeurs).

```text
comptoir-des-harnais/
├── README.fr.md            # ce document (porte d'entrée)
├── README.md               # renvoi + résumé anglais d'une page
├── CONTRIBUTING.fr.md      # comment contribuer
├── GLOSSAIRE.fr.md         # termes définis en langage courant
├── LICENSE                 # licence du code (MIT, provisoire)
├── LICENSES.fr.md          # note sur les licences code / contenus
├── .env.example            # variables d'environnement documentées, sans secret
├── package.json            # scripts : dev, build, test, validate-harness…
│
├── src/                    # l'application web (code) — pour développeurs
│   ├── app/                # pages : accueil, parcours, fiches, FAQ, quiz,
│   │                       #   checklist, sources, limites, gouvernance
│   ├── components/         # composants d'interface
│   └── lib/                # moteur documentaire, garde-fous, interface modèle
│
├── content/                # contenus métier — modifiables sans coder
│   └── demo-onboarding-rh/ # démo : collectivité fictive, données 100 % fictives
│       ├── sources/        # 6 sources fictives (SRC-001 à SRC-006)
│       ├── fiches/         # 6 fiches pédagogiques
│       ├── parcours/       # parcours en 4 modules
│       ├── quiz/           # questions de validation
│       ├── checklist.md    # aide-mémoire RH
│       └── gouvernance/    # classification, limites et refus, validation, journal
│
├── configs/                # configuration de l'organisation (YAML)
│   ├── demo.yml            # mode démo (collectivité fictive)
│   └── organisation.example.yml  # modèle commenté à copier pour sa collectivité
│
├── tests/                  # protègent le comportement et la structure
│   ├── guardrails/         # réponses sourcées, refus des cas individuels
│   └── structure/          # contenus complets, absence de secrets et de données réelles
│
└── scripts/                # validate-harness, generate-demo
```

---

## La collectivité de démonstration (100 % fictive)

Le mode démo repose sur une collectivité **entièrement inventée** : la
**« Communauté de communes de Roche-Vallonne »**. Son corpus comprend six
sources fictives — temps de travail (SRC-001), mutuelles labellisées (SRC-002),
note de télétravail (SRC-003), marchés publics (SRC-004), contacts utiles
(SRC-005), premiers jours (SRC-006) — six fiches, un parcours en quatre modules,
un quiz, une checklist et une gouvernance renseignée.

---

## Règle absolue : aucune donnée réelle

**Aucune donnée personnelle réelle n'est présente nulle part** — ni dans la
démonstration, ni dans les tests, ni dans les exemples de configuration. Tous
les contenus de démonstration sont fictifs et marqués **« données fictives —
démonstration »**. Un test de structure vérifie l'absence de motifs de données
réalistes. Toute contribution doit respecter cette règle (voir
`CONTRIBUTING.fr.md`).

---

## Avertissement

> Ce cadre aide à documenter et à sécuriser un usage d'IA générative. Il ne
> constitue ni un audit juridique, ni un avis de conformité RGPD ou AI Act, ni
> une homologation de sécurité, et **ne vaut pas validation juridique**. Ces
> qualifications relèvent du DPO, des juristes, du RSSI et des instances de
> décision de chaque organisation.

---

## Ce que ce document ne couvre pas

- Le détail technique de l'architecture, du moteur documentaire et des tests
  (à venir dans la documentation dédiée du dépôt).
- Les procédures internes de validation, d'homologation ou de déclaration
  propres à votre organisation.
- Toute qualification juridique (RGPD, AI Act) : elle relève de votre DPO et de
  vos juristes.
- Le déploiement hébergé : le mode démonstration et la vidéo se font en local.

---

## Licence

- **Code** : licence **MIT** (choix provisoire à confirmer). Voir `LICENSE`.
- **Contenus documentaires** (`content/`, `docs/`) : **CC BY-SA 4.0** proposée
  (provisoire). Voir `LICENSES.fr.md`.

---

<sub>Porté par Le Comptoir des Signaux / Pascal Chevallot.</sub>
