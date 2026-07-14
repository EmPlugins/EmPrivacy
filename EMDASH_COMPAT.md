# EmDash compatibility — EmPrivacy

| emprivacy version | Min EmDash (peer) | CI-tested EmDash | Notes |
|-------------------|-------------------|------------------|-------|
| **0.3.x** (current) | `>=0.14.0` | `0.14.0`, `0.29.0` | SandboxedPlugin export; trusted `plugins: []` registration required |
| **0.2.x** | EmDash 0.9–0.13 | — | Use for sites not yet on 0.14+ |
| **0.1.x** | `^0.5.0` / `0.7.0` verified | — | Initial releases |

## When EmDash releases

**Preferred (agent):** In Cursor, say `update to latest emdash release`. The [emdash-release skill](.cursor/skills/emdash-release/SKILL.md) bumps deps/CI/docs, runs `pnpm emdash:conformance`, merges the compat PR and Version Packages PR, and publishes to npm + GitHub.

Manual / Renovate path:

1. Bump the `emdash` dev dependency (or let Renovate open a PR).
2. CI matrix runs against **minimum supported** and **latest** EmDash versions.
3. If green: ship a patch release via Changesets (“verify emdash@X.Y.Z compatibility”).
4. If red: fix breaking API changes, raise `peerDependencies.emdash` if needed, and ship a minor/major plugin release.

See [docs/maintainer-release.md](docs/maintainer-release.md).

## Consumer install

```bash
pnpm add @emplugins/emprivacy
# or
npm install @emplugins/emprivacy
```

Peer dependency: **`emdash >=0.14.0`** on your EmDash site.

Upstream: [emdash-cms/emdash](https://github.com/emdash-cms/emdash)
