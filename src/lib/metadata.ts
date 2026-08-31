export interface ClientMetadata {
  referrer: string;
  userAgent: string;
  screen: string;
  language: string;
  submittedAt: string;
  clientTime: string;
}

export function getClientMetadata(): ClientMetadata {
  const now = new Date().toISOString();
  if (typeof window === "undefined") {
    return {
      referrer: "Direct / Chat link",
      userAgent: "",
      screen: "",
      language: "",
      submittedAt: now,
      clientTime: now,
    };
  }

  return {
    referrer: document.referrer || "Direct / Chat link",
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    submittedAt: now,
    clientTime: now,
  };
}
