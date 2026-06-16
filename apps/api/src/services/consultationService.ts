import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  workflowStepDefinitions,
  type ConsultationAttachment,
  type ConsultationNotification,
  type ConsultationRecord,
  type ConsultationWorkflowStage,
  type StatusHistoryRecord,
  type UploadedDocumentKind,
  type WorkflowLogRecord,
  type WorkflowStageStatus
} from "../types/consultation.js";
import type { ConsultationSubmissionInput } from "../validation/consultation.js";
import { publishConsultationUpdate } from "./consultationWorkflowEvents.js";
import { safelyIngestDocument, safelyIngestLead } from "./ingestionService.js";

const consultationInclude = {
  workflowStages: true,
  workflowLogs: true,
  uploadedDocuments: true,
  statusHistory: true
} satisfies Prisma.ConsultationInclude;

type ConsultationWithRelations = Prisma.ConsultationGetPayload<{
  include: typeof consultationInclude;
}>;

let prismaEnabled = false;
let memoryConsultations: ConsultationRecord[] = [];

export function setConsultationPrismaEnabled(value: boolean): void {
  prismaEnabled = value;
}

function iso(value: Date | string | null | undefined): string | undefined {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function stageLabelFor(status: WorkflowStageStatus): string {
  if (status === "active") return "Waiting for Approval";
  if (status === "completed") return "Completed";
  if (status === "rejected") return "Rejected";
  if (status === "waiting") return "Waiting";
  return "Locked";
}

function defaultWorkflowStages(now: Date): ConsultationWorkflowStage[] {
  return workflowStepDefinitions.map((step, index) => {
    const isSubmitted = step.key === "consultation_submitted";
    const isInternalReview = step.key === "internal_review";
    const status: WorkflowStageStatus = isSubmitted ? "completed" : isInternalReview ? "active" : "locked";

    return {
      id: randomUUID(),
      key: step.key,
      title: step.title,
      description: step.description,
      position: index + 1,
      status,
      stateLabel: stageLabelFor(status),
      startedAt: isSubmitted || isInternalReview ? now.toISOString() : undefined,
      unlockedAt: isSubmitted || isInternalReview ? now.toISOString() : undefined,
      completedAt: isSubmitted ? now.toISOString() : undefined,
      rejectedAt: undefined,
      updatedAt: now.toISOString(),
      responseDocuments: []
    };
  });
}

function defaultWorkflowStageRows(consultationId: string, now: Date) {
  return workflowStepDefinitions.map((step, index) => {
    const isSubmitted = step.key === "consultation_submitted";
    const isInternalReview = step.key === "internal_review";
    const status: WorkflowStageStatus = isSubmitted ? "completed" : isInternalReview ? "active" : "locked";

    return {
      consultationId,
      key: step.key,
      title: step.title,
      description: step.description,
      position: index + 1,
      status,
      stateLabel: stageLabelFor(status),
      startedAt: isSubmitted || isInternalReview ? now : undefined,
      unlockedAt: isSubmitted || isInternalReview ? now : undefined,
      completedAt: isSubmitted ? now : undefined
    };
  });
}

function mapDocument(document: ConsultationWithRelations["uploadedDocuments"][number]): ConsultationAttachment {
  return {
    id: document.id,
    filename: document.filename,
    mimeType: document.mimeType,
    size: document.size,
    url: document.url || undefined,
    provider: (document.provider as ConsultationAttachment["provider"]) || "metadata",
    providerId: document.providerId || undefined,
    kind: document.kind as UploadedDocumentKind,
    stageKey: document.stageKey || undefined,
    uploadedBy: document.uploadedBy,
    createdAt: iso(document.createdAt)
  };
}

function mapWorkflowStage(
  stage: ConsultationWithRelations["workflowStages"][number],
  documents: ConsultationAttachment[]
): ConsultationWorkflowStage {
  return {
    id: stage.id,
    key: stage.key,
    title: stage.title,
    description: stage.description,
    position: stage.position,
    status: stage.status,
    stateLabel: stage.stateLabel,
    startedAt: iso(stage.startedAt),
    unlockedAt: iso(stage.unlockedAt),
    completedAt: iso(stage.completedAt),
    rejectedAt: iso(stage.rejectedAt),
    updatedAt: iso(stage.updatedAt) || new Date().toISOString(),
    responseDocuments: documents.filter((document) => document.kind === "response" && document.stageKey === stage.key)
  };
}

function mapWorkflowLog(log: ConsultationWithRelations["workflowLogs"][number]): WorkflowLogRecord {
  return {
    id: log.id,
    consultationId: log.consultationId,
    stageId: log.stageId || undefined,
    stageKey: log.stageKey || undefined,
    action: log.action,
    actorId: log.actorId || undefined,
    actorEmail: log.actorEmail || undefined,
    actorRole: log.actorRole || undefined,
    note: log.note || undefined,
    createdAt: iso(log.createdAt) || new Date().toISOString()
  };
}

function mapStatusHistory(history: ConsultationWithRelations["statusHistory"][number]): StatusHistoryRecord {
  return {
    id: history.id,
    consultationId: history.consultationId,
    stageId: history.stageId || undefined,
    stageKey: history.stageKey || undefined,
    fromStatus: history.fromStatus || undefined,
    toStatus: history.toStatus,
    label: history.label || undefined,
    changedBy: history.changedBy || undefined,
    note: history.note || undefined,
    createdAt: iso(history.createdAt) || new Date().toISOString()
  };
}

function mapConsultation(record: ConsultationWithRelations): ConsultationRecord {
  const documents = [...record.uploadedDocuments]
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .map(mapDocument);
  const workflowStages = [...record.workflowStages]
    .sort((a, b) => a.position - b.position)
    .map((stage) => mapWorkflowStage(stage, documents));

  return {
    _id: record.id,
    id: record.id,
    trackingToken: record.trackingToken,
    fullName: record.fullName,
    companyName: record.companyName,
    emailAddress: record.emailAddress,
    phoneNumber: record.phoneNumber,
    serviceType: record.serviceType as ConsultationSubmissionInput["serviceType"],
    division: record.division,
    budgetRange: record.budgetRange,
    projectTimeline: record.projectTimeline,
    projectDescription: record.projectDescription,
    preferredConsultationType: record.preferredConsultationType as ConsultationSubmissionInput["preferredConsultationType"],
    attachments: documents.filter((document) => document.kind === "submission"),
    documents,
    workflowStages,
    logs: [...record.workflowLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(mapWorkflowLog),
    statusHistory: [...record.statusHistory]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(mapStatusHistory),
    currentStageKey: record.currentStageKey,
    status: record.status,
    source: record.source,
    notification: {
      sent: record.notificationSent,
      skipped: record.notificationSkipped || undefined,
      error: record.notificationError || undefined,
      sentAt: iso(record.notificationSentAt)
    },
    createdAt: iso(record.createdAt) || new Date().toISOString(),
    updatedAt: iso(record.updatedAt) || new Date().toISOString()
  };
}

function normalizeMemoryRecord(record: ConsultationRecord): ConsultationRecord {
  return {
    ...record,
    attachments: record.attachments.map((attachment) => ({ ...attachment })),
    documents: record.documents.map((document) => ({ ...document })),
    workflowStages: record.workflowStages.map((stage) => ({
      ...stage,
      responseDocuments: stage.responseDocuments.map((document) => ({ ...document }))
    })),
    logs: record.logs.map((log) => ({ ...log })),
    statusHistory: record.statusHistory.map((history) => ({ ...history }))
  };
}

async function captureConsultationIngestion(record: ConsultationRecord): Promise<void> {
  const lead = await safelyIngestLead({
    fullName: record.fullName,
    email: record.emailAddress,
    phone: record.phoneNumber || undefined,
    companyName: record.companyName || undefined,
    source: record.source || "book-consultation-page",
    division: record.division,
    sourceType: "book_consultation_form",
    service: record.serviceType,
    status: "new",
    message: record.projectDescription,
    metadata: {
      budgetRange: record.budgetRange,
      projectTimeline: record.projectTimeline,
      preferredConsultationType: record.preferredConsultationType,
      trackingToken: record.trackingToken
    },
    externalEntityId: record.id,
    externalEntityModel: "Consultation"
  });

  if (!record.documents.length) return;

  await Promise.all(
    record.documents
      .filter((document) => document.kind === "submission")
      .map((document) =>
        safelyIngestDocument({
          sourceType: "book_consultation_form",
          filename: document.filename,
          mimeType: document.mimeType,
          size: document.size,
          url: document.url,
          provider: document.provider || "metadata",
          providerId: document.providerId,
          category: "Consultation Requirement",
          division: record.division,
          projectId: record.id,
          projectName: record.serviceType,
          uploadedBy: "client",
          uploadDate: document.createdAt ? new Date(document.createdAt) : undefined,
          metadata: {
            consultationId: record.id,
            leadId: lead?.entityId,
            stageKey: document.stageKey,
            trackingToken: record.trackingToken
          }
        })
      )
  );
}

async function findPrismaConsultation(id: string): Promise<ConsultationRecord | null> {
  const record = await prisma.consultation.findUnique({
    where: { id },
    include: consultationInclude
  });

  return record ? mapConsultation(record) : null;
}

export async function createConsultation(
  input: ConsultationSubmissionInput & { attachments: ConsultationAttachment[]; source: string }
): Promise<ConsultationRecord> {
  const now = new Date();

  if (!prismaEnabled) {
    const id = randomUUID();
    const stages = defaultWorkflowStages(now);
    const submittedStage = stages.find((stage) => stage.key === "consultation_submitted");
    const documents = input.attachments.map((attachment) => ({
      ...attachment,
      id: randomUUID(),
      kind: "submission" as const,
      stageKey: "consultation_submitted" as const,
      uploadedBy: "client",
      createdAt: now.toISOString()
    }));
    const record: ConsultationRecord = {
      ...input,
      _id: id,
      id,
      trackingToken: randomUUID(),
      status: "new",
      currentStageKey: "internal_review",
      attachments: documents,
      documents,
      workflowStages: stages.map((stage) =>
        stage.key === submittedStage?.key ? { ...stage, responseDocuments: [] } : stage
      ),
      logs: [
        {
          id: randomUUID(),
          consultationId: id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          action: "submitted",
          actorRole: "client",
          note: "Consultation documents submitted by client.",
          createdAt: now.toISOString()
        }
      ],
      statusHistory: [
        {
          id: randomUUID(),
          consultationId: id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          toStatus: "completed",
          label: "Consultation Submitted",
          changedBy: "client",
          createdAt: now.toISOString()
        },
        {
          id: randomUUID(),
          consultationId: id,
          stageKey: "internal_review",
          toStatus: "active",
          label: "Waiting for Approval",
          changedBy: "system",
          createdAt: now.toISOString()
        }
      ],
      notification: { sent: false, skipped: true },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    memoryConsultations = [record, ...memoryConsultations].slice(0, 200);
    publishConsultationUpdate(id);
    return normalizeMemoryRecord(record);
  }

  const createdId = await prisma.$transaction(async (tx) => {
    const consultation = await tx.consultation.create({
      data: {
        fullName: input.fullName,
        division: input.division,
        companyName: input.companyName,
        emailAddress: input.emailAddress,
        phoneNumber: input.phoneNumber,
        serviceType: input.serviceType,
        budgetRange: input.budgetRange,
        projectTimeline: input.projectTimeline,
        projectDescription: input.projectDescription,
        preferredConsultationType: input.preferredConsultationType,
        source: input.source,
        status: "new",
        currentStageKey: "internal_review"
      }
    });

    await tx.workflowStage.createMany({
      data: defaultWorkflowStageRows(consultation.id, now)
    });

    const submittedStage = await tx.workflowStage.findUnique({
      where: {
        consultationId_key: {
          consultationId: consultation.id,
          key: "consultation_submitted"
        }
      }
    });
    const internalReviewStage = await tx.workflowStage.findUnique({
      where: {
        consultationId_key: {
          consultationId: consultation.id,
          key: "internal_review"
        }
      }
    });

    if (input.attachments.length) {
      await tx.uploadedDocument.createMany({
        data: input.attachments.map((attachment) => ({
          consultationId: consultation.id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          kind: "submission",
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: attachment.size,
          url: attachment.url,
          provider: attachment.provider || "metadata",
          providerId: attachment.providerId,
          uploadedBy: "client"
        }))
      });
    }

    await tx.workflowLog.create({
      data: {
        consultationId: consultation.id,
        stageId: submittedStage?.id,
        stageKey: "consultation_submitted",
        action: "submitted",
        actorRole: "client",
        note: "Consultation documents submitted by client."
      }
    });
    await tx.statusHistory.createMany({
      data: [
        {
          consultationId: consultation.id,
          stageId: submittedStage?.id,
          stageKey: "consultation_submitted",
          toStatus: "completed",
          label: "Consultation Submitted",
          changedBy: "client"
        },
        {
          consultationId: consultation.id,
          stageId: internalReviewStage?.id,
          stageKey: "internal_review",
          toStatus: "active",
          label: "Waiting for Approval",
          changedBy: "system"
        }
      ]
    });

    return consultation.id;
  });

  const record = await findPrismaConsultation(createdId);
  if (!record) throw new Error("Consultation workflow could not be loaded after creation.");

  await captureConsultationIngestion(record);
  publishConsultationUpdate(createdId);
  return record;
}

export async function getConsultationWorkflow(
  id: string,
  trackingToken?: string
): Promise<ConsultationRecord | null> {
  if (!prismaEnabled) {
    const record = memoryConsultations.find((item) => item._id === id || item.id === id);
    if (!record) return null;
    if (trackingToken && record.trackingToken !== trackingToken) return null;
    return normalizeMemoryRecord(record);
  }

  const record = await findPrismaConsultation(id);
  if (!record) return null;
  if (trackingToken && record.trackingToken !== trackingToken) return null;
  return record;
}

export async function updateConsultationNotification(
  id: string | undefined,
  notification: ConsultationNotification
): Promise<void> {
  if (!id) return;

  if (!prismaEnabled) {
    memoryConsultations = memoryConsultations.map((record) =>
      record._id === id || record.id === id
        ? {
            ...record,
            notification,
            updatedAt: new Date().toISOString()
          }
        : record
    );
    publishConsultationUpdate(id);
    return;
  }

  await prisma.consultation.update({
    where: { id },
    data: {
      notificationSent: notification.sent,
      notificationSkipped: Boolean(notification.skipped),
      notificationError: notification.error,
      notificationSentAt: notification.sentAt ? new Date(notification.sentAt) : undefined
    }
  });
  publishConsultationUpdate(id);
}
