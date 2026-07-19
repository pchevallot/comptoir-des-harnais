import { getConfig } from "@/lib/config";
import { getDocGouvernance } from "@/lib/content";
import { Markdown } from "@/components/Markdown";
import { StatutBadge } from "@/components/Badges";

/** Page « gouvernance » (§6.1-9, §9) : responsables, statut, classification, journal. */
export default function Gouvernance() {
  const config = getConfig();
  const validation = getDocGouvernance("fiche-validation");
  const journal = getDocGouvernance("journal");
  const classificationDoc = getDocGouvernance("classification");

  return (
    <>
      <h1>Gouvernance</h1>

      <div className="panneau panneau-alerte">
        <p style={{ margin: 0 }}>
          Ce cadre aide à documenter et à sécuriser un usage d'IA générative. Il ne constitue ni un
          audit juridique, ni un avis de conformité RGPD ou AI Act, ni une homologation de sécurité,
          et <strong>ne vaut pas validation juridique</strong>. Ces qualifications relèvent du DPO,
          des juristes, du RSSI et des instances de décision de chaque organisation.
        </p>
      </div>

      <section>
        <h2>Responsables (fonctions)</h2>
        <div className="grille">
          <div className="carte">
            <h3>Responsable métier</h3>
            <p>{config.gouvernance.responsable_metier}</p>
          </div>
          <div className="carte">
            <h3>Protection des données (DPO)</h3>
            <p>{config.gouvernance.dpo}</p>
          </div>
          <div className="carte">
            <h3>Sécurité (DSI / RSSI)</h3>
            <p>{config.gouvernance.dsi_rssi}</p>
          </div>
        </div>
        <p className="petit muet">
          Seules des fonctions sont nommées, jamais des personnes (démonstration).
        </p>
      </section>

      <section>
        <h2>Statut du harnais</h2>
        <p>
          <StatutBadge statut={config.harnais.statut} />
        </p>
        <p>
          Trois statuts existent : <strong>prototype</strong> (comprendre et démontrer),{" "}
          <strong>usage interne</strong> (diffusé à des agents identifiés, fiche de validation
          signée) et <strong>mise en production</strong> (au-delà de l'équipe, revue DSI/DPO/RSSI
          effectuée). Le passage d'un statut à l'autre est une décision humaine tracée, jamais un
          effet de l'outil.
        </p>
      </section>

      <section>
        <h2>Classification des données</h2>
        <div className="badges">
          {config.gouvernance.classification_donnees.map((c) => (
            <span key={c} className="badge">
              {c}
            </span>
          ))}
        </div>
        <p className="petit">
          Règle V1 : ce harnais ne traite que des données <strong>publique</strong> et{" "}
          <strong>interne</strong>. Toute donnée personnelle ou sensible rend le cas inéligible en
          l'état et impose un renvoi vers le DPO.
        </p>
        {classificationDoc && <Markdown>{classificationDoc}</Markdown>}
      </section>

      {validation && (
        <section>
          <h2>Fiche de validation</h2>
          <Markdown>{validation}</Markdown>
        </section>
      )}

      {journal && (
        <section>
          <h2>Journal de mise à jour</h2>
          <Markdown>{journal}</Markdown>
        </section>
      )}
    </>
  );
}
