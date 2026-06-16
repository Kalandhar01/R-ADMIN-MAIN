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

export async function subscribeToRactyshNewsletter(email: string, source: string): Promise<NewsletterSubscribeResult> {
  const response = await fetch("/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source })
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
