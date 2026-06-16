export interface NavItem {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    description: string;
    href: string;
  }>;
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  trustLine: string;
}

export interface Division {
  id: string;
  name: string;
  legalName: string;
  summary: string;
  services: string[];
  metric: string;
}

export interface ServiceCard {
  title: string;
  description: string;
  company: string;
  tags: string[];
  image?: string;
  href?: string;
}

export interface Project {
  title: string;
  category: string;
  location: string;
  summary: string;
  year: string;
}

export interface Statistic {
  label: string;
  value: number;
  suffix: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  approved?: boolean;
}

export interface BlogPost {
  title: string;
  category: string;
  excerpt: string;
  date: string;
  slug?: string;
  image?: string;
  readingTime?: string;
  tags?: string[];
  body?: string;
}

export interface SectionConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  fileUrl?: string;
}

export interface FounderProfile {
  name: string;
  role: string;
  image: string;
  heroImage: string;
  shortArticle: string;
  biography: string;
  vision: string;
  mission: string;
  resumeSummary: string;
  achievements: string[];
  timeline: TimelineItem[];
  certifications: CertificationItem[];
  awards: string[];
  socialLinks: SocialLink[];
  gallery: string[];
}

export interface DirectorProfile {
  name: string;
  position: string;
  image: string;
  experience: string;
  biography: string;
  leadershipStatement: string;
  socialLinks: SocialLink[];
}

export interface BusinessDivision {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  href: string;
  cta: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  highlights: string[];
}

export interface LocationInfo {
  name: string;
  address: string;
  outlookLocation: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
}

export interface LegalDocument {
  slug: string;
  title: string;
  summary: string;
  body: string;
  updatedAt: string;
}

export interface LegalContent {
  trademarkNotice: string;
  certificateTitle: string;
  certificateUrl: string;
  certificatePreviewUrl: string;
  documents: LegalDocument[];
}

export interface SubscriptionPopupContent {
  enabled: boolean;
  delayMs: number;
  title: string;
  description: string;
  ctaLabel: string;
}

export interface GoogleRatingsContent {
  score: number;
  totalReviews: number;
  rateUsUrl: string;
  reviews: Array<{
    name: string;
    role: string;
    rating: number;
    quote: string;
  }>;
}

export interface FeedbackContent {
  title: string;
  description: string;
  email: string;
}

export interface CareerContent {
  heroTitle: string;
  intro: string;
  culture: string[];
  jobs: Array<{
    title: string;
    location: string;
    type: string;
    summary: string;
  }>;
  internships: Array<{
    title: string;
    summary: string;
  }>;
}

export interface EnterprisePageContent {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
}

export interface SiteContent {
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    canonicalUrl?: string;
  };
  theme: {
    mode: "dark" | "light";
    accent: string;
  };
  nav: {
    logoText: string;
    items: NavItem[];
  };
  hero: HeroContent;
  divisions: Division[];
  services: ServiceCard[];
  projects: Project[];
  stats: Statistic[];
  testimonials: Testimonial[];
  blogs: BlogPost[];
  founder?: FounderProfile;
  directors?: DirectorProfile[];
  businessDivisions?: BusinessDivision[];
  locations?: LocationInfo[];
  legal?: LegalContent;
  popup?: SubscriptionPopupContent;
  googleRatings?: GoogleRatingsContent;
  feedback?: FeedbackContent;
  careers?: CareerContent;
  pages?: EnterprisePageContent[];
  certifications?: CertificationItem[];
  milestones?: TimelineItem[];
  partners?: Array<{
    name: string;
    description: string;
  }>;
  sections: SectionConfig[];
  footer: {
    headline: string;
    description: string;
    links: NavItem[];
    socialLinks?: SocialLink[];
  };
  updatedAt: string;
}
