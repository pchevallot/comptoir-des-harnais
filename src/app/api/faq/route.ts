import { NextResponse } from "next/server";
import { repondre } from "@/lib/answer";

/**
 * Point d'entrée de la FAQ documentaire.
 * Tout passe côté serveur : les garde-fous et l'éventuelle clé de modèle ne sont
 * jamais exposés au navigateur (PRD §9.2-12). Aucune donnée saisie n'est
 * conservée au-delà de la journalisation technique locale.
 */
export const runtime = "nodejs";

export async function POST(request: Request) {
  let question = "";
  try {
    const body = (await request.json()) as { question?: unknown };
    question = typeof body.question === "string" ? body.question : "";
  } catch {
    return NextResponse.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  if (question.trim().length === 0) {
    return NextResponse.json({ erreur: "Veuillez saisir une question." }, { status: 400 });
  }
  if (question.length > 500) {
    question = question.slice(0, 500);
  }

  const reponse = await repondre(question);
  return NextResponse.json(reponse, {
    headers: { "Cache-Control": "no-store" },
  });
}
