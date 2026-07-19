import { LocalProvider } from "./local";
import { AnthropicProvider } from "./anthropic";
import { OpenAiCompatibleProvider } from "./openai-compatible";
import { FOURNISSEURS_OPENAI_COMPATIBLES, getProviderInfo } from "./catalogue";
import type { ModelProvider } from "./types";

export type { ModelProvider } from "./types";

/** Identifiant du fournisseur configuré (MODEL_PROVIDER), normalisé. */
export function providerConfigureId(): string {
  return (process.env.MODEL_PROVIDER ?? "local").trim().toLowerCase();
}

/**
 * Fabrique de fournisseur de modèle, pilotée par MODEL_PROVIDER (.env).
 *   local                       → recherche documentaire locale (défaut, hors ligne)
 *   none                        → aucun fournisseur (FAQ générative désactivée)
 *   anthropic                   → API Anthropic (Claude)
 *   openai|openrouter|mistral|ollama → API compatible OpenAI (chat/completions)
 *
 * Aucun fournisseur n'est codé en dur ailleurs dans l'application : changer de
 * fournisseur = changer la configuration (PRD §6.2, §7.2).
 */
export function getProvider(): ModelProvider | null {
  const id = providerConfigureId();
  if (id === "none") return null;
  if (id === "anthropic") return new AnthropicProvider();
  if ((FOURNISSEURS_OPENAI_COMPATIBLES as readonly string[]).includes(id)) {
    return new OpenAiCompatibleProvider(id as never);
  }
  return new LocalProvider();
}

/**
 * Nom générique du modèle à afficher (mention d'assistance IA).
 * Priorité : MODEL_DISPLAY_NAME, sinon le nom du fournisseur configuré.
 */
export function nomModeleAffiche(): string {
  const explicite = process.env.MODEL_DISPLAY_NAME?.trim();
  if (explicite) return explicite;
  return getProviderInfo(providerConfigureId()).nom;
}
