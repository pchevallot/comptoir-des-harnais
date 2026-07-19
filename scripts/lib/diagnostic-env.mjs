/**
 * Diagnostic de configuration IA côté scripts — miroir `.mjs` de
 * `src/lib/model/diagnostic.ts` (+ les métadonnées de catalogue nécessaires).
 *
 * Pourquoi une copie ? L'import direct du module TS depuis un `.mjs` impose une
 * transpilation ; le repli (extraction en `.mjs` partagé) est arbitré par la
 * spec §5. La logique et les métadonnées reproduites ici sont un miroir exact
 * de `src/lib/model/{index,catalogue,diagnostic}.ts` ; un test de non-divergence
 * est prévu au Lot 7.
 *
 * RÈGLE ABSOLUE (PRD §9.2-12) : ne renvoie JAMAIS la valeur d'une clé, seulement
 * sa présence (booléen). Les valeurs renvoyées (base URL, nom de modèle,
 * booléens) ne sont pas des secrets.
 */

/**
 * Catalogue des fournisseurs — sous-ensemble des métadonnées de
 * `src/lib/model/catalogue.ts` utile au diagnostic (aucun secret, aucune lecture
 * d'environnement).
 */
export const CATALOGUE = [
  {
    id: "local",
    nom: "Local (recherche documentaire)",
    reseau: false,
    clefRequise: false,
    baseUrlDefaut: null,
    modeleExemple: null,
    souverainete:
      "Souveraineté maximale : aucune donnée ne quitte le poste. Rien n'est envoyé à un tiers.",
  },
  {
    id: "ollama",
    nom: "Ollama (modèle local)",
    reseau: true,
    clefRequise: false,
    baseUrlDefaut: "http://localhost:11434/v1",
    modeleExemple: "llama3.1",
    souverainete:
      "Souveraineté forte : le modèle tourne chez vous. Aucune donnée n'est envoyée à un fournisseur externe, à condition que l'URL reste interne.",
  },
  {
    id: "anthropic",
    nom: "Anthropic (Claude)",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://api.anthropic.com",
    modeleExemple: "claude-3-5-haiku-latest",
    souverainete:
      "Traitement chez un fournisseur tiers : à instruire avec le DPO. Ne pas transmettre de données personnelles ou sensibles.",
  },
  {
    id: "openai",
    nom: "OpenAI",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://api.openai.com/v1",
    modeleExemple: "gpt-4o-mini",
    souverainete:
      "Traitement chez un fournisseur tiers hors UE par défaut : à instruire avec le DPO. Ne pas transmettre de données personnelles ou sensibles.",
  },
  {
    id: "openrouter",
    nom: "OpenRouter",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://openrouter.ai/api/v1",
    modeleExemple: "mistralai/mistral-small",
    souverainete:
      "Intermédiaire qui route vers différents fournisseurs : la localisation réelle du traitement dépend du modèle choisi. À instruire avec le DPO.",
  },
  {
    id: "mistral",
    nom: "Mistral AI",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://api.mistral.ai/v1",
    modeleExemple: "mistral-small-latest",
    souverainete:
      "Fournisseur européen : peut faciliter certaines exigences de localisation, mais reste un tiers à instruire avec le DPO.",
  },
  {
    id: "none",
    nom: "Désactivé (mode dégradé)",
    reseau: false,
    clefRequise: false,
    baseUrlDefaut: null,
    modeleExemple: null,
    souverainete: "Aucun appel réseau. La FAQ affiche les sources sans réponse rédigée.",
  },
];

const PAR_ID = new Map(CATALOGUE.map((p) => [p.id, p]));

/** Métadonnées d'un fournisseur, ou celles de « local » si inconnu. */
export function getProviderInfo(id) {
  const cle = (id ?? "").trim().toLowerCase();
  return PAR_ID.get(cle) ?? PAR_ID.get("local");
}

/** Identifiant du fournisseur configuré (MODEL_PROVIDER), normalisé. */
export function providerConfigureId() {
  return (process.env.MODEL_PROVIDER ?? "local").trim().toLowerCase();
}

/** Nom générique du modèle à afficher (jamais une clé). */
export function nomModeleAffiche() {
  const explicite = process.env.MODEL_DISPLAY_NAME?.trim();
  if (explicite) return explicite;
  return getProviderInfo(providerConfigureId()).nom;
}

/** Présence (jamais la valeur) d'une clé de modèle dans l'environnement. */
function clefPresente() {
  return Boolean((process.env.MODEL_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim()) ?? "");
}

/**
 * Diagnostique la configuration IA depuis `process.env`. Ne renvoie jamais la
 * valeur d'une clé. Statuts : hors-ligne / pret / cle-manquante /
 * config-incomplete / desactive.
 * @returns {{ info: object, nomAffiche: string, reseau: boolean, clefRequise: boolean, clefPresente: boolean, baseUrl: string|null, modele: string|null, statut: string, message: string }}
 */
export function diagnostiquerConfiguration() {
  const id = providerConfigureId();
  const info = getProviderInfo(id);
  const presente = clefPresente();
  const baseUrl = process.env.MODEL_BASE_URL?.trim() || info.baseUrlDefaut || null;
  const modele = process.env.MODEL_NAME?.trim() || info.modeleExemple || null;

  let statut;
  let message;

  if (info.id === "local") {
    statut = "hors-ligne";
    message =
      "Mode local actif : la FAQ répond hors ligne, sans clé et sans appel réseau. " +
      "Aucune donnée ne quitte le poste.";
  } else if (info.id === "none") {
    statut = "desactive";
    message =
      "FAQ générative désactivée. Le reste du portail reste consultable ; les garde-fous restent actifs.";
  } else if (info.clefRequise && !presente) {
    statut = "cle-manquante";
    message =
      `Fournisseur « ${info.nom} » sélectionné, mais aucune clé n'est renseignée dans l'environnement serveur. ` +
      "Renseignez MODEL_API_KEY dans .env.local (jamais dans le dépôt), ou repassez en mode local.";
  } else if (!baseUrl || !modele) {
    statut = "config-incomplete";
    message =
      `Fournisseur « ${info.nom} » sélectionné, mais MODEL_BASE_URL ou MODEL_NAME manque. ` +
      "Complétez .env.local.";
  } else {
    statut = "pret";
    message = `Fournisseur « ${info.nom} » configuré et prêt. Les appels sont émis côté serveur uniquement.`;
  }

  return {
    info,
    nomAffiche: nomModeleAffiche(),
    reseau: info.reseau,
    clefRequise: info.clefRequise,
    clefPresente: presente,
    baseUrl,
    modele,
    statut,
    message,
  };
}
