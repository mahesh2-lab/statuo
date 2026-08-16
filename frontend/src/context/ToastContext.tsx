import React, { useCallback, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastContext } from './toast-context';
import type { ToastMessage } from './toast-context';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title?: string) => showToast({ type: 'success', message, title }),
    error: (message: string, title?: string) => showToast({ type: 'error', message, title }),
    info: (message: string, title?: string) => showToast({ type: 'info', message, title }),
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none p-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-none border shadow-2xl bg-[#09090b] transition-all duration-150 animate-in fade-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'border-emerald-500/30 text-white'
                : t.type === 'error'
                  ? 'border-rose-500/30 text-white'
                  : 'border-white/20 text-white'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-zinc-300" />}
            </div>
            <div className="flex-1 min-w-0">
              {t.title && <div className="font-semibold text-xs leading-tight text-white">{t.title}</div>}
              <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed break-words">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-zinc-400 hover:text-white transition-colors p-0.5 -mr-1 -mt-1 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
