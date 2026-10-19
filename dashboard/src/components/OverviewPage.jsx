import { useEffect, useState } from 'react';
import { Shield, Database, Lock, CheckCircle, Clock, Archive } from 'lucide-react';
import { ARCHIVES, STORAGE_DATA, AUDIT_LOGS } from '../data/mockData';

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ icon: Icon, iconClass, title, value, sub, trend, trendClass }) {
  const [displayed, setDisplayed] = useState(0);
  const numericVal = parseFloat(value);

  useEffect(() => {
    if (isNaN(numericVal)) return;
    let start = 0;
    const inc = numericVal / 30;
    const timer = setInterval(() => {
      start += inc;
      if (start >= numericVal) { setDisplayed(numericVal); clearInterval(timer); }
      else setDisplayed(start);
    }, 30);
    return () => clearInterval(timer);
  }, [numericVal]);

  const displayValue = isNaN(numericVal) ? value :
    (Number.isInteger(numericVal) ? Math.round(displayed) : displayed.toFixed(1));

  return (
    <div className="card stat-card">
      <div className="stat-card-header">
        <div className={`stat-card-icon ${iconClass}`}>
          <Icon size={20} />
        </div>
        {trend && <span className={`stat-trend ${trendClass}`}>{trend}</span>}
      </div>
      <div className="stat-value">{displayValue}{typeof value === 'string' && isNaN(numericVal) ? '' : value.replace(/[\d.]+/, '')}</div>
      <div className="stat-label">{title}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

// ─── Storage Bars ─────────────────────────────────────────────
function StorageBars() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="card chart-card">
      <div className="section-header">
        <span className="section-title">
          <Database size={16} className="section-title-icon" style={{ color: 'var(--cyan)' }} />
          Storage Efficiency
        </span>
        <span className="section-meta">rsync --link-dest deduplication</span>
      </div>
      <div className="storage-bars">
        {STORAGE_DATA.map((item, i) => {
          const pct = item.saved ? 100 : Math.round((item.used / item.total) * 100);
          return (
            <div className="storage-bar-item" key={i}>
              <div className="storage-bar-header">
                <span className="storage-bar-label">{item.label}</span>
                <span className="storage-bar-value">
                  {item.saved ? `+${item.used} ${item.unit} SAVED` : `${item.used} / ${item.total} ${item.unit}`}
                </span>
              </div>
              <div className="storage-bar-track">
                <div
                  className="storage-bar-fill"
                  style={{
                    width: animated ? `${pct}%` : '0%',
                    background: item.color,
                    boxShadow: `0 0 8px ${item.color}60`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, padding: '12px', background: 'var(--green-dim)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,255,157,0.2)' }}>
        <div style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          ✓ 3.2 GB SAVED via inode hard-link deduplication (rsync --link-dest)
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
          Unchanged files share inodes across incremental backups — zero redundant disk I/O
        </div>
      </div>
    </div>
  );
}

// ─── Backup Lifecycle ─────────────────────────────────────────
const STEPS = [
  { label: 'rsync Incremental Sync', detail: '--link-dest → hard-link deduplication', time: '04:00:01 → 04:00:04', status: 'done' },
  { label: 'tar Archive Creation', detail: 'Compress staging/ → .tar bundle', time: '04:00:04 → 04:00:07', status: 'done' },
  { label: 'GPG Asymmetric Encryption', detail: 'pubkey: VaultGuard → .tar.gpg', time: '04:00:07 → 04:00:09', status: 'done' },
  { label: 'SHA-256 Integrity Hash', detail: 'sha256sum → .tar.gpg.sha256', time: '04:00:09 → 04:00:11', status: 'done' },
  { label: 'chattr +i Immutability Lock', detail: 'Filesystem-level — root cannot delete', time: '04:00:11', status: 'done' },
  { label: 'Next Run (systemd timer)', detail: 'vault-guard.timer → 2026-10-20 04:00:00', time: 'Scheduled', status: 'active' },
];

function BackupLifecycle() {
  return (
    <div className="card lifecycle-card">
      <div className="section-header">
        <span className="section-title">
          <Clock size={16} style={{ color: 'var(--cyan)' }} />
          Last Backup Lifecycle
        </span>
        <span className="section-meta">2026-10-19 04:00:12</span>
      </div>
      <div className="lifecycle-steps">
        {STEPS.map((s, i) => (
          <div className="lifecycle-step" key={i}>
            <div className={`step-node ${s.status}`}>
              {s.status === 'done' ? '✓' : s.status === 'active' ? '▶' : `0${i + 1}`}
            </div>
            <div className="step-content">
              <div className="step-title">{s.label}</div>
              <div className="step-detail">{s.detail}</div>
              <div className="step-time">{s.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Archives Mini ─────────────────────────────────────
function RecentArchives() {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div className="section-header">
        <span className="section-title">
          <Archive size={16} style={{ color: 'var(--cyan)' }} />
          Latest Archives
        </span>
        <span className="section-meta">5 total</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {ARCHIVES.slice(0, 4).map((a) => (
          <div key={a.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 12px', background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)',
            transition: 'var(--transition)', cursor: 'default',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-glow)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-dim)'}
          >
            <div>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
                {a.name.slice(-19)}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{a.size} • {a.retention} left</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className="status-pill pill-verified">✓ Verified</span>
              <span className="status-pill pill-locked">🔒 Locked</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Page ────────────────────────────────────────────
export default function OverviewPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard icon={Archive} iconClass="icon-cyan" title="Total Archives" value="5" sub="in /srv/vaultguard/archives/" trend="↑ +1 today" trendClass="trend-up" />
        <StatCard icon={Shield} iconClass="icon-green" title="Integrity Score" value="100%" sub="All SHA-256 checksums verified" trend="✓ Secure" trendClass="trend-up" />
        <StatCard icon={Database} iconClass="icon-purple" title="Storage Savings" value="3.2 GB" sub="via rsync hard-link deduplication" trend="inode ✓" trendClass="trend-neutral" />
        <StatCard icon={Clock} iconClass="icon-amber" title="Next Backup" value="21h 59m" sub="vault-guard.timer → 04:00:00" trend="scheduled" trendClass="trend-neutral" />
      </div>

      {/* Middle row */}
      <div className="three-col">
        <BackupLifecycle />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <RecentArchives />
        </div>
      </div>

      {/* Bottom row */}
      <StorageBars />
    </div>
  );
}
