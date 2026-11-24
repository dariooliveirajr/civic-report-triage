---
title: PostgreSQL slow query
category: database
keywords: [postgres, postgresql, slow query, explain analyze, index, locks, pg_stat_activity]
last_reviewed: 2026-11-24
---

# PostgreSQL slow query

## Symptoms

- A page or API call that talks to the database is slow
- The database server shows high CPU or many long-running queries

## Quick checks

1. See what is running right now:
   `SELECT pid, now() - query_start AS duration, state, query FROM pg_stat_activity WHERE state <> 'idle' ORDER BY duration DESC;`
2. Check whether queries are waiting on locks: `SELECT pid, wait_event_type, wait_event, pg_blocking_pids(pid) FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0;`
3. If the `pg_stat_statements` extension is on, find the most expensive queries:
   `SELECT query, calls, mean_exec_time, total_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;`
4. Look at the plan: `EXPLAIN (ANALYZE, BUFFERS) <query>;`. Note that ANALYZE really runs the query, so wrap data-changing statements in `BEGIN; ... ROLLBACK;`.

## Fix

1. Plan shows a sequential scan on a large table: add an index, without blocking writes: `CREATE INDEX CONCURRENTLY idx_name ON table (column);`
2. Statistics are out of date: `ANALYZE table_name;`
3. A blocking session holds a lock: ask the owner, or cancel the query with `SELECT pg_cancel_backend(<pid>);`. Only if that fails, `SELECT pg_terminate_backend(<pid>);`
4. A table with many dead rows: `VACUUM (ANALYZE) table_name;`
5. If the query itself is poorly written (for example fetching all rows), the application needs to change.

## Verify

- Run `EXPLAIN (ANALYZE, BUFFERS)` again: runtime and plan have improved.
- The page or API call is fast again.

## Escalate when

- The slowness comes from the database server being too small, not from one query.
