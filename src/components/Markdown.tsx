import React from "react";

/**
 * Rendu Markdown minimal et sobre pour nos contenus contrôlés.
 * Sous-ensemble volontairement restreint (titres, listes, gras, italique,
 * liens, citations, séparateurs) : pas de dépendance supplémentaire, moins de
 * pièces mobiles (cf. principe de sobriété PRD §7.1). Les contenus sont écrits
 * par le projet, pas par des visiteurs : pas de HTML brut injecté.
 */

function rendreInline(texte: string, cle: string): React.ReactNode {
  // Découpage sur gras, italique, code, liens.
  const motifs =
    /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  const morceaux = texte.split(motifs).filter((m) => m !== "");
  return morceaux.map((m, i) => {
    const k = `${cle}-${i}`;
    if (/^\*\*[^*]+\*\*$/.test(m)) return <strong key={k}>{m.slice(2, -2)}</strong>;
    if (/^\*[^*]+\*$/.test(m)) return <em key={k}>{m.slice(1, -1)}</em>;
    if (/^`[^`]+`$/.test(m)) return <code key={k}>{m.slice(1, -1)}</code>;
    const lien = m.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (lien) {
      const url = lien[2] ?? "#";
      const externe = /^https?:\/\//.test(url);
      return (
        <a key={k} href={url} {...(externe ? { rel: "noreferrer", target: "_blank" } : {})}>
          {lien[1]}
        </a>
      );
    }
    return <React.Fragment key={k}>{m}</React.Fragment>;
  });
}

export function Markdown({ children }: { children: string }) {
  const lignes = children.replace(/\r\n/g, "\n").split("\n");
  const blocs: React.ReactNode[] = [];
  let liste: string[] = [];
  let listeOrdonnee = false;
  let para: string[] = [];
  let cle = 0;

  const viderListe = () => {
    if (liste.length === 0) return;
    const items = liste.map((t, i) => <li key={i}>{rendreInline(t, `li-${cle}-${i}`)}</li>);
    blocs.push(listeOrdonnee ? <ol key={cle++}>{items}</ol> : <ul key={cle++}>{items}</ul>);
    liste = [];
  };
  const viderPara = () => {
    if (para.length === 0) return;
    const t = para.join(" ");
    blocs.push(<p key={cle++}>{rendreInline(t, `p-${cle}`)}</p>);
    para = [];
  };
  const viderTout = () => {
    viderListe();
    viderPara();
  };

  for (const ligne of lignes) {
    const l = ligne.trimEnd();
    if (l.trim() === "") {
      viderTout();
      continue;
    }
    if (/^#{1,4}\s+/.test(l)) {
      viderTout();
      const niveau = (l.match(/^#+/)?.[0].length ?? 1);
      const texte = l.replace(/^#+\s+/, "");
      const Tag = (`h${Math.min(niveau + 1, 4)}`) as "h2" | "h3" | "h4";
      blocs.push(<Tag key={cle++}>{rendreInline(texte, `h-${cle}`)}</Tag>);
      continue;
    }
    if (/^---+$/.test(l)) {
      viderTout();
      blocs.push(<hr key={cle++} />);
      continue;
    }
    if (/^>\s?/.test(l)) {
      viderTout();
      blocs.push(
        <blockquote key={cle++} className="panneau panneau-info">
          {rendreInline(l.replace(/^>\s?/, ""), `bq-${cle}`)}
        </blockquote>,
      );
      continue;
    }
    const ordre = l.match(/^\d+\.\s+(.*)$/);
    if (ordre) {
      viderPara();
      if (!listeOrdonnee) viderListe();
      listeOrdonnee = true;
      liste.push(ordre[1] ?? "");
      continue;
    }
    const puce = l.match(/^[-*]\s+(.*)$/);
    if (puce) {
      viderPara();
      if (listeOrdonnee) viderListe();
      listeOrdonnee = false;
      liste.push(puce[1] ?? "");
      continue;
    }
    viderListe();
    para.push(l);
  }
  viderTout();

  return <>{blocs}</>;
}
