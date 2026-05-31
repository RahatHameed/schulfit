// =============================================================================
// Storage Service - localStorage wrapper with JSON serialization
// =============================================================================

const STORAGE_PREFIX = 'schulfit_';

export const StorageService = {
  /**
   * Get a value from localStorage
   * @param key - Storage key (without prefix)
   * @returns Parsed value or null
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const v = localStorage.getItem(STORAGE_PREFIX + key);
      return v ? (JSON.parse(v) as T) : null;
    } catch {
      return null;
    }
  },

  /**
   * Set a value in localStorage
   * @param key - Storage key (without prefix)
   * @param value - Value to store (will be JSON serialized)
   */
  async set(key: string, value: unknown): Promise<void> {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch {
      // Silently fail (e.g., quota exceeded)
    }
  },

  /**
   * Remove a value from localStorage
   * @param key - Storage key (without prefix)
   */
  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Silently fail
    }
  },

  /**
   * Clear all schulfit data from localStorage
   */
  async clear(): Promise<void> {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
      keys.forEach(k => localStorage.removeItem(k));
    } catch {
      // Silently fail
    }
  }
};
