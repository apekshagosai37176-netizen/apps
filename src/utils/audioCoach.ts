/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioCoach {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private voiceEnabled: boolean = false;
  private breathSoundEnabled: boolean = true;

  // Active breath airflow nodes for clean interruption and envelope control
  private activeNoiseSource: AudioBufferSourceNode | null = null;
  private activeNoiseGain: GainNode | null = null;
  private activeNoiseFilter: BiquadFilterNode | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBreathSound();
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public setBreathSoundEnabled(enabled: boolean) {
    this.breathSoundEnabled = enabled;
    if (!enabled) {
      this.stopBreathSound();
    }
  }

  public getBreathSoundEnabled(): boolean {
    return this.breathSoundEnabled;
  }

  /**
   * Generates a smooth, loopable pink/filtered white noise buffer
   */
  private createNoiseBuffer(ctx: AudioContext, seconds: number = 10): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Pink-noise approximation using Paul Kellet's filter for natural airflow
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    let b4 = 0;
    let b5 = 0;
    let b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    return buffer;
  }

  /**
   * Stops any currently playing synthesized airflow noise cleanly with smooth fade-out
   */
  public stopBreathSound() {
    if (this.activeNoiseGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.activeNoiseGain.gain.cancelScheduledValues(now);
        this.activeNoiseGain.gain.setValueAtTime(this.activeNoiseGain.gain.value, now);
        this.activeNoiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
      } catch {
        // Fallback
      }
    }
    if (this.activeNoiseSource) {
      try {
        const src = this.activeNoiseSource;
        setTimeout(() => {
          try {
            src.stop();
            src.disconnect();
          } catch {
            // Already stopped
          }
        }, 90);
      } catch {
        // Ignored
      }
      this.activeNoiseSource = null;
      this.activeNoiseGain = null;
      this.activeNoiseFilter = null;
    }
  }

  /**
   * Synthesizes a subtle, ambient 'breath-in' airflow sound matching inhale duration
   */
  public playBreathInSound(durationSec: number = 3) {
    if (this.isMuted || !this.breathSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.stopBreathSound();

      const noiseBuffer = this.createNoiseBuffer(ctx, Math.max(durationSec + 1, 4));
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      // Bandpass filter that gently glides upwards from 260Hz to 580Hz (nasal expansion)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.8, ctx.currentTime);
      filter.frequency.setValueAtTime(260, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + durationSec);

      // Smooth gain envelope: gentle swell to comfortable max 0.038
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      // Gentle swell reaching peak at 65% of the inhale
      gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + durationSec * 0.65);
      // Soft tapering near the top
      gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + durationSec - 0.08);
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      source.stop(ctx.currentTime + durationSec);

      this.activeNoiseSource = source;
      this.activeNoiseGain = gain;
      this.activeNoiseFilter = filter;
    } catch {
      // Fail gracefully
    }
  }

  /**
   * Synthesizes a subtle, relaxing 'breath-out' airflow sound matching exhale duration
   */
  public playBreathOutSound(durationSec: number = 4) {
    if (this.isMuted || !this.breathSoundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      this.stopBreathSound();

      const noiseBuffer = this.createNoiseBuffer(ctx, Math.max(durationSec + 1, 5));
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      // Bandpass/Lowpass filter that gently glides downwards from 540Hz to 200Hz (warm release)
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(1.4, ctx.currentTime);
      filter.frequency.setValueAtTime(540, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + durationSec);

      // Smooth gain envelope: gentle initial rise to 0.032, then steady soothing taper
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.032, ctx.currentTime + 0.35);
      // Prolonged gentle exhalation release
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + durationSec * 0.85);
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      source.stop(ctx.currentTime + durationSec);

      this.activeNoiseSource = source;
      this.activeNoiseGain = gain;
      this.activeNoiseFilter = filter;
    } catch {
      // Fail gracefully
    }
  }

  /**
   * Plays a soothing, harmonic sine chime for the Inhale phase
   */
  public playInhaleChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Rising gentle solfeggio frequency: 432 Hz to 528 Hz
      osc.frequency.setValueAtTime(432, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(528, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch {
      // Audio playback fails gracefully if not permitted yet
    }
  }

  /**
   * Plays a warm, descending grounding chime for Exhale phase
   */
  public playExhaleChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Descending calming frequency: 396 Hz to 264 Hz
      osc.frequency.setValueAtTime(396, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(264, ctx.currentTime + 1.4);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.7);
    } catch {
      // Fail gracefully
    }
  }

  /**
   * Plays a soft gentle tone for Hold / Pause phase
   */
  public playHoldTone() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    } catch {
      // Fail gracefully
    }
  }

  /**
   * Plays an alert chime when session completes
   */
  public playCompletionChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const chordNotes = [528, 660, 792];
      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + idx * 0.15 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.15);
        osc.stop(ctx.currentTime + idx * 0.15 + 1.3);
      });
    } catch {
      // Fail gracefully
    }
  }

  /**
   * Optional speech guidance using browser Web Speech API
   */
  public speak(phrase: string) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.88; // gentle, unhurried cadence
      utterance.pitch = 1.0;
      utterance.volume = 0.75;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful degradation
    }
  }

  /**
   * Optional gentle vibration cue on supported mobile devices
   */
  public triggerVibration(pattern: number | number[] = 70) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignored
      }
    }
  }
}

export const audioCoach = new AudioCoach();
