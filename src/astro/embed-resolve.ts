// SPDX-License-Identifier: MIT

/**
 * Validate official EmDash embed block payloads and produce a first-party
 * placeholder plan. Never returns a URL we did not construct or allowlist.
 */

export const EMBED_BLOCK_TYPES = [
	"youtube",
	"vimeo",
	"tweet",
	"bluesky",
	"mastodon",
	"linkPreview",
	"gist",
] as const;

export type EmbedBlockType = (typeof EMBED_BLOCK_TYPES)[number];

export type EmbedRenderMode = "iframe" | "link";

export interface ResolvedEmbed {
	kind: EmbedBlockType;
	mode: EmbedRenderMode;
	/** https iframe src or link href — always produced by this module */
	src: string;
	label: string;
	poster: string | null;
}

const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^\d{6,12}$/;
const TWEET_ID = /^\d{5,20}$/;
const BSKY_RKEY = /^[a-z0-9]{1,32}$/i;
const BSKY_HANDLE = /^[a-z0-9.-]{1,253}$/i;
const GIST_ID = /^[a-f0-9]{8,64}$/i;
const GIST_USER = /^[A-Za-z0-9-]{1,39}$/;

const YT_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);
const TWEET_HOSTS = new Set(["twitter.com", "www.twitter.com", "x.com", "www.x.com", "mobile.twitter.com"]);
const BSKY_HOSTS = new Set(["bsky.app", "www.bsky.app"]);
const GIST_HOSTS = new Set(["gist.github.com"]);
const POSTER_HOSTS = new Set(["i.ytimg.com", "img.youtube.com", "i.vimeocdn.com"]);

function hasUnsafeChars(s: string): boolean {
	return /[\u0000-\u001F\u007F\s]/.test(s);
}

export function parseHttpsUrl(raw: string): URL | null {
	const t = raw.trim();
	if (!t || t.length > 2048 || hasUnsafeChars(t)) return null;
	if (/%0d|%0a|%09|%0b|%0c|%20/i.test(t)) return null;
	try {
		const u = new URL(t);
		if (u.protocol !== "https:") return null;
		if (u.username || u.password) return null;
		if (u.hostname === "localhost" || u.hostname.endsWith(".localhost")) return null;
		return u;
	} catch {
		return null;
	}
}

function hostOf(u: URL): string {
	return u.hostname.toLowerCase();
}

function youtubeId(raw: string): string | null {
	const t = raw.trim();
	if (YT_ID.test(t)) return t;
	const u = parseHttpsUrl(t);
	if (!u || !YT_HOSTS.has(hostOf(u))) return null;
	if (hostOf(u) === "youtu.be") {
		const id = u.pathname.replace(/^\//, "").split("/")[0] ?? "";
		return YT_ID.test(id) ? id : null;
	}
	const v = u.searchParams.get("v");
	if (v && YT_ID.test(v)) return v;
	const parts = u.pathname.split("/").filter(Boolean);
	const embedIdx = parts.indexOf("embed");
	if (embedIdx >= 0) {
		const id = parts[embedIdx + 1] ?? "";
		return YT_ID.test(id) ? id : null;
	}
	const shortsIdx = parts.indexOf("shorts");
	if (shortsIdx >= 0) {
		const id = parts[shortsIdx + 1] ?? "";
		return YT_ID.test(id) ? id : null;
	}
	return null;
}

function vimeoId(raw: string): string | null {
	const t = raw.trim();
	if (VIMEO_ID.test(t)) return t;
	const u = parseHttpsUrl(t);
	if (!u || !VIMEO_HOSTS.has(hostOf(u))) return null;
	const parts = u.pathname.split("/").filter(Boolean);
	const last = parts[parts.length - 1] ?? "";
	const videoIdx = parts.indexOf("video");
	if (videoIdx >= 0) {
		const id = parts[videoIdx + 1] ?? "";
		return VIMEO_ID.test(id) ? id : null;
	}
	return VIMEO_ID.test(last) ? last : null;
}

function tweetId(raw: string): string | null {
	const t = raw.trim();
	if (TWEET_ID.test(t)) return t;
	const u = parseHttpsUrl(t);
	if (!u || !TWEET_HOSTS.has(hostOf(u))) return null;
	const m = /\/status(?:es)?\/(\d{5,20})(?:\/|$)/i.exec(u.pathname);
	return m?.[1] ?? null;
}

function blueskyHref(raw: string): string | null {
	const u = parseHttpsUrl(raw);
	if (!u || !BSKY_HOSTS.has(hostOf(u))) return null;
	const m = /^\/profile\/([^/]+)\/post\/([^/]+)\/?$/.exec(u.pathname);
	if (!m) return null;
	const handle = m[1] ?? "";
	const rkey = m[2] ?? "";
	if (!BSKY_HANDLE.test(handle) || !BSKY_RKEY.test(rkey)) return null;
	return `https://bsky.app/profile/${handle}/post/${rkey}`;
}

function gistHref(raw: string): string | null {
	const u = parseHttpsUrl(raw);
	if (!u || !GIST_HOSTS.has(hostOf(u))) return null;
	const parts = u.pathname.split("/").filter(Boolean);
	if (parts.length < 2) return null;
	const user = parts[0] ?? "";
	const id = (parts[1] ?? "").replace(/\.js$/i, "");
	if (!GIST_USER.test(user) || !GIST_ID.test(id)) return null;
	return `https://gist.github.com/${user}/${id}`;
}

function mastodonHref(raw: string): string | null {
	const u = parseHttpsUrl(raw);
	if (!u) return null;
	// Any Mastodon instance is an arbitrary host — never iframe it.
	if (!/^\/@[^/]+\/\d+\/?$/.test(u.pathname) && !/^\/users\/[^/]+\/statuses\/\d+\/?$/.test(u.pathname)) {
		return null;
	}
	return `https://${hostOf(u)}${u.pathname.replace(/\/$/, "")}`;
}

function posterUrl(raw: unknown, kind: EmbedBlockType, mediaId: string | null): string | null {
	if (kind === "youtube" && mediaId && YT_ID.test(mediaId)) {
		return `https://i.ytimg.com/vi/${mediaId}/hqdefault.jpg`;
	}
	if (typeof raw !== "string") return null;
	const u = parseHttpsUrl(raw);
	if (!u || !POSTER_HOSTS.has(hostOf(u))) return null;
	return u.href;
}

export function isEmbedBlockType(s: string): s is EmbedBlockType {
	return (EMBED_BLOCK_TYPES as readonly string[]).includes(s);
}

export function resolveEmbed(node: {
	_type?: unknown;
	id?: unknown;
	poster?: unknown;
	title?: unknown;
}): ResolvedEmbed | null {
	if (!node || typeof node._type !== "string" || !isEmbedBlockType(node._type)) return null;
	if (typeof node.id !== "string") return null;
	const kind = node._type;
	const rawId = node.id.trim();
	if (!rawId || rawId.length > 2048) return null;

	if (kind === "youtube") {
		const id = youtubeId(rawId);
		if (!id) return null;
		return {
			kind,
			mode: "iframe",
			src: `https://www.youtube-nocookie.com/embed/${id}`,
			label: "YouTube",
			poster: posterUrl(node.poster, kind, id),
		};
	}
	if (kind === "vimeo") {
		const id = vimeoId(rawId);
		if (!id) return null;
		return {
			kind,
			mode: "iframe",
			src: `https://player.vimeo.com/video/${id}`,
			label: "Vimeo",
			poster: posterUrl(node.poster, kind, id),
		};
	}
	if (kind === "tweet") {
		const id = tweetId(rawId);
		if (!id) return null;
		return {
			kind,
			mode: "link",
			src: `https://x.com/i/web/status/${id}`,
			label: "Post on X",
			poster: null,
		};
	}
	if (kind === "bluesky") {
		const href = blueskyHref(rawId);
		if (!href) return null;
		return { kind, mode: "link", src: href, label: "Bluesky post", poster: null };
	}
	if (kind === "mastodon") {
		const href = mastodonHref(rawId);
		if (!href) return null;
		return { kind, mode: "link", src: href, label: "Mastodon post", poster: null };
	}
	if (kind === "gist") {
		const href = gistHref(rawId);
		if (!href) return null;
		return { kind, mode: "link", src: href, label: "GitHub Gist", poster: null };
	}
	const href = parseHttpsUrl(rawId);
	if (!href) return null;
	return { kind: "linkPreview", mode: "link", src: href.href, label: href.hostname, poster: null };
}
