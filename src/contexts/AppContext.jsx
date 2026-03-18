import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
};

export const AppProvider = ({ children }) => {
  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type, key: Date.now() });
  }, []);
  const clearToast = useCallback(() => setToast(null), []);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState(null);
  const showConfirm = useCallback(({ title, message, confirmLabel, onConfirm }) => {
    setConfirmDialog({
      title,
      message,
      confirmLabel: confirmLabel || 'Confirm',
      onConfirm: () => { setConfirmDialog(null); onConfirm(); },
      onCancel: () => setConfirmDialog(null),
    });
  }, []);

  return (
    <AppContext.Provider value={{ toast, showToast, clearToast, confirmDialog, showConfirm, setConfirmDialog }}>
      {children}
    </AppContext.Provider>
  );
};
