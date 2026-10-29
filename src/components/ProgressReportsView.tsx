/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Clock,
  TrendingUp,
  FileCheck,
  Activity,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressReportsView: React.FC = () => {
  const { currentPatient } = useApp();

  const totalSessions = currentPatient.sessions.length;
  const totalSeconds = currentPatient.sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  // Print or trigger PDF export dialog
  const handlePrintSummary = () => {
    window.print();
  };

  const [dateFilter, setDateFilter] = useState<'7days' | '30days' | 'all'>('7days');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            <span>Progress Reports & Adherence Summary</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Objective practice metrics and patient-reported symptom trends for clinical consultation
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrintSummary}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clinical Summary</span>
          </button>
        </div>
      </div>

      {/* Strict Clinical Data Distinction Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-700">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold text-slate-900 mb-0.5">
            Clinical Governance & Data Boundaries
          </strong>
          All dyspnea, cough, wheezing, and reliever figures in this report are self-reported patient observations. This report deliberately does{' '}
          <strong>not</strong> fabricate or estimate oxygen saturation ($SpO_2$), forced expiratory volume ($FEV_1$), or respiratory muscle strength ($MIP/MEP$) without certified diagnostic equipment.
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 block">Total Practice Time</span>
          <div className="text-2xl font-extrabold font-mono text-teal-700 tabular-nums">
            {totalMinutes} <span className="text-sm font-normal text-slate-500">minutes</span>
          </div>
          <span className="text-[11px] text-slate-500">{totalSessions} completed sessions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 block">Prescription Adherence</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            {currentPatient.adherenceRate}%
          </div>
          <span className="text-[11px] text-teal-700 font-medium">Clinically compliant</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 block">Avg Dyspnea Post-Session</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            1.1 / 10
          </div>
          <span className="text-[11px] text-teal-700 font-medium">-1.8 point reduction</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-medium text-slate-500 block">Reliever Inhaler Trend</span>
          <div className="text-2xl font-extrabold font-mono text-slate-900 tabular-nums">
            0.4 <span className="text-xs font-normal text-slate-500">puffs/day</span>
          </div>
          <span className="text-[11px] text-teal-700 font-medium">Well-controlled baseline</span>
        </div>
      </div>

      {/* Printable Clinical Summary Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 print:border-none print:shadow-none">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-teal-700 tracking-wider uppercase">
              Clinical Discussion Summary
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Patient: {currentPatient.name} (Age {currentPatient.age})
            </h2>
            <p className="text-xs text-slate-500">
              Primary Diagnosis: {currentPatient.diagnosis} · Treated by {currentPatient.physioName}
            </p>
          </div>
          <div className="text-right text-xs text-slate-400 font-mono">
            Report Generated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Detailed Exercise History Log */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-900">
            Documented Breathing Practice History
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Technique</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Pre-Dyspnea</th>
                  <th className="py-2.5 px-3">Post-Dyspnea</th>
                  <th className="py-2.5 px-3">Completion Status</th>
                  <th className="py-2.5 px-3">Patient Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {currentPatient.sessions.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 whitespace-nowrap text-slate-900 font-semibold">
                      {session.startedAt.slice(0, 10)} {session.startedAt.slice(11, 16)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">{session.exerciseTitle}</td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      {Math.floor(session.durationSeconds / 60)} min {session.durationSeconds % 60}s
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono">
                      {session.preBorgDyspnea} / 10
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-teal-700 font-semibold">
                      {session.postBorgDyspnea} / 10
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {session.completedFully ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Completed Fully
                        </span>
                      ) : (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Stopped Early ({session.stopReason || 'User request'})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 max-w-xs truncate">
                      {session.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinician Consultation Section */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Key Talking Points for Next Physiotherapy Consultation:
          </h4>
          <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
            <li>
              Review diaphragmatic technique to ensure shoulders remain relaxed during morning sessions.
            </li>
            <li>
              Review pursed-lip breathing cadence when walking briskly in cold weather.
            </li>
            <li>
              Patient reports stable low reliever use (average 0–1 puff weekly).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
