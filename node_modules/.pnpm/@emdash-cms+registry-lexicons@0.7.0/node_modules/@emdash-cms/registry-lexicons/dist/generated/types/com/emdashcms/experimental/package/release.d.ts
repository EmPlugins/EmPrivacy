import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/package/release.d.ts
declare namespace release_d_exports {
  export { Artifact, Artifacts, ImageArtifact, Main, Sbom, artifactSchema, artifactsSchema, imageArtifactSchema, mainSchema, sbomSchema };
}
declare const _artifactSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.package.release#artifact">, undefined>;
  /**
   * Artifact bytes stored as a blob in the publisher's PDS.
   * @accept application/gzip
   * @maxSize 262144
   */
  blob: v.OptionalSchema<v.SchemaWithConstraint<v.BlobSchema, readonly [v.BlobSizeConstraint<262144>, v.BlobAcceptConstraint]>, undefined>;
  /**
   * Lowercase base32 multibase-encoded sha2-256 multihash of the artifact bytes (multihash code 0x12). EmDash clients reject unsupported hash functions rather than skipping verification.
   * @maxLength 256
   */
  checksum: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 256>]>;
  /**
   * MIME type of the artifact, per RFC6838.
   * @maxLength 256
   */
  contentType: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 256>]>, undefined>;
  /**
   * Pixel height, for image artifacts.
   * @minimum 1
   * @maximum 8192
   */
  height: v.OptionalSchema<v.SchemaWithConstraint<v.IntegerSchema, readonly [v.IntegerRangeConstraint<1, 8192>]>, undefined>;
  /**
   * Unique ID within the artifact type.
   * @maxLength 128
   */
  id: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 128>]>, undefined>;
  /**
   * BCP 47 language tag for localised artifacts (icon, screenshot).
   */
  lang: v.OptionalSchema<v.FormattedStringSchema<"language">, undefined>;
  /**
   * Whether the URL points to a platform release asset rather than a directly-served file. When true, clients MUST send 'Accept: application/octet-stream' when downloading.
   */
  releaseAsset: v.OptionalSchema<v.BooleanSchema, undefined>;
  /**
   * Whether the artifact requires authentication to access.
   */
  requiresAuth: v.OptionalSchema<v.BooleanSchema, undefined>;
  /**
   * Optional cryptographic signature of the artifact. EmDash clients do not require it because integrity is proven through the atproto MST signature over the record's checksum.
   * @maxLength 1024
   */
  signature: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 1024>]>, undefined>;
  /**
   * URL where the artifact can be downloaded.
   * @maxLength 2048
   */
  url: v.OptionalSchema<v.SchemaWithConstraint<v.FormattedStringSchema<"uri">, readonly [v.StringLengthConstraint<0, 2048>]>, undefined>;
  /**
   * Pixel width, for image artifacts (icon, screenshot, banner).
   * @minimum 1
   * @maximum 8192
   */
  width: v.OptionalSchema<v.SchemaWithConstraint<v.IntegerSchema, readonly [v.IntegerRangeConstraint<1, 8192>]>, undefined>;
}>;
declare const _artifactsSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.package.release#artifacts">, undefined>;
  readonly banner: v.OptionalSchema<imageArtifactSchema, undefined>;
  readonly icon: v.OptionalSchema<imageArtifactSchema, undefined>;
  /**
   * The installable plugin bundle.
   */
  readonly package: artifactSchema;
  /**
   * Ordered screenshot gallery for the plugin's detail page.
   * @maxLength 8
   */
  readonly screenshots: v.OptionalSchema<v.SchemaWithConstraint<v.ArraySchema<imageArtifactSchema>, readonly [v.ArrayLengthConstraint<0, 8>]>, undefined>;
}>;
declare const _imageArtifactSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.package.release#imageArtifact">, undefined>;
  /**
   * Image bytes stored as a blob in the publisher's PDS.
   * @accept image/png, image/jpeg, image/webp
   * @maxSize 1048576
   */
  blob: v.OptionalSchema<v.SchemaWithConstraint<v.BlobSchema, readonly [v.BlobSizeConstraint<1048576>, v.BlobAcceptConstraint]>, undefined>;
  /**
   * Lowercase base32 multibase-encoded sha2-256 multihash of the artifact bytes (multihash code 0x12). EmDash clients reject unsupported hash functions rather than skipping verification.
   * @maxLength 256
   */
  checksum: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 256>]>;
  /**
   * MIME type of the artifact, per RFC6838.
   * @maxLength 256
   */
  contentType: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 256>]>, undefined>;
  /**
   * Pixel height.
   * @minimum 1
   * @maximum 8192
   */
  height: v.OptionalSchema<v.SchemaWithConstraint<v.IntegerSchema, readonly [v.IntegerRangeConstraint<1, 8192>]>, undefined>;
  /**
   * Unique ID within the artifact type.
   * @maxLength 128
   */
  id: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 128>]>, undefined>;
  /**
   * BCP 47 language tag for a localised artifact.
   */
  lang: v.OptionalSchema<v.FormattedStringSchema<"language">, undefined>;
  /**
   * Whether the URL points to a platform release asset rather than a directly-served file. When true, clients MUST send 'Accept: application/octet-stream' when downloading.
   */
  releaseAsset: v.OptionalSchema<v.BooleanSchema, undefined>;
  /**
   * Whether the artifact requires authentication to access.
   */
  requiresAuth: v.OptionalSchema<v.BooleanSchema, undefined>;
  /**
   * Optional cryptographic signature of the artifact. EmDash clients do not require it because integrity is proven through the atproto MST signature over the record's checksum.
   * @maxLength 1024
   */
  signature: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 1024>]>, undefined>;
  /**
   * URL where the artifact can be downloaded.
   * @maxLength 2048
   */
  url: v.OptionalSchema<v.SchemaWithConstraint<v.FormattedStringSchema<"uri">, readonly [v.StringLengthConstraint<0, 2048>]>, undefined>;
  /**
   * Pixel width.
   * @minimum 1
   * @maximum 8192
   */
  width: v.OptionalSchema<v.SchemaWithConstraint<v.IntegerSchema, readonly [v.IntegerRangeConstraint<1, 8192>]>, undefined>;
}>;
declare const _mainSchema: v.RecordSchema<v.ObjectSchema<{
  $type: v.LiteralSchema<"com.emdashcms.experimental.package.release">;
  /**
   * Map of artifact type to artifact object. MUST have at least one entry. The 'package' entry (installable bundle) is required.
   */
  readonly artifacts: artifactsSchema;
  /**
   * Authentication requirements for gated artifacts. No authentication variants are currently defined.
   */
  readonly auth: v.OptionalSchema<v.VariantSchema<readonly [], boolean>, undefined>;
  /**
   * Open-union container for extension data, keyed by NSID. Each value is an embedded record carrying its own $type discriminator. Releases of type emdash-plugin MUST include a com.emdashcms.experimental.package.releaseExtension entry here.
   */
  extensions: v.OptionalSchema<v.UnknownSchema, undefined>;
  /**
   * Slug of the parent package profile in the same repository. MUST match the rkey of an existing package profile record. Combined with the publisher DID, the parent profile's AT URI is at://<publisher-did>/com.emdashcms.experimental.package.profile/<package>. Aggregators MUST reject release records whose package field does not resolve to a profile in the same repository.
   * @minLength 1
   * @maxLength 64
   */
  package: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<1, 64>]>;
  /**
   * Capabilities the package provides. Map of capability type to string or list of strings.
   */
  provides: v.OptionalSchema<v.UnknownSchema, undefined>;
  /**
   * AT URI or HTTPS URL of the source repository for this release.
   * @maxLength 1024
   */
  repo: v.OptionalSchema<v.SchemaWithConstraint<v.FormattedStringSchema<"uri">, readonly [v.StringLengthConstraint<0, 1024>]>, undefined>;
  /**
   * Dependencies. Map of 'env:*' keys (extension-defined environment requirements) or package DIDs to version constraint strings. EmDash uses 'env:emdash' and 'env:astro'.
   */
  requires: v.OptionalSchema<v.UnknownSchema, undefined>;
  /**
   * Software bill of materials reference.
   */
  readonly sbom: v.OptionalSchema<sbomSchema, undefined>;
  /**
   * Optional packages that may be installed alongside. Same shape as requires.
   */
  suggests: v.OptionalSchema<v.UnknownSchema, undefined>;
  /**
   * Version, conforming to a subset of semver 2.0 (build metadata '+...' is disallowed because atproto record keys cannot represent it). MUST equal the post-':' portion of the rkey byte-for-byte. Composed only of characters allowed in atproto record keys: ASCII letters, digits, '.', and '-'. Note that while atproto rkeys also permit '_' and '~', semver disallows them in version strings, so they MUST NOT appear here.
   * @minLength 1
   * @maxLength 64
   */
  version: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<1, 64>]>;
}>, v.StringSchema<string>>;
declare const _sbomSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.package.release#sbom">, undefined>;
  /**
   * Multibase-encoded multihash of the SBOM document, in the same format as artifact checksums.
   * @maxLength 256
   */
  checksum: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 256>]>, undefined>;
  /**
   * SBOM format identifier.
   * @maxLength 32
   */
  format: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<(string & {}) | "cyclonedx" | "spdx">, readonly [v.StringLengthConstraint<0, 32>]>, undefined>;
  /**
   * URL where the SBOM document can be fetched.
   * @maxLength 2048
   */
  url: v.OptionalSchema<v.SchemaWithConstraint<v.FormattedStringSchema<"uri">, readonly [v.StringLengthConstraint<0, 2048>]>, undefined>;
}>;
type artifact$schematype = typeof _artifactSchema;
type artifacts$schematype = typeof _artifactsSchema;
type imageArtifact$schematype = typeof _imageArtifactSchema;
type main$schematype = typeof _mainSchema;
type sbom$schematype = typeof _sbomSchema;
interface artifactSchema extends artifact$schematype {}
interface artifactsSchema extends artifacts$schematype {}
interface imageArtifactSchema extends imageArtifact$schematype {}
interface mainSchema extends main$schematype {}
interface sbomSchema extends sbom$schematype {}
declare const artifactSchema: artifactSchema;
declare const artifactsSchema: artifactsSchema;
declare const imageArtifactSchema: imageArtifactSchema;
declare const mainSchema: mainSchema;
declare const sbomSchema: sbomSchema;
interface Artifact extends v.InferInput<typeof artifactSchema> {}
interface Artifacts extends v.InferInput<typeof artifactsSchema> {}
interface ImageArtifact extends v.InferInput<typeof imageArtifactSchema> {}
interface Main extends v.InferInput<typeof mainSchema> {}
interface Sbom extends v.InferInput<typeof sbomSchema> {}
declare module "@atcute/lexicons/ambient" {
  interface Records {
    "com.emdashcms.experimental.package.release": mainSchema;
  }
}
//#endregion
export { Artifact, Artifacts, ImageArtifact, Main, Sbom, artifactSchema, artifactsSchema, imageArtifactSchema, mainSchema, sbomSchema, release_d_exports as t };
//# sourceMappingURL=release.d.ts.map