import Link from "next/link";
import { getConfig } from "@/lib/config";
import { chargerManifeste } from "@/lib/manifest";
import { StatutBadge } from "@/components/Badges";

/**
 * Atelier de la fabrique — tableau de bord (version minimale, Lot 1).
 *
 * Rendu **dynamique** : l'état (étape, statut) est lu au manifeste à chaque
 * requête, pas figé au build, pour que les Lots 5a/5b y branchent les actions
 * guidées et l'API sans changer de modèle de rendu. Les sous-routes
 * (`/fabrique/nouveau`, `/fabrique/[slug]`, étapes, rapport) et l'API arrivent
 * plus tard.
 */
export const dynamic = "force-dynamic";

/** Une étape du parcours guidé. Libellés repris du PRD v0.3 §4 (tableau). */
interface Etape {
  n: number;
  libelle: string;
  skill: string;
  script: string;
  /** Route interne de la preuve visible, si elle existe. */
  lien?: string;
  /** Chemin de fichier produit, si la preuve n'a pas de page. */
  chemin?: string;
}

const ETAPES: Etape[] = [
  { n: 1, libelle: "Choisir le type de harnais", skill: "cadrer-besoin-public", script: "lib/atelier", lien: "/gouvernance" },
  { n: 2, libelle: "Cadrer le besoin", skill: "cadrer-besoin-public", script: "lib/atelier", lien: "/" },
  { n: 3, libelle: "Décrire l'organisation", skill: "cadrer-besoin-public", script: "lib/atelier", lien: "/gouvernance" },
  { n: 4, libelle: "Déclarer les sources", skill: "classifier-sources", script: "lib/atelier", lien: "/sources" },
  { n: 5, libelle: "Classer les données", skill: "classifier-sources", script: "lib/atelier", lien: "/gouvernance" },
  { n: 6, libelle: "Définir les publics", skill: "cadrer-besoin-public", script: "lib/atelier", chemin: "cases/onboarding-agents/harnais.yaml" },
  { n: 7, libelle: "Questions autorisées", skill: "concevoir-garde-fous", script: "lib/atelier", lien: "/faq" },
  { n: 8, libelle: "Définir les refus", skill: "concevoir-garde-fous", script: "lib/atelier", lien: "/limites" },
  { n: 9, libelle: "Choisir le fournisseur IA", skill: "configurer-fournisseur-ia", script: "validate-provider-config", lien: "/configuration-ia" },
  { n: 10, libelle: "Générer la structure", skill: "—", script: "scaffold-harness", chemin: "cases/onboarding-agents/" },
  { n: 11, libelle: "Importer/contrôler le corpus", skill: "adapter-corpus-onboarding", script: "import-source, validate-corpus", lien: "/sources" },
  { n: 12, libelle: "Générer/assembler l'application", skill: "—", script: "generate-onboarding-demo", lien: "/" },
  { n: 13, libelle: "Exécuter les tests", skill: "generer-tests-harnais", script: "npm test, validate-guardrails", chemin: "cases/onboarding-agents/tests/comportement.yaml" },
  { n: 14, libelle: "Ouvrir l'application du cas", skill: "—", script: "npm run dev", lien: "/" },
  { n: 15, libelle: "Produire le rapport de gouvernance", skill: "verifier-securite-rgpd", script: "build-harness-report", chemin: "cases/onboarding-agents/rapport-gouvernance.md" },
];

export default function Fabrique() {
  const config = getConfig();
  const manifeste = chargerManifeste(config.cas);
  const { etape, statut, mis_a_jour } = manifeste.etat;

  return (
    <>
      <h1>Atelier de la fabrique</h1>

      <div className="panneau panneau-info">
        <p style={{ marginTop: 0 }}>
          <strong>Comptoir des Harnais</strong> est une fabrique pédagogique de harnais IA pour
          acteurs publics. Elle vous interroge sur votre besoin, génère la structure de votre
          harnais, contrôle vos sources et vos garde-fous, puis assemble une application locale
          sourcée et gouvernée. Ce tableau de bord montre l'état du premier harnais produit.
        </p>
        <p className="petit muet" style={{ marginBottom: 0 }}>
          Version minimale de l'atelier (Lot 1). Les étapes guidées dans le navigateur et l'API
          locale arrivent aux lots suivants. En attendant, le circuit est pilotable en ligne de
          commande (<code>npm run interview</code> à venir). L'état ci-dessous est lu au manifeste à
          chaque affichage.
        </p>
      </div>

      <section>
        <h2>Harnais : {manifeste.slug}</h2>
        <p>
          <StatutBadge statut={statut} /> &nbsp;
          <span className="badge">Type : {manifeste.type}</span> &nbsp;
          <span className="badge">Étape {etape} / 15</span>
        </p>
        <p className="petit muet">
          Servi pour la <strong>{config.organisation.nom}</strong>. Manifeste :{" "}
          <code>cases/{manifeste.slug}/harnais.yaml</code> — mis à jour le {mis_a_jour}.
        </p>
        <p>{manifeste.besoin}</p>
      </section>

      <section>
        <h2>Progression du parcours (15 étapes)</h2>
        <p className="petit muet">
          Chaque étape mobilise une skill et un script déterministe, et laisse une preuve visible
          dans l'application ou un fichier versionné.
        </p>
        <ol className="etapes-fabrique">
          {ETAPES.map((e) => {
            const franchie = e.n <= etape;
            return (
              <li key={e.n} className={franchie ? "etape franchie" : "etape"}>
                <span className="etape-marque" aria-hidden="true">
                  {franchie ? "✓" : e.n}
                </span>
                <div>
                  <strong>
                    {e.n}. {e.libelle}
                  </strong>
                  <div className="petit muet">
                    Skill : {e.skill} · Script : {e.script}
                  </div>
                  <div className="petit">
                    Preuve :{" "}
                    {e.lien ? (
                      <Link href={e.lien}>{e.lien}</Link>
                    ) : (
                      <code>{e.chemin}</code>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="panneau">
        <h2 style={{ marginTop: 0 }}>Ce que l'atelier ne fait jamais</h2>
        <ul>
          <li>Aucune saisie de clé IA dans le navigateur : la configuration reste côté serveur (<code>.env.local</code>).</li>
          <li>Aucune écriture hors du dépôt : l'API locale (à venir) n'écrit que dans <code>cases/</code>, <code>content/cases/</code> et <code>configs/</code>.</li>
          <li>Aucune validation confiée au modèle : les contrôles sont des scripts reproductibles.</li>
        </ul>
      </section>
    </>
  );
}
