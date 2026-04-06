// =============================================================================
// SetupScreen Component - Initial profile setup
// =============================================================================

import React, { useState } from 'react';

/**
 * Setup screen for creating initial profile
 * @param {Object} props
 * @param {Function} props.onSave - Callback when profile is saved
 */
export function SetupScreen({ onSave }) {
  const [kidName, setKidName] = useState('');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
        fontFamily: 'system-ui,sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: '100%',
          background: 'white',
          borderRadius: 24,
          padding: 32,
          boxShadow: '0 8px 40px rgba(0,0,0,.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🇩🇪</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 6px', color: '#333' }}>
            SchulFit
          </h1>
          <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
            German school prep for immigrant families
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>
            What is your child called?
          </div>
          <input
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            placeholder="e.g. Ali, Fatima, Sara..."
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              fontSize: 15,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={() => onSave({ kidName: kidName || 'Champ' })}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg,#667eea,#764ba2)',
            border: 'none',
            borderRadius: 12,
            padding: '14px',
            fontSize: 16,
            fontWeight: 800,
            color: 'white',
            cursor: 'pointer',
            marginBottom: 10
          }}
        >
          Start Learning!
        </button>

        <button
          onClick={() => onSave({ kidName: 'Champ' })}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#aaa',
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
