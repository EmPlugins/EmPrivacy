import { ListingVisibilityState } from "@emdash-cms/registry-moderation";

//#region src/listing-policy.d.ts
interface RegistryLabelerPolicy {
  /** Official clients always require the aggregator's approved listing projection. */
  enforcement: "required";
  /** Optional bare-DID declaration used for requests and cache identity; aggregator policy remains authoritative. */
  acceptLabelers?: string;
}
interface ReleaseHistoryEvidence {
  historicalReleaseCount?: number;
  releaseHistoryComplete?: boolean;
}
/** Return true only when the aggregator proves one complete observed release history. */
declare function isProvenFirstRelease(evidence: ReleaseHistoryEvidence): boolean;
declare function registryLabelerPolicy(acceptLabelers?: string): RegistryLabelerPolicy;
declare function registryLabelerPolicyKey(policy: RegistryLabelerPolicy): string;
interface ApprovedListing<T> {
  status: Extract<ListingVisibilityState, "passed">;
  value: T;
}
interface UnavailableListing {
  status: Extract<ListingVisibilityState, "unavailable">;
  reason: "listing-unavailable";
}
type ListingStatusResult<T> = ApprovedListing<T> | UnavailableListing;
declare function mapListingStatus<T>(request: Promise<T>): Promise<ListingStatusResult<T>>;
//#endregion
export { ApprovedListing, ListingStatusResult, RegistryLabelerPolicy, ReleaseHistoryEvidence, UnavailableListing, isProvenFirstRelease, mapListingStatus, registryLabelerPolicy, registryLabelerPolicyKey };
//# sourceMappingURL=listing-policy.d.ts.map