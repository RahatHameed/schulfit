// =============================================================================
// CmpAnswers Component - Comparison answer buttons
// =============================================================================

import React from 'react';

/**
 * Display answer buttons for comparison questions
 * @param {Object} props
 * @param {Object} props.item - Comparison item with numA, numB, qType
 * @param {string} props.correct - Correct answer
 * @param {string} props.chosen - User's chosen answer
 * @param {Function} props.onPick - Callback when answer is selected
 */
export function CmpAnswers({ item, correct, chosen, onPick }) {
  // True/False or Equal questions
  if (item.qType === 'truefalse' || item.qType === 'equal') {
    return (
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        {[
          { l: 'Ja, richtig!', v: 'ja' },
          { l: 'Nein, falsch!', v: 'nein' }
        ].map(x => {
          const isC = x.v === correct;
          const isS = x.v === chosen;
          return (
            <button
              key={x.v}
              onClick={() => onPick(x.v)}
              style={{
                flex: 1,
                background: chosen ? (isC ? '#d4edda' : isS ? '#f8d7da' : 'white') : 'white',
                border: `3px solid ${chosen ? (isC ? '#28a745' : isS ? '#dc3545' : '#ddd') : '#ddd'}`,
                borderRadius: 16,
                padding: '16px 8px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 800, color: '#333' }}>{x.l}</div>
            </button>
          );
        })}
      </div>
    );
  }

  // Bigger/Smaller questions
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
      {[
        { v: String(item.numA), col: '#667eea' },
        { v: String(item.numB), col: '#f5576c' }
      ].map(x => {
        const isC = x.v === correct;
        const isS = x.v === chosen;
        return (
          <button
            key={x.v}
            onClick={() => onPick(x.v)}
            style={{
              flex: 1,
              background: chosen ? (isC ? '#d4edda' : isS ? '#f8d7da' : 'white') : 'white',
              border: `4px solid ${chosen ? (isC ? '#28a745' : isS ? '#dc3545' : x.col) : x.col}`,
              borderRadius: 16,
              padding: '16px 8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
                color: chosen ? (isC ? '#28a745' : isS ? '#dc3545' : x.col) : x.col
              }}
            >
              {x.v}
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              {x.v === String(item.numA) ? 'Linke Zahl' : 'Rechte Zahl'}
            </div>
          </button>
        );
      })}
    </div>
  );
}
