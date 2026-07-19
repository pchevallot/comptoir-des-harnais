"use client";

import { useState } from "react";
import type { ReponseFAQ } from "@/lib/types";

const EXEMPLES = [
  "Combien de jours de télétravail sont possibles ?",
  "Comment fonctionnent les mutuelles labellisées ?",
  "Est-ce que Madame Martin a droit au télétravail ?",
  "Quel est le montant du RIFSEEP pour un attaché principal ?",
];

const COULEUR_ISSUE: Record<string, string> = {
  sourcee: "panneau-info",
  refus: "panneau-alerte",
  "je-ne-sais-pas": "panneau",
  degrade: "panneau",
};

export function FaqClient() {
  const [question, setQuestion] = useState("");
  const [reponse, setReponse] = useState<ReponseFAQ | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function demander(q: string) {
    setEnCours(true);
    setErreur(null);
    setReponse(null);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur ?? "Une erreur est survenue.");
      } else {
        setReponse(data as ReponseFAQ);
      }
    } catch {
      setErreur("Impossible de contacter le service. Réessayez.");
    } finally {
      setEnCours(false);
    }
  }

  function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (question.trim()) demander(question.trim());
  }

  return (
    <div>
      <form onSubmit={soumettre}>
        <label htmlFor="q">Votre question</label>
        <textarea
          id="q"
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex. : Combien de jours de télétravail sont possibles ?"
          maxLength={500}
        />
        <p style={{ marginTop: "0.75rem" }}>
          <button type="submit" className="bouton" disabled={enCours}>
            {enCours ? "Recherche…" : "Poser la question"}
          </button>
        </p>
      </form>

      <p className="petit muet">Exemples&nbsp;:</p>
      <div className="badges" style={{ marginBottom: "1rem" }}>
        {EXEMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="bouton bouton-secondaire petit"
            onClick={() => {
              setQuestion(ex);
              demander(ex);
            }}
          >
            {ex}
          </button>
        ))}
      </div>

      {erreur && <div className="panneau panneau-alerte">{erreur}</div>}

      {reponse && (
        <div className={`panneau ${COULEUR_ISSUE[reponse.issue] ?? "panneau"}`} aria-live="polite">
          <p style={{ marginTop: 0 }}>
            <strong>
              {reponse.issue === "refus" && "Refus — hors du périmètre documentaire"}
              {reponse.issue === "sourcee" && "Réponse sourcée"}
              {reponse.issue === "je-ne-sais-pas" && "Je ne sais pas"}
              {reponse.issue === "degrade" && "Réponse assistée désactivée"}
            </strong>
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>{reponse.texte}</p>

          {reponse.renvoi && (
            <p>
              <strong>À contacter :</strong> {reponse.renvoi}
            </p>
          )}

          {reponse.sources.length > 0 && (
            <>
              <p style={{ marginBottom: "0.25rem" }}>
                <strong>Sources citées :</strong>
              </p>
              <ul>
                {reponse.sources.map((s) => (
                  <li key={s.id}>
                    <span className="badge badge-source">{s.id}</span> {s.titre}{" "}
                    <span className="muet petit">(version du {s.date})</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mentions">
            {reponse.mentions.dateSources && <>Sources à jour au {reponse.mentions.dateSources}. </>}
            Statut du harnais : {reponse.mentions.statut}. Modèle : {reponse.mentions.modele}.{" "}
            {reponse.mentions.assistanceIA}
          </p>
        </div>
      )}
    </div>
  );
}
