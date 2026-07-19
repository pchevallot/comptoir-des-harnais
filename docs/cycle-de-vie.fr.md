# Le cycle de vie d'un harnais

## À qui s'adresse ce document

- **P1 — la responsable RH (non technique).** Pour suivre, étape par étape, la création d'un harnais.
- **P2 — le directeur général des services / les élus.** Pour comprendre les trois statuts et qui décide de quoi.
- **P3 — la direction des systèmes d'information et la sécurité (DSI/RSSI).** Pour situer son rôle dans le parcours.
- **P4 — le délégué à la protection des données (DPO) et les juristes.** Pour repérer où se place la qualification des données.

Après cette lecture, vous saurez à quoi ressemble le parcours en dix étapes, ce que veulent dire les trois statuts, et qui porte la responsabilité à chaque grande étape.

---

## Le parcours en dix étapes

Le parcours conduit un besoin métier jusqu'à un harnais maintenu. Une règle constante : **une question à la fois, en langage métier, avec un exemple tiré du harnais d'accueil des nouveaux arrivants.** L'utilisateur n'est jamais face à une page blanche.

**Étape 1 — Exprimer son besoin en langage métier.**
On décrit la tâche répétitive, qui la fait, le temps qu'elle prend, ce qui se passe quand elle est mal faite, et qui utilise le résultat. Livrable : une « fiche besoin » d'une page, sans aucun vocabulaire technique.

**Étape 2 — Choisir un type de harnais.**
Deux familles en V1 : le *harnais documentaire* (transmettre un corpus sourcé : parcours, questions fréquentes, fiches) et le *harnais d'observation* (produire des synthèses à partir de données ouvertes). Si le besoin porte sur des situations individuelles, alerte : c'est hors du périmètre du cadre.

**Étape 3 — Lister les sources.**
Sur quels documents s'appuie-t-on ? Pour chacun : propriétaire, date de mise à jour, personne capable de dire s'il est périmé, et que faire en cas de contradiction. Livrable : le **registre des sources**.

**Étape 4 — Classer les données.**
On classe chaque source selon quatre niveaux : *publique*, *interne*, *personnelle*, *sensible*. Question clé : que resterait-il du besoin si l'on retirait toute donnée personnelle ? La classification est validée par le DPO (voir `gouvernance-rgpd-ai-act.fr.md`).

**Étape 5 — Définir ce que l'IA peut faire.**
Quelles productions attend-on (répondre à une question, présenter des fiches, proposer un quiz) ? À partir de quoi, exclusivement ? Sous quelle forme, et avec quelles mentions obligatoires (sources, date, statut) ?

**Étape 6 — Définir ce que l'IA ne peut pas faire.**
Le cadre impose un socle de refus non négociable : pas de cas individuel, pas d'avis juridique ou médical, pas d'affirmation sans source, pas de promesse de droit. L'utilisateur complète avec ses propres interdits métier. Livrable : la **page « limites et refus »**, affichée dans l'application et opposable.

**Étape 7 — Configurer et lancer.**
On adapte les fichiers de configuration et de contenu, puis on lance l'application sur un périmètre réduit (par exemple la seule fiche « télétravail »). Question : ce qui s'affiche est-il du niveau que vous accepteriez de diffuser après relecture ?

**Étape 8 — Tester.**
Les tests de garde-fous sont lisibles : questions attendues, réponses interdites, mentions obligatoires, sourçage, refus. On identifie les cinq vraies questions des nouveaux arrivants et la question piège qui doit produire un refus.

**Étape 9 — Valider.**
Validation humaine obligatoire avant toute diffusion, même interne. Une fiche de validation indique qui a relu, quand, sur quel périmètre, avec quelles réserves. Le statut est posé explicitement : **prototype**, **usage interne** ou **mise en production**. Un harnais sans fiche de validation reste un prototype.

**Étape 10 — Maintenir.**
Qui met à jour, à quel rythme ? Comment un lecteur signale-t-il une erreur ? Que devient le harnais si le responsable part ou si l'on change de fournisseur d'IA ? Livrables : le **journal de mise à jour** et le volet réversibilité.

Ces dix étapes portent les mêmes numéros et les mêmes intitulés dans la documentation, les modèles à remplir, le contenu de démonstration et l'application. L'utilisateur garde les mêmes repères d'un bout à l'autre.

> **Version opérationnelle.** Chaque grande étape est activable pas à pas par
> une skill de la fabrique (`skills/<nom>/SKILL.md`) : `cadrer-besoin-public`
> (cadrer le besoin, le type, l'organisation, les publics),
> `classifier-sources` (lister et classer les sources),
> `concevoir-garde-fous` (règles et refus), `configurer-fournisseur-ia`
> (mode IA), `adapter-corpus-onboarding` (import du corpus),
> `generer-tests-harnais` (tests) et `verifier-securite-rgpd` (rapport de
> gouvernance). Ce document reste la référence pédagogique ; les skills en sont
> la version exécutable, une question à la fois.

---

## Les trois statuts

Le statut d'un harnais n'est pas un détail d'affichage : c'est une décision humaine, tracée, qui engage l'organisation. Il est visible dans l'application (page de gouvernance et pied de page). Ces trois statuts sont **définis et opposables** : ils fixent ce que l'on a le droit de faire avec le harnais.

### Prototype
- **Sert à** comprendre et à démontrer.
- **Sources** fictives ou copies vérifiées.
- **Diffusion** limitée à l'équipe projet, jamais au-delà.
- **Données** : aucune donnée personnelle réelle.
- Le mode démonstration de ce dépôt est un prototype, et l'application l'affiche comme tel.

### Usage interne
- **Diffusé** à des agents identifiés.
- **Sources** réelles, validées par leurs propriétaires.
- **Fiche de validation** signée ; DPO informé.
- **Journal de mise à jour** actif.

### Mise en production
- **Accessible** au-delà de l'équipe (autres services, voire public).
- **Toutes** les exigences de gouvernance instruites (voir `gouvernance-rgpd-ai-act.fr.md`).
- **Revue** DSI / DPO / RSSI effectuée.
- **Responsable de maintenance** nommé.

Le passage d'un statut à l'autre est toujours une décision humaine tracée, jamais un effet automatique de l'outil.

---

## Qui fait quoi : un RACI simplifié

Pour chaque grande étape, on précise qui est **Responsable** (fait le travail), qui **Approuve** (décide), qui est **Consulté** et qui est **Informé**. Principe absolu : **l'IA n'apparaît jamais comme responsable.** Elle est un outil ; la responsabilité reste humaine.

| Grande étape | Responsable (fait) | Approuve (décide) | Consulté | Informé |
|---|---|---|---|---|
| **Besoin et type** (étapes 1-2) | Métier | Métier | DSI | Direction |
| **Sources** (étape 3) | Métier | Métier (propriétaires des sources) | — | DPO |
| **Classification des données** (étape 4) | DPO | DPO | Métier | DSI/RSSI |
| **Règles et refus** (étapes 5-6) | Métier | Métier | DPO, DSI/RSSI | Direction |
| **Configuration et tests** (étapes 7-8) | Appui technique | Métier | DSI/RSSI | Métier |
| **Validation et statut** (étape 9) | Métier | **Direction** (décision de statut) | DPO, DSI/RSSI | Agents concernés |
| **Sécurité d'exécution** (transverse) | DSI/RSSI | DSI/RSSI | Appui technique | Direction |
| **Maintenance** (étape 10) | Responsable de maintenance nommé | Métier | DPO, DSI/RSSI | Agents |

Lecture des rôles :

- **Le métier** porte le besoin et la validation de fond. C'est lui qui sait si une réponse est juste et diffusable.
- **Le DPO** porte la qualification des données. Lui seul tranche la classification et l'éligibilité au cadre.
- **La DSI/RSSI** porte la sécurité d'exécution : secrets, journalisation, réversibilité, hébergement.
- **La direction** porte la décision de statut : c'est elle qui autorise le passage prototype → interne → production.
- **L'IA** ne porte rien : elle exécute, sous garde-fous, ce que le cadre l'autorise à faire.

Dans la démonstration, la page de gouvernance nomme des **fonctions**, jamais des personnes.

---

## Ce que ce document ne couvre pas

- Il **ne détaille pas** les questions guidées de chaque étape : celles-ci figurent dans le parcours pédagogique du dépôt.
- Il **ne traite pas** du contenu réglementaire des checklists RGPD / AI Act / cybersécurité : voir `gouvernance-rgpd-ai-act.fr.md`.
- Il **ne décrit pas** l'architecture technique ni le threat model : voir `architecture.fr.md`.
- Il **ne remplace pas** la décision humaine de statut et **ne vaut pas validation juridique**.
- Il **ne compare** ce cadre à aucun autre outil ou projet.
