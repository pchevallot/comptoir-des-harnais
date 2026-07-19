# Comprendre les harnais

## À qui s'adresse ce document

- **P1 — la responsable RH (non technique).** Pour comprendre ce qu'est un harnais avant d'en parler à sa direction.
- **P2 — le directeur général des services / les élus.** Pour saisir l'idée en quelques minutes, sans vocabulaire technique.

Après cette lecture, vous saurez répondre à la question « qu'est-ce qu'un harnais, au juste ? » avec vos propres mots, et distinguer un harnais d'un simple usage improvisé de l'IA.

---

## Un harnais n'est pas un prompt

Beaucoup d'usages de l'IA se résument aujourd'hui à une phrase tapée dans un outil : « Rédige-moi une note sur le télétravail ». Cette phrase, on l'appelle souvent un « prompt ». Elle donne un résultat immédiat, parfois impressionnant. Mais elle ne dit rien de la fiabilité du résultat, de ses sources, de qui en répond, ni de ce qui se passe quand la question sort du cadre prévu.

Un **harnais** est l'inverse d'une phrase isolée. C'est un ensemble structuré qui encadre l'usage d'un modèle d'IA générative (un outil capable de produire du texte) pour qu'il rende un service **utile, maintenable et gouverné**.

> **Définition de travail.** Un harnais IA n'est pas un prompt. C'est un ensemble structuré de besoins métier, de sources, de règles, d'outils, de garde-fous, de tests, de responsabilités et de preuves qui encadrent l'IA pour produire une application, un livrable ou une capacité métier utile, maintenable et gouvernée.

La différence tient en une image : un prompt, c'est une demande lancée en l'air. Un harnais, c'est l'équipement qui permet d'atteler la force de l'IA à un travail précis, sans qu'elle parte dans toutes les directions.

## La métaphore du harnais

On n'attelle pas un cheval sans harnais. Le cheval est puissant, mais cette puissance n'est utile que si elle est **reliée, orientée et contrôlée**. Le harnais ne bride pas le cheval par méfiance : il permet de s'en servir vraiment, en sécurité, pour tirer une charge dans la bonne direction.

L'IA générative est cette force. Seule, elle produit vite, mais sans garantie : elle peut inventer, se tromper de source, répondre sur un sujet qu'elle devrait refuser. Le harnais est l'équipement qui relie cette force à un besoin réel, avec des points d'attache solides : des sources vérifiées, des règles claires, des refus prévus, des tests, et des personnes responsables.

Un harnais, ce n'est donc pas « moins d'IA ». C'est **de l'IA que l'on peut assumer** : montrer, tester, corriger, et dont on peut dire qui en répond.

## Les 8 blocs d'un harnais

Un harnais complet repose sur huit blocs. Aucun n'est optionnel : un harnais auquel il manque un bloc reste un prototype, quoi qu'il affiche.

1. **Besoins.** Le point de départ est toujours un besoin métier réel, exprimé en langage courant. *Exemple : « éviter de répéter les mêmes explications aux nouveaux arrivants à chaque recrutement ».* Sans besoin clair, il n'y a pas de harnais, juste une démonstration.

2. **Sources.** Le harnais s'appuie sur des documents identifiés : délibérations, notes de service, règlements, guides. Chaque source a un propriétaire, une date et un périmètre. L'IA ne répond qu'à partir de ces sources, jamais de sa mémoire générale. *Exemple : la note de service sur le télétravail, datée et référencée.*

3. **Règles.** Ce que l'IA a le droit de produire, et sous quelle forme. *Exemple : « répondre aux questions documentaires des nouveaux arrivants, uniquement à partir des sources, en citant toujours la source utilisée ».*

4. **Outils.** Les moyens techniques mobilisés : ici, une application web qui tourne sur un poste, un moteur de recherche dans les sources, et un modèle d'IA générative optionnel. Les outils servent le besoin ; ils ne sont pas le but.

5. **Garde-fous.** Les refus prévus à l'avance. Le harnais refuse par construction certaines demandes : le cas d'une personne nommée, un avis juridique ou médical, une promesse de droit. *Exemple : à la question « Est-ce que Madame Martin a droit au télétravail ? », l'application refuse et renvoie vers le service RH.* Ces garde-fous sont dans l'application elle-même, pas confiés à la bonne volonté de l'IA.

6. **Tests.** Des vérifications automatiques qui rejouent les comportements attendus : les réponses citent-elles leurs sources ? Les cas individuels sont-ils bien refusés ? Les mentions obligatoires sont-elles présentes ? Un harnais se prouve, il ne se promet pas.

7. **Responsabilités.** Qui porte quoi. Le métier porte le besoin et valide le fond ; le délégué à la protection des données (DPO) qualifie les données ; la direction des systèmes d'information et la sécurité (DSI/RSSI) répondent de la sécurité d'exécution ; la direction décide du statut. **L'IA n'est jamais responsable de quoi que ce soit.**

8. **Preuves.** Ce qui rend le harnais vérifiable : sources datées et affichées, statut visible, journal de mise à jour, résultats de tests, mentions systématiques. Les preuves sont visibles à l'écran, pas cachées dans un document.

Ces huit blocs se retrouvent tout au long du cycle de vie du harnais (voir `cycle-de-vie.fr.md`).

## À qui ça sert

- **À la responsable métier (P1) :** disposer d'un service documentaire fiable et maintenable, sans dépendre en permanence d'un prestataire, et sans que cela ressemble à un outil de gestion des agents.
- **Au décideur (P2) :** pouvoir dire « nous expérimentons l'IA de façon cadrée », et le démontrer, plutôt que subir des usages non déclarés.
- **Aux agents :** obtenir des réponses sourcées et à jour, et savoir quand l'outil renvoie vers un humain.

Le harnais de démonstration fourni dans ce dépôt met tout cela en œuvre pour un cas concret : un portail d'accueil documentaire des nouveaux arrivants, pour une collectivité entièrement fictive, la « Communauté de communes de Roche-Vallonne ». Son statut affiché est **prototype**.

---

## Ce que ce document ne couvre pas

- Il **ne décrit pas** le détail du parcours de création d'un harnais : c'est l'objet de `cycle-de-vie.fr.md`.
- Il **ne traite pas** des obligations RGPD, de l'AI Act ni de la cybersécurité : voir `gouvernance-rgpd-ai-act.fr.md`.
- Il **ne décrit pas** l'architecture technique de l'application : voir `architecture.fr.md`.
- Il **ne vaut pas validation juridique** et n'engage aucune qualification réglementaire.
- Il **ne compare** ce cadre à aucun autre outil ou projet.
