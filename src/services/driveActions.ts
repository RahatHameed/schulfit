// =============================================================================
// Drive actions - high-level backup/restore glue between BackupService and
// GoogleDriveService.
// =============================================================================

import { exportData, importData, parseDataExport, serializeExport } from './BackupService';
import { downloadBackup, uploadBackup } from './GoogleDriveService';

/** Export current data and upload it to Google Drive. */
export async function runDriveBackup(): Promise<void> {
  const data = await exportData();
  await uploadBackup(serializeExport(data));
}

/**
 * Download the backup from Google Drive and restore it.
 * @returns true if a backup was found and restored, false if none exists.
 */
export async function runDriveRestore(): Promise<boolean> {
  const text = await downloadBackup();
  if (!text) return false;
  await importData(parseDataExport(text));
  return true;
}
