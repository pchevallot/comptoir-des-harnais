import type { Classification, StatutHarnais } from "@/lib/types";

/** Composants de badges réutilisables : statut, source, classification. */

const LIBELLE_STATUT: Record<StatutHarnais, string> = {
  prototype: "Statut : prototype",
  interne: "Statut : usage interne",
  production: "Statut : mise en production",
};

export function StatutBadge({ statut }: { statut: StatutHarnais }) {
  return (
    <span className={`badge badge-statut-${statut}`} title="Statut du harnais">
      {LIBELLE_STATUT[statut]}
    </span>
  );
}

export function SourceBadge({ id, titre }: { id: string; titre?: string }) {
  return (
    <span className="badge badge-source" title={titre ?? id}>
      Source {id}
    </span>
  );
}

export function ClassificationBadge({ niveau }: { niveau: Classification }) {
  return <span className="badge" title="Classification des données">Donnée : {niveau}</span>;
}
