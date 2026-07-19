#!/usr/bin/env node
/**
 * generate-demo — vérifie la présence et la complétude du contenu de
 * démonstration (collectivité fictive). En V1, le contenu est écrit à la main
 * et versionné ; ce script sert de contrôle rapide (inventaire) plutôt que de
 * génération automatique. Il délègue la validation de fond à validate-harness.
 */
import fs from "node:fs";
import path from "node:path";

// Script transitoire (remplacé par generate-onboarding-demo au Lot 4). Chemins
// alignés sur la nouvelle arborescence : corpus dans content/cases/<cas>/,
// gouvernance dans cases/<cas>/.
const CAS = "onboarding-agents";
const CONTENT = path.join(process.cwd(), "content", "cases", CAS);
const CASE = path.join(process.cwd(), "cases", CAS);
const attendus = [
  ["content", "sources"],
  ["content", "fiches"],
  ["content", "parcours/parcours.yml"],
  ["content", "quiz/quiz.yml"],
  ["content", "checklist.md"],
  ["case", "gouvernance/limites-refus.md"],
  ["case", "gouvernance/classification.md"],
  ["case", "gouvernance/fiche-validation.md"],
  ["case", "gouvernance/journal.md"],
];

let manquants = 0;
console.log("\n=== Inventaire du contenu de démonstration ===\n");
for (const [racine, rel] of attendus) {
  const p = path.join(racine === "content" ? CONTENT : CASE, rel);
  const ok = fs.existsSync(p);
  if (!ok) manquants++;
  let detail = "";
  if (ok && fs.statSync(p).isDirectory()) {
    detail = ` (${fs.readdirSync(p).filter((f) => f.endsWith(".md")).length} fichier(s))`;
  }
  console.log(`  ${ok ? "✓" : "✗"} ${rel}${detail}`);
}
console.log(
  manquants === 0
    ? "\nContenu de démonstration complet.\n"
    : `\n${manquants} élément(s) manquant(s). Lancez « npm run validate-harness » pour le détail.\n`,
);
process.exit(manquants === 0 ? 0 : 1);
