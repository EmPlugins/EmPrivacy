// SPDX-License-Identifier: MIT

import { afterEach, describe, expect, it } from "vitest";

import {
	fetchLatestPublishedVersion,
	isNewerPublished,
	NPM_PACKAGE_URL,
	NPM_REGISTRY_LATEST_URL,
	parseNpmLatestVersion,
	pluginVersionFields,
	pluginVersionNote,
	resetLatestNpmVersionCache,
	type FetchLike,
} from "./npm-version.js";

afterEach(() => {
	resetLatestNpmVersionCache();
});

describe("parseNpmLatestVersion", () => {
	it("reads a stable semver from registry JSON", () => {
		expect(parseNpmLatestVersion({ version: "2.0.0" })).toBe("2.0.0");
	});

	it("accepts prerelease and build metadata", () => {
		expect(parseNpmLatestVersion({ version: "2.1.0-beta.1" })).toBe("2.1.0-beta.1");
		expect(parseNpmLatestVersion({ version: "2.1.0+build.9" })).toBe("2.1.0+build.9");
	});

	it("rejects missing or malformed versions", () => {
		expect(parseNpmLatestVersion(null)).toBeNull();
		expect(parseNpmLatestVersion({})).toBeNull();
		expect(parseNpmLatestVersion({ version: "latest" })).toBeNull();
		expect(parseNpmLatestVersion({ version: "<script>1.0.0</script>" })).toBeNull();
	});
});

describe("isNewerPublished", () => {
	it("compares core semver numbers", () => {
		expect(isNewerPublished("2.0.0", "1.0.0")).toBe(true);
		expect(isNewerPublished("1.1.0", "1.0.9")).toBe(true);
		expect(isNewerPublished("1.0.0", "1.0.0")).toBe(false);
		expect(isNewerPublished("1.0.0", "2.0.0")).toBe(false);
	});
});

describe("pluginVersionFields / pluginVersionNote", () => {
	it("shows both versions when npm is reachable", () => {
		expect(pluginVersionFields("1.0.0", "2.0.0")).toEqual([
			{ label: "Installed version", value: "1.0.0" },
			{ label: "Latest on npm", value: "2.0.0" },
		]);
	});

	it("shows a fallback when npm cannot be reached", () => {
		expect(pluginVersionFields("1.0.0", null)[1]).toEqual({
			label: "Latest on npm",
			value: "Could not reach npm",
		});
	});

	it("points at the public npm page and notes when an update exists", () => {
		expect(pluginVersionNote("1.0.0", "1.0.0")).toContain(NPM_PACKAGE_URL);
		expect(pluginVersionNote("1.0.0", "2.0.0")).toMatch(/newer version/i);
	});
});

describe("fetchLatestPublishedVersion", () => {
	it("requests the registry latest document and parses version", async () => {
		const calls: Array<{ url: string; init?: RequestInit }> = [];
		const fetch: FetchLike = async (url, init) => {
			calls.push({ url, init });
			return new Response(JSON.stringify({ version: "2.0.0" }), { status: 200 });
		};

		await expect(fetchLatestPublishedVersion({ fetch, now: 1_000 })).resolves.toBe("2.0.0");
		expect(calls[0]?.url).toBe(NPM_REGISTRY_LATEST_URL);
		expect(calls[0]?.init?.method).toBe("GET");
	});

	it("caches a successful lookup", async () => {
		let hits = 0;
		const fetch: FetchLike = async () => {
			hits += 1;
			return new Response(JSON.stringify({ version: "2.0.0" }), { status: 200 });
		};

		await fetchLatestPublishedVersion({ fetch, now: 1_000 });
		await expect(fetchLatestPublishedVersion({ fetch, now: 2_000 })).resolves.toBe("2.0.0");
		expect(hits).toBe(1);
	});

	it("returns null on HTTP or network failure", async () => {
		const failing: FetchLike = async () => new Response("nope", { status: 503 });
		await expect(fetchLatestPublishedVersion({ fetch: failing, now: 1_000 })).resolves.toBeNull();

		resetLatestNpmVersionCache();
		const throwing: FetchLike = async () => {
			throw new Error("offline");
		};
		await expect(fetchLatestPublishedVersion({ fetch: throwing, now: 1_000 })).resolves.toBeNull();
	});
});
