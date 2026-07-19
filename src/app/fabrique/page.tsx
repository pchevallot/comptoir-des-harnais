import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { getConfig } from "@/lib/config";
import { chargerManifeste } from "@/lib/manifest";
import { getSources, getFiches } from "@/lib/content";
import { CASE_DIR } from "@/lib/paths";
import { StatutBadge } from "@/components/Badges";

/**
 * Atelier de la fabrique — tableau de bord de l'état réel du cas (Lot 5).
 *
 * Rendu **dynamique** : l'état (étape, statut, modules) est lu au manifeste et
 * au corpus à chaque requête, jamais figé au build. La page montre **l'état de
 * ce harnais** — pas la méthode complète — pour être lisible et filmable par un
 * public non technique (DGS/DRH/agents/élus). Chaque étape relie une skill, un
 * script déterministe et une **preuve réelle** (une page de l'application ou un
 * fichier versionné). Les sous-routes interactives (`/fabrique/nouveau`,
 * `/fabrique/[slug]/etape/[n]`) et l'API relèvent d'un lot ultérieur.
 */
export const dynamic = "force-dynamic";

/** Une étape du parcours guidé. Libellés et skill/script alignés sur
 *  `scripts/lib/atelier/etapes.mjs` (source unique du parcours) et PRD v0.3 §4. */
interface Etape {
  n: number;
  libelle: string;
  /** Skill mobilisée (fichier `skills/<skill>/SKILL.md`), ou null si action déterministe pure. */
  skill: string | null;
  /** Script ou moteur déterministe qui exécute l'étape. */
  script: string;
  /** Preuve visible dans l'application (route interne). */
  lien?: string;
  /** Preuve sous forme de fichier versionné, si elle n'a pas de page. */
  chemin?: string;
  /** Libellé court de la preuve (ce qu'on va y voir). */
  preuve: string;
  /** Commande équivalente rejouable en ligne de commande (encart « en coulisse »). */
  commande?: string;
}

const ETAPES: Etape[] = [
  { n: 1, libelle: "Choisir le type de harnais", skill: "cadrer-besoin-public", script: "lib/atelier", chemin: "cases/onboarding-agents/harnais.yaml", preuve: "type « documentaire » inscrit au manifeste" },
  { n: 2, libelle: "Cadrer le besoin", skill: "cadrer-besoin-public", script: "lib/atelier", lien: "/", preuve: "le besoin, repris mot pour mot sur l'accueil" },
  { n: 3, libelle: "Décrire l'organisation", skill: "cadrer-besoin-public", script: "lib/atelier", lien: "/gouvernance", preuve: "les responsables, nommés par fonction" },
  { n: 4, libelle: "Déclarer les sources", skill: "classifier-sources", script: "lib/atelier", lien: "/sources", preuve: "le registre des sources, daté" },
  { n: 5, libelle: "Classer les données", skill: "classifier-sources", script: "lib/atelier", lien: "/gouvernance", preuve: "la classification (publique / interne)" },
  { n: 6, libelle: "Définir les publics", skill: "cadrer-besoin-public", script: "lib/atelier", chemin: "cases/onboarding-agents/harnais.yaml", preuve: "publics et modules activés (pilotent la navigation)" },
  { n: 7, libelle: "Questions autorisées", skill: "concevoir-garde-fous", script: "lib/atelier", lien: "/faq", preuve: "une question sourcée reçoit sa réponse et sa source" },
  { n: 8, libelle: "Définir les refus", skill: "concevoir-garde-fous", script: "lib/atelier", lien: "/limites", preuve: "les refus affichés (cas individuel, avis juridique/médical)" },
  { n: 9, libelle: "Choisir le fournisseur IA", skill: "configurer-fournisseur-ia", script: "validate-provider-config", lien: "/configuration-ia", preuve: "le mode retenu, sans jamais afficher de clé", commande: "npm run validate-provider -- --cas onboarding-agents" },
  { n: 10, libelle: "Générer la structure", skill: null, script: "scaffold-harness", chemin: "cases/onboarding-agents/", preuve: "l'arborescence du cas, créée à l'identique", commande: "npm run scaffold -- --cas onboarding-agents" },
  { n: 11, libelle: "Importer / contrôler le corpus", skill: "adapter-corpus-onboarding", script: "import-source, validate-corpus", lien: "/sources", preuve: "le corpus contrôlé fichier par fichier", commande: "npm run validate-corpus -- --cas onboarding-agents" },
  { n: 12, libelle: "Générer / assembler l'application", skill: null, script: "config CDH_CONFIG", lien: "/", preuve: "l'application servie pour ce cas" },
  { n: 13, libelle: "Exécuter les tests", skill: "generer-tests-harnais", script: "npm test, validate-guardrails", chemin: "cases/onboarding-agents/tests/comportement.yaml", preuve: "les cas de comportement, verts", commande: "npm run validate-guardrails -- --cas onboarding-agents && npm test" },
  { n: 14, libelle: "Ouvrir l'application du cas", skill: null, script: "npm run dev", lien: "/", preuve: "le portail d'accueil du nouvel arrivant", commande: "npm run dev   # puis http://localhost:3010" },
  { n: 15, libelle: "Produire le rapport de gouvernance", skill: "verifier-securite-rgpd", script: "build-harness-report", chemin: "cases/onboarding-agents/rapport-gouvernance.md", preuve: "le rapport à remettre au DPO / à la DSI", commande: "npm run rapport -- --cas onboarding-agents" },
];

export default function Fabrique() {
  const config = getConfig();
  const manifeste = chargerManifeste(config.cas);
  const { etape, statut, mis_a_jour } = manifeste.etat;

  const nbSources = getSources().length;
  const nbFiches = getFiches().length;
  const rapportExiste = fs.existsSync(path.join(CASE_DIR, "rapport-gouvernance.md"));

  const modulesActifs = (Object.keys(manifeste.modules) as (keyof typeof manifeste.modules)[]).filter(
    (m) => manifeste.modules[m],
  );

  return (
    <>
      <h1>Atelier de la fabrique</h1>

      <div className="panneau panneau-info">
        <p style={{ marginTop: 0 }}>
          <strong>Comptoir des Harnais</strong> est une fabrique de harnais IA pour acteurs publics.
          Elle vous interroge sur votre besoin, une question à la fois, génère la structure du
          harnais, contrôle vos sources et vos garde-fous, puis assemble une application locale
          sourcée et gouvernée.
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>L'atelier est visible ici, dans le navigateur ; les scripts garantissent la
          reproductibilité.</strong> Chaque étape ci-dessous montre l'état <em>réel</em> de ce
          harnais et laisse une preuve consultable. Les mêmes actions sont rejouables en ligne de
          commande pour les équipes techniques (encarts « en coulisse ») ; c'est le moteur, pas
          l'expérience principale.
        </p>
      </div>

      <section>
        <h2>Harnais : {manifeste.slug}</h2>
        <div className="badges">
          <StatutBadge statut={statut} />
          <span className="badge">Type : {manifeste.type}</span>
          <span className="badge">Étape {etape} / 15</span>
          <span className="badge">{nbSources} sources</span>
          <span className="badge">{nbFiches} fiches</span>
          <span className="badge">IA : {manifeste.fournisseur.mode}</span>
        </div>
        <p className="petit muet" style={{ marginTop: "0.75rem" }}>
          Servi pour la <strong>{config.organisation.nom}</strong>. Manifeste :{" "}
          <code>cases/{manifeste.slug}/harnais.yaml</code> — mis à jour le {mis_a_jour}.
        </p>
        <p>{manifeste.besoin}</p>
        <div className="badges">
          <span className="petit muet">Modules actifs (pilotent la navigation) :</span>
          {modulesActifs.map((m) => (
            <span key={m} className="badge badge-source">
              {m}
            </span>
          ))}
        </div>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/" className="bouton">
            Ouvrir l'application produite
          </Link>{" "}
          {rapportExiste ? (
            <Link href="/gouvernance" className="bouton bouton-secondaire">
              Voir la gouvernance et le rapport
            </Link>
          ) : null}
        </p>
      </section>

      <section>
        <h2>Progression du parcours (15 étapes)</h2>
        <p className="petit muet">
          Chaque étape mobilise une skill (savoir-faire versionné) et un script déterministe, et
          laisse une preuve visible dans l'application ou un fichier du dépôt. Les étapes franchies
          sont marquées ✓.
        </p>
        <ol className="etapes-fabrique">
          {ETAPES.map((e) => {
            const franchie = e.n <= etape;
            return (
              <li key={e.n} className={franchie ? "etape franchie" : "etape"}>
                <span className="etape-marque" aria-hidden="true">
                  {franchie ? "✓" : e.n}
                </span>
                <div style={{ flex: 1 }}>
                  <strong>
                    {e.n}. {e.libelle}
                  </strong>
                  <div className="petit muet">
                    Skill : {e.skill ? <code>{e.skill}</code> : "— (action déterministe)"} · Script :{" "}
                    <code>{e.script}</code>
                  </div>
                  <div className="petit">
                    Preuve : {e.preuve} —{" "}
                    {e.lien ? (
                      <Link href={e.lien}>{e.lien}</Link>
                    ) : (
                      <code>{e.chemin}</code>
                    )}
                  </div>
                  {e.commande ? (
                    <details className="coulisse">
                      <summary>En coulisse — commande équivalente</summary>
                      <code>{e.commande}</code>
                    </details>
                  ) : null}
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
          <li>Aucune écriture depuis le navigateur : l'état ci-dessus est <strong>lu</strong> depuis les fichiers du dépôt (manifeste, corpus). Les actions qui écrivent passent par les scripts, dans <code>cases/</code>, <code>content/cases/</code> et <code>configs/</code>.</li>
          <li>Aucune validation confiée au modèle : les contrôles sont des scripts reproductibles (même entrée, même sortie).</li>
        </ul>
        <p className="petit muet" style={{ marginBottom: 0 }}>
          Tableau de bord en lecture seule. L'atelier guidé pas à pas dans le navigateur arrive à un
          lot ultérieur ; en attendant, le circuit complet est rejouable par{" "}
          <code>npm run interview</code> puis <code>npm run validate-harness</code>.
        </p>
      </section>
    </>
  );
}
