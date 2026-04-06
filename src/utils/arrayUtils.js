// =============================================================================
// Array Utilities
// =============================================================================

/**
 * Shuffle an array using Fisher-Yates-like algorithm
 * @param {Array} a - Array to shuffle
 * @returns {Array} New shuffled array (does not mutate original)
 */
export function shuffle(a) {
  return a.slice().sort(() => Math.random() - 0.5);
}
