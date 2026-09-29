import { AtprotoDid, Did } from "@atcute/lexicons/syntax";
import { PackageProfile, PackageRelease } from "@emdash-cms/registry-lexicons";
import { DidDocument } from "@atcute/identity";

//#region src/direct-pds/index.d.ts
declare const DEFAULT_DIRECT_PDS_REQUEST_TIMEOUT_MS = 10000;
declare const DEFAULT_DIRECT_PDS_MAX_RESPONSE_BYTES: number;
type DirectPdsReadErrorCode = "DID_DOCUMENT_INVALID" | "DID_RESOLUTION_FAILED" | "DID_SIGNING_KEY_INVALID" | "DID_SIGNING_KEY_MISSING" | "PDS_ENDPOINT_INVALID" | "PDS_ENDPOINT_MISSING" | "PDS_REQUEST_ABORTED" | "PDS_REQUEST_FAILED" | "PDS_REQUEST_TIMEOUT" | "PDS_RESPONSE_TYPE_INVALID" | "PDS_RESPONSE_TOO_LARGE" | "PROFILE_LEXICON_INVALID" | "RECORD_NOT_FOUND" | "RECORD_PROOF_INVALID" | "REPOSITORY_NOT_FOUND" | "RELEASE_LEXICON_INVALID";
declare class DirectPdsReadError extends Error {
  readonly code: DirectPdsReadErrorCode;
  readonly status?: number;
  constructor(code: DirectPdsReadErrorCode, message: string, status?: number);
}
interface DirectPdsDidDocumentResolver {
  resolve(did: Did): Promise<DidDocument>;
}
interface DirectPdsClientOptions {
  did: string;
  /** Must enforce the caller's outbound URL and redirect policy. */
  fetch: typeof fetch;
  didDocumentResolver?: DirectPdsDidDocumentResolver;
  requestTimeoutMs?: number;
  maxResponseBytes?: number;
  signal?: AbortSignal;
}
interface DirectPdsProfileRecord {
  uri: string;
  cid: string;
  rkey: string;
  value: PackageProfile.Main;
}
interface DirectPdsReleaseRecord {
  uri: string;
  cid: string;
  rkey: string;
  value: PackageRelease.Main;
}
interface DirectPdsPackageRepository {
  profile: DirectPdsProfileRecord;
  releases: readonly DirectPdsReleaseRecord[];
}
declare class DirectPdsClient {
  #private;
  readonly did: AtprotoDid;
  constructor(options: DirectPdsClientOptions);
  getPackageProfile(packageSlug: string): Promise<DirectPdsProfileRecord>;
  getPackageRelease(packageSlug: string, version: string): Promise<DirectPdsReleaseRecord>;
  getPackageRepository(packageSlug: string): Promise<DirectPdsPackageRepository>;
}
//#endregion
export { DEFAULT_DIRECT_PDS_MAX_RESPONSE_BYTES, DEFAULT_DIRECT_PDS_REQUEST_TIMEOUT_MS, DirectPdsClient, DirectPdsClientOptions, DirectPdsDidDocumentResolver, DirectPdsPackageRepository, DirectPdsProfileRecord, DirectPdsReadError, DirectPdsReadErrorCode, DirectPdsReleaseRecord };
//# sourceMappingURL=index.d.ts.map