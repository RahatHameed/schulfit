// =============================================================================
// useAudio Hook - Audio and TTS management
// =============================================================================

import { useEffect } from 'react';
import { initVoices, setOwlCallback, setGender } from '../services/AudioService';

/**
 * Hook for managing audio/TTS initialization
 * @param {Function} setOwlState - Callback to update owl animation state
 * @param {string} voiceGender - Current voice gender setting
 */
export function useAudio(setOwlState, voiceGender) {
  // Set up owl callback for TTS animations
  useEffect(() => {
    setOwlCallback(setOwlState);
    return () => setOwlCallback(null);
  }, [setOwlState]);

  // Update voice gender when it changes
  useEffect(() => {
    setGender(voiceGender);
  }, [voiceGender]);

  // Initialize voices on mount
  useEffect(() => {
    initVoices();
  }, []);
}
