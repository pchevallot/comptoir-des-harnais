# Brief Claude Code — PRD « Comptoir des Harnais »

## Instruction d’exécution pour Claude Code

Tu dois d’abord produire un **PRD complet** et rien d’autre.

- Modèle à utiliser pour cette phase PRD : **Fable 5** (`--model claude-fable-5`, ou alias `fable` si l’environnement Claude Code ne reconnaît pas le nom complet).
- Ne commence **aucun développement** dans cette phase.
- Ne crée pas encore de dépôt GitHub distant.
- Ne fais pas référence à Hypervibe dans les livrables publics, le README ou le nommage projet.
- Ne forke aucun projet existant.
- Ne reprends aucun contenu propriétaire du Comptoir des Signaux ou de Pascal.
- Tu peux créer uniquement le fichier de sortie demandé : `prd/PRD.md`.

La phase de développement proprement dite sera réalisée plus tard, après validation humaine du PRD, avec un modèle plus adapté à l’exécution longue, prévu ici comme **Opus 4.8**. Le PRD doit explicitement prévoir cette séparation :

1. **Phase conception / PRD** : Fable 5, raisonnement produit, pédagogie, cadrage public.
2. **Phase implémentation** : Opus 4.8, tâches découpées, tests, dépôt open source, documentation, exemples.

Si un nom de modèle exact n’est pas disponible dans ton environnement, ne le remplace pas silencieusement : écris dans le PRD une note “modèle à confirmer dans Claude Code”.

---

# Contexte stratégique

Le projet est porté par Pascal Chevallot et Le Comptoir des Signaux.

Pascal vise un positionnement de référence en France sur l’IA générative pour les collectivités territoriales, les organisations publiques territoriales, les opérateurs publics de services numériques, les centres de gestion, syndicats mixtes, EPCI, communes et acteurs publics de proximité.

Le projet ne doit pas être une démonstration de “vibe coding”, ni un outil spectaculaire mais creux. Il doit produire quelque chose de concret, utile, vérifiable et sérieux pour des acteurs publics non informaticiens, tout en étant immédiatement crédible pour un DSI, un DPO, un RSSI, un DGS, une DRH ou un directeur métier.

Le produit visé est un **cadre pédagogique open source** pour comprendre et créer des **harnais IA pour acteurs publics**, responsables et gouvernés. Le **nom de travail prioritaire** est : **Comptoir des Harnais**. Ne pas employer comme nom de projet l’expression “Harnais Public IA”, qui crée une confusion directe avec un concurrent nommé Public IA. Le PRD doit évaluer brièvement “Comptoir des Harnais” comme nom, proposer au besoin 2 ou 3 variantes de secours sobres, mais considérer “Comptoir des Harnais” comme l’option préférée à ce stade.

Définition de travail :

> Un harnais IA n’est pas un prompt. C’est un ensemble structuré de besoins métier, sources, règles, outils, garde-fous, tests, responsabilités et preuves qui encadrent l’IA pour produire une application, un livrable ou une capacité métier utile, maintenable et gouvernée.

Le projet doit aider une organisation publique à passer de :

> “J’ai un irritant métier répétitif et peu outillé”

à :

> “J’ai un premier harnais documenté, testable, gouvernable et améliorable, capable de produire un livrable ou une application simple.”

---

# Ambition réaliste

Le projet doit être **moins ambitieux qu’un générateur complet d’applications web industrialisées**. Il doit éviter de promettre une app complète, un SaaS, un SIRH, un observatoire exhaustif ou une conformité automatique.

Mais il doit être **plus sérieux** qu’un simple pack de prompts :

- pédagogie claire pour non informaticiens ;
- cadrage par besoin métier ;
- sources et données explicites ;
- garde-fous ;
- RGPD / AI Act / cybersécurité intégrés dès le départ ;
- tests et critères de validation ;
- traçabilité ;
- réversibilité ;
- maintenance ;
- séparation entre démonstration, prototype et usage réel.

Si un décideur public ou un concurrent tombe sur la vidéo et le dépôt GitHub, la réaction recherchée est :

> “C’est très sérieux. Ce n’est pas une démo IA de plus. Ils ont compris les contraintes réelles du secteur public.”

---

# Publics cibles

Le PRD doit tenir compte de plusieurs publics, avec des niveaux de lecture différents.

## Publics non informaticiens

- DRH ;
- DGS / DGA ;
- directeurs métier ;
- cadres d’EPCI ;
- responsables aménagement, urbanisme, développement économique ;
- agents chargés de produire des notes, fiches, parcours, diagnostics ;
- élus intéressés par l’IA mais prudents.

Ils doivent comprendre :

- ce qu’est un harnais ;
- à quoi cela sert ;
- ce qu’il faut fournir ;
- ce qu’ils peuvent obtenir ;
- ce que l’IA ne doit pas faire ;
- comment garder la maîtrise.

## Publics de contrôle et de sécurisation

- DSI ;
- RSSI ;
- DPO ;
- juristes ;
- responsables achats ;
- directions générales.

Ils doivent trouver :

- une architecture claire ;
- une classification des données ;
- une logique de registre des usages IA ;
- des limites ;
- des tests ;
- des responsabilités ;
- une approche RGPD / AI Act prudente ;
- une réflexion sur hébergement, souveraineté, secrets, logs et réversibilité.

## Publics techniques

- développeurs publics ;
- OPSN ;
- agences techniques ;
- intégrateurs publics ;
- agents avancés.

Ils doivent pouvoir cloner le dépôt, comprendre la structure, exécuter les exemples et l’adapter.

---

# Deux cas d’usage prioritaires

Le PRD doit proposer un MVP centré sur un premier cas d’usage, puis prévoir une extension vers un second cas.

## Cas d’usage 1 — Onboarding RH public

Persona :

> Je suis DRH ou responsable RH dans une collectivité, un syndicat mixte, un EPCI ou un organisme public. Je n’ai pas de SIRH adapté. Nous avons recruté plusieurs personnes récemment et j’ai répété plusieurs fois les mêmes explications : types de marchés publics, mutuelles labellisées, télétravail, temps de travail, contacts utiles, règles internes. C’est chronophage, fragile, et je risque d’oublier des informations.

Objectif : créer un harnais qui transforme cette répétition en parcours d’onboarding documenté et maintenable.

Sorties possibles :

- parcours nouvel arrivant ;
- FAQ sourcée ;
- fiches pédagogiques ;
- checklist RH ;
- quiz de vérification ;
- page de limites ;
- registre des sources ;
- journal de mise à jour ;
- règles de refus pour cas individuels ou sensibles.

Contraintes :

- pas de décision RH automatisée ;
- pas de traitement de données sensibles dans la démo ;
- sources fictives mais réalistes ;
- réponses sourcées ;
- validation humaine obligatoire avant diffusion ;
- pas de promesse de conformité automatique.

Ce cas doit être le MVP prioritaire, car il est humain, concret, compréhensible et démontrable en vidéo.

## Cas d’usage 2 — Observatoire territorial simple

Persona :

> Je suis cadre dans un EPCI, dans une direction aménagement, urbanisme ou développement économique. Nous n’avons pas la capacité d’ingénierie d’une agence d’urbanisme. Je vois des observatoires habitat, économiques, socio-démographiques ou environnementaux produits ailleurs. C’est utile, mais long à produire et difficile à maintenir. Je veux créer une première capacité d’observation territoriale à partir de sources open data publiques.

Objectif V2 : créer un harnais qui aide à produire une fiche territoriale sourcée et maintenable.

Sorties possibles :

- fiche territoire ;
- note de synthèse ;
- liste des sources ;
- indicateurs avec millésime ;
- limites méthodologiques ;
- comparaison prudente avec département/région/national ;
- journal de données ;
- scripts de récupération open data, plus tard.

Contraintes :

- ne pas promettre un observatoire complet en V1 ;
- ne pas produire d’interprétation sans source ;
- afficher millésime, méthode, limites ;
- séparer données brutes, indicateurs, analyse IA ;
- validation humaine avant publication.

---

# Ce que le PRD doit définir

Le fichier `prd/PRD.md` doit inclure au minimum les sections suivantes.

## 1. Résumé exécutif

- nom de travail ;
- problème public adressé ;
- promesse ;
- ce que le produit n’est pas ;
- public cible ;
- pourquoi maintenant.

## 2. Objectifs et non-objectifs

Objectifs concrets du MVP.

Non-objectifs explicites :

- ne pas créer un SIRH ;
- ne pas créer une agence d’urbanisme automatisée ;
- ne pas promettre conformité RGPD/AI Act automatique ;
- ne pas remplacer DSI/DPO/RSSI/juristes ;
- ne pas produire de décisions individuelles automatisées ;
- ne pas forker un autre harnais existant ;
- ne pas dépendre d’un fournisseur unique si évitable.

## 3. Personas

Inclure au moins :

- DRH non technique ;
- DGS/DGA ;
- DSI/RSSI ;
- DPO/juriste ;
- cadre métier territorial ;
- OPSN/intégrateur public.

## 4. Parcours utilisateur pédagogique

Le PRD doit montrer comment un non-informaticien est guidé.

Exemple de parcours :

1. exprimer son besoin en langage métier ;
2. choisir un type de harnais ;
3. lister les sources ;
4. classer les données ;
5. définir ce que l’IA peut faire ;
6. définir ce qu’elle ne peut pas faire ;
7. générer un premier livrable ;
8. tester ;
9. valider ;
10. maintenir.

Inclure les questions que l’assistant ou le dépôt doit poser à l’utilisateur.

## 5. Structure cible du dépôt open source

Proposer une structure de fichiers réaliste, sobre, lisible.

Le dépôt doit être utile même sans application web complexe.

Inclure probablement :

```text
README.fr.md
docs/
templates/
examples/onboarding-rh-public/
security/
rgpd-ai-act/
tests/
```

## 6. MVP fonctionnel

Définir ce que la première version doit permettre concrètement.

Proposition attendue :

- dépôt documenté ;
- guide “comprendre les harnais IA” ;
- template générique de harnais métier ;
- exemple complet onboarding RH public avec sources fictives ;
- scripts simples pour générer quelques livrables Markdown ;
- tests YAML simples ;
- checklist RGPD / AI Act / sécurité ;
- plan vidéo de démonstration.

## 7. Exigences pédagogiques

Le PRD doit préciser comment rendre le projet accessible :

- langage simple ;
- glossaire ;
- exemples concrets ;
- questions guidées ;
- pas de jargon inutile ;
- différenciation “prototype”, “usage interne”, “mise en production” ;
- explication des responsabilités.

## 8. Exigences RGPD / AI Act / cybersécurité

Inclure des exigences minimales très concrètes :

- classification des données ;
- registre des sources ;
- registre des usages IA ;
- matrice de risques ;
- threat model simple ;
- journalisation ;
- gestion des secrets ;
- absence de données personnelles réelles dans la démo ;
- validation humaine ;
- refus des cas individuels sensibles ;
- réversibilité ;
- durée de conservation ;
- sous-traitants ;
- hébergement ;
- tests de sécurité simples ;
- mention claire que cela ne vaut pas audit juridique.

## 9. Tests et critères d’acceptation

Prévoir des tests simples, lisibles par des non-techniciens :

- questions attendues ;
- réponses interdites ;
- obligation de citer les sources ;
- interdiction de traiter des cas individuels RH sensibles ;
- détection de sources obsolètes ;
- présence des sections obligatoires dans les livrables générés ;
- séparation entre faits sourcés et conseils.

## 10. Roadmap

Inclure :

- V0 : PRD + structure ;
- V1 : harnais onboarding RH Markdown ;
- V1.1 : générateur simple ;
- V1.2 : tests et exemples ;
- V2 : observatoire territorial simple ;
- V3 éventuelle : interface web légère ;
- V4 éventuelle : intégration agents/outils plus avancée.

## 11. Plan de développement pour Opus 4.8

Le PRD doit préparer une future phase d’implémentation par Claude Code avec Opus 4.8.

Inclure :

- tâches découpées ;
- ordre d’implémentation ;
- fichiers à créer ;
- stratégie de tests ;
- définition of done ;
- interdiction de commencer par une app web lourde ;
- validation humaine obligatoire entre PRD et développement.

## 12. Plan de vidéo

Le PRD doit inclure un premier plan de vidéo pédagogique de 8 à 12 minutes :

- introduction ;
- définition d’un harnais ;
- cas DRH ;
- constitution du harnais ;
- génération d’un livrable ;
- démonstration d’un garde-fou ;
- conclusion sur maîtrise publique.

---

# Standards de qualité attendus

Le PRD doit être :

- en français ;
- clair pour un non-informaticien ;
- sérieux pour un DSI/DPO/RSSI ;
- concret ;
- structuré ;
- actionnable ;
- sans marketing creux ;
- sans flatterie ;
- sans promesse excessive ;
- sans référence à des projets concurrents ;
- sans contenu confidentiel ;
- sans reprise de méthodes propriétaires CdS.

Le ton attendu : sobre, institutionnel, pédagogique, exigeant.

Ne pas utiliser de formulations floues comme :

- “révolutionner” ;
- “IA magique” ;
- “sans effort” ;
- “conforme par défaut” ;
- “solution clé en main pour tout le secteur public”.

Préférer :

- “aide à structurer” ;
- “premier cadre” ;
- “prototype gouverné” ;
- “capacité métier maintenable” ;
- “validation humaine” ;
- “sources explicites” ;
- “limites documentées”.

---

# Sortie attendue

Créer le fichier :

```text
prd/PRD.md
```

Ne pas créer d’autres fichiers pour cette phase, sauf si nécessaire pour noter une limite d’exécution. Si tu dois noter une limite, l’ajouter en fin de PRD dans une section “Points à confirmer”.

Le PRD doit être suffisamment précis pour qu’un autre Claude Code, utilisant Opus 4.8, puisse ensuite implémenter le dépôt open source sans deviner l’intention.
