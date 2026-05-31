// =============================================================================
// Array Utilities
// =============================================================================

/**
 * Shuffle an array using Fisher-Yates-like algorithm
 * @param a - Array to shuffle
 * @returns New shuffled array (does not mutate original)
 */
export function shuffle<T>(a: T[]): T[] {
  return a.slice().sort(() => Math.random() - 0.5);
}
