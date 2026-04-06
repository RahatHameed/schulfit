// =============================================================================
// Link/Navigation Utilities
// =============================================================================

/**
 * Open a URL in a new tab safely
 * @param {string} url - URL to open
 */
export function openLink(url) {
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (e) {
    // Silently fail if popup blocked
  }
}
