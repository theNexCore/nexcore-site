# NexCore — thenexcore.com

Next.js (App Router) + TypeScript + Tailwind. Migrated from Weebly, deploys to Vercel.

Phase 1 audit: [`audit/PHASE1.md`](audit/PHASE1.md)
Approved events schema: [`audit/EVENTS-SHEET-SCHEMA.md`](audit/EVENTS-SHEET-SCHEMA.md)

---

## Running it

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
npm run typecheck
```

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Origin for canonical, OG, and JSON-LD absolute URLs |
| `EVENTS_FEED_URL` | yes | Apps Script endpoint backing the events Sheet |
| `AVAILABILITY_URL` | no | Room availability lookup (coworking) |
| `RESEND_API_KEY` | **yes, to send mail** | Resend API key |
| `FORM_TO_EMAIL` | yes | Where form submissions land |
| `FORM_FROM_EMAIL` | yes | Verified Resend sender |
| `FORMS_SHEET_MIRROR_URL` | no | Mirrors submissions to the existing Sheet. Recommended ON |
| `NEXT_PUBLIC_GA4_ID` | no | GA4 measurement ID. Analytics renders nothing when unset |

**Forms fail loudly if Resend is unconfigured in production** and log to the console in development, so local work never needs a key.

---

## Architecture

```
src/
  app/           routes, server actions (actions.ts), sitemap.ts, robots.ts
  components/    Button, Section, Container, Header, Footer, SectionNav,
                 form/*, events/*
  data/          typed content — site, nav, coworking, memberships,
                 history, impact, founder-letter, gallery, image-sizes.json
  lib/           events.ts (feed + ISR), forms.ts, rate-limit.ts, seo.ts, img.ts
public/
  img/           309 raster assets pulled from Weebly, renamed lowercase-hyphen
  logo/          16 vectors recovered from inline base64 SVG in the old markup
```

No CMS. All content lives in typed files under `src/data`, except events.

### Events

The page opens with the full events.html narrative (`src/data/events-copy.ts`) — intro, the six Ways In, the 27 event-kind tags, the idea CTA, and Signature Events — with the merged calendar beneath it under "Stay connected with everything happening at NexCore."

`src/lib/events.ts` fetches the Sheet-backed Apps Script feed **at build time and via ISR (`revalidate: 300`)** — never per request.

It implements the approved schema (recurrence, series, location types, price, summary, slug) and is **deliberately tolerant of the current sheet**, deriving new fields from the legacy columns so the site is correct before the columns are backfilled:

- `startTS` derived from `timeRange` when the column is absent
- `priceLabel` / `priceValue` derived from the old `type` column
- `summary` truncated from `desc` at 160 chars
- `locationType` defaults to `nexcore`, so `Event` JSON-LD always has a valid `location`

Recurring rows expand to occurrences capped **8 weeks ahead**. Events move to Past automatically once `endTS` passes.

**Ticketing is Eventbrite, as outbound links only.** No iframes, no `checkout-external`. `frame-src 'none'` in the CSP enforces this.

**Image repair.** Four sheet rows hold URLs copied from Eventbrite's own image optimiser (`eventbrite.com/e/_next/image?url=…`). `repairImageUrl()` unwraps them, then rejects `evbuc.com`/`eventbrite.com` hosts because that CDN returns 403 to every origin — verified in a real browser. Those events render a branded fallback (`EventArt`) instead of a broken image.

### Forms

Five server actions in `src/app/actions.ts`, all through one pipeline:

**rate limit → bot check → Zod validation → deliver**

- Honeypot field (`company_website`) plus a sub-2-second timing trap. Honeypot hits get a success-shaped response so bots learn nothing.
- Zod schemas with length caps; the client never decides validity.
- 5 submissions per IP per 10 minutes. In-memory and per-instance — swap `lib/rate-limit.ts` for KV if volume ever justifies it; `check()` keeps its signature.
- Resend is the system of record. The Sheet mirror is best-effort and never blocks a submission.

### SEO

Unique title and description on every route, absolute canonical/OG/Twitter URLs, `sitemap.xml` and `robots.txt` generated. `Organization` + `LocalBusiness` + `WebSite` JSON-LD in the root layout; `Event` JSON-LD on event pages.

### Security headers

CSP, HSTS (2 years, preload), `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. `X-Powered-By` removed.

### Redirects

22 rules in `next.config.mjs`, all **`statusCode: 301`** — not `permanent: true`, which Next emits as 308.

---

## Conventions

- **No `text-transform: uppercase`.** Capitalised text is literal caps in the markup.
- **Accent spans use `class="o"`** → `#27AAE2`. Defined once in `globals.css`.
- **Absolute URLs** for every canonical, OG, and schema field, via `abs()` in `src/data/site.ts`.
- **Every `<Image>` carries explicit `width`/`height`** — local assets read from `src/data/image-sizes.json` through `dim()`.
- Reusable `Button`/`ButtonLink`, `Section`, `Container`, `Card`-style components.

## Design tokens

Extracted from the live site and verified by usage count (see `audit/PHASE1.md` §3). Two brand values were corrected against real usage:

- dark surface is **`#001018`** (85 uses), not `#0F1318` (3)
- workhorse light surface is **`#E7ECF3`** (24), not `#F6F7F9` (4)

Fonts: **Sora** (400/500/600/700) and **Inter** (400/500/600) via `next/font`.

---

## Verification performed

- Production build: **47 routes**, TypeScript clean.
- **All 22 redirects return 301** with correct targets.
- All six security headers present; `X-Powered-By` absent.
- 21 routes checked: **0 missing/duplicate titles or descriptions**, all canonical/OG absolute.
- JSON-LD validated: Organization, LocalBusiness, WebSite, and Event (no required fields missing).
- **148 rendered images, 0 missing explicit dimensions.**
- **Every page tested at 390px in headless Chrome — no horizontal scroll, no overflowing elements, exactly one `h1` per page.**
- Honeypot, timing trap, validation, oversize rejection, and per-IP rate limiting unit-tested.

## Before DNS cutover

1. **Legal review** — `/terms` and `/privacy` are new first-party drafts replacing links that pointed at Thryv's boilerplate. Both carry a `REVIEW REQUIRED` comment. Jim or counsel must confirm.
2. Set `RESEND_API_KEY`, `FORM_TO_EMAIL`, `FORM_FROM_EMAIL` in Vercel and verify the sending domain.
3. Configure **apex → www** in Vercel; the Weebly site already 301s that way.
4. Sheet fixes are tracked in `audit/EVENTS-SHEET-SCHEMA.md` (Night 2 ticket URL, two dead images, `startTS` backfill).
