import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/package/profileExtension.d.ts
declare namespace profileExtension_d_exports {
  export { Main, ReleasePolicy, mainSchema, releasePolicySchema };
}
declare const _mainSchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.package.profileExtension">, undefined>;
  readonly releasePolicy: v.OptionalSchema<releasePolicySchema, undefined>;
  /**
   * Canonical HTTPS source repository URL. Lexicon validates URI syntax and length; consumers must require HTTPS and canonicalization.
   * @maxLength 1024
   */
  repository: v.SchemaWithConstraint<v.FormattedStringSchema<"uri">, readonly [v.StringLengthConstraint<0, 1024>]>;
}>;
declare const _releasePolicySchema: v.ObjectSchema<{
  $type: v.OptionalSchema<v.LiteralSchema<"com.emdashcms.experimental.package.profileExtension#releasePolicy">, undefined>;
  /**
   * Atproto DIDs authorized to approve releases. Lexicon validates DID syntax and the 32-item cap; consumers must reject duplicate DIDs.
   * @maxLength 32
   */
  approvers: v.OptionalSchema<v.SchemaWithConstraint<v.ArraySchema<v.FormattedStringSchema<"did">>, readonly [v.ArrayLengthConstraint<0, 32>]>, undefined>;
  /**
   * When a release requires human confirmation. The generated TypeScript type exposes escalation-only and always; Lexicon runtime validators do not enforce knownValues, so consumers must reject other values.
   */
  confirmation: v.OptionalSchema<v.StringSchema<(string & {}) | "always" | "escalation-only">, undefined>;
  /**
   * Whether releases require a verifiable provenance reference.
   */
  requireProvenance: v.OptionalSchema<v.BooleanSchema, undefined>;
}>;
type main$schematype = typeof _mainSchema;
type releasePolicy$schematype = typeof _releasePolicySchema;
interface mainSchema extends main$schematype {}
interface releasePolicySchema extends releasePolicy$schematype {}
declare const mainSchema: mainSchema;
declare const releasePolicySchema: releasePolicySchema;
interface Main extends v.InferInput<typeof mainSchema> {}
interface ReleasePolicy extends v.InferInput<typeof releasePolicySchema> {}
//#endregion
export { Main, ReleasePolicy, mainSchema, releasePolicySchema, profileExtension_d_exports as t };
//# sourceMappingURL=profileExtension.d.ts.map