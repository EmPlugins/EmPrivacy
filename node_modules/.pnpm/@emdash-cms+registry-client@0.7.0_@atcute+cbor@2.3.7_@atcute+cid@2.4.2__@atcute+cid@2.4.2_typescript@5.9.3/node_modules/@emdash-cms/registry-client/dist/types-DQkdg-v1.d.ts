import { NSID, PackageRelease, PackageReleaseExtension } from "@emdash-cms/registry-lexicons";

//#region src/release-service/source-record.d.ts
type DelegatedReleaseSourceArtifact = Omit<PackageRelease.Artifact, "blob" | "requiresAuth" | "url"> & {
  url: NonNullable<PackageRelease.Artifact["url"]>;
  blob?: never;
  requiresAuth?: never;
};
type DelegatedReleaseSourceImageArtifact = Omit<PackageRelease.ImageArtifact, "blob" | "requiresAuth" | "url"> & {
  url: NonNullable<PackageRelease.ImageArtifact["url"]>;
  blob?: never;
  requiresAuth?: never;
};
interface DelegatedReleaseSourceArtifacts extends Omit<PackageRelease.Artifacts, "banner" | "icon" | "package" | "screenshots"> {
  package: DelegatedReleaseSourceArtifact;
  icon?: DelegatedReleaseSourceImageArtifact;
  banner?: DelegatedReleaseSourceImageArtifact;
  screenshots?: DelegatedReleaseSourceImageArtifact[];
}
type DelegatedReleaseSourceExtension = Omit<PackageReleaseExtension.Main, "provenance"> & {
  provenance: PackageReleaseExtension.Provenance;
};
interface DelegatedReleaseSourceRecord extends Omit<PackageRelease.Main, "artifacts" | "auth" | "extensions"> {
  artifacts: DelegatedReleaseSourceArtifacts;
  auth?: never;
  extensions: Record<string, unknown> & {
    [NSID.packageReleaseExtension]: DelegatedReleaseSourceExtension;
  };
}
interface DelegatedReleaseSourceEnvelope {
  packageSlug: string;
  version: string;
}
declare function parseDelegatedReleaseSourceRecord(value: unknown, envelope?: DelegatedReleaseSourceEnvelope): DelegatedReleaseSourceRecord | null;
//#endregion
//#region src/release-service/types.d.ts
type ReleaseIntentState = "received" | "verifying" | "verified" | "awaiting_approval" | "ready" | "publishing" | "reconciling" | "published" | "invalid" | "rejected" | "cancelled" | "expired" | "failed" | "conflict";
type ReleaseServiceApiErrorCode = "ACCESS_DENIED" | "ACCESS_AUTH_INVALID" | "ACCESS_AUTH_REQUIRED" | "APPROVAL_INVALID" | "APPROVER_SESSION_INVALID" | "APPROVER_SUSPENDED" | "ARCHIVE_OPERATION_FAILED" | "AUTH_INVALID" | "CONFIGURATION_ERROR" | "CREDENTIAL_LIMIT_REACHED" | "CREDENTIAL_NOT_FOUND" | "CREDENTIAL_REVOKED" | "CSRF_INVALID" | "DELEGATION_REQUIRED" | "ENCRYPTION_OPERATION_FAILED" | "IDEMPOTENCY_KEY_INVALID" | "IDEMPOTENCY_CONFLICT" | "INTERNAL_ERROR" | "INVALID_REQUEST" | "INTENT_NOT_APPROVABLE" | "INTENT_NOT_CANCELLABLE" | "METHOD_NOT_ALLOWED" | "NOT_FOUND" | "OAUTH_AUTHORIZATION_FAILED" | "OAUTH_CALLBACK_INVALID" | "PACKAGE_PROFILE_REQUIRED" | "PROFILE_CHANGED" | "PROFILE_FETCH_FAILED" | "PUBLISHER_SESSION_INVALID" | "PUBLISHER_SUSPENDED" | "RELEASE_EXISTS" | "RESTORE_OPERATION_FAILED" | "SERVICE_PAUSED" | "SERVICE_UNAVAILABLE" | "VERSION_RESERVED" | "WORKFLOW_UNAVAILABLE" | "WORKFLOW_CONNECTION_CONFLICT" | "WORKFLOW_CONNECTION_EXPIRED" | "WORKFLOW_CONNECTION_INVITATION_EXPIRED" | "WORKFLOW_CONNECTION_INVITATION_INVALID" | "WORKFLOW_CONNECTION_INVITATION_LIMIT_REACHED" | "WORKFLOW_CONNECTION_INVITATION_REQUIRED" | "WORKFLOW_CONNECTION_LIMIT_REACHED" | "WORKFLOW_CONNECTION_NOT_FOUND" | "WORKLOAD_NOT_ALLOWED" | "WORKLOAD_RATE_LIMITED";
type ReleaseServiceClientErrorCode = ReleaseServiceApiErrorCode | "CLIENT_RESPONSE_INVALID" | "NETWORK_ERROR" | "POLL_TIMEOUT";
interface ReleaseIntentResult {
  uri: string;
  cid: string;
}
interface ReleaseIntentResource {
  id: string;
  publisherDid: string;
  packageSlug: string;
  version: string;
  state: ReleaseIntentState;
  stateGeneration: number;
  reasonCode: string | null;
  workflowId: string | null;
  expiresAt: number;
  createdAt: number;
  updatedAt: number;
  result: ReleaseIntentResult | null;
  approvalUrl: string | null;
}
interface SubmitReleaseIntentInput {
  publisherDid: string;
  packageSlug: string;
  version: string;
  release: DelegatedReleaseSourceRecord;
}
interface SubmitReleaseIntentResult {
  intent: ReleaseIntentResource;
  replayed: boolean;
}
type ReleaseArtifactSlot = "package" | "icon" | "banner" | `screenshots[${number}]` | "provenance";
interface UploadReleaseArtifactInput {
  publisherDid: string;
  packageSlug: string;
  version: string;
  slot: ReleaseArtifactSlot;
  checksum: string;
  contentType: string;
  bytes: Uint8Array;
}
interface StagedReleaseArtifactResource {
  slot: ReleaseArtifactSlot;
  checksum: string;
  contentType: string;
  size: number;
  sourceUrl: string;
}
interface UploadReleaseArtifactResult {
  artifact: StagedReleaseArtifactResource;
  replayed: boolean;
}
interface DryRunReleaseIntentResult {
  allowed: true;
  publisherDid: string;
  packageSlug: string;
  version: string;
  workloadPolicyVersion: number;
  workloadIdentityDigest: string;
  requestDigest: string;
}
interface WorkloadPolicyResource {
  packageSlug: string;
  repository: string;
  repositoryId: string;
  repositoryOwnerId: string;
  workflowRef: string;
  allowedRefs: readonly string[];
  allowedEnvironments: readonly string[];
  repositoryConnection: boolean;
  active: boolean;
  stateVersion: number;
  authorizedBy: string;
  createdAt: number;
  updatedAt: number;
}
interface PutWorkloadPolicyInput {
  packageSlug: string;
  repository: string;
  repositoryId: string;
  repositoryOwnerId: string;
  workflowRef: string;
  allowedRefs: readonly string[];
  allowedEnvironments: readonly string[];
  expectedVersion: number | null;
}
type WorkflowConnectionRequestState = "confirmed" | "expired" | "pending";
type WorkflowConnectionRefScope = "current_ref" | "version_tags";
interface WorkflowConnectionClaimResource {
  repository: string;
  repositoryId: string;
  repositoryOwner: string;
  repositoryOwnerId: string;
  repositoryVisibility: "internal" | "private" | "public";
  workflowRef: string;
  ref: string;
  environment: string | null;
}
interface WorkflowConnectionRequestResource {
  id: string;
  packageSlug: string;
  state: WorkflowConnectionRequestState;
  claim: WorkflowConnectionClaimResource;
  refScope: WorkflowConnectionRefScope | null;
  expiresAt: number;
  createdAt: number;
  confirmedAt: number | null;
}
interface RequestWorkflowConnectionInput {
  publisherDid: string;
  packageSlug: string;
  invitationToken?: string;
}
interface CreateWorkflowConnectionInvitationResult {
  invitationToken: string;
  packageSlug: string;
  expiresAt: number;
}
type RequestWorkflowConnectionResult = {
  status: "connected";
  policy: WorkloadPolicyResource;
} | {
  status: "pending";
  request: WorkflowConnectionRequestResource;
  approvalUrl: string;
  replayed: boolean;
};
interface ConfirmWorkflowConnectionResult {
  request: WorkflowConnectionRequestResource;
  policy: WorkloadPolicyResource;
  replayed: boolean;
}
interface DelegationResource {
  releaseNsid: string;
  scope: string;
  issuer: string | null;
  pdsUrl: string | null;
  expiresAt: number | null;
  refreshBefore: number | null;
  status: "active" | "revoked" | "reauthorization_required";
  stateVersion: number;
}
interface PublisherResource {
  did: string;
  handle: string | null;
  delegation: DelegationResource | null;
  sessionExpiresAt?: number;
}
interface ServiceControlState {
  mode: "active" | "admission-paused" | "publication-paused";
  epoch: number;
  reasonCode: string | null;
  changedBy: string;
  changedAt: number;
}
interface PublisherControlResource {
  publisherDid: string;
  status: "allowed" | "suspended";
  reasonCode: string | null;
  changedBy: string;
  changedAt: number;
}
interface OperatorPublisherResource extends PublisherResource {
  control: PublisherControlResource;
}
type DirectoryIdentityKind = "approver" | "publisher";
interface DirectoryIdentityResource {
  kind: DirectoryIdentityKind;
  did: string;
  shard: string;
  registeredAt: number;
  lastSeenAt: number;
}
interface DirectoryListOptions {
  cursor?: string;
  limit?: number;
}
interface AuditListOptions {
  cursor?: string;
  limit?: number;
}
interface ControlAuditEventResource {
  sequence: number;
  eventType: string;
  actorRealm: "access" | "system";
  actorIdentity: string;
  actorRole: "admin" | "reviewer" | "viewer" | null;
  subject: string;
  reasonCode: string | null;
  createdAt: number;
}
interface PublisherAuditEventResource {
  sequence: number;
  eventType: string;
  actorRealm: "access" | "approver" | "oidc" | "publisher" | "system";
  actorIdentity: string;
  actorHandle: string | null;
  subject: string;
  reasonCode: string | null;
  createdAt: number;
}
type PublisherApproverEnrollmentState = "enrolled" | "not_enrolled" | "revoked";
interface PublisherApproverStatusResource {
  did: string;
  handle: string | null;
  status: PublisherApproverEnrollmentState;
}
interface PublisherApproverStatusResult {
  packageSlug: string;
  profileCid: string;
  items: PublisherApproverStatusResource[];
}
interface EncryptionRotationPageInput {
  afterCursor: string | null;
  limit: number;
}
interface EncryptionRotationResult {
  ownerDid: string;
  targetKeyVersion: number;
  scanned: number;
  rotated: number;
  raced: number;
  nextCursor: string | null;
  complete: boolean;
}
type EncryptionKeyLifecycleStatus = "active" | "readable" | "retired";
interface EncryptionKeyStateResource {
  version: number;
  status: EncryptionKeyLifecycleStatus;
  activatedAt: number;
  retiredAt: number | null;
  changedBy: string;
  updatedAt: number;
}
interface EncryptionKeyStatusResource {
  configured: {
    activeVersion: number;
    versions: number[];
  };
  keys: EncryptionKeyStateResource[];
  verification: EncryptionVerificationResource | null;
}
interface EncryptionVerificationResource {
  targetKeyVersion: number;
  workflowId: string;
  publishers: number;
  approvers: number;
  records: number;
  rotated: number;
  verifiedAt: number;
}
interface StartEncryptionVerificationResult {
  workflowId: string;
  created: boolean;
}
type PublisherArchiveKind = "audit-events" | "intents" | "metadata" | "workload-policies";
interface PublisherArchivePageInput {
  archiveId: string;
  cursor: string | null;
  page: number;
}
interface PublisherArchivePageResult {
  archiveId: string;
  ownerHash: string;
  page: number;
  kind: PublisherArchiveKind;
  nextCursor: string | null;
  nextPage: number;
  replayed: boolean;
  complete: boolean;
  manifestWritten: boolean;
}
interface StartPublisherArchiveResult {
  archiveId: string;
  workflowId: string;
  created: boolean;
}
interface PublisherRestorePageInput {
  archiveId: string;
  page: number;
}
interface PublisherRestorePageResult {
  archiveId: string;
  ownerHash: string;
  page: number;
  kind: PublisherArchiveKind;
  nextPage: number;
  totalPages: number;
  replayed: boolean;
  complete: boolean;
  authorityStatus: "reauthorization_required";
}
interface PreparePublisherRestoreResult {
  archiveId: string;
  publisherDid: string;
  prepared: true;
  deletedIntents: number;
  deletedWorkloads: number;
  replayed: boolean;
}
interface AbortPublisherRestoreResult {
  archiveId: string;
  publisherDid: string;
  aborted: true;
  replayed: boolean;
}
interface CursorPage<T> {
  items: T[];
  nextCursor?: string;
}
interface MutationResult<T> {
  value: T;
  replayed: boolean;
}
declare const TERMINAL_RELEASE_INTENT_STATES: ReadonlySet<ReleaseIntentState>;
//#endregion
export { WorkloadPolicyResource as $, PublisherRestorePageInput as A, RequestWorkflowConnectionResult as B, PublisherApproverStatusResult as C, PublisherAuditEventResource as D, PublisherArchivePageResult as E, ReleaseIntentResult as F, SubmitReleaseIntentResult as G, StartEncryptionVerificationResult as H, ReleaseIntentState as I, UploadReleaseArtifactResult as J, TERMINAL_RELEASE_INTENT_STATES as K, ReleaseServiceApiErrorCode as L, PutWorkloadPolicyInput as M, ReleaseArtifactSlot as N, PublisherControlResource as O, ReleaseIntentResource as P, WorkflowConnectionRequestState as Q, ReleaseServiceClientErrorCode as R, PublisherApproverStatusResource as S, PublisherArchivePageInput as T, StartPublisherArchiveResult as U, ServiceControlState as V, SubmitReleaseIntentInput as W, WorkflowConnectionRefScope as X, WorkflowConnectionClaimResource as Y, WorkflowConnectionRequestResource as Z, EncryptionVerificationResource as _, CreateWorkflowConnectionInvitationResult as a, DelegatedReleaseSourceRecord as at, PreparePublisherRestoreResult as b, DirectoryIdentityKind as c, DryRunReleaseIntentResult as d, DelegatedReleaseSourceArtifact as et, EncryptionKeyLifecycleStatus as f, EncryptionRotationResult as g, EncryptionRotationPageInput as h, ControlAuditEventResource as i, DelegatedReleaseSourceImageArtifact as it, PublisherRestorePageResult as j, PublisherResource as k, DirectoryIdentityResource as l, EncryptionKeyStatusResource as m, AuditListOptions as n, DelegatedReleaseSourceEnvelope as nt, CursorPage as o, parseDelegatedReleaseSourceRecord as ot, EncryptionKeyStateResource as p, UploadReleaseArtifactInput as q, ConfirmWorkflowConnectionResult as r, DelegatedReleaseSourceExtension as rt, DelegationResource as s, AbortPublisherRestoreResult as t, DelegatedReleaseSourceArtifacts as tt, DirectoryListOptions as u, MutationResult as v, PublisherArchiveKind as w, PublisherApproverEnrollmentState as x, OperatorPublisherResource as y, RequestWorkflowConnectionInput as z };
//# sourceMappingURL=types-DQkdg-v1.d.ts.map