// =============================================================================
// useDriveRedirect - on app boot, completes a pending Google Drive backup or
// restore after returning from the OAuth full-page redirect (installed PWA).
// =============================================================================

import { useEffect, useRef } from 'react';
import { consumeRedirectToken } from '../services/GoogleDriveService';
import { runDriveBackup, runDriveRestore } from '../services/driveActions';

/**
 * @param onRestored - Called after a successful Drive restore so the app can
 *   reload its state from storage.
 */
export function useDriveRedirect(onRestored?: () => void): void {
  const onRestoredRef = useRef(onRestored);
  onRestoredRef.current = onRestored;

  useEffect(() => {
    const pending = consumeRedirectToken();
    if (!pending) return;
    void (async () => {
      try {
        if (pending === 'backup') {
          await runDriveBackup();
        } else {
          const ok = await runDriveRestore();
          if (ok) onRestoredRef.current?.();
        }
      } catch {
        // Token is cached; the user can retry from Settings with one tap.
      }
    })();
  }, []);
}
