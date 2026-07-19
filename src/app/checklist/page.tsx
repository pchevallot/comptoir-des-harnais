import { getChecklist } from "@/lib/content";
import { Markdown } from "@/components/Markdown";

/** Checklist RH : aide-mémoire documentaire, PAS un workflow (§6.1-6). */
export default function Checklist() {
  const doc = getChecklist();
  return (
    <>
      <h1>Checklist RH</h1>
      <p>
        Cet aide-mémoire liste ce que la direction RH prépare, valide et met à jour pour que le
        portail reste fiable. <strong>Ce n'est pas un circuit de validation</strong> : rien n'est
        enregistré ni transmis ici ; c'est une liste de rappel documentaire.
      </p>
      {doc ? (
        <div className="panneau">
          <Markdown>{doc}</Markdown>
        </div>
      ) : (
        <div className="panneau">Aucune checklist n'est encore définie dans le contenu.</div>
      )}
    </>
  );
}
