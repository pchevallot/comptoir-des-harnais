# Gouvernance : RGPD, AI Act et cybersécurité

## À qui s'adresse ce document

- **P3 — la direction des systèmes d'information et la sécurité (DSI/RSSI).** Pour situer les exigences de sécurité et de réversibilité.
- **P4 — le délégué à la protection des données (DPO) et les juristes.** Pour vérifier vite qu'un usage est documenté : finalité, données, conservation, sous-traitants.

Après cette lecture, vous saurez comment le cadre classe les données, quelles questions se poser côté RGPD, AI Act et cybersécurité, et où s'arrête l'aide fournie.

> **Avertissement structurant.** Ce cadre aide à documenter et à sécuriser un usage d'IA générative. Il ne constitue ni un audit juridique, ni un avis de conformité RGPD ou AI Act, ni une homologation de sécurité, et **ne vaut pas validation juridique**. Ces qualifications relèvent du DPO, des juristes, du RSSI et des instances de décision de chaque organisation.

---

## 1. Classification des données en quatre niveaux

Le cadre distingue quatre niveaux. Ils se posent **source par source**, dans le registre des sources, et sont affichés sur la page de gouvernance de l'application.

| Niveau | Définition courte | Exemple |
|---|---|---|
| **Publique** | Déjà diffusée librement, sans restriction. | Une fiche officielle sur les marchés publics. |
| **Interne** | Non confidentielle mais destinée à l'organisation. | Une note de service sur le télétravail. |
| **Personnelle** | Concerne une personne identifiée ou identifiable. | Le dossier d'un agent, une situation nominative. |
| **Sensible** | Personnelle et particulièrement protégée. | Données de santé, d'appartenance syndicale. |

### Règle de la V1 (non négociable)

Un harnais du cadre **ne traite que les niveaux *publique* et *interne***.

La présence de données **personnelles** ou **sensibles** rend le cas **inéligible en l'état** et déclenche un **renvoi vers le DPO**. Ce n'est pas une limite technique de contournement : c'est le choix de conception qui distingue ce cadre d'un outil de gestion des agents. Dans la démonstration, les six sources sont classées *publique* ou *interne*, et aucune ne contient de donnée personnelle réelle.

---

## 2. Checklists honnêtes

Chaque checklist dit ce qu'elle **ne couvre pas**. Cocher toutes les cases ne rend conforme à rien : cela structure le travail que le DPO, le juriste et le RSSI doivent instruire.

### 2.1 Checklist RGPD

- [ ] La **finalité** de l'usage est écrite en une phrase.
- [ ] Chaque source est **classée** (publique / interne / personnelle / sensible).
- [ ] Aucune donnée **personnelle** ou **sensible** n'entre dans le harnais (sinon : renvoi DPO).
- [ ] Le **registre des sources** est rempli (identifiant, titre, propriétaire, date, statut, périmètre).
- [ ] Le **registre des usages IA** comporte une ligne pour ce harnais.
- [ ] Les **durées de conservation** sont déclarées (sources, journaux, échanges éventuels).
- [ ] La règle **« aucune donnée personnelle réelle »** est vérifiée, y compris dans les exemples et les tests.
- [ ] Un **responsable métier** est identifié, le **DPO** est informé.

**Ce que cette checklist ne couvre pas :** la base légale du traitement, l'analyse d'impact (AIPD) si elle est requise, l'information des personnes concernées, l'exercice des droits, la qualification finale du caractère personnel ou non d'une donnée. Ces points relèvent du DPO et des juristes.

### 2.2 Checklist AI Act

- [ ] Le cas d'usage est **décrit** (ici : un usage documentaire, sans décision individuelle).
- [ ] Une **qualification préliminaire du niveau de risque** est instruite par le juriste.
- [ ] L'**absence de décision individuelle automatisée** est vérifiée et testée.
- [ ] Chaque réponse générée porte la **mention d'assistance IA** (transparence).
- [ ] Le **modèle et le fournisseur** utilisés sont notés (nom générique).

**Ce que cette checklist ne couvre pas :** le classement réglementaire définitif du système au sens de l'AI Act, les obligations propres à d'éventuels systèmes à haut risque, la documentation technique exigible d'un fournisseur, la surveillance après mise sur le marché. Ce sont des qualifications juridiques externes à ce cadre.

### 2.3 Checklist cybersécurité

- [ ] Les **clés** éventuelles sont en variables d'environnement, jamais dans le dépôt.
- [ ] `.env.example` ne contient **aucune valeur secrète** ; `.env` est ignoré par git.
- [ ] Une **consigne de rotation** en cas d'exposition est connue.
- [ ] La **journalisation** ne contient jamais le contenu des sources, seulement des identifiants.
- [ ] Le **threat model** (voir `architecture.fr.md`) a été lu et ses points « à la charge de l'organisation » sont pris en compte.
- [ ] La question **hébergement / souveraineté** est posée si un fournisseur externe est activé.

**Ce que cette checklist ne couvre pas :** l'homologation de sécurité du système d'information hôte, les tests d'intrusion, la sécurité du poste et du réseau de l'organisation, la gestion des accès au dépôt. Ces éléments relèvent du RSSI et de la politique de sécurité de l'organisation.

---

## 3. Registre des usages IA

Au niveau de l'organisation, chaque harnais occupe **au moins une ligne** dans un registre des usages IA. Modèle de ligne :

| Champ | Contenu attendu | Exemple (démonstration) |
|---|---|---|
| **Finalité** | À quoi sert le harnais, en une phrase. | Accueil documentaire des nouveaux arrivants. |
| **Données** | Niveaux traités (publique / interne uniquement en V1). | Publique et interne, aucune donnée personnelle. |
| **Modèle et fournisseur** | Nom générique du modèle et fournisseur. | Recherche documentaire locale (aucun appel réseau). |
| **Statut** | Prototype / usage interne / mise en production. | Prototype. |
| **Responsable** | Fonction responsable (jamais une personne dans la démo). | Direction des ressources humaines. |
| **Date de revue** | Prochaine date de réexamen. | À fixer par l'organisation. |

Ce registre est un outil de pilotage du DPO et de la direction. Il se tient à jour à chaque changement de statut ou de fournisseur.

---

## 4. Durées de conservation

Le cadre impose de **déclarer** ce qui est conservé et pour combien de temps. Positions par défaut :

- **Contenus saisis par les utilisateurs** (questions, réponses aux quiz) : **non conservés**. L'application ne persiste aucune donnée saisie au-delà de la journalisation technique locale.
- **Journaux techniques locaux** : conservés localement ; ils ne contiennent que des métadonnées (date, harnais, identifiants de sources, résultat), jamais le contenu des sources ni le texte des réponses. La durée de conservation est déclarée par l'organisation.
- **Échanges avec un fournisseur de modèle externe** : par défaut, ne rien laisser conserver chez le fournisseur quand l'option existe. En mode de démonstration, aucun appel externe n'a lieu (fournisseur local, hors ligne).

---

## 5. Sous-traitants

Si l'organisation active un fournisseur de modèle externe, celui-ci devient un **sous-traitant potentiel** au sens du RGPD. Le cadre **ne désigne ni ne recommande aucun fournisseur**. Il fournit les questions à poser :

- Où les données sont-elles **traitées** (localisation, droit applicable) ?
- Les données transmises sont-elles **réutilisées** pour entraîner le modèle ? Peut-on s'y opposer ?
- Quelles **clauses contractuelles** encadrent le traitement (contrat de sous-traitance, garanties) ?
- Quelles **options d'hébergement** européen ou souverain existent ?
- Que devient l'usage si le fournisseur **change ses conditions** ?

En mode de démonstration, cette question ne se pose pas : le fournisseur par défaut est local et n'émet aucun appel réseau.

---

## 6. Réversibilité et absence de verrou fournisseur

Tout ce qui constitue le harnais est en **formats ouverts** (Markdown, YAML, JSON), lisible, exportable et versionné dans le dépôt de l'organisation :

- Les **sources**, **contenus**, **configurations**, **règles** et **tests** ne dépendent d'aucun fournisseur.
- Changer de fournisseur de modèle = changer la **configuration** de l'interface modèle (une variable d'environnement), au plus un adaptateur documenté.
- La **perte du fournisseur** ne fait perdre **aucun contenu**. L'application reste utilisable en mode dégradé : parcours, fiches, quiz et pages de gouvernance continuent de fonctionner ; seule la réponse assistée est désactivée, avec un message explicite.

La réversibilité n'est donc pas une promesse : elle découle de la manière dont le harnais est construit.

---

## Ce que ce document ne couvre pas

- Il **ne fournit pas** de qualification juridique : base légale, AIPD, information des personnes et exercice des droits relèvent du DPO et des juristes.
- Il **ne classe pas** le système au sens de l'AI Act à votre place.
- Il **ne remplace pas** une homologation de sécurité ni la politique de sécurité de l'organisation : voir `architecture.fr.md` pour le volet technique.
- Il **ne recommande aucun** fournisseur, hébergeur ou prestataire.
- Il **ne vaut pas validation juridique** et **ne compare** ce cadre à aucun autre outil ou projet.
