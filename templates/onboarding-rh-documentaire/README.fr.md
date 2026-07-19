# Modèle vide — Portail d'onboarding RH documentaire

Ce dossier est un **modèle vide** (template). Il reproduit, champ pour champ, la
structure du contenu de démonstration situé dans
`content/demo-onboarding-rh/`, mais sans aucune donnée réelle : tout est à
remplir. Il permet à une collectivité de créer **son** portail documentaire
**sans toucher au code**.

## Principe

Un portail documentaire informe (règles générales, sourcées et datées). Il ne
gère pas de dossier individuel, ne rend pas d'avis juridique ou médical, et ne
contient **aucune donnée personnelle réelle**. Ce n'est pas un SIRH.

## Comment l'utiliser

1. **Copier** ce dossier vers l'espace de contenu, par exemple :
   `content/mon-onboarding-rh/` (ne modifiez pas `templates/`, qui reste la
   référence vierge).
2. **Renseigner** les fichiers en remplaçant chaque valeur entre chevrons
   `<…>` par votre contenu réel, et en suivant les commentaires `#`.
   - `sources/` : une fiche par document de référence (note de service,
     règlement, guide interne). Repartez de `EXEMPLE-source.md`.
   - `fiches/` : une fiche pratique par sujet, rattachée à une ou plusieurs
     sources. Repartez de `EXEMPLE-fiche.md`.
   - `parcours/parcours.yml` : l'organisation en modules et étapes.
   - `quiz/quiz.yml` : des questions de vérification de lecture.
   - `checklist.md` : l'aide-mémoire de préparation du portail.
   - `gouvernance/` : les quatre documents de cadrage
     (`limites-refus.md`, `classification.md`, `fiche-validation.md`,
     `journal.md`).
3. **Renommer** les fichiers d'exemple (`EXEMPLE-source.md`,
   `EXEMPLE-fiche.md`) avec des noms parlants (ex. `SRC-001-conges.md`,
   `conges.md`). Supprimez les fichiers d'exemple une fois copiés.
4. **Valider** la cohérence :
   ```
   npm run validate-harness
   ```
   Le rapport, en français, signale les champs manquants, les sources non
   fictives, les fiches sans source, etc. Corrigez jusqu'à obtenir « OK ».
5. **Prévisualiser** localement :
   ```
   npm run dev
   ```

## Règles à respecter (rappel)

- **Aucune donnée personnelle réelle.** Les sources doivent porter
  `fictif: true` tant qu'elles ne sont pas des documents réels validés par leur
  propriétaire.
- **Que des fonctions, jamais des personnes** (ex. « Direction des ressources
  humaines », pas un nom).
- **Classification limitée** aux niveaux `publique` et `interne`.
- **Champ `limites` obligatoire** sur chaque fiche : il rappelle que le contenu
  décrit une règle générale et ne statue sur aucun cas individuel.
- Ce portail **ne vaut pas validation juridique**.
