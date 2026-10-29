/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sliders,
  User,
  Globe,
  Eye,
  Bell,
  Shield,
  Trash2,
  RotateCcw,
  Volume2,
  Mic,
  Vibrate,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { user, updateUser, resetAllDemoData, role, setRole } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Sliders className="w-6 h-6 text-teal-600" />
          <span>App Settings & Accessibility</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize display contrast, audio feedback, language preferences, and privacy controls
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            Profile & Clinical Role
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={e => updateUser({ name: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                onChange={e => updateUser({ email: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Accessibility & Visual Comfort */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-600" />
            Accessibility & Visual Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Font Size */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <label className="font-semibold text-slate-800 block">Text Size Sizing</label>
              <select
                value={user.fontSize}
                onChange={e => updateUser({ fontSize: e.target.value as any })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="normal">Standard Text (14px - 16px)</option>
                <option value="large">Larger Text (18px - 20px)</option>
                <option value="extra-large">Extra Large Contrast (22px+)</option>
              </select>
            </div>

            {/* High Contrast */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-500">Enhanced WCAG AAA contrast</span>
              </div>
              <input
                type="checkbox"
                checked={user.highContrast}
                onChange={e => updateUser({ highContrast: e.target.checked })}
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Language & Internationalization */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600" />
            Language & Regional Format
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Preferred Language</label>
              <select
                value={user.preferredLanguage}
                onChange={e => updateUser({ preferredLanguage: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              >
                <option value="English">English (United States / UK)</option>
                <option value="Spanish">Español (Spanish)</option>
                <option value="Hindi">हिन्दी (Hindi)</option>
                <option value="French">Français (French)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Coaching Cues & Feedback */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-600" />
            Breathing Session Feedback
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Melodic Sine Chimes</span>
                  <span className="text-[11px] text-slate-500">Gentle sound cues at inhale and exhale phases</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={user.audioFeedbackEnabled}
                onChange={e => updateUser({ audioFeedbackEnabled: e.target.checked })}
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <Mic className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Spoken Voice Prompts</span>
                  <span className="text-[11px] text-slate-500">Gentle synthesized pacing phrases</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={user.voiceGuidanceEnabled}
                onChange={e => updateUser({ voiceGuidanceEnabled: e.target.checked })}
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-semibold text-slate-800 block">Haptic Vibration</span>
                  <span className="text-[11px] text-slate-500">Gentle tap vibration on phase transitions</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={user.hapticFeedbackEnabled}
                onChange={e => updateUser({ hapticFeedbackEnabled: e.target.checked })}
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Privacy, Consent & Data Governance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-4 h-4 text-teal-600" />
            Privacy, Consent & Data Rights
          </h2>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <p>
              <strong>Electronic Informed Consent:</strong> Acknowledged on {user.consentDate}.
            </p>
            <p>
              Your health diary and breathing practice data are stored locally in your browser sandbox. No third-party ad tracking or commercial data sales occur.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={resetAllDemoData}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Demo Data</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Account deletion request registered in simulated compliance queue.')}
              className="px-4 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Request Account Data Deletion</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
