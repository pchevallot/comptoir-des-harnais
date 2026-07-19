#!/usr/bin/env node
/**
 * generate-onboarding-demo — (ré)génère le cas de démonstration
 * « onboarding-agents » à partir d'un contenu de RÉFÉRENCE versionné
 * (`scripts/demo/onboarding-agents/`).
 *
 *   npm run generate-demo              # vérifie : écarts entre disque et référence
 *   npm run generate-demo -- --ecrire  # (ré)écrit les fichiers du cas démo
 *
 * SQUELETTE (Lot 3) : la logique de comparaison/copie est en place, mais le
 * contenu de référence dense (16 sources, fiches, parcours, quiz…) arrive au
 * Lot 4 dans `scripts/demo/onboarding-agents/`. Tant qu'il est absent, le script
 * l'annonce clairement et sort en 0 (rien à faire).
 *
 * Principe (spec §7) : le contenu long ne se génère PAS par concaténation de
 * chaînes ; on versionne le contenu, le script garantit l'intégrité (mode
 * vérification = comparaison octet à octet, écarts listés fichier par fichier).
 *
 * NE remplace PAS encore `scripts/generate-demo.mjs` : les deux coexistent
 * jusqu'au Lot 4 (arbitrage handoff).
 */
import fs from "node:fs";
import path from "node:path";
import { analyserArgs, racine, aide } from "./lib/cli.mjs";

const AIDE = `
generate-onboarding-demo — (ré)génération du cas de démonstration.

Usage :
  npm run generate-demo              # vérifie les écarts disque ↔ référence
  npm run generate-demo -- --ecrire  # (ré)écrit les fichiers du cas démo

Options :
  --ecrire   écrit les fichiers depuis la référence (sinon : vérification seule).
  --help     affiche cette aide.

Squelette (Lot 3) : le contenu de référence dense arrive au Lot 4 dans
scripts/demo/onboarding-agents/.
`;

const CAS = "onboarding-agents";

/** Liste récursive des fichiers d'un dossier (chemins relatifs). */
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

/**
 * Destination d'un fichier de référence. La référence reproduit l'arborescence
 * cible : `content/…` sous `content/cases/onboarding-agents/`, `case/…` sous
 * `cases/onboarding-agents/`.
 */
function destinationPour(rel) {
  if (rel.startsWith("content/")) {
    return path.join(racine(), "content", "cases", CAS, rel.slice("content/".length));
  }
  if (rel.startsWith("case/")) {
    return path.join(racine(), "cases", CAS, rel.slice("case/".length));
  }
  return path.join(racine(), rel);
}

/**
 * Compare (ou écrit) le cas démo depuis la référence. Fonction pure importable.
 * @param {{ ecrire?: boolean }} [options]
 * @returns {{ ok: boolean, referencePresente: boolean, ecarts: string[], ecrits: string[] }}
 */
export function genererDemo(options = {}) {
  const { ecrire = false } = options;
  const reference = path.join(racine(), "scripts", "demo", CAS);
  const ecarts = [];
  const ecrits = [];

  if (!fs.existsSync(reference)) {
    return { ok: true, referencePresente: false, ecarts, ecrits };
  }

  for (const rel of listerRecursif(reference)) {
    const src = path.join(reference, rel);
    const dest = destinationPour(rel);
    const attendu = fs.readFileSync(src);
    if (ecrire) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, attendu);
      ecrits.push(path.relative(racine(), dest));
    } else {
      const actuel = fs.existsSync(dest) ? fs.readFileSync(dest) : null;
      if (actuel === null || !actuel.equals(attendu)) {
        ecarts.push(path.relative(racine(), dest));
      }
    }
  }
  return { ok: ecrire || ecarts.length === 0, referencePresente: true, ecarts, ecrits };
}

// --- CLI --------------------------------------------------------------------
function principal() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help")) aide(AIDE);
  const { drapeaux } = analyserArgs(argv);
  const ecrire = drapeaux.has("ecrire");

  const res = genererDemo({ ecrire });

  if (!res.referencePresente) {
    console.log(
      `\nContenu de référence absent : scripts/demo/${CAS}/ n'existe pas encore ` +
        "(il arrive au Lot 4). Rien à faire.\n",
    );
    process.exit(0);
  }

  if (ecrire) {
    console.log(`\n${res.ecrits.length} fichier(s) écrit(s) depuis la référence.\n`);
    process.exit(0);
  }

  if (res.ecarts.length === 0) {
    console.log("\nCas démo conforme à la référence (aucun écart).\n");
    process.exit(0);
  }
  console.log(`\n${res.ecarts.length} écart(s) disque ↔ référence :`);
  for (const e of res.ecarts) console.log(`  ≠ ${e}`);
  console.log("\nRelancez avec --ecrire pour régénérer.\n");
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
