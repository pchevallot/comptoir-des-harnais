/**
 * Définition déclarative des 15 étapes du parcours (PRD v0.3 §4).
 *
 * Source **unique** de la logique de parcours, consommée par trois clients :
 *   - l'atelier web `/fabrique/[slug]/etape/[numero]` (Lot 5a/5b) ;
 *   - l'interview CLI `scripts/interview-harness.mjs` (Lot 3 S4) ;
 *   - les tests.
 *
 * Chaque étape porte : numéro, libellé **verbatim** du tableau PRD v0.3 §4,
 * skill associée, script/moteur déterministe, fichiers produits, genre
 * (`saisie` = questions/réponses, `commande` = l'interview affiche la commande
 * sans l'exécuter, `auto` = action déterministe déclenchée), et — pour les
 * étapes de saisie — les questions posées une à une.
 *
 * Aucun secret, aucun accès réseau, aucune dépendance à un TTY.
 */

/**
 * Genres d'étape :
 *  - `saisie`   : pose des questions et applique les réponses (via reponses.mjs) ;
 *  - `auto`     : déclenche une action déterministe (via actions.mjs) sans question ;
 *  - `commande` : l'interview N'EXÉCUTE PAS — elle affiche la commande exacte à
 *                 lancer (étapes 10, 13, 14, 15). Dans l'atelier web, la même
 *                 action est déclenchée par un bouton via l'API.
 */
export const GENRES = Object.freeze({ SAISIE: "saisie", AUTO: "auto", COMMANDE: "commande" });

/** Commande CLI exacte associée à une étape « commande » (affichée, jamais exécutée). */
function commandePourEtape(numero, slug) {
  switch (numero) {
    case 10:
      return `npm run scaffold -- --cas ${slug}`;
    case 13:
      return `npm run validate-guardrails -- --cas ${slug} && npm test`;
    case 14:
      return "npm run dev   # puis ouvrir http://localhost:3010";
    case 15:
      return `npm run rapport -- --cas ${slug}`;
    default:
      return null;
  }
}

export const ETAPES = [
  {
    numero: 1,
    titre: "Choisir le type de harnais",
    skill: "cadrer-besoin-public",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: ["cases/<slug>/harnais.yaml (type)"],
    questions: [
      {
        id: "type",
        texte:
          "Votre besoin est-il plutôt « expliquer et transmettre » (documentaire) ou « observer et synthétiser » (observation, prévu plus tard) ?",
        type: "enum",
        options: ["documentaire", "observation"],
        defaut: "documentaire",
      },
      {
        id: "eligibilite",
        texte:
          "Ce besoin porte-t-il sur des situations individuelles (dossiers, droits personnels, décisions nominatives) ? (o/n)",
        type: "booleen",
        defaut: "n",
      },
    ],
  },
  {
    numero: 2,
    titre: "Cadrer le besoin",
    skill: "cadrer-besoin-public",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: ["cases/<slug>/gouvernance/fiche-besoin.md", "cases/<slug>/harnais.yaml (besoin)"],
    questions: [
      { id: "tache", texte: "Quelle tâche revient sans cesse, et à quel rythme ?", type: "texte" },
      { id: "acteur", texte: "Qui s'en charge aujourd'hui, et combien de temps cela prend-il ?", type: "texte" },
      { id: "consequence", texte: "Que se passe-t-il quand c'est mal fait ou oublié ?", type: "texte" },
      { id: "consommateur", texte: "Qui utilise le résultat ?", type: "texte" },
      { id: "reussite", texte: "À quoi verrait-on que la tâche est bien outillée ?", type: "texte" },
      {
        id: "besoin",
        texte: "En une phrase, reformulez le besoin (repris mot pour mot sur l'accueil du portail).",
        type: "texte",
      },
    ],
  },
  {
    numero: 3,
    titre: "Décrire l'organisation",
    skill: "cadrer-besoin-public",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: ["configs/<slug>.yml (organisation)"],
    questions: [
      { id: "organisation.nom", texte: "Nom de l'organisation (fictif ou réel).", type: "texte" },
      {
        id: "organisation.type",
        texte: "Type (commune, EPCI, syndicat mixte, CDG, OPSN…).",
        type: "texte",
      },
      { id: "organisation.fictive", texte: "Est-elle fictive ? (o/n)", type: "booleen", defaut: "o" },
      {
        id: "gouvernance.responsable_metier",
        texte: "Responsable métier — une FONCTION, jamais un nom de personne.",
        type: "fonction",
      },
      {
        id: "gouvernance.dpo",
        texte: "Délégué à la protection des données (DPO) — une fonction.",
        type: "fonction",
      },
      {
        id: "gouvernance.dsi_rssi",
        texte: "DSI / RSSI — une fonction.",
        type: "fonction",
      },
    ],
  },
  {
    numero: 4,
    titre: "Déclarer les sources",
    skill: "classifier-sources",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: ["cases/<slug>/harnais.yaml (sources_declarees)"],
    boucle: true,
    questions: [
      { id: "titre", texte: "Titre du document existant (ou « terminé » pour clore la liste).", type: "texte" },
      { id: "proprietaire", texte: "Fonction propriétaire du document.", type: "fonction" },
      { id: "date_connue", texte: "Date de dernière mise à jour connue (AAAA-MM-JJ).", type: "date" },
    ],
  },
  {
    numero: 5,
    titre: "Classer les données",
    skill: "classifier-sources",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: ["cases/<slug>/gouvernance/classification.md"],
    questions: [
      {
        id: "donnees_personnelles",
        texte:
          "Vos sources contiennent-elles des noms, situations individuelles, éléments de santé ou RH nominatifs ? (o/n)",
        type: "booleen",
        defaut: "n",
      },
      {
        id: "classification",
        texte: "Classification retenue : publique ou interne (uniquement).",
        type: "enum",
        options: ["publique", "interne"],
        defaut: "interne",
      },
    ],
  },
  {
    numero: 6,
    titre: "Définir les publics",
    skill: "cadrer-besoin-public",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: ["cases/<slug>/harnais.yaml (publics)"],
    questions: [
      { id: "publics", texte: "Qui lira (ex. nouveaux agents, encadrants) ? Séparez par des virgules.", type: "liste" },
      { id: "modules.parcours", texte: "Un parcours ordonné ? (o/n)", type: "booleen", defaut: "o" },
      { id: "modules.faq", texte: "Une FAQ ? (o/n)", type: "booleen", defaut: "o" },
      { id: "modules.quiz", texte: "Un quiz ? (o/n)", type: "booleen", defaut: "o" },
      { id: "modules.checklist", texte: "Une checklist ? (o/n)", type: "booleen", defaut: "o" },
    ],
  },
  {
    numero: 7,
    titre: "Questions autorisées",
    skill: "concevoir-garde-fous",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: ["cases/<slug>/tests/comportement.yaml (cas « réponse attendue »)"],
    boucle: true,
    minimum: 5,
    questions: [
      { id: "question", texte: "Une question que votre public pose vraiment (ou « terminé »).", type: "texte" },
      { id: "cite_source", texte: "Quelle source doit répondre (identifiant SRC-…) ?", type: "texte" },
      { id: "mots_attendus", texte: "Quels mots doivent apparaître dans la réponse ? (virgules)", type: "liste" },
    ],
  },
  {
    numero: 8,
    titre: "Définir les refus",
    skill: "concevoir-garde-fous",
    script: "lib/atelier",
    genre: GENRES.SAISIE,
    fichiers: [
      "cases/<slug>/gouvernance/limites-refus.md",
      "cases/<slug>/tests/comportement.yaml (cas « refus »)",
    ],
    boucle: true,
    minimum: 3,
    socle:
      "Socle non négociable (toujours refusé) : cas individuels, avis juridique/médical, affirmation sans source, promesse de droit.",
    questions: [
      {
        id: "motif",
        texte: "Une question qui ne doit jamais recevoir de réponse automatique (ou « terminé »).",
        type: "texte",
      },
      { id: "renvoi", texte: "Vers quelle fonction renvoyer ?", type: "fonction" },
    ],
  },
  {
    numero: 9,
    titre: "Choisir le fournisseur IA",
    skill: "configurer-fournisseur-ia",
    script: "validate-provider-config",
    genre: GENRES.SAISIE,
    fichiers: [".env.local (manuel)", "cases/<slug>/harnais.yaml (fournisseur.mode)"],
    questions: [
      {
        id: "fournisseur.mode",
        texte:
          "Fournisseur : local (rien ne sort du poste), ollama (modèle chez vous), ou API tierce (à instruire avec le DPO) ?",
        type: "enum",
        options: ["local", "none", "ollama", "anthropic", "openai", "openrouter", "mistral"],
        defaut: "local",
      },
    ],
    note:
      "L'atelier AFFICHE le bloc .env.local à recopier ; il n'écrit, ne demande ni ne lit jamais de clé.",
  },
  {
    numero: 10,
    titre: "Générer la structure",
    skill: null,
    script: "scaffold-harness",
    genre: GENRES.COMMANDE,
    fichiers: ["arborescence cases/<slug>/ + content/cases/<slug>/"],
  },
  {
    numero: 11,
    titre: "Importer/contrôler le corpus",
    skill: "adapter-corpus-onboarding",
    script: "import-source, validate-corpus",
    genre: GENRES.SAISIE,
    fichiers: ["content/cases/<slug>/sources/*.md"],
    note:
      "L'utilisateur convertit et relit ses documents, les amorce avec import-source, puis validate-corpus contrôle le corpus fichier par fichier.",
  },
  {
    numero: 12,
    titre: "Générer/assembler l'application",
    skill: null,
    script: "generate-onboarding-demo (démo) ou branchement config (cas réel)",
    genre: GENRES.AUTO,
    fichiers: ["configs/<slug>.yml (cas)"],
    note:
      "Assembler une application = pointer une config vers un contenu (CDH_CONFIG=<slug>.yml), jamais toucher src/.",
  },
  {
    numero: 13,
    titre: "Exécuter les tests",
    skill: "generer-tests-harnais",
    script: "npm test, validate-guardrails",
    genre: GENRES.COMMANDE,
    fichiers: ["rapport de tests"],
  },
  {
    numero: 14,
    titre: "Ouvrir l'application du cas",
    skill: null,
    script: "npm run dev",
    genre: GENRES.COMMANDE,
    fichiers: ["application sur http://localhost:3010"],
  },
  {
    numero: 15,
    titre: "Produire le rapport de gouvernance",
    skill: "verifier-securite-rgpd",
    script: "build-harness-report",
    genre: GENRES.COMMANDE,
    fichiers: ["cases/<slug>/rapport-gouvernance.md"],
  },
];

if (ETAPES.length !== 15) {
  throw new Error(`Le parcours doit compter 15 étapes (trouvé ${ETAPES.length}).`);
}

/** Retourne l'étape de numéro `n` (1..15), ou undefined. */
export function etape(n) {
  return ETAPES.find((e) => e.numero === n);
}

/**
 * Commande CLI exacte d'une étape « commande » pour un cas donné, ou null si
 * l'étape n'est pas de genre commande.
 */
export function commandeEtape(n, slug) {
  const e = etape(n);
  if (!e || e.genre !== GENRES.COMMANDE) return null;
  return commandePourEtape(n, slug);
}
