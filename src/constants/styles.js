// =============================================================================
// Style Constants and Style Generator Functions
// =============================================================================

// Main background gradient
export const BG = 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)';

// CSS animations
export const CSS = `
@keyframes confettiFall {
  0% { transform: translateY(-30px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(800deg); opacity: 0; }
}

@keyframes celebPop {
  0% { transform: scale(0) rotate(-15deg); opacity: 0; }
  45% { transform: scale(1.35) rotate(5deg); opacity: 1; }
  70% { transform: scale(1) rotate(-2deg); opacity: 1; }
  100% { transform: scale(0.6); opacity: 0; }
}

.celeb-pop {
  animation: celebPop 1.4s cubic-bezier(.17,.67,.35,1.2) forwards;
  text-align: center;
}

@keyframes owlFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes owlTalk {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15) rotate(-6deg); }
}

@keyframes owlHappy {
  0% { transform: scale(1); }
  40% { transform: scale(1.4) rotate(15deg); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes owlSad {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px) rotate(-8deg); }
}

.owl-idle { animation: owlFloat 2s ease-in-out infinite; }
.owl-talk { animation: owlTalk 0.35s ease-in-out infinite; }
.owl-happy { animation: owlHappy 0.75s ease-out; }
.owl-sad { animation: owlSad 0.55s ease-in-out 3; }
`;

// Card style (for flashcards and quiz cards)
export const CARD = {
  background: 'white',
  borderRadius: 24,
  padding: '22px 18px',
  textAlign: 'center',
  boxShadow: '0 8px 30px rgba(0,0,0,.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
};

// Speaker button style (large)
export const SPK = {
  marginTop: 12,
  background: '#667eea',
  border: 'none',
  color: 'white',
  borderRadius: '50%',
  width: 44,
  height: 44,
  fontSize: 18,
  cursor: 'pointer'
};

// Mini speaker button style
export const MSPK = {
  background: '#667eea',
  border: 'none',
  color: 'white',
  borderRadius: '50%',
  width: 28,
  height: 28,
  fontSize: 13,
  cursor: 'pointer',
  padding: 0
};

/**
 * Generate button style with optional gradient
 * @param {string} c1 - Primary color
 * @param {string} c2 - Secondary color (optional, creates gradient)
 * @returns {Object} Button style object
 */
export function B(c1, c2) {
  return {
    background: c2 ? `linear-gradient(135deg,${c1},${c2})` : c1,
    border: 'none',
    color: 'white',
    borderRadius: 10,
    padding: '10px 16px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 14
  };
}

/**
 * Generate badge style
 * @param {string} c - Badge type ('blue' or other)
 * @returns {Object} Badge style object
 */
export function bdg(c) {
  return {
    background: c === 'blue' ? '#667eea' : '#11998e',
    color: 'white',
    borderRadius: 6,
    padding: '2px 8px',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0
  };
}
