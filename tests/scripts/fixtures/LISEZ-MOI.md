# Fixtures négatives des tests de scripts (Lot 7)

Ce dossier contient des **racines de projet miniatures** servant de cas
**volontairement fautifs** pour prouver que les scripts déterministes échouent
proprement (code de sortie ≠ 0, message nommé).

Chaque fixture est pointée par la variable d'environnement `CDH_PROJECT_ROOT`
lors de l'exécution du script sous test (voir `tests/scripts/*.test.ts`).

## Isolement anti-motifs

Ce dossier est **exclu du balayage anti-motifs du dépôt** (voir
`tests/structure/structure.test.ts`, jeu de dossiers ignorés) : la fixture
`corpus-motif-interdit/` contient **à dessein** un motif interdit (un courriel
plausible synthétique) pour vérifier que `validate-corpus` le détecte.

Règles :

- **aucune donnée personnelle réelle** : les motifs sont synthétiques
  (`agent.exemple@collectivite-test.fr` n'est l'adresse de personne) ;
- **aucun secret réel** : jamais de clé véritable — `[REDACTED]` sinon ;
- **jamais** de libellé exclu du projet : uniquement des motifs neutres.
