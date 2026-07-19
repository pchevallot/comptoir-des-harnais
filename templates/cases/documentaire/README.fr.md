# Gabarit — cas documentaire

Ce dossier est le **gabarit d'un cas documentaire** (template). Il reproduit,
champ pour champ, la structure d'un cas produit par la fabrique
(`content/cases/{{slug}}/` pour le corpus, `cases/{{slug}}/` pour les décisions
et la gouvernance), mais sans aucune donnée réelle : tout est à remplir. Il
permet de créer **son** cas documentaire **sans toucher au code**.

Les libellés spécifiques sont exprimés en variables `{{...}}` (par ex.
`{{slug}}`, `{{organisation.nom}}`, `{{besoin}}`) : la génération
(`npm run scaffold`, cf. Lot 3) les substitue avec ce que l'atelier ou
l'interview a collecté.

## Principe

Un cas documentaire informe (règles générales, sourcées et datées). Il ne gère
pas de dossier individuel, ne rend pas d'avis juridique ou médical, et ne
contient **aucune donnée personnelle réelle**. Ce n'est pas un SIRH.

## Comment l'utiliser

La voie normale est **l'atelier** (`/fabrique`) ou l'interview
(`npm run interview`), qui appelle la génération depuis ce gabarit. En manuel :

1. **Copier** ce dossier vers l'espace de contenu du cas, par exemple
   `content/cases/{{slug}}/` (ne modifiez pas `templates/`, qui reste la
   référence vierge).
2. **Renseigner** les fichiers en remplaçant chaque variable `{{...}}` et
   chaque valeur entre chevrons `<…>` par votre contenu réel, en suivant les
   commentaires `#`.
   - `sources/` : une fiche par document de référence (note de service,
     règlement, guide interne). Repartez de `EXEMPLE-source.md`.
   - `fiches/` : une fiche pratique par sujet, rattachée à une ou plusieurs
     sources. Repartez de `EXEMPLE-fiche.md`.
   - `parcours/parcours.yml` : l'organisation en modules et étapes.
   - `quiz/quiz.yml` : des questions de vérification de lecture.
   - `checklist.md` : l'aide-mémoire de préparation du cas.
   - `gouvernance/` : les quatre documents de cadrage
     (`limites-refus.md`, `classification.md`, `fiche-validation.md`,
     `journal.md`) — placés dans `cases/{{slug}}/gouvernance/`.
3. **Renommer** les fichiers d'exemple (`EXEMPLE-source.md`,
   `EXEMPLE-fiche.md`) avec des noms parlants (ex. `SRC-001-conges.md`,
   `conges.md`). Supprimez les fichiers d'exemple une fois copiés.
4. **Valider** la cohérence :
   ```
   npm run validate-harness -- --cas {{slug}}
   ```
   Le rapport, en français, signale les champs manquants, les sources non
   fictives, les fiches sans source, etc. Corrigez jusqu'à obtenir « OK ».
5. **Prévisualiser** localement :
   ```
   CDH_CONFIG={{slug}}.yml npm run dev
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
- Ce cas **ne vaut pas validation juridique**.
