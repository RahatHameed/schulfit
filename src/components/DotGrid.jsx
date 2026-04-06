// =============================================================================
// DotGrid Component - Visual representation of numbers
// =============================================================================

import React from 'react';

/**
 * Display a grid of colored dots to represent a number
 * @param {Object} props
 * @param {number} props.count - Number of dots to show (max 10)
 * @param {string} props.color - Dot color
 */
export function DotGrid({ count, color }) {
  const visibleCount = Math.min(count, 10);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 5,
        width: 90,
        justifyContent: 'center',
        minHeight: 50
      }}
    >
      {Array.from({ length: visibleCount }, (_, i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: color,
            boxShadow: '0 1px 3px rgba(0,0,0,.2)'
          }}
        />
      ))}
    </div>
  );
}
