import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { StatutBadge } from "@/components/Badges";
import { getConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Comptoir des Harnais — Portail d'accueil documentaire",
  description:
    "Application d'onboarding RH documentaire, configurable, sourcée et gouvernée. " +
    "Démonstration à données fictives. Ce n'est pas un SIRH.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = getConfig();
  return (
    <html lang="fr">
      <body>
        <a href="#contenu-principal" className="lien-evitement">
          Aller au contenu principal
        </a>

        <div className="bandeau-demo" role="note">
          Données fictives — démonstration. Aucune donnée personnelle réelle.
        </div>

        <header className="entete">
          <div className="entete-interne">
            <Link href="/" className="logo-emplacement" aria-label="Accueil du portail">
              {/* Emplacement réservé au logo officiel (asset validé à fournir). */}
              <span className="logo-carre" aria-hidden="true">
                CdH
              </span>
              <span className="logo-texte">
                Comptoir des Harnais
                <small>{config.harnais.nom} — {config.organisation.nom}</small>
              </span>
            </Link>
            <span style={{ marginLeft: "auto" }}>
              <StatutBadge statut={config.harnais.statut} />
            </span>
          </div>
        </header>

        <Nav />

        <main id="contenu-principal" className="contenu">
          {children}
        </main>

        <footer className="pied">
          <div className="pied-interne">
            <p>
              <strong>{config.organisation.nom}</strong> — {config.harnais.nom}.{" "}
              <StatutBadge statut={config.harnais.statut} />
            </p>
            <p className="petit muet">
              Portail documentaire d'accueil. Ce n'est pas un SIRH, ni un outil de gestion de
              dossiers d'agents, ni un outil de décision individuelle. Il ne conserve aucune donnée
              saisie par les visiteurs. Ce cadre <strong>ne vaut pas validation juridique</strong>.
            </p>
            <p className="petit muet">
              Modèle utilisé : {config.modele.nom_affiche}. Contenus de démonstration entièrement
              fictifs.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
