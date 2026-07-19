---
name: cadrer-besoin-public
description: Transformer un irritant métier en fiche besoin d'une page, en langage métier, éligible au cadre (documentaire, sans cas individuel).
etapes_parcours: [1, 2, 3, 6]
scripts_associes: ["scripts/interview-harness.mjs"]
fichiers_produits:
  - "cases/<slug>/gouvernance/fiche-besoin.md"
  - "cases/<slug>/harnais.yaml"
  - "configs/<slug>.yml"
---

# cadrer-besoin-public

> Cette skill est la version **opérationnelle** du début du parcours. Le guide
> long reste `docs/cycle-de-vie.fr.md` (étapes 1-2 et statuts) : la skill ne le
> remplace pas, elle l'exécute question par question.

## Quand l'activer

- Aux **étapes 1, 2, 3 et 6** du parcours (`/fabrique/[slug]/etape/[numero]`
  dans l'atelier, ou `npm run interview` en CLI) : choisir le type de harnais,
  cadrer le besoin, décrire l'organisation, définir les publics.
- À la demande, hors parcours : « aide-moi à cadrer mon besoin »,
  « transforme cet irritant en fiche besoin ».

Elle produit une fiche besoin d'une page et remplit les champs `type`,
`besoin`, `publics`, `modules` du manifeste — ou elle s'arrête proprement si le
besoin n'est pas éligible.

## Ce que je demande

Une question à la fois, en français, langage métier. Chaque question est
accompagnée d'un exemple tiré du cas `onboarding-agents`.

1. **Type de harnais.** « Votre besoin est-il plutôt *expliquer et transmettre*
   (harnais documentaire) ou *observer et synthétiser* (harnais d'observation,
   prévu plus tard) ? Le résultat doit-il être identique pour tous les
   lecteurs ? »
   *Exemple (onboarding-agents) :* documentaire — tous les nouveaux agents
   reçoivent la même information sourcée.
2. **Tâche répétée et fréquence.** « Quelle tâche revient sans cesse, et à quel
   rythme ? »
   *Exemple :* réexpliquer à chaque arrivée les mêmes règles d'accueil
   (plusieurs fois par mois).
3. **Qui la fait, combien de temps.** « Qui s'en charge aujourd'hui, et combien
   de temps cela prend-il ? »
   *Exemple :* le service RH et les encadrants, une demi-journée dispersée par
   arrivée.
4. **Conséquence d'un oubli.** « Que se passe-t-il quand c'est mal fait ou
   oublié ? »
   *Exemple :* informations contradictoires, questions répétées, démarrage
   ralenti du nouvel agent.
5. **Consommateur du résultat.** « Qui utilise le résultat ? »
   *Exemple :* le nouvel agent lui-même, et son encadrant.
6. **Signe de réussite.** « À quoi verrait-on que la tâche est bien outillée ? »
   *Exemple :* le nouvel agent trouve seul une réponse sourcée et à jour, sans
   solliciter le service RH.
7. **Organisation.** « Nom (fictif ou réel), type (commune, EPCI, syndicat
   mixte, CDG, OPSN…), caractère fictif (o/n), et les **fonctions** de
   gouvernance : responsable métier, DPO, DSI/RSSI. »
   *Exemple :* syndicat mixte fictif ; responsable métier = Direction des
   ressources humaines ; DPO et DSI en fonctions.
8. **Publics.** « Qui lira : nouveaux agents, encadrants, tous les agents ? »
   *Exemple :* nouveaux agents et encadrants.
9. **Modules souhaités.** « Faut-il un parcours ordonné, une FAQ, un quiz, une
   checklist ? (o/n pour chacun) »
   *Exemple :* parcours ✓, FAQ ✓, quiz ✓, checklist ✓.

Je reformule chaque réponse et la confirme (« Voici la fiche besoin que je vais
écrire — d'accord ? » / bouton de confirmation dans l'atelier, `o/N` en CLI)
avant d'écrire quoi que ce soit.

## Ce que je produis

- `cases/<slug>/gouvernance/fiche-besoin.md` — **une page**, sans aucun terme
  technique, réutilisable telle quelle sur l'accueil de l'application.
- Les champs `type`, `besoin`, `publics`, `modules` du manifeste
  `cases/<slug>/harnais.yaml` (écrits via la logique déterministe de
  `scripts/interview-harness.mjs` / `scripts/lib/atelier/`, jamais par
  concaténation de chaînes).
- La section `organisation` de `configs/<slug>.yml`.

Exemple de fiche besoin (extrait, cas `onboarding-agents`) :

```markdown
# Fiche besoin — Accueil documentaire des nouveaux agents

**Besoin.** Offrir aux nouveaux agents un point d'entrée documentaire clair,
sourcé et à jour, pour éviter de répéter les mêmes explications à chaque
arrivée, sans traiter aucune situation individuelle.

**Publics.** Nouveaux agents, encadrants.
**Type.** Harnais documentaire.
```

## Ce que je refuse

- **Besoin individualisé.** Si le besoin revient à « répondre sur la situation
  de chaque agent » (dossier, droits personnels, décision nominative), je
  refuse l'éligibilité : « Ce besoin porte sur des situations individuelles ; il
  sort du cadre documentaire. Voir `cases/<slug>/gouvernance/limites-refus.md`.
  Le parcours s'arrête ici — c'est un comportement voulu, pas une erreur. » Je
  **sors en code 0** (le cadre fonctionne).
- **Type `observation`.** J'affiche « prévu, non disponible » et j'arrête
  proprement (seul `documentaire` est implémenté).
- **Nom de personne comme responsable.** Une réponse qui ressemble à
  « Prénom Nom » est refusée : « Indiquez une **fonction** (ex. Direction des
  ressources humaines), jamais un nom de personne. »
- **Clé API collée dans la conversation.** « Je ne stocke pas de clé.
  Mettez-la dans `.env.local` (côté serveur), jamais dans la conversation ni
  dans un fichier suivi par git. » Je ne répète pas la valeur et, si elle
  semble réelle, je conseille sa rotation.

## Réussite

- La fiche besoin tient sur **une page**, ne contient aucun terme technique, et
  l'accueil de l'application peut la citer telle quelle.
- Le manifeste porte un `type` valide, un `besoin` reformulé, des `publics` et
  des `modules` cohérents avec les choix exprimés.
- Aucun nom de personne, aucun secret nulle part.
