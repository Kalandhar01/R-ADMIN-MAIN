export interface NewsletterSubscribeResult {
  success: boolean;
  message: string;
  subscriber?: {
    id: string;
    email: string;
    createdAt: string;
  };
  welcomeEmail?: {
    sent: boolean;
    skipped?: boolean;
    error?: string;
    sentAt?: string;
    id?: string;
  };
}

export const subscribedStorageKey = "ractysh_subscribed";
export const subscriberEmailStorageKey = "ractysh-subscription-email";
export const subscribePopupSessionKey = "ractysh-subscribe-popup-shown";

const subscribeEndpoint =
  process.env.NEXT_PUBLIC_RACTYSH_GROUP_SUBSCRIBE_URL || "/api/newsletter/subscribe";

export function hasStoredSubscription() {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(subscribedStorageKey) === "true";
  } catch {
    return false;
  }
}

export function hasSeenSubscribePopupThisSession() {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(subscribePopupSessionKey) === "true";
  } catch {
    return false;
  }
}

export function rememberSubscribePopupShown() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(subscribePopupSessionKey, "true");
  } catch {
    // Session persistence is optional for the visual prompt.
  }
}

export function rememberSubscription(email: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(subscribedStorageKey, "true");
    window.localStorage.setItem(subscriberEmailStorageKey, email);
    window.sessionStorage.setItem(subscribePopupSessionKey, "true");
  } catch {
    // The API remains the source of truth if browser storage is unavailable.
  }
}

export async function subscribeToRactyshNewsletter(
  email: string,
  source: string,
  division = "real-estate"
): Promise<NewsletterSubscribeResult> {
  const response = await fetch(subscribeEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, division })
  });
  const payload = (await response.json().catch(() => ({}))) as Partial<NewsletterSubscribeResult>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Unable to confirm subscription.");
  }

  return {
    success: true,
    message: payload.message || "You are now connected to the Ractysh ecosystem.",
    subscriber: payload.subscriber,
    welcomeEmail: payload.welcomeEmail
  };
}

export async function subscribeUser(email: string, source: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await subscribeToRactyshNewsletter(normalizedEmail, source, "real-estate");
  rememberSubscription(normalizedEmail);
  return result;
}
