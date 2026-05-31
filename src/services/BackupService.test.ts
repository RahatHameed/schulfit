import { describe, it, expect } from 'vitest';
import { backupFilename, parseDataExport, serializeExport } from './BackupService';
import type { DataExport } from '../types';

const sample: DataExport = {
  version: 1,
  exportedAt: '2026-05-31T10:00:00.000Z',
  profile: { kidName: 'Anna' },
  prefs: { voice: 'female', notifications: true, reminderTime: '18:00' },
  progress: {
    colors: { sessions: 2, bestScore: 5, bestTotal: 5, totalCorrect: 8, totalQuestions: 10 },
  },
  daily: [{ date: '2026-05-31', questions: 10, correct: 8 }],
};

describe('BackupService', () => {
  it('round-trips a snapshot through serialize/parse', () => {
    const parsed = parseDataExport(serializeExport(sample));
    expect(parsed).toEqual(sample);
  });

  it('rejects invalid JSON', () => {
    expect(() => parseDataExport('not json')).toThrow();
  });

  it('rejects an unsupported version', () => {
    expect(() => parseDataExport(JSON.stringify({ version: 2, progress: {}, daily: [] }))).toThrow();
  });

  it('rejects a file missing progress', () => {
    expect(() => parseDataExport(JSON.stringify({ version: 1, daily: [] }))).toThrow();
  });

  it('rejects a file missing daily stats', () => {
    expect(() => parseDataExport(JSON.stringify({ version: 1, progress: {} }))).toThrow();
  });

  it('tolerates a missing profile / prefs', () => {
    const parsed = parseDataExport(JSON.stringify({ version: 1, progress: {}, daily: [] }));
    expect(parsed.profile).toBeNull();
    expect(parsed.prefs).toBeNull();
  });

  it('builds a dated backup filename', () => {
    expect(backupFilename('2026-05-31T10:00:00.000Z')).toBe('schulfit-backup-2026-05-31.json');
  });
});
