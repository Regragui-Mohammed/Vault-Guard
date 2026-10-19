import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';

const PAGE_META = {
  overview:   { title: 'System Overview', sub: '/srv/vaultguard • systemd managed • GPG encrypted' },
  archives:   { title: 'Backup Archives', sub: 'Immutable • Encrypted • SHA-256 Verified' },
  pillars:    { title: 'Security Pillars', sub: '3-layer defense-in-depth architecture' },
  simulator:  { title: 'Attack Simulator', sub: 'Controlled ransomware simulation — read-only demo' },
  automation: { title: 'Automation & Timers', sub: 'systemd service units • journald logging' },
  logs:       { title: 'Audit Logs', sub: 'journald • vault-guard • vault-retention' },
};

export default function TopBar({ activeTab, threatLevel }) {
  const meta = PAGE_META[activeTab] || PAGE_META.overview;
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{meta.title}</h1>
        <p><span style={{ color: 'var(--cyan)', marginRight: 6 }}>›</span>{meta.sub}</p>
      </div>

      <div className="topbar-right">
        <span className="timestamp-badge">🕐 {now}</span>
        <div className={`threat-level ${threatLevel === 'secure' ? 'secure' : 'warning'}`}>
          {threatLevel === 'secure'
            ? <><Shield size={13} /> THREAT LEVEL: SECURE</>
            : <><AlertTriangle size={13} /> THREAT LEVEL: WARNING</>
          }
        </div>
      </div>
    </header>
  );
}
