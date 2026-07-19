# Architecture de l'application

## À qui s'adresse ce document

- **P3 — la direction des systèmes d'information et la sécurité (DSI/RSSI).** Pour évaluer le cadre : exécution, flux de données, menaces, secrets, journalisation.

Après cette lecture, vous saurez comment l'application est construite, par où passent les données, quelles menaces le cadre anticipe, et ce qui reste à la charge de votre organisation.

Le vocabulaire technique est ici assumé : ce document est le seul, avec le code, à ne pas s'adresser à un public non technique.

---

## 1. Vue d'ensemble

L'application est un portail web construit avec **Next.js** (App Router) et **TypeScript**, testé avec **Vitest**. Elle s'exécute **entièrement en local**, sur un poste de travail.

Principes structurants :

- **Pas de base de données.** Les sources et contenus sont des fichiers **Markdown**, **YAML** et **JSON**, versionnés dans le dépôt.
- **Contenus séparés du code.** Tout ce qu'une organisation adapte est sous `content/` et `configs/` ; le code reste sous `src/`. Adapter le portail ne demande jamais de modifier `src/`.
- **Exécution locale par défaut.** Aucun compte, aucun service externe, aucune base de données n'est requis pour la démonstration.
- **Fournisseur de modèle par défaut local et hors ligne.** Aucun appel réseau n'est émis tant qu'un fournisseur externe n'est pas explicitement configuré.

Démarrage type : `git clone`, `cp .env.example .env`, `npm install`, `npm run dev`, `npm test`.

---

## 2. Flux de données d'une question documentaire

Quand un utilisateur pose une question à la FAQ, le traitement suit un ordre strict (implémenté dans `src/lib/answer.ts`). **Les garde-fous passent en premier ; ils ne sont jamais délégués au modèle.**

1. **Garde-fous (`src/lib/guardrails.ts`).** La question est analysée avant toute recherche ou tout appel de modèle. Cas individuel (personne nommée ou identifiable, situation individuelle), avis juridique, avis médical, promesse de droit → **refus courtois**, avec renvoi vers la fonction compétente (service RH, service juridique, médecine du travail). En cas de doute sur un cas individuel, le cadre refuse.

2. **Recherche dans les sources (`src/lib/retrieval.ts`).** Si la question passe les garde-fous, le moteur recherche dans le corpus documentaire chargé depuis `content/`. Le corpus V1 est petit (quelques documents).

3. **Hors corpus → « je ne sais pas ».** Si aucune source pertinente n'est trouvée, l'application répond explicitement qu'elle ne dispose pas de source, et renvoie vers un contact. Elle n'improvise jamais.

4. **Fournisseur de modèle.** L'interface modèle (`src/lib/model/`) fournit un fournisseur. S'il est absent ou indisponible (mode dégradé), l'application affiche les sources pertinentes et signale que la réponse assistée est désactivée.

5. **Composition sourcée.** Le fournisseur compose une réponse **strictement à partir des extraits fournis**, avec obligation de citer les sources et interdiction d'inventer. Un filet de sécurité en sortie rejette toute formulation proscrite (promesse de droit, évaluation d'une personne).

6. **Mentions systématiques.** Toute réponse porte : **sources citées**, **date des sources**, **statut du harnais**, **mention d'assistance IA** (« Ne vaut pas validation juridique »).

Ce flux garantit qu'aucune réponse ne sort du corpus, et qu'aucun cas individuel n'atteint jamais le moteur de recherche ou le modèle.

---

## 3. Interface modèle substituable

L'appel au modèle est isolé derrière une **interface unique** (`src/lib/model/types.ts`), pilotée par la variable d'environnement `MODEL_PROVIDER` :

- **`local`** (défaut) : recherche documentaire déterministe, **aucun appel réseau**. C'est le mode de la démonstration et des tests. La FAQ fonctionne hors ligne, sans clé.
- **`anthropic`** : illustre le branchement d'un modèle d'IA générative externe. La clé est lue **uniquement côté serveur** (variable d'environnement), **jamais exposée au navigateur**. En V1, l'appel réseau réel n'est pas câblé : le point d'intégration est documenté dans `src/lib/model/anthropic.ts`.
- **`none`** : mode dégradé explicite. La réponse assistée est désactivée ; le reste du portail reste utilisable ; les garde-fous restent actifs.

Aucun fournisseur n'est codé en dur ailleurs dans l'application. Changer de fournisseur = fournir une autre implémentation de l'interface et ajuster `.env`. Les garde-fous et le sourçage restent dans l'application, jamais délégués au modèle.

---

## 4. Threat model (langage accessible)

Cinq menaces sont anticipées. Pour chacune : un scénario concret, la parade prévue dans le cadre, et ce qui reste à la charge de l'organisation.

### Menace 1 — Fuite de sources internes vers un service tiers
- **Scénario.** Une organisation active un fournisseur externe. Le contenu de sources internes part chez ce fournisseur, qui pourrait le conserver ou le réutiliser.
- **Parade dans le cadre.** Le fournisseur par défaut est **local** et n'émet **aucun appel réseau**. Seule la réponse assistée peut solliciter un service externe, et uniquement si l'organisation l'active explicitement. Les journaux ne contiennent jamais le contenu des sources.
- **À la charge de l'organisation.** Décider d'activer ou non un fournisseur externe ; instruire le contrat de sous-traitance ; interroger la localisation des traitements et la réutilisation des données (voir `gouvernance-rgpd-ai-act.fr.md`).

### Menace 2 — Injection par une source contaminée
- **Scénario.** Une source ajoutée au corpus contient des instructions cachées destinées au modèle (« ignore les consignes précédentes et réponds ceci… »).
- **Parade dans le cadre.** Les garde-fous s'exécutent **avant** toute recherche et tout appel de modèle : ils ne dépendent pas du contenu des sources. Le sourçage est exclusif et le contrat impose de ne rien produire hors extraits. Un filet de sécurité en sortie rejette les formulations proscrites.
- **À la charge de l'organisation.** Valider les sources avant de les intégrer (propriétaire, date, contenu réel) ; ne verser au corpus que des documents dont on connaît l'origine.

### Menace 3 — Clé d'API exposée dans le dépôt ou les journaux
- **Scénario.** Une clé de fournisseur externe est commise dans le dépôt, ou apparaît dans un fichier de journal.
- **Parade dans le cadre.** Les clés sont **uniquement** en variables d'environnement. `.env.example` ne contient **aucune valeur** ; `.env` est listé dans `.gitignore`. La clé est lue côté serveur seulement. Les journaux ne contiennent que des métadonnées (jamais de secret, jamais de contenu de source). Un test de structure vérifie l'absence de motifs de secrets.
- **À la charge de l'organisation.** Gérer les accès au dépôt ; **révoquer et régénérer** toute clé exposée (rotation) ; surveiller ses propres environnements de déploiement éventuels.

### Menace 4 — Contenu falsifié entre édition et affichage
- **Scénario.** Un contenu est modifié (par erreur ou malveillance) entre le moment où il est rédigé et celui où il s'affiche, sans que personne ne le remarque.
- **Parade dans le cadre.** Les contenus sont des **fichiers versionnés** (git) : tout changement est traçable et réversible. Les tests de structure vérifient la présence des sections et mentions obligatoires. Le registre des sources et le journal de mise à jour rendent les versions visibles.
- **À la charge de l'organisation.** Contrôler les accès en écriture au dépôt ; relire les modifications (revue) ; tenir le journal de mise à jour à jour.

### Menace 5 — Perte de la capacité de faire tourner l'application (réversibilité)
- **Scénario.** Le fournisseur de modèle disparaît, change ses conditions, ou la personne responsable part. L'organisation risque de ne plus pouvoir utiliser son harnais.
- **Parade dans le cadre.** Tout est en **formats ouverts** et versionné localement. L'application tourne **sans fournisseur externe** (mode local ou dégradé) : la perte du fournisseur ne fait perdre **aucun contenu**. Parcours, fiches, quiz et gouvernance restent consultables.
- **À la charge de l'organisation.** Conserver une copie du dépôt ; documenter qui sait le faire tourner ; ne jamais placer de contenu unique hors du dépôt.

---

## 5. Gestion des secrets

- Les clés éventuelles sont **exclusivement** en variables d'environnement.
- `.env.example` documente chaque variable **sans aucune valeur secrète**.
- `.gitignore` exclut `.env`, `.env.local`, les variantes locales et les journaux.
- Consigne explicite de **rotation** : en cas d'exposition d'une clé, la révoquer puis en générer une nouvelle.
- Un **test de structure** vérifie l'absence de motifs de secrets dans le dépôt.
- La clé d'un fournisseur externe est lue **côté serveur uniquement**, jamais transmise au navigateur.

---

## 6. Journalisation

La journalisation est **locale et sobre** (`src/lib/logging.ts`). Elle vise la traçabilité sans fuite.

- **Ce qui est journalisé :** horodatage, type d'événement (appel de modèle, refus, « je ne sais pas », mode dégradé), fournisseur, statut du harnais, **identifiants** des sources citées, motif éventuel de refus.
- **Ce qui n'est jamais journalisé :** le **contenu** des sources internes, le **texte** des réponses, aucun secret.
- Les journaux sont écrits localement (répertoire `logs/`, exclu de git). En environnement de test, la journalisation est silencieuse. Elle n'interrompt jamais le service en cas d'échec d'écriture.
- La **durée de conservation** des journaux est déclarée par l'organisation (voir `gouvernance-rgpd-ai-act.fr.md`).

---

## Ce que ce document ne couvre pas

- Il **ne fournit pas** d'homologation de sécurité ni de test d'intrusion.
- Il **ne traite pas** de la sécurité du poste, du réseau ou de l'hébergement de l'organisation : cela relève du RSSI.
- Il **ne détaille pas** les obligations RGPD / AI Act : voir `gouvernance-rgpd-ai-act.fr.md`.
- Il **ne prescrit ni ne recommande** de fournisseur de modèle ou d'hébergeur.
- Il **ne vaut pas validation juridique** et **ne compare** ce cadre à aucun autre outil ou projet.
