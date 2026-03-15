export const SCREENING_PROTOCOLS = [
  // =================================================================================
  // INFANT PROTOCOLS (0 - 15 Months)
  // =================================================================================

  // --- AGE GROUP: 2 months - 4 months ---
  {
    id: 'D_2_4',
    title: 'Developmental Milestones (2-4 Months)',
    ageRange: [2, 4],
    questions: [
      { id: 'D1.1', text: 'Does the child move both arms and both legs freely & equally when awake or when excited?', type: 'GM', flagIf: 'No' },
      { id: 'D1.2', text: 'Does the child raise his or her head momentarily when lying face down?', type: 'GM', flagIf: 'No' },
      { id: 'D1.3', text: 'Does the child keep his hands open and relaxed most of the time? (By 3 months)', type: 'FM', flagIf: 'No' },
      { id: 'D1.4', text: 'Does the child respond to your voice or startle with loud sounds or become alert to new sounds?', type: 'H', flagIf: 'No' },
      { id: 'D1.5', text: 'Does the child coo or vocalize other than crying? (e.g. "ooh", "ng")', type: 'S', flagIf: 'No' },
      { id: 'D1.6', text: 'Does the child make eye contact with the caregiver?', type: 'V', flagIf: 'No' },
      { id: 'D1.7', text: 'Does the child give a social smile (smiles back)?', type: 'S', flagIf: 'No' },
      { id: 'D1.8', text: 'Does the child suck and swallow well during feeding without choking?', type: 'Sp', flagIf: 'No' }
    ]
  },

  // --- AGE GROUP: 4 months - 6 months ---
  {
    id: 'D_4_6',
    title: 'Developmental Milestones (4-6 Months)',
    ageRange: [4, 6],
    questions: [
      { id: 'D2.1', text: 'Does the child hold head erect in sitting position without bobbing?', type: 'GM', flagIf: 'No' },
      { id: 'D2.2', text: 'Does the child reach out for an object persistently using either hand?', type: 'FM', flagIf: 'No' },
      { id: 'D2.3', text: 'Does the child respond to mother’s speech by looking at her face?', type: 'H', flagIf: 'No' },
      { id: 'D2.4', text: 'Does the child laugh aloud or make squealing sounds?', type: 'Sp', flagIf: 'No' },
      { id: 'D2.5', text: 'Does the child follow an object with eyes without visible squint?', type: 'V', flagIf: 'No' },
      { id: 'D2.6', text: 'Does the child suck on hands?', type: 'V', flagIf: 'No' }
    ]
  },

  // --- AGE GROUP: 6 months - 9 months ---
  {
    id: 'D_6_9',
    title: 'Developmental Milestones (6-9 Months)',
    ageRange: [6, 9],
    questions: [
      { id: 'D3.1', text: 'Does the child roll over in either direction?', type: 'GM', flagIf: 'No' },
      { id: 'D3.2', text: 'Does the child grasp a small object using the whole hand?', type: 'FM', flagIf: 'No' },
      { id: 'D3.3', text: 'Does the child locate the source of sound?', type: 'H', flagIf: 'No' },
      { id: 'D3.4', text: 'Does the child utter consonant sounds like "p", "b", "m"?', type: 'Sp', flagIf: 'No' },
      { id: 'D3.5', text: 'Does the child watch toys or TV without tilting head?', type: 'V', flagIf: 'No' },
      { id: 'D3.6', text: 'Does the child raise hands to be picked up?', type: 'S', flagIf: 'No' },
      { id: 'D3.7', text: 'Does the child look for a dropped spoon or toy?', type: 'C+V', flagIf: 'No' }
    ]
  },

  // --- AGE GROUP: 9 months - 12 months ---
  {
    id: 'D_9_12',
    title: 'Developmental Milestones (9-12 Months)',
    ageRange: [9, 12],
    questions: [
      { id: 'D4.1', text: 'Does the child sit without any support?', type: 'GM', flagIf: 'No' },
      { id: 'D4.2', text: 'Does the child transfer object from one hand to the other?', type: 'FM', flagIf: 'No' },
      { id: 'D4.3', text: 'Does the child respond to his or her name?', type: 'H', flagIf: 'No' },
      { id: 'D4.4', text: 'Does the child babble like "ba", "da", "ma"?', type: 'Sp', flagIf: 'No' },
      { id: 'D4.5', text: 'Does the child avoid bumping into objects while moving?', type: 'V', flagIf: 'No' },
      { id: 'D4.6', text: 'Does the child enjoy playing peek-a-boo?', type: 'S', flagIf: 'No' }
    ]
  },

  // --- AGE GROUP: 12 months - 15 months ---
  {
    id: 'D_12_15',
    title: 'Developmental Milestones (12-15 Months)',
    ageRange: [12, 15],
    questions: [
      { id: 'D5.1', text: 'Does the child crawl on hands and knees?', type: 'GM', flagIf: 'No' },
      { id: 'D5.2', text: 'Does the child pick up small objects using thumb and index finger?', type: 'FM', flagIf: 'No' },
      { id: 'D5.3', text: 'Does the child stop activity in response to "No"?', type: 'H&C', flagIf: 'No' },
      { id: 'D5.4', text: 'Does the child say one meaningful word like mama or dada?', type: 'Sp', flagIf: 'No' },
      { id: 'D5.5', text: 'Does the child imitate actions like bye-bye or clapping?', type: 'S', flagIf: 'No' },
      { id: 'D5.6', text: 'Does the child cry when a stranger picks him/her up?', type: 'S&C', flagIf: 'No' },
      { id: 'D5.7', text: 'Does the child search for completely hidden objects?', type: 'C', flagIf: 'No' }
    ]
  },

  // =================================================================================
  // TODDLER PROTOCOLS & AUTISM SCREENING (15 - 30 Months)
  // =================================================================================

  {
    id: 'D_15_18',
    title: 'Developmental Milestones (15-18 Months)',
    ageRange: [15, 18],
    questions: [
      { id: 'D6.1', text: 'Does the child walk alone?', type: 'GM', flagIf: 'No' },
      { id: 'D6.2', text: 'Does the child put small objects into a container?', type: 'FM', flagIf: 'No' },
      { id: 'D6.3', text: 'Does the child point to objects on request?', type: 'FM', flagIf: 'No' },
      { id: 'D6.4', text: 'Does the child follow simple one-step commands?', type: 'H&C', flagIf: 'No' },
      { id: 'D6.5', text: 'Does the child say at least two words other than mama/dada?', type: 'Sp', flagIf: 'No' },
      { id: 'D6.6', text: 'Does the child explore toys by poking or pulling?', type: 'C', flagIf: 'No' }
    ]
  },

  {
    id: 'ASD_15_18',
    title: 'Autism Screening (15-18 Months)',
    ageRange: [15, 18],
    questions: [
      { id: 'D10.1.1', text: 'Does the child maintain eye contact?', type: 'ASD', flagIf: 'No' },
      { id: 'D10.1.2', text: 'Does the child point using index finger to ask for something?', type: 'ASD', flagIf: 'No' },
      { id: 'D10.1.3', text: 'Have you felt that your child does not respond to name or gestures?', type: 'ASD', flagIf: 'Yes' }
    ]
  },

  {
    id: 'D_18_24',
    title: 'Developmental Milestones (18-24 Months)',
    ageRange: [18, 24],
    questions: [
      { id: 'D7.1', text: 'Does the child walk steadily while pulling a toy?', type: 'GM', flagIf: 'No' },
      { id: 'D7.2', text: 'Does the child scribble spontaneously?', type: 'FM', flagIf: 'No' },
      { id: 'D7.3', text: 'Does the child say at least five words?', type: 'Sp', flagIf: 'No' },
      { id: 'D7.4', text: 'Does the child imitate household tasks?', type: 'C', flagIf: 'No' },
      { id: 'D7.5', text: 'Does the child point to two or more body parts?', type: 'H&C', flagIf: 'No' }
    ]
  },

  {
    id: 'ASD_18_24',
    title: 'Autism Screening (18-24 Months)',
    ageRange: [18, 24],
    questions: [
      { id: 'D10.2.1', text: 'Does the child show interest in other children?', type: 'ASD', flagIf: 'No' },
      { id: 'D10.2.2', text: 'Does the child show repetitive movements like hand flapping?', type: 'ASD', flagIf: 'Yes' },
      { id: 'D10.2.3', text: 'Does the child engage in pretend play?', type: 'ASD', flagIf: 'No' }
    ]
  },

  {
    id: 'D_24_30',
    title: 'Developmental Milestones (24-30 Months)',
    ageRange: [24, 30],
    questions: [
      { id: 'D8.1', text: 'Does the child climb upstairs and downstairs?', type: 'GM', flagIf: 'No' },
      { id: 'D8.2', text: 'Does the child feed self using hand or spoon?', type: 'FM', flagIf: 'No' },
      { id: 'D8.3', text: 'Does the child combine two words into phrases?', type: 'Sp', flagIf: 'No' },
      { id: 'D8.4', text: 'Does the child play along with other children?', type: 'S', flagIf: 'No' },
      { id: 'D8.5', text: 'Does the child enjoy simple pretend play?', type: 'C', flagIf: 'No' },
      { id: 'D9.1', text: 'Any neuro-motor abnormality?', type: 'NM', flagIf: 'Yes' }
    ]
  },

  // =================================================================================
  // PRESCHOOL PROTOCOLS (2.5 - 6 Years)
  // =================================================================================

  {
    id: 'D_30_72',
    title: 'Developmental Milestones (2.5 - 6 Years)',
    ageRange: [30, 72],
    questions: [
      { id: 'D11.1', text: 'Does the child have difficulty seeing during day or night?', type: 'V', flagIf: 'Yes' },
      { id: 'D11.2', text: 'Did the child have delay in walking compared to peers?', type: 'GM', flagIf: 'Yes' },
      { id: 'D11.3', text: 'Does the child have stiffness, floppiness, or reduced limb strength?', type: 'GM', flagIf: 'Yes' }
    ]
  }
];
