"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, FileUp, Loader2, Send, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

const modalEase = [0.22, 1, 0.36, 1] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxResumeSize = 15 * 1024 * 1024;
const resumeExtensions = [".pdf", ".doc", ".docx"];
const resumeMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream"
];
const syncStages = [
  "Validating candidate profile",
  "Securing resume attachment",
  "Synchronizing recruitment packet",
  "Routing to recruitment desk"
];

function isBrowserFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

function isAllowedResume(file: File): boolean {
  const lowerName = file.name.toLowerCase();

  return resumeMimeTypes.includes(file.type) || resumeExtensions.some((extension) => lowerName.endsWith(extension));
}

const applicationFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .min(3, "Full name must be at least 3 characters.")
    .max(120, "Full name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .max(180, "Email is too long.")
    .refine((value) => value.length === 0 || emailPattern.test(value), "Please enter a valid email."),
  phone: z.string().trim().min(1, "Please enter your phone number.").max(40, "Phone number is too long."),
  experience: z
    .string()
    .trim()
    .min(1, "Please enter your total experience.")
    .max(120, "Experience is too long."),
  message: z
    .string()
    .trim()
    .min(1, "Please share why you want to join Ractysh.")
    .max(4000, "Message is too long."),
  resume: z
    .unknown()
    .refine((value) => isBrowserFile(value) && value.size > 0, "Please upload your resume.")
    .transform((value) => value as File)
    .refine((file) => file.size <= maxResumeSize, "Resume must be 15MB or less.")
    .refine(isAllowedResume, "Upload a PDF, DOC or DOCX resume.")
});

type ApplicationFormInput = z.input<typeof applicationFormSchema>;
type ApplicationFormValues = z.output<typeof applicationFormSchema>;

type ApiValidationIssue = {
  path?: Array<string | number>;
  message?: string;
};

type SubmissionResult = {
  success?: boolean;
  applicationId?: string;
  emailSent?: boolean;
  message?: string;
  issues?: ApiValidationIssue[];
  submittedAt?: string;
};

type ApplicationFieldName = "fullName" | "email" | "phone" | "experience" | "message" | "resume";
const formFieldNames = ["fullName", "email", "phone", "experience", "message", "resume"] as const;

function isApplicationFieldName(value: string): value is ApplicationFieldName {
  return (formFieldNames as readonly string[]).includes(value);
}

const defaultFormValues: ApplicationFormInput = {
  fullName: "",
  email: "",
  phone: "",
  experience: "",
  message: "",
  resume: undefined
};

function fieldClass(error?: string) {
  return cn(
    "h-[3.8rem] w-full rounded-[14px] border bg-[#fffefa] px-4 pb-2 pt-6 text-[14px] font-medium text-[#181512] outline-none transition duration-300 placeholder:text-transparent",
    "shadow-[0_9px_24px_rgba(82,56,26,0.035),inset_0_1px_0_#ffffff]",
    "focus:border-[#c6a45b] focus:bg-white focus:shadow-[0_0_0_1px_rgba(198,164,91,0.5),0_0_0_5px_rgba(214,180,95,0.13),0_16px_36px_rgba(82,56,26,0.06)]",
    "disabled:cursor-not-allowed disabled:bg-[#f4efe7] disabled:text-[#8b8578]",
    error
      ? "border-[#b75245] bg-[#fff8f4] shadow-[0_0_0_3px_rgba(183,82,69,0.1)] focus:border-[#b75245] focus:shadow-[0_0_0_1px_rgba(183,82,69,0.5),0_0_0_5px_rgba(183,82,69,0.1)]"
      : "border-[#dcc99f]"
  );
}

function ApplicationField({
  id,
  label,
  required,
  error,
  children
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
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
          className="pointer-events-none absolute left-4 top-2 text-[11px] font-bold uppercase tracking-[0] text-[#746852] transition duration-300 group-focus-within:text-[#9a7428]"
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
          className="mt-2 text-xs font-medium leading-relaxed text-[#9c372d]"
        >
          {error}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function ApplicationSuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      key="career-application-success"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.985 }}
      transition={{ duration: 0.45, ease: modalEase }}
      className="relative overflow-hidden rounded-[24px] border border-[#dcc58f] bg-[#fffefa] px-5 py-10 text-center shadow-[inset_0_1px_0_#ffffff,0_18px_44px_rgba(82,56,26,0.08)] md:px-8 md:py-12"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b45f] to-transparent"
      />
      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute inset-2 rounded-full border border-[#dfc98e] bg-[#fff4d8]"
          />
          <motion.div
            initial={{ scale: 0.76, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.54, ease: modalEase }}
            className="relative flex h-[4.8rem] w-[4.8rem] items-center justify-center rounded-full bg-[#17120f] shadow-[0_18px_56px_rgba(198,164,91,0.36)]"
          >
            <svg aria-hidden="true" viewBox="0 0 56 56" className="h-12 w-12">
              <motion.circle
                cx="28"
                cy="28"
                r="23"
                fill="none"
                stroke="#d6b45f"
                strokeWidth="2.4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.72, ease: "easeOut" }}
              />
              <motion.path
                d="M17 29.5L24.4 36.4L39.5 20.6"
                fill="none"
                stroke="#fff2bd"
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
          transition={{ duration: 0.46, delay: 0.16, ease: modalEase }}
          className="mt-7 text-[11px] font-bold uppercase tracking-[0] text-[#9a7428]"
        >
          Recruitment packet confirmed
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: modalEase }}
          className="mt-3 font-display text-[28px] font-semibold leading-[1.08] tracking-normal text-[#181512] md:text-[36px]"
        >
          Application successfully routed to the recruitment desk.
        </motion.h3>
        <motion.button
          type="button"
          onClick={onClose}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.34, ease: modalEase }}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[14px] border border-[#d6b45f] bg-[#17120f] px-5 text-sm font-semibold text-[#fff8ec] shadow-[0_14px_34px_rgba(23,18,15,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-[#e6c978] hover:shadow-[0_18px_44px_rgba(23,18,15,0.22),0_0_26px_rgba(214,180,95,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/38"
        >
          Close
        </motion.button>
      </div>
    </motion.div>
  );
}

export function CareerApplicationModal({
  isOpen,
  roleTitle,
  onClose
}: {
  isOpen: boolean;
  roleTitle: string;
  onClose: () => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [serverError, setServerError] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [syncStage, setSyncStage] = useState(syncStages[0]);
  const [deliveryReceipt, setDeliveryReceipt] = useState<SubmissionResult | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormInput, unknown, ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: defaultFormValues
  });

  const watchedResume = watch("resume");
  const resumeFile = isBrowserFile(watchedResume) ? watchedResume : undefined;
  const isDelivered = Boolean(deliveryReceipt);
  const title = `Apply for ${roleTitle}`;
  const resumeSize = useMemo(() => {
    if (!resumeFile) return "";

    const sizeInMb = resumeFile.size / (1024 * 1024);
    return sizeInMb >= 1 ? `${sizeInMb.toFixed(1)} MB` : `${Math.max(1, Math.round(resumeFile.size / 1024))} KB`;
  }, [resumeFile]);

  const closeModal = useCallback(() => {
    if (isSubmitting) return;
    onClose();
  }, [isSubmitting, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    setServerError("");
    setSuccessToast("");
    setDeliveryReceipt(null);
    setIsDragging(false);
    reset(defaultFormValues);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [isOpen, reset, roleTitle]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, isOpen]);

  useEffect(() => {
    if (!isSubmitting) return undefined;

    let stageIndex = 0;
    setSyncStage(syncStages[stageIndex]);
    const intervalId = window.setInterval(() => {
      stageIndex = (stageIndex + 1) % syncStages.length;
      setSyncStage(syncStages[stageIndex]);
    }, 920);

    return () => window.clearInterval(intervalId);
  }, [isSubmitting]);

  useEffect(() => {
    if (!serverError) return undefined;

    const timeoutId = window.setTimeout(() => setServerError(""), 5600);
    return () => window.clearTimeout(timeoutId);
  }, [serverError]);

  useEffect(() => {
    if (!successToast) return undefined;

    const timeoutId = window.setTimeout(() => setSuccessToast(""), 4200);
    return () => window.clearTimeout(timeoutId);
  }, [successToast]);

  function assignResume(file: File | undefined) {
    setServerError("");
    setValue("resume", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (isSubmitting) return;
    assignResume(event.dataTransfer.files?.[0]);
  }

  async function onSubmit(values: ApplicationFormValues) {
    setServerError("");

    try {
      const payload = new FormData();
      payload.append("position", roleTitle);
      payload.append("jobRole", roleTitle);
      payload.append("fullName", values.fullName);
      payload.append("email", values.email);
      payload.append("phone", values.phone);
      payload.append("experience", values.experience);
      payload.append("message", values.message);
      payload.append("resume", values.resume);

      if (process.env.NODE_ENV !== "production") {
        console.log("[career-application] submitting payload", {
          position: roleTitle,
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          experience: values.experience,
          messageLength: values.message.length,
          resume: {
            name: values.resume.name,
            type: values.resume.type,
            size: values.resume.size
          }
        });
      }

      const response = await fetch("/api/career-application", {
        method: "POST",
        body: payload
      });

      const result = (await response.json().catch(() => null)) as SubmissionResult | null;

      if (process.env.NODE_ENV !== "production") {
        console.log("[career-application] API response received", {
          ok: response.ok,
          status: response.status,
          result
        });
      }

      if (!response.ok) {
        if (result?.issues?.length) {
          let hasMappedIssue = false;

          result.issues.forEach((issue) => {
            const [fieldName] = issue.path ?? [];

            if (typeof fieldName === "string" && isApplicationFieldName(fieldName)) {
              hasMappedIssue = true;
              setError(fieldName, {
                type: "server",
                message: issue.message || "Please review this field."
              });
            }
          });

          setServerError(hasMappedIssue ? "Please review the highlighted application fields." : "Unable to route application.");
          return;
        }

        throw new Error(result?.message || "Unable to route application. Please try again.");
      }

      setDeliveryReceipt({
        message: result?.message || "Application successfully routed to the recruitment desk.",
        applicationId: result?.applicationId,
        emailSent: result?.emailSent,
        submittedAt: result?.submittedAt
      });
      setSuccessToast(result?.message || "Application saved and email notification sent.");
      reset(defaultFormValues);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      if (error instanceof TypeError && /fetch/i.test(error.message)) {
        setServerError("Unable to reach the application route. Please confirm the website server is running and try again.");
        return;
      }

      setServerError(error instanceof Error ? error.message : "Unable to route application. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="career-application-modal"
          className="fixed inset-0 z-[9998] flex items-center justify-center px-3 py-4 font-manrope sm:px-5 sm:py-6"
          role="presentation"
        >
          <motion.button
            type="button"
            aria-label="Close application modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: modalEase }}
            onClick={closeModal}
            className="absolute inset-0 cursor-pointer bg-black/40"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="career-application-title"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: modalEase }}
            data-lenis-prevent
            className="relative z-10 flex max-h-[calc(100vh-1.5rem)] w-full max-w-[48rem] flex-col overflow-hidden rounded-[26px] border border-[#d8bf81] bg-[#fffefa] text-[#181512] shadow-[0_34px_110px_rgba(23,18,15,0.26),0_18px_52px_rgba(132,94,38,0.12),inset_0_1px_0_#ffffff]"
          >
            <div className="relative overflow-y-auto bg-[linear-gradient(180deg,#fffefa_0%,#fffaf2_58%,#f8f0e3_100%)] p-4 sm:p-5 md:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#d6b45f] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,#fff9ed)]" />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0] text-[#9a7428]">
                      Career Application
                    </p>
                    <h2
                      id="career-application-title"
                      className="mt-3 font-display text-[30px] font-semibold leading-[1.04] tracking-normal text-[#181512] md:text-[40px]"
                    >
                      {title}
                    </h2>
                    <p className="mt-3 max-w-[35rem] text-[14px] leading-6 text-[#665a49] md:text-[15px]">
                      Submit your profile to the Ractysh recruitment ecosystem.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close application modal"
                    disabled={isSubmitting}
                    onClick={closeModal}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#d8c59d] bg-[#fffaf0] text-[#5f5446] shadow-[0_10px_24px_rgba(80,52,24,0.08)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b45f] hover:bg-white hover:text-[#181512] hover:shadow-[0_16px_36px_rgba(80,52,24,0.12),0_0_24px_rgba(214,180,95,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/38 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                  >
                    <X className="h-4.5 w-4.5" strokeWidth={1.8} />
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {isDelivered ? (
                    <ApplicationSuccessState onClose={onClose} />
                  ) : (
                    <motion.form
                      key="career-application-form"
                      noValidate
                      onSubmit={handleSubmit(onSubmit, () => {
                        setServerError("Please review the highlighted application fields.");
                      })}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12, scale: 0.985 }}
                      transition={{ duration: 0.42, ease: modalEase }}
                      className="mt-6"
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <ApplicationField id="careerFullName" label="Full Name" required error={errors.fullName?.message}>
                          <input
                            id="careerFullName"
                            placeholder="Full Name"
                            autoComplete="name"
                            required
                            disabled={isSubmitting}
                            aria-invalid={Boolean(errors.fullName)}
                            aria-describedby={errors.fullName ? "careerFullName-error" : undefined}
                            className={fieldClass(errors.fullName?.message)}
                            {...register("fullName")}
                          />
                        </ApplicationField>

                        <ApplicationField id="careerEmail" label="Email" required error={errors.email?.message}>
                          <input
                            id="careerEmail"
                            type="email"
                            placeholder="Email"
                            autoComplete="email"
                            required
                            disabled={isSubmitting}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? "careerEmail-error" : undefined}
                            className={fieldClass(errors.email?.message)}
                            {...register("email")}
                          />
                        </ApplicationField>

                        <ApplicationField id="careerPhone" label="Phone" required error={errors.phone?.message}>
                          <input
                            id="careerPhone"
                            type="tel"
                            placeholder="Phone"
                            autoComplete="tel"
                            required
                            disabled={isSubmitting}
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={errors.phone ? "careerPhone-error" : undefined}
                            className={fieldClass(errors.phone?.message)}
                            {...register("phone")}
                          />
                        </ApplicationField>

                        <ApplicationField id="careerExperience" label="Experience" required error={errors.experience?.message}>
                          <input
                            id="careerExperience"
                            placeholder="Experience"
                            required
                            disabled={isSubmitting}
                            aria-invalid={Boolean(errors.experience)}
                            aria-describedby={errors.experience ? "careerExperience-error" : undefined}
                            className={fieldClass(errors.experience?.message)}
                            {...register("experience")}
                          />
                        </ApplicationField>

                        <div className="md:col-span-2">
                          <ApplicationField
                            id="careerMessage"
                            label="Why do you want to join Ractysh?"
                            required
                            error={errors.message?.message}
                          >
                            <textarea
                              id="careerMessage"
                              placeholder="Why do you want to join Ractysh?"
                              rows={5}
                              required
                              disabled={isSubmitting}
                              aria-invalid={Boolean(errors.message)}
                              aria-describedby={errors.message ? "careerMessage-error" : undefined}
                              className={cn(fieldClass(errors.message?.message), "h-auto min-h-[8.5rem] resize-none leading-[1.7]")}
                              {...register("message")}
                            />
                          </ApplicationField>
                        </div>

                        <div className="md:col-span-2">
                          <label
                            htmlFor="careerResume"
                            onDragEnter={(event) => {
                              event.preventDefault();
                              if (!isSubmitting) setIsDragging(true);
                            }}
                            onDragOver={(event) => {
                              event.preventDefault();
                              if (!isSubmitting) setIsDragging(true);
                            }}
                            onDragLeave={(event) => {
                              event.preventDefault();
                              setIsDragging(false);
                            }}
                            onDrop={handleDrop}
                            className={cn(
                              "application-upload-zone group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[20px] border border-dashed bg-[#fff8ed] p-5 text-center shadow-[inset_0_1px_0_#ffffff,0_12px_30px_rgba(82,56,26,0.04)] transition duration-300",
                              "hover:-translate-y-0.5 hover:border-[#d6b45f] hover:bg-[#fffdf8] hover:shadow-[0_18px_48px_rgba(82,56,26,0.075),0_0_26px_rgba(214,180,95,0.12)]",
                              isDragging && "is-dragging -translate-y-0.5 border-[#d6b45f] bg-[#fffdf8] shadow-[0_18px_48px_rgba(82,56,26,0.075),0_0_30px_rgba(214,180,95,0.16)]",
                              isSubmitting && "pointer-events-none cursor-wait opacity-70",
                              errors.resume?.message ? "border-[#b75245]" : "border-[#d5b766]"
                            )}
                          >
                            <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-[15px] border border-[#dfc685] bg-white text-[#9a7428] shadow-[0_12px_26px_rgba(82,56,26,0.08)] transition duration-300 group-hover:border-[#d6b45f] group-hover:text-[#17120f]">
                              <UploadCloud className="h-5 w-5" strokeWidth={1.8} />
                            </span>
                            <span className="relative z-10 mt-4 text-[14px] font-semibold text-[#181512]">
                              Resume Upload
                            </span>
                            <span className="relative z-10 mt-2 max-w-xl text-[13px] leading-6 text-[#6d6252]">
                              Drag and drop your resume here, or select a PDF, DOC or DOCX file up to 15MB.
                            </span>
                            <input
                              ref={fileInputRef}
                              id="careerResume"
                              type="file"
                              accept="application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="hidden"
                              disabled={isSubmitting}
                              onChange={(event) => assignResume(event.currentTarget.files?.[0])}
                            />
                          </label>
                          <AnimatePresence initial={false}>
                            {resumeFile ? (
                              <motion.div
                                key={`${resumeFile.name}-${resumeFile.size}`}
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.28, ease: "easeOut" }}
                                className="mt-3 flex items-center justify-between gap-3 rounded-[16px] border border-[#e1d2b6] bg-white px-3 py-2 text-xs font-medium text-[#625746] shadow-[0_10px_28px_rgba(82,56,26,0.045)]"
                              >
                                <span className="flex min-w-0 items-center gap-2">
                                  <FileUp className="h-4 w-4 shrink-0 text-[#9a7428]" strokeWidth={1.8} />
                                  <span className="truncate">{resumeFile.name}</span>
                                </span>
                                <span className="shrink-0 text-[#9a7428]">{resumeSize}</span>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                          {errors.resume?.message ? (
                            <motion.p
                              role="alert"
                              initial={{ opacity: 0, y: -2 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-xs font-medium leading-relaxed text-[#9c372d]"
                            >
                              {errors.resume.message}
                            </motion.p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-4 border-t border-[#e4d4b7] pt-5 md:flex-row md:items-center md:justify-between">
                        <div className="min-h-6">
                          <AnimatePresence mode="wait">
                            {isSubmitting ? (
                              <motion.p
                                key="career-sync-stage"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.24, ease: "easeOut" }}
                                className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0] text-[#9a7428]"
                              >
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#d6b45f] opacity-60" />
                                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#d6b45f]" />
                                </span>
                                Operational sync: {syncStage}
                              </motion.p>
                            ) : (
                              <motion.p
                                key="career-desk-ready"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.24, ease: "easeOut" }}
                                className="text-[13px] font-medium text-[#706552]"
                              >
                                Executive recruitment intake
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={closeModal}
                            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[14px] border border-[#d8c8a8] bg-[#fffaf0] px-5 text-sm font-semibold text-[#5f5446] shadow-[0_8px_20px_rgba(82,56,26,0.045)] transition duration-300 hover:-translate-y-0.5 hover:border-[#d6b45f] hover:bg-white hover:text-[#181512] hover:shadow-[0_14px_34px_rgba(82,56,26,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/38 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                          >
                            Close
                          </button>
                          <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            animate={
                              isSubmitting
                                ? {
                                    boxShadow: [
                                      "0 16px 38px rgba(23,18,15,0.18), 0 0 0 rgba(214,180,95,0)",
                                      "0 20px 48px rgba(23,18,15,0.24), 0 0 34px rgba(214,180,95,0.24)",
                                      "0 16px 38px rgba(23,18,15,0.18), 0 0 0 rgba(214,180,95,0)"
                                    ]
                                  }
                                : {}
                            }
                            transition={{ duration: 1.4, repeat: isSubmitting ? Infinity : 0, ease: "easeInOut" }}
                            className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-[#d6b45f] bg-[#17120f] px-5 text-sm font-semibold text-[#fff8ec] shadow-[0_16px_38px_rgba(23,18,15,0.18)] transition duration-300 hover:-translate-y-0.5 hover:border-[#e6c978] hover:shadow-[0_20px_48px_rgba(23,18,15,0.24),0_0_28px_rgba(214,180,95,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6b45f]/38 disabled:cursor-wait disabled:opacity-75 disabled:hover:translate-y-0"
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4.5 w-4.5 animate-spin" strokeWidth={1.8} />
                            ) : (
                              <Send className="h-4.5 w-4.5" strokeWidth={1.8} />
                            )}
                            {isSubmitting ? "Routing Application..." : "Submit Application"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {serverError && !isDelivered ? (
                    <motion.div
                      role="alert"
                      key="career-application-error"
                      initial={{ opacity: 0, y: 14, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: modalEase }}
                      className="mt-4 flex items-start gap-3 rounded-[18px] border border-[#dfb2a8] bg-[#fff8f4] px-4 py-3 text-left shadow-[0_16px_40px_rgba(111,42,31,0.12)]"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9c372d] text-white">
                        <AlertTriangle className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[0] text-[#8d3227]">
                          Routing paused
                        </span>
                        <span className="mt-1 block text-[13px] font-medium leading-relaxed text-[#5f2b24]">
                          {serverError}
                        </span>
                      </span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {successToast ? (
                    <motion.div
                      role="status"
                      aria-live="polite"
                      key="career-application-success-toast"
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.28, ease: modalEase }}
                      className="fixed right-3 top-3 z-[10000] max-w-[calc(100vw-1.5rem)] rounded-[16px] border border-[#c9d8bc] bg-[#f7fff3] px-4 py-3 text-left text-[13px] font-semibold leading-5 text-[#234824] shadow-[0_18px_48px_rgba(32,74,30,0.16)] sm:right-5 sm:top-5 sm:max-w-sm"
                    >
                      {successToast}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
