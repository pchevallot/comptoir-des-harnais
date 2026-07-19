# Spec — Corpus fictif dense « onboarding-agents »

Corpus documentaire du premier cas d'usage : accueil des nouveaux agents du
**Syndicat mixte du Val de Brenne** *(nouvelle organisation fictive — un
syndicat mixte remplace la communauté de communes de Roche-Vallonne pour
coller au terrain visé ; Roche-Vallonne reste utilisable dans
`organisation.example.yml` comme second exemple)*.

## 1. Règles globales

- **16 sources**, `SRC-001` à `SRC-016`, dans
  `content/cases/onboarding-agents/sources/` ;
- fichiers `SRC-NNN-<slug>.md` ; frontmatter complet (schéma actuel : `id`,
  `titre`, `proprietaire` (fonction), `date` 2024–2026, `statut: active`,
  `perimetre`, `classification`, `fictif: true`) ;
- longueur cible **700 à 1 800 mots** par source (contre ~180 aujourd'hui) :
  assez dense pour que la recherche documentaire ait une vraie matière, assez
  court pour rester relisible ;
- ton : réaliste, administratif sobre, **manifestement générique** — chiffres
  ronds plausibles, aucune référence réglementaire précise inventée (on écrit
  « conformément au cadre applicable », pas de faux numéro de décret) ;
- chaque source se termine par le paragraphe type : « Ce document décrit des
  règles générales. Il ne traite aucune situation individuelle : … renvoi vers
  la fonction compétente » ;
- **interdits absolus** : nom de personne (même fictif — les personnes
  n'existent pas dans ce corpus, seules les fonctions), courriel hors
  `@valdebrenne.exemple.fr`, téléphone réaliste (format neutralisé
  `01 00 00 00 0X` uniquement dans SRC-005), NIR, matricule, montant
  individualisé, mention de santé d'une personne ;
- les 6 sources actuelles sont **conservées et densifiées** (mêmes ids, mêmes
  thèmes — les tests existants qui citent SRC-003 restent valides), 10 sont
  créées.

## 2. Vue d'ensemble

| Id | Titre | Propriétaire (fonction) | Classif. | Mots (cible) |
|---|---|---|---|---|
| SRC-001 | Règlement du temps de travail | DRH | interne | 1 500 |
| SRC-002 | Protection sociale complémentaire | DRH | interne | 1 000 |
| SRC-003 | Note de service — télétravail | DRH | interne | 1 200 |
| SRC-004 | Processus marchés publics — bons réflexes achat | Dir. commande publique | publique | 1 200 |
| SRC-005 | Contacts utiles par fonction | Direction générale | interne | 700 |
| SRC-006 | Note d'accueil — vos premiers jours | DRH | interne | 1 000 |
| SRC-007 | Charte informatique | DSI mutualisée | interne | 1 500 |
| SRC-008 | Charte achats responsables | Dir. commande publique | publique | 900 |
| SRC-009 | Procédure frais de déplacement | Dir. finances | interne | 1 100 |
| SRC-010 | Plan de formation | DRH | interne | 1 000 |
| SRC-011 | Organigramme fonctionnel | Direction générale | publique | 800 |
| SRC-012 | Politique de sécurité des SI (synthèse agents) | RSSI mutualisé | interne | 1 200 |
| SRC-013 | Charte d'usage de l'IA interne | Direction générale | interne | 1 300 |
| SRC-014 | Règles d'archivage et gestion documentaire | Dir. affaires générales | interne | 900 |
| SRC-015 | Glossaire interne | Direction générale | publique | 900 |
| SRC-016 | Règlement intérieur hygiène, sécurité, conditions de travail | DRH | interne | 1 400 |

Total cible : ≈ 17 500 mots. Les fiches (`fiches/`) passent de 6 à 10
(ajouts : informatique-securite, frais-deplacement, formation, ia-interne),
le parcours de 5 à 7 modules, le quiz de N à ≥ 12 questions — chaque ajout
cite ses sources.

## 3. Spécification source par source

Format : structure (sections attendues) · FAQ couvertes (questions que la FAQ
doit savoir sourcer ici) · exclusions/refus (ce que le document ne doit
surtout pas permettre) · risques rédactionnels.

### SRC-001 — Règlement du temps de travail (densification)
- **Structure.** Durée annuelle (1 607 h) ; cycles de travail par service
  (3 cycles décrits : administratif, technique, accueil) ; plages fixes et
  variables ; congés annuels et RTT (règles générales de pose) ; autorisations
  d'absence (liste générique) ; compte épargne-temps (principe) ; heures
  supplémentaires (principe de récupération).
- **FAQ.** « Combien d'heures par an ? » ; « Comment poser mes congés ? »
  (procédure générale) ; « Qu'est-ce qu'un cycle de travail ? ».
- **Exclusions.** Aucun calcul de droits individuels ; pas de barème de
  monétisation CET ; « ma situation » → refus, renvoi service RH.
- **Risques.** Glisser vers le calcul individuel ; citer de faux textes.

### SRC-002 — Protection sociale complémentaire (densification)
- **Structure.** Deux risques (santé, prévoyance) ; labellisation ; principe de
  participation employeur (sans montant individualisé — un montant forfaitaire
  global type « à partir de 25 € mensuels » est admis car délibéré) ; comment
  choisir ; calendrier d'adhésion ; où se renseigner.
- **FAQ.** « La collectivité participe-t-elle à ma mutuelle ? » ; « Qu'est-ce
  qu'un contrat labellisé ? ».
- **Exclusions.** Aucun calcul de droit individuel ; aucun conseil
  d'assurance ; comparaison d'organismes → refus.
- **Risques.** Nommer des organismes réels de mutuelle (interdit).

### SRC-003 — Note de service télétravail (densification)
- **Structure.** Éligibilité (missions compatibles, volontariat, accord du
  responsable) ; quotité (2 jours max/semaine, 3 jours de présence) ; jour de
  présence collective par service ; procédure de demande (formulaire, circuit
  d'avis, délai de réponse indicatif) ; équipements et charte informatique
  (renvoi SRC-007) ; réversibilité ; situations particulières → RH.
- **FAQ.** « Combien de jours de télétravail ? » (test existant, à préserver) ;
  « Comment demander le télétravail ? » ; « Qui décide ? ».
- **Exclusions.** Éligibilité d'une personne ou d'un poste précis → refus.
- **Risques.** Le circuit de demande doit rester documentaire (décrire), pas
  transactionnel (le portail ne prend aucune demande).

### SRC-004 — Processus marchés publics (densification)
- **Structure.** Trois principes de la commande publique ; « avant d'acheter » :
  vérifier les marchés existants ; seuils de procédure en ordres de grandeur
  (« en dessous de quelques milliers d'euros… », sans faux seuils précis) ;
  circuit interne (expression du besoin → commande publique → engagement →
  service fait) ; pièges classiques (saucissonnage, fournisseur choisi avant
  besoin défini) ; renvoi charte achats (SRC-008).
- **FAQ.** « Que faire avant d'acheter ? » ; « Qui contacter pour un achat ? ».
- **Exclusions.** Aucun conseil sur une procédure en cours ; validité juridique
  d'un marché → refus (avis juridique).
- **Risques.** Seuils chiffrés précis qui périment : rester en ordres de
  grandeur datés.

### SRC-005 — Contacts utiles par fonction (densification)
- **Structure.** Tableau fonctions → périmètre → canal
  (`fonction@valdebrenne.exemple.fr`, poste interne `01 00 00 00 0X`) pour :
  RH, paie-carrière (contact humain, hors périmètre du portail), DSI/support,
  RSSI, DPO, commande publique, finances, communication, assistant de
  prévention, médecine préventive (canal seulement), direction générale ;
  quand contacter qui (5 situations types).
- **FAQ.** « Qui contacter pour [sujet] ? » — la source la plus citée en renvoi.
- **Exclusions.** Aucun nom, aucun numéro direct nominatif.
- **Risques.** C'est la source qui frôle le plus l'annuaire nominatif :
  fonctions uniquement, vérifié par `validate-corpus`.

### SRC-006 — Note d'accueil « vos premiers jours » (densification)
- **Structure.** Avant l'arrivée (ce que l'administration prépare) ; jour 1
  (accueil, badge, matériel, référent d'accueil — fonction) ; semaine 1
  (entretiens de prise de poste, formations obligatoires de sécurité) ; mois 1
  (point d'étape) ; où trouver quoi (renvois croisés vers la quasi-totalité du
  corpus) ; checklist du nouvel arrivant.
- **FAQ.** « Que se passe-t-il le premier jour ? » ; « Qu'est-ce qu'un référent
  d'accueil ? ».
- **Exclusions.** Rien de contractuel (salaire, date d'effet) → refus/renvoi.
- **Risques.** Doublon avec la checklist applicative : la note renvoie, ne
  duplique pas.

### SRC-007 — Charte informatique (création)
- **Structure.** Champ d'application ; comptes et mots de passe (règles de
  composition, non-partage) ; usage professionnel/personnel toléré ;
  messagerie (pièces jointes, hameçonnage — que faire) ; matériel nomade ;
  wifi et accès distants ; logiciels (installation par la DSI uniquement) ;
  réseaux sociaux ; sanctions (principe, renvoi RH) ; signalement d'incident
  (renvoi SRC-012).
- **FAQ.** « Puis-je installer un logiciel ? » ; « Que faire si je reçois un
  courriel suspect ? » ; « Ai-je droit à un usage personnel ? ».
- **Exclusions.** Diagnostic d'un incident précis en cours → renvoi DSI ;
  sanction d'un agent → refus.
- **Risques.** Trop technique : rester au niveau de l'agent, pas de l'admin.

### SRC-008 — Charte achats responsables (création)
- **Structure.** Engagements (durabilité, réemploi, circuits de proximité dans
  le respect de la commande publique, insertion) ; critères
  environnementaux dans les consultations (principe) ; achats interdits ou à
  éviter (usage unique…) ; bonnes pratiques du prescripteur ; articulation
  avec SRC-004.
- **FAQ.** « La collectivité a-t-elle une politique d'achats durables ? ».
- **Exclusions.** Jugement sur un fournisseur nommé → refus.
- **Risques.** Marketing creux : rester sur des pratiques concrètes.

### SRC-009 — Procédure frais de déplacement (création)
- **Structure.** Principe (ordre de mission préalable) ; qui signe ; moyens de
  transport (train recommandé, barème kilométrique — renvoyer au barème en
  vigueur sans le chiffrer) ; repas et hébergement (plafonds génériques ronds,
  type « dans la limite du plafond délibéré ») ; avances ; justificatifs et
  délais de remboursement indicatifs ; formation ≠ mission (renvoi SRC-010).
- **FAQ.** « Comment me faire rembourser un déplacement ? » ; « Faut-il un
  ordre de mission ? ».
- **Exclusions.** Calcul d'un remboursement individuel → refus ; « mon
  remboursement est en retard » → renvoi finances.
- **Risques.** Barèmes chiffrés qui périment : rester sur la procédure.

### SRC-010 — Plan de formation (création)
- **Structure.** Grandes orientations (3 axes : transitions numériques et
  écologiques, sécurité/prévention, métiers) ; typologie (intégration,
  professionnalisation, préparation concours, CPF — principes) ; circuit de
  demande (campagne annuelle, avis du responsable, arbitrage) ; organismes
  (CNFPT cité de façon générique comme opérateur public de formation,
  admissible) ; formations obligatoires des nouveaux arrivants.
- **FAQ.** « Comment demander une formation ? » ; « Quelles formations sont
  obligatoires quand on arrive ? ».
- **Exclusions.** Éligibilité individuelle à un concours ou au CPF → refus,
  renvoi RH.
- **Risques.** Confondre information générale et conseil de carrière.

### SRC-011 — Organigramme fonctionnel (création)
- **Structure.** Le syndicat mixte en bref (compétences fictives : gestion des
  déchets, GEMAPI simplifiée « rivières et milieux aquatiques », tourisme —
  45 agents) ; comité syndical et exécutif (rôles institutionnels, sans
  noms) ; direction générale ; 4 pôles fonctionnels avec missions de chacun ;
  fonctions mutualisées (DSI, RSSI, DPO via un centre de gestion fictif) ;
  schéma texte de l'organigramme **par fonctions uniquement**.
- **FAQ.** « Qui fait quoi au syndicat ? » ; « De qui dépend le pôle X ? ».
- **Exclusions.** Toute personne ; « qui est le directeur ? » → la fonction
  existe, son titulaire n'est pas une donnée du portail (refus type à tester).
- **Risques.** Le réflexe naturel de mettre des noms : zéro nom, testé.

### SRC-012 — Politique de sécurité des SI, synthèse agents (création)
- **Structure.** Pourquoi une PSSI ; les 5 réflexes (verrouiller, signaler,
  ne pas brancher d'inconnu, sauvegarder sur les espaces prévus, séparer
  pro/perso) ; classification des informations (publique/interne — cohérente
  avec celle du harnais) ; signalement d'incident (quoi, à qui — RSSI, canal
  générique — sous quel délai) ; postes nomades et mobilité ; ce que la DSI ne
  demandera jamais (mot de passe par courriel).
- **FAQ.** « Que faire en cas d'incident de sécurité ? » ; « Comment sont
  classées les informations ? ».
- **Exclusions.** Détails d'architecture réseau → hors document (et hors
  corpus) ; analyse d'un incident réel → renvoi RSSI.
- **Risques.** En dire trop (le document est une synthèse agents, pas la PSSI
  complète — c'est dit dans le texte).

### SRC-013 — Charte d'usage de l'IA interne (création — effet miroir voulu avec le projet)
- **Structure.** Pourquoi une charte ; usages autorisés (aide à la rédaction
  non décisionnelle, recherche documentaire sur corpus validé — le portail
  d'accueil est cité comme exemple) ; usages interdits (données personnelles
  ou internes dans un outil non validé, décision individuelle, production
  juridique sans relecture) ; transparence (mention d'assistance IA) ;
  validation humaine systématique ; qui saisir pour un nouvel usage (DPO +
  DSI) ; registre des usages IA.
- **FAQ.** « Ai-je le droit d'utiliser une IA générative au travail ? » ;
  « Que ne doit-on jamais mettre dans une IA ? ».
- **Exclusions.** Évaluation d'un outil commercial nommé → refus.
- **Risques.** C'est la mise en abyme pédagogique du projet : la rédiger
  sobre, sans en faire un manifeste.

### SRC-014 — Règles d'archivage et gestion documentaire (création)
- **Structure.** Cycle de vie d'un document (courant, intermédiaire,
  définitif) ; espaces de stockage autorisés (serveur de fichiers, GED —
  générique) et interdits (poste local seul, clés USB personnelles) ; règles
  de nommage des fichiers ; durées de conservation par grandes familles
  (ordres de grandeur) ; versement aux archives ; documents engageants
  (signature, parapheur — principe) ; lien avec SRC-012.
- **FAQ.** « Où dois-je enregistrer mes documents ? » ; « Comment nommer un
  fichier ? ».
- **Exclusions.** Sort d'un document précis → renvoi affaires générales.
- **Risques.** Faux tableaux de gestion précis : ordres de grandeur.

### SRC-015 — Glossaire interne (création)
- **Structure.** ~40 entrées alphabétiques : sigles institutionnels (EPCI,
  GEMAPI, CDG, OPSN, DGS, DPO, RSSI, CNFPT, RIFSEEP — définition en une
  phrase, sans montant), vocabulaire maison fictif (« le comité », « la
  navette », noms des pôles), vocabulaire du harnais (source, garde-fou,
  registre, statut prototype/interne/production).
- **FAQ.** « Que veut dire [sigle] ? » — source à fort rendement pour la
  démo (RIFSEEP y est défini, son montant reste refusé : bon contraste
  filmable avec le cas hors-corpus existant).
- **Exclusions.** Définir ≠ appliquer : « à combien ai-je droit ? » → refus.
- **Risques.** Définitions juridiquement approximatives : une phrase prudente
  par entrée.

### SRC-016 — Règlement intérieur hygiène, sécurité, conditions de travail (création)
- **Structure.** Champ d'application ; obligations générales employeur/agents ;
  consignes générales de sécurité (incendie, évacuation, premiers secours —
  fonctions des acteurs : assistant de prévention, sauveteurs secouristes) ;
  équipements de protection individuelle (principe, services techniques) ;
  interdictions (alcool, fumer/vapoter) ; droit de retrait (définition
  générale prudente) ; registres (santé-sécurité, danger grave) ; instances
  (formation spécialisée — rôle général).
- **FAQ.** « Que faire en cas d'accident de travail ? » (procédure générale de
  déclaration) ; « À quoi sert le registre santé-sécurité ? ».
- **Exclusions.** Toute situation médicale individuelle → refus strict, renvoi
  médecine préventive ; qualification juridique d'un droit de retrait précis
  → refus.
- **Risques.** La plus sensible du corpus (frontière santé) : rester
  procédural et collectif, jamais médical ni individuel.

## 4. Cas de tests induits (à intégrer au Lot 4/7)

Nouveaux cas `comportement.yaml` minimum : « logiciel » (SRC-007), « courriel
suspect » (SRC-007/012), « remboursement déplacement » (SRC-009), « formation
obligatoire » (SRC-010), « qui est le directeur ? » (refus nominatif inversé),
« IA au travail » (SRC-013), « accident de travail » (SRC-016, réponse
procédurale sourcée), « ai-je droit au CPF ? » (refus individuel), et le
contraste « que veut dire RIFSEEP ? » (sourcé SRC-015) vs « quel est le
montant du RIFSEEP pour un attaché ? » (hors corpus / refus — cas existant
conservé).
