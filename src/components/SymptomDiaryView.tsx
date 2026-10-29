/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  TrendingDown,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Clock,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityLevel } from '../types';

export const SymptomDiaryView: React.FC = () => {
  const { currentPatient, addSymptomLog, setIsEmergencyModalOpen } = useApp();

  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState(false);

  // Form state
  const [dyspneaRating, setDyspneaRating] = useState<number>(2);
  const [coughSeverity, setCoughSeverity] = useState<SeverityLevel>('Mild');
  const [wheezeSeverity, setWheezeSeverity] = useState<SeverityLevel>('None');
  const [chestTightness, setChestTightness] = useState<SeverityLevel>('None');
  const [exerciseTolerance, setExerciseTolerance] = useState<
    'Normal' | 'Slightly reduced' | 'Significantly reduced' | 'Severely limited'
  >('Normal');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [relieverPuffs, setRelieverPuffs] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  const triggerOptions = [
    'Cold air',
    'Pollen & grasses',
    'Dust & dust mites',
    'Physical exertion',
    'Viral infection / Flu',
    'Smoke / Air pollution',
    'Emotional stress',
    'Strong scents / Fumes'
  ];

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toTimeString().slice(0, 5);

    addSymptomLog({
      patientId: currentPatient.id,
      date: today,
      time: nowTime,
      dyspneaRating,
      coughSeverity,
      wheezeSeverity,
      chestTightness,
      exerciseTolerance,
      triggers: selectedTriggers,
      relieverPuffs,
      notes
    });

    // Check for high reliever use or severe dyspnea and warn
    if (relieverPuffs >= 4 || dyspneaRating >= 7) {
      setIsEmergencyModalOpen(true);
    }

    // Reset and close
    setNotes('');
    setSelectedTriggers([]);
    setRelieverPuffs(0);
    setDyspneaRating(2);
    setIsLoggingModalOpen(false);
  };

  // Get 7-day trend data
  const recentLogs = [...currentPatient.symptoms].slice(0, 7).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-teal-600" />
            <span>Asthma & Symptom Diary</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily breathlessness, triggers, and reliever inhaler use for discussion with your physiotherapist
          </p>
        </div>

        <button
          onClick={() => setIsLoggingModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-colors shadow-sm self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log Daily Symptoms</span>
        </button>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-2xl text-xs text-teal-900 flex items-start gap-3">
        <Activity className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">Educational Tracking Purpose:</strong>
          This diary is an adherence and monitoring tool. It is not intended to diagnose conditions or predict acute asthma attacks. If your reliever medication is not relieving symptoms or you need more than 4 puffs in a day, follow your written Asthma Action Plan and contact your clinician immediately.
        </div>
      </div>

      {/* 7-Day Trend Chart & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                7-Day Breathlessness Trend (Borg 0–10)
              </h2>
              <p className="text-xs text-slate-500">
                Self-reported dyspnea ratings over the past week
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Target: $\le 3$ (Mild)
            </span>
          </div>

          <div className="h-44 flex items-end gap-3 pt-6 pb-2 border-b border-slate-100">
            {recentLogs.map((entry, idx) => {
              const heightPercent = Math.max(10, (entry.dyspneaRating / 10) * 100);
              const isHigh = entry.dyspneaRating >= 5;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-700 tabular-nums">
                    {entry.dyspneaRating}
                  </span>
                  <div
                    className={`w-full max-w-[42px] rounded-t-lg transition-all ${
                      isHigh ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-500 hover:bg-teal-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${entry.date}: ${entry.dyspneaRating}/10 (${entry.notes || 'No notes'})`}
                  />
                  <span className="text-[10px] font-medium text-slate-500 truncate w-full text-center">
                    {entry.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
              Mild / Controlled (0–3)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Elevated / Moderate (4–6)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              Severe ($\ge 7$)
            </span>
          </div>
        </div>

        {/* Reliever Medication Tracker */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Reliever Inhaler Frequency
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Salbutamol (Ventolin) doses recorded this week
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-3xl font-extrabold font-mono text-teal-700 tabular-nums">
              {recentLogs.reduce((sum, item) => sum + item.relieverPuffs, 0)}
            </span>
            <span className="text-xs font-semibold text-slate-700 block">
              Total Puffs in Last 7 Days
            </span>
            <p className="text-[11px] text-slate-500">
              Low reliever use indicates well-controlled asthma baseline
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span>Maintenance Inhaler:</span>
              <span className="font-semibold text-slate-800 text-right text-[11px]">
                {currentPatient.maintenanceInhaler.split('(')[0]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Emergency Reliever:</span>
              <span className="font-semibold text-slate-800 text-right text-[11px]">
                {currentPatient.relieverInhaler.split('(')[0]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Symptom Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Symptom Records & Trigger History
            </h3>
            <p className="text-xs text-slate-500">
              Patient-reported diary entries documented for clinical review
            </p>
          </div>
          <span className="text-xs text-slate-500">
            {currentPatient.symptoms.length} entries total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Borg Dyspnea</th>
                <th className="py-3 px-4">Cough</th>
                <th className="py-3 px-4">Wheeze</th>
                <th className="py-3 px-4">Chest Tightness</th>
                <th className="py-3 px-4">Triggers</th>
                <th className="py-3 px-4">Reliever Puffs</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {currentPatient.symptoms.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-900 font-semibold">
                    {entry.date} · {entry.time}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono font-bold ${
                        entry.dyspneaRating >= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-50 text-teal-800'
                      }`}
                    >
                      {entry.dyspneaRating} / 10
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{entry.coughSeverity}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{entry.wheezeSeverity}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{entry.chestTightness}</td>
                  <td className="py-3 px-4">
                    {entry.triggers.length > 0 ? (
                      <span className="text-slate-700">{entry.triggers.join(', ')}</span>
                    ) : (
                      <span className="text-slate-400">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono font-semibold text-slate-800">
                    {entry.relieverPuffs} {entry.relieverPuffs === 1 ? 'puff' : 'puffs'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={entry.notes}>
                    {entry.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Daily Symptoms Modal Form */}
      {isLoggingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Log Today's Respiratory Symptoms
              </h2>
              <button
                onClick={() => setIsLoggingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs">
              {/* Dyspnea Scale Slider */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    Breathlessness Level (0 to 10 Modified Borg Scale)
                  </label>
                  <span className="font-mono font-bold text-base text-teal-700">
                    {dyspneaRating} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={dyspneaRating}
                  onChange={e => setDyspneaRating(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0: None</span>
                  <span>2: Slight</span>
                  <span>4: Somewhat severe</span>
                  <span>7: Very severe</span>
                  <span>10: Maximal</span>
                </div>
              </div>

              {/* Severity Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Cough Severity</label>
                  <select
                    value={coughSeverity}
                    onChange={e => setCoughSeverity(e.target.value as SeverityLevel)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="None">None</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Wheezing</label>
                  <select
                    value={wheezeSeverity}
                    onChange={e => setWheezeSeverity(e.target.value as SeverityLevel)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="None">None</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chest Tightness</label>
                  <select
                    value={chestTightness}
                    onChange={e => setChestTightness(e.target.value as SeverityLevel)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="None">None</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
              </div>

              {/* Reliever Puffs & Exercise Tolerance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Reliever Inhaler Puffs Today (e.g. Salbutamol)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={relieverPuffs}
                    onChange={e => setRelieverPuffs(parseInt(e.target.value, 10) || 0)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Exercise / Activity Tolerance
                  </label>
                  <select
                    value={exerciseTolerance}
                    onChange={e => setExerciseTolerance(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Normal">Normal activity tolerated</option>
                    <option value="Slightly reduced">Slightly reduced stamina</option>
                    <option value="Significantly reduced">Significantly reduced</option>
                    <option value="Severely limited">Severely limited</option>
                  </select>
                </div>
              </div>

              {/* Potential Triggers Multi-select */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  Reported Triggers Today
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {triggerOptions.map(trigger => {
                    const isSelected = selectedTriggers.includes(trigger);
                    return (
                      <button
                        type="button"
                        key={trigger}
                        onClick={() => toggleTrigger(trigger)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {trigger}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Optional Clinical Notes for Physiotherapist
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Morning walk was comfortable, evening wheeze after cold wind..."
                  rows={2}
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLoggingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Symptom Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
