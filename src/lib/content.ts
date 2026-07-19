import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import {
  CONTENT_DIR,
  FICHES_DIR,
  GOUVERNANCE_DIR,
  PARCOURS_DIR,
  QUIZ_DIR,
  SOURCES_DIR,
} from "./paths";
import type {
  Fiche,
  ModuleParcours,
  QuestionQuiz,
  Source,
  StatutHarnais,
} from "./types";

/**
 * Chargement des contenus métier depuis content/demo-onboarding-rh/.
 * Tous les contenus sont fictifs (cf. marquage « données fictives »). Le code
 * ne modifie jamais ces fichiers : ils sont le territoire des non-techniciens.
 */

function lireMd(dossier: string): { data: Record<string, unknown>; content: string; fichier: string }[] {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dossier, f), "utf8"));
      return { data, content: content.trim(), fichier: f };
    });
}

function exigerChamp<T>(valeur: T | undefined, champ: string, fichier: string): T {
  if (valeur === undefined || valeur === null || valeur === "") {
    throw new Error(`Contenu incomplet : champ « ${champ} » manquant dans ${fichier}.`);
  }
  return valeur;
}

// ---------------------------------------------------------------------------
// Sources (registre)
// ---------------------------------------------------------------------------

let sourcesCache: Source[] | null = null;

export function getSources(): Source[] {
  if (sourcesCache) return sourcesCache;
  const chemin = SOURCES_DIR;
  sourcesCache = lireMd(chemin).map(({ data, content, fichier }) => {
    const relatif = path.join("content/demo-onboarding-rh/sources", fichier);
    return {
      id: exigerChamp(data.id as string, "id", relatif),
      titre: exigerChamp(data.titre as string, "titre", relatif),
      proprietaire: exigerChamp(data.proprietaire as string, "proprietaire", relatif),
      date: exigerChamp(data.date as string, "date", relatif),
      statut: (data.statut as Source["statut"]) ?? "active",
      perimetre: exigerChamp(data.perimetre as string, "perimetre", relatif),
      classification: (data.classification as Source["classification"]) ?? "publique",
      fictif: data.fictif === true,
      contenu: content,
      chemin: relatif,
    } satisfies Source;
  });
  return sourcesCache;
}

export function getSource(id: string): Source | undefined {
  return getSources().find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// Fiches
// ---------------------------------------------------------------------------

let fichesCache: Fiche[] | null = null;

export function getFiches(): Fiche[] {
  if (fichesCache) return fichesCache;
  fichesCache = lireMd(FICHES_DIR).map(({ data, content, fichier }) => {
    const relatif = path.join("content/demo-onboarding-rh/fiches", fichier);
    const slug = (data.slug as string) ?? fichier.replace(/\.md$/, "");
    return {
      slug,
      titre: exigerChamp(data.titre as string, "titre", relatif),
      resume: exigerChamp(data.resume as string, "resume", relatif),
      module: data.module as string | undefined,
      sources: (data.sources as string[]) ?? [],
      date: exigerChamp(data.date as string, "date", relatif),
      statut: (data.statut as StatutHarnais) ?? "prototype",
      limites: exigerChamp(data.limites as string, "limites", relatif),
      contenu: content,
      chemin: relatif,
    } satisfies Fiche;
  });
  return fichesCache;
}

export function getFiche(slug: string): Fiche | undefined {
  return getFiches().find((f) => f.slug === slug);
}

// ---------------------------------------------------------------------------
// Parcours
// ---------------------------------------------------------------------------

export function getParcours(): ModuleParcours[] {
  const chemin = path.join(PARCOURS_DIR, "parcours.yml");
  if (!fs.existsSync(chemin)) return [];
  const brut = yaml.load(fs.readFileSync(chemin, "utf8")) as { modules?: ModuleParcours[] };
  return brut?.modules ?? [];
}

// ---------------------------------------------------------------------------
// Quiz
// ---------------------------------------------------------------------------

export function getQuiz(): QuestionQuiz[] {
  const chemin = path.join(QUIZ_DIR, "quiz.yml");
  if (!fs.existsSync(chemin)) return [];
  const brut = yaml.load(fs.readFileSync(chemin, "utf8")) as { questions?: QuestionQuiz[] };
  return brut?.questions ?? [];
}

// ---------------------------------------------------------------------------
// Gouvernance (documents Markdown) + checklist
// ---------------------------------------------------------------------------

/** Lit un document de gouvernance par nom de fichier (sans extension). */
export function getDocGouvernance(nom: string): string | null {
  const chemin = path.join(GOUVERNANCE_DIR, `${nom}.md`);
  if (!fs.existsSync(chemin)) return null;
  const { content } = matter(fs.readFileSync(chemin, "utf8"));
  return content.trim();
}

/** Lit la checklist RH (aide-mémoire documentaire, pas un workflow). */
export function getChecklist(): string | null {
  const chemin = path.join(CONTENT_DIR, "checklist.md");
  if (!fs.existsSync(chemin)) return null;
  const { content } = matter(fs.readFileSync(chemin, "utf8"));
  return content.trim();
}

/** Réinitialise les caches (tests). */
export function resetContentCache(): void {
  sourcesCache = null;
  fichesCache = null;
}
