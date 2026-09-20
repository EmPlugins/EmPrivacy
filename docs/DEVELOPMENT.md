<!-- SPDX-License-Identifier: MIT -->

# Development — dependencies and security

## What EmPrivacy ships to npm

Runtime dependencies for the published package are **`zod`** only. **EmDash** is a **peer dependency** (your site installs it). The **`emdash`** package in this repo’s `devDependencies` exists so local `typecheck` and tests can resolve `import … from "emdash"`.

EmPrivacy is a **native** EmDash plugin (`format: "native"`, named `createPlugin()` export), published as **`@emplugins/emprivacy`**. It must be registered in `plugins: []` because it uses `page:fragments`. The `./astro` export ships Portable Text embed placeholders (compiled by the host Astro app, not by `tsdown`).

## Package manager

This repo uses **pnpm** (`packageManager` in `package.json`). Install and CI:

```bash
pnpm install
pnpm run typecheck
pnpm test
pnpm run build
```

## `pnpm audit` and the Kysely override

`pnpm run audit` runs **`pnpm audit --prod`**, so it reflects **published runtime** dependencies only (currently `zod` 4.6.5).

The full install (including the `emdash` **dev** tree) can report transitive advisories from EmDash’s tooling stack. Those are owned by the site’s EmDash upgrade path, not by EmPrivacy’s published tarball.

**This repository pins Kysely** via `pnpm.overrides` in `package.json` (currently `0.29.6`, aligned with EmDash 0.38). Regenerate the lockfile with `pnpm install` after changing overrides.

## Deprecation warnings you may still see

`pnpm install` can still print **deprecated** messages for **transitive** packages **not** maintained by this repo (for example native-addon helpers under EmDash’s SQLite stack). Those warnings do not imply that EmPrivacy’s own source is outdated; they track **upstream** `emdash` and its dependencies.
