import React, { useState, useEffect, useMemo } from 'react';
import { 
  ClipboardCheck, Baby, Activity, Stethoscope, HeartPulse, User, 
  ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, MapPin, 
  Calendar, ThumbsUp, Save, Info, Printer
} from 'lucide-react';

// --- FIREBASE INTEGRATION ---
// Ensure you have a firebase.js file in your src folder exporting 'db'
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- PROTOCOL DATA ---
import { SCREENING_PROTOCOLS as PROTOCOLS_0_6 } from './screeningData_0_6'; 
import { SCREENING_PROTOCOLS_6_18 as PROTOCOLS_6_18 } from './screeningData_6_18';

const App = () => {
  // --- Unique ID Generation Logic ---
  const generateUniqueId = () => {
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomHex = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
    return `RBSK-${dateStr}-${randomHex}`;
  };

  // --- Form State ---
  const [formData, setFormData] = useState({
    surveyId: generateUniqueId(),
    date: new Date().toISOString().split('T')[0],
    district: '',
    childName: '',
    dob: '', 
    ageDisplay: '', 
    totalMonths: 0, 
    sex: '',
    residence: '',
    category: '',
    placeOfBirth: '',
    newbornScreening: '',
    hbncVisit: '',
    abnormalityAtBirth: '',
    everScreened: '',
    placeOfScreening: [],
    frequencyScreening: '',
    visibleDefect: '',
    congenitalDefects: [],
    anemia: '',
    vitA: '',
    vitD: '',
    sam: '',
    goiter: '',
    skinInfections: '',
    earInfections: '',
    rhd: '',
    asthma: '',
    dentalCaries: '',
    convulsions: '',
    visionDiff: '',
    hearingDiff: '',
    walkingDiff: '',
    speechDelay: '',
    learningDelay: '',
    autism: '',
    adhd: '',
    behavioral: '',
    referred: '',
    referralPlace: '',
    deicConfirmed: '',
    deicIntervention: '',
    interventionTypes: [],
    followUp: '',
    currentStatus: '',
    freeServices: '',
    outOfPocket: '',
    parentAwareRBSK: '',
    parentAwareDEIC: '',
    satisfaction: '',
    cardAvailable: '',
    deicVerified: '',
    gapsIdentified: ''
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- Clinical Flag Counter ---
  const redFlagsCount = useMemo(() => {
    let count = 0;
    const activeProtocols = formData.totalMonths > 72 ? PROTOCOLS_6_18 : PROTOCOLS_0_6;

    const universalKeys = ['abnormalityAtBirth', 'visibleDefect', 'anemia', 'vitA', 'vitD', 'sam', 'goiter', 'skinInfections', 'earInfections', 'rhd', 'asthma', 'dentalCaries', 'convulsions', 'visionDiff', 'hearingDiff', 'walkingDiff', 'speechDelay', 'learningDelay', 'autism', 'adhd', 'behavioral'];
    universalKeys.forEach(key => { if (formData[key] === 'Yes') count++; });
    if (formData.congenitalDefects?.length > 0 && !formData.congenitalDefects.includes('None')) count++;

    activeProtocols.forEach(section => {
      if (formData.totalMonths >= section.ageRange[0] && formData.totalMonths < section.ageRange[1]) {
        if (section.id === 'LD_Checklist') {
          let fCount = 0, sCount = 0;
          section.questions.forEach(q => {
            if (formData[q.id] === 'Frequent') fCount++;
            if (formData[q.id] === 'Sometimes') sCount++;
          });
          if (fCount >= 3 || sCount >= 5) count++;
        } else {
          section.questions.forEach(q => { if (formData[q.id] === q.flagIf) count++; });
        }
      }
    });
    return count;
  }, [formData]);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const currentList = formData[name] || [];
      const newList = checked 
        ? [...currentList, value] 
        : currentList.filter(item => item !== value);
      setFormData(prev => ({ ...prev, [name]: newList }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const setVal = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

  // --- Age Calculation Logic ---
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      let days = today.getDate() - birthDate.getDate();

      if (days < 0) months--;
      if (months < 0) { years--; months += 12; }

      const totalMonths = (years * 12) + months;
      let ageStr = years > 0 ? `${years}y ${months}m` : `${months}m`;
      
      let cat = '';
      if (totalMonths <= 1.5) cat = 'Newborn (0–6 weeks)';
      else if (totalMonths <= 72) cat = 'Preschool (6 weeks–6 years)';
      else if (totalMonths <= 216) cat = 'School-going (6–18 years)';
      else cat = 'Out of Range (> 18 years)';

      setFormData(prev => ({ ...prev, ageDisplay: ageStr, totalMonths, category: cat }));
    }
  }, [formData.dob]);

  // --- SUBMISSION TO FIREBASE ---
  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, "surveys"), {
        ...formData,
        redFlagsCount,
        submittedAt: serverTimestamp()
      });
      console.log("Document saved with ID: ", docRef.id);
      setIsSubmitted(true);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error saving to cloud. Please check your internet connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { title: 'Identity', icon: User },
    { title: 'History', icon: Baby },
    { title: 'Clinical', icon: Stethoscope },
    { title: 'Referral', icon: HeartPulse },
    { title: 'Outcome', icon: ThumbsUp }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const QuestionRow = ({ label, name, options = ['Yes', 'No'] }) => (
    <div className="py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex gap-2">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => setVal(name, opt)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all transform active:scale-95 ${
              formData[name] === opt ? 'bg-teal-600 text-white shadow-lg ring-2 ring-teal-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-8"><CheckCircle2 size={56} /></div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Record Saved</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">Survey for <b>{formData.childName || 'Unnamed'}</b> stored: <b>{formData.surveyId}</b>.</p>
          <div className="bg-teal-50 rounded-2xl p-6 text-left border border-teal-100 mb-8 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-teal-700">Age:</span> <span className="font-bold">{formData.ageDisplay}</span></div>
            <div className="flex justify-between text-sm"><span className="text-teal-700">Risk Flags:</span> <span className={`font-bold ${redFlagsCount > 0 ? 'text-red-600' : 'text-teal-600'}`}>{redFlagsCount}</span></div>
          </div>
          <button onClick={() => window.location.reload()} className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-teal-700 shadow-xl shadow-teal-100">New Survey Entry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24 font-sans text-slate-800">
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 p-2.5 rounded-2xl text-white shadow-lg shadow-teal-100"><ClipboardCheck size={24} /></div>
            <div>
              <h1 className="text-xl font-black text-teal-950 tracking-tight leading-none">RBSK Field Surveyor</h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Digital Intervention Hub</p>
            </div>
          </div>
          {redFlagsCount > 0 && (
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black animate-pulse shadow-lg shadow-red-200">
              <AlertCircle size={14} /> {redFlagsCount} RED FLAGS
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-10 overflow-x-auto pb-4 no-scrollbar px-2">
          {steps.map((step, idx) => (
            <div key={step.title} className="flex flex-col items-center min-w-[80px]">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border ${
                idx <= currentStep ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-100 scale-110' : 'bg-white text-slate-300 border-slate-100'
              }`}><step.icon size={22} /></div>
              <span className={`text-[10px] mt-3 font-black uppercase tracking-widest ${idx <= currentStep ? 'text-teal-700' : 'text-slate-300'}`}>{step.title}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 min-h-[550px]">
          
          {currentStep === 0 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="flex items-start gap-4 p-5 bg-teal-50 rounded-3xl border border-teal-100">
                <div className="bg-white p-2 rounded-xl text-teal-600 shadow-sm"><Info size={20} /></div>
                <div><h3 className="text-teal-900 font-black text-lg">Identity & Age Profiling</h3><p className="text-teal-700/70 text-sm font-medium">DOB determines the screening category and required forms.</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Child's Name / ID</label>
                  <input name="childName" value={formData.childName} onChange={handleChange} placeholder="Enter name" className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none border font-bold text-slate-800" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                  <div className="relative"><MapPin className="absolute left-5 top-5 text-slate-400" size={18} /><input name="district" value={formData.district} onChange={handleChange} placeholder="Area details" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none border font-bold text-slate-800" /></div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date of Birth</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1"><Calendar className="absolute left-5 top-5 text-slate-400" size={18} /><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none border font-bold text-slate-800" max={new Date().toISOString().split('T')[0]} /></div>
                    {formData.ageDisplay && <div className="bg-teal-900 px-6 py-4 rounded-2xl flex flex-col items-center justify-center text-white"><span className="text-[9px] font-black uppercase opacity-60">Age</span><span className="text-lg font-black">{formData.ageDisplay}</span></div>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sex</label>
                  <div className="flex gap-2">{['Male', 'Female', 'Other'].map(s => (<button key={s} onClick={() => setVal('sex', s)} className={`flex-1 py-4 rounded-2xl text-sm font-black ${formData.sex === s ? 'bg-teal-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>{s}</button>))}</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              {formData.totalMonths <= 12 ? (
                <div className="bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100 shadow-sm">
                  <h3 className="text-orange-900 font-black text-xl mb-6 flex items-center gap-3"><Baby size={24} /> Section B: Birth History</h3>
                  <QuestionRow label="Place of Birth" name="placeOfBirth" options={['Public', 'Private', 'Home']} />
                  <QuestionRow label="Screening at birth?" name="newbornScreening" options={['Yes', 'No', "Don't Know"]} />
                  <QuestionRow label="ASHA HBNC Visit?" name="hbncVisit" />
                  <QuestionRow label="Abnormality noted at birth?" name="abnormalityAtBirth" />
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-[2rem] border border-dashed"><p className="font-bold">Infant history skipped (Child is {formData.ageDisplay}).</p></div>
              )}
              <div className="pt-4"><h3 className="text-slate-900 font-black text-xl mb-6 flex items-center gap-3"><Activity size={24} /> Section C: RBSK History</h3><QuestionRow label="Ever screened under RBSK?" name="everScreened" options={['Yes', 'No', "Don't Know"]} /><QuestionRow label="Frequency (12 months)" name="frequencyScreening" options={['Once', 'Twice', 'None']} /></div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500 overflow-y-auto max-h-[65vh] pr-4 custom-scrollbar">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-slate-900 font-black text-lg mb-6 flex items-center gap-2 uppercase tracking-wide"><span className="bg-slate-800 text-white px-3 py-1 rounded-lg text-xs">Part A</span> General Assessment</h3>
                <div className="space-y-6">
                  <QuestionRow label="Any visible congenital defect?" name="visibleDefect" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <QuestionRow label="History of Anemia?" name="anemia" />
                    <QuestionRow label="Vit A deficiency?" name="vitA" />
                    <QuestionRow label="Vit D / Rickets?" name="vitD" />
                    <QuestionRow label="Severe SAM?" name="sam" />
                    <QuestionRow label="Goiter / Thyroid?" name="goiter" />
                  </div>
                </div>
              </div>
              <div className="bg-teal-50/50 p-8 rounded-[2rem] border-2 border-teal-100/50 mt-6 shadow-xl">
                <h3 className="text-teal-900 font-black text-lg mb-2 flex items-center gap-2 uppercase tracking-wide"><span className="bg-teal-600 text-white px-3 py-1 rounded-lg text-xs">Part B</span> Detailed Development Tool</h3>
                <p className="text-teal-700/60 text-xs font-bold mb-6">Age-Specific Protocols: {formData.ageDisplay}</p>
                {(formData.totalMonths > 72 ? PROTOCOLS_6_18 : PROTOCOLS_0_6).filter(s => formData.totalMonths >= s.ageRange[0] && formData.totalMonths < s.ageRange[1]).map(section => (
                  <div key={section.id} className="mb-8">
                    <h4 className="text-teal-800 font-black text-sm uppercase tracking-widest mb-4 border-b border-teal-200 pb-2">{section.title}</h4>
                    <div className="grid gap-3">
                      {section.questions.map(q => {
                        const isFlagged = section.id !== 'LD_Checklist' && formData[q.id] === q.flagIf;
                        return (
                          <div key={q.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row gap-4 justify-between items-center ${isFlagged ? 'bg-red-50 border-red-200' : 'bg-white border-white shadow-sm'}`}>
                            <div className="flex-1"><p className="text-sm font-bold text-slate-700 leading-snug">{q.text}</p></div>
                            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                              {(q.options || ['Yes', 'No']).map(opt => (
                                <button key={opt} onClick={() => setVal(q.id, opt)} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${formData[q.id] === opt ? (isFlagged && opt === q.flagIf ? 'bg-red-500 text-white shadow-lg' : 'bg-teal-600 text-white shadow-lg') : 'text-slate-400 hover:text-slate-600'}`}>{opt}</button>
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

          {currentStep === 3 && (
            <div className="space-y-10 animate-in slide-in-from-right-8 duration-500">
              <div className="border-b border-slate-100 pb-6 mb-4 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">Referral &<br/>DEIC Intervention</h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center"><span className="text-[9px] font-black text-slate-400 block uppercase mb-1">Total Signals</span><span className={`text-xl font-black ${redFlagsCount > 0 ? 'text-red-600' : 'text-teal-600'}`}>{redFlagsCount}</span></div>
              </div>

              {formData.totalMonths > 72 && (
                <div className="bg-amber-50 border border-amber-200 rounded-[2.5rem] p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-amber-100 p-3 rounded-2xl text-amber-700 shadow-sm"><Info size={24} /></div>
                    <div><h4 className="text-amber-900 font-black text-sm uppercase tracking-widest">DEIC Referral Interpretation</h4><p className="text-[10px] text-amber-700 font-bold uppercase mt-1">Learning Disorder Checklist (Academic)</p></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`p-5 rounded-2xl border-2 transition-all ${redFlagsCount > 0 ? 'bg-white border-red-200 shadow-md' : 'bg-amber-100/50 border-transparent'}`}>
                      <span className="text-[10px] font-black text-amber-600 uppercase mb-2 block">Threshold F</span>
                      <p className="text-xs font-black text-slate-800">3+ pointers in <span className="text-red-600 underline">Frequent</span> category</p>
                    </div>
                    <div className={`p-5 rounded-2xl border-2 transition-all ${redFlagsCount > 0 ? 'bg-white border-red-200 shadow-md' : 'bg-amber-100/50 border-transparent'}`}>
                      <span className="text-[10px] font-black text-amber-600 uppercase mb-2 block">Threshold S</span>
                      <p className="text-xs font-black text-slate-800">5+ pointers in <span className="text-red-600 underline">Sometimes</span> category</p>
                    </div>
                  </div>
                  <button onClick={() => window.print()} className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all">
                    <Printer size={18} /> Generate DEIC Referral Note
                  </button>
                </div>
              )}

              <div className="space-y-6">
                <QuestionRow label="Was the child referred after screening?" name="referred" />
                {formData.referred === 'Yes' && (
                  <div className="space-y-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner animate-in fade-in zoom-in-95">
                    <QuestionRow label="Level of Referral" name="referralPlace" options={['PHC', 'Dist. Hospital', 'DEIC', 'Tertiary']} />
                    <QuestionRow label="Diagnosis confirmed at DEIC?" name="deicConfirmed" />
                    <QuestionRow label="Child received intervention?" name="deicIntervention" />
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="border-b border-slate-100 pb-6 mb-6"><h3 className="text-2xl font-black text-slate-900 leading-tight">Feedback &<br/>Verification</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <QuestionRow label="Services free of cost?" name="freeServices" />
                <QuestionRow label="Out-of-pocket expense?" name="outOfPocket" />
              </div>
              <div className="bg-slate-950 text-white p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10"><ClipboardCheck size={80} /></div>
                <h4 className="text-teal-400 font-black text-xs uppercase flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-teal-400"></div> Surveyor Log Entry</h4>
                <div className="relative z-10">
                  <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Observations & Gaps identified</label>
                  <textarea name="gapsIdentified" value={formData.gapsIdentified} onChange={handleChange} className="w-full bg-white/5 border-none rounded-3xl p-6 text-sm focus:ring-2 focus:ring-teal-500 outline-none h-32 text-slate-100" placeholder="Note systemic gaps..."></textarea>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="mt-12 flex justify-between items-center gap-6 px-4">
          <button onClick={prevStep} disabled={currentStep === 0 || isSaving} className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest ${currentStep === 0 ? 'text-slate-200 pointer-events-none' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}><ChevronLeft size={20} /> Back</button>
          {currentStep === steps.length - 1 ? (
            <button 
              onClick={handleSubmit} 
              disabled={isSaving}
              className={`flex items-center gap-3 bg-teal-600 text-white px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${isSaving ? 'opacity-50' : 'hover:bg-teal-700'}`}
            >
              {isSaving ? 'Saving...' : 'Final Submission'} <Save size={24} />
            </button>
          ) : (
            <button onClick={nextStep} disabled={!formData.dob && currentStep === 0} className={`flex items-center gap-3 px-12 py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl transform hover:scale-105 active:scale-95 ${(!formData.dob && currentStep === 0) ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-100'}`}>Next Phase <ChevronRight size={24} /></button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;