// =============================================================================
// Owl Component - Animated mascot
// =============================================================================

import React from 'react';

/**
 * Owl mascot that reacts to user actions
 * @param {Object} props
 * @param {string} props.state - 'idle', 'talk', 'happy', or 'sad'
 * @param {number} props.size - Font size in pixels
 */
export function Owl({ state, size = 44 }) {
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
