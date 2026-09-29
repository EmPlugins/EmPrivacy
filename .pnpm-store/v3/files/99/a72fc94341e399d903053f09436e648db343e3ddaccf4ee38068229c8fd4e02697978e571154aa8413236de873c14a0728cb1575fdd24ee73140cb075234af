import { t as defs_exports } from "./generated/types/com/emdashcms/experimental/aggregator/defs.js";
import { t as getLatestRelease_exports } from "./generated/types/com/emdashcms/experimental/aggregator/getLatestRelease.js";
import { t as getPackage_exports } from "./generated/types/com/emdashcms/experimental/aggregator/getPackage.js";
import { t as listReleases_exports } from "./generated/types/com/emdashcms/experimental/aggregator/listReleases.js";
import { t as resolvePackage_exports } from "./generated/types/com/emdashcms/experimental/aggregator/resolvePackage.js";
import { t as searchPackages_exports } from "./generated/types/com/emdashcms/experimental/aggregator/searchPackages.js";
import { t as defs_exports$1 } from "./generated/types/com/emdashcms/experimental/labeler/defs.js";
import { t as getAssessment_exports } from "./generated/types/com/emdashcms/experimental/labeler/getAssessment.js";
import { t as getCurrentAssessment_exports } from "./generated/types/com/emdashcms/experimental/labeler/getCurrentAssessment.js";
import { t as getPolicy_exports } from "./generated/types/com/emdashcms/experimental/labeler/getPolicy.js";
import { t as listAssessments_exports } from "./generated/types/com/emdashcms/experimental/labeler/listAssessments.js";
import { t as profile_exports } from "./generated/types/com/emdashcms/experimental/package/profile.js";
import { t as profileExtension_exports } from "./generated/types/com/emdashcms/experimental/package/profileExtension.js";
import { t as release_exports } from "./generated/types/com/emdashcms/experimental/package/release.js";
import { t as releaseExtension_exports } from "./generated/types/com/emdashcms/experimental/package/releaseExtension.js";
import { t as profile_exports$1 } from "./generated/types/com/emdashcms/experimental/publisher/profile.js";
import { t as verification_exports } from "./generated/types/com/emdashcms/experimental/publisher/verification.js";

//#region src/index.ts
/**
* NSID constants for the lexicons defined by this package. Useful for consumers
* that need to reference a record collection by string (e.g. when issuing
* `listRecords` or `putRecord` calls against a PDS).
*/
const NSID = {
	packageProfile: "com.emdashcms.experimental.package.profile",
	packageProfileExtension: "com.emdashcms.experimental.package.profileExtension",
	packageRelease: "com.emdashcms.experimental.package.release",
	packageReleaseExtension: "com.emdashcms.experimental.package.releaseExtension",
	publisherProfile: "com.emdashcms.experimental.publisher.profile",
	publisherVerification: "com.emdashcms.experimental.publisher.verification",
	aggregatorDefs: "com.emdashcms.experimental.aggregator.defs",
	aggregatorGetLatestRelease: "com.emdashcms.experimental.aggregator.getLatestRelease",
	aggregatorGetPackage: "com.emdashcms.experimental.aggregator.getPackage",
	aggregatorListReleases: "com.emdashcms.experimental.aggregator.listReleases",
	aggregatorResolvePackage: "com.emdashcms.experimental.aggregator.resolvePackage",
	aggregatorSearchPackages: "com.emdashcms.experimental.aggregator.searchPackages",
	labelerDefs: "com.emdashcms.experimental.labeler.defs",
	labelerGetAssessment: "com.emdashcms.experimental.labeler.getAssessment",
	labelerGetCurrentAssessment: "com.emdashcms.experimental.labeler.getCurrentAssessment",
	labelerGetPolicy: "com.emdashcms.experimental.labeler.getPolicy",
	labelerListAssessments: "com.emdashcms.experimental.labeler.listAssessments"
};
const REGISTRY_CUMULUS_ORIGIN = "https://cdn.em-da.sh";
const RECORD_SCOPED_BLOB_CACHE_TYPE = `${NSID.aggregatorDefs}#recordScopedBlobCache`;
const DELEGATED_RELEASE_PERMISSION = Object.freeze({
	collection: NSID.packageRelease,
	scope: `atproto repo:${NSID.packageRelease}?action=create blob:application/gzip blob:image/*`
});
/**
* Return the exact collection and OAuth scope set used by delegated publishing.
* A collection or blob-scope change requires every publisher to authorize a new grant.
*/
function getDelegatedReleasePermission() {
	return DELEGATED_RELEASE_PERMISSION;
}
/**
* NSIDs of record-shaped lexicons in this package (one row per NSID in the
* publisher's repo). Embedded objects (`profileExtension`, `releaseExtension`) and shared defs
* (`aggregator.defs`) are excluded — they don't address their own collection.
*
* Useful for consumers building OAuth `repo:` scopes or enumerating writable
* collections without hand-rolling a list that drifts from the lexicons.
*/
const RECORD_NSIDS = [
	NSID.packageProfile,
	NSID.packageRelease,
	NSID.publisherProfile,
	NSID.publisherVerification
];
/**
* NSIDs of query-shaped lexicons in this package (read-only XRPC methods on
* the aggregator). Procedures and shared defs are excluded.
*
* Useful for consumers building OAuth `rpc:` scopes or enumerating callable
* AppView endpoints.
*/
const QUERY_NSIDS = [
	NSID.aggregatorGetLatestRelease,
	NSID.aggregatorGetPackage,
	NSID.aggregatorListReleases,
	NSID.aggregatorResolvePackage,
	NSID.aggregatorSearchPackages,
	NSID.labelerGetAssessment,
	NSID.labelerGetCurrentAssessment,
	NSID.labelerGetPolicy,
	NSID.labelerListAssessments
];

//#endregion
export { defs_exports as AggregatorDefs, getLatestRelease_exports as AggregatorGetLatestRelease, getPackage_exports as AggregatorGetPackage, listReleases_exports as AggregatorListReleases, resolvePackage_exports as AggregatorResolvePackage, searchPackages_exports as AggregatorSearchPackages, defs_exports$1 as LabelerDefs, getAssessment_exports as LabelerGetAssessment, getCurrentAssessment_exports as LabelerGetCurrentAssessment, getPolicy_exports as LabelerGetPolicy, listAssessments_exports as LabelerListAssessments, NSID, profile_exports as PackageProfile, profileExtension_exports as PackageProfileExtension, release_exports as PackageRelease, releaseExtension_exports as PackageReleaseExtension, profile_exports$1 as PublisherProfile, verification_exports as PublisherVerification, QUERY_NSIDS, RECORD_NSIDS, RECORD_SCOPED_BLOB_CACHE_TYPE, REGISTRY_CUMULUS_ORIGIN, getDelegatedReleasePermission };
//# sourceMappingURL=index.js.map