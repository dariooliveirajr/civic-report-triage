---
title: DNS name does not resolve
category: network
keywords: [dns, name resolution, could not resolve host, dig, nslookup, resolv.conf]
last_reviewed: 2026-11-24
---

# DNS name does not resolve

## Symptoms

- "Could not resolve host" or "Name or service not known"
- A site works by IP address but not by name

## Quick checks

1. Is the network up at all? `ping 1.1.1.1`
2. What does the system resolver say? `getent hosts example.com` (this respects `/etc/hosts` too)
3. Ask DNS directly: `dig example.com` or `nslookup example.com`
4. Ask a different resolver and compare: `dig @1.1.1.1 example.com`
5. Check which resolver the machine uses: `resolvectl status` and `cat /etc/resolv.conf`
6. Look for an override in `/etc/hosts`.

## Fix

1. Public resolver answers, local one does not: fix the resolver settings, then restart it with `sudo systemctl restart systemd-resolved`.
2. Stale answer after a DNS change: flush the cache with `sudo resolvectl flush-caches`. Other resolvers may keep the old answer until the record's TTL runs out.
3. No resolver answers: the record is missing or wrong at the DNS provider. Check it with `dig NS example.com` to find the right provider, and correct the record.
4. Only on VPN or only in containers: check the DNS servers the VPN or the container runtime hands out.

## Verify

- `dig +short example.com` returns the expected address.
- The application connects by name again.

## Escalate when

- The record is correct at the provider but still fails from many places after the TTL has passed: contact the DNS provider.
