// =============================================================================
// Shared domain types for SchulFit
// =============================================================================

/** Voice gender used by the TTS service. */
export type VoiceGender = 'male' | 'female';

/** Category list view in the menu. */
export type ViewMode = 'grid' | 'list';

/** Owl mascot animation state. */
export type OwlState = 'idle' | 'talk' | 'happy' | 'sad';

/** App screen / mode. Mirrors the values in constants/modes. */
export type Mode =
  | 'loading'
  | 'setup'
  | 'welcome'
  | 'menu'
  | 'stats'
  | 'settings'
  | 'about'
  | 'developer'
  | 'flash'
  | 'quiz'
  | 'voice';

/** Special category behaviours; plain vocabulary categories have no type. */
export type CatType =
  | 'plural'
  | 'comparison'
  | 'math'
  | 'evenodd'
  | 'colorfill'
  | 'guide'
  // Generic "prompt + pick an option" mechanic (articles, opposites, first
  // sound, rhymes, odd-one-out, patterns, quantities).
  | 'choice';

/** A German/English phrase pair (parent guide). */
export interface GuidePhrase {
  de: string;
  en: string;
}

/**
 * A single quiz item. Different category types use different subsets of these
 * fields, so most are optional. (Kept as one broad shape to avoid pervasive
 * union narrowing across the UI.)
 */
export interface Item {
  emoji?: string;
  german?: string;
  english?: string;
  // plural
  plural?: string;
  quizAsk?: 'mehrzahl' | 'einzahl';
  count?: number;
  // numbers / evenodd
  display?: string;
  // math
  numA?: number;
  numB?: number;
  op?: '+' | '-';
  result?: number;
  mathOpts?: string[];
  // comparison
  qType?: 'bigger' | 'smaller' | 'truefalse' | 'equal';
  cmpAnswer?: string;
  // colorfill
  shape?: string;
  hex?: string;
  // guide
  phrases?: GuidePhrase[];
  content?: string[];
  // choice (generic prompt + options). The correct answer is `german`.
  prompt?: string;
  question?: string;
  promptEmoji?: string;
  options?: string[];
}

/** A learning category. */
export interface Cat {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  emoji: string;
  type?: CatType;
  dynamic?: boolean;
  noQuiz?: boolean;
  /** Offer only the quiz mode (hide flash & voice buttons in the menu). */
  quizOnly?: boolean;
  items: Item[];
}

/** A color in the palette / colorfill game. */
export interface ColorItem {
  german: string;
  english: string;
  hex: string;
}

/** A group of categories shown together in the menu. */
export interface Group {
  title: string;
  ids: string[];
}

/** User profile. */
export interface Profile {
  kidName: string;
}

/** Persisted preferences. */
export interface Prefs {
  view?: ViewMode;
  voice?: VoiceGender;
  tutorialDone?: boolean;
  /** Daily streak reminder enabled. Defaults to true when unset. */
  notifications?: boolean;
  /** Daily reminder time as "HH:MM". Defaults to "18:00". */
  reminderTime?: string;
}

/** Progress stats for a single category. */
export interface CatProgressEntry {
  sessions: number;
  bestScore: number;
  bestTotal: number;
  totalCorrect: number;
  totalQuestions: number;
  lastPlayed?: string;
}

/** Progress keyed by category id. */
export type CatProgress = Record<string, CatProgressEntry>;

/** One day's aggregated practice stats. */
export interface DailyStat {
  date: string;
  questions: number;
  correct: number;
  sessions?: number;
  time?: number;
  timeSeconds?: number;
}

/** Portable backup snapshot (export / import / Drive). */
export interface DataExport {
  version: 1;
  exportedAt: string;
  profile: Profile | null;
  prefs: Prefs | null;
  progress: CatProgress;
  daily: DailyStat[];
}
