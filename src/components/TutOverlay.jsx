// =============================================================================
// TutOverlay Component - Tutorial overlay modal
// =============================================================================

import React from 'react';
import { TUTORIAL } from '../data/tutorial';

/**
 * Display tutorial overlay
 * @param {Object} props
 * @param {number} props.step - Current tutorial step (0-based)
 * @param {Function} props.onNext - Callback for next/finish button
 * @param {Function} props.onSkip - Callback for skip button
 */
export function TutOverlay({ step, onNext, onSkip }) {
  const T = TUTORIAL[step];
  if (!T) return null;

  const isLast = step === TUTORIAL.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 20
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: '32px 24px',
          maxWidth: 340,
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,.3)'
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 16 }}>{T.emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#333', marginBottom: 10 }}>
          {T.title}
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#666',
            marginBottom: 24,
            whiteSpace: 'pre-line',
            lineHeight: 1.5
          }}
        >
          {T.text}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {!isLast && (
            <button
              onClick={onSkip}
              style={{
                flex: 1,
                background: '#f0f0f0',
                border: 'none',
                borderRadius: 12,
                padding: '14px',
                fontSize: 14,
                fontWeight: 700,
                color: '#888',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
          )}
          <button
            onClick={onNext}
            style={{
              flex: 2,
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              border: 'none',
              borderRadius: 12,
              padding: '14px',
              fontSize: 14,
              fontWeight: 800,
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {isLast ? "Let's Go!" : 'Next'}
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 6, justifyContent: 'center' }}>
          {TUTORIAL.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i === step ? '#667eea' : '#ddd'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
