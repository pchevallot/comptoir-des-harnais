import Link from "next/link";
import { getConfig } from "@/lib/config";
import { chargerManifeste, type Manifeste } from "@/lib/manifest";

/**
 * Navigation métier (nommée en langage DRH / nouvel arrivant, pas technique).
 *
 * **Composant serveur** (aucun `use client`) : la navigation reflète le cas
 * actif. Une rubrique portant un `module` n'est affichée que si le module
 * correspondant est activé dans le manifeste (`manifeste.modules`) — l'atelier
 * de la fabrique décide, à l'étape 6, quelles rubriques existent pour ce
 * harnais. La route directe reste servie par Next : masquer l'entrée ne la
 * supprime pas, elle disparaît seulement du menu du cas.
 */
type ModuleNav = keyof Manifeste["modules"];

const RUBRIQUES: { href: string; libelle: string; module?: ModuleNav }[] = [
  { href: "/", libelle: "Accueil" },
  { href: "/parcours", libelle: "Parcours d'accueil", module: "parcours" },
  { href: "/fiches", libelle: "Fiches pratiques" },
  { href: "/faq", libelle: "Questions / réponses", module: "faq" },
  { href: "/quiz", libelle: "Quiz", module: "quiz" },
  { href: "/checklist", libelle: "Checklist RH", module: "checklist" },
  { href: "/sources", libelle: "Sources & dates" },
  { href: "/limites", libelle: "Limites & refus" },
  { href: "/gouvernance", libelle: "Gouvernance" },
  { href: "/configuration-ia", libelle: "Configuration IA" },
  { href: "/fabrique", libelle: "Fabrique (atelier)" },
];

export function Nav() {
  const config = getConfig();
  const manifeste = chargerManifeste(config.cas);
  const rubriques = RUBRIQUES.filter((r) => !r.module || manifeste.modules[r.module]);

  return (
    <nav className="nav" aria-label="Navigation principale">
      <div className="nav-interne">
        {rubriques.map((r) => (
          <Link key={r.href} href={r.href}>
            {r.libelle}
          </Link>
        ))}
      </div>
    </nav>
  );
}
