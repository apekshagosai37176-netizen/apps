/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { EmergencyModal } from './components/EmergencyModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PatientDashboard } from './components/PatientDashboard';
import { BreathingCoach } from './components/BreathingCoach';
import { ExercisePlanView } from './components/ExercisePlanView';
import { SymptomDiaryView } from './components/SymptomDiaryView';
import { ProgressReportsView } from './components/ProgressReportsView';
import { PhysiotherapistDashboard } from './components/PhysiotherapistDashboard';
import { TeleRehabView } from './components/TeleRehabView';
import { EducationalLibrary } from './components/EducationalLibrary';
import { ResearchToolsView } from './components/ResearchToolsView';
import { PricingView } from './components/PricingView';
import { SettingsView } from './components/SettingsView';
import { Wind, ShieldAlert, HeartPulse, HelpCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, user, setIsEmergencyModalOpen } = useApp();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // High contrast & font size classes
  const contrastClass = user.highContrast ? 'contrast-125 saturate-125' : '';
  const fontClass =
    user.fontSize === 'extra-large'
      ? 'text-lg'
      : user.fontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${contrastClass} ${fontClass}`}>
      {/* Top Navbar */}
      <Navbar />

      {/* Global Emergency Modal */}
      <EmergencyModal />

      {/* Onboarding Modal */}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'dashboard' && <PatientDashboard />}
        {activeTab === 'coach' && <BreathingCoach />}
        {activeTab === 'plan' && <ExercisePlanView />}
        {activeTab === 'diary' && <SymptomDiaryView />}
        {activeTab === 'reports' && <ProgressReportsView />}
        {activeTab === 'physio' && <PhysiotherapistDashboard />}
        {activeTab === 'telerehab' && <TeleRehabView />}
        {activeTab === 'education' && <EducationalLibrary />}
        {activeTab === 'research' && <ResearchToolsView />}
        {activeTab === 'pricing' && <PricingView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Reassuring Clinical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 tracking-tight text-base block">
                  BreatheWell
                </span>
                <span className="text-xs text-slate-500">
                  Virtual Breathing Coach · Breathe Better. Move Better. Live Better.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="hover:text-teal-700 transition-colors flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>Onboarding Guide</span>
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className="hover:text-teal-700 transition-colors"
              >
                Subscription Tiers
              </button>
              <button
                onClick={() => setActiveTab('research')}
                className="hover:text-teal-700 transition-colors"
              >
                Research & Usability (SUS)
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="hover:text-teal-700 transition-colors"
              >
                Privacy & Consent
              </button>
              <button
                onClick={() => setIsEmergencyModalOpen(true)}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Emergency Protocol</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-500">
            <p className="max-w-3xl leading-relaxed">
              <strong>Medical Disclaimer:</strong> BreatheWell is an educational coaching application and exercise adherence aid designed for adults with asthma under the care of a licensed healthcare provider. It does not diagnose asthma, predict asthma attacks, or replace prescribed controller or reliever medications. In case of acute respiratory distress or emergency, dial 911 / 999 or proceed immediately to the nearest emergency department.
            </p>
            <div className="text-[11px] font-mono text-slate-400 shrink-0">
              v1.2.0-clinical · Build 2026.10
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
