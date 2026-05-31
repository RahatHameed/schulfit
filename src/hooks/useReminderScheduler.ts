// =============================================================================
// useReminderScheduler - keeps the daily streak reminder in sync with prefs.
//
// Re-schedules whenever the toggle, time, or streak changes (and on mount).
// When notifications are off, cancels any pending reminder.
// =============================================================================

import { useEffect } from 'react';
import { NotificationService } from '../services/NotificationService';
import { currentStreak, practicedToday } from '../utils/streak';
import type { DailyStat } from '../types';

/**
 * @param enabled - Whether the daily reminder is on (prefs.notifications)
 * @param reminderTime - "HH:MM" time to fire the reminder
 * @param dailyStats - Daily stats used to compute streak / "practiced today"
 */
export function useReminderScheduler(
  enabled: boolean,
  reminderTime: string,
  dailyStats: DailyStat[],
): void {
  useEffect(() => {
    if (!enabled || NotificationService.permission() !== 'granted') {
      void NotificationService.cancelScheduled();
      return;
    }
    const streak = currentStreak(dailyStats);
    void NotificationService.scheduleDailyReminder(
      reminderTime,
      streak,
      practicedToday(dailyStats),
    );
  }, [enabled, reminderTime, dailyStats]);
}
