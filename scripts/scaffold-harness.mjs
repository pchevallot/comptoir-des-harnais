#!/usr/bin/env node
/**
 * scaffold-harness — matérialise l'arborescence complète d'un cas depuis
 * `templates/cases/documentaire/`, pré-remplie avec le manifeste.
 *
 *   npm run scaffold -- --cas mon-cas             # génère cases/ + content/cases/
 *   npm run scaffold -- --cas mon-cas --dry-run   # liste sans créer
 *   npm run scaffold -- --cas mon-cas --force     # réécrit (sauvegarde .avant-force.bak)
 *
 * Idempotent et non destructif : un fichier existant différent du gabarit n'est
 * jamais écrasé sans --force. Refuse d'écraser « onboarding-agents » sans --force.
 *
 * Codes : 0 OK, 2 mauvaise invocation (slug invalide, manifeste absent, refus).
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { analyserArgs, resoudreCas, racine, aide, SLUG_CAS } from "./lib/cli.mjs";
import { cheminManifeste } from "./lib/manifeste.mjs";

const AIDE = `
scaffold-harness — génération de l'arborescence d'un cas depuis le gabarit.

Usage :
  npm run scaffold -- --cas <slug> [--dry-run] [--force]

Options :
  --cas <slug>   cas à générer (obligatoire, [a-z0-9-]).
  --dry-run      liste ce qui serait créé, ne crée rien.
  --force        réécrit les fichiers déjà modifiés (sauvegarde .avant-force.bak).
  --help         affiche cette aide.

Prérequis : cases/<slug>/harnais.yaml (sinon « lancez d'abord npm run interview »).
`;

const GABARIT = () => path.join(racine(), "templates", "cases", "documentaire");

/** Sous-dossiers du gabarit qui vont dans content/cases/<slug>/ (le reste dans cases/<slug>/). */
const VERS_CONTENT = new Set(["sources", "fiches", "parcours", "quiz"]);
/** Fichiers de premier niveau du gabarit qui vont dans content/cases/<slug>/. */
const FICHIERS_CONTENT = new Set(["checklist.md", "README.fr.md"]);

/** Liste récursive des fichiers d'un dossier (chemins relatifs à `base`). */
function listerRecursif(base, prefixe = "") {
  const out = [];
  const dir = path.join(base, prefixe);
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(prefixe, e.name);
    if (e.isDirectory()) out.push(...listerRecursif(base, rel));
    else out.push(rel);
  }
  return out;
}

/** Destination absolue d'un fichier de gabarit (relatif) pour un slug donné. */
function destinationPour(rel, slug) {
  const premier = rel.split("/")[0];
  const contenu = VERS_CONTENT.has(premier) || (rel === premier && FICHIERS_CONTENT.has(premier));
  const racineDest = contenu
    ? path.join(racine(), "content", "cases", slug)
    : path.join(racine(), "cases", slug);
  return path.join(racineDest, rel);
}

/** Substitue les `{{ chemin.pointé }}` résolus dans le contexte ; laisse les autres intacts. */
function substituer(texte, contexte) {
  return texte.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (tout, chemin) => {
    const valeur = chemin.split(".").reduce((o, k) => (o == null ? undefined : o[k]), contexte);
    return valeur === undefined || valeur === null ? tout : String(valeur);
  });
}

const horodatageNom = (p) => `${p}.avant-force.bak`;

/**
 * Génère l'arborescence du cas. Fonction pure importable (atelier, actions).
 * @param {string} slug
 * @param {{ dryRun?: boolean, force?: boolean }} [options]
 * @returns {{ ok: boolean, cree: string[], conserve: string[], ignore: string[], reecrit: string[], erreurs: string[] }}
 */
export function scaffold(slug, options = {}) {
  const { dryRun = false, force = false } = options;
  const cree = [];
  const conserve = [];
  const ignore = [];
  const reecrit = [];
  const erreurs = [];

  if (!SLUG_CAS.test(slug ?? "")) {
    return { ok: false, cree, conserve, ignore, reecrit, erreurs: ["slug invalide ([a-z0-9-])."] };
  }
  if (slug === "onboarding-agents" && !force) {
    return {
      ok: false,
      cree,
      conserve,
      ignore,
      reecrit,
      erreurs: ["refus d'écraser le cas de démonstration « onboarding-agents » sans --force."],
    };
  }
  if (!fs.existsSync(cheminManifeste(slug))) {
    return {
      ok: false,
      cree,
      conserve,
      ignore,
      reecrit,
      erreurs: [`manifeste absent : cases/${slug}/harnais.yaml. Lancez d'abord « npm run interview ».`],
    };
  }

  // Contexte de substitution : manifeste + config du cas si présente.
  let contexte = {};
  try {
    contexte = yaml.load(fs.readFileSync(cheminManifeste(slug), "utf8")) ?? {};
  } catch {
    erreurs.push(`manifeste illisible : cases/${slug}/harnais.yaml`);
  }
  const configDuCas = path.join(racine(), "configs", `${slug}.yml`);
  if (fs.existsSync(configDuCas)) {
    try {
      const c = yaml.load(fs.readFileSync(configDuCas, "utf8")) ?? {};
      contexte = { ...contexte, organisation: c.organisation, gouvernance: c.gouvernance };
    } catch {
      // config illisible : substitution partielle, tolérée.
    }
  }

  const gabaritFichiers = listerRecursif(GABARIT());
  if (gabaritFichiers.length === 0) {
    return { ok: false, cree, conserve, ignore, reecrit, erreurs: ["gabarit introuvable ou vide."] };
  }

  for (const rel of gabaritFichiers) {
    const src = path.join(GABARIT(), rel);
    const dest = destinationPour(rel, slug);
    const relAffiche = path.relative(racine(), dest);
    const rendu = substituer(fs.readFileSync(src, "utf8"), contexte);

    if (!fs.existsSync(dest)) {
      cree.push(relAffiche);
      if (!dryRun) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, rendu, "utf8");
      }
      continue;
    }
    const actuel = fs.readFileSync(dest, "utf8");
    if (actuel === rendu) {
      conserve.push(relAffiche);
    } else if (force) {
      reecrit.push(relAffiche);
      if (!dryRun) {
        fs.copyFileSync(dest, horodatageNom(dest));
        fs.writeFileSync(dest, rendu, "utf8");
      }
    } else {
      ignore.push(relAffiche);
    }
  }

  return { ok: erreurs.length === 0, cree, conserve, ignore, reecrit, erreurs };
}

// --- CLI --------------------------------------------------------------------
function principal() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help")) aide(AIDE);
  const { drapeaux, valeurs } = analyserArgs(argv, new Set(["cas"]));
  let slug;
  try {
    slug = resoudreCas(valeurs.get("cas"));
  } catch (e) {
    console.error(`Erreur : ${e.message}`);
    process.exit(e.code ?? 2);
  }
  if (valeurs.get("cas") === undefined) {
    console.error("Erreur : --cas <slug> est obligatoire pour scaffold.");
    process.exit(2);
  }

  const dryRun = drapeaux.has("dry-run");
  const res = scaffold(slug, { dryRun, force: drapeaux.has("force") });

  console.log(`\n=== Génération du cas ${slug}${dryRun ? " (simulation)" : ""} ===\n`);
  if (!res.ok) {
    for (const e of res.erreurs) console.error(`  ✗ ${e}`);
    process.exit(2);
  }
  const ligne = (titre, liste) => {
    if (liste.length) {
      console.log(`${titre} (${liste.length}) :`);
      for (const f of liste) console.log(`  ${f}`);
    }
  };
  ligne(dryRun ? "À créer" : "Créé", res.cree);
  ligne("Conservé (inchangé)", res.conserve);
  ligne("Ignoré (déjà modifié — --force pour réécrire)", res.ignore);
  ligne("Réécrit (sauvegarde .avant-force.bak)", res.reecrit);
  console.log(`\n${dryRun ? "Simulation :" : "Terminé :"} ${res.cree.length} fichier(s) ${dryRun ? "à créer" : "créé(s)"}.\n`);
  process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
