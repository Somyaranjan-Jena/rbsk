// Shared utility functions

export const generateUniqueId = () => {
  const d = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const r = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
  return `RBSK-${d}-${r}`;
};

export const generateDeicId = () => {
  const d = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const r = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
  return `DEIC-${d}-${r}`;
};

export const sanitize = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(/[<>]/g, '');
};

export const FLAG_LABELS = {
  abnormalityAtBirth: 'Abnormality at Birth',
  visibleDefect: 'Visible Congenital Defect',
  anemia: 'Anemia',
  vitA: 'Vitamin A Deficiency',
  vitD: 'Vitamin D / Rickets',
  sam: 'Severe Acute Malnutrition',
  goiter: 'Goiter / Thyroid',
  skinInfections: 'Skin Infections',
  earInfections: 'Ear Infections',
  rhd: 'Rheumatic Heart Disease',
  asthma: 'Asthma / Respiratory',
  dentalCaries: 'Dental Caries',
  convulsions: 'Seizures / Convulsions',
  visionDiff: 'Vision Difficulty',
  hearingDiff: 'Hearing Difficulty',
  walkingDiff: 'Walking Difficulty',
  speechDelay: 'Speech / Language Delay',
  learningDelay: 'Learning Delay',
  autism: 'Autism Spectrum',
  adhd: 'ADHD',
  behavioral: 'Behavioral Difficulty',
};

export const FLAG_KEYS = [
  'abnormalityAtBirth', 'visibleDefect', 'anemia', 'vitA', 'vitD', 'sam', 'goiter',
  'skinInfections', 'earInfections', 'rhd', 'asthma', 'dentalCaries', 'convulsions',
  'visionDiff', 'hearingDiff', 'walkingDiff', 'speechDelay', 'learningDelay',
  'autism', 'adhd', 'behavioral'
];
