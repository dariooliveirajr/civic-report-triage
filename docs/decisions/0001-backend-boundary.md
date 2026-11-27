[Project](../../README.md) › [Docs](../README.md) › [Decisions](README.md) › ADR 0001

# ADR 0001: One backend codebase with three entry points

- Status: Accepted
- Date: 2026-11-26
- Issue: #3

## Context

The first design diagram drew "API", "Report import" and "Knowledge ingest" (now service page indexing) as separate boxes, while the repository layout put all three in `apps/api`. The diagram mixed two views: the runtime view (which process runs when) and the code view (which folder and image the code lives in). It could be read as "the API does the import" or as "import and indexing are separate services". Neither is true.

The terms used from here on:

- **API server**: the HTTP process (`apps/api/src/server.ts`). It answers the web app, reads only from Postgres and never calls a city API.
- **Import script**: `npm run import-reports`. Started by hand, calls the Köln Open311 API, writes reports to Postgres, exits.
- **Indexing script**: `npm run index-service-pages`. Started by hand, fetches the pages in `service-pages/sources.yaml`, chunks and embeds them, exits.

All three share code: database access, the embedding client (used by the drafter and by indexing), and the report and chunk types.

## Options

1. **One codebase, one image, three entry points** in `apps/api`.
2. **Split now**: the API server stays in `apps/api`, the scripts move to their own app and the shared code moves to a package:

   ```text
   apps/api/         API server only
   apps/ingestion/   import loop and service page indexing
   packages/core/    database access, Open311 adapter, embeddings, types
   ```

   The new app's name would be chosen at that point. "Worker" is the usual name and describes how it runs (in the background); "ingestion" describes what it does and matches the diagram.

## Decision

Option 1. In v0.1 both scripts are started by hand. A split would mean a shared package, a second build and a second image for two scripts, with no gain in scaling or isolation.

The folder keeps the name `apps/api`, although it holds more than the HTTP API. "Backend" would describe it better, but renaming it would touch the workspaces, the package name and later the CI paths and Dockerfiles. The component view in [04 Architecture](../04-architecture.md) shows what is inside.

## Consequences

- The production image of the API server also contains the script code and its dependencies (for example the HTML extraction library for indexing). For v0.1 that is a few megabytes, not a risk.
- Nothing in the build stops the HTTP routes from importing the Open311 client. The rule "no city API during a request" is kept by code review and by the folder structure in [ADR 0003](0003-code-structure.md), and should get a lint rule (an import restriction) once the folders exist.
- A crash in a script cannot take down the API server, because each entry point is its own process.
- Deploying the scripts is free: the same image, a different start command.

## Revisit when

- the import runs on a schedule and needs its own scaling, resources or dependencies (planned for v0.5), or
- a third consumer of the shared code appears.

Then option 2 applies.

---

[Decisions index](README.md) · [ADR 0002 →](0002-koeln-only-data-model.md)
