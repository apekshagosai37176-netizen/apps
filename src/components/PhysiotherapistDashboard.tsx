/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit3,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  CheckCircle2,
  Lock,
  ChevronRight,
  History,
  Send,
  Video
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExercisePrescription, PatientRecord } from '../types';

export const PhysiotherapistDashboard: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    currentPatient,
    updatePrescription,
    addClinicalNote,
    addAppointment,
    setActiveTab,
    setActiveVideoAppointment
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRxForEdit, setSelectedRxForEdit] = useState<ExercisePrescription | null>(null);

  // Edit prescription modal form state
  const [editInhale, setEditInhale] = useState<number>(3);
  const [editHold, setEditHold] = useState<number>(0);
  const [editExhale, setEditExhale] = useState<number>(4);
  const [editDuration, setEditDuration] = useState<number>(5);
  const [editFrequency, setEditFrequency] = useState<number>(2);
  const [editInstructions, setEditInstructions] = useState<string>('');
  const [changeReason, setChangeReason] = useState<string>('');

  // Clinical note state
  const [newNoteText, setNewNoteText] = useState('');

  // Appointment scheduler state
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [aptDate, setAptDate] = useState('2026-11-12');
  const [aptTime, setAptTime] = useState('14:00');
  const [aptType, setAptType] = useState<any>('Breathing Technique Review');

  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (rx: ExercisePrescription) => {
    setSelectedRxForEdit(rx);
    setEditInhale(rx.cadence.inhale);
    setEditHold(rx.cadence.hold);
    setEditExhale(rx.cadence.exhale);
    setEditDuration(rx.durationMinutes);
    setEditFrequency(rx.frequencyPerDay);
    setEditInstructions(rx.specialInstructions);
    setChangeReason('');
  };

  const handleSaveRxEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRxForEdit || !changeReason.trim()) return;

    updatePrescription(
      currentPatient.id,
      selectedRxForEdit.id,
      {
        durationMinutes: editDuration,
        frequencyPerDay: editFrequency,
        cadence: { inhale: editInhale, hold: editHold, exhale: editExhale },
        specialInstructions: editInstructions
      },
      changeReason
    );

    setSelectedRxForEdit(null);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addClinicalNote(currentPatient.id, newNoteText);
    setNewNoteText('');
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      physioId: 'phys-201',
      physioName: 'Dr. Sarah Jenkins, PT',
      date: aptDate,
      time: aptTime,
      durationMin: 30,
      type: aptType,
      consultationNotes: `Scheduled clinical follow-up for ${currentPatient.name}`
    });
    setIsSchedulingModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Clinician Portal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Cardiopulmonary Physiotherapy Clinical Console
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Patient Adherence & Prescription Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as Dr. Sarah Jenkins, PT, MSc Cardiopulmonary Physiotherapy · Lic #PT-84920
          </p>
        </div>

        <button
          onClick={() => setIsSchedulingModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors shadow-xs self-start sm:self-auto"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Tele-Rehab Session</span>
        </button>
      </div>

      {/* Main Roster & Patient Deep Dive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Patient Roster */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600" />
              Patient Roster ({patients.length})
            </h2>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or diagnosis..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Patient Cards List */}
          <div className="space-y-2">
            {filteredPatients.map(patient => {
              const isSelected = patient.id === selectedPatientId;
              const isAdherent = patient.adherenceRate >= 75;

              return (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-900">
                      {patient.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isAdherent ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {patient.adherenceRate}% Adherence
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{patient.diagnosis}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Age: {patient.age}</span>
                    <span>Last visit: {patient.lastVisitDate}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (2 spans): Active Patient File */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    {currentPatient.name}
                  </h2>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                    {currentPatient.asthmaSeverity}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Age {currentPatient.age} · Gender: {currentPatient.gender} · Consent Signed on {currentPatient.consentDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200/60 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Clinical Consent Active</span>
                </span>
              </div>
            </div>

            {/* Prescribed Medications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                  Maintenance Controller Inhaler
                </span>
                <span className="font-semibold text-slate-900">
                  {currentPatient.maintenanceInhaler}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                  Reliever Inhaler
                </span>
                <span className="font-semibold text-slate-900">
                  {currentPatient.relieverInhaler}
                </span>
              </div>
            </div>

            {/* Exercise Prescriptions Section with Edit Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Assigned Exercise Prescriptions & Target Ratios
                </h3>
                <span className="text-xs text-slate-500">
                  Click 'Calibrate Cadence' to modify with audit trail
                </span>
              </div>

              <div className="space-y-3">
                {currentPatient.prescriptions.map(rx => (
                  <div
                    key={rx.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{rx.title}</span>
                        <span className="text-[10px] font-mono text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                          {rx.cadence.inhale}s in · {rx.cadence.hold}s hold · {rx.cadence.exhale}s out
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{rx.specialInstructions}</p>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Dose: {rx.durationMinutes} min · {rx.frequencyPerDay}x daily · Assigned by {rx.assignedBy}
                      </div>
                    </div>

                    <button
                      onClick={() => openEditModal(rx)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-center shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Calibrate Cadence</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Symptom Diary & Reliever Usage Review for Clinician */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent Patient-Reported Diary Review
              </h3>
              <div className="space-y-2">
                {currentPatient.symptoms.slice(0, 3).map(sym => (
                  <div
                    key={sym.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900 mr-2">{sym.date}:</span>
                      <span>Dyspnea: {sym.dyspneaRating}/10</span> ·{' '}
                      <span>Cough: {sym.coughSeverity}</span> ·{' '}
                      <span>Reliever: {sym.relieverPuffs} puffs</span>
                    </div>
                    <span className="text-slate-500 italic max-w-xs truncate">
                      {sym.notes || 'No specific trigger noted'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Consultation Notes & Add Note */}
            <div className="space-y-4 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Physiotherapist Clinical Progress Notes
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentPatient.clinicalNotes.map(cn => (
                  <div key={cn.id} className="p-3 bg-teal-50/40 rounded-xl border border-teal-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-teal-900">
                      <span>{cn.author}</span>
                      <span className="font-mono text-slate-400">{cn.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{cn.note}</p>
                  </div>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Record objective physiotherapy observations (e.g. Diaphragmatic excursion improved, reduced sternocleidomastoid hyperactivity)..."
                  rows={2}
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Clinical Note</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Calibration Modal (with Mandatory Audit Trail) */}
      {selectedRxForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Calibrate Exercise Prescription: {selectedRxForEdit.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: {currentPatient.name} · All modifications are permanently logged in the clinical audit trail
                </p>
              </div>
              <button
                onClick={() => setSelectedRxForEdit(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRxEdit} className="space-y-4 text-xs">
              {/* Cadence controls */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Inhale (Sec)</label>
                  <input
                    type="number"
                    min="2"
                    max="6"
                    value={editInhale}
                    onChange={e => setEditInhale(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hold / Pause (Sec)</label>
                  <input
                    type="number"
                    min="0"
                    max="3"
                    value={editHold}
                    onChange={e => setEditHold(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-center font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Exhale (Sec)</label>
                  <input
                    type="number"
                    min="3"
                    max="8"
                    value={editExhale}
                    onChange={e => setEditExhale(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-center font-mono font-bold"
                  />
                </div>
              </div>

              {/* Duration and Frequency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <select
                    value={editDuration}
                    onChange={e => setEditDuration(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value={2}>2 Minutes</option>
                    <option value={5}>5 Minutes</option>
                    <option value={10}>10 Minutes</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Daily Frequency</label>
                  <select
                    value={editFrequency}
                    onChange={e => setEditFrequency(parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  >
                    <option value={1}>1 time daily</option>
                    <option value={2}>2 times daily</option>
                    <option value={3}>3 times daily</option>
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Physiotherapy Instructions
                </label>
                <textarea
                  value={editInstructions}
                  onChange={e => setEditInstructions(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              {/* Mandatory Reason for Audit Trail */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <label className="font-semibold text-amber-900 block">
                  Mandatory Clinical Justification (Audit Trail) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adjusted exhalation ratio following exertion tolerance test..."
                  value={changeReason}
                  onChange={e => setChangeReason(e.target.value)}
                  className="w-full p-2 bg-white border border-amber-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRxForEdit(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!changeReason.trim()}
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-lg"
                >
                  Confirm & Update Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Scheduler Modal */}
      {isSchedulingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Schedule Tele-Rehabilitation Session
              </h3>
              <button
                onClick={() => setIsSchedulingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleAppointment} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient</label>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-900">
                  {currentPatient.name} ({currentPatient.diagnosis})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={e => setAptDate(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time Slot</label>
                  <input
                    type="time"
                    required
                    value={aptTime}
                    onChange={e => setAptTime(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Consultation Type</label>
                <select
                  value={aptType}
                  onChange={e => setAptType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="Breathing Technique Review">Breathing Technique Review</option>
                  <option value="Exercise Progression & Adherence">Exercise Progression & Adherence</option>
                  <option value="Initial Tele-Rehab Assessment">Initial Tele-Rehab Assessment</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSchedulingModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
