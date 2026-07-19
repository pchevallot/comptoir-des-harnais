/**
 * Validation de forme des réponses du parcours et application au manifeste.
 *
 * Fonctions **pures et importables sans TTY** (condition du Lot 5a) : l'atelier
 * web et l'interview CLI les partagent, aucune logique de validation n'est
 * dupliquée côté client. Aucune valeur de secret n'est manipulée ici.
 *
 * Règles de forme (PRD v0.3 §4) : dates `AAAA-MM-JJ`, heuristique anti-« Prénom
 * Nom » (une fonction n'est jamais une personne), slug `[a-z0-9-]+`, minimums
 * (ex. les 3 refus de l'étape 8).
 */
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { DATE_ISO, SLUG, manifesteInitial, ecrireManifeste } from "../manifeste.mjs";
import { racine } from "../cli.mjs";

/** Vocabulaire de fonction : si un mot en fait partie, la réponse n'est pas « Prénom Nom ». */
const MOTS_FONCTION = new Set([
  "direction",
  "service",
  "pôle",
  "pole",
  "secrétariat",
  "secretariat",
  "mairie",
  "commune",
  "communauté",
  "communaute",
  "syndicat",
  "cellule",
  "bureau",
  "délégué",
  "delegue",
  "déléguée",
  "deleguee",
  "responsable",
  "directeur",
  "directrice",
  "chef",
  "cheffe",
  "agence",
  "centre",
  "établissement",
  "etablissement",
  "collectivité",
  "collectivite",
  "générale",
  "generale",
  "général",
  "general",
  "médecine",
  "medecine",
  "juridique",
  "informatique",
]);

const COMMENCE_MAJUSCULE = /^[A-ZÀ-ÖØ-Þ]/;
const MOT_ALPHA = /^[A-Za-zÀ-ÖØ-öø-ÿ'’-]+$/;

/**
 * Heuristique : la valeur ressemble-t-elle à « Prénom Nom » (une personne) ?
 * Vrai si exactement deux mots alphabétiques commençant par une majuscule et
 * qu'aucun n'appartient au vocabulaire de fonction. Les fonctions réelles
 * (« Direction des ressources humaines », « Secrétariat général ») ne sont pas
 * concernées (mots de liaison en minuscules ou vocabulaire de fonction présent).
 * @param {string} valeur
 * @returns {boolean}
 */
export function ressembleANomDePersonne(valeur) {
  const mots = String(valeur ?? "").trim().split(/\s+/);
  if (mots.length !== 2) return false;
  if (!mots.every((m) => COMMENCE_MAJUSCULE.test(m) && MOT_ALPHA.test(m))) return false;
  if (mots.some((m) => MOTS_FONCTION.has(m.toLowerCase()))) return false;
  return true;
}

const VRAI = new Set(["o", "oui", "y", "yes", "true", "vrai"]);
const FAUX = new Set(["n", "non", "no", "false", "faux", ""]);

/**
 * Valide une réponse selon le type de question. Renvoie `{ ok, valeur, erreur }`
 * où `valeur` est la valeur normalisée (booléen, tableau, chaîne nettoyée…).
 * @param {{ type: string, options?: string[] }} question
 * @param {string} brut
 * @returns {{ ok: boolean, valeur?: unknown, erreur?: string }}
 */
export function validerReponse(question, brut) {
  const v = String(brut ?? "").trim();
  switch (question.type) {
    case "date":
      if (!DATE_ISO.test(v)) return { ok: false, erreur: "date attendue au format AAAA-MM-JJ" };
      return { ok: true, valeur: v };
    case "slug":
      if (!SLUG.test(v)) return { ok: false, erreur: "slug attendu en minuscules ([a-z0-9-])" };
      return { ok: true, valeur: v };
    case "booleen": {
      const bas = v.toLowerCase();
      if (VRAI.has(bas)) return { ok: true, valeur: true };
      if (FAUX.has(bas)) return { ok: true, valeur: false };
      return { ok: false, erreur: "réponse attendue : o/n" };
    }
    case "enum":
      if (!question.options?.includes(v)) {
        return { ok: false, erreur: `valeur attendue parmi : ${question.options?.join(", ")}` };
      }
      return { ok: true, valeur: v };
    case "liste": {
      const items = v
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
      if (items.length === 0) return { ok: false, erreur: "au moins une valeur attendue" };
      return { ok: true, valeur: items };
    }
    case "fonction":
      if (v.length === 0) return { ok: false, erreur: "une fonction est attendue (non vide)" };
      if (ressembleANomDePersonne(v)) {
        return {
          ok: false,
          erreur: "indiquez une FONCTION (ex. Direction des ressources humaines), jamais un nom de personne",
        };
      }
      return { ok: true, valeur: v };
    case "texte":
    default:
      if (v.length === 0) return { ok: false, erreur: "réponse non vide attendue" };
      return { ok: true, valeur: v };
  }
}

/**
 * Vérifie qu'un nombre d'éléments collectés atteint le minimum d'une étape.
 * @param {number} nombre
 * @param {number} minimum
 * @returns {{ ok: boolean, erreur?: string }}
 */
export function verifierMinimum(nombre, minimum) {
  if (nombre < minimum) {
    return { ok: false, erreur: `minimum ${minimum} attendu(s), ${nombre} fourni(s)` };
  }
  return { ok: true };
}

/**
 * Applique une valeur à un chemin pointé (« organisation.nom », « modules.faq »)
 * dans un objet, en créant les niveaux intermédiaires. Utilitaire partagé pour
 * matérialiser les réponses dans le manifeste ou la config.
 * @param {Record<string, unknown>} cible
 * @param {string} chemin
 * @param {unknown} valeur
 */
export function affecterChemin(cible, chemin, valeur) {
  const segments = chemin.split(".");
  let noeud = cible;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const s = segments[i];
    if (typeof noeud[s] !== "object" || noeud[s] === null) noeud[s] = {};
    noeud = noeud[s];
  }
  noeud[segments[segments.length - 1]] = valeur;
}

// --- Application d'une collecte complète aux fichiers du cas -----------------
// La collecte est indexée par numéro d'étape (voir templates/.../reponses-demo.yaml
// et scripts/lib/atelier/etapes.mjs). Cette fonction est partagée par le CLI et
// (Lot 5a) l'API de l'atelier : les deux produisent des fichiers identiques.

const slugifie = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);

function rendreFicheBesoin(collecte) {
  const c2 = collecte[2] ?? {};
  const publics = (collecte[6]?.publics ?? []).join(", ");
  return [
    "# Fiche besoin",
    "",
    `**Besoin.** ${c2.besoin ?? ""}`,
    "",
    `**Publics.** ${publics || "(à préciser)"}`,
    `**Type.** Harnais ${collecte[1]?.type ?? "documentaire"}.`,
    "",
    "*Cette fiche décrit une règle générale ; elle ne traite aucune situation individuelle.*",
    "",
  ].join("\n");
}

function rendreClassification(collecte) {
  const classif = collecte[5]?.classification ?? "interne";
  const perso = collecte[5]?.donnees_personnelles === true;
  return [
    "# Classification des données",
    "",
    `Classification retenue (périmètre V1, uniquement publique ou interne) : **${classif}**.`,
    "",
    perso
      ? "> Des sources contiennent des éléments personnels : elles sont marquées `ineligible` et renvoyées au **DPO** (elles ne sont pas servies par le portail)."
      : "> Aucune donnée personnelle déclarée dans les sources.",
    "",
    "Rappel : toute donnée personnelle ou sensible est hors de ce cadre → DPO.",
    "",
  ].join("\n");
}

function rendreLimitesRefus(collecte) {
  const refus = collecte[8] ?? [];
  const lignes = [
    "# Limites et refus",
    "",
    "Ce portail est un outil **documentaire**. Il transmet des informations générales,",
    "sourcées et datées. Il **ne vaut pas validation juridique**.",
    "",
    "## Ce qu'il ne fait jamais (socle non négociable)",
    "",
    "- **Traiter un cas individuel.** Aucune question sur une personne nommée ou",
    "  identifiable, ni sur une situation personnelle. Renvoi vers le service RH.",
    "- **Rendre un avis juridique.** Renvoi vers le service juridique.",
    "- **Rendre un avis médical ou d'aptitude.** Renvoi vers la médecine du travail.",
    "- **Affirmer sans source.** Hors de son corpus, il répond « je ne sais pas ».",
    "- **Promettre un droit ou une conformité.** Il informe, il ne garantit rien.",
    "",
  ];
  if (refus.length) {
    lignes.push("## Refus complémentaires propres à ce cas", "");
    for (const r of refus) lignes.push(`- **${r.motif}** → renvoi : ${r.renvoi}.`);
    lignes.push("");
  }
  return lignes.join("\n");
}

function rendreComportement(collecte) {
  const cas = [];
  (collecte[7] ?? []).forEach((q, i) => {
    cas.push({
      id: `reponse-sourcee-${i + 1}`,
      type: "comportement",
      question: q.question,
      attendu: {
        refuse: false,
        issue: "sourcee",
        cite_source: q.cite_source,
        mentionne: q.mots_attendus ?? [],
      },
    });
  });
  (collecte[8] ?? []).forEach((r, i) => {
    cas.push({
      id: `refus-${slugifie(r.motif) || i + 1}`,
      type: "comportement",
      couvre: r.motif,
      question: r.motif,
      attendu: { refuse: true, issue: "refus", renvoi_contient: r.renvoi },
    });
  });
  return yaml.dump(cas, { lineWidth: 100, noRefs: true, sortKeys: false });
}

/**
 * Matérialise une collecte complète : manifeste, config, gouvernance, tests.
 * @param {string} slug
 * @param {Record<number, unknown>} collecte  réponses normalisées par étape
 * @param {{ date: string }} contexte  date AAAA-MM-JJ (pas d'horloge dans la lib)
 * @returns {{ fichiers: string[] }}
 */
export function appliquerCollecte(slug, collecte, { date }) {
  const fichiers = [];
  const ecrire = (abs, contenu) => {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, contenu, "utf8");
    fichiers.push(path.relative(racine(), abs));
  };
  const caseDir = path.join(racine(), "cases", slug);

  // Manifeste
  const m = manifesteInitial(slug, date);
  m.type = collecte[1]?.type ?? "documentaire";
  m.besoin = collecte[2]?.besoin ?? "";
  m.publics = collecte[6]?.publics ?? [];
  m.modules = {
    parcours: collecte[6]?.["modules.parcours"] ?? true,
    faq: collecte[6]?.["modules.faq"] ?? true,
    quiz: collecte[6]?.["modules.quiz"] ?? true,
    checklist: collecte[6]?.["modules.checklist"] ?? true,
  };
  m.sources_declarees = (collecte[4] ?? []).map((s) => ({
    titre: s.titre,
    proprietaire: s.proprietaire,
    date_connue: s.date_connue,
  }));
  m.classification_autorisee = collecte[5]?.classification
    ? [...new Set([collecte[5].classification])]
    : ["publique", "interne"];
  m.refus_complementaires = (collecte[8] ?? []).map((r) => ({ motif: r.motif, renvoi: r.renvoi }));
  m.fournisseur = { mode: collecte[9]?.["fournisseur.mode"] ?? "local" };
  m.etat = { etape: 15, statut: "prototype", mis_a_jour: date };
  fichiers.push(path.relative(racine(), ecrireManifeste(slug, m)));

  // Config du cas
  const org = {
    nom: collecte[3]?.["organisation.nom"] ?? "(organisation)",
    type: collecte[3]?.["organisation.type"] ?? "(type)",
    fictive: collecte[3]?.["organisation.fictive"] ?? true,
  };
  const config = {
    cas: slug,
    organisation: org,
    harnais: {
      nom: `Portail documentaire — ${org.nom}`,
      statut: "prototype",
      besoin: m.besoin,
    },
    gouvernance: {
      responsable_metier: collecte[3]?.["gouvernance.responsable_metier"] ?? "(à désigner)",
      dpo: collecte[3]?.["gouvernance.dpo"] ?? "(à désigner)",
      dsi_rssi: collecte[3]?.["gouvernance.dsi_rssi"] ?? "(à désigner)",
      classification_donnees: m.classification_autorisee,
    },
    modele: { nom_affiche: "recherche documentaire locale" },
    seuil_anciennete_mois: 24,
  };
  ecrire(
    path.join(racine(), "configs", `${slug}.yml`),
    yaml.dump(config, { lineWidth: 100, noRefs: true, sortKeys: false }),
  );

  // Gouvernance + tests
  ecrire(path.join(caseDir, "gouvernance", "fiche-besoin.md"), rendreFicheBesoin(collecte));
  ecrire(path.join(caseDir, "gouvernance", "classification.md"), rendreClassification(collecte));
  ecrire(path.join(caseDir, "gouvernance", "limites-refus.md"), rendreLimitesRefus(collecte));
  ecrire(path.join(caseDir, "tests", "comportement.yaml"), rendreComportement(collecte));

  return { fichiers };
}
