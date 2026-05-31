// =============================================================================
// useQuizSession Hook - Quiz session state management
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import { getItems } from '../services/DataGenerationService';
import { buildOpts, correctVal } from '../services/QuizLogicService';
import { playSound, speak } from '../services/AudioService';
import { qSpeech } from '../services/QuizLogicService';
import { CELEB } from '../constants/celebrations';
import type { Cat, Item, ColorItem, OwlState, Mode } from '../types';

/** Pass-through correctness result used in voice mode. */
type VoiceResult = 'correct' | 'wrong';

/**
 * Hook for managing quiz/voice session state
 * @param mode - Current app mode
 * @param onOwlState - Callback to update owl state
 */
export function useQuizSession(mode: Mode, onOwlState?: (state: OwlState) => void) {
  const [cat, setCat] = useState<Cat | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [stableOpts, setStableOpts] = useState<(string | ColorItem)[]>([]);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [voiceRes, setVoiceRes] = useState<VoiceResult | null>(null);
  const [heard, setHeard] = useState('');
  const [celebrate, setCelebrate] = useState(false);
  const [celebIdx, setCelebIdx] = useState(0);

  const celebTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStart = useRef<number | null>(null);

  // Update options when index or category changes
  useEffect(() => {
    if (items[idx] && cat) {
      setStableOpts(buildOpts(items[idx], cat, items));
    }
  }, [idx, cat, items]);

  // Speak question when index changes in quiz/voice mode
  useEffect(() => {
    if ((mode === 'quiz' || mode === 'voice') && items[idx] && cat) {
      const t = setTimeout(() => {
        speak(qSpeech(items[idx], cat));
      }, 500);
      return () => clearTimeout(t);
    }
  }, [idx, mode, items, cat]);

  // Trigger celebration animation
  const trigCelebrate = () => {
    if (celebTimer.current) clearTimeout(celebTimer.current);
    setCelebIdx(Math.floor(Math.random() * CELEB.length));
    setCelebrate(true);
    celebTimer.current = setTimeout(() => setCelebrate(false), 1400);
  };

  // Start a new session
  const go = (newMode: Mode, newCat: Cat): { mode: Mode } => {
    sessionStart.current = Date.now();
    const its = getItems(newCat);
    setCat(newCat);
    setItems(its);
    setIdx(0);
    setChosen(null);
    setScore(0);
    setDone(false);
    setVoiceRes(null);
    setHeard('');
    setCardIdx(0);
    setFlipped(false);
    setCelebrate(false);
    if (onOwlState) onOwlState('idle');
    return { mode: newMode };
  };

  // Advance to next question
  const advance = () => {
    const wasOk = chosen !== null
      ? chosen === correctVal(items[idx], cat)
      : voiceRes === 'correct';
    playSound(wasOk ? 'correct' : 'wrong');
    setCelebrate(false);
    if (onOwlState) onOwlState('idle');

    if (idx < items.length - 1) {
      setIdx((i) => i + 1);
      setChosen(null);
      setVoiceRes(null);
      setHeard('');
    } else {
      setDone(true);
    }
  };

  // Pick answer in quiz mode
  const pickAnswer = (val: string) => {
    if (chosen) return;
    setChosen(val);
    const ok = val === correctVal(items[idx], cat);
    playSound(ok ? 'correct' : 'wrong');

    if (ok) {
      setScore((s) => s + 1);
      trigCelebrate();
      if (onOwlState) onOwlState('happy');
      setTimeout(() => onOwlState?.('idle'), 1000);
    } else {
      if (onOwlState) onOwlState('sad');
      setTimeout(() => onOwlState?.('idle'), 1500);
    }
  };

  // Pick answer in voice mode (fallback)
  const pickVoice = (val: string) => {
    if (voiceRes) return;
    const ok = val === correctVal(items[idx], cat);
    setVoiceRes(ok ? 'correct' : 'wrong');
    setHeard(val);
    playSound(ok ? 'correct' : 'wrong');

    if (ok) {
      setScore((s) => s + 1);
      trigCelebrate();
      if (onOwlState) onOwlState('happy');
      setTimeout(() => onOwlState?.('idle'), 1000);
    } else {
      if (onOwlState) onOwlState('sad');
      setTimeout(() => onOwlState?.('idle'), 1500);
    }
  };

  // Retry voice input
  const retryVoice = () => {
    setVoiceRes(null);
    setHeard('');
  };

  // Flashcard navigation
  const prevCard = () => {
    if (cardIdx > 0) {
      setCardIdx(cardIdx - 1);
      setFlipped(false);
    }
  };

  const nextCard = () => {
    if (cardIdx < items.length - 1) {
      setCardIdx(cardIdx + 1);
      setFlipped(false);
    }
  };

  const flipCard = () => {
    setFlipped((f) => !f);
  };

  return {
    // State
    cat,
    items,
    stableOpts,
    cardIdx,
    flipped,
    idx,
    chosen,
    score,
    done,
    voiceRes,
    heard,
    celebrate,
    celebIdx,
    sessionStart,

    // Actions
    go,
    advance,
    pickAnswer,
    pickVoice,
    retryVoice,
    prevCard,
    nextCard,
    flipCard,
    setFlipped
  };
}
