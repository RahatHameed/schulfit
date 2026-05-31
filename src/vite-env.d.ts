/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Notification Triggers API (Chromium-only) — not part of the standard DOM lib.
declare class TimestampTrigger {
  constructor(timestamp: number);
}
