import { ApprovedListing, ListingStatusResult, RegistryLabelerPolicy, UnavailableListing, registryLabelerPolicy, registryLabelerPolicyKey } from "../listing-policy.js";
import { AggregatorGetLatestRelease, AggregatorGetPackage, AggregatorListReleases, AggregatorResolvePackage, AggregatorSearchPackages, PackageProfile, PackageRelease } from "@emdash-cms/registry-lexicons";

//#region src/discovery/index.d.ts
/**
 * A package view whose embedded signed `profile` record has been validated
 * against the `com.emdashcms.experimental.package.profile` lexicon.
 *
 * `profile` is `null` when the aggregator returned a record that does not
 * conform to the lexicon (missing required fields, wrong types, …). The
 * aggregator is an untrusted remote index; callers must handle `null`
 * rather than assuming a profile is always present.
 */
type ValidatedPackageView = Omit<AggregatorGetPackage.$output, "profile"> & {
  profile: PackageProfile.Main | null;
};
/**
 * A release view whose embedded signed `release` record has been validated
 * against the `com.emdashcms.experimental.package.release` lexicon. `release`
 * is `null` when the record does not conform.
 */
type ValidatedReleaseView = Omit<AggregatorGetLatestRelease.$output, "artifactCaches" | "release"> & {
  artifactCaches: NonNullable<AggregatorGetLatestRelease.$output["artifactCaches"]>;
  release: PackageRelease.Main | null;
};
type ValidatedSearchPackages = Omit<AggregatorSearchPackages.$output, "packages"> & {
  packages: ValidatedPackageView[];
};
type ValidatedListReleases = Omit<AggregatorListReleases.$output, "releases"> & {
  releases: ValidatedReleaseView[];
};
/**
 * Options for constructing a `DiscoveryClient`.
 */
interface DiscoveryClientOptions {
  /**
   * Aggregator base URL. Must be the origin where the aggregator's XRPC
   * endpoints are mounted (i.e. `${aggregatorUrl}/xrpc/<nsid>` resolves to a
   * valid endpoint).
   *
   * During the experimental phase this is `experimental-registry.emdashcms.com`
   * (exact host TBD); see the implementation plan for the cutover schedule.
   */
  aggregatorUrl: string;
  /**
   * Optional comma-separated list of bare labeller DIDs to forward as the
   * `atproto-accept-labelers` request header. The aggregator validates this
   * declaration and rejects unknown sources or a list that omits a required
   * source.
   *
   * Defaults to no header, which means the aggregator applies its configured
   * policy. The value contributes to the client's stable cache identity;
   * it does not select label effects or override the aggregator's approval,
   * block, takedown, or withdrawal policy.
   */
  acceptLabelers?: string;
  /**
   * Explicit listing policy for official consumers. This is deliberately not
   * an on/off switch: public discovery is always the aggregator's approved
   * projection. The policy records which accepted-labeler header produced the
   * response and supplies a stable cache-key input to browser consumers.
   */
  labelerPolicy?: RegistryLabelerPolicy;
  /**
   * Optional custom `fetch` implementation. Defaults to globalThis.fetch.
   * Useful for testing (mock fetch) or for environments where you need to
   * route through a specific transport.
   */
  fetch?: typeof fetch;
}
/**
 * Read-only client over an EmDash plugin registry aggregator.
 *
 * Wraps `@atcute/client` with the aggregator URL pre-bound and the
 * `atproto-accept-labelers` header threaded through every request. Method
 * names mirror the aggregator's XRPC method names (without the NSID prefix).
 *
 * Two layers of validation run at this boundary (the aggregator is an
 * untrusted remote index):
 *
 *   - The **response envelope** (`uri`, `did`, `slug`, `labels`, …) is
 *     validated by `@atcute/client` against the aggregator method's output
 *     lexicon. A non-conforming envelope throws `ClientValidationError`.
 *   - The **embedded signed `profile` / `release` records** — which the
 *     aggregator relays verbatim and types as `unknown` — are validated
 *     against the package lexicons here; a non-conforming record is
 *     surfaced as `null` (callers must null-check) rather than failing the
 *     whole call, so one bad record doesn't blank a search page.
 *
 * @example
 * ```ts
 * const discovery = new DiscoveryClient({
 *   aggregatorUrl: "https://registry.emdashcms.com",
 * });
 * const result = await discovery.searchPackages({ q: "gallery", limit: 10 });
 * for (const pkg of result.packages) {
 *   console.log(pkg.uri, pkg.profile?.name ?? pkg.slug);
 * }
 * ```
 */
declare class DiscoveryClient {
  #private;
  readonly aggregatorUrl: string;
  readonly acceptLabelers: string | undefined;
  readonly labelerPolicy: RegistryLabelerPolicy;
  constructor(options: DiscoveryClientOptions);
  /**
   * Search packages by free-text query and optional filters. Hard-takedown
   * results are filtered server-side; remaining results have label state
   * hydrated.
   *
   * Throws `ClientResponseError` (from `@atcute/client`) on a non-2xx
   * response (carrying `.error`, `.description`, `.status`, `.headers`), or
   * `ClientValidationError` if the aggregator returns a response whose
   * envelope does not match the method's output lexicon.
   */
  searchPackages(params: AggregatorSearchPackages.$params): Promise<ValidatedSearchPackages>;
  /**
   * Fetch a single package's full hydrated view by its AT URI.
   */
  getPackage(params: AggregatorGetPackage.$params): Promise<ValidatedPackageView>;
  /** Fetch a package while mapping the safe ListingUnavailable XRPC error. */
  getPackageStatus(params: AggregatorGetPackage.$params): Promise<ListingStatusResult<ValidatedPackageView>>;
  /**
   * Resolve a package by publisher handle + slug (or DID + slug). Cheaper
   * than `getPackage` when you only have human-readable identifiers.
   */
  resolvePackage(params: AggregatorResolvePackage.$params): Promise<ValidatedPackageView>;
  /** Resolve a package while discarding all remote error text for unavailable listings. */
  resolvePackageStatus(params: AggregatorResolvePackage.$params): Promise<ListingStatusResult<ValidatedPackageView>>;
  /**
   * List releases for a package, paginated and ordered by descending
   * semver version (newest version first), not by time. Yanked releases
   * are interleaved by version. Use `getLatestRelease` for the
   * convention "give me the highest non-yanked version".
   */
  listReleases(params: AggregatorListReleases.$params): Promise<ValidatedListReleases>;
  /**
   * Fetch the package's latest non-yanked release. Convenience wrapper around
   * `listReleases` that the aggregator can implement more efficiently than
   * client-side max-version selection (the version constraint engine lives
   * on the aggregator).
   */
  getLatestRelease(params: AggregatorGetLatestRelease.$params): Promise<ValidatedReleaseView>;
}
//#endregion
export { type ApprovedListing, DiscoveryClient, DiscoveryClientOptions, type ListingStatusResult, type RegistryLabelerPolicy, type UnavailableListing, ValidatedListReleases, ValidatedPackageView, ValidatedReleaseView, ValidatedSearchPackages, registryLabelerPolicy, registryLabelerPolicyKey };
//# sourceMappingURL=index.d.ts.map