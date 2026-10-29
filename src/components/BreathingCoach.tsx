/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Vibrate,
  VibrateOff,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { BREATHING_EXERCISES } from '../data/initialData';
import { ExerciseType, BreathingExercise } from '../types';
import { audioCoach } from '../utils/audioCoach';

type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'completed';

export const BreathingCoach: React.FC = () => {
  const {
    selectedExerciseId,
    setSelectedExerciseId,
    logBreathingSession,
    currentPatient,
    setIsEmergencyModalOpen
  } = useApp();

  // Active exercise definition
  const exercise: BreathingExercise =
    BREATHING_EXERCISES.find(e => e.id === selectedExerciseId) || BREATHING_EXERCISES[0];

  // Prescribed cadence if available
  const prescription = currentPatient.prescriptions.find(p => p.exerciseId === selectedExerciseId);

  // Cadence config with safe bounds
  const [cadence, setCadence] = useState({
    inhale: prescription ? prescription.cadence.inhale : exercise.defaultInhaleSec,
    hold: prescription ? prescription.cadence.hold : exercise.defaultHoldSec,
    exhale: prescription ? prescription.cadence.exhale : exercise.defaultExhaleSec
  });

  // Keep cadence synchronized when exercise changes
  useEffect(() => {
    const rx = currentPatient.prescriptions.find(p => p.exerciseId === selectedExerciseId);
    setCadence({
      inhale: rx ? rx.cadence.inhale : exercise.defaultInhaleSec,
      hold: rx ? rx.cadence.hold : exercise.defaultHoldSec,
      exhale: rx ? rx.cadence.exhale : exercise.defaultExhaleSec
    });
  }, [selectedExerciseId, currentPatient]);

  // Session duration (2, 5, or 10 min)
  const [targetDurationMin, setTargetDurationMin] = useState<number>(exercise.defaultDurationMin || 5);
  const targetDurationSeconds = targetDurationMin * 60;

  // Session state
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [phaseCountdown, setPhaseCountdown] = useState<number>(cadence.inhale);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

  // Audio / Voice / Haptic / Synthesized Breath preferences
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [breathSoundEnabled, setBreathSoundEnabled] = useState<boolean>(true);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState<boolean>(false);

  // Dyspnea Ratings
  const [preBorg, setPreBorg] = useState<number>(2);
  const [postBorg, setPostBorg] = useState<number>(1);
  const [postNotes, setPostNotes] = useState<string>('');
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [showStopConfirm, setShowStopConfirm] = useState<boolean>(false);
  const [stoppedReason, setStoppedReason] = useState<string>('');

  // Audio configuration updates
  useEffect(() => {
    audioCoach.setMuted(!soundEnabled);
  }, [soundEnabled]);

  useEffect(() => {
    audioCoach.setVoiceEnabled(voiceEnabled);
  }, [voiceEnabled]);

  useEffect(() => {
    audioCoach.setBreathSoundEnabled(breathSoundEnabled);
  }, [breathSoundEnabled]);

  // Main Breathing Cycle Engine
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        if (next >= targetDurationSeconds) {
          handleSessionCompletion();
          return targetDurationSeconds;
        }
        return next;
      });

      setPhaseCountdown(prev => {
        if (prev <= 1) {
          // Transition to next phase
          transitionToNextPhase();
          return 1;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, phase, cadence, targetDurationSeconds]);

  const transitionToNextPhase = () => {
    if (phase === 'inhale') {
      if (cadence.hold > 0) {
        setPhase('hold');
        setPhaseCountdown(cadence.hold);
        audioCoach.stopBreathSound();
        audioCoach.playHoldTone();
        if (voiceEnabled) audioCoach.speak('Pause comfortably');
      } else {
        setPhase('exhale');
        setPhaseCountdown(cadence.exhale);
        audioCoach.playExhaleChime();
        if (breathSoundEnabled) audioCoach.playBreathOutSound(cadence.exhale);
        if (vibrationEnabled) audioCoach.triggerVibration(60);
        if (voiceEnabled) audioCoach.speak('Breathe out gently');
      }
    } else if (phase === 'hold') {
      setPhase('exhale');
      setPhaseCountdown(cadence.exhale);
      audioCoach.playExhaleChime();
      if (breathSoundEnabled) audioCoach.playBreathOutSound(cadence.exhale);
      if (vibrationEnabled) audioCoach.triggerVibration(60);
      if (voiceEnabled) audioCoach.speak('Breathe out gently');
    } else if (phase === 'exhale') {
      setCyclesCompleted(c => c + 1);
      setPhase('inhale');
      setPhaseCountdown(cadence.inhale);
      audioCoach.playInhaleChime();
      if (breathSoundEnabled) audioCoach.playBreathInSound(cadence.inhale);
      if (vibrationEnabled) audioCoach.triggerVibration(80);
      if (voiceEnabled) audioCoach.speak('Breathe in smoothly');
    }
  };

  const handleStartSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setElapsedSeconds(0);
    setCyclesCompleted(0);
    setPhase('inhale');
    setPhaseCountdown(cadence.inhale);
    audioCoach.playInhaleChime();
    if (breathSoundEnabled) audioCoach.playBreathInSound(cadence.inhale);
    if (vibrationEnabled) audioCoach.triggerVibration(80);
    if (voiceEnabled) audioCoach.speak('Breathe in smoothly through your nose');
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      // Resume airflow sound according to current active phase
      if (breathSoundEnabled) {
        if (phase === 'inhale') {
          audioCoach.playBreathInSound(phaseCountdown);
        } else if (phase === 'exhale') {
          audioCoach.playBreathOutSound(phaseCountdown);
        }
      }
    } else {
      setIsPaused(true);
      audioCoach.stopBreathSound();
    }
  };

  const handleStopSession = (isEarlyAbortion: boolean = false, reason: string = '') => {
    setIsActive(false);
    setIsPaused(false);
    audioCoach.stopBreathSound();
    if (timerRef.current) clearInterval(timerRef.current);

    if (isEarlyAbortion) {
      // Aborted early due to symptoms or user request
      logBreathingSession({
        patientId: currentPatient.id,
        exerciseId: selectedExerciseId,
        exerciseTitle: exercise.title,
        startedAt: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
        targetMinutes: targetDurationMin,
        completedFully: false,
        preBorgDyspnea: preBorg,
        postBorgDyspnea: preBorg,
        stoppedEarly: true,
        stopReason: reason || 'Stopped early by user'
      });
      setPhase('idle');
      setShowStopConfirm(false);
    } else {
      setPhase('idle');
    }
  };

  const handleSessionCompletion = () => {
    setIsActive(false);
    setIsPaused(false);
    setPhase('completed');
    audioCoach.stopBreathSound();
    if (timerRef.current) clearInterval(timerRef.current);
    audioCoach.playCompletionChime();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored
    }
    setShowCompletionModal(true);
  };

  const handleSaveCompletedSession = () => {
    logBreathingSession({
      patientId: currentPatient.id,
      exerciseId: selectedExerciseId,
      exerciseTitle: exercise.title,
      startedAt: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      targetMinutes: targetDurationMin,
      completedFully: true,
      preBorgDyspnea: preBorg,
      postBorgDyspnea: postBorg,
      stoppedEarly: false,
      notes: postNotes
    });
    setShowCompletionModal(false);
    setPhase('idle');
    setElapsedSeconds(0);
  };

  // Safe visual speed adjustment
  const handleCadenceChange = (type: 'inhale' | 'hold' | 'exhale', delta: number) => {
    if (isActive) return;
    setCadence(prev => {
      let val = prev[type] + delta;
      // Clinical safety limits: inhale 2-6s, hold 0-3s, exhale 3-8s
      if (type === 'inhale') val = Math.max(2, Math.min(6, val));
      if (type === 'hold') val = Math.max(0, Math.min(3, val));
      if (type === 'exhale') val = Math.max(3, Math.min(8, val));
      return { ...prev, [type]: val };
    });
  };

  const handlePreviewBreathSound = () => {
    if (isPreviewPlaying || isActive) return;
    setIsPreviewPlaying(true);
    audioCoach.setMuted(false);
    audioCoach.setBreathSoundEnabled(true);
    // Preview: 2.5s gentle inhale airflow followed by 3s gentle exhale airflow
    audioCoach.playBreathInSound(2.5);
    setTimeout(() => {
      audioCoach.playBreathOutSound(3.0);
      setTimeout(() => {
        setIsPreviewPlaying(false);
        audioCoach.setBreathSoundEnabled(breathSoundEnabled);
        audioCoach.setMuted(!soundEnabled);
      }, 3100);
    }, 2600);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetDurationSeconds) * 100));

  // Visual expansion scaling: inhale goes from 0.85 to 1.35, hold stays at 1.35, exhale returns to 0.85
  const getCircleScale = () => {
    if (phase === 'inhale') {
      const fraction = 1 - phaseCountdown / cadence.inhale;
      return 0.85 + fraction * 0.45;
    }
    if (phase === 'hold') {
      return 1.3;
    }
    if (phase === 'exhale') {
      const fraction = 1 - phaseCountdown / cadence.exhale;
      return 1.3 - fraction * 0.45;
    }
    return 1.0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Clinician Safety Advisory Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Virtual Breathing Coach
            </h1>
            <p className="text-xs text-slate-500">
              Evidence-based respiratory physiotherapy pacing · Non-forced diaphragmatic & pursed-lip guidance
            </p>
          </div>
        </div>

        {/* Immediate Stop Guidance Button */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors whitespace-nowrap"
        >
          <Info className="w-4 h-4 text-amber-700" />
          <span>Stop if Dizziness or Pain Occurs</span>
        </button>
      </div>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BREATHING_EXERCISES.map(ex => {
          const isSelected = ex.id === selectedExerciseId;
          const isPrescribed = currentPatient.prescriptions.some(p => p.exerciseId === ex.id);

          return (
            <button
              key={ex.id}
              onClick={() => {
                if (!isActive) setSelectedExerciseId(ex.id);
              }}
              disabled={isActive}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-teal-50/70 border-teal-500 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              } ${isActive ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-500 tracking-tight">
                  {ex.category}
                </span>
                {isPrescribed && (
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded-md">
                    Prescribed
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-sm text-slate-900 mb-1 leading-snug">
                {ex.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2">
                {ex.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Coaching Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Visual Coach Arena */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[560px] relative overflow-hidden">
          {/* Subtle Ambient Background Ring */}
          <div className="absolute inset-0 bg-radial from-teal-50/40 via-transparent to-transparent pointer-events-none" />

          {/* Top Stage Bar: Cadence, Elapsed, and Audio Controls */}
          <div className="w-full flex items-center justify-between gap-4 z-10 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Session Progress
              </span>
              <span className="text-sm font-mono font-bold text-slate-800 tabular-nums">
                {formatTime(elapsedSeconds)} / {formatTime(targetDurationSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  soundEnabled
                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  voiceEnabled
                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title={voiceEnabled ? 'Disable Voice Guidance' : 'Enable Gentle Voice Prompts'}
                aria-label="Toggle Voice"
              >
                {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setVibrationEnabled(!vibrationEnabled)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  vibrationEnabled
                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title={vibrationEnabled ? 'Vibration On' : 'Vibration Off'}
                aria-label="Toggle Vibration"
              >
                {vibrationEnabled ? <Vibrate className="w-4 h-4" /> : <VibrateOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setBreathSoundEnabled(!breathSoundEnabled)}
                className={`p-2 rounded-lg border text-xs transition-colors ${
                  breathSoundEnabled
                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title={breathSoundEnabled ? 'Disable Synthesized Airflow Cues' : 'Enable Synthesized Airflow Cues'}
                aria-label="Toggle Breath-In and Breath-Out Audio Cues"
              >
                <Wind className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Animated Breathing Sphere */}
          <div className="my-auto py-8 flex flex-col items-center justify-center relative w-full">
            {/* Outer Expansion Halo */}
            <div
              className="w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-transform duration-1000 ease-in-out relative"
              style={{
                transform: `scale(${isActive ? getCircleScale() : 1.0})`,
                transitionDuration:
                  phase === 'inhale'
                    ? `${cadence.inhale}s`
                    : phase === 'exhale'
                    ? `${cadence.exhale}s`
                    : `${cadence.hold || 1}s`
              }}
            >
              {/* Outer Radiant Glow */}
              <div
                className={`absolute inset-0 rounded-full transition-opacity duration-700 ${
                  phase === 'inhale'
                    ? 'bg-gradient-to-tr from-teal-400/30 to-sky-300/30 blur-2xl opacity-90'
                    : phase === 'hold'
                    ? 'bg-gradient-to-tr from-sky-400/30 to-teal-300/30 blur-2xl opacity-90'
                    : phase === 'exhale'
                    ? 'bg-gradient-to-tr from-teal-600/20 to-emerald-400/20 blur-2xl opacity-60'
                    : 'bg-teal-100/40 blur-xl opacity-40'
                }`}
              />

              {/* Main Breathing Core Ring */}
              <div
                className={`w-60 h-60 sm:w-68 sm:h-68 rounded-full border-4 flex flex-col items-center justify-center text-center p-6 shadow-xl transition-all duration-700 relative z-10 ${
                  phase === 'inhale'
                    ? 'bg-gradient-to-b from-teal-500 to-teal-600 border-teal-300 text-white shadow-teal-500/30'
                    : phase === 'hold'
                    ? 'bg-gradient-to-b from-sky-600 to-teal-600 border-sky-300 text-white shadow-sky-500/30'
                    : phase === 'exhale'
                    ? 'bg-gradient-to-b from-teal-700 to-teal-800 border-teal-400 text-white shadow-teal-700/30'
                    : 'bg-gradient-to-b from-slate-100 to-white border-slate-300 text-slate-700 shadow-slate-200'
                }`}
              >
                {!isActive ? (
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                      Ready to Begin
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {exercise.title}
                    </h2>
                    <p className="text-xs text-slate-600 max-w-[200px] mx-auto">
                      Sit upright with dropped shoulders. Inhale gently through nose.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="text-xs uppercase tracking-widest font-semibold text-teal-100">
                      {phase === 'inhale' && 'Breathe In Slowly'}
                      {phase === 'hold' && 'Pause Gently'}
                      {phase === 'exhale' && (selectedExerciseId === 'pursed_lip' ? 'Exhale Through Pursed Lips' : 'Release Breath Smoothly')}
                    </span>
                    <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight tabular-nums">
                      {phaseCountdown}
                    </div>
                    <span className="text-[11px] text-teal-100 font-medium">
                      Cycle {cyclesCompleted + 1}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* In-Session Instruction Tip */}
            {isActive && (
              <div className="mt-8 text-center max-w-md">
                <p className="text-xs font-medium text-slate-600">
                  {phase === 'inhale' && 'Allow your lower belly and ribs to expand naturally. Avoid raising your shoulders.'}
                  {phase === 'hold' && 'Relax your throat muscles. Do not grip or close your throat tightly.'}
                  {phase === 'exhale' && 'Release the breath effortlessly. Never force air out or empty lungs completely.'}
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar & Primary Controls */}
          <div className="w-full space-y-4 z-10 pt-4 border-t border-slate-100">
            {/* Progress track */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!isActive ? (
                  <button
                    onClick={handleStartSession}
                    className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-teal-600/20 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Session</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handlePauseResume}
                      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs"
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </button>

                    <button
                      onClick={() => setShowStopConfirm(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Finish Early</span>
                    </button>
                  </>
                )}
              </div>

              {/* Safety Abort Button */}
              {isActive && (
                <button
                  onClick={() => {
                    handleStopSession(true, 'User felt sudden breathlessness or dizziness');
                    setIsEmergencyModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <span>Feeling Unwell? Stop Now</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Prescription, Cadence Settings, and Clinical Advice */}
        <div className="space-y-6">
          {/* Target Duration Selector Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Session Duration
              </h3>
              <span className="text-xs text-slate-500">Clinician Standard</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[2, 5, 10].map(mins => (
                <button
                  key={mins}
                  onClick={() => !isActive && setTargetDurationMin(mins)}
                  disabled={isActive}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                    targetDurationMin === mins
                      ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  } ${isActive ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>

          {/* Cadence Fine-Tuning (Safe Boundaries) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Breathing Ratio (Seconds)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Calibrated within safe cardiopulmonary boundaries
                </p>
              </div>
              {prescription && (
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Physio Prescribed
                </span>
              )}
            </div>

            <div className="space-y-3">
              {/* Inhale */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Inhale</span>
                  <span className="text-[10px] text-slate-500 block">Nose, belly out</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCadenceChange('inhale', -1)}
                    disabled={isActive || cadence.inhale <= 2}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {cadence.inhale}s
                  </span>
                  <button
                    onClick={() => handleCadenceChange('inhale', 1)}
                    disabled={isActive || cadence.inhale >= 6}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Hold */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Pause / Hold</span>
                  <span className="text-[10px] text-slate-500 block">Soft throat pause</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCadenceChange('hold', -1)}
                    disabled={isActive || cadence.hold <= 0}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {cadence.hold}s
                  </span>
                  <button
                    onClick={() => handleCadenceChange('hold', 1)}
                    disabled={isActive || cadence.hold >= 3}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Exhale */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Exhale</span>
                  <span className="text-[10px] text-slate-500 block">Gentle, unforced</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCadenceChange('exhale', -1)}
                    disabled={isActive || cadence.exhale <= 3}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {cadence.exhale}s
                  </span>
                  <button
                    onClick={() => handleCadenceChange('exhale', 1)}
                    disabled={isActive || cadence.exhale >= 8}
                    className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Comfort: Synthesized Breath Airflow Cues Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
                  <Wind className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                    Breath Flow Audio Cue
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Synthesized airflow during inhale & exhale
                  </span>
                </div>
              </div>

              {/* Accessible Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={breathSoundEnabled}
                onClick={() => setBreathSoundEnabled(!breathSoundEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  breathSoundEnabled ? 'bg-teal-600' : 'bg-slate-200'
                }`}
                title={breathSoundEnabled ? 'Disable breath flow sound' : 'Enable breath flow sound'}
              >
                <span className="sr-only">Toggle synthesized breath audio cue</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    breathSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Provides an organic, subtle rushing sound that swells during inhalation and eases during exhalation, helping you pace rhythm without looking at the screen.
            </p>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className={`font-medium ${breathSoundEnabled ? 'text-teal-700' : 'text-slate-400'}`}>
                {breathSoundEnabled ? 'Airflow Sound: Enabled' : 'Airflow Sound: Disabled'}
              </span>

              <button
                type="button"
                disabled={isActive || isPreviewPlaying}
                onClick={handlePreviewBreathSound}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors disabled:opacity-50"
              >
                {isPreviewPlaying ? 'Playing Sample...' : 'Test Sample'}
              </button>
            </div>
          </div>

          {/* Exercise Details Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Technique & Precautions
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <span className="font-semibold text-slate-800 block mb-1">
                  How to Practice:
                </span>
                <ol className="list-decimal pl-4 space-y-1">
                  {exercise.techniqueSteps.slice(0, 3).map((st, i) => (
                    <li key={i}>{st}</li>
                  ))}
                </ol>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900">
                <span className="font-semibold block mb-0.5">Precautions:</span>
                <p>{exercise.precautions[0]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Breathing Session Completed!
              </h2>
              <p className="text-xs text-slate-600">
                Well done! You practiced {exercise.title} for{' '}
                <span className="font-mono font-semibold">{formatTime(elapsedSeconds)}</span>.
              </p>
            </div>

            {/* Post-Session Modified Borg Rating */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-800 block">
                How does your breathing feel right now? (0 - 10 Borg Dyspnea)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={postBorg}
                  onChange={e => setPostBorg(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <span className="font-mono font-bold text-base text-teal-700 w-8 text-center tabular-nums">
                  {postBorg}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 (Effortless)</span>
                <span>3 (Moderate)</span>
                <span>5 (Heavy)</span>
                <span>10 (Maximum)</span>
              </div>
            </div>

            {/* Notes input */}
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Optional Reflection Notes
              </label>
              <textarea
                value={postNotes}
                onChange={e => setPostNotes(e.target.value)}
                placeholder="e.g., Shoulders felt relaxed, slight cough early on..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleSaveCompletedSession}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
              >
                Save & Log to Progress History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stop Early Confirmation Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Finish Session Early?</h3>
            <p className="text-xs text-slate-600">
              You have completed {formatTime(elapsedSeconds)} of your {targetDurationMin}-minute goal. Would you like to log this partial session?
            </p>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Reason for stopping early:
              </label>
              <select
                value={stoppedReason}
                onChange={e => setStoppedReason(e.target.value)}
                className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Completed sufficient practice for now">Sufficient practice for now</option>
                <option value="Interrupted by daily activity">Interrupted by daily activity</option>
                <option value="Mild throat tickle or cough">Mild throat tickle or cough</option>
                <option value="Felt light-headed or tired">Felt light-headed or tired</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowStopConfirm(false)}
                className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Continue Practice
              </button>
              <button
                onClick={() => handleStopSession(true, stoppedReason || 'Partial session completed')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Log Partial Practice & Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
