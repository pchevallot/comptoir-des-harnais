/**
 * Garde-fous de premier rang.
 *
 * Ces règles s'exécutent AVANT tout appel au moteur de recherche ou à un
 * modèle : elles ne sont jamais déléguées à la « bonne volonté » d'un modèle
 * (cf. PRD §6.2). Elles font respecter le périmètre documentaire du harnais :
 * aucune réponse sur un cas individuel, aucun avis juridique ou médical,
 * aucune promesse de droit. C'est ce qui distingue le harnais d'un SIRH.
 */

export type MotifRefus =
  | "cas_individuel"
  | "avis_juridique"
  | "avis_medical"
  | "promesse_droit";

export interface Refus {
  refuse: true;
  motif: MotifRefus;
  renvoi: string;
  message: string;
}

/** Fonctions vers lesquelles renvoyer selon le motif (jamais une personne). */
const RENVOI: Record<MotifRefus, string> = {
  cas_individuel: "service des ressources humaines (service RH)",
  avis_juridique: "service juridique",
  avis_medical: "médecine du travail ou service RH",
  promesse_droit: "service des ressources humaines (service RH)",
};

/**
 * Détecte une question portant sur une personne nommée ou identifiable, ou sur
 * une situation individuelle. Volontairement prudent : en cas de doute sur un
 * cas individuel, on refuse (le refus renvoie vers l'humain, ce n'est pas une
 * panne mais la règle centrale du harnais).
 */
// Civilité explicitement en deux casses (pas de drapeau « i » global, afin de
// conserver l'exigence d'un nom propre capitalisé juste après la civilité).
const CIVILITE_NOM =
  /\b([Mm]adame|[Mm]me|[Mm]onsieur|[Mm]lle|[Mm]ademoiselle|[Mm]\.)\s+(?!le\b|la\b|les\b|du\b|de\b|d'|des\b|maire\b|pr[ée]sident|directeur\b|directrice\b|responsable\b|chef\b|agent\b)[A-ZÉÈÀÂÎÔÛ][\p{L}-]+/u;

const POSSESSIF_INDIVIDUEL =
  /\b(mon|ma|mes|son|sa|ses|leur|leurs)\s+(dossier|situation|cas|r[ée]mun[ée]ration|salaire|paie|paye|contrat|avancement|notation|sanction|disciplinaire|carri[èe]re|anciennet[ée]|prime|indemnit[ée]s?|cong[ée]s?\s+(?:pay[ée]s?|maladie)|arr[êe]t)\b/iu;

const CAS_NOMME =
  /\b(l'agent|cet?\s+agent|cette\s+personne|un\s+agent\s+(nomm[ée]|pr[ée]cis)|le\s+cas\s+(de|d'|individuel|personnel))\b/iu;

const AVIS_JURIDIQUE =
  /\b(avis|conseil|question)\s+juridiques?|est-?ce\s+(que\s+c'est\s+|)l[ée]gal|ill[ée]gal|attaquer\s+(en\s+justice|au\s+tribunal|aux?\s+prud')|porter\s+plainte|contentieux|saisir\s+le\s+tribunal|puis-?je\s+contester/iu;

const AVIS_MEDICAL =
  /\b(diagnostic|sympt[ôo]mes?|mon\s+m[ée]decin|ma\s+sant[ée]|inaptitude\s+m[ée]dicale|avis\s+m[ée]dical)\b/iu;

/**
 * Analyse une question. Retourne un refus le cas échéant, sinon null (la
 * question peut alors être traitée par le moteur documentaire sourcé).
 */
export function verifierGardeFous(question: string): Refus | null {
  const q = question.normalize("NFC");

  if (AVIS_JURIDIQUE.test(q)) return construireRefus("avis_juridique");
  if (AVIS_MEDICAL.test(q)) return construireRefus("avis_medical");
  if (CIVILITE_NOM.test(q) || POSSESSIF_INDIVIDUEL.test(q) || CAS_NOMME.test(q)) {
    return construireRefus("cas_individuel");
  }
  return null;
}

function construireRefus(motif: MotifRefus): Refus {
  const renvoi = RENVOI[motif];
  const messages: Record<MotifRefus, string> = {
    cas_individuel:
      `Ce portail est un outil documentaire : il n'examine aucune situation individuelle ` +
      `et ne se prononce jamais sur le cas d'une personne nommée ou identifiable. ` +
      `Pour une question portant sur votre situation ou celle d'un agent, adressez-vous au ${renvoi}.`,
    avis_juridique:
      `Ce portail ne rend pas d'avis juridique et ne se substitue pas à un juriste. ` +
      `Pour une analyse juridique, adressez-vous au ${renvoi}.`,
    avis_medical:
      `Ce portail ne rend aucun avis médical ni d'aptitude. ` +
      `Pour une question de santé au travail, adressez-vous à la ${renvoi}.`,
    promesse_droit:
      `Ce portail informe à partir de sources documentaires ; il ne garantit ni ne crée ` +
      `de droit individuel. Pour faire valoir un droit, adressez-vous au ${renvoi}.`,
  };
  return { refuse: true, motif, renvoi, message: messages[motif] };
}

/**
 * Formulations proscrites dans toute réponse générée (promesses de droit,
 * évaluation d'une personne). Sert de filet de sécurité en sortie du moteur,
 * en complément du sourçage exclusif. Utilisé aussi par les tests.
 */
export const FORMULATIONS_INTERDITES: RegExp[] = [
  /\bje\s+vous\s+garantis\b/iu,
  /\bvous\s+avez\s+(donc\s+)?droit\s+à\b/iu,
  /\bvous\s+b[ée]n[ée]ficiez\s+automatiquement\b/iu,
  /\bc'est\s+(tout\s+à\s+fait\s+)?l[ée]gal\b/iu,
  /\bconforme\s+(au\s+rgpd|à\s+l'ai\s+act|par\s+d[ée]faut)\b/iu,
];

/** Vérifie qu'un texte ne contient aucune formulation proscrite. */
export function contientFormulationInterdite(texte: string): RegExp | null {
  return FORMULATIONS_INTERDITES.find((r) => r.test(texte)) ?? null;
}
