import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const NotificationToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let colorClasses = 'border-blue-300 bg-blue-50/95 text-blue-900';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          colorClasses = 'border-emerald-300 bg-emerald-50/95 text-emerald-900';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          colorClasses = 'border-rose-300 bg-rose-50/95 text-rose-900';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all ${colorClasses}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-left min-w-0">
              <h5 className="font-['Montserrat'] font-semibold text-xs uppercase tracking-wider">
                {toast.title}
              </h5>
              <p className="font-['Plus_Jakarta_Sans'] text-xs mt-0.5 leading-relaxed opacity-90">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full hover:bg-black/10 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
