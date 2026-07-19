import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { validerManifeste as validerTS, chargerManifeste } from "@/lib/manifest";
// Miroir côté scripts (JavaScript pur) — doit accepter/refuser exactement les
// mêmes objets que le schéma zod de src/lib/manifest.ts.
import { validerManifeste as validerMJS } from "../../scripts/lib/manifeste.mjs";

/**
 * Tests du manifeste (Lot 7) :
 *  1. le manifeste réel du cas « onboarding-agents » est valide ;
 *  2. schéma strict : cas valides acceptés, cas invalides refusés ;
 *  3. non-divergence : le lecteur TS (zod) et le lecteur script (JS pur)
 *     rendent le même verdict ok/non-ok sur chaque cas.
 */

const RACINE = process.cwd();

/** Manifeste valide de référence (clone à chaque appel pour muter sans effet de bord). */
function manifesteValide(): Record<string, unknown> {
  return {
    version: 1,
    slug: "cas-test",
    type: "documentaire",
    besoin: "Un besoin documentaire général, sans aucune situation individuelle.",
    publics: ["nouveaux agents"],
    modules: { parcours: true, faq: true, quiz: true, checklist: true },
    sources_declarees: [
      { titre: "Une source", proprietaire: "Direction des ressources humaines", date_connue: "2025-06-30" },
    ],
    classification_autorisee: ["publique", "interne"],
    refus_complementaires: [],
    fournisseur: { mode: "local" },
    etat: { etape: 15, statut: "prototype", mis_a_jour: "2026-07-19" },
  };
}

describe("Manifeste — cas réel", () => {
  it("le manifeste onboarding-agents est valide (TS et script)", () => {
    const brut = yaml.load(
      fs.readFileSync(path.join(RACINE, "cases", "onboarding-agents", "harnais.yaml"), "utf8"),
    );
    expect(validerTS(brut).ok, JSON.stringify(validerTS(brut).erreurs)).toBe(true);
    expect(validerMJS(brut).ok, JSON.stringify(validerMJS(brut).erreurs)).toBe(true);
    // chargerManifeste (lecture + validation + cache) ne lève pas.
    expect(() => chargerManifeste("onboarding-agents")).not.toThrow();
  });
});

describe("Manifeste — schéma strict et non-divergence TS ↔ script", () => {
  const casValides: Array<[string, Record<string, unknown>]> = [
    ["référence", manifesteValide()],
    ["fournisseur anthropic", { ...manifesteValide(), fournisseur: { mode: "anthropic" } }],
    ["statut production", { ...manifesteValide(), etat: { etape: 1, statut: "production", mis_a_jour: "2026-01-01" } }],
    ["sources_declarees vide", { ...manifesteValide(), sources_declarees: [] }],
  ];

  const casInvalides: Array<[string, Record<string, unknown>]> = [
    ["version fausse", { ...manifesteValide(), version: 2 }],
    ["slug majuscule", { ...manifesteValide(), slug: "Cas-Test" }],
    ["type inconnu", { ...manifesteValide(), type: "sirh" }],
    ["besoin vide", { ...manifesteValide(), besoin: "" }],
    ["publics vide", { ...manifesteValide(), publics: [] }],
    ["module manquant", { ...manifesteValide(), modules: { parcours: true, faq: true, quiz: true } }],
    ["module en trop", {
      ...manifesteValide(),
      modules: { parcours: true, faq: true, quiz: true, checklist: true, extra: true },
    }],
    ["classification interdite", { ...manifesteValide(), classification_autorisee: ["secret"] }],
    ["fournisseur inconnu", { ...manifesteValide(), fournisseur: { mode: "gpt-maison" } }],
    ["etape hors bornes", { ...manifesteValide(), etat: { etape: 16, statut: "prototype", mis_a_jour: "2026-07-19" } }],
    ["date mal formée", { ...manifesteValide(), etat: { etape: 3, statut: "prototype", mis_a_jour: "19/07/2026" } }],
    ["clé inconnue à la racine", { ...manifesteValide(), inconnu: true }],
    ["source sans date", {
      ...manifesteValide(),
      sources_declarees: [{ titre: "X", proprietaire: "Direction" }],
    }],
    ["refus sans renvoi", {
      ...manifesteValide(),
      refus_complementaires: [{ motif: "un motif" }],
    }],
  ];

  for (const [nom, m] of casValides) {
    it(`accepté (TS et script) : ${nom}`, () => {
      expect(validerTS(m).ok, `TS: ${JSON.stringify(validerTS(m).erreurs)}`).toBe(true);
      expect(validerMJS(m).ok, `MJS: ${JSON.stringify(validerMJS(m).erreurs)}`).toBe(true);
    });
  }

  for (const [nom, m] of casInvalides) {
    it(`refusé (TS et script) : ${nom}`, () => {
      expect(validerTS(m).ok, `TS a accepté à tort : ${nom}`).toBe(false);
      expect(validerMJS(m).ok, `MJS a accepté à tort : ${nom}`).toBe(false);
    });
  }
});
