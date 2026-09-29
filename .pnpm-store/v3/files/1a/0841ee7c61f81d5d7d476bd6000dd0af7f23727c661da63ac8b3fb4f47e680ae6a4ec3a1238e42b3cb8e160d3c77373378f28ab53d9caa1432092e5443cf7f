import * as v from "@atcute/lexicons/validations";
import * as ComAtprotoLabelDefs from "@atcute/atproto/types/label/defs";

//#region src/generated/types/com/emdashcms/experimental/aggregator/defs.d.ts
declare namespace defs_d_exports {
  export { PackageView, RecordScopedBlobCache, ReleaseView, packageViewSchema, recordScopedBlobCacheSchema, releaseViewSchema };
}
declare const _packageViewSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.aggregator.defs#packageView">, undefined>;
  /**
   * CID of the profile record content the aggregator indexed. Lets clients confirm they're working with the same bytes the aggregator did.
   */
  cid: v.FormattedStringSchema<"cid">;
  /**
   * Publisher DID. Denormalised convenience; equivalent to the DID portion of `uri`.
   */
  did: v.FormattedStringSchema<"did">;
  /**
   * Publisher's current handle, if known. Best-effort: handles are mutable and may be stale at the moment of read.
   */
  handle: v.OptionalSchema<v.FormattedStringSchema<"handle">, undefined>;
  /**
   * Number of package release versions retained in the aggregator's history, including releases the publisher later deleted.
   * @minimum 0
   */
  historicalReleaseCount: v.OptionalSchema<v.IntegerSchema, undefined>;
  /**
   * When the aggregator first indexed this package.
   */
  indexedAt: v.FormattedStringSchema<"datetime">;
  /**
   * Hydrated trusted label state attached by the aggregator's configured policy.
   * @maxLength 64
   */
  readonly labels: v.OptionalSchema<v.SchemaWithConstraint<v.ArraySchema<ComAtprotoLabelDefs.labelSchema>, readonly [v.ArrayLengthConstraint<0, 64>]>, undefined>;
  /**
   * Convenience: the highest semver version among non-tombstoned, non-yanked releases the aggregator has indexed for this package. Clients SHOULD verify this against their own selection from listReleases when the difference matters.
   * @maxLength 64
   */
  latestVersion: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 64>]>, undefined>;
  /**
   * The signed profile record verbatim, passed through from the publisher's repo (carrying its $type, all required fields, etc.).
   */
  profile: v.UnknownSchema;
  /**
   * Whether the aggregator continuously observed this package from its first live profile creation. When false or absent, clients must not infer that historicalReleaseCount represents the package's complete registry history.
   */
  releaseHistoryComplete: v.OptionalSchema<v.BooleanSchema, undefined>;
  /**
   * Package slug (the rkey of the profile record). Denormalised convenience.
   * @minLength 1
   * @maxLength 64
   */
  slug: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<1, 64>]>;
  /**
   * AT URI of the profile record the aggregator indexed. Pins exactly which record version this view describes.
   */
  uri: v.FormattedStringSchema<"at-uri">;
}>;
declare const _recordScopedBlobCacheSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.aggregator.defs#recordScopedBlobCache">, undefined>;
  /**
   * HTTPS origin of the record-scoped blob cache.
   * @maxLength 2048
   */
  serviceEndpoint: v.SchemaWithConstraint<v.FormattedStringSchema<"uri">, readonly [v.StringLengthConstraint<0, 2048>]>;
}>;
declare const _releaseViewSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.aggregator.defs#releaseView">, undefined>;
  /**
   * Blob cache services the aggregator advertises for this release. Clients ignore unrecognised service variants and derive artifact URLs only for public blob refs.
   * @maxLength 4
   */
  readonly artifactCaches: v.OptionalSchema<v.SchemaWithConstraint<v.ArraySchema<v.VariantSchema<readonly [recordScopedBlobCacheSchema], boolean>>, readonly [v.ArrayLengthConstraint<0, 4>]>, undefined>;
  /**
   * CID of the release record content the aggregator indexed.
   */
  cid: v.FormattedStringSchema<"cid">;
  /**
   * Publisher DID. Denormalised convenience; equivalent to the DID portion of `uri`.
   */
  did: v.FormattedStringSchema<"did">;
  /**
   * When the aggregator first indexed this release.
   */
  indexedAt: v.FormattedStringSchema<"datetime">;
  /**
   * Hydrated trusted label state attached by the aggregator's configured policy.
   * @maxLength 64
   */
  readonly labels: v.OptionalSchema<v.SchemaWithConstraint<v.ArraySchema<ComAtprotoLabelDefs.labelSchema>, readonly [v.ArrayLengthConstraint<0, 64>]>, undefined>;
  /**
   * Parent package slug. Denormalised convenience.
   * @minLength 1
   * @maxLength 64
   */
  package: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<1, 64>]>;
  /**
   * The signed release record verbatim from the publisher's repo (carrying its $type and all fields).
   */
  release: v.UnknownSchema;
  /**
   * AT URI of the release record the aggregator indexed. Pins exactly which record version this view describes.
   */
  uri: v.FormattedStringSchema<"at-uri">;
  /**
   * Release version, matching the post-':' portion of the rkey.
   * @minLength 1
   * @maxLength 64
   */
  version: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<1, 64>]>;
}>;
type packageView$schematype = typeof _packageViewSchema;
type recordScopedBlobCache$schematype = typeof _recordScopedBlobCacheSchema;
type releaseView$schematype = typeof _releaseViewSchema;
interface packageViewSchema extends packageView$schematype {}
interface recordScopedBlobCacheSchema extends recordScopedBlobCache$schematype {}
interface releaseViewSchema extends releaseView$schematype {}
declare const packageViewSchema: packageViewSchema;
declare const recordScopedBlobCacheSchema: recordScopedBlobCacheSchema;
declare const releaseViewSchema: releaseViewSchema;
interface PackageView extends v.InferInput<typeof packageViewSchema> {}
interface RecordScopedBlobCache extends v.InferInput<typeof recordScopedBlobCacheSchema> {}
interface ReleaseView extends v.InferInput<typeof releaseViewSchema> {}
//#endregion
export { PackageView, RecordScopedBlobCache, ReleaseView, packageViewSchema, recordScopedBlobCacheSchema, releaseViewSchema, defs_d_exports as t };
//# sourceMappingURL=defs.d.ts.map