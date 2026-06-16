import { z } from "zod";
import { inferDivisionFromText, normalizeDivisionKey } from "@ractysh/shared";

export const consultationServiceTypes = [
  "Architecture & Design",
  "Construction & Infrastructure",
  "Real Estate",
  "Import & Export",
  "OTC Exchange"
] as const;

export const consultationTypes = ["Virtual Meeting", "Office Consultation", "Site Visit"] as const;

function trimInput(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

const requiredText = (requiredMessage: string, minimumLength: number, minimumMessage: string, maximumLength: number) =>
  z.preprocess(
    trimInput,
    z
      .string({ required_error: requiredMessage, invalid_type_error: requiredMessage })
      .min(1, requiredMessage)
      .min(minimumLength, minimumMessage)
      .max(maximumLength)
  );

const optionalText = (maximumLength: number) =>
  z.preprocess(
    trimInput,
    z
      .string()
      .max(maximumLength)
      .optional()
      .transform((value) => value ?? "")
  );

const serviceInterestSchema = z.preprocess(
  trimInput,
  z
    .string({ required_error: "Please select a service interest.", invalid_type_error: "Please select a service interest." })
    .min(1, "Please select a service interest.")
    .refine((value) => consultationServiceTypes.includes(value as (typeof consultationServiceTypes)[number]), {
      message: "Please select a service interest."
    })
);

const preferredConsultationTypeSchema = z.preprocess(
  (value) => {
    const trimmed = trimInput(value);
    return trimmed === "" ? undefined : trimmed;
  },
  z.enum(consultationTypes).default("Virtual Meeting")
);

export const consultationSubmissionSchema = z.object({
  fullName: requiredText("Please enter your full name.", 3, "Full name must be at least 3 characters.", 120),
  companyName: optionalText(160),
  emailAddress: z.preprocess(
    trimInput,
    z
      .string({ required_error: "Please enter your email.", invalid_type_error: "Please enter your email." })
      .min(1, "Please enter your email.")
      .email("Please enter a valid email.")
      .max(180)
  ),
  phoneNumber: optionalText(40),
  serviceType: serviceInterestSchema,
  division: optionalText(80),
  budgetRange: optionalText(80),
  projectTimeline: optionalText(80),
  projectDescription: requiredText(
    "Please enter your project details.",
    1,
    "Please enter your project details.",
    4000
  ),
  preferredConsultationType: preferredConsultationTypeSchema
}).transform((value) => ({
  ...value,
  division: value.division ? normalizeDivisionKey(value.division) : inferDivisionFromText(value.serviceType)
}));

export const workflowStageKeySchema = z.enum([
  "consultation_submitted",
  "internal_review",
  "approval_verification",
  "strategy_discussion",
  "execution_planning",
  "project_kickoff"
]);

export const workflowStageStatusSchema = z.enum(["locked", "active", "waiting", "completed", "rejected"]);

export type ConsultationSubmissionInput = z.infer<typeof consultationSubmissionSchema>;
