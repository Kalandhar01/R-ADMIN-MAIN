import { z } from "zod";

export const constructionLeadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(
      /^[+]?[\d\s()-]{7,20}$/,
      "Invalid phone number",
    )
    .optional()
    .or(z.literal("")),
  selectedServices: z.array(z.string().trim()).optional().default([]),
  projectType: z.string().trim().optional().or(z.literal("")),
  projectLocation: z.string().trim().optional().or(z.literal("")),
  budgetRange: z.string().trim().optional().or(z.literal("")),
  timeline: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
});

export type ConstructionLeadInput = z.infer<typeof constructionLeadSchema>;

export const leadStatusUpdateSchema = z.object({
  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "proposal_sent",
    "won",
    "lost",
  ]),
  note: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const sanitize = (input: string): string =>
  input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
