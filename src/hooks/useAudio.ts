// =============================================================================
// useAudio Hook - Audio and TTS management
// =============================================================================

import { useEffect } from 'react';
import { initVoices, setOwlCallback, setGender } from '../services/AudioService';
import type { OwlState, VoiceGender } from '../types';

/**
 * Hook for managing audio/TTS initialization
 * @param setOwlState - Callback to update owl animation state
 * @param voiceGender - Current voice gender setting
 */
export function useAudio(
  setOwlState: (state: OwlState) => void,
  voiceGender: VoiceGender
): void {
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
