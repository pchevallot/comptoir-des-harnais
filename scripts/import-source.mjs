#!/usr/bin/env node
/**
 * import-source — amorce une source de harnais à partir d'un fichier .md ou .txt
 * DÉJÀ converti et relu. Il crée un fichier Markdown avec un frontmatter
 * pré-rempli (à compléter) et le texte inséré.
 *
 * Ce script est volontairement modeste (PRD §7.1, « pas d'usine à gaz ») :
 *   - il NE fait PAS de conversion PDF ni d'OCR ;
 *   - il NE contrôle PAS le contenu (données personnelles, exactitude) ;
 *   - la relecture et le retrait des données personnelles restent à votre charge.
 *
 * Exemples :
 *   node scripts/import-source.mjs doc.txt --id SRC-007 --titre "Règlement horaires"
 *   node scripts/import-source.mjs doc.md --id SRC-008 --classification publique \
 *        --proprietaire "Direction de la communication" --out content/demo-onboarding-rh/sources
 *   node scripts/import-source.mjs --help
 */
import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const DEFAUT_OUT = path.join("content", "demo-onboarding-rh", "sources");

function aide() {
  console.log(`
import-source — amorce une source de harnais (.md) à partir d'un .md/.txt relu.

Usage :
  node scripts/import-source.mjs <fichier .md|.txt> [options]

Options :
  --id <SRC-NNN>            Identifiant de la source (obligatoire, ex. SRC-007).
  --titre <"...">          Titre lisible (défaut : nom du fichier).
  --proprietaire <"...">   Fonction propriétaire (défaut : "À COMPLÉTER").
  --date <AAAA-MM-JJ>      Date de version (défaut : à compléter, laissé vide).
  --statut <active|perimee>        Défaut : active.
  --classification <publique|interne>  Défaut : interne (V1 : rien d'autre).
  --perimetre <"...">      Périmètre de validité (défaut : "À COMPLÉTER").
  --fictif <true|false>    Marque de démonstration (défaut : false).
  --out <dossier>          Dossier cible (défaut : ${DEFAUT_OUT}).
  --help                   Affiche cette aide.

Rappels de sécurité :
  - Ne fournit ni OCR ni conversion PDF : convertissez et relisez AVANT.
  - Classification limitée à "publique" / "interne" en V1.
  - Aucune donnée personnelle ni sensible : à vérifier avant intégration.
`);
}

function parseArgs(argv) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") return { help: true };
    if (a.startsWith("--")) {
      const cle = a.slice(2);
      const val = argv[i + 1];
      opts[cle] = val;
      i++;
    } else {
      opts._.push(a);
    }
  }
  return opts;
}

function erreur(msg) {
  console.error(`Erreur : ${msg}`);
  console.error("Aide : node scripts/import-source.mjs --help");
  process.exit(1);
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help || process.argv.length <= 2) {
  aide();
  process.exit(opts.help ? 0 : 1);
}

const entree = opts._[0];
if (!entree) erreur("fichier d'entrée manquant (.md ou .txt).");
const cheminEntree = path.resolve(RACINE, entree);
if (!fs.existsSync(cheminEntree)) erreur(`fichier introuvable : ${entree}`);
if (!/\.(md|txt)$/i.test(cheminEntree)) {
  erreur("format non pris en charge : fournissez un .md ou .txt déjà converti et relu.");
}

const id = opts.id;
if (!id) erreur("option --id obligatoire (ex. --id SRC-007).");
if (!/^SRC-\d+/.test(id)) erreur(`identifiant invalide : "${id}" (attendu : SRC-NNN).`);

const classification = (opts.classification ?? "interne").toLowerCase();
if (!["publique", "interne"].includes(classification)) {
  erreur(`classification invalide : "${classification}" (V1 : publique | interne).`);
}
const statut = (opts.statut ?? "active").toLowerCase();
if (!["active", "perimee"].includes(statut)) {
  erreur(`statut invalide : "${statut}" (attendu : active | perimee).`);
}
const fictif = (opts.fictif ?? "false").toLowerCase() === "true";

const base = path.basename(cheminEntree).replace(/\.(md|txt)$/i, "");
const titre = opts.titre ?? base.replace(/[-_]+/g, " ");
const proprietaire = opts.proprietaire ?? "À COMPLÉTER (une fonction, jamais une personne)";
const perimetre = opts.perimetre ?? "À COMPLÉTER";
const date = opts.date ?? "";

const texte = fs.readFileSync(cheminEntree, "utf8").trim();

// Frontmatter écrit à la main (guillemets doublés échappés) pour éviter une
// dépendance ; l'ordre des champs suit celui des sources de démonstration.
const echapper = (s) => String(s).replace(/"/g, '\\"');
const frontmatter = [
  "---",
  `id: "${echapper(id)}"`,
  `titre: "${echapper(titre)}"`,
  `proprietaire: "${echapper(proprietaire)}"`,
  `date: "${echapper(date)}"${date ? "" : "   # À COMPLÉTER — format AAAA-MM-JJ"}`,
  `statut: "${statut}"`,
  `perimetre: "${echapper(perimetre)}"`,
  `classification: "${classification}"`,
  `fictif: ${fictif}`,
  "---",
  "",
].join("\n");

const slug = base
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");
const nomFichier = `${id}-${slug || "source"}.md`;

const dossierOut = path.resolve(RACINE, opts.out ?? DEFAUT_OUT);
if (!fs.existsSync(dossierOut)) fs.mkdirSync(dossierOut, { recursive: true });
const cheminSortie = path.join(dossierOut, nomFichier);
if (fs.existsSync(cheminSortie)) {
  erreur(`le fichier existe déjà : ${path.relative(RACINE, cheminSortie)} (choisissez un autre --id).`);
}

fs.writeFileSync(cheminSortie, frontmatter + texte + "\n", "utf8");

console.log(`Source amorcée : ${path.relative(RACINE, cheminSortie)}`);
console.log("");
console.log("À FAIRE avant intégration :");
console.log("  1. Compléter le frontmatter (propriétaire, date, périmètre).");
console.log("  2. RELIRE le texte : chiffres, dates, titres, mise en forme.");
console.log("  3. VÉRIFIER l'absence de données personnelles ou sensibles.");
console.log("  4. Lancer :  npm run validate-harness  puis  npm test");
