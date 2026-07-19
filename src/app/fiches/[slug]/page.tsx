import { notFound } from "next/navigation";
import Link from "next/link";
import { getFiche, getFiches, getSource } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { StatutBadge } from "@/components/Badges";

export function generateStaticParams() {
  return getFiches().map((f) => ({ slug: f.slug }));
}

/** Fiche détaillée avec mentions obligatoires : Sources, Limites, Date, Statut (§10.2). */
export default async function FicheDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const fiche = getFiche(slug);
  if (!fiche) notFound();

  return (
    <article>
      <p className="petit">
        <Link href="/fiches">← Toutes les fiches</Link>
      </p>
      <h1>{fiche.titre}</h1>
      <p className="muet">{fiche.resume}</p>

      <Markdown>{fiche.contenu}</Markdown>

      {/* --- Mentions obligatoires (toujours présentes) --- */}
      <hr />
      <section aria-label="Mentions obligatoires de la fiche">
        <h2>Sources</h2>
        {fiche.sources.length > 0 ? (
          <ul>
            {fiche.sources.map((id) => {
              const s = getSource(id);
              return (
                <li key={id}>
                  <Link href="/sources">{id}</Link>
                  {s ? ` — ${s.titre} (version du ${s.date})` : " — source introuvable dans le registre"}
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Aucune source rattachée.</p>
        )}

        <h2>Limites de ce document</h2>
        <p>{fiche.limites}</p>

        <h2>Date de mise à jour</h2>
        <p>{fiche.date}</p>

        <h2>Statut</h2>
        <p>
          <StatutBadge statut={fiche.statut} />
        </p>
      </section>

      <p className="mentions">
        Fiche documentaire à données fictives. Elle décrit une règle générale et ne traite aucune
        situation individuelle. Ce cadre ne vaut pas validation juridique.
      </p>
    </article>
  );
}
