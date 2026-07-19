---
name: classifier-sources
description: Déclarer les sources et classer leurs données source par source, en publique ou interne, avec propriétaire (fonction) et date, sans jamais importer de donnée personnelle.
etapes_parcours: [4, 5]
scripts_associes:
  - "scripts/interview-harness.mjs"
  - "scripts/validate-corpus.mjs"
fichiers_produits:
  - "cases/<slug>/harnais.yaml"
  - "cases/<slug>/gouvernance/classification.md"
---

# classifier-sources

> Version opérationnelle des étapes 3-4 de `docs/cycle-de-vie.fr.md` (lister et
> classer les sources) et du guide `docs/adapter-ses-sources.fr.md` (§5-§6,
> métadonnées et limites). La skill déclare et classe ; l'import réel et le
> contrôle machine sont faits à l'étape 11 par `adapter-corpus-onboarding` et
> `scripts/validate-corpus.mjs`.

## Quand l'activer

- Aux **étapes 4 et 5** du parcours : déclarer les sources existantes, puis
  classer les données de chacune.
- À la demande : « j'ajoute une source à un cas existant »,
  « aide-moi à classer ce document ».

## Ce que je demande

Une question à la fois, **par source**, jusqu'à « terminé ». Exemples tirés du
cas `onboarding-agents`.

1. **Titre du document existant.**
   *Exemple :* « Note de service — télétravail ».
2. **Fonction propriétaire** (jamais une personne).
   *Exemple :* Direction des ressources humaines.
3. **Date de dernière mise à jour connue** (`AAAA-MM-JJ`).
   *Exemple :* 2025-09-15.
4. **Contenu sensible ?** « Ce document contient-il des noms, des situations
   individuelles, des éléments de santé, du RH nominatif ? »
   *Exemple :* non — la note énonce une règle collective de télétravail.
5. **Classification retenue** : `publique` ou `interne` **uniquement**.
   *Exemple :* interne.
6. **Qui valide la classification ?** (réponse guidée : le DPO)
   *Exemple :* DPO du syndicat mixte.
7. **En cas de contradiction entre deux sources ?** (réponse guidée : la plus
   récente du propriétaire le plus légitime, tracée au registre)

## Ce que je produis

- `sources_declarees` dans `cases/<slug>/harnais.yaml` : une entrée par source
  (`titre`, `proprietaire`, `date_connue`) — la **liste de contrôle** que
  `scripts/validate-corpus.mjs` confrontera aux fichiers réellement importés à
  l'étape 11.
- `cases/<slug>/gouvernance/classification.md` : le tableau des sources et de
  leur classification, avec la fonction qui valide.

Exemple d'entrée `sources_declarees` (cas `onboarding-agents`) :

```yaml
sources_declarees:
  - titre: "Note de service — télétravail"
    proprietaire: "Direction des ressources humaines"
    date_connue: "2025-09-15"
```

## Ce que je refuse

- **Donnée personnelle ou sensible détectée.** La source est marquée
  `ineligible` avec motif, **jamais importée** : « Cette source contient une
  donnée personnelle/sensible. Anonymisez ou généralisez, puis revenez ; en cas
  de doute, DPO. » Le parcours continue sans elle.
- **Classification autre que `publique`/`interne`.** Refus : « Le cadre V1/V2 ne
  traite que `publique` ou `interne`. Une donnée `personnelle` ou `sensible`
  sort du périmètre — renvoi DPO. »
- **Propriétaire nommé.** « Indiquez une fonction (ex. Direction des ressources
  humaines), jamais un nom de personne. »
- **Clé API collée dans la conversation.** « Je ne stocke pas de clé.
  Mettez-la dans `.env.local` (côté serveur), jamais dans la conversation ni
  dans un fichier suivi par git. » Valeur ni répétée ni conservée.

## Réussite

- Chaque source déclarée a un **propriétaire (fonction)**, une **date** et une
  **classification** (`publique`/`interne`).
- `scripts/validate-corpus.mjs` retrouvera cette liste à l'étape 11 (cohérence
  déclaré ↔ importé).
- `cases/<slug>/gouvernance/classification.md` est lisible par le DPO et
  cohérent avec les frontmatters des sources.
