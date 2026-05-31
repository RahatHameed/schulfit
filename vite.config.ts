/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 'prompt' → surface an in-app "New version available — Reload" banner
      // instead of silently reloading (better UX in an installed PWA).
      registerType: 'prompt',
      // We inject our own SW (precache + notification click handling) on top of
      // the Workbox-generated precache. Source lives in src/sw/sw.ts.
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'sw.ts',
      // Keep the existing public/manifest.json + <link rel="manifest"> in
      // index.html; manifest:false stops the plugin generating a duplicate.
      manifest: false,
      injectRegister: false,
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
