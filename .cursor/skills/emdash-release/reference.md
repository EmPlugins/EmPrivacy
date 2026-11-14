# EmDash release — EmPrivacy reference

## Config

- [`.cursor/emdash-release.json`](../../emdash-release.json)
- Schema: [`.cursor/emdash-release.schema.json`](../../emdash-release.schema.json)

EmPrivacy is a **single-package** repo (`@emplugins/emprivacy` at repo root). Publishes to the [emplugins](https://www.npmjs.com/org/emplugins) npm org. `approval.mergeVersionPackagesPr` is **true** so agents publish without a human gate.

## Credentials

| Credential | Where | Used for |
|------------|-------|----------|
| GitHub CLI (`gh auth login`) | Local machine | Branch, PRs, CI watch, merges |
| Trusted publisher | npm package settings for `@emplugins/emprivacy` | `release.yml` on `EmPlugins/EmPrivacy` publishes with OIDC. Direct `npm publish` is allowed. No GitHub environment. |
| `GITHUB_TOKEN` | Actions (automatic) | Version PR, changelog, GitHub Release. Not an npm credential. |

Always prefer:

```bash
env -u GITHUB_TOKEN gh ...
```

when the shell env overrides keyring auth.

### npm publish auth

`scripts/npm-auth-publish.mjs` publishes from GitHub Actions with OIDC. `release.yml` needs `id-token: write` and npm 11.5.1 or newer from `scripts/ci-toolchain.sh`. Do not add an `NPM_TOKEN` secret to the workflow. `main` accepts changes only through a pull request.

See `docs/NPM_ORG_PUBLISH.md`.

Never write an npm token into the repo, a project `.npmrc`, a commit, or a pull request. Local login belongs in `~/.npmrc` only.

## Files touched on every EmDash upgrade

| File | Change |
|------|--------|
| `package.json` | `devDependencies.emdash`, maybe `peerDependencies.emdash` |
| `pnpm-lock.yaml` | after `pnpm install` |
| `.github/workflows/ci.yml` | latest `emdash_version` matrix cell |
| `EMDASH_COMPAT.md` | CI-tested latest |
| `README.md` | compatibility line |
| `.changeset/<slug>.md` | bump for `emprivacy` |

## API touchpoints

| File | Notes |
|------|-------|
| `src/index.ts` | `PluginDescriptor`, `capabilities`, admin pages |
| `src/sandbox-entry.ts` | SandboxedPlugin / fragment hooks |
| `src/config.ts` | config Zod shapes (usually EmDash-agnostic) |

| API / pattern | Notes |
|---------------|-------|
| `PluginDescriptor` from `"emdash"` | trusted `plugins: []` registration |
| `capabilities: ["hooks.page-fragments:register"]` | required for public fragments |
| `format: "standard"` + `entrypoint` | sandbox entry |
| `emdash/astro` | consumer registration in README examples |

## Conformance

```bash
pnpm emdash:conformance          # npm latest
pnpm emdash:conformance 1.2.3    # pin
```

Runs typecheck, test, build, verify:exports, audit, pack:check at `minPeerVersion` and target latest.

## Changeset policy

| Outcome | Bump |
|---------|------|
| Conforming (version/docs only) | patch |
| API fixes, peer unchanged | minor |
| Peer floor raised | major |

## Release plumbing

- `publish:` path is `pnpm release:publish` inside `scripts/release-or-version.mjs` (no inline `&&` in a marketplace action)
- EmPlugins org Actions policy is `local_only`. Do not add `uses:` of `actions/checkout`, `pnpm/action-setup`, or `changesets/action`. See `docs/maintainer-release.md`.
- Publishable package name in changesets: `@emplugins/emprivacy`

## Troubleshooting

| Symptom | Action |
|---------|--------|
| Missing config | Restore `.cursor/emdash-release.json` |
| Conformance filter wrong | `emdash.pluginPackage` must be `@emplugins/emprivacy` |
| Unexpected major | Stale `.changeset/*.md` |
| Version Packages PR missing | Create from `changeset-release/main`; fix org Actions → allow PR creation |
| Publish failed | Check `id-token: write`, npm >= 11.5.1, and `docs/NPM_ORG_PUBLISH.md`. Do not restore `NPM_TOKEN`. |
| `gh` 401 | `env -u GITHUB_TOKEN gh ...` |
