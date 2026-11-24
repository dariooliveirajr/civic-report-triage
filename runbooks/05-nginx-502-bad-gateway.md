---
title: nginx returns 502 Bad Gateway
category: web
keywords: [nginx, 502, bad gateway, upstream, proxy_pass, connection refused]
last_reviewed: 2026-11-24
---

# nginx returns 502 Bad Gateway

## Symptoms

- The browser shows "502 Bad Gateway"
- The nginx error log shows `connect() failed (111: Connection refused)`, `upstream timed out` or `no live upstreams`

## What it means

nginx is running, but it could not get a valid answer from the application behind it (the upstream).

## Quick checks

1. Read the error log: `sudo tail -n 50 /var/log/nginx/error.log`
2. Is the application running? `systemctl status <app>` or `docker ps`
3. Is it listening on the expected port? `ss -tlnp | grep :3000`
4. Ask the application directly, bypassing nginx: `curl -i http://127.0.0.1:3000/health`
5. Does `proxy_pass` in the nginx config point to that same address and port?

## Fix

1. Application down: start it and read why it stopped (`journalctl -u <app>` or `docker logs <container>`).
2. Wrong address or port in `proxy_pass`: correct it, then test and reload: `sudo nginx -t && sudo systemctl reload nginx`
3. nginx and the app run in different Docker containers: use the service name (for example `http://app:3000`), not `localhost`.
4. On SELinux systems nginx may be blocked from network connections: `sudo setsebool -P httpd_can_network_connect 1`
5. `upstream timed out`: first find out why the app is slow. Raise `proxy_read_timeout` only after you know the slowness is expected.

## Verify

- `curl -i` through nginx returns the normal status code.
- The error log stays quiet.

## Escalate when

- The application crashes again soon after each restart.
