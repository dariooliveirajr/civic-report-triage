---
title: High CPU or load on a Linux server
category: linux
keywords: [cpu, load average, slow, top, iowait, runaway process]
last_reviewed: 2026-11-24
---

# High CPU or load on a Linux server

## Symptoms

- Slow responses or timeouts
- Load average clearly above the number of CPU cores
- A process using close to 100% CPU

## Quick checks

1. Compare load with cores: `uptime` and `nproc`
2. Find the busiest processes: `top -o %CPU` or `ps aux --sort=-%cpu | head`
3. Check whether the CPU is really the problem or the disk is: `vmstat 1 5`. A high `wa` (iowait) value points to slow disk, not CPU.
4. For disk detail: `iostat -x 1 3` (package `sysstat`)
5. Read the service log around the start of the problem: `journalctl -u <service> --since "30 min ago"`

## Fix

1. Is the load expected? A backup, cron job or deploy can cause short peaks. If so, wait or reschedule it.
2. Runaway process: ask it to stop with `kill -TERM <pid>`, and only if it ignores that, `kill -KILL <pid>`. Then restart the service.
3. Started right after a deploy: roll back to the previous version.
4. Database is the busy process: see the runbook "PostgreSQL slow query".
5. Traffic spike: check the web server logs for one client or bot and block or rate-limit it.

## Verify

- `uptime` shows the load falling below the core count.
- Response times are back to normal.

## Escalate when

- The load returns after a restart with no clear cause.
- The server is too small for the normal traffic: it needs more CPU.
