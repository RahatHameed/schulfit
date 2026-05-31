// =============================================================================
// useStorageData Hook - Data persistence with localStorage
// =============================================================================

import { useState, useEffect } from 'react';
import { loadAll, saveProgress, resetProgress, resetAll } from '../services/ProgressService';
import { setGender } from '../services/AudioService';
import { MODES } from '../constants/modes';
import type {
  Mode,
  Profile,
  ViewMode,
  VoiceGender,
  CatProgress,
  DailyStat
} from '../types';

/**
 * Hook for managing persistent data storage
 */
export function useStorageData() {
  const [mode, setMode] = useState<Mode>(MODES.loading);
  const [profile, setProfile] = useState<Profile>({ kidName: '' });
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('female');
  const [catProgress, setCatProgress] = useState<CatProgress>({});
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [tutStep, setTutStep] = useState<number>(-1);

  // Load data on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await loadAll();
        if (data.profile) setProfile(data.profile);
        if (data.prefs?.view) setViewMode(data.prefs.view);
        if (data.prefs?.voice) {
          setVoiceGender(data.prefs.voice);
          setGender(data.prefs.voice);
        }
        if (data.progress) setCatProgress(data.progress);
        if (data.daily) setDailyStats(data.daily);

        if (data.profile?.kidName) {
          setMode(MODES.welcome);
          if (!data.prefs?.tutorialDone) setTutStep(0);
        } else {
          setMode(MODES.setup);
        }
      } catch {
        setMode(MODES.setup);
      }
    })();
  }, []);

  // Save progress action
  const handleSaveProgress = async (
    catId: string,
    score: number,
    total: number,
    cpSnap: CatProgress,
    dsSnap: DailyStat[]
  ): Promise<void> => {
    const result = await saveProgress(catId, score, total, cpSnap, dsSnap);
    setCatProgress(result.catProgress);
    setDailyStats(result.dailyStats);
  };

  // Reset progress action
  const handleResetProgress = async () => {
    await resetProgress();
    setCatProgress({});
    setDailyStats([]);
  };

  // Reset all action
  const handleResetAll = async () => {
    await resetAll();
    setMode(MODES.setup);
  };

  return {
    // State
    mode,
    setMode,
    profile,
    setProfile,
    viewMode,
    setViewMode,
    voiceGender,
    setVoiceGender,
    catProgress,
    setCatProgress,
    dailyStats,
    setDailyStats,
    tutStep,
    setTutStep,

    // Actions
    saveProgress: handleSaveProgress,
    resetProgress: handleResetProgress,
    resetAll: handleResetAll
  };
}
