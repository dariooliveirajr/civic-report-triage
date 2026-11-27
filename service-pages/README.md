[Project](../README.md) › Service pages

# Service pages

The reply drafter answers only from the public pages listed in [`sources.yaml`](sources.yaml). Each entry names the page URL, the report categories it applies to and the responsible department. Köln is the only city ([ADR 0002](../docs/decisions/0002-koeln-only-data-model.md)).

The indexing script (`npm run index-service-pages`) fetches each listed page, extracts the main text, splits it into chunks and stores the chunks with their embeddings, the source URL and the fetch time in Postgres. Fetched pages are cached under `data/pages/` and are not committed. A page that cannot be fetched keeps its last stored version.

Every reply draft lists the chunks it used, with a link to the original page, so a draft can be checked against its source.

The entries in `sources.yaml` are a starting set. Entries are added when a report category has no matching page.

---

[← Project README](../README.md) · [Docs index](../docs/README.md)
