// =============================================================================
// CmpCard Component - Comparison question card
// =============================================================================

import React from 'react';
import { DotGrid } from './DotGrid';
import { SPK } from '../constants/styles';

/**
 * Display a comparison question with two numbers
 * @param {Object} props
 * @param {Object} props.item - Comparison item with numA, numB, qType
 * @param {Function} props.onSpeak - Callback to speak the question
 */
export function CmpCard({ item, onSpeak }) {
  const qText = item.qType === 'smaller' ? 'Welche Zahl ist kleiner?' :
                item.qType === 'truefalse' ? 'Stimmt das?' :
                item.qType === 'equal' ? 'Sind die Zahlen gleich?' :
                'Welche Zahl ist groesser?';

  const showStmt = item.qType === 'truefalse' || item.qType === 'equal';

  return (
    <React.Fragment>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#555', marginBottom: 8 }}>
        {qText}
      </div>

      {showStmt && (
        <div style={{ fontSize: 22, fontWeight: 900, color: '#333', marginBottom: 6 }}>
          {item.numA}{' '}
          <span style={{ color: '#667eea' }}>
            {item.qType === 'equal' ? 'gleich' : 'groesser als'}
          </span>{' '}
          {item.numB}?
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <DotGrid count={item.numA} color="#667eea" />
          <div style={{ fontSize: 40, fontWeight: 900, color: '#667eea', marginTop: 6 }}>
            {item.numA}
          </div>
        </div>

        <div style={{ fontSize: 22, color: '#ccc', fontWeight: 900 }}>vs</div>

        <div style={{ textAlign: 'center' }}>
          <DotGrid count={item.numB} color="#f5576c" />
          <div style={{ fontSize: 40, fontWeight: 900, color: '#f5576c', marginTop: 6 }}>
            {item.numB}
          </div>
        </div>
      </div>

      <button onClick={onSpeak} style={SPK}>🔊</button>
    </React.Fragment>
  );
}
