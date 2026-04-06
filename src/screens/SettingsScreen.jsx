// =============================================================================
// SettingsScreen Component - App settings
// =============================================================================

import React, { useState } from 'react';
import { speak, setGender } from '../services/AudioService';

/**
 * Settings screen for app configuration
 * @param {Object} props
 * @param {Object} props.profile - Current user profile
 * @param {string} props.voiceGender - Current voice gender setting
 * @param {Function} props.onVoice - Callback for voice gender change
 * @param {Function} props.onSaveProfile - Callback to save profile
 * @param {Function} props.onBack - Callback to go back
 * @param {Function} props.onResetProgress - Callback to reset progress
 * @param {Function} props.onResetAll - Callback to reset everything
 */
export function SettingsScreen({
  profile,
  voiceGender,
  onVoice,
  onSaveProfile,
  onBack,
  onResetProgress,
  onResetAll
}) {
  const [kidName, setKidName] = useState(profile.kidName || '');
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = async () => {
    await onSaveProfile({ kidName: kidName || 'Champ' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testVoice = (g) => {
    onVoice(g);
    setTimeout(() => {
      setGender(g);
      speak('Hallo! Ich bin dein Assistent.');
    }, 100);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
        fontFamily: 'system-ui,sans-serif',
        padding: '16px 16px 40px'
      }}
    >
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,.2)',
              border: 'none',
              color: 'white',
              borderRadius: 10,
              padding: '8px 14px',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            Back
          </button>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 18
            }}
          >
            Settings
          </div>
        </div>

        {/* Child Nickname */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: 14,
            boxShadow: '0 2px 16px rgba(0,0,0,.12)'
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: '#333', marginBottom: 12 }}>
            Child Nickname
          </div>
          <input
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            placeholder="e.g. Ali, Fatima"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '2px solid #e5e7eb',
              borderRadius: 10,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 12
            }}
          />
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              border: 'none',
              borderRadius: 12,
              padding: '12px',
              fontSize: 15,
              fontWeight: 800,
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {saved ? 'Saved!' : 'Save Name'}
          </button>
        </div>

        {/* Voice Gender */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 20,
            marginBottom: 14,
            boxShadow: '0 2px 16px rgba(0,0,0,.12)'
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: '#333', marginBottom: 6 }}>
            Voice Gender
          </div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>
            Tap to switch and hear a sample.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { g: 'female', label: 'Female', desc: 'Higher pitch' },
              { g: 'male', label: 'Male', desc: 'Lower pitch' }
            ].map((x) => (
              <button
                key={x.g}
                onClick={() => testVoice(x.g)}
                style={{
                  background:
                    voiceGender === x.g
                      ? 'linear-gradient(135deg,#667eea,#764ba2)'
                      : '#f8f9fa',
                  border: `2px solid ${voiceGender === x.g ? '#667eea' : '#e5e7eb'}`,
                  borderRadius: 14,
                  padding: '14px 10px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 4 }}>
                  {voiceGender === x.g ? '🔊' : '🔈'}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: voiceGender === x.g ? 'white' : '#333',
                    marginBottom: 2
                  }}
                >
                  {x.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: voiceGender === x.g ? 'rgba(255,255,255,.8)' : '#888'
                  }}
                >
                  {x.desc}
                </div>
                {voiceGender === x.g && (
                  <div
                    style={{
                      fontSize: 10,
                      color: 'rgba(255,255,255,.9)',
                      marginTop: 4,
                      fontWeight: 700
                    }}
                  >
                    Active
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Data and Reset */}
        <div
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 20,
            boxShadow: '0 2px 16px rgba(0,0,0,.12)'
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, color: '#333', marginBottom: 14 }}>
            Data and Reset
          </div>
          <button
            onClick={onResetProgress}
            style={{
              width: '100%',
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: 12,
              padding: '12px',
              fontSize: 14,
              fontWeight: 700,
              color: '#856404',
              cursor: 'pointer',
              marginBottom: 10
            }}
          >
            Reset Progress Only
          </button>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{
                width: '100%',
                background: '#f8d7da',
                border: '2px solid #dc3545',
                borderRadius: 12,
                padding: '12px',
                fontSize: 14,
                fontWeight: 700,
                color: '#721c24',
                cursor: 'pointer'
              }}
            >
              Reset Everything
            </button>
          ) : (
            <div
              style={{
                background: '#f8d7da',
                borderRadius: 12,
                padding: 14,
                border: '2px solid #dc3545'
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: '#721c24',
                  fontWeight: 700,
                  marginBottom: 10,
                  textAlign: 'center'
                }}
              >
                Delete all data?
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{
                    flex: 1,
                    background: '#6c757d',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={onResetAll}
                  style={{
                    flex: 1,
                    background: '#dc3545',
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Yes Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
