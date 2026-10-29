/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Wind,
  CheckCircle2,
  Calendar,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
  Heart,
  TrendingUp,
  AlertCircle,
  FileText,
  Video
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BREATHING_EXERCISES } from '../data/initialData';

export const PatientDashboard: React.FC = () => {
  const {
    currentPatient,
    setActiveTab,
    setSelectedExerciseId,
    appointments,
    setActiveVideoAppointment
  } = useApp();

  // Find today's sessions count
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysSessions = currentPatient.sessions.filter(s =>
    s.startedAt.startsWith(todayStr)
  );

  // Latest symptom entry
  const latestSymptom = currentPatient.symptoms[0];

  // Upcoming appointment
  const upcomingApt = appointments.find(
    a => a.patientId === currentPatient.id && a.status === 'Upcoming'
  );

  const startExercise = (exerciseId: typeof currentPatient.prescriptions[0]['exerciseId']) => {
    setSelectedExerciseId(exerciseId);
    setActiveTab('coach');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/20 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-200 tracking-wide">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Breathe Better · Move Better · Live Better</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentPatient.name}
          </h1>

          <p className="text-sm text-teal-100 leading-relaxed">
            Your respiratory physiotherapy plan is active. Take a gentle 5-minute session today to maintain diaphragmatic coordination and ease airway tension.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedExerciseId(currentPatient.prescriptions[0]?.exerciseId || 'diaphragmatic');
                setActiveTab('coach');
              }}
              className="px-5 py-2.5 bg-white text-teal-900 font-semibold rounded-xl text-xs sm:text-sm hover:bg-teal-50 transition-colors shadow-sm flex items-center gap-2 active:scale-95"
            >
              <Wind className="w-4 h-4 text-teal-700" />
              <span>Start Today's Breathing Session</span>
            </button>

            <button
              onClick={() => setActiveTab('diary')}
              className="px-4 py-2.5 bg-teal-900/60 hover:bg-teal-900 text-teal-100 font-medium rounded-xl text-xs sm:text-sm transition-colors border border-teal-500/30 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Log Symptoms</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Adherence Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Weekly Adherence</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {currentPatient.adherenceRate}%
          </div>
          <span className="text-[11px] text-teal-700 font-medium">
            Target: 80%+ adherence
          </span>
        </div>

        {/* Total Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Sessions Completed</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {currentPatient.sessions.length}
          </div>
          <span className="text-[11px] text-slate-500">
            {todaysSessions.length} logged today
          </span>
        </div>

        {/* Practice Minutes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Practice</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {Math.round(
              currentPatient.sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / 60
            )}{' '}
            <span className="text-sm font-normal text-slate-500">min</span>
          </div>
          <span className="text-[11px] text-slate-500">Documented practice</span>
        </div>

        {/* Latest Borg Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Latest Breathlessness</span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {latestSymptom ? `${latestSymptom.dyspneaRating}/10` : '—'}
          </div>
          <span className="text-[11px] text-slate-500">
            {latestSymptom ? `Borg Scale · ${latestSymptom.date}` : 'Not logged today'}
          </span>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Today's Prescriptions & Adherence History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prescribed Exercises Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Today's Prescribed Regimen
                </h2>
                <p className="text-xs text-slate-500">
                  Assigned by {currentPatient.physioName}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('plan')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View Full Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {currentPatient.prescriptions.map(rx => {
                const exerciseDef = BREATHING_EXERCISES.find(e => e.id === rx.exerciseId);
                return (
                  <div
                    key={rx.id}
                    className="p-4 rounded-xl border border-slate-200/90 hover:border-teal-300 transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-slate-900">
                          {rx.title}
                        </h3>
                        <span className="text-[10px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {rx.durationMinutes} min · {rx.frequencyPerDay}x daily
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {rx.specialInstructions}
                      </p>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Prescribed Cadence: {rx.cadence.inhale}s Inhale · {rx.cadence.exhale}s Exhale
                      </div>
                    </div>

                    <button
                      onClick={() => startExercise(rx.exerciseId)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap self-start sm:self-center"
                    >
                      Start Exercise
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Adherence Chart Visual */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  7-Day Practice Adherence
                </h2>
                <p className="text-xs text-slate-500">
                  Minutes practiced per day over the past week
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                85% Weekly Consistency
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-4 grid grid-cols-7 gap-2 items-end h-36 border-b border-slate-100 pb-2">
              {[
                { day: 'Thu', mins: 10, date: 'Oct 22' },
                { day: 'Fri', mins: 10, date: 'Oct 23' },
                { day: 'Sat', mins: 5, date: 'Oct 24' },
                { day: 'Sun', mins: 10, date: 'Oct 25' },
                { day: 'Mon', mins: 5, date: 'Oct 26' },
                { day: 'Tue', mins: 10, date: 'Oct 27' },
                { day: 'Wed', mins: 5, date: 'Oct 28' }
              ].map((item, idx) => {
                const heightPercent = Math.min(100, (item.mins / 15) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono font-medium text-slate-500 tabular-nums">
                      {item.mins}m
                    </span>
                    <div
                      className="w-full max-w-[36px] bg-teal-500 hover:bg-teal-600 rounded-t-lg transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] font-medium text-slate-600">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Target: 10 minutes of gentle respiratory physiotherapy daily
            </p>
          </div>
        </div>

        {/* Right Column: Tele-Rehab Appointment, Clinical Tips & Safety Notes */}
        <div className="space-y-6">
          {/* Upcoming Tele-Rehabilitation Session Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-4 h-4" />
                Tele-Rehab
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Virtual Clinic</span>
            </div>

            {upcomingApt ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-teal-50/70 border border-teal-200/70 rounded-xl space-y-1.5">
                  <span className="text-[11px] font-semibold text-teal-800">
                    {upcomingApt.type}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-teal-700" />
                    <span>{upcomingApt.date} at {upcomingApt.time}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    With {upcomingApt.physioName}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveVideoAppointment(upcomingApt);
                    setActiveTab('telerehab');
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Consultation Room</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No upcoming appointments. Book your next tele-rehab review below.
              </p>
            )}
          </div>

          {/* Respiratory Physiotherapy Tip Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Clinical Practice Tip</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Check your neck and shoulders:</strong> When practicing diaphragmatic breathing, keep your hands resting gently on your abdomen. If you notice your collarbone or shoulders rising toward your ears, pause and consciously exhale through softly relaxed lips.
            </p>
            <button
              onClick={() => setActiveTab('education')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Explore Educational Articles</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Safety Reminder Card */}
          <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Clinical Disclaimer</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              BreatheWell is an educational coaching and adherence tool. It does not replace prescribed preventive or reliever inhalers, nor does it replace emergency medical evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
