import { t as defs_d_exports } from "./generated/types/com/emdashcms/experimental/aggregator/defs.js";
import { t as getLatestRelease_d_exports } from "./generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js";
import { t as getPackage_d_exports } from "./generated/types/com/emdashcms/experimental/aggregator/getPackage.js";
import { t as listReleases_d_exports } from "./generated/types/com/emdashcms/experimental/aggregator/listReleases.js";
import { t as resolvePackage_d_exports } from "./generated/types/com/emdashcms/experimental/aggregator/resolvePackage.js";
import { t as searchPackages_d_exports } from "./generated/types/com/emdashcms/experimental/aggregator/searchPackages.js";
import { t as defs_d_exports$1 } from "./generated/types/com/emdashcms/experimental/labeler/defs.js";
import { t as getAssessment_d_exports } from "./generated/types/com/emdashcms/experimental/labeler/getAssessment.js";
import { t as getCurrentAssessment_d_exports } from "./generated/types/com/emdashcms/experimental/labeler/getCurrentAssessment.js";
import { t as getPolicy_d_exports } from "./generated/types/com/emdashcms/experimental/labeler/getPolicy.js";
import { t as listAssessments_d_exports } from "./generated/types/com/emdashcms/experimental/labeler/listAssessments.js";
import { Main, t as profile_d_exports } from "./generated/types/com/emdashcms/experimental/package/profile.js";
import { t as profileExtension_d_exports } from "./generated/types/com/emdashcms/experimental/package/profileExtension.js";
import { Main as Main$1, t as release_d_exports } from "./generated/types/com/emdashcms/experimental/package/release.js";
import { t as releaseExtension_d_exports } from "./generated/types/com/emdashcms/experimental/package/releaseExtension.js";
import { Main as Main$2, t as profile_d_exports$1 } from "./generated/types/com/emdashcms/experimental/publisher/profile.js";
import { Main as Main$3, t as verification_d_exports } from "./generated/types/com/emdashcms/experimental/publisher/verification.js";

//#region src/index.d.ts
/**
 * NSID constants for the lexicons defined by this package. Useful for consumers
 * that need to reference a record collection by string (e.g. when issuing
 * `listRecords` or `putRecord` calls against a PDS).
 */
declare const NSID: {
  readonly packageProfile: "com.emdashcms.experimental.package.profile";
  readonly packageProfileExtension: "com.emdashcms.experimental.package.profileExtension";
  readonly packageRelease: "com.emdashcms.experimental.package.release";
  readonly packageReleaseExtension: "com.emdashcms.experimental.package.releaseExtension";
  readonly publisherProfile: "com.emdashcms.experimental.publisher.profile";
  readonly publisherVerification: "com.emdashcms.experimental.publisher.verification";
  readonly aggregatorDefs: "com.emdashcms.experimental.aggregator.defs";
  readonly aggregatorGetLatestRelease: "com.emdashcms.experimental.aggregator.getLatestRelease";
  readonly aggregatorGetPackage: "com.emdashcms.experimental.aggregator.getPackage";
  readonly aggregatorListReleases: "com.emdashcms.experimental.aggregator.listReleases";
  readonly aggregatorResolvePackage: "com.emdashcms.experimental.aggregator.resolvePackage";
  readonly aggregatorSearchPackages: "com.emdashcms.experimental.aggregator.searchPackages";
  readonly labelerDefs: "com.emdashcms.experimental.labeler.defs";
  readonly labelerGetAssessment: "com.emdashcms.experimental.labeler.getAssessment";
  readonly labelerGetCurrentAssessment: "com.emdashcms.experimental.labeler.getCurrentAssessment";
  readonly labelerGetPolicy: "com.emdashcms.experimental.labeler.getPolicy";
  readonly labelerListAssessments: "com.emdashcms.experimental.labeler.listAssessments";
};
type NSIDValue = (typeof NSID)[keyof typeof NSID];
declare const REGISTRY_CUMULUS_ORIGIN = "https://cdn.em-da.sh";
declare const RECORD_SCOPED_BLOB_CACHE_TYPE: "com.emdashcms.experimental.aggregator.defs#recordScopedBlobCache";
declare const DELEGATED_RELEASE_PERMISSION: Readonly<{
  readonly collection: "com.emdashcms.experimental.package.release";
  readonly scope: "atproto repo:com.emdashcms.experimental.package.release?action=create blob:application/gzip blob:image/*";
}>;
/**
 * Return the exact collection and OAuth scope set used by delegated publishing.
 * A collection or blob-scope change requires every publisher to authorize a new grant.
 */
declare function getDelegatedReleasePermission(): typeof DELEGATED_RELEASE_PERMISSION;
/**
 * NSIDs of record-shaped lexicons in this package (one row per NSID in the
 * publisher's repo). Embedded objects (`profileExtension`, `releaseExtension`) and shared defs
 * (`aggregator.defs`) are excluded — they don't address their own collection.
 *
 * Useful for consumers building OAuth `repo:` scopes or enumerating writable
 * collections without hand-rolling a list that drifts from the lexicons.
 */
declare const RECORD_NSIDS: readonly ["com.emdashcms.experimental.package.profile", "com.emdashcms.experimental.package.release", "com.emdashcms.experimental.publisher.profile", "com.emdashcms.experimental.publisher.verification"];
/**
 * NSIDs of query-shaped lexicons in this package (read-only XRPC methods on
 * the aggregator). Procedures and shared defs are excluded.
 *
 * Useful for consumers building OAuth `rpc:` scopes or enumerating callable
 * AppView endpoints.
 */
declare const QUERY_NSIDS: readonly ["com.emdashcms.experimental.aggregator.getLatestRelease", "com.emdashcms.experimental.aggregator.getPackage", "com.emdashcms.experimental.aggregator.listReleases", "com.emdashcms.experimental.aggregator.resolvePackage", "com.emdashcms.experimental.aggregator.searchPackages", "com.emdashcms.experimental.labeler.getAssessment", "com.emdashcms.experimental.labeler.getCurrentAssessment", "com.emdashcms.experimental.labeler.getPolicy", "com.emdashcms.experimental.labeler.listAssessments"];
/**
 * Map from `record`-shaped NSIDs to the typed record body the publisher writes
 * to its PDS. Used by `PublishingClient.putRecord` (and any other typed-write
 * helper) to ensure callers pass a record matching the collection's lexicon.
 *
 * Embedded objects (`profileExtension`, `releaseExtension`, which live inside profile and release records'
 * `extensions` map) and query/procedure NSIDs (the `aggregator.*` ones) are
 * deliberately absent -- they aren't standalone repo collections.
 */
interface RegistryRecords {
  "com.emdashcms.experimental.package.profile": Main;
  "com.emdashcms.experimental.package.release": Main$1;
  "com.emdashcms.experimental.publisher.profile": Main$2;
  "com.emdashcms.experimental.publisher.verification": Main$3;
}
type RegistryRecordCollection = keyof RegistryRecords;
//#endregion
export { defs_d_exports as AggregatorDefs, getLatestRelease_d_exports as AggregatorGetLatestRelease, getPackage_d_exports as AggregatorGetPackage, listReleases_d_exports as AggregatorListReleases, resolvePackage_d_exports as AggregatorResolvePackage, searchPackages_d_exports as AggregatorSearchPackages, defs_d_exports$1 as LabelerDefs, getAssessment_d_exports as LabelerGetAssessment, getCurrentAssessment_d_exports as LabelerGetCurrentAssessment, getPolicy_d_exports as LabelerGetPolicy, listAssessments_d_exports as LabelerListAssessments, NSID, NSIDValue, profile_d_exports as PackageProfile, profileExtension_d_exports as PackageProfileExtension, release_d_exports as PackageRelease, releaseExtension_d_exports as PackageReleaseExtension, profile_d_exports$1 as PublisherProfile, verification_d_exports as PublisherVerification, QUERY_NSIDS, RECORD_NSIDS, RECORD_SCOPED_BLOB_CACHE_TYPE, REGISTRY_CUMULUS_ORIGIN, RegistryRecordCollection, RegistryRecords, getDelegatedReleasePermission };
//# sourceMappingURL=index.d.ts.map