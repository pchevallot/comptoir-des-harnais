/**
 * Manifeste côté scripts — lecture, validation et écriture de
 * `cases/<slug>/harnais.yaml`.
 *
 * C'est le **seul point d'écriture** du manifeste (piège documenté au handoff
 * Lot 3 : jamais deux écrivains concurrents). L'interview CLI et le scaffold
 * passent tous par ici.
 *
 * Les règles de validation sont un **miroir** de `src/lib/manifest.ts` (schéma
 * zod strict). Le partage direct du schéma TS depuis un `.mjs` étant
 * impraticable (transpilation), la validation est ré-implémentée en JavaScript
 * pur, à l'identique. Un test de non-divergence est prévu au Lot 7 pour
 * garantir que les deux définitions ne s'écartent jamais.
 *
 * Aucun secret n'y figure jamais : le mode IA (fournisseur) oui, la clé non.
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const RACINE = process.env.CDH_PROJECT_ROOT ?? process.cwd();

export const SLUG = /^[a-z0-9-]+$/;
export const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

export const MODES_FOURNISSEUR = [
  "local",
  "none",
  "ollama",
  "anthropic",
  "openai",
  "openrouter",
  "mistral",
];
export const STATUTS = ["prototype", "interne", "production"];
export const TYPES = ["documentaire", "observation"];
export const CLASSIFICATIONS = ["publique", "interne"];

/** Chemin absolu du manifeste d'un cas. */
export function cheminManifeste(slug) {
  return path.join(RACINE, "cases", slug, "harnais.yaml");
}

const estChaineNonVide = (v) => typeof v === "string" && v.trim().length > 0;

/**
 * Valide un objet manifeste (miroir du schéma zod strict de src/lib/manifest.ts).
 * @param {unknown} m
 * @returns {{ ok: boolean, erreurs: string[] }}
 */
export function validerManifeste(m) {
  const erreurs = [];
  const err = (chemin, msg) => erreurs.push(`${chemin} : ${msg}`);

  if (m === null || typeof m !== "object" || Array.isArray(m)) {
    return { ok: false, erreurs: ["(racine) : objet attendu"] };
  }

  // Clés inconnues → erreur explicite (schéma strict).
  const clesAutorisees = new Set([
    "version",
    "slug",
    "type",
    "besoin",
    "publics",
    "modules",
    "sources_declarees",
    "classification_autorisee",
    "refus_complementaires",
    "fournisseur",
    "etat",
  ]);
  for (const cle of Object.keys(m)) {
    if (!clesAutorisees.has(cle)) err(cle, "clé inconnue (schéma strict)");
  }

  if (m.version !== 1) err("version", "version attendue : 1");
  if (!estChaineNonVide(m.slug) || !SLUG.test(m.slug)) {
    err("slug", "slug attendu en minuscules ([a-z0-9-])");
  }
  if (!TYPES.includes(m.type)) err("type", "type attendu : documentaire ou observation");
  if (!estChaineNonVide(m.besoin)) err("besoin", "besoin requis");

  if (!Array.isArray(m.publics) || m.publics.length < 1) {
    err("publics", "au moins un public attendu");
  } else if (!m.publics.every(estChaineNonVide)) {
    err("publics", "chaque public doit être une chaîne non vide");
  }

  const mod = m.modules;
  if (mod === null || typeof mod !== "object" || Array.isArray(mod)) {
    err("modules", "objet attendu (parcours, faq, quiz, checklist)");
  } else {
    for (const k of ["parcours", "faq", "quiz", "checklist"]) {
      if (typeof mod[k] !== "boolean") err(`modules.${k}`, "booléen attendu");
    }
    for (const k of Object.keys(mod)) {
      if (!["parcours", "faq", "quiz", "checklist"].includes(k)) {
        err(`modules.${k}`, "clé inconnue (schéma strict)");
      }
    }
  }

  if (!Array.isArray(m.sources_declarees)) {
    err("sources_declarees", "liste attendue");
  } else {
    m.sources_declarees.forEach((s, i) => {
      const p = `sources_declarees[${i}]`;
      if (s === null || typeof s !== "object") {
        err(p, "objet attendu (titre, proprietaire, date_connue)");
        return;
      }
      if (!estChaineNonVide(s.titre)) err(`${p}.titre`, "titre requis");
      if (!estChaineNonVide(s.proprietaire)) {
        err(`${p}.proprietaire`, "propriétaire requis (une fonction, jamais une personne)");
      }
      if (!DATE_ISO.test(s.date_connue ?? "")) {
        err(`${p}.date_connue`, "date_connue attendue au format AAAA-MM-JJ");
      }
      for (const k of Object.keys(s)) {
        if (!["titre", "proprietaire", "date_connue"].includes(k)) {
          err(`${p}.${k}`, "clé inconnue (schéma strict)");
        }
      }
    });
  }

  if (!Array.isArray(m.classification_autorisee) || m.classification_autorisee.length < 1) {
    err("classification_autorisee", "au moins une classification autorisée");
  } else if (!m.classification_autorisee.every((c) => CLASSIFICATIONS.includes(c))) {
    err("classification_autorisee", "valeurs attendues : publique ou interne");
  }

  if (!Array.isArray(m.refus_complementaires)) {
    err("refus_complementaires", "liste attendue");
  } else {
    m.refus_complementaires.forEach((r, i) => {
      const p = `refus_complementaires[${i}]`;
      if (r === null || typeof r !== "object") {
        err(p, "objet attendu (motif, renvoi)");
        return;
      }
      if (!estChaineNonVide(r.motif)) err(`${p}.motif`, "motif du refus requis");
      if (!estChaineNonVide(r.renvoi)) {
        err(`${p}.renvoi`, "fonction de renvoi requise (jamais une personne)");
      }
      for (const k of Object.keys(r)) {
        if (!["motif", "renvoi"].includes(k)) err(`${p}.${k}`, "clé inconnue (schéma strict)");
      }
    });
  }

  const f = m.fournisseur;
  if (f === null || typeof f !== "object" || Array.isArray(f)) {
    err("fournisseur", "objet attendu (mode)");
  } else {
    if (!MODES_FOURNISSEUR.includes(f.mode)) {
      err(
        "fournisseur.mode",
        "mode de fournisseur inconnu (attendu : local, none, ollama, anthropic, openai, openrouter ou mistral)",
      );
    }
    for (const k of Object.keys(f)) {
      if (k !== "mode") err(`fournisseur.${k}`, "clé inconnue (schéma strict)");
    }
  }

  const e = m.etat;
  if (e === null || typeof e !== "object" || Array.isArray(e)) {
    err("etat", "objet attendu (etape, statut, mis_a_jour)");
  } else {
    if (!Number.isInteger(e.etape) || e.etape < 1 || e.etape > 15) {
      err("etat.etape", "étape : entier entre 1 et 15");
    }
    if (!STATUTS.includes(e.statut)) {
      err("etat.statut", "statut attendu : prototype, interne ou production");
    }
    if (!DATE_ISO.test(e.mis_a_jour ?? "")) {
      err("etat.mis_a_jour", "mis_a_jour attendu au format AAAA-MM-JJ");
    }
    for (const k of Object.keys(e)) {
      if (!["etape", "statut", "mis_a_jour"].includes(k)) {
        err(`etat.${k}`, "clé inconnue (schéma strict)");
      }
    }
  }

  return { ok: erreurs.length === 0, erreurs };
}

/**
 * Charge et valide le manifeste du cas `slug`. Lève une erreur FR explicite si
 * le fichier est absent, illisible ou non conforme.
 * @param {string} slug
 * @returns {object}
 */
export function chargerManifeste(slug) {
  if (!SLUG.test(slug ?? "")) {
    throw new Error(`Slug de cas invalide : « ${slug} » (attendu : [a-z0-9-]).`);
  }
  const chemin = cheminManifeste(slug);
  if (!fs.existsSync(chemin)) {
    throw new Error(
      `Manifeste introuvable : cases/${slug}/harnais.yaml. ` +
        `Lancez d'abord l'atelier (/fabrique) ou « npm run interview ».`,
    );
  }
  let brut;
  try {
    brut = yaml.load(fs.readFileSync(chemin, "utf8"));
  } catch (e) {
    throw new Error(
      `Manifeste illisible (cases/${slug}/harnais.yaml) : YAML invalide. ${e.message}`,
    );
  }
  const { ok, erreurs } = validerManifeste(brut);
  if (!ok) {
    const details = erreurs.map((x) => `  - ${x}`).join("\n");
    throw new Error(`Manifeste invalide (cases/${slug}/harnais.yaml) :\n${details}`);
  }
  return brut;
}

/**
 * Écrit le manifeste du cas `slug` via `js-yaml.dump` (jamais par concaténation).
 * Par défaut, valide strictement avant d'écrire ; passer `{ valider: false }`
 * pour un brouillon intermédiaire (interview en cours). Renvoie le chemin écrit.
 * @param {string} slug
 * @param {object} manifeste
 * @param {{ valider?: boolean }} [options]
 * @returns {string}
 */
export function ecrireManifeste(slug, manifeste, { valider = true } = {}) {
  if (!SLUG.test(slug ?? "")) {
    throw new Error(`Slug de cas invalide : « ${slug} » (attendu : [a-z0-9-]).`);
  }
  if (valider) {
    const { ok, erreurs } = validerManifeste(manifeste);
    if (!ok) {
      const details = erreurs.map((x) => `  - ${x}`).join("\n");
      throw new Error(`Refus d'écrire un manifeste invalide (cases/${slug}) :\n${details}`);
    }
  }
  const chemin = cheminManifeste(slug);
  fs.mkdirSync(path.dirname(chemin), { recursive: true });
  const contenu = yaml.dump(manifeste, { lineWidth: 100, noRefs: true, sortKeys: false });
  fs.writeFileSync(chemin, contenu, "utf8");
  return chemin;
}

/**
 * Squelette de manifeste pour un cas neuf, rempli au fil de l'interview. Les
 * champs textuels sont vides : l'objet n'est PAS valide au sens strict tant que
 * l'interview n'a pas collecté les réponses (écriture en brouillon d'ici là).
 * @param {string} slug
 * @param {string} [misAJour] date AAAA-MM-JJ (fournie par l'appelant : pas d'horloge ici)
 * @returns {object}
 */
export function manifesteInitial(slug, misAJour) {
  return {
    version: 1,
    slug,
    type: "documentaire",
    besoin: "",
    publics: [],
    modules: { parcours: true, faq: true, quiz: true, checklist: true },
    sources_declarees: [],
    classification_autorisee: ["publique", "interne"],
    refus_complementaires: [],
    fournisseur: { mode: "local" },
    etat: { etape: 1, statut: "prototype", mis_a_jour: misAJour ?? "" },
  };
}
