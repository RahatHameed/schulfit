// =============================================================================
// useSpeechRecognition Hook - Speech recognition management
// =============================================================================

import { useState, useRef } from 'react';
import { playSound } from '../services/AudioService';
import { normalize } from '../utils/germanUtils';
import { correctVal } from '../services/QuizLogicService';
import { CELEB } from '../constants/celebrations';

/**
 * Hook for managing speech recognition
 * @param {Object} currentItem - Current quiz item
 * @param {Object} cat - Current category
 * @param {Function} onScore - Callback to update score
 * @param {Function} onOwlState - Callback to update owl state
 * @param {Function} onCelebrate - Callback to trigger celebration
 * @returns {Object} Speech recognition state and actions
 */
export function useSpeechRecognition(currentItem, cat, onScore, onOwlState, onCelebrate) {
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(true);
  const [voiceRes, setVoiceRes] = useState(null);
  const [heard, setHeard] = useState('');

  const recRef = useRef(null);

  const toggleMic = () => {
    if (listening) {
      if (recRef.current) recRef.current.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicOk(false);
      return;
    }

    const r = new SR();
    r.lang = 'de-DE';
    r.interimResults = false;
    r.maxAlternatives = 5;

    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (e) => {
      setListening(false);
      if (e.error === 'not-allowed') setMicOk(false);
    };

    r.onresult = (e) => {
      const alts = Array.from(e.results[0]).map((a) => a.transcript);
      const target = normalize(correctVal(currentItem, cat));
      const ok = alts.some(
        (a) => normalize(a) === target || normalize(a).includes(target)
      );

      setHeard(alts[0]);
      setVoiceRes(ok ? 'correct' : 'wrong');
      playSound(ok ? 'correct' : 'wrong');

      if (ok) {
        onScore?.();
        onCelebrate?.();
        onOwlState?.('happy');
        setTimeout(() => onOwlState?.('idle'), 1000);
      } else {
        onOwlState?.('sad');
        setTimeout(() => onOwlState?.('idle'), 1500);
      }
    };

    recRef.current = r;
    try {
      r.start();
    } catch (e) {
      setMicOk(false);
    }
  };

  const reset = () => {
    setVoiceRes(null);
    setHeard('');
  };

  return {
    listening,
    micOk,
    voiceRes,
    heard,
    toggleMic,
    reset,
    setVoiceRes,
    setHeard
  };
}
