import { useEffect, useState } from 'react';
import { useToastStore, type Toast as ToastType } from '../../store/toastStore';
import './Toast.scss';

const icons: Record<ToastType['type'], string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  loading: '◌',
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToastStore();
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  return (
    <div 
      className={`toast toast--${toast.type} ${isExiting ? 'toast--exiting' : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className={`toast__icon ${toast.type === 'loading' ? 'toast__icon--spinning' : ''}`}>
        {icons[toast.type]}
      </span>
      <span className="toast__message">{toast.message}</span>
      {toast.type !== 'loading' && (
        <button 
          className="toast__close" 
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Notificaciones">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

export { ToastItem };

