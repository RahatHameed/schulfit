// =============================================================================
// ResultsScreen Component - Quiz results
// =============================================================================

import React, { useEffect, useRef } from 'react';
import { Confetti } from '../components/Confetti';
import { playFanfare } from '../services/AudioService';
import { CSS } from '../constants/styles';

/**
 * Results screen showing quiz completion
 * @param {Object} props
 * @param {number} props.score - Number of correct answers
 * @param {number} props.total - Total questions
 * @param {string} props.catId - Category ID
 * @param {Object} props.catProgress - Progress snapshot
 * @param {Array} props.dailyStats - Daily stats snapshot
 * @param {Function} props.onSave - Callback to save progress
 * @param {Function} props.onRetry - Callback to retry
 * @param {Function} props.onMenu - Callback to go to menu
 */
export function ResultsScreen({
  score,
  total,
  catId,
  catProgress,
  dailyStats,
  onSave,
  onRetry,
  onMenu
}) {
  const wrong = total - score;
  const pct = score / total;
  const stars = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1;
  const msg =
    pct >= 0.8
      ? { de: 'Wunderbar!', en: 'Wonderful!' }
      : pct >= 0.5
      ? { de: 'Gut gemacht!', en: 'Well done!' }
      : { de: 'Weiter ueben!', en: 'Keep practicing!' };

  const saved = useRef(false);

  useEffect(() => {
    playFanfare();
    if (!saved.current && onSave && catId) {
      saved.current = true;
      onSave(catId, score, total, catProgress, dailyStats);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui,sans-serif',
        padding: 20
      }}
    >
      <style>{CSS}</style>
      <Confetti />
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: 32,
          textAlign: 'center',
          maxWidth: 360,
          width: '100%',
          boxShadow: '0 8px 40px rgba(0,0,0,.2)'
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 4 }}>
          {'⭐'.repeat(stars) + '☆'.repeat(3 - stars)}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#667eea',
            lineHeight: 1,
            marginBottom: 4
          }}
        >
          {score}
          <span style={{ fontSize: 32, color: '#aaa' }}>/{total}</span>
        </div>
        <h2 style={{ margin: '8px 0 4px', color: '#333' }}>{msg.de}</h2>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>{msg.en}</div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginBottom: 20
          }}
        >
          <div
            style={{
              background: '#d4edda',
              borderRadius: 16,
              padding: '14px 20px',
              textAlign: 'center',
              flex: 1
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 900, color: '#28a745' }}>{score}</div>
            <div style={{ fontSize: 13, color: '#28a745', fontWeight: 600 }}>Correct</div>
          </div>
          <div
            style={{
              background: '#f8d7da',
              borderRadius: 16,
              padding: '14px 20px',
              textAlign: 'center',
              flex: 1
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 900, color: '#dc3545' }}>{wrong}</div>
            <div style={{ fontSize: 13, color: '#dc3545', fontWeight: 600 }}>Wrong</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: '12px 8px',
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              border: 'none',
              color: 'white',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14
            }}
          >
            Try Again
          </button>
          <button
            onClick={onMenu}
            style={{
              flex: 1,
              padding: '12px 8px',
              background: 'linear-gradient(135deg,#f5576c,#f093fb)',
              border: 'none',
              color: 'white',
              borderRadius: 10,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14
            }}
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
}
