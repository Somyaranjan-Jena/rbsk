import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ClipboardCheck, List, BarChart3, Search, FileText,
  AlertCircle, LogOut
} from 'lucide-react';

const Navbar = ({ redFlagsCount = 0, childName, dob, onOpenDEIC }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isSurvey = location.pathname === '/';

  const tabs = [
    { to: '/',          label: 'RBSK Survey',    icon: ClipboardCheck },
    { to: '/followup',  label: 'DEIC Follow-up', icon: List },
    { to: '/dashboard', label: 'Dashboard',      icon: BarChart3 },
    { to: '/review',    label: 'Records',        icon: Search },
  ];

  return (
    <nav className="glass border-b border-slate-200/50 sticky top-0 z-50 shadow-glass">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-2.5 rounded-2xl text-white shadow-lg shadow-teal-500/20">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">RBSK Field Surveyor</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">Digital Intervention Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {redFlagsCount > 0 && isSurvey && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black flag-pulse shadow-lg shadow-red-500/20">
                <AlertCircle size={14} /> {redFlagsCount} FLAGS
              </div>
            )}
            {childName && dob && isSurvey && (
              <button onClick={onOpenDEIC}
                className="flex items-center gap-2 bg-slate-100/80 text-slate-600 px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-slate-200 transition-all"
                title="Open DEIC Case Sheet">
                <FileText size={14} /> DEIC
              </button>
            )}
            {user && (
              <button onClick={signOut}
                className="flex items-center gap-2 bg-slate-100/80 text-slate-500 px-3 py-2 rounded-xl text-xs font-extrabold hover:bg-red-50 hover:text-red-600 transition-all"
                title="Sign Out">
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Tab strip */}
        <div className="flex gap-1 pb-3 overflow-x-auto">
          {tabs.map(tab => (
            <NavLink key={tab.to} to={tab.to} end={tab.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md shadow-teal-500/20'
                    : 'text-slate-500 hover:bg-slate-100/80'
                }`
              }>
              <tab.icon size={14} /> {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
