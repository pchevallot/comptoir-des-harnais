import { LocalProvider } from "./local";
import { AnthropicProvider } from "./anthropic";
import type { ModelProvider } from "./types";

export type { ModelProvider } from "./types";

/**
 * Fabrique de fournisseur de modèle, pilotée par MODEL_PROVIDER (.env).
 *   local      → recherche documentaire locale (défaut, hors ligne)
 *   anthropic  → modèle génératif externe (point de substitution)
 *   none       → aucun fournisseur (mode dégradé : FAQ générative désactivée)
 */
export function getProvider(): ModelProvider | null {
  const choix = (process.env.MODEL_PROVIDER ?? "local").trim().toLowerCase();
  switch (choix) {
    case "none":
      return null;
    case "anthropic":
      return new AnthropicProvider();
    case "local":
    default:
      return new LocalProvider();
  }
}

/** Nom générique du modèle à afficher (mention d'assistance IA). */
export function nomModeleAffiche(): string {
  return process.env.MODEL_DISPLAY_NAME?.trim() || "recherche documentaire locale";
}
