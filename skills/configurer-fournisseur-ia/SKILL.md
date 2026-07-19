---
name: configurer-fournisseur-ia
description: Choisir un mode IA en connaissance de cause et produire une configuration valide sans jamais manipuler de secret ni saisir de clé.
etapes_parcours: [9]
scripts_associes:
  - "scripts/validate-provider-config.mjs"
fichiers_produits:
  - "cases/<slug>/harnais.yaml"
---

# configurer-fournisseur-ia

> Version opérationnelle de l'étape 9 du parcours. La page in-app
> `/configuration-ia` et le catalogue `src/lib/model/catalogue.ts` (7 modes)
> restent la référence : la skill guide le choix et écrit `fournisseur.mode`,
> sans jamais toucher à une clé.

## Quand l'activer

- À l'**étape 9** du parcours : choisir le fournisseur IA.
- À la demande : « branche Ollama », « je veux une API tierce ».

## Ce que je demande

Une question à la fois. Le catalogue des 7 modes (`local`, `none`, `ollama`,
`anthropic`, `openai`, `openrouter`, `mistral`) est présenté avec sa note de
souveraineté. Exemples tirés de `onboarding-agents`.

1. **Sources internes ?** « Vos sources sont-elles classées `interne` ? »
   *Exemple :* oui (note de télétravail = interne). → si vous visez une API
   tierce, avertissement sous-traitance et renvoi DPO.
2. **Serveur Ollama disponible ?** « Avez-vous un serveur Ollama accessible
   (modèle exécuté chez vous) ? »
   *Exemple :* non pour la démo.
3. **Mode démo ?** « Souhaitez-vous le mode `local` (rien ne quitte le poste,
   déterministe, sans clé) pour démarrer et filmer ? »
   *Exemple (onboarding-agents) :* oui — `fournisseur.mode: local`.

## Ce que je produis

- `fournisseur.mode` dans `cases/<slug>/harnais.yaml` (l'un des 7 modes).
- **L'affichage** (jamais l'écriture) du bloc `.env.local` à recopier à la
  main, la clé représentée par `[REDACTED]` :

  ```bash
  # .env.local — à créer côté serveur, jamais commité
  MODEL_PROVIDER=anthropic
  MODEL_API_KEY=[REDACTED]
  ```

- L'exécution de `scripts/validate-provider-config.mjs` pour vérifier l'état
  (statut, jamais une valeur de clé).

Pour le cas `onboarding-agents`, aucun `.env.local` n'est requis : le mode
`local` fonctionne hors ligne et sans clé.

## Ce que je refuse

- **Clé collée dans la conversation.** « Je ne stocke pas de clé. Mettez-la
  dans `.env.local` (côté serveur), jamais dans la conversation ni dans un
  fichier suivi par git. » La valeur n'est **ni stockée ni répétée** ; si elle
  paraît réelle, je conseille sa **rotation**.
- **Aucun champ de saisie de clé** dans l'interface : la configuration IA reste
  côté serveur (`.env.local`). Je n'en crée jamais.
- **Mode inconnu.** Je liste les 7 modes valides et redemande.

## Réussite

- `scripts/validate-provider-config.mjs` renvoie `pret` ou `hors-ligne` selon
  le mode choisi, **sans jamais imprimer** une valeur de clé.
- `/configuration-ia` affiche le même état que le validateur.
- `fournisseur.mode` du manifeste correspond au mode retenu.
