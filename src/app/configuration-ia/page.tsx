import type { Metadata } from "next";
import { PROVIDERS } from "@/lib/model/catalogue";
import {
  diagnostiquerConfiguration,
  type StatutConfiguration,
} from "@/lib/model/diagnostic";

export const metadata: Metadata = {
  title: "Configuration de l'IA — Comptoir des Harnais",
  description:
    "Comment choisir et configurer le fournisseur de modèle (local, Ollama, Anthropic, " +
    "OpenAI, OpenRouter, Mistral) sans jamais stocker de clé dans le navigateur.",
};

/** Ce composant est un composant SERVEUR : il lit l'état de configuration côté
 *  serveur. Aucune clé n'est jamais transmise au navigateur (PRD §9.2-12). */
export const dynamic = "force-dynamic";

const CLASSE_PASTILLE: Record<StatutConfiguration, string> = {
  "hors-ligne": "pastille-ok",
  pret: "pastille-ok",
  "cle-manquante": "pastille-attention",
  "config-incomplete": "pastille-attention",
  desactive: "pastille-neutre",
};

const LIBELLE_STATUT: Record<StatutConfiguration, string> = {
  "hors-ligne": "Prêt — hors ligne",
  pret: "Prêt",
  "cle-manquante": "Clé manquante",
  "config-incomplete": "Configuration incomplète",
  desactive: "Désactivé",
};

function Oui() {
  return <strong>oui</strong>;
}
function Non() {
  return <span className="muet">non</span>;
}

export default function ConfigurationIA() {
  const d = diagnostiquerConfiguration();

  return (
    <>
      <h1>Configuration de l'IA</h1>
      <p>
        Ce portail sépare volontairement <strong>ce qui est éditorial</strong> (parcours, fiches,
        quiz, gouvernance — toujours disponible) de <strong>ce qui est généré</strong> (la réponse
        rédigée de la FAQ). Cette page explique quel fournisseur de modèle est utilisé, comment le
        configurer, et pourquoi ce choix engage le RGPD, la sécurité et la souveraineté.
      </p>

      <div className="panneau panneau-info">
        <p style={{ margin: 0 }}>
          <strong>Aucune clé d'API n'est stockée dans le navigateur.</strong> Les clés ne vivent que
          dans les variables d'environnement du serveur (<code>.env.local</code>). Elles ne sont
          jamais écrites dans le navigateur (pas de <code>localStorage</code>, pas de cookie), jamais
          versionnées dans le dépôt, et ne sont jamais renvoyées à cette page — cette page affiche
          seulement un <em>statut</em>, jamais une valeur de clé.
        </p>
      </div>

      {/* --- État courant (diagnostic) ------------------------------------- */}
      <h2>État courant de la configuration</h2>
      <div className="carte">
        <div className="badges" style={{ marginBottom: "0.75rem" }}>
          <span className="badge badge-source">{d.info.nom}</span>
          <span className={`pastille ${CLASSE_PASTILLE[d.statut]}`}>{LIBELLE_STATUT[d.statut]}</span>
        </div>
        <p style={{ marginTop: 0 }}>{d.message}</p>
        <dl style={{ margin: 0 }}>
          <div>
            <dt>Fournisseur configuré (<code>MODEL_PROVIDER</code>)</dt>
            <dd>{d.info.id}</dd>
          </div>
          <div>
            <dt>Nom affiché à l'écran (<code>MODEL_DISPLAY_NAME</code>)</dt>
            <dd>{d.nomAffiche}</dd>
          </div>
          <div>
            <dt>Émet des appels réseau</dt>
            <dd>{d.reseau ? <Oui /> : <Non />}</dd>
          </div>
          <div>
            <dt>Clé d'API requise</dt>
            <dd>{d.clefRequise ? <Oui /> : <Non />}</dd>
          </div>
          <div>
            <dt>Clé d'API renseignée côté serveur</dt>
            <dd>
              {d.clefRequise ? (
                d.clefPresente ? (
                  <Oui />
                ) : (
                  <span style={{ color: "var(--cds-alerte)", fontWeight: 700 }}>non</span>
                )
              ) : (
                <span className="muet">sans objet</span>
              )}
              <span className="muet"> (statut uniquement — la valeur n'est jamais affichée)</span>
            </dd>
          </div>
          <div>
            <dt>URL de service (<code>MODEL_BASE_URL</code>)</dt>
            <dd>{d.baseUrl ? <code>{d.baseUrl}</code> : <Non />}</dd>
          </div>
          <div>
            <dt>Modèle (<code>MODEL_NAME</code>)</dt>
            <dd>{d.modele ? <code>{d.modele}</code> : <Non />}</dd>
          </div>
        </dl>
      </div>

      <div className="panneau">
        <p style={{ margin: 0 }}>
          <strong>Le mode « local » fonctionne sans clé et sans appel réseau.</strong> C'est le mode
          par défaut, celui de la démonstration et des tests : la FAQ restitue les sources
          pertinentes de façon déterministe, hors ligne, sans qu'aucune donnée ne quitte le poste.
        </p>
      </div>

      {/* --- Comment configurer -------------------------------------------- */}
      <h2>Comment changer de fournisseur</h2>
      <p>
        La configuration se fait par variables d'environnement, jamais dans le code ni dans
        l'interface. Copiez le modèle, puis renseignez vos valeurs dans un fichier{" "}
        <strong>local et non versionné</strong> :
      </p>
      <pre>
        <code>{`cp .env.example .env.local
# éditez .env.local, puis relancez :  npm run dev`}</code>
      </pre>
      <p>
        Le fichier <code>.env.local</code> est ignoré par git (voir <code>.gitignore</code>). Ne
        collez jamais une clé que vous ne pouvez pas révoquer. En cas d'exposition d'une clé :
        révoquez-la immédiatement chez le fournisseur, puis générez-en une nouvelle. En production,
        préférez les variables d'environnement du serveur (ou un coffre à secrets) à un fichier.
      </p>

      {/* --- Catalogue des fournisseurs ------------------------------------ */}
      <h2>Fournisseurs disponibles</h2>
      <p>
        Six modes sont pris en charge, du plus souverain (tout reste chez vous) au recours à un
        service tiers. Chaque fournisseur ci-dessous indique s'il appelle le réseau, s'il exige une
        clé, et donne un exemple de configuration à coller dans <code>.env.local</code>.
      </p>
      <div className="grille">
        {PROVIDERS.map((p) => (
          <div key={p.id} className="carte">
            <div className="badges" style={{ marginBottom: "0.5rem" }}>
              <span className="badge badge-source">{p.id}</span>
              {p.reseau ? (
                <span className="badge">Appels réseau</span>
              ) : (
                <span className="badge">Hors ligne</span>
              )}
              {p.clefRequise ? (
                <span className="badge">Clé requise</span>
              ) : (
                <span className="badge">Sans clé</span>
              )}
              {p.id === d.info.id && (
                <span className="pastille pastille-ok">Actif</span>
              )}
            </div>
            <h3>{p.nom}</h3>
            <p>{p.resume}</p>
            <p className="petit">
              <strong>Souveraineté / RGPD :</strong> {p.souverainete}
            </p>
            <p className="petit muet" style={{ marginBottom: "0.35rem" }}>
              Exemple pour <code>.env.local</code> :
            </p>
            <pre>
              <code>{p.exempleEnv}</code>
            </pre>
          </div>
        ))}
      </div>

      {/* --- Impacts RGPD / sécurité --------------------------------------- */}
      <h2>Ce que ce choix engage (RGPD, sécurité, souveraineté)</h2>
      <div className="panneau panneau-alerte">
        <ul style={{ margin: 0 }}>
          <li>
            <strong>Où sont traitées les données.</strong> Avec un fournisseur externe, la question
            posée et les extraits de sources transitent vers ce tiers. Avec <code>local</code> ou{" "}
            <code>ollama</code> (URL interne), rien ne sort de votre périmètre.
          </li>
          <li>
            <strong>Le fournisseur est un sous-traitant.</strong> Dès qu'un service tiers est
            appelé, instruisez avec le DPO : localisation des traitements, réutilisation éventuelle
            des données pour l'entraînement, clauses contractuelles, durée de conservation.
          </li>
          <li>
            <strong>Pas de données personnelles ni sensibles.</strong> Ce cadre traite uniquement
            des sources <em>publiques</em> ou <em>internes</em>. Ne transmettez jamais de données
            personnelles ou sensibles à un modèle, quel que soit le fournisseur.
          </li>
          <li>
            <strong>Gestion des secrets.</strong> Les clés restent en variables d'environnement
            serveur, jamais dans le dépôt ni le navigateur ; rotation en cas d'exposition.
          </li>
          <li>
            <strong>Réversibilité.</strong> Changer de fournisseur ne fait perdre aucun contenu :
            sources, fiches et configuration sont en formats ouverts. Sans fournisseur, le mode{" "}
            <code>local</code> garde la FAQ utilisable hors ligne.
          </li>
        </ul>
      </div>

      <p className="mentions">
        Cette page décrit une configuration technique. Elle ne constitue ni un audit, ni un avis de
        conformité : ces qualifications relèvent du DPO, du RSSI et des juristes de l'organisation.
        Ce cadre <strong>ne vaut pas validation juridique</strong>. Ce document ne couvre pas le
        choix commercial d'un fournisseur ni la négociation contractuelle.
      </p>
    </>
  );
}
