/**
 * Utilitaires CLI partagés par les scripts déterministes.
 *
 * Conventions communes (spec §en-tête) : `--help`, `--cas <slug>` (défaut :
 * champ `cas` de la config active, sinon `onboarding-agents`), `--json`
 * (objet `{ ok, erreurs, avertissements }`), codes de sortie 0/1/2.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const RACINE = process.env.CDH_PROJECT_ROOT ?? process.cwd();
export const SLUG_CAS = /^[a-z0-9-]+$/;

/**
 * Analyse `argv` (sans les deux premiers éléments de process.argv). Supporte
 * `--drapeau` et `--clef valeur`. Renvoie `{ drapeaux: Set, valeurs: Map,
 * positionnels: [] }`.
 * @param {string[]} argv
 * @param {Set<string>} clefsAvecValeur noms d'options attendant une valeur
 */
export function analyserArgs(argv, clefsAvecValeur = new Set()) {
  const drapeaux = new Set();
  const valeurs = new Map();
  const positionnels = [];
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const nom = a.slice(2);
      if (clefsAvecValeur.has(nom)) {
        valeurs.set(nom, argv[i + 1]);
        i += 1;
      } else {
        drapeaux.add(nom);
      }
    } else {
      positionnels.push(a);
    }
  }
  return { drapeaux, valeurs, positionnels };
}

/**
 * Résout le cas actif : `--cas` s'il est fourni et valide, sinon le champ `cas`
 * de la config active (`CDH_CONFIG`, défaut `demo.yml`), sinon `onboarding-agents`.
 * Lève `{ code: 2 }` si `--cas` est fourni mais invalide.
 * @param {string|undefined} casArg
 * @returns {string}
 */
export function resoudreCas(casArg) {
  if (casArg !== undefined) {
    if (!SLUG_CAS.test(casArg)) {
      const e = new Error("--cas attend un slug ([a-z0-9-]).");
      e.code = 2;
      throw e;
    }
    return casArg;
  }
  try {
    const fichier = process.env.CDH_CONFIG ?? "demo.yml";
    const brut = yaml.load(fs.readFileSync(path.join(RACINE, "configs", fichier), "utf8"));
    if (typeof brut?.cas === "string" && SLUG_CAS.test(brut.cas)) return brut.cas;
  } catch {
    // Config absente ou illisible : on retombe sur le cas par défaut.
  }
  return "onboarding-agents";
}

/** Racine absolue du projet (workspace du dépôt). */
export function racine() {
  return RACINE;
}

/** Imprime l'aide et sort en code 0. */
export function aide(texte) {
  process.stdout.write(texte.trimStart() + "\n");
  process.exit(0);
}

/**
 * Émet le résultat machine `{ ok, erreurs, avertissements }` sur stdout (JSON).
 * @param {{ ok: boolean, erreurs: string[], avertissements: string[] }} resultat
 */
export function emettreJson(resultat) {
  process.stdout.write(
    JSON.stringify(
      {
        ok: resultat.ok,
        erreurs: resultat.erreurs ?? [],
        avertissements: resultat.avertissements ?? [],
      },
      null,
      2,
    ) + "\n",
  );
}
