import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Baby, Activity, Stethoscope, HeartPulse, ThumbsUp,
  ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, MapPin,
  Calendar, Save, Info, FileText, AlertTriangle, Sparkles, ClipboardCheck,
  Download
} from 'lucide-react';
import { db } from '../firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { SCREENING_PROTOCOLS as PROTOCOLS_0_6 } from '../screeningData_0_6';
import { SCREENING_PROTOCOLS_6_18 as PROTOCOLS_6_18 } from '../screeningData_6_18';
import { FLAG_KEYS, generateDeicId } from '../utils/helpers';
import { exportSurveyPDF } from '../utils/pdfExport';
import { useApp } from '../contexts/AppContext';
import useFormData from '../hooks/useFormData';
import QuestionRow from '../components/QuestionRow';
import ConfirmDialog from '../components/ConfirmDialog';
import DEICReferralSummary from '../DEICReferralSummary';

const SurveyPage = ({ onOpenDEIC }) => {
  const navigate = useNavigate();
  const { showToast, confirmDialog, showConfirm, setConfirmDialog } = useApp();
  const {
    formData, handleChange, setVal,
    redFlagsCount, activeProtocolSections,
    hasDraft, restoreDraft, dismissDraft, clearDraft,
  } = useFormData();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showReferralSummary, setShowReferralSummary] = useState(false);

  // Step validation
  const canProceedFromStep = currentStep === 0
    ? !!(formData.childName.trim() && formData.dob) : true;

  const getStepValidationMessage = () => {
    if (currentStep === 0) {
      if (!formData.childName.trim()) return "Please enter the child's name before proceeding.";
      if (!formData.dob) return 'Please enter a date of birth before proceeding.';
    }
    return '';
  };

  const handleOpenDEIC = useCallback(() => {
    if (onOpenDEIC) {
      onOpenDEIC({
        childName: formData.childName, dob: formData.dob,
        ageDisplay: formData.ageDisplay, district: formData.district,
        sex: formData.sex, surveyId: formData.surveyId,
      });
    }
  }, [formData, onOpenDEIC]);

  // Submit
  const handleSubmit = useCallback(async () => {
    setIsSaving(true);
    try {
      // Generate a DEIC ID to link with this survey
      const deicId = generateDeicId();

      // Save survey — use surveyId as the Firestore document ID (enables direct lookup, no index needed)
      await setDoc(doc(db, 'surveys', formData.surveyId), {
        ...formData, deicId, redFlagsCount, submittedAt: serverTimestamp()
      });

      // Auto-create DEIC case — use deicId as the Firestore document ID
      const flaggedFields = [];
      FLAG_KEYS.forEach(k => { if (formData[k] === 'Yes') flaggedFields.push(k); });
      const protocols = formData.totalMonths > 72 ? PROTOCOLS_6_18 : PROTOCOLS_0_6;
      protocols.forEach(section => {
        if (formData.totalMonths >= section.ageRange[0] && formData.totalMonths < section.ageRange[1]) {
          if (section.id === 'LD_Checklist') {
            let f = 0, s = 0;
            section.questions.forEach(q => {
              if (formData[q.id] === 'Frequent') f++;
              if (formData[q.id] === 'Sometimes') s++;
            });
            if (f >= 3 || s >= 5) flaggedFields.push('LD_Checklist:' + section.title);
          } else {
            section.questions.forEach(q => {
              if (formData[q.id] === q.flagIf) flaggedFields.push(q.id + ':' + q.text);
            });
          }
        }
      });
      await setDoc(doc(db, 'deic_cases', deicId), {
        deicId,
        rbsk_surveyId: formData.surveyId,   // ← bidirectional link back to survey
        deic_childName: formData.childName || 'Unknown',
        deic_dob: formData.dob || '', deic_age: formData.ageDisplay || '',
        deic_district: formData.district || '', deic_sex: formData.sex || '',
        deic_contact: '',
        sum_outcome: 'Pending First Visit',
        sum_primaryDx: redFlagsCount > 0 ? `${redFlagsCount} risk flag(s) detected` : 'No flags',
        sum_nextReview: '', flaggedFields, redFlagsCount,
        referred: formData.referred || '', referralPlace: formData.referralPlace || '',
        deicConfirmed: formData.deicConfirmed || '',
        gapsIdentified: formData.gapsIdentified || '',
        submittedAt: serverTimestamp(),
      });
      clearDraft();
      setIsSubmitted(true);
      if (redFlagsCount > 0) setShowReferralSummary(true);
    } catch (e) {
      console.error('Survey save error:', e);
      if (e.code === 'permission-denied') showToast('Permission denied. Please check your authentication.', 'error');
      else if (e.code === 'unavailable' || !navigator.onLine) showToast('Network unavailable.', 'error');
      else showToast('Error saving survey. Please try again.', 'error');
    } finally { setIsSaving(false); }
  }, [formData, redFlagsCount, showToast, clearDraft]);

  const handleSubmitWithConfirm = () => {
    showConfirm({
      title: 'Submit Survey',
      message: `This will save the screening record for "${formData.childName || 'Unnamed Child'}" with ${redFlagsCount} flag(s). This action cannot be undone.`,
      confirmLabel: 'Submit',
      onConfirm: handleSubmit,
    });
  };

  const steps = [
    { title: 'Identity', icon: User, desc: 'Child profiling' },
    { title: 'History', icon: Baby, desc: 'Birth & RBSK' },
    { title: 'Clinical', icon: Stethoscope, desc: 'Assessment' },
    { title: 'Referral', icon: HeartPulse, desc: 'DEIC linkage' },
    { title: 'Outcome', icon: ThumbsUp, desc: 'Verification' },
  ];

  // POST-SUBMISSION SUCCESS SCREEN
  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="max-w-md mx-auto space-y-5 animate-fade-in">
          <div className="card-elevated p-10 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in">
              <CheckCircle2 size={52} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Record Saved</h2>
            <p className="text-slate-500 mb-6 leading-relaxed font-medium">
              Survey for <b className="text-slate-800">{formData.childName || 'Unnamed'}</b><br />
              <span className="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">{formData.surveyId}</span>
            </p>
            <div className="bg-gradient-to-br from-slate-50 to-teal-50/50 rounded-2xl p-5 text-left border border-slate-100 space-y-3 mb-6">
              <div className="flex justify-between text-sm"><span className="text-slate-500 font-semibold">Age:</span><span className="font-bold text-slate-800">{formData.ageDisplay}</span></div>
              <div className="section-line" />
              <div className="flex justify-between text-sm"><span className="text-slate-500 font-semibold">Risk Flags:</span><span className={`font-black ${redFlagsCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{redFlagsCount}</span></div>
              <div className="section-line" />
              <div className="flex justify-between text-sm"><span className="text-slate-500 font-semibold">Category:</span><span className="font-bold text-slate-800 text-xs">{formData.category}</span></div>
            </div>
            <div className="flex gap-3 mb-3">
              <button onClick={() => navigate('/followup')}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3.5 rounded-2xl font-extrabold text-sm hover:bg-slate-200 transition-all">
                Follow-up
              </button>
              <button onClick={() => window.location.reload()}
                className="flex-1 bg-slate-900 text-white py-3.5 rounded-2xl font-extrabold text-sm hover:bg-black transition-all">
                New Survey
              </button>
            </div>
            <button onClick={() => exportSurveyPDF(formData, redFlagsCount)}
              className="w-full flex items-center justify-center gap-2 bg-teal-50 text-teal-700 py-3 rounded-2xl font-extrabold text-sm hover:bg-teal-100 transition-all border border-teal-100">
              <Download size={16} /> Download PDF
            </button>
          </div>
          {showReferralSummary && (
            <div className="animate-slide-up delay-150">
              <DEICReferralSummary surveyData={formData} redFlagsCount={redFlagsCount}
                onOpenDEIC={handleOpenDEIC} onDismiss={() => setShowReferralSummary(false)} />
            </div>
          )}
          {!showReferralSummary && redFlagsCount === 0 && (
            <button onClick={handleOpenDEIC}
              className="w-full flex items-center justify-center gap-2 card-elevated text-teal-700 py-3.5 font-extrabold text-sm hover:bg-teal-50 transition-all">
              <FileText size={16} /> Open DEIC Case Sheet (Optional)
            </button>
          )}
        </div>
      </div>
    );
  }

  // MAIN SURVEY FORM
  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 page-enter">
      {/* Confirm Dialog */}
      {confirmDialog && <ConfirmDialog {...confirmDialog} />}

      {/* Draft restore prompt */}
      {hasDraft && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center justify-between gap-4 animate-fade-in">
          <div>
            <p className="font-bold text-amber-800 text-sm">Unsaved draft found</p>
            <p className="text-xs text-amber-600 font-medium mt-0.5">You have an incomplete survey from a previous session.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={dismissDraft} className="px-4 py-2 text-xs font-extrabold text-slate-500 hover:text-slate-700 transition-all">Discard</button>
            <button onClick={restoreDraft} className="px-4 py-2 bg-amber-600 text-white text-xs font-extrabold rounded-xl hover:bg-amber-700 transition-all">Restore</button>
          </div>
        </div>
      )}

      {/* Step progress */}
      <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4 px-2 relative">
        {steps.map((step, idx) => (
          <div key={step.title} className="flex flex-col items-center min-w-[80px] relative z-10">
            <button onClick={() => {
              if (idx < currentStep || canProceedFromStep) setCurrentStep(idx);
              else showToast(getStepValidationMessage(), 'warning');
            }}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 cursor-pointer ${
                idx < currentStep ? 'bg-teal-100 text-teal-600 border-teal-200 shadow-md'
                  : idx === currentStep ? 'bg-gradient-to-br from-teal-500 to-teal-700 text-white border-teal-400 shadow-xl shadow-teal-500/30 scale-110'
                  : 'bg-white text-slate-300 border-slate-100 hover:border-slate-200'
              }`}>
              {idx < currentStep ? <CheckCircle2 size={22} /> : <step.icon size={22} />}
            </button>
            <span className={`text-[10px] mt-3 font-extrabold uppercase tracking-widest ${idx <= currentStep ? 'text-teal-700' : 'text-slate-300'}`}>{step.title}</span>
            <span className={`text-[8px] font-semibold ${idx <= currentStep ? 'text-teal-500/70' : 'text-slate-300/60'}`}>{step.desc}</span>
            {idx < steps.length - 1 && (
              <div className={`absolute top-7 left-[calc(50%+28px)] w-[calc(100%-20px)] h-[2px] -z-10 transition-colors duration-500 ${
                idx < currentStep ? 'bg-teal-300' : 'bg-slate-100'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="card-elevated p-8 md:p-12 min-h-[550px] animate-fade-in">
        {/* STEP 0: IDENTITY */}
        {currentStep === 0 && (
          <div className="space-y-8">
            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-teal-50 to-emerald-50/50 rounded-3xl border border-teal-100/60">
              <div className="bg-white p-2.5 rounded-xl text-teal-600 shadow-sm"><Info size={20} /></div>
              <div>
                <h3 className="text-teal-900 font-black text-lg">Identity & Age Profiling</h3>
                <p className="text-teal-700/60 text-sm font-medium">DOB determines the screening category and required forms.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Child's Name / ID <span className="text-red-400">*</span></label>
                <input name="childName" value={formData.childName} onChange={handleChange} placeholder="Enter name" className="input-premium" maxLength={100} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                <div className="relative"><MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input name="district" value={formData.district} onChange={handleChange} placeholder="Area details" className="input-premium pl-12" maxLength={100} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Date of Birth <span className="text-red-400">*</span></label>
                <div className="flex gap-3">
                  <div className="relative flex-1"><Calendar className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className="input-premium pl-12" />
                  </div>
                  {formData.ageDisplay && (
                    <div className={`px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[90px] ${
                      formData.category?.includes('Out of Range') || formData.category?.includes('Invalid')
                        ? 'bg-red-900 text-white' : 'bg-gradient-to-br from-teal-800 to-teal-950 text-white'}`}>
                      <span className="text-[8px] font-black uppercase opacity-60">Age</span>
                      <span className="text-lg font-black">{formData.ageDisplay}</span>
                    </div>
                  )}
                </div>
                {formData.category?.includes('Out of Range') && (
                  <p className="text-xs font-bold text-amber-600 flex items-center gap-1 mt-1"><AlertTriangle size={12} /> Child appears to be over 18.</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Sex</label>
                <div className="flex gap-2">
                  {['Male','Female','Other'].map(s => (
                    <button key={s} onClick={() => setVal('sex', s)}
                      className={`flex-1 py-4 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                        formData.sex === s ? 'bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: HISTORY */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {formData.totalMonths <= 12 ? (
              <div className="bg-gradient-to-br from-orange-50/60 to-amber-50/40 p-8 rounded-[2rem] border border-orange-100/80 shadow-sm">
                <h3 className="text-orange-900 font-black text-xl mb-6 flex items-center gap-3"><Baby size={24} /> Birth History</h3>
                <QuestionRow label="Place of Birth" name="placeOfBirth" options={['Public','Private','Home']} formData={formData} setVal={setVal} />
                <QuestionRow label="Screening at birth?" name="newbornScreening" options={['Yes','No',"Don't Know"]} formData={formData} setVal={setVal} />
                <QuestionRow label="ASHA HBNC Visit?" name="hbncVisit" formData={formData} setVal={setVal} />
                <QuestionRow label="Abnormality noted at birth?" name="abnormalityAtBirth" formData={formData} setVal={setVal} />
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-slate-50/60 rounded-[2rem] border border-dashed border-slate-200">
                <Baby size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold">Infant history skipped — child is {formData.ageDisplay}.</p>
              </div>
            )}
            <div className="pt-4">
              <h3 className="text-slate-900 font-black text-xl mb-6 flex items-center gap-3"><Activity size={24} /> RBSK History</h3>
              <QuestionRow label="Ever screened under RBSK?" name="everScreened" options={['Yes','No',"Don't Know"]} formData={formData} setVal={setVal} />
              <QuestionRow label="Frequency (12 months)" name="frequencyScreening" options={['Once','Twice','None']} formData={formData} setVal={setVal} />
            </div>
          </div>
        )}

        {/* STEP 2: CLINICAL */}
        {currentStep === 2 && (
          <div className="space-y-10 overflow-y-auto max-h-[65vh] pr-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm">
              <h3 className="text-slate-900 font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs">Part A</span> General Assessment
              </h3>
              <QuestionRow label="Any visible congenital defect?" name="visibleDefect" formData={formData} setVal={setVal} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <QuestionRow label="Anemia?" name="anemia" formData={formData} setVal={setVal} />
                <QuestionRow label="Vit A deficiency?" name="vitA" formData={formData} setVal={setVal} />
                <QuestionRow label="Vit D / Rickets?" name="vitD" formData={formData} setVal={setVal} />
                <QuestionRow label="Severe SAM?" name="sam" formData={formData} setVal={setVal} />
                <QuestionRow label="Goiter / Thyroid?" name="goiter" formData={formData} setVal={setVal} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50/60 to-emerald-50/30 p-8 rounded-[2rem] border-2 border-teal-100/50">
              <h3 className="text-teal-900 font-black text-lg mb-2 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-3 py-1 rounded-lg text-xs">Part B</span> Age-Specific Protocol
              </h3>
              <p className="text-teal-700/60 text-xs font-bold mb-6">{formData.ageDisplay} · {formData.category}</p>
              {activeProtocolSections.length === 0 && (
                <div className="py-8 text-center text-teal-600/50">
                  <Stethoscope size={36} className="mx-auto mb-3 opacity-40" />
                  <p className="font-bold text-sm">No age-specific protocol matches for {formData.ageDisplay || 'unknown age'}.</p>
                </div>
              )}
              {activeProtocolSections.map(section => (
                <div key={section.id} className="mb-8">
                  <h4 className="text-teal-800 font-black text-sm uppercase tracking-widest mb-4 border-b border-teal-200/60 pb-2">{section.title}</h4>
                  <div className="grid gap-3">
                    {section.questions.map(q => {
                      const isFlagged = section.id !== 'LD_Checklist' && formData[q.id] === q.flagIf;
                      return (
                        <div key={q.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 justify-between items-center transition-all duration-200 ${
                          isFlagged ? 'bg-red-50 border-red-200 shadow-sm shadow-red-100/50' : 'bg-white border-white shadow-sm hover:shadow-md'}`}>
                          <p className={`text-sm font-semibold flex-1 leading-snug ${isFlagged ? 'text-red-700' : 'text-slate-700'}`}>
                            {isFlagged && <AlertCircle size={12} className="inline mr-1 -mt-0.5" />}{q.text}
                          </p>
                          <div className="flex bg-slate-100/80 p-1 rounded-xl shrink-0">
                            {(q.options || ['Yes','No']).map(opt => (
                              <button key={opt} onClick={() => setVal(q.id, opt)}
                                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all duration-200 ${
                                  formData[q.id] === opt
                                    ? isFlagged && opt === q.flagIf ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg' : 'bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-slate-600'}`}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: REFERRAL */}
        {currentStep === 3 && (
          <div className="space-y-10">
            <div className="border-b border-slate-100 pb-6 mb-4 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Referral &<br />DEIC Intervention</h3>
              <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-100 text-center">
                <span className="text-[9px] font-extrabold text-slate-400 block uppercase mb-1">Total Signals</span>
                <span className={`text-xl font-black ${redFlagsCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{redFlagsCount}</span>
              </div>
            </div>
            <div className="space-y-6">
              <QuestionRow label="Was the child referred after screening?" name="referred" formData={formData} setVal={setVal} />
              {formData.referred === 'Yes' && (
                <div className="space-y-6 p-8 bg-slate-50/60 rounded-[2.5rem] border border-slate-100 animate-fade-in">
                  <QuestionRow label="Level of Referral" name="referralPlace" options={['PHC','Dist. Hospital','DEIC','Tertiary']} formData={formData} setVal={setVal} />
                  <QuestionRow label="Diagnosis confirmed at DEIC?" name="deicConfirmed" formData={formData} setVal={setVal} />
                  <QuestionRow label="Child received intervention?" name="deicIntervention" formData={formData} setVal={setVal} />
                </div>
              )}
            </div>
            {formData.childName && formData.dob && (
              <div className="mt-6 p-6 bg-gradient-to-r from-teal-900 to-teal-950 text-white rounded-[2rem] flex items-center justify-between gap-6 shadow-elevated">
                <div><p className="font-black text-sm flex items-center gap-2"><Sparkles size={16} className="text-teal-300" /> Open DEIC Digital Case Sheet</p></div>
                <button onClick={handleOpenDEIC}
                  className="shrink-0 flex items-center gap-2 bg-white text-teal-900 px-6 py-3 rounded-2xl font-extrabold text-sm hover:bg-teal-50 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <FileText size={16} /> Open
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: OUTCOME */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6 mb-6">
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Feedback &<br />Verification</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <QuestionRow label="Services free of cost?" name="freeServices" formData={formData} setVal={setVal} />
              <QuestionRow label="Out-of-pocket expense?" name="outOfPocket" formData={formData} setVal={setVal} />
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><ClipboardCheck size={120} /></div>
              <h4 className="text-teal-400 font-extrabold text-xs uppercase flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" /> Surveyor Log Entry
              </h4>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Observations & Gaps identified</label>
              <textarea name="gapsIdentified" value={formData.gapsIdentified} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-teal-500 outline-none h-32 text-slate-100 placeholder-slate-600 resize-none transition-all"
                placeholder="Note systemic gaps, observations, follow-up recommendations..." />
            </div>
          </div>
        )}
      </div>

      {/* Step navigation */}
      <div className="mt-12 flex justify-between items-center gap-6 px-4 pb-12">
        <button onClick={() => setCurrentStep(p => Math.max(p - 1, 0))}
          disabled={currentStep === 0 || isSaving}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all ${
            currentStep === 0 ? 'text-slate-200 pointer-events-none' : 'text-slate-500 hover:bg-white hover:shadow-card'}`}>
          <ChevronLeft size={20} /> Back
        </button>
        {currentStep === steps.length - 1 ? (
          <button onClick={handleSubmitWithConfirm} disabled={isSaving}
            className={`btn-primary px-12 py-5 text-lg rounded-[2rem] shadow-2xl ${isSaving ? 'opacity-50' : ''}`}>
            {isSaving ? 'Saving...' : 'Final Submission'} <Save size={24} />
          </button>
        ) : (
          <button onClick={() => {
            if (!canProceedFromStep) { showToast(getStepValidationMessage(), 'warning'); return; }
            setCurrentStep(p => Math.min(p + 1, steps.length - 1));
          }}
            className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] font-extrabold text-lg transition-all shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] ${
              !canProceedFromStep ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none hover:scale-100'
                : 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-teal-500/20'}`}>
            Next Phase <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SurveyPage;
