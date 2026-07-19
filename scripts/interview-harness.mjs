#!/usr/bin/env node
/**
 * interview-harness — mode CLI du parcours guidé en 15 étapes (PRD v0.3 §4).
 *
 *   npm run interview                      # nouveau cas ou reprise du cas en cours
 *   npm run interview -- --cas mon-cas --etape 8   # reprendre à l'étape 8
 *   npm run interview -- --demo            # déroule avec les réponses du cas démo (sans TTY)
 *
 * ENVELOPPE MINCE autour de `scripts/lib/atelier/` : aucune logique d'étape ni
 * de validation n'est dupliquée ici. Le modèle n'intervient jamais.
 *
 * Codes : 0 (y compris refus d'éligibilité — c'est le cadre qui fonctionne),
 *         2 mauvaise invocation.
 */
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import yaml from "js-yaml";
import { analyserArgs, resoudreCas, racine, aide, SLUG_CAS } from "./lib/cli.mjs";
import { manifesteInitial, ecrireManifeste } from "./lib/manifeste.mjs";
import { ETAPES, etape, commandeEtape, GENRES } from "./lib/atelier/etapes.mjs";
import { validerReponse, appliquerCollecte } from "./lib/atelier/reponses.mjs";

const AIDE = `
interview-harness — parcours guidé en 15 étapes (mode CLI).

Usage :
  npm run interview                              # nouveau cas ou reprise
  npm run interview -- --cas <slug> --etape <n>  # reprendre à l'étape n
  npm run interview -- --demo                    # non interactif (réponses du cas démo)

Options :
  --cas <slug>   cas à cadrer/reprendre.
  --etape <n>    étape de reprise (1-15).
  --demo         déroule sans TTY avec templates/cases/documentaire/reponses-demo.yaml.
  --help         affiche cette aide.

Les étapes 10, 13, 14, 15 AFFICHENT la commande à lancer, sans l'exécuter.
`;

/** Date du jour (AAAA-MM-JJ). Confinée à l'appelant : la lib n'appelle pas l'horloge. */
function aujourdhui() {
  return new Date().toISOString().slice(0, 10);
}

/** Charge et normalise la collecte du mode démo depuis le gabarit. */
function chargerDemo() {
  const chemin = path.join(racine(), "templates", "cases", "documentaire", "reponses-demo.yaml");
  if (!fs.existsSync(chemin)) {
    console.error(`Erreur : réponses de démo introuvables (${path.relative(racine(), chemin)}).`);
    process.exit(2);
  }
  return yaml.load(fs.readFileSync(chemin, "utf8"));
}

/** Normalise une réponse brute selon la question, en sortant en 2 si la démo est invalide. */
function normaliser(question, brut, contexte) {
  const r = validerReponse(question, brut);
  if (!r.ok) {
    console.error(`Erreur (${contexte}, question « ${question.id} ») : ${r.erreur}. Valeur : « ${brut} ».`);
    process.exit(2);
  }
  return r.valeur;
}

/** Collecte les réponses d'une étape de saisie en mode démo (une entrée ou une boucle). */
function collecterDemoEtape(e, brutEtape) {
  if (e.boucle) {
    const entrees = Array.isArray(brutEtape) ? brutEtape : [];
    return entrees.map((entree) => {
      const obj = {};
      for (const q of e.questions) {
        if (q.id === "titre" || q.id === "question" || q.id === "motif") {
          obj[q.id] = normaliser(q, entree[q.id], `étape ${e.numero}`);
        } else {
          obj[q.id] = normaliser(q, entree[q.id], `étape ${e.numero}`);
        }
      }
      return obj;
    });
  }
  const obj = {};
  for (const q of e.questions ?? []) {
    if (brutEtape?.[q.id] === undefined && q.defaut !== undefined) {
      obj[q.id] = normaliser(q, q.defaut, `étape ${e.numero}`);
    } else {
      obj[q.id] = normaliser(q, brutEtape?.[q.id], `étape ${e.numero}`);
    }
  }
  return obj;
}

/** Collecte interactive d'une étape de saisie (une entrée ou une boucle « terminé »). */
async function collecterInteractifEtape(e, rl) {
  if (e.socle) console.log(`\n${e.socle}`);
  if (e.note) console.log(`\n${e.note}`);
  if (e.boucle) {
    const entrees = [];
    const premiere = e.questions[0];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const tete = await rl.question(`\n${premiere.texte} `);
      if (tete.trim().toLowerCase() === "terminé" || tete.trim().toLowerCase() === "termine") break;
      const rTete = validerReponse(premiere, tete);
      if (!rTete.ok) {
        console.log(`  → ${rTete.erreur}`);
        continue;
      }
      const obj = { [premiere.id]: rTete.valeur };
      let complet = true;
      for (const q of e.questions.slice(1)) {
        const rep = await demanderValide(q, rl);
        if (rep === null) {
          complet = false;
          break;
        }
        obj[q.id] = rep;
      }
      if (complet) entrees.push(obj);
    }
    return entrees;
  }
  const obj = {};
  for (const q of e.questions ?? []) {
    obj[q.id] = await demanderValide(q, rl);
  }
  return obj;
}

/** Pose une question jusqu'à obtenir une réponse valide (valeur par défaut sur Entrée). */
async function demanderValide(q, rl) {
  const suffixe = q.defaut !== undefined ? ` [${q.defaut}]` : "";
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const brut = await rl.question(`${q.texte}${suffixe} `);
    const valeur = brut.trim() === "" && q.defaut !== undefined ? q.defaut : brut;
    const r = validerReponse(q, valeur);
    if (r.ok) return r.valeur;
    console.log(`  → ${r.erreur}`);
  }
}

/** Écrit un manifeste minimal marquant le refus d'éligibilité (étape 1). */
function ecrireRefusEligibilite(slug, date) {
  const m = manifesteInitial(slug, date);
  m.etat.etape = 1;
  ecrireManifeste(slug, m, { valider: false });
}

function afficherCommandesFinales(slug) {
  console.log("\nÉtapes suivantes — à lancer dans un terminal (la fabrique ne les exécute pas ici) :\n");
  for (const n of [10, 11, 13, 14, 15]) {
    const cmd = commandeEtape(n, slug);
    const e = etape(n);
    if (cmd) console.log(`  Étape ${n} (${e.titre}) : ${cmd}`);
    else if (n === 11) console.log(`  Étape 11 (${e.titre}) : npm run validate-corpus -- --cas ${slug}`);
  }
  console.log("");
}

async function principal() {
  const argv = process.argv.slice(2);
  if (argv.includes("--help")) aide(AIDE);
  const { drapeaux, valeurs } = analyserArgs(argv, new Set(["cas", "etape"]));
  const demo = drapeaux.has("demo");
  const date = aujourdhui();

  let slug;
  let brutDemo = null;
  if (demo) {
    brutDemo = chargerDemo();
    slug = brutDemo.slug;
    if (!SLUG_CAS.test(slug ?? "")) {
      console.error("Erreur : slug de démo invalide.");
      process.exit(2);
    }
    if (slug === "onboarding-agents") {
      console.error("Erreur : le mode démo ne doit pas écraser « onboarding-agents ».");
      process.exit(2);
    }
  } else {
    slug = valeurs.get("cas");
  }

  const rl = demo ? null : readline.createInterface({ input, output });

  try {
    if (!demo && !slug) {
      const rep = await rl.question("Slug du nouveau cas ([a-z0-9-]) : ");
      const r = validerReponse({ type: "slug" }, rep);
      if (!r.ok) {
        console.error(`Erreur : ${r.erreur}`);
        process.exit(2);
      }
      slug = r.valeur;
    }

    console.log(`\n=== Fabrique de harnais — cas ${slug}${demo ? " (démo)" : ""} ===`);
    if (!demo) {
      console.log(
        "\nJe vais vous poser quelques questions, une à la fois, comme le ferait un accompagnateur.",
      );
      console.log(
        "Appuyez sur Entrée pour accepter la valeur entre [crochets]. Rien à installer, rien qui sort de ce poste.\n",
      );
    }

    const collecte = {};
    for (const e of ETAPES) {
      if (e.genre === GENRES.COMMANDE || e.numero === 12) {
        // Étapes 10, 13, 14, 15 (+ 12) : affichées à la fin, pas exécutées ici.
        continue;
      }
      if (!demo) console.log(`\n--- Étape ${e.numero} : ${e.titre} ---`);

      const brutEtape = demo ? brutDemo.etapes?.[e.numero] : null;
      const reponses = demo
        ? collecterDemoEtape(e, brutEtape)
        : await collecterInteractifEtape(e, rl);
      collecte[e.numero] = reponses;

      // Étape 1 : refus d'éligibilité → code 0 (comportement voulu).
      if (e.numero === 1 && reponses.eligibilite === true) {
        console.log("\n———");
        console.log(
          "Ce besoin concerne des situations individuelles (dossiers, droits ou décisions nominatives).",
        );
        console.log(
          "La fabrique s'arrête ici, volontairement : ce cadre est documentaire et ne traite jamais de cas individuels.",
        );
        console.log(
          "Ce n'est pas une erreur — c'est le harnais qui joue son rôle, avant même qu'une IA soit dans la boucle.",
        );
        console.log(
          `Pour un besoin sur des personnes, tournez-vous vers votre service RH / SIRH. ` +
            `Détails du périmètre : cases/${slug}/gouvernance/limites-refus.md.`,
        );
        ecrireRefusEligibilite(slug, date);
        if (rl) rl.close();
        process.exit(0);
      }

      // Étape 9 : afficher le bloc .env.local à recopier (jamais de clé écrite/lue).
      if (e.numero === 9) {
        console.log(
          `\nMode IA retenu : ${reponses["fournisseur.mode"]}. Recopiez le bloc .env.local ` +
            "correspondant à la main (la clé ne transite jamais par l'interview).",
        );
      }
    }

    const { fichiers } = appliquerCollecte(slug, collecte, { date });
    console.log(`\n${fichiers.length} fichier(s) produit(s) :`);
    for (const f of fichiers) console.log(`  ${f}`);

    afficherCommandesFinales(slug);
    console.log(
      `Cadrage terminé — votre harnais est décrit dans cases/${slug}/harnais.yaml (le manifeste).\n`,
    );
  } finally {
    if (rl) rl.close();
  }
  process.exit(0);
}

principal();
