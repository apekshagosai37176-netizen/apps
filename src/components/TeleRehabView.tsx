/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Share2,
  FileText,
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';

export const TeleRehabView: React.FC = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    currentPatient,
    role,
    activeVideoAppointment,
    setActiveVideoAppointment
  } = useApp();

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState('2026-11-09');
  const [selectedTime, setSelectedTime] = useState('15:00');
  const [consultType, setConsultType] = useState<any>('Breathing Technique Review');

  // Video Room Simulated State
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [activeChecklist, setActiveChecklist] = useState<string[]>([
    'Demonstrate resting diaphragmatic excursion',
    'Assess neck accessory muscle relaxation',
    'Review pursed-lip breathing cadence',
    'Verify spacer technique for prescribed inhaler'
  ]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [inCallNotes, setInCallNotes] = useState('');

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeVideoAppointment) {
      interval = setInterval(() => {
        setCallDurationSec(c => c + 1);
      }, 1000);
    } else {
      setCallDurationSec(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeVideoAppointment]);

  const toggleCheck = (item: string) => {
    if (checkedItems.includes(item)) {
      setCheckedItems(checkedItems.filter(i => i !== item));
    } else {
      setCheckedItems([...checkedItems, item]);
    }
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    addAppointment({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      physioId: 'phys-201',
      physioName: 'Dr. Sarah Jenkins, PT',
      date: selectedDate,
      time: selectedTime,
      durationMin: 30,
      type: consultType,
      consultationNotes: 'Patient booked tele-rehab appointment via portal'
    });
    alert('Tele-Rehabilitation appointment booked successfully!');
  };

  const handleEndCall = () => {
    if (activeVideoAppointment && inCallNotes.trim()) {
      updateAppointment(activeVideoAppointment.id, {
        status: 'Completed',
        consultationNotes: inCallNotes
      });
    }
    setActiveVideoAppointment(null);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Video className="w-6 h-6 text-teal-600" />
          <span>Physiotherapist-Guided Tele-Rehabilitation</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Virtual consultations, breathing posture reviews, and exercise progression with Dr. Sarah Jenkins, PT
        </p>
      </div>

      {/* Simulated Integration Notice */}
      <div className="p-4 bg-teal-50/60 border border-teal-200/80 rounded-2xl text-xs text-teal-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-semibold">WebRTC Tele-Rehab Demonstration Interface:</strong>
          This consultation room is a functional simulated demonstration interface designed for clinical tele-rehabilitation testing. To deploy in production, integrate a certified HIPAA/GDPR-compliant WebRTC media service (e.g., Twilio Video, Daily.co, or Agora WebRTC) using server-side signaling.
        </div>
      </div>

      {/* If Video Call is Active: Render the Video Room */}
      {activeVideoAppointment ? (
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl border border-slate-800">
          {/* Room Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                  Live Consultation ({formatTimer(callDurationSec)})
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeVideoAppointment.type} · {activeVideoAppointment.patientName} & {activeVideoAppointment.physioName}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                Room: {activeVideoAppointment.videoRoomId}
              </span>
            </div>
          </div>

          {/* Video Arena (Split Patient & Clinician) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Clinician Tile */}
            <div className="aspect-video bg-slate-800 rounded-2xl relative overflow-hidden border border-slate-700 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-700/60 text-teal-200 flex items-center justify-center text-xl font-bold mb-3 border-2 border-teal-400">
                SJ
              </div>
              <h3 className="font-semibold text-sm text-white">Dr. Sarah Jenkins, PT</h3>
              <p className="text-xs text-teal-300">Lead Respiratory Physiotherapist</p>
              <div className="absolute bottom-3 left-3 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300">
                Clinician Feed · 1080p WebRTC
              </div>
            </div>

            {/* Patient Tile */}
            <div className="aspect-video bg-slate-800 rounded-2xl relative overflow-hidden border border-slate-700 flex flex-col items-center justify-center p-6 text-center">
              {isCameraOn ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-xl font-bold mb-3 border-2 border-slate-500">
                    AJ
                  </div>
                  <h3 className="font-semibold text-sm text-white">{activeVideoAppointment.patientName}</h3>
                  <p className="text-xs text-slate-400">Patient · Posture & Breathing Review</p>
                </>
              ) : (
                <div className="text-slate-400 text-xs">Camera is muted</div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-slate-300">
                Self View · {isCameraOn ? 'Camera Active' : 'Camera Off'}
              </div>
            </div>
          </div>

          {/* Clinician Checklist & Clinical Notes inside Call */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Interactive Checklist */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Tele-Rehab Assessment Checklist
              </h4>
              <div className="space-y-1.5 text-xs text-slate-300">
                {activeChecklist.map((item, idx) => {
                  const isChecked = checkedItems.includes(item);
                  return (
                    <button
                      key={idx}
                      onClick={() => toggleCheck(item)}
                      className="flex items-center gap-2 w-full text-left hover:text-white p-1 rounded transition-colors"
                    >
                      <CheckCircle
                        className={`w-4 h-4 shrink-0 ${
                          isChecked ? 'text-teal-400' : 'text-slate-600'
                        }`}
                      />
                      <span className={isChecked ? 'line-through text-slate-500' : ''}>
                        {item}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* In-Call Notes */}
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Consultation Notes & Follow-up
              </h4>
              <textarea
                value={inCallNotes}
                onChange={e => setInCallNotes(e.target.value)}
                placeholder="Type real-time clinical notes (e.g. Diaphragmatic excursion symmetrical, advised 3s:5s ratio)..."
                rows={3}
                className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full border transition-colors ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsCameraOn(!isCameraOn)}
              className={`p-3 rounded-full border transition-colors ${
                isCameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-red-600 text-white'
              }`}
              title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={handleEndCall}
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Consultation</span>
            </button>
          </div>
        </div>
      ) : (
        /* Appointment Listing & Booking View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 spans): Appointments List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Scheduled Tele-Rehab Consultations
              </h2>

              <div className="space-y-3">
                {appointments.map(apt => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{apt.type}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            apt.status === 'Upcoming'
                              ? 'bg-teal-100/70 text-teal-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          {apt.date} at {apt.time} ({apt.durationMin} mins)
                        </span>
                        <span>·</span>
                        <span>With {apt.physioName}</span>
                      </div>
                      {apt.consultationNotes && (
                        <p className="text-[11px] text-slate-500 italic">
                          Notes: {apt.consultationNotes}
                        </p>
                      )}
                    </div>

                    {apt.status === 'Upcoming' && (
                      <button
                        onClick={() => setActiveVideoAppointment(apt)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-center shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Enter Video Room</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Book New Consultation */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Book Tele-Rehab Session
            </h2>
            <p className="text-xs text-slate-500">
              Select date and time for a 1-on-1 virtual breathing review with your physiotherapist
            </p>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Consultation Type</label>
                <select
                  value={consultType}
                  onChange={e => setConsultType(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="Breathing Technique Review">Breathing Technique Review (30 min)</option>
                  <option value="Exercise Progression & Adherence">Exercise Progression & Adherence (30 min)</option>
                  <option value="Initial Tele-Rehab Assessment">Initial Tele-Rehab Assessment (45 min)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Date</label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Available Slot</label>
                <select
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:30">04:30 PM</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
              >
                Request Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
