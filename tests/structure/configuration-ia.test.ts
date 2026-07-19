import { describe, it, expect, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  PROVIDERS,
  getProviderInfo,
  FOURNISSEURS_OPENAI_COMPATIBLES,
  type ProviderId,
} from "@/lib/model/catalogue";
import { getProvider, providerConfigureId, nomModeleAffiche } from "@/lib/model";
import { OpenAiCompatibleProvider } from "@/lib/model/openai-compatible";
import { diagnostiquerConfiguration } from "@/lib/model/diagnostic";

/**
 * Configuration IA multi-fournisseurs (PRD §6.2, §7.2, §9.2-12).
 * Vérifie le catalogue, la fabrique, le diagnostic et — surtout — qu'aucune clé
 * n'est jamais exposée (ni côté client, ni dans le diagnostic).
 */

const RACINE = process.cwd();

// Sauvegarde/restaure l'environnement modifié par les tests de fabrique.
const ENV = { ...process.env };
afterEach(() => {
  process.env = { ...ENV };
});

describe("Catalogue des fournisseurs", () => {
  const attendus: ProviderId[] = [
    "local",
    "none",
    "anthropic",
    "openai",
    "openrouter",
    "mistral",
    "ollama",
  ];

  it("expose tous les fournisseurs demandés", () => {
    for (const id of attendus) {
      expect(PROVIDERS.map((p) => p.id)).toContain(id);
    }
  });

  it("chaque fournisseur a des métadonnées complètes", () => {
    for (const p of PROVIDERS) {
      expect(p.nom.length, p.id).toBeGreaterThan(0);
      expect(p.resume.length, p.id).toBeGreaterThan(0);
      expect(p.souverainete.length, p.id).toBeGreaterThan(0);
      expect(p.exempleEnv, p.id).toContain("MODEL_PROVIDER=");
      expect(typeof p.reseau, p.id).toBe("boolean");
      expect(typeof p.clefRequise, p.id).toBe("boolean");
    }
  });

  it("le mode local est hors ligne et sans clé", () => {
    const local = getProviderInfo("local");
    expect(local.reseau).toBe(false);
    expect(local.clefRequise).toBe(false);
    expect(local.baseUrlDefaut).toBeNull();
  });

  it("ollama appelle le réseau mais sans clé (souveraineté locale)", () => {
    const ollama = getProviderInfo("ollama");
    expect(ollama.reseau).toBe(true);
    expect(ollama.clefRequise).toBe(false);
    expect(ollama.baseUrlDefaut).toContain("localhost");
  });

  it("les fournisseurs à clé ont une URL de service par défaut", () => {
    for (const id of ["anthropic", "openai", "openrouter", "mistral"] as ProviderId[]) {
      const info = getProviderInfo(id);
      expect(info.clefRequise, id).toBe(true);
      expect(info.reseau, id).toBe(true);
      expect(info.baseUrlDefaut, id).toMatch(/^https?:\/\//);
    }
  });

  it("aucun exemple de configuration ne contient de vraie clé", () => {
    for (const p of PROVIDERS) {
      expect(/sk-[A-Za-z0-9]{16,}/.test(p.exempleEnv), p.id).toBe(false);
    }
  });

  it("getProviderInfo retombe sur local pour un identifiant inconnu", () => {
    expect(getProviderInfo("inexistant").id).toBe("local");
  });
});

describe("Fabrique de fournisseur", () => {
  it("retourne le fournisseur local par défaut", () => {
    delete process.env.MODEL_PROVIDER;
    expect(getProvider()?.nom).toBe("local");
    expect(providerConfigureId()).toBe("local");
  });

  it("retourne null en mode none (FAQ désactivée)", () => {
    process.env.MODEL_PROVIDER = "none";
    expect(getProvider()).toBeNull();
  });

  it("route les fournisseurs compatibles OpenAI", () => {
    for (const id of FOURNISSEURS_OPENAI_COMPATIBLES) {
      process.env.MODEL_PROVIDER = id;
      expect(getProvider()?.nom, id).toBe(id);
    }
  });

  it("un fournisseur à clé sans clé n'est pas disponible (dégradation, pas de fuite)", () => {
    process.env.MODEL_PROVIDER = "openai";
    delete process.env.MODEL_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    const p = new OpenAiCompatibleProvider("openai");
    expect(p.estDisponible()).toBe(false);
  });

  it("ollama est disponible sans clé dès qu'une URL et un modèle existent", () => {
    process.env.MODEL_PROVIDER = "ollama";
    delete process.env.MODEL_API_KEY;
    delete process.env.MODEL_BASE_URL;
    delete process.env.MODEL_NAME;
    const p = new OpenAiCompatibleProvider("ollama");
    // URL et modèle par défaut fournis par le catalogue.
    expect(p.estDisponible()).toBe(true);
  });

  it("nomModeleAffiche privilégie MODEL_DISPLAY_NAME puis le nom du fournisseur", () => {
    process.env.MODEL_PROVIDER = "mistral";
    process.env.MODEL_DISPLAY_NAME = "mon-libellé";
    expect(nomModeleAffiche()).toBe("mon-libellé");
    delete process.env.MODEL_DISPLAY_NAME;
    expect(nomModeleAffiche()).toBe(getProviderInfo("mistral").nom);
  });
});

describe("Diagnostic de configuration — aucune fuite de clé", () => {
  it("n'expose JAMAIS la valeur d'une clé, seulement sa présence", () => {
    const FAUSSE_CLE = "[REDACTED_TEST_API_KEY]";
    process.env.MODEL_PROVIDER = "anthropic";
    process.env.MODEL_API_KEY = FAUSSE_CLE;
    const d = diagnostiquerConfiguration();
    expect(d.clefPresente).toBe(true);
    // La valeur ne doit apparaître nulle part dans l'objet sérialisé.
    expect(JSON.stringify(d)).not.toContain(FAUSSE_CLE);
    // Aucune propriété ne porte une valeur ressemblant à une clé.
    expect(JSON.stringify(d)).not.toMatch(/sk-[A-Za-z0-9]{16,}/);
  });

  it("signale la clé manquante pour un fournisseur réseau à clé", () => {
    process.env.MODEL_PROVIDER = "openai";
    delete process.env.MODEL_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    const d = diagnostiquerConfiguration();
    expect(d.statut).toBe("cle-manquante");
    expect(d.clefPresente).toBe(false);
  });

  it("mode local : hors ligne, aucune clé requise", () => {
    process.env.MODEL_PROVIDER = "local";
    const d = diagnostiquerConfiguration();
    expect(d.statut).toBe("hors-ligne");
    expect(d.reseau).toBe(false);
  });
});

describe("Non-exposition des secrets côté client", () => {
  function listerTsx(dir: string): string[] {
    const out: string[] = [];
    const ignorer = new Set(["node_modules", ".next", ".git"]);
    const parcourir = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        if (ignorer.has(e.name)) continue;
        const p = path.join(d, e.name);
        if (e.isDirectory()) parcourir(p);
        else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
      }
    };
    parcourir(dir);
    return out;
  }

  const fichiers = listerTsx(path.join(RACINE, "src"));

  it("aucun composant « use client » ne lit une clé de modèle ni le diagnostic", () => {
    const fautifs: string[] = [];
    for (const f of fichiers) {
      const contenu = fs.readFileSync(f, "utf8");
      const estClient = /^["']use client["']/m.test(contenu);
      if (!estClient) continue;
      if (
        /MODEL_API_KEY|ANTHROPIC_API_KEY/.test(contenu) ||
        /model\/diagnostic/.test(contenu)
      ) {
        fautifs.push(path.relative(RACINE, f));
      }
    }
    expect(fautifs, `client expose des secrets : ${fautifs.join(", ")}`).toHaveLength(0);
  });

  it("aucune variable NEXT_PUBLIC_ ne porte une clé de modèle", () => {
    for (const f of fichiers) {
      const contenu = fs.readFileSync(f, "utf8");
      expect(/NEXT_PUBLIC_[A-Z_]*API_KEY/.test(contenu), path.relative(RACINE, f)).toBe(false);
    }
  });
});
