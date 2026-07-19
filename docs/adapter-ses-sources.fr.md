# Adapter ses sources — du document Word/PDF au harnais

**À qui s'adresse ce guide.** À une DRH, une DGS, un agent producteur de contenus
(publics P1, P2) accompagné au besoin d'un collègue technique (P6). Il explique
comment partir de vos documents existants (Word, PDF, LibreOffice, pages
intranet) pour alimenter le portail, en toute sécurité.

**Ce que vous saurez faire après l'avoir lu.** Préparer une source à intégrer :
la convertir en texte contrôlé, la relire, lui ajouter les bonnes métadonnées, et
vérifier qu'elle ne contient aucune donnée personnelle. Vous saurez aussi ce que
ce guide **ne** couvre **pas**.

---

## 1. Faut-il forcément fournir ses documents en Markdown ?

**Réponse courte : non pour partir, oui pour intégrer.** Vous partez de vos
documents habituels (Word, PDF, LibreOffice). Mais le format **canonique** dans
lequel une source vit *dans le harnais* est le **Markdown** (fichier texte
`.md`), accompagné de quelques métadonnées. Le Markdown n'est pas une contrainte
technique gratuite : c'est ce qui rend le harnais **traçable, versionnable et
réversible**.

C'est un choix assumé, pas un obstacle : convertir un document en Markdown prend
quelques minutes, et cette étape est aussi le moment où l'on **relit et où l'on
retire ce qui n'a pas sa place** (données personnelles, mentions périmées).

## 2. Pourquoi le Markdown est le format canonique

- **Lisible sans outil.** Un `.md` s'ouvre dans n'importe quel éditeur de texte,
  se lit sur GitHub, se relit sans logiciel propriétaire.
- **Versionnable.** Chaque modification est traçable (qui a changé quoi, quand),
  ce qui est exactement ce qu'un DPO ou un DSI attend d'une source de référence.
- **Réversible.** Aucun verrou fournisseur : le contenu vous appartient, en
  format ouvert, exportable et pérenne. Perdre le portail ne fait perdre aucune
  source.
- **Contrôlable.** Le texte est explicite : pas de mise en forme cachée, pas de
  macro, pas de métadonnée invisible embarquée par un traitement de texte.
- **Séparé du code.** Les sources vivent dans `content/`, jamais dans `src/` :
  les adapter ne demande aucune compétence de développement (PRD §5.3).

Un PDF ou un DOCX, à l'inverse, mélange contenu, mise en forme et parfois des
données résiduelles (auteur, commentaires, versions). Il n'est ni facilement
comparable d'une version à l'autre, ni sûr à publier tel quel.

## 3. Convertir un PDF / DOCX en Markdown ou texte vérifié

Aucune conversion automatique n'est parfaite. Procédez du plus simple au plus
outillé :

1. **Copier-coller manuel (recommandé pour commencer).** Ouvrez le document,
   sélectionnez le texte utile, collez-le dans un fichier `.md`. Remettez en
   forme les titres (`#`, `##`), les listes (`-`) et le gras (`**...**`). C'est
   le plus fiable pour un document court, et cela vous force à relire.
2. **Export texte depuis le traitement de texte.** Word et LibreOffice savent
   « Enregistrer sous » en texte brut (`.txt`) ou en Markdown. Le résultat est à
   nettoyer, mais c'est un bon point de départ pour un document long.
3. **Outils de conversion.** Des convertisseurs (par exemple `pandoc`) produisent
   du Markdown depuis DOCX. Le résultat reste **toujours à relire** : titres à
   corriger, tableaux à simplifier, images à retirer ou à décrire.
4. **PDF scanné (image).** Un PDF issu d'un scan nécessite une reconnaissance de
   caractères (OCR). **La V1 ne fournit pas d'OCR robuste** : la sortie d'un OCR
   contient des erreurs (chiffres transformés, mots collés) et **doit être relue
   intégralement** avant toute intégration.

## 4. Pourquoi relire après conversion ou OCR

Une conversion ou un OCR peut, sans prévenir :

- transformer un chiffre (un « 2 » lu « 7 ») — critique pour une quotité, un
  délai, un montant ;
- coller ou couper des mots, inverser des lignes de tableau ;
- perdre le contexte d'un titre, et donc changer le sens ;
- laisser passer une mention obsolète ou une donnée personnelle.

Le harnais ne répond qu'à partir de ses sources : **une erreur dans la source
devient une erreur dans la réponse.** La relecture humaine n'est pas optionnelle,
c'est un garde-fou. Elle est portée par le propriétaire de la source.

## 5. Quelles métadonnées ajouter

Chaque source est un fichier `.md` qui commence par un bloc de métadonnées
(« frontmatter » entre deux lignes `---`). Exemple :

```markdown
---
id: "SRC-007"
titre: "Règlement intérieur — horaires variables"
proprietaire: "Direction des ressources humaines"
date: "2026-01-15"
statut: "active"          # active | perimee
perimetre: "Agents concernés par les horaires variables"
classification: "interne" # publique | interne  (V1 : rien d'autre)
fictif: false             # true pour une donnée de démonstration
---

# Titre du document

Le contenu relu et nettoyé, en Markdown…
```

| Champ | Rôle |
|---|---|
| `id` | Identifiant unique et stable (`SRC-007`), cité par les réponses et les fiches. |
| `titre` | Intitulé lisible de la source. |
| `proprietaire` | **Une fonction, jamais une personne** (ex. « Direction des ressources humaines »). |
| `date` | Date de version de la source (format `AAAA-MM-JJ`). Sert à détecter l'obsolescence. |
| `statut` | `active` ou `perimee`. Une source périmée n'est plus utilisée pour répondre. |
| `perimetre` | À qui / à quoi s'applique la source. |
| `classification` | `publique` ou `interne` uniquement en V1 (voir §6). |
| `fictif` | `true` pour la démonstration, `false` pour une source réelle. |

## 6. Limites : pas de données personnelles, pas de sensible en V1

Règle non négociable (PRD §9.2-1/2) : **le cadre ne traite que des données
`publique` ou `interne`.**

- **Aucune donnée personnelle** : pas de nom d'agent, pas de situation
  individuelle, pas de coordonnées personnelles, pas d'élément RH nominatif.
- **Aucune donnée sensible** : santé, opinions, éléments protégés.
- Si une source en contient, elle est **inéligible en l'état** : retirez ces
  éléments (anonymisez, généralisez en règle collective) **ou** renvoyez le cas
  vers le DPO avant toute intégration.

Test de sécurité : le dépôt vérifie automatiquement l'absence de motifs de
données réalistes (courriels réels, numéros de téléphone, numéros de sécurité
sociale) dans `content/`. Un import qui en contient fait échouer `npm test`.

## 7. Checklist d'import

Avant d'ajouter une source au portail :

- [ ] Le document a été converti en `.md` (ou `.txt`) et **relu intégralement**.
- [ ] Les chiffres, dates, délais et montants ont été **revérifiés** sur l'original.
- [ ] Aucune donnée personnelle ni sensible ne subsiste (noms, cas individuels…).
- [ ] Le frontmatter est complet : `id` unique, `titre`, `proprietaire` (fonction),
      `date`, `statut`, `perimetre`, `classification` (`publique`/`interne`),
      `fictif`.
- [ ] La source est classée `publique` ou `interne` (sinon : renvoi DPO).
- [ ] Le fichier est déposé dans `content/<votre-harnais>/sources/`.
- [ ] Les fiches qui citent cette source utilisent bien son `id`.
- [ ] `npm run validate-harness` puis `npm test` passent au vert.

## 8. Un outil d'amorçage : `import-source`

Pour éviter la page blanche, un script prépare le squelette d'une source à partir
d'un fichier `.md` ou `.txt` déjà converti et relu :

```bash
node scripts/import-source.mjs chemin/vers/document.txt --id SRC-007 --titre "Règlement horaires"
```

Il crée un fichier `.md` avec le frontmatter pré-rempli (à compléter) et le texte
inséré. **Il ne fait ni conversion PDF, ni OCR, ni contrôle de contenu** : la
relecture et le retrait des données personnelles restent à votre charge. Voir
l'aide : `node scripts/import-source.mjs --help`.

---

## Ce que ce document ne couvre pas

- La **conversion automatique fiable** de PDF scannés (OCR robuste) : hors V1.
- Le **traitement de données personnelles ou sensibles** : hors périmètre du
  cadre ; relève du DPO et d'un autre type de projet.
- La **qualification juridique** de vos sources ou de leur diffusion : elle
  relève du DPO, des juristes et des propriétaires de documents. Ce guide **ne
  vaut pas validation juridique**.
- Le choix éditorial de **quelles** sources retenir : c'est une décision métier.

Voir aussi : [`configuration-ia`](../src/app/configuration-ia) (page in-app),
`docs/gouvernance-rgpd-ai-act.fr.md`, et la page « Sources & dates » du portail.
