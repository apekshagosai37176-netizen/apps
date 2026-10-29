/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Menu,
  X,
  User,
  Stethoscope,
  BookOpen,
  Calendar,
  Activity,
  Wind,
  FileText,
  Sliders,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    setIsEmergencyModalOpen,
    user
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const patientNavLinks = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'coach', label: 'Breathing Coach' },
    { id: 'plan', label: 'Exercise Plan' },
    { id: 'diary', label: 'Symptom Diary' },
    { id: 'reports', label: 'Progress Reports' },
    { id: 'telerehab', label: 'Tele-Rehab' },
    { id: 'education', label: 'Library' }
  ];

  const physioNavLinks = [
    { id: 'physio', label: 'Patient Roster' },
    { id: 'plan', label: 'Prescription Plans' },
    { id: 'telerehab', label: 'Tele-Rehab' },
    { id: 'research', label: 'Research & SUS' },
    { id: 'education', label: 'Library' }
  ];

  const currentLinks = role === 'physiotherapist' ? physioNavLinks : patientNavLinks;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element brand wordmark */}
          <button
            onClick={() => handleNavClick(role === 'physiotherapist' ? 'physio' : 'dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-none">
                BreatheWell
              </span>
              <span className="text-[11px] font-medium text-teal-700 tracking-tight whitespace-nowrap">
                Virtual Breathing Coach
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {currentLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 hover:text-teal-700 ${
                    isActive
                      ? 'text-teal-800 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-teal-600'
                      : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Role Switcher */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Emergency Medical Stop / Action */}
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Emergency clinical guidance for acute breathlessness"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">Emergency Help</span>
            </button>

            {/* Role Switcher Segmented Control */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
              <button
                onClick={() => setRole('patient')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  role === 'patient'
                    ? 'bg-white text-teal-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Patient View"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Patient</span>
              </button>
              <button
                onClick={() => setRole('physiotherapist')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  role === 'physiotherapist'
                    ? 'bg-white text-teal-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Physiotherapist Clinician View"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Physiotherapist</span>
              </button>
            </div>

            {/* Settings & Profile trigger */}
            <button
              onClick={() => handleNavClick('settings')}
              className={`p-2 rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-teal-50 border-teal-300 text-teal-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Settings & Accessibility"
              aria-label="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
            {role === 'physiotherapist' ? 'Physiotherapy Portal' : 'Patient Navigation'}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {currentLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{link.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => handleNavClick('pricing')}
              className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg text-left transition-colors ${
                activeTab === 'pricing' ? 'bg-teal-50 text-teal-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Subscription Tiers
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
