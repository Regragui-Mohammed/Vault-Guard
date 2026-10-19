import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(t);
  }, [toast.id]);

  const config = {
    success: { icon: CheckCircle, cls: 'toast-success' },
    error: { icon: AlertTriangle, cls: 'toast-error' },
    info: { icon: Info, cls: 'toast-info' },
  };
  const { icon: Icon, cls } = config[toast.type] || config.info;

  return (
    <div className={`toast ${cls}`} style={{ animation: 'slideIn 0.3s ease' }}>
      <Icon size={16} />
      <span style={{ flex: 1 }}>{toast.msg}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.7, padding: 2 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
}
