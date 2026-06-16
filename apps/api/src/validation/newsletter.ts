import { z } from "zod";
import { inferDivisionFromText, normalizeDivisionKey } from "@ractysh/shared";

const statuses = ["draft", "scheduled", "published", "archived"] as const;

function trimInput(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

const requiredText = (message: string, max = 12000) =>
  z.preprocess(
    trimInput,
    z.string({ required_error: message, invalid_type_error: message }).min(1, message).max(max)
  );

const optionalText = (max = 12000) =>
  z.preprocess(
    trimInput,
    z
      .string()
      .max(max)
      .optional()
      .transform((value) => value ?? "")
  );

const tags = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((value) => {
    if (!value) return [];
    const items = Array.isArray(value) ? value : value.split(",");
    return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean))).slice(0, 12);
  });

export const newsletterCreateSchema = z.object({
  title: requiredText("Please enter a title.", 220),
  slug: optionalText(240),
  excerpt: requiredText("Please enter an excerpt.", 900),
  content: requiredText("Please enter the article content.", 50000),
  coverImage: requiredText("Please enter a cover image URL.", 1200),
  category: requiredText("Please enter a category.", 120),
  author: requiredText("Please enter an author.", 120),
  featured: z.boolean().optional().default(false),
  status: z.enum(statuses).optional().default("draft"),
  publishDate: optionalText(80),
  tags,
  readTime: optionalText(60)
});

export const newsletterUpdateSchema = newsletterCreateSchema.partial().extend({
  tags
});

export const newsletterSubscribeSchema = z.object({
  email: z.preprocess(
    trimInput,
    z
      .string({ required_error: "Please enter your email.", invalid_type_error: "Please enter your email." })
      .email("Please enter a valid email.")
      .max(180)
  ),
  source: optionalText(120).default("executive-intelligence-center"),
  division: optionalText(80)
}).transform((value) => ({
  ...value,
  division: value.division ? normalizeDivisionKey(value.division) : inferDivisionFromText(value.source)
}));

export type NewsletterCreateInput = z.infer<typeof newsletterCreateSchema>;
export type NewsletterUpdateInput = z.infer<typeof newsletterUpdateSchema>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
