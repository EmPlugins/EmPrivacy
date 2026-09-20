<!-- SPDX-License-Identifier: MIT -->

# EmPrivacy — Plugin settings reference

Every field on **EmPrivacy** (shield → **EmPrivacy**) in the EmDash admin.

EmPrivacy is a technical consent tool, not legal advice. You are responsible for matching categories and vendors to your privacy/cookie policies.

---

## Plugin version

- **Installed version**: the release running on this site
- **Latest on npm**: current [`@emplugins/emprivacy`](https://www.npmjs.com/package/@emplugins/emprivacy)

The rest of the page still loads if npm cannot be reached.

---

## Banner copy and language

### Banner title / Short notice (fallback locale)

Visible heading and body. Applied with `textContent` only (no HTML). Max 120 / 600 characters.

### Fallback locale code

Used when the page has no locale or no built-in chrome pack. Example: `en`. Button labels ship for `en`, `de`, `fr`, `es`, `it`, `nl`, `pt`, `pl` (including `pt-BR` → `pt`).

### Optional title/message translations (JSON)

```json
{
  "de": {
    "bannerTitle": "Cookies & Datenschutz",
    "bannerMessage": "Wir verwenden Cookies, um die Website zu betreiben."
  }
}
```

Keys must look like `en` or `pt-BR`. At most 32 locales. Invalid JSON is rejected on save.

---

## Policy links

### Privacy policy — EmDash Page path or https URL

Required. `/privacy` or `https://example.com/privacy`. Not `http://`, not `example.com/privacy`, not `//…`.

### Cookie policy (optional)

Same rules. Blank = no extra link.

Paths are resolved with EmDash `ctx.url()` so they stay correct across environments.

---

## Consent versioning

### Policy / consent version

Stored in the cookie as `v`. Change it when legal text or vendors change so returning visitors are asked again.

The cookie is JSON `{ v, f, a, m }`. Cookies from older EmPrivacy releases that omit `f` are treated as missing, so the banner shows once after you upgrade.

---

## Defaults and consent UX

### Strict defaults

On: Functional, Analytics, and Marketing start **unchecked**. Off: they start **checked** (opt-out style). Stored choices always win after the first save.

### Hide the first-visit banner on privacy and cookie policy pages

On (default): visitors who open `/privacy` from the banner can read it without another overlay. The cookie button still appears so they can change choices.

---

## Analytics platform

Scripts for **Analytics** presets load only after **Analytics** consent — except **Google Tag Manager**, which loads only after **Marketing** consent (containers commonly fire ads and remarketing).

| Value | What you enter | What loads |
|-------|----------------|------------|
| Cloudflare Web Analytics | Site token | `beacon.min.js` + `data-cf-beacon` |
| Plausible | Hostname `example.com` (no `https://`) | `https://plausible.io/js/script.js` with `data-domain` |
| Fathom | Site ID (letters/digits) | `https://cdn.usefathom.com/script.js` with `data-site` |
| Umami | Website ID **and** https script URL | Your tracker URL with `data-website-id` |
| Simple Analytics | Optional hostname | `https://scripts.simpleanalyticscdn.com/latest.js` |
| Google Analytics 4 | `G-…` measurement ID | `https://www.googletagmanager.com/gtag/js?id=…` then `gtag('config', …)` |
| Google Tag Manager | `GTM-…` | `https://www.googletagmanager.com/gtm.js?id=…` after **Marketing** consent. Tags inside the container are still your responsibility. |
| None | — | No analytics scripts |
| Custom | One https script `src` per line (optional trailing SRI) | Those URLs only |

IDs and URLs are validated on save and again in the browser before inject. Tokens are never shown in the public vendor list.

### Script host allowlist (optional)

One hostname per line (e.g. `cdn.example.com`). When non-empty, **Custom** analytics, **Umami**, and **Marketing** script hosts must appear on the list. Built-in preset CDNs (Plausible, Fathom, GTM, etc.) stay allowed for their presets.

### Optional Subresource Integrity (SRI)

Append a hash after the URL on Custom or Marketing lines:

```
https://cdn.example/a.js sha384-…
https://cdn.example/b.js integrity=sha256-…
```

The browser sets `integrity` + `crossorigin=anonymous` when the hash is valid. Prefer pinning Custom scripts; many preset CDNs do not publish stable hashes.

---

## Marketing scripts

One **https** URL per line, `src` only (optional SRI as above). Loaded after **Marketing** consent. Max 50 lines, 2048 characters each. No HTML.

---

## Google Consent Mode v2

When enabled, a denied-by-default snippet runs in `<head>` (`analytics_storage`, `ad_*`, `functionality_storage`, `personalization_storage`). After a choice, EmPrivacy calls `gtag('consent','update', …)`. `security_storage` stays granted. Validate with [Google’s docs](https://support.google.com/tagmanager/answer/13695607).

Put EmPrivacy **first** in `plugins` if other plugins also inject Google tags.

---

## Embeds

### Gate official EmDash embed blocks

When on (default), EmPrivacy’s Portable Text components replace YouTube, Vimeo, tweet, Bluesky, Mastodon, Gist, and link-preview blocks with a placeholder until the selected category is allowed.

YouTube / Vimeo become allowlisted iframes (`youtube-nocookie.com`, `player.vimeo.com`). Social posts, Gists, and link previews become **https links** — EmPrivacy will not iframe an arbitrary Mastodon or unknown host.

This does **not** rewrite raw HTML `<iframe>` tags you paste in the theme or in an HTML block.

### Embeds require this category

**Marketing** (default) or **Functional**. Pick Marketing for YouTube/social if those vendors set advertising cookies.

**Allow embeds and load** opens the cookie preferences panel with a short hint. It does **not** silently grant Functional or Marketing.

Registration order: see [GETTING_STARTED](./GETTING_STARTED.md#registration-order).

---

## Consent cookie lifetime

### Consent cookie lifetime (days)

`Max-Age` for `emprivacy_cc`, **1–365**, default **180**. Keep this aligned with how long you need to remember a choice under your policy.

---

## Theme

Hex colors only (`#111`, `#111111`). Corner radius is an integer **0–24**. Values become CSS variables on `#emprivacy-root`. Other CSS is ignored (no `url()`, no `expression`).

---

## Server-side logging

When enabled, each save POSTs `{ policyVersion, functional, analytics, marketing }` to `/_emdash/api/plugins/emprivacy/record` (same origin, JSON). The handler requires a matching `Origin` **or** `Sec-Fetch-Site: same-origin`, fails closed if storage capacity cannot be checked, and rate-limits anonymous clients (~30/hour fingerprint). No IP is stored in the consent row. The page shows up to 15 recent rows. Logging stops at 500 rows.

---

## Content Security Policy

EmPrivacy injects an **inline** bootstrap via EmDash `page:fragments`. Sites with a strict CSP must allow that script, typically:

- `script-src 'unsafe-inline'` (or a hash/nonce of the emitted bootstrap if your host supports it), and
- `script-src` / `connect-src` / `frame-src` entries for any presets and gated embeds you enable (e.g. `https://plausible.io`, `https://www.youtube-nocookie.com`, `https://player.vimeo.com`).

YouTube/Vimeo placeholders use a tight iframe `sandbox` (`allow-scripts allow-same-origin allow-presentation`) after consent. Client hydration also re-checks allowlisted `data-src` values so a planted evil URL cannot become an iframe.

A future hashed static bootstrap (no `'unsafe-inline'`) depends on EmDash fragment APIs exposing nonces or external script URLs.

---

## What this site uses

Read-only table generated from the saved config. Same data as `GET /_emdash/api/plugins/emprivacy/vendors`. Use it in your cookie policy. It never includes tokens or measurement IDs.
