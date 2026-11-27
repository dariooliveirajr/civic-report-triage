[Project](../../README.md) › [Docs](../README.md) › [Decisions](README.md) › ADR 0002

# ADR 0002: Köln only, no `city` column

- Status: Accepted
- Date: 2026-11-26
- Issue: #3

## Context

Issue #3 asked for a `city` column on reports and chunks and a unique key on `(city, service_request_id)`, because the project started with more than one city in mind. Köln is now the only data source. Other cities are possible later, but none is planned. The project rule is to build only what the current release needs, without making the next step expensive.

## Options

1. **`city` column now**, unique on `(city, service_request_id)`, `city` in `sources.yaml`, `--city` on the import script.
2. **No `city` column.** Keep the seams that are useful anyway, and add the column when a second city is real.

## Comparison

| | Option 1: column now | Option 2: column later |
| --- | --- | --- |
| Cost now | Every query, upsert, test fixture, API response and `sources.yaml` entry carries a value that is always `'koeln'` | None |
| Cost later | None | One migration. All existing rows are Köln, so the backfill is a default value. |
| What it solves for a second city | Only the column | Same |

The migration that option 2 needs later:

```sql
ALTER TABLE reports ADD COLUMN city text NOT NULL DEFAULT 'koeln';
ALTER TABLE reports DROP CONSTRAINT reports_service_request_id_key;
ALTER TABLE reports ADD CONSTRAINT reports_city_service_request_id_key
  UNIQUE (city, service_request_id);
```

The hard parts of a second city are not the column: a new adapter, different category names (every rule and every `sources.yaml` entry is keyed by category), a knowledge base possibly in another language, a different licence. A column added now solves none of them. [03 Data flow](../03-data-flow.md#other-cities) shows what Zürich and San Francisco data look like.

## Decision

Option 2. Köln is the only city, and the data model has no `city` column. These seams stay, because they are useful even with one city:

- the Open311 interface with one adapter per city (tests use a fake)
- `source` and `licence` on every report and chunk
- the original record in `raw` (jsonb)
- Köln-specific mapping only inside the Köln adapter

## Consequences

- `service_request_id` is unique on its own.
- `city:` is removed from `service-pages/sources.yaml`, `--city` from the import script, and the `city` column from issue #3.
- A second city starts with the migration above, then an adapter, then category mapping.

## Revisit when

A second city is actually on the roadmap.

---

[← ADR 0001](0001-backend-boundary.md) · [Decisions index](README.md) · [ADR 0003 →](0003-code-structure.md)
