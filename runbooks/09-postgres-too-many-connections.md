---
title: PostgreSQL "too many clients already"
category: database
keywords: [postgres, postgresql, too many clients, max_connections, connection pool, pgbouncer, idle in transaction]
last_reviewed: 2026-11-24
---

# PostgreSQL "too many clients already"

## Symptoms

- `FATAL: sorry, too many clients already`
- `FATAL: remaining connection slots are reserved for non-replication superuser connections`
- New requests to the application fail while the database itself looks healthy

## Quick checks

1. The limit: `SHOW max_connections;`
2. How many connections exist: `SELECT count(*) FROM pg_stat_activity;`
3. Who holds them:
   `SELECT usename, application_name, state, count(*) FROM pg_stat_activity GROUP BY 1, 2, 3 ORDER BY 4 DESC;`
4. Sessions stuck inside an open transaction:
   `SELECT pid, now() - xact_start AS open_for, query FROM pg_stat_activity WHERE state = 'idle in transaction' ORDER BY open_for DESC;`

## Fix

1. Free slots right now by ending idle or stuck sessions: `SELECT pg_terminate_backend(<pid>);`
   Connect with an administrator account, which has reserved slots.
2. Find the cause in the application: connection pool size multiplied by the number of app instances is often larger than `max_connections`. Lower the pool size, and look for code that opens connections and never closes them.
3. Put a pooler such as PgBouncer between the application and the database.
4. Stop sessions from hanging in a transaction: set `idle_in_transaction_session_timeout` (for example `'60s'`).
5. Raising `max_connections` is the last resort: it needs a restart and uses more memory.

## Verify

- `SELECT count(*) FROM pg_stat_activity;` stays well below `max_connections` during normal traffic.
- The application no longer logs connection errors.

## Escalate when

- The connection count climbs again soon after you clean up: the application has a leak that developers must fix.
