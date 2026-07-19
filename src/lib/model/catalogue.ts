/**
 * Catalogue des fournisseurs de modèle — source unique de vérité.
 *
 * Ce catalogue décrit CHAQUE fournisseur possible (identité, besoin de clé,
 * appels réseau, URL par défaut, note de souveraineté, exemple de configuration).
 * Il est utilisé par trois endroits, sans duplication :
 *   - la fabrique de fournisseur (src/lib/model/index.ts) ;
 *   - le diagnostic de configuration (src/lib/model/diagnostic.ts) ;
 *   - la page pédagogique /configuration-ia.
 *
 * RÈGLE DE SÉCURITÉ (PRD §9.2-12) : ce fichier ne contient AUCUN secret et ne
 * lit AUCUNE variable d'environnement. Il ne décrit que des métadonnées
 * publiques. La lecture des clés se fait uniquement côté serveur, dans les
 * fournisseurs et le diagnostic, et jamais la VALEUR d'une clé n'est exposée.
 */

export type ProviderId =
  | "local"
  | "none"
  | "anthropic"
  | "openai"
  | "openrouter"
  | "mistral"
  | "ollama";

export interface ProviderInfo {
  /** Identifiant technique (valeur de MODEL_PROVIDER). */
  readonly id: ProviderId;
  /** Nom lisible affiché à l'écran. */
  readonly nom: string;
  /** Résumé en une phrase, langage métier. */
  readonly resume: string;
  /** true si le fournisseur émet des appels réseau sortants. */
  readonly reseau: boolean;
  /** true si une clé d'API est nécessaire pour fonctionner. */
  readonly clefRequise: boolean;
  /** URL de base par défaut (non secrète), ou null si sans objet. */
  readonly baseUrlDefaut: string | null;
  /** Exemple d'identifiant de modèle à renseigner dans MODEL_NAME. */
  readonly modeleExemple: string | null;
  /** Note de souveraineté / RGPD en langage simple. */
  readonly souverainete: string;
  /**
   * Bloc d'exemple pour .env.local (sans valeur secrète réelle : la clé est
   * représentée par un marqueur explicite à remplacer localement).
   */
  readonly exempleEnv: string;
}

/** Marqueur non secret utilisé dans les exemples (jamais une vraie clé). */
const CLEF = "VOTRE_CLE_ICI"; // ne jamais commiter de vraie clé — cf. .gitignore

export const PROVIDERS: readonly ProviderInfo[] = [
  {
    id: "local",
    nom: "Local (recherche documentaire)",
    resume:
      "Restitution sourcée déterministe, hors ligne. Aucun appel réseau, aucune clé. Mode par défaut, utilisé pour la démonstration et les tests.",
    reseau: false,
    clefRequise: false,
    baseUrlDefaut: null,
    modeleExemple: null,
    souverainete:
      "Souveraineté maximale : aucune donnée ne quitte le poste. Rien n'est envoyé à un tiers.",
    exempleEnv: ["MODEL_PROVIDER=local", "MODEL_DISPLAY_NAME=recherche documentaire locale"].join(
      "\n",
    ),
  },
  {
    id: "ollama",
    nom: "Ollama (modèle local)",
    resume:
      "Modèle d'IA générative exécuté sur votre propre machine ou serveur via Ollama. Appels réseau uniquement vers votre installation locale, aucune clé.",
    reseau: true,
    clefRequise: false,
    baseUrlDefaut: "http://localhost:11434/v1",
    modeleExemple: "llama3.1",
    souverainete:
      "Souveraineté forte : le modèle tourne chez vous (poste ou serveur interne). Aucune donnée n'est envoyée à un fournisseur externe, à condition que l'URL reste interne.",
    exempleEnv: [
      "MODEL_PROVIDER=ollama",
      "MODEL_DISPLAY_NAME=modèle local (Ollama)",
      "MODEL_BASE_URL=http://localhost:11434/v1",
      "MODEL_NAME=llama3.1",
    ].join("\n"),
  },
  {
    id: "anthropic",
    nom: "Anthropic (Claude)",
    resume:
      "Modèle d'IA générative Claude, appelé via l'API Anthropic. Nécessite une clé et des appels réseau vers le fournisseur.",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://api.anthropic.com",
    modeleExemple: "claude-3-5-haiku-latest",
    souverainete:
      "Traitement chez un fournisseur tiers : à instruire avec le DPO (localisation des traitements, réutilisation des données, clauses contractuelles). Ne pas transmettre de données personnelles ou sensibles.",
    exempleEnv: [
      "MODEL_PROVIDER=anthropic",
      "MODEL_DISPLAY_NAME=Claude (Anthropic)",
      `MODEL_API_KEY=${CLEF}`,
      "MODEL_NAME=claude-3-5-haiku-latest",
    ].join("\n"),
  },
  {
    id: "openai",
    nom: "OpenAI",
    resume:
      "Modèle d'IA générative via l'API OpenAI. Nécessite une clé et des appels réseau vers le fournisseur.",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://api.openai.com/v1",
    modeleExemple: "gpt-4o-mini",
    souverainete:
      "Traitement chez un fournisseur tiers hors UE par défaut : à instruire avec le DPO. Ne pas transmettre de données personnelles ou sensibles.",
    exempleEnv: [
      "MODEL_PROVIDER=openai",
      "MODEL_DISPLAY_NAME=modèle génératif (OpenAI)",
      `MODEL_API_KEY=${CLEF}`,
      "MODEL_NAME=gpt-4o-mini",
    ].join("\n"),
  },
  {
    id: "openrouter",
    nom: "OpenRouter",
    resume:
      "Passerelle vers de nombreux modèles via une API compatible OpenAI. Nécessite une clé et des appels réseau ; le modèle réel dépend de votre choix.",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://openrouter.ai/api/v1",
    modeleExemple: "mistralai/mistral-small",
    souverainete:
      "Intermédiaire qui route vers différents fournisseurs : la localisation réelle du traitement dépend du modèle choisi. À instruire avec le DPO.",
    exempleEnv: [
      "MODEL_PROVIDER=openrouter",
      "MODEL_DISPLAY_NAME=modèle génératif (via OpenRouter)",
      "MODEL_BASE_URL=https://openrouter.ai/api/v1",
      `MODEL_API_KEY=${CLEF}`,
      "MODEL_NAME=mistralai/mistral-small",
    ].join("\n"),
  },
  {
    id: "mistral",
    nom: "Mistral AI",
    resume:
      "Modèle d'IA générative via l'API Mistral (compatible OpenAI). Nécessite une clé et des appels réseau vers le fournisseur.",
    reseau: true,
    clefRequise: true,
    baseUrlDefaut: "https://api.mistral.ai/v1",
    modeleExemple: "mistral-small-latest",
    souverainete:
      "Fournisseur européen : peut faciliter certaines exigences de localisation, mais reste un tiers à instruire avec le DPO. Ne pas transmettre de données personnelles ou sensibles.",
    exempleEnv: [
      "MODEL_PROVIDER=mistral",
      "MODEL_DISPLAY_NAME=modèle génératif (Mistral AI)",
      `MODEL_API_KEY=${CLEF}`,
      "MODEL_NAME=mistral-small-latest",
    ].join("\n"),
  },
  {
    id: "none",
    nom: "Désactivé (mode dégradé)",
    resume:
      "FAQ générative désactivée. Le reste du portail (parcours, fiches, quiz, gouvernance) reste pleinement utilisable ; les garde-fous restent actifs.",
    reseau: false,
    clefRequise: false,
    baseUrlDefaut: null,
    modeleExemple: null,
    souverainete: "Aucun appel réseau. La FAQ affiche les sources sans réponse rédigée.",
    exempleEnv: ["MODEL_PROVIDER=none"].join("\n"),
  },
];

const PAR_ID = new Map<ProviderId, ProviderInfo>(PROVIDERS.map((p) => [p.id, p]));

/** Retourne les métadonnées d'un fournisseur, ou celles de « local » si inconnu. */
export function getProviderInfo(id: string): ProviderInfo {
  const cle = (id ?? "").trim().toLowerCase() as ProviderId;
  return PAR_ID.get(cle) ?? PAR_ID.get("local")!;
}

/** Les fournisseurs qui parlent le protocole compatible OpenAI (/chat/completions). */
export const FOURNISSEURS_OPENAI_COMPATIBLES: readonly ProviderId[] = [
  "openai",
  "openrouter",
  "mistral",
  "ollama",
];
