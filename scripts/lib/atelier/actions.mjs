/**
 * Actions déterministes d'une étape du parcours.
 *
 * Point d'entrée unique partagé par l'atelier web (handlers `/api/fabrique/*`,
 * Lot 5a) et l'interview CLI : exécute l'action déterministe d'une étape en
 * appelant les fonctions cœur des scripts (jamais leur CLI), et renvoie un
 * retour structuré `{ ok, erreurs, avertissements, fichiers }`.
 *
 * Aucune lecture ni écriture de secret ; effets confinés au workspace du dépôt ;
 * aucune dépendance à un TTY.
 */
import fs from "node:fs";
import path from "node:path";
import { etape, GENRES } from "./etapes.mjs";
import { racine } from "../cli.mjs";
import { scaffold } from "../../scaffold-harness.mjs";
import { validerCorpus } from "../../validate-corpus.mjs";
import { validerGuardrails } from "../../validate-guardrails.mjs";
import { validerProvider } from "../../validate-provider-config.mjs";
import { genererDemo } from "../../generate-onboarding-demo.mjs";
import { construireRapport } from "../../build-harness-report.mjs";

const vide = () => ({ ok: true, erreurs: [], avertissements: [], fichiers: [] });

/**
 * Exécute l'action déterministe de l'étape `numero` pour le cas `cas`.
 * Les étapes de saisie (1-8) n'ont pas d'action ici : leurs réponses sont
 * appliquées par `reponses.mjs`. Les étapes « commande » (10, 13, 14, 15)
 * décrivent une commande côté CLI mais leur moteur est exécutable ici pour
 * l'atelier web.
 * @param {number} numero
 * @param {string} cas
 * @param {{ force?: boolean, dryRun?: boolean, ecrire?: boolean, date?: string }} [options]
 * @returns {{ ok: boolean, erreurs: string[], avertissements: string[], fichiers: string[] }}
 */
export function executerAction(numero, cas, options = {}) {
  const e = etape(numero);
  if (!e) {
    return { ok: false, erreurs: [`étape ${numero} inconnue.`], avertissements: [], fichiers: [] };
  }

  switch (numero) {
    case 9: {
      const r = validerProvider();
      return { ok: r.ok, erreurs: r.erreurs, avertissements: r.avertissements, fichiers: [] };
    }
    case 10: {
      const r = scaffold(cas, { force: options.force, dryRun: options.dryRun });
      return {
        ok: r.ok,
        erreurs: r.erreurs,
        avertissements: [],
        fichiers: [...r.cree, ...r.reecrit],
      };
    }
    case 11: {
      const r = validerCorpus(cas);
      return { ok: r.ok, erreurs: r.erreurs, avertissements: r.avertissements, fichiers: [] };
    }
    case 12: {
      // Cas réel : rien à générer (config suffit). Cas démo : vérifie la référence.
      const r = genererDemo({ ecrire: false });
      return { ok: r.ok, erreurs: [], avertissements: r.ecarts.map((f) => `écart démo : ${f}`), fichiers: [] };
    }
    case 13: {
      const r = validerGuardrails(cas);
      return { ok: r.ok, erreurs: r.erreurs, avertissements: r.avertissements, fichiers: [] };
    }
    case 15: {
      const date = options.date ?? new Date().toISOString().slice(0, 10);
      const r = construireRapport(cas, date);
      if (!r.ok) return { ok: false, erreurs: r.erreurs, avertissements: [], fichiers: [] };
      const sortie = path.join(racine(), "cases", cas, "rapport-gouvernance.md");
      fs.mkdirSync(path.dirname(sortie), { recursive: true });
      fs.writeFileSync(sortie, r.contenu, "utf8");
      return { ok: true, erreurs: [], avertissements: [], fichiers: [path.relative(racine(), sortie)] };
    }
    default:
      // Étapes de saisie (1-8) et étape 14 (ouverture app) : aucune action déterministe ici.
      if (e.genre === GENRES.SAISIE) return vide();
      return vide();
  }
}
