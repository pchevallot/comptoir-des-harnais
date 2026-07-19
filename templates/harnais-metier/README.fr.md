# Modèle générique — Harnais métier vierge

Ce dossier est un **template générique**, indépendant du cas RH. Il sert à
cadrer **n'importe quel harnais métier documentaire** avant d'écrire la moindre
ligne de contenu : cerner le besoin, recenser les sources, poser les limites de
l'IA, définir les tests et la réversibilité.

Un « harnais » n'est pas un chatbot libre : c'est un outil **borné**, qui
s'appuie sur des sources datées, refuse ce qui sort de son périmètre, et reste
sous gouvernance humaine. Ce modèle **ne vaut pas validation juridique**.

## À quoi sert ce template

À produire, pour un nouveau domaine métier, le dossier de cadrage minimal :

| Fichier | Rôle |
|---|---|
| `fiche-besoin.md` | Décrire le besoin réel (tâche répétée, fréquence, enjeux). |
| `registre-sources.md` | Recenser les documents de référence et leur propriétaire. |
| `classification.md` | Fixer le niveau de données admis (publique / interne). |
| `regles-ia.md` | Déclarer ce que l'IA peut et ne peut pas faire (socle de refus). |
| `tests.md` | Lister les questions attendues, la question piège de refus, les mentions. |
| `validation.md` | Consigner la relecture et le statut (prototype par défaut). |
| `journal.md` | Tracer les évolutions (métadonnées seulement). |
| `reversibilite.md` | Prévoir l'arrêt et le retour à une solution sans IA. |

## Comment l'utiliser

1. Copiez ce dossier vers votre espace de travail (ne modifiez pas
   `templates/`).
2. Remplissez d'abord `fiche-besoin.md` : si le besoin n'est pas clair, le
   harnais n'a pas lieu d'être.
3. Renseignez le registre, la classification, puis les règles de l'IA et les
   tests avant tout développement.
4. Ne consignez **que des fonctions**, jamais des personnes nommées, et
   **aucune donnée personnelle réelle**.
