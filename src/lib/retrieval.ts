import { getSources } from "./content";
import type { Source } from "./types";

/**
 * Recherche documentaire simple dans le corpus (registre des sources).
 * Le corpus V1 est petit (quelques dizaines de documents) : une recherche par
 * mots-clés pondérés suffit, sans base de données ni index externe (PRD §7.2).
 * La recherche ne renvoie QUE des extraits issus des sources du registre :
 * c'est le fondement du sourçage exclusif.
 */

export interface Extrait {
  source: Source;
  passage: string;
  score: number;
}

const STOPWORDS = new Set([
  "le","la","les","un","une","des","de","du","d","l","et","ou","à","a","au","aux",
  "en","dans","par","pour","sur","est","sont","ce","cette","ces","qui","que","quoi",
  "quel","quelle","quels","quelles","je","tu","il","elle","on","nous","vous","ils",
  "elles","mon","ma","mes","son","sa","ses","votre","vos","notre","nos","avec","se",
  "sans","plus","moins","combien","comment","pourquoi","quand","où","ne","pas","y",
  "il","est-ce","puis","peut","peuvent","dois","doit","faire","avoir","être",
]);

export function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function motsCles(texte: string): string[] {
  return normaliser(texte)
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter((m) => m.length > 2 && !STOPWORDS.has(m));
}

/**
 * Racine approximative d'un mot (6 premières lettres), pour tolérer pluriels et
 * variations simples (« labellisé » ~ « labellisées »). Suffisant pour un petit
 * corpus ; aucune dépendance de traitement de langue.
 */
function racine(mot: string): string {
  return mot.length > 6 ? mot.slice(0, 6) : mot;
}

/** Découpe une source en passages (paragraphes non vides). */
function passages(source: Source): string[] {
  return source.contenu
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0 && !p.startsWith("#"));
}

/**
 * Score minimal (nombre de mots-clés distincts retrouvés) pour qu'un extrait
 * soit jugé pertinent. En dessous, on considère la question hors corpus : le
 * moteur répond « je ne sais pas » plutôt que d'improviser (PRD §6.2).
 */
export const SCORE_MINIMAL = 2;

/**
 * Recherche les extraits les plus pertinents pour une question.
 * @returns extraits triés par score décroissant (extraits sous le seuil exclus).
 */
export function rechercher(question: string, limite = 3): Extrait[] {
  const clefs = motsCles(question).map(racine);
  if (clefs.length === 0) return [];
  const clefsUniques = [...new Set(clefs)];

  const resultats: Extrait[] = [];
  for (const source of getSources()) {
    if (source.statut !== "active") continue;
    const titreNorm = normaliser(source.titre);
    for (const passage of passages(source)) {
      const texteNorm = normaliser(passage);
      let score = 0;
      for (const clef of clefsUniques) {
        if (texteNorm.includes(clef)) score += 1;
        else if (titreNorm.includes(clef)) score += 0.5; // rappel via le titre
      }
      if (score >= SCORE_MINIMAL) resultats.push({ source, passage, score });
    }
  }

  return resultats.sort((a, b) => b.score - a.score).slice(0, limite);
}
