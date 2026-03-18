// DEICCaseSheet.js
// Full DEIC Digital Case Sheet – RBSK Field Surveyor
// Priority sections (Child Reg p1-2, Psychologist p3-7, Audiology p18-19, Speech p20-22) have rich custom UI

import React, { useState, useCallback } from 'react';
import {
  ClipboardCheck, ChevronLeft, ChevronRight, Save, FileText,
  User, Brain, Activity, Heart, BookOpen, Eye, MessageCircle,
  AlertCircle, CheckCircle2, Printer, Menu, Mic2, Ear, Star,
  ChevronDown, ChevronUp, X
} from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { DEIC_SECTIONS, SECTION_COLORS } from './deicData';

const ICON_MAP = { User, Brain, Activity, Heart, BookOpen, Eye, MessageCircle, FileText, Mic2, Ear };

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ message, type = 'error', onClose }) => {
  React.useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);
  const colors = { error: 'bg-red-600 text-white', success: 'bg-emerald-600 text-white' };
  return (
    <div className={`fixed top-6 right-6 z-[200] toast-enter ${colors[type]} px-6 py-4 rounded-2xl shadow-elevated flex items-center gap-3 font-bold text-sm max-w-sm`}>
      {type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg"><X size={14} /></button>
    </div>
  );
};

// ─── Generic Field Renderer ──────────────────────────────────────────────────
const FieldRenderer = ({ field, value, onChange }) => {
  const base = 'input-premium';
  if (field.type === 'text' || field.type === 'number') {
    return <input type={field.type} value={value || ''} onChange={e => onChange(field.id, e.target.value)}
      placeholder={field.placeholder || ''} readOnly={field.readonly}
      className={`${base} ${field.readonly ? 'bg-slate-100/80 text-slate-500 cursor-not-allowed' : ''}`} />;
  }
  if (field.type === 'date') return <input type='date' value={value || ''} onChange={e => onChange(field.id, e.target.value)} className={base} />;
  if (field.type === 'textarea') return <textarea value={value || ''} onChange={e => onChange(field.id, e.target.value)}
    placeholder={field.placeholder || ''} rows={3} className={`${base} resize-none`} />;
  if (field.type === 'select') return (
    <select value={value || ''} onChange={e => onChange(field.id, e.target.value)} className={base}>
      <option value=''>— Select —</option>
      {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
  if (field.type === 'radio') return (
    <div className='flex flex-wrap gap-2'>
      {field.options.map(opt => (
        <button key={opt} type='button' onClick={() => onChange(field.id, opt)}
          className={`pill-toggle ${value === opt ? 'pill-toggle-active' : 'pill-toggle-inactive'}`}>
          {opt}</button>
      ))}
    </div>
  );
  if (field.type === 'checkbox') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <div className='flex flex-wrap gap-2'>
        {field.options.map(opt => {
          const on = arr.includes(opt);
          return <button key={opt} type='button'
            onClick={() => onChange(field.id, on ? arr.filter(v => v !== opt) : [...arr, opt])}
            className={`pill-toggle flex items-center gap-1.5 ${on ? 'pill-toggle-active' : 'pill-toggle-inactive'}`}>
            {on && <CheckCircle2 size={12} />}{opt}</button>;
        })}
      </div>
    );
  }
  return null;
};

// ─── Generic Section Panel ────────────────────────────────────────────────────
const SectionPanel = ({ section, formData, onChange }) => {
  const colors = SECTION_COLORS[section.color];
  const [openSubs, setOpenSubs] = useState(() => {
    const init = {}; section.subsections.forEach((s, i) => { init[s.id] = i === 0; }); return init;
  });
  return (
    <div className='space-y-4'>
      {section.subsections.map(sub => (
        <div key={sub.id} className={`rounded-[1.5rem] border ${colors.border} overflow-hidden transition-shadow hover:shadow-card`}>
          <button type='button' onClick={() => setOpenSubs(p => ({ ...p, [sub.id]: !p[sub.id] }))}
            className={`w-full flex justify-between items-center px-6 py-4 ${colors.bg} text-left transition-all`}>
            <span className={`font-extrabold text-sm ${colors.text} uppercase tracking-wide`}>{sub.title}</span>
            <ChevronRight size={18} className={`${colors.text} transition-transform duration-300 ${openSubs[sub.id] ? 'rotate-90' : ''}`} />
          </button>
          {openSubs[sub.id] && (
            <div className='p-6 bg-white space-y-5 animate-fade-in'>
              {sub.fields.map(field => (
                <div key={field.id} className='space-y-2'>
                  <label className='block text-xs font-extrabold text-slate-400 uppercase tracking-widest'>{field.label}</label>
                  <FieldRenderer field={field} value={formData[field.id]} onChange={onChange} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 1 — Child Registration (Pages 1-2)
// ═══════════════════════════════════════════════════════════════════════════════
const ChildRegistrationSection = ({ section, formData, onChange }) => {
  const [openSubs, setOpenSubs] = useState({});
  const toggle = id => setOpenSubs(p => ({ ...p, [id]: !p[id] }));
  return (
    <div className='space-y-4'>
      <div className='bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-3xl p-6 flex items-center gap-4 shadow-elevated'>
        <div className='bg-white/10 p-3 rounded-2xl'><User size={28} /></div>
        <div>
          <h3 className='font-black text-lg'>Child Registration & Background</h3>
          <p className='text-teal-300 text-xs mt-0.5 font-medium'>Prefilled from RBSK where available</p>
        </div>
        {formData.deic_rbsk_surveyId && (
          <div className='ml-auto bg-teal-700/60 rounded-2xl px-4 py-2 text-center shrink-0'>
            <p className='text-[9px] text-teal-300 font-extrabold uppercase'>RBSK ID</p>
            <p className='text-xs font-black font-mono'>{formData.deic_rbsk_surveyId.slice(-10)}</p>
          </div>
        )}
      </div>
      {/* Identity quick card */}
      <div className='card-elevated p-6 space-y-4'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div className='sm:col-span-2 space-y-1.5'>
            <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>Child's Full Name</label>
            <input type='text' value={formData.deic_childName || ''} onChange={e => onChange('deic_childName', e.target.value)}
              placeholder='Full name' className='input-premium' />
          </div>
          <div className='space-y-1.5'>
            <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>Date of Birth</label>
            <input type='date' value={formData.deic_dob || ''} onChange={e => onChange('deic_dob', e.target.value)}
              className='input-premium' />
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
          <div className='bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-3 text-center'>
            <p className='text-[9px] text-teal-500 font-extrabold uppercase'>Age</p>
            <p className='font-black text-teal-900 text-sm mt-0.5'>{formData.deic_age || '—'}</p>
          </div>
          <div className='bg-slate-50 border border-slate-100 rounded-2xl p-3'>
            <p className='text-[9px] text-slate-500 font-extrabold uppercase mb-1.5'>Sex</p>
            <div className='flex gap-1'>
              {['Male','Female','Other'].map(s => (
                <button key={s} type='button' onClick={() => onChange('deic_sex', s)}
                  className={`text-[9px] flex-1 py-1 rounded-lg font-extrabold transition-all ${formData.deic_sex === s ? 'bg-gradient-to-br from-teal-500 to-teal-700 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className='bg-slate-50 border border-slate-100 rounded-2xl p-3'>
            <p className='text-[9px] text-slate-500 font-extrabold uppercase mb-1'>District</p>
            <input type='text' value={formData.deic_district || ''} onChange={e => onChange('deic_district', e.target.value)}
              className='w-full text-xs font-bold bg-transparent outline-none text-slate-800' placeholder='—' />
          </div>
          <div className='bg-slate-50 border border-slate-100 rounded-2xl p-3'>
            <p className='text-[9px] text-slate-500 font-extrabold uppercase mb-1'>DEIC Reg. No.</p>
            <input type='text' value={formData.deic_regNo || ''} onChange={e => onChange('deic_regNo', e.target.value)}
              className='w-full text-xs font-bold bg-transparent outline-none text-slate-800' placeholder='DEIC/2026/—' />
          </div>
        </div>
      </div>
      {/* Additional collapsible subs */}
      {section.subsections.filter(s => !['basic_info','child_details'].includes(s.id)).map(sub => (
        <div key={sub.id} className='rounded-[1.5rem] border border-teal-100 overflow-hidden transition-shadow hover:shadow-card'>
          <button type='button' onClick={() => toggle(sub.id)}
            className='w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-teal-50 to-emerald-50/30 text-left'>
            <span className='font-extrabold text-sm text-teal-800 uppercase tracking-wide'>{sub.title}</span>
            {openSubs[sub.id] ? <ChevronUp size={16} className='text-teal-600' /> : <ChevronDown size={16} className='text-teal-600' />}
          </button>
          {openSubs[sub.id] && (
            <div className='p-6 bg-white grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fade-in'>
              {sub.fields.map(field => (
                <div key={field.id} className='space-y-1.5'>
                  <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>{field.label}</label>
                  <FieldRenderer field={field} value={formData[field.id]} onChange={onChange} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 2 — Psychologist (Pages 3-7): domain score cards
// ═══════════════════════════════════════════════════════════════════════════════
const DOMAIN_META = {
  psych_grossMotor:      { label: 'Gross Motor',       icon: Activity,       grad: 'from-orange-400 to-orange-600' },
  psych_fineMotor:       { label: 'Fine Motor',        icon: Star,           grad: 'from-pink-400 to-pink-600' },
  psych_cognition:       { label: 'Cognition',         icon: Brain,          grad: 'from-purple-400 to-purple-600' },
  psych_speech:          { label: 'Speech & Language', icon: Mic2,           grad: 'from-blue-400 to-blue-600' },
  psych_socialEmotional: { label: 'Social/Emotional',  icon: Heart,          grad: 'from-rose-400 to-rose-600' },
  psych_impression:      { label: 'Final Impression',  icon: ClipboardCheck, grad: 'from-teal-400 to-teal-600' },
};
const DELAY_SCORES = { 'Age-appropriate':0,'Normal':0,'Present':0,'Independent':0,'Appropriate':0,'Mildly Delayed':1,'Mildly Impaired':1,'With Difficulty':1,'With Support':1,'Significantly Delayed':2,'Significantly Impaired':2,'Not Achieved':3,'Unable':2,'Absent':2,'No Functional Grasp':3,'Not Walking':3 };
const getDomainStatus = (sub, fd) => {
  let max = 0;
  sub.fields.forEach(f => { const s = DELAY_SCORES[fd[f.id]]; if (s !== undefined) max = Math.max(max, s); });
  if (max === 0) return { label: 'On Track', color: 'bg-emerald-100 text-emerald-700' };
  if (max === 1) return { label: 'Mild Delay', color: 'bg-amber-100 text-amber-700' };
  if (max === 2) return { label: 'Moderate', color: 'bg-orange-100 text-orange-700' };
  return { label: 'Significant', color: 'bg-red-100 text-red-700' };
};

const PsychologistSection = ({ section, formData, onChange }) => {
  const [activeSubId, setActiveSubId] = useState(section.subsections[0]?.id);
  const activeSub = section.subsections.find(s => s.id === activeSubId);
  return (
    <div className='space-y-4'>
      <div className='bg-gradient-to-r from-purple-800 to-purple-950 text-white rounded-3xl p-6 flex items-center gap-4 shadow-elevated'>
        <div className='bg-white/10 p-3 rounded-2xl'><Brain size={28} /></div>
        <div>
          <h3 className='font-black text-lg'>Psychologist Assessment</h3>
          <p className='text-purple-300 text-xs mt-0.5 font-medium'>5 developmental domains + impression</p>
        </div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
        {section.subsections.map(sub => {
          const m = DOMAIN_META[sub.id] || {}; const status = getDomainStatus(sub, formData);
          const Icon = m.icon || FileText; const active = sub.id === activeSubId;
          return (
            <button key={sub.id} type='button' onClick={() => setActiveSubId(sub.id)}
              className={`rounded-2xl p-4 text-left transition-all duration-200 border-2 hover-lift ${active ? 'border-purple-400 bg-purple-50 shadow-md' : 'border-transparent bg-white hover:border-purple-200 shadow-sm'}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.grad || 'from-slate-300 to-slate-500'} flex items-center justify-center text-white mb-3 shadow-sm`}><Icon size={18} /></div>
              <p className='font-extrabold text-xs text-slate-800 leading-tight'>{m.label || sub.title}</p>
              <span className={`mt-2 inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${status.color}`}>{status.label}</span>
            </button>
          );
        })}
      </div>
      {activeSub && (
        <div className='card-elevated overflow-hidden'>
          <div className='bg-gradient-to-r from-purple-50 to-purple-100/30 px-6 py-4 flex items-center justify-between border-b border-purple-100'>
            <span className='font-extrabold text-purple-800 uppercase tracking-wide text-sm'>{activeSub.title}</span>
            <div className='flex gap-1'>
              {section.subsections.map(s => (
                <button key={s.id} type='button' onClick={() => setActiveSubId(s.id)}
                  className={`rounded-full h-2 transition-all duration-300 ${s.id === activeSubId ? 'bg-purple-600 w-5' : 'bg-purple-200 w-2 hover:bg-purple-300'}`} />
              ))}
            </div>
          </div>
          <div className='p-6 space-y-5'>
            {activeSub.fields.map(field => {
              const score = DELAY_SCORES[formData[field.id]]; const flagged = score !== undefined && score >= 2;
              return (
                <div key={field.id} className={`space-y-2 p-3 rounded-2xl transition-all ${flagged ? 'bg-red-50 border border-red-200' : ''}`}>
                  <label className={`block text-xs font-extrabold uppercase tracking-widest ${flagged ? 'text-red-600' : 'text-slate-500'}`}>
                    {field.label} {flagged && <AlertCircle size={11} className='inline ml-1' />}
                  </label>
                  <FieldRenderer field={field} value={formData[field.id]} onChange={onChange} />
                </div>
              );
            })}
          </div>
          <div className='px-6 pb-5 flex justify-between'>
            <button type='button' disabled={section.subsections[0]?.id === activeSubId}
              onClick={() => { const i = section.subsections.findIndex(s => s.id === activeSubId); if (i > 0) setActiveSubId(section.subsections[i-1].id); }}
              className='flex items-center gap-1 text-sm text-purple-600 font-extrabold hover:text-purple-900 disabled:opacity-30 transition-all'>
              <ChevronLeft size={16} /> Prev
            </button>
            <button type='button' disabled={section.subsections[section.subsections.length-1]?.id === activeSubId}
              onClick={() => { const i = section.subsections.findIndex(s => s.id === activeSubId); if (i < section.subsections.length-1) setActiveSubId(section.subsections[i+1].id); }}
              className='flex items-center gap-1 text-sm text-purple-600 font-extrabold hover:text-purple-900 disabled:opacity-30 transition-all'>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 3 — Audiology (Pages 18-19): bilateral ear grid
// ═══════════════════════════════════════════════════════════════════════════════
const AudiologySection = ({ section, formData, onChange }) => {
  const [openSubs, setOpenSubs] = useState({ audio_behavioral: true, audio_objective: true, audio_tuningFork: false, audio_impression: true });
  const toggle = id => setOpenSubs(p => ({ ...p, [id]: !p[id] }));
  const hlDegree = formData.audio_degree;
  const hlColor = { Normal:'bg-emerald-100 text-emerald-700', Mild:'bg-yellow-100 text-yellow-700', Moderate:'bg-amber-100 text-amber-700', 'Moderately Severe':'bg-orange-100 text-orange-700', Severe:'bg-red-100 text-red-700', Profound:'bg-red-200 text-red-900' }[hlDegree] || 'bg-slate-100 text-slate-500';
  const EarGrid = ({ label, ids, options }) => (
    <div className='grid grid-cols-3 items-center gap-3 py-3 border-b border-amber-100/60 last:border-0'>
      <span className='text-xs font-extrabold text-slate-600'>{label}</span>
      {ids.map(([id, side]) => (
        <div key={id}>
          <p className='text-[9px] text-amber-500 font-extrabold uppercase mb-1 text-center'>{side}</p>
          {options ? (
            <select value={formData[id]||''} onChange={e=>onChange(id,e.target.value)}
              className='w-full text-xs bg-amber-50 border border-amber-200 rounded-xl px-2 py-2 font-bold focus:ring-2 focus:ring-amber-400 outline-none transition-all'>
              <option value=''>—</option>{options.map(o=><option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input type='text' value={formData[id]||''} onChange={e=>onChange(id,e.target.value)}
              placeholder='value' className='w-full text-xs bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 font-bold focus:ring-2 focus:ring-amber-400 outline-none text-center transition-all' />
          )}
        </div>
      ))}
    </div>
  );
  return (
    <div className='space-y-4'>
      <div className='bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-3xl p-6 flex items-center gap-4 shadow-elevated'>
        <div className='bg-white/10 p-3 rounded-2xl'><Ear size={28} /></div>
        <div>
          <h3 className='font-black text-lg'>Audiology – Auditory Assessment</h3>
          <p className='text-amber-300 text-xs mt-0.5 font-medium'>OAE · BERA · ASSR · Tympanometry</p>
        </div>
        {hlDegree && <div className={`ml-auto text-xs font-extrabold px-3 py-2 rounded-2xl ${hlColor}`}>{hlDegree}</div>}
      </div>
      {/* Behavioral */}
      <div className='rounded-[1.5rem] border border-amber-200 overflow-hidden hover:shadow-card transition-shadow'>
        <button type='button' onClick={() => toggle('audio_behavioral')} className='w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100/30 text-left'>
          <span className='font-extrabold text-sm text-amber-800 uppercase tracking-wide'>Behavioral Assessment</span>
          {openSubs.audio_behavioral ? <ChevronUp size={16} className='text-amber-600'/> : <ChevronDown size={16} className='text-amber-600'/>}
        </button>
        {openSubs.audio_behavioral && (
          <div className='p-6 bg-white space-y-4 animate-fade-in'>
            {[['BOA','audio_bor'],['VRA','audio_vra'],['Play Audiometry','audio_play']].map(([label,id])=>(
              <div key={id} className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-amber-50'>
                <span className='text-sm font-semibold text-slate-700'>{label}</span>
                <div className='flex gap-2 flex-wrap'>
                  {['Pass','Refer','Not Done','N/A'].map(o=>(
                    <button key={o} type='button' onClick={()=>onChange(id,o)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all duration-200 ${formData[id]===o ? o==='Pass'?'bg-emerald-600 text-white border-emerald-600 shadow-md':o==='Refer'?'bg-red-500 text-white border-red-500 shadow-md':'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-400 border-slate-200 hover:border-amber-300'}`}>{o}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className='space-y-1.5 pt-2'>
              <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>PTA Result</label>
              <select value={formData.audio_pta||''} onChange={e=>onChange('audio_pta',e.target.value)}
                className='input-premium'>
                <option value=''>— Select —</option>
                {['Normal','Mild HL (26-40 dB)','Moderate HL (41-55 dB)','Moderately Severe (56-70 dB)','Severe (71-90 dB)','Profound (>90 dB)','Not Done'].map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
      {/* Objective */}
      <div className='rounded-[1.5rem] border border-amber-200 overflow-hidden hover:shadow-card transition-shadow'>
        <button type='button' onClick={() => toggle('audio_objective')} className='w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100/30 text-left'>
          <span className='font-extrabold text-sm text-amber-800 uppercase tracking-wide'>Objective Tests (OAE / BERA / ASSR)</span>
          {openSubs.audio_objective ? <ChevronUp size={16} className='text-amber-600'/> : <ChevronDown size={16} className='text-amber-600'/>}
        </button>
        {openSubs.audio_objective && (
          <div className='p-6 bg-white animate-fade-in'>
            <EarGrid label='OAE' ids={[['audio_oae_re','Right (RE)'],['audio_oae_le','Left (LE)']]} options={['Pass','Refer','Not Done']}/>
            <EarGrid label='BERA (dBnHL)' ids={[['audio_bera_re','Right (RE)'],['audio_bera_le','Left (LE)']]}/>
            <EarGrid label='ASSR' ids={[['audio_assr_re','Right (RE)'],['audio_assr_le','Left (LE)']]}/>
            <div className='pt-3 space-y-1.5'>
              <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>Tympanometry</label>
              <select value={formData.audio_tympanometry||''} onChange={e=>onChange('audio_tympanometry',e.target.value)}
                className='input-premium'>
                <option value=''>—</option>
                {['Type A (Normal)','Type B (Flat – OME)','Type C (Neg. pressure)','Not Done'].map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
      {/* Impression */}
      <div className='rounded-[1.5rem] border border-amber-200 overflow-hidden hover:shadow-card transition-shadow'>
        <button type='button' onClick={() => toggle('audio_impression')} className='w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-amber-50 to-amber-100/30 text-left'>
          <span className='font-extrabold text-sm text-amber-800 uppercase tracking-wide'>Impression & Intervention Plan</span>
          {openSubs.audio_impression ? <ChevronUp size={16} className='text-amber-600'/> : <ChevronDown size={16} className='text-amber-600'/>}
        </button>
        {openSubs.audio_impression && (
          <div className='p-6 bg-white space-y-5 animate-fade-in'>
            <div className='grid grid-cols-2 gap-4'>
              {[['audio_type','Type of HL',['Normal','Conductive','Sensorineural','Mixed','ANSD']],
                ['audio_degree','Degree',['Normal','Mild','Moderate','Moderately Severe','Severe','Profound']]
              ].map(([id,lbl,opts])=>(
                <div key={id} className='space-y-1.5'>
                  <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>{lbl}</label>
                  <select value={formData[id]||''} onChange={e=>onChange(id,e.target.value)}
                    className='input-premium'>
                    <option value=''>—</option>{opts.map(o=><option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className='space-y-1.5'>
              <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>Hearing Aid Required?</label>
              <div className='flex gap-2'>
                {['Yes','No'].map(o=>(
                  <button key={o} type='button' onClick={()=>onChange('audio_ha',o)}
                    className={`px-6 py-3 rounded-2xl text-sm font-extrabold transition-all ${formData.audio_ha===o?'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg':'bg-amber-50 text-amber-700 border border-amber-200'}`}>{o}</button>
                ))}
              </div>
            </div>
            {formData.audio_ha==='Yes'&&(
              <div className='space-y-1.5 animate-fade-in'>
                <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>HA Type</label>
                <div className='flex flex-wrap gap-2'>
                  {['BTE','ITE','CIC','BAHA','Cochlear Implant Candidate'].map(o=>(
                    <button key={o} type='button' onClick={()=>onChange('audio_haType',o)}
                      className={`pill-toggle ${formData.audio_haType===o?'pill-toggle-active':'pill-toggle-inactive'}`}>{o}</button>
                  ))}
                </div>
              </div>
            )}
            <div className='space-y-1.5'>
              <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>CI Candidate?</label>
              <div className='flex gap-2'>
                {['Yes','No','Under evaluation'].map(o=>(
                  <button key={o} type='button' onClick={()=>onChange('audio_ciCandidate',o)}
                    className={`pill-toggle ${formData.audio_ciCandidate===o?'pill-toggle-active':'pill-toggle-inactive'}`}>{o}</button>
                ))}
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>Audiologist's Impression</label>
              <textarea value={formData.audio_impression||''} onChange={e=>onChange('audio_impression',e.target.value)} rows={3}
                className='input-premium resize-none'/>
            </div>
            <div className='space-y-1.5'>
              <label className='block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>Audiologist Name & Signature</label>
              <input type='text' value={formData.audio_name||''} onChange={e=>onChange('audio_name',e.target.value)}
                className='input-premium'/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIORITY 4 — Speech Therapy (Pages 20-22): stepped eval → plan → progress
// ═══════════════════════════════════════════════════════════════════════════════
const SpeechTherapySection = ({ section, formData, onChange }) => {
  const STEPS = [
    { id: 'st_pretherapy', label: 'Pre-therapy Eval', icon: Mic2 },
    { id: 'st_plan',       label: 'Therapy Plan',     icon: ClipboardCheck },
    { id: 'st_progress',   label: 'Progress Report',  icon: Activity },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const activeSub = section.subsections.find(s => s.id === STEPS[activeStep]?.id);
  const goalAchieved = parseInt(formData.st_goalAchieved) || 0;
  return (
    <div className='space-y-4'>
      <div className='bg-gradient-to-r from-green-800 to-green-950 text-white rounded-3xl p-6 flex items-center gap-4 shadow-elevated'>
        <div className='bg-white/10 p-3 rounded-2xl'><MessageCircle size={28} /></div>
        <div>
          <h3 className='font-black text-lg'>Speech Therapy – Evaluation & Plan</h3>
          <p className='text-green-300 text-xs mt-0.5 font-medium'>Evaluation · Plan · Progress</p>
        </div>
      </div>
      <div className='flex bg-slate-100/80 rounded-2xl p-1.5 gap-1'>
        {STEPS.map((s,i)=>(
          <button key={s.id} type='button' onClick={()=>setActiveStep(i)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${activeStep===i?'bg-white text-green-800 shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
            <s.icon size={14}/><span className='hidden sm:inline'>{s.label}</span>
          </button>
        ))}
      </div>
      {activeSub&&(
        <div className='card-elevated overflow-hidden'>
          <div className='bg-gradient-to-r from-green-50 to-green-100/30 px-6 py-4 border-b border-green-100'>
            <span className='font-extrabold text-green-800 uppercase tracking-wide text-sm'>{activeSub.title}</span>
          </div>
          <div className='p-6 space-y-5'>
            {activeStep===2&&(
              <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-xs font-extrabold text-green-700 uppercase'>Goal Achievement</span>
                  <span className='text-2xl font-black text-green-800'>{goalAchieved}%</span>
                </div>
                <div className='w-full bg-green-100 rounded-full h-3 mb-2 overflow-hidden'>
                  <div className={`h-3 rounded-full transition-all duration-500 ${goalAchieved>=80?'bg-gradient-to-r from-emerald-400 to-green-500':goalAchieved>=50?'bg-gradient-to-r from-amber-400 to-amber-500':'bg-gradient-to-r from-red-400 to-red-500'}`} style={{width:`${Math.min(100, Math.max(0, goalAchieved))}%`}}/>
                </div>
                <input type='range' min='0' max='100' value={goalAchieved} onChange={e=>onChange('st_goalAchieved',e.target.value)} className='w-full accent-green-600'/>
              </div>
            )}
            {activeSub.fields.filter(f=>f.id!=='st_goalAchieved').map(field=>(
              <div key={field.id} className='space-y-2'>
                <label className='block text-xs font-extrabold text-slate-500 uppercase tracking-widest'>{field.label}</label>
                <FieldRenderer field={field} value={formData[field.id]} onChange={onChange}/>
              </div>
            ))}
          </div>
          <div className='px-6 pb-5 flex justify-between'>
            <button type='button' onClick={()=>setActiveStep(v=>Math.max(0,v-1))} disabled={activeStep===0}
              className='flex items-center gap-1 text-sm text-green-700 font-extrabold disabled:opacity-30 transition-all'>
              <ChevronLeft size={16}/> Prev
            </button>
            <button type='button' onClick={()=>setActiveStep(v=>Math.min(STEPS.length-1,v+1))} disabled={activeStep===STEPS.length-1}
              className='flex items-center gap-1 text-sm text-green-700 font-extrabold disabled:opacity-30 transition-all'>
              Next <ChevronRight size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Section Router ───────────────────────────────────────────────────────────
const SectionRouter = ({ section, formData, onChange }) => {
  if (section.id === 'child_registration') return <ChildRegistrationSection section={section} formData={formData} onChange={onChange}/>;
  if (section.id === 'psychologist')       return <PsychologistSection       section={section} formData={formData} onChange={onChange}/>;
  if (section.id === 'audiology')          return <AudiologySection          section={section} formData={formData} onChange={onChange}/>;
  if (section.id === 'speech_therapy')     return <SpeechTherapySection      section={section} formData={formData} onChange={onChange}/>;
  return <SectionPanel section={section} formData={formData} onChange={onChange}/>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DEICCaseSheet = ({ onBack, prefillData = {} }) => {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [formData, setFormData] = useState(() => ({
    deic_childName:     prefillData.childName  || '',
    deic_dob:           prefillData.dob        || '',
    deic_age:           prefillData.ageDisplay || '',
    deic_district:      prefillData.district   || '',
    deic_sex:           prefillData.sex        || '',
    deic_rbsk_surveyId: prefillData.surveyId   || '',
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const handleChange = useCallback((id, value) => setFormData(p => ({ ...p, [id]: value })), []);
  const activeSection = DEIC_SECTIONS[activeSectionIdx];
  const colors = SECTION_COLORS[activeSection.color];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'deic_cases'), { ...formData, submittedAt: serverTimestamp(), rbsk_surveyId: prefillData.surveyId || null });
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
      if (!navigator.onLine) {
        setToast({ message: 'Network unavailable. Check your internet.', type: 'error', key: Date.now() });
      } else {
        setToast({ message: 'Error saving case sheet. Please try again.', type: 'error', key: Date.now() });
      }
    }
    finally { setIsSaving(false); }
  };

  if (isSubmitted) return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-50 flex items-center justify-center p-6 font-sans'>
      <div className='max-w-md w-full card-elevated p-10 text-center animate-fade-in'>
        <div className='w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in'><CheckCircle2 size={48}/></div>
        <h2 className='text-2xl font-black text-slate-900 mb-2'>DEIC Case Saved</h2>
        <p className='text-slate-500 mb-6 font-medium'>Case sheet for <b className="text-slate-800">{formData.deic_childName||'Child'}</b> saved.</p>
        {formData.deic_rbsk_surveyId&&(<div className='bg-teal-50 rounded-2xl p-4 mb-6 text-sm border border-teal-100'><span className='text-teal-700 font-bold'>Linked RBSK: </span><span className='text-teal-900 font-black'>{formData.deic_rbsk_surveyId}</span></div>)}
        <div className='flex gap-3'>
          <button onClick={()=>window.print()} className='flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-2xl font-extrabold text-sm hover:bg-black transition-all'><Printer size={16}/> Print</button>
          <button onClick={onBack} className='flex-1 btn-primary'>Back to RBSK</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 font-sans flex flex-col'>
      {/* Toast */}
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className='glass border-b border-slate-200/50 sticky top-0 z-40 shadow-glass'>
        <div className='max-w-5xl mx-auto px-4 py-3 flex items-center gap-3'>
          <button onClick={onBack} className='p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all'><ChevronLeft size={20}/></button>
          <div className='bg-gradient-to-br from-teal-500 to-teal-700 p-2 rounded-xl text-white shadow-sm'><ClipboardCheck size={20}/></div>
          <div>
            <h1 className='font-black text-slate-900 text-base leading-none'>DEIC Case Sheet</h1>
            <p className='text-[10px] text-slate-400 font-bold mt-0.5'>{formData.deic_childName||'New Case'}{formData.deic_age?` · ${formData.deic_age}`:''}</p>
          </div>
          {formData.deic_rbsk_surveyId&&(
            <div className='hidden sm:flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-xl ml-1'>
              <CheckCircle2 size={12} className='text-teal-500'/>
              <span className='text-xs font-extrabold text-teal-700'>{formData.deic_rbsk_surveyId.slice(-10)}</span>
            </div>
          )}
          <div className='ml-auto flex items-center gap-2'>
            <button onClick={handleSave} disabled={isSaving}
              className='btn-primary px-5 py-2 text-sm disabled:opacity-50'>
              <Save size={16}/>{isSaving?'Saving…':'Save'}
            </button>
            <button onClick={()=>setSidebarOpen(v=>!v)} className='sm:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all'><Menu size={20}/></button>
          </div>
        </div>
      </header>
      <div className='flex flex-1 max-w-5xl mx-auto w-full'>
        {/* Sidebar */}
        <aside className={`${sidebarOpen?'fixed inset-0 z-30 flex':'hidden'} sm:relative sm:flex flex-col w-64 bg-white border-r border-slate-100 shrink-0 sm:sticky sm:top-[61px] sm:h-[calc(100vh-61px)] overflow-y-auto`}>
          {sidebarOpen&&<div className='absolute inset-0 bg-black/40 sm:hidden' onClick={()=>setSidebarOpen(false)}/>}
          <div className='relative z-10 bg-white w-64 h-full p-4 space-y-1 overflow-y-auto'>
            {DEIC_SECTIONS.map((sec,idx)=>{
              const Icon=ICON_MAP[sec.icon]||FileText;
              const priority=['child_registration','psychologist','audiology','speech_therapy'].includes(sec.id);
              const active=idx===activeSectionIdx;
              return(
                <button key={sec.id} type='button' onClick={()=>{setActiveSectionIdx(idx);setSidebarOpen(false);}}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${active?`${colors.bg} ${colors.text} font-extrabold shadow-sm`:'text-slate-500 hover:bg-slate-50 font-bold'}`}>
                  <Icon size={16} className='shrink-0'/>
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs leading-tight truncate'>{sec.title.split('–')[0].trim()}</p>
                  </div>

                </button>
              );
            })}
          </div>
        </aside>
        <main className='flex-1 overflow-y-auto'>
          <div className='p-4 sm:p-6 max-w-3xl mx-auto page-enter'>
            <div className={`flex items-center gap-4 mb-6 p-5 rounded-3xl ${colors.bg} border ${colors.border} transition-all`}>
              <div className={`${colors.badge} p-2.5 rounded-2xl text-white shadow-sm`}>
                {React.createElement(ICON_MAP[activeSection.icon]||FileText,{size:22})}
              </div>
              <div>
                <p className={`text-[10px] font-extrabold uppercase tracking-widest opacity-60 ${colors.text}`}>{activeSection.title.split('–')[0].trim()}</p>
                <h2 className={`font-black text-base ${colors.text} leading-tight`}>{activeSection.title}</h2>
              </div>
            </div>
            <SectionRouter section={activeSection} formData={formData} onChange={handleChange}/>
            <div className='mt-8 flex justify-between items-center gap-4 pb-10'>
              <button onClick={()=>setActiveSectionIdx(v=>Math.max(0,v-1))} disabled={activeSectionIdx===0}
                className='flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm text-slate-500 hover:bg-white hover:shadow-card disabled:opacity-20 transition-all'>
                <ChevronLeft size={18}/> Back
              </button>
              <div className='flex items-center gap-1.5'>
                {DEIC_SECTIONS.map((_,i)=>(
                  <button key={i} type='button' onClick={()=>setActiveSectionIdx(i)}
                    className={`rounded-full transition-all duration-300 ${i===activeSectionIdx?`${colors.badge} w-6 h-2`:'bg-slate-300 w-2 h-2 hover:bg-slate-400'}`}/>
                ))}
              </div>
              {activeSectionIdx<DEIC_SECTIONS.length-1?(
                <button onClick={()=>setActiveSectionIdx(v=>v+1)}
                  className={`flex items-center gap-2 ${colors.badge} text-white px-6 py-3 rounded-2xl font-extrabold text-sm shadow-lg hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98]`}>
                  Next <ChevronRight size={18}/>
                </button>
              ):(
                <button onClick={handleSave} disabled={isSaving}
                  className='btn-primary px-8 py-3 text-sm shadow-xl disabled:opacity-50'>
                  {isSaving?'Saving…':<><Save size={18}/> Final Submit</>}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DEICCaseSheet;
