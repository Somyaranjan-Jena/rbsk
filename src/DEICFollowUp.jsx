// DEICFollowUp.js
// Follow-up tracking panel for referred children.
// Fetches deic_cases from Firestore and allows updating follow-up status.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ClipboardList, Calendar, User, CheckCircle2,
  AlertTriangle, RefreshCw, Phone, MapPin, Plus, ChevronDown,
  ChevronUp, FileText, Activity, Loader2, Search, X
} from 'lucide-react';
import { db } from './firebase';
import {
  collection, query, orderBy, getDocs, doc,
  updateDoc, addDoc, serverTimestamp, limit
} from 'firebase/firestore';

const STATUS_CONFIG = {
  'Active – Ongoing Therapy':   { color: 'bg-teal-100 text-teal-800 border-teal-200',  dot: 'bg-teal-500' },
  'Referred Tertiary':          { color: 'bg-blue-100 text-blue-800 border-blue-200',   dot: 'bg-blue-500' },
  'Discharged – Goals Met':     { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  'Lost to Follow-up':          { color: 'bg-red-100 text-red-800 border-red-200',       dot: 'bg-red-500' },
  'Pending First Visit':        { color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  'Deceased':                   { color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

const FLAG_LABELS = {
  abnormalityAtBirth: 'Abnormality at Birth', visibleDefect: 'Visible Congenital Defect',
  anemia: 'Anemia', vitA: 'Vitamin A Deficiency', vitD: 'Vitamin D / Rickets',
  sam: 'Severe Acute Malnutrition', goiter: 'Goiter / Thyroid',
  skinInfections: 'Skin Infections', earInfections: 'Ear Infections',
  rhd: 'Rheumatic Heart Disease', asthma: 'Asthma / Respiratory',
  dentalCaries: 'Dental Caries', convulsions: 'Seizures / Convulsions',
  visionDiff: 'Vision Difficulty', hearingDiff: 'Hearing Difficulty',
  walkingDiff: 'Walking Difficulty', speechDelay: 'Speech / Language Delay',
  learningDelay: 'Learning Delay', autism: 'Autism Spectrum', adhd: 'ADHD',
  behavioral: 'Behavioral Difficulty',
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Pending First Visit'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
};

// Inline follow-up note form
const FollowUpNoteForm = ({ caseId, onSaved }) => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!note.trim() && !status) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'deic_cases', caseId, 'followup_notes'), {
        note: note.trim(),
        status: status || null,
        nextReviewDate: nextDate || null,
        createdAt: serverTimestamp(),
      });
      const updates = {};
      if (status) updates['sum_outcome'] = status;
      if (nextDate) updates['sum_nextReview'] = nextDate;
      if (Object.keys(updates).length) {
        await updateDoc(doc(db, 'deic_cases', caseId), updates);
      }
      setNote(''); setStatus(''); setNextDate('');
      onSaved();
    } catch (e) {
      alert('Error saving note: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-5 border border-slate-200/60 space-y-3 animate-fade-in">
      <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Add Follow-up Note</p>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Observations from this visit..."
        rows={3}
        className="input-premium resize-none"
      />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Update Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="input-premium text-xs">
            <option value="">— No change —</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Next Review Date</label>
          <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} className="input-premium text-xs" />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving || (!note.trim() && !status)}
        className="w-full btn-primary py-2.5 text-sm disabled:opacity-40">
        {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Plus size={14} /> Save Note</>}
      </button>
    </div>
  );
};

// Single case card
const CaseCard = ({ caseDoc, onUpdated, onOpenDEIC }) => {
  const [expanded, setExpanded] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoaded, setNotesLoaded] = useState(false);

  const d = caseDoc.data;
  const status = d.sum_outcome || 'Pending First Visit';
  const name = d.deic_childName || 'Unknown Child';
  const age = d.deic_age || '—';
  const district = d.deic_district || '—';
  const contact = d.deic_contact || null;
  const linkedSurvey = d.rbsk_surveyId || null;
  const nextReview = d.sum_nextReview || null;
  const primaryDx = d.sum_primaryDx || null;

  const isOverdue = nextReview && new Date(nextReview) < new Date() && status === 'Active – Ongoing Therapy';

  const loadNotes = async () => {
    if (notesLoaded) return;
    try {
      const snap = await getDocs(
        query(collection(db, 'deic_cases', caseDoc.id, 'followup_notes'), orderBy('createdAt', 'desc'), limit(10))
      );
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setNotesLoaded(true);
    } catch (e) {
      console.error('Notes load error:', e);
    }
  };

  const handleExpand = () => {
    setExpanded(v => !v);
    if (!expanded) loadNotes();
  };

  // Avatar gradient based on first letter
  const avatarColors = {
    default: 'from-teal-400 to-teal-600',
    discharged: 'from-emerald-400 to-emerald-600',
    lost: 'from-red-400 to-red-600',
  };
  const avatarGrad = status === 'Discharged – Goals Met' ? avatarColors.discharged
    : status === 'Lost to Follow-up' ? avatarColors.lost : avatarColors.default;

  return (
    <div className={`card-elevated transition-all duration-200 ${isOverdue ? 'ring-2 ring-red-200 bg-red-50/20' : ''}`}>
      {/* Card header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className={`shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center font-black text-lg text-white shadow-sm`}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-black text-slate-900 text-base leading-tight truncate">{name}</h4>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1"><User size={10} /> {age}</span>
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1"><MapPin size={10} /> {district}</span>
              {linkedSurvey && <span className="text-xs text-teal-600 font-extrabold font-mono">#{linkedSurvey.slice(-8)}</span>}
            </div>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-2">
          <StatusBadge status={status} />
          {isOverdue && (
            <span className="text-[10px] font-extrabold text-red-600 flex items-center gap-1 flag-pulse px-2 py-0.5 rounded-lg">
              <AlertTriangle size={10} /> Review overdue
            </span>
          )}
        </div>
      </div>

      {/* Quick meta row */}
      <div className="px-5 pb-4 flex flex-wrap items-center gap-3 border-t border-slate-100/60 pt-3">
        {primaryDx && (
          <span className="text-xs bg-slate-100/80 text-slate-700 font-bold px-3 py-1.5 rounded-xl">
            Dx: {primaryDx}
          </span>
        )}
        {nextReview && (
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
            <Calendar size={10} /> Next: {nextReview}
          </span>
        )}
        {contact && (
          <a href={`tel:${contact}`} className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-blue-100 transition-all">
            <Phone size={10} /> {contact}
          </a>
        )}
        <button onClick={() => onOpenDEIC({
              childName: name, dob: d.deic_dob, ageDisplay: age,
              district, sex: d.deic_sex, surveyId: linkedSurvey
            })}
          className="text-xs bg-teal-50 text-teal-700 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1 hover:bg-teal-100 transition-all border border-teal-100">
          <FileText size={12} /> Case Sheet
        </button>
        <button onClick={handleExpand}
          className="ml-auto text-xs text-slate-500 font-extrabold flex items-center gap-1 hover:text-slate-800 transition-all">
          {expanded ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> Details</>}
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100/60 pt-4 space-y-4 animate-fade-in">
          {/* Risk flags from survey */}
          {d.flaggedFields && d.flaggedFields.length > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-4 border border-red-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle size={11} /> Detected Risk Flags
                </p>
                <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded-lg">
                  {d.flaggedFields.length} flag{d.flaggedFields.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {d.flaggedFields.map((f, i) => {
                  // Protocol flags use 'id:text' format; general keys use FLAG_LABELS
                  const label = f.includes(':') ? f.split(':').slice(1).join(':') : (FLAG_LABELS[f] || f);
                  return (
                    <span key={i} className="text-[11px] font-semibold text-red-700 bg-white border border-red-200/60 px-2.5 py-1 rounded-lg shadow-sm">
                      {label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {d.gapsIdentified && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-1">Surveyor Observations</p>
              <p className="text-xs text-amber-900 font-medium">{d.gapsIdentified}</p>
            </div>
          )}
          {notes.length > 0 && (
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Follow-up History</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {notes.map(n => (
                  <div key={n.id} className="bg-slate-50/80 rounded-xl p-3 border border-slate-100/60">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      {n.status && <StatusBadge status={n.status} />}
                      {n.nextReviewDate && <span className="text-[10px] text-slate-400 font-bold">Next: {n.nextReviewDate}</span>}
                    </div>
                    {n.note && <p className="text-xs text-slate-700 font-medium">{n.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {notesLoaded && notes.length === 0 && (
            <p className="text-xs text-slate-400 font-medium text-center py-2">No follow-up notes yet.</p>
          )}
          <button onClick={() => setShowNoteForm(v => !v)}
            className="flex items-center gap-2 text-teal-700 font-extrabold text-sm hover:text-teal-900 transition-all">
            {showNoteForm ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Follow-up Note</>}
          </button>
          {showNoteForm && (
            <FollowUpNoteForm
              caseId={caseDoc.id}
              onSaved={() => { setShowNoteForm(false); setNotesLoaded(false); loadNotes(); onUpdated(); }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DEICFollowUp = ({ onOpenDEIC }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const debounceRef = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  const handleSearchChange = useCallback((val) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(val), 300);
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    setError('');
    try {
      const snap = await getDocs(
        query(collection(db, 'deic_cases'), orderBy('submittedAt', 'desc'), limit(50))
      );
      setCases(snap.docs.map(d => ({
        id: d.id,
        data: d.data(),
        savedAt: d.data().submittedAt?.toDate?.()?.toLocaleDateString('en-IN') || 'Unknown',
      })));
    } catch (e) {
      console.error('Fetch error:', e);
      if (!navigator.onLine) {
        setError('Network unavailable. Check your internet connection.');
      } else if (e.code === 'permission-denied') {
        setError('Permission denied. Please check your authentication.');
      } else {
        setError('Failed to load cases. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCases(); }, []);

  const filtered = cases.filter(c => {
    const matchStatus = filter === 'All' || (c.data.sum_outcome || 'Pending First Visit') === filter;
    const q = debouncedSearch.toLowerCase();
    const matchSearch = !q ||
      (c.data.deic_childName || '').toLowerCase().includes(q) ||
      (c.data.deic_district || '').toLowerCase().includes(q) ||
      (c.data.rbsk_surveyId || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const statusCounts = cases.reduce((acc, c) => {
    const s = c.data.sum_outcome || 'Pending First Visit';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const overdueCount = cases.filter(c =>
    c.data.sum_nextReview &&
    new Date(c.data.sum_nextReview) < new Date() &&
    (c.data.sum_outcome || '') === 'Active – Ongoing Therapy'
  ).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Cases', value: cases.length, icon: ClipboardList, bg: 'from-slate-50 to-slate-100', color: 'text-slate-700' },
          { label: 'Active Therapy', value: statusCounts['Active – Ongoing Therapy'] || 0, icon: Activity, bg: 'from-teal-50 to-emerald-50', color: 'text-teal-700' },
          { label: 'Overdue Reviews', value: overdueCount, icon: AlertTriangle, bg: overdueCount > 0 ? 'from-red-50 to-rose-50' : 'from-slate-50 to-slate-50', color: overdueCount > 0 ? 'text-red-700' : 'text-slate-400' },
          { label: 'Discharged', value: statusCounts['Discharged – Goals Met'] || 0, icon: CheckCircle2, bg: 'from-emerald-50 to-green-50', color: 'text-emerald-700' },
        ].map(s => (
          <div key={s.label} className={`card-elevated bg-gradient-to-br ${s.bg} p-4 ${s.color}`}>
            <s.icon size={18} className="mb-2 opacity-60" />
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
          <input type="text" value={search} onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search by name, district, survey ID…"
            className="input-premium pl-11" />
          {search && (
            <button onClick={() => { setSearch(''); setDebouncedSearch(''); }} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Pending First Visit', 'Active – Ongoing Therapy', 'Discharged – Goals Met', 'Lost to Follow-up'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                filter === s 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-100/80 text-slate-500 hover:bg-slate-200'
              }`}>
              {s === 'All' ? `All (${cases.length})` : s.split(' – ')[0]}
            </button>
          ))}
        </div>
        <button onClick={fetchCases} className="shrink-0 p-3 bg-slate-100/80 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all hover:rotate-180 duration-500" title="Refresh">
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Case list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={32} className="animate-spin mb-4" />
          <p className="text-sm font-bold">Loading DEIC cases…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-red-500">
          <AlertTriangle size={40} className="mb-4 opacity-60" />
          <p className="text-sm font-bold text-center max-w-xs">{error}</p>
          <button onClick={fetchCases} className="mt-4 btn-primary px-6 py-2 text-sm">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <FileText size={48} className="mb-4 opacity-30" />
          <p className="text-sm font-extrabold text-slate-400">
            {cases.length === 0 ? 'No DEIC cases found. Submit your first case above.' : 'No cases match your filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.length >= 50 && (
            <p className="text-xs text-slate-400 font-semibold text-center py-1">
              Showing latest 50 cases. Use search to find older records.
            </p>
          )}
          {filtered.map(c => (
            <CaseCard key={c.id} caseDoc={c} onUpdated={fetchCases} onOpenDEIC={onOpenDEIC} />
          ))}
        </div>
      )}

      {/* New case CTA */}
      <div className="mt-6 p-6 bg-gradient-to-r from-teal-900 to-teal-950 text-white rounded-[2rem] flex items-center justify-between gap-6 shadow-elevated">
        <div>
          <p className="font-black">Start a new DEIC evaluation</p>
          <p className="text-teal-400 text-xs mt-1 font-medium">Complete RBSK survey first, then open case sheet from the results screen</p>
        </div>
        <button onClick={onOpenDEIC}
          className="shrink-0 flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-2xl font-extrabold text-sm hover:bg-teal-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg">
          <Plus size={16} /> New Case
        </button>
      </div>
    </div>
  );
};

export default DEICFollowUp;
