# ops-helpdesk-assistant: ops helpdesk assistant (RAG over runbooks)

## Goal
MVP v0.1 (live by 6 Dec): a question box that answers sysadmin questions
using the markdown runbooks in /runbooks, with sources shown next to each answer.
Later releases are in docs/PLAN.md. Build only what the current release needs.

## Stack
React frontend, Node/TypeScript API, Postgres + pgvector,
Docker Compose locally, GitHub Actions CI, AWS deploy.
Plain LLM SDK first, no LangChain unless a release needs it.

## Rules
- /runbooks is the knowledge base. Keep the front matter format
  (title, category, keywords, last_reviewed).
- Rules engine: pass-through only in v0.1. Real rules come in a later release.
- Never use confidential material from a former employer: no names, diagrams or code.
- One release at a time: tag vX.Y, update CHANGELOG.md, keep README
  (60-second reviewer tour) and the demo script current.
- Small commits, one topic each. Keep the app deployable at all times.

## Commands
<fill in: dev, test, lint, ingest>