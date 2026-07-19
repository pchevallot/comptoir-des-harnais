import type { Extrait } from "../retrieval";
import type { ModelProvider } from "./types";
import { getProviderInfo, type ProviderId } from "./catalogue";

/**
 * Fournisseur générique « compatible OpenAI » — couvre OpenAI, OpenRouter,
 * Mistral et Ollama, qui exposent tous le même point d'entrée
 * `POST {baseUrl}/chat/completions`.
 *
 * Sécurité (PRD §9.2-12) :
 *   - la clé est lue UNIQUEMENT côté serveur (variable d'environnement), jamais
 *     exposée au navigateur ni journalisée ;
 *   - seuls les identifiants de sources sont journalisés (cf. src/lib/logging.ts).
 *
 * Garde-fous (PRD §6.2) : le sourçage exclusif est imposé par l'application (la
 * consigne système ci-dessous), puis re-vérifié en sortie par answer.ts. Les
 * garde-fous ne sont jamais délégués à la seule bonne volonté du modèle.
 *
 * Réversibilité : changer de fournisseur = changer MODEL_PROVIDER / MODEL_BASE_URL
 * / MODEL_NAME. Aucun contenu n'est perdu ; sans fournisseur, le mode « local »
 * reste disponible hors ligne.
 */

const CONSIGNE_SYSTEME =
  "Tu es l'assistant documentaire d'un portail d'accueil de collectivité. " +
  "Réponds UNIQUEMENT à partir des extraits de sources fournis ci-dessous. " +
  "Si les extraits ne suffisent pas, dis explicitement que tu ne sais pas et " +
  "renvoie vers le service des ressources humaines. N'invente jamais de fait, de " +
  "chiffre, de droit ou de référence. Ne traite aucun cas individuel. Cite les " +
  "identifiants de sources (par exemple SRC-003) que tu utilises. Réponds en " +
  "français, de façon sobre et concise.";

const DELAI_MS = 30_000;

export class OpenAiCompatibleProvider implements ModelProvider {
  readonly nom: ProviderId;
  private readonly baseUrl: string;
  private readonly modele: string;
  private readonly clef: string | undefined;
  private readonly clefRequise: boolean;

  constructor(id: ProviderId) {
    const info = getProviderInfo(id);
    this.nom = info.id;
    this.clefRequise = info.clefRequise;
    this.baseUrl = (process.env.MODEL_BASE_URL?.trim() || info.baseUrlDefaut || "").replace(
      /\/+$/,
      "",
    );
    this.modele = process.env.MODEL_NAME?.trim() || info.modeleExemple || "";
    this.clef = process.env.MODEL_API_KEY?.trim() || undefined;
  }

  estDisponible(): boolean {
    if (!this.baseUrl || !this.modele) return false;
    if (this.clefRequise && !this.clef) return false;
    return true;
  }

  async composer(question: string, extraits: Extrait[]): Promise<string | null> {
    if (extraits.length === 0) return null;
    if (!this.estDisponible()) {
      throw new Error(
        `Fournisseur « ${this.nom} » sélectionné mais configuration incomplète ` +
          "(MODEL_BASE_URL, MODEL_NAME ou MODEL_API_KEY). " +
          "Complétez .env.local, ou repassez MODEL_PROVIDER=local.",
      );
    }

    const contexte = extraits
      .map((e) => `[${e.source.id} — ${e.source.titre}] ${e.passage}`)
      .join("\n\n");

    const controleur = new AbortController();
    const minuteur = setTimeout(() => controleur.abort(), DELAI_MS);
    try {
      const entetes: Record<string, string> = { "Content-Type": "application/json" };
      if (this.clef) entetes["Authorization"] = `Bearer ${this.clef}`;

      const reponse = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: entetes,
        body: JSON.stringify({
          model: this.modele,
          temperature: 0,
          messages: [
            { role: "system", content: CONSIGNE_SYSTEME },
            {
              role: "user",
              content: `Question : ${question}\n\nExtraits de sources autorisés :\n${contexte}`,
            },
          ],
        }),
        signal: controleur.signal,
      });

      if (!reponse.ok) {
        // On ne journalise pas le corps (peut contenir des détails fournisseur).
        throw new Error(`Réponse du fournisseur « ${this.nom} » : HTTP ${reponse.status}.`);
      }

      const data = (await reponse.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const texte = data.choices?.[0]?.message?.content?.trim();
      return texte && texte.length > 0 ? texte : null;
    } finally {
      clearTimeout(minuteur);
    }
  }
}
