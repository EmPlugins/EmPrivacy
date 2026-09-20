<!-- SPDX-License-Identifier: MIT -->

# Testing EmPrivacy before deploy

Testing is split into **automated** checks (CI-friendly) and **manual** checks that require a running EmDash site.

## Automated (in this repo)

| Command | What it verifies |
|--------|-------------------|
| `pnpm run typecheck` | TypeScript types against `emdash` APIs |
| `pnpm run build` | Bundles ESM + declarations (`dist/`) |
| `pnpm test` | Config validation, security helpers (embed/script allowlists, CSRF Origin/Sec-Fetch-Site, cookie TTL, SRI), i18n, theme hex, vendor list (no token leak; GTM=marketing), JSON escaping |

These scripts do **not** start EmDash or drive a browser.

## Manual integration QA (required before production)

Use a **staging** EmDash Astro app on **`emdash@^0.38.0`** with `emprivacyPlugin()` in **`plugins: []`**, layout wires (`EmDashHead` / body components with page context), and the same EmDash version you plan to ship.

### Core flows

1. **Banner** — Incognito: banner appears with no `emprivacy_cc` cookie, when **Policy / consent version** does not match `v`, or when a legacy cookie lacks `f`.
2. **Categories** — Customize shows Essential (locked on), Functional, Analytics, Marketing. Reject non-essential: no configured analytics/marketing scripts in Network; embeds stay placeholders.
3. **Re-open** — Cookie button (bottom-left). Save reloads. Turning a category off removes those scripts after reload.
4. **Presets** — For the platform you ship, confirm the expected host loads only after the correct category (Analytics for most presets; **Marketing** for GTM). Custom/marketing scripts must respect any host allowlist.
5. **Evil embed plant** — In DevTools, add a placeholder with `data-src="https://evil.example/x"` and grant marketing; assert no iframe is created.
6. **Embed unlock** — “Allow embeds and load” opens preferences; it must not silently flip categories.
7. **Embeds** — With `@emdash-cms/plugin-embeds` and EmPrivacy last (or site-level `blockComponents`): a YouTube block is a placeholder first; after allowing the embed category, the iframe `src` is `https://www.youtube-nocookie.com/embed/…`. A junk/javascript URL never becomes an iframe.
8. **API** — After a choice, `window.emprivacy.get()` returns state; `window.emprivacy.has("analytics")` matches Network.
9. **i18n** — A `de` (or `fr`) page shows translated buttons when that locale is active.
10. **Policy pages** — `/privacy` does not show the first-visit overlay when that setting is on; the cookie button still works.
11. **Admin** — Save persists; **What this site uses** matches vendors; tokens do not appear there or at `/_emdash/api/plugins/emprivacy/vendors`.
12. **Optional server log** — POST requires matching Origin or `Sec-Fetch-Site: same-origin`; Origin mismatch is 403. Body includes `functional`.
13. **Optional Google Consent Mode** — Denied defaults in `<head>` before interaction, including `functionality_storage`.

### Regression triggers

- Bump EmDash minor: re-run manual QA.
- Cookie JSON or embed allowlist changes: re-check banner, `window.emprivacy`, and a YouTube block.

## CI suggestion

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
pnpm test
```

For most teams, **automated unit tests + staging manual QA** is the right balance.
