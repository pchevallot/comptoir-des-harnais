# Contribuer à Comptoir des Harnais

Merci de votre intérêt pour ce projet. Ce dépôt est un bien commun destiné aux
acteurs publics : les contributions sont bienvenues, à condition de respecter le
périmètre et les règles ci-dessous.

> **À qui s'adresse ce document ?** À toute personne qui souhaite proposer une
> amélioration : correction de contenu, nouvelle source ou fiche pour un exemple,
> amélioration du code, des tests ou de la documentation. Aucune expertise n'est
> exigée pour contribuer aux contenus ; les modifications de code supposent d'être
> à l'aise avec Git et l'écosystème web.

---

## Principe de base : contenus séparés du code

Le dépôt maintient une frontière nette :

- **`content/` et `configs/`** — territoire des **non-techniciens**. On y ajoute
  ou corrige des sources, fiches, parcours, quiz, éléments de gouvernance. Ce
  sont des fichiers Markdown et YAML, lisibles dans un simple éditeur de texte.
- **`src/`** — territoire des **développeurs** (le code de l'application).
- **`tests/`** — les garde-fous et les vérifications de structure.

Adapter ou enrichir les contenus **ne doit jamais imposer de modifier `src/`**.

---

## Périmètre : ce qui est accepté

- Corrections de contenus de démonstration (fautes, formulations plus claires,
  dates, sources mieux structurées) — **en restant 100 % fictif**.
- Améliorations de la documentation en français, en langage clair.
- Corrections de bugs, amélioration de l'accessibilité, de la lisibilité.
- Nouveaux tests de garde-fous ou de structure.
- Améliorations qui renforcent le sourçage, les refus, la gouvernance visible.

## Périmètre : ce qui est refusé

Ces refus découlent directement de la nature du projet :

- toute évolution qui transformerait l'application en **outil de gestion RH**
  (SIRH), en **gestion de dossiers d'agents** ou en **outil de décision** ;
- toute fonction qui traiterait un **cas individuel** ou une **personne
  identifiable** (le refus de ces cas est un comportement testé, à préserver) ;
- toute **donnée personnelle réelle**, où que ce soit ;
- toute **promesse de conformité** (RGPD, AI Act) ou formulation qui laisserait
  croire que l'outil « rend conforme » ;
- toute mention d'un **projet concurrent ou tiers** comme point de comparaison ;
- l'ajout d'une **dépendance lourde** (base de données obligatoire,
  microservices, service tiers requis pour la démo) ;
- le **verrouillage** sur un fournisseur de modèle codé en dur.

---

## Règle absolue : aucune donnée réelle

**N'introduisez jamais de donnée personnelle réelle**, nulle part : ni dans les
contenus, ni dans les tests, ni dans les exemples de configuration.

- Les noms de personnes doivent être **manifestement fictifs**.
- Les collectivités, adresses, courriels, numéros doivent être fictifs.
- Chaque page de contenu de démonstration porte le marquage
  **« données fictives — démonstration »**.
- Un test de structure vérifie l'absence de motifs de données réalistes ; une
  contribution qui le fait échouer sera refusée.

En cas de doute, considérez la donnée comme réelle et ne l'ajoutez pas.

---

## Ajouter une source ou une fiche sans toucher au code

Vous pouvez enrichir l'exemple d'onboarding RH uniquement avec des fichiers.

**Ajouter une source :**

1. Créez un fichier dans `content/demo-onboarding-rh/sources/`, en suivant la
   nomenclature existante : `SRC-00X-sujet.md`.
2. Reprenez la structure des sources existantes (identifiant, titre,
   propriétaire par **fonction**, date de version, statut, périmètre).
3. Gardez le contenu **fictif** et marqué comme tel.

**Ajouter une fiche :**

1. Créez un fichier dans `content/demo-onboarding-rh/fiches/`.
2. Reprenez la structure d'une fiche existante ; chaque fiche cite ses
   **sources** (identifiants `SRC-…`), sa **date** et son **statut**.
3. Si la fiche doit apparaître dans le parcours ou le quiz, mettez à jour les
   fichiers YAML correspondants (`parcours/parcours.yml`, `quiz/quiz.yml`).

**Vérifier votre travail :**

```bash
npm run validate-harness   # cohérence du harnais (registre, classification, gouvernance)
npm run generate-demo      # (re)génère ou vérifie le contenu de démonstration
```

---

## Exécuter les tests avant de proposer une contribution

Toute contribution doit passer les tests après un clone propre :

```bash
npm install
npm test
```

`npm test` exécute les tests de **garde-fous** (réponses sourcées, refus des cas
individuels, mentions obligatoires) et de **structure** (contenus complets,
absence de secrets et de données réalistes). Une contribution qui casse un test
ne peut pas être intégrée telle quelle.

---

## Proposer votre contribution

1. Créez une branche dédiée.
2. Faites des modifications ciblées et lisibles.
3. Vérifiez `npm test` et, si vous avez touché aux contenus,
   `npm run validate-harness`.
4. Ouvrez une proposition (pull request) décrivant **ce que** vous changez et
   **pourquoi**, en français, en langage clair.

Les décisions d'intégration relèvent d'un arbitrage humain (voir
`LICENSES.fr.md` pour la gouvernance des licences).

---

## Ce que ce document ne couvre pas

- Le détail de l'architecture technique et du fonctionnement interne du moteur
  documentaire.
- La procédure d'intégration continue ou de publication du dépôt.
- Les règles internes de votre propre organisation si vous adaptez le harnais
  pour un usage réel (voir alors la gouvernance et le cycle de vie du harnais).
