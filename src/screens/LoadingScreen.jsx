// =============================================================================
// LoadingScreen Component - Initial loading state
// =============================================================================

import React from 'react';
import { BG } from '../constants/styles';

/**
 * Display loading screen while app initializes
 */
export function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16
      }}
    >
      <div style={{ fontSize: 64 }}>🇩🇪</div>
      <div style={{ color: 'white', fontSize: 16, opacity: 0.7 }}>Loading…</div>
    </div>
  );
}
