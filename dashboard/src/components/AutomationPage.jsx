import { Clock, CheckCircle, Server } from 'lucide-react';
import { SYSTEMD_TIMERS } from '../data/mockData';

const SERVICES = [
  {
    name: 'vault-guard.service',
    type: 'oneshot',
    user: 'backup-svc',
    exec: '/srv/vaultguard/scripts/backup-orchestrator.sh',
    security: ['NoNewPrivileges=true', 'ProtectSystem=strict', 'ReadWritePaths=/srv/vaultguard/'],
    status: 'active (exited)',
    lastResult: 'success',
  },
  {
    name: 'vault-retention.service',
    type: 'oneshot',
    user: 'backup-admin',
    exec: '/srv/vaultguard/scripts/vault-retention.sh',
    security: ['User=backup-admin (sudoers restricted)', 'Retention: 30 days'],
    status: 'active (exited)',
    lastResult: 'success',
  },
];

function TimerCard({ timer }) {
  const nextDate = new Date(timer.nextRun);
  const now = new Date();
  const diffMs = nextDate - now;
  const diffH = Math.floor(diffMs / 3600000);
  const diffM = Math.floor((diffMs % 3600000) / 60000);

  return (
    <div className="card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
            {timer.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>→ {timer.unit}</div>
        </div>
        <span className="status-pill pill-verified">● ACTIVE</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Schedule', value: timer.schedule, color: 'var(--cyan)' },
          { label: 'Last Run', value: timer.lastRun, color: 'var(--text-secondary)' },
          { label: 'Next Run', value: timer.nextRun, color: 'var(--text-secondary)' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{row.label}</span>
            <span style={{ color: row.color, fontFamily: 'var(--font-mono)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Countdown */}
      <div style={{
        marginTop: 14, padding: '10px 14px',
        background: 'var(--cyan-dim)', borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-glow)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Clock size={14} color="var(--cyan)" />
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
          Next trigger in {diffH}h {diffM}m
        </span>
      </div>
    </div>
  );
}

function ServiceCard({ svc }) {
  return (
    <div className="card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
          {svc.name}
        </div>
        <span className="status-pill pill-verified">✓ {svc.lastResult}</span>
      </div>

      {/* Unit info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {[
          { k: 'Type', v: svc.type },
          { k: 'User', v: svc.user },
          { k: 'ExecStart', v: svc.exec.split('/').pop() },
          { k: 'Status', v: svc.status },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{r.k}</span>
            <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Security directives */}
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
        Security Directives
      </div>
      {svc.security.map((s, i) => (
        <div key={i} style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--purple)',
          padding: '4px 10px', background: 'var(--purple-dim)',
          borderRadius: 4, marginBottom: 4, border: '1px solid rgba(168,85,247,0.15)',
        }}>
          {s}
        </div>
      ))}
    </div>
  );
}

export default function AutomationPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', padding: '12px 16px', background: 'var(--cyan-dim)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow)', fontFamily: 'var(--font-mono)' }}>
        💡 Vault-Guard uses <strong style={{ color: 'var(--cyan)' }}>systemd Timers</strong> instead of classic cron — providing journald integration, failure recovery, missed-job handling, and sandboxed execution per service unit.
      </div>

      <div>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          Active Timers
        </div>
        <div className="two-col">
          {SYSTEMD_TIMERS.map((t, i) => <TimerCard key={i} timer={t} />)}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          Service Units
        </div>
        <div className="two-col">
          {SERVICES.map((s, i) => <ServiceCard key={i} svc={s} />)}
        </div>
      </div>

      {/* Privilege model diagram */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Server size={16} style={{ color: 'var(--cyan)' }} /> Privilege Escalation Model
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto' }}>
          {[
            { user: 'backup-svc', can: ['rsync write', 'tar create', 'gpg encrypt', 'chattr +i'], cannot: ['delete archives', 'read privkey', 'chattr -i'], color: 'cyan' },
            { arrow: true },
            { user: 'backup-admin', can: ['sudo chattr -i (only)', 'rm expired archives'], cannot: ['read archives', 'execute backup', 'create keys'], color: 'purple' },
            { arrow: true },
            { user: 'root', can: ['system admin'], cannot: ['delete immutable files', 'decrypt without privkey'], color: 'amber', note: 'Even root is blocked by chattr +i!' },
          ].map((item, i) => {
            if (item.arrow) return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--border-glow)', fontSize: 20 }}>→</div>
            );
            return (
              <div key={i} style={{
                flex: 1, padding: '16px', background: 'var(--bg-surface)',
                border: `1px solid var(--${item.color})30`,
                borderRadius: 'var(--radius-md)', minWidth: 220,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', color: `var(--${item.color})`, marginBottom: 12 }}>
                  {item.user}
                </div>
                {item.note && (
                  <div style={{ fontSize: 10, padding: '4px 8px', background: 'var(--amber-dim)', borderRadius: 4, color: 'var(--amber)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
                    ⚠️ {item.note}
                  </div>
                )}
                <div style={{ fontSize: 10, color: 'var(--green)', marginBottom: 6, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>CAN DO:</div>
                {item.can.map((c, j) => <div key={j} style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3 }}>✓ {c}</div>)}
                <div style={{ fontSize: 10, color: 'var(--red)', margin: '10px 0 6px', fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>CANNOT:</div>
                {item.cannot.map((c, j) => <div key={j} style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>✗ {c}</div>)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
