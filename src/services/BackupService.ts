// =============================================================================
// Backup Service - Export / import all SchulFit data as a portable JSON snapshot
// =============================================================================

import { StorageService } from './StorageService';
import type {
  CatProgress,
  DailyStat,
  DataExport,
  Prefs,
  Profile,
} from '../types';

/**
 * Gather all persisted data into a portable snapshot.
 */
export async function exportData(): Promise<DataExport> {
  const [profile, prefs, progress, daily] = await Promise.all([
    StorageService.get<Profile>('profile'),
    StorageService.get<Prefs>('prefs'),
    StorageService.get<CatProgress>('allProgress'),
    StorageService.get<DailyStat[]>('dailyStats'),
  ]);

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: profile ?? null,
    prefs: prefs ?? null,
    progress: progress ?? {},
    daily: daily ?? [],
  };
}

/** Serialize a snapshot to pretty JSON. */
export function serializeExport(data: DataExport): string {
  return JSON.stringify(data, null, 2);
}

/** Parse + validate an imported backup file. Throws on malformed input. */
export function parseDataExport(text: string): DataExport {
  let obj: unknown;
  try {
    obj = JSON.parse(text);
  } catch {
    throw new Error('That file isn’t valid JSON.');
  }
  if (!obj || typeof obj !== 'object') throw new Error('Unrecognized backup file.');
  const o = obj as Record<string, unknown>;
  if (o.version !== 1) throw new Error('Unsupported backup version.');
  if (typeof o.progress !== 'object' || o.progress === null || Array.isArray(o.progress)) {
    throw new Error('Backup file is missing progress data.');
  }
  if (!Array.isArray(o.daily)) {
    throw new Error('Backup file is missing daily stats.');
  }
  return {
    version: 1,
    exportedAt: typeof o.exportedAt === 'string' ? o.exportedAt : new Date().toISOString(),
    profile: (o.profile as Profile | null) ?? null,
    prefs: (o.prefs as Prefs | null) ?? null,
    progress: o.progress as CatProgress,
    daily: o.daily as DailyStat[],
  };
}

/** Write a snapshot back into storage, replacing existing data. */
export async function importData(data: DataExport): Promise<void> {
  await StorageService.set('profile', data.profile);
  await StorageService.set('prefs', data.prefs ?? {});
  await StorageService.set('allProgress', data.progress ?? {});
  await StorageService.set('dailyStats', data.daily ?? []);
}

/** Suggested backup filename, e.g. schulfit-backup-2026-05-31.json. */
export function backupFilename(dateISO: string): string {
  return `schulfit-backup-${dateISO.slice(0, 10)}.json`;
}

export const BackupService = {
  exportData,
  serializeExport,
  parseDataExport,
  importData,
  backupFilename,
};
