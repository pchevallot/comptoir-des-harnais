import { providerConfigureId, nomModeleAffiche } from "./index";
import { getProviderInfo, type ProviderInfo } from "./catalogue";

/**
 * Diagnostic de configuration du fournisseur de modèle.
 *
 * RÈGLE ABSOLUE (PRD §9.2-12) : cette fonction ne renvoie JAMAIS la valeur d'une
 * clé. Elle indique seulement si une clé est *présente* (booléen). Elle lit
 * `process.env` et ne doit être appelée que côté serveur (composants serveur,
 * route handlers) — jamais dans un composant « use client ». Cette contrainte
 * est vérifiée par un test (tests/structure/configuration-ia.test.ts). Les
 * valeurs renvoyées (base URL, nom de modèle, booléens) ne sont pas des secrets
 * et peuvent être affichées.
 */

export type StatutConfiguration =
  | "hors-ligne" // local : prêt, aucun appel réseau
  | "pret" // fournisseur configuré et opérationnel
  | "cle-manquante" // fournisseur réseau sélectionné mais clé absente
  | "config-incomplete" // base URL ou nom de modèle manquant
  | "desactive"; // none : FAQ générative désactivée

export interface DiagnosticConfiguration {
  readonly info: ProviderInfo;
  readonly nomAffiche: string;
  readonly reseau: boolean;
  readonly clefRequise: boolean;
  /** true si une clé est renseignée — JAMAIS la valeur. */
  readonly clefPresente: boolean;
  /** URL de base effective (non secrète), ou null. */
  readonly baseUrl: string | null;
  /** Identifiant de modèle configuré (non secret), ou null. */
  readonly modele: string | null;
  readonly statut: StatutConfiguration;
  /** Message pédagogique décrivant l'état courant. */
  readonly message: string;
}

/** Lit la présence (jamais la valeur) d'une clé de modèle dans l'environnement. */
function clefPresente(): boolean {
  return Boolean(
    (process.env.MODEL_API_KEY?.trim() || process.env.ANTHROPIC_API_KEY?.trim()) ?? "",
  );
}

export function diagnostiquerConfiguration(): DiagnosticConfiguration {
  const id = providerConfigureId();
  const info = getProviderInfo(id);
  const presente = clefPresente();
  const baseUrl =
    process.env.MODEL_BASE_URL?.trim() || info.baseUrlDefaut || null;
  const modele = process.env.MODEL_NAME?.trim() || info.modeleExemple || null;

  let statut: StatutConfiguration;
  let message: string;

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
