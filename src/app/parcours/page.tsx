import Link from "next/link";
import { getParcours } from "@/lib/content";

/** Parcours nouvel arrivant : modules et étapes ordonnés, progression visible (§6.1-2). */
export default function Parcours() {
  const modules = getParcours();
  return (
    <>
      <h1>Parcours d'accueil du nouvel arrivant</h1>
      <p>
        Ce parcours suit vos premiers repères, module par module. Chaque étape renvoie vers une
        fiche pratique sourcée. Aucune progression n'est enregistrée : ce portail ne conserve rien.
      </p>

      <ol className="registre" style={{ listStyle: "none", padding: 0, counterReset: "mod" }}>
        {modules.map((m, i) => (
          <li key={m.id} className="carte">
            <div className="badges" style={{ marginBottom: "0.5rem" }}>
              <span className="badge badge-source">Module {i + 1}</span>
            </div>
            <h2 style={{ marginTop: 0 }}>{m.titre}</h2>
            <p className="muet">{m.objectif}</p>
            <ul>
              {m.etapes.map((e, j) => (
                <li key={j}>
                  <strong>{e.titre}</strong> — {e.description}{" "}
                  {e.fiche && (
                    <Link href={`/fiches/${e.fiche}`}>Voir la fiche</Link>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {modules.length === 0 && (
        <div className="panneau">Aucun module de parcours n'est encore défini dans le contenu.</div>
      )}
    </>
  );
}
