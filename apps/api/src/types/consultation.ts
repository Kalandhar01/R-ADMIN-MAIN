import type { ConsultationSubmissionInput } from "../validation/consultation.js";

export const workflowStepDefinitions = [
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
] as const;

export type WorkflowStageKey = (typeof workflowStepDefinitions)[number]["key"];
export type WorkflowStageStatus = "locked" | "active" | "waiting" | "completed" | "rejected";
export type UploadedDocumentKind = "submission" | "response";
export type ConsultationStatus = "new" | "reviewed" | "contacted" | "archived";

export interface ConsultationAttachment {
  id?: string;
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
  provider?: "cloudinary" | "email" | "metadata";
  providerId?: string;
  kind?: UploadedDocumentKind;
  stageKey?: WorkflowStageKey;
  uploadedBy?: string;
  createdAt?: string;
}

export interface ConsultationNotification {
  sent: boolean;
  skipped?: boolean;
  error?: string;
  sentAt?: string;
}

export interface ConsultationWorkflowStage {
  id: string;
  key: WorkflowStageKey;
  title: string;
  description: string;
  position: number;
  status: WorkflowStageStatus;
  stateLabel: string;
  startedAt?: string;
  unlockedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  updatedAt: string;
  responseDocuments: ConsultationAttachment[];
}

export interface WorkflowLogRecord {
  id: string;
  consultationId: string;
  stageId?: string;
  stageKey?: WorkflowStageKey;
  action: string;
  actorId?: string;
  actorEmail?: string;
  actorRole?: string;
  note?: string;
  createdAt: string;
}

export interface StatusHistoryRecord {
  id: string;
  consultationId: string;
  stageId?: string;
  stageKey?: WorkflowStageKey;
  fromStatus?: string;
  toStatus: string;
  label?: string;
  changedBy?: string;
  note?: string;
  createdAt: string;
}

export interface ConsultationRecord extends ConsultationSubmissionInput {
  _id: string;
  id: string;
  trackingToken?: string;
  attachments: ConsultationAttachment[];
  documents: ConsultationAttachment[];
  workflowStages: ConsultationWorkflowStage[];
  logs: WorkflowLogRecord[];
  statusHistory: StatusHistoryRecord[];
  currentStageKey: WorkflowStageKey;
  status: ConsultationStatus;
  source: string;
  notification: ConsultationNotification;
  createdAt: string;
  updatedAt: string;
}
