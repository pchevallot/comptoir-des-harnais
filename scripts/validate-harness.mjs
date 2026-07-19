#!/usr/bin/env node
/**
 * validate-harness — vérifie qu'une configuration de harnais est complète et
 * cohérente, avec un rapport lisible en français. Exécutable seul :
 *   npm run validate-harness
 * Sort en code 1 si au moins une erreur bloquante est détectée.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";

const RACINE = process.cwd();
const CONTENT = path.join(RACINE, "content", "demo-onboarding-rh");
const erreurs = [];
const avertissements = [];

function lireMd(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ ...matter(fs.readFileSync(path.join(dossier, f), "utf8")), fichier: f }));
}

// 1. Configuration
const configFile = process.env.CDH_CONFIG ?? "demo.yml";
const configPath = path.join(RACINE, "configs", configFile);
let config = null;
if (!fs.existsSync(configPath)) {
  erreurs.push(`Configuration introuvable : configs/${configFile}`);
} else {
  config = yaml.load(fs.readFileSync(configPath, "utf8"));
  for (const champ of ["organisation", "harnais", "gouvernance", "modele"]) {
    if (!config?.[champ]) erreurs.push(`configs/${configFile} : section « ${champ} » manquante`);
  }
  const statut = config?.harnais?.statut;
  if (!["prototype", "interne", "production"].includes(statut)) {
    erreurs.push(`configs/${configFile} : statut invalide (« ${statut} »)`);
  }
}

// 2. Sources
const sources = lireMd(path.join(CONTENT, "sources"));
if (sources.length === 0) erreurs.push("Aucune source dans content/demo-onboarding-rh/sources/");
const ids = new Set();
const seuil = config?.seuil_anciennete_mois ?? 24;
const limite = new Date();
limite.setMonth(limite.getMonth() - seuil);
for (const s of sources) {
  const f = `sources/${s.fichier}`;
  for (const champ of ["id", "titre", "proprietaire", "date", "perimetre"]) {
    if (!s.data?.[champ]) erreurs.push(`${f} : champ « ${champ} » manquant`);
  }
  if (s.data?.fictif !== true) erreurs.push(`${f} : doit être marquée « fictif: true »`);
  if (ids.has(s.data?.id)) erreurs.push(`${f} : identifiant en double (${s.data.id})`);
  ids.add(s.data?.id);
  if (!["publique", "interne"].includes(s.data?.classification)) {
    erreurs.push(`${f} : classification hors périmètre V1 (« ${s.data?.classification} »)`);
  }
  if (s.data?.statut === "active" && s.data?.date && new Date(s.data.date) < limite) {
    avertissements.push(`${f} : source active potentiellement obsolète (${s.data.date}, seuil ${seuil} mois)`);
  }
}

// 3. Fiches → sources présentes dans le registre
const fiches = lireMd(path.join(CONTENT, "fiches"));
for (const fi of fiches) {
  const f = `fiches/${fi.fichier}`;
  const refs = fi.data?.sources ?? [];
  if (!Array.isArray(refs) || refs.length === 0) erreurs.push(`${f} : aucune source citée`);
  for (const id of refs) {
    if (!ids.has(id)) erreurs.push(`${f} : cite ${id}, absente du registre des sources`);
  }
  if (!fi.data?.limites) erreurs.push(`${f} : champ « limites » manquant`);
}

// 4. Documents de gouvernance attendus
for (const doc of ["limites-refus", "classification", "fiche-validation", "journal"]) {
  if (!fs.existsSync(path.join(CONTENT, "gouvernance", `${doc}.md`))) {
    avertissements.push(`gouvernance/${doc}.md absent`);
  }
}

// --- Rapport ---------------------------------------------------------------
console.log("\n=== Validation du harnais ===\n");
console.log(`Configuration     : configs/${configFile}`);
console.log(`Sources           : ${sources.length}`);
console.log(`Fiches            : ${fiches.length}`);
console.log(`Statut du harnais : ${config?.harnais?.statut ?? "(inconnu)"}\n`);

if (avertissements.length) {
  console.log("Avertissements :");
  for (const a of avertissements) console.log(`  ! ${a}`);
  console.log("");
}
if (erreurs.length) {
  console.log("Erreurs bloquantes :");
  for (const e of erreurs) console.log(`  ✗ ${e}`);
  console.log(`\nRésultat : ÉCHEC (${erreurs.length} erreur(s)).\n`);
  process.exit(1);
}
console.log("Résultat : OK — le harnais est complet et cohérent.\n");
