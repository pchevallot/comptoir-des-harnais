/**
 * Configuration Next.js — Comptoir des Harnais.
 * Sobre par choix : aucune télémétrie, aucun appel réseau implicite.
 * Les seuls appels sortants possibles sont ceux d'un fournisseur de modèle
 * explicitement configuré via .env (voir src/lib/model/). Par défaut, le
 * fournisseur « local » ne fait aucun appel réseau.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le contenu métier est lu depuis le système de fichiers (dossier content/).
  // On expose la racine du projet aux composants serveur via une variable interne.
  env: {
    CDH_PROJECT_ROOT: process.cwd(),
  },
};

export default nextConfig;
