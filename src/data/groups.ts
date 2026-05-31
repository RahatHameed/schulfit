// =============================================================================
// Category Groups
// =============================================================================

import type { Group } from '../types';

export const GROUPS: Group[] = [
  {
    title: 'Language and Vocabulary',
    ids: [
      'colors', 'shapes', 'body', 'objects', 'animals', 'food', 'family', 'time',
      'positions', 'jobs', 'dinos', 'gefuehle', 'kleidung', 'wetter', 'schulsachen',
      'verkehr', 'verben'
    ]
  },
  {
    title: 'Grammar and Speech',
    ids: ['plural', 'questions', 'artikel', 'gegenteile', 'anlaute', 'reime']
  },
  {
    title: 'Numbers and Math',
    ids: ['numbers', 'comparison', 'math', 'evenodd', 'mengen']
  },
  {
    title: 'Thinking and Logic',
    ids: ['oddoneout', 'muster']
  },
  {
    title: 'Fun Activities',
    ids: ['colorfill']
  },
  {
    title: 'For Parents',
    ids: ['guide']
  }
];
