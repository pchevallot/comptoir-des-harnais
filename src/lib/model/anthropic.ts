import type { Extrait } from "../retrieval";
import type { ModelProvider } from "./types";
import { getProviderInfo } from "./catalogue";

/**
 * Fournisseur Anthropic (Claude) — API Messages (`POST {baseUrl}/v1/messages`).
 *
 * Sécurité (PRD §9.2-12) :
 *   - la clé est lue UNIQUEMENT côté serveur (variable d'environnement), jamais
 *     exposée au navigateur ni journalisée ;
 *   - seuls les identifiants de sources sont journalisés (cf. src/lib/logging.ts).
 *
 * Garde-fous (PRD §6.2) : le sourçage exclusif est imposé par l'application (la
 * consigne système ci-dessous), puis re-vérifié en sortie par answer.ts.
 *
 * Compatibilité : la clé peut être fournie via MODEL_API_KEY (générique) ou via
 * ANTHROPIC_API_KEY (spécifique), au choix de l'exploitant.
 */

const CONSIGNE_SYSTEME =
  "Tu es l'assistant documentaire d'un portail d'accueil de collectivité. " +
  "Réponds UNIQUEMENT à partir des extraits de sources fournis. Si les extraits " +
  "ne suffisent pas, dis explicitement que tu ne sais pas et renvoie vers le " +
  "service des ressources humaines. N'invente jamais de fait, de chiffre, de " +
  "droit ou de référence. Ne traite aucun cas individuel. Cite les identifiants " +
  "de sources (par exemple SRC-003) que tu utilises. Réponds en français, sobrement.";

const VERSION_API = "2023-06-01";
const DELAI_MS = 30_000;

export class AnthropicProvider implements ModelProvider {
  readonly nom = "anthropic";
  private readonly baseUrl: string;
  private readonly modele: string;
  private readonly clef: string | undefined;

  constructor() {
    const info = getProviderInfo("anthropic");
    this.baseUrl = (process.env.MODEL_BASE_URL?.trim() || info.baseUrlDefaut || "").replace(
      /\/+$/,
      "",
    );
    this.modele = process.env.MODEL_NAME?.trim() || info.modeleExemple || "";
    this.clef =
      process.env.MODEL_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim() || undefined;
  }

  estDisponible(): boolean {
    return Boolean(this.clef && this.baseUrl && this.modele);
  }

  async composer(question: string, extraits: Extrait[]): Promise<string | null> {
    if (extraits.length === 0) return null;
    if (!this.estDisponible()) {
      throw new Error(
        "Fournisseur « anthropic » sélectionné mais configuration incomplète " +
          "(MODEL_API_KEY / ANTHROPIC_API_KEY, MODEL_NAME). " +
          "Complétez .env.local, ou repassez MODEL_PROVIDER=local.",
      );
    }

    const contexte = extraits
      .map((e) => `[${e.source.id} — ${e.source.titre}] ${e.passage}`)
      .join("\n\n");

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), DELAI_MS);
    try {
      const reponse = await fetch(`${this.baseUrl}/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.clef as string,
          "anthropic-version": VERSION_API,
        },
        body: JSON.stringify({
          model: this.modele,
          max_tokens: 1024,
          temperature: 0,
          system: CONSIGNE_SYSTEME,
          messages: [
            {
              role: "user",
              content: `Question : ${question}\n\nExtraits de sources autorisés :\n${contexte}`,
            },
          ],
        }),
        signal: controleur.signal,
      });

      if (!reponse.ok) {
        throw new Error(`Réponse du fournisseur « anthropic » : HTTP ${reponse.status}.`);
      }

      const data = (await reponse.json()) as { content?: { type?: string; text?: string }[] };
      const texte = data.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("")
        .trim();
      return texte && texte.length > 0 ? texte : null;
    } finally {
      clearTimeout(minuteur);
    }
  }
}
