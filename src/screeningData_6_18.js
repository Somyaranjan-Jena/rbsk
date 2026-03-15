// src/screeningData_6_18.js

export const SCREENING_PROTOCOLS_6_18 = [
  // =================================================================================
  // GENERAL SCREENING (6 - 18 Years)
  // =================================================================================
  
  // --- SECTION A: Defects at Birth ---
  {
    id: 'A_6_18',
    title: 'Defects at Birth (6-18 Years)',
    ageRange: [72, 216], // 6y to 18y
    questions: [
      { id: 'A1', text: 'Any visible Defect at Birth? (e.g. Cleft Lip/Palate, Club Foot, Downs Syndrome, Cataract)', type: 'Defect', flagIf: 'Yes' }, //
    ]
  },

  // --- SECTION B: Deficiencies ---
  {
    id: 'B_6_18',
    title: 'Deficiencies (6-18 Years)',
    ageRange: [72, 216], 
    questions: [
      { id: 'B1', text: 'Severe Thinning (SAM like)? (BMI <-3SD)', type: 'Nutrition', flagIf: 'Yes' }, //
      { id: 'B2', text: 'Bilateral pitting oedema (esp. at feet)?', type: 'Nutrition', flagIf: 'Yes' }, //
      { id: 'B3', text: 'Severe Anemia (Severe palmar pallor)?', type: 'Nutrition', flagIf: 'Yes' }, //
      { id: 'B4', text: 'Vitamin A Deficiency (Night blindness or Bitots spot)?', type: 'Nutrition', flagIf: 'Yes' }, //
      { id: 'B5', text: 'Vitamin D Deficiency (Wrist widening/bowing of legs)?', type: 'Nutrition', flagIf: 'Yes' }, //
      { id: 'B6', text: 'Goitre (Swelling in neck region)?', type: 'Nutrition', flagIf: 'Yes' }, //
      { id: 'B7', text: 'Obesity (BMI > +2SD)?', type: 'Nutrition', flagIf: 'Yes' }, //
      { id: 'B8', text: 'Vitamin B Complex Deficiency (Angular stomatitis, fissured tongue)?', type: 'Nutrition', flagIf: 'Yes' } //
    ]
  },

  // --- SECTION C: Diseases ---
  {
    id: 'C_6_18',
    title: 'Childhood Diseases (6-18 Years)',
    ageRange: [72, 216], 
    questions: [
      { id: 'C1', text: 'Convulsive Disorders: Ever had spells of unconsciousness/fits?', type: 'Disease', flagIf: 'Yes' }, //
      { id: 'C2', text: 'Otitis Media: Active ear discharge or >3 episodes in last year?', type: 'Disease', flagIf: 'Yes' }, //
      { id: 'C3', text: 'Dental Condition: White demineralized/brown tooth, swollen gums, plaque?', type: 'Disease', flagIf: 'Yes' }, //
      { id: 'C4', text: 'Skin Condition: Itching (esp. at night), scaly lesions, or pustules in finger webs?', type: 'Disease', flagIf: 'Yes' }, //
      { id: 'C5', text: 'Asthma: Recurrent shortness of breath/wheezing (>3 episodes in 6 months)?', type: 'Disease', flagIf: 'Yes' }, //
      { id: 'C6', text: 'RHD: Rheumatic Heart Disease (Murmur detected)?', type: 'Disease', flagIf: 'Yes' }, //
      { id: 'C7', text: 'Leprosy (Suspected): Hypo-pigmented patch with sensation loss?', type: 'Disease', flagIf: 'Yes' }, //
      { id: 'C8', text: 'Tuberculosis (Suspected): Cough/Fever > 2 weeks, weight loss?', type: 'Disease', flagIf: 'Yes' } //
    ]
  },

  // --- SECTION D: Developmental Delays ---
  {
    id: 'D_6_18',
    title: 'Developmental Delays (6-18 Years)',
    ageRange: [72, 216], 
    questions: [
      { id: 'D1', text: 'Does the child have difficulty in seeing (day or night)?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D2', text: 'Did the child have any delay in walking compared to others?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D3', text: 'Does the child have stiffness/floppiness or reduced strength in limbs?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D4', text: 'Has the child ever had fits, rigidity, or sudden spasms?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D5', text: 'Difficulty reading, writing, or doing simple calculations?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D6', text: 'Difficulty speaking compared to other children?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D7', text: 'Difficulty in hearing without hearing aid?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D8', text: 'Difficulty learning new things?', type: 'Delay', flagIf: 'Yes' }, //
      { id: 'D9', text: 'Difficulty sustaining attention at school or play (ADHD)?', type: 'Delay', flagIf: 'Yes' } //
    ]
  },

  // =================================================================================
  // ADOLESCENT SPECIFIC (10 - 18 Years)
  // =================================================================================
  
  {
    id: 'E_10_18',
    title: 'Adolescent Health (10-18 Years)',
    ageRange: [120, 216], // 10y to 18y
    questions: [
      { id: 'E1', text: 'Do you find it difficult to handle changes occurring in your body?', type: 'Adolescent', flagIf: 'Yes' }, //
      { id: 'E2', text: 'Are you able to say "NO" if friends pressure you to smoke/drink?', type: 'Adolescent', flagIf: 'No' }, //
      { id: 'E3', text: 'Do you feel unduly tired early morning or depressed most of the time?', type: 'Adolescent', flagIf: 'Yes' }, //
      { id: 'E4', text: '(Females) Have your menstrual cycles started yet? (Refer if age >16 and No)', type: 'Adolescent', flagIf: 'No' }, //
      { id: 'E5', text: '(Females) Do you have your periods every month (approx 28 days)?', type: 'Adolescent', flagIf: 'No' }, //
      { id: 'E6', text: 'Do you experience pain/burning while urinating?', type: 'Adolescent', flagIf: 'Yes' }, //
      { id: 'E7', text: 'Do you have foul smelling discharge from genitor-urinary area?', type: 'Adolescent', flagIf: 'Yes' }, //
      { id: 'E8', text: '(Females) Do you feel extreme pain during menstruation that stops routine activities?', type: 'Adolescent', flagIf: 'Yes' } //
    ]
  },

  // =================================================================================
  // LEARNING DISORDER CHECKLIST (Special Scoring)
  // =================================================================================
  
  {
    id: 'LD_Checklist',
    title: 'Learning Disorder Checklist (Academic)',
    ageRange: [72, 216], 
    questions: [
      { id: 'Ld1', text: 'Makes mistakes in reading (omits/substitutes words or skips lines)?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld2', text: 'Can answer orally but has difficulty writing answers?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld3', text: 'Writes/reads figures wrong way (e.g. 15 for 51, b for d)?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld4', text: 'Difficulty differentiating letter sounds (vowels/blends)?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld5', text: 'Difficulty rhyming words and repeating them?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld6', text: 'Difficulty taking notes or copying from blackboard?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld7', text: 'Confusion with math symbols (+, -, x)?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld8', text: 'Difficulty in spelling?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld9', text: 'Difficulties with direction (left/right, east/west)?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] }, //
      { id: 'Ld10', text: 'Misplaces upper/lower case letters (e.g. BeTTer, n for N)?', type: 'LD', options: ['Never', 'Sometimes', 'Frequent'] } //
    ]
  }
];