import Link from "next/link";

/** Navigation métier (nommée en langage DRH / nouvel arrivant, pas technique). */
export const RUBRIQUES: { href: string; libelle: string }[] = [
  { href: "/", libelle: "Accueil" },
  { href: "/parcours", libelle: "Parcours d'accueil" },
  { href: "/fiches", libelle: "Fiches pratiques" },
  { href: "/faq", libelle: "Questions / réponses" },
  { href: "/quiz", libelle: "Quiz" },
  { href: "/checklist", libelle: "Checklist RH" },
  { href: "/sources", libelle: "Sources & dates" },
  { href: "/limites", libelle: "Limites & refus" },
  { href: "/gouvernance", libelle: "Gouvernance" },
  { href: "/configuration-ia", libelle: "Configuration IA" },
];

export function Nav() {
  return (
    <nav className="nav" aria-label="Navigation principale">
      <div className="nav-interne">
        {RUBRIQUES.map((r) => (
          <Link key={r.href} href={r.href}>
            {r.libelle}
          </Link>
        ))}
      </div>
    </nav>
  );
}
