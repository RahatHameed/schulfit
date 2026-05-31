// =============================================================================
// useSpeechRecognition Hook - Speech recognition management
// =============================================================================

import { useState, useRef } from 'react';
import type * as React from 'react';
import { playSound } from '../services/AudioService';
import { normalize } from '../utils/germanUtils';
import { correctVal } from '../services/QuizLogicService';
import type { Item, Cat, OwlState } from '../types';

// -----------------------------------------------------------------------------
// Minimal Web Speech API declarations (not provided by the DOM lib).
// -----------------------------------------------------------------------------

interface SpeechAlternative {
  transcript: string;
  confidence: number;
}

/** A single result is an array-like of alternatives. */
type SpeechResult = ArrayLike<SpeechAlternative>;

interface SpeechRecognitionResultEvent {
  results: ArrayLike<SpeechResult>;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

/** Pass-through correctness result used in voice mode. */
type VoiceResult = 'correct' | 'wrong';

/** Return shape of {@link useSpeechRecognition}. */
interface UseSpeechRecognition {
  listening: boolean;
  micOk: boolean;
  voiceRes: VoiceResult | null;
  heard: string;
  toggleMic: () => void;
  reset: () => void;
  setVoiceRes: React.Dispatch<React.SetStateAction<VoiceResult | null>>;
  setHeard: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Hook for managing speech recognition
 * @param currentItem - Current quiz item
 * @param cat - Current category
 * @param onScore - Callback to update score
 * @param onOwlState - Callback to update owl state
 * @param onCelebrate - Callback to trigger celebration
 */
export function useSpeechRecognition(
  currentItem: Item | null,
  cat: Cat | null,
  onScore?: () => void,
  onOwlState?: (state: OwlState) => void,
  onCelebrate?: () => void
): UseSpeechRecognition {
  const [listening, setListening] = useState(false);
  const [micOk, setMicOk] = useState(true);
  const [voiceRes, setVoiceRes] = useState<VoiceResult | null>(null);
  const [heard, setHeard] = useState('');

  const recRef = useRef<SpeechRecognitionLike | null>(null);

  const toggleMic = () => {
    if (listening) {
      if (recRef.current) recRef.current.stop();
      setListening(false);
      return;
    }

    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
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
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      setListening(false);
      if (e.error === 'not-allowed') setMicOk(false);
    };

    r.onresult = (e: SpeechRecognitionResultEvent) => {
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
    } catch {
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
