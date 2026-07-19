<!--
MODÈLE — CLASSIFICATION DES DONNÉES (vide, commenté).
En V1, un harnais ne traite que les niveaux "publique" et "interne".
Toute donnée "personnelle" ou "sensible" rend le cas inéligible et impose un
renvoi vers le DPO. Remplacez les valeurs entre chevrons <…>.
-->

# Classification des données

Quatre niveaux : **publique**, **interne**, **personnelle**, **sensible**.
Ce harnais ne traite que **publique** et **interne**.

| Source | Niveau |
|---|---|
| <SRC-000 — Titre> | <publique \| interne> |
| <…> | <…> |

**Règle de refus.** Si une source ou une question fait apparaître une donnée
**personnelle** ou **sensible**, le cas est **inéligible** en l'état : renvoi
vers le DPO. Aucune donnée personnelle réelle ne figure dans le corpus.

<!-- La classification est validée par le DPO avant tout usage réel. -->
