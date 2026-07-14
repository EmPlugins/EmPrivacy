# EmDash release — EmPrivacy reference

## Config

- [`.cursor/emdash-release.json`](../../emdash-release.json)
- Schema: [`.cursor/emdash-release.schema.json`](../../emdash-release.schema.json)

EmPrivacy is a **single-package** repo (`emprivacy` at repo root). `approval.mergeVersionPackagesPr` is **true** so agents publish without a human gate.

## Credentials

| Credential | Where | Used for |
|------------|-------|----------|
| GitHub CLI (`gh auth login`) | Local machine | Branch, PRs, CI watch, merges |
| `NPM_TOKEN` | GitHub repo secret on `EmPlugins/EmPrivacy` | `release.yml` → npm publish |
| `GITHUB_TOKEN` | Actions (automatic) | Version PR, changelog, GitHub Release |

Always prefer:

```bash
env -u GITHUB_TOKEN gh ...
```

when the shell env overrides keyring auth.

### One-time npm token

1. npmjs.com → Access Tokens → Automation or granular token with publish for `emprivacy` (2FA bypass for CI).
2. Add as repo secret `NPM_TOKEN` on `EmPlugins/EmPrivacy`.

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

- `publish:` in `release.yml` **must** be `pnpm release:publish` (no inline `&&`)
- Omit `version` on `pnpm/action-setup` when `packageManager` is set in `package.json`
- Publishable package name in changesets: `emprivacy`

## Troubleshooting

| Symptom | Action |
|---------|--------|
| Missing config | Restore `.cursor/emdash-release.json` |
| Conformance filter wrong | `emdash.pluginPackage` must be `emprivacy` |
| Unexpected major | Stale `.changeset/*.md` |
| Version Packages PR missing | Create from `changeset-release/main`; fix org Actions → allow PR creation |
| Publish failed | Check `NPM_TOKEN`, `pnpm release:publish`; see `docs/maintainer-release.md` |
| `gh` 401 | `env -u GITHUB_TOKEN gh ...` |
