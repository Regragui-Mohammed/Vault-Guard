import { Terminal, RefreshCw } from 'lucide-react';
import { AUDIT_LOGS } from '../data/mockData';

export default function LogsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          journalctl -u vault-guard -u vault-retention -f --since today
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="status-pill pill-verified">9 entries</span>
          <span className="status-pill pill-encrypted">journald</span>
        </div>
      </div>

      {/* Main Log Terminal */}
      <div className="attack-terminal" style={{ border: '1px solid var(--border-glow)' }}>
        <div className="terminal-header">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-title" style={{ marginLeft: 8 }}>
            journald — vault-guard.service — 2026-10-19
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>
            ● Live Feed
          </span>
        </div>
        <div style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: 12, maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {AUDIT_LOGS.map((log, i) => (
            <div key={i} className="log-entry">
              <span className="log-time">{log.time}</span>
              <span className={`log-level level-${log.level.toLowerCase()}`}>[{log.level}]</span>
              <span className="log-msg">{log.msg}</span>
            </div>
          ))}
          <div className="log-entry">
            <span className="log-time" style={{ color: 'var(--text-muted)' }}>--:--:--</span>
            <span className="log-level level-info">[INFO]</span>
            <span style={{ color: 'var(--text-muted)' }}>Waiting for next scheduled run (2026-10-20 04:00:00)</span>
            <span className="term-cursor" style={{ marginLeft: 8 }} />
          </div>
        </div>
      </div>

      {/* Log Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { level: 'SUCCESS', count: 2, color: 'green', pill: 'pill-verified' },
          { level: 'INFO', count: 7, color: 'cyan', pill: 'pill-cyan' },
          { level: 'WARN', count: 0, color: 'amber', pill: 'pill-warning' },
          { level: 'ERROR', count: 0, color: 'red', pill: 'pill-danger' },
        ].map((s, i) => (
          <div key={i} className="card stat-card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-mono)', color: `var(--${s.color})` }}>
              {s.count}
            </div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 4, letterSpacing: 1 }}>
              [{s.level}]
            </div>
          </div>
        ))}
      </div>

      {/* logger command explanation */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
          How logging is implemented
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          background: 'var(--bg-void)', padding: '14px 16px',
          borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)',
          lineHeight: 2,
        }}>
          <div><span style={{ color: 'var(--text-muted)' }}># log_msg() function in backup-orchestrator.sh</span></div>
          <div>
            <span style={{ color: 'var(--purple)' }}>log_msg</span>
            <span style={{ color: 'var(--text-primary)' }}>()</span>
            <span style={{ color: 'var(--text-muted)' }}> {'{'}</span>
          </div>
          <div style={{ paddingLeft: 24 }}>
            <span style={{ color: 'var(--cyan)' }}>echo</span>
            <span style={{ color: 'var(--text-primary)' }}> "$MSG"</span>
          </div>
          <div style={{ paddingLeft: 24 }}>
            <span style={{ color: 'var(--cyan)' }}>logger</span>
            <span style={{ color: 'var(--amber)' }}> -t Vault-Guard </span>
            <span style={{ color: 'var(--text-primary)' }}>"$MSG"</span>
          </div>
          <div><span style={{ color: 'var(--text-muted)' }}>{'}'}</span></div>
          <div style={{ marginTop: 8 }}>
            <span style={{ color: 'var(--text-muted)' }}># Retrieve with:</span>
          </div>
          <div>
            <span style={{ color: 'var(--green)' }}>journalctl</span>
            <span style={{ color: 'var(--text-primary)' }}> -t Vault-Guard --since today</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 12 }}>
          All backup events are forwarded to <strong style={{ color: 'var(--cyan)' }}>systemd-journald</strong> via the <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>logger</code> command, providing centralized, structured log management without external dependencies.
        </div>
      </div>
    </div>
  );
}
