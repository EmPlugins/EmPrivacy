import { publicAssessmentSchema } from "./defs.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/labeler/getAssessment.d.ts
declare namespace getAssessment_d_exports {
  export { $output, $params, mainSchema };
}
declare const _mainSchema: v.XRPCQueryMetadata<v.ObjectSchema<{
  /**
   * @minLength 1
   * @maxLength 100
   */
  id: v.SchemaWithConstraint<v.StringSchema<string>, readonly [v.StringLengthConstraint<1, 100>]>;
}>, {
  type: "lex";
  readonly schema: publicAssessmentSchema;
}, "com.emdashcms.experimental.labeler.getAssessment">;
type main$schematype = typeof _mainSchema;
interface mainSchema extends main$schematype {}
declare const mainSchema: mainSchema;
interface $params extends v.InferInput<mainSchema["params"]> {}
type $output = v.InferXRPCBodyInput<mainSchema["output"]>;
declare module "@atcute/lexicons/ambient" {
  interface XRPCQueries {
    "com.emdashcms.experimental.labeler.getAssessment": mainSchema;
  }
}
//#endregion
export { $output, $params, mainSchema, getAssessment_d_exports as t };
//# sourceMappingURL=getAssessment.d.ts.map