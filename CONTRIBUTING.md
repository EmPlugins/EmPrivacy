<!-- SPDX-License-Identifier: MIT -->

# Contributing to EmPrivacy

Thanks for helping improve EmPrivacy.

Use **[github.com/EmPlugins/EmPrivacy](https://github.com/EmPlugins/EmPrivacy)** for issues and pull requests.

## Licensing and sign-offs

### SPDX headers in new files

Any **new source file** should include an SPDX short identifier for the MIT license at the top of the file:

```text
SPDX-License-Identifier: MIT
```

### DCO sign-off on commits

All commits should include a **DCO Signed-off-by** line. Create commits using the `-s` flag:

```bash
git commit -s -m "feat: describe the change"
```

## Principles

- Scope: native `page:fragments` CMP, KV-backed admin (Block Kit), no arbitrary admin HTML execution on the public site (see the main [README](./README.md#requirements) and [docs/TESTING.md](./docs/TESTING.md)).
- Match EmDash’s [native plugin](https://docs.emdashcms.com/plugins/creating-native-plugins/your-first-native-plugin/) layout: `emprivacyPlugin()` descriptor (`format: "native"`) + named `createPlugin()` / `definePlugin()` runtime.
- Keep the default surface small: do not add `network:request` unless a feature truly needs it.

## Local setup

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

Target **EmDash `^0.38.0`** and **Node.js `>= 22.16`**. Package name: **`@emplugins/emprivacy`**.

## Pull requests

1. Describe the behavior change and how you tested it (EmDash version, native `plugins: []`).
2. Run `pnpm run typecheck`, `pnpm run build`, and `pnpm test` before pushing.
3. Keep commits focused; avoid unrelated formatting changes.

## Releases (maintainers)

npm versions use **semver** via Changesets; workflow: [docs/RELEASES.md](./docs/RELEASES.md).

## Security

- Never inject unsanitized admin strings into `innerHTML` in the public bootstrap; use `textContent` / JSON config as we do now.
- Script URLs must remain **https-only** and validated on save.
