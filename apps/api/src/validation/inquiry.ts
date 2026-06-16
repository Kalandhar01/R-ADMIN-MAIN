import { z } from "zod";
import { inferDivisionFromText, normalizeDivisionKey } from "@ractysh/shared";

function trimInput(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

function sanitizeText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

const requiredText = (message: string, max = 4000) =>
  z.preprocess(
    trimInput,
    z.string({ required_error: message, invalid_type_error: message }).min(1, message).max(max).transform(sanitizeText)
  );

const optionalText = (max = 4000) =>
  z.preprocess(
    trimInput,
    z
      .string()
      .max(max)
      .optional()
      .transform((value) => sanitizeText(value ?? ""))
  );

const email = z.preprocess(
  trimInput,
  z
    .string({ required_error: "Please enter your email.", invalid_type_error: "Please enter your email." })
    .min(1, "Please enter your email.")
    .email("Please enter a valid email.")
    .max(180)
);

export const contactInquirySchema = z.object({
  name: optionalText(120),
  fullName: optionalText(120),
  email,
  phone: optionalText(40),
  company: optionalText(160),
  companyName: optionalText(160),
  service: optionalText(140),
  interest: optionalText(140),
  subject: optionalText(180),
  division: optionalText(80),
  message: requiredText("Please enter your message.", 4000),
  sourcePage: optionalText(1000),
  website: optionalText(200),
  companyWebsite: optionalText(200)
}).superRefine((value, ctx) => {
  if (!value.name && !value.fullName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["name"],
      message: "Please enter your name."
    });
  }

  if (value.website || value.companyWebsite) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["website"],
      message: "Spam protection triggered."
    });
  }
}).transform((value) => {
  const name = value.name || value.fullName;
  const company = value.company || value.companyName;
  const service = value.service || value.interest;
  const division = value.division ? normalizeDivisionKey(value.division) : inferDivisionFromText(service, value.subject, value.sourcePage);

  return {
    division,
    name,
    fullName: name,
    email: value.email,
    phone: value.phone,
    company,
    companyName: company,
    service,
    interest: service,
    subject: value.subject || service,
    message: value.message,
    sourcePage: value.sourcePage || "website"
  };
});

export const demoInquirySchema = z.object({
  fullName: requiredText("Please enter your name.", 120),
  email,
  phone: optionalText(40),
  companyName: optionalText(160),
  discussionTopic: requiredText("Please select a discussion topic.", 140),
  message: optionalText(4000)
});

export type ContactInquiryInput = z.infer<typeof contactInquirySchema>;
export type DemoInquiryInput = z.infer<typeof demoInquirySchema>;
