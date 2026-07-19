import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "zod";
import { CONFIGS_DIR } from "./paths";

/**
 * Chargement et validation de la configuration de l'organisation.
 * La configuration est un simple fichier YAML lisible et éditable sans
 * compétence de développement (cf. PRD §6.1-11). La validation produit des
 * messages d'erreur explicites plutôt qu'un plantage silencieux.
 */

const StatutHarnaisSchema = z.enum(["prototype", "interne", "production"]);

const ConfigSchema = z.object({
  // Cas d'usage servi par cette configuration (dossier cases/<cas> +
  // content/cases/<cas>). Défaut : le premier harnais produit par la fabrique.
  cas: z
    .string()
    .regex(/^[a-z0-9-]+$/, "doit être un slug en minuscules ([a-z0-9-])")
    .default("onboarding-agents"),
  organisation: z.object({
    nom: z.string().min(1),
    type: z.string().min(1),
    fictive: z.boolean(),
  }),
  harnais: z.object({
    nom: z.string().min(1),
    statut: StatutHarnaisSchema,
    besoin: z.string().min(1),
  }),
  gouvernance: z.object({
    responsable_metier: z.string().min(1),
    dpo: z.string().min(1),
    dsi_rssi: z.string().min(1),
    classification_donnees: z.array(z.enum(["publique", "interne", "personnelle", "sensible"])).min(1),
  }),
  modele: z.object({
    nom_affiche: z.string().min(1),
  }),
  seuil_anciennete_mois: z.number().int().positive(),
});

export type HarnaisConfig = z.infer<typeof ConfigSchema>;

let cache: HarnaisConfig | null = null;

export function getConfig(): HarnaisConfig {
  if (cache) return cache;
  const fichier = process.env.CDH_CONFIG ?? "demo.yml";
  const chemin = path.join(CONFIGS_DIR, fichier);

  if (!fs.existsSync(chemin)) {
    throw new Error(
      `Configuration introuvable : ${fichier}. Attendu dans configs/. ` +
        `Copiez configs/organisation.example.yml ou conservez configs/demo.yml.`,
    );
  }

  let brut: unknown;
  try {
    brut = yaml.load(fs.readFileSync(chemin, "utf8"));
  } catch (e) {
    throw new Error(`Configuration illisible (${fichier}) : YAML invalide. ${(e as Error).message}`);
  }

  const parsed = ConfigSchema.safeParse(brut);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
      .join("\n");
    throw new Error(`Configuration invalide (${fichier}) :\n${details}`);
  }

  cache = parsed.data;
  return cache;
}

/** Réinitialise le cache (utile en test lorsque CDH_CONFIG change). */
export function resetConfigCache(): void {
  cache = null;
}
