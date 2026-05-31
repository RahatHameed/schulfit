// =============================================================================
// Audio Service - Text-to-Speech and Sound Effects
// =============================================================================

import type { VoiceGender, OwlState } from '../types';

// Internal state for audio service
const _state: { gender: VoiceGender; setOwl: ((state: OwlState) => void) | null } = {
  gender: 'female',
  setOwl: null
};

export const AudioService = {
  /**
   * Set the voice gender
   * @param gender - 'male' or 'female'
   */
  setGender(gender: VoiceGender): void {
    _state.gender = gender;
  },

  /**
   * Get current voice gender
   * @returns Current gender setting
   */
  getGender(): VoiceGender {
    return _state.gender;
  },

  /**
   * Set the owl state callback
   * @param callback - Function to call with owl state
   */
  setOwlCallback(callback: ((state: OwlState) => void) | null): void {
    _state.setOwl = callback;
  },

  /**
   * Play a sound effect using speech synthesis
   * @param text - Text to speak
   * @param pitch - Voice pitch
   * @param rate - Speech rate
   * @param vol - Volume (0-1)
   */
  sfx(text: string, pitch: number, rate: number, vol = 1): void {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.pitch = pitch;
      u.rate = rate;
      u.volume = vol;
      window.speechSynthesis.speak(u);
    } catch {
      // Silently fail
    }
  },

  /**
   * Play correct/wrong sound effect
   * @param type - 'correct' or 'wrong'
   */
  playSound(type: 'correct' | 'wrong'): void {
    if (type === 'correct') {
      this.sfx('Yay!', 2, 1.5, 1);
    } else if (type === 'wrong') {
      this.sfx('Oh no!', 0.5, 0.85, 0.9);
    }
  },

  /**
   * Play celebration fanfare
   */
  playFanfare(): void {
    this.sfx('Hooray! Well done!', 1.6, 1.3, 1);
  },

  /**
   * Speak text in German
   * @param text - Text to speak in German
   */
  speak(text: string): void {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'de-DE';

      const all = window.speechSynthesis.getVoices();
      const de = all.filter(v => v.lang.startsWith('de'));
      const pool = de.length ? de : all;

      if (_state.gender === 'male') {
        const mv = pool.find(v => /male/i.test(v.name)) ||
                   (pool.length > 1 ? pool[pool.length - 1] : null);
        if (mv) u.voice = mv;
        u.pitch = 0.4;
        u.rate = 0.78;
      } else {
        const fv = pool.find(v => /female/i.test(v.name)) || pool[0];
        if (fv) u.voice = fv;
        u.pitch = 1.3;
        u.rate = 0.88;
      }

      const setOwl = _state.setOwl;
      if (setOwl) {
        setOwl('talk');
        u.onend = () => setOwl('idle');
        u.onerror = () => setOwl('idle');
      }

      window.speechSynthesis.speak(u);
    } catch {
      // Silently fail
    }
  },

  /**
   * Initialize voice list (call early to populate voices)
   */
  initVoices(): void {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.getVoices();
  },

  /**
   * Cancel any ongoing speech
   */
  cancel(): void {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Silently fail
    }
  }
};

// Standalone function exports for convenience
export const setGender = (gender: VoiceGender): void => AudioService.setGender(gender);
export const setOwlCallback = (callback: ((state: OwlState) => void) | null): void =>
  AudioService.setOwlCallback(callback);
export const sfx = (text: string, pitch: number, rate: number, vol?: number): void =>
  AudioService.sfx(text, pitch, rate, vol);
export const playSound = (type: 'correct' | 'wrong'): void => AudioService.playSound(type);
export const playFanfare = (): void => AudioService.playFanfare();
export const speak = (text: string): void => AudioService.speak(text);
export const initVoices = (): void => AudioService.initVoices();
