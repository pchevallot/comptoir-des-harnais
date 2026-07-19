import Link from "next/link";
import { getFiches } from "@/lib/content";
import { StatutBadge } from "@/components/Badges";

/** Bibliothèque de fiches, avec sources, dates et statuts affichés (§6.1-3). */
export default function Fiches() {
  const fiches = getFiches();
  return (
    <>
      <h1>Fiches pratiques</h1>
      <p>
        Des fiches courtes, sourcées et datées. Chaque fiche indique ses sources, sa date de mise à
        jour et son statut. Ouvrez une fiche pour voir le détail.
      </p>

      <div className="grille">
        {fiches.map((f) => (
          <article key={f.slug} className="carte">
            <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>
              <Link href={`/fiches/${f.slug}`}>{f.titre}</Link>
            </h2>
            <p className="muet">{f.resume}</p>
            <div className="badges">
              <StatutBadge statut={f.statut} />
              <span className="badge petit">Mise à jour : {f.date}</span>
              {f.sources.map((id) => (
                <span key={id} className="badge badge-source">
                  {id}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {fiches.length === 0 && (
        <div className="panneau">Aucune fiche n'est encore définie dans le contenu.</div>
      )}
    </>
  );
}
