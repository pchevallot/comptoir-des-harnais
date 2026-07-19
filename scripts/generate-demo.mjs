#!/usr/bin/env node
/**
 * generate-demo — vérifie la présence et la complétude du contenu de
 * démonstration (collectivité fictive). En V1, le contenu est écrit à la main
 * et versionné ; ce script sert de contrôle rapide (inventaire) plutôt que de
 * génération automatique. Il délègue la validation de fond à validate-harness.
 */
import fs from "node:fs";
import path from "node:path";

const CONTENT = path.join(process.cwd(), "content", "demo-onboarding-rh");
const attendus = [
  "sources",
  "fiches",
  "parcours/parcours.yml",
  "quiz/quiz.yml",
  "checklist.md",
  "gouvernance/limites-refus.md",
  "gouvernance/classification.md",
  "gouvernance/fiche-validation.md",
  "gouvernance/journal.md",
];

let manquants = 0;
console.log("\n=== Inventaire du contenu de démonstration ===\n");
for (const rel of attendus) {
  const p = path.join(CONTENT, rel);
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
