---
name: adapter-corpus-onboarding
description: Faire passer un document déjà converti et relu à l'état de source conforme du corpus, avec frontmatter complet et contrôle machine, sans jamais intégrer de donnée personnelle.
etapes_parcours: [11]
scripts_associes:
  - "scripts/import-source.mjs"
  - "scripts/validate-corpus.mjs"
fichiers_produits:
  - "content/cases/<slug>/sources/SRC-NNN-<slug-titre>.md"
---

# adapter-corpus-onboarding

> Version opérationnelle de l'étape 11 et du guide `docs/adapter-ses-sources.fr.md`
> (conversion, relecture, métadonnées, checklist d'import). La skill amorce la
> source avec `import-source` puis fait confiance à `validate-corpus` pour le
> contrôle : elle ne valide rien elle-même.

## Quand l'activer

- À l'**étape 11** du parcours : importer et contrôler le corpus.
- À la demande : « importe cette note de service », « ajoute une source relue ».

## Ce que je demande

Une question à la fois. Exemples tirés de `onboarding-agents`.

1. **Correspondance à une source déclarée.** « Ce document correspond-il à une
   source déclarée à l'étape 4 ? Laquelle ? »
   *Exemple :* oui — « Note de service — télétravail » (→ SRC-003).
2. **Relecture intégrale faite ?** « La relecture intégrale du document converti
   a-t-elle été faite ? (o/N — *N* arrête) »
   *Exemple :* oui, chiffres et dates revérifiés sur l'original.
3. **Reste-t-il un identifiant personnel ?** « Reste-t-il un nom, un courriel,
   un numéro de téléphone, un numéro personnel ? »
   *Exemple :* non — courriels uniquement en `@exemple.fr`, aucun nom d'agent.
4. **Questions de FAQ couvertes.** « Quelles questions de FAQ ce document
   doit-il permettre de couvrir ? »
   *Exemple :* « Combien de jours de télétravail ? », « Qui autorise le
   télétravail ? ».

## Ce que je produis

- `content/cases/<slug>/sources/SRC-NNN-<slug-titre>.md` via
  `scripts/import-source.mjs`, **frontmatter complet** (`id`, `titre`,
  `proprietaire` fonction, `date`, `statut`, `perimetre`, `classification`,
  `fictif`).
- Le cas échéant, une fiche associée qui cite la source par son `id`.
- L'exécution de `scripts/validate-corpus.mjs` en sortie, dont j'affiche le
  rapport fichier par fichier.

Exemple de frontmatter (cas `onboarding-agents`, SRC-003) :

```markdown
---
id: "SRC-003"
titre: "Note de service — télétravail"
proprietaire: "Direction des ressources humaines"
date: "2025-09-15"
statut: "active"
perimetre: "Agents de la collectivité éligibles au télétravail"
classification: "interne"
fictif: true
---
```

## Ce que je refuse

- **PDF/DOCX brut fourni.** « Convertissez et relisez d'abord (voir
  `docs/adapter-ses-sources.fr.md`). Je n'intègre que du Markdown/texte déjà
  relu. » Aucune conversion, aucun OCR côté skill.
- **Relecture non faite** (réponse *N* à la question 2) : j'arrête l'import.
- **Motif personnel détecté par `validate-corpus`** (courriel plausible,
  téléphone, NIR, nom propre suspect) : je **montre la ligne fautive** et je
  refuse d'intégrer. « Anonymisez ou généralisez, puis revenez ; en cas de
  doute, DPO. »
- **Clé API collée dans la conversation.** « Je ne stocke pas de clé.
  Mettez-la dans `.env.local` (côté serveur), jamais dans la conversation ni
  dans un fichier suivi par git. »

## Réussite

- `scripts/validate-corpus.mjs` est **vert** sur la nouvelle source (frontmatter
  complet, id unique, classification autorisée, longueur suffisante, aucun motif
  interdit, correspondance avec `sources_declarees`).
- La source apparaît sur `/sources` (registre daté).
