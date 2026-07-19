# Comptoir des Harnais

**La langue de référence de ce projet est le français.**
➡️ **Documentation principale : [README.fr.md](./README.fr.md)**

The full documentation is written in French. The one-page summary below is
provided for non-French-speaking readers.

---

## English summary (one page)

**Comptoir des Harnais** ("Harness Counter") is an open-source repository that
explains what an *AI harness* is for public-sector organisations, and ships a
first complete, working example: a **documentary HR onboarding web
application** that is configurable, sourced and governed.

**An AI harness is not a prompt.** A prompt is a single throwaway instruction. A
harness is a structured whole — business need, identified and dated sources,
rules, guardrails, automated tests, named responsibilities and visible proof —
that frames an AI system so it produces something useful, maintainable and
governed.

**What it does.** A public organisation can clone the repository, run it locally
in a few commands, and get a **new-joiner onboarding portal**: a reading path,
a library of fact sheets, a sourced FAQ, a quiz and governance pages. Every
answer cites its sources; limits and governance are shown on screen; guardrails
are covered by automated tests. The organisation can then replace the fictional
content with its own — by editing YAML and Markdown files, **without touching
the code**.

**What it is not.**

- It is **not an HRIS** (human resources information system) and not a module of
  one.
- It is **not a case-management tool**: no individual records, no named files,
  no personal data.
- It is **not a decision system**: it explicitly **refuses** questions about an
  identifiable individual, and that refusal is tested.
- It is **not a compliance tool**: nothing here makes anything "compliant"; the
  app carries the notice that it "does not amount to legal validation".

**No real personal data, anywhere** — not in the demo, the tests or the config
examples. The demonstration uses a fully fictional local authority, the
"Communauté de communes de Roche-Vallonne", with content marked as fictional.

**Model provider and graceful degradation.** The model call sits behind a
substitutable interface set in `.env` via `MODEL_PROVIDER`. The default,
`local`, is a deterministic **local document search** with **no network calls**
that works offline without any key. Setting it to `none` cleanly disables the
generative FAQ while everything else keeps working and guardrails stay active.

**Quick start.**

```bash
git clone <repo>
cd comptoir-des-harnais
cp .env.example .env
npm install
npm run dev      # http://localhost:3000
npm test
```

Requirements: Node.js 20+. No account, external service or database is needed
for the demo mode.

**Licensing.** Code under **MIT** (provisional). Documentary content
(`content/`, `docs/`) proposed under **CC BY-SA 4.0** (provisional). See
[LICENSES.fr.md](./LICENSES.fr.md).

---

<sub>Maintained by Le Comptoir des Signaux / Pascal Chevallot.</sub>
