import path from "node:path";

/**
 * Racine du projet. Les composants serveur et les scripts lisent les contenus
 * métier depuis le système de fichiers (dossiers content/ et configs/), jamais
 * depuis une base de données (choix d'architecture V1, cf. PRD §7).
 */
export const PROJECT_ROOT = process.env.CDH_PROJECT_ROOT ?? process.cwd();

export const CONTENT_DIR = path.join(PROJECT_ROOT, "content", "demo-onboarding-rh");
export const CONFIGS_DIR = path.join(PROJECT_ROOT, "configs");
export const SOURCES_DIR = path.join(CONTENT_DIR, "sources");
export const FICHES_DIR = path.join(CONTENT_DIR, "fiches");
export const PARCOURS_DIR = path.join(CONTENT_DIR, "parcours");
export const QUIZ_DIR = path.join(CONTENT_DIR, "quiz");
export const GOUVERNANCE_DIR = path.join(CONTENT_DIR, "gouvernance");
export const LOGS_DIR = path.join(PROJECT_ROOT, "logs");
