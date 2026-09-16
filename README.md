# NexCore — thenexcore.com

Next.js (App Router) + TypeScript + Tailwind. Migrated from Weebly, deploys to Vercel.

Phase 1 audit: [`audit/PHASE1.md`](audit/PHASE1.md)

---

## Running it

```bash
npm install
cp .env.example .env.local     # then fill in the values below
npm run dev                    # http://localhost:3000
npm run build && npm start     # production
npm run typecheck
npm run images                 # list member/event images missing from public/
```

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Origin for canonical, OG, and JSON-LD absolute URLs |
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
                 history, impact, founder-letter, gallery, image-sizes.json,
                 members, events, local-images.json (generated)
  lib/           events-server.ts, members-server.ts, forms.ts, rate-limit.ts,
                 seo.ts, img.ts
scripts/
  images.ts      measures member/event images, writes local-images.json,
                 lists missing files (runs on predev and prebuild)
public/
  img/           309 raster assets pulled from Weebly, renamed lowercase-hyphen
  logo/          16 vectors recovered from inline base64 SVG in the old markup
```

No CMS. All content lives in typed files under `src/data`, including events and members.

### Events

The page opens with the full events.html narrative (`src/data/events-copy.ts`) — intro, the six Ways In, the 27 event-kind tags, the idea CTA, and Signature Events — with the merged calendar beneath it under "Stay connected with everything happening at NexCore."

Events live in `src/data/events.ts`; the format, including recurring events, is documented at the top of that file. `src/lib/events-server.ts` reads it and the page regenerates via ISR (`revalidate: 300`) so the calendar rolls forward.

- A one-off event has `start` / `end`; a recurring one adds `repeat` (daily / weekly / monthly, weekdays, nth weekday, `until`, `count`) plus optional `skip` dates, expanded with `rrule`
- Times are NexCore wall-clock (America/Chicago)
- `summary` defaults to `desc` truncated at 160 chars; `priceLabel` defaults to Free
- `locationType` defaults to `nexcore`, so `Event` JSON-LD always has a valid `location`

Recurring events expand to occurrences capped **8 weeks ahead**, each at `/events/<slug>-<date>`. Events move to Past automatically once `end` passes.

### Members

Members live in `src/data/members.ts`, read only by the server-only `src/lib/members-server.ts` (the file holds raw emails, which are obfuscated before reaching the page).

### Images

Member logos/headshots go in `public/members/` (`company-name-logo.png`, `firstname-lastname.jpg`), event images in `public/events/` (`event-name.jpg`). `npm run images` lists every referenced file that is missing; until a file exists, the page shows the branded placeholder.

**Ticketing is Eventbrite, as outbound links only.** No iframes, no `checkout-external`. `frame-src 'none'` in the CSP enforces this.

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

## Deployment

GitHub is the source of truth; Vercel builds from it. Pushes to `main`
deploy automatically — no local upload.

- Repo: https://github.com/theNexCore/nexcore-site
- Staging: https://nexcore-site-omega.vercel.app (vercel.app only; DNS untouched)

## Before DNS cutover

1. ~~**Legal review**~~ — done. `/terms` and `/privacy` are first-party pages replacing links that pointed at Thryv's boilerplate. Facts confirmed by Jim and approved by counsel, 2026-08-26.
   Two commitments now need upkeep rather than review: the stated **24-month retention** is not enforced by any code, so old enquiries must actually be deleted from the inbox and the mirrored Sheet; and the "no advertising cookies" line holds only while `NEXT_PUBLIC_GA4_ID` is unset.
2. Set `RESEND_API_KEY`, `FORM_TO_EMAIL`, `FORM_FROM_EMAIL` in Vercel and verify the sending domain.
3. Configure **apex → www** in Vercel; the Weebly site already 301s that way.
4. Changemakers27 Night 2's ticket link in `src/data/events.ts` still points at the Night 3 Eventbrite page.
