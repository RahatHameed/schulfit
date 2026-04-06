// =============================================================================
// Data Generation Service - Generate quiz items dynamically
// =============================================================================

import { toG } from '../utils/germanUtils';
import { shuffle } from '../utils/arrayUtils';

export const DataGenerationService = {
  /**
   * Generate 20 random number items (1-100)
   * @returns {Array} Array of number items with display, german, english
   */
  genNumbers() {
    return shuffle(
      Array.from({ length: 100 }, (_, i) => i + 1)
    ).slice(0, 20).map(n => ({
      display: String(n),
      german: toG(n),
      english: String(n)
    }));
  },

  /**
   * Make multiple choice options for a math result
   * @param {number} r - Correct result
   * @returns {Array} Array of 4 option strings
   */
  mkOpts(r) {
    const w = new Set();
    for (let i = 0; w.size < 3 && i < 40; i++) {
      const x = r + Math.floor(Math.random() * 5) - 2;
      if (x !== r && x >= 0 && x <= 30) w.add(x);
    }
    [1, 2, 3, 4, 5].forEach(d => {
      if (w.size < 3 && r + d <= 30) w.add(r + d);
      if (w.size < 3 && r - d >= 0) w.add(r - d);
    });
    return shuffle([r, ...Array.from(w)]).slice(0, 4).map(String);
  },

  /**
   * Generate 20 math problems (addition and subtraction)
   * @returns {Array} Array of math items
   */
  genMath() {
    return Array.from({ length: 20 }, (_, i) => {
      let a, b, op, r;
      if (i % 2 === 0) {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * (10 - a)) + 1;
        op = '+';
        r = a + b;
      } else {
        r = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * r) + 1;
        a = r + b;
        op = '-';
      }
      return {
        numA: a,
        numB: b,
        op,
        result: r,
        german: String(r),
        mathOpts: this.mkOpts(r)
      };
    });
  },

  /**
   * Generate 20 comparison problems
   * @returns {Array} Array of comparison items
   */
  genComp() {
    const o = [];
    for (let i = 0; i < 20; i++) {
      let a, b, qType, ans;
      const t = i % 4;

      if (t === 3) {
        // Equal question
        if (Math.random() > 0.5) {
          a = b = Math.floor(Math.random() * 9) + 1;
        } else {
          do {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * 10) + 1;
          } while (a === b);
        }
        qType = 'equal';
        ans = a === b ? 'ja' : 'nein';
      } else {
        // Not equal
        do {
          a = Math.floor(Math.random() * 10) + 1;
          b = Math.floor(Math.random() * 10) + 1;
        } while (a === b);

        if (t === 0) {
          qType = 'bigger';
          ans = a > b ? String(a) : String(b);
        } else if (t === 1) {
          qType = 'smaller';
          ans = a < b ? String(a) : String(b);
        } else {
          qType = 'truefalse';
          ans = a > b ? 'ja' : 'nein';
        }
      }

      o.push({ numA: a, numB: b, qType, cmpAnswer: ans });
    }
    return o;
  },

  /**
   * Generate 20 even/odd problems
   * @returns {Array} Array of even/odd items
   */
  genEvenOdd() {
    return shuffle(
      Array.from({ length: 20 }, (_, i) => i + 1)
    ).map(n => ({
      display: String(n),
      german: n % 2 === 0 ? 'Gerade' : 'Ungerade',
      english: n % 2 === 0 ? 'Even' : 'Odd'
    }));
  },

  /**
   * Get items for a category
   * @param {Object} c - Category object
   * @returns {Array} Array of items for the category
   */
  getItems(c) {
    if (c.type === 'comparison') return this.genComp();
    if (c.type === 'math') return this.genMath();
    if (c.type === 'evenodd') return this.genEvenOdd();
    if (c.type === 'colorfill') return shuffle(c.items);
    if (c.type === 'guide') return c.items;

    const its = c.dynamic ? this.genNumbers() : shuffle(c.items);

    if (c.type === 'plural') {
      const out = [];
      its.forEach(item => {
        out.push({ ...item, quizAsk: 'mehrzahl', count: 3 });
        out.push({ ...item, quizAsk: 'einzahl', count: 1 });
      });
      return shuffle(out);
    }

    return its;
  }
};

// Standalone function exports for convenience
export const genNumbers = () => DataGenerationService.genNumbers();
export const mkOpts = (r) => DataGenerationService.mkOpts(r);
export const genMath = () => DataGenerationService.genMath();
export const genComp = () => DataGenerationService.genComp();
export const genEvenOdd = () => DataGenerationService.genEvenOdd();
export const getItems = (c) => DataGenerationService.getItems(c);
