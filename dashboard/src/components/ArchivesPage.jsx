import { useState } from 'react';
import { Lock, FileCheck, Eye, Copy, CheckCircle } from 'lucide-react';
import { ARCHIVES } from '../data/mockData';

function copyToClipboard(text, cb) {
  navigator.clipboard.writeText(text).then(cb);
}

export default function ArchivesPage({ addToast }) {
  const [verifying, setVerifying] = useState(null);
  const [verified, setVerified] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const handleVerify = (id) => {
    setVerifying(id);
    addToast('info', `Verifying SHA-256 integrity for archive #${id}...`);
    setTimeout(() => {
      setVerifying(null);
      setVerified(prev => ({ ...prev, [id]: true }));
      addToast('success', `✓ SHA-256 verified — Archive #${id} INTACT. No tampering detected.`);
    }, 1800);
  };

  const handleCopy = (id, hash) => {
    copyToClipboard(hash, () => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary Bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
      }}>
        {[
          { label: 'Total Archives', value: '5', color: 'cyan' },
          { label: 'All Immutable', value: '5 / 5', color: 'purple' },
          { label: 'All Encrypted', value: '5 / 5', color: 'green' },
          { label: 'Hash Verified', value: '5 / 5', color: 'green' },
        ].map((s, i) => (
          <div key={i} className="card stat-card" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: `var(--${s.color})` }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Archives Table */}
      <div className="card archives-card">
        <div className="archives-header">
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            <Lock size={16} style={{ color: 'var(--cyan)' }} />
            Encrypted Immutable Archives
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
            /srv/vaultguard/archives/ • GPG (VaultGuard pubkey) • chattr +i
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="archive-table">
            <thead>
              <tr>
                <th>Archive Name</th>
                <th>Size</th>
                <th>Date</th>
                <th>SHA-256 (partial)</th>
                <th>Retention</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ARCHIVES.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div className="archive-name">{a.name}.tar.gpg</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>+ .sha256</div>
                  </td>
                  <td>{a.size}</td>
                  <td>{a.date}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--text-code)' }}>{a.sha256}</span>
                      <button
                        id={`copy-hash-${a.id}`}
                        onClick={() => handleCopy(a.id, a.sha256)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedId === a.id ? 'var(--green)' : 'var(--text-muted)', padding: 2, transition: 'var(--transition)' }}
                      >
                        {copiedId === a.id ? <CheckCircle size={13} /> : <Copy size={13} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ color: parseInt(a.retention) <= 7 ? 'var(--amber)' : 'var(--text-secondary)' }}>
                    {a.retention}
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {a.encrypted && <span className="status-pill pill-encrypted">🔐 GPG</span>}
                      {a.immutable && <span className="status-pill pill-locked">🔒 chattr+i</span>}
                      {(verified[a.id] || a.hashStatus === 'verified') && (
                        <span className="status-pill pill-verified">✓ Verified</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <button
                      id={`verify-archive-${a.id}`}
                      className={`btn btn-sm ${verifying === a.id ? 'btn-ghost' : 'btn-primary'}`}
                      onClick={() => handleVerify(a.id)}
                      disabled={verifying === a.id}
                      style={{ opacity: verifying === a.id ? 0.7 : 1 }}
                    >
                      {verifying === a.id ? (
                        <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Verifying...</>
                      ) : (
                        <><FileCheck size={13} /> Verify Hash</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div style={{
        padding: '16px 20px', background: 'var(--purple-dim)',
        borderRadius: 'var(--radius-md)', border: '1px solid rgba(168,85,247,0.25)',
      }}>
        <div style={{ fontSize: 13, color: 'var(--purple)', fontWeight: 700, marginBottom: 6 }}>
          🔐 How the encryption model works
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Public Key</strong> (VaultGuard) lives on the backup server — only used to encrypt.<br />
          <strong style={{ color: 'var(--text-primary)' }}>Private Key</strong> is stored completely <em>off-site</em> — a compromised server cannot decrypt archives.<br />
          Even a full root-level breach exposes <strong style={{ color: 'var(--red)' }}>zero readable data</strong>.
        </div>
      </div>
    </div>
  );
}
