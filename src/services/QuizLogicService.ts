// =============================================================================
// Quiz Logic Service - Answer validation and quiz helpers
// =============================================================================

import { toG } from '../utils/germanUtils';
import { shuffle } from '../utils/arrayUtils';
import { PAL } from '../data/colors';
import type { Item, Cat, ColorItem } from '../types';

export const QuizLogicService = {
  /**
   * Get the correct answer value for an item
   * @param item - Quiz item
   * @param cat - Category object
   * @returns Correct answer
   */
  correctVal(item: Item | null, cat: Cat | null): string {
    if (!item || !cat) return '';
    if (cat.type === 'plural') {
      return (item.quizAsk === 'einzahl' ? item.german : item.plural) || '';
    }
    if (cat.type === 'comparison') {
      return item.cmpAnswer || '';
    }
    return item.german || '';
  },

  /**
   * Generate speech text for a question
   * @param item - Quiz item
   * @param cat - Category object
   * @returns German text to speak
   */
  qSpeech(item: Item | null, cat: Cat | null): string {
    if (!item || !cat) return '';

    if (cat.type === 'plural') {
      const word = item.quizAsk === 'einzahl' ? item.german : item.plural;
      return item.count === 1
        ? 'Ist ' + word + ' Einzahl oder Mehrzahl?'
        : 'Sind ' + word + ' Einzahl oder Mehrzahl?';
    }

    if (cat.type === 'evenodd') {
      return 'Ist ' + item.display + ' gerade oder ungerade?';
    }

    if (cat.type === 'comparison') {
      const a = toG(item.numA ?? 0);
      const b = toG(item.numB ?? 0);
      if (item.qType === 'smaller') {
        return 'Welche Zahl ist kleiner? ' + a + ' oder ' + b + '?';
      }
      if (item.qType === 'truefalse') {
        return 'Ist ' + a + ' größer als ' + b + '? Ja oder Nein?';
      }
      if (item.qType === 'equal') {
        return 'Sind ' + a + ' und ' + b + ' gleich? Ja oder Nein?';
      }
      return 'Welche Zahl ist größer? ' + a + ' oder ' + b + '?';
    }

    if (cat.type === 'math') {
      const op = item.op === '+' ? 'plus' : 'minus';
      return toG(item.numA ?? 0) + ' ' + op + ' ' + toG(item.numB ?? 0);
    }

    if (cat.type === 'choice') {
      return item.prompt || item.question || '';
    }

    return this.correctVal(item, cat);
  },

  /**
   * Build answer options for a question
   * @param item - Quiz item
   * @param cat - Category object
   * @param items - All items in current session
   * @returns Array of answer options (ColorItem objects for colorfill, strings otherwise)
   */
  buildOpts(item: Item | null, cat: Cat | null, items: Item[]): (string | ColorItem)[] {
    if (!item || !cat) return [];

    const t = cat.type;

    if (t === 'colorfill') {
      const c = PAL.find(x => x.german === item.german) as ColorItem;
      const others = shuffle(PAL.filter(x => x.german !== item.german)).slice(0, 5);
      return shuffle([c, ...others]);
    }

    if (t === 'comparison') return [];
    if (t === 'math') return item.mathOpts || [];
    if (t === 'plural') return [item.german, item.plural] as string[];
    if (t === 'evenodd') return ['Gerade', 'Ungerade'];
    if (t === 'choice') return shuffle(item.options ?? []);

    const others = shuffle(items.filter(i => i.german !== item.german)).slice(0, 3);
    return shuffle([item, ...others]).map((o: Item) => o.german) as string[];
  }
};

// Standalone function exports for convenience
export const correctVal = (item: Item | null, cat: Cat | null): string =>
  QuizLogicService.correctVal(item, cat);
export const qSpeech = (item: Item | null, cat: Cat | null): string =>
  QuizLogicService.qSpeech(item, cat);
export const buildOpts = (item: Item | null, cat: Cat | null, items: Item[]): (string | ColorItem)[] =>
  QuizLogicService.buildOpts(item, cat, items);
