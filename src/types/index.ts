/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'patient' | 'physiotherapist';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  preferredLanguage: string;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  notificationsEnabled: boolean;
  audioFeedbackEnabled: boolean;
  voiceGuidanceEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  consentSigned: boolean;
  consentDate?: string;
  asthmaDiagnosisYear?: number;
  assignedPhysiotherapist?: string;
  currentPlanTier: 'Free' | 'Premium' | 'Professional';
}

export type ExerciseType = 'diaphragmatic' | 'pursed_lip' | 'relaxed' | 'clinician_custom';

export interface BreathingExercise {
  id: ExerciseType;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  physiologicalRationale: string;
  techniqueSteps: string[];
  indications: string[];
  precautions: string[];
  defaultInhaleSec: number;
  defaultHoldSec: number;
  defaultExhaleSec: number;
  defaultDurationMin: number;
  clinicianApproved: boolean;
  badge: string;
}

export interface PrescriptionAuditEntry {
  id: string;
  date: string;
  changedBy: string;
  reason: string;
  details: string;
}

export interface ExercisePrescription {
  id: string;
  patientId: string;
  exerciseId: ExerciseType;
  title: string;
  frequencyPerDay: number;
  durationMinutes: number;
  cadence: {
    inhale: number;
    hold: number;
    exhale: number;
  };
  assignedBy: string;
  assignedDate: string;
  specialInstructions: string;
  active: boolean;
  auditTrail: PrescriptionAuditEntry[];
}

export interface SessionLog {
  id: string;
  patientId: string;
  exerciseId: ExerciseType;
  exerciseTitle: string;
  startedAt: string; // ISO string
  durationSeconds: number;
  targetMinutes: number;
  completedFully: boolean;
  preBorgDyspnea: number; // 0-10
  postBorgDyspnea: number; // 0-10
  stoppedEarly: boolean;
  stopReason?: string;
  notes?: string;
}

export type SeverityLevel = 'None' | 'Mild' | 'Moderate' | 'Severe';

export interface SymptomEntry {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  dyspneaRating: number; // 0-10 Modified Borg Scale
  coughSeverity: SeverityLevel;
  wheezeSeverity: SeverityLevel;
  chestTightness: SeverityLevel;
  exerciseTolerance: 'Normal' | 'Slightly reduced' | 'Significantly reduced' | 'Severely limited';
  triggers: string[];
  relieverPuffs: number; // e.g. Salbutamol / Ventolin puffs
  notes: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  diagnosis: string;
  asthmaSeverity: 'Mild Intermittent' | 'Mild Persistent' | 'Moderate Persistent' | 'Severe Persistent';
  maintenanceInhaler: string;
  relieverInhaler: string;
  consentSigned: boolean;
  consentDate: string;
  physioId: string;
  physioName: string;
  lastVisitDate: string;
  nextAppointmentDate: string;
  adherenceRate: number; // percentage 0-100
  prescriptions: ExercisePrescription[];
  sessions: SessionLog[];
  symptoms: SymptomEntry[];
  clinicalNotes: { id: string; date: string; author: string; note: string }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  physioId: string;
  physioName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMin: number;
  type: 'Initial Tele-Rehab Assessment' | 'Breathing Technique Review' | 'Exercise Progression & Adherence';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  videoRoomId: string;
  consultationNotes?: string;
  followUpPlan?: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  category: 'Breathing Techniques' | 'Inhaler Technique' | 'Triggers & Environment' | 'Action Plans & Safety' | 'Physical Activity';
  readingTimeMin: number;
  summary: string;
  sections: { heading: string; body: string }[];
  keyTakeaways: string[];
  citations: { author: string; title: string; publication: string; year: number }[];
}

export interface SUSQuestionnaire {
  id: string;
  completedAt: string;
  userRole: UserRole;
  responses: number[]; // 10 items, 1-5
  calculatedScore: number; // 0-100
  userComments?: string;
}
