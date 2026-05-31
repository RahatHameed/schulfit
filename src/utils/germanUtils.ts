// =============================================================================
// German Language Utilities
// =============================================================================

/**
 * Convert a number (0-100) to its German word representation
 * @param n - Number to convert (0-100)
 * @returns German word for the number
 */
export function toG(n: number): string {
  if (n === 100) return 'hundert';

  const ones = [
    '', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun',
    'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn',
    'siebzehn', 'achtzehn', 'neunzehn'
  ];

  if (n < 20) return ones[n];

  const tens = [
    '', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig',
    'sechzig', 'siebzig', 'achtzig', 'neunzig'
  ];

  const unit = [
    '', 'ein', 'zwei', 'drei', 'vier', 'fünf',
    'sechs', 'sieben', 'acht', 'neun'
  ];

  const d = Math.floor(n / 10);
  const r = n % 10;

  return r === 0 ? tens[d] : unit[r] + 'und' + tens[d];
}

/**
 * Normalize a string for comparison (lowercase, remove non-alphanumeric)
 * @param s - String to normalize
 * @returns Normalized string
 */
export function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
}
