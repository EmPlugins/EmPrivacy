# EmDash compatibility — EmPrivacy

| @emplugins/emprivacy | Min EmDash (peer) | CI-tested EmDash | Notes |
|----------------------|-------------------|------------------|-------|
| **3.x** (current) | `^1.0.1` | `1.0.1` | Native plugin (`createPlugin`); register in `plugins: []` for `page:fragments`. EmDash 0.x is not supported. |

EmPrivacy 2.x was the last release for EmDash 0.38. It is not updated for EmDash 1.0.

## When EmDash releases

**Preferred (agent):** In Cursor, say `update to latest emdash release`. The [emdash-release skill](.cursor/skills/emdash-release/SKILL.md) bumps deps/CI/docs, runs `pnpm emdash:conformance`, merges the compat PR and Version Packages PR, and publishes to npm + GitHub.

Manual / Renovate path:

1. Bump the `emdash` dev dependency (or let Renovate open a PR).
2. CI matrix runs against the supported EmDash version(s).
3. If green: ship a patch release via Changesets (“verify emdash@X.Y.Z compatibility”).
4. If red: fix breaking API changes, raise `peerDependencies.emdash` if needed, and ship a minor/major plugin release.

See [docs/maintainer-release.md](docs/maintainer-release.md).

## Consumer install

```bash
pnpm add @emplugins/emprivacy
# or
npm install @emplugins/emprivacy
```

Peer dependency: **`emdash ^1.0.1`** on your EmDash site.

Upstream: [emdash-cms/emdash](https://github.com/emdash-cms/emdash)
