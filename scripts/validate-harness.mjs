#!/usr/bin/env node
/**
 * validate-harness — ORCHESTRATEUR de validation d'un harnais (spec §8).
 *
 * Enchaîne : lecture/validation du manifeste → validate-corpus →
 * validate-guardrails → validate-provider-config (NON bloquant : un poste sans
 * .env.local reste sain) → contrôles propres de config/manifeste. Rapport
 * agrégé en français, signature CLI conservée :
 *
 *   npm run validate-harness [-- --cas <slug>] [--json]
 *
 * Code 1 si au moins une erreur bloquante existe (corpus, garde-fous, ou
 * config/manifeste) ; le diagnostic IA n'est jamais bloquant.
 *
 * Les contrôles de corpus (frontmatters, fiches→sources, obsolescence) ont
 * migré dans validate-corpus ; ce fichier ne garde que l'orchestration et les
 * contrôles de config/manifeste (voir docs/RECETTE.md, liste avant/après).
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { analyserArgs, resoudreCas, racine, aide, emettreJson } from "./lib/cli.mjs";
import { chargerManifeste, cheminManifeste } from "./lib/manifeste.mjs";
import { validerCorpus } from "./validate-corpus.mjs";
import { validerGuardrails } from "./validate-guardrails.mjs";
import { validerProvider } from "./validate-provider-config.mjs";

const AIDE = `
validate-harness — orchestrateur de validation d'un harnais.

Usage :
  npm run validate-harness [-- --cas <slug>] [--json]

Options :
  --cas <slug>   cas à valider (défaut : champ « cas » de la config active).
  --json         sortie machine agrégée { ok, erreurs, avertissements }.
  --help         affiche cette aide.

Enchaîne : manifeste → corpus → garde-fous → configuration IA (non bloquante)
→ contrôles de config/manifeste.
`;

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

  const erreurs = [];
  const avertissements = [];

  // --- Contrôles propres : configuration -----------------------------------
  const configFile = process.env.CDH_CONFIG ?? "demo.yml";
  const configPath = path.join(racine(), "configs", configFile);
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
    // Cohérence config.cas ↔ dossiers du cas.
    if (typeof config?.cas === "string" && !fs.existsSync(path.join(racine(), "content", "cases", config.cas))) {
      erreurs.push(`configs/${configFile} : champ « cas: ${config.cas} » sans dossier content/cases/${config.cas}/`);
    }
  }

  // --- Contrôles propres : manifeste ---------------------------------------
  if (fs.existsSync(cheminManifeste(cas))) {
    try {
      chargerManifeste(cas);
    } catch (e) {
      erreurs.push(e.message);
    }
  } else {
    avertissements.push(`Manifeste absent : cases/${cas}/harnais.yaml (cas non encore cadré).`);
  }

  // --- Contrôles propres : gouvernance présente ----------------------------
  for (const doc of ["limites-refus", "classification", "fiche-validation", "journal"]) {
    if (!fs.existsSync(path.join(racine(), "cases", cas, "gouvernance", `${doc}.md`))) {
      avertissements.push(`cases/${cas}/gouvernance/${doc}.md absent`);
    }
  }

  // --- Sous-validateurs -----------------------------------------------------
  const corpus = validerCorpus(cas);
  const guardrails = validerGuardrails(cas);
  const provider = validerProvider(); // NON bloquant

  erreurs.push(...corpus.erreurs, ...guardrails.erreurs);
  avertissements.push(...corpus.avertissements, ...guardrails.avertissements);
  // La configuration IA n'est jamais bloquante : ses écarts deviennent des avertissements.
  for (const e of provider.erreurs) avertissements.push(`configuration IA : ${e}`);
  avertissements.push(...provider.avertissements);

  const ok = erreurs.length === 0;
  const resultatAgrege = { ok, erreurs, avertissements };

  if (drapeaux.has("json")) {
    emettreJson(resultatAgrege);
    process.exit(ok ? 0 : 1);
  }

  // --- Rapport agrégé (en-tête historique conservé) -------------------------
  const fichesDir = path.join(racine(), "content", "cases", cas, "fiches");
  const nFiches = fs.existsSync(fichesDir)
    ? fs.readdirSync(fichesDir).filter((f) => f.endsWith(".md") && !f.startsWith("EXEMPLE-")).length
    : 0;

  console.log("\n=== Validation du harnais ===\n");
  console.log(`Configuration     : configs/${configFile}`);
  console.log(`Cas               : ${cas}`);
  console.log(`Sources           : ${corpus.nSources}`);
  console.log(`Fiches            : ${nFiches}`);
  console.log(`Statut du harnais : ${config?.harnais?.statut ?? "(inconnu)"}\n`);

  console.log("Synthèse des sous-validateurs :");
  console.log(`  Corpus       : ${corpus.erreurs.length} erreur(s), ${corpus.avertissements.length} avertissement(s)`);
  console.log(`  Garde-fous   : ${guardrails.erreurs.length} erreur(s), ${guardrails.avertissements.length} avertissement(s)`);
  console.log(`  Config. IA   : ${provider.diag.info.id} / ${provider.diag.statut} (non bloquant)\n`);

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
}

principal();
