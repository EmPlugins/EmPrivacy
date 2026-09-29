//#region src/media/image-endpoint.d.ts
/**
 * Portable helpers shared by the platform image-endpoint modules.
 *
 * EmDash wraps Astro's image endpoint (`image.endpoint`) so that source bytes
 * for EmDash media are read straight from the storage adapter instead of being
 * fetched over HTTP. The platform endpoint modules (Node: sharp via
 * `astro:assets`; Cloudflare: the `IMAGES` binding) do the actual transform;
 * this module holds the platform-agnostic bits they share: recognizing an
 * EmDash media URL and validating transform query params.
 *
 * Kept free of `astro:*` / `virtual:emdash/*` imports so it stays in the
 * precompiled package and can be unit-tested directly.
 */
/** Output formats the wrapped endpoint can produce on Cloudflare. */
declare const ALLOWED_TRANSFORM_FORMATS: readonly ["webp", "avif", "jpeg", "png"];
/** Default output format -- broad support, strong compression. */
declare const DEFAULT_TRANSFORM_FORMAT: ImageTransformFormat;
/**
 * Default output quality for lossy formats (WebP/AVIF/JPEG) when the request
 * doesn't specify one. Matches the default Cloudflare applies to URL-based
 * image transformations. The Images *binding* applies no default of its own
 * and encodes near-losslessly when quality is omitted (a 2048px WebP comes
 * out ~900 KB instead of ~100 KB), so the endpoint sends an explicit quality
 * for lossy output. PNG is exempt: an explicit PNG quality switches the
 * binding to lossy PNG8, which is not a safe default for a lossless format.
 */
declare const DEFAULT_TRANSFORM_QUALITY = 85;
/** Upper bound for a requested dimension; caps the work a single request asks for. */
declare const MAX_TRANSFORM_DIMENSION = 4000;
/** A format string accepted by {@link ImageTransformOptions.format}. */
type ImageTransformFormat = (typeof ALLOWED_TRANSFORM_FORMATS)[number];
/** Validated options for a single transform. */
interface ImageTransformOptions {
  width?: number;
  height?: number;
  format: ImageTransformFormat;
  /**
   * Explicitly-requested quality (1-100), or `undefined` when the request
   * carried no `q`. Callers apply their own default per format (see
   * {@link DEFAULT_TRANSFORM_QUALITY}); lossless PNG deliberately gets none.
   */
  quality?: number;
}
/** Long-lived cache for content-addressed image URLs. */
declare const IMMUTABLE_IMAGE_CACHE = "public, max-age=31536000, immutable";
/** Cache policy for media keys that Replace original may overwrite. */
declare const MUTABLE_MEDIA_CACHE_CONTROL = "public, max-age=0, must-revalidate";
/**
 * Headers for streaming **original** stored bytes (the no-transform fallback).
 * Carries the same stored-XSS protections as the media file route: a sandbox
 * CSP, `nosniff`, and `Content-Disposition: attachment` for anything not on the
 * inline raster allowlist (so a stored SVG can't run scripts in the site
 * origin). Transformed output is always generated raster and doesn't need this.
 */
declare function originalMediaHeaders(contentType: string): Record<string, string>;
/** Whether a storage key is safe to resolve against the storage backend. */
declare function isSafeTransformKey(key: string): boolean;
/**
 * If `href` points at the internal EmDash media route
 * (`/_emdash/api/media/file/{key}`) with a safe key, return the key; otherwise
 * `null` (the endpoint then delegates to the stock image endpoint for bundled
 * assets, allowed remote, and `publicUrl` media).
 *
 * The component absolutizes same-origin media (Astro only optimizes absolute,
 * remote-allowed URLs), so `href` is typically `https://site/_emdash/...` but
 * may be relative. We match on the **pathname** only and never fetch `href` —
 * the key is read from our own storage — so the host is irrelevant and can't be
 * an SSRF vector. A dummy base resolves both absolute and relative forms and
 * strips any query/fragment.
 */
declare function matchInternalMediaKey(href: string | null | undefined): string | null;
/** Type guard for {@link ImageTransformFormat}. */
declare function isTransformFormat(value: string): value is ImageTransformFormat;
/** Outcome of parsing transform query params: validated options or an error. */
type ParsedTransformParams = {
  ok: true;
  options: ImageTransformOptions;
} | {
  ok: false;
  message: string;
};
/**
 * Resolve the quality to send to the image binding for a transform. An
 * explicitly-requested quality always wins. Otherwise lossy formats
 * (WebP/AVIF/JPEG) get {@link DEFAULT_TRANSFORM_QUALITY} because the Images
 * binding encodes near-losslessly when quality is omitted; lossless PNG gets
 * `undefined` because an explicit PNG quality switches the binding to lossy
 * PNG8, which is not a safe default for a lossless format.
 */
declare function resolveTransformQuality(format: ImageTransformFormat, requested: number | undefined): number | undefined;
/**
 * Parse and validate `?w=&h=&f=&q=` query params. Width is required (it sizes
 * the rendition); dimensions are bounded so a request can't ask for an
 * unbounded or nonsensical transform. Format falls back to
 * {@link DEFAULT_TRANSFORM_FORMAT} when not requested. `q` is validated when
 * present but otherwise left `undefined` so the caller can apply a per-format
 * default (lossy formats get one, lossless PNG does not — see
 * {@link DEFAULT_TRANSFORM_QUALITY}).
 */
declare function parseTransformParams(params: URLSearchParams): ParsedTransformParams;
//#endregion
export { ALLOWED_TRANSFORM_FORMATS, DEFAULT_TRANSFORM_FORMAT, DEFAULT_TRANSFORM_QUALITY, IMMUTABLE_IMAGE_CACHE, ImageTransformFormat, ImageTransformOptions, MAX_TRANSFORM_DIMENSION, MUTABLE_MEDIA_CACHE_CONTROL, ParsedTransformParams, isSafeTransformKey, isTransformFormat, matchInternalMediaKey, originalMediaHeaders, parseTransformParams, resolveTransformQuality };
//# sourceMappingURL=image-endpoint.d.mts.map