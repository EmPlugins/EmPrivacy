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

### Banner position

**Bottom of the viewport** (default) or **Top of the viewport**. The banner is `position: fixed`, so it stays on that edge while the page scrolls. EmDash still inserts the markup through `EmDashBodyEnd` (`body:end`). `body:start` would not move a fixed banner. Padding includes `env(safe-area-inset-top)` or `env(safe-area-inset-bottom)` so the bar clears a notch or home indicator. The reopen button stays at the bottom-left.

Saved settings without this field keep the bottom banner.

---

## Analytics platform

Scripts for **Analytics** presets load only after **Analytics** consent — except **Google Tag Manager** and **Microsoft UET**, which load only after **Marketing** consent (those tags commonly fire ads and remarketing).

| Value | What you enter | What loads |
|-------|----------------|------------|
| Cloudflare Web Analytics | Site token | `beacon.min.js` + `data-cf-beacon` |
| Plausible | Hostname `example.com` (no `https://`) | `https://plausible.io/js/script.js` with `data-domain` |
| Fathom | Site ID (letters/digits) | `https://cdn.usefathom.com/script.js` with `data-site` |
| Umami | Website ID **and** https script URL | Your tracker URL with `data-website-id` |
| Simple Analytics | Optional hostname | `https://scripts.simpleanalyticscdn.com/latest.js` |
| Google Analytics 4 | `G-…` measurement ID | `https://www.googletagmanager.com/gtag/js?id=…` then `gtag('config', …)` |
| Google Tag Manager | `GTM-…` | `https://www.googletagmanager.com/gtm.js?id=…` after **Marketing** consent. Tags inside the container are still your responsibility. |
| Microsoft Clarity | Project ID, 7–20 letters or digits | `https://www.clarity.ms/tag/…` after **Analytics** consent. A denied `consentv2` signal is queued in `<head>` first. `ad_Storage` stays denied until Marketing is also allowed. |
| Microsoft UET | Tag ID, 6–12 digits | `https://bat.bing.com/bat.js` after **Marketing** consent. `ad_storage` defaults to denied in `<head>`. The tag is not injected before that consent. Automatic SPA tracking is off. |
| None | — | No analytics scripts |
| Custom | One https script `src` per line (optional trailing SRI) | Those URLs only |

IDs and URLs are validated on save and again in the browser before inject. Tokens are never shown in the public vendor list.

### Script host allowlist (optional)

One hostname per line (e.g. `cdn.example.com`). When non-empty, **Custom** analytics, **Umami**, and **Marketing** script hosts must appear on the list. Built-in preset CDNs (Plausible, Fathom, GTM, Clarity, UET, and so on) stay allowed for their presets.

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

**Banner theme** is one of five profiles, or **Custom colors**. A new install uses **Slate**, the first profile. A saved config with no theme choice also uses Slate. A profile writes that palette’s fixed background, text color, accent, and button radius. Color fields sent with a profile are ignored, so a profile cannot be combined with other CSS.

**Custom colors** opens with the colors already in effect. On Slate, those fields start as `#0f172a`, `#f8fafc`, `#3b82f6`, and 8 px. After a custom save, they show the saved hex values.

| Profile | Background | Text | Accent | Radius |
|---------|------------|------|--------|--------|
| Slate | `#0f172a` | `#f8fafc` | `#3b82f6` | 8 px |
| Paper | `#f7f6f3` | `#37352f` | `#1d4ed8` | 6 px |
| Ink | `#000000` | `#ededed` | `#0070f3` | 8 px |
| Indigo | `#ffffff` | `#0f172a` | `#4f46e5` | 12 px |
| Primer | `#f6f8fa` | `#1f2328` | `#0969da` | 6 px |

**Custom colors** accepts hex only (`#111`, `#111111`, or `#111111ff`). Corner radius is an integer **0–24**. Those values become CSS variables on `#emprivacy-root`. Other CSS is rejected on save (no `url()`, no `expression`). The full-width bar stays square. Radius applies to the buttons.

---

## Global Privacy Control

There is no admin switch. If the browser sets `navigator.globalPrivacyControl`, EmPrivacy treats Marketing as denied for script loading, Google `ad_*` signals, Clarity `ad_Storage`, and UET. Accept all and Save cannot turn Marketing on while the signal is present. The Marketing checkbox is disabled and the banner explains why. Analytics and Functional are unchanged. Visitors can still open preferences.

The choice cookie is not rewritten until the visitor saves. While the signal is on, `window.emprivacy.get()` reports `marketing: false` and `gpc: true` even if an older cookie still has `m: 1`. After the signal is turned off, that saved Marketing choice applies again until they save a new one.

## Known-cookie cleanup

When Analytics or Marketing is denied (including the first visit, before a choice), EmPrivacy expires a **fixed** list of first-party names:

- Analytics: `_ga`, `_gid`, `_gat`, and names starting with `_ga_` or `_gat_`
- Marketing: `_gcl_au`, `_gcl_aw`, `_gcl_dc`, names starting with `_gcl_`, plus Clarity `_clck`, `_clsk`, `CLID` and UET `_uetsid`, `_uetvid`

`emprivacy_cc` is never deleted. Settings cannot add cookie names. Page script cannot clear HttpOnly cookies or cookies set on another site. Expiration uses `Path=/` on the current host and its parent host label.

## Server-side logging

When enabled, each save POSTs `{ policyVersion, functional, analytics, marketing, gpc }` to `/_emdash/api/plugins/emprivacy/record` (same origin, JSON). The handler requires a matching `Origin` **or** `Sec-Fetch-Site: same-origin`, fails closed if storage capacity cannot be checked, and rate-limits anonymous clients (~30/hour fingerprint). No IP is stored in the consent row. If `gpc` is true, the stored `marketing` flag is false. The page shows up to 15 recent rows. Logging stops at 500 rows.

Signed-in admins (the plugin settings permission) can download those rows as CSV from `/_emdash/api/plugins/emprivacy/consent-export`. The file is `Cache-Control: private, no-store`. It has no IP, user agent, or rate-limit fingerprint. A cell that starts with `=`, `+`, `-`, or `@` is prefixed with `'` so a spreadsheet does not run it as a formula. The route is not public. A request without a signed-in user is rejected.

---

## Content Security Policy

EmPrivacy injects an **inline** bootstrap via EmDash `page:fragments`. Sites with a strict CSP must allow that script, typically:

- `script-src 'unsafe-inline'` (or a hash/nonce of the emitted bootstrap if your host supports it), and
- `script-src` / `connect-src` / `frame-src` entries for any presets and gated embeds you enable (e.g. `https://plausible.io`, `https://www.clarity.ms`, `https://bat.bing.com`, `https://www.youtube-nocookie.com`, `https://player.vimeo.com`).

YouTube/Vimeo placeholders use a tight iframe `sandbox` (`allow-scripts allow-same-origin allow-presentation`) after consent. Client hydration also re-checks allowlisted `data-src` values so a planted evil URL cannot become an iframe.

A future hashed static bootstrap (no `'unsafe-inline'`) depends on EmDash fragment APIs exposing nonces or external script URLs.

---

## What this site uses

Read-only table generated from the saved config. Same data as `GET /_emdash/api/plugins/emprivacy/vendors`. Use it in your cookie policy. It never includes tokens or measurement IDs.
