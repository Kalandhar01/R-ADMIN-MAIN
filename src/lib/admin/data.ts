import "server-only";

import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;
import type {
  AdminCommandCenterData,
  AdminSessionUser,
  ActivityRow,
  AlertRow,
  AnalyticsSeries,
  ApplicationRow,
  AuditLogRow,
  BlogRow,
  BusinessRow,
  ChatbotQueryRow,
  ContactRow,
  DocumentRow,
  DomainMappingRow,
  JobRow,
  LeadFilter,
  LeadRow,
  MediaRow,
  NotificationPriority,
  NotificationRow,
  ProjectKey,
  ProjectOption,
  ProjectRow,
  ReviewRow,
  NewsletterRow,
  ServiceRow,
  SettingsRow,
  SubscriberRow
} from "@ractysh/types/admin";
import { adminProjectRoutes, groupProjectKey } from "@/lib/admin/projects";

const defaultProjectOptions: ProjectOption[] = adminProjectRoutes.map((route) => ({
  key: route.key,
  slug: route.slug,
  label: route.label,
  keywords: route.key === groupProjectKey ? [] : route.keywords,
  description: route.description,
  href: route.href,
  status: "active"
}));

function iso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function numberValue(value: number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function slugifyKey(value: string): string {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\botc\b/g, "otc-exchange")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug === "import-and-export" || slug === "export-import" || slug === "import-export-service") return "import-export";
  if (slug === "otc" || slug === "otc-exchange-service") return "otc-exchange";
  if (slug === "group" || slug === "ractysh") return groupProjectKey;
  return slug || groupProjectKey;
}

function normalizeDivisionKey(value?: string | null): ProjectKey {
  if (!value) return groupProjectKey;

  const slug = slugifyKey(value);
  const route = adminProjectRoutes.find((item) => item.key === slug || item.slug === slug || slugifyKey(item.label) === slug);

  return route?.key || slug;
}

function projectOptionFromBusiness(business: {
  slug: string;
  name: string;
  summary: string;
  status: string;
  website: string | null;
}): ProjectOption {
  const key = normalizeDivisionKey(business.slug);
  const route = adminProjectRoutes.find((item) => item.key === key || item.slug === business.slug);

  return {
    key,
    slug: route?.slug || business.slug,
    label: business.name,
    keywords: route?.keywords || [business.slug, business.name.toLowerCase()],
    description: business.summary,
    href: route?.href || `/${business.slug}/dashboard`,
    status: business.status,
    domain: business.website
  };
}

function businessLabel(options: ProjectOption[], division: ProjectKey): string {
  return options.find((option) => option.key === division)?.label || division;
}

function inferProject(...values: Array<string | null | undefined>): ProjectKey {
  const text = values.filter(Boolean).join(" ").toLowerCase();
  const match = defaultProjectOptions.find((project) => project.key !== groupProjectKey && project.keywords.some((keyword) => text.includes(keyword)));

  return match?.key || groupProjectKey;
}

function resolveDivision(division: string | null | undefined, ...fallback: Array<string | null | undefined>): ProjectKey {
  const normalized = normalizeDivisionKey(division);
  if (normalized !== groupProjectKey) return normalized;
  return inferProject(...fallback);
}

function metadataText(value: Record<string, unknown> | null | undefined, key: string): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value[key];
  return typeof item === "string" ? item : null;
}

function mediaFolder(value: Record<string, unknown> | null | undefined): string {
  return metadataText(value, "folder") || "Unassigned";
}

function monthKey(value: Date): string {
  return new Intl.DateTimeFormat("en", { month: "short", year: "2-digit" }).format(value);
}

function countBy<T>(rows: T[], label: (row: T) => string | null | undefined) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const key = label(row)?.trim() || "Unknown";
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts, ([itemLabel, value]) => ({ label: itemLabel, value })).sort((first, second) => second.value - first.value);
}

function timeSeries<T>(rows: T[], date: (row: T) => Date): Array<{ label: string; value: number }> {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const key = monthKey(date(row));
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts, ([label, value]) => ({ label, value })).slice(-8);
}

function contactLeadStatus(status: string): LeadFilter {
  if (status === "new") return "New";
  if (status === "archived") return "Archived";
  return "Responded";
}

function consultationLeadStatus(status: string): LeadFilter {
  if (status === "new") return "New";
  if (status === "reviewed") return "Read";
  if (status === "archived") return "Archived";
  return "Responded";
}

function careerLeadStatus(status: string): LeadFilter {
  if (status === "new") return "New";
  if (status === "reviewed") return "Read";
  return "Responded";
}

function careerLabel(status: string): string {
  if (status === "new") return "Applied";
  if (status === "reviewed") return "Reviewing";
  if (status === "shortlisted") return "Interview";
  if (status === "hired") return "Selected";
  if (status === "rejected") return "Rejected";
  return status;
}

function groupCount<T extends string>(groups: Array<{ status: T; _count: { _all: number } }>, statuses: T[]): number {
  return groups
    .filter((group) => statuses.includes(group.status))
    .reduce((total, group) => total + group._count._all, 0);
}

function dedupeSubscribers(newsletterRows: SubscriberRow[], legacyRows: SubscriberRow[]): SubscriberRow[] {
  const seen = new Set<string>();
  const rows: SubscriberRow[] = [];

  for (const row of [...newsletterRows, ...legacyRows]) {
    const email = row.email.toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);
    rows.push(row);
  }

  return rows;
}

const divisionColumnTables = [
  "Settings",
  "Notification",
  "SiteConfig",
  "HeroSection",
  "PageSection",
  "ServiceOffer",
  "Project",
  "MediaAsset",
  "TeamMember",
  "BlogPost",
  "Blog",
  "Newsletter",
  "Subscriber",
  "NewsletterSubscriber",
  "IngestionEvent",
  "Lead",
  "IngestedProject",
  "IngestedDocument",
  "IngestedMedia",
  "Statistic",
  "Testimonial",
  "Location",
  "Certification",
  "TimelineEvent",
  "CareerJob",
  "CareerApplication",
  "ContactInquiry",
  "ServiceRequest",
  "Consultation"
] as const;

const divisionIndexes = [
  { table: "Settings", name: "Settings_division_idx", columns: `"division"` },
  { table: "Notification", name: "Notification_division_status_createdAt_idx", columns: `"division", "status", "createdAt"` },
  { table: "SiteConfig", name: "SiteConfig_division_idx", columns: `"division"` },
  { table: "HeroSection", name: "HeroSection_division_pageSlug_idx", columns: `"division", "pageSlug"` },
  { table: "PageSection", name: "PageSection_division_pageSlug_position_idx", columns: `"division", "pageSlug", "position"` },
  { table: "ServiceOffer", name: "ServiceOffer_division_status_idx", columns: `"division", "status"` },
  { table: "Project", name: "Project_division_status_idx", columns: `"division", "status"` },
  { table: "MediaAsset", name: "MediaAsset_division_idx", columns: `"division"` },
  { table: "TeamMember", name: "TeamMember_division_idx", columns: `"division"` },
  { table: "BlogPost", name: "BlogPost_division_status_publishedAt_idx", columns: `"division", "status", "publishedAt"` },
  { table: "Blog", name: "Blog_division_status_publishedAt_idx", columns: `"division", "status", "publishedAt"` },
  { table: "Newsletter", name: "Newsletter_division_status_publishDate_idx", columns: `"division", "status", "publishDate"` },
  { table: "Subscriber", name: "Subscriber_division_status_idx", columns: `"division", "status"` },
  { table: "NewsletterSubscriber", name: "NewsletterSubscriber_division_idx", columns: `"division"` },
  { table: "IngestionEvent", name: "IngestionEvent_division_createdAt_idx", columns: `"division", "createdAt"` },
  { table: "Lead", name: "Lead_division_status_createdAt_idx", columns: `"division", "status", "createdAt"` },
  { table: "IngestedProject", name: "IngestedProject_division_priority_idx", columns: `"division", "priority"` },
  { table: "IngestedDocument", name: "IngestedDocument_division_uploadDate_idx", columns: `"division", "uploadDate"` },
  { table: "IngestedMedia", name: "IngestedMedia_division_createdAt_idx", columns: `"division", "createdAt"` },
  { table: "Statistic", name: "Statistic_division_idx", columns: `"division"` },
  { table: "Testimonial", name: "Testimonial_division_approved_idx", columns: `"division", "approved"` },
  { table: "Location", name: "Location_division_idx", columns: `"division"` },
  { table: "Certification", name: "Certification_division_idx", columns: `"division"` },
  { table: "TimelineEvent", name: "TimelineEvent_division_position_idx", columns: `"division", "position"` },
  { table: "CareerJob", name: "CareerJob_division_status_idx", columns: `"division", "status"` },
  { table: "CareerApplication", name: "CareerApplication_division_status_createdAt_idx", columns: `"division", "status", "createdAt"` },
  { table: "ContactInquiry", name: "ContactInquiry_division_status_createdAt_idx", columns: `"division", "status", "createdAt"` },
  { table: "ServiceRequest", name: "ServiceRequest_division_createdAt_idx", columns: `"division", "createdAt"` },
  { table: "Consultation", name: "Consultation_division_status_createdAt_idx", columns: `"division", "status", "createdAt"` }
] as const;

async function ensureDivisionColumns() {
}

async function createIndexIfTableExists(table: string, indexName: string, columns: string) {
}

async function ensureDivisionIndexes() {
}

async function ensureDomainMappingStorage() {
}

async function ensureNotificationStorage() {
}

let enterpriseAdminStoragePromise: Promise<void> | null = null;

async function ensureEnterpriseAdminStorage() {
  enterpriseAdminStoragePromise ||= (async () => {
    await ensureNotificationStorage();
    await ensureDomainMappingStorage();
    await ensureDivisionColumns();
    await ensureDivisionIndexes();
  })();

  try {
    await enterpriseAdminStoragePromise;
  } catch (error) {
    enterpriseAdminStoragePromise = null;
    throw error;
  }
}

async function syncDerivedNotifications(input: {
  adminId: string;
  contacts: Array<{ id: string; division: string; name: string; email: string; service: string | null; subject: string | null; createdAt: Date }>;
  consultations: Array<{ id: string; division: string; fullName: string; emailAddress: string; serviceType: string; companyName: string; createdAt: Date }>;
  applications: Array<{ id: string; division: string; fullName: string; email: string; position: string; createdAt: Date }>;
  subscribers: SubscriberRow[];
  blogs: Array<{ id: string; division: string; title: string; category: string; status: string; updatedAt: Date }>;
  services: Array<{ id: string; division: string; title: string; category: string; updatedAt: Date; company: { name: string } }>;
}) {
  const rows: Record<string, unknown>[] = [];
  const recentSubscribers = input.subscribers.slice(0, 60);

  for (const contact of input.contacts.slice(0, 60)) {
    const division = resolveDivision(contact.division, contact.service, contact.subject);
    rows.push({
      adminId: input.adminId,
      dedupeKey: `${input.adminId}:contact:${contact.id}`,
      title: "New Contact Inquiry",
      message: `${contact.name} submitted ${contact.subject || contact.service || "a contact inquiry"}.`,
      project: division,
      division,
      priority: "high",
      entity: "ContactInquiry",
      entityType: "ContactInquiry",
      entityId: contact.id,
      metadata: { name: contact.name, email: contact.email, service: contact.service, subject: contact.subject },
      createdAt: contact.createdAt
    });
  }

  for (const consultation of input.consultations.slice(0, 60)) {
    const division = resolveDivision(consultation.division, consultation.serviceType);
    rows.push({
      adminId: input.adminId,
      dedupeKey: `${input.adminId}:consultation:${consultation.id}`,
      title: "New Consultation Request",
      message: `${consultation.fullName} requested consultation for ${consultation.serviceType}.`,
      project: division,
      division,
      priority: "critical",
      entity: "Consultation",
      entityType: "Consultation",
      entityId: consultation.id,
      metadata: { name: consultation.fullName, email: consultation.emailAddress, service: consultation.serviceType, company: consultation.companyName },
      createdAt: consultation.createdAt
    });
  }

  for (const application of input.applications.slice(0, 60)) {
    const division = resolveDivision(application.division, application.position);
    rows.push({
      adminId: input.adminId,
      dedupeKey: `${input.adminId}:application:${application.id}`,
      title: "New Career Application",
      message: `${application.fullName} applied for ${application.position}.`,
      project: division,
      division,
      priority: "high",
      entity: "CareerApplication",
      entityType: "CareerApplication",
      entityId: application.id,
      metadata: { name: application.fullName, email: application.email, position: application.position },
      createdAt: application.createdAt
    });
  }

  for (const subscriber of recentSubscribers) {
    const division = normalizeDivisionKey(subscriber.division);
    rows.push({
      adminId: input.adminId,
      dedupeKey: `${input.adminId}:subscriber:${subscriber.table}:${subscriber.id}`,
      title: "New Newsletter Subscriber",
      message: `${subscriber.email} joined from ${subscriber.source || "website"}.`,
      project: division,
      division,
      priority: "medium",
      entity: subscriber.table,
      entityType: subscriber.table,
      entityId: subscriber.id,
      metadata: { email: subscriber.email, source: subscriber.source || "website" },
      createdAt: new Date(subscriber.createdAt)
    });
  }

  for (const blog of input.blogs.filter((blog) => blog.status === "published").slice(0, 60)) {
    const division = resolveDivision(blog.division, blog.category, blog.title);
    rows.push({
      adminId: input.adminId,
      dedupeKey: `${input.adminId}:blog-published:${blog.id}`,
      title: "New Blog Published",
      message: `${blog.title} is live in ${blog.category}.`,
      project: division,
      division,
      priority: "medium",
      entity: "Blog",
      entityId: blog.id,
      createdAt: blog.updatedAt
    });
  }

  for (const service of input.services.slice(0, 60)) {
    const division = resolveDivision(service.division, service.company.name, service.category, service.title);
    rows.push({
      adminId: input.adminId,
      dedupeKey: `${input.adminId}:service-updated:${service.id}:${service.updatedAt.getTime()}`,
      title: "New Service Updated",
      message: `${service.title} was updated for ${service.company.name}.`,
      project: division,
      division,
      priority: "medium",
      entity: "ServiceOffer",
      entityId: service.id,
      createdAt: service.updatedAt
    });
  }

  if (!rows.length) return;

  await prisma.notification.createMany({
    data: rows,
    skipDuplicates: true
  });
}

function mapBlog(row: {
  id: string;
  division: string;
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
  publishedAt: Date | null;
  readTime: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}): BlogRow {
  return {
    ...row,
    division: resolveDivision(row.division, row.category, row.title),
    publishedAt: iso(row.publishedAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString()
  };
}

function mapService(row: {
  id: string;
  division: string;
  companyId: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  category: string;
  href: string | null;
  imageUrl: string | null;
  heroContent: Record<string, unknown>;
  metrics: Record<string, unknown>;
  images: string[];
  sections: Record<string, unknown>;
  cta: Record<string, unknown>;
  seo: Record<string, unknown>;
  tags: string[];
  status: string;
  position: number;
  updatedAt: Date;
  company: { name: string };
}): ServiceRow {
  const division = resolveDivision(row.division, row.company.name, row.category, row.title);
  return {
    id: row.id,
    division,
    companyId: row.companyId,
    companyName: row.company.name,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    description: row.description,
    category: row.category,
    href: row.href,
    imageUrl: row.imageUrl,
    heroContent: row.heroContent,
    metrics: row.metrics,
    images: row.images,
    sections: row.sections,
    cta: row.cta,
    seo: row.seo,
    tags: row.tags,
    status: row.status,
    position: row.position,
    updatedAt: row.updatedAt.toISOString()
  };
}

function mapProject(row: {
  id: string;
  division: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  status: string;
  updatedAt: Date;
  company: { name: string };
}): ProjectRow {
  const divisionKey = resolveDivision(row.division, row.company.name, row.category, row.title);
  return {
    id: row.id,
    source: "Project",
    divisionKey,
    title: row.title,
    division: row.company.name,
    project: divisionKey,
    status: row.status,
    category: row.category,
    location: row.location,
    summary: row.summary,
    progress: row.status === "completed" ? 100 : row.status === "active" ? 62 : row.status === "concept" ? 18 : null,
    priority: row.status === "active" ? "high" : "medium",
    budget: null,
    dueDate: null,
    updatedAt: row.updatedAt.toISOString()
  };
}

function mapIngestedProject(row: {
  id: string;
  title: string;
  division: string;
  status: string;
  progress: number;
  priority: string;
  budget: number | null;
  location: string | null;
  summary: string | null;
  dueDate: Date | null;
  updatedAt: Date;
}): ProjectRow {
  const divisionKey = resolveDivision(row.division, row.title, row.summary);
  return {
    id: row.id,
    source: "IngestedProject",
    divisionKey,
    title: row.title,
    division: row.division,
    project: divisionKey,
    status: row.status,
    category: null,
    location: row.location,
    summary: row.summary,
    progress: row.progress,
    priority: row.priority,
    budget: numberValue(row.budget),
    dueDate: iso(row.dueDate),
    updatedAt: row.updatedAt.toISOString()
  };
}

function notificationProject(value: string): ProjectKey {
  return defaultProjectOptions.some((project) => project.key === value) ? value : inferProject(value);
}

function buildBusinessState(
  companies: Array<{
    id: string;
    slug: string;
    name: string;
    legalName: string;
    summary: string;
    description: string | null;
    website: string | null;
    status: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
  }>,
  domainMappings: Array<{
    id: string;
    domain: string;
    division: string;
    companyId: string | null;
    status: string;
    primary: boolean;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
): { projectOptions: ProjectOption[]; businesses: BusinessRow[]; domainMappingRows: DomainMappingRow[] } {
  const companyByKey = new Map<ProjectKey, (typeof companies)[number]>();

  for (const company of companies) {
    if (company.slug === "ractysh-enterprise") continue;
    companyByKey.set(normalizeDivisionKey(company.slug), company);
  }

  const optionByKey = new Map<ProjectKey, ProjectOption>();

  for (const option of defaultProjectOptions) {
    optionByKey.set(option.key, option);
  }

  for (const company of companyByKey.values()) {
    optionByKey.set(normalizeDivisionKey(company.slug), projectOptionFromBusiness(company));
  }

  for (const mapping of domainMappings) {
    const key = normalizeDivisionKey(mapping.division);
    const current = optionByKey.get(key);
    if (current) {
      optionByKey.set(key, { ...current, domain: mapping.primary ? mapping.domain : current.domain || mapping.domain });
    }
  }

  const projectOptions = Array.from(optionByKey.values()).sort((first, second) => {
    const firstRoute = adminProjectRoutes.findIndex((route) => route.key === first.key);
    const secondRoute = adminProjectRoutes.findIndex((route) => route.key === second.key);
    if (firstRoute >= 0 || secondRoute >= 0) return (firstRoute < 0 ? 999 : firstRoute) - (secondRoute < 0 ? 999 : secondRoute);
    return first.label.localeCompare(second.label);
  });

  const businesses = projectOptions.map((option, index) => {
    const company = companyByKey.get(option.key);
    const primaryDomain =
      domainMappings.find((mapping) => normalizeDivisionKey(mapping.division) === option.key && mapping.primary)?.domain ||
      domainMappings.find((mapping) => normalizeDivisionKey(mapping.division) === option.key)?.domain ||
      company?.website ||
      null;

    return {
      id: company?.id || `default:${option.key}`,
      key: option.key,
      slug: option.key,
      label: company?.name || option.label,
      legalName: company?.legalName || option.label,
      summary: company?.summary || option.description || `${option.label} enterprise division.`,
      description: company?.description || option.description || null,
      website: company?.website || null,
      status: company?.status || option.status || "active",
      position: company?.position ?? index,
      primaryDomain,
      createdAt: (company?.createdAt || new Date(0)).toISOString(),
      updatedAt: (company?.updatedAt || new Date(0)).toISOString()
    };
  });

  const domainMappingRows = domainMappings.map((mapping) => {
    const division = normalizeDivisionKey(mapping.division);

    return {
      id: mapping.id,
      domain: mapping.domain,
      division,
      divisionLabel: businessLabel(projectOptions, division),
      companyId: mapping.companyId,
      status: mapping.status,
      primary: mapping.primary,
      notes: mapping.notes,
      createdAt: mapping.createdAt.toISOString(),
      updatedAt: mapping.updatedAt.toISOString()
    };
  });

  return { projectOptions, businesses, domainMappingRows };
}

export async function getAdminCommandCenterData(
  admin: AdminSessionUser,
  division?: string
): Promise<AdminCommandCenterData> {
  const isFiltered = division && division !== groupProjectKey && division !== "all";
  const dw = isFiltered ? { division } : {};

  await ensureEnterpriseAdminStorage();

  const [
    contactCount,
    consultationCount,
    applicationCount,
    demoCount,
    blogCount,
    publishedBlogCount,
    publishedServiceCount,
    contactGroups,
    consultationGroups,
    applicationGroups,
    blogs,
    newsletters,
    newsletterSubscribers,
    legacySubscribers,
    contacts,
    consultations,
    applications,
    services,
    media,
    jobs,
    settings,
    auditLogs,
    companies,
    projects,
    ingestedProjects,
    documents,
    ingestionEvents,
    domainMappings,
    pendingComments,
    demos
  ] = await Promise.all([
    prisma.contactInquiry.count({ where: dw }),
    prisma.consultation.count({ where: dw }),
    prisma.careerApplication.count({ where: dw }),
    prisma.demoInquiry.count({ where: dw }),
    prisma.blog.count({ where: { ...dw } }),
    prisma.blog.count({ where: { ...dw, status: "published" } }),
    prisma.serviceOffer.count({ where: { ...dw, status: "published" } }),
    prisma.contactInquiry.groupBy({ by: ["status"], where: dw, _count: { _all: true } }),
    prisma.consultation.groupBy({ by: ["status"], where: dw, _count: { _all: true } }),
    prisma.careerApplication.groupBy({ by: ["status"], where: dw, _count: { _all: true } }),
    prisma.blog.findMany({ where: { ...dw }, orderBy: { updatedAt: "desc" }, take: 80 }),
    prisma.newsletter.findMany({ where: { ...dw }, orderBy: { updatedAt: "desc" }, take: 80 }),
    prisma.newsletterSubscriber.findMany({ where: { ...dw }, orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.subscriber.findMany({ where: { ...dw }, orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.contactInquiry.findMany({ where: { ...dw }, orderBy: { createdAt: "desc" }, take: 80 }),
    prisma.consultation.findMany({ where: { ...dw }, orderBy: { createdAt: "desc" }, take: 80 }),
    prisma.careerApplication.findMany({ where: { ...dw }, orderBy: { createdAt: "desc" }, take: 80 }),
    prisma.demoInquiry.findMany({ where: { ...dw }, orderBy: { createdAt: "desc" }, take: 80 }),
    prisma.serviceOffer.findMany({ where: { ...dw }, include: { company: { select: { name: true } } }, orderBy: [{ position: "asc" }, { updatedAt: "desc" }] }),
    prisma.mediaAsset.findMany({ where: { ...dw }, orderBy: { updatedAt: "desc" }, take: 120 }),
    prisma.careerJob.findMany({ where: { ...dw }, orderBy: { updatedAt: "desc" }, take: 100 }),
    prisma.settings.findMany({ where: { ...dw }, orderBy: { key: "asc" } }),
    prisma.auditLog.findMany({
      include: { admin: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 120
    }),
    prisma.companyDivision.findMany({
      orderBy: [{ position: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        legalName: true,
        summary: true,
        description: true,
        website: true,
        status: true,
        position: true,
        createdAt: true,
        updatedAt: true
      }
    }),
    prisma.project.findMany({
      where: { ...dw },
      include: { company: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
      take: 120
    }),
    prisma.ingestedProject.findMany({ where: { ...dw }, orderBy: [{ updatedAt: "desc" }], take: 120 }),
    prisma.ingestedDocument.findMany({ where: { ...dw }, orderBy: { uploadDate: "desc" }, take: 120 }),
    prisma.ingestionEvent.findMany({ where: { ...dw }, orderBy: { createdAt: "desc" }, take: 120 }),
    prisma.domainMapping.findMany({ where: { ...dw }, orderBy: [{ primary: "desc" }, { domain: "asc" }] }),
    prisma.blogComment.findMany({
      where: { status: "pending" },
      include: { blog: { select: { title: true, category: true, division: true } } },
      orderBy: { createdAt: "desc" },
      take: 80
    })
  ]);

  const { projectOptions, businesses, domainMappingRows } = buildBusinessState(companies, domainMappings);

  const newsletterSubscriberRows: SubscriberRow[] = newsletterSubscribers.map((subscriber) => ({
    id: subscriber.id,
    division: normalizeDivisionKey(subscriber.division),
    email: subscriber.email,
    status: "active",
    source: "newsletter",
    table: "NewsletterSubscriber",
    createdAt: subscriber.createdAt.toISOString()
  }));

  const legacyRows: SubscriberRow[] = legacySubscribers.map((subscriber) => ({
    id: subscriber.id,
    division: normalizeDivisionKey(subscriber.division),
    email: subscriber.email,
    status: subscriber.status,
    source: subscriber.source,
    table: "Subscriber",
    createdAt: subscriber.createdAt.toISOString()
  }));

  const subscribers = dedupeSubscribers(newsletterSubscriberRows, legacyRows);
  await syncDerivedNotifications({
    adminId: admin.id,
    contacts,
    consultations,
    applications,
    subscribers,
    blogs,
    services
  });

  const notificationRecords = await prisma.notification.findMany({
    where: { adminId: admin.id, ...dw },
    orderBy: { createdAt: "desc" },
    take: 160
  });

  const demoInquiryCount = demos.length;
  const demoLeadRows: LeadRow[] = demos.map((demo) => ({
    id: `demo:${demo.id}`,
    entityId: demo.id,
    division: resolveDivision(demo.division, demo.discussionTopic, demo.fullName),
    kind: "Contact",
    name: demo.fullName,
    email: demo.email,
    phone: demo.phone,
    company: demo.companyName,
    service: demo.discussionTopic,
    message: demo.message || demo.discussionTopic,
    status: contactLeadStatus(demo.status),
    rawStatus: demo.status,
    createdAt: demo.createdAt.toISOString()
  }));

  const totalLeads = contactCount + consultationCount + applicationCount + demoInquiryCount;
  const newLeads =
    groupCount(contactGroups, ["new"]) +
    groupCount(consultationGroups, ["new"]) +
    groupCount(applicationGroups, ["new"]);
  const readLeads = groupCount(consultationGroups, ["reviewed"]) + groupCount(applicationGroups, ["reviewed"]);
  const respondedLeads =
    groupCount(contactGroups, ["contacted", "qualified", "proposal_sent", "won", "closed"]) +
    groupCount(consultationGroups, ["contacted"]) +
    groupCount(applicationGroups, ["shortlisted", "rejected", "hired"]);
  const archivedLeads = groupCount(contactGroups, ["archived"]) + groupCount(consultationGroups, ["archived"]);

  const contactLeadRows: LeadRow[] = contacts.map((contact) => ({
    id: `contact:${contact.id}`,
    entityId: contact.id,
    division: resolveDivision(contact.division, contact.service, contact.company, contact.subject, contact.message),
    kind: "Contact",
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    service: contact.service,
    message: contact.message,
    status: contactLeadStatus(contact.status),
    rawStatus: contact.status,
    createdAt: contact.createdAt.toISOString()
  }));

  const consultationLeadRows: LeadRow[] = consultations.map((consultation) => ({
    id: `consultation:${consultation.id}`,
    entityId: consultation.id,
    division: resolveDivision(consultation.division, consultation.serviceType, consultation.companyName, consultation.projectDescription),
    kind: "Consultation",
    name: consultation.fullName,
    email: consultation.emailAddress,
    phone: consultation.phoneNumber,
    company: consultation.companyName,
    service: consultation.serviceType,
    message: consultation.projectDescription,
    status: consultationLeadStatus(consultation.status),
    rawStatus: consultation.status,
    createdAt: consultation.createdAt.toISOString()
  }));

  const careerLeadRows: LeadRow[] = applications.map((application) => ({
    id: `career:${application.id}`,
    entityId: application.id,
    division: resolveDivision(application.division, application.position, application.message),
    kind: "Career",
    name: application.fullName,
    email: application.email,
    phone: application.phone,
    company: application.position,
    service: application.experience,
    message: application.message,
    status: careerLeadStatus(application.status),
    rawStatus: application.status,
    createdAt: application.createdAt.toISOString()
  }));

  const applicationRows: ApplicationRow[] = applications.map((application) => ({
    id: application.id,
    division: resolveDivision(application.division, application.position, application.message),
    fullName: application.fullName,
    email: application.email,
    phone: application.phone,
    position: application.position,
    experience: application.experience,
    message: application.message,
    resumeUrl: application.resumeUrl,
    portfolioUrl: application.portfolioUrl,
    status: application.status,
    notes: application.notes,
    createdAt: application.createdAt.toISOString()
  }));

  const rawQueries = await prisma.chatbotQuery.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const chatbotQueryRows: ChatbotQueryRow[] = rawQueries.map((q) => ({
    id: q.id,
    question: q.question,
    answer: q.answer,
    pageUrl: q.pageUrl,
    createdAt: q.createdAt.toISOString()
  }));

  const contactRows: ContactRow[] = [
    ...contacts.map((contact) => ({
      id: contact.id,
      division: resolveDivision(contact.division, contact.service, contact.company, contact.subject, contact.message),
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      service: contact.service,
      subject: contact.subject,
      message: contact.message,
      sourcePage: contact.sourcePage,
      status: contact.status,
      notes: contact.notes,
      createdAt: contact.createdAt.toISOString()
    })),
    ...demos.map((demo) => ({
      id: `demo:${demo.id}`,
      division: resolveDivision(demo.division, demo.discussionTopic, demo.fullName),
      name: demo.fullName,
      email: demo.email,
      phone: demo.phone,
      company: demo.companyName,
      service: demo.discussionTopic,
      subject: null,
      message: demo.message || demo.discussionTopic,
      sourcePage: "book-demo",
      status: demo.status || "new",
      notes: null,
      createdAt: demo.createdAt.toISOString()
    }))
  ];

  const mediaRows: MediaRow[] = media.map((asset) => ({
    id: asset.id,
    division: resolveDivision(asset.division, mediaFolder(asset.metadata), asset.title, asset.url),
    title: asset.title,
    altText: asset.altText,
    kind: asset.kind,
    url: asset.url,
    folder: mediaFolder(asset.metadata),
    provider: asset.provider,
    providerId: asset.providerId,
    mimeType: asset.mimeType,
    size: asset.size,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString()
  }));

  const projectRows: ProjectRow[] = [
    ...projects.map(mapProject),
    ...ingestedProjects.map(mapIngestedProject)
  ].sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt));

  const documentRows: DocumentRow[] = documents.map((document) => ({
    id: document.id,
    division: resolveDivision(document.division, document.category, document.projectName, document.filename),
    filename: document.filename,
    category: document.category,
    projectId: document.projectId,
    projectName: document.projectName,
    url: document.url,
    provider: document.provider,
    size: document.size,
    uploadedBy: document.uploadedBy,
    uploadDate: document.uploadDate.toISOString()
  }));

  const newsletterIssueRows: NewsletterRow[] = newsletters.map((newsletter) => ({
    id: newsletter.id,
    division: resolveDivision(newsletter.division, newsletter.category, newsletter.title),
    title: newsletter.title,
    slug: newsletter.slug,
    excerpt: newsletter.excerpt,
    content: newsletter.content,
    coverImage: newsletter.coverImage,
    category: newsletter.category,
    author: newsletter.author,
    featured: newsletter.featured,
    status: newsletter.status,
    publishDate: iso(newsletter.publishDate),
    tags: newsletter.tags,
    readTime: newsletter.readTime,
    views: newsletter.views,
    updatedAt: newsletter.updatedAt.toISOString()
  }));

  const jobRows: JobRow[] = jobs.map((job) => ({
    id: job.id,
    division: resolveDivision(job.division, job.title, job.summary),
    title: job.title,
    slug: job.slug,
    location: job.location,
    type: job.type,
    summary: job.summary,
    description: job.description,
    status: job.status,
    updatedAt: job.updatedAt.toISOString()
  }));

  const settingRows: SettingsRow[] = settings.map((setting) => ({
    id: setting.id,
    division: normalizeDivisionKey(setting.division),
    key: setting.key,
    label: setting.label,
    scope: setting.scope,
    value: setting.value,
    updatedAt: setting.updatedAt.toISOString()
  }));

  const auditRows: AuditLogRow[] = auditLogs.map((log) => ({
    id: log.id,
    actor: log.admin?.name || log.admin?.email || "System",
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    summary: log.summary,
    createdAt: log.createdAt.toISOString()
  }));

  const notificationRows: NotificationRow[] = notificationRecords.map((notification) => {
    const division = resolveDivision(notification.division, notification.project, notification.title, notification.message);

    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      project: notificationProject(division),
      division,
      priority: notification.priority,
      status: notification.status,
      entity: notification.entity,
      entityId: notification.entityId,
      entityType: notification.entityType || notification.entity,
      actionUrl: notification.actionUrl,
      metadata: notification.metadata || null,
      createdAt: notification.createdAt.toISOString(),
      readAt: iso(notification.readAt),
      archivedAt: iso(notification.archivedAt)
    };
  });

  const activityRows: ActivityRow[] = [
    ...auditRows.map((log) => {
      const division = inferProject(log.entity, log.summary);

      return {
        id: `audit:${log.id}`,
        title: log.summary,
        detail: `${log.action} ${log.entity}`,
        actor: log.actor,
        action: log.action,
        entity: log.entity,
        project: division,
        division,
        priority: (log.action === "delete" ? "high" : log.action === "publish" ? "medium" : "low") as NotificationPriority,
        createdAt: log.createdAt
      };
    }),
    ...ingestionEvents.map((event) => {
      const division = resolveDivision(event.division, event.service, event.location, event.source, event.aiSummary);

      return {
        id: `ingestion:${event.id}`,
        title: event.aiSummary || `${event.entityType} ${event.status}`,
        detail: `${event.sourceType} from ${event.source}`,
        actor: "System",
        action: event.status,
        entity: event.entityType,
        project: division,
        division,
        priority: event.priority as NotificationPriority,
        createdAt: event.createdAt.toISOString()
      };
    })
  ].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)).slice(0, 120);

  const criticalAlerts: AlertRow[] = [
    ...notificationRows
      .filter((notification) => notification.status === "unread" && ["critical", "high"].includes(notification.priority))
      .map((notification) => ({
        id: `notification:${notification.id}`,
        title: notification.title,
        detail: notification.message,
        project: notification.project,
        division: notification.division,
        priority: notification.priority,
        createdAt: notification.createdAt
      })),
    ...ingestionEvents
      .filter((event) => event.status === "failed")
      .map((event) => {
        const division = resolveDivision(event.division, event.service, event.location, event.source);

        return {
          id: `ingestion-failed:${event.id}`,
          title: "Ingestion Failed",
          detail: event.errorMessage || event.aiSummary || `${event.sourceType} failed.`,
          project: division,
          division,
          priority: "critical" as NotificationPriority,
          createdAt: event.createdAt.toISOString()
        };
      })
  ].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)).slice(0, 24);

  const pendingReviews: ReviewRow[] = [
    ...contactLeadRows
      .filter((lead) => lead.status === "New")
      .slice(0, 16)
      .map((lead) => ({
        id: lead.id,
        title: lead.name,
        detail: lead.service || lead.message,
        type: lead.kind,
        project: lead.division,
        division: lead.division,
        priority: "high" as NotificationPriority,
        createdAt: lead.createdAt
      })),
    ...consultationLeadRows
      .filter((lead) => lead.status === "New")
      .slice(0, 16)
      .map((lead) => ({
        id: lead.id,
        title: lead.name,
        detail: lead.service || lead.message,
        type: lead.kind,
        project: lead.division,
        division: lead.division,
        priority: "critical" as NotificationPriority,
        createdAt: lead.createdAt
      }))
  ].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)).slice(0, 24);

  const approvalQueue: ReviewRow[] = [
    ...blogs
      .filter((blog) => blog.status === "draft" || blog.status === "scheduled")
      .slice(0, 20)
      .map((blog) => {
        const division = resolveDivision(blog.division, blog.category, blog.title);

        return {
          id: `blog:${blog.id}`,
          title: blog.title,
          detail: `${blog.status} blog in ${blog.category}`,
          type: "Blog",
          project: division,
          division,
          priority: "medium" as NotificationPriority,
          createdAt: blog.updatedAt.toISOString()
        };
      }),
    ...newsletters
      .filter((newsletter) => newsletter.status === "draft" || newsletter.status === "scheduled")
      .slice(0, 20)
      .map((newsletter) => {
        const division = resolveDivision(newsletter.division, newsletter.category, newsletter.title);

        return {
          id: `newsletter:${newsletter.id}`,
          title: newsletter.title,
          detail: `${newsletter.status} newsletter campaign`,
          type: "Newsletter",
          project: division,
          division,
          priority: "medium" as NotificationPriority,
          createdAt: newsletter.updatedAt.toISOString()
        };
      }),
    ...services
      .filter((service) => service.status === "draft")
      .slice(0, 20)
      .map((service) => {
        const division = resolveDivision(service.division, service.company.name, service.category, service.title);

        return {
          id: `service:${service.id}`,
          title: service.title,
          detail: `Draft service for ${service.company.name}`,
          type: "Service",
          project: division,
          division,
          priority: "medium" as NotificationPriority,
          createdAt: service.updatedAt.toISOString()
        };
      }),
    ...pendingComments.map((comment) => {
      const division = resolveDivision(comment.blog.division, comment.blog.category, comment.blog.title);

      return {
        id: `comment:${comment.id}`,
        title: `Comment waiting approval`,
        detail: `${comment.authorName} on ${comment.blog.title}`,
        type: "Comment",
        project: division,
        division,
        priority: "medium" as NotificationPriority,
        createdAt: comment.createdAt.toISOString()
      };
    })
  ].sort((first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)).slice(0, 32);

  const activeProjectCount = projectRows.filter((project) => project.status === "active").length;
  const revenuePipeline = ingestedProjects.reduce((total, project) => total + numberValue(project.budget), 0);
  const openOpportunities = totalLeads - archivedLeads;
  const businessOptions = projectOptions.filter((option) => option.key !== groupProjectKey);
  const businessPoints = (value: (division: ProjectKey) => number) =>
    businessOptions.map((option) => ({ label: option.label, value: value(option.key) }));
  const analytics: AnalyticsSeries[] = [
    { key: "leadSources", label: "Lead Sources", points: countBy([...contactLeadRows, ...consultationLeadRows, ...careerLeadRows], (lead) => lead.kind) },
    { key: "leadsByBusiness", label: "Leads per Business", points: businessPoints((division) => [...contactLeadRows, ...consultationLeadRows, ...careerLeadRows].filter((lead) => lead.division === division).length) },
    { key: "projectsByBusiness", label: "Projects per Business", points: businessPoints((division) => projectRows.filter((project) => project.divisionKey === division).length) },
    { key: "subscribersByBusiness", label: "Subscribers per Business", points: businessPoints((division) => subscribers.filter((subscriber) => subscriber.division === division).length) },
    {
      key: "revenueByBusiness",
      label: "Revenue Statistics",
      format: "currency",
      points: businessPoints((division) => projectRows.filter((project) => project.divisionKey === division).reduce((total, project) => total + (project.budget || 0), 0))
    },
    {
      key: "conversionRate",
      label: "Conversion Rate",
      format: "percent",
      points: [
        { label: "Responded", value: totalLeads ? Math.round((respondedLeads / totalLeads) * 100) : 0 },
        { label: "Archived", value: totalLeads ? Math.round((archivedLeads / totalLeads) * 100) : 0 },
        { label: "Unread", value: totalLeads ? Math.round((newLeads / totalLeads) * 100) : 0 }
      ]
    },
    { key: "consultationGrowth", label: "Consultation Growth", points: timeSeries(consultations, (row: any) => row.createdAt) },
    { key: "blogPerformance", label: "Blog Performance", points: blogs.slice(0, 12).map((blog) => ({ label: blog.title, value: blog.views })) },
    { key: "subscriberGrowth", label: "Subscriber Growth", points: timeSeries(subscribers, (row) => new Date(row.createdAt)) },
    { key: "careerApplications", label: "Career Applications", points: countBy(applications, (application: any) => careerLabel(application.status)) }
  ];

  return {
    admin,
    generatedAt: new Date().toISOString(),
    projectOptions,
    businesses,
    domainMappings: domainMappingRows,
    overview: [
      { key: "totalBusinesses", label: "Total Businesses", value: businesses.length, detail: "Active enterprise divisions" },
      { key: "contactRequests", label: "Contact Requests", value: contactCount, detail: "ContactInquiry records" },
      { key: "consultationRequests", label: "Consultation Requests", value: consultationCount, detail: "Consultation records" },
      { key: "demoRequests", label: "Demo Requests", value: demoInquiryCount, detail: "DemoInquiry records" },
      { key: "careerApplications", label: "Career Applications", value: applicationCount, detail: "CareerApplication records" },
      { key: "newsletterSubscribers", label: "Newsletter Subscribers", value: subscribers.length, detail: "Unique subscriber emails" },
      { key: "blogPosts", label: "Blog Posts", value: blogCount, detail: "Blog records" },
      { key: "publishedServices", label: "Published Services", value: publishedServiceCount, detail: "Published ServiceOffer records" }
    ],
    executiveMetrics: [
      { key: "revenuePipeline", label: "Revenue Pipeline", value: revenuePipeline, detail: "Open project budgets", format: "currency" },
      { key: "openOpportunities", label: "Open Opportunities", value: openOpportunities, detail: "Lead pipeline not archived" },
      { key: "unreadLeads", label: "Unread Leads", value: newLeads, detail: "Pipeline items still marked new" },
      { key: "projectsActive", label: "Projects Active", value: activeProjectCount, detail: "Active project records" },
      { key: "consultations", label: "Consultations", value: consultationCount, detail: "Consultation requests" },
      { key: "applications", label: "Applications", value: applicationCount, detail: "Career applications" },
      { key: "subscribers", label: "Subscribers", value: subscribers.length, detail: "Newsletter subscribers" }
    ],
    pipeline: [
      { label: "New", value: newLeads },
      { label: "Read", value: readLeads },
      { label: "Responded", value: respondedLeads },
      { label: "Archived", value: archivedLeads }
    ],
    revenuePipeline,
    openOpportunities,
    leads: [...contactLeadRows, ...consultationLeadRows, ...careerLeadRows, ...demoLeadRows].sort(
      (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt)
    ),
    projects: projectRows,
    documents: documentRows,
    blogs: blogs.map(mapBlog),
    subscribers,
    newsletters: newsletterIssueRows,
    services: services.map(mapService),
    media: mediaRows,
    jobs: jobRows,
    applications: applicationRows,
    contacts: contactRows,
    chatbotQueries: chatbotQueryRows,
    settings: settingRows,
    auditLogs: auditRows,
    notifications: notificationRows,
    unreadNotifications: notificationRows.filter((notification) => notification.status === "unread").length,
    activities: activityRows,
    criticalAlerts,
    pendingReviews,
    approvalQueue,
    analytics,
    companies: companies.map((company) => ({ id: company.id, name: company.name }))
  };
}
