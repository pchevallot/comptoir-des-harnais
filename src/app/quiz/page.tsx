import { getQuiz } from "@/lib/content";
import { QuizClient } from "./QuizClient";

/** Quiz nouvel arrivant (§6.1-5). Valide une lecture, jamais une personne. */
export default function Quiz() {
  const questions = getQuiz();
  return (
    <>
      <h1>Quiz du nouvel arrivant</h1>
      <p>
        Ce quiz vous aide à vérifier votre lecture. <strong>Aucun score n'est conservé ni
        transmis</strong> : il reste dans votre navigateur, le temps de la page. Chaque correction
        renvoie vers la fiche ou la source utile.
      </p>
      {questions.length > 0 ? (
        <QuizClient questions={questions} />
      ) : (
        <div className="panneau">Aucune question de quiz n'est encore définie dans le contenu.</div>
      )}
    </>
  );
}
