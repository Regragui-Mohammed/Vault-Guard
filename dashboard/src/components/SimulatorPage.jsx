import { useState, useEffect, useRef } from 'react';
import { Zap, Shield, AlertTriangle, Play, RotateCcw } from 'lucide-react';
import { ATTACK_SIM_STEPS } from '../data/mockData';

const STAGES = [
  { id: 'idle', label: 'Ready', color: 'var(--text-muted)' },
  { id: 'attacking', label: 'Simulating Attack...', color: 'var(--red)' },
  { id: 'defended', label: 'Attack Defeated', color: 'var(--green)' },
];

export default function SimulatorPage({ addToast, setThreatLevel }) {
  const [stage, setStage] = useState('idle');
  const [lines, setLines] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const termRef = useRef(null);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  const runSimulation = () => {
    if (stage === 'attacking') return;
    setStage('attacking');
    setThreatLevel('warning');
    setLines([]);
    setLineIdx(0);
    addToast('info', '⚡ Ransomware simulation initiated — monitoring defense layers...');
  };

  useEffect(() => {
    if (stage !== 'attacking') return;
    if (lineIdx >= ATTACK_SIM_STEPS.length) {
      setTimeout(() => {
        setStage('defended');
        setThreatLevel('secure');
        addToast('success', '🛡️ All 5 archives INTACT. chattr +i defense held. 0 bytes lost.');
      }, 600);
      return;
    }
    const timer = setTimeout(() => {
      setLines(prev => [...prev, ATTACK_SIM_STEPS[lineIdx]]);
      setLineIdx(idx => idx + 1);
    }, lineIdx === 0 ? 400 : 700);
    return () => clearTimeout(timer);
  }, [stage, lineIdx]);

  const reset = () => {
    setStage('idle');
    setLines([]);
    setLineIdx(0);
    setThreatLevel('secure');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Warning Banner */}
      <div style={{
        padding: '14px 20px',
        background: 'var(--amber-dim)',
        border: '1px solid rgba(255,184,0,0.3)',
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <AlertTriangle size={18} color="var(--amber)" />
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>Controlled Demo Environment — Read-Only</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 12 }}>
            This simulation runs against mock data. No real files are modified.
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Simulator Panel */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--red)', border: '1px solid rgba(255,56,100,0.3)',
              ...(stage === 'attacking' ? { animation: 'pulse 1s ease-in-out infinite' } : {}),
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>Ransomware Attack Simulator</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>
                sudo rm -rf /srv/vaultguard/archives/
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
            Simulates a root-level <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4 }}>rm -rf</code> command targeting all backup archives — the first action any ransomware takes.
            <br /><br />
            Vault-Guard defends via <strong style={{ color: 'var(--purple)' }}>chattr +i</strong> immutability, which blocks deletion at the kernel/VFS layer — even for root.
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              id="btn-run-attack"
              className={`btn ${stage === 'defending' ? 'btn-ghost' : 'btn-danger'}`}
              onClick={runSimulation}
              disabled={stage === 'attacking'}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {stage === 'attacking'
                ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Attacking...</>
                : <><Zap size={15} /> Launch Attack</>
              }
            </button>
            <button
              id="btn-reset-sim"
              className="btn btn-ghost"
              onClick={reset}
            >
              <RotateCcw size={15} /> Reset
            </button>
          </div>

          {/* Defense Status */}
          {stage !== 'idle' && (
            <div style={{
              marginTop: 20, padding: '14px 16px',
              background: stage === 'defended' ? 'var(--green-dim)' : 'var(--red-dim)',
              border: `1px solid ${stage === 'defended' ? 'rgba(0,255,157,0.3)' : 'rgba(255,56,100,0.3)'}`,
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.5s ease',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: stage === 'defended' ? 'var(--green)' : 'var(--red)' }}>
                {stage === 'attacking'
                  ? '⚡ Attack in progress — chattr +i defense active...'
                  : '🛡️ DEFENSE SUCCESSFUL — All archives INTACT'}
              </div>
              {stage === 'defended' && (
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                  5 files protected • 0 bytes lost • chattr +i held • systemd timer unaffected
                </div>
              )}
            </div>
          )}
        </div>

        {/* Defense Layers Status */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} style={{ color: 'var(--cyan)' }} />
            Defense Layers — Live Status
          </div>
          {[
            { name: 'chattr +i (Immutability)', status: 'ACTIVE', detail: 'Kernel-level block on all 5 archives', color: 'purple', icon: '🔒' },
            { name: 'ACL — backup-svc (PoLP)', status: 'ACTIVE', detail: 'No delete/read rights on archive dir', color: 'cyan', icon: '🛡️' },
            { name: 'GPG Encryption', status: 'ACTIVE', detail: 'All archives encrypted — privkey off-site', color: 'green', icon: '🔐' },
            { name: 'systemd Timers', status: 'ACTIVE', detail: 'vault-guard.timer — unaffected by attack', color: 'cyan', icon: '⏱️' },
          ].map((layer, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${stage === 'attacking' ? `var(--${layer.color})40` : 'var(--border-dim)'}`,
              marginBottom: 10,
              transition: 'all 0.4s ease',
              boxShadow: stage === 'attacking' ? `0 0 12px var(--${layer.color})20` : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {layer.icon} {layer.name}
                </span>
                <span className={`status-pill pill-${layer.color === 'green' ? 'verified' : layer.color === 'purple' ? 'locked' : 'cyan'}`}>
                  {layer.status}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {layer.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Output */}
      <div className="attack-terminal">
        <div className="terminal-header">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-title">root@backup-server-01 — /srv/vaultguard/archives</span>
          {stage === 'attacking' && (
            <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--red)', animation: 'pulse-dot 1s ease-in-out infinite' }}>
              ● ATTACK ACTIVE
            </span>
          )}
          {stage === 'defended' && (
            <span style={{ marginLeft: 'auto', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>
              ✓ DEFENDED
            </span>
          )}
        </div>
        <div className="terminal-body" ref={termRef} style={{ maxHeight: 220, overflowY: 'auto' }}>
          {stage === 'idle' && (
            <div className="term-line">
              <span className="term-prompt">root@server:~#</span>
              <span className="term-cmd"> Click "Launch Attack" to begin simulation</span>
              <span className="term-cursor" />
            </div>
          )}
          {lines.map((line, i) => (
            <div key={i} className="term-line">
              {line.type === 'cmd' && <><span className="term-prompt">root@server:~#</span><span className="term-cmd"> {line.label}</span></>}
              {line.type === 'error' && <span className="term-error">{line.label}</span>}
              {line.type === 'success' && <span className="term-success">{line.label}</span>}
            </div>
          ))}
          {stage === 'attacking' && lineIdx < ATTACK_SIM_STEPS.length && (
            <div className="term-line">
              <span className="term-cursor" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
