import { publicAssessmentSchema } from "./defs.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/labeler/listAssessments.d.ts
declare namespace listAssessments_d_exports {
  export { $output, $params, mainSchema };
}
declare const _mainSchema: v.XRPCQueryMetadata<v.ObjectSchema<{
  cid: v.OptionalSchema<v.FormattedStringSchema<"cid">, undefined>;
  /**
   * @maxLength 1024
   */
  cursor: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 1024>]>, undefined>;
  kind: v.OptionalSchema<v.StringSchema<(string & {}) | "profile" | "release">, undefined>;
  /**
   * @minimum 1
   * @maximum 100
   * @default 50
   */
  limit: v.OptionalSchema<v.SchemaWithConstraint<v.IntegerSchema, readonly [v.IntegerRangeConstraint<1, 100>]>, 50>;
  state: v.OptionalSchema<v.StringSchema<(string & {}) | "blocked" | "error" | "passed" | "pending" | "review" | "superseded">, undefined>;
  uri: v.OptionalSchema<v.FormattedStringSchema<"at-uri">, undefined>;
}>, {
  type: "lex";
  schema: v.ObjectSchema<{
    /**
     * @maxLength 100
     */
    readonly assessments: v.SchemaWithConstraint<v.ArraySchema<publicAssessmentSchema>, readonly [v.ArrayLengthConstraint<0, 100>]>;
    /**
     * @maxLength 1024
     */
    cursor: v.OptionalSchema<v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<0, 1024>]>, undefined>;
  }>;
}, "com.emdashcms.experimental.labeler.listAssessments">;
type main$schematype = typeof _mainSchema;
interface mainSchema extends main$schematype {}
declare const mainSchema: mainSchema;
interface $params extends v.InferInput<mainSchema["params"]> {}
interface $output extends v.InferXRPCBodyInput<mainSchema["output"]> {}
declare module "@atcute/lexicons/ambient" {
  interface XRPCQueries {
    "com.emdashcms.experimental.labeler.listAssessments": mainSchema;
  }
}
//#endregion
export { $output, $params, mainSchema, listAssessments_d_exports as t };
//# sourceMappingURL=listAssessments.d.ts.map