/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FileCheck,
  Lock,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  ShieldCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BREATHING_EXERCISES } from '../data/initialData';
import { ExerciseType } from '../types';

export const ExercisePlanView: React.FC = () => {
  const { currentPatient, setActiveTab, setSelectedExerciseId, role } = useApp();

  const handleStartExercise = (exerciseId: ExerciseType) => {
    setSelectedExerciseId(exerciseId);
    setActiveTab('coach');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-teal-600" />
            <span>Prescribed Cardiopulmonary Plan</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personalized respiratory physiotherapy prescription assigned by {currentPatient.physioName}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Active Prescription · Updated {currentPatient.lastVisitDate}</span>
          </span>
        </div>
      </div>

      {/* Clinical Disclaimer & Clinician Lock Notice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-700">
          <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-slate-900 mb-0.5">
              Clinician Protected Prescription
            </strong>
            Target ratios and practice frequencies are calibrated to your clinical assessment. Patients cannot independently edit prescribed cadence; updates must be authorized by your respiratory physiotherapist.
          </div>
        </div>

        <div className="p-4 bg-teal-50/50 border border-teal-200/70 rounded-2xl flex items-start gap-3 text-xs text-teal-900">
          <AlertCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold mb-0.5">
              Supportive Physiotherapy Boundary
            </strong>
            Breathing exercises promote chest wall expansion and reduce accessory muscle tension. They do not claim to cure asthma or replace prescribed anti-inflammatory inhalers.
          </div>
        </div>
      </div>

      {/* Prescribed Exercises Cards */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Active Prescribed Modules
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {currentPatient.prescriptions.map(rx => {
            const exerciseDef = BREATHING_EXERCISES.find(e => e.id === rx.exerciseId);
            const totalDoneForThisRx = currentPatient.sessions.filter(
              s => s.exerciseId === rx.exerciseId
            ).length;

            return (
              <div
                key={rx.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-teal-300 transition-all space-y-6"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
                        {exerciseDef?.category || 'Respiratory Practice'}
                      </span>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Prescribed {rx.assignedDate}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {rx.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleStartExercise(rx.exerciseId)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Prescribed Session</span>
                  </button>
                </div>

                {/* Grid specs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                      Target Cadence (Sec)
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-800">
                      {rx.cadence.inhale}s Inhale · {rx.cadence.hold}s Pause · {rx.cadence.exhale}s Exhale
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                      Daily Dosage
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {rx.durationMinutes} min · {rx.frequencyPerDay} times daily
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                      Completed Sessions
                    </span>
                    <span className="text-sm font-bold font-mono text-teal-700">
                      {totalDoneForThisRx} documented sessions
                    </span>
                  </div>
                </div>

                {/* Instructions & Precautions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                      Physiotherapist Instructions
                    </h4>
                    <p className="bg-teal-50/40 p-3 rounded-xl border border-teal-100 text-slate-700 leading-relaxed">
                      {rx.specialInstructions}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[11px]">
                      Clinical Precautions
                    </h4>
                    <p className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-amber-900 leading-relaxed">
                      {exerciseDef?.precautions[0] ||
                        'Discontinue if feeling light-headed, dizzy, or experiencing increased chest tightness.'}
                    </p>
                  </div>
                </div>

                {/* Audit Trail for Prescription Modifications */}
                {rx.auditTrail && rx.auditTrail.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <History className="w-3.5 h-3.5" />
                      <span className="font-semibold">Clinical Audit Trail:</span>
                    </div>
                    <div className="space-y-1.5">
                      {rx.auditTrail.map(audit => (
                        <div
                          key={audit.id}
                          className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                        >
                          <span>
                            <strong>{audit.reason}:</strong> {audit.details}
                          </span>
                          <span className="text-slate-400 font-mono shrink-0">
                            {audit.date} · {audit.changedBy}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
