import type { Extrait } from "../retrieval";

/**
 * Interface modèle substituable.
 *
 * L'appel au modèle est isolé derrière cette interface unique (PRD §6.2, §7.2).
 * Changer de fournisseur = fournir une autre implémentation de ModelProvider et
 * ajuster la configuration (.env) — aucun fournisseur n'est codé en dur ailleurs
 * dans l'application. Les garde-fous et le sourçage restent dans l'application,
 * jamais délégués au modèle.
 */
export interface ModelProvider {
  /** Nom du fournisseur (journalisation, diagnostic). */
  readonly nom: string;

  /** true si le fournisseur peut répondre (clé présente, etc.). */
  estDisponible(): boolean;

  /**
   * Compose une réponse strictement à partir des extraits fournis.
   * Le contrat impose de NE PAS inventer d'information hors extraits.
   * @returns le texte de la réponse, ou null si aucune réponse fondée.
   */
  composer(question: string, extraits: Extrait[]): Promise<string | null>;
}
