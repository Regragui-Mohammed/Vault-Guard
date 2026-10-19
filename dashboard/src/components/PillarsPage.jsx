import { Shield, Lock, Key } from 'lucide-react';
import { SECURITY_PILLARS } from '../data/mockData';

const ICON_MAP = { cyan: Shield, purple: Lock, green: Key };
const TECH_DETAILS = {
  cyan: [
    { label: 'backup-svc', desc: 'Write-only via ACL (setfacl). Cannot delete/read archives.' },
    { label: 'backup-admin', desc: 'Retention only — sole account allowed to run sudo chattr -i.' },
    { label: 'sudoers drop-in', desc: '/etc/sudoers.d/backup-admin — NOPASSWD: /usr/bin/chattr only.' },
  ],
  purple: [
    { label: 'chattr +i', desc: 'Immutable flag set at ext4 filesystem level — atomic operation.' },
    { label: 'Root bypass?', desc: 'Root cannot delete immutable files without chattr -i first. backup-admin is the only sudo-authorized account.' },
    { label: 'Applied to', desc: 'Both .tar.gpg archive and .tar.gpg.sha256 checksum file.' },
  ],
  green: [
    { label: 'Algorithm', desc: 'RSA-4096 / Curve25519 asymmetric encryption via GnuPG.' },
    { label: 'Public Key', desc: 'Lives on the backup server — only encrypts. Never decrypts.' },
    { label: 'Private Key', desc: 'Stored completely off-site. A full server compromise = 0 data leaked.' },
  ],
};

function PillarCard({ pillar }) {
  const Icon = ICON_MAP[pillar.color];
  const details = TECH_DETAILS[pillar.color];

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '24px 24px 20px',
        borderBottom: '1px solid var(--border-dim)',
        background: `var(--${pillar.color}-dim)`,
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `var(--${pillar.color})`, boxShadow: `0 0 12px var(--${pillar.color})` }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44,
            background: `rgba(0,0,0,0.3)`,
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: `var(--${pillar.color})`,
            border: `1px solid var(--${pillar.color})30`,
          }}>
            <Icon size={22} />
          </div>
          <span style={{
            fontSize: 10, fontFamily: 'var(--font-mono)', letterSpacing: 2,
            color: `var(--${pillar.color})`, fontWeight: 700,
            padding: '4px 10px', background: 'rgba(0,0,0,0.3)',
            borderRadius: 99, border: `1px solid var(--${pillar.color})30`,
          }}>
            PILLAR {pillar.id}
          </span>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
          {pillar.name}
        </div>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: `var(--${pillar.color})`, marginBottom: 10 }}>
          {pillar.shortName}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {pillar.desc}
        </div>
      </div>

      {/* Details */}
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {details.map((d, i) => (
          <div key={i} style={{
            padding: '10px 14px',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-dim)',
          }}>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: `var(--${pillar.color})`, fontWeight: 700, marginBottom: 4 }}>
              {d.label}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{d.desc}</div>
          </div>
        ))}
        <div style={{ marginTop: 4 }}>
          <span className={`status-pill pill-${pillar.color === 'cyan' ? 'cyan' : pillar.color === 'purple' ? 'locked' : 'verified'}`}>
            ✓ ACTIVE
          </span>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: 10 }}>
            {pillar.tech}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PillarsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Architecture Overview Banner */}
      <div style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.06) 50%, rgba(0,255,157,0.06) 100%)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            🛡️ Defense-in-Depth Architecture
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Vault-Guard implements 3 independent security layers. An attacker must break <em>all three simultaneously</em> — including off-site key theft — to compromise backup integrity. Each pillar is designed so that breaking one still leaves the others intact.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: '0 0 auto' }}>
          {['PoLP', 'chattr +i', 'GPG RSA'].map((t, i) => (
            <div key={i} style={{
              padding: '6px 16px', background: 'var(--bg-card)', borderRadius: 99,
              border: '1px solid var(--border-glow)', fontSize: 12,
              fontFamily: 'var(--font-mono)', color: 'var(--cyan)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ color: 'var(--green)' }}>✓</span> {t}
            </div>
          ))}
        </div>
      </div>

      {/* 3 Pillar Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {SECURITY_PILLARS.map(p => <PillarCard key={p.id} pillar={p} />)}
      </div>

      {/* Attack Vector Matrix */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="section-title" style={{ marginBottom: 16, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={16} style={{ color: 'var(--red)' }} />
          Attack Vector Mitigation Matrix
        </div>
        <table className="archive-table">
          <thead>
            <tr>
              <th>Attack Vector</th>
              <th>Pillar 1: PoLP</th>
              <th>Pillar 2: Immutability</th>
              <th>Pillar 3: Encryption</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {[
              { attack: 'Ransomware (backup-svc context)', p1: '✓ No delete rights', p2: '✓ chattr blocks rm', p3: '✓ GPG encrypted', result: 'BLOCKED' },
              { attack: 'Root-level rm -rf', p1: '—', p2: '✓ Operation not permitted', p3: '✓ GPG encrypted', result: 'BLOCKED' },
              { attack: 'Server full compromise', p1: '—', p2: '✓ Archives intact', p3: '✓ Private key off-site', result: 'DATA SAFE' },
              { attack: 'backup-svc privilege escalation', p1: '✓ sudoers restricted', p2: '✓ Still immutable', p3: '✓ No privkey', result: 'BLOCKED' },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{row.attack}</td>
                <td style={{ color: 'var(--cyan)' }}>{row.p1}</td>
                <td style={{ color: 'var(--purple)' }}>{row.p2}</td>
                <td style={{ color: 'var(--green)' }}>{row.p3}</td>
                <td><span className="status-pill pill-verified">{row.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
