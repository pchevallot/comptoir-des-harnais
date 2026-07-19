/**
 * Motifs interdits — source unique de vérité, partagée entre les scripts
 * (`validate-corpus`) et les tests de structure (`tests/structure/`).
 *
 * Objectif : ne JAMAIS dupliquer une expression régulière de détection entre le
 * script de validation et le test. Les deux importent ce module, donc zéro
 * divergence possible (piège documenté au handoff Lot 3).
 *
 * Deux familles :
 *   - MOTIFS_SECRET : marqueurs de clés / secrets (interdits partout dans le dépôt) ;
 *   - MOTIFS_PII    : données personnelles réalistes (interdites dans les contenus).
 *
 * Aucun de ces motifs n'utilise le drapeau `g` : `.test()` reste sans état.
 */

/** Marqueurs de secrets (clés d'API, clés privées). Interdits dans tout le dépôt. */
export const MOTIFS_SECRET = [
  { nom: "clé d'API de type « sk-… »", regex: /sk-[A-Za-z0-9]{16,}/ },
  { nom: "clé d'accès AWS (AKIA…)", regex: /AKIA[0-9A-Z]{16}/ },
  {
    nom: "clé privée au format PEM",
    regex: /-----BEGIN\s+(RSA|OPENSSH|PRIVATE)\s+KEY-----/,
  },
];

/**
 * Données personnelles réalistes. Interdites dans les contenus : le cadre est
 * documentaire (règles générales), jamais nominatif. Un courriel en
 * `exemple.fr` / `example.*` / `fictif.*` est explicitement toléré (exemples).
 */
export const MOTIFS_PII = [
  {
    nom: "courriel plausible (hors domaine d'exemple)",
    regex: /[A-Za-z0-9._%+-]+@(?!exemple\.|example\.|fictif\.)[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
  },
  {
    nom: "numéro de téléphone français",
    regex: /\b0[1-9](?:[ .]?\d{2}){4}\b/,
  },
  {
    nom: "numéro de sécurité sociale (NIR)",
    regex: /\b[12]\d{2}(?:[ ]?\d{2}){5}\b/,
  },
  {
    nom: "IBAN",
    regex: /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]{4}){4,7}(?:[ ]?[A-Z0-9]{1,3})?\b/,
  },
];

/** Ensemble complet des motifs interdits (secrets + données personnelles). */
export const MOTIFS_INTERDITS = [...MOTIFS_SECRET, ...MOTIFS_PII];

/**
 * Renvoie la liste des motifs (objets `{ nom, regex }`) détectés dans `texte`.
 * @param {string} texte
 * @param {{nom: string, regex: RegExp}[]} [motifs]
 * @returns {{nom: string, regex: RegExp}[]}
 */
export function motifsDetectes(texte, motifs = MOTIFS_INTERDITS) {
  return motifs.filter((m) => m.regex.test(texte));
}
