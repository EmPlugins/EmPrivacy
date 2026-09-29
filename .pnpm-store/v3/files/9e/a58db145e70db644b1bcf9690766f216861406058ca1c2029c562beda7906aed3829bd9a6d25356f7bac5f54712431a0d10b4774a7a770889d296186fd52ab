import { currentAssessmentViewSchema } from "./defs.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/labeler/getCurrentAssessment.d.ts
declare namespace getCurrentAssessment_d_exports {
  export { $output, $params, mainSchema };
}
declare const _mainSchema: v.XRPCQueryMetadata<v.ObjectSchema<{
  cid: v.FormattedStringSchema<"cid">;
  kind: v.StringSchema<(string & {}) | "profile" | "release">;
  uri: v.FormattedStringSchema<"at-uri">;
}>, {
  type: "lex";
  readonly schema: currentAssessmentViewSchema;
}, "com.emdashcms.experimental.labeler.getCurrentAssessment">;
type main$schematype = typeof _mainSchema;
interface mainSchema extends main$schematype {}
declare const mainSchema: mainSchema;
interface $params extends v.InferInput<mainSchema["params"]> {}
type $output = v.InferXRPCBodyInput<mainSchema["output"]>;
declare module "@atcute/lexicons/ambient" {
  interface XRPCQueries {
    "com.emdashcms.experimental.labeler.getCurrentAssessment": mainSchema;
  }
}
//#endregion
export { $output, $params, mainSchema, getCurrentAssessment_d_exports as t };
//# sourceMappingURL=getCurrentAssessment.d.ts.map