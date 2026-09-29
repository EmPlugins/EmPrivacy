#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Publish with NPM_TOKEN / NODE_AUTH_TOKEN via a temporary user npmrc
 * outside the repo. Never write a project .npmrc; that file is gitignored
 * and must not hold an auth token.
 */
import { mkdtempSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";

const token = process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN;
if (!token) {
	console.error("NPM_TOKEN or NODE_AUTH_TOKEN is required for publish");
	process.exit(1);
}

const projectNpmrc = resolve(process.cwd(), ".npmrc");
if (existsSync(projectNpmrc)) {
	console.error(
		"Refusing to publish: a project .npmrc exists. Keep npm credentials in ~/.npmrc (npm login) or NPM_TOKEN, not in the repository.",
	);
	process.exit(1);
}

const configDir = mkdtempSync(join(tmpdir(), "emprivacy-npm-"));
const npmrcPath = join(configDir, "npmrc");
const contents = [
	"registry=https://registry.npmjs.org/",
	"//registry.npmjs.org/:_authToken=${NPM_TOKEN}",
	"always-auth=true",
	"",
].join("\n");

writeFileSync(npmrcPath, contents, { mode: 0o600 });

const env = {
	...process.env,
	NPM_TOKEN: token,
	NODE_AUTH_TOKEN: token,
	NPM_CONFIG_USERCONFIG: npmrcPath,
};

function cleanup() {
	rmSync(configDir, { recursive: true, force: true });
}

const whoami = spawnSync("npm", ["whoami", "--registry", "https://registry.npmjs.org/"], {
	env,
	encoding: "utf8",
	stdio: ["ignore", "pipe", "pipe"],
});
if (whoami.status !== 0) {
	console.error("npm whoami failed — NPM_TOKEN cannot authenticate");
	console.error(whoami.stderr || whoami.stdout);
	cleanup();
	process.exit(1);
}
console.log(`npm whoami: ${whoami.stdout.trim()}`);

const publish = spawnSync(
	"npm",
	["publish", "--access", "public", "--registry", "https://registry.npmjs.org/"],
	{ env, encoding: "utf8", stdio: "inherit" },
);

cleanup();
process.exit(publish.status ?? 1);
