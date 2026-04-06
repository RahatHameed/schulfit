// =============================================================================
// useStorageData Hook - Data persistence with localStorage
// =============================================================================

import { useState, useEffect } from 'react';
import { loadAll, saveProgress, resetProgress, resetAll } from '../services/ProgressService';
import { setGender } from '../services/AudioService';
import { MODES } from '../constants/modes';

/**
 * Hook for managing persistent data storage
 * @returns {Object} Storage data and actions
 */
export function useStorageData() {
  const [mode, setMode] = useState(MODES.loading);
  const [profile, setProfile] = useState({ kidName: '' });
  const [viewMode, setViewMode] = useState('grid');
  const [voiceGender, setVoiceGender] = useState('female');
  const [catProgress, setCatProgress] = useState({});
  const [dailyStats, setDailyStats] = useState([]);
  const [tutStep, setTutStep] = useState(-1);

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
      } catch (e) {
        setMode(MODES.setup);
      }
    })();
  }, []);

  // Save progress action
  const handleSaveProgress = async (catId, score, total, cpSnap, dsSnap) => {
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
