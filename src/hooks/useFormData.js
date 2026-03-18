import { useState, useEffect, useMemo, useCallback } from 'react';
import { generateUniqueId, sanitize, FLAG_KEYS } from '../utils/helpers';
import { SCREENING_PROTOCOLS as PROTOCOLS_0_6 } from '../screeningData_0_6';
import { SCREENING_PROTOCOLS_6_18 as PROTOCOLS_6_18 } from '../screeningData_6_18';

const DRAFT_KEY = 'rbsk_draft';
const INITIAL_STATE = {
  surveyId: '', date: '', district: '', childName: '', dob: '', ageDisplay: '',
  totalMonths: 0, sex: '', residence: '', category: '',
  placeOfBirth: '', newbornScreening: '', hbncVisit: '',
  abnormalityAtBirth: '', everScreened: '', placeOfScreening: [],
  frequencyScreening: '', visibleDefect: '', congenitalDefects: [],
  anemia: '', vitA: '', vitD: '', sam: '', goiter: '',
  skinInfections: '', earInfections: '', rhd: '', asthma: '',
  dentalCaries: '', convulsions: '', visionDiff: '', hearingDiff: '',
  walkingDiff: '', speechDelay: '', learningDelay: '', autism: '',
  adhd: '', behavioral: '', referred: '', referralPlace: '',
  deicConfirmed: '', deicIntervention: '', interventionTypes: [],
  followUp: '', currentStatus: '', freeServices: '', outOfPocket: '',
  parentAwareRBSK: '', parentAwareDEIC: '', satisfaction: '',
  cardAvailable: '', deicVerified: '', gapsIdentified: ''
};

const useFormData = () => {
  // Check for saved draft
  const [hasDraft, setHasDraft] = useState(false);
  const [draftPromptShown, setDraftPromptShown] = useState(false);

  const [formData, setFormData] = useState(() => {
    const fresh = {
      ...INITIAL_STATE,
      surveyId: generateUniqueId(),
      date: new Date().toISOString().split('T')[0],
    };
    // Check if there's a draft
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.childName || parsed.dob) {
          // We have a meaningful draft, but don't restore automatically
          // Let the component decide via restoreDraft()
          return fresh;
        }
      }
    } catch { /* ignore */ }
    return fresh;
  });

  // On mount, check for draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.childName || parsed.dob) {
          setHasDraft(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const restoreDraft = useCallback(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      }
    } catch { /* ignore */ }
    setHasDraft(false);
    setDraftPromptShown(true);
  }, []);

  const dismissDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    setDraftPromptShown(true);
  }, []);

  // Auto-save draft on change (debounced)
  useEffect(() => {
    if (!formData.childName && !formData.dob) return; // Don't save empty forms
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      } catch { /* ignore if storage full */ }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData]);

  // Age calculation
  useEffect(() => {
    if (!formData.dob) return;
    const birth = new Date(formData.dob);
    const today = new Date();
    if (birth > today) {
      setFormData(prev => ({ ...prev, ageDisplay: 'Invalid', totalMonths: 0, category: 'Invalid DOB (future date)' }));
      return;
    }
    let y = today.getFullYear() - birth.getFullYear();
    let m = today.getMonth() - birth.getMonth();
    if (today.getDate() < birth.getDate()) m--;
    if (m < 0) { y--; m += 12; }
    const totalMonths = y * 12 + m;
    const ageDisplay = y > 0 ? `${y}y ${m}m` : `${m}m`;
    let category = '';
    if (totalMonths <= 1.5) category = 'Newborn (0–6 weeks)';
    else if (totalMonths <= 72) category = 'Preschool (6 weeks–6 years)';
    else if (totalMonths <= 216) category = 'School-going (6–18 years)';
    else category = 'Out of Range (> 18 years)';
    setFormData(prev => ({ ...prev, ageDisplay, totalMonths, category }));
  }, [formData.dob]);

  // Handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => {
        const cur = prev[name] || [];
        return { ...prev, [name]: checked ? [...cur, value] : cur.filter(i => i !== value) };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: sanitize(value) }));
    }
  }, []);

  const setVal = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: sanitize(value) }));
  }, []);

  // Red flags (memoized)
  const redFlagsCount = useMemo(() => {
    let count = 0;
    const activeProtocols = formData.totalMonths > 72 ? PROTOCOLS_6_18 : PROTOCOLS_0_6;
    FLAG_KEYS.forEach(k => { if (formData[k] === 'Yes') count++; });
    if (formData.congenitalDefects?.length > 0 && !formData.congenitalDefects.includes('None')) count++;
    activeProtocols.forEach(section => {
      if (formData.totalMonths >= section.ageRange[0] && formData.totalMonths < section.ageRange[1]) {
        if (section.id === 'LD_Checklist') {
          let f = 0, s = 0;
          section.questions.forEach(q => {
            if (formData[q.id] === 'Frequent') f++;
            if (formData[q.id] === 'Sometimes') s++;
          });
          if (f >= 3 || s >= 5) count++;
        } else {
          section.questions.forEach(q => { if (formData[q.id] === q.flagIf) count++; });
        }
      }
    });
    return count;
  }, [formData]);

  // Active protocols (memoized)
  const activeProtocolSections = useMemo(() => {
    const protocols = formData.totalMonths > 72 ? PROTOCOLS_6_18 : PROTOCOLS_0_6;
    return protocols.filter(s => formData.totalMonths >= s.ageRange[0] && formData.totalMonths < s.ageRange[1]);
  }, [formData.totalMonths]);

  // Clear draft on submit
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      ...INITIAL_STATE,
      surveyId: generateUniqueId(),
      date: new Date().toISOString().split('T')[0],
    });
    localStorage.removeItem(DRAFT_KEY);
  }, []);

  return {
    formData, setFormData, handleChange, setVal,
    redFlagsCount, activeProtocolSections,
    hasDraft: hasDraft && !draftPromptShown, restoreDraft, dismissDraft,
    clearDraft, resetForm,
  };
};

export default useFormData;
