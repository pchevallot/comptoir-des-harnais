"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuestionQuiz } from "@/lib/types";

/** Quiz interactif, entièrement côté navigateur, sans persistance. */
export function QuizClient({ questions }: { questions: QuestionQuiz[] }) {
  const [reponses, setReponses] = useState<Record<string, number>>({});
  const [corrige, setCorrige] = useState(false);

  const score = questions.reduce(
    (n, q) => (reponses[q.id] === q.bonne_reponse ? n + 1 : n),
    0,
  );

  return (
    <div>
      <ol className="registre" style={{ listStyle: "none", padding: 0 }}>
        {questions.map((q, i) => {
          const choix = reponses[q.id];
          const juste = choix === q.bonne_reponse;
          return (
            <li key={q.id} className="carte">
              <p style={{ marginTop: 0 }}>
                <strong>
                  {i + 1}. {q.question}
                </strong>
              </p>
              <div role="radiogroup" aria-label={q.question}>
                {q.options.map((opt, j) => (
                  <label key={j} style={{ fontWeight: 400, display: "block", marginBottom: "0.3rem" }}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={choix === j}
                      disabled={corrige}
                      onChange={() => setReponses((r) => ({ ...r, [q.id]: j }))}
                      style={{ width: "auto", marginRight: "0.5rem" }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {corrige && choix !== undefined && (
                <div className={`panneau ${juste ? "panneau-info" : "panneau-alerte"}`}>
                  <p style={{ margin: "0 0 0.5rem" }}>
                    <strong>{juste ? "Bonne réponse." : "À revoir."}</strong> {q.explication}
                  </p>
                  {q.renvoi_fiche && (
                    <p style={{ margin: 0 }}>
                      <Link href={`/fiches/${q.renvoi_fiche}`}>Consulter la fiche</Link>
                    </p>
                  )}
                  {q.renvoi_source && (
                    <p style={{ margin: 0 }} className="petit muet">
                      Source : {q.renvoi_source}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <p>
        {!corrige ? (
          <button type="button" className="bouton" onClick={() => setCorrige(true)}>
            Corriger
          </button>
        ) : (
          <button
            type="button"
            className="bouton bouton-secondaire"
            onClick={() => {
              setCorrige(false);
              setReponses({});
            }}
          >
            Recommencer
          </button>
        )}
      </p>

      {corrige && (
        <div className="panneau panneau-info" aria-live="polite">
          Vous avez {score} bonne(s) réponse(s) sur {questions.length}. Ce résultat n'est ni
          enregistré ni transmis : il valide une lecture, pas une personne.
        </div>
      )}
    </div>
  );
}
