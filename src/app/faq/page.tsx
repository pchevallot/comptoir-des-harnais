import { FaqClient } from "./FaqClient";

/** Page FAQ documentaire (§6.1-4). La logique de réponse est côté serveur. */
export default function Faq() {
  return (
    <>
      <h1>Questions / réponses documentaires</h1>
      <p>
        Posez une question d'accueil (par exemple : « Combien de jours de télétravail sont
        possibles&nbsp;? »). La réponse est produite <strong>uniquement à partir des sources</strong>{" "}
        du portail, et cite ces sources. Une question sur une situation individuelle reçoit un refus
        courtois : c'est la règle du harnais.
      </p>

      <div className="panneau panneau-info">
        <strong>Bon à savoir.</strong> Ce portail ne répond jamais sur le cas d'une personne
        nommée ou identifiable. Essayez la différence entre « Combien de jours de télétravail sont
        possibles&nbsp;? » (réponse sourcée) et « Est-ce que Madame Martin a droit au
        télétravail&nbsp;? » (refus, renvoi RH).
      </div>

      <FaqClient />
    </>
  );
}
