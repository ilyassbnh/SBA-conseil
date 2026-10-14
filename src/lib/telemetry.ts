export interface TelemetryPayload {
  event: string;
  url: string;
  referrer: string;
  userAgent: string;
  screen: string;
  language: string;
  timestamp: string;
  buttonLabel?: string;
}

let lastTrackedTimestamp = 0;

/**
 * Silently dispatches client telemetry tracking for the quote start action.
 * Executes without blocking or delaying UI interactions and swallows errors.
 */
export function trackQuoteClick(
  customEvent: string = "clicked_start_quote",
  buttonLabel: string = "Obtenir un devis"
): void {
  if (typeof window === "undefined") return;

  try {
    const now = Date.now();
    // Debounce rapid duplicate clicks within 800ms
    if (now - lastTrackedTimestamp < 800) {
      return;
    }
    lastTrackedTimestamp = now;

    if (localStorage.getItem("ignore_admin") === "true") {
      return;
    }

    const payload: TelemetryPayload = {
      event: customEvent,
      url: window.location.href,
      referrer: document.referrer || "Direct / Chat Link",
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      timestamp: new Date().toISOString(),
      buttonLabel,
    };

    const webhookUrl =
      process.env.NEXT_PUBLIC_TRACKING_WEBHOOK_URL ||
      "https://YOUR_N8N_URL/webhook/site-visit-tracker";

    // Silent keepalive POST request to the tracking webhook
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Silently swallow network errors
    });

    // Silent keepalive POST request to the internal backend tracking route (triggers Looker Lead email)
    fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // Silently swallow network errors
    });
  } catch {
    // Silently catch any unexpected browser API errors
  }
}
