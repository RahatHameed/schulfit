// =============================================================================
// German Language Utilities
// =============================================================================

/**
 * Convert a number (0-100) to its German word representation
 * @param {number} n - Number to convert (0-100)
 * @returns {string} German word for the number
 */
export function toG(n) {
  if (n === 100) return 'hundert';

  const ones = [
    '', 'eins', 'zwei', 'drei', 'vier', 'funf', 'sechs', 'sieben', 'acht', 'neun',
    'zehn', 'elf', 'zwolf', 'dreizehn', 'vierzehn', 'funfzehn', 'sechzehn',
    'siebzehn', 'achtzehn', 'neunzehn'
  ];

  if (n < 20) return ones[n];

  const tens = [
    '', '', 'zwanzig', 'dreissig', 'vierzig', 'funfzig',
    'sechzig', 'siebzig', 'achtzig', 'neunzig'
  ];

  const unit = [
    '', 'ein', 'zwei', 'drei', 'vier', 'funf',
    'sechs', 'sieben', 'acht', 'neun'
  ];

  const d = Math.floor(n / 10);
  const r = n % 10;

  return r === 0 ? tens[d] : unit[r] + 'und' + tens[d];
}

/**
 * Normalize a string for comparison (lowercase, remove non-alphanumeric)
 * @param {string} s - String to normalize
 * @returns {string} Normalized string
 */
export function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}
