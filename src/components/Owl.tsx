// =============================================================================
// Owl Component - Animated mascot
// =============================================================================

import React from 'react';
import type { OwlState } from '../types';

interface OwlProps {
  /** Owl animation state. */
  state?: OwlState;
  /** Font size in pixels. */
  size?: number;
}

/**
 * Owl mascot that reacts to user actions
 */
export function Owl({ state, size = 44 }: OwlProps) {
  const emoji = state === 'talk' ? '🗣️' :
                state === 'happy' ? '🥳' :
                state === 'sad' ? '😔' : '🦉';

  return (
    <div
      style={{ fontSize: size, lineHeight: 1, display: 'inline-block' }}
      className={`owl-${state || 'idle'}`}
    >
      {emoji}
    </div>
  );
}
