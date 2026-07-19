import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

/**
 * Racine du projet. Les composants serveur et les scripts lisent les contenus
 * métier depuis le système de fichiers (dossiers content/, cases/ et configs/),
 * jamais depuis une base de données (choix d'architecture V1, cf. PRD §7).
 */
export const PROJECT_ROOT = process.env.CDH_PROJECT_ROOT ?? process.cwd();

export const CONFIGS_DIR = path.join(PROJECT_ROOT, "configs");

const SLUG_CAS = /^[a-z0-9-]+$/;

/**
 * Slug du cas actif. Résolu depuis le champ `cas` de la configuration active
 * (`configs/${CDH_CONFIG}`), défaut `onboarding-agents`. Lu directement ici,
 * sans passer par `config.ts`, pour éviter un cycle d'imports (config.ts dépend
 * de ce module). La validation fine de la config reste faite par `config.ts`.
 */
function resoudreCasActif(): string {
  const defaut = "onboarding-agents";
  try {
    const fichier = process.env.CDH_CONFIG ?? "demo.yml";
    const brut = yaml.load(fs.readFileSync(path.join(CONFIGS_DIR, fichier), "utf8")) as {
      cas?: unknown;
    };
    if (typeof brut?.cas === "string" && SLUG_CAS.test(brut.cas)) return brut.cas;
  } catch {
    // Config absente ou illisible : on retombe sur le cas par défaut.
  }
  return defaut;
}

export const CAS = resoudreCasActif();

/** Contenu métier du cas : sources/ fiches/ parcours/ quiz/ checklist.md. */
export const CONTENT_DIR = path.join(PROJECT_ROOT, "content", "cases", CAS);
/** Décisions et gouvernance du cas (hors contenu). */
export const CASE_DIR = path.join(PROJECT_ROOT, "cases", CAS);

/** Chemin relatif du contenu du cas (pour l'affichage : registre, messages). */
export const CONTENT_REL = path.posix.join("content", "cases", CAS);

export const SOURCES_DIR = path.join(CONTENT_DIR, "sources");
export const FICHES_DIR = path.join(CONTENT_DIR, "fiches");
export const PARCOURS_DIR = path.join(CONTENT_DIR, "parcours");
export const QUIZ_DIR = path.join(CONTENT_DIR, "quiz");
export const GOUVERNANCE_DIR = path.join(CASE_DIR, "gouvernance");
export const LOGS_DIR = path.join(PROJECT_ROOT, "logs");
