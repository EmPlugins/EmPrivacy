<!-- SPDX-License-Identifier: MIT -->

# Releases and versioning

Published **npm** versions of `emprivacy` follow **[Semantic Versioning 2.0.0](https://semver.org/)** (`MAJOR.MINOR.PATCH`).

**Toolchain:** **pnpm** + **[Changesets](https://github.com/changesets/changesets)** + GitHub Actions (`release.yml`). Packages publish to the **npm registry** via `pnpm publish`.

## What each bump means

| Level | When to use it |
|--------|----------------|
| **PATCH** | Bug fixes and safe internal refactors; no intentional behavior or API contract change for integrators. |
| **MINOR** | New features, new optional admin fields, or additive exports; existing sites keep working without config changes unless they opt in. |
| **MAJOR** | Breaking changes for site authors or the plugin contract (e.g. renamed exports, changed hook shapes, cookie JSON shape, required EmDash peer range). |

**Pre-1.0 (`0.x.y`):** Per the semver spec, anything may change; in practice we still use **patch / minor / major** as above so upgrades are predictable. Treat **minor** bumps as the place we may ship breaking changes until `1.0.0`, and read the release notes before upgrading.

**Policy / consent version** (in the EmDash admin) is separate from package semver: it only re-prompts visitors when your legal text or choices change.

## Safe publishing

These guards keep published tarballs consistent with `package.json` and avoid shipping stale or missing `dist/` output.

- **`dist/` is not committed** — It is listed in `.gitignore`. Build artifacts are produced locally, in CI, and **immediately before publish** via `prepublishOnly`.
- **`prepublishOnly`** — Runs `sync:version` (keeps `src/version.ts` aligned with `package.json`), `typecheck`, `build`, `test`, **`verify:exports`**, and `pnpm audit`.
- **`kysely` override** — The dev-dependency `emdash` can resolve an older `kysely`; `pnpm.overrides` in `package.json` pins a **patched** Kysely so `pnpm audit` stays clean. See [docs/DEVELOPMENT.md](DEVELOPMENT.md).
- **Install range** — Pin consumers with semver as needed, e.g. `emprivacy@^0.3.0`.

Before publishing locally (usually unnecessary once CI is configured):

```bash
pnpm run build
pnpm pack --dry-run
```

## Cutting a release (maintainers)

### EmDash compatibility (fully agent-driven)

In Cursor:

```
update to latest emdash release
```

Uses [`.cursor/skills/emdash-release/`](../.cursor/skills/emdash-release/SKILL.md) and [`.cursor/emdash-release.json`](../.cursor/emdash-release.json): conformance → compat PR → Version Packages merge → `pnpm release:publish` (npm + GitHub Release). Details: [maintainer-release.md](./maintainer-release.md).

### Automated feature release (Changesets)

1. On a feature PR, run `pnpm changeset` and commit the generated file under `.changeset/`.
2. Merge to `main`. GitHub Actions opens a **Version Packages** PR when changesets are pending.
3. Merge the Version Packages PR. CI runs `pnpm release:publish` and creates a GitHub Release.

Requires **`NPM_TOKEN`** secret on the repo (publish rights for `emprivacy`).

### Local (fallback)

```bash
pnpm install
pnpm changeset          # on feature branch
pnpm changeset version  # on main after merge
pnpm release:publish    # sync, build, test, verify, audit, publish
git push --follow-tags
```

## Tags

Release tags use the **`v` prefix** (e.g. `v0.3.1`) via Changesets / GitHub Releases.

## EmDash compatibility

See [EMDASH_COMPAT.md](../EMDASH_COMPAT.md) for tested upstream versions and upgrade playbook.

## Consumers

Pin with a range that matches your risk tolerance, for example:

```bash
pnpm add emprivacy@^0.3.0
```
