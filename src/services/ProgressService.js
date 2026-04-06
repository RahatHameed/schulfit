// =============================================================================
// Progress Service - Track and save learning progress
// =============================================================================

import { StorageService } from './StorageService';
import { todayStr } from '../utils/dateUtils';

export const ProgressService = {
  /**
   * Save progress after a quiz session
   * @param {string} catId - Category ID
   * @param {number} score - Number correct
   * @param {number} total - Total questions
   * @param {Object} cpSnap - Current category progress snapshot
   * @param {Array} dsSnap - Current daily stats snapshot
   * @param {number} sessionStart - Session start timestamp
   * @returns {Object} Updated catProgress and dailyStats
   */
  async saveProgress(catId, score, total, cpSnap, dsSnap, sessionStart) {
    const today = todayStr();

    // Update category progress
    const np = { ...cpSnap };
    const ex = np[catId] || {
      sessions: 0,
      bestScore: 0,
      bestTotal: 1,
      totalCorrect: 0,
      totalQuestions: 0
    };

    np[catId] = {
      sessions: ex.sessions + 1,
      bestScore: score > ex.bestScore ? score : ex.bestScore,
      bestTotal: score > ex.bestScore ? total : ex.bestTotal,
      totalCorrect: ex.totalCorrect + score,
      totalQuestions: ex.totalQuestions + total
    };

    await StorageService.set('allProgress', np);

    // Update daily stats
    const s = [...(dsSnap || [])];
    const timeSpent = sessionStart ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
    const ti = s.findIndex(x => x.date === today);

    if (ti >= 0) {
      s[ti] = {
        ...s[ti],
        questions: s[ti].questions + total,
        correct: s[ti].correct + score,
        time: (s[ti].time || 0) + timeSpent
      };
    } else {
      s.push({
        date: today,
        questions: total,
        correct: score,
        time: timeSpent
      });
    }

    await StorageService.set('dailyStats', s);

    return { catProgress: np, dailyStats: s };
  },

  /**
   * Reset all progress data
   */
  async resetProgress() {
    await StorageService.set('allProgress', {});
    await StorageService.set('dailyStats', []);
  },

  /**
   * Reset all app data (profile + progress)
   */
  async resetAll() {
    await StorageService.set('profile', null);
    await StorageService.set('prefs', null);
    await StorageService.set('allProgress', {});
    await StorageService.set('dailyStats', []);
  },

  /**
   * Load all stored data
   * @returns {Object} Profile, prefs, progress, and daily stats
   */
  async loadAll() {
    const profile = await StorageService.get('profile');
    const prefs = await StorageService.get('prefs');
    const progress = await StorageService.get('allProgress');
    const daily = await StorageService.get('dailyStats');

    return {
      profile: profile || { kidName: '' },
      prefs: prefs || {},
      progress: progress || {},
      daily: daily || []
    };
  }
};

// Standalone function exports for convenience
export const saveProgress = (catId, score, total, cpSnap, dsSnap, sessionStart) =>
  ProgressService.saveProgress(catId, score, total, cpSnap, dsSnap, sessionStart);
export const resetProgress = () => ProgressService.resetProgress();
export const resetAll = () => ProgressService.resetAll();
export const loadAll = () => ProgressService.loadAll();
