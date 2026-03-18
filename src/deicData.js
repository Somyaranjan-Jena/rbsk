// deicData.js
// Complete DEIC Digital Case Sheet – Structured Data
// Based on: DEIC_updated_structure.docx (23-page mapping)

export const DEIC_SECTIONS = [
  // ─────────────────────────────────────────────────────────────────
  // SECTION 1: Child Registration & Background (Pages 1–2)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'child_registration',
    page: '1–2',
    title: 'Child Registration & Background Details',
    icon: 'User',
    color: 'teal',
    subsections: [
      {
        id: 'basic_info',
        title: 'Basic Information',
        fields: [
          { id: 'deic_regNo', label: 'DEIC Registration No.', type: 'text', placeholder: 'DEIC/2026/XXXX' },
          { id: 'deic_date', label: 'Date of Registration', type: 'date' },
          { id: 'deic_district', label: 'District', type: 'text' },
          { id: 'deic_block', label: 'Block / Taluka', type: 'text' },
          { id: 'deic_village', label: 'Village / Ward', type: 'text' },
          { id: 'deic_referredBy', label: 'Referred By', type: 'select', options: ['RBSK Team', 'ASHA', 'AWW', 'School Teacher', 'Parent / Guardian', 'PHC MO', 'Other'] },
          { id: 'deic_referralDate', label: 'Date of Referral', type: 'date' },
        ]
      },
      {
        id: 'child_details',
        title: 'Child Details',
        fields: [
          { id: 'deic_childName', label: 'Child\'s Full Name', type: 'text' },
          { id: 'deic_dob', label: 'Date of Birth', type: 'date' },
          { id: 'deic_age', label: 'Age (Years/Months)', type: 'text', readonly: true },
          { id: 'deic_sex', label: 'Sex', type: 'radio', options: ['Male', 'Female', 'Other'] },
          { id: 'deic_category', label: 'Social Category', type: 'select', options: ['General', 'SC', 'ST', 'OBC', 'Minority', 'BPL'] },
          { id: 'deic_religion', label: 'Religion', type: 'text' },
          { id: 'deic_aadhar', label: 'Aadhar No. (Child)', type: 'text', placeholder: 'XXXX-XXXX-XXXX' },
        ]
      },
      {
        id: 'family_details',
        title: 'Family & Parent Details',
        fields: [
          { id: 'deic_fatherName', label: 'Father\'s Name', type: 'text' },
          { id: 'deic_motherName', label: 'Mother\'s Name', type: 'text' },
          { id: 'deic_contact', label: 'Contact Number', type: 'text' },
          { id: 'deic_address', label: 'Full Address', type: 'textarea' },
          { id: 'deic_fatherEdu', label: 'Father\'s Education', type: 'select', options: ['Illiterate', 'Primary', 'Secondary', 'Graduate', 'Post-Graduate'] },
          { id: 'deic_motherEdu', label: 'Mother\'s Education', type: 'select', options: ['Illiterate', 'Primary', 'Secondary', 'Graduate', 'Post-Graduate'] },
          { id: 'deic_income', label: 'Monthly Family Income (₹)', type: 'select', options: ['< 5,000', '5,000–10,000', '10,000–20,000', '> 20,000'] },
          { id: 'deic_consanguinity', label: 'Consanguineous Marriage?', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
          { id: 'deic_siblings', label: 'No. of Siblings', type: 'number' },
          { id: 'deic_affectedSiblings', label: 'Any Sibling with Similar Condition?', type: 'radio', options: ['Yes', 'No'] },
        ]
      },
      {
        id: 'birth_history',
        title: 'Birth & Perinatal History',
        fields: [
          { id: 'deic_birthOrder', label: 'Birth Order', type: 'select', options: ['1st', '2nd', '3rd', '4th', '5th+'] },
          { id: 'deic_gestationWeeks', label: 'Gestational Age (weeks)', type: 'number', placeholder: '28–42' },
          { id: 'deic_birthType', label: 'Type of Delivery', type: 'select', options: ['Normal / Vaginal', 'LSCS / C-section', 'Forceps/Vacuum', 'Home Delivery'] },
          { id: 'deic_birthPlace', label: 'Place of Birth', type: 'select', options: ['Govt. Hospital', 'Private Hospital', 'Home', 'PHC/CHC', 'Other'] },
          { id: 'deic_birthWeight', label: 'Birth Weight (grams)', type: 'number', placeholder: 'e.g. 2500' },
          { id: 'deic_birthCry', label: 'Birth Cry?', type: 'radio', options: ['Immediate', 'Delayed', 'Absent'] },
          { id: 'deic_nicu', label: 'NICU Admission?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'deic_nicuDays', label: 'If Yes – NICU Duration (days)', type: 'number' },
          { id: 'deic_perinatalComplications', label: 'Perinatal Complications', type: 'checkbox', options: ['Birth Asphyxia', 'Jaundice', 'Sepsis', 'Seizures', 'RDS', 'Meconium Aspiration', 'None'] },
          { id: 'deic_antenatalIllness', label: 'Maternal Antenatal Illness', type: 'checkbox', options: ['Diabetes', 'Hypertension', 'Hypothyroidism', 'Infections (TORCH)', 'Drug/Alcohol', 'None'] },
        ]
      },
      {
        id: 'developmental_history',
        title: 'Developmental History',
        fields: [
          { id: 'deic_headHolding', label: 'Head Holding (months)', type: 'number' },
          { id: 'deic_sitting', label: 'Independent Sitting (months)', type: 'number' },
          { id: 'deic_standing', label: 'Standing with Support (months)', type: 'number' },
          { id: 'deic_walking', label: 'Independent Walking (months)', type: 'number' },
          { id: 'deic_firstWord', label: 'First Words (months)', type: 'number' },
          { id: 'deic_sentences', label: 'Two-word Phrases (months)', type: 'number' },
          { id: 'deic_regression', label: 'Any Developmental Regression?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'deic_regressionDetails', label: 'If Yes – Details', type: 'textarea' },
          { id: 'deic_seizureHistory', label: 'History of Seizures?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'deic_seizureDetails', label: 'If Yes – Type & Frequency', type: 'textarea' },
        ]
      },
      {
        id: 'physical_examination',
        title: 'Physical Examination',
        fields: [
          { id: 'deic_weight', label: 'Weight (kg)', type: 'number', step: '0.1' },
          { id: 'deic_height', label: 'Height / Length (cm)', type: 'number', step: '0.1' },
          { id: 'deic_hc', label: 'Head Circumference (cm)', type: 'number', step: '0.1' },
          { id: 'deic_muac', label: 'MUAC (cm)', type: 'number', step: '0.1' },
          { id: 'deic_weightStatus', label: 'Weight-for-Age Status', type: 'select', options: ['Normal', 'Underweight (-2SD)', 'Severely Underweight (-3SD)', 'Overweight (+2SD)'] },
          { id: 'deic_heightStatus', label: 'Height-for-Age Status', type: 'select', options: ['Normal', 'Stunted (-2SD)', 'Severely Stunted (-3SD)', 'Tall (+2SD)'] },
          { id: 'deic_pallor', label: 'Pallor', type: 'radio', options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
          { id: 'deic_jaundice', label: 'Jaundice', type: 'radio', options: ['Absent', 'Present'] },
          { id: 'deic_lymphNodes', label: 'Lymph Nodes', type: 'radio', options: ['Not palpable', 'Palpable (non-tender)', 'Palpable (tender)'] },
          { id: 'deic_dysmorphicFeatures', label: 'Dysmorphic Features', type: 'radio', options: ['Absent', 'Present'] },
          { id: 'deic_dysmorphicDetails', label: 'If Present – Details', type: 'textarea' },
          { id: 'deic_primaryDiagnosis', label: 'Provisional Primary Diagnosis', type: 'text' },
          { id: 'deic_comorbidities', label: 'Comorbidities / Secondary Diagnoses', type: 'textarea' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 2: Psychologist – Developmental Assessment (Pages 3–7)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'psychologist',
    page: '3–7',
    title: 'Psychologist – Developmental Assessment',
    icon: 'Brain',
    color: 'purple',
    subsections: [
      {
        id: 'psych_grossMotor',
        title: 'Gross Motor Development',
        fields: [
          { id: 'psych_headControl', label: 'Head Control', type: 'select', options: ['Age-appropriate', 'Mildly Delayed', 'Significantly Delayed', 'Not Achieved'] },
          { id: 'psych_sitting_gm', label: 'Sitting Balance', type: 'select', options: ['Independent', 'With Support', 'Unable'] },
          { id: 'psych_walking_gm', label: 'Walking', type: 'select', options: ['Normal', 'Abnormal Gait', 'With Support', 'Not Walking'] },
          { id: 'psych_stairs', label: 'Climbing Stairs', type: 'select', options: ['Age-appropriate', 'Needs Rail', 'Unable'] },
          { id: 'psych_running', label: 'Running / Jumping', type: 'select', options: ['Normal', 'Mildly Impaired', 'Significantly Impaired', 'Not Achieved'] },
          { id: 'psych_gm_remarks', label: 'Gross Motor Remarks', type: 'textarea' },
        ]
      },
      {
        id: 'psych_fineMotor',
        title: 'Fine Motor Development',
        fields: [
          { id: 'psych_grasp', label: 'Grasp Pattern', type: 'select', options: ['Pincer Grasp', 'Palmar Grasp', 'Crude Grasp Only', 'No Functional Grasp'] },
          { id: 'psych_transfer', label: 'Object Transfer (hand to hand)', type: 'radio', options: ['Yes', 'No'] },
          { id: 'psych_scribble', label: 'Scribbling / Drawing', type: 'select', options: ['Age-appropriate', 'Mildly Delayed', 'Significantly Delayed', 'Not Achieved'] },
          { id: 'psych_scissors', label: 'Use of Scissors', type: 'select', options: ['Appropriate', 'With Difficulty', 'Unable'] },
          { id: 'psych_fm_remarks', label: 'Fine Motor Remarks', type: 'textarea' },
        ]
      },
      {
        id: 'psych_cognition',
        title: 'Cognitive Development',
        fields: [
          { id: 'psych_objectPermanence', label: 'Object Permanence', type: 'radio', options: ['Present', 'Absent'] },
          { id: 'psych_imitation', label: 'Imitation of Actions', type: 'select', options: ['Age-appropriate', 'Mildly Delayed', 'Significantly Delayed', 'Absent'] },
          { id: 'psych_sorting', label: 'Sorting by Color / Shape', type: 'select', options: ['Appropriate', 'With Difficulty', 'Unable'] },
          { id: 'psych_matching', label: 'Matching Objects', type: 'select', options: ['Appropriate', 'With Difficulty', 'Unable'] },
          { id: 'psych_counting', label: 'Counting / Number Concept', type: 'select', options: ['Age-appropriate', 'Mildly Delayed', 'Significantly Delayed', 'Absent'] },
          { id: 'psych_bodyParts', label: 'Identification of Body Parts', type: 'select', options: ['All (>5)', '3–5 parts', '1–2 parts', 'None'] },
          { id: 'psych_iqTool', label: 'IQ Assessment Tool Used', type: 'select', options: ['Vineland Social Maturity Scale', 'Binet-Kamat Test', 'Malin\'s Intelligence Scale (MISIC)', 'Denver II', 'DASII', 'Not Assessed'] },
          { id: 'psych_iqScore', label: 'IQ / DQ Score', type: 'number' },
          { id: 'psych_iqCategory', label: 'Intellectual Category', type: 'select', options: ['Normal (IQ ≥ 90)', 'Borderline (70–89)', 'Mild ID (55–69)', 'Moderate ID (40–54)', 'Severe ID (25–39)', 'Profound ID (<25)'] },
          { id: 'psych_cog_remarks', label: 'Cognitive Remarks', type: 'textarea' },
        ]
      },
      {
        id: 'psych_speech',
        title: 'Speech & Language Development',
        fields: [
          { id: 'psych_receptive', label: 'Receptive Language', type: 'select', options: ['Age-appropriate', 'Mildly Delayed', 'Significantly Delayed', 'Absent'] },
          { id: 'psych_expressive', label: 'Expressive Language', type: 'select', options: ['Age-appropriate', 'Mildly Delayed', 'Significantly Delayed', 'Absent'] },
          { id: 'psych_wordCount', label: 'Functional Word Count', type: 'select', options: ['50+ words', '10–50 words', '< 10 words', 'Non-verbal'] },
          { id: 'psych_sentenceUse', label: 'Sentence Use', type: 'select', options: ['Full Sentences', 'Phrases (2–3 words)', 'Single Words', 'Non-verbal'] },
          { id: 'psych_articulation', label: 'Articulation', type: 'select', options: ['Clear', 'Mildly Impaired', 'Significantly Impaired', 'Unintelligible'] },
          { id: 'psych_speech_remarks', label: 'Speech Remarks', type: 'textarea' },
        ]
      },
      {
        id: 'psych_socialEmotional',
        title: 'Social / Emotional Development',
        fields: [
          { id: 'psych_eyeContact', label: 'Eye Contact', type: 'select', options: ['Good', 'Reduced', 'Poor', 'Absent'] },
          { id: 'psych_socialSmile', label: 'Social Smile', type: 'radio', options: ['Present', 'Absent'] },
          { id: 'psych_jointAttention', label: 'Joint Attention', type: 'radio', options: ['Present', 'Absent'] },
          { id: 'psych_peerPlay', label: 'Play with Peers', type: 'select', options: ['Participates actively', 'Parallel play only', 'Solitary play', 'Refuses to play'] },
          { id: 'psych_emotionReg', label: 'Emotional Regulation', type: 'select', options: ['Age-appropriate', 'Mild difficulties', 'Significant difficulties'] },
          { id: 'psych_asdSuspected', label: 'ASD Features Suspected?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'psych_adhdSuspected', label: 'ADHD Features Suspected?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'psych_social_remarks', label: 'Social/Emotional Remarks', type: 'textarea' },
        ]
      },
      {
        id: 'psych_impression',
        title: 'Psychologist\'s Final Impression & Recommendations',
        fields: [
          { id: 'psych_overallDx', label: 'Overall Developmental Diagnosis', type: 'textarea' },
          { id: 'psych_recommendations', label: 'Recommendations', type: 'textarea' },
          { id: 'psych_referrals', label: 'Referred To', type: 'checkbox', options: ['Speech Therapist', 'Physiotherapist', 'Special Educator', 'Occupational Therapist', 'Psychiatrist', 'Neurologist', 'Audiologist', 'Ophthalmologist'] },
          { id: 'psych_reviewDate', label: 'Review Date', type: 'date' },
          { id: 'psych_name', label: 'Psychologist Name & Signature', type: 'text' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 3: Physiotherapist Assessment (Pages 8–10)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'physiotherapy',
    page: '8–10',
    title: 'Physiotherapist Assessment',
    icon: 'Activity',
    color: 'orange',
    subsections: [
      {
        id: 'physio_milestone',
        title: 'Milestone History',
        fields: [
          { id: 'physio_neck', label: 'Neck Holding (months)', type: 'number' },
          { id: 'physio_roll', label: 'Rolling (months)', type: 'number' },
          { id: 'physio_sit', label: 'Sitting (months)', type: 'number' },
          { id: 'physio_stand', label: 'Standing (months)', type: 'number' },
          { id: 'physio_walk', label: 'Walking (months)', type: 'number' },
        ]
      },
      {
        id: 'physio_reflexes',
        title: 'Primitive Reflex Examination',
        fields: [
          { id: 'physio_moro', label: 'Moro Reflex', type: 'select', options: ['Normal', 'Exaggerated', 'Absent', 'Not Applicable'] },
          { id: 'physio_grasp_r', label: 'Palmar Grasp Reflex', type: 'select', options: ['Normal', 'Exaggerated', 'Absent', 'Not Applicable'] },
          { id: 'physio_tonic', label: 'Tonic Neck Reflex', type: 'select', options: ['Normal', 'Persistent', 'Absent', 'Not Applicable'] },
          { id: 'physio_parachute', label: 'Parachute Reflex', type: 'select', options: ['Present', 'Absent', 'Not Applicable'] },
          { id: 'physio_babinski', label: 'Babinski Sign', type: 'select', options: ['Plantar Flexion (Normal)', 'Dorsiflexion (Abnormal)', 'Not Applicable'] },
        ]
      },
      {
        id: 'physio_motor',
        title: 'Motor Evaluation',
        fields: [
          { id: 'physio_tone', label: 'Muscle Tone', type: 'select', options: ['Normal', 'Hypotonic (Floppy)', 'Hypertonic (Spastic)', 'Fluctuating', 'Dystonic'] },
          { id: 'physio_power_ul', label: 'Power – Upper Limb (MRC Grade)', type: 'select', options: ['5/5 Normal', '4/5 Reduced', '3/5 Against gravity', '2/5 Gravity eliminated', '1/5 Flicker', '0/5 No movement'] },
          { id: 'physio_power_ll', label: 'Power – Lower Limb (MRC Grade)', type: 'select', options: ['5/5 Normal', '4/5 Reduced', '3/5 Against gravity', '2/5 Gravity eliminated', '1/5 Flicker', '0/5 No movement'] },
          { id: 'physio_pattern', label: 'Motor Pattern', type: 'select', options: ['Hemiplegia', 'Diplegia', 'Quadriplegia', 'Monoplegia', 'Ataxia', 'Athetosis', 'Normal'] },
          { id: 'physio_coordination', label: 'Co-ordination', type: 'select', options: ['Normal', 'Mildly Impaired', 'Significantly Impaired'] },
        ]
      },
      {
        id: 'physio_rom',
        title: 'Range of Motion (ROM)',
        fields: [
          { id: 'physio_rom_shoulder', label: 'Shoulder ROM', type: 'select', options: ['Full', 'Restricted', 'N/A'] },
          { id: 'physio_rom_elbow', label: 'Elbow ROM', type: 'select', options: ['Full', 'Restricted', 'N/A'] },
          { id: 'physio_rom_hip', label: 'Hip ROM', type: 'select', options: ['Full', 'Restricted', 'N/A'] },
          { id: 'physio_rom_knee', label: 'Knee ROM', type: 'select', options: ['Full', 'Restricted', 'N/A'] },
          { id: 'physio_rom_ankle', label: 'Ankle/Foot ROM', type: 'select', options: ['Full', 'Restricted', 'N/A'] },
          { id: 'physio_contractures', label: 'Contractures / Deformities', type: 'textarea' },
        ]
      },
      {
        id: 'physio_gait',
        title: 'Gait Analysis',
        fields: [
          { id: 'physio_gaitType', label: 'Gait Pattern', type: 'select', options: ['Normal', 'Scissor Gait', 'Hemiplegic Gait', 'Steppage Gait', 'Trendelenburg Gait', 'Ataxic Gait', 'Non-ambulant'] },
          { id: 'physio_orthosis', label: 'Orthosis Required?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'physio_orthosisType', label: 'If Yes – Type of Orthosis', type: 'text' },
          { id: 'physio_assistiveDevice', label: 'Assistive Device Used?', type: 'checkbox', options: ['Walker', 'Crutches', 'Wheelchair', 'Standing Frame', 'None'] },
        ]
      },
      {
        id: 'physio_sensory',
        title: 'Sensory Evaluation',
        fields: [
          { id: 'physio_touch', label: 'Response to Touch', type: 'select', options: ['Normal', 'Hypersensitive', 'Hyposensitive', 'Absent'] },
          { id: 'physio_pain', label: 'Response to Pain', type: 'select', options: ['Normal', 'Reduced', 'Absent'] },
          { id: 'physio_proprioception', label: 'Proprioception', type: 'select', options: ['Intact', 'Impaired'] },
          { id: 'physio_vestibular', label: 'Vestibular Processing', type: 'select', options: ['Normal', 'Seeking', 'Avoiding'] },
        ]
      },
      {
        id: 'physio_impression',
        title: 'Physiotherapy Impression & Plan',
        fields: [
          { id: 'physio_dx', label: 'Physiotherapy Diagnosis', type: 'textarea' },
          { id: 'physio_goals', label: 'Short-term Goals (3 months)', type: 'textarea' },
          { id: 'physio_approach', label: 'Therapy Approach', type: 'checkbox', options: ['NDT', 'Bobath', 'Vojta', 'PNF', 'Sensory Integration', 'Hydrotherapy', 'Other'] },
          { id: 'physio_frequency', label: 'Session Frequency', type: 'select', options: ['Daily', '3x per week', '2x per week', 'Weekly', 'Monthly Review'] },
          { id: 'physio_name', label: 'Physiotherapist Name & Signature', type: 'text' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 4: Early Intervention & Remedial Therapy (Pages 11–12)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'early_intervention',
    page: '11–12',
    title: 'Early Intervention & Remedial Therapy',
    icon: 'Heart',
    color: 'pink',
    subsections: [
      {
        id: 'ei_domains',
        title: 'Domain-wise EI Evaluation',
        fields: [
          { id: 'ei_motor', label: 'Motor Development Level', type: 'select', options: ['Age-appropriate', 'Mildly delayed', 'Moderately delayed', 'Severely delayed'] },
          { id: 'ei_selfHelp', label: 'Self Help Skills', type: 'select', options: ['Age-appropriate', 'Mildly delayed', 'Moderately delayed', 'Severely delayed'] },
          { id: 'ei_language', label: 'Language Development Level', type: 'select', options: ['Age-appropriate', 'Mildly delayed', 'Moderately delayed', 'Severely delayed'] },
          { id: 'ei_cognition', label: 'Cognitive Level', type: 'select', options: ['Age-appropriate', 'Mildly delayed', 'Moderately delayed', 'Severely delayed'] },
          { id: 'ei_social', label: 'Socialization Level', type: 'select', options: ['Age-appropriate', 'Mildly delayed', 'Moderately delayed', 'Severely delayed'] },
        ]
      },
      {
        id: 'ei_plan',
        title: 'Remedial Therapy Plan',
        fields: [
          { id: 'ei_ltGoal', label: 'Long-term Goal', type: 'textarea' },
          { id: 'ei_stGoal', label: 'Short-term Objectives (3 months)', type: 'textarea' },
          { id: 'ei_duration', label: 'Therapy Duration (months)', type: 'number' },
          { id: 'ei_frequency', label: 'Session Frequency', type: 'select', options: ['Daily', '3x per week', '2x per week', 'Weekly', 'Monthly Review'] },
          { id: 'ei_materials', label: 'Materials / Tools Used', type: 'textarea' },
          { id: 'ei_parentTraining', label: 'Parent/Caregiver Training Provided?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'ei_homeProgram', label: 'Home Program Given?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'ei_evaluation', label: 'Evaluation Criteria', type: 'textarea' },
          { id: 'ei_name', label: 'Therapist Name & Signature', type: 'text' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 5: Special Educator Assessment (Pages 13–14)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'special_educator',
    page: '13–14',
    title: 'Special Educator Assessment',
    icon: 'BookOpen',
    color: 'blue',
    subsections: [
      {
        id: 'se_skills',
        title: 'Functional Skills Assessment',
        fields: [
          { id: 'se_selfHelp', label: 'Self-help Skills (Feeding, Dressing, Toileting)', type: 'select', options: ['Independent', 'Partially Independent', 'Needs Prompting', 'Dependent'] },
          { id: 'se_socialization', label: 'Socialization Skills', type: 'select', options: ['Age-appropriate', 'Mildly Impaired', 'Moderately Impaired', 'Severely Impaired'] },
          { id: 'se_concepts', label: 'Concept Formation (Colors, Shapes, Sizes)', type: 'select', options: ['Mastered', 'Partial', 'Emerging', 'Not Present'] },
          { id: 'se_reading', label: 'Reading Level', type: 'select', options: ['Grade Level', '1 Level Below', '2+ Levels Below', 'Pre-Reader', 'Non-Reader'] },
          { id: 'se_writing', label: 'Writing Level', type: 'select', options: ['Grade Level', '1 Level Below', '2+ Levels Below', 'Pre-Writer', 'Unable to Write'] },
          { id: 'se_math', label: 'Math / Number Concept', type: 'select', options: ['Grade Level', '1 Level Below', '2+ Levels Below', 'Basic Only', 'None'] },
          { id: 'se_vocational', label: 'Vocational / Pre-vocational Skills', type: 'select', options: ['Developing', 'Not yet applicable', 'Some skills present', 'N/A'] },
        ]
      },
      {
        id: 'se_behavior',
        title: 'Behavior Observation',
        fields: [
          { id: 'se_attention', label: 'Attention Span', type: 'select', options: ['Sustained', 'Short but redirectable', 'Very short / Distractible', 'Unable to attend'] },
          { id: 'se_hyperactivity', label: 'Hyperactivity', type: 'select', options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
          { id: 'se_impulsivity', label: 'Impulsivity', type: 'select', options: ['Absent', 'Mild', 'Moderate', 'Severe'] },
          { id: 'se_aggression', label: 'Aggression / Self-injury', type: 'select', options: ['Absent', 'Occasional', 'Frequent'] },
          { id: 'se_stereotypy', label: 'Stereotyped / Repetitive Behaviors', type: 'select', options: ['Absent', 'Present – Mild', 'Present – Significant'] },
          { id: 'se_behavior_remarks', label: 'Behavior Remarks', type: 'textarea' },
        ]
      },
      {
        id: 'se_recommendations',
        title: 'Special Educator\'s Evaluation & Recommendations',
        fields: [
          { id: 'se_program', label: 'Educational Program Recommended', type: 'select', options: ['Inclusive Education', 'Resource Room Support', 'Special School', 'Home-based Program', 'Vocational Training'] },
          { id: 'se_iep', label: 'IEP (Individualized Education Plan) Prepared?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'se_recommendations', label: 'Recommendations & Notes', type: 'textarea' },
          { id: 'se_name', label: 'Special Educator Name & Signature', type: 'text' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 6: Ophthalmology – ROP & Vision Screening (Pages 15–17)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'ophthalmology',
    page: '15–17',
    title: 'Ophthalmology – Vision & ROP Screening',
    icon: 'Eye',
    color: 'cyan',
    subsections: [
      {
        id: 'rop_screening',
        title: 'ROP Screening (Retinopathy of Prematurity)',
        fields: [
          { id: 'rop_applicable', label: 'ROP Screening Applicable?', type: 'radio', options: ['Yes (Preterm < 34 weeks)', 'No'] },
          { id: 'rop_visit1', label: 'Visit 1 Date', type: 'date' },
          { id: 'rop_visit1_finding', label: 'Visit 1 Finding', type: 'text' },
          { id: 'rop_visit2', label: 'Visit 2 Date', type: 'date' },
          { id: 'rop_visit2_finding', label: 'Visit 2 Finding', type: 'text' },
          { id: 'rop_stage', label: 'ROP Stage (if found)', type: 'select', options: ['No ROP', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'APROP'] },
          { id: 'rop_treatment', label: 'Treatment Given?', type: 'radio', options: ['Yes', 'No', 'N/A'] },
          { id: 'rop_treatmentType', label: 'Treatment Type', type: 'text' },
        ]
      },
      {
        id: 'vision_screening',
        title: 'Vision Screening Protocol',
        fields: [
          { id: 'vision_va_re', label: 'Visual Acuity – Right Eye', type: 'text', placeholder: '6/6, 6/9, etc.' },
          { id: 'vision_va_le', label: 'Visual Acuity – Left Eye', type: 'text', placeholder: '6/6, 6/9, etc.' },
          { id: 'vision_iop_re', label: 'Intraocular Pressure RE (mmHg)', type: 'number' },
          { id: 'vision_iop_le', label: 'Intraocular Pressure LE (mmHg)', type: 'number' },
          { id: 'vision_retinoscopy', label: 'Retinoscopy Findings', type: 'textarea', placeholder: 'RE: plano, LE: -2.00D etc.' },
          { id: 'vision_strabismus', label: 'Strabismus / Squint?', type: 'radio', options: ['Absent', 'Esotropia', 'Exotropia', 'Hypertropia'] },
          { id: 'vision_nystagmus', label: 'Nystagmus?', type: 'radio', options: ['Absent', 'Present'] },
          { id: 'vision_fundus', label: 'Fundus Examination', type: 'textarea' },
          { id: 'vision_glasses', label: 'Glasses Prescribed?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'vision_glassesPower', label: 'If Yes – Power', type: 'text' },
          { id: 'vision_conclusion', label: 'Ophthalmic Conclusion', type: 'textarea' },
          { id: 'vision_name', label: 'Ophthalmologist Name & Signature', type: 'text' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 7: Audiology (Pages 18–19)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'audiology',
    page: '18–19',
    title: 'Audiology – Auditory Assessment',
    icon: 'Ear',
    color: 'amber',
    subsections: [
      {
        id: 'audio_behavioral',
        title: 'Behavioral Hearing Assessment',
        fields: [
          { id: 'audio_bor', label: 'BOA (Behavioral Observation Audiometry)', type: 'select', options: ['Pass', 'Refer', 'Not Done', 'N/A'] },
          { id: 'audio_vra', label: 'VRA (Visual Reinforcement Audiometry)', type: 'select', options: ['Pass', 'Refer', 'Not Done', 'N/A'] },
          { id: 'audio_play', label: 'Play Audiometry', type: 'select', options: ['Pass', 'Refer', 'Not Done', 'N/A'] },
          { id: 'audio_pta', label: 'PTA (Pure Tone Audiometry)', type: 'select', options: ['Normal', 'Mild HL (26-40 dB)', 'Moderate HL (41-55 dB)', 'Moderately Severe (56-70 dB)', 'Severe (71-90 dB)', 'Profound (>90 dB)', 'Not Done'] },
        ]
      },
      {
        id: 'audio_objective',
        title: 'Objective Hearing Tests',
        fields: [
          { id: 'audio_oae_re', label: 'OAE – Right Ear', type: 'select', options: ['Pass', 'Refer', 'Not Done'] },
          { id: 'audio_oae_le', label: 'OAE – Left Ear', type: 'select', options: ['Pass', 'Refer', 'Not Done'] },
          { id: 'audio_bera_re', label: 'BERA – Right Ear Threshold (dBnHL)', type: 'text' },
          { id: 'audio_bera_le', label: 'BERA – Left Ear Threshold (dBnHL)', type: 'text' },
          { id: 'audio_assr_re', label: 'ASSR – Right Ear Result', type: 'text' },
          { id: 'audio_assr_le', label: 'ASSR – Left Ear Result', type: 'text' },
          { id: 'audio_tympanometry', label: 'Tympanometry Result', type: 'select', options: ['Type A (Normal)', 'Type B (Flat – OME)', 'Type C (Neg. pressure)', 'Not Done'] },
        ]
      },
      {
        id: 'audio_tuningFork',
        title: 'Tuning Fork Tests (if applicable)',
        fields: [
          { id: 'audio_rinne_re', label: 'Rinne Test – Right Ear', type: 'select', options: ['Positive (SNHL / Normal)', 'Negative (CHL)', 'Not Applicable'] },
          { id: 'audio_rinne_le', label: 'Rinne Test – Left Ear', type: 'select', options: ['Positive (SNHL / Normal)', 'Negative (CHL)', 'Not Applicable'] },
          { id: 'audio_weber', label: 'Weber Test', type: 'select', options: ['Midline (Normal / Bilateral)', 'Lateralized Right', 'Lateralized Left', 'Not Applicable'] },
        ]
      },
      {
        id: 'audio_impression',
        title: 'Audiological Impression & Plan',
        fields: [
          { id: 'audio_type', label: 'Type of Hearing Loss', type: 'select', options: ['Normal', 'Conductive', 'Sensorineural', 'Mixed', 'Auditory Neuropathy Spectrum Disorder (ANSD)'] },
          { id: 'audio_degree', label: 'Degree of Hearing Loss', type: 'select', options: ['Normal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe', 'Profound'] },
          { id: 'audio_ha', label: 'Hearing Aid Required?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'audio_haType', label: 'Hearing Aid Type', type: 'select', options: ['BTE', 'ITE', 'CIC', 'BAHA', 'Cochlear Implant Candidate', 'N/A'] },
          { id: 'audio_ciCandidate', label: 'Cochlear Implant Candidate?', type: 'radio', options: ['Yes', 'No', 'Under evaluation'] },
          { id: 'audio_impression', label: 'Audiologist\'s Impression', type: 'textarea' },
          { id: 'audio_name', label: 'Audiologist Name & Signature', type: 'text' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 8: Speech Therapy (Pages 20–22)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'speech_therapy',
    page: '20–22',
    title: 'Speech Therapy – Evaluation & Plan',
    icon: 'MessageCircle',
    color: 'green',
    subsections: [
      {
        id: 'st_pretherapy',
        title: 'Pre-therapy Evaluation',
        fields: [
          { id: 'st_audioResult', label: 'Audiological Result Summary', type: 'text' },
          { id: 'st_oralMotor', label: 'Oral Motor Function', type: 'select', options: ['Normal', 'Hypotonic', 'Hypertonic', 'Dysfunctional', 'Dysarthric'] },
          { id: 'st_feeding', label: 'Feeding / Swallowing Issues?', type: 'radio', options: ['Yes', 'No'] },
          { id: 'st_feedingDetails', label: 'If Yes – Details', type: 'textarea' },
          { id: 'st_receptiveLang', label: 'Receptive Language Level', type: 'text', placeholder: 'e.g. 18-month level' },
          { id: 'st_expressiveLang', label: 'Expressive Language Level', type: 'text', placeholder: 'e.g. 12-month level' },
          { id: 'st_fluency', label: 'Fluency (Stammering/Stuttering)', type: 'radio', options: ['Normal', 'Mild Stutter', 'Moderate Stutter', 'Severe Stutter', 'N/A'] },
          { id: 'st_voice', label: 'Voice Quality', type: 'select', options: ['Normal', 'Hoarse', 'Hypernasality', 'Hyponasality', 'Aphonia'] },
          { id: 'st_provisionalDx', label: 'Provisional Speech Diagnosis', type: 'textarea' },
        ]
      },
      {
        id: 'st_plan',
        title: 'Speech Therapy Plan',
        fields: [
          { id: 'st_ltGoal', label: 'Long-term Goal', type: 'textarea' },
          { id: 'st_stGoal', label: 'Short-term Goal (1–3 months)', type: 'textarea' },
          { id: 'st_approach', label: 'Therapy Approach', type: 'checkbox', options: ['PECS', 'AAC', 'Verbal Behavior', 'Social Stories', 'Oral Motor Exercises', 'Articulation Therapy', 'Fluency Shaping', 'Voice Therapy', 'Parent-mediated'] },
          { id: 'st_frequency', label: 'Session Frequency', type: 'select', options: ['Daily', '3x per week', '2x per week', 'Weekly'] },
          { id: 'st_duration', label: 'Therapy Duration (months)', type: 'number' },
          { id: 'st_materials', label: 'Materials Used', type: 'textarea' },
          { id: 'st_opinion', label: 'Therapist Opinion / Prognosis', type: 'textarea' },
        ]
      },
      {
        id: 'st_progress',
        title: 'Therapy Progress Report',
        fields: [
          { id: 'st_preStatus', label: 'Pre-therapy Status (Baseline)', type: 'textarea' },
          { id: 'st_postStatus', label: 'Post-therapy Status (After review)', type: 'textarea' },
          { id: 'st_goalAchieved', label: 'Goal Achievement (%)', type: 'number', placeholder: '0–100' },
          { id: 'st_remarks', label: 'Progress Remarks', type: 'textarea' },
          { id: 'st_name', label: 'Speech Therapist Name & Signature', type: 'text' },
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────────
  // SECTION 9: Integrated Summary (Page 23)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'integrated_summary',
    page: '23',
    title: 'Integrated Summary of DEIC Evaluation',
    icon: 'FileText',
    color: 'slate',
    subsections: [
      {
        id: 'summary_diagnosis',
        title: 'Overall Diagnosis',
        fields: [
          { id: 'sum_primaryDx', label: 'Primary Diagnosis (ICD-10 / DSM-5)', type: 'text' },
          { id: 'sum_secondaryDx', label: 'Secondary Diagnoses', type: 'textarea' },
          { id: 'sum_disability', label: 'Type of Disability (RPwD 2016)', type: 'checkbox', options: ['Intellectual Disability', 'Autism Spectrum Disorder', 'Cerebral Palsy', 'Specific Learning Disability', 'Speech & Language Disability', 'Hearing Impairment', 'Visual Impairment', 'Multiple Disabilities'] },
          { id: 'sum_disabilityPct', label: 'Disability Certificate Issued?', type: 'radio', options: ['Yes – specify %', 'No', 'Under process'] },
          { id: 'sum_disabilityPctValue', label: 'Disability % (if issued)', type: 'number' },
        ]
      },
      {
        id: 'summary_evaluation',
        title: 'Multi-disciplinary Evaluation Summary',
        fields: [
          { id: 'sum_psychSummary', label: 'Psychology Evaluation Summary', type: 'textarea' },
          { id: 'sum_physioSummary', label: 'Physiotherapy Summary', type: 'textarea' },
          { id: 'sum_speechSummary', label: 'Speech & Hearing Summary', type: 'textarea' },
          { id: 'sum_visionSummary', label: 'Optometry / Ophthalmology Summary', type: 'textarea' },
          { id: 'sum_specialEdSummary', label: 'Special Education Summary', type: 'textarea' },
          { id: 'sum_eiSummary', label: 'Early Intervention Summary', type: 'textarea' },
        ]
      },
      {
        id: 'summary_plan',
        title: 'Consolidated Action Plan',
        fields: [
          { id: 'sum_therapyPlan', label: 'Overall Therapy Plan', type: 'textarea' },
          { id: 'sum_assistiveTech', label: 'Assistive Technology Provided', type: 'checkbox', options: ['Hearing Aid', 'Spectacles', 'Wheelchair', 'Crutches/Walker', 'AAC Device', 'Braille Materials', 'None'] },
          { id: 'sum_welfare', label: 'Welfare / Scheme Benefits Linked', type: 'checkbox', options: ['UDID Card', 'ADIP Scheme', 'Scholarship', 'Transport Allowance', 'NHFDC Loan', 'None'] },
          { id: 'sum_nextReview', label: 'Next DEIC Review Date', type: 'date' },
          { id: 'sum_outcome', label: 'Current Case Outcome', type: 'select', options: ['Active – Ongoing Therapy', 'Discharged – Goals Met', 'Referred Tertiary', 'Lost to Follow-up', 'Deceased'] },
          { id: 'sum_remarks', label: 'Additional Remarks', type: 'textarea' },
          { id: 'sum_moName', label: 'MO / Team Lead Name & Signature', type: 'text' },
        ]
      }
    ]
  }
];

export const SECTION_COLORS = {
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800', badge: 'bg-teal-600', light: 'bg-teal-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge: 'bg-purple-600', light: 'bg-purple-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-600', light: 'bg-orange-100' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', badge: 'bg-pink-600', light: 'bg-pink-100' },
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-600', light: 'bg-blue-100' },
  cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800', badge: 'bg-cyan-600', light: 'bg-cyan-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-600', light: 'bg-amber-100' },
  green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', badge: 'bg-green-600', light: 'bg-green-100' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800', badge: 'bg-slate-700', light: 'bg-slate-100' },
};
