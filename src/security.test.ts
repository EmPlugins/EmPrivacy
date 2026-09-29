// SPDX-License-Identifier: MIT

import { describe, expect, it } from "vitest";

import {
	assertSameOriginMutation,
	cookieMaxAgeSeconds,
	EMBED_IFRAME_ALLOW,
	EMBED_IFRAME_SANDBOX,
	isAllowedHydratedEmbedLink,
	isAllowedIframeSrc,
	isBlockedHostname,
	isSafeHttpsScriptUrl,
	isScriptHostAllowed,
	tryConsumeRateSlot,
	normalizeCookieMaxAgeDays,
	parseCookieMaxAgeDays,
	parseHostnameAllowlist,
	parseScriptUrlWithIntegrity,
	parseStrictHttpsUrl,
	rateHourKey,
} from "./security.js";

describe("parseStrictHttpsUrl", () => {
	it("accepts clean https URLs", () => {
		expect(parseStrictHttpsUrl("https://cdn.example/a.js")?.hostname).toBe("cdn.example");
	});

	it("rejects http, credentials, localhost, and control chars", () => {
		expect(parseStrictHttpsUrl("http://cdn.example/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://user:pass@cdn.example/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://localhost/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://cdn.example/a.js%0d%0a")).toBeNull();
	});

	it("rejects loopback, private, link-local, and non-global addresses", () => {
		expect(parseStrictHttpsUrl("https://127.0.0.1/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://10.1.2.3/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://192.168.0.1/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://172.16.0.1/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://169.254.169.254/latest")).toBeNull();
		expect(parseStrictHttpsUrl("https://[::1]/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://[fc00::1]/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://2130706433/a.js")).toBeNull();
		expect(parseStrictHttpsUrl("https://8.8.8.8/a.js")?.hostname).toBe("8.8.8.8");
		expect(isBlockedHostname("example.com")).toBe(false);
	});
});

describe("embed allowlists", () => {
	it("allows youtube-nocookie and vimeo iframe shapes only", () => {
		expect(isAllowedIframeSrc("https://www.youtube-nocookie.com/embed/abcdefghijk")).toBe(true);
		expect(isAllowedIframeSrc("https://player.vimeo.com/video/123456789")).toBe(true);
		expect(isAllowedIframeSrc("https://evil.example/embed/abcdefghijk")).toBe(false);
		expect(isAllowedIframeSrc("https://www.youtube.com/embed/abcdefghijk")).toBe(false);
	});

	it("allows built-in social links and only allowlisted other hosts", () => {
		expect(
			isAllowedHydratedEmbedLink("https://x.com/user/status/1234567890123456789"),
		).toBe(true);
		expect(
			isAllowedHydratedEmbedLink("https://bsky.app/profile/a.bsky.social/post/abc123"),
		).toBe(true);
		expect(
			isAllowedHydratedEmbedLink("https://gist.github.com/octocat/abcdef12abcdef12abcdef12abcdef12"),
		).toBe(true);
		expect(isAllowedHydratedEmbedLink("https://evil.example/post/1")).toBe(false);
		expect(isAllowedHydratedEmbedLink("https://cdn.example/og.png")).toBe(false);
		expect(isAllowedHydratedEmbedLink("https://cdn.example/og.png", ["cdn.example"])).toBe(true);
		expect(isAllowedHydratedEmbedLink("https://mastodon.social/@user/123456789")).toBe(false);
		expect(
			isAllowedHydratedEmbedLink("https://mastodon.social/@user/123456789", ["mastodon.social"]),
		).toBe(true);
	});

	it("keeps the iframe sandbox paired with the youtube and vimeo src checks", () => {
		expect(EMBED_IFRAME_SANDBOX).toBe("allow-scripts allow-same-origin allow-presentation");
		expect(EMBED_IFRAME_ALLOW).not.toContain("clipboard-write");
		expect(isAllowedIframeSrc("https://www.youtube-nocookie.com/embed/abcdefghijk")).toBe(true);
		expect(isAllowedIframeSrc("https://player.vimeo.com/video/123456789")).toBe(true);
	});
});

describe("script hosts and SRI", () => {
	it("denies custom hosts until they are listed, and still allows presets", () => {
		expect(
			isScriptHostAllowed("https://cdn.example/a.js", {
				allowlist: [],
				allowPresets: false,
			}),
		).toBe(false);
		expect(
			isScriptHostAllowed("https://cdn.example/a.js", {
				allowlist: ["cdn.example"],
				allowPresets: false,
			}),
		).toBe(true);
		expect(
			isScriptHostAllowed("https://evil.example/a.js", {
				allowlist: ["cdn.example"],
				allowPresets: false,
			}),
		).toBe(false);
		expect(
			isScriptHostAllowed("https://plausible.io/js/script.js", {
				allowlist: ["cdn.example"],
				allowPresets: true,
			}),
		).toBe(true);
	});

	it("parses optional integrity suffixes", () => {
		expect(parseScriptUrlWithIntegrity("https://cdn.example/a.js sha384-abc=")).toEqual({
			src: "https://cdn.example/a.js",
			integrity: "sha384-abc=",
		});
		expect(
			parseScriptUrlWithIntegrity("https://cdn.example/a.js integrity=sha256-xyz"),
		).toEqual({
			src: "https://cdn.example/a.js",
			integrity: "sha256-xyz",
		});
	});

	it("rejects hashed fragments on script URLs", () => {
		expect(isSafeHttpsScriptUrl("https://cdn.example/a.js#x")).toBe(false);
	});
});

describe("cookie TTL", () => {
	it("defaults and clamps days", () => {
		expect(normalizeCookieMaxAgeDays(undefined)).toBe(180);
		expect(normalizeCookieMaxAgeDays(400)).toBe(365);
		expect(normalizeCookieMaxAgeDays(0)).toBe(180);
		expect(cookieMaxAgeSeconds(180)).toBe(180 * 24 * 60 * 60);
		expect(parseCookieMaxAgeDays("90")).toBe(90);
		expect(() => parseCookieMaxAgeDays("0")).toThrow();
		expect(() => parseCookieMaxAgeDays("999")).toThrow();
	});

	it("parses hostname allowlists", () => {
		expect(parseHostnameAllowlist("cdn.example.com\njs.stripe.com")).toEqual([
			"cdn.example.com",
			"js.stripe.com",
		]);
		expect(() => parseHostnameAllowlist("not a host")).toThrow(/hostname/);
	});
});

describe("assertSameOriginMutation", () => {
	it("accepts matching Origin", () => {
		const req = new Request("https://site.test/_emdash/api/plugins/emprivacy/record", {
			method: "POST",
			headers: { Origin: "https://site.test" },
		});
		expect(assertSameOriginMutation(req, "https://site.test")).toBeNull();
	});

	it("rejects mismatched Origin", () => {
		const req = new Request("https://site.test/x", {
			method: "POST",
			headers: { Origin: "https://evil.test" },
		});
		const res = assertSameOriginMutation(req, "https://site.test");
		expect(res?.status).toBe(403);
	});

	it("accepts Sec-Fetch-Site same-origin when Origin is absent", () => {
		const req = new Request("https://site.test/x", {
			method: "POST",
			headers: { "Sec-Fetch-Site": "same-origin" },
		});
		expect(assertSameOriginMutation(req, "https://site.test")).toBeNull();
	});

	it("rejects when Origin and Sec-Fetch-Site are both missing", () => {
		const req = new Request("https://site.test/x", { method: "POST" });
		const res = assertSameOriginMutation(req, "https://site.test");
		expect(res?.status).toBe(403);
	});
});

describe("tryConsumeRateSlot", () => {
	it("increments with compare-and-set and stops at the limit", async () => {
		const store = new Map<string, { value: string; revision: string }>();
		let revision = 0;
		const kv = {
			async getVersioned<T>(key: string) {
				const row = store.get(key);
				return row ? { value: row.value as T, revision: row.revision } : null;
			},
			async compareAndSet(key: string, expectedRevision: string | null, value: unknown) {
				const row = store.get(key) ?? null;
				const current = row?.revision ?? null;
				if (current !== expectedRevision) return { applied: false };
				revision += 1;
				store.set(key, { value: String(value), revision: String(revision) });
				return { applied: true };
			},
		};
		expect(await tryConsumeRateSlot(kv, "k", 2)).toBe(true);
		expect(await tryConsumeRateSlot(kv, "k", 2)).toBe(true);
		expect(await tryConsumeRateSlot(kv, "k", 2)).toBe(false);
	});

	it("fails closed when the store throws", async () => {
		const kv = {
			async getVersioned() {
				throw new Error("down");
			},
			async compareAndSet() {
				return { applied: true };
			},
		};
		expect(await tryConsumeRateSlot(kv, "k", 5)).toBe(false);
	});
});

describe("rateHourKey", () => {
	it("returns a stable UTC hour bucket", () => {
		expect(rateHourKey(new Date("2026-04-01T15:22:00Z"))).toBe("2026040115");
	});
});
