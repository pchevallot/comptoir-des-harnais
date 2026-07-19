import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import yaml from "js-yaml";

/**
 * Tests des scripts déterministes (Lot 7).
 *
 * Robustes et non interactifs : tout passe par `--json`, les codes de sortie et
 * des racines de projet isolées (`CDH_PROJECT_ROOT`) — jamais par simulation de
 * TTY. Chaque script est éprouvé sur au moins un cas nominal et un cas d'échec.
 *
 * Les fixtures négatives (motif interdit, refus déclaré non testé) vivent sous
 * `tests/scripts/fixtures/` et sont exclues du balayage anti-motifs du dépôt.
 */

const RACINE = process.cwd();
const FIXTURES = path.join(RACINE, "tests", "scripts", "fixtures");

/** Exécute un script du dépôt. `root` alimente CDH_PROJECT_ROOT (données isolées). */
function run(script: string, args: string[], root?: string) {
  return spawnSync("node", [path.join("scripts", script), ...args], {
    cwd: RACINE,
    env: { ...process.env, ...(root ? { CDH_PROJECT_ROOT: root } : {}) },
    encoding: "utf8",
  });
}

/** Exécute un script `--json` et renvoie { status, json }. */
function runJson(script: string, args: string[], root?: string) {
  const res = run(script, [...args, "--json"], root);
  let json: { ok: boolean; erreurs: string[]; avertissements: string[] } | null = null;
  try {
    json = JSON.parse(res.stdout);
  } catch {
    json = null;
  }
  return { status: res.status, json, brut: res.stdout + res.stderr };
}

describe("validate-corpus", () => {
  it("cas nominal : le corpus onboarding-agents est conforme (code 0)", () => {
    const { status, json } = runJson("validate-corpus.mjs", ["--cas", "onboarding-agents"]);
    expect(status).toBe(0);
    expect(json?.ok).toBe(true);
    expect(json?.erreurs).toHaveLength(0);
  });

  it("fixture piégée : un motif interdit dans une source est détecté (code 1)", () => {
    const root = path.join(FIXTURES, "corpus-motif-interdit");
    const { status, json } = runJson("validate-corpus.mjs", ["--cas", "piege"], root);
    expect(status).toBe(1);
    expect(json?.ok).toBe(false);
    expect(json?.erreurs.some((e) => e.includes("motif interdit"))).toBe(true);
  });
});

describe("validate-guardrails", () => {
  it("cas nominal : couverture des refus cohérente (code 0)", () => {
    const { status, json } = runJson("validate-guardrails.mjs", ["--cas", "onboarding-agents"]);
    expect(status).toBe(0);
    expect(json?.ok).toBe(true);
    expect(json?.erreurs).toHaveLength(0);
  });

  it("fixture : un refus déclaré mais non testé est détecté (code 1)", () => {
    const root = path.join(FIXTURES, "guardrails-refus-non-teste");
    const { status, json } = runJson("validate-guardrails.mjs", ["--cas", "refus-non-teste"], root);
    expect(status).toBe(1);
    expect(json?.ok).toBe(false);
    expect(json?.erreurs.some((e) => e.includes("refus déclaré non testé"))).toBe(true);
  });
});

describe("scaffold", () => {
  let root = "";

  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "cdh-scaffold-"));
    // Le scaffold lit le gabarit depuis <root>/templates : on le copie.
    fs.cpSync(path.join(RACINE, "templates"), path.join(root, "templates"), { recursive: true });
    // Prérequis : un manifeste de cas valide.
    const manifeste = {
      version: 1,
      slug: "essai-test",
      type: "documentaire",
      besoin: "Besoin de test pour le scaffold, sans situation individuelle.",
      publics: ["nouveaux agents"],
      modules: { parcours: true, faq: true, quiz: true, checklist: true },
      sources_declarees: [],
      classification_autorisee: ["publique", "interne"],
      refus_complementaires: [],
      fournisseur: { mode: "local" },
      etat: { etape: 10, statut: "prototype", mis_a_jour: "2026-07-19" },
    };
    const dest = path.join(root, "cases", "essai-test", "harnais.yaml");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, yaml.dump(manifeste), "utf8");
  });

  afterAll(() => {
    if (root) fs.rmSync(root, { recursive: true, force: true });
  });

  it("première génération : des fichiers sont créés (code 0)", () => {
    const res = run("scaffold-harness.mjs", ["--cas", "essai-test"], root);
    expect(res.status).toBe(0);
    expect(res.stdout).toMatch(/Terminé : [1-9]\d* fichier/);
  });

  it("relance : idempotent — rien n'est recréé ni détruit (code 0)", () => {
    const res = run("scaffold-harness.mjs", ["--cas", "essai-test"], root);
    expect(res.status).toBe(0);
    expect(res.stdout).toMatch(/Terminé : 0 fichier/);
    expect(res.stdout).toContain("Conservé (inchangé)");
  });
});

describe("interview --demo", () => {
  let root = "";

  beforeAll(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "cdh-interview-"));
    fs.cpSync(path.join(RACINE, "templates"), path.join(root, "templates"), { recursive: true });
  });

  afterAll(() => {
    if (root) fs.rmSync(root, { recursive: true, force: true });
  });

  it("déroule les 15 étapes sans TTY et sort en code 0", () => {
    const res = run("interview-harness.mjs", ["--demo"], root);
    expect(res.status, res.stdout + res.stderr).toBe(0);
    // Un manifeste de cas jetable a été produit (slug du gabarit de démo).
    const manifeste = path.join(root, "cases", "demo-atelier", "harnais.yaml");
    expect(fs.existsSync(manifeste), `manifeste attendu : ${manifeste}`).toBe(true);
  });
});
