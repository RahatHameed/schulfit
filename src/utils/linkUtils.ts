// =============================================================================
// Link/Navigation Utilities
// =============================================================================

/** Result of a {@link shareApp} attempt. */
export interface ShareResult {
  success: boolean;
  method: 'share' | 'clipboard' | 'failed';
}

/**
 * Open a URL in a new tab safely
 * @param url - URL to open
 */
export function openLink(url: string): void {
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch {
    // Silently fail if popup blocked
  }
}

/**
 * Share the app using Web Share API with clipboard fallback
 */
export async function shareApp(): Promise<ShareResult> {
  const shareData: ShareData & { url: string } = {
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
      if (e instanceof Error && e.name === 'AbortError') {
        return { success: false, method: 'failed' };
      }
    }
  }

  // Fallback to clipboard copy
  try {
    await navigator.clipboard.writeText(shareData.url);
    return { success: true, method: 'clipboard' };
  } catch {
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
    } catch {
      return { success: false, method: 'failed' };
    }
  }
}
