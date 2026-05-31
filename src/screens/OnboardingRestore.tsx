// =============================================================================
// OnboardingRestore - restore a previous backup (JSON file or Google Drive)
// so a returning family can bring their data onto a new device. No accounts.
// =============================================================================

import { useRef, useState } from 'react';
import { importData, parseDataExport } from '../services/BackupService';
import {
  beginRedirectAuth,
  isDriveConfigured,
  REDIRECT_REQUIRED,
} from '../services/GoogleDriveService';
import { runDriveRestore } from '../services/driveActions';

interface OnboardingRestoreProps {
  /** Called after a successful restore so the app can reload + advance. */
  onRestored: () => void;
}

const btn = (primary: boolean) => ({
  width: '100%',
  background: primary ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f8f9fa',
  border: primary ? 'none' : '2px solid #e5e7eb',
  borderRadius: 12,
  padding: '12px',
  fontSize: 15,
  fontWeight: 800 as const,
  color: primary ? 'white' : '#333',
  cursor: 'pointer',
  marginBottom: 10,
});

export function OnboardingRestore({ onRestored }: OnboardingRestoreProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<null | 'drive' | 'file'>(null);
  const [err, setErr] = useState<string | null>(null);

  const msg = (e: unknown, fallback: string) =>
    e instanceof Error ? e.message : fallback;

  const restoreFromFile = async (file: File) => {
    setBusy('file');
    setErr(null);
    try {
      await importData(parseDataExport(await file.text()));
      onRestored();
    } catch (e) {
      setErr(msg(e, 'That backup file could not be read.'));
    } finally {
      setBusy(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const restoreFromDrive = async () => {
    setBusy('drive');
    setErr(null);
    try {
      const ok = await runDriveRestore();
      if (!ok) setErr('No backup found in that Google account yet.');
      else onRestored();
    } catch (e) {
      if (e instanceof Error && e.message === REDIRECT_REQUIRED) {
        beginRedirectAuth('restore');
        return;
      }
      setErr(msg(e, 'Could not restore from Google Drive.'));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: '#666', margin: '0 0 16px', lineHeight: 1.5 }}>
        Restore a previous backup to bring back your child’s profile and progress
        on this device.
      </p>

      {isDriveConfigured() && (
        <button
          style={btn(true)}
          disabled={busy != null}
          onClick={() => void restoreFromDrive()}
        >
          {busy === 'drive' ? 'Restoring…' : '☁️ Restore from Google Drive'}
        </button>
      )}

      <button
        style={btn(!isDriveConfigured())}
        disabled={busy != null}
        onClick={() => fileRef.current?.click()}
      >
        {busy === 'file' ? 'Restoring…' : '📄 Import a backup file'}
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void restoreFromFile(f);
        }}
      />

      {err && (
        <p style={{ color: '#dc3545', fontSize: 13, fontWeight: 700, marginTop: 8 }}>
          {err}
        </p>
      )}
    </div>
  );
}
