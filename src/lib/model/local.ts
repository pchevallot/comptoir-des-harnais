import type { Extrait } from "../retrieval";
import type { ModelProvider } from "./types";

/**
 * Fournisseur « local » — recherche documentaire déterministe.
 *
 * C'est le fournisseur PAR DÉFAUT. Il ne fait AUCUN appel réseau : il compose
 * une réponse uniquement à partir des extraits de sources qui lui sont fournis.
 * Avantages : la démonstration fonctionne hors ligne et sans clé, les tests sont
 * déterministes (mêmes entrées → mêmes sorties), et aucune donnée ne quitte le
 * poste. Ce n'est pas un modèle génératif : c'est une restitution sourcée.
 */
export class LocalProvider implements ModelProvider {
  readonly nom = "local";

  estDisponible(): boolean {
    return true;
  }

  async composer(_question: string, extraits: Extrait[]): Promise<string | null> {
    if (extraits.length === 0) return null;

    const intro =
      "D'après les sources de référence de ce portail, voici les éléments documentaires :";
    const nettoyer = (t: string) => t.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
    const corps = extraits
      .map((e) => `• ${nettoyer(e.passage)} (source : ${e.source.id} — ${e.source.titre})`)
      .join("\n");

    return `${intro}\n\n${corps}`;
  }
}
