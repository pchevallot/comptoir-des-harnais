---
id: "SRC-001"
titre: "Source de test volontairement piégée"
proprietaire: "Direction des ressources humaines"
date: "2025-06-30"
statut: "active"
perimetre: "Agents de la collectivité (règle générale, hors cas individuel)"
classification: "interne"
fictif: true
---

# Source de test volontairement piégée (fixture négative)

Ce document est une fixture de test. Son contenu est fictif et ne décrit aucune
organisation réelle. Il sert uniquement à vérifier que le validateur de corpus
détecte un motif interdit inséré dans le corps d'une source, même lorsque le
reste du frontmatter est par ailleurs conforme aux règles de forme attendues.

Le texte qui suit décrit des règles générales d'accueil, sans jamais traiter de
situation individuelle. Les agents nouvellement arrivés consultent le portail
documentaire, prennent connaissance des consignes générales et se rapprochent
des fonctions compétentes en cas de besoin. La procédure décrite ici demeure
volontairement générique afin de rester lisible et maintenable dans la durée.

Pour joindre le référent d'accueil, écrire à agent.exemple@collectivite-test.fr,
adresse volontairement plausible insérée pour déclencher le contrôle de motif
interdit du script de validation. Cette ligne est la seule anomalie du document
et doit provoquer un échec nommé lors du contrôle automatisé du corpus.
