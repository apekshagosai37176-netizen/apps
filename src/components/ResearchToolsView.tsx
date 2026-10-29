/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FlaskConical,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Database,
  ShieldAlert,
  Info,
  HelpCircle,
  FileCode
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESEARCH_DATA_DICTIONARY } from '../data/initialData';

export const ResearchToolsView: React.FC = () => {
  const { submitSUSSurvey, susSurveys, patients, currentPatient } = useApp();

  // 10 Standard System Usability Scale Questions (Brooke, 1996)
  const susQuestions = [
    'I think that I would like to use this breathing coach app frequently.',
    'I found the application unnecessarily complex.',
    'I thought the breathing coach interface was easy to use.',
    'I think that I would need the support of a technical person to be able to use this app.',
    'I found the various functions in this app were well integrated.',
    'I thought there was too much inconsistency in this app.',
    'I would imagine that most people would learn to use this breathing coach very quickly.',
    'I found the breathing coach very cumbersome or awkward to use.',
    'I felt very confident using the breathing coach and symptom diary.',
    'I needed to learn a lot of things before I could get going with this application.'
  ];

  // Survey responses (1 to 5)
  const [responses, setResponses] = useState<number[]>([4, 2, 5, 1, 5, 1, 5, 1, 4, 1]);
  const [comments, setComments] = useState('');
  const [lastCalculatedScore, setLastCalculatedScore] = useState<number | null>(null);

  const handleResponseChange = (index: number, val: number) => {
    const updated = [...responses];
    updated[index] = val;
    setResponses(updated);
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = submitSUSSurvey(responses, comments);
    setLastCalculatedScore(score);
  };

  // Export de-identified dataset (CSV / JSON)
  const handleExportJSON = () => {
    const deidentifiedSessions = patients.flatMap(p =>
      p.sessions.map((s, idx) => ({
        anonymized_patient_token: `PT-${p.id.split('-')[1]}`,
        session_id: s.id,
        exercise_type: s.exerciseId,
        duration_seconds: s.durationSeconds,
        target_minutes: s.targetMinutes,
        completed_fully: s.completedFully,
        pre_borg_dyspnea: s.preBorgDyspnea,
        post_borg_dyspnea: s.postBorgDyspnea,
        stopped_early: s.stoppedEarly,
        stop_reason: s.stopReason || null,
        timestamp_utc: s.startedAt
      }))
    );

    const blob = new Blob([JSON.stringify(deidentifiedSessions, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breathewell_anonymized_research_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = [
      'anonymized_patient_token',
      'session_id',
      'exercise_type',
      'duration_seconds',
      'target_minutes',
      'completed_fully',
      'pre_borg_dyspnea',
      'post_borg_dyspnea',
      'timestamp_utc'
    ];

    const rows = patients.flatMap(p =>
      p.sessions.map(s => [
        `PT-${p.id.split('-')[1]}`,
        s.id,
        s.exerciseId,
        s.durationSeconds,
        s.targetMinutes,
        s.completedFully,
        s.preBorgDyspnea,
        s.postBorgDyspnea,
        s.startedAt
      ])
    );

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `breathewell_research_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              App Version: v1.2.0-clinical (Build 2026.10)
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5 mt-1">
            <FlaskConical className="w-6 h-6 text-teal-600" />
            <span>Research-Ready Architecture & Usability Tools</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Standardized System Usability Scale (SUS) instrument, research data dictionary, and anonymized de-identified exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-teal-700" />
            <span>Export Research CSV</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export De-Identified JSON</span>
          </button>
        </div>
      </div>

      {/* Ethics & Institutional Governance Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 text-xs text-slate-700">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold text-slate-900 mb-0.5">
            Ethics & Human-Participant Research Compliance
          </strong>
          This application provides a research-ready structural framework. Any formal clinical investigation, prospective usability trial, or secondary data analysis must be approved by an accredited Institutional Review Board (IRB) or Human Research Ethics Committee (HREC), with explicit signed informed consent from participants.
        </div>
      </div>

      {/* Grid: Usability Survey & Data Dictionary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): System Usability Scale Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                System Usability Scale (SUS) Instrument
              </h2>
              <p className="text-xs text-slate-500">
                Validated 10-item questionnaire (Brooke, 1996) with standardized 0–100 percentile scoring
              </p>
            </div>
            {lastCalculatedScore !== null && (
              <div className="bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-teal-700 block font-semibold uppercase">
                  Calculated Score
                </span>
                <span className="text-lg font-bold font-mono text-teal-800">
                  {lastCalculatedScore} / 100
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSurveySubmit} className="space-y-4">
            <div className="space-y-4">
              {susQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 space-y-2"
                >
                  <p className="text-xs font-semibold text-slate-800">
                    {idx + 1}. {q}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-600 gap-1 sm:gap-2">
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      Strongly Disagree (1)
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {[1, 2, 3, 4, 5].map(val => (
                        <label
                          key={val}
                          className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`sus-q-${idx}`}
                            value={val}
                            checked={responses[idx] === val}
                            onChange={() => handleResponseChange(idx, val)}
                            className="accent-teal-600 cursor-pointer"
                          />
                          <span className="text-[11px] font-mono text-slate-600">{val}</span>
                        </label>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">
                      Strongly Agree (5)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Participant Qualitative Comments / Feedback
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Participant notes on breathing circle visual smoothness, chime tone, or symptom logging ease..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
            >
              Calculate SUS Score & Store Research Record
            </button>
          </form>

          {/* Past SUS Submissions */}
          {susSurveys.length > 0 && (
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Logged Usability Responses ({susSurveys.length})
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {susSurveys.map(s => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs flex items-center justify-between"
                  >
                    <span>
                      Respondent: <strong>{s.userRole}</strong> · Score:{' '}
                      <strong className="text-teal-700">{s.calculatedScore}/100</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {s.completedAt.slice(0, 16)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Research Data Dictionary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Research Data Dictionary
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Transparent schema defining variable definitions, data types, and clinical measurements
          </p>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {RESEARCH_DATA_DICTIONARY.map((dict, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{dict.variable}</span>
                  <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono">
                    {dict.type}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{dict.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
