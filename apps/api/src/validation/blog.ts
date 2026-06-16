import { z } from "zod";

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
    return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean))).slice(0, 20);
  });

const imageMetadata = z
  .record(z.unknown())
  .optional()
  .transform((value) => value || undefined);

export const blogCreateSchema = z.object({
  title: requiredText("Please enter a title.", 220),
  slug: optionalText(240),
  excerpt: requiredText("Please enter an excerpt.", 1100),
  content: requiredText("Please enter the blog content.", 80000),
  coverImage: requiredText("Please upload or enter a cover image URL.", 1600),
  coverImageAlt: optionalText(300),
  imageMetadata,
  author: requiredText("Please enter an author.", 140),
  category: requiredText("Please enter a category.", 140),
  tags,
  featured: z.boolean().optional().default(false),
  status: z.enum(statuses).optional().default("draft"),
  publishedAt: optionalText(80),
  readTime: optionalText(60),
  seoTitle: optionalText(220),
  seoDescription: optionalText(500),
  canonicalUrl: optionalText(1200),
  relatedSlugs: tags.optional()
});

export const blogUpdateSchema = blogCreateSchema.partial().extend({
  tags,
  relatedSlugs: tags.optional(),
  imageMetadata
});

export type BlogCreateInput = z.infer<typeof blogCreateSchema>;
export type BlogUpdateInput = z.infer<typeof blogUpdateSchema>;
