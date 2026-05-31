// =============================================================================
// Celebration Messages and Confetti Colors
// =============================================================================

/** A bilingual celebration message. */
export interface Celebration {
  de: string;
  en: string;
}

// Celebration messages shown after quiz completion
export const CELEB: Celebration[] = [
  { de: 'Yay!', en: 'Amazing!' },
  { de: 'Super!', en: 'Super!' },
  { de: 'Toll!', en: 'Great!' },
  { de: 'Bravo!', en: 'Bravo!' },
  { de: 'Prima!', en: 'Excellent!' },
  { de: 'Klasse!', en: 'Awesome!' }
];

// Confetti colors
export const CC: string[] = [
  '#667eea',
  '#f5576c',
  '#22C55E',
  '#EAB308',
  '#F97316',
  '#A855F7',
  '#EC4899',
  '#06B6D4',
  '#fff'
];
