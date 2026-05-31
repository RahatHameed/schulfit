// =============================================================================
// Application Modes / Screen States
// =============================================================================

import type { Mode } from '../types';

export const MODES = {
  loading: 'loading',
  setup: 'setup',
  welcome: 'welcome',
  menu: 'menu',
  stats: 'stats',
  settings: 'settings',
  about: 'about',
  developer: 'developer',
  flash: 'flash',
  quiz: 'quiz',
  voice: 'voice'
} as const satisfies Record<string, Mode>;
