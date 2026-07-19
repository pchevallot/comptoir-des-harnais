#!/usr/bin/env node
/**
 * validate-guardrails — vérifie la TRIPLE cohérence des garde-fous d'un cas :
 * ce qui est déclaré (`harnais.yaml`), ce qui est affiché
 * (`gouvernance/limites-refus.md`) et ce qui est testé (`tests/comportement.yaml`).
 * C'est le contrôle que personne ne fait à la main.
 *
 *   npm run validate-guardrails -- --cas onboarding-agents [--json]
 *
 * Ce script LIT les YAML : il ne joue pas le moteur (c'est le rôle de npm test).
 * Il valide la couverture, pas le comportement.
 *
 * Codes de sortie : 0 OK, 1 erreur bloquante, 2 mauvaise invocation.
 *
 * Sévérité : les incohérences structurelles (refus déclaré non testé, refus
 * testé non affiché, renvoi vers une personne) sont bloquantes. Les manques de
 * volume (moins de cas que le minimum) sont des avertissements nommés, admis
 * jusqu'au Lot 7 (corpus et tests denses).
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { analyserArgs, resoudreCas, racine, aide, emettreJson } from "./lib/cli.mjs";
import { ressembleANomDePersonne } from "./lib/atelier/reponses.mjs";

const AIDE = `
validate-guardrails — contrôle de couverture des refus d'un cas.

Usage :
  npm run validate-guardrails -- --cas <slug> [--json]

Options :
  --cas <slug>   cas à contrôler (défaut : champ « cas » de la config active).
  --json         sortie machine { ok, erreurs, avertissements }.
  --help         affiche cette aide.

Contrôles : socle minimal testé (≥ 3 refus dont nominatif, possessif, avis
juridique), refus déclarés tous testés, refus testés tous affichés dans
limites-refus.md, ≥ 5 cas sourcés, ≥ 1 cas hors-corpus, renvois vers des
fonctions (jamais des personnes).
`;

const sansAccent = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Détecte la ou les catégories de refus d'un cas de test (question + id). */
function categoriesRefus(cas) {
  const t = sansAccent(`${cas.id ?? ""} ${cas.question ?? ""}`);
  const cats = new Set();
  if (/\b(madame|monsieur|mme|mr|m\.)\s+\S/.test(t) || /\bmartin\b|\bdupont\b/.test(t)) {
    cats.add("nominatif");
  }
  if (/\b(ma|mon|mes)\b/.test(t) || /\b(remuneration|dossier|carriere|situation personnelle|nominatif|individuel)\b/.test(t)) {
    cats.add("individuel");
  }
  if (/\b(juridique|legal|droit)\b/.test(t)) cats.add("juridique");
  if (/\b(medical|medecin|sante|aptitude)\b/.test(t)) cats.add("medical");
  return cats;
}

/** Phrase attendue dans limites-refus.md pour chaque catégorie affichée. */
const CATEGORIE_AFFICHEE = {
  nominatif: ["cas individuel", "personne nommee", "nominatif"],
  individuel: ["cas individuel", "situation personnelle", "remuneration", "dossier"],
  juridique: ["avis juridique", "juridique"],
  medical: ["avis medical", "medecine", "medical"],
};

/**
 * Contrôle la couverture des garde-fous du cas. Fonction pure importable.
 * @param {string} cas
 * @returns {{ ok: boolean, erreurs: string[], avertissements: string[] }}
 */
export function validerGuardrails(cas) {
  const erreurs = [];
  const avertissements = [];
  const CASE = path.join(racine(), "cases", cas);
  const CONTENT = path.join(racine(), "content", "cases", cas);

  // Entrées
  const cheminTests = path.join(CASE, "tests", "comportement.yaml");
  if (!fs.existsSync(cheminTests)) {
    erreurs.push(`tests/comportement.yaml introuvable pour le cas ${cas}.`);
    return { ok: false, erreurs, avertissements };
  }
  let casTests;
  try {
    casTests = yaml.load(fs.readFileSync(cheminTests, "utf8"));
  } catch (e) {
    erreurs.push(`tests/comportement.yaml illisible : ${e.message}`);
    return { ok: false, erreurs, avertissements };
  }
  if (!Array.isArray(casTests)) casTests = [];

  const cheminLimites = path.join(CASE, "gouvernance", "limites-refus.md");
  const limites = fs.existsSync(cheminLimites)
    ? sansAccent(fs.readFileSync(cheminLimites, "utf8"))
    : "";
  if (!limites) avertissements.push("gouvernance/limites-refus.md absent : refus affichés non vérifiés.");

  const cheminManif = path.join(CASE, "harnais.yaml");
  let manif = null;
  if (fs.existsSync(cheminManif)) {
    try {
      manif = yaml.load(fs.readFileSync(cheminManif, "utf8"));
    } catch {
      avertissements.push("harnais.yaml illisible : refus déclarés non vérifiés.");
    }
  }

  // Registre des identifiants de sources (pour les cas sourcés).
  const idsSources = new Set();
  const dossierSources = path.join(CONTENT, "sources");
  if (fs.existsSync(dossierSources)) {
    for (const f of fs.readdirSync(dossierSources)) {
      const m = f.match(/^(SRC-\d{3})/);
      if (m) idsSources.add(m[1]);
    }
  }

  const refus = casTests.filter((c) => c?.type === "comportement" && c?.attendu?.refuse === true);
  const catsTestees = new Set();
  for (const r of refus) for (const c of categoriesRefus(r)) catsTestees.add(c);

  // 1. socle minimal (manques → avertissements nommés)
  if (refus.length < 3) {
    avertissements.push(`socle : ${refus.length} cas de refus testés (< 3 attendus).`);
  }
  if (!catsTestees.has("nominatif")) {
    avertissements.push("socle : aucun cas de refus nominatif fictif (ex. « Madame Martin »).");
  }
  if (!catsTestees.has("individuel")) {
    avertissements.push("socle : aucun cas de refus possessif individuel (ex. « ma rémunération »).");
  }
  if (!catsTestees.has("juridique")) {
    avertissements.push("socle : aucun cas de refus d'avis juridique.");
  }

  // 2. refus déclarés (manifeste) tous testés → erreur sinon
  const refusDeclares = Array.isArray(manif?.refus_complementaires) ? manif.refus_complementaires : [];
  for (const d of refusDeclares) {
    const motKeys = sansAccent(d.motif).split(/\s+/).filter((w) => w.length >= 4);
    const couvert = casTests.some((c) => {
      const hay = sansAccent(`${c.id ?? ""} ${c.couvre ?? ""} ${c.question ?? ""}`);
      return motKeys.some((k) => hay.includes(k));
    });
    if (!couvert) erreurs.push(`refus déclaré non testé : « ${d.motif} » (aucun cas de test ne le couvre).`);
  }

  // 3. refus testés tous affichés dans limites-refus.md → erreur sinon
  for (const cat of catsTestees) {
    const phrases = CATEGORIE_AFFICHEE[cat] ?? [];
    if (limites && !phrases.some((p) => limites.includes(p))) {
      erreurs.push(`refus testé non affiché : catégorie « ${cat} » absente de limites-refus.md.`);
    }
  }

  // 4. ≥ 5 cas sourcés pointant vers des SRC- existants (manque → avertissement)
  const sources = casTests.filter(
    (c) => c?.type === "comportement" && (c?.attendu?.cite_source || c?.doit_citer_source),
  );
  let sourcesValides = 0;
  for (const c of sources) {
    const src = c.attendu?.cite_source ?? c.doit_citer_source;
    if (idsSources.has(src)) sourcesValides += 1;
    else avertissements.push(`cas « ${c.id} » : source citée ${src} absente du registre.`);
  }
  if (sourcesValides < 5) {
    avertissements.push(`${sourcesValides} cas sourcés valides (< 5 attendus) — corpus/tests denses au Lot 7.`);
  }

  // 5. ≥ 1 cas hors-corpus (manque → avertissement)
  const horsCorpus = casTests.filter((c) => c?.attendu?.ne_sait_pas === true);
  if (horsCorpus.length < 1) {
    avertissements.push("aucun cas hors-corpus (« je ne sais pas » attendu).");
  }

  // 6. renvois vers des fonctions, jamais des personnes → erreur sinon
  for (const c of casTests) {
    const renvoi = c?.attendu?.renvoi_contient;
    if (typeof renvoi === "string" && ressembleANomDePersonne(renvoi)) {
      erreurs.push(`cas « ${c.id} » : renvoi « ${renvoi} » ressemble à une personne (attendu : une fonction).`);
    }
  }

  return { ok: erreurs.length === 0, erreurs, avertissements };
}

// --- CLI --------------------------------------------------------------------
function principal() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help")) aide(AIDE);
  const { drapeaux, valeurs } = analyserArgs(argv, new Set(["cas"]));
  let cas;
  try {
    cas = resoudreCas(valeurs.get("cas"));
  } catch (e) {
    console.error(`Erreur : ${e.message}`);
    process.exit(e.code ?? 2);
  }

  const res = validerGuardrails(cas);

  if (drapeaux.has("json")) {
    emettreJson(res);
    process.exit(res.ok ? 0 : 1);
  }

  console.log(`\n=== Couverture des garde-fous — cas ${cas} ===\n`);
  console.log(`${res.erreurs.length} erreur(s), ${res.avertissements.length} avertissement(s).\n`);
  if (res.avertissements.length) {
    console.log("Avertissements :");
    for (const a of res.avertissements) console.log(`  ! ${a}`);
    console.log("");
  }
  if (res.erreurs.length) {
    console.log("Erreurs bloquantes :");
    for (const e of res.erreurs) console.log(`  ✗ ${e}`);
    console.log(`\nRésultat : ÉCHEC (${res.erreurs.length} erreur(s)).\n`);
    process.exit(1);
  }
  console.log("Résultat : OK — couverture des refus cohérente.\n");
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
