import React from 'react';
import { Shield } from 'lucide-react';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmLabel = 'Confirm' }) => (
  <div className="overlay-backdrop" onClick={onCancel}>
    <div className="overlay-card" onClick={e => e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600">
          <Shield size={24} />
        </div>
        <h3 className="text-xl font-black text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel}
          className="flex-1 py-3 rounded-2xl font-extrabold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 btn-primary">
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
