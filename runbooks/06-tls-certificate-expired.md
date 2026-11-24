---
title: TLS certificate expired or about to expire
category: web
keywords: [tls, ssl, certificate, expired, certbot, lets encrypt, https]
last_reviewed: 2026-11-24
---

# TLS certificate expired or about to expire

## Symptoms

- Browser warning about an invalid or expired certificate
- API clients fail with "certificate has expired"

## Quick checks

1. Check the certificate the server really sends:
   `echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates -issuer -subject`
2. See which certificate files nginx uses: `sudo nginx -T | grep ssl_certificate`
3. With certbot (Let's Encrypt), list certificates and expiry dates: `sudo certbot certificates`
4. Is automatic renewal scheduled? `systemctl list-timers | grep certbot`

## Fix

1. Test renewal without changing anything: `sudo certbot renew --dry-run`
2. Renew: `sudo certbot renew`
3. Reload the web server so it picks up the new files: `sudo systemctl reload nginx`
4. If renewal fails, the usual causes are:
   - port 80 is blocked, so the HTTP-01 challenge cannot reach the server
   - the DNS record no longer points to this server
   - the renewal timer is not running
5. Use `fullchain.pem` as the certificate file, not `cert.pem`, or some clients will complain about the chain.

## Verify

- Run the `openssl` command from step 1 again: the dates are new.
- The site opens in a browser without a warning.

## Prevent

- Alert at 14 days before expiry.
- Renew with a deploy hook that reloads nginx automatically.

## Escalate when

- The certificate comes from a paid provider or an internal authority: request a new one from the owner.
