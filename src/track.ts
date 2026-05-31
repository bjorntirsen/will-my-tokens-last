declare global {
  interface Window {
    goatcounter?: {
      count: (vars: { path: string; event?: boolean }) => void;
    };
  }
}

/**
 * Send a custom event to GoatCounter. No-op if the script hasn't loaded
 * (e.g. blocked by an adblocker or during local dev).
 */
export function trackEvent(event: string) {
  window.goatcounter?.count({ path: `/event/${event}`, event: true });
}
