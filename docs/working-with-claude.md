[Project](../README.md) › [Docs](README.md) › Working with Claude

# Working with Claude

I build this project with Claude Code, an AI coding assistant. Claude writes most of the code; I decide the design, review every change and explain it back before it is committed. This page shows how that works and, more usefully, the moments where I stopped the AI, overruled it or changed how we work.

## Setup

| Tool | What it is used for |
| --- | --- |
| Claude Code in VS Code | Writes code and docs in small slices; runs tests and git commands with my approval |
| [`CLAUDE.md`](../CLAUDE.md) | Project rules the AI reads at the start of every session (no city API calls during requests, untrusted input, no confidential material) |
| Persistent memory | Working rules I gave once and the AI keeps across sessions (naming, branch names, how plans are approved) |
| Plan mode | The AI reads and proposes but changes nothing; I comment on the plan until I say "ready" |
| Output styles | "Learning" for topics that are new to me (RAG, pgvector, GitHub Actions, AWS): more explanation, and parts left for me to write. "Default" for code I already read fluently. |
| GitHub issues | One issue per session and branch; the slice plan is a checklist on the issue, ticked off with commit hashes |

## The cycle

Every change goes through five steps:

1. **Plan.** The AI proposes the change in 3–5 bullets and waits for my OK.
2. **Code.** One small slice: at most about three files, something I can run. Then it stops.
3. **Explain.** The AI explains what changed and why, and asks me one question about it.
4. **Explain back.** I answer in 2–3 lines in my own words; the AI says what I got wrong.
5. **Commit.** Only when I say so. I push only what I could debug tomorrow.

Parts I mark "mine" I write myself; the AI only gives hints and reviews.

**Why this cycle.** A randomized study by Anthropic ([AI assistance and coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills), 52 developers learning a new library) found that developers who generated code and then asked follow-up questions understood it best, and those who handed everything over understood it least. It is a small study run by the vendor, so I treat it as a direction, not proof. It matches my own experience: code I did not question is code I cannot debug.

## Friction log

Newest first. Each entry: the situation, what the AI did, what I decided, and the lesson.

### 2026-11-27 · A dependency hidden in the issue order

- **Situation:** Issue #3 asked for the chunk table, including its embedding column.
- **AI:** Pointed out that the column's vector size depends on the embedding model, which is only chosen in #8.
- **I decided:** Move the chunk table to #9, where the model is known. #3 creates only `reports` and `import_runs`.
- **Lesson:** Check each task for decisions it silently depends on. Moving the task is cheaper than a guess plus a migration to undo it.

### 2026-11-27 · Lost in naming

- **Situation:** The docs used "import" for reports, "ingest" for city pages and "knowledge" for the pages themselves. I asked why two verbs, and said "knowledge" reads like a variable called `data`.
- **AI:** First proposed one umbrella verb for both ("ingest"). When I asked how RAG and ETL really name these things, it revised: in RAG only documents are ingested, reports are the queries, so "ingest" for reports would repeat an earlier misunderstanding.
- **I decided:** Domain names for data, action names for steps: `import-reports`, `index-service-pages`, the `service-pages/` folder and `service_page_chunks`. "Ingestion" is the umbrella word, "knowledge base" only the RAG role. The rule is in the glossary, and I asked for a reading list on naming to learn it properly.
- **Lesson:** When names feel vague, ask how the field names things, then decide the project's vocabulary yourself and write it down. An AI's first naming fix can be one level too shallow.

### 2026-11-27 · A decision the AI assumed

- **Situation:** Reviewing the data-flow docs.
- **AI:** Named two specific LLM and embedding providers as if they were chosen. It had taken them from placeholder keys in `.env.example`.
- **I decided:** The provider is not chosen yet. The docs say "LLM API" and "embedding API" until the client issue (#8) decides.
- **Lesson:** An AI fills gaps with plausible defaults from whatever it finds in the repo. Check what was decided and what was only assumed.

### 2026-11-27 · Fixing a wrong fact at its source

- **Situation:** The AI kept describing my experience with a number of years that only counted my last job.
- **AI:** Had compressed my profile into one short fact in its memory and repeated it, including in a draft of these docs.
- **I decided:** Correct it where the AI reads it, not just in the reply: its project memory and the profile document other sessions use. Public docs now say "my professional work", without a number.
- **Lesson:** When an AI repeats a mistake, fix the source it learned it from, or it comes back in the next session.

### 2026-11-27 · Breaking my own rule, on purpose

- **Situation:** Splitting the design document into seven files, all docs, no code.
- **AI:** Followed the cycle and planned nine slices with a stop after each.
- **I decided:** No slices for this session: write everything, I review it all at once. Docs are low risk and easy to review as a whole; the time saved goes back into the schedule.
- **Lesson:** A process serves a goal. Relax it deliberately for low-risk work, and keep it for code.

### 2026-11-27 · The AI as a critic of the schedule

- **Situation:** I asked for a large documentation restructure.
- **AI:** Before starting, pointed out that the day's planned issues (#5–#11) had not started and that four working days were left for 20 issues.
- **I decided:** Timebox the docs to one day and record planned versus actual in [Project management](project-management.md).
- **Lesson:** Ask the AI to argue against your plan, not only to execute it.

### 2026-11-26 · Rejecting a file edit to see the content first

- **Situation:** We had agreed to write an ADR and redraw the architecture diagram.
- **AI:** Started editing the old `DESIGN.md` straight away.
- **I decided:** Rejected the edit and asked what the ADR would say. The AI showed the full draft in chat first; only then was it written.
- **Lesson:** Rejecting a tool call is a normal review step. Read the content before it lands in a file.

### 2026-11-26 · Questioning the product premise

- **Situation:** Planning the data model, I asked: who actually does the triage, and if forwarding is that simple, why is it not automated?
- **AI:** Did not defend the idea. It fetched real Köln data: the citizen picks the category, 96 of 100 reports were already closed, and the city's replies are not public. Forwarding by category is already solved.
- **I decided:** Move the value to urgency hidden in the text and to replies grounded in city pages, and state openly that the product is a hypothesis ([Product idea and its limits](../README.md#product-idea-and-its-limits)).
- **Lesson:** Use the AI to test a premise against data, not to argue for it.

### 2026-11-26 · Explaining back found a wrong mental model

- **Situation:** I explained the plan back and said I thought the reports would be embedded into chunks.
- **AI:** Explained the difference: reports are the questions (the query), city pages are the answers (the corpus). Only the pages are chunked and stored.
- **I decided:** Add a "Reports and knowledge" explanation and a glossary to the docs, because a reviewer may have the same question.
- **Lesson:** A wrong mental model costs nothing to fix before the code exists. The explain-back step is what finds it.

### 2026-11-26 · A diagram that contradicted the folder layout

- **Situation:** The design diagram drew the API, the import and the ingest as separate boxes, but the layout put them in one folder.
- **AI:** Had drawn a runtime view and a code view in one picture.
- **I decided:** One component view grouped by where the code lives, and the reasoning as [ADR 0001](decisions/0001-backend-boundary.md).
- **Lesson:** Review AI diagrams as strictly as AI code. A diagram that mixes views teaches the reader the wrong system.

### 2026-11-26 · A spec field I could not justify

- **Situation:** Issue #3, written earlier with the AI, asked for a `city` column. The project uses only Köln.
- **AI:** Compared the cost of adding it now with adding it later (one migration).
- **I decided:** No column now, and the decision recorded as [ADR 0002](decisions/0002-koeln-only-data-model.md) with the migration it would take later.
- **Lesson:** AI-written specs carry assumptions from earlier conversations. Question every field you cannot explain.

### 2026-11-26 · The approval dialog covered the answer

- **Situation:** In plan mode I left comments on the plan.
- **AI:** Answered them and opened the approval dialog in the same turn. The dialog covered the answer, and I approved a plan I had not read.
- **I decided:** The AI never opens the approval dialog until I say "ready". The rule is saved in its memory.
- **Lesson:** Do not let the tool's flow set the pace of your decisions.

### 2026-11-26 · Where the plan lives

- **Situation:** I asked how many slices the pull request for #2 had. The answer existed only in the chat.
- **AI:** Had kept the plan in the conversation.
- **I decided:** Every issue gets its slice plan as a checklist comment, ticked off with commit hashes.
- **Lesson:** Put the AI's plan where the work is tracked, not in a chat that disappears.

### 2026-11-26 · Rejecting a draft for its names

- **Situation:** The first config module for the API (#2).
- **AI:** Wrote it with short names common in the ecosystem: `z` for zod, `env`, `app`.
- **I decided:** Rejected the draft. Full words everywhere (`import * as zod from "zod"`, `environment`, `fastifyApp`), saved as a rule in the AI's memory so I say it once.
- **Lesson:** An assistant follows the ecosystem's habits by default. Readability rules are yours to set, and they only stick if they are written down.

### 2026-11-25 · Conventions are mine

- **Situation:** The first branch (#1).
- **AI:** Named it `feat/1-monorepo-skeleton`.
- **I decided:** `feature/<issue>-<slug>` for features, `docs/<slug>` for doc-only changes, saved in memory.
- **Lesson:** Small conventions are cheap to set on day one and expensive to clean up later.

## What I check in AI output

- **Read closely:** the data model, configuration, anything that touches data or secrets, and every test (does it test something?).
- **Skim:** boilerplate and styling.
- **Verify facts against the source:** API behaviour and data formats are checked by fetching real data, not taken from the AI's memory.
- **Never in the repo:** secrets, personal data, names or material from a former employer.

## Takeaways

1. Stay the one who decides: the AI proposes, I approve, and "ready" is my word.
2. Small slices plus explaining back keep the code understandable to me.
3. Question specs, diagrams and premises as hard as code, and write the decisions down.
4. Use the AI as a critic (of the plan, the schedule, the idea), not only as a typist.
5. Bend the process on purpose when the risk is low, and say so.

---

[← Decisions](decisions/README.md) · [Docs index](README.md) · [Project management →](project-management.md)
