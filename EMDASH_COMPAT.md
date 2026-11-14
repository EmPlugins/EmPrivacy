# EmDash compatibility — EmPrivacy

| @emplugins/emprivacy | Min EmDash (peer) | CI-tested EmDash | Notes |
|----------------------|-------------------|------------------|-------|
| **3.x** (current) | `^1.0.1` | `1.0.1`, `1.5.0` | Native plugin (`createPlugin`); register in `plugins: []` for `page:fragments`. EmDash 0.x is not supported. CI runs the peer floor and the latest tested release. |

EmPrivacy 2.x was the last release for EmDash 0.38. It is not updated for EmDash 1.0.

On EmDash 1.2 and newer, two host behaviors reach this plugin without an API change:

- `plugin:install` runs once for a plugin registered in `plugins: []`. EmPrivacy writes default settings only when none are stored.
- `ctx.url()` follows the configured site origin. Root-relative privacy and cookie policy paths in the banner use that origin after the server restarts.

On EmDash 1.5 and newer, still with peer `emdash@^1.0.1`:

- Columns and Cover render nested embed blocks with plugin `blockComponents`. Register EmPrivacy after `@emdash-cms/plugin-embeds` so those embeds stay placeholders until consent. A `<PortableText components>` prop on the page does not apply inside those blocks.
- The admin Plugins list shows `displayName` and `description`. Older EmDash versions ignore those fields.
- Bluesky placeholders accept `https://bsky.app`, `https://staging.bsky.app`, and `at://` post URIs, including `did:plc:` profiles. After consent the block is a link to that post. EmPrivacy does not load `embed.bsky.app`.

## When EmDash releases

**Preferred (agent):** In Cursor, say `update to latest emdash release`. The [emdash-release skill](.cursor/skills/emdash-release/SKILL.md) bumps deps/CI/docs, runs `pnpm emdash:conformance`, merges the compat PR and Version Packages PR, and publishes with npm trusted publishing.

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
