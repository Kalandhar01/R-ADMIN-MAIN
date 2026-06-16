import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
import type {
  ConsultationAttachment,
  ConsultationRequest,
  ConsultationWorkflowStage,
  WorkflowStageKey,
  WorkflowStageStatus
} from "@/lib/types";

type ConsultationPayload = {
  fullName: string;
  companyName: string;
  emailAddress: string;
  phoneNumber?: string;
  serviceType: string;
  budgetRange?: string;
  projectTimeline?: string;
  projectDescription: string;
  preferredConsultationType?: string;
};

type ConsultationNotification = ConsultationRequest["notification"];

type FallbackStore = {
  records: Map<string, ConsultationRequest>;
  events: EventEmitter;
};

const workflowSteps: Array<{
  key: WorkflowStageKey;
  title: string;
  description: string;
}> = [
  {
    key: "consultation_submitted",
    title: "Consultation Submitted",
    description: "Private brief, contact details and requirement documents are captured."
  },
  {
    key: "internal_review",
    title: "Internal Review",
    description: "The advisory desk reviews fit, urgency, constraints and required specialists."
  },
  {
    key: "approval_verification",
    title: "Approval & Verification",
    description: "Commercial readiness, documents and internal approvals are verified."
  },
  {
    key: "strategy_discussion",
    title: "Strategy Discussion",
    description: "Leadership aligns on the advisory agenda, priorities and decision inputs."
  },
  {
    key: "execution_planning",
    title: "Execution Planning",
    description: "Delivery lanes, milestones, ownership and response material are prepared."
  },
  {
    key: "project_kickoff",
    title: "Project Kickoff",
    description: "The approved plan moves into project initiation and execution governance."
  }
];

const globalStore = globalThis as typeof globalThis & {
  __ractyshConsultationFallbackStore?: FallbackStore;
};

function getStore(): FallbackStore {
  if (!globalStore.__ractyshConsultationFallbackStore) {
    globalStore.__ractyshConsultationFallbackStore = {
      records: new Map<string, ConsultationRequest>(),
      events: new EventEmitter()
    };
    globalStore.__ractyshConsultationFallbackStore.events.setMaxListeners(500);
  }

  return globalStore.__ractyshConsultationFallbackStore;
}

function cloneRecord(record: ConsultationRequest): ConsultationRequest {
  return JSON.parse(JSON.stringify(record)) as ConsultationRequest;
}

function eventName(consultationId: string): string {
  return `consultation:${consultationId}`;
}

function stageLabelFor(status: WorkflowStageStatus): string {
  if (status === "active") return "Waiting for Approval";
  if (status === "completed") return "Completed";
  if (status === "rejected") return "Rejected";
  if (status === "waiting") return "Waiting";
  return "Locked";
}

function defaultWorkflowStages(now: string): ConsultationWorkflowStage[] {
  return workflowSteps.map((step, index) => {
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
      startedAt: isSubmitted || isInternalReview ? now : undefined,
      unlockedAt: isSubmitted || isInternalReview ? now : undefined,
      completedAt: isSubmitted ? now : undefined,
      rejectedAt: undefined,
      updatedAt: now,
      responseDocuments: []
    };
  });
}

function uploadedDocuments(files: File[], now: string): ConsultationAttachment[] {
  return files.map((file) => ({
    id: randomUUID(),
    filename: file.name || "uploaded-file",
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    provider: "metadata",
    kind: "submission",
    stageKey: "consultation_submitted",
    uploadedBy: "client",
    createdAt: now
  }));
}

export function createFallbackConsultationRecord(
  payload: ConsultationPayload,
  files: File[],
  submittedAt: string,
  notification: ConsultationNotification
): ConsultationRequest {
  const store = getStore();
  const id = randomUUID();
  const documents = uploadedDocuments(files, submittedAt);
  const stages = defaultWorkflowStages(submittedAt);
  const submittedStage = stages.find((stage) => stage.key === "consultation_submitted");
  const internalReviewStage = stages.find((stage) => stage.key === "internal_review");
  const record: ConsultationRequest = {
    ...payload,
    _id: id,
    id,
    trackingToken: randomUUID(),
    phoneNumber: payload.phoneNumber || "",
    budgetRange: payload.budgetRange || "",
    projectTimeline: payload.projectTimeline || "",
    preferredConsultationType: payload.preferredConsultationType || "Virtual Meeting",
    status: "new",
    currentStageKey: "internal_review",
    attachments: documents,
    documents,
    workflowStages: stages,
    logs: [
      {
        id: randomUUID(),
        consultationId: id,
        stageId: submittedStage?.id,
        stageKey: "consultation_submitted",
        action: "submitted",
        actorRole: "client",
        note: "Consultation documents submitted by client.",
        createdAt: submittedAt
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
        createdAt: submittedAt
      },
      {
        id: randomUUID(),
        consultationId: id,
        stageId: internalReviewStage?.id,
        stageKey: "internal_review",
        toStatus: "active",
        label: "Waiting for Approval",
        changedBy: "system",
        createdAt: submittedAt
      }
    ],
    source: "book-consultation-page:fallback",
    notification,
    createdAt: submittedAt,
    updatedAt: submittedAt
  };

  store.records.set(id, record);

  while (store.records.size > 200) {
    const oldestKey = store.records.keys().next().value as string | undefined;
    if (!oldestKey) break;
    store.records.delete(oldestKey);
  }

  store.events.emit(eventName(id), cloneRecord(record));
  return cloneRecord(record);
}

export function getFallbackConsultationRecord(
  id: string,
  trackingToken: string
): ConsultationRequest | null {
  const record = getStore().records.get(id);
  if (!record || record.trackingToken !== trackingToken) return null;
  return cloneRecord(record);
}

export function updateFallbackConsultationNotification(
  id: string | undefined,
  notification: ConsultationNotification
): ConsultationRequest | null {
  if (!id) return null;

  const store = getStore();
  const record = store.records.get(id);
  if (!record) return null;

  const updated = {
    ...record,
    notification,
    updatedAt: new Date().toISOString()
  };

  store.records.set(id, updated);
  store.events.emit(eventName(id), cloneRecord(updated));
  return cloneRecord(updated);
}

export function subscribeFallbackConsultationRecord(
  id: string,
  listener: (record: ConsultationRequest) => void
): () => void {
  const store = getStore();
  const name = eventName(id);
  store.events.on(name, listener);

  return () => {
    store.events.off(name, listener);
  };
}
