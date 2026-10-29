/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, HeartPulse } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmergencyModal: React.FC = () => {
  const { isEmergencyModalOpen, setIsEmergencyModalOpen } = useApp();

  if (!isEmergencyModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
        {/* Urgent Red Banner */}
        <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
            <div>
              <h2 id="emergency-modal-title" className="text-xl font-bold tracking-tight">
                Emergency Medical Guidance
              </h2>
              <p className="text-xs text-red-100">
                Immediate clinical guidance for acute respiratory difficulty
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="text-red-100 hover:text-white p-1.5 rounded-lg hover:bg-red-700/50 transition-colors"
            aria-label="Close emergency modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Critical Warning Callout */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="text-sm text-red-900">
              <p className="font-semibold text-base mb-1">
                Do NOT rely on breathing exercises during an acute attack!
              </p>
              <p className="text-red-800 leading-relaxed">
                Breathing exercises are designed for calm maintenance and recovery pacing. They do{' '}
                <strong>not</strong> relieve acute airway bronchoconstriction. If you are experiencing sudden severe shortness of breath, follow your personal written Asthma Action Plan immediately.
              </p>
            </div>
          </div>

          {/* Red Flag Checklist */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Red Flag Emergency Indicators
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span>Cannot speak full sentences without needing to stop for breath</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span>Reliever inhaler (Salbutamol) provides no relief or wears off in under 2 hours</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span>Chest, throat, or rib cage muscles sucking inward deeply (retractions)</span>
              </li>
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <span>Blue, grey, or pale lips, tongue, or fingertips</span>
              </li>
            </ul>
          </div>

          {/* Step by Step Action Plan */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Immediate First-Aid Protocol (GINA & British Thoracic Society)
            </h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex gap-3 p-3 bg-teal-50/60 border border-teal-200/60 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </span>
                <p>
                  <strong>Sit upright comfortably.</strong> Do not lie flat. Loosen any tight clothing around your neck and chest.
                </p>
              </div>

              <div className="flex gap-3 p-3 bg-teal-50/60 border border-teal-200/60 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <p>
                  <strong>Take 1 puff of your blue reliever inhaler</strong> (with a spacer if available) every 30 to 60 seconds, taking slow gentle breaths, up to a maximum of 10 puffs.
                </p>
              </div>

              <div className="flex gap-3 p-3 bg-teal-50/60 border border-teal-200/60 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <p>
                  <strong>If no improvement after 10 puffs, call emergency medical services immediately.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Dial Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-semibold text-base">Call Emergency Services Now</p>
                <p className="text-xs text-slate-300">
                  United States / Canada: 911 · United Kingdom: 999 · Europe: 112
                </p>
              </div>
            </div>
            <a
              href="tel:911"
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm text-center transition-colors shadow-md"
            >
              Dial Emergency Now
            </a>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span>Validated by Cardiopulmonary Physiotherapy Guidelines</span>
          </div>
          <button
            onClick={() => setIsEmergencyModalOpen(false)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg text-xs transition-colors"
          >
            I Understand, Close Guidance
          </button>
        </div>
      </div>
    </div>
  );
};
