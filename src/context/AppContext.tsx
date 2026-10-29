/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  PatientRecord,
  Appointment,
  SessionLog,
  SymptomEntry,
  ExerciseType,
  SUSQuestionnaire,
  ExercisePrescription
} from '../types';
import { INITIAL_PATIENT, SECONDARY_PATIENT, INITIAL_APPOINTMENTS } from '../data/initialData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  patients: PatientRecord[];
  selectedPatientId: string;
  setSelectedPatientId: (id: string) => void;
  currentPatient: PatientRecord;
  selectedExerciseId: ExerciseType;
  setSelectedExerciseId: (id: ExerciseType) => void;
  appointments: Appointment[];
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  logBreathingSession: (session: Omit<SessionLog, 'id'>) => void;
  addSymptomLog: (entry: Omit<SymptomEntry, 'id'>) => void;
  updatePrescription: (patientId: string, rxId: string, updates: Partial<ExercisePrescription>, reason: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'videoRoomId'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addClinicalNote: (patientId: string, noteText: string) => void;
  susSurveys: SUSQuestionnaire[];
  submitSUSSurvey: (responses: number[], comments?: string) => number;
  resetAllDemoData: () => void;
  activeVideoAppointment: Appointment | null;
  setActiveVideoAppointment: (apt: Appointment | null) => void;
}

const STORAGE_KEYS = {
  USER: 'breathewell_user_v1',
  PATIENTS: 'breathewell_patients_v1',
  APPOINTMENTS: 'breathewell_appointments_v1',
  SUS: 'breathewell_sus_v1',
  ROLE: 'breathewell_role_v1'
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-current',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'patient',
  preferredLanguage: 'English',
  highContrast: false,
  fontSize: 'normal',
  notificationsEnabled: true,
  audioFeedbackEnabled: true,
  voiceGuidanceEnabled: true,
  hapticFeedbackEnabled: true,
  consentSigned: true,
  consentDate: '2026-09-15',
  asthmaDiagnosisYear: 2018,
  assignedPhysiotherapist: 'Dr. Sarah Jenkins, PT',
  currentPlanTier: 'Free'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved === 'physiotherapist' || saved === 'patient') ? saved : 'patient';
    } catch {
      return 'patient';
    }
  });

  const [user, setUserState] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : [INITIAL_PATIENT, SECONDARY_PATIENT];
    } catch {
      return [INITIAL_PATIENT, SECONDARY_PATIENT];
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [susSurveys, setSusSurveys] = useState<SUSQuestionnaire[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-101');
  const [selectedExerciseId, setSelectedExerciseId] = useState<ExerciseType>('diaphragmatic');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [activeVideoAppointment, setActiveVideoAppointment] = useState<Appointment | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch {
      // Ignored
    }
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // Ignored
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch {
      // Ignored
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch {
      // Ignored
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUS, JSON.stringify(susSurveys));
    } catch {
      // Ignored
    }
  }, [susSurveys]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'physiotherapist') {
      setUserState(prev => ({
        ...prev,
        role: 'physiotherapist',
        name: 'Dr. Sarah Jenkins, PT',
        email: 'sarah.jenkins@rehab-cardio.org'
      }));
      if (activeTab === 'dashboard') {
        setActiveTab('physio');
      }
    } else {
      setUserState(prev => ({
        ...prev,
        role: 'patient',
        name: 'Alex Johnson',
        email: 'alex.johnson@example.com'
      }));
      if (activeTab === 'physio') {
        setActiveTab('dashboard');
      }
    }
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const logBreathingSession = (sessionData: Omit<SessionLog, 'id'>) => {
    const newSession: SessionLog = {
      ...sessionData,
      id: `ses-${Date.now()}`
    };

    setPatients(prevPatients =>
      prevPatients.map(p => {
        if (p.id === currentPatient.id) {
          const updatedSessions = [newSession, ...p.sessions];
          // Recalculate simple adherence metric (last 7 days sessions vs prescription)
          const adherence = Math.min(100, Math.round((updatedSessions.length / 10) * 100));
          return {
            ...p,
            sessions: updatedSessions,
            adherenceRate: adherence
          };
        }
        return p;
      })
    );
  };

  const addSymptomLog = (entryData: Omit<SymptomEntry, 'id'>) => {
    const newEntry: SymptomEntry = {
      ...entryData,
      id: `sym-${Date.now()}`
    };

    setPatients(prevPatients =>
      prevPatients.map(p => {
        if (p.id === currentPatient.id) {
          return {
            ...p,
            symptoms: [newEntry, ...p.symptoms]
          };
        }
        return p;
      })
    );
  };

  const updatePrescription = (
    patientId: string,
    rxId: string,
    updates: Partial<ExercisePrescription>,
    reason: string
  ) => {
    setPatients(prevPatients =>
      prevPatients.map(p => {
        if (p.id === patientId) {
          const updatedPrescriptions = p.prescriptions.map(rx => {
            if (rx.id === rxId) {
              const auditEntry = {
                id: `aud-${Date.now()}`,
                date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                changedBy: user.name,
                reason,
                details: `Updated parameters: ${Object.entries(updates)
                  .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
                  .join(', ')}`
              };
              return {
                ...rx,
                ...updates,
                auditTrail: [auditEntry, ...rx.auditTrail]
              };
            }
            return rx;
          });
          return {
            ...p,
            prescriptions: updatedPrescriptions
          };
        }
        return p;
      })
    );
  };

  const addAppointment = (aptData: Omit<Appointment, 'id' | 'status' | 'videoRoomId'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      status: 'Upcoming',
      videoRoomId: `room-${Math.random().toString(36).substring(2, 9)}`
    };
    setAppointments(prev => [newApt, ...prev]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const addClinicalNote = (patientId: string, noteText: string) => {
    setPatients(prevPatients =>
      prevPatients.map(p => {
        if (p.id === patientId) {
          const newNote = {
            id: `cn-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            author: user.name,
            note: noteText
          };
          return {
            ...p,
            clinicalNotes: [newNote, ...p.clinicalNotes]
          };
        }
        return p;
      })
    );
  };

  /**
   * Scores SUS questionnaire based on Brooke (1996) formula:
   * Odd numbered items (1, 3, 5, 7, 9) score = response - 1
   * Even numbered items (2, 4, 6, 8, 10) score = 5 - response
   * Total multiplied by 2.5 yields 0-100 score.
   */
  const submitSUSSurvey = (responses: number[], comments?: string): number => {
    let scoreSum = 0;
    responses.forEach((resp, idx) => {
      const itemNum = idx + 1;
      if (itemNum % 2 !== 0) {
        scoreSum += resp - 1;
      } else {
        scoreSum += 5 - resp;
      }
    });
    const finalScore = Math.round(scoreSum * 2.5);
    const newSurvey: SUSQuestionnaire = {
      id: `sus-${Date.now()}`,
      completedAt: new Date().toISOString(),
      userRole: role,
      responses,
      calculatedScore: finalScore,
      userComments: comments
    };
    setSusSurveys(prev => [newSurvey, ...prev]);
    return finalScore;
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    setPatients([INITIAL_PATIENT, SECONDARY_PATIENT]);
    setAppointments(INITIAL_APPOINTMENTS);
    setSusSurveys([]);
    setUserState(DEFAULT_USER);
    setRoleState('patient');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        user,
        updateUser,
        activeTab,
        setActiveTab,
        patients,
        selectedPatientId,
        setSelectedPatientId,
        currentPatient,
        selectedExerciseId,
        setSelectedExerciseId,
        appointments,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        logBreathingSession,
        addSymptomLog,
        updatePrescription,
        addAppointment,
        updateAppointment,
        addClinicalNote,
        susSurveys,
        submitSUSSurvey,
        resetAllDemoData,
        activeVideoAppointment,
        setActiveVideoAppointment
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
