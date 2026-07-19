---
name: verifier-securite-rgpd
description: Passe finale avant partage — données, secrets, mentions, cohérence du statut — et production du rapport de gouvernance, sans passage de statut automatique.
etapes_parcours: [15]
scripts_associes:
  - "scripts/validate-harness.mjs"
  - "scripts/build-harness-report.mjs"
fichiers_produits:
  - "cases/<slug>/rapport-gouvernance.md"
---

# verifier-securite-rgpd

> Version opérationnelle de l'étape 15 et des documents de gouvernance
> (`docs/gouvernance-rgpd-ai-act.fr.md`, `docs/cycle-de-vie.fr.md` §statuts). La
> skill orchestre les validateurs et produit le rapport ; elle ne décide jamais
> d'un passage de statut (décision humaine tracée).

## Quand l'activer

- À l'**étape 15** du parcours : produire le rapport de gouvernance.
- **Avant toute démo, publication ou changement de statut.**

## Ce que je demande

Une question à la fois. Exemples tirés de `onboarding-agents`.

1. **Cohérence du statut affiché.** « Le statut (`prototype` / `interne` /
   `production`) correspond-il à la réalité du cas ? »
   *Exemple :* prototype — sources fictives, aucune donnée réelle.
2. **Fiche de validation signée ?** (requise pour `interne` et au-delà)
   « Existe-t-il une fiche de validation signée pour ce statut ? »
   *Exemple :* pour rester `prototype`, non requise.
3. **Durée de conservation des journaux déclarée ?** « La durée de conservation
   des journaux locaux est-elle déclarée dans la gouvernance ? »
   *Exemple :* oui, énoncée dans `gouvernance/`.

## Ce que je produis

- L'exécution de la chaîne complète `scripts/validate-harness.mjs` (corpus →
  garde-fous → configuration IA → cohérence du manifeste).
- `cases/<slug>/rapport-gouvernance.md` via `scripts/build-harness-report.mjs` :
  manifeste, registre des sources, classification, refus, mode IA, résultats de
  validation.
- La **liste des écarts** à corriger, le cas échéant (je ne masque aucun écart
  bloquant).

Le rapport porte toujours la mention **« ne vaut pas validation juridique »**.

## Ce que je refuse

- **Passage de statut sans fiche de validation.** Refus : « Le passage de statut
  (`prototype` → `interne` → `production`) est une décision humaine tracée. Sans
  fiche de validation signée, le statut reste `prototype`. »
- **Rapport “conforme” malgré un écart bloquant.** Je ne produis pas de rapport
  qui dit « conforme » : le rapport **liste l'écart** et le statut reste en
  l'état.
- **Clé API collée dans la conversation.** « Je ne stocke pas de clé.
  Mettez-la dans `.env.local` (côté serveur), jamais dans la conversation ni
  dans un fichier suivi par git. » Les validateurs n'impriment jamais de valeur
  de clé.

## Réussite

- `cases/<slug>/rapport-gouvernance.md` est généré, **à jour, sans écart
  bloquant**, et la mention « ne vaut pas validation juridique » y figure.
- Le statut affiché correspond à la réalité et est tracé.
- Aucun secret, aucune donnée personnelle réelle dans le cas.
