import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import './App.css';

import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import Toast from './components/Toast';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';

// Pages
import SurveyPage from './pages/SurveyPage';
import FollowUpPage from './pages/FollowUpPage';
import DashboardPage from './pages/DashboardPage';
import ReviewPage from './pages/ReviewPage';

// DEIC (full-screen takeover)
import DEICCaseSheet from './DEICCaseSheet';

const App = () => {
  const { user, loading } = useAuth();
  const { toast, clearToast } = useApp();
  const [deicView, setDeicView] = useState(false);
  const [deicPrefill, setDeicPrefill] = useState({});

  const handleOpenDEIC = useCallback((prefill) => {
    setDeicPrefill(prefill || {});
    setDeicView(true);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] via-teal-50/30 to-[#f8fafb] flex items-center justify-center font-sans">
        <div className="text-center animate-fade-in">
          <Loader2 size={40} className="animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-slate-400 font-bold text-sm">Loading RBSK Surveyor…</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // DEIC Case Sheet (full screen)
  if (deicView) {
    return <DEICCaseSheet prefillData={deicPrefill} onBack={() => setDeicView(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafb] via-[#f0fdf9]/30 to-[#f8fafb] pb-24 font-sans text-slate-800">
      {/* Toast */}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Navbar */}
      <Navbar onOpenDEIC={() => handleOpenDEIC({})} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<SurveyPage onOpenDEIC={handleOpenDEIC} />} />
        <Route path="/followup" element={<FollowUpPage onOpenDEIC={handleOpenDEIC} />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/review" element={<ReviewPage onOpenDEIC={handleOpenDEIC} />} />
      </Routes>
    </div>
  );
};

export default App;
