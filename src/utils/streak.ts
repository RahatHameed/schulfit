// =============================================================================
// Streak utilities - compute the current daily practice streak
// =============================================================================

import { todayStr } from './dateUtils';
import type { DailyStat } from '../types';

const DAY_MS = 86_400_000;

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Count the current run of consecutive days (ending today, or yesterday as a
 * grace day) on which the child practised at least one question.
 *
 * @param daily - Daily stats (any order)
 * @returns The streak length in days (0 if the streak is broken)
 */
export function currentStreak(daily: DailyStat[]): number {
  const practiced = new Set(daily.filter((d) => d.questions > 0).map((d) => d.date));
  if (practiced.size === 0) return 0;

  // Anchor on UTC midnight to match the UTC date strings produced by todayStr().
  let cursor = new Date(todayStr() + 'T00:00:00.000Z');

  // Today not practised yet? Allow the streak to stand on yesterday (grace),
  // otherwise it's broken.
  if (!practiced.has(isoDay(cursor))) {
    cursor = new Date(cursor.getTime() - DAY_MS);
    if (!practiced.has(isoDay(cursor))) return 0;
  }

  let count = 0;
  while (practiced.has(isoDay(cursor))) {
    count++;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }
  return count;
}

/** Whether the child has practised at least one question today. */
export function practicedToday(daily: DailyStat[]): boolean {
  const t = todayStr();
  return daily.some((d) => d.date === t && d.questions > 0);
}
