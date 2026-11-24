---
title: Disk full on a Linux server
category: linux
keywords: [disk, df, no space left on device, logs, inodes]
last_reviewed: 2026-11-24
---

# Disk full on a Linux server

## Symptoms

- Errors such as "No space left on device"
- Services crash or cannot write logs, uploads or database files
- `df -h` shows a filesystem at 100%

## Quick checks

1. See which filesystem is full: `df -h`
2. Check inodes too, a disk can be full of tiny files: `df -i`
3. Find the biggest directories on that filesystem: `sudo du -xh / --max-depth=2 2>/dev/null | sort -rh | head -20`
4. Look for files that were deleted but are still held open: `sudo lsof +L1`

## Fix

1. Old logs: check `/var/log` and make sure logrotate is working.
2. systemd journal: `sudo journalctl --vacuum-size=500M` (or `--vacuum-time=7d`).
3. Package cache: `sudo apt-get clean`
4. Docker: look at `docker system df`, then remove what you do not need with `docker image prune`. Do not run `docker system prune -a` without checking what it removes.
5. Deleted but open files from step 4 above: restart the process that holds them, the space is freed only then.
6. Never delete files inside the database data directory by hand.

## Verify

- `df -h` shows enough free space (aim for under 80% used).
- Restart services that crashed and check their status with `systemctl status <service>`.

## Prevent

- Alert at 80% disk usage.
- Cap the journal size with `SystemMaxUse=500M` in `/etc/systemd/journald.conf`.

## Escalate when

- The space is taken by real data (database, uploads) that keeps growing: the volume needs to be extended.
- You cannot tell which process fills the disk.
