import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { z } from "zod";
import { PROJECT_ROOT } from "./paths";

/**
 * Chargement et validation du manifeste `cases/<slug>/harnais.yaml`.
 *
 * Le manifeste est la **source de vérité** d'un harnais : ce que l'atelier
 * (ou l'interview CLI) a collecté et décidé. Il est lu par les scripts, par
 * l'application (`/fabrique`) et par le rapport de gouvernance. Le schéma est
 * **strict** : toute clé inconnue est une erreur explicite en français, pour
 * éviter les fautes de frappe silencieuses. Aucun secret n'y figure jamais
 * (le mode IA oui, la clé non — cf. architecture §3).
 *
 * Miroir côté scripts : `scripts/lib/manifeste.mjs` (Lot 3), avec un test de
 * non-divergence au Lot 7.
 */

const SLUG = /^[a-z0-9-]+$/;
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

const SourceDeclareeSchema = z
  .object({
    titre: z.string().min(1, "titre requis"),
    proprietaire: z.string().min(1, "propriétaire requis (une fonction, jamais une personne)"),
    date_connue: z
      .string()
      .regex(DATE_ISO, "date_connue attendue au format AAAA-MM-JJ"),
  })
  .strict();

const RefusComplementaireSchema = z
  .object({
    motif: z.string().min(1, "motif du refus requis"),
    renvoi: z.string().min(1, "fonction de renvoi requise (jamais une personne)"),
  })
  .strict();

const ModulesSchema = z
  .object({
    parcours: z.boolean(),
    faq: z.boolean(),
    quiz: z.boolean(),
    checklist: z.boolean(),
  })
  .strict();

const FournisseurSchema = z
  .object({
    mode: z.enum(["local", "none", "ollama", "anthropic", "openai", "openrouter", "mistral"], {
      errorMap: () => ({
        message:
          "mode de fournisseur inconnu (attendu : local, none, ollama, anthropic, openai, openrouter ou mistral)",
      }),
    }),
  })
  .strict();

const EtatSchema = z
  .object({
    etape: z
      .number()
      .int("étape : entier attendu")
      .min(1, "étape : minimum 1")
      .max(15, "étape : maximum 15"),
    statut: z.enum(["prototype", "interne", "production"], {
      errorMap: () => ({ message: "statut attendu : prototype, interne ou production" }),
    }),
    mis_a_jour: z.string().regex(DATE_ISO, "mis_a_jour attendu au format AAAA-MM-JJ"),
  })
  .strict();

const ManifesteSchema = z
  .object({
    version: z.literal(1, { errorMap: () => ({ message: "version attendue : 1" }) }),
    slug: z.string().regex(SLUG, "slug attendu en minuscules ([a-z0-9-])"),
    type: z.enum(["documentaire", "observation"], {
      errorMap: () => ({ message: "type attendu : documentaire ou observation" }),
    }),
    besoin: z.string().min(1, "besoin requis"),
    publics: z.array(z.string().min(1)).min(1, "au moins un public attendu"),
    modules: ModulesSchema,
    sources_declarees: z.array(SourceDeclareeSchema),
    classification_autorisee: z
      .array(z.enum(["publique", "interne"]))
      .min(1, "au moins une classification autorisée"),
    refus_complementaires: z.array(RefusComplementaireSchema),
    fournisseur: FournisseurSchema,
    etat: EtatSchema,
  })
  .strict();

export type Manifeste = z.infer<typeof ManifesteSchema>;

/** Chemin du manifeste d'un cas donné. */
export function cheminManifeste(slug: string): string {
  return path.join(PROJECT_ROOT, "cases", slug, "harnais.yaml");
}

const cache = new Map<string, Manifeste>();

/**
 * Charge et valide le manifeste du cas `slug`. Lève une erreur avec un message
 * français explicite si le fichier est absent, illisible ou non conforme.
 */
export function chargerManifeste(slug: string): Manifeste {
  const enCache = cache.get(slug);
  if (enCache) return enCache;

  if (!SLUG.test(slug)) {
    throw new Error(`Slug de cas invalide : « ${slug} » (attendu : [a-z0-9-]).`);
  }

  const chemin = cheminManifeste(slug);
  if (!fs.existsSync(chemin)) {
    throw new Error(
      `Manifeste introuvable : cases/${slug}/harnais.yaml. ` +
        `Lancez d'abord l'atelier (/fabrique) ou « npm run interview ».`,
    );
  }

  let brut: unknown;
  try {
    brut = yaml.load(fs.readFileSync(chemin, "utf8"));
  } catch (e) {
    throw new Error(
      `Manifeste illisible (cases/${slug}/harnais.yaml) : YAML invalide. ${(e as Error).message}`,
    );
  }

  const parsed = ManifesteSchema.safeParse(brut);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(racine)"} : ${i.message}`)
      .join("\n");
    throw new Error(`Manifeste invalide (cases/${slug}/harnais.yaml) :\n${details}`);
  }

  cache.set(slug, parsed.data);
  return parsed.data;
}

/** Réinitialise le cache (utile en test). */
export function resetManifesteCache(): void {
  cache.clear();
}
