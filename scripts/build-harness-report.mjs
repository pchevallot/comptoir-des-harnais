#!/usr/bin/env node
/**
 * build-harness-report — produit le rapport de gouvernance remis au DPO/DSI/DGS :
 * l'état complet et daté du harnais.
 *
 *   npm run rapport -- --cas onboarding-agents [--sortie <chemin>]
 *
 * Agrège manifeste, config, registre des sources, refus, mode IA et la synthèse
 * des trois validateurs (exécutés ici). La date de génération vient de l'horloge :
 * c'est la SEULE non-reproductibilité admise, et elle est confinée à l'en-tête.
 *
 * Code 0 même en présence d'écarts (le rapport les documente) ; 1 seulement si
 * une entrée est illisible.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";
import { analyserArgs, resoudreCas, racine, aide } from "./lib/cli.mjs";
import { validerCorpus } from "./validate-corpus.mjs";
import { validerGuardrails } from "./validate-guardrails.mjs";
import { validerProvider } from "./validate-provider-config.mjs";

const AIDE = `
build-harness-report — rapport de gouvernance d'un cas.

Usage :
  npm run rapport -- --cas <slug> [--sortie <chemin>]

Options :
  --cas <slug>    cas à documenter (défaut : champ « cas » de la config active).
  --sortie <chemin>  fichier de sortie (défaut : cases/<slug>/rapport-gouvernance.md).
  --help          affiche cette aide.
`;

const STATUTS = ["prototype", "interne", "production"];

function lireConfigDuCas(cas) {
  const dir = path.join(racine(), "configs");
  const direct = path.join(dir, `${cas}.yml`);
  const candidats = fs.existsSync(direct) ? [direct] : [];
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".yml") || f.endsWith(".yaml")) candidats.push(path.join(dir, f));
    }
  }
  for (const c of candidats) {
    try {
      const cfg = yaml.load(fs.readFileSync(c, "utf8"));
      if (path.basename(c) === `${cas}.yml` || cfg?.cas === cas) return cfg;
    } catch {
      // config illisible : ignorée
    }
  }
  return null;
}

function lireSources(cas) {
  const dir = path.join(racine(), "content", "cases", cas, "sources");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("EXEMPLE-"))
    .sort()
    .map((f) => matter(fs.readFileSync(path.join(dir, f), "utf8")).data);
}

const echapper = (s) => String(s ?? "").replace(/\|/g, "\\|");

/**
 * Construit le contenu du rapport (Markdown). Fonction pure importable.
 * @param {string} cas
 * @param {string} dateGeneration date AAAA-MM-JJ (confinée à l'en-tête)
 * @returns {{ ok: boolean, erreurs: string[], contenu: string }}
 */
export function construireRapport(cas, dateGeneration) {
  const erreurs = [];
  const CASE = path.join(racine(), "cases", cas);

  let manif = null;
  const cheminManif = path.join(CASE, "harnais.yaml");
  if (fs.existsSync(cheminManif)) {
    try {
      manif = yaml.load(fs.readFileSync(cheminManif, "utf8"));
    } catch (e) {
      erreurs.push(`harnais.yaml illisible : ${e.message}`);
    }
  } else {
    erreurs.push(`harnais.yaml absent pour le cas ${cas}.`);
  }

  const config = lireConfigDuCas(cas);
  const sources = lireSources(cas);
  const corpus = validerCorpus(cas);
  const guardrails = validerGuardrails(cas);
  const provider = validerProvider();
  const diag = provider.diag;

  const org = config?.organisation ?? {};
  const gouv = config?.gouvernance ?? {};
  const statutCourant = manif?.etat?.statut ?? config?.harnais?.statut ?? "(inconnu)";

  const l = [];
  l.push(`# Rapport de gouvernance — ${config?.harnais?.nom ?? cas}`);
  l.push("");
  l.push("> Ce document décrit l'état d'un harnais documentaire à une date donnée.");
  l.push("> **Il ne vaut pas validation juridique** ; il éclaire une décision de");
  l.push("> gouvernance (DPO / DSI / DGS), il ne s'y substitue pas.");
  l.push("");
  l.push("## En-tête");
  l.push("");
  l.push(`- **Organisation** : ${org.nom ?? "(non renseignée)"}${org.fictive ? " *(fictive)*" : ""}`);
  l.push(`- **Type d'organisation** : ${org.type ?? "(non renseigné)"}`);
  l.push(`- **Harnais** : ${config?.harnais?.nom ?? cas} (cas \`${cas}\`)`);
  l.push(`- **Type de harnais** : ${manif?.type ?? "(inconnu)"}`);
  l.push(`- **Statut courant** : ${statutCourant}`);
  l.push(`- **Date de génération** : ${dateGeneration}`);
  l.push(`- **Responsable métier** : ${gouv.responsable_metier ?? "(à désigner)"}`);
  l.push(`- **DPO** : ${gouv.dpo ?? "(à désigner)"}`);
  l.push(`- **DSI / RSSI** : ${gouv.dsi_rssi ?? "(à désigner)"}`);
  l.push("");
  l.push("## Besoin");
  l.push("");
  l.push(manif?.besoin ? String(manif.besoin).trim() : "*(besoin non renseigné)*");
  l.push("");

  l.push("## Registre des sources");
  l.push("");
  if (sources.length === 0) {
    l.push("*(aucune source importée)*");
  } else {
    l.push("| id | titre | propriétaire | date | statut | classification |");
    l.push("|---|---|---|---|---|---|");
    for (const s of sources) {
      l.push(
        `| ${echapper(s.id)} | ${echapper(s.titre)} | ${echapper(s.proprietaire)} | ${echapper(s.date)} | ${echapper(s.statut)} | ${echapper(s.classification)} |`,
      );
    }
  }
  l.push("");

  l.push("## Refus et renvois");
  l.push("");
  l.push("Socle non négociable (toujours refusé) : cas individuels, avis juridique/médical, affirmation sans source, promesse de droit.");
  l.push("");
  const refus = Array.isArray(manif?.refus_complementaires) ? manif.refus_complementaires : [];
  if (refus.length === 0) {
    l.push("*Aucun refus complémentaire au-delà du socle.*");
  } else {
    l.push("| motif | renvoi (fonction) |");
    l.push("|---|---|");
    for (const r of refus) l.push(`| ${echapper(r.motif)} | ${echapper(r.renvoi)} |`);
  }
  l.push("");

  l.push("## Mode IA et implications");
  l.push("");
  l.push(`- **Mode actif** : ${diag.info.id} (${diag.info.nom})`);
  l.push(`- **Statut** : ${diag.statut}`);
  l.push(`- **Appels réseau** : ${diag.reseau ? "oui" : "non"}`);
  l.push(`- **Clé requise / présente** : ${diag.clefRequise ? "oui" : "non"} / ${diag.clefPresente ? "oui" : "non"} *(valeur jamais affichée)*`);
  l.push(`- **Souveraineté** : ${diag.info.souverainete}`);
  l.push("");

  l.push("## Synthèse des validations");
  l.push("");
  const bloc = (titre, res) => {
    l.push(`### ${titre}`);
    l.push("");
    l.push(`- ${res.erreurs.length} erreur(s), ${res.avertissements.length} avertissement(s).`);
    for (const e of res.erreurs) l.push(`  - ✗ ${e}`);
    for (const a of res.avertissements) l.push(`  - ! ${a}`);
    l.push("");
  };
  bloc("Corpus", corpus);
  bloc("Garde-fous", guardrails);
  bloc("Configuration IA (non bloquante)", { erreurs: provider.erreurs, avertissements: provider.avertissements });

  l.push("## Statuts du harnais");
  l.push("");
  l.push("Trois statuts jalonnent la vie d'un harnais :");
  for (const s of STATUTS) {
    l.push(`- **${s}**${s === statutCourant ? " ← statut courant" : ""}`);
  }
  l.push("");
  l.push("---");
  l.push("");
  l.push("*Ce rapport ne vaut pas validation juridique. En cas de doute, renvoyer au service compétent (RH, juridique, DPO).*");
  l.push("");

  return { ok: erreurs.length === 0, erreurs, contenu: l.join("\n") };
}

// --- CLI --------------------------------------------------------------------
function principal() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help")) aide(AIDE);
  const { valeurs } = analyserArgs(argv, new Set(["cas", "sortie"]));
  let cas;
  try {
    cas = resoudreCas(valeurs.get("cas"));
  } catch (e) {
    console.error(`Erreur : ${e.message}`);
    process.exit(e.code ?? 2);
  }

  const dateGeneration = new Date().toISOString().slice(0, 10);
  const res = construireRapport(cas, dateGeneration);

  if (!res.ok) {
    for (const e of res.erreurs) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  const sortie = valeurs.get("sortie") ?? path.join(racine(), "cases", cas, "rapport-gouvernance.md");
  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  fs.writeFileSync(sortie, res.contenu, "utf8");
  console.log(`Rapport de gouvernance écrit : ${path.relative(racine(), sortie)}`);
  process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
