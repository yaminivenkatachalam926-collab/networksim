import { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X, XCircle } from 'lucide-react';

const icons  = { success: CheckCircle, warning: AlertTriangle, error: XCircle, info: Info };
const colors = { success: '#22c55e',   warning: '#f59e0b',     error: '#ef4444', info: '#00d4ff' };

export default function Toast({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(t => {
        const Icon = icons[t.type] || Info;
        return (
          <div key={t.id} className="toast" style={{ '--toast-color': colors[t.type] || colors.info }}>
            <Icon size={18} className="toast-icon" color={colors[t.type]} />
            <span className="toast-msg">{t.message}</span>
            <X size={14} className="toast-close" onClick={() => removeToast(t.id)} />
          </div>
        );
      })}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), duration);
  };

  return { toasts, addToast, removeToast };
}
