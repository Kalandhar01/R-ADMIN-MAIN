import type { Prisma } from "@prisma/client";

export type AdminView =
  | "home"
  | "overview"
  | "businesses"
  | "domains"
  | "command"
  | "leads"
  | "projects"
  | "blogs"
  | "newsletter"
  | "services"
  | "media"
  | "careers"
  | "analytics"
  | "notifications"
  | "settings"
  | "audit"
  | "chatbot"
  | "contacts";

export type LeadFilter = "New" | "Read" | "Responded" | "Archived";
export type ProjectKey = string;
export type NotificationPriority = "low" | "medium" | "high" | "critical";
export type NotificationStatus = "unread" | "read" | "archived";

export type AdminSessionUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
};

export type MetricCard = {
  key: string;
  label: string;
  value: number;
  detail: string;
  format?: "number" | "currency" | "percent";
};

export type PipelineMetric = {
  label: LeadFilter;
  value: number;
};

export type LeadRow = {
  id: string;
  entityId: string;
  division: ProjectKey;
  kind: "Contact" | "Consultation" | "Career";
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: LeadFilter;
  rawStatus: string;
  createdAt: string;
};

export type ProjectOption = {
  key: ProjectKey;
  slug: string;
  label: string;
  keywords: string[];
  description?: string;
  href: string;
  status?: string;
  domain?: string | null;
};

export type BusinessRow = {
  id: string;
  key: ProjectKey;
  slug: string;
  label: string;
  legalName: string;
  summary: string;
  description: string | null;
  website: string | null;
  status: string;
  position: number;
  primaryDomain: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DomainMappingRow = {
  id: string;
  domain: string;
  division: ProjectKey;
  divisionLabel: string;
  companyId: string | null;
  status: string;
  primary: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityRow = {
  id: string;
  title: string;
  detail: string;
  actor: string;
  action: string;
  entity: string;
  project: ProjectKey;
  division: ProjectKey;
  priority: NotificationPriority;
  createdAt: string;
};

export type AlertRow = {
  id: string;
  title: string;
  detail: string;
  project: ProjectKey;
  division: ProjectKey;
  priority: NotificationPriority;
  createdAt: string;
};

export type ReviewRow = {
  id: string;
  title: string;
  detail: string;
  type: string;
  project: ProjectKey;
  division: ProjectKey;
  priority: NotificationPriority;
  createdAt: string;
};

export type NotificationRow = {
  id: string;
  title: string;
  message: string;
  project: ProjectKey;
  division: ProjectKey;
  priority: NotificationPriority;
  status: NotificationStatus;
  entity: string | null;
  entityId: string | null;
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
  archivedAt: string | null;
};

export type BlogRow = {
  id: string;
  division: ProjectKey;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  coverImageAlt: string | null;
  author: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: string;
  publishedAt: string | null;
  readTime: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
};

export type SubscriberRow = {
  id: string;
  division: ProjectKey;
  email: string;
  status: string;
  source: string;
  table: "NewsletterSubscriber" | "Subscriber";
  createdAt: string;
};

export type NewsletterRow = {
  id: string;
  division: ProjectKey;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  featured: boolean;
  status: string;
  publishDate: string | null;
  tags: string[];
  readTime: string;
  views: number;
  updatedAt: string;
};

export type ServiceRow = {
  id: string;
  division: ProjectKey;
  companyId: string;
  companyName: string;
  title: string;
  slug: string;
  summary: string;
  description: string | null;
  category: string;
  href: string | null;
  imageUrl: string | null;
  heroContent: Prisma.JsonValue;
  metrics: Prisma.JsonValue;
  images: string[];
  sections: Prisma.JsonValue;
  cta: Prisma.JsonValue;
  seo: Prisma.JsonValue;
  tags: string[];
  status: string;
  position: number;
  updatedAt: string;
};

export type MediaRow = {
  id: string;
  division: ProjectKey;
  title: string;
  altText: string | null;
  kind: string;
  url: string;
  folder: string;
  provider: string;
  providerId: string | null;
  mimeType: string | null;
  size: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRow = {
  id: string;
  source: "Project" | "IngestedProject";
  divisionKey: ProjectKey;
  title: string;
  division: string;
  project: ProjectKey;
  status: string;
  category: string | null;
  location: string | null;
  summary: string | null;
  progress: number | null;
  priority: string | null;
  budget: number | null;
  dueDate: string | null;
  updatedAt: string;
};

export type DocumentRow = {
  id: string;
  division: ProjectKey;
  filename: string;
  category: string;
  projectId: string | null;
  projectName: string | null;
  url: string | null;
  provider: string;
  size: number | null;
  uploadedBy: string;
  uploadDate: string;
};

export type JobRow = {
  id: string;
  division: ProjectKey;
  title: string;
  slug: string;
  location: string;
  type: string;
  summary: string;
  description: string | null;
  status: string;
  updatedAt: string;
};

export type ApplicationRow = {
  id: string;
  division: ProjectKey;
  fullName: string;
  email: string;
  phone: string | null;
  position: string;
  experience: string;
  message: string;
  resumeUrl: string | null;
  portfolioUrl: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

export type ChatbotQueryRow = {
  id: string;
  question: string;
  answer: string;
  pageUrl: string | null;
  createdAt: string;
};

export type ContactRow = {
  id: string;
  division: ProjectKey;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  subject: string | null;
  message: string;
  sourcePage: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
};

export type SettingsRow = {
  id: string;
  division: ProjectKey;
  key: string;
  label: string;
  scope: string;
  value: Prisma.JsonValue;
  updatedAt: string;
};

export type AuditLogRow = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string | null;
  summary: string;
  createdAt: string;
};

export type CompanyOption = {
  id: string;
  name: string;
};

export type AnalyticsPoint = {
  label: string;
  value: number;
  detail?: string;
};

export type AnalyticsSeries = {
  key: string;
  label: string;
  points: AnalyticsPoint[];
  format?: "number" | "currency" | "percent";
};

export type AdminCommandCenterData = {
  admin: AdminSessionUser;
  generatedAt: string;
  projectOptions: ProjectOption[];
  businesses: BusinessRow[];
  domainMappings: DomainMappingRow[];
  overview: MetricCard[];
  executiveMetrics: MetricCard[];
  pipeline: PipelineMetric[];
  revenuePipeline: number;
  openOpportunities: number;
  leads: LeadRow[];
  projects: ProjectRow[];
  documents: DocumentRow[];
  blogs: BlogRow[];
  subscribers: SubscriberRow[];
  newsletters: NewsletterRow[];
  services: ServiceRow[];
  media: MediaRow[];
  jobs: JobRow[];
  applications: ApplicationRow[];
  contacts: ContactRow[];
  chatbotQueries: ChatbotQueryRow[];
  settings: SettingsRow[];
  auditLogs: AuditLogRow[];
  notifications: NotificationRow[];
  unreadNotifications: number;
  activities: ActivityRow[];
  criticalAlerts: AlertRow[];
  pendingReviews: ReviewRow[];
  approvalQueue: ReviewRow[];
  analytics: AnalyticsSeries[];
  companies: CompanyOption[];
};
