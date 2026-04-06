// =============================================================================
// Confetti Component - Celebration animation
// =============================================================================

import React from 'react';
import { CC } from '../constants/celebrations';

/**
 * Animated confetti overlay for celebrations
 */
export function Confetti() {
  const pieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    color: CC[i % CC.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.8,
    dur: 2.2 + Math.random() * 2,
    size: 7 + Math.random() * 11,
    round: Math.random() > 0.5
  }));

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {pieces.map(x => (
        <div
          key={x.id}
          style={{
            position: 'absolute',
            top: -20,
            left: `${x.left}%`,
            width: x.size,
            height: x.size,
            background: x.color,
            borderRadius: x.round ? '50%' : '3px',
            animation: `confettiFall ${x.dur}s ${x.delay}s ease-in forwards`
          }}
        />
      ))}
    </div>
  );
}
