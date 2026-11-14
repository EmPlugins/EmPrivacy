// SPDX-License-Identifier: MIT

import { BSKY_PROFILE_PATH, parseStrictHttpsUrl } from "../security.js";

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
const BSKY_AUTHORITY = /^[A-Za-z0-9._:-]{1,512}$/;
const BSKY_RKEY = /^[A-Za-z0-9._:~-]{1,512}$/;
/** `at://<authority>/app.bsky.feed.post/<rkey>` */
const AT_URI_POST = /^at:\/\/([A-Za-z0-9._:-]{1,512})\/app\.bsky\.feed\.post\/([A-Za-z0-9._:~-]{1,512})$/;
const GIST_ID = /^[a-f0-9]{8,64}$/i;
const GIST_USER = /^[A-Za-z0-9-]{1,39}$/;

const YT_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"]);
const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);
const TWEET_HOSTS = new Set(["twitter.com", "www.twitter.com", "x.com", "www.x.com", "mobile.twitter.com"]);
const BSKY_HOSTS = new Set(["bsky.app", "www.bsky.app", "staging.bsky.app"]);
const GIST_HOSTS = new Set(["gist.github.com"]);
const POSTER_HOSTS = new Set(["i.ytimg.com", "img.youtube.com", "i.vimeocdn.com"]);

/** Same non-public host rules as script URLs. */
export function parseHttpsUrl(raw: string): URL | null {
	return parseStrictHttpsUrl(raw);
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

function safeBlueskySegment(value: string, pattern: RegExp): boolean {
	if (!pattern.test(value)) return false;
	if (value === "." || value === ".." || value.includes("..")) return false;
	return true;
}

/** Canonical https post URL. Never an `embed.bsky.app` script or iframe. */
function blueskyCanonical(
	host: "bsky.app" | "staging.bsky.app",
	authority: string,
	rkey: string,
): string | null {
	if (!safeBlueskySegment(authority, BSKY_AUTHORITY) || !safeBlueskySegment(rkey, BSKY_RKEY)) return null;
	return `https://${host}/profile/${authority}/post/${rkey}`;
}

function blueskyHref(raw: string): string | null {
	const t = raw.trim();
	if (!t || t.length > 2048) return null;
	const at = AT_URI_POST.exec(t);
	if (at) return blueskyCanonical("bsky.app", at[1] ?? "", at[2] ?? "");

	const u = parseHttpsUrl(t);
	if (!u || !BSKY_HOSTS.has(hostOf(u))) return null;
	const m = BSKY_PROFILE_PATH.exec(u.pathname);
	if (!m) return null;
	const host = hostOf(u) === "staging.bsky.app" ? "staging.bsky.app" : "bsky.app";
	return blueskyCanonical(host, m[1] ?? "", m[2] ?? "");
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
