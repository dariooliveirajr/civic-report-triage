---
title: SSH login fails with "Permission denied"
category: linux
keywords: [ssh, permission denied, publickey, authorized_keys, key permissions]
last_reviewed: 2026-11-24
---

# SSH login fails with "Permission denied"

## Symptoms

- `Permission denied (publickey)` when connecting
- Login works for one user or key but not another

## Quick checks

1. Run the client in verbose mode and see which keys are offered: `ssh -v user@host`
2. Check the username. Cloud images use different defaults (for example `ubuntu`, `ec2-user`, `admin`).
3. Check the private key permissions on your machine: `chmod 600 ~/.ssh/id_ed25519`
4. On the server, check ownership and permissions:
   - `~/.ssh` must be `700`
   - `~/.ssh/authorized_keys` must be `600`
   - the home directory must not be writable by group or others
5. Check that your public key is really listed in `authorized_keys`.
6. Read the server log: `sudo journalctl -u ssh` (the unit is called `sshd` on some distributions) or `/var/log/auth.log`.

## Fix

1. Correct the permissions and ownership from step 4: `chown -R user:user ~/.ssh`
2. Add the missing public key to `authorized_keys`.
3. If you changed `sshd_config` (for example `PubkeyAuthentication`, `AllowUsers`), test it before reloading: `sudo sshd -t`, then `sudo systemctl reload ssh`.
4. On SELinux systems: `restorecon -R ~/.ssh`
5. Keep your existing session open while you test the change in a second terminal.

## Verify

- A new `ssh user@host` login succeeds.

## Escalate when

- You are locked out completely: use the provider console or session manager to get in and fix the configuration.
- The log shows login attempts you do not recognise: treat it as a security incident.
