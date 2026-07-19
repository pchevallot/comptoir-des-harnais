import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { getFiches, getSources } from "@/lib/content";
// Source unique de vérité des motifs interdits, partagée avec les scripts
// (scripts/lib/motifs-interdits.mjs) — aucune regex n'est redéfinie ici.
import { MOTIFS_SECRET, MOTIFS_PII } from "../../scripts/lib/motifs-interdits.mjs";

/**
 * Tests de structure et de sécurité du dépôt (PRD §10.3-5 à 8).
 * Protègent le dépôt lui-même : contenus complets, pas de secrets, pas de
 * données personnelles réalistes, marquage « données fictives ».
 */

const RACINE = process.cwd();

function listerFichiers(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  const ignorer = new Set(["node_modules", ".next", ".git", "logs", "out", "dist", "coverage"]);
  const parcourir = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (ignorer.has(e.name)) continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) parcourir(p);
      else if (exts.some((x) => e.name.endsWith(x))) out.push(p);
    }
  };
  parcourir(dir);
  return out;
}

describe("Structure des contenus", () => {
  it("chaque source a les champs obligatoires et est marquée fictive", () => {
    const sources = getSources();
    expect(sources.length).toBeGreaterThan(0);
    for (const s of sources) {
      expect(s.id, s.chemin).toMatch(/^SRC-\d+/);
      expect(s.titre.length, s.chemin).toBeGreaterThan(0);
      expect(s.proprietaire.length, s.chemin).toBeGreaterThan(0);
      expect(s.date, s.chemin).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(s.fictif, `${s.chemin} doit être marquée fictif: true`).toBe(true);
      expect(["publique", "interne"]).toContain(s.classification);
    }
  });

  it("les identifiants de sources sont uniques", () => {
    const ids = getSources().map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("chaque fiche cite au moins une source, toutes présentes dans le registre", () => {
    const registre = new Set(getSources().map((s) => s.id));
    for (const f of getFiches()) {
      expect(f.sources.length, `${f.chemin} : aucune source`).toBeGreaterThan(0);
      for (const id of f.sources) {
        expect(registre.has(id), `${f.chemin} cite ${id} absente du registre`).toBe(true);
      }
      expect(f.limites.trim().length, `${f.chemin} : limites manquantes`).toBeGreaterThan(0);
    }
  });
});

describe("Sécurité du dépôt", () => {
  const fichiersTexte = listerFichiers(RACINE, [
    ".ts", ".tsx", ".js", ".mjs", ".md", ".yml", ".yaml", ".json", ".css",
  ]);

  it("aucun motif de secret (clé d'API) dans le dépôt", () => {
    const fautifs: string[] = [];
    for (const f of fichiersTexte) {
      const contenu = fs.readFileSync(f, "utf8");
      if (MOTIFS_SECRET.some((m) => m.regex.test(contenu))) fautifs.push(path.relative(RACINE, f));
    }
    expect(fautifs, `secrets potentiels : ${fautifs.join(", ")}`).toHaveLength(0);
  });

  it(".env.example ne contient aucune valeur de secret renseignée", () => {
    const p = path.join(RACINE, ".env.example");
    const lignes = fs.readFileSync(p, "utf8").split("\n");
    const cleRenseignee = lignes.find((l) => /^\s*ANTHROPIC_API_KEY\s*=\s*\S+/.test(l));
    expect(cleRenseignee, `valeur trouvée : ${cleRenseignee}`).toBeUndefined();
  });

  it("aucune donnée personnelle réaliste dans les contenus (content/)", () => {
    const fichiersContenu = listerFichiers(path.join(RACINE, "content"), [".md", ".yml", ".yaml"]);
    // Motifs partagés avec validate-corpus : courriel plausible (hors exemple.fr),
    // téléphone français, NIR, IBAN.
    const fautifs: string[] = [];
    for (const f of fichiersContenu) {
      const contenu = fs.readFileSync(f, "utf8");
      if (MOTIFS_PII.some((m) => m.regex.test(contenu))) {
        fautifs.push(path.relative(RACINE, f));
      }
    }
    expect(fautifs, `données réalistes détectées : ${fautifs.join(", ")}`).toHaveLength(0);
  });

  it("le marquage « données fictives » est présent dans la mise en page", () => {
    const layout = fs.readFileSync(path.join(RACINE, "src", "app", "layout.tsx"), "utf8");
    expect(layout).toContain("Données fictives");
  });
});
