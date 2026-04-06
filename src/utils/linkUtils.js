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

/**
 * Share the app using Web Share API with clipboard fallback
 * @returns {Promise<{success: boolean, method: 'share'|'clipboard'|'failed'}>}
 */
export async function shareApp() {
  const shareData = {
    title: 'SchulFit - German School Prep',
    text: 'Help your child prepare for the German school entry exam (Einschulungsuntersuchung) with this free app!',
    url: 'https://schulfit.vercel.app'
  };

  // Try Web Share API first (mobile-friendly)
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'share' };
    } catch (e) {
      // User cancelled or share failed, try clipboard
      if (e.name === 'AbortError') {
        return { success: false, method: 'failed' };
      }
    }
  }

  // Fallback to clipboard copy
  try {
    await navigator.clipboard.writeText(shareData.url);
    return { success: true, method: 'clipboard' };
  } catch (e) {
    // Last resort: manual copy
    try {
      const textArea = document.createElement('textarea');
      textArea.value = shareData.url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true, method: 'clipboard' };
    } catch (e2) {
      return { success: false, method: 'failed' };
    }
  }
}
