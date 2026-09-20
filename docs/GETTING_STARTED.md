<!-- SPDX-License-Identifier: MIT -->

# Getting started with EmPrivacy

This guide is for **EmDash site managers** who want cookie consent on a live site without reading plugin source.

## What you get

- A **banner** on first visit (or after you change **Policy / consent version**, or after an upgrade that adds the functional category).
- Toggles for **Functional**, **Analytics**, and **Marketing**. Essential cookies stay on.
- **Privacy and cookie policy links** you control (EmDash Page path or `https://`).
- Analytics presets (Cloudflare, Plausible, Fathom, Umami, Simple Analytics, GA4, GTM under Marketing) plus Custom / None.
- Optional **gated embeds** for official EmDash YouTube / Vimeo / social / Gist blocks.
- A **vendor list** generated from your settings.

## What you still do yourself

- Write and publish the privacy policy (and cookie policy if you use one).
- Keep third-party scripts **out of the theme** unless they go through EmPrivacy or `window.emprivacy.has(...)`.
- Decide whether embeds are **Marketing** (default, typical for YouTube) or **Functional**.

## Before you begin

1. An EmDash site on **`emdash@^0.38.0`** with the EmDash Astro integration in `astro.config`.
2. Ability to edit **`astro.config`** and redeploy (or run locally).
3. Register EmPrivacy as a **native** plugin (`plugins: []`, not `sandboxed: []`).

---

## Step 1 — Install the package

```bash
pnpm add @emplugins/emprivacy
# or
npm install @emplugins/emprivacy
```

Pin a line with a range such as `@emplugins/emprivacy@^1.0.0`. See [RELEASES.md](./RELEASES.md).

---

## Step 2 — Add the plugin to Astro

```ts
import emdash from "emdash/astro";
import { emprivacyPlugin } from "@emplugins/emprivacy";

export default defineConfig({
  integrations: [
    emdash({
      plugins: [
        emprivacyPlugin(),
        // ...other native plugins
      ],
    }),
  ],
});
```

Do **not** put it in `sandboxed: []`.

### Registration order

| Goal | Where to put `emprivacyPlugin()` |
|------|----------------------------------|
| Google Consent Mode before other head tags | **First** in `plugins` |
| Automatic placeholders for `@emdash-cms/plugin-embeds` | **After** the embeds plugin (last wins) |
| Both | First in `plugins`, and pass `@emplugins/emprivacy/astro` `blockComponents` into `<PortableText />` (site components always win) |

---

## Step 3 — Layout must include EmDash hooks

Your base layout must include `<EmDashHead page={page} />`, `<EmDashBodyStart page={page} />`, and `<EmDashBodyEnd page={page} />`, usually with `createPublicPageContext` from `emdash/page`. Otherwise the banner will not render.

---

## Step 4 — Create the legal Pages

1. Create and **publish** a Page for your privacy policy. Open it on the public site and copy the path (`/privacy`).
2. Optional: a cookie policy Page (`/cookies`).
3. In EmPrivacy settings, paste those paths (or full `https://` URLs).

**Not accepted:** `http://`, bare hostnames, or `//example.com/...`.

---

## Step 5 — Configure in the admin

1. Log into **site admin** → shield → **EmPrivacy**.
2. Set banner title / short notice, policy paths, and **Policy / consent version**.
3. Choose an **Analytics platform** and fill the matching ID or token. Leave it on **None** if you do not use analytics.
4. Optional: marketing script URLs (one `https://` `src` per line — never a `<script>` tag).
5. Optional: gate embeds; pick Functional vs Marketing.
6. Optional: hex theme colors, locale JSON overrides, Google Consent Mode, server log.
7. **Save settings**.

The **What this site uses** table on the same page is generated from the saved config. You can copy it into the cookie policy. Tokens are never listed.

---

## Step 6 — Verify on the public site

1. Incognito window (or clear `emprivacy_cc`).
2. Banner appears. **Reject non-essential**: no analytics/marketing scripts in Network; embed placeholders stay placeholders.
3. **Accept all** (or Customize): scripts for allowed categories load; YouTube/Vimeo iframes use allowlisted player hosts after consent.
4. Privacy / cookie links open the correct Page.
5. Cookie button (bottom-left) reopens the panel. Saving reloads.
6. Optional: `window.emprivacy.get()` in the console returns the current state.

---

## Using the public API in a theme

```js
if (window.emprivacy?.has("analytics")) {
  // load a first-party or plugin script you own
}
window.emprivacy?.onChange((state) => {
  if (state.marketing) {
    // …
  }
});
```

Do not read `emprivacy_cc` yourself. The JSON shape can change with a major release.

---

## Common problems

| Problem | What to check |
|--------|----------------|
| Nothing appears | Layout missing head/body components; plugin not in `plugins: []`; server not restarted |
| Scripts load before consent | Theme still contains tracker snippets; another plugin is listed **before** EmPrivacy and injects tags immediately |
| YouTube still loads immediately | Embeds plugin is registered **after** EmPrivacy, so its renderers win. Move EmPrivacy last or pass `blockComponents` on `PortableText`. |
| Embeds stay blocked after accept | Category is Marketing but you only enabled Functional (or the reverse). |
| Save fails on policy URL | Must be `/path` or `https://…` |
| Save fails on analytics ID | Plausible wants `example.com` (no scheme). GA4 wants `G-…`. GTM wants `GTM-…`. Umami needs an https script URL. |
| Privacy link 404 | Path must match the live Page route |

---

## More reading

- Main **[README](../README.md)** — does / does not, disclaimer, API
- **[PLUGIN_SETTINGS.md](./PLUGIN_SETTINGS.md)** — every admin field
- **[TESTING.md](./TESTING.md)** — staging QA
