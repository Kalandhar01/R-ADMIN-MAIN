export interface RactyshEmailBrand {
  homepageUrl: string;
  logoUrl: string;
  divisions: string[];
}

const defaultLocalUrl = "http://localhost:3000";

export const ractyshEmailPalette = {
  page: "#f7f2e8",
  ivory: "#fffaf0",
  paper: "#ffffff",
  ink: "#181512",
  muted: "#655a4b",
  gold: "#b68a35",
  goldSoft: "#eadfc9",
  deepGold: "#8a7146",
  red: "#7a0f16"
} as const;

export const ractyshEmailDivisions = [
  "Architecture",
  "Construction",
  "Real Estate",
  "Import & Export",
  "OTC Exchange"
] as const;

export const newsletterWelcomeSubjectOptions = [
  "Welcome to the Ractysh Enterprise Ecosystem",
  "Your access to enterprise intelligence begins now",
  "You're now connected to the Ractysh ecosystem",
  "Welcome aboard. Enterprise insights await."
] as const;

export const newsletterWelcomeSubject = newsletterWelcomeSubjectOptions[0];

function absoluteUrl(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function requestOrigin(request?: Request): string | undefined {
  if (!request) return undefined;

  try {
    return new URL(request.url).origin;
  } catch {
    return undefined;
  }
}

export function getRactyshNewsletterEmailBrand(request?: Request): RactyshEmailBrand {
  const homepageUrl =
    absoluteUrl(process.env.NEWSLETTER_PUBLIC_BASE_URL) ||
    requestOrigin(request) ||
    absoluteUrl(process.env.EMAIL_PUBLIC_BASE_URL) ||
    absoluteUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.SITE_URL) ||
    absoluteUrl(process.env.PUBLIC_SITE_URL) ||
    absoluteUrl(process.env.WEB_ORIGIN) ||
    absoluteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    absoluteUrl(process.env.VERCEL_URL) ||
    defaultLocalUrl;

  return {
    homepageUrl,
    logoUrl: `${homepageUrl}/brand/ractysh-logo.png`,
    divisions: [...ractyshEmailDivisions]
  };
}

export const getRactyshEmailBrand = getRactyshNewsletterEmailBrand;
