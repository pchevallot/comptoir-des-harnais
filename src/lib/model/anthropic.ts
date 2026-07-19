import type { Extrait } from "../retrieval";
import type { ModelProvider } from "./types";

/**
 * Point de substitution documenté — fournisseur de modèle génératif externe.
 *
 * Cette implémentation illustre COMMENT brancher un modèle d'IA générative
 * externe derrière l'interface substituable, sans coder le fournisseur en dur
 * dans le reste de l'application. Elle n'est active que si MODEL_PROVIDER=anthropic
 * ET qu'une clé est présente dans l'environnement.
 *
 * Sécurité : la clé est lue UNIQUEMENT côté serveur (variable d'environnement),
 * jamais exposée au navigateur. Aucune source interne n'est journalisée, seuls
 * les identifiants de sources le sont (cf. src/lib/logging.ts).
 *
 * Note V1 : l'appel réseau réel n'est pas exécuté ici (le dépôt de démonstration
 * fonctionne hors ligne avec le fournisseur « local »). Pour l'activer, remplacez
 * le corps de composer() par l'appel HTTP au fournisseur de votre choix, en
 * conservant impérativement la consigne « répondre uniquement à partir des
 * extraits fournis, citer les sources, ne jamais inventer ».
 */
export class AnthropicProvider implements ModelProvider {
  readonly nom = "anthropic";
  private readonly cle: string | undefined;

  constructor() {
    this.cle = process.env.ANTHROPIC_API_KEY?.trim() || undefined;
  }

  estDisponible(): boolean {
    return Boolean(this.cle);
  }

  async composer(_question: string, extraits: Extrait[]): Promise<string | null> {
    if (!this.estDisponible()) {
      throw new Error(
        "Fournisseur « anthropic » sélectionné mais ANTHROPIC_API_KEY absente. " +
          "Renseignez la clé dans .env, ou repassez MODEL_PROVIDER=local.",
      );
    }
    if (extraits.length === 0) return null;

    // Point d'intégration : construire le message avec la consigne de sourçage
    // exclusif, appeler le fournisseur, retourner le texte. Laissé non câblé en
    // V1 pour garantir un dépôt fonctionnel hors ligne (cf. en-tête de fichier).
    throw new Error(
      "Appel au fournisseur externe non câblé dans la démonstration V1. " +
        "Voir src/lib/model/anthropic.ts pour le point d'intégration.",
    );
  }
}
