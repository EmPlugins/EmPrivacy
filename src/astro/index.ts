// SPDX-License-Identifier: MIT

/**
 * Portable Text renderers that replace official EmDash embed blocks with
 * consent-gated placeholders. Import from `@emplugins/emprivacy/astro`.
 *
 * Later plugins in `plugins: []` win. To force these wrappers regardless of
 * registration order, pass `blockComponents` to `<PortableText />`.
 */

import GatedEmbed from "./GatedEmbed.astro";

export const blockComponents = {
	youtube: GatedEmbed,
	vimeo: GatedEmbed,
	tweet: GatedEmbed,
	bluesky: GatedEmbed,
	mastodon: GatedEmbed,
	linkPreview: GatedEmbed,
	gist: GatedEmbed,
};

export { GatedEmbed };
export { blockComponents as emprivacyEmbedComponents };
