// =============================================================================
// Audio Service - Text-to-Speech and Sound Effects
// =============================================================================

// Internal state for audio service
const _state = {
  gender: 'female',
  setOwl: null
};

export const AudioService = {
  /**
   * Set the voice gender
   * @param {string} gender - 'male' or 'female'
   */
  setGender(gender) {
    _state.gender = gender;
  },

  /**
   * Get current voice gender
   * @returns {string} Current gender setting
   */
  getGender() {
    return _state.gender;
  },

  /**
   * Set the owl state callback
   * @param {Function|null} callback - Function to call with owl state
   */
  setOwlCallback(callback) {
    _state.setOwl = callback;
  },

  /**
   * Play a sound effect using speech synthesis
   * @param {string} text - Text to speak
   * @param {number} pitch - Voice pitch
   * @param {number} rate - Speech rate
   * @param {number} vol - Volume (0-1)
   */
  sfx(text, pitch, rate, vol = 1) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.pitch = pitch;
      u.rate = rate;
      u.volume = vol;
      window.speechSynthesis.speak(u);
    } catch (e) {
      // Silently fail
    }
  },

  /**
   * Play correct/wrong sound effect
   * @param {string} type - 'correct' or 'wrong'
   */
  playSound(type) {
    if (type === 'correct') {
      this.sfx('Yay!', 2, 1.5, 1);
    } else if (type === 'wrong') {
      this.sfx('Oh no!', 0.5, 0.85, 0.9);
    }
  },

  /**
   * Play celebration fanfare
   */
  playFanfare() {
    this.sfx('Hooray! Well done!', 1.6, 1.3, 1);
  },

  /**
   * Speak text in German
   * @param {string} text - Text to speak in German
   */
  speak(text) {
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

      if (_state.setOwl) {
        _state.setOwl('talk');
        u.onend = () => _state.setOwl('idle');
        u.onerror = () => _state.setOwl('idle');
      }

      window.speechSynthesis.speak(u);
    } catch (e) {
      // Silently fail
    }
  },

  /**
   * Initialize voice list (call early to populate voices)
   */
  initVoices() {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.getVoices();
  },

  /**
   * Cancel any ongoing speech
   */
  cancel() {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Silently fail
    }
  }
};

// Standalone function exports for convenience
export const setGender = (gender) => AudioService.setGender(gender);
export const setOwlCallback = (callback) => AudioService.setOwlCallback(callback);
export const sfx = (text, pitch, rate, vol) => AudioService.sfx(text, pitch, rate, vol);
export const playSound = (type) => AudioService.playSound(type);
export const playFanfare = () => AudioService.playFanfare();
export const speak = (text) => AudioService.speak(text);
export const initVoices = () => AudioService.initVoices();
