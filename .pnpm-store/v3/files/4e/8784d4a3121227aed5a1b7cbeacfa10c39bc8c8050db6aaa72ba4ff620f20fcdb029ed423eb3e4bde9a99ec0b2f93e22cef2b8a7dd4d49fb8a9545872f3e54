import { t as __exportAll } from "../../../../../../chunk-BYypO7fO.js";
import * as v from "@atcute/lexicons/validations";

//#region src/generated/types/com/emdashcms/experimental/package/release.ts
var release_exports = /* @__PURE__ */ __exportAll({
	artifactSchema: () => artifactSchema,
	artifactsSchema: () => artifactsSchema,
	imageArtifactSchema: () => imageArtifactSchema,
	mainSchema: () => mainSchema,
	sbomSchema: () => sbomSchema
});
const _artifactSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.package.release#artifact")),
	blob: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.blob(), [/* @__PURE__ */ v.blobSize(262144), /* @__PURE__ */ v.blobAccept(["application/gzip"])])),
	checksum: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 256)]),
	contentType: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 256)])),
	height: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1, 8192)])),
	id: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 128)])),
	lang: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.languageCodeString()),
	releaseAsset: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.boolean()),
	requiresAuth: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.boolean()),
	signature: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 1024)])),
	url: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.genericUriString(), [/* @__PURE__ */ v.stringLength(0, 2048)])),
	width: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1, 8192)]))
});
const _artifactsSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.package.release#artifacts")),
	get banner() {
		return /* @__PURE__ */ v.optional(imageArtifactSchema);
	},
	get icon() {
		return /* @__PURE__ */ v.optional(imageArtifactSchema);
	},
	get package() {
		return artifactSchema;
	},
	get screenshots() {
		return /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.array(imageArtifactSchema), [/* @__PURE__ */ v.arrayLength(0, 8)]));
	}
});
const _imageArtifactSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.package.release#imageArtifact")),
	blob: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.blob(), [/* @__PURE__ */ v.blobSize(1048576), /* @__PURE__ */ v.blobAccept([
		"image/png",
		"image/jpeg",
		"image/webp"
	])])),
	checksum: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 256)]),
	contentType: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 256)])),
	height: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1, 8192)])),
	id: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 128)])),
	lang: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.languageCodeString()),
	releaseAsset: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.boolean()),
	requiresAuth: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.boolean()),
	signature: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 1024)])),
	url: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.genericUriString(), [/* @__PURE__ */ v.stringLength(0, 2048)])),
	width: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.integer(), [/* @__PURE__ */ v.integerRange(1, 8192)]))
});
const _mainSchema = /* @__PURE__ */ v.record(/* @__PURE__ */ v.string(), /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.literal("com.emdashcms.experimental.package.release"),
	get artifacts() {
		return artifactsSchema;
	},
	get auth() {
		return /* @__PURE__ */ v.optional(/* @__PURE__ */ v.variant([]));
	},
	extensions: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.unknown()),
	package: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)]),
	provides: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.unknown()),
	repo: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.genericUriString(), [/* @__PURE__ */ v.stringLength(0, 1024)])),
	requires: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.unknown()),
	get sbom() {
		return /* @__PURE__ */ v.optional(sbomSchema);
	},
	suggests: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.unknown()),
	version: /* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(1, 64)])
}));
const _sbomSchema = /* @__PURE__ */ v.object({
	$type: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.literal("com.emdashcms.experimental.package.release#sbom")),
	checksum: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 256)])),
	format: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.string(), [/* @__PURE__ */ v.stringLength(0, 32)])),
	url: /* @__PURE__ */ v.optional(/* @__PURE__ */ v.constrain(/* @__PURE__ */ v.genericUriString(), [/* @__PURE__ */ v.stringLength(0, 2048)]))
});
const artifactSchema = _artifactSchema;
const artifactsSchema = _artifactsSchema;
const imageArtifactSchema = _imageArtifactSchema;
const mainSchema = _mainSchema;
const sbomSchema = _sbomSchema;

//#endregion
export { artifactSchema, artifactsSchema, imageArtifactSchema, mainSchema, sbomSchema, release_exports as t };
//# sourceMappingURL=release.js.map