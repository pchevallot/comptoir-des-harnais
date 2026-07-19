import fs from "node:fs";
import path from "node:path";
import { LOGS_DIR } from "./paths";

/**
 * Journalisation locale et sobre (PRD §9.2-13).
 *
 * Règle stricte : les journaux ne contiennent JAMAIS le contenu des sources
 * internes ni le texte des réponses — uniquement des métadonnées (date, harnais,
 * identifiants de sources, résultat). Objectif : traçabilité sans fuite.
 *
 * En environnement de test (VITEST) ou si l'écriture échoue, la journalisation
 * est silencieuse et n'interrompt jamais le service.
 */
export interface EntreeJournal {
  horodatage: string;
  evenement: "appel_modele" | "refus" | "je_sais_pas" | "degrade";
  fournisseur: string;
  statutHarnais: string;
  sourcesCitees: string[]; // identifiants uniquement, jamais le contenu
  motif?: string;
}

export function journaliser(entree: Omit<EntreeJournal, "horodatage">): void {
  if (process.env.VITEST) return;
  try {
    if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });
    const ligne =
      JSON.stringify({ horodatage: new Date().toISOString(), ...entree }) + "\n";
    fs.appendFileSync(path.join(LOGS_DIR, "appels.log.jsonl"), ligne, "utf8");
  } catch {
    // La journalisation ne doit jamais casser l'application.
  }
}
