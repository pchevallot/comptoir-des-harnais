#!/usr/bin/env node
/**
 * validate-corpus — contrôle la conformité de forme du corpus d'un cas, sans
 * jamais juger le fond (la relecture du fond reste humaine). Déterministe :
 * même corpus → même rapport.
 *
 *   npm run validate-corpus -- --cas onboarding-agents [--json] [--template]
 *
 * Codes de sortie : 0 OK, 1 erreur bloquante, 2 mauvaise invocation.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";
import { analyserArgs, resoudreCas, racine, aide, emettreJson } from "./lib/cli.mjs";
import { motifsDetectes } from "./lib/motifs-interdits.mjs";

const AIDE = `
validate-corpus — contrôle de conformité du corpus d'un cas.

Usage :
  npm run validate-corpus -- --cas <slug> [--json] [--template]

Options :
  --cas <slug>   cas à contrôler (défaut : champ « cas » de la config active).
  --json         sortie machine { ok, erreurs, avertissements }.
  --template     compare l'arborescence au gabarit (avertissement si divergence).
  --help         affiche cette aide.

Contrôles : frontmatter complet, identifiants uniques (SRC-\\d{3}), nom de
fichier préfixé de l'id, classification autorisée, marquage fictif, longueur,
motifs interdits (courriel plausible, téléphone, NIR, IBAN, clé), cohérence
avec le manifeste (sources_declarees), fiches (sources citées, limites).
`;

const SEUIL_MAIGRE = 400; // < 400 mots → avertissement « source maigre »
const SEUIL_COURT = 120; // < 120 mots → ERREUR bloquante (corpus dense, Lot 4)
const CHAMPS_SOURCE = ["id", "titre", "proprietaire", "date", "statut", "perimetre", "classification", "fictif"];
const RE_ID = /^SRC-\d{3}$/;

function lireMd(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith(".md") && !f.startsWith("EXEMPLE-"))
    .sort()
    .map((f) => {
      const parsed = matter(fs.readFileSync(path.join(dossier, f), "utf8"));
      return { fichier: f, data: parsed.data, content: parsed.content };
    });
}

/** Résout la config d'un cas : configs/<cas>.yml, sinon la config dont `cas` correspond. */
function lireConfigDuCas(cas) {
  const dir = path.join(racine(), "configs");
  const direct = path.join(dir, `${cas}.yml`);
  if (fs.existsSync(direct)) {
    try {
      return yaml.load(fs.readFileSync(direct, "utf8"));
    } catch {
      return null;
    }
  }
  if (!fs.existsSync(dir)) return null;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".yml") && !f.endsWith(".yaml")) continue;
    try {
      const c = yaml.load(fs.readFileSync(path.join(dir, f), "utf8"));
      if (c?.cas === cas) return c;
    } catch {
      // config illisible : ignorée
    }
  }
  return null;
}

const normaliser = (s) => String(s ?? "").trim().toLowerCase();
const compterMots = (texte) => texte.trim().split(/\s+/).filter(Boolean).length;

/**
 * Contrôle le corpus du cas `cas`. Fonction pure importable (atelier, orchestrateur).
 * @param {string} cas
 * @param {{ template?: boolean }} [options]
 * @returns {{ ok: boolean, erreurs: string[], avertissements: string[], nSources: number }}
 */
export function validerCorpus(cas, options = {}) {
  const erreurs = [];
  const avertissements = [];
  const CONTENT = path.join(racine(), "content", "cases", cas);

  if (!fs.existsSync(CONTENT)) {
    erreurs.push(`content/cases/${cas}/ introuvable (cas inexistant ?).`);
    return { ok: false, erreurs, avertissements, nSources: 0 };
  }

  const config = lireConfigDuCas(cas);
  const organisationFictive = config?.organisation?.fictive === true;
  const seuil = config?.seuil_anciennete_mois ?? 24;
  const limite = new Date();
  limite.setMonth(limite.getMonth() - seuil);

  const sources = lireMd(path.join(CONTENT, "sources"));
  if (sources.length === 0) erreurs.push(`sources/ : aucune source dans content/cases/${cas}/sources/`);

  const ids = new Map();
  for (const s of sources) {
    const f = `sources/${s.fichier}`;
    // 1. frontmatter complet
    for (const champ of CHAMPS_SOURCE) {
      if (s.data?.[champ] === undefined || s.data?.[champ] === "") {
        erreurs.push(`${f} : champ « ${champ} » manquant`);
      }
    }
    // 2. id : format + unicité + préfixe de nom de fichier
    const id = s.data?.id;
    if (id !== undefined && !RE_ID.test(String(id))) {
      erreurs.push(`${f} : identifiant « ${id} » invalide (format attendu : SRC-\\d{3})`);
    }
    if (id !== undefined) {
      if (ids.has(id)) erreurs.push(`${f} : identifiant en double (${id}, déjà dans ${ids.get(id)})`);
      else ids.set(id, s.fichier);
      if (!s.fichier.startsWith(String(id))) {
        avertissements.push(`${f} : le nom de fichier ne commence pas par l'identifiant (${id})`);
      }
    }
    // 3. classification + fictif
    if (!["publique", "interne"].includes(s.data?.classification)) {
      erreurs.push(`${f} : classification hors périmètre V1 (« ${s.data?.classification} »)`);
    }
    if (organisationFictive && s.data?.fictif !== true) {
      erreurs.push(`${f} : organisation fictive → « fictif: true » obligatoire`);
    }
    // 4. longueur
    const mots = compterMots(s.content ?? "");
    if (mots < SEUIL_COURT) {
      erreurs.push(
        `${f} : source trop courte (${mots} mots < ${SEUIL_COURT}) — corpus dense attendu (cible 700–1 800)`,
      );
    } else if (mots < SEUIL_MAIGRE) {
      avertissements.push(`${f} : source maigre (${mots} mots < ${SEUIL_MAIGRE}, cible 700–1 800)`);
    }
    // 5. motifs interdits
    for (const m of motifsDetectes(s.content ?? "")) {
      erreurs.push(`${f} : motif interdit détecté (${m.nom})`);
    }
    // obsolescence (contrôle migré de validate-harness)
    if (s.data?.statut === "active" && s.data?.date && new Date(s.data.date) < limite) {
      avertissements.push(
        `${f} : source active potentiellement obsolète (${s.data.date}, seuil ${seuil} mois)`,
      );
    }
  }

  // 6. cohérence avec le manifeste (sources_declarees) — avertissements
  const cheminManif = path.join(racine(), "cases", cas, "harnais.yaml");
  if (fs.existsSync(cheminManif)) {
    let manif = null;
    try {
      manif = yaml.load(fs.readFileSync(cheminManif, "utf8"));
    } catch {
      avertissements.push(`harnais.yaml : illisible, cohérence sources_declarees non vérifiée`);
    }
    if (manif && Array.isArray(manif.sources_declarees)) {
      const titresImportes = new Set(sources.map((s) => normaliser(s.data?.titre)));
      const titresDeclares = new Set(manif.sources_declarees.map((d) => normaliser(d.titre)));
      for (const d of manif.sources_declarees) {
        if (!titresImportes.has(normaliser(d.titre))) {
          avertissements.push(`harnais.yaml : source déclarée non importée (« ${d.titre} »)`);
        }
      }
      for (const s of sources) {
        if (!titresDeclares.has(normaliser(s.data?.titre))) {
          avertissements.push(`sources/${s.fichier} : source importée non déclarée au manifeste`);
        }
      }
    }
  } else {
    avertissements.push(`harnais.yaml absent : cohérence sources_declarees non vérifiée`);
  }

  // 7. fiches → sources existantes + limites
  const fiches = lireMd(path.join(CONTENT, "fiches"));
  for (const fi of fiches) {
    const f = `fiches/${fi.fichier}`;
    const refs = fi.data?.sources ?? [];
    if (!Array.isArray(refs) || refs.length === 0) {
      erreurs.push(`${f} : aucune source citée`);
    } else {
      for (const id of refs) {
        if (!ids.has(id)) erreurs.push(`${f} : cite ${id}, absente du registre des sources`);
      }
    }
    if (!fi.data?.limites) erreurs.push(`${f} : champ « limites » manquant`);
  }

  // 8. --template : divergence d'arborescence (avertissement)
  if (options.template) {
    const gabarit = path.join(racine(), "templates", "cases", "documentaire");
    for (const sousDossier of ["sources", "fiches", "parcours", "quiz"]) {
      if (fs.existsSync(path.join(gabarit, sousDossier)) && !fs.existsSync(path.join(CONTENT, sousDossier))) {
        avertissements.push(`arborescence : dossier « ${sousDossier}/ » présent au gabarit, absent du cas`);
      }
    }
  }

  return { ok: erreurs.length === 0, erreurs, avertissements, nSources: sources.length };
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

  const res = validerCorpus(cas, { template: drapeaux.has("template") });

  if (drapeaux.has("json")) {
    emettreJson(res);
    process.exit(res.ok ? 0 : 1);
  }

  console.log(`\n=== Contrôle du corpus — cas ${cas} ===\n`);
  console.log(`${res.nSources} source(s) contrôlée(s), ${res.erreurs.length} erreur(s), ${res.avertissements.length} avertissement(s).\n`);
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
  console.log("Résultat : OK — corpus conforme.\n");
}

if (import.meta.url === `file://${process.argv[1]}`) principal();
