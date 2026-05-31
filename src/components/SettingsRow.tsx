// =============================================================================
// SettingsRow - a tappable row (icon + label + optional sublabel + chevron)
// used to build grouped settings lists.
// =============================================================================

interface SettingsRowProps {
  icon: string;
  label: string;
  sublabel?: string;
  onClick: () => void;
  /** Hide the trailing chevron (for action rows like Share). */
  chevron?: boolean;
  /** Show a bottom divider (false on the last row of a group). */
  divider?: boolean;
}

export function SettingsRow({
  icon,
  label,
  sublabel,
  onClick,
  chevron = true,
  divider = true
}: SettingsRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '15px 16px',
        background: 'white',
        border: 'none',
        borderBottom: divider ? '1px solid #f0f0f0' : 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit'
      }}
    >
      <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#333' }}>{label}</span>
        {sublabel && (
          <span style={{ fontSize: 12, color: '#888', marginTop: 1 }}>{sublabel}</span>
        )}
      </span>
      {chevron && <span style={{ color: '#bbb', fontSize: 20, flexShrink: 0 }}>›</span>}
    </button>
  );
}
