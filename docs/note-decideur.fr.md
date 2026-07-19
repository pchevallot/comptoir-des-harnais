# Note au décideur

## À qui s'adresse cette note

- **P2 — le directeur général des services, les élus.** Une synthèse en deux pages, pour décider en connaissance de cause.

Ton sobre et institutionnel. Aucune promesse. Vous saurez, après cette lecture, ce que le harnais apporte, ce qu'il n'est pas, et ce qu'il faut réunir avant d'aller plus loin.

---

## Le problème

Les collectivités et organismes publics font face à trois réalités en même temps :

- Des **tâches répétitives** peu outillées : les mêmes explications répétées à chaque recrutement, des notes reconstruites à la main, des fiches jamais à jour.
- Une **pression à « faire de l'IA »**, alimentée par des démonstrations spectaculaires mais rarement transposables, sans sources et sans cadre.
- Des **exigences légitimes de sécurisation** : protection des données, réglementation européenne sur l'IA, cybersécurité, responsabilité des agents et des élus.

Interdire l'IA ne fait pas disparaître les usages : cela les pousse dans l'ombre. Les autoriser sans cadre expose la collectivité. Il manque un moyen terme : un usage **cadré, visible et démontrable**.

## Ce qu'apporte le harnais

Un harnais IA n'est pas un prompt lancé en l'air. C'est un ensemble structuré qui encadre l'IA pour qu'elle rende un service **utile, maintenable et gouverné**. Le dépôt fournit un exemple complet et fonctionnel : un **portail d'accueil documentaire des nouveaux arrivants**.

Ce que le harnais garantit, par construction :

- Chaque réponse est **sourcée** : elle s'appuie sur des documents identifiés et datés, jamais sur l'imagination de l'outil.
- Les **cas individuels sont refusés** : l'application ne se prononce jamais sur la situation d'une personne nommée, et renvoie vers le service compétent.
- Les **limites et la gouvernance sont affichées** à l'écran, pas cachées dans un document.
- Tout **fonctionne en local**, sans base de données, sans compte, et par défaut **sans aucun appel réseau**.

## La démonstration en deux minutes

L'application tourne sur un simple poste. En quelques minutes, on peut :

1. Poser une vraie question d'un nouvel arrivant (« Combien de jours de télétravail sont possibles ? ») et lire une **réponse sourcée**, avec la source citée, sa date et la mention d'assistance IA.
2. Poser une question piège sur une personne (« Est-ce que Madame Martin a droit au télétravail ? ») et constater le **refus** courtois, avec renvoi vers le service RH. Ce n'est pas un défaut : c'est la règle centrale du harnais.
3. Ouvrir les pages **sources**, **limites** et **gouvernance** qui rendent le cadre visible.

La démonstration utilise une collectivité **entièrement fictive** (« Communauté de communes de Roche-Vallonne ») et des données **entièrement fictives**. Son statut affiché est **prototype**.

## La gouvernance et les trois statuts

La page de gouvernance nomme les fonctions responsables (métier, DPO, DSI/RSSI) et affiche le statut du harnais. Trois statuts, définis et opposables :

- **Prototype** — sert à comprendre et démontrer ; jamais diffusé au-delà de l'équipe projet ; aucune donnée réelle. C'est le statut de la démonstration.
- **Usage interne** — diffusé à des agents identifiés ; sources réelles validées ; fiche de validation signée ; DPO informé.
- **Mise en production** — accessible plus largement ; toutes les exigences instruites ; revue DSI / DPO / RSSI ; responsable de maintenance nommé.

Le passage d'un statut à l'autre est une **décision humaine tracée**, jamais un effet automatique de l'outil. C'est la direction qui décide du statut.

## Expérimenter l'IA de façon cadrée

Ce cadre permet de dire, et de démontrer, « nous expérimentons l'IA de façon cadrée » :

- On part d'un **irritant réel**, pas d'un effet d'annonce.
- On **associe le DPO et la DSI/RSSI dès le premier jour**.
- On reste au statut **prototype** tant que les conditions d'un usage interne ne sont pas réunies.
- On garde la **maîtrise** : formats ouverts, exécution locale, aucun verrou fournisseur.

## Ce que ce n'est pas

- Ce n'est **pas un SIRH**, ni un module de SIRH, ni un outil de gestion des agents.
- Ce n'est **pas un outil de décision individuelle** : aucun dossier nominatif, aucune situation personnelle traitée.
- Ce n'est **pas un outil de conformité automatique** : rien ici ne « rend conforme ». La note porte la mention **« ne vaut pas validation juridique »**.
- Ce n'est **pas un substitut** au DPO, à la DSI, au RSSI ni aux juristes : le cadre leur donne prise, il ne les court-circuite pas.

## Les garanties visibles

À l'écran, sans lire une ligne de code : sources datées, statut du harnais, classification des données, limites et refus, journal de mise à jour, mention d'assistance IA. Et une suite de **tests automatiques** vérifie que les réponses citent leurs sources, que les cas individuels sont refusés et que les mentions obligatoires sont présentes.

## Décision proposée

Autoriser une **expérimentation au statut prototype**, sur un périmètre documentaire réduit, en associant dès le départ le DPO et la DSI/RSSI, sans aucune donnée personnelle réelle. Réexaminer le statut seulement lorsque les conditions d'un usage interne sont réunies.

---

## Ce que cette note ne couvre pas

- Elle **ne détaille pas** le fonctionnement technique : voir `architecture.fr.md`.
- Elle **ne traite pas** le détail RGPD / AI Act / cybersécurité : voir `gouvernance-rgpd-ai-act.fr.md`.
- Elle **ne vaut pas validation juridique** et **ne compare** ce cadre à aucun autre outil ou projet.
