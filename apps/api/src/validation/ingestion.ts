import { z } from "zod";
import { inferDivisionFromText, normalizeDivisionKey } from "@ractysh/shared";

const sourceTypes = [
  "website_contact_form",
  "book_consultation_form",
  "newsletter_form",
  "service_inquiry_form",
  "career_form",
  "admin_newsletter",
  "admin_project",
  "admin_document",
  "admin_media",
  "api"
] as const;

const leadStatuses = ["new", "contacted", "qualified", "proposal_sent", "won", "closed", "archived"] as const;
const priorities = ["low", "medium", "high"] as const;
const projectStatuses = ["concept", "active", "delayed", "completed", "archived"] as const;
const mediaKinds = ["image", "video", "document", "model", "other"] as const;

function trimInput(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

const requiredText = (message: string, max = 4000) =>
  z.preprocess(
    trimInput,
    z.string({ required_error: message, invalid_type_error: message }).min(1, message).max(max)
  );

const optionalText = (max = 4000) =>
  z.preprocess(
    trimInput,
    z
      .string()
      .max(max)
      .optional()
      .transform((value) => value || undefined)
  );

const email = z.preprocess(
  trimInput,
  z
    .string({ required_error: "Please enter an email.", invalid_type_error: "Please enter an email." })
    .min(1, "Please enter an email.")
    .email("Please enter a valid email.")
    .max(180)
    .transform((value) => value.toLowerCase())
);

const optionalDate = z.preprocess(trimInput, z.string().max(80).optional()).transform((value, ctx) => {
  if (!value) return undefined;
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid date." });
    return z.NEVER;
  }

  return date;
});

const optionalBudget = z
  .preprocess(trimInput, z.union([z.string(), z.number()]).optional())
  .transform((value, ctx) => {
    if (value === undefined || value === "") return undefined;
    const parsed = Number(value);

    if (!Number.isFinite(parsed) || parsed < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Budget must be a valid positive number." });
      return z.NEVER;
    }

    return String(parsed);
  });

const metadata = z.record(z.unknown()).optional().default({});

const tags = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((value) => {
    if (!value) return [];
    const items = Array.isArray(value) ? value : value.split(",");
    return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean))).slice(0, 20);
  });

export const leadIngestionSchema = z.object({
  fullName: requiredText("Please enter the lead name.", 120),
  email,
  phone: optionalText(40),
  companyName: optionalText(160),
  source: requiredText("Please enter a lead source.", 160),
  division: optionalText(80),
  sourceType: z.enum(sourceTypes).default("api"),
  service: optionalText(160),
  location: optionalText(160),
  status: z.enum(leadStatuses).default("new"),
  message: optionalText(4000),
  metadata,
  externalEntityId: optionalText(160),
  externalEntityModel: optionalText(120)
}).transform((value) => ({
  ...value,
  division: value.division ? normalizeDivisionKey(value.division) : inferDivisionFromText(value.service, value.source, value.location)
}));

export const projectIngestionSchema = z.object({
  title: requiredText("Please enter the project title.", 220),
  division: requiredText("Please enter the business division.", 140),
  status: z.enum(projectStatuses).default("active"),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  owner: optionalText(140),
  dueDate: optionalDate,
  priority: z.enum(priorities).default("high"),
  budget: optionalBudget,
  location: optionalText(160),
  summary: optionalText(5000),
  metadata
});

export const projectUpdateIngestionSchema = projectIngestionSchema.partial().extend({
  metadata
});

export const documentIngestionSchema = z.object({
  sourceType: z.enum(sourceTypes).default("admin_document"),
  filename: requiredText("Please enter a filename.", 260),
  mimeType: requiredText("Please enter the document MIME type.", 160),
  size: z.coerce.number().int().positive().optional(),
  url: optionalText(1200),
  provider: optionalText(80).default("metadata"),
  providerId: optionalText(220),
  category: requiredText("Please enter a document category.", 140),
  division: optionalText(80),
  projectId: optionalText(160),
  projectName: optionalText(220),
  uploadedBy: optionalText(120).default("admin"),
  uploadDate: optionalDate,
  metadata
}).transform((value) => ({
  ...value,
  division: value.division ? normalizeDivisionKey(value.division) : inferDivisionFromText(value.category, value.projectName)
}));

export const mediaIngestionSchema = z.object({
  kind: z.enum(mediaKinds).default("image"),
  title: requiredText("Please enter a media title.", 220),
  altText: optionalText(400),
  url: optionalText(1200),
  category: requiredText("Please enter a media category.", 140),
  division: optionalText(80),
  tags,
  projectId: optionalText(160),
  metadata
}).transform((value) => ({
  ...value,
  division: value.division ? normalizeDivisionKey(value.division) : inferDivisionFromText(value.category, value.title)
}));

export type LeadIngestionInput = z.infer<typeof leadIngestionSchema>;
export type ProjectIngestionInput = z.infer<typeof projectIngestionSchema>;
export type ProjectUpdateIngestionInput = z.infer<typeof projectUpdateIngestionSchema>;
export type DocumentIngestionInput = z.infer<typeof documentIngestionSchema>;
export type MediaIngestionInput = z.infer<typeof mediaIngestionSchema>;
