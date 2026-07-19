#!/usr/bin/env node
/**
 * validate-provider-config — diagnostique la configuration IA depuis
 * l'environnement, sans JAMAIS afficher la valeur d'un secret.
 *
 *   npm run validate-provider                       # lit .env.local + environnement
 *   npm run validate-provider -- --attendu ollama   # erreur si le mode actif diffère
 *   npm run validate-provider -- --json
 *
 * Codes : 0 si « pret », « hors-ligne » ou « desactive » (états sains) ;
 *         1 si « cle-manquante » / « config-incomplete » ou si --attendu diffère ;
 *         2 mauvaise invocation.
 *
 * La clé n'est jamais lue en valeur ni affichée : seul un booléen « présente »
 * est exposé (PRD §9.2-12).
 */
import { analyserArgs, aide, emettreJson } from "./lib/cli.mjs";
import { diagnostiquerConfiguration } from "./lib/diagnostic-env.mjs";

const AIDE = `
validate-provider-config — diagnostic de la configuration IA (sans secret).

Usage :
  npm run validate-provider [-- --attendu <mode>] [--json]

Options :
  --attendu <mode>   erreur si le mode actif diffère (local, none, ollama,
                     anthropic, openai, openrouter, mistral).
  --json             sortie machine { ok, erreurs, avertissements }.
  --help             affiche cette aide.

N'affiche jamais la valeur d'une clé : seulement sa présence (oui/non).
`;

const STATUTS_SAINS = new Set(["pret", "hors-ligne", "desactive"]);

/**
 * Diagnostique la configuration et évalue sa santé. Fonction pure importable.
 * @param {{ attendu?: string }} [options]
 * @returns {{ ok: boolean, erreurs: string[], avertissements: string[], diag: object }}
 */
export function validerProvider(options = {}) {
  const diag = diagnostiquerConfiguration();
  const erreurs = [];
  const avertissements = [];

  if (!STATUTS_SAINS.has(diag.statut)) {
    erreurs.push(`configuration IA : statut « ${diag.statut} » — ${diag.message}`);
  }
  if (options.attendu && diag.info.id !== options.attendu) {
    erreurs.push(`mode actif « ${diag.info.id} » différent du mode attendu « ${options.attendu} ».`);
  }

  return { ok: erreurs.length === 0, erreurs, avertissements, diag };
}

// --- CLI --------------------------------------------------------------------
function principal() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help")) aide(AIDE);
  const { drapeaux, valeurs } = analyserArgs(argv, new Set(["attendu"]));
  const attendu = valeurs.get("attendu");
  if (drapeaux.has("attendu") && !attendu) {
    console.error("Erreur : --attendu attend un mode de fournisseur.");
    process.exit(2);
  }

  const res = validerProvider({ attendu });
  const { diag } = res;

  if (drapeaux.has("json")) {
    emettreJson(res);
    process.exit(res.ok ? 0 : 1);
  }

  console.log("\n=== Configuration IA ===\n");
  console.log(`Mode actif      : ${diag.info.id} (${diag.info.nom})`);
  console.log(`Statut          : ${diag.statut}`);
  console.log(`Nom affiché      : ${diag.nomAffiche}`);
  console.log(`Appels réseau   : ${diag.reseau ? "oui" : "non"}`);
  console.log(`Clé requise     : ${diag.clefRequise ? "oui" : "non"}`);
  console.log(`Clé présente    : ${diag.clefPresente ? "oui" : "non"} (valeur jamais affichée)`);
  console.log(`URL de base     : ${diag.baseUrl ?? "(sans objet)"}`);
  console.log(`Modèle          : ${diag.modele ?? "(sans objet)"}`);
  console.log(`\nSouveraineté / implications :\n  ${diag.info.souverainete}`);
  console.log(`\n${diag.message}\n`);

  if (res.erreurs.length) {
    console.log("Écarts :");
    for (const e of res.erreurs) console.log(`  ✗ ${e}`);
    console.log("");
    process.exit(1);
  }
  console.log("Résultat : configuration saine.\n");
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
