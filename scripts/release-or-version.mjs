#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Version or publish without changesets/action.
 * The EmPlugins org allows only local Actions, so this script opens the
 * Version Packages pull request or publishes and creates the GitHub Release.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";

const VERSION_BRANCH = "changeset-release/main";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

function run(cmd, args, { allowFail = false } = {}) {
	const result = spawnSync(cmd, args, { stdio: "inherit" });
	if (!allowFail && result.status !== 0) {
		process.exit(result.status ?? 1);
	}
	return result.status ?? 1;
}

function git(args, options) {
	if (!token) {
		console.error("GITHUB_TOKEN is required");
		process.exit(1);
	}
	return run(
		"git",
		["-c", "credential.helper=", "-c", `http.extraheader=AUTHORIZATION: bearer ${token}`, ...args],
		options,
	);
}

function gitOutput(args) {
	if (!token) {
		console.error("GITHUB_TOKEN is required");
		process.exit(1);
	}
	const result = spawnSync(
		"git",
		["-c", "credential.helper=", "-c", `http.extraheader=AUTHORIZATION: bearer ${token}`, ...args],
		{ encoding: "utf8" },
	);
	if (result.status !== 0) {
		process.stderr.write(result.stderr ?? "");
		process.exit(result.status ?? 1);
	}
	return result.stdout ?? "";
}

function pendingChangesets() {
	return readdirSync(".changeset").filter((name) => {
		if (!name.endsWith(".md") || name === "README.md") return false;
		const text = readFileSync(`.changeset/${name}`, "utf8");
		const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
		return Boolean(frontmatter && /"[^"]+"\s*:/.test(frontmatter[1]));
	});
}

function changelogEntry(markdown, version) {
	const lines = markdown.split("\n");
	const start = lines.findIndex((line) => line.trim() === `## ${version}`);
	if (start < 0) return null;
	let end = lines.findIndex((line, index) => index > start && line.startsWith("## "));
	if (end < 0) end = lines.length;
	return lines.slice(start, end).join("\n").trim();
}

function versionPackages() {
	if (process.env.GITHUB_ACTIONS === "true") {
		run("git", ["config", "user.name", "github-actions[bot]"]);
		run("git", ["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
	}
	run("git", ["checkout", "-B", VERSION_BRANCH]);
	run("pnpm", ["release:version"]);
	run("git", ["add", "-A"]);
	const dirty = spawnSync("git", ["diff", "--cached", "--quiet"]).status;
	if (dirty === 0) {
		console.error("release:version made no changes");
		process.exit(1);
	}
	run("git", ["commit", "-m", "Version Packages"]);

	const remoteHead = gitOutput(["ls-remote", "--heads", "origin", VERSION_BRANCH]).trim();
	if (remoteHead) {
		git([
			"fetch",
			"origin",
			`+refs/heads/${VERSION_BRANCH}:refs/remotes/origin/${VERSION_BRANCH}`,
		]);
		git([
			"push",
			`--force-with-lease=refs/heads/${VERSION_BRANCH}:refs/remotes/origin/${VERSION_BRANCH}`,
			"origin",
			`HEAD:${VERSION_BRANCH}`,
		]);
	} else {
		git(["push", "origin", `HEAD:${VERSION_BRANCH}`]);
	}

	const version = JSON.parse(readFileSync("package.json", "utf8")).version;
	const notes = changelogEntry(readFileSync("CHANGELOG.md", "utf8"), version) ?? "";
	const body = [
		"Version bump from changesets. Merging publishes to npm and creates the GitHub Release.",
		"",
		`## @emplugins/emprivacy@${version}`,
		"",
		notes,
	].join("\n");

	const owner = (process.env.GITHUB_REPOSITORY ?? "EmPlugins/EmPrivacy").split("/")[0];
	const list = spawnSync(
		"gh",
		["pr", "list", "--base", "main", "--head", `${owner}:${VERSION_BRANCH}`, "--json", "number"],
		{ encoding: "utf8" },
	);
	if (list.status !== 0) process.exit(list.status ?? 1);
	const existing = JSON.parse(list.stdout);
	if (existing.length === 0) {
		run("gh", [
			"pr",
			"create",
			"--base",
			"main",
			"--head",
			VERSION_BRANCH,
			"--title",
			"Version Packages",
			"--body",
			body,
		]);
	} else {
		run("gh", ["pr", "edit", String(existing[0].number), "--title", "Version Packages", "--body", body]);
	}
}

function publishPackage() {
	run("pnpm", ["release:publish"]);
	const version = JSON.parse(readFileSync("package.json", "utf8")).version;
	const tag = `v${version}`;
	console.log(`New tag: ${tag}`);
	const notes = changelogEntry(readFileSync("CHANGELOG.md", "utf8"), version);
	if (!notes) {
		console.error(`No CHANGELOG entry for ${version}`);
		process.exit(1);
	}
	const exists = spawnSync("gh", ["release", "view", tag], { stdio: "ignore" }).status === 0;
	if (exists) {
		console.log(`GitHub Release ${tag} already exists`);
		return;
	}
	run("gh", ["release", "create", tag, "--title", tag, "--notes", notes, "--target", process.env.GITHUB_SHA]);
}

if (process.env.GITHUB_ACTIONS !== "true") {
	console.error("scripts/release-or-version.mjs runs in GitHub Actions only");
	process.exit(1);
}
if (!token) {
	console.error("GITHUB_TOKEN is required");
	process.exit(1);
}
process.env.GH_TOKEN = token;

if (pendingChangesets().length > 0) {
	console.log("Pending changesets found. Opening the Version Packages pull request.");
	versionPackages();
} else {
	console.log("No changesets found. Publishing.");
	publishPackage();
}
