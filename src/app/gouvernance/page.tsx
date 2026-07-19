import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getConfig } from "@/lib/config";
import { getDocGouvernance, getSources, getFiches } from "@/lib/content";
import { chargerManifeste } from "@/lib/manifest";
import { CASE_DIR } from "@/lib/paths";
import { Markdown } from "@/components/Markdown";
import { StatutBadge } from "@/components/Badges";

/** Page « gouvernance » (§6.1-9, §9) : responsables, statut, classification, journal. */
export default function Gouvernance() {
  const config = getConfig();
  const manifeste = chargerManifeste(config.cas);
  const validation = getDocGouvernance("fiche-validation");
  const journal = getDocGouvernance("journal");
  const classificationDoc = getDocGouvernance("classification");

  const nbSources = getSources().length;
  const nbFiches = getFiches().length;
  const rapportExiste = fs.existsSync(path.join(CASE_DIR, "rapport-gouvernance.md"));

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
        <h2>Synthèse du harnais</h2>
        <div className="badges">
          <span className="badge">Type : {manifeste.type}</span>
          <StatutBadge statut={manifeste.etat.statut} />
          <span className="badge">{nbSources} sources</span>
          <span className="badge">{nbFiches} fiches</span>
          <span className="badge">Mode IA : {manifeste.fournisseur.mode}</span>
        </div>
        <p className="petit muet" style={{ marginTop: "0.75rem" }}>
          Cas <code>{manifeste.slug}</code> — état lu au manifeste{" "}
          <code>cases/{manifeste.slug}/harnais.yaml</code>. Le parcours de fabrication (15 étapes)
          est visible dans l'<Link href="/fabrique">atelier de la fabrique</Link>.
        </p>
        {rapportExiste ? (
          <p>
            Un <strong>rapport de gouvernance</strong> a été produit à l'étape 15 : registre des
            sources, refus couverts, mode IA et synthèse des validations, avec la mention « ne vaut
            pas validation juridique ». C'est le document versionné à remettre au DPO, à la DSI et à
            la direction. Fichier : <code>cases/{manifeste.slug}/rapport-gouvernance.md</code> —
            régénérable par <code>npm run rapport -- --cas {manifeste.slug}</code>.
          </p>
        ) : (
          <p className="petit muet">
            Aucun rapport de gouvernance n'a encore été produit pour ce cas (étape 15 :{" "}
            <code>npm run rapport -- --cas {manifeste.slug}</code>).
          </p>
        )}
      </section>

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
