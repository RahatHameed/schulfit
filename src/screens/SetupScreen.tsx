// =============================================================================
// SetupScreen Component - Initial profile setup, with a "restore my data" path
// for families who already have a backup (file or Google Drive).
// =============================================================================

import { useState } from 'react';
import type { Profile } from '../types';
import { OnboardingRestore } from './OnboardingRestore';

interface SetupScreenProps {
  /** Called when a fresh profile is created. */
  onSave: (profile: Profile) => void;
  /** Called after a successful restore so the app can reload + advance. */
  onRestored: () => void;
}

type SetupMode = 'choose' | 'new' | 'restore';

const shell: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
  fontFamily: 'system-ui,sans-serif',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
};

const card: React.CSSProperties = {
  maxWidth: 420,
  width: '100%',
  background: 'white',
  borderRadius: 24,
  padding: 32,
  boxShadow: '0 8px 40px rgba(0,0,0,.2)',
};

const header = (
  <div style={{ textAlign: 'center', marginBottom: 28 }}>
    <div style={{ fontSize: 64, marginBottom: 8 }}>🇩🇪</div>
    <h1 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 6px', color: '#333' }}>SchulFit</h1>
    <p style={{ fontSize: 13, color: '#888', margin: 0 }}>
      German school prep for immigrant families
    </p>
  </div>
);

export function SetupScreen({ onSave, onRestored }: SetupScreenProps) {
  const [mode, setMode] = useState<SetupMode>('choose');
  const [kidName, setKidName] = useState('');

  if (mode === 'choose') {
    return (
      <div style={shell}>
        <div style={card}>
          {header}
          <button
            onClick={() => setMode('new')}
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
              marginBottom: 10,
            }}
          >
            ✨ New child — set up
          </button>
          <button
            onClick={() => setMode('restore')}
            style={{
              width: '100%',
              background: '#f8f9fa',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              padding: '14px',
              fontSize: 15,
              fontWeight: 800,
              color: '#333',
              cursor: 'pointer',
            }}
          >
            ↩️ I already have data
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'restore') {
    return (
      <div style={shell}>
        <div style={card}>
          {header}
          <OnboardingRestore onRestored={onRestored} />
          <button
            onClick={() => setMode('choose')}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#aaa',
              fontSize: 13,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // mode === 'new'
  return (
    <div style={shell}>
      <div style={card}>
        {header}

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
              boxSizing: 'border-box',
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
            marginBottom: 10,
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
            cursor: 'pointer',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
