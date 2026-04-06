// =============================================================================
// WelcomeScreen Component - Home/welcome screen
// =============================================================================

import React, { useState } from 'react';
import { Owl, TutOverlay } from '../components';
import { BG, CSS, B } from '../constants/styles';
import { openLink, shareApp } from '../utils/linkUtils';

/**
 * Welcome screen with main navigation
 * @param {Object} props
 * @param {Object} props.profile - User profile
 * @param {string} props.owlState - Current owl animation state
 * @param {number} props.tutStep - Current tutorial step (-1 if not showing)
 * @param {Function} props.onTutNext - Tutorial next callback
 * @param {Function} props.onTutSkip - Tutorial skip callback
 * @param {Function} props.onStart - Start practicing callback
 * @param {Function} props.onStats - Open stats callback
 * @param {Function} props.onSettings - Open settings callback
 * @param {Function} props.onAbout - Open about callback
 * @param {Function} props.onShowTutorial - Show tutorial again callback
 */
export function WelcomeScreen({
  profile,
  owlState,
  tutStep,
  onTutNext,
  onTutSkip,
  onStart,
  onStats,
  onSettings,
  onAbout,
  onShowTutorial
}) {
  const [shareStatus, setShareStatus] = useState(null);

  const handleShare = async () => {
    const result = await shareApp();
    if (result.method === 'clipboard' && result.success) {
      setShareStatus('copied');
      setTimeout(() => setShareStatus(null), 2000);
    } else if (result.method === 'share' && result.success) {
      setShareStatus('shared');
      setTimeout(() => setShareStatus(null), 2000);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BG,
        fontFamily: 'system-ui,sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
    >
      <style>{CSS}</style>
      {tutStep >= 0 && (
        <TutOverlay step={tutStep} onNext={onTutNext} onSkip={onTutSkip} />
      )}
      <div style={{ maxWidth: 440, width: '100%', textAlign: 'center', color: 'white' }}>
        <Owl state={owlState} size={80} />
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '12px 0 4px' }}>SchulFit</h1>
        {profile.kidName && (
          <div style={{ fontSize: 17, opacity: 0.9, marginBottom: 4 }}>
            Welcome back, {profile.kidName}!
          </div>
        )}
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 24 }}>
          Einschulungsuntersuchung Practice
        </div>

        <button
          onClick={onStart}
          style={{
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: 16,
            padding: '16px 40px',
            fontSize: 18,
            fontWeight: 800,
            cursor: 'pointer',
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,.2)',
            marginBottom: 10
          }}
        >
          Start Practicing
        </button>

        <button
          onClick={onStats}
          style={{
            ...B('rgba(255,255,255,.2)'),
            width: '100%',
            padding: 12,
            fontSize: 15,
            marginBottom: 10
          }}
        >
          Progress Dashboard
        </button>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button
            onClick={onSettings}
            style={{ ...B('rgba(255,255,255,.15)'), flex: 1, padding: 12, fontSize: 15 }}
          >
            Settings
          </button>
          <button
            onClick={onAbout}
            style={{ ...B('rgba(255,255,255,.15)'), flex: 1, padding: 12, fontSize: 15 }}
          >
            About
          </button>
        </div>

        {/* Developer info */}
        <div
          style={{
            background: 'rgba(255,255,255,.1)',
            borderRadius: 16,
            padding: '14px 18px',
            textAlign: 'left',
            marginBottom: 14
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>Rahat Hameed</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 10 }}>
            Pakistani software engineer in Frankfurt. Building free tools for immigrant
            families in Germany.
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => openLink('https://www.instagram.com/rahatrajpoot')}
              style={{ ...B('rgba(255,255,255,.2)'), flex: 1, fontSize: 12 }}
            >
              Instagram
            </button>
            <button
              onClick={() => openLink('https://youtube.com/@rahatrajpoot')}
              style={{ ...B('rgba(255,0,0,.5)'), flex: 1, fontSize: 12 }}
            >
              YouTube
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button
              onClick={() => openLink('https://forms.gle/drTrdvgwEJsc9kbn7')}
              style={{ ...B('rgba(34,197,94,.7)'), flex: 1, fontSize: 12, fontWeight: 800 }}
            >
              Join Community
            </button>
            <button
              onClick={() => openLink('https://www.paypal.com/paypalme/rahatrajpoot')}
              style={{ ...B('rgba(0,48,135,.5)'), flex: 1, fontSize: 12 }}
            >
              Support
            </button>
          </div>
          <button
            onClick={handleShare}
            style={{
              ...B(shareStatus === 'copied' ? 'rgba(34,197,94,.8)' : 'rgba(255,255,255,.25)'),
              width: '100%',
              fontSize: 13,
              fontWeight: 700,
              transition: 'background 0.2s'
            }}
          >
            {shareStatus === 'copied' ? '✓ Link Copied!' : shareStatus === 'shared' ? '✓ Shared!' : '📤 Share with Friends'}
          </button>
        </div>

        <button
          onClick={onShowTutorial}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,.5)',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          Show Tutorial Again
        </button>
      </div>
    </div>
  );
}
