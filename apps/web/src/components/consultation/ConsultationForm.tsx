"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, FileUp, Loader2, Monitor, PhoneCall, Send, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CompanyContactPanel } from "@/components/CompanyContactPanel";
import { Button } from "@/components/ui/button";
import { PremiumSelect } from "@/components/ui/PremiumSelect";
import type { ConsultationRequest } from "@/lib/types";
import { cn } from "@/lib/utils";

const serviceTypes = [
  "Architecture & Design",
  "Construction & Infrastructure",
  "Real Estate",
  "Import & Export",
  "OTC Exchange"
] as const;

const consultationTypes = ["Virtual Meeting", "Office Consultation", "Site Visit"] as const;

const budgetRanges = [
  "Strategic advisory only",
  "Under INR 10 lakh",
  "INR 10 lakh - INR 50 lakh",
  "INR 50 lakh - INR 2 crore",
  "INR 2 crore - INR 10 crore",
  "INR 10 crore+ enterprise program"
];

const projectTimelines = ["Immediate", "30 - 60 days", "This quarter", "3 - 6 months", "6+ months", "Exploratory"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toSelectOptions = (items: readonly string[]) => items.map((item) => ({ value: item, label: item }));

const serviceTypeOptions = toSelectOptions(serviceTypes);
const budgetRangeOptions = toSelectOptions(budgetRanges);
const projectTimelineOptions = toSelectOptions(projectTimelines);

const allowedFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
];

const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".dwg", ".dxf", ".ifc", ".rvt"];
const maxTotalUploadSize = 35 * 1024 * 1024;

const trimOptionalText = (maxLength: number, message: string) =>
  z
    .string()
    .trim()
    .max(maxLength, message)
    .optional()
    .transform((value) => value ?? "");

const consultationFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .min(3, "Full name must be at least 3 characters.")
    .max(120, "Full name is too long."),
  companyName: z
    .string()
    .trim()
    .min(1, "Please enter your company.")
    .max(160, "Company name is too long."),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => value.length === 0 || emailPattern.test(value), "Please enter a valid email."),
  phoneNumber: trimOptionalText(40, "Phone number is too long."),
  serviceType: z
    .string()
    .trim()
    .min(1, "Please select a consultation topic.")
    .refine(
      (value) => serviceTypes.includes(value as (typeof serviceTypes)[number]),
      "Please select a consultation topic."
    ),
  budgetRange: trimOptionalText(80, "Budget range is too long."),
  projectTimeline: trimOptionalText(80, "Project timeline is too long."),
  projectDescription: z
    .string()
    .trim()
    .min(1, "Please enter your message.")
    .max(4000, "Message is too long."),
  requirementFiles: z
    .custom<FileList | undefined>()
    .optional()
    .refine((files) => !files || files.length <= 5, "Upload up to 5 files.")
    .refine(
      (files) => !files || Array.from(files).every((file) => file.size <= 15 * 1024 * 1024),
      "Each file must be 15MB or less."
    )
    .refine(
      (files) => !files || Array.from(files).reduce((total, file) => total + file.size, 0) <= maxTotalUploadSize,
      "Combined uploads must be 35MB or less."
    )
    .refine(
      (files) =>
        !files ||
        Array.from(files).every((file) => {
          const lowerName = file.name.toLowerCase();
          return allowedFileTypes.includes(file.type) || allowedExtensions.some((extension) => lowerName.endsWith(extension));
        }),
      "Upload PDFs, images or blueprint files only."
    ),
  preferredConsultationType: z.enum(consultationTypes)
});

type ConsultationFormInput = z.input<typeof consultationFormSchema>;
type ConsultationFormValues = z.output<typeof consultationFormSchema>;

type FieldError = string | undefined;
type ApiValidationIssue = {
  path?: Array<string | number>;
  message?: string;
};

type SubmissionResult = {
  message?: string;
  issues?: ApiValidationIssue[];
  submittedAt?: string;
  consultation?: ConsultationRequest;
  notification?: ConsultationRequest["notification"];
  workflow?: {
    created?: boolean;
    fallback?: boolean;
    upstreamError?: string;
  };
};

const formFieldNames = [
  "fullName",
  "companyName",
  "emailAddress",
  "phoneNumber",
  "serviceType",
  "budgetRange",
  "projectTimeline",
  "projectDescription",
  "requirementFiles",
  "preferredConsultationType"
] as const;

type ConsultationFormField = (typeof formFieldNames)[number];

function isConsultationFormField(value: string): value is ConsultationFormField {
  return (formFieldNames as readonly string[]).includes(value);
}

function FieldShell({
  id,
  label,
  required,
  error,
  children
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: FieldError;
  children: React.ReactNode;
}) {
  const errorId = `${id}-error`;

  return (
    <motion.div
      animate={error ? { x: [0, -3, 3, -2, 2, 0] } : { x: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="group relative">
        {children}
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-3.5 top-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7f786c] transition duration-300 group-focus-within:text-[#9a7428]"
        >
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      </div>
      {error ? (
        <motion.p
          id={errorId}
          role="alert"
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs font-medium leading-relaxed text-[#a33a2e]"
        >
          {error}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function fieldClass(error?: FieldError) {
  return cn(
    "h-[3.85rem] w-full rounded-2xl border bg-white/68 px-3.5 pb-1.5 pt-6 text-[15px] font-medium text-[#17243a] outline-none transition duration-300 placeholder:text-transparent",
    "focus:border-[#c6a45b]/80 focus:bg-white focus:shadow-[0_0_0_4px_rgba(198,164,91,0.13)]",
    "disabled:cursor-not-allowed disabled:bg-[#f3efe4]/70 disabled:text-[#8b8578]",
    error
      ? "border-[#d56a5e] bg-[#fff7f5] shadow-[0_0_0_4px_rgba(213,106,94,0.12)] focus:border-[#d56a5e] focus:bg-[#fffafa] focus:shadow-[0_0_0_4px_rgba(213,106,94,0.14)]"
      : "border-[#e0d8c9]"
  );
}

function SuccessState({ submittedAt }: { submittedAt?: string }) {
  return (
    <motion.div
      key="consultation-success"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.985 }}
      transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-10 overflow-hidden rounded-[2rem] border border-[#e8deca] bg-[#fffefa]/88 px-6 py-12 text-center shadow-[0_34px_110px_rgba(23,36,58,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl md:px-10 md:py-14"
    >
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-[#c6a45b]/22 blur-3xl"
        animate={{ opacity: [0.42, 0.78, 0.42], scale: [0.92, 1.14, 0.92] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-[#d8b85f]/45 bg-[#f6de8c]/20"
            animate={{ opacity: [0.56, 0.15, 0.56], scale: [1, 1.28, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ scale: 0.74, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.54, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-[4.7rem] w-[4.7rem] items-center justify-center rounded-full bg-[#17243a] shadow-[0_18px_52px_rgba(198,164,91,0.34)]"
          >
            <svg aria-hidden="true" viewBox="0 0 56 56" className="h-12 w-12">
              <motion.circle
                cx="28"
                cy="28"
                r="23"
                fill="none"
                stroke="#d8b85f"
                strokeWidth="2.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.72, ease: "easeOut" }}
              />
              <motion.path
                d="M17 29.4L24.4 36.4L39.5 20.5"
                fill="none"
                stroke="#f9e8a7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3.6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.56, delay: 0.28, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9a7428]"
        >
          Secure delivery confirmed
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 font-display text-[25px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#17243a] md:text-[36px]"
        >
          Your consultation request has been securely delivered.
        </motion.h3>
        {submittedAt ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 rounded-full border border-[#e7dfd1] bg-white/64 px-4 py-2 text-[13px] font-medium text-[#68645b]"
          >
            Submitted at {submittedAt}
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  );
}

export function ConsultationForm() {
  const [serverError, setServerError] = useState("");
  const [deliveryReceipt, setDeliveryReceipt] = useState<SubmissionResult | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ConsultationFormInput, unknown, ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      fullName: "",
      companyName: "",
      emailAddress: "",
      phoneNumber: "",
      serviceType: "",
      budgetRange: "",
      projectTimeline: "",
      projectDescription: "",
      preferredConsultationType: "Virtual Meeting"
    }
  });

  const selectedFiles = watch("requirementFiles");
  const preferredType = watch("preferredConsultationType");
  const serviceTypeValue = watch("serviceType") ?? "";
  const budgetRangeValue = watch("budgetRange") ?? "";
  const projectTimelineValue = watch("projectTimeline") ?? "";
  const fileList = useMemo(() => (selectedFiles ? Array.from(selectedFiles) : []), [selectedFiles]);
  const isDelivered = Boolean(deliveryReceipt);

  useEffect(() => {
    if (!serverError) return undefined;

    const timeoutId = window.setTimeout(() => setServerError(""), 5200);
    return () => window.clearTimeout(timeoutId);
  }, [serverError]);

  function persistConsultationTracker(consultation: ConsultationRequest | undefined) {
    if (!consultation?._id || !consultation.trackingToken) return;

    try {
      const tracker = {
        id: consultation._id,
        trackingToken: consultation.trackingToken,
        version: 2,
        createdAt: new Date().toISOString()
      };

      window.localStorage.setItem("ractysh-consultation-tracker", JSON.stringify(tracker));
      window.dispatchEvent(new CustomEvent("ractysh-consultation-submitted", { detail: consultation }));
    } catch (error) {
      console.warn("Consultation tracker persistence failed after successful submission:", error);
    }
  }

  function completeSubmission(result: SubmissionResult | null) {
    setDeliveryReceipt({
      message: result?.message || "Your consultation request has been securely delivered.",
      submittedAt: result?.submittedAt
    });
    persistConsultationTracker(result?.consultation);
    reset({
      fullName: "",
      companyName: "",
      emailAddress: "",
      phoneNumber: "",
      serviceType: "",
      budgetRange: "",
      projectTimeline: "",
      projectDescription: "",
      preferredConsultationType: "Virtual Meeting"
    });
  }

  async function onSubmit(values: ConsultationFormValues) {
    setServerError("");

    try {
      const payload = new FormData();
      payload.append("fullName", values.fullName);
      payload.append("companyName", values.companyName);
      payload.append("emailAddress", values.emailAddress);
      payload.append("phoneNumber", values.phoneNumber);
      payload.append("serviceType", values.serviceType);
      payload.append("budgetRange", values.budgetRange);
      payload.append("projectTimeline", values.projectTimeline);
      payload.append("projectDescription", values.projectDescription);
      payload.append("preferredConsultationType", values.preferredConsultationType);

      fileList.forEach((file) => payload.append("requirementFiles", file));

      const response = await fetch("/api/book-consultation", {
        method: "POST",
        body: payload
      });

      const result = (await response.json().catch(() => null)) as SubmissionResult | null;
      const deliveredDespiteHttpError = Boolean(
        result?.consultation && (result.notification?.sent || result.consultation.notification?.sent)
      );

      if (!response.ok && !deliveredDespiteHttpError) {
        if (result?.issues?.length) {
          let hasMappedIssue = false;

          result.issues.forEach((issue) => {
            const [fieldName] = issue.path ?? [];

            if (typeof fieldName === "string" && isConsultationFormField(fieldName)) {
              hasMappedIssue = true;
              setError(fieldName, {
                type: "server",
                message: issue.message || "Please review this field."
              });
            }
          });

          setServerError(hasMappedIssue ? "Please review the highlighted fields." : "Unable to send request. Please try again.");
          return;
        }

        throw new Error("Unable to send request. Please try again.");
      }

      completeSubmission(result);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Unable to send request. Please try again.");
    }
  }

  return (
    <section id="consultation-form" className="relative px-5 pb-0 pt-[4.5rem] md:px-8 md:pb-0 md:pt-24">
      <div className="absolute left-[-14rem] top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#17243a]/7 blur-3xl" />
      <div className="absolute right-[-10rem] bottom-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#c6a45b]/12 blur-3xl" />

      <div className="mx-auto max-w-[82rem]">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9a7428]">Private enterprise intake</p>
          <h2 className="mt-3 font-display text-[22px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#17243a] md:text-[28px] lg:text-[34px]">
            Tell us what you are building. We will shape the advisory path.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-[#68645b]/80 md:text-[16px]">
            Submit the core requirement and supporting files. The request is securely delivered to the consultation desk for review.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isDelivered ? (
            <SuccessState submittedAt={deliveryReceipt?.submittedAt} />
          ) : (
            <motion.form
              key="consultation-form"
              noValidate
              onSubmit={handleSubmit(onSubmit, () => {
                setServerError("Please review the highlighted fields.");
              })}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-10 overflow-hidden rounded-[2rem] border border-white/70 bg-white/72 p-4 shadow-[0_34px_110px_rgba(23,36,58,0.12),inset_0_1px_0_rgba(255,255,255,0.95)] backdrop-blur-2xl md:p-6"
            >
          <div className="grid gap-5 lg:grid-cols-2">
            <FieldShell id="fullName" label="Full Name" required error={errors.fullName?.message}>
              <input
                id="fullName"
                placeholder="Full Name"
                required
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                className={fieldClass(errors.fullName?.message)}
                {...register("fullName")}
              />
            </FieldShell>

            <FieldShell id="companyName" label="Company" required error={errors.companyName?.message}>
              <input
                id="companyName"
                placeholder="Company"
                required
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.companyName)}
                aria-describedby={errors.companyName ? "companyName-error" : undefined}
                className={fieldClass(errors.companyName?.message)}
                {...register("companyName")}
              />
            </FieldShell>

            <FieldShell id="emailAddress" label="Email Address" required error={errors.emailAddress?.message}>
              <input
                id="emailAddress"
                type="email"
                placeholder="Email Address"
                required
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.emailAddress)}
                aria-describedby={errors.emailAddress ? "emailAddress-error" : undefined}
                className={fieldClass(errors.emailAddress?.message)}
                {...register("emailAddress")}
              />
            </FieldShell>

            <FieldShell id="phoneNumber" label="Phone Number" error={errors.phoneNumber?.message}>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="Phone Number"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.phoneNumber)}
                aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
                className={fieldClass(errors.phoneNumber?.message)}
                {...register("phoneNumber")}
              />
            </FieldShell>

            <FieldShell id="serviceType" label="Consultation Topic" required error={errors.serviceType?.message}>
              <input type="hidden" {...register("serviceType")} />
              <PremiumSelect
                id="serviceType"
                required
                disabled={isSubmitting}
                invalid={Boolean(errors.serviceType)}
                describedBy={errors.serviceType ? "serviceType-error" : undefined}
                value={serviceTypeValue}
                placeholder="Select topic"
                options={serviceTypeOptions}
                onChange={(nextValue) => setValue("serviceType", nextValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
              />
            </FieldShell>

            <FieldShell id="budgetRange" label="Budget Range" error={errors.budgetRange?.message}>
              <input type="hidden" {...register("budgetRange")} />
              <PremiumSelect
                id="budgetRange"
                disabled={isSubmitting}
                invalid={Boolean(errors.budgetRange)}
                describedBy={errors.budgetRange ? "budgetRange-error" : undefined}
                value={budgetRangeValue}
                placeholder="Select range"
                options={budgetRangeOptions}
                onChange={(nextValue) => setValue("budgetRange", nextValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
              />
            </FieldShell>

            <FieldShell id="projectTimeline" label="Project Timeline" error={errors.projectTimeline?.message}>
              <input type="hidden" {...register("projectTimeline")} />
              <PremiumSelect
                id="projectTimeline"
                disabled={isSubmitting}
                invalid={Boolean(errors.projectTimeline)}
                describedBy={errors.projectTimeline ? "projectTimeline-error" : undefined}
                value={projectTimelineValue}
                placeholder="Select timeline"
                options={projectTimelineOptions}
                onChange={(nextValue) => setValue("projectTimeline", nextValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
              />
            </FieldShell>

            <div className="lg:row-span-2">
              <FieldShell id="projectDescription" label="Message" required error={errors.projectDescription?.message}>
                <textarea
                  id="projectDescription"
                  placeholder="Message"
                  rows={8}
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.projectDescription)}
                  aria-describedby={errors.projectDescription ? "projectDescription-error" : undefined}
                  className={cn(fieldClass(errors.projectDescription?.message), "h-full min-h-[9.2rem] resize-none leading-[1.7]")}
                  {...register("projectDescription")}
                />
              </FieldShell>
            </div>

            <div>
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#7f786c]">Preferred Consultation Type</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {consultationTypes.map((type) => {
                  const Icon = type === "Virtual Meeting" ? Monitor : type === "Office Consultation" ? PhoneCall : FileUp;
                  const active = preferredType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setValue("preferredConsultationType", type, { shouldValidate: true })}
                      className={cn(
                        "flex min-h-28 flex-col items-start justify-between rounded-2xl border p-4 text-left text-[14px] font-medium transition duration-300 disabled:cursor-not-allowed disabled:opacity-60",
                        active
                          ? "border-[#c6a45b]/80 bg-[#fff7df] text-[#17243a] shadow-[0_0_0_4px_rgba(198,164,91,0.1)]"
                          : "border-[#e0d8c9] bg-white/58 text-[#625d54] hover:border-[#c6a45b]/60 hover:bg-white"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active ? "text-[#9a7428]" : "text-[#777166]")} strokeWidth={1.8} />
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
              {errors.preferredConsultationType?.message ? (
                <p className="mt-2 text-xs font-medium text-[#a33a2e]">{errors.preferredConsultationType.message}</p>
              ) : null}
            </div>

            <div className="lg:col-span-2">
              <label
                htmlFor="requirementFiles"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed bg-[#fbfaf6]/72 p-6 text-center transition duration-300 hover:border-[#c6a45b]/70 hover:bg-white",
                  isSubmitting && "pointer-events-none opacity-65",
                  errors.requirementFiles?.message ? "border-[#d56a5e]" : "border-[#d8d0c1]"
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#17243a] text-[#f5df9a]">
                  <UploadCloud className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span className="mt-4 text-[14px] font-semibold text-[#17243a]">Upload Requirement Files</span>
                <span className="mt-2 max-w-xl text-[14px] leading-[1.7] text-[#706b62]/80">
                  PDFs, images, blueprints, DWG, DXF, IFC or RVT files. Up to 5 files, 15MB each, 35MB combined.
                </span>
                <input
                  id="requirementFiles"
                  type="file"
                  multiple
                  accept="application/pdf,image/*,.dwg,.dxf,.ifc,.rvt"
                  className="hidden"
                  disabled={isSubmitting}
                  {...register("requirementFiles")}
                />
              </label>
              {fileList.length ? (
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {fileList.map((file) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="flex items-center gap-2 rounded-xl border border-[#e0d8c9] bg-white/62 px-3 py-2 text-xs font-medium text-[#625d54]"
                    >
                      <FileUp className="h-4 w-4 text-[#9a7428]" strokeWidth={1.8} />
                      <span className="min-w-0 truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              {errors.requirementFiles?.message ? (
                <p className="mt-2 text-xs font-medium text-[#a33a2e]">{errors.requirementFiles.message}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 border-t border-[#e7dfd1] pt-5 xl:flex-row xl:items-center xl:justify-between">
            <CompanyContactPanel mode="consultation" tone="transparent" compact className="w-full xl:max-w-[44rem]" />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="disabled:opacity-65 md:min-w-60"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" strokeWidth={1.8} /> : <Send className="h-5 w-5" strokeWidth={1.8} />}
              {isSubmitting ? "Sending Request..." : "Submit Consultation Request"}
            </Button>
          </div>
            </motion.form>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {serverError && !isDelivered ? (
            <motion.div
              role="alert"
              key="consultation-error-toast"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-6 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-[#e3b1a9] bg-[#fff8f6]/94 px-4 py-3 text-left shadow-[0_24px_68px_rgba(111,42,31,0.2)] backdrop-blur-xl md:left-auto md:right-6 md:translate-x-0"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a33a2e] text-white">
                <AlertTriangle className="h-4.5 w-4.5" strokeWidth={1.8} />
              </span>
              <span>
                <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8d3227]">Delivery paused</span>
                <span className="mt-1 block text-[14px] font-medium leading-relaxed text-[#5f2b24]">{serverError}</span>
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}
