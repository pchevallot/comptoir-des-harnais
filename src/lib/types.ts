/**
 * Types partagés du harnais documentaire.
 * Aucune donnée personnelle réelle ne transite par ces structures :
 * les contenus proviennent de fichiers fictifs marqués comme tels.
 */

export type Classification = "publique" | "interne" | "personnelle" | "sensible";
export type StatutHarnais = "prototype" | "interne" | "production";
export type StatutSource = "active" | "perimee";

/** Une source du registre : un document fictif du corpus de démonstration. */
export interface Source {
  id: string;
  titre: string;
  proprietaire: string; // fonction, jamais une personne réelle
  date: string; // AAAA-MM-JJ, date de version
  statut: StatutSource;
  perimetre: string;
  classification: Classification;
  fictif: boolean;
  /** Texte de la source (corps du document Markdown). */
  contenu: string;
  /** Chemin relatif du fichier, utile aux messages d'erreur. */
  chemin: string;
}

/** Une fiche pédagogique de la bibliothèque. */
export interface Fiche {
  slug: string;
  titre: string;
  resume: string;
  module?: string;
  sources: string[]; // identifiants de sources du registre
  date: string;
  statut: StatutHarnais;
  limites: string; // « Limites de ce document »
  contenu: string; // corps Markdown
  chemin: string;
}

/** Une étape d'un module du parcours nouvel arrivant. */
export interface EtapeParcours {
  titre: string;
  description: string;
  fiche?: string; // slug d'une fiche
}

/** Un module du parcours nouvel arrivant. */
export interface ModuleParcours {
  id: string;
  titre: string;
  objectif: string;
  etapes: EtapeParcours[];
}

/** Une question de quiz pédagogique (valide une lecture, jamais une personne). */
export interface QuestionQuiz {
  id: string;
  question: string;
  options: string[];
  bonne_reponse: number; // index dans options
  explication: string;
  renvoi_fiche?: string; // slug de fiche
  renvoi_source?: string; // id de source
}

/** Résultat d'une interrogation de la FAQ documentaire. */
export type IssueReponse = "sourcee" | "refus" | "je-ne-sais-pas" | "degrade";

export interface ReponseFAQ {
  issue: IssueReponse;
  texte: string;
  sources: Source[]; // sources citées (vide pour refus / je-ne-sais-pas / dégradé)
  renvoi?: string; // fonction vers laquelle renvoyer
  /** Mentions systématiques attachées à toute réponse. */
  mentions: {
    modele: string;
    statut: StatutHarnais;
    dateSources: string | null;
    assistanceIA: string;
  };
}
