[Project](../../README.md) › [Docs](../README.md) › [Decisions](README.md) › ADR 0003

# ADR 0003: Strategic DDD with domain folders, interfaces only at external boundaries

- Status: Accepted
- Date: 2026-11-27
- Issue: #3

## Context

The backend has four domains: **reports** (import from Köln, store, list), **service pages** (fetch, chunk, embed and search the city's service pages), **triage** (rules engine) and **drafting** (retrieve chunks, ask the LLM, cite sources). Around them sit the HTTP routes and shared infrastructure (config, database pool, LLM clients).

In v0.1 the business logic in these domains is thin:

| Domain | Real logic in v0.1 |
| --- | --- |
| Reports | ETL: fetch, map, upsert |
| Service pages | Indexing: fetch, chunk, embed, store; one SQL search |
| Triage | Pass-through; real rules in v0.2 |
| Drafting | Search, build a prompt, one LLM call |

The complexity is in integration (an unreliable city API, retrieval quality), not in business rules. I know Clean Architecture and DDD from professional work, and the question was which parts of them this project needs. Learning them in depth is out of scope here ([project goal](../../README.md#goal-of-the-project)).

## Options

1. **Full Clean Architecture**: entity, use-case, interface-adapter and framework layers, an interface for every dependency.
2. **DDD with tactical patterns**: aggregates, value objects, domain events, repositories behind interfaces.
3. **Strategic DDD with domain folders**: one shared vocabulary from the domain (ubiquitous language), the domains as folders and borders, interfaces only at external boundaries, and no tactical patterns.

## Decision

Option 3.

- With option 1, most of the code would be mapping between layers that each do almost nothing.
- With option 2, an aggregate would have nothing to protect: Köln owns the state of a report, and the app only copies it.
- The project uses the **strategic part of DDD**: the **ubiquitous language** (the [glossary](../README.md#glossary), used the same way in code, docs and UI, with domain names such as `report` and `service page` instead of technique names such as `knowledge`) and the **domains** as folders and borders.
- From Clean Architecture it takes **ports where there is a real external system** and the tests need a fake.

| Dependency | Interface? | Why |
| --- | --- | --- |
| Open311 API | Yes: `Open311Client` | Köln adapter plus a fake in tests (also a CLAUDE.md rule) |
| LLM API | Yes: `LlmClient` | CI runs without API keys; tests need deterministic drafts |
| Embedding API | Yes: `EmbeddingClient` | Same as the LLM |
| Postgres | No: plain repository functions | One implementation, nothing to fake; tested against the Compose database |
| Rules engine | No | A pure function needs no port |

A good test for every interface: does it have a second implementation? If not, it adds indirection and buys nothing.

Target structure:

```text
apps/api/src/
  http/        Fastify routes (inbound adapter)
  reports/     report type, repository, import; open311/ (interface + Köln adapter)
  service-pages/  chunk type, chunking, repository, vector search
  triage/      rules engine (pure function)
  drafting/    drafter (service-pages search + LlmClient)
  shared/      config, db pool, LLM and embedding clients
  scripts/     import-reports.ts, index-service-pages.ts
  server.ts
```

## Consequences

- Domains use each other only through exported functions (drafting calls the `service-pages` search; it does not query the chunk table).
- `routes/health.ts` moves to `http/` when the first domain code lands, not in #3.
- Tests can swap the three external clients for fakes; database code is tested against a real Postgres.
- If the domain logic grows, the project has no layers to grow into, and some code will move.

## Revisit when

v0.2 rules become rich (many rules, priorities, service levels, overrides). Triage may then need richer modelling than a pure function over a list of rules.

---

[← ADR 0002](0002-koeln-only-data-model.md) · [Decisions index](README.md)
