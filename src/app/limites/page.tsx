import { getDocGouvernance } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

/** Page « limites et refus » — alignée sur le comportement réel du moteur (§6.1-8). */
export default function Limites() {
  const doc = getDocGouvernance("limites-refus");
  return (
    <>
      <h1>Limites & refus</h1>
      <p>
        Ce portail est <strong>documentaire</strong>. Pour rester fiable et à sa place, il refuse
        volontairement certaines questions. Ce n'est pas une panne : c'est la règle centrale du
        harnais, et ce comportement est <strong>vérifié automatiquement par les tests</strong>.
      </p>

      <div className="panneau panneau-alerte">
        <h2 style={{ marginTop: 0 }}>Ce que le portail refuse toujours</h2>
        <ul>
          <li>
            <strong>Les cas individuels</strong> : toute question sur une personne nommée ou
            identifiable, ou sur une situation individuelle → renvoi vers le service RH.
          </li>
          <li>
            <strong>Les avis juridiques</strong> → renvoi vers le service juridique.
          </li>
          <li>
            <strong>Les avis médicaux ou d'aptitude</strong> → renvoi vers la médecine du travail.
          </li>
          <li>
            <strong>Les affirmations sans source</strong> : hors de son corpus, le portail répond
            « je ne sais pas » et renvoie vers l'humain, plutôt que d'improviser.
          </li>
          <li>
            <strong>Les promesses de droit ou de conformité</strong> : il informe, il ne garantit
            rien.
          </li>
        </ul>
      </div>

      {doc && <Markdown>{doc}</Markdown>}

      <p className="mentions">
        Ce cadre <strong>ne vaut pas validation juridique</strong>. Les qualifications relèvent du
        DPO, des juristes, du RSSI et des instances de décision de l'organisation.
      </p>
    </>
  );
}
