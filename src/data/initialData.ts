/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BreathingExercise, PatientRecord, Appointment, EducationalArticle } from '../types';

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: 'diaphragmatic',
    title: 'Gentle Diaphragmatic Breathing',
    category: 'Respiratory Mechanics',
    subtitle: 'Abdominal breathing to optimize lung ventilation and reduce accessory muscle tension',
    description: 'Focuses on engaging the primary breathing muscle—the diaphragm—while relaxing tense neck, shoulder, and upper-chest muscles. Helps encourage lower ribcage expansion without straining.',
    physiologicalRationale: 'Decreases oxygen cost of breathing, promotes alveolar recruitment in lower lung zones, and down-regulates hyperactive sympathetic tone during recovery periods.',
    techniqueSteps: [
      'Sit comfortably supported or lie down with knees softly bent.',
      'Place one hand gently on your upper chest and the other on your upper abdomen just below your ribs.',
      'Breathe in smoothly through your nose for 3 to 4 seconds, feeling your stomach push your hand outwards while keeping your chest quiet.',
      'Breathe out gently and unforced through your mouth or nose, letting your abdominal wall fall naturally.',
      'Repeat smoothly without forcing deep inhalations or straining.'
    ],
    indications: [
      'Chronic asthma maintenance and baseline relaxation.',
      'Accessory muscle over-activity (neck/shoulder elevation during breathing).',
      'Hyperventilation syndrome and shallow rapid apical breathing patterns.'
    ],
    precautions: [
      'Do not force deep diaphragmatic excursion if feeling light-headed or dizzy.',
      'Stop immediately if experiencing active bronchospasm or chest pain.',
      'Keep inhalations natural—avoid gasping or excessive tidal volumes.'
    ],
    defaultInhaleSec: 3,
    defaultHoldSec: 0,
    defaultExhaleSec: 4,
    defaultDurationMin: 5,
    clinicianApproved: true,
    badge: 'Clinician Recommended'
  },
  {
    id: 'pursed_lip',
    title: 'Pursed-Lip Breathing',
    category: 'Expiratory Flow Control',
    subtitle: 'Creates positive expiratory airway pressure to prevent early airway collapse',
    description: 'A gentle expiratory pacing technique where exhalation occurs through softly puckered lips, creating gentle back-pressure along the bronchial tree to maintain airway patency.',
    physiologicalRationale: 'Generates mild positive end-expiratory back-pressure (PEEP effect) preventing dynamic small airway collapse, reduces trapped gas volume, and slows respiratory rate.',
    techniqueSteps: [
      'Relax your neck, neck muscles, and drop your shoulders away from your ears.',
      'Breathe in gently and naturally through your nose for approximately 2 to 3 seconds.',
      'Pucker your lips softly, as if you were preparing to gently flicker a candle flame without blowing it out.',
      'Exhale slowly, passively, and evenly through your pursed lips for 4 to 6 seconds (aiming for twice as long as the inhale).',
      'Never force air out or empty your lungs completely.'
    ],
    indications: [
      'During or following mild post-exercise shortness of breath.',
      'Dyspnea upon physical exertion (stair climbing, walking uphill).',
      'Feelings of air trapping or difficulty emptying the lungs smoothly.'
    ],
    precautions: [
      'Do not blow forcibly; exhalation must remain completely passive.',
      'If breathlessness rapidly worsens, discontinue and follow your prescribed Asthma Action Plan with reliever medication.',
      'Avoid hyperventilating or rushing subsequent inhalations.'
    ],
    defaultInhaleSec: 3,
    defaultHoldSec: 0,
    defaultExhaleSec: 6,
    defaultDurationMin: 5,
    clinicianApproved: true,
    badge: 'Exertion Recovery'
  },
  {
    id: 'relaxed',
    title: 'Relaxed Paced Breathing',
    category: 'Autonomic Regulation',
    subtitle: 'Balanced rhythmic breathing to soothe breathing pattern disorders and anxiety',
    description: 'A rhythmic, equalized gentle breathing cycle designed to settle anxiety-induced hyperventilation, restore normal carbon dioxide balance, and reduce physiological distress.',
    physiologicalRationale: 'Stimulates vagal parasympathetic pathways, dampens respiratory drive hypersensitivity, and helps recalibrate central chemoreceptor sensitivity to arterial pCO2.',
    techniqueSteps: [
      'Rest comfortably with your back supported and hands resting open in your lap.',
      'Gently soften your jaw, tongue, and eyelids.',
      'Inhale softly through your nose for 4 seconds, counting silently.',
      'Pause comfortably for 1 second without gripping or closing your glottis.',
      'Release the breath smoothly and easily for 4 to 5 seconds.',
      'Allow a momentary natural pause before your next gentle inhale.'
    ],
    indications: [
      'Anxiety or panic accompanied by rapid breathing or sighing dyspnea.',
      'Bedtime wind-down and stress-triggered respiratory tightness.',
      'Restoration of regular breathing rhythm after mild respiratory distress settles.'
    ],
    precautions: [
      'Do not engage in prolonged breath-holding if pregnant or hypertensive.',
      'Ensure breathing remains quiet and effortless; no noisy gasping.',
      'Discontinue if feeling tingling in fingers or light-headedness.'
    ],
    defaultInhaleSec: 4,
    defaultHoldSec: 1,
    defaultExhaleSec: 5,
    defaultDurationMin: 5,
    clinicianApproved: true,
    badge: 'Calming Paced'
  },
  {
    id: 'clinician_custom',
    title: 'Clinician-Assigned Breathing Practice',
    category: 'Prescribed Physiotherapy',
    subtitle: 'Individually tailored pacing targets set by your respiratory physiotherapist',
    description: 'A customized regimen calibrated specifically to your cardiopulmonary assessment, baseline respiratory rate, and therapeutic rehabilitation milestones.',
    physiologicalRationale: 'Personalized to target specific individual rehabilitation goals (such as correcting Thoracic-Dominant breathing or pacing during exertion recovery).',
    techniqueSteps: [
      'Adopt the specific posture demonstrated during your tele-rehab consultation.',
      'Follow the personalized visual circle calibrated to your prescribed ratio.',
      'Focus attention on lower lateral costal expansion as instructed by your physiotherapist.',
      'Complete the prescribed number of cycles without pushing beyond comfort.',
      'Record your pre- and post-session Borg breathlessness ratings.'
    ],
    indications: [
      'Referred pulmonary physiotherapy patients under active clinical care.',
      'Tailored rehabilitation following recent flare-up stabilization.',
      'Specific breathing pattern disorder recalibration.'
    ],
    precautions: [
      'Follow only the parameters set by your licensed treating physiotherapist.',
      'Never attempt to force extreme breath holds or rapid frequencies.',
      'Contact your physiotherapist if the prescribed cadence feels uncomfortable.'
    ],
    defaultInhaleSec: 3,
    defaultHoldSec: 1,
    defaultExhaleSec: 5,
    defaultDurationMin: 5,
    clinicianApproved: true,
    badge: 'Prescribed Plan'
  }
];

export const INITIAL_PATIENT: PatientRecord = {
  id: 'pat-101',
  name: 'Alex Johnson',
  age: 38,
  gender: 'Non-binary',
  diagnosis: 'Moderate Persistent Asthma with Seasonal Flare-ups',
  asthmaSeverity: 'Moderate Persistent',
  maintenanceInhaler: 'Budesonide/Formoterol 160/4.5mcg (1 puff twice daily)',
  relieverInhaler: 'Salbutamol 100mcg (1-2 puffs as required for symptoms)',
  consentSigned: true,
  consentDate: '2026-09-15',
  physioId: 'phys-201',
  physioName: 'Dr. Sarah Jenkins, PT, MSc Cardiopulmonary',
  lastVisitDate: '2026-10-18',
  nextAppointmentDate: '2026-11-04',
  adherenceRate: 85,
  prescriptions: [
    {
      id: 'rx-01',
      patientId: 'pat-101',
      exerciseId: 'diaphragmatic',
      title: 'Gentle Diaphragmatic Breathing',
      frequencyPerDay: 2,
      durationMinutes: 5,
      cadence: { inhale: 3, hold: 0, exhale: 4 },
      assignedBy: 'Dr. Sarah Jenkins, PT',
      assignedDate: '2026-10-18',
      specialInstructions: 'Practice once in the morning seated upright and once before bedtime in semi-reclined posture. Focus on relaxing upper trapezius.',
      active: true,
      auditTrail: [
        {
          id: 'aud-1',
          date: '2026-10-18 10:30',
          changedBy: 'Dr. Sarah Jenkins, PT',
          reason: 'Initial Tele-Rehab Assessment',
          details: 'Prescribed Gentle Diaphragmatic 3s:4s ratio, 5 min twice daily to reduce cervical accessory muscle reliance.'
        }
      ]
    },
    {
      id: 'rx-02',
      patientId: 'pat-101',
      exerciseId: 'pursed_lip',
      title: 'Pursed-Lip Breathing',
      frequencyPerDay: 1,
      durationMinutes: 5,
      cadence: { inhale: 3, hold: 0, exhale: 6 },
      assignedBy: 'Dr. Sarah Jenkins, PT',
      assignedDate: '2026-10-18',
      specialInstructions: 'Use primarily after moderate aerobic walking or when mild expiratory limitation is noticed.',
      active: true,
      auditTrail: [
        {
          id: 'aud-2',
          date: '2026-10-18 10:35',
          changedBy: 'Dr. Sarah Jenkins, PT',
          reason: 'Initial Tele-Rehab Assessment',
          details: 'Set 3s inhale to 6s exhale pursed-lip breathing for exertion recovery.'
        }
      ]
    }
  ],
  sessions: [
    {
      id: 'ses-01',
      patientId: 'pat-101',
      exerciseId: 'diaphragmatic',
      exerciseTitle: 'Gentle Diaphragmatic Breathing',
      startedAt: '2026-10-22T08:15:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 3,
      postBorgDyspnea: 1,
      stoppedEarly: false,
      notes: 'Shoulders felt much more relaxed after 3 minutes.'
    },
    {
      id: 'ses-02',
      patientId: 'pat-101',
      exerciseId: 'diaphragmatic',
      exerciseTitle: 'Gentle Diaphragmatic Breathing',
      startedAt: '2026-10-23T20:30:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 2,
      postBorgDyspnea: 1,
      stoppedEarly: false,
      notes: 'Practiced before sleep. Calm cadence.'
    },
    {
      id: 'ses-03',
      patientId: 'pat-101',
      exerciseId: 'pursed_lip',
      exerciseTitle: 'Pursed-Lip Breathing',
      startedAt: '2026-10-24T17:45:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 4,
      postBorgDyspnea: 2,
      stoppedEarly: false,
      notes: 'Used after brisk walking back from the train station.'
    },
    {
      id: 'ses-04',
      patientId: 'pat-101',
      exerciseId: 'diaphragmatic',
      exerciseTitle: 'Gentle Diaphragmatic Breathing',
      startedAt: '2026-10-25T08:00:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 2,
      postBorgDyspnea: 1,
      stoppedEarly: false,
      notes: 'Morning routine maintained.'
    },
    {
      id: 'ses-05',
      patientId: 'pat-101',
      exerciseId: 'relaxed',
      exerciseTitle: 'Relaxed Paced Breathing',
      startedAt: '2026-10-26T14:10:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 3,
      postBorgDyspnea: 1,
      stoppedEarly: false,
      notes: 'Break between work calls.'
    },
    {
      id: 'ses-06',
      patientId: 'pat-101',
      exerciseId: 'diaphragmatic',
      exerciseTitle: 'Gentle Diaphragmatic Breathing',
      startedAt: '2026-10-27T08:20:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 2,
      postBorgDyspnea: 0,
      stoppedEarly: false,
      notes: 'Very smooth abdominal excursion.'
    },
    {
      id: 'ses-07',
      patientId: 'pat-101',
      exerciseId: 'pursed_lip',
      exerciseTitle: 'Pursed-Lip Breathing',
      startedAt: '2026-10-28T19:00:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 3,
      postBorgDyspnea: 1,
      stoppedEarly: false,
      notes: 'Good pacing, no neck tension.'
    }
  ],
  symptoms: [
    {
      id: 'sym-01',
      patientId: 'pat-101',
      date: '2026-10-22',
      time: '20:00',
      dyspneaRating: 2,
      coughSeverity: 'Mild',
      wheezeSeverity: 'None',
      chestTightness: 'Mild',
      exerciseTolerance: 'Normal',
      triggers: ['Cold morning air'],
      relieverPuffs: 0,
      notes: 'Mild tickle in morning, settled after warm tea.'
    },
    {
      id: 'sym-02',
      patientId: 'pat-101',
      date: '2026-10-23',
      time: '21:00',
      dyspneaRating: 3,
      coughSeverity: 'Mild',
      wheezeSeverity: 'Mild',
      chestTightness: 'Mild',
      exerciseTolerance: 'Slightly reduced',
      triggers: ['Dust during room cleaning'],
      relieverPuffs: 1,
      notes: 'Took 1 puff of Salbutamol as per action plan; cleared within 10 minutes.'
    },
    {
      id: 'sym-03',
      patientId: 'pat-101',
      date: '2026-10-24',
      time: '19:30',
      dyspneaRating: 3,
      coughSeverity: 'None',
      wheezeSeverity: 'None',
      chestTightness: 'Mild',
      exerciseTolerance: 'Normal',
      triggers: ['Brisk walking'],
      relieverPuffs: 0,
      notes: 'Recovered promptly using pursed-lip breathing.'
    },
    {
      id: 'sym-04',
      patientId: 'pat-101',
      date: '2026-10-25',
      time: '20:15',
      dyspneaRating: 1,
      coughSeverity: 'None',
      wheezeSeverity: 'None',
      chestTightness: 'None',
      exerciseTolerance: 'Normal',
      triggers: [],
      relieverPuffs: 0,
      notes: 'Great day, no respiratory discomfort.'
    },
    {
      id: 'sym-05',
      patientId: 'pat-101',
      date: '2026-10-26',
      time: '20:45',
      dyspneaRating: 2,
      coughSeverity: 'Mild',
      wheezeSeverity: 'None',
      chestTightness: 'None',
      exerciseTolerance: 'Normal',
      triggers: ['Work stress'],
      relieverPuffs: 0,
      notes: 'Relaxed paced breathing helped ease chest tightness.'
    },
    {
      id: 'sym-06',
      patientId: 'pat-101',
      date: '2026-10-27',
      time: '21:10',
      dyspneaRating: 1,
      coughSeverity: 'None',
      wheezeSeverity: 'None',
      chestTightness: 'None',
      exerciseTolerance: 'Normal',
      triggers: [],
      relieverPuffs: 0,
      notes: 'Stable breathing all day.'
    },
    {
      id: 'sym-07',
      patientId: 'pat-101',
      date: '2026-10-28',
      time: '19:40',
      dyspneaRating: 2,
      coughSeverity: 'Mild',
      wheezeSeverity: 'None',
      chestTightness: 'Mild',
      exerciseTolerance: 'Normal',
      triggers: ['Cold evening breeze'],
      relieverPuffs: 0,
      notes: 'Managed with scarf warmth and gentle breathing.'
    }
  ],
  clinicalNotes: [
    {
      id: 'cn-1',
      date: '2026-10-18',
      author: 'Dr. Sarah Jenkins, PT',
      note: 'Initial cardiopulmonary tele-assessment completed. Patient demonstrates apical breathing with noticeable scalene and sternocleidomastoid recruitment at rest. Demonstrated diaphragmatic breathing in supported high-sitting. Patient grasped technique quickly. Target: 2x daily 5-minute sessions. Review in 2 weeks.'
    }
  ]
};

export const SECONDARY_PATIENT: PatientRecord = {
  id: 'pat-102',
  name: 'Marcus Vance',
  age: 52,
  gender: 'Male',
  diagnosis: 'Severe Asthma with Recurrent Airway Remodeling',
  asthmaSeverity: 'Severe Persistent',
  maintenanceInhaler: 'Fluticasone/Vilanterol 200/25mcg once daily + Tiotropium',
  relieverInhaler: 'Salbutamol 100mcg (1-2 puffs as required)',
  consentSigned: true,
  consentDate: '2026-10-02',
  physioId: 'phys-201',
  physioName: 'Dr. Sarah Jenkins, PT, MSc Cardiopulmonary',
  lastVisitDate: '2026-10-20',
  nextAppointmentDate: '2026-11-06',
  adherenceRate: 68,
  prescriptions: [
    {
      id: 'rx-03',
      patientId: 'pat-102',
      exerciseId: 'pursed_lip',
      title: 'Pursed-Lip Breathing',
      frequencyPerDay: 3,
      durationMinutes: 5,
      cadence: { inhale: 2, hold: 0, exhale: 5 },
      assignedBy: 'Dr. Sarah Jenkins, PT',
      assignedDate: '2026-10-20',
      specialInstructions: 'Practice before and after walking up stairs or carrying groceries. Keep mouth pucker soft.',
      active: true,
      auditTrail: [
        {
          id: 'aud-3',
          date: '2026-10-20 14:00',
          changedBy: 'Dr. Sarah Jenkins, PT',
          reason: 'Exercise Pacing Calibration',
          details: 'Adjusted exhalation duration to 5 seconds to reduce gas trapping without inducing fatigue.'
        }
      ]
    }
  ],
  sessions: [
    {
      id: 'ses-10',
      patientId: 'pat-102',
      exerciseId: 'pursed_lip',
      exerciseTitle: 'Pursed-Lip Breathing',
      startedAt: '2026-10-27T10:00:00Z',
      durationSeconds: 300,
      targetMinutes: 5,
      completedFully: true,
      preBorgDyspnea: 4,
      postBorgDyspnea: 2,
      stoppedEarly: false
    }
  ],
  symptoms: [
    {
      id: 'sym-10',
      patientId: 'pat-102',
      date: '2026-10-27',
      time: '18:00',
      dyspneaRating: 4,
      coughSeverity: 'Moderate',
      wheezeSeverity: 'Mild',
      chestTightness: 'Moderate',
      exerciseTolerance: 'Slightly reduced',
      triggers: ['Car exhaust smoke'],
      relieverPuffs: 2,
      notes: 'Traffic fume exposure triggered cough. Reliever taken.'
    }
  ],
  clinicalNotes: [
    {
      id: 'cn-2',
      date: '2026-10-20',
      author: 'Dr. Sarah Jenkins, PT',
      note: 'Marcus is showing mild hyper-inflation signs on physical exam. Advised on maintaining pursed-lip breathing during functional activities. Emphasized taking reliever prior to cold weather walks.'
    }
  ]
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    patientId: 'pat-101',
    patientName: 'Alex Johnson',
    physioId: 'phys-201',
    physioName: 'Dr. Sarah Jenkins, PT',
    date: '2026-11-04',
    time: '14:30',
    durationMin: 30,
    type: 'Breathing Technique Review',
    status: 'Upcoming',
    videoRoomId: 'tele-rehab-alex-101',
    consultationNotes: 'Check diaphragmatic rib excursion and review symptom diary trend.'
  },
  {
    id: 'apt-02',
    patientId: 'pat-102',
    patientName: 'Marcus Vance',
    physioId: 'phys-201',
    physioName: 'Dr. Sarah Jenkins, PT',
    date: '2026-11-06',
    time: '11:00',
    durationMin: 45,
    type: 'Exercise Progression & Adherence',
    status: 'Upcoming',
    videoRoomId: 'tele-rehab-marcus-102',
    consultationNotes: 'Evaluate exertion pacing and discuss winter flare-up action plan.'
  },
  {
    id: 'apt-03',
    patientId: 'pat-101',
    patientName: 'Alex Johnson',
    physioId: 'phys-201',
    physioName: 'Dr. Sarah Jenkins, PT',
    date: '2026-10-18',
    time: '10:00',
    durationMin: 45,
    type: 'Initial Tele-Rehab Assessment',
    status: 'Completed',
    videoRoomId: 'tele-rehab-alex-archive',
    consultationNotes: 'Baseline assessment completed. Prescribed Diaphragmatic and Pursed-Lip routines.',
    followUpPlan: 'Maintain twice daily 5 min practice. Target next review in 2 weeks.'
  }
];

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'art-01',
    title: 'Understanding Asthma & Airway Hyper-responsiveness',
    category: 'Action Plans & Safety',
    readingTimeMin: 4,
    summary: 'A clear clinical overview of what happens during asthma inflammation, bronchial hypersensitivity, and the vital difference between controller and reliever medications.',
    sections: [
      {
        heading: 'What Happens Inside the Airways?',
        body: 'Asthma is a chronic inflammatory disorder of the conducting airways. In individuals with asthma, the bronchial lining is hypersensitive to specific triggers such as cold dry air, viral respiratory infections, dust mites, pollen, and airborne particles. When exposed to a trigger, three physiological reactions occur simultaneously: the surrounding smooth muscles contract (bronchospasm), the mucosal lining swells (edema), and excess sticky mucus is produced.'
      },
      {
        heading: 'Preventers vs. Relievers',
        body: 'It is essential to understand the distinction between your inhalers. Preventer (maintenance/controller) inhalers, typically containing inhaled corticosteroids (ICS), reduce underlying chronic swelling over days and weeks and must be taken consistently every single day even when you feel completely well. Reliever inhalers (such as short-acting beta-2 agonists like Salbutamol) quickly relax the constricted muscles during acute shortness of breath within minutes, but do not treat the underlying inflammation.'
      },
      {
        heading: 'Role of Breathing Exercises',
        body: 'Breathing exercises act as a non-pharmacological supportive adjunct. They help calm breathing pattern disorders, reduce muscular hypertonicity in the chest and neck, and improve functional quality of life. However, breathing exercises never substitute for your prescribed controller medications.'
      }
    ],
    keyTakeaways: [
      'Asthma involves chronic airway inflammation, muscular constriction, and mucus production.',
      'Controller medications must be taken every day regardless of symptoms.',
      'Breathing exercises support breathing efficiency and relaxation, but do not replace prescribed medicine.'
    ],
    citations: [
      {
        author: 'Global Initiative for Asthma (GINA)',
        title: 'Global Strategy for Asthma Management and Prevention',
        publication: 'GINA Medical Guidelines',
        year: 2024
      },
      {
        author: 'British Thoracic Society & SIGN',
        title: 'British Guideline on the Management of Asthma (Guideline 158)',
        publication: 'Thorax Journal',
        year: 2023
      }
    ]
  },
  {
    id: 'art-02',
    title: 'The Science of Diaphragmatic & Pursed-Lip Breathing',
    category: 'Breathing Techniques',
    readingTimeMin: 5,
    summary: 'Why diaphragmatic engagement and controlled pursed-lip expiration help lower work of breathing and optimize alveolar gas exchange.',
    sections: [
      {
        heading: 'The Biomechanics of the Diaphragm',
        body: 'The diaphragm is the primary muscle of inspiration, responsible for roughly 70–80% of resting tidal volume in healthy adults. During asthma flare-ups or anxiety, patients often shift into an apical breathing pattern, recruiting secondary accessory muscles (sternocleidomastoid, scalenes, and pectoralis minor). This dramatically increases metabolic oxygen demand and causes neck/shoulder fatigue. Re-training diaphragmatic excursion gently shifts the respiratory workload back to the most efficient muscle.'
      },
      {
        heading: 'How Pursed-Lip Breathing Creates Positive Airway Pressure',
        body: 'Pursed-lip breathing introduces a small physiological resistance at the mouth during expiration. This gentle back-pressure is transmitted down through the tracheobronchial tree, raising intrabronchial pressure above the surrounding intrapleural pressure. This helps keep floppy, inflamed small airways open for longer, allowing trapped alveolar air to escape smoothly and reducing dynamic lung hyper-inflation.'
      },
      {
        heading: 'Safe Clinical Rules for Practice',
        body: 'Cardiopulmonary physiotherapists recommend practicing in comfortable supported positions (sitting upright or semi-reclined) with shoulders dropped. Never strain, force air out aggressively, or hold your breath to the point of discomfort. If you experience dizziness, slow down immediately.'
      }
    ],
    keyTakeaways: [
      'Diaphragmatic breathing reduces fatigue in upper neck and shoulder accessory muscles.',
      'Pursed-lip breathing provides mild positive airway pressure, preventing premature small-airway collapse.',
      'Breathing should always feel gentle, relaxed, and rhythmic—never forced or breathless.'
    ],
    citations: [
      {
        author: 'Santino TA et al.',
        title: 'Breathing exercises for adults with asthma',
        publication: 'Cochrane Database of Systematic Reviews',
        year: 2020
      },
      {
        author: 'Thomas M et al.',
        title: 'Breathing exercises for asthma: a randomised controlled trial',
        publication: 'Thorax',
        year: 2019
      }
    ]
  },
  {
    id: 'art-03',
    title: 'Inhaler Technique: Maximizing Drug Delivery',
    category: 'Inhaler Technique',
    readingTimeMin: 4,
    summary: 'Step-by-step instructions for pressurized Metered Dose Inhalers (pMDI), spacers, and Dry Powder Inhalers (DPI) to prevent medication depositing only in the throat.',
    sections: [
      {
        heading: 'The Common Pitfall: Throat Deposition',
        body: 'Studies show that up to 70% of people with asthma make at least one critical error when using their inhaler. When aerosolized medication is fired too fast or without coordination, a large portion impacts against the back of the pharynx rather than traveling down into the bronchial tree. Using a valved holding chamber (spacer) with a pMDI slows the aerosol plume and drastically enhances fine-particle lung deposition.'
      },
      {
        heading: 'Step-by-Step with a Spacer (pMDI)',
        body: '1. Remove mouthpiece cap and shake the inhaler well for 5 seconds.\n2. Insert the canister into the rear of the spacer.\n3. Sit upright and exhale gently away from the spacer.\n4. Place lips firmly around the spacer mouthpiece with a tight seal.\n5. Press the canister once.\n6. Breathe in slowly and steadily over 4 to 5 seconds (if the spacer whistles, you are breathing in too fast).\n7. Hold breath comfortably for 5 to 10 seconds before breathing out gently.'
      },
      {
        heading: 'Mouth Rinsing after Corticosteroids',
        body: 'Always rinse your mouth with water and spit it out after inhaling corticosteroid maintenance medication to avoid oral candidiasis (thrush) and hoarseness.'
      }
    ],
    keyTakeaways: [
      'Using a spacer with a pMDI significantly increases medication deposition into the lungs.',
      'Inhale slowly and steadily; a whistling spacer means you are breathing too fast.',
      'Always rinse and spit after using inhaled steroid controllers.'
    ],
    citations: [
      {
        author: 'Usmani OS et al.',
        title: 'Critical inhaler errors in asthma and COPD: a systematic review',
        publication: 'Journal of Allergy and Clinical Immunology: In Practice',
        year: 2021
      }
    ]
  },
  {
    id: 'art-04',
    title: 'Recognizing Severe Symptoms: When to Seek Immediate Emergency Care',
    category: 'Action Plans & Safety',
    readingTimeMin: 3,
    summary: 'Critical red-flag symptoms that indicate acute asthma exacerbation requiring emergency medical attention and an immediate call for an ambulance.',
    sections: [
      {
        heading: 'Red Flag Emergency Indicators',
        body: 'If you or someone in your care experiences any of the following symptoms, DO NOT rely on breathing exercises or wait to see if things improve. Call emergency medical services (911 in USA/Canada, 999 in UK, 112 in Europe, or your local emergency number) immediately:\n\n• Inability to speak in full sentences or finish words without stopping to breathe.\n• Reliever inhaler (e.g. Salbutamol) provides little or no relief, or symptoms return in under 2 hours.\n• Chest and neck pulling inward deeply with each breath (retractions / sternal indrawing).\n• Blue, grey, or pale coloring around lips, tongue, or nail beds.\n• Severe, unrelenting chest tightness or respiratory exhaustion.'
      },
      {
        heading: 'Immediate Action while Waiting for Paramedics',
        body: '1. Sit upright comfortably—do not lie flat.\n2. Take 1 puff of your reliever inhaler every 30 to 60 seconds (up to 10 puffs), preferably using a spacer if available.\n3. Stay as calm as possible; have someone remain by your side.\n4. If the ambulance has not arrived within 10 to 15 minutes and symptoms persist, repeat the reliever inhaler doses.'
      }
    ],
    keyTakeaways: [
      'Inability to speak in full sentences is an acute medical emergency.',
      'Never attempt breathing exercises instead of calling for emergency assistance.',
      'Sit upright and follow your written Personal Asthma Action Plan.'
    ],
    citations: [
      {
        author: 'National Asthma Council Australia',
        title: 'First Aid for Asthma: Emergency Protocol',
        publication: 'National Asthma Guidelines',
        year: 2024
      }
    ]
  }
];

export const RESEARCH_DATA_DICTIONARY = [
  {
    variable: 'session_id',
    type: 'String (UUID v4)',
    definition: 'Unique anonymized identifier for each completed or aborted breathing session.'
  },
  {
    variable: 'exercise_type',
    type: 'Categorical Enum',
    definition: 'Specific clinical breathing module executed (diaphragmatic, pursed_lip, relaxed, clinician_custom).'
  },
  {
    variable: 'duration_seconds',
    type: 'Integer (Seconds)',
    definition: 'Objective wall-clock practice duration tracked by the web client.'
  },
  {
    variable: 'target_duration_minutes',
    type: 'Integer (Minutes)',
    definition: 'Target duration selected by user or prescribed by physiotherapist (2, 5, or 10 min).'
  },
  {
    variable: 'completed_fully',
    type: 'Boolean',
    definition: 'Indicates whether the participant completed the target session without early termination.'
  },
  {
    variable: 'pre_dyspnea_borg',
    type: 'Integer [0 - 10]',
    definition: 'Self-reported perceived dyspnea on the Modified Borg Scale prior to initiating exercise.'
  },
  {
    variable: 'post_dyspnea_borg',
    type: 'Integer [0 - 10]',
    definition: 'Self-reported perceived dyspnea on the Modified Borg Scale immediately following exercise.'
  },
  {
    variable: 'reliever_puffs_daily',
    type: 'Integer [0 - 30]',
    definition: 'Patient-reported number of short-acting bronchodilator puffs taken in the preceding 24 hours.'
  },
  {
    variable: 'sus_system_usability_score',
    type: 'Float [0 - 100]',
    definition: 'Calculated System Usability Scale composite score derived from the validated 10-item instrument.'
  }
];
