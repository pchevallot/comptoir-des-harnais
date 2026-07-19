# Glossaire

Ce glossaire définit chaque terme du projet en une ou deux phrases de langage
courant, avec un exemple. Il évite le jargon : les mots techniques y sont
expliqués, jamais supposés connus.

> **À qui s'adresse ce document ?** À tout le monde. C'est la référence commune
> du projet : dès qu'un terme du glossaire apparaît pour la première fois dans un
> autre document, il renvoie ici.

---

### Harnais (harnais IA)

Ensemble structuré qui encadre une IA pour produire quelque chose d'utile et
maîtrisé : besoin métier, sources, règles, garde-fous, tests, responsabilités et
preuves. Un harnais n'est pas un prompt (une simple phrase tapée à l'IA).
*Exemple : le portail d'accueil des nouveaux arrivants de la démo est un harnais
documentaire complet.*

### Source

Document existant sur lequel s'appuient les réponses : délibération, règlement
intérieur, note de service, guide officiel. Dans ce projet, l'IA ne répond
**qu'à partir des sources** déclarées, jamais d'elle-même.
*Exemple : la source SRC-003 est la note de télétravail de la collectivité
fictive.*

### Registre des sources

Liste organisée de toutes les sources d'un harnais, avec pour chacune :
identifiant, titre, propriétaire (une fonction), date de version, statut et
périmètre de validité. Il est rendu visible à l'écran.
*Exemple : la page « sources et dates de mise à jour » affiche le registre.*

### Garde-fou

Règle de sécurité appliquée par l'application elle-même, qui l'empêche de faire
ce qu'elle ne doit pas faire (par exemple répondre sur un cas individuel ou
affirmer sans source). Les garde-fous sont vérifiés par des tests.
*Exemple : une question sur « le dossier de Madame X » déclenche un refus poli.*

### Classification des données

Rangement de chaque source selon quatre niveaux — *publique*, *interne*,
*personnelle*, *sensible* — pour savoir ce que l'on peut traiter. Règle du cadre :
on ne traite que *publique* et *interne* ; *personnelle* ou *sensible* rend le
cas inéligible et impose un renvoi vers le DPO.
*Exemple : une note de service diffusable en interne est classée « interne ».*

### Millésime

Année (ou date) de référence d'une donnée ou d'une source, qui indique de quand
elle date et jusqu'à quand elle reste valable. Un chiffre sans millésime n'est
pas défendable.
*Exemple : « effectifs 2024 » précise le millésime de la donnée.*

### Statut (prototype / interne / production)

Niveau de maturité et de diffusion d'un harnais, décidé par un humain :

- **prototype** — pour comprendre et démontrer ; sources fictives ou vérifiées ;
  jamais diffusé au-delà de l'équipe projet ; aucune donnée personnelle réelle.
- **usage interne** — diffusé à des agents identifiés ; sources réelles validées ;
  fiche de validation signée ; DPO informé.
- **mise en production** — accessible au-delà de l'équipe ; toutes les exigences
  instruites ; revue DSI/DPO/RSSI faite ; responsable de maintenance nommé.

*Exemple : le mode démonstration est un prototype, et l'application l'affiche.*

### Mode dégradé

État dans lequel l'application continue de fonctionner alors qu'une partie est
volontairement désactivée. Ici, sans fournisseur de modèle (`MODEL_PROVIDER=none`),
la FAQ générative est coupée proprement mais parcours, fiches, quiz et
gouvernance restent utilisables, et les garde-fous restent actifs.
*Exemple : hors ligne et sans clé, on peut toujours consulter toutes les fiches.*

### Réversibilité

Capacité à récupérer et réutiliser tout son travail sans être prisonnier d'un
outil ou d'un fournisseur. Tout le harnais est en formats ouverts (Markdown,
YAML), lisible et exportable.
*Exemple : changer de fournisseur de modèle ne fait perdre aucun contenu.*

### Sourçage

Fait de rattacher chaque affirmation à une ou plusieurs sources identifiées.
Une réponse sans source est refusée ou signalée comme « je ne sais pas ».
*Exemple : la réponse de la FAQ cite « d'après SRC-001 et SRC-003 ».*

### Mention d'assistance IA

Information affichée qui signale qu'une réponse a été produite avec l'aide d'une
IA générative. Elle relève de la transparence attendue.
*Exemple : chaque réponse de la FAQ porte une mention indiquant l'assistance IA
et le modèle utilisé (nom générique).*

### Modèle d'IA générative

Programme informatique capable de produire du texte à partir d'une demande.
Formule employée dans ce projet à la place des termes techniques abrégés, pour
rester compréhensible.
*Exemple : la FAQ peut s'appuyer, en option, sur un modèle d'IA générative
externe.*

### Recherche documentaire locale

Mode par défaut de l'application : elle cherche la réponse **dans les sources
fournies**, sur la machine, **sans aucun appel réseau** et de façon
reproductible. Elle fonctionne hors ligne et sans clé.
*Exemple : `MODEL_PROVIDER=local` active la recherche documentaire locale, qui
sert à la démonstration et aux tests.*

---

## Ce que ce document ne couvre pas

- Les termes purement techniques du code (ils sont documentés dans `src/` et la
  documentation d'architecture).
- Les définitions juridiques précises (RGPD, AI Act) : elles relèvent du DPO et
  des juristes de chaque organisation.
