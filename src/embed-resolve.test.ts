// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import { resolveEmbed } from "./embed-resolve.js";

describe("resolveEmbed", () => {
	it("accepts a YouTube video id and uses youtube-nocookie", () => {
		const r = resolveEmbed({ _type: "youtube", id: "dQw4w9wgXcQ" });
		expect(r).toEqual({
			kind: "youtube",
			mode: "iframe",
			src: "https://www.youtube-nocookie.com/embed/dQw4w9wgXcQ",
			label: "YouTube",
			poster: "https://i.ytimg.com/vi/dQw4w9wgXcQ/hqdefault.jpg",
		});
	});

	it("extracts an id from a YouTube watch URL", () => {
		const r = resolveEmbed({
			_type: "youtube",
			id: "https://www.youtube.com/watch?v=dQw4w9wgXcQ",
		});
		expect(r?.src).toBe("https://www.youtube-nocookie.com/embed/dQw4w9wgXcQ");
	});

	it("rejects javascript: and credentialed URLs", () => {
		expect(resolveEmbed({ _type: "youtube", id: "javascript:alert(1)" })).toBeNull();
		expect(
			resolveEmbed({ _type: "linkPreview", id: "https://user:pass@evil.example/x" }),
		).toBeNull();
		expect(resolveEmbed({ _type: "youtube", id: "https://evil.example/dQw4w9wgXcQ" })).toBeNull();
	});

	it("rejects http and protocol-relative URLs", () => {
		expect(resolveEmbed({ _type: "linkPreview", id: "http://example.com/x" })).toBeNull();
		expect(resolveEmbed({ _type: "gist", id: "//gist.github.com/a/abcdef12" })).toBeNull();
	});

	it("never iframes a Mastodon URL; only a same parsed https link", () => {
		const r = resolveEmbed({
			_type: "mastodon",
			id: "https://mastodon.social/@user/123456789012345678",
		});
		expect(r?.mode).toBe("link");
		expect(r?.src).toBe("https://mastodon.social/@user/123456789012345678");
	});

	it("rejects an arbitrary gist host", () => {
		expect(
			resolveEmbed({ _type: "gist", id: "https://evil.example/user/abcdef12abcdef12" }),
		).toBeNull();
	});

	it("ignores unallowlisted poster URLs", () => {
		const r = resolveEmbed({
			_type: "vimeo",
			id: "123456789",
			poster: "https://tracker.example/pixel.png",
		});
		expect(r?.poster).toBeNull();
		expect(r?.src).toBe("https://player.vimeo.com/video/123456789");
	});

	it("rejects unknown block types", () => {
		expect(resolveEmbed({ _type: "html", id: "https://example.com" })).toBeNull();
	});
});
