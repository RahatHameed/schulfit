// =============================================================================
// AboutScreen Component - About page with developer info
// =============================================================================

import React from 'react';
import { openLink } from '../utils/linkUtils';

/**
 * About screen with developer information and social links
 * @param {Object} props
 * @param {Function} props.onBack - Callback to go back
 */
export function AboutScreen({ onBack }) {
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
            About SchulFit
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: 24,
            padding: 28,
            marginBottom: 14,
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,.15)'
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 8 }}>👨‍💻</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#333', marginBottom: 4 }}>
            Rahat Hameed
          </div>
          <div
            style={{ fontSize: 13, color: '#667eea', fontWeight: 700, marginBottom: 12 }}
          >
            Pakistani Software Engineer - Frankfurt, Germany
          </div>
          <div
            style={{
              fontSize: 13,
              color: '#555',
              lineHeight: 1.7,
              marginBottom: 20
            }}
          >
            I built SchulFit to help immigrant families in Germany prepare their children
            for the Einschulungsuntersuchung. As a Pakistani living in Frankfurt, I
            understand the challenges. This app is my free contribution to every family.
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginBottom: 10
            }}
          >
            <button
              onClick={() => openLink('https://www.instagram.com/rahatrajpoot')}
              style={{
                background: 'linear-gradient(135deg,#f5576c,#f093fb)',
                border: 'none',
                borderRadius: 14,
                padding: '14px 10px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>📸</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>Instagram</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.8)' }}>
                @rahatrajpoot
              </div>
            </button>
            <button
              onClick={() => openLink('https://youtube.com/@rahatrajpoot')}
              style={{
                background: 'linear-gradient(135deg,#ff0000,#ff6b35)',
                border: 'none',
                borderRadius: 14,
                padding: '14px 10px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>▶️</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>YouTube</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.8)' }}>
                @rahatrajpoot
              </div>
            </button>
          </div>

          <button
            onClick={() => openLink('https://forms.gle/drTrdvgwEJsc9kbn7')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#22C55E,#16a34a)',
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              cursor: 'pointer',
              marginBottom: 10
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>
              Join the Community
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)' }}>
              Get notified about new features
            </div>
          </button>

          <button
            onClick={() => openLink('https://www.paypal.com/paypalme/rahatrajpoot')}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              border: 'none',
              borderRadius: 14,
              padding: '14px',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>
              Support SchulFit
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)' }}>
              Help keep it free for all families
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
