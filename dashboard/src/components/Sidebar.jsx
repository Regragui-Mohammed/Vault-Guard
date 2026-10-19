import { useState, useEffect } from 'react';
import {
  Shield, Database, Lock, Key, Clock, Activity,
  BarChart3, FileCheck, AlertTriangle, CheckCircle,
  Zap, Archive, RefreshCw, Terminal, Server,
  ChevronRight, Layers, Eye
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', icon: BarChart3, label: 'Overview', badge: null },
  { id: 'archives', icon: Archive, label: 'Archives', badge: '5', badgeType: 'cyan' },
  { id: 'pillars', icon: Shield, label: 'Security Pillars', badge: null },
  { id: 'simulator', icon: Zap, label: 'Attack Simulator', badge: 'DEMO', badgeType: 'amber' },
  { id: 'automation', icon: Clock, label: 'Automation', badge: null },
  { id: 'logs', icon: Terminal, label: 'Audit Logs', badge: null },
];

export default function Sidebar({ activeTab, onTabChange }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (d) => d.toLocaleTimeString('en-GB');

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Shield size={22} color="white" />
        </div>
        <div className="logo-text">
          <span className="logo-title">Vault-Guard</span>
          <span className="logo-subtitle">SecOps v1.0</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navigation</span>
        {NAV_ITEMS.map(({ id, icon: Icon, label, badge, badgeType }) => (
          <button
            key={id}
            id={`nav-${id}`}
            className={`nav-item${activeTab === id ? ' active' : ''}`}
            onClick={() => onTabChange(id)}
          >
            <Icon size={17} />
            <span>{label}</span>
            {badge && (
              <span className={`nav-badge badge-${badgeType || 'cyan'}`}>{badge}</span>
            )}
          </button>
        ))}

        <span className="nav-section-label" style={{ marginTop: 8 }}>System</span>
        <div className="nav-item" style={{ cursor: 'default' }}>
          <Server size={17} />
          <span>backup-server-01</span>
          <span className="nav-badge badge-green">online</span>
        </div>
        <div className="nav-item" style={{ cursor: 'default' }}>
          <Key size={17} />
          <span>GPG Key: VaultGuard</span>
          <span className="nav-badge badge-cyan">loaded</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot online" />
          <div className="status-info">
            <div className="status-label">All Systems Nominal</div>
            <div className="status-sub">{fmt(time)} • UTC+1</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
