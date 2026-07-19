import Link from "next/link";
import { getSources } from "@/lib/content";
import { ClassificationBadge } from "@/components/Badges";

/** Page « sources et dates de mise à jour » — le registre rendu visible (§6.1-7). */
export default function Sources() {
  const sources = getSources();
  return (
    <>
      <h1>Sources & dates de mise à jour</h1>
      <p>
        Toutes les réponses et fiches de ce portail s'appuient <strong>exclusivement</strong> sur
        les sources ci-dessous. Chaque source indique son propriétaire (une fonction), sa date de
        version, son statut et son périmètre. Une information sans source n'a pas sa place ici.
      </p>

      <div className="panneau panneau-info">
        <p style={{ margin: 0 }}>
          Vous adaptez le portail à votre collectivité ? Partez de vos documents Word/PDF existants
          et convertissez-les en sources vérifiées :{" "}
          <Link href="/sources/adapter">comment adapter ses sources</Link>.
        </p>
      </div>

      <div className="registre">
        {sources.map((s) => (
          <div key={s.id} className="carte">
            <div className="badges" style={{ marginBottom: "0.5rem" }}>
              <span className="badge badge-source">{s.id}</span>
              <span className={`badge ${s.statut === "active" ? "badge-statut-production" : "badge-statut-prototype"}`}>
                {s.statut === "active" ? "Active" : "Périmée"}
              </span>
              <ClassificationBadge niveau={s.classification} />
              {s.fictif && <span className="badge">Fictive</span>}
            </div>
            <h3 style={{ margin: "0 0 0.5rem" }}>{s.titre}</h3>
            <dl style={{ margin: 0 }}>
              <div>
                <dt>Propriétaire</dt>
                <dd>{s.proprietaire}</dd>
              </div>
              <div>
                <dt>Date de version</dt>
                <dd>{s.date}</dd>
              </div>
              <div>
                <dt>Périmètre</dt>
                <dd>{s.perimetre}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <p className="mentions">
        Registre dérivé directement des fichiers de <code>content/demo-onboarding-rh/sources/</code>.
        Contenus entièrement fictifs.
      </p>
    </>
  );
}
