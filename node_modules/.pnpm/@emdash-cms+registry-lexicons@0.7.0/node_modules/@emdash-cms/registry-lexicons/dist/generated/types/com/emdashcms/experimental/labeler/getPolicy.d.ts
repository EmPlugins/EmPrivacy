import { labelerPolicySchema } from "./defs.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/labeler/getPolicy.d.ts
declare namespace getPolicy_d_exports {
  export { $output, $params, mainSchema };
}
declare const _mainSchema: v.XRPCQueryMetadata<null, {
  type: "lex";
  readonly schema: labelerPolicySchema;
}, "com.emdashcms.experimental.labeler.getPolicy">;
type main$schematype = typeof _mainSchema;
interface mainSchema extends main$schematype {}
declare const mainSchema: mainSchema;
interface $params {}
type $output = v.InferXRPCBodyInput<mainSchema["output"]>;
declare module "@atcute/lexicons/ambient" {
  interface XRPCQueries {
    "com.emdashcms.experimental.labeler.getPolicy": mainSchema;
  }
}
//#endregion
export { $output, $params, mainSchema, getPolicy_d_exports as t };
//# sourceMappingURL=getPolicy.d.ts.map