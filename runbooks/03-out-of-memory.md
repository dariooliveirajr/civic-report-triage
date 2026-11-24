---
title: Out of memory on a Linux server
category: linux
keywords: [memory, oom killer, swap, killed process, memory leak]
last_reviewed: 2026-11-24
---

# Out of memory on a Linux server

## Symptoms

- A process disappears without a clear error
- The kernel log says "Out of memory: Killed process"
- The server is very slow and swaps heavily

## Quick checks

1. Memory and swap overview: `free -h`
2. Look for OOM kills: `dmesg -T | grep -i -E 'out of memory|killed process'` or `journalctl -k | grep -i oom`
3. Biggest memory users: `ps aux --sort=-%mem | head`
4. Swapping activity (columns `si` and `so`): `vmstat 1 5`
5. With Docker: `docker stats --no-stream`

## Fix

1. Restart the service that uses too much memory. This is a stopgap if the cause is a leak.
2. Limit the damage in future: set `MemoryMax=` in the systemd unit, or `--memory` for a Docker container, so one service cannot take the whole server.
3. Short-term relief, add swap:
   `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile`
   Add it to `/etc/fstab` if it should survive a reboot.
4. If the workload simply needs more memory, resize the server.

## Verify

- `free -h` shows free or available memory again.
- No new OOM lines appear in the kernel log after some hours.

## Escalate when

- Memory use grows steadily after every restart: this points to a memory leak in the application, which the developers need to fix.
