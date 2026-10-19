// Centralized mock data — simulates real systemd / filesystem output
export const ARCHIVES = [
  {
    id: 1,
    name: 'backup-2026-10-19_04-00-01',
    size: '847 MB',
    encrypted: true,
    immutable: true,
    hashStatus: 'verified',
    sha256: 'a3f9c2...d84e1b',
    date: '2026-10-19 04:00:01',
    retention: '29 days',
    gpgRecipient: 'VaultGuard',
  },
  {
    id: 2,
    name: 'backup-2026-10-18_04-00-03',
    size: '821 MB',
    encrypted: true,
    immutable: true,
    hashStatus: 'verified',
    sha256: 'b8d1a7...c23f90',
    date: '2026-10-18 04:00:03',
    retention: '28 days',
    gpgRecipient: 'VaultGuard',
  },
  {
    id: 3,
    name: 'backup-2026-10-17_04-00-02',
    size: '819 MB',
    encrypted: true,
    immutable: true,
    hashStatus: 'verified',
    sha256: 'e4c2b9...f710a2',
    date: '2026-10-17 04:00:02',
    retention: '27 days',
    gpgRecipient: 'VaultGuard',
  },
  {
    id: 4,
    name: 'backup-2026-10-10_04-00-00',
    size: '803 MB',
    encrypted: true,
    immutable: true,
    hashStatus: 'verified',
    sha256: '7fa3d1...b092c5',
    date: '2026-10-10 04:00:00',
    retention: '20 days',
    gpgRecipient: 'VaultGuard',
  },
  {
    id: 5,
    name: 'backup-2026-09-25_04-00-01',
    size: '798 MB',
    encrypted: true,
    immutable: true,
    hashStatus: 'verified',
    sha256: '2c8f5e...a341d7',
    date: '2026-09-25 04:00:01',
    retention: '5 days',
    gpgRecipient: 'VaultGuard',
  },
];

export const STORAGE_DATA = [
  { label: 'Archives (.tar.gpg)', used: 4.1, total: 20, unit: 'GB', color: '#00d4ff' },
  { label: 'Staging Area', used: 0.85, total: 5, unit: 'GB', color: '#a855f7' },
  { label: 'Inode Savings (rsync hard-links)', used: 3.2, total: 3.2, unit: 'GB', color: '#00ff9d', saved: true },
];

export const SYSTEMD_TIMERS = [
  {
    name: 'vault-guard.timer',
    unit: 'vault-guard.service',
    schedule: 'Daily @ 04:00',
    lastRun: '2026-10-19 04:00:01',
    nextRun: '2026-10-20 04:00:00',
    status: 'active',
  },
  {
    name: 'vault-retention.timer',
    unit: 'vault-retention.service',
    schedule: 'Weekly (Monday)',
    lastRun: '2026-10-14 00:00:00',
    nextRun: '2026-10-21 00:00:00',
    status: 'active',
  },
];

export const AUDIT_LOGS = [
  { time: '04:00:01', level: 'INFO', msg: 'Vault-Guard: Starting backup orchestration cycle', },
  { time: '04:00:02', level: 'INFO', msg: 'rsync --link-dest: Incremental sync of /etc → staging/', },
  { time: '04:00:04', level: 'INFO', msg: 'Hard-link deduplication: 3.2 GB saved via inode reuse', },
  { time: '04:00:07', level: 'INFO', msg: 'tar -cf: Archive created → backup-2026-10-19_04-00-01.tar', },
  { time: '04:00:09', level: 'INFO', msg: 'gpg: Encrypting with public key (recipient: VaultGuard)', },
  { time: '04:00:11', level: 'INFO', msg: 'sha256sum: Checksum generated → .tar.gpg.sha256', },
  { time: '04:00:11', level: 'INFO', msg: 'chattr +i: Immutability lock applied to .tar.gpg', },
  { time: '04:00:11', level: 'INFO', msg: 'chattr +i: Immutability lock applied to .tar.gpg.sha256', },
  { time: '04:00:12', level: 'SUCCESS', msg: 'Backup COMPLETE — Encrypted ✓ Immutable ✓ Verified ✓', },
];

export const SECURITY_PILLARS = [
  {
    id: '01',
    name: 'Least Privilege',
    shortName: 'PoLP',
    desc: 'backup-svc writes. backup-admin purges. Zero cross-privilege escalation.',
    tech: 'ACL + sudoers',
    color: 'cyan',
  },
  {
    id: '02',
    name: 'Immutability',
    shortName: 'chattr +i',
    desc: 'Filesystem-level lock. Root cannot delete without backup-admin removing the flag.',
    tech: 'chattr +i / e2fsprogs',
    color: 'purple',
  },
  {
    id: '03',
    name: 'Asymmetric Crypto',
    shortName: 'GPG + RSA',
    desc: 'Public key on server. Private key stored off-site. Zero in-memory secrets.',
    tech: 'GnuPG / RSA-4096',
    color: 'green',
  },
];

export const ATTACK_SIM_STEPS = [
  { label: '$ sudo rm -rf /srv/vaultguard/archives/', type: 'cmd' },
  { label: 'rm: cannot remove \'backup-2026-10-19_04-00-01.tar.gpg\': Operation not permitted', type: 'error' },
  { label: 'rm: cannot remove \'backup-2026-10-18_04-00-03.tar.gpg\': Operation not permitted', type: 'error' },
  { label: '→  chattr +i protection: ALL 5 ARCHIVES INTACT', type: 'success' },
  { label: '→  Ransomware simulation DEFEATED. 0 bytes lost.', type: 'success' },
];
