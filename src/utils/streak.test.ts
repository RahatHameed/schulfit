import { describe, it, expect } from 'vitest';
import { currentStreak, practicedToday } from './streak';
import type { DailyStat } from '../types';

// UTC day string n days before today (matches todayStr()'s UTC basis).
const dayOffset = (n: number): string =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const stat = (date: string, questions = 5): DailyStat => ({
  date,
  questions,
  correct: questions,
});

describe('currentStreak', () => {
  it('is 0 with no data', () => {
    expect(currentStreak([])).toBe(0);
  });

  it('counts today', () => {
    expect(currentStreak([stat(dayOffset(0))])).toBe(1);
  });

  it('counts consecutive days', () => {
    expect(currentStreak([stat(dayOffset(0)), stat(dayOffset(1)), stat(dayOffset(2))])).toBe(3);
  });

  it('breaks on a gap', () => {
    expect(currentStreak([stat(dayOffset(0)), stat(dayOffset(2))])).toBe(1);
  });

  it('allows yesterday as a grace day when today is empty', () => {
    expect(currentStreak([stat(dayOffset(1)), stat(dayOffset(2))])).toBe(2);
  });

  it('is 0 when the last practice was 2+ days ago', () => {
    expect(currentStreak([stat(dayOffset(2))])).toBe(0);
  });

  it('ignores days with no questions answered', () => {
    expect(currentStreak([stat(dayOffset(0), 0)])).toBe(0);
  });
});

describe('practicedToday', () => {
  it('is true when today has answered questions', () => {
    expect(practicedToday([stat(dayOffset(0))])).toBe(true);
  });

  it('is false when only earlier days have activity', () => {
    expect(practicedToday([stat(dayOffset(1))])).toBe(false);
  });
});
