#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Publish @emplugins/emprivacy.
 * GitHub Actions uses npm trusted publishing (OIDC). Do not pass an npm token.
 * A local run uses ~/.npmrc from `npm login` and may prompt for 2FA.
 * Never write a project .npmrc.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const projectNpmrc = resolve(process.cwd(), ".npmrc");
if (existsSync(projectNpmrc)) {
	console.error(
		"Refusing to publish: a project .npmrc exists. Keep npm credentials in ~/.npmrc from npm login. Do not store an auth token in the repository.",
	);
	process.exit(1);
}

const env = { ...process.env };
delete env.NPM_TOKEN;
delete env.NODE_AUTH_TOKEN;

if (env.GITHUB_ACTIONS === "true") {
	if (!env.ACTIONS_ID_TOKEN_REQUEST_URL || !env.ACTIONS_ID_TOKEN_REQUEST_TOKEN) {
		console.error(
			"Refusing to publish: GitHub Actions trusted publishing needs id-token: write (ACTIONS_ID_TOKEN_REQUEST_URL and ACTIONS_ID_TOKEN_REQUEST_TOKEN).",
		);
		process.exit(1);
	}
	delete env.NPM_CONFIG_USERCONFIG;
	delete env.npm_config_userconfig;
}

const publish = spawnSync(
	"npm",
	["publish", "--access", "public", "--registry", "https://registry.npmjs.org/"],
	{ env, stdio: "inherit" },
);

process.exit(publish.status ?? 1);
