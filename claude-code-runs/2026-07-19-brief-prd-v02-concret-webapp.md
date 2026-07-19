# Brief Claude Code — Révision PRD v0.2 « Comptoir des Harnais »

## Instruction d’exécution

Tu dois faire évoluer le PRD existant :

```text
prd/PRD.md
```

Objectif : produire une version **v0.2** qui corrige une ambiguïté stratégique majeure.

- Modèle à utiliser pour cette révision PRD : **Fable 5** (`--model fable` ou `--model claude-fable-5`).
- Tu dois modifier uniquement `prd/PRD.md`.
- Ne crée aucun autre fichier.
- Ne lance aucun développement.
- Ne crée pas de dépôt GitHub distant.
- Ne fais référence à aucun projet concurrent, aucun fork, aucun nom de concurrent, aucune comparaison publique avec un outil existant.
- Ne reprends aucun contenu propriétaire du Comptoir des Signaux ou de Pascal.
- Le développement sera réalisé plus tard, après validation humaine, avec **Opus 4.8** ou l’identifiant confirmé à ce moment-là.

## Problème à corriger

Le PRD v0.1 est trop prudent et trop documentaire. Il décrit surtout :

- un cadre pédagogique ;
- des templates ;
- un exemple RH ;
- des scripts de génération Markdown ;
- une éventuelle interface web plus tard.

Ce n’est pas suffisant pour l’objectif réel.

Pascal veut pouvoir tourner une vidéo crédible. Pour cela, il faut quelque chose de :

- concret ;
- utile ;
- visuel ;
- facilement réplicable par quelqu’un d’autre que lui ;
- démontrable en quelques minutes ;
- sérieux pour une DRH, un DGS, un DSI, un DPO ou un RSSI.

Une vidéo ne peut pas reposer seulement sur des fichiers Markdown et des explications. Le dépôt doit produire une **application web fonctionnelle**, même sobre, que l’on peut lancer localement et éventuellement déployer.

## Nouvelle promesse à intégrer

Le PRD v0.2 doit affirmer clairement que le dépôt GitHub contiendra deux dimensions complémentaires :

### 1. Une couche pédagogique générique

Elle explique ce qu’est un harnais IA pour acteurs publics :

- définition ;
- cycle de vie ;
- rôles métiers / DSI / DPO / RSSI ;
- classification des données ;
- RGPD / AI Act / cybersécurité ;
- tests ;
- réversibilité ;
- distinction prototype / usage interne / mise en production.

### 2. Un premier harnais vertical complet : onboarding RH documentaire

Le dépôt doit permettre, après clonage, de créer et lancer une **webapp d’onboarding RH documentaire**, configurable, sourcée, gouvernée, visuelle et testable.

Promesse proposée :

> Comptoir des Harnais est un dépôt open source qui explique ce qu’est un harnais IA pour acteurs publics et fournit un premier harnais vertical complet : une application d’onboarding RH documentaire, configurable, sourcée et gouvernée. Elle permet à une collectivité de créer son propre portail d’accueil des nouveaux arrivants à partir de ses sources internes, sans traiter de dossiers individuels ni se substituer à un SIRH.

## Point de vigilance absolu : ne pas promettre un SIRH

Le PRD doit être très clair :

- ce n’est pas un SIRH ;
- ce n’est pas un quasi-SIRH ;
- ce n’est pas un outil de gestion de dossiers agents ;
- ce n’est pas un workflow RH décisionnel ;
- ce n’est pas un outil de paie, carrière, absences, temps, santé, discipline, rémunération ;
- ce n’est pas un outil de décision individuelle.

Expression recommandée :

> application d’onboarding RH documentaire

ou :

> portail d’accueil documentaire pour nouveaux arrivants

Ne pas utiliser :

> quasi-SIRH

sauf dans une section “ce que le produit n’est pas”, pour l’écarter explicitement.

## Ce que la webapp V1 doit faire concrètement

Le PRD v0.2 doit définir une V1 où le dépôt cloné permet de lancer localement une application web visible.

Fonctions minimales attendues :

1. Page d’accueil pédagogique : “Bienvenue dans votre harnais d’onboarding RH”.
2. Parcours nouvel arrivant : modules et étapes.
3. Bibliothèque de fiches : marchés publics, télétravail, mutuelles, temps de travail, contacts utiles, règles internes.
4. FAQ sourcée : réponses à partir des sources fournies.
5. Quiz nouvel arrivant : questions de validation pédagogique.
6. Checklist RH : ce que la DRH doit préparer / valider / mettre à jour.
7. Page “sources et dates de mise à jour”.
8. Page “limites et refus” : ce que l’application ne répondra pas.
9. Page “gouvernance” : responsable métier, DPO, DSI/RSSI, statut prototype/interne/production.
10. Mode démo avec sources fictives réalistes, sans données personnelles réelles.
11. Mode configuration simple pour adapter la démo à une collectivité : YAML/JSON/Markdown.
12. Tests de garde-fous : réponses sourcées, refus des cas individuels RH, présence des mentions obligatoires.

## Réplicabilité attendue

Le PRD doit exiger un parcours de réplication très simple.

Exemple attendu :

```bash
git clone <repo>
cd comptoir-des-harnais
cp .env.example .env
# configuration optionnelle du fournisseur de modèle
npm install
npm run dev
npm test
```

Si le choix technique final n’est pas encore arrêté, le PRD doit proposer une architecture recommandée, mais garder la priorité sur :

- simplicité ;
- exécution locale ;
- pas de base de données obligatoire en V1 ;
- sources en fichiers Markdown/YAML/JSON ;
- déploiement optionnel ;
- lisibilité pour non-techniciens.

## Architecture technique recommandée à intégrer

Le PRD doit proposer une architecture V1 sobre.

Option recommandée :

- Next.js ou équivalent web moderne ;
- données et sources en Markdown/YAML/JSON ;
- pas de base de données en V1 ;
- app locale lançable avec `npm run dev` ;
- moteur de génération/récupération simple ;
- interface modèle substituable ;
- tests automatisés ;
- design sobre, institutionnel, responsive ;
- possibilité de déploiement statique ou Vercel/équivalent plus tard, mais pas obligatoire au MVP.

Le PRD ne doit pas se perdre dans une stack lourde. La priorité est de montrer un harnais visible et utile.

## Ce que la vidéo doit montrer

Le plan vidéo doit être révisé. Il doit montrer un artefact réellement utilisable :

1. On clone le dépôt ou on ouvre le repo.
2. On lance l’app localement.
3. On voit le portail d’onboarding RH.
4. On parcourt les modules.
5. On pose une question documentaire et on obtient une réponse sourcée.
6. On pose une question piège sur un cas individuel RH et l’app refuse correctement.
7. On montre la page des sources, des limites et de la gouvernance.
8. On montre comment une collectivité remplace les sources fictives par ses propres documents.
9. On montre les tests qui passent.
10. On conclut : ce n’est pas un SIRH, c’est un harnais documentaire gouverné.

## Structure du dépôt à réviser

Le PRD doit remplacer ou faire évoluer la structure cible pour inclure une vraie app.

Structure indicative :

```text
README.fr.md
README.md
LICENSE
package.json
next.config.js ou équivalent
src/
  app/
  components/
  lib/
  config/
content/
  demo-onboarding-rh/
    sources/
    fiches/
    parcours/
    quiz/
    gouvernance/
configs/
  demo.yml
  organisation.example.yml
docs/
  comprendre-les-harnais.fr.md
  cycle-de-vie.fr.md
  gouvernance-rgpd-ai-act.fr.md
templates/
  harnais-metier/
  onboarding-rh-documentaire/
tests/
  guardrails/
  structure/
scripts/
  validate-harness
  generate-demo
```

Le PRD peut ajuster cette structure, mais doit conserver l’idée : **documentation + application + contenu démo + templates + tests**.

## Roadmap à réviser

La roadmap doit être corrigée :

- V0 : PRD v0.2 validé ;
- V1 : webapp onboarding RH documentaire fonctionnelle localement + documentation pédagogique ;
- V1.1 : configuration guidée pour adapter le harnais ;
- V1.2 : tests renforcés + scénario vidéo ;
- V2 : observatoire territorial simple ;
- V3 : déploiement simplifié / guides OPSN ;
- V4 : agents/outils avancés si retour terrain.

L’interface web ne doit plus être repoussée en V3 : elle est au cœur de la V1.

## Plan de développement Opus 4.8 à réviser

Le plan de développement doit être mis à jour pour inclure l’app web dès V1.

Il doit être découpé en lots, par exemple :

- Lot A : socle dépôt, README, licence, architecture ;
- Lot B : app web minimale ;
- Lot C : modèle de contenu onboarding RH ;
- Lot D : UI pédagogique ;
- Lot E : réponses sourcées / moteur documentaire ;
- Lot F : garde-fous et refus ;
- Lot G : tests ;
- Lot H : documentation et scénario vidéo.

Il faut garder l’exigence : une tâche = portée fermée + vérification.

## Exigences de sérieux à renforcer

Le PRD doit renforcer les points qui rendront le projet crédible pour DSI/DPO/RSSI/DGS/DRH :

- pas de données personnelles réelles ;
- données fictives clairement marquées ;
- classification des données visible dans l’app ;
- sources citées avec date et statut ;
- refus des cas individuels ;
- journal de mise à jour ;
- mention “ne vaut pas validation juridique” ;
- responsable métier identifié ;
- DPO/DSI/RSSI dans le workflow de validation ;
- réversibilité : fichiers lisibles, exportables, versionnés ;
- pas de verrou fournisseur ;
- tests automatisés reproductibles.

## Sortie attendue

Modifier `prd/PRD.md` pour en faire une **version v0.2** alignée avec cette nouvelle ambition.

Le document doit rester en français, clair, sobre et sérieux.

Ne pas produire de résumé séparé. Ne pas créer de nouveau fichier.
