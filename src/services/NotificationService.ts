// =============================================================================
// Notification Service (web) - schedules the daily streak reminder.
//
// Background scheduling uses the Notification Triggers API (TimestampTrigger),
// which is Chromium-only and, on desktop, fires only while the browser runs.
// Where it's unavailable, scheduling is a no-op and the reminder only shows
// while the app is open (honest best-effort + fallback).
// =============================================================================

const REMINDER_TAG = 'schulfit-reminder';

// `showTrigger` is part of the Notification Triggers spec and isn't in the
// standard TS DOM lib — extend NotificationOptions locally.
interface TriggerNotificationOptions extends NotificationOptions {
  showTrigger?: unknown;
}

function isSupported(): boolean {
  return typeof Notification !== 'undefined' && 'serviceWorker' in navigator;
}

function supportsBackground(): boolean {
  return isSupported() && typeof TimestampTrigger !== 'undefined';
}

function permission(): NotificationPermission {
  return typeof Notification !== 'undefined' ? Notification.permission : 'denied';
}

async function requestPermission(): Promise<NotificationPermission> {
  if (typeof Notification === 'undefined') return 'denied';
  return Notification.requestPermission();
}

async function registration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  return (await navigator.serviceWorker.getRegistration()) ?? null;
}

/** Compute the next fire time for the reminder. */
function nextFireTime(timeHHMM: string, alreadyPracticed: boolean): Date {
  const [h, m] = timeHHMM.split(':').map((n) => parseInt(n, 10));
  const target = new Date();
  target.setHours(Number.isFinite(h) ? h : 18, Number.isFinite(m) ? m : 0, 0, 0);
  // If today is already done, or the time has passed, aim for tomorrow.
  if (alreadyPracticed || target.getTime() <= Date.now()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

function reminderBody(streak: number): string {
  if (streak > 0) {
    return `Keep your ${streak}-day streak going — practice a little German today! 🔥`;
  }
  return 'Time for a little German practice today! 🇩🇪';
}

/** Cancel any pending streak reminder. */
async function cancelScheduled(): Promise<void> {
  const reg = await registration();
  if (!reg) return;
  try {
    const existing = await reg.getNotifications({ includeTriggered: false } as never);
    for (const n of existing) {
      if (n.tag === REMINDER_TAG) n.close();
    }
  } catch {
    // getNotifications options may be unsupported — nothing to cancel.
  }
}

/**
 * Schedule the daily streak reminder. No-op when notifications aren't granted
 * or background triggers aren't supported.
 */
async function scheduleDailyReminder(
  timeHHMM: string,
  streak: number,
  alreadyPracticed: boolean,
): Promise<void> {
  if (!supportsBackground() || permission() !== 'granted') return;
  const reg = await registration();
  if (!reg) return;

  await cancelScheduled();

  const at = nextFireTime(timeHHMM, alreadyPracticed);
  const options: TriggerNotificationOptions = {
    tag: REMINDER_TAG,
    body: reminderBody(streak),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    showTrigger: new TimestampTrigger(at.getTime()),
  };
  await reg.showNotification('SchulFit', options);
}

/** Show the streak reminder immediately (used for "test reminder"). */
async function notifyNow(streak: number): Promise<void> {
  if (permission() !== 'granted') return;
  const reg = await registration();
  const options: NotificationOptions = {
    tag: REMINDER_TAG,
    body: reminderBody(streak),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
  };
  if (reg) await reg.showNotification('SchulFit', options);
  else new Notification('SchulFit', options);
}

export const NotificationService = {
  isSupported,
  supportsBackground,
  permission,
  requestPermission,
  scheduleDailyReminder,
  cancelScheduled,
  notifyNow,
};
