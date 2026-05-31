// =============================================================================
// Google Drive backup adapter — OPT-IN cloud backup on top of the local JSON
// export/import. Uses Google Identity Services (token model) + the Drive REST
// API with the minimal `drive.file` scope (the app can only see the single
// backup file it creates — never the rest of the user's Drive).
//
// Requires a Google OAuth client id in VITE_GOOGLE_CLIENT_ID. When it's absent
// the feature is simply unavailable (isDriveConfigured() === false), so the app
// still works fully without it.
// =============================================================================

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FILE_NAME = 'schulfit-backup.json';
const GIS_SRC = 'https://accounts.google.com/gsi/client';

interface TokenResponse {
  access_token?: string;
  error?: string;
}
interface TokenClient {
  requestAccessToken: (overrides?: { prompt?: string }) => void;
}
interface GoogleOAuth2 {
  initTokenClient: (cfg: {
    client_id: string;
    scope: string;
    callback: (resp: TokenResponse) => void;
    error_callback?: (err: { type?: string; message?: string }) => void;
  }) => TokenClient;
}
declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } };
  }
}

export function isDriveConfigured(): boolean {
  return typeof CLIENT_ID === 'string' && CLIENT_ID.length > 0;
}

/** Thrown when auth requires a full-page redirect (installed PWA). */
export const REDIRECT_REQUIRED = 'REDIRECT_REQUIRED';

const TOKEN_KEY = 'schulfit_drive_token';
const PENDING_KEY = 'schulfit_drive_pending';

export type DrivePending = 'backup' | 'restore';

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function cacheToken(token: string, expiresInSec: number): void {
  const exp = Date.now() + (expiresInSec - 60) * 1000; // refresh 1 min early
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token, exp }));
}

function getCachedToken(): string | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const { token, exp } = JSON.parse(raw) as { token: string; exp: number };
    return Date.now() < exp ? token : null;
  } catch {
    return null;
  }
}

/** Begin the full-page redirect OAuth flow (implicit/token). Navigates away. */
export function beginRedirectAuth(pending: DrivePending): void {
  sessionStorage.setItem(PENDING_KEY, pending);
  const params = new URLSearchParams({
    client_id: CLIENT_ID as string,
    redirect_uri: window.location.origin + '/',
    response_type: 'token',
    scope: SCOPE,
    include_granted_scopes: 'true',
    state: 'drive',
  });
  window.location.assign(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}

/**
 * On app boot: if we returned from a Drive redirect, cache the token from the
 * URL hash and return the pending action (or null). Strips the hash either way.
 */
export function consumeRedirectToken(): DrivePending | null {
  if (!window.location.hash.includes('access_token')) return null;
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const token = hash.get('access_token');
  const expiresIn = Number(hash.get('expires_in') || '3600');
  if (token && hash.get('state') === 'drive') {
    cacheToken(token, expiresIn);
  }
  // Clean the hash from the URL.
  history.replaceState(null, '', window.location.pathname + window.location.search);
  const pending = sessionStorage.getItem(PENDING_KEY) as DrivePending | null;
  sessionStorage.removeItem(PENDING_KEY);
  return token ? pending : null;
}

let gisPromise: Promise<void> | null = null;
function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  if (gisPromise) return gisPromise;
  gisPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Google sign-in.'));
    document.head.appendChild(script);
  });
  return gisPromise;
}

// Acquire an access token. Uses a cached token if valid; in an installed PWA
// throws REDIRECT_REQUIRED (popups are blocked there — caller starts the
// redirect flow); otherwise uses the GIS consent popup (works in browser tabs).
async function getAccessToken(): Promise<string> {
  if (!isDriveConfigured()) throw new Error('Google Drive is not configured.');

  const cached = getCachedToken();
  if (cached) return cached;

  if (isStandalone()) throw new Error(REDIRECT_REQUIRED);

  await loadGis();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) throw new Error('Google sign-in unavailable.');
  return new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: CLIENT_ID as string,
      scope: SCOPE,
      callback: (resp) => {
        if (resp.access_token) {
          cacheToken(resp.access_token, 3600);
          resolve(resp.access_token);
        } else reject(new Error(resp.error || 'Authorization failed.'));
      },
      error_callback: (err) => reject(new Error(err.message || 'Authorization cancelled.')),
    });
    client.requestAccessToken();
  });
}

function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

async function findBackupId(token: string): Promise<string | null> {
  const q = encodeURIComponent(`name='${FILE_NAME}' and trashed=false`);
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&spaces=drive&fields=files(id,modifiedTime)&orderBy=modifiedTime desc`,
    { headers: authHeader(token) },
  );
  if (!res.ok) throw new Error('Could not query Google Drive.');
  const data = (await res.json()) as { files?: { id: string }[] };
  return data.files?.[0]?.id ?? null;
}

/** Upload (create or overwrite) the backup file in the user's Drive. */
export async function uploadBackup(content: string): Promise<void> {
  const token = await getAccessToken();
  let id = await findBackupId(token);

  if (!id) {
    const meta = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: { ...authHeader(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: FILE_NAME, mimeType: 'application/json' }),
    });
    if (!meta.ok) throw new Error('Could not create the backup file.');
    id = ((await meta.json()) as { id: string }).id;
  }

  const up = await fetch(
    `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=media`,
    { method: 'PATCH', headers: { ...authHeader(token), 'Content-Type': 'application/json' }, body: content },
  );
  if (!up.ok) throw new Error('Upload to Google Drive failed.');
}

/** Download the backup file's contents, or null if none exists yet. */
export async function downloadBackup(): Promise<string | null> {
  const token = await getAccessToken();
  const id = await findBackupId(token);
  if (!id) return null;
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
    headers: authHeader(token),
  });
  if (!res.ok) throw new Error('Download from Google Drive failed.');
  return res.text();
}
