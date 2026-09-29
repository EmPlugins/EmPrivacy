import { $ as WorkloadPolicyResource, A as PublisherRestorePageInput, B as RequestWorkflowConnectionResult, C as PublisherApproverStatusResult, D as PublisherAuditEventResource, E as PublisherArchivePageResult, F as ReleaseIntentResult, G as SubmitReleaseIntentResult, H as StartEncryptionVerificationResult, I as ReleaseIntentState, J as UploadReleaseArtifactResult, K as TERMINAL_RELEASE_INTENT_STATES, L as ReleaseServiceApiErrorCode, M as PutWorkloadPolicyInput, N as ReleaseArtifactSlot, O as PublisherControlResource, P as ReleaseIntentResource, Q as WorkflowConnectionRequestState, R as ReleaseServiceClientErrorCode, S as PublisherApproverStatusResource, T as PublisherArchivePageInput, U as StartPublisherArchiveResult, V as ServiceControlState, W as SubmitReleaseIntentInput, X as WorkflowConnectionRefScope, Y as WorkflowConnectionClaimResource, Z as WorkflowConnectionRequestResource, _ as EncryptionVerificationResource, a as CreateWorkflowConnectionInvitationResult, at as DelegatedReleaseSourceRecord, b as PreparePublisherRestoreResult, c as DirectoryIdentityKind, d as DryRunReleaseIntentResult, et as DelegatedReleaseSourceArtifact, f as EncryptionKeyLifecycleStatus, g as EncryptionRotationResult, h as EncryptionRotationPageInput, i as ControlAuditEventResource, it as DelegatedReleaseSourceImageArtifact, j as PublisherRestorePageResult, k as PublisherResource, l as DirectoryIdentityResource, m as EncryptionKeyStatusResource, n as AuditListOptions, nt as DelegatedReleaseSourceEnvelope, o as CursorPage, ot as parseDelegatedReleaseSourceRecord, p as EncryptionKeyStateResource, q as UploadReleaseArtifactInput, r as ConfirmWorkflowConnectionResult, rt as DelegatedReleaseSourceExtension, s as DelegationResource, t as AbortPublisherRestoreResult, tt as DelegatedReleaseSourceArtifacts, u as DirectoryListOptions, v as MutationResult, w as PublisherArchiveKind, x as PublisherApproverEnrollmentState, y as OperatorPublisherResource, z as RequestWorkflowConnectionInput } from "../types-DQkdg-v1.js";
import { PackageRelease } from "@emdash-cms/registry-lexicons";

//#region src/release-service/index.d.ts
type WorkloadTokenProvider = () => string | Promise<string>;
type CsrfTokenProvider = () => string | Promise<string>;
interface ReleaseServiceClientOptions {
  serviceUrl: string;
  fetch?: typeof fetch;
  workloadToken?: string | WorkloadTokenProvider;
  csrfToken?: string | CsrfTokenProvider;
}
interface RequestOptions {
  signal?: AbortSignal;
}
interface MutationOptions extends RequestOptions {
  idempotencyKey: string;
}
interface WaitForIntentOptions extends RequestOptions {
  pollIntervalMs?: number;
  maxWaitMs?: number;
  stopOnApproval?: boolean;
  onUpdate?: (intent: ReleaseIntentResource) => void | Promise<void>;
}
interface WaitForWorkflowConnectionOptions extends MutationOptions {
  pollIntervalMs?: number;
  maxWaitMs?: number;
  onUpdate?: (result: RequestWorkflowConnectionResult) => void | Promise<void>;
}
interface OperatorClientOptions {
  serviceUrl: string;
  fetch?: typeof fetch;
}
declare class ReleaseServiceError extends Error {
  readonly code: ReleaseServiceClientErrorCode;
  readonly status: number;
  readonly requestId: string | null;
  readonly retryable: boolean;
  readonly retryAfterMs: number | null;
  constructor(input: {
    code: ReleaseServiceClientErrorCode;
    message: string;
    status?: number;
    requestId?: string | null;
    retryAfterMs?: number | null;
  });
}
declare function createReleaseIdempotencyKey(prefix?: string): string;
declare class BaseReleaseServiceClient {
  readonly serviceUrl: string;
  readonly fetch: typeof fetch;
  constructor(options: {
    serviceUrl: string;
    fetch?: typeof fetch;
  });
  protected call<T>(path: string, init: RequestInit, parse: (value: unknown) => T): Promise<T>;
}
declare class ReleaseServiceClient extends BaseReleaseServiceClient {
  #private;
  constructor(options: ReleaseServiceClientOptions);
  submitIntent(input: SubmitReleaseIntentInput, options: MutationOptions): Promise<SubmitReleaseIntentResult>;
  uploadReleaseArtifact(input: UploadReleaseArtifactInput, options: MutationOptions): Promise<UploadReleaseArtifactResult>;
  dryRunIntent(input: SubmitReleaseIntentInput, options?: RequestOptions): Promise<DryRunReleaseIntentResult>;
  getIntent(publisherDid: string, intentId: string, options?: RequestOptions): Promise<ReleaseIntentResource>;
  cancelIntent(publisherDid: string, intentId: string, options: MutationOptions): Promise<ReleaseIntentResource>;
  waitForIntent(publisherDid: string, intentId: string, options?: WaitForIntentOptions): Promise<ReleaseIntentResource>;
  getPublisher(options?: RequestOptions): Promise<PublisherResource>;
  revokeDelegation(options: MutationOptions): Promise<PublisherResource>;
  requestWorkflowConnection(input: RequestWorkflowConnectionInput, options: MutationOptions): Promise<RequestWorkflowConnectionResult>;
  createWorkflowConnectionInvitation(packageSlug: string, options: MutationOptions): Promise<CreateWorkflowConnectionInvitationResult>;
  waitForWorkflowConnection(input: RequestWorkflowConnectionInput, options: WaitForWorkflowConnectionOptions): Promise<WorkloadPolicyResource>;
  listWorkflowConnections(options?: RequestOptions): Promise<WorkflowConnectionRequestResource[]>;
  confirmWorkflowConnection(requestId: string, refScope: "current_ref" | "version_tags", options: MutationOptions): Promise<ConfirmWorkflowConnectionResult>;
  rejectWorkflowConnection(requestId: string, options: MutationOptions): Promise<void>;
  listWorkloads(options?: RequestOptions & {
    cursor?: string;
    limit?: number;
  }): Promise<CursorPage<WorkloadPolicyResource>>;
  putWorkload(input: PutWorkloadPolicyInput, options: MutationOptions): Promise<MutationResult<WorkloadPolicyResource>>;
  disableWorkload(packageSlug: string, expectedVersion: number, options: MutationOptions): Promise<MutationResult<WorkloadPolicyResource>>;
  listPublisherIntents(options?: RequestOptions & {
    cursor?: string;
    limit?: number;
  }): Promise<CursorPage<ReleaseIntentResource>>;
  listPublisherAudit(options?: RequestOptions & AuditListOptions): Promise<CursorPage<PublisherAuditEventResource>>;
  getPublisherApproverStatus(packageSlug: string): Promise<PublisherApproverStatusResult>;
}
declare class ReleaseServiceOperatorClient extends BaseReleaseServiceClient {
  #private;
  getStatus(options?: RequestOptions): Promise<ServiceControlState>;
  getEncryptionKeyStatus(options?: RequestOptions): Promise<EncryptionKeyStatusResource>;
  activateEncryptionKey(version: number, options: MutationOptions): Promise<MutationResult<EncryptionKeyStateResource>>;
  startEncryptionVerification(retiringVersion: number, options: MutationOptions): Promise<StartEncryptionVerificationResult>;
  retireEncryptionKey(version: number, options: MutationOptions): Promise<MutationResult<EncryptionKeyStateResource>>;
  listDirectory(kind: DirectoryIdentityKind, options?: DirectoryListOptions & RequestOptions): Promise<CursorPage<DirectoryIdentityResource>>;
  listAudit(options?: AuditListOptions): Promise<CursorPage<ControlAuditEventResource>>;
  setMode(mode: ServiceControlState["mode"], reasonCode: string | null, options: MutationOptions): Promise<MutationResult<ServiceControlState>>;
  getPublisher(publisherDid: string, options?: RequestOptions): Promise<OperatorPublisherResource>;
  setPublisherSuspended(publisherDid: string, suspended: boolean, reasonCode: string | null, options: MutationOptions): Promise<PublisherControlResource>;
  revokePublisher(publisherDid: string, options: MutationOptions): Promise<PublisherResource>;
  archivePublisher(publisherDid: string, page: PublisherArchivePageInput, options: MutationOptions): Promise<PublisherArchivePageResult>;
  startPublisherArchive(publisherDid: string, archiveId: string, options: MutationOptions): Promise<StartPublisherArchiveResult>;
  restorePublisher(publisherDid: string, page: PublisherRestorePageInput, options: MutationOptions): Promise<PublisherRestorePageResult>;
  preparePublisherRestore(publisherDid: string, archiveId: string, options: MutationOptions): Promise<PreparePublisherRestoreResult>;
  abortPublisherRestore(publisherDid: string, archiveId: string, options: MutationOptions): Promise<AbortPublisherRestoreResult>;
  rotatePublisherEncryption(publisherDid: string, page: EncryptionRotationPageInput, options: MutationOptions): Promise<EncryptionRotationResult>;
  rotateApproverEncryption(approverDid: string, page: EncryptionRotationPageInput, options: MutationOptions): Promise<EncryptionRotationResult>;
  cancelIntent(publisherDid: string, intentId: string, options: MutationOptions): Promise<ReleaseIntentResource>;
  reconcileIntent(publisherDid: string, intentId: string, options: MutationOptions): Promise<{
    intent: ReleaseIntentResource;
    restarted: boolean;
  }>;
}
type ReleaseRecord = PackageRelease.Main;
//#endregion
export { type AbortPublisherRestoreResult, type AuditListOptions, type ConfirmWorkflowConnectionResult, type ControlAuditEventResource, type CreateWorkflowConnectionInvitationResult, type CursorPage, type DelegatedReleaseSourceArtifact, type DelegatedReleaseSourceArtifacts, type DelegatedReleaseSourceEnvelope, type DelegatedReleaseSourceExtension, type DelegatedReleaseSourceImageArtifact, type DelegatedReleaseSourceRecord, type DelegationResource, type DirectoryIdentityKind, type DirectoryIdentityResource, type DirectoryListOptions, type DryRunReleaseIntentResult, type EncryptionKeyLifecycleStatus, type EncryptionKeyStateResource, type EncryptionKeyStatusResource, type EncryptionRotationPageInput, type EncryptionRotationResult, type EncryptionVerificationResource, MutationOptions, type MutationResult, OperatorClientOptions, type OperatorPublisherResource, type PreparePublisherRestoreResult, type PublisherApproverEnrollmentState, type PublisherApproverStatusResource, type PublisherApproverStatusResult, type PublisherArchiveKind, type PublisherArchivePageInput, type PublisherArchivePageResult, type PublisherAuditEventResource, type PublisherControlResource, type PublisherResource, type PublisherRestorePageInput, type PublisherRestorePageResult, type PutWorkloadPolicyInput, type ReleaseArtifactSlot, type ReleaseIntentResource, type ReleaseIntentResult, type ReleaseIntentState, ReleaseRecord, type ReleaseServiceApiErrorCode, ReleaseServiceClient, type ReleaseServiceClientErrorCode, ReleaseServiceClientOptions, ReleaseServiceError, ReleaseServiceOperatorClient, RequestOptions, type RequestWorkflowConnectionInput, type RequestWorkflowConnectionResult, type ServiceControlState, type StartEncryptionVerificationResult, type StartPublisherArchiveResult, type SubmitReleaseIntentInput, type SubmitReleaseIntentResult, TERMINAL_RELEASE_INTENT_STATES, type UploadReleaseArtifactInput, type UploadReleaseArtifactResult, WaitForIntentOptions, WaitForWorkflowConnectionOptions, type WorkflowConnectionClaimResource, type WorkflowConnectionRefScope, type WorkflowConnectionRequestResource, type WorkflowConnectionRequestState, type WorkloadPolicyResource, createReleaseIdempotencyKey, parseDelegatedReleaseSourceRecord };
//# sourceMappingURL=index.d.ts.map