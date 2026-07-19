import Link from "next/link";
import { getConfig } from "@/lib/config";
import { StatutBadge } from "@/components/Badges";

/** Page d'accueil pédagogique (PRD §6.1-1, §1.4). Orientée action. */
export default function Accueil() {
  const config = getConfig();
  return (
    <>
      <p className="bandeau-fabrique">
        Ce portail a été produit par la fabrique <strong>Comptoir des Harnais</strong>.{" "}
        <Link href="/fabrique">Voir comment</Link>.
      </p>

      <section className="hero">
        <h1>Bienvenue dans votre harnais d'onboarding RH</h1>
        <p>
          Ce portail documentaire accueille les nouveaux agents de la{" "}
          <strong>{config.organisation.nom}</strong> : il rassemble, au même endroit, des fiches
          pratiques claires, sourcées et datées, un parcours d'accueil pas à pas, et des réponses
          aux questions fréquentes — <strong>uniquement à partir de sources internes</strong>.
        </p>
        <p className="petit">
          <StatutBadge statut={config.harnais.statut} /> &nbsp; Démonstration à données fictives.
        </p>
        <p>
          <Link href="/parcours" className="bouton">
            Commencer le parcours d'accueil
          </Link>{" "}
          <Link href="/faq" className="bouton bouton-secondaire">
            Poser une question
          </Link>
        </p>
      </section>

      <section className="panneau panneau-info">
        <h2 style={{ marginTop: 0 }}>Un harnais n'est pas un prompt</h2>
        <p>
          Un <strong>harnais</strong> est un ensemble structuré de besoins, sources, règles,
          garde-fous, tests et responsabilités qui encadrent l'IA pour produire un service utile,
          maintenable et gouverné. Ici, ce harnais prend la forme d'un portail d'accueil : chaque
          réponse cite ses sources, affiche sa date et son statut, et l'outil{" "}
          <strong>refuse</strong> ce qui sort de son périmètre.
        </p>
      </section>

      <div className="grille">
        <div className="carte">
          <h3>Ce que ce portail fait</h3>
          <ul>
            <li>Présente des <Link href="/fiches">fiches pratiques</Link> sourcées et datées.</li>
            <li>Propose un <Link href="/parcours">parcours d'accueil</Link> ordonné.</li>
            <li>Répond à des <Link href="/faq">questions documentaires</Link> en citant ses sources.</li>
            <li>Affiche ses <Link href="/sources">sources</Link>, ses <Link href="/limites">limites</Link> et sa <Link href="/gouvernance">gouvernance</Link>.</li>
          </ul>
        </div>
        <div className="carte">
          <h3>Ce que ce portail ne fait pas</h3>
          <ul>
            <li>Ce n'est <strong>pas un SIRH</strong> ni un outil de gestion de dossiers d'agents.</li>
            <li>Il ne traite <strong>aucune situation individuelle</strong> et refuse ces questions.</li>
            <li>Il ne rend <strong>ni avis juridique ni avis médical</strong>.</li>
            <li>Il ne conserve aucune donnée saisie et <strong>ne vaut pas validation juridique</strong>.</li>
          </ul>
        </div>
        <div className="carte">
          <h3>À qui il s'adresse</h3>
          <ul>
            <li><strong>Nouveaux arrivants</strong> : parcours, fiches, questions/réponses.</li>
            <li><strong>Direction RH</strong> : <Link href="/checklist">checklist</Link> de préparation et de mise à jour.</li>
            <li><strong>DGS, DPO, DSI/RSSI</strong> : <Link href="/gouvernance">gouvernance</Link>, sources et limites visibles à l'écran.</li>
          </ul>
        </div>
      </div>

      <section className="panneau">
        <h2 style={{ marginTop: 0 }}>Le besoin auquel ce portail répond</h2>
        <p>{config.harnais.besoin}</p>
      </section>
    </>
  );
}
