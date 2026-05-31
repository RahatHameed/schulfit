// =============================================================================
// UpdateBanner - shown when a new app version is available (PWA prompt).
// =============================================================================

interface UpdateBannerProps {
  onReload: () => void;
}

export function UpdateBanner({ onReload }: UpdateBannerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 1000,
        maxWidth: 460,
        margin: '0 auto',
        background: 'white',
        borderRadius: 14,
        boxShadow: '0 8px 30px rgba(0,0,0,.25)',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
      role="status"
    >
      <div style={{ fontSize: 22 }}>✨</div>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#333' }}>
        A new version of SchulFit is available.
      </div>
      <button
        onClick={onReload}
        style={{
          background: 'linear-gradient(135deg,#667eea,#764ba2)',
          border: 'none',
          color: 'white',
          borderRadius: 10,
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 800,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        Reload
      </button>
    </div>
  );
}
