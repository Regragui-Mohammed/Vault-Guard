# 🛡️ Vault-Guard: Enterprise Ransomware-Resilient Backup System

![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Bash](https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnu-bash&logoColor=white)
![Security](https://img.shields.io/badge/DevSecOps-000000?style=for-the-badge&logo=security&logoColor=white)
![Systemd](https://img.shields.io/badge/Systemd-42A5F5?style=for-the-badge)

> An enterprise-grade, immutable, encrypted, and zero-downtime backup orchestration system built entirely with native Linux tools.

---

## 🚨 The Business Problem

In enterprise environments, data loss incidents (especially due to Ransomware) lead to severe legal and financial consequences under strict compliance frameworks like GDPR/DSGVO. Modern ransomware specifically targets and deletes/encrypts backups first before attacking the main production servers. 

If a backup system is built simply using standard tools (like `cp` or `tar`), a root-level attacker can easily wipe out the entire backup repository, leaving the company defenseless.

---

## 🛡️ The Solution (The 4 Security Pillars)

Vault-Guard defeats ransomware and unauthorized access through a strict 4-pillar defense-in-depth architecture:

1. **Zero-Downtime Backups (LVM):** Uses Logical Volume Manager (`lvcreate`) snapshots to capture crash-consistent backups of live data without stopping production services.
2. **Principle of Least Privilege (PoLP):** Uses a dedicated service account (`backup-svc`) that only has rights to write data, but absolutely no rights to delete or modify existing backups.
3. **Immutable Archives (`chattr +i`):** Once a backup is generated, it is locked at the filesystem level. Not even the `root` user can delete or tamper with the file unless the immutability flag is explicitly removed.
4. **Asymmetric Encryption (GPG):** Backups are encrypted using a Public Key on the server. The Private Key resides completely off-site, meaning an attacker cannot read the backup contents even if the server is fully compromised.

---

## ⚙️ Tech Stack & Native Tools

* **Core Scripting:** Bash (`trap` error handling, arrays, flow control)
* **Storage & Sync:** LVM Snapshots, Rsync (`--link-dest` for incremental), Tar
* **Security & Permissions:** Advanced ACLs (`setfacl`), Sudoers Drop-in files, GPG, `chattr`
* **Automation & Logging:** Systemd (Services & Timers), `journald` (`logger`)

---

## 🏗️ Project Architecture & Workflow

The system is built in 5 distinct phases:

### Phase 1: Environment & Identity Model
- Creation of dedicated system accounts (`backup-svc` for execution, `backup-admin` for retention).
- Implementation of Advanced ACLs (`setfacl`) on `/srv/vaultguard/`.
- Configuration of strict `/etc/sudoers.d/` drop-in files for privilege escalation restriction.

### Phase 2: The Core Backup Engine (Zero-Downtime)
- Execution of LVM snapshots to freeze data in time.
- Incremental synchronization using `rsync` with hard-links to save disk space and reduce I/O.
- Compression of the staging area into a single `.tar` archive.

### Phase 3: Encryption & Immutability (The Armor)
- Asymmetric GPG encryption applied to the final archive.
- SHA-256 hash generation for integrity verification.
- Application of `chattr +i` to render the backup cryptographically secure and immutable.

### Phase 4: Automation & Orchestration
- Bash `trap` integration for robust error handling and temporary file cleanup.
- Orchestration via `systemd` timers (replacing standard `cron`).
- Enterprise-grade logging forwarded to `journald`.

### Phase 5: Retention & Audit Lifecycle
- Automated cleanup of backups older than 30 days using `find -mtime`.
- Regulated removal of immutability flags by `backup-admin` prior to deletion.

---

## 🔐 The Privilege Escalation Model

To ensure extreme security, `backup-admin` is the only account capable of removing the immutability flag. This is achieved via a highly restricted sudoers file:

```sudoers
# /etc/sudoers.d/backup-admin
backup-admin ALL=(root) NOPASSWD: /usr/bin/chattr
