import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Configuration des tests (Vitest).
 * Les tests s'exécutent en environnement Node (accès au système de fichiers
 * pour lire content/ et configs/), sans navigateur, de façon déterministe et
 * sans aucune clé de modèle : le fournisseur « local » est utilisé.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    reporters: ["default"],
    globals: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
