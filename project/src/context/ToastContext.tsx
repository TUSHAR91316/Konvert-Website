import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = React.useRef<Record<string, number>>({});

  const hideToast = useCallback((id: string) => {
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, message, type }]);

    const timeoutId = window.setTimeout(() => {
      hideToast(id);
    }, 3500);
    timeoutRefs.current[id] = timeoutId;
  }, [hideToast]);

  React.useEffect(() => {
    const currentTimers = timeoutRefs.current;
    return () => {
      Object.values(currentTimers).forEach(t => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-item toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle2 className="text-emerald" style={{ width: '18px', height: '18px' }} />}
              {toast.type === 'error' && <AlertCircle style={{ width: '18px', height: '18px', color: '#ef4444' }} />}
              {toast.type === 'info' && <Info style={{ width: '18px', height: '18px', color: '#3b82f6' }} />}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button
              onClick={() => hideToast(toast.id)}
              className="toast-close"
              aria-label="Close notification"
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
