import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Adapter ses sources — Comptoir des Harnais",
  description:
    "Comment partir de vos documents Word/PDF pour alimenter le portail : conversion " +
    "en Markdown vérifié, métadonnées, relecture, limites et checklist d'import.",
};

/** Page « Adapter ses sources » — pendant applicatif du guide
 *  docs/adapter-ses-sources.fr.md (PRD §6.1-11, §7.1). */
export default function AdapterSources() {
  return (
    <>
      <h1>Adapter ses sources</h1>
      <p>
        Vous n'êtes pas obligé de rédiger vos documents en Markdown. Vous partez de vos fichiers
        habituels (Word, PDF, LibreOffice, pages intranet) et vous les <strong>convertissez</strong>{" "}
        en sources vérifiées avant de les intégrer. Cette page résume la marche à suivre ; le guide
        complet est dans le dépôt : <code>docs/adapter-ses-sources.fr.md</code>.
      </p>

      <div className="panneau panneau-info">
        <p style={{ margin: 0 }}>
          <strong>Faut-il fournir ses documents en Markdown ?</strong> Non pour <em>partir</em>, oui
          pour <em>intégrer</em>. Le Markdown est le format canonique du harnais parce qu'il est
          lisible sans outil, versionnable (chaque changement est tracé) et réversible (aucun verrou
          fournisseur, le contenu reste chez vous en format ouvert).
        </p>
      </div>

      <div className="panneau">
        <h2 style={{ marginTop: 0 }}>Repartir de la fabrique : pointer une config vers un cas</h2>
        <p>
          Ce portail est <strong>produit par une fabrique</strong>. L'adapter à votre organisation ne
          demande <strong>aucune modification du code</strong> : vous produisez un <em>cas</em> avec
          la fabrique, puis vous pointez la configuration dessus. Le circuit officiel :
        </p>
        <ol>
          <li>
            <code>npm run interview -- --cas &lt;slug&gt;</code> — cadrer le besoin en 15 étapes
            guidées ; produit <code>cases/&lt;slug&gt;/harnais.yaml</code> et{" "}
            <code>configs/&lt;slug&gt;.yml</code>.
          </li>
          <li>
            <code>npm run scaffold -- --cas &lt;slug&gt;</code> — générer l'arborescence du cas depuis
            le gabarit documentaire.
          </li>
          <li>
            <code>import-source</code> puis <code>npm run validate-corpus -- --cas &lt;slug&gt;</code>{" "}
            — préparer et contrôler vos sources (c'est l'objet des étapes ci-dessous).
          </li>
          <li>
            <code>CDH_CONFIG=&lt;slug&gt;.yml npm run dev</code> — servir <strong>votre</strong> cas
            avec la même application. Sans <code>CDH_CONFIG</code>, c'est le cas de démonstration par
            défaut qui est servi.
          </li>
        </ol>
        <p className="petit muet" style={{ marginBottom: 0 }}>
          Cette bascule par configuration est démontrée pas à pas dans{" "}
          <code>docs/RECETTE.md</code> (Lot 6). Les étapes ci-dessous détaillent la préparation d'une
          source.
        </p>
      </div>

      <h2>Les étapes</h2>
      <ol>
        <li>
          <strong>Convertir</strong> le document en texte : copier-coller manuel (le plus fiable),
          ou « Enregistrer sous » en texte / Markdown depuis le traitement de texte. Un PDF scanné
          demande une reconnaissance de caractères (OCR) — <strong>non fournie en V1</strong>.
        </li>
        <li>
          <strong>Relire intégralement.</strong> Une conversion ou un OCR peut transformer un
          chiffre, coller des mots, perdre un titre. Le portail ne répond qu'à partir de ses
          sources : une erreur dans la source devient une erreur dans la réponse. La relecture est un
          garde-fou, pas une option.
        </li>
        <li>
          <strong>Ajouter les métadonnées</strong> en tête du fichier : identifiant, titre,
          propriétaire (une <em>fonction</em>, jamais une personne), date, statut, périmètre,
          classification.
        </li>
        <li>
          <strong>Vérifier l'absence de données personnelles</strong> (voir ci-dessous), déposer le
          fichier dans <code>content/cases/&lt;slug&gt;/sources/</code>, puis lancer les vérifications.
        </li>
      </ol>

      <h2>Métadonnées attendues</h2>
      <div className="carte">
        <ul className="propre" style={{ margin: 0 }}>
          <li>
            <strong>Propriétaire</strong> — la fonction responsable (ex. « Direction des ressources
            humaines »), jamais une personne nommée.
          </li>
          <li>
            <strong>Date</strong> — date de version (<code>AAAA-MM-JJ</code>) ; sert à détecter
            l'obsolescence.
          </li>
          <li>
            <strong>Statut</strong> — <code>active</code> ou <code>perimee</code>.
          </li>
          <li>
            <strong>Classification</strong> — <code>publique</code> ou <code>interne</code>{" "}
            uniquement en V1.
          </li>
          <li>
            <strong>Périmètre</strong> — à qui / à quoi s'applique la source.
          </li>
        </ul>
      </div>

      <div className="panneau panneau-alerte">
        <h2 style={{ marginTop: 0 }}>Limites : pas de données personnelles en V1</h2>
        <p style={{ marginBottom: 0 }}>
          Le cadre ne traite que des données <strong>publiques</strong> ou <strong>internes</strong>.
          Aucune donnée personnelle (nom d'agent, situation individuelle, coordonnées) ni sensible
          (santé…). Une source qui en contient est inéligible en l'état : retirez ces éléments ou
          renvoyez le cas vers le DPO. Un test automatique refuse les motifs de données réalistes.
        </p>
      </div>

      <h2>Amorçage : le script d'import</h2>
      <p>
        Pour éviter la page blanche, un script prépare le squelette d'une source à partir d'un
        fichier <code>.md</code> ou <code>.txt</code> déjà converti et relu :
      </p>
      <pre>
        <code>{`node scripts/import-source.mjs document.txt --id SRC-007 --titre "Règlement horaires"`}</code>
      </pre>
      <p className="petit muet">
        Le script pré-remplit le frontmatter et insère le texte. Il ne fait ni conversion PDF, ni
        OCR, ni contrôle de contenu : la relecture et le retrait des données personnelles restent à
        votre charge.
      </p>

      <p>
        <Link className="bouton bouton-secondaire" href="/sources">
          ← Retour au registre des sources
        </Link>
      </p>

      <p className="mentions">
        Ce guide décrit une méthode de préparation documentaire. Il ne vaut pas validation
        juridique ; la qualification des sources et de leur diffusion relève du DPO, des juristes et
        des propriétaires de documents.
      </p>
    </>
  );
}
