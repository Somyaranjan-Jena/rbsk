import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    error:   'bg-red-600 text-white',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-500 text-white',
  };

  return (
    <div className={`fixed top-6 right-6 z-[200] toast-enter ${colors[type]} 
      px-6 py-4 rounded-2xl shadow-elevated flex items-center gap-3 font-bold text-sm max-w-sm`}>
      {type === 'error' && <AlertCircle size={18} />}
      {type === 'success' && <CheckCircle2 size={18} />}
      {type === 'warning' && <AlertTriangle size={18} />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-all">
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
