---
name: preparer-demo-video
description: Préparer une démonstration reproductible du harnais (vidéo ou démo live), commandes vérifiées une à une, sans jamais mettre en scène un résultat qui n'existe pas.
etapes_parcours: []
scripts_associes:
  - "scripts/validate-harness.mjs"
  - "scripts/build-harness-report.mjs"
fichiers_produits:
  - "cases/<slug>/demo/plan-demo.md"
---

# preparer-demo-video

> Skill **hors parcours** (activée une fois les étapes 1-15 franchies), alignée
> sur `specs/spec-parcours-video.md`. Elle ne raconte pas la méthode (c'est le
> rôle du README et de `docs/cycle-de-vie.fr.md`) : elle prépare une démo dont
> **chaque commande a été exécutée** avant tournage.

## Quand l'activer

- **À la demande**, une fois les étapes 1 à 15 du parcours franchies, pour
  préparer une vidéo ou une démonstration en direct.

## Ce que je demande

Une question à la fois. Exemples tirés de `onboarding-agents`.

1. **Quel cas montrer ?**
   *Exemple :* `onboarding-agents`.
2. **Quelle question sourcée et quelle question refusée ?**
   *Exemple :* sourcée = « Combien de jours de télétravail sont possibles ? »
   (→ SRC-003) ; refusée = « Est-ce que Madame Martin a droit au télétravail ? »
   (→ refus, renvoi service RH).
3. **Terminal et navigateur prêts ?** « Taille de police lisible, port 3010
   libre, `npm run dev` lancé ? »
   *Exemple :* police agrandie, port 3010 libre, serveur actif.

## Ce que je produis

- `cases/<slug>/demo/plan-demo.md` : **checklist pré-tournage**, **liste
  ordonnée des commandes exactes** à taper, **questions à poser**, **résultats
  attendus plan par plan** — conforme à `specs/spec-parcours-video.md`.
- La **vérification préalable** que chaque commande du plan passe réellement
  (dont la chaîne `scripts/validate-harness.mjs` et
  `scripts/build-harness-report.mjs`).

Exemple d'entrée de plan (cas `onboarding-agents`) :

```markdown
## Plan 6 — Les tests
Commande : `npm test`
Attendu : suite verte (comportement + structure).
Puis : `npm run validate-guardrails -- --cas onboarding-agents` → 0 erreur.
```

## Ce que je refuse

- **Plan qui ne correspond à aucun élément réel du dépôt.** L'écart est
  **consigné**, pas masqué : « Ce plan décrit un élément absent du dépôt. Je ne
  mets pas en scène un résultat qui n'existe pas ; corrigez le dépôt ou le
  plan. » Pas de démo truquée.
- **Commande non vérifiée** avant tournage : je ne l'inscris pas au plan tant
  qu'elle n'a pas été exécutée avec le résultat attendu.
- **Clé API collée dans la conversation.** « Je ne stocke pas de clé.
  Mettez-la dans `.env.local` (côté serveur), jamais dans la conversation ni
  dans un fichier suivi par git. »

## Réussite

- Chaque commande du plan a été **exécutée une fois avec le résultat attendu**,
  immédiatement avant tournage.
- `cases/<slug>/demo/plan-demo.md` est complet, ordonné, sans écart non
  consigné.
