# Spec — Skills du projet

Les skills sont le **savoir-faire procédural** de la fabrique : ce qu'un
accompagnateur expérimenté ferait à chaque étape. Elles sont locales au dépôt,
sans dépendance à des skills externes.

---

## 1. Format commun

Une skill = un dossier `skills/<nom>/` contenant `SKILL.md` :

```markdown
---
name: cadrer-besoin-public
description: Transformer un irritant métier en fiche besoin d'une page, en langage métier, éligible au cadre (documentaire, sans cas individuel).
etapes_parcours: [1, 2, 3, 6]
scripts_associes: ["scripts/interview-harness.mjs"]
fichiers_produits: ["cases/<slug>/gouvernance/fiche-besoin.md", "cases/<slug>/harnais.yaml"]
---

## Quand l'activer
## Ce que je demande      (questions, une à la fois, avec exemples de réponse)
## Ce que je produis      (fichiers, format exact, exemple rempli)
## Ce que je refuse       (conditions d'arrêt, message type, renvoi)
## Réussite               (critères vérifiables)
```

Règles communes à toutes les skills :

- français, langage métier, une question à la fois, exemple de réponse tiré du
  cas `onboarding-agents` ;
- une skill **produit des fichiers ou s'arrête** — jamais de conseil en l'air ;
- une skill ne valide rien elle-même : elle appelle le script déterministe
  associé et lui fait confiance ;
- une skill n'écrit jamais de secret et refuse d'en recevoir (si l'utilisateur
  colle une clé, la skill répond « je ne stocke pas de clé ; mettez-la dans
  `.env.local` » et ne la répète pas) ;
- double usage : lisible par un humain qui suit la procédure à la main,
  activable par un agent (Claude Code charge `skills/` comme skills projet).

## 2. Les huit skills

### 2.1 `cadrer-besoin-public`

- **Objectif.** Produire une fiche besoin d'une page à partir d'un irritant
  métier, et vérifier l'éligibilité au cadre.
- **Déclenchement.** Étapes 1–3 et 6 de l'interview ; ou à la demande
  (« aide-moi à cadrer mon besoin »).
- **Inputs.** Rien (tout vient des réponses).
- **Questions.** Tâche répétée, fréquence, qui, durée, conséquence d'un oubli,
  consommateur du résultat, signe de réussite ; type de harnais ; publics ;
  modules souhaités.
- **Outputs.** `gouvernance/fiche-besoin.md` ; champs `type`, `besoin`,
  `publics`, `modules` du manifeste ; section `organisation` de la config.
- **Erreurs / refus.** Besoin individualisé (« répondre sur la situation de
  chaque agent ») → refus d'éligibilité, renvoi vers le socle de refus,
  arrêt propre. Nom de personne fourni comme responsable → redemande une
  fonction.
- **Succès.** La fiche besoin tient sur une page, ne contient aucun terme
  technique, et l'accueil de l'application peut la citer telle quelle.

### 2.2 `classifier-sources`

- **Objectif.** Déclarer les sources et classer leurs données, source par
  source.
- **Déclenchement.** Étapes 4–5 ; ou lors de l'ajout d'une source à un cas
  existant.
- **Inputs.** Liste des documents existants (titres), à défaut rien.
- **Questions.** Par source : titre, fonction propriétaire, date connue,
  contient-elle noms / situations individuelles / santé / RH nominatif ?
  classification `publique` ou `interne` ; qui valide (réponse guidée : DPO).
- **Outputs.** `sources_declarees` (manifeste),
  `gouvernance/classification.md`.
- **Erreurs / refus.** Donnée personnelle ou sensible détectée → la source est
  marquée `ineligible` avec motif, jamais importée ; message : « anonymisez ou
  généralisez, puis revenez ; en cas de doute, DPO ». Classification autre que
  publique/interne → refus (périmètre V1/V2).
- **Succès.** Chaque source déclarée a propriétaire (fonction), date,
  classification ; `validate-corpus` retrouvera cette liste à l'étape 11.

### 2.3 `concevoir-garde-fous`

- **Objectif.** Transformer « ce qu'on ne veut jamais voir répondre » en cas de
  tests exécutables et en page limites-refus.
- **Déclenchement.** Étapes 7–8 ; ou « durcis mes garde-fous ».
- **Inputs.** Manifeste (publics, besoin) ; socle de refus non négociable.
- **Questions.** Les 5 questions réellement posées (et leur source de
  réponse) ; les questions interdites du métier ; la fonction de renvoi pour
  chaque refus ; la question piège préférée pour la démo.
- **Outputs.** `gouvernance/limites-refus.md` ;
  `cases/<slug>/tests/comportement.yaml` : ≥ 5 cas sourcés, ≥ 3 cas de refus
  (dont ≥ 1 nominatif fictif type « Madame Martin »), 1 cas hors-corpus
  (« je ne sais pas » attendu).
- **Erreurs / refus.** Tentative d'affaiblir le socle (« autorise les cas
  individuels ») → refus explicite, le socle n'est pas négociable. Moins de
  3 refus fournis → la skill propose des refus types du métier plutôt que de
  passer outre.
- **Succès.** `validate-guardrails` passe : couverture complète
  déclaré ↔ testé ↔ affiché.

### 2.4 `adapter-corpus-onboarding`

- **Objectif.** Faire passer un document relu (Word/PDF converti, note interne)
  à l'état de source conforme du corpus.
- **Déclenchement.** Étape 11 ; ou « importe cette note de service ».
- **Inputs.** Fichier `.md`/`.txt` **déjà converti et relu** ; la déclaration
  de l'étape 4 correspondante.
- **Questions.** Correspond-il à une source déclarée (laquelle) ? La relecture
  intégrale a-t-elle été faite (o/N — N arrête) ? Reste-t-il un nom, un
  courriel, un numéro ? Quelles questions de FAQ ce document doit-il permettre
  de couvrir ?
- **Outputs.** `content/cases/<slug>/sources/SRC-NNN-<slug-titre>.md` via
  `import-source`, frontmatter complet ; le cas échéant une fiche associée ;
  exécution de `validate-corpus` en sortie.
- **Erreurs / refus.** PDF/DOCX brut fourni → refus (« convertissez et relisez
  d'abord », renvoi au guide) ; motif personnel détecté par `validate-corpus`
  → la skill montre la ligne fautive et refuse d'intégrer.
- **Succès.** `validate-corpus` vert sur la nouvelle source ; la source
  apparaît sur `/sources`.

### 2.5 `configurer-fournisseur-ia`

- **Objectif.** Choisir un mode IA en connaissance de cause et produire une
  configuration valide **sans manipuler de secret**.
- **Déclenchement.** Étape 9 ; ou « branche Ollama / une API ».
- **Inputs.** Catalogue des 7 modes (`src/lib/model/catalogue.ts`), contraintes
  de l'organisation (données internes ? DPO instruit ?).
- **Questions.** Vos sources sont-elles `interne` ? (oui + API tierce →
  avertissement sous-traitance, renvoi DPO) ; avez-vous un serveur Ollama ? ;
  souhaitez-vous le mode démo (`local`) ?
- **Outputs.** `fournisseur.mode` dans le manifeste ; **affichage** du bloc
  `.env.local` à recopier (clé représentée par `[REDACTED]`) ; exécution de
  `validate-provider-config` pour vérifier l'état.
- **Erreurs / refus.** Clé collée dans la conversation → non stockée, non
  répétée, consigne de rotation si elle est réelle. Mode inconnu → liste des
  modes valides.
- **Succès.** `validate-provider-config` renvoie `pret` ou `hors-ligne`
  (selon le mode choisi), et `/configuration-ia` affiche le même état.

### 2.6 `generer-tests-harnais`

- **Objectif.** Étendre et durcir la suite de tests du cas au-delà du minimum
  de l'étape 7–8 (reformulations, pièges, obsolescence).
- **Déclenchement.** Étape 13 ; ou « durcis les tests ».
- **Inputs.** `comportement.yaml` existant, corpus, manifeste.
- **Questions.** Pour chaque cas sourcé : deux reformulations plausibles ?
  Pour chaque refus : une variante indirecte (« ma collègue voudrait
  savoir… ») ? Seuil d'obsolescence des sources (défaut 24 mois) ?
- **Outputs.** Cas ajoutés dans `comportement.yaml` (mêmes types que
  l'existant : `comportement` / `contenu` / `registre`) ; jamais de nouveau
  format de test sans modification du runner, qu'elle signale.
- **Erreurs / refus.** Cas de test contenant un nom réaliste non marqué fictif
  → reformulé ; test qui affaiblirait un refus existant → refusé.
- **Succès.** `npm test` vert 3 exécutions consécutives (variabilité
  documentée PRD v0.2 §10.4) ; nombre de cas en hausse, consigné au journal.

### 2.7 `verifier-securite-rgpd`

- **Objectif.** Passe finale avant partage : données, secrets, mentions,
  rapport de gouvernance.
- **Déclenchement.** Étape 15 ; avant toute démo, publication ou changement de
  statut.
- **Inputs.** Tout le cas ; résultats des validateurs.
- **Questions.** Le statut affiché (`prototype`/`interne`/`production`)
  correspond-il à la réalité ? La fiche de validation est-elle signée (pour
  `interne`+) ? La durée de conservation des journaux est-elle déclarée ?
- **Outputs.** Exécution de la chaîne `validate-harness` complète ;
  `build-harness-report` ; liste d'écarts à corriger le cas échéant.
- **Erreurs / refus.** Demande de passage de statut sans fiche de validation →
  refus (« le passage de statut est une décision humaine tracée »). Écart
  bloquant des validateurs → pas de rapport « conforme », le rapport liste
  l'écart.
- **Succès.** `rapport-gouvernance.md` généré, à jour, sans écart bloquant, et
  la mention « ne vaut pas validation juridique » y figure.

### 2.8 `preparer-demo-video`

- **Objectif.** Préparer une démonstration reproductible du harnais (vidéo ou
  démo live), conforme à `specs/spec-parcours-video.md`.
- **Déclenchement.** À la demande, une fois les étapes 1–15 franchies.
- **Inputs.** Le scénario vidéo ; l'état réel du dépôt.
- **Questions.** Quel cas montrer ? Quelle question sourcée et quelle question
  refusée ? Terminal et navigateur prêts (taille de police, port 3010
  libre) ?
- **Outputs.** `cases/<slug>/demo/plan-demo.md` : checklist pré-tournage,
  liste ordonnée des commandes exactes à taper, questions à poser, résultats
  attendus plan par plan ; vérification préalable que chaque commande passe.
- **Erreurs / refus.** Un plan du scénario ne correspond pas à un élément réel
  → écart consigné, la skill refuse de « faire semblant » (pas de démo
  truquée).
- **Succès.** Chaque commande du plan exécutée une fois avec le résultat
  attendu, immédiatement avant tournage.

## 3. Ce qui manque aujourd'hui et comment ce spec le corrige

Aujourd'hui : aucune skill n'existe ; le savoir-faire est réparti entre
`docs/cycle-de-vie.fr.md`, `docs/adapter-ses-sources.fr.md` et le PRD.
Correction : le Lot 2 du backlog crée `skills/` en **extrayant** ces procédures
(pas en les réécrivant de zéro), chaque skill renvoyant vers le guide long
correspondant. Les docs restent la référence pédagogique ; les skills sont la
version opérationnelle, activable étape par étape.
