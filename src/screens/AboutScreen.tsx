// =============================================================================
// AboutScreen Component - About the app (description, developer link, bug
// report, version). Personal bio & social links live on DeveloperScreen.
// =============================================================================

import { openLink } from '../utils/linkUtils';

interface Props {
  onBack: () => void;
  onDeveloper: () => void;
}

export function AboutScreen({ onBack, onDeveloper }: Props) {
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

        {/* App info */}
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
          <div style={{ fontSize: 64, marginBottom: 8 }}>🇩🇪</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#333', marginBottom: 4 }}>
            SchulFit
          </div>
          <div style={{ fontSize: 13, color: '#667eea', fontWeight: 700, marginBottom: 12 }}>
            German school-entry exam prep
          </div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>
            A free app that helps immigrant families in Germany prepare their children for the
            Einschulungsuntersuchung - through playful quizzes for language, numbers, thinking
            and more. Everything works offline and your data stays on your device.
          </div>
        </div>

        {/* Developer link */}
        <button
          onClick={onDeveloper}
          style={{
            width: '100%',
            background: 'white',
            border: 'none',
            borderRadius: 16,
            padding: '16px 20px',
            cursor: 'pointer',
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 2px 16px rgba(0,0,0,.12)'
          }}
        >
          <span style={{ fontSize: 32 }}>👨‍💻</span>
          <span style={{ flex: 1, textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#333' }}>
              About the Developer
            </span>
            <span style={{ display: 'block', fontSize: 12, color: '#888' }}>
              Bio, social media & support
            </span>
          </span>
          <span style={{ fontSize: 20, color: '#bbb' }}>›</span>
        </button>

        {/* Bug Report Section */}
        <div
          style={{
            background: 'rgba(255,255,255,.15)',
            borderRadius: 16,
            padding: '16px 20px',
            marginBottom: 14
          }}
        >
          <div style={{ color: 'white', fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
            Found a Bug?
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,.8)',
              fontSize: 12,
              lineHeight: 1.6,
              marginBottom: 12
            }}
          >
            Help us improve SchulFit by reporting issues. You can also suggest new features or
            improvements.
          </div>
          <button
            onClick={() => openLink('https://github.com/RahatHameed/schulfit/issues')}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,.2)',
              border: 'none',
              borderRadius: 12,
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <span style={{ fontSize: 18 }}>🐛</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>
              Report Bug on GitHub
            </span>
          </button>
        </div>

        {/* Version Info */}
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,.5)', fontSize: 11 }}>
          SchulFit v2.0.0
        </div>
      </div>
    </div>
  );
}
