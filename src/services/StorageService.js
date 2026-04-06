// =============================================================================
// Storage Service - localStorage wrapper with JSON serialization
// =============================================================================

const STORAGE_PREFIX = 'schulfit_';

export const StorageService = {
  /**
   * Get a value from localStorage
   * @param {string} key - Storage key (without prefix)
   * @returns {Promise<any>} Parsed value or null
   */
  async get(key) {
    try {
      const v = localStorage.getItem(STORAGE_PREFIX + key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Set a value in localStorage
   * @param {string} key - Storage key (without prefix)
   * @param {any} value - Value to store (will be JSON serialized)
   */
  async set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      // Silently fail (e.g., quota exceeded)
    }
  },

  /**
   * Remove a value from localStorage
   * @param {string} key - Storage key (without prefix)
   */
  async remove(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch (e) {
      // Silently fail
    }
  },

  /**
   * Clear all schulfit data from localStorage
   */
  async clear() {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      // Silently fail
    }
  }
};
