// =============================================================================
// Quiz Logic Service - Answer validation and quiz helpers
// =============================================================================

import { toG } from '../utils/germanUtils';
import { shuffle } from '../utils/arrayUtils';
import { PAL } from '../data/colors';

export const QuizLogicService = {
  /**
   * Get the correct answer value for an item
   * @param {Object} item - Quiz item
   * @param {Object} cat - Category object
   * @returns {string} Correct answer
   */
  correctVal(item, cat) {
    if (!item || !cat) return '';
    if (cat.type === 'plural') {
      return item.quizAsk === 'einzahl' ? item.german : item.plural;
    }
    if (cat.type === 'comparison') {
      return item.cmpAnswer || '';
    }
    return item.german || '';
  },

  /**
   * Generate speech text for a question
   * @param {Object} item - Quiz item
   * @param {Object} cat - Category object
   * @returns {string} German text to speak
   */
  qSpeech(item, cat) {
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
      const a = toG(item.numA);
      const b = toG(item.numB);
      if (item.qType === 'smaller') {
        return 'Welche Zahl ist kleiner? ' + a + ' oder ' + b + '?';
      }
      if (item.qType === 'truefalse') {
        return 'Ist ' + a + ' groesser als ' + b + '? Ja oder Nein?';
      }
      if (item.qType === 'equal') {
        return 'Sind ' + a + ' und ' + b + ' gleich? Ja oder Nein?';
      }
      return 'Welche Zahl ist groesser? ' + a + ' oder ' + b + '?';
    }

    if (cat.type === 'math') {
      const op = item.op === '+' ? 'plus' : 'minus';
      return toG(item.numA) + ' ' + op + ' ' + toG(item.numB);
    }

    return this.correctVal(item, cat);
  },

  /**
   * Build answer options for a question
   * @param {Object} item - Quiz item
   * @param {Object} cat - Category object
   * @param {Array} items - All items in current session
   * @returns {Array} Array of answer options
   */
  buildOpts(item, cat, items) {
    if (!item || !cat) return [];

    const t = cat.type;

    if (t === 'colorfill') {
      const c = PAL.find(x => x.german === item.german);
      const others = shuffle(PAL.filter(x => x.german !== item.german)).slice(0, 5);
      return shuffle([c, ...others]);
    }

    if (t === 'comparison') return [];
    if (t === 'math') return item.mathOpts || [];
    if (t === 'plural') return [item.german, item.plural];
    if (t === 'evenodd') return ['Gerade', 'Ungerade'];

    const others = shuffle(items.filter(i => i.german !== item.german)).slice(0, 3);
    return shuffle([item, ...others]).map(o => o.german);
  }
};

// Standalone function exports for convenience
export const correctVal = (item, cat) => QuizLogicService.correctVal(item, cat);
export const qSpeech = (item, cat) => QuizLogicService.qSpeech(item, cat);
export const buildOpts = (item, cat, items) => QuizLogicService.buildOpts(item, cat, items);
