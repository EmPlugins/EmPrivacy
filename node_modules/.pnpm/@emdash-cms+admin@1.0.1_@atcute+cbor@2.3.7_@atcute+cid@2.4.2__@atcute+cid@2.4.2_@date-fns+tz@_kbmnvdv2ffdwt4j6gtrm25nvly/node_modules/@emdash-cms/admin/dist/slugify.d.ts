//#region src/slugify.d.ts
/**
 * Convert text to a browser-safe Unicode URL slug.
 *
 * Text is NFKC-normalized and lowercased; whitespace and underscores become
 * hyphens while Unicode letters, numbers, and combining marks are preserved.
 * The length limit counts grapheme clusters. Inputs without usable characters
 * receive a stable `untitled-*` fallback.
 */
declare function slugify(text: string, maxLength?: number): string;
//#endregion
export { slugify };
//# sourceMappingURL=slugify.d.ts.map