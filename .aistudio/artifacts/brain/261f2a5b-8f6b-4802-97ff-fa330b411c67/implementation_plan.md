# Synthesized 'Breath-In' & 'Breath-Out' Audio Cues with Comfort Toggle

Implement an organic, ultra-subtle synthesized airflow sound for both inhalation and exhalation phases in the `BreathingCoach` component, accompanied by a dedicated user comfort toggle switch.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The synthesized breath sound will use low-amplitude, bandpass-filtered noise synthesis (Web Audio API) rather than harsh synthetic tones or recorded audio files. This creates a soft, natural ambient airflow sensation that mimics calm breathing without jarring sudden clicks or intrusive white noise.

- **Confirmed Decision 1 (Audio Synthesis Method)**: Native Web Audio API procedural audio using an AudioBufferSourceNode with pink/white noise passed through a dynamic BiquadFilterNode (`bandpass`/`lowpass`). Inhalation sweeps frequencies upward (250Hz $\rightarrow$ 600Hz) to represent nasal intake; exhalation sweeps frequencies downward (550Hz $\rightarrow$ 200Hz) to represent calm, unforced expiration.
- **Confirmed Decision 2 (User Comfort Toggle & Controls)**: A dedicated toggle switch with visual status (`Wind` / airflow icon + switch) positioned both in the top quick-controls bar of `BreathingCoach` and in the settings drawer, allowing instant enabling/disabling at any point during or before a session.
- **Confirmed Decision 3 (Default State & Volume Envelope)**: Enabled with an ultra-soft amplitude ceiling ($\le 0.04$ gain) so it blends harmoniously behind the gentle phase chimes, with zero latency and automatic fade-out upon pause or stop.

---

### 1. Overview & Core Concept

- **What It Does**: Provides auditory breathing synchronization through a gentle, continuous rushing sound during inhale and exhale phases, helping users pace their breathing rhythm even with eyes closed or softly unfocused.
- **Target Audience**: Adults with asthma or dyspnea who benefit from multi-sensory pacing (combining visual sphere expansion with natural respiratory sound cues).
- **Key Value**: Enhances sensory feedback without requiring gaze fixation on the screen, improving relaxation and adherence.

---

### 2. User Experience & Visual Design

- **Quick-Control Bar in `BreathingCoach`**:
  - Add an airflow audio button alongside chime, voice, and vibration toggles.
  - Active state: Teal tinted button with `Wind` icon and tooltip *"Synthesized Breath Sound: On"*.
  - Inactive state: Muted slate button with slash indicator.
- **Dedicated Toggle in Session Settings Card**:
  - Under the "Breathing Ratio" section, add a dedicated comfort card:
    - Title: *"Synthesized Breath Flow Cues"*
    - Description: *"Subtle, ambient airflow sound that swells during inhalation and eases during exhalation."*
    - Interactive switch control with immediate test preview.
- **Smooth Audio State Transitions**:
  - When paused, the breath sound ramps down smoothly within 100ms.
  - When resumed, the current phase resumes with appropriate frequency and gain ramp.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Procedural Web Audio API Synthesis vs. Pre-recorded Audio Files**:
  - *Chosen Approach*: Procedural audio buffer generation and biquad filtering in TypeScript.
  - *Why*: Zero network requests, 100% offline reliability in sandboxed preview environments, zero asset loading failures, and dynamic duration matching to any custom inhale/exhale seconds.
- **Decision 2: Separation of Chimes and Breath Flow**:
  - *Chosen Approach*: Maintain separate toggles for melodic phase chimes (discrete milestone markers) and continuous breath flow (ambient pacing).
  - *Why*: Gives users granular control over their sensory comfort—some prefer only chimes, some prefer continuous breath flow, and some prefer total silence.

---

### 4. Technical Architecture & Implementation Steps

```
┌────────────────────────────────────────────────────────┐
│               AudioCoach Engine Extension              │
├────────────────────────────────────────────────────────┤
│ • generateNoiseBuffer(ctx, duration): AudioBuffer      │
│ • playBreathInFlow(durationSec): GainNode & FilterNode │
│ • playBreathOutFlow(durationSec): GainNode & Filter    │
│ • stopBreathFlow(): Smooth 100ms exponential fade-out  │
│ • isBreathSoundEnabled: boolean toggle state           │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             BreathingCoach Component Update            │
├────────────────────────────────────────────────────────┤
│ • State: breathSoundEnabled (persisted / synced)       │
│ • Hooked to phase transitions (inhale / exhale)        │
│ • Stop/Pause lifecycle integration                    │
│ • Quick-access toggle button in top stage bar          │
│ • Comfort toggle switch in cadence / settings card     │
└────────────────────────────────────────────────────────┘
```

1. **Extend `src/utils/audioCoach.ts`**:
   - Add noise buffer generation and active airflow node tracking (`activeNoiseSource`, `activeNoiseGain`, `activeFilter`).
   - Implement `startBreathInSound(durationSec)` and `startBreathOutSound(durationSec)` with dynamic frequency sweep.
   - Implement `stopBreathSound()` for safe aborts.
2. **Update `src/components/BreathingCoach.tsx`**:
   - Add `breathSoundEnabled` state and toggle handler.
   - Trigger breath sound alongside existing chimes and visual cues in `transitionToNextPhase` and `handleStartSession`.
   - Add toggle UI to top control bar and cadence settings.
3. **Verification**:
   - Run `compile_applet` and test with `lint_applet` to ensure zero compilation or type issues.
