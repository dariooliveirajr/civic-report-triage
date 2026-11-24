---
title: Docker container keeps restarting
category: containers
keywords: [docker, container, restarting, crash loop, exit code, oomkilled, healthcheck, compose]
last_reviewed: 2026-11-24
---

# Docker container keeps restarting

## Symptoms

- `docker ps` shows the status "Restarting (1) ..." for a container
- The service is up for a few seconds, then unavailable again

## Quick checks

1. List all containers, including stopped ones: `docker ps -a`
2. Read the last log lines: `docker logs --tail 100 <container>` (with Compose: `docker compose logs -f <service>`)
3. Get the exit code and whether the container ran out of memory:
   `docker inspect -f '{{.State.ExitCode}} {{.State.OOMKilled}}' <container>`
4. Read the exit code:
   - `1`: the application stopped with an error, see the logs
   - `126` or `127`: the start command is not executable or not found
   - `137`: the process was killed, often because of the memory limit (`OOMKilled` is true)

## Fix

1. Application error in the log: usually a missing environment variable, a wrong configuration value or a failed database connection. Correct it and recreate the container.
2. Database or another dependency was not ready yet: add a healthcheck to it and use `depends_on` with `condition: service_healthy` in Compose.
3. `OOMKilled` is true: raise the memory limit or reduce the application's memory use.
4. Port already in use or a volume permission problem: the log usually says so. Free the port or fix the ownership of the volume.
5. To look inside, start a shell instead of the normal command: `docker run --rm -it --entrypoint sh <image>`
6. Started right after a new image: roll back to the previous image tag.
7. Recreate after the fix: `docker compose up -d --force-recreate <service>`

## Verify

- `docker ps` shows the container as "Up" for more than a minute, and "healthy" if a healthcheck exists.
- The service answers on its port.

## Escalate when

- The container still restarts and the logs show no cause: ask the developers of the image.
