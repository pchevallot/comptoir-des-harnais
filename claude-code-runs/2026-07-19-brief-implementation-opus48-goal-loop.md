# Brief Claude Code — Implémentation V1 « Comptoir des Harnais » avec `/goal` et `/loop`

## Contexte d’exécution

Tu es Claude Code, lancé dans une **nouvelle session fraîche** pour développer la V1 de `Comptoir des Harnais`.

Modèle demandé : **Opus 4.8**.

- Utiliser `--model claude-opus-4-8` si disponible.
- Si l’identifiant exact n’est pas disponible, ne pas substituer silencieusement : s’arrêter et le signaler.
- Ne pas créer de dépôt GitHub distant.
- Ne pas publier.
- Ne pas utiliser de données personnelles réelles.
- Ne pas intégrer de secrets.
- Ne pas dériver vers un SIRH, quasi-SIRH, workflow RH décisionnel ou outil de décision individuelle.
- Ne mentionner aucun projet concurrent ou tiers comme comparaison.

Source d’autorité absolue :

```text
prd/PRD.md
```

Ce PRD est la référence. S’il y a contradiction entre ce brief et le PRD, appliquer le PRD et documenter la contradiction dans la recette.

## Utilisation obligatoire de `/goal` et `/loop`

Au démarrage, tu dois installer ton pilotage interne avec :

```text
/goal Développer la V1 de Comptoir des Harnais conformément au PRD v0.2 : webapp d'onboarding RH documentaire, configurable, sourcée, gouvernée, testée, sobrement brandée CdS, sans données personnelles réelles, sans dérive SIRH, avec documentation pédagogique et parcours de réplication.

/loop Après chaque unité d'œuvre, vérifier : conformité au PRD, absence de dérive SIRH, absence de données personnelles réelles, séparation contenu/code, qualité UX/UI, accessibilité de base, sécurité, tests, build, puis documenter l'état et passer à l'unité suivante si les critères sont remplis. Ne demander Pascal que pour les arbitrages réellement bloquants.
```

## Autonomie attendue

Pascal ne peut pas être sollicité toutes les deux minutes. Tu avances de manière autonome par lots et tâches, en vérifiant chaque étape.

Tu ne dois demander un arbitrage humain que pour :

1. indisponibilité du modèle Opus 4.8 ;
2. choix de licence final si vraiment bloquant ;
3. création/publication d’un dépôt GitHub distant ;
4. intégration d’un logo officiel non fourni ;
5. choix engageant d’un fournisseur de modèle pour la démo ;
6. décision qui changerait le périmètre fonctionnel ;
7. usage réel/confidentiel/personnel de données.

Tout le reste doit être traité par défaut raisonnable, documenté dans `docs/RECETTE.md` ou fichier équivalent.

## Best practices obligatoires

### Software engineering

- Architecture simple, maintenable, sans sur-ingénierie.
- Pas de base de données en V1.
- Contenus séparés du code : `content/`, `configs/`, `templates/`.
- TypeScript strict si stack TypeScript.
- Composants réutilisables.
- Scripts reproductibles : `npm run dev`, `npm run build`, `npm test`.
- Tests dès le début, pas à la fin.
- Absence de secrets dans le dépôt.
- `.env.example` documenté, sans valeur secrète.
- Commits ou étapes atomiques si git est initialisé.
- `docs/RECETTE.md` ou équivalent : tâches, commandes, résultats, risques, suites.

### Webdev

- App locale visible et utile rapidement.
- Responsive desktop/tablette/mobile.
- Navigation claire : accueil, parcours, fiches, FAQ, quiz, checklist RH, sources, limites, gouvernance.
- Mode dégradé sans clé de modèle : app utilisable, FAQ générative désactivée proprement.
- Aucun appel réseau non documenté hors fournisseur de modèle configuré.

### UX/UI et charte CdS

Tokens par défaut :

- Bleu CdS : `#1F519B` ;
- Or CdS : `#FDC948` ;
- Bleu nuit : `#112D4A` ;
- neutres : `#FFFFFF`, `#F5F5F5` ;
- texte : `#333333`.

Principes :

- sobriété institutionnelle ;
- lisible en vidéo 1080p ;
- pas d’esthétique gadget ;
- pas de tableaux bruts illisibles ;
- preuves visibles à l’écran : sources, dates, statut, limites, gouvernance ;
- navigation métier, non technique ;
- accessibilité de base : contraste, focus visible, titres structurés, navigation clavier, textes alternatifs.

Ne pas intégrer de logo officiel sans asset validé. Prévoir seulement un emplacement propre.

### Durcissement

À chaque lot :

- vérifier la conformité au PRD ;
- vérifier l’absence de dérive SIRH ;
- vérifier l’absence de données personnelles réalistes ;
- vérifier régulièrement le taux d’usage de la fenêtre contextuelle avec `/context` ou le mécanisme équivalent disponible ;
- à **50 % de remplissage**, rédiger ou mettre à jour immédiatement `docs/HANDOFF.md`, puis préparer un clear de session et la relance d’une nouvelle session fraîche ;
- exécuter `npm run build` si disponible ;
- exécuter `npm test` si disponible ;
- documenter les résultats ;
- corriger avant de passer au lot suivant.

## Handoff obligatoire à 50 % de contexte

Ne travaille pas jusqu’à saturation du contexte. Dès que `/context` indique environ **50 %** de remplissage, produis un handoff complet dans :

```text
docs/HANDOFF.md
```

Ce fichier doit permettre à une nouvelle session Claude Code de reprendre sans perte. Il doit contenir au minimum :

1. objectif global et rappel du `/goal` ;
2. état des lots A à H ;
3. fichiers créés/modifiés et leur rôle ;
4. décisions prises ;
5. commandes réellement exécutées et résultats ;
6. état des tests et du build ;
7. garde-fous vérifiés : anti-SIRH, absence de données personnelles réelles, absence de secrets, sourçage, refus des cas individuels ;
8. dette produit/technique/UX ;
9. risques ou arbitrages humains nécessaires ;
10. prochaines actions exactes, dans l’ordre, avec critères de vérification.

Après le handoff :

- exécuter les tests disponibles si possible ;
- indiquer explicitement que la prochaine session doit lire `prd/PRD.md`, `docs/HANDOFF.md`, puis `docs/RECETTE.md` si présent ;
- ne pas poursuivre en contexte dégradé au-delà de 50 %, sauf correction urgente pour laisser le dépôt dans un état cohérent.

## Ordre de travail

Ne pas tenter de tout implémenter en une seule passe improvisée. Suivre les lots de la section 12.2 du PRD.

Démarrer par :

```text
Lot A — Socle du dépôt
```

Puis, si les vérifications passent, continuer automatiquement avec :

```text
Lot B — App web minimale
```

Ensuite seulement Lot C, D, E, F, G, H.

## Définition de réussite de cette session

La session est réussie si elle aboutit à un état vérifié où :

- le dépôt contient une base applicative conforme au PRD ;
- `npm install` fonctionne ;
- `npm run dev` démarre l’app dès que le squelette est en place ;
- `npm run build` passe ;
- `npm test` existe et passe, même avec premiers tests minimaux ;
- `docs/RECETTE.md` ou équivalent explique ce qui a été fait, les commandes exécutées et les suites ;
- aucune donnée personnelle réelle ni secret n’est présent ;
- aucune dérive SIRH n’est introduite.

Si tu atteins une limite de contexte, compacte en préservant : PRD, état des lots, commandes, tests, décisions, fichiers modifiés, risques, prochaines tâches.
