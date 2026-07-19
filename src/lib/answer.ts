import { getConfig } from "./config";
import { getSource } from "./content";
import {
  contientFormulationInterdite,
  verifierGardeFous,
} from "./guardrails";
import { journaliser } from "./logging";
import { getProvider, nomModeleAffiche } from "./model";
import { rechercher } from "./retrieval";
import type { ReponseFAQ, Source } from "./types";

/**
 * Moteur de réponse de la FAQ documentaire.
 *
 * Enchaînement (les garde-fous d'abord, jamais délégués au modèle) :
 *   1. Garde-fous : cas individuel / avis juridique ou médical → REFUS.
 *   2. Recherche documentaire dans le registre des sources.
 *   3. Aucune source pertinente → « je ne sais pas » + renvoi (jamais d'invention).
 *   4. Fournisseur absent (mode dégradé) → message explicite.
 *   5. Composition d'une réponse strictement sourcée + mentions obligatoires.
 *
 * Toute réponse porte les mentions systématiques : sources citées, date des
 * sources, statut du harnais, mention d'assistance IA (PRD §6.2, §9.2-9/10).
 */
const RENVOI_DEFAUT = "service des ressources humaines (service RH)";

function mentions(dateSources: string | null) {
  const config = getConfig();
  return {
    modele: nomModeleAffiche(),
    statut: config.harnais.statut,
    dateSources,
    assistanceIA:
      "Réponse assistée par outil, produite uniquement à partir des sources citées. " +
      "Ne vaut pas validation juridique.",
  };
}

function dateLaPlusRecente(sources: Source[]): string | null {
  if (sources.length === 0) return null;
  return sources.map((s) => s.date).sort().at(-1) ?? null;
}

export async function repondre(question: string): Promise<ReponseFAQ> {
  const q = (question ?? "").trim();

  // 1. Garde-fous de premier rang.
  const refus = verifierGardeFous(q);
  if (refus) {
    journaliser({
      evenement: "refus",
      fournisseur: (process.env.MODEL_PROVIDER ?? "local").toLowerCase(),
      statutHarnais: getConfig().harnais.statut,
      sourcesCitees: [],
      motif: refus.motif,
    });
    return {
      issue: "refus",
      texte: refus.message,
      sources: [],
      renvoi: refus.renvoi,
      mentions: mentions(null),
    };
  }

  // 2. Recherche documentaire.
  const extraits = rechercher(q);

  // 3. Hors corpus → « je ne sais pas » explicite + renvoi.
  if (extraits.length === 0) {
    journaliser({
      evenement: "je_sais_pas",
      fournisseur: (process.env.MODEL_PROVIDER ?? "local").toLowerCase(),
      statutHarnais: getConfig().harnais.statut,
      sourcesCitees: [],
    });
    return {
      issue: "je-ne-sais-pas",
      texte:
        "Je ne dispose pas de source dans ce portail pour répondre à cette question. " +
        `Je préfère ne pas improviser : adressez-vous au ${RENVOI_DEFAUT}.`,
      sources: [],
      renvoi: RENVOI_DEFAUT,
      mentions: mentions(null),
    };
  }

  // 4. Fournisseur de modèle.
  const provider = getProvider();
  if (!provider || !provider.estDisponible()) {
    journaliser({
      evenement: "degrade",
      fournisseur: (process.env.MODEL_PROVIDER ?? "none").toLowerCase(),
      statutHarnais: getConfig().harnais.statut,
      sourcesCitees: [],
    });
    return {
      issue: "degrade",
      texte:
        "La réponse assistée est désactivée car aucun fournisseur de modèle n'est configuré. " +
        "Le reste du portail (parcours, fiches, quiz, gouvernance) reste consultable. " +
        "Les sources ci-dessous correspondent à votre question.",
      sources: sourcesUniques(extraits.map((e) => e.source)),
      renvoi: undefined,
      mentions: mentions(dateLaPlusRecente(extraits.map((e) => e.source))),
    };
  }

  // 5. Composition strictement sourcée.
  //    Un échec du fournisseur (réseau, clé invalide, délai) ne doit jamais
  //    faire tomber la requête : on dégrade proprement en affichant les sources.
  const sources = sourcesUniques(extraits.map((e) => e.source));
  let texte: string | null;
  try {
    texte = await provider.composer(q, extraits);
  } catch {
    journaliser({
      evenement: "degrade",
      fournisseur: provider.nom,
      statutHarnais: getConfig().harnais.statut,
      sourcesCitees: sources.map((s) => s.id),
    });
    return {
      issue: "degrade",
      texte:
        "La réponse assistée est momentanément indisponible (le fournisseur de modèle n'a pas pu être joint). " +
        "Le reste du portail reste consultable. Les sources ci-dessous correspondent à votre question.",
      sources,
      renvoi: undefined,
      mentions: mentions(dateLaPlusRecente(sources)),
    };
  }

  if (!texte) {
    return {
      issue: "je-ne-sais-pas",
      texte:
        "Je ne parviens pas à fonder une réponse sur les sources disponibles. " +
        `Adressez-vous au ${RENVOI_DEFAUT}.`,
      sources: [],
      renvoi: RENVOI_DEFAUT,
      mentions: mentions(null),
    };
  }

  // Filet de sécurité en sortie : aucune formulation proscrite.
  const interdite = contientFormulationInterdite(texte);
  const texteFinal = interdite
    ? "D'après les sources de référence de ce portail, consultez les extraits ci-dessous ; " +
      `pour toute portée individuelle, adressez-vous au ${RENVOI_DEFAUT}.`
    : texte;

  journaliser({
    evenement: "appel_modele",
    fournisseur: provider.nom,
    statutHarnais: getConfig().harnais.statut,
    sourcesCitees: sources.map((s) => s.id),
  });

  return {
    issue: "sourcee",
    texte: texteFinal,
    sources,
    renvoi: undefined,
    mentions: mentions(dateLaPlusRecente(sources)),
  };
}

function sourcesUniques(sources: Source[]): Source[] {
  const vues = new Set<string>();
  const out: Source[] = [];
  for (const s of sources) {
    if (!vues.has(s.id)) {
      vues.add(s.id);
      out.push(s);
    }
  }
  return out;
}

/** Résout des identifiants de sources en objets Source (pour l'affichage). */
export function resoudreSources(ids: string[]): Source[] {
  return ids.map(getSource).filter((s): s is Source => Boolean(s));
}
