// DEICReferralSummary.js
// Structured referral summary card shown in RBSK app when clinical flags are detected.
// Tells the clinician which domains are flagged and which DEIC sections to open.

import React, { useState } from 'react';
import {
  AlertTriangle, FileText, Brain, Ear, Activity, Eye, Heart,
  CheckCircle2, ArrowRight, ChevronDown, ChevronUp
} from 'lucide-react';

const FLAG_DOMAINS = [
  {
    id: 'neuro',    label: 'Neurological / Developmental', icon: Brain,    color: 'purple',
    keys: ['speechDelay','walkingDiff','learningDelay','autism','adhd','behavioral','convulsions'],
    deicSections: ['Psychologist – Developmental Assessment', 'Special Educator Assessment'],
  },
  {
    id: 'hearing',  label: 'Auditory / Speech',            icon: Ear,      color: 'amber',
    keys: ['hearingDiff'],
    deicSections: ['Audiology – Auditory Assessment', 'Speech Therapy Evaluation'],
  },
  {
    id: 'vision',   label: 'Vision',                       icon: Eye,      color: 'cyan',
    keys: ['visionDiff'],
    deicSections: ['Ophthalmology – Vision & ROP Screening'],
  },
  {
    id: 'physical', label: 'Physical / Nutritional',       icon: Activity, color: 'orange',
    keys: ['anemia','vitA','vitD','sam','goiter','skinInfections','earInfections','abnormalityAtBirth','visibleDefect'],
    deicSections: ['Child Registration & Background Details', 'Early Intervention & Remedial Therapy'],
  },
  {
    id: 'cardiac',  label: 'Cardiac / Respiratory',        icon: Heart,    color: 'red',
    keys: ['rhd','asthma'],
    deicSections: ['Child Registration & Background Details', 'Physiotherapist Assessment'],
  },
];

const FIELD_LABELS = {
  speechDelay:'Speech / Language Delay', walkingDiff:'Difficulty Walking', learningDelay:'Learning Delay',
  autism:'Autism Spectrum Concerns', adhd:'ADHD / Attention Concerns', behavioral:'Behavioral Difficulties',
  convulsions:'History of Seizures', hearingDiff:'Hearing Difficulty', visionDiff:'Vision Difficulty',
  anemia:'Anemia', vitA:'Vitamin A Deficiency', vitD:'Vitamin D Deficiency', sam:'Severe Acute Malnutrition',
  goiter:'Goiter', skinInfections:'Skin Infections', earInfections:'Ear Infections',
  abnormalityAtBirth:'Abnormality at Birth', visibleDefect:'Visible Congenital Defect',
  rhd:'Rheumatic Heart Disease', asthma:'Asthma / Respiratory Issues',
};

const COLOR = {
  purple: { bg:'bg-purple-50', border:'border-purple-200', text:'text-purple-700', icon:'text-purple-500', badge:'bg-purple-100 text-purple-700' },
  amber:  { bg:'bg-amber-50',  border:'border-amber-200',  text:'text-amber-700',  icon:'text-amber-500',  badge:'bg-amber-100 text-amber-700'  },
  cyan:   { bg:'bg-cyan-50',   border:'border-cyan-200',   text:'text-cyan-700',   icon:'text-cyan-500',   badge:'bg-cyan-100 text-cyan-700'    },
  orange: { bg:'bg-orange-50', border:'border-orange-200', text:'text-orange-700', icon:'text-orange-500', badge:'bg-orange-100 text-orange-700' },
  red:    { bg:'bg-red-50',    border:'border-red-200',    text:'text-red-700',    icon:'text-red-500',    badge:'bg-red-100 text-red-700'      },
};

const DEICReferralSummary = ({ surveyData, redFlagsCount, onOpenDEIC, onDismiss }) => {
  const [expanded, setExpanded] = useState(true);

  const activeDomains = FLAG_DOMAINS.map(domain => ({
    ...domain,
    triggeredFlags: domain.keys
      .filter(key => surveyData[key] === 'Yes' || surveyData[key] === 'Frequent' || surveyData[key] === 'Sometimes')
      .map(key => FIELD_LABELS[key] || key),
  })).filter(d => d.triggeredFlags.length > 0);

  // Safety: if somehow no domains activated, don't render broken card
  if (activeDomains.length === 0 && redFlagsCount === 0) return null;

  const recommendedSections = [...new Set(activeDomains.flatMap(d => d.deicSections))];

  if (!expanded) {
    return (
      <div onClick={() => setExpanded(true)}
        className='cursor-pointer bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg shadow-red-500/20 hover:shadow-xl transition-all'>
        <div className='flex items-center gap-3'>
          <AlertTriangle size={18} />
          <span className='font-extrabold text-sm'>{redFlagsCount} Flag{redFlagsCount !== 1 ? 's' : ''} — DEIC Referral Required</span>
        </div>
        <ChevronUp size={16} />
      </div>
    );
  }

  return (
    <div className='card-elevated border-2 border-red-200 shadow-2xl shadow-red-100/50 overflow-hidden font-sans animate-slide-up'>
      {/* Header */}
      <div className='bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-6 py-5 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-white/20 p-2.5 rounded-xl'><AlertTriangle size={20} className='text-white' /></div>
          <div>
            <h3 className='text-white font-black text-base leading-none'>DEIC Referral Required</h3>
            <p className='text-red-100 text-xs font-bold mt-0.5'>
              {redFlagsCount} signal{redFlagsCount !== 1 ? 's' : ''} · {surveyData.childName || 'Child'} · {surveyData.ageDisplay || '--'}
            </p>
          </div>
        </div>
        <button onClick={() => setExpanded(false)} className='bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition-all'>
          <ChevronDown size={18} />
        </button>
      </div>

      <div className='p-6 space-y-5'>
        {/* Domain flags */}
        <div className='space-y-3'>
          <p className='text-[10px] font-extrabold text-slate-400 uppercase tracking-widest'>Flags by Domain</p>
          {activeDomains.map(domain => {
            const c = COLOR[domain.color];
            return (
              <div key={domain.id} className={`${c.bg} ${c.border} border rounded-2xl p-4 transition-all hover:shadow-sm`}>
                <div className='flex items-center gap-2 mb-2'>
                  <domain.icon size={15} className={c.icon} />
                  <span className={`text-xs font-extrabold uppercase tracking-wider ${c.text}`}>{domain.label}</span>
                  <span className={`ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${c.badge}`}>{domain.triggeredFlags.length}</span>
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {domain.triggeredFlags.map(flag => (
                    <span key={flag} className='text-[11px] font-semibold text-slate-700 bg-white border border-slate-200/60 px-2.5 py-1 rounded-lg shadow-sm'>{flag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended sections */}
        {recommendedSections.length > 0 && (
          <div className='bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-4 border border-slate-100'>
            <p className='text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3'>Recommended DEIC Sections</p>
            <div className='space-y-2'>
              {recommendedSections.map((sec, i) => (
                <div key={i} className='flex items-start gap-2'>
                  <CheckCircle2 size={13} className='text-teal-500 mt-0.5 shrink-0' />
                  <span className='text-xs font-semibold text-slate-700'>{sec}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Survey link tag */}
        {surveyData.surveyId && (
          <div className='flex items-center gap-2 text-xs text-slate-500 bg-slate-50/80 rounded-xl px-4 py-2 border border-slate-100'>
            <FileText size={13} />
            <span className='font-bold'>Survey:</span>
            <span className='font-mono text-teal-700 font-extrabold'>{surveyData.surveyId}</span>
            <span className='ml-auto text-slate-400 text-[10px]'>auto-linked</span>
          </div>
        )}

        <button onClick={onOpenDEIC}
          className='w-full btn-primary py-4 text-sm shadow-xl'>
          <FileText size={18} /> Open DEIC Digital Case Sheet <ArrowRight size={16} />
        </button>

        {onDismiss && (
          <button onClick={onDismiss} className='w-full text-slate-400 text-xs font-bold hover:text-slate-600 py-1 transition-all'>
            Dismiss — Refer Later
          </button>
        )}
      </div>
    </div>
  );
};

export default DEICReferralSummary;
