/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wind,
  ShieldCheck,
  Check,
  ArrowRight,
  User,
  Stethoscope,
  Globe,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser, role, setRole } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [userName, setUserName] = useState(user.name);
  const [userRole, setUserRole] = useState<UserRole>(role);
  const [selectedLanguage, setSelectedLanguage] = useState(user.preferredLanguage);
  const [hasAgreedConsent, setHasAgreedConsent] = useState(user.consentSigned);

  if (!isOpen) return null;

  const handleFinish = () => {
    updateUser({
      name: userName,
      preferredLanguage: selectedLanguage,
      consentSigned: hasAgreedConsent,
      consentDate: new Date().toISOString().slice(0, 10)
    });
    setRole(userRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium border-b border-slate-100 pb-3">
          <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Welcome to BreatheWell</span>
          </span>
          <span>Step {step} of 3</span>
        </div>

        {/* Step 1: Welcome & Role */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
                <Wind className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Breathe Better. Move Better. Live Better.
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                A cardiopulmonary virtual breathing coach designed for adults with asthma and respiratory conditions to practice clinician-guided breathing exercises and track adherence.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Select Your Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserRole('patient')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    userRole === 'patient'
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-sm text-slate-900">Patient</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Practice prescribed breathing exercises, log daily symptoms, and join tele-rehab consultations.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setUserRole('physiotherapist')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    userRole === 'physiotherapist'
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-sm text-slate-900">Physiotherapist</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Monitor patient adherence, review symptom diaries, calibrate cadence with audit trail, and schedule reviews.
                  </p>
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Continue Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Profile & Language */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Profile & Language Setup
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We only collect minimal necessary details to personalize your coaching experience.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Preferred Language</label>
                <select
                  value={selectedLanguage}
                  onChange={e => setSelectedLanguage(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="Hindi">हिन्दी</option>
                  <option value="French">Français</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Next: Clinical Consent
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Clinical Consent & Safety Agreement */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Clinical Consent & Safety Notice
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Please review and acknowledge the application boundaries before starting
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 max-h-48 overflow-y-auto leading-relaxed">
              <p>
                <strong>1. Supportive Educational Purpose:</strong> BreatheWell is an adjunct tool for diaphragmatic and pursed-lip breathing practice. It does not replace medical advice, physician assessment, or emergency medical treatment.
              </p>
              <p>
                <strong>2. Medication Adherence:</strong> This app does not advise altering or discontinuing prescribed asthma medications. Always take your maintenance controller inhalers as instructed by your treating physician.
              </p>
              <p>
                <strong>3. Emergency Boundaries:</strong> During acute attacks or worsening breathlessness, stop breathing exercises and follow your personal Asthma Action Plan.
              </p>
            </div>

            <label className="flex items-start gap-3 p-3 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs text-teal-950 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAgreedConsent}
                onChange={e => setHasAgreedConsent(e.target.checked)}
                className="w-4 h-4 accent-teal-600 mt-0.5 cursor-pointer shrink-0"
              />
              <span>
                I have read and agree to the clinical consent terms and understand that this app is for supportive breathing physiotherapy only.
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                disabled={!hasAgreedConsent}
                onClick={handleFinish}
                className="w-2/3 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Enter BreatheWell
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
