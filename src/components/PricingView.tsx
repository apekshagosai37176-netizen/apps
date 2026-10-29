/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Shield,
  Stethoscope,
  HeartHandshake,
  Video,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PricingView: React.FC = () => {
  const { user, updateUser } = useApp();
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('monthly');
  const [simulatedTier, setSimulatedTier] = useState(user.currentPlanTier);

  const handleSelectPlan = (tier: 'Free' | 'Premium' | 'Professional') => {
    setSimulatedTier(tier);
    updateUser({ currentPlanTier: tier });
    alert(`Simulated plan switched to ${tier}. In production, this connects to Stripe or healthcare insurance integration.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
          Transparent Cardiopulmonary Plans
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Supportive Care for Every Respiratory Journey
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From self-paced home practice to physiotherapist-supervised tele-rehabilitation. All tiers comply with medical privacy boundaries.
        </p>

        {/* Billing Cadence Toggle */}
        <div className="pt-2 flex items-center justify-center">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedBilling('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedBilling === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setSelectedBilling('annual')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedBilling === 'annual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Integration Notice */}
      <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-2xl text-xs text-teal-900 flex items-start gap-3 max-w-3xl mx-auto">
        <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Simulated Subscription Architecture:</strong>
          This interface demonstrates the future monetization architecture. Clicking "Select Tier" simulates state updates in local storage without charging real payments.
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {/* Tier 1: Free Basic */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Free Community Tier
            </span>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Basic Coach</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-mono text-slate-900">$0</span>
                <span className="text-xs text-slate-500">forever free</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              For individuals wanting core guided breathing practice and a personal symptom diary.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Diaphragmatic & Pursed-Lip sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Daily 0-10 Borg symptom diary</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Access to respiratory educational library</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Web audio sine chimes</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('Free')}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              simulatedTier === 'Free'
                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {simulatedTier === 'Free' ? 'Current Active Tier' : 'Select Free Tier'}
          </button>
        </div>

        {/* Tier 2: Premium (Featured) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-teal-500 shadow-md flex flex-col justify-between space-y-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
            Most Popular for Maintenance
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Patient Rehabilitation
            </span>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Premium Care</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-mono text-slate-900">
                  {selectedBilling === 'monthly' ? '$9' : '$7'}
                </span>
                <span className="text-xs text-slate-500">/ patient / month</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Complete adherence insights, exportable clinical summaries, and personalized audio pacing.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Everything in Free Tier</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Exportable Consultation Progress Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Advanced trigger correlation trends</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Voice coaching guidance & haptic cues</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Direct tele-rehab appointment booking</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('Premium')}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-xs ${
              simulatedTier === 'Premium'
                ? 'bg-teal-100 text-teal-900 border border-teal-300'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {simulatedTier === 'Premium' ? 'Current Active Tier' : 'Upgrade to Premium'}
          </button>
        </div>

        {/* Tier 3: Professional Clinician */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Clinical Practice
            </span>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Professional PT</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold font-mono text-slate-900">
                  {selectedBilling === 'monthly' ? '$39' : '$32'}
                </span>
                <span className="text-xs text-slate-500">/ clinician / month</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              For respiratory physiotherapists, pulmonary clinics, and clinical researchers managing patient cohorts.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Unlimited patient roster & adherence review</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Custom prescription calibration with audit trail</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Integrated WebRTC video consultation room</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Clinical consultation progress notes</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 shrink-0" />
                <span>De-identified research dataset export & SUS</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('Professional')}
            className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              simulatedTier === 'Professional'
                ? 'bg-slate-100 text-slate-800 border border-slate-300'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {simulatedTier === 'Professional' ? 'Current Active Tier' : 'Select Professional'}
          </button>
        </div>
      </div>
    </div>
  );
};
