# PHASE 1 — AUDIT
**thenexcore.com — Weebly → Next.js (App Router) on Vercel**
Prepared for Jim Shelvy · Audit date: 2026-08-26
Crawl source: `https://www.thenexcore.com` · 21 pages fetched · raw HTML in `./audit/raw/`

---

## 0. How this audit was produced

- `sitemap.xml` pulled and parsed → 20 URLs.
- Every URL fetched with `curl` (browser UA), raw HTML saved to `./audit/raw/<slug>.html`.
- **Content was parsed out of raw HTML, not text-extracted.** Nearly all real page copy lives inside
  Weebly *Custom HTML* embeds — `<div class="wcustomhtml">` nested in `<div class="wsite-section-content">`,
  each carrying its own inline `<style>` and `<script>`. A naive text scrape returns almost nothing on
  `coworking`, `contact`, `systems`, `event-calendar`, and `beyond-coworking`.
- One additional live page (`/photo-resources.html`) was found via `robots.txt` — **it is not in the sitemap.**
- Design tokens derived from the embeds' inline CSS **and** the Weebly theme `/files/main_style.css`.
- All Weebly assets downloaded and renamed. Manifest: **`./audit/ASSET-MANIFEST.md`**.

Supporting artifacts written:

| File | Contents |
|---|---|
| `./audit/raw/*.html` | Raw HTML, 21 pages |
| `./audit/extracted/*.txt` | Headings + body copy per page |
| `./audit/extracted/*.embeds.html` | Isolated Custom HTML embeds per page |
| `./audit/assets/` | 304 raster + 16 vector assets (116 MB) |
| `./audit/ASSET-MANIFEST.md` | Original URL → clean filename |
| `./audit/coworking-data.json` | 18 private offices + 6 rentable spaces, structured |
| `./audit/events-feed.json` | Live events feed snapshot (11 events) |
| `./audit/report.json` | Per-page link/image index |

---

## 1. FULL SITEMAP — every URL on the current site

**21 live pages.** `sitemap.xml` lists 20; `/photo-resources.html` is live but unlisted.

| # | URL | Title tag | Meta desc | H1 | Status |
|---|---|---|---|---|---|
| 1 | `/` (= `/index.html`, byte-identical) | NEXCORE - Welcome Home | — none — | The Starting Point For It All | 200 |
| 2 | `/what-is-nexcore.html` | What is NexCore - NEXCORE | — none — | **none** | 200 |
| 3 | `/founder-letter.html` | Founder Letter - NEXCORE | — none — | **none** | 200 |
| 4 | `/our-philosophy.html` | Our Philosophy - NEXCORE | — none — | Why We're Different | 200 |
| 5 | `/history.html` | History - NEXCORE | — none — | How One Place Changed So Many | 200 |
| 6 | `/why-it-exists.html` | Why It Exists - NEXCORE | — none — | **none** | 200 |
| 7 | `/impact.html` | Impact - NEXCORE | — none — | Impact | 200 |
| 8 | `/bragging-rights.html` | Bragging Rights - NEXCORE | — none — | The Numbers Behind The Work | 200 |
| 9 | `/in-the-news.html` | In The News - NEXCORE | — none — | The Coverage | 200 |
| 10 | `/the-nexcore-foundation.html` | The NexCore Foundation - NEXCORE | — none — | **none** | 200 (stub) |
| 11 | `/coworking.html` | Coworking - NEXCORE | — none — | **none** | 200 |
| 12 | `/beyond-coworking.html` | Beyond Coworking - NEXCORE | — none — | **none** | 200 |
| 13 | `/systems.html` | Systems - NEXCORE | — none — | How We Build | 200 |
| 14 | `/community.html` | Community - NEXCORE | — none — | A Seat at the Table | 200 |
| 15 | `/events.html` | Events - NEXCORE | — none — | **none** | 200 |
| 16 | `/event-calendar.html` | Event Calendar - NEXCORE | — none — | **none** | 200 |
| 17 | `/event-photo-gallery.html` | Event Photo Gallery - NEXCORE | — none — | **none** | 200 |
| 18 | `/event-graphics.html` | Event Graphics - NEXCORE | — none — | **none** | 200 — **EMPTY** |
| 19 | `/contact.html` | Contact - NEXCORE | — none — | **none** | 200 |
| 20 | `/member-login.html` | This area is password protected [401] | — | — | **401 gate** |
| 21 | `/photo-resources.html` | Photo Resources - NEXCORE | — none — | Powering what's next | 200 — **unlisted, robots-disallowed** |

### Findings

- **Zero meta descriptions across the entire site.** Every page. Google is writing its own snippets today.
- **9 of 20 content pages have no `<h1>`.** On `what-is-nexcore` and others, headings are `<div class="ncx6-title">` — styled divs, semantically invisible.
- **Every title is `X - NEXCORE`** — no keyword or location value.
- `/event-graphics.html` renders **nothing but the footer**. Scratch page, indexed.
- `/member-login.html` returns a Weebly **401 password gate**. Content not retrievable; robots-disallowed.
- `/photo-resources.html` is an **internal photo library + a post-event recap letter**, publicly reachable but robots-disallowed.
- Apex already 301s to `www` (`https://thenexcore.com/` → `https://www.thenexcore.com/`). Must be preserved on Vercel.

### Current navigation IA

```
Welcome Home (/)
  └ Member Login
What is NexCore
  ├ Founder Letter    ├ Our Philosophy   ├ History      ├ Why It Exists
  ├ Impact            ├ Bragging Rights  ├ In The News  └ The NexCore Foundation
Coworking
  ├ Memberships (#memberships)       ├ Buy a Pass (#day-pass)
  ├ Rent an Office (#offices-anchor) └ Book A Space (#rentable-anchor)
Beyond Coworking
  ├ Systems  ├ Community  ├ Events  ├ Event Calendar
  ├ Host an Event (→ coworking#rentable-anchor)  └ Event Photo Gallery
Contact
```

`/event-graphics.html` and `/photo-resources.html` are **orphans** — in no menu.

---

## 2. CONTENT INVENTORY

Site-wide NAP, repeated in the footer of all 20 rendering pages:

- **NexCore CoWorking** — 314.433.9330
- **NexCore Solutions** — 314.433.9550
- **Email** — hello@thenexcore.com *(Cloudflare-obfuscated as `[email protected]` in source)*
- **Address** — 11820 Tesson Ferry Road, Ste 1000, St. Louis, MO 63128
- **Directions** — `https://maps.app.goo.gl/aEBwvNjvnYjM1cgB9`
- **Footer legal** — copyright notice + "Terms of Use | Privacy Policy" + "Site powered by NexCore"

| Page | Copy summary | Assets | Interactive |
|---|---|---|---|
| **/** | Promo modal ($50 August special); hero "The Starting Point / For It All"; "Why NexCore Exists" expandable long-form; "ANCHORED IN SOUTH COUNTY / More Than a Building"; "Where To Begin — One ecosystem. Two ways in." → Coworking / Beyond Coworking | 13 imgs, 14 embedded SVGs | Promo modal, expand/collapse story |
| **/what-is-nexcore.html** | "What is NexCore? It's where the answers begin to appear." Ecosystem narrative — workspace→community→access→learning→systems→opportunities. Six pillars: Spaces, People, Access, Systems, Learning, Opportunities | 21 imgs | Scroll/reveal; titles are divs not headings |
| **/founder-letter.html** | Long-form letter from Jim Shelvy (~8.8k chars) — the single largest body of prose on the site | 4 imgs | — |
| **/our-philosophy.html** | "Why We're Different / Hard-earned operating principles." Seven: Borrow My Mistakes, Focus10, BusinessGPS, Mastering the Spin, The Art of the Pivot, The Ecosystem Mindset, BusinessGPS Weekly | 4 imgs | — |
| **/history.html** | "How One Place Changed So Many" — 15-stop timeline, NexCore Opens Its Doors (2017) → NexCore Opens Again (2026) | 18 imgs | Timeline |
| **/why-it-exists.html** | "Why does NexCore exist?" — possibility → people → collaboration → impact narrative | 5 imgs | — |
| **/impact.html** | "The work speaks for itself." Doorway hub → Bragging Rights, History, In The News, Foundation | 4 imgs | — |
| **/bragging-rights.html** | Fox Park metrics: 550+ businesses launched, 1,000+ housed, 500+ managed, 275 brand-new, 200+ registered agent, 500+ websites, 67,000+ calls/yr, 89,696 phone hours | 4 imgs | Counters |
| **/in-the-news.html** | 8+ press items — STL Business Journal ×3, STLtoday ×3, STL Mag, KSDK, PRLog, BioSTL, Free Library, Explore St. Louis | 4 imgs | Outbound press links |
| **/the-nexcore-foundation.html** | **Coming Soon stub.** "This isn't something new. We've been doing this for ten years. Now we're giving it a name." | 10 imgs | — |
| **/coworking.html** | Largest page. Sticky section nav (Amenities / Open Spaces / Memberships / Day Pass / Private Offices / Rentable Spaces). 8 amenity groups. "Nearly 11,000 Square Feet". 3 membership tiers. Day Pass. **18 private offices**. **6 rentable spaces** | 25 imgs (+ ~90 in office/space galleries) | **5 forms**, Square checkout ×2, live availability lookup |
| **/beyond-coworking.html** | "Coworking is just the beginning." Three pillars — 01 Systems, 02 Community, 03 Events | 5 imgs | — |
| **/systems.html** | "How We Build" — Find · Test · Refine · Curate. AI, Google Workspace, BusinessGPS™, Focus10™. "The Library" | 14 imgs | — |
| **/community.html** | "A Seat at the Table" — Fox Park → South County. "The Next Chapter — Beginning this September" | 4 imgs | — |
| **/events.html** | Event listing + **custom JS calendar** fed by Apps Script. Ticket popup iframes Eventbrite. "Idea" submission form | 7 imgs | Calendar, lightbox, ticket modal, idea form |
| **/event-calendar.html** | Same calendar widget as `/events.html`, calendar-first framing | 7 imgs | Calendar, ticket modal |
| **/event-photo-gallery.html** | Photo grid from past events | 14 imgs | Lightbox |
| **/event-graphics.html** | **Empty — footer only** | 8 (footer/chrome) | — |
| **/contact.html** | "Get in Touch" — Call / Visit / Send us a message. Full contact form + success state | 4 imgs | Contact form |
| **/member-login.html** | **Weebly 401 password gate.** Content unavailable | — | Password form |
| **/photo-resources.html** | Internal photo library (Event Center, ~20 named offices, Bistro, Motivation Hallway, The Timeline, The Nexus Area) + "Powering what's next" recap letter | 26 imgs | — |

### Coworking commercial data — captured and structured (`coworking-data.json`)

**Memberships**

| Tier | Price | Notes |
|---|---|---|
| Virtual Membership | **$99/mo** | Professional business address, dedicated suite number |
| NexCore Membership | **$279/mo** | Everything in Virtual + 24/7 access, all amenities, 6 hrs conference room/mo, guest privileges |
| Founding Member | **$199/mo** | Everything in NexCore Membership + rate guaranteed through end of 2027, Founding Member Wall, featured directory placement. Limited availability |
| Day Pass | **$25** | Single day |
| Deposit | **$50** | Holds spot, applied to first month |

**Private offices — 18** (`$645`–`$1,395`/mo; 12 available, 6 occupied)

Executive Suite $1395 · Liliana's Office $1195 *(occupied)* · Left Column $995 · Right Column $995 · Access $965 · Beam $945 · Corner $945 · Window $945 *(occupied)* · Rear Right $895 · Rear Left $845 · Pool $795 · Rookie $715 · LG $715 · Arch $685 *(occupied)* · FourScopes $685 *(occupied)* · SoCo Chamber $645 *(occupied)* · Lower Level Two $645 · Lower Level Three $645 *(occupied)*

**Rentable spaces — 6** (standard rate / member rate, per hour)

| Space | Rate | Member | Capacity |
|---|---|---|---|
| Event Center | $150 | $75 | 20 boardroom · up to 80 theater · 2-hr min |
| The Studio | $75 | $35 | — |
| War Room | $55 | $25 | — |
| West Conference Room | $40 | $20 | — |
| East Conference Room | $40 | $20 | — |
| Office Rental | $55 | — | — |

**Open hours:** Mon–Fri 9:00 AM–6:00 PM · Sat 9:00 AM–1:00 PM

### Forms inventory (7 total)

| Form | Page | Fields |
|---|---|---|
| Contact (`nccf`) | contact | first, last, email, phone, business, member radio (Yes/No/Considering), reason select (9 options), message |
| Tour (`nctm`) | coworking | name*, phone*, email*, business, "what brings you" |
| Membership (`ncmm`) | coworking | name, business, email, phone, tier select → **$50 Square deposit** |
| Day Pass (`ncdm`) | coworking | name, business, email, phone, date → **$25 Square checkout** |
| Office (`ncrm`) | coworking | name, company, email, phone, office select, notes |
| Space booking (`ncrs`) | coworking | name, company, email, phone, space select, date, start, end, notes — **checks live availability** |
| Idea | events | free-text idea submission |

All post to the same Apps Script endpoint. **No honeypot, no rate limiting, no server-side validation today.**

---

## 3. DESIGN TOKENS — extracted and verified

Verified against the expected brand tokens you supplied, by counting real usage in embed CSS.

### Colors — verification result

| Token | Expected | Found | Uses | Verdict |
|---|---|---|---|---|
| Sky | `#27AAE2` | `#27AAE2` | **552** | ✅ Confirmed — dominant accent |
| Red | `#E20713` | `#E20713` | 68 | ✅ Confirmed |
| Navy | `#012269` | `#012269` | 43 | ✅ Confirmed |
| Paper | `#F6F7F9` | `#F6F7F9` | **4** | ⚠️ **Barely used** — see below |
| Charcoal | `#0F1318` | `#0F1318` | **3** | ❌ **Not the real dark surface** — see below |

**Two corrections.** The real dark surface is **`#001018` (85 uses)**, with `#03101F` (26) as its lift — not `#0F1318` (3). And the workhorse light surfaces are **`#E7ECF3` (24)** and `#EDEFF3` (7), not `#F6F7F9` (4). The navy `#012269` is used as a brand/deep accent, while `#001018` is what actually paints section backgrounds.

Full palette to carry into Tailwind:

| Role | Hex | Uses |
|---|---|---|
| Accent (Sky) — the `.o` color | `#27AAE2` | 552 |
| Accent hover / lift | `#3CB8EE` / `#4CBEEE` | 23 / 10 |
| White | `#FFFFFF` | 440 |
| Ink / dark surface | `#001018` | 85 |
| Dark surface lift | `#03101F` | 26 |
| Red | `#E20713` | 68 |
| Navy (brand deep) | `#012269` | 43 |
| Navy variants | `#002177`, `#012E83`, `#0A1F4A`, `#185196` | 8 / 7 / 8 / 8 |
| Border / rule | `#C4CCD9`, `#DBE2EC` | 32 / 20 |
| Muted text | `#8F9BB0`, `#AAB4C4`, `#6B7280` | 26 / 10 / 12 |
| Light surface | `#E7ECF3`, `#EDEFF3`, `#F3F5FA` | 24 / 7 / 6 |
| Paper | `#F6F7F9` | 4 |

### Fonts — verified

**Sora + Inter confirmed.** Loaded from Google Fonts in the embeds; the Weebly theme's `Raleway`/`Lora` in `main_style.css` only paints the header/footer chrome we are replacing — **discard it.**

- **Sora** — headings/display. Weights in use: **400, 500, 600, 700**
- **Inter** — body/UI. Weights in use: **400, 500, 600**
- Fallback stack found in source: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
- → `next/font/google`, self-hosted, `display: swap`

### Type scale (fluid `clamp()` values lifted from source)

| Role | Value |
|---|---|
| Mega numeral | `clamp(104px, 12vw, 144px)` |
| Hero | `clamp(48px, 6vw, 80px)` |
| Section H2 | `clamp(40px, 5vw, 60px)` |
| Sub H2 | `clamp(36px, 4vw, 52px)` / `clamp(32px, 4vw, 48px)` |
| H3 | `clamp(28px, 3vw, 48px)` |
| H4 / lead | `clamp(24px, 3vw, 32px)` |

### Layout & spacing

- **Containers:** `1180px` (wide), `820px` (prose — most common at 45 uses), `640px`, `600px`, `560px`, `480px` (modals)
- **Section padding:** `120px 24px` desktop, `104px 48px` wide
- **Button padding:** `11px 22px` (primary, 21 uses), `16px 22px`, `17px 44px` (large CTA)
- **Radii:** `999px` pill (20 uses, primary CTA), `50%` circle (67 uses, icons/avatars), `10px`/`11px`/`14px` cards, `6px`–`9px` inputs
- **Breakpoints in source:** `480`, `560`, `600`, `620`, `640`, **`820` (primary, 24 uses)**, `860`, `900`, `980`, `1000` px
  → Tailwind: keep default `sm/md/lg`, add an `820px` breakpoint; **mobile-first, verify at 390px**

### Logo files ✅

Recovered a **true vector logo** — base64 SVG inline in the page source, far better than the PNGs.

| File | Detail |
|---|---|
| **`nexcore-logo-primary.svg`** | Horizontal wordmark, `aria-label="NexCore"`, viewBox `37.1 18.3 1823.8 458.8`. Fills: `#FFFFFF`, `#27AAE2`, `#e20713` — **independently confirms the brand palette** |
| `nexcore-wordmark-alt.svg` | Alternate lockup, viewBox `0 0 1893 595.25` |
| `nexcore-mark-tall.svg` | Tall mark, `0 0 1438.62 1254` |
| `nexcore-illustration.svg` | Large illustration, 90 KB |
| `icon-01.svg` … `icon-12.svg` | Square `1254×1254` ecosystem/feature icons |
| `nexcore26logo.png`, `nexcore-logo-2026-1.png`, `main-logo-1.png` | Raster fallbacks (header + foundation lockup) |

**No favicon and no `apple-touch-icon` exist on the current site** — we generate both from the SVG.

### Convention note

`class="o"` for accent spans appears **0 times** on the live site — confirmed as a **new** convention for the rebuild, not something to port. It will map to `#27AAE2`. Also confirmed: **no `text-transform: uppercase`** will be used; caps in the current design (e.g. "ANCHORED IN SOUTH COUNTY") are already literal caps in markup, which matches your rule.

---

## 4. EXTERNAL LINKS, EMBEDS, PAYMENT LINKS

### Payment — Square (2 live links)

| Link | Purpose | Page |
|---|---|---|
| `https://square.link/u/1bUKPibu?src=embed` | **$50 membership deposit** | coworking |
| `https://square.link/u/ozTP4Yh0?src=embed` | **$25 day pass** | coworking |

Both open in a new tab from a modal. **No Square links exist for events.**

### Google Apps Script endpoints (2)

| Endpoint | Role |
|---|---|
| `…/AKfycbxdRxfYdYe9QErC8UfjaI-nnqFYnjuP4YDWkEAN9rwE9SvILVIjrFIVhgNeXG3YT_jY/exec` | **The events feed** (GET → JSON array) **and** the submit target for contact + idea forms. Used on contact, coworking, events, event-calendar |
| `…/AKfycbxGPBuQ35i7uKWEMOrl_OOTvOXID7hIkxdPPvZFo5mF9X4oD2QCg91sharlzA7r8KLT/exec` | **Room availability lookup.** Returns `{"result":"success","busy":[...]}`. Used on coworking |

### Events feed — live schema (11 events; snapshot in `events-feed.json`)

```ts
type Event = {
  title: string          // 11/11
  date: string           // 11/11  "YYYY-MM-DD"
  endTS: string          // 11/11  "YYYY-MM-DDTHH:mm"
  time: string           // 11/11  "9:00 AM – 9:00 PM, doors open at 9:00 AM"
  timeRange: string      // 11/11  "9:00 AM – 9:00 PM"
  doors: string          //  8/11
  desc: string           // 11/11  multi-line
  img: string            // 11/11  absolute URL
  type: string           // 11/11  currently always "free"
  link: string           //  9/11  ticket URL
  link2: string          //  1/11  secondary ticket URL
  link2Label: string     //  1/11  e.g. "Vendor Tickets ($25 REFUNDABLE DEPOSIT)"
  gallery: string[]      // 11/11  all empty today
}
```

Events currently in the sheet: A Taste of Plaza21 (2026-10-17) · NexCore Returns! Grand Opening · EXPERIENCE NexCore Week! · Grand Opening of Media Cavern · BusinessGPS Weekly Networking · Changemakers27 Nights 1–3 + Live Celebration (Feb–Mar 2027) · SoCo Chamber Launchpad · NexCore Sessions Ep. 1

### Embeds / third-party

| What | Where | Disposition |
|---|---|---|
| **Eventbrite** ticket iframes (`checkout-external?eid=`) | events, event-calendar | **Remove** per brief |
| Google Fonts (Sora, Inter) | all | Replace with `next/font` |
| Weebly/`editmysite` CSS + JS, Cloudflare email obfuscation, GDPR script | all | Drop entirely |
| Google Maps directions link | all footers | Keep |
| **No** Google Calendar embed, **no** Thryv widget, **no** GA/GTM found | — | Analytics is greenfield |

### Social

`facebook.com/NexCoreCoworking/` · `instagram.com/thenexcore` · `linkedin.com/company/thenexcore/` · `x.com/thenexcore`

### Press (in-the-news outbound)

STL Business Journal ×3 · STLtoday ×3 · STL Magazine · KSDK · PRLog · BioSTL · The Free Library · Explore St. Louis · thesocochamber.org

### ⚠️ Legal links point at a former vendor

Footer "Terms of Use" and "Privacy Policy" on **all 20 pages** link to **`thryv.com/client-terms-of-use/`** and **`thryv.com/client-privacy-policy/`** — Thryv's own boilerplate, not NexCore's. These do not describe NexCore's practices. Recommend first-party `/terms` and `/privacy` pages.

---

## 5. PROPOSED ROUTE MAP + 301 REDIRECT TABLE

### New route map

Flatten `.html`, keep slugs (preserves link equity), group the story pages under `/about`.

| New route | Source | Notes |
|---|---|---|
| `/` | index.html | Home |
| `/coworking` | coworking.html | Anchors preserved: `#amenities`, `#open-spaces`, `#memberships`, `#day-pass`, `#offices-anchor`, `#rentable-anchor` |
| `/coworking/offices/[slug]` | OFFICES data | **New** — 18 indexable office pages from existing data |
| `/coworking/spaces/[slug]` | SPACES data | **New** — 6 indexable rentable-space pages |
| `/beyond-coworking` | beyond-coworking.html | |
| `/systems` | systems.html | |
| `/community` | community.html | |
| `/events` | events.html + event-calendar.html | **Merged** — one calendar/list view, ISR `revalidate: 300` |
| `/events/[slug]` | events feed | **New** — per-event page w/ Event JSON-LD, links to checkout |
| `/events/gallery` | event-photo-gallery.html | |
| `/about` | what-is-nexcore.html | Hub |
| `/about/founder-letter` | founder-letter.html | |
| `/about/philosophy` | our-philosophy.html | |
| `/about/history` | history.html | |
| `/about/why-it-exists` | why-it-exists.html | |
| `/impact` | impact.html | Hub |
| `/impact/bragging-rights` | bragging-rights.html | |
| `/impact/in-the-news` | in-the-news.html | |
| `/foundation` | the-nexcore-foundation.html | Coming-soon stub retained |
| `/contact` | contact.html | |
| `/terms`, `/privacy` | — | **New, first-party** (replaces Thryv links) |
| `/sitemap.xml`, `/robots.txt` | — | Generated |

### 301 redirect table (for `next.config`)

| # | Old URL | → New URL |
|---|---|---|
| 1 | `/index.html` | `/` |
| 2 | `/coworking.html` | `/coworking` |
| 3 | `/beyond-coworking.html` | `/beyond-coworking` |
| 4 | `/systems.html` | `/systems` |
| 5 | `/community.html` | `/community` |
| 6 | `/events.html` | `/events` |
| 7 | `/event-calendar.html` | `/events` |
| 8 | `/event-photo-gallery.html` | `/events/gallery` |
| 9 | `/event-graphics.html` | `/events` — ✅ **RETIRED** (Weebly asset workaround; page was empty) |
| 10 | `/what-is-nexcore.html` | `/about` |
| 11 | `/founder-letter.html` | `/about/founder-letter` |
| 12 | `/our-philosophy.html` | `/about/philosophy` |
| 13 | `/history.html` | `/about/history` |
| 14 | `/why-it-exists.html` | `/about/why-it-exists` |
| 15 | `/impact.html` | `/impact` |
| 16 | `/bragging-rights.html` | `/impact/bragging-rights` |
| 17 | `/in-the-news.html` | `/impact/in-the-news` |
| 18 | `/the-nexcore-foundation.html` | `/foundation` |
| 19 | `/contact.html` | `/contact` |
| 20 | `/member-login.html` | `/contact` — ✅ **REMOVED** per Jim, 2026-08-26 |
| 21 | `/photo-resources.html` | `/` — ✅ **RETIRED** (Weebly asset workaround; orphaned + robots-disallowed, so ~0 inbound) |
| 22 | `/:path*.html` (catch-all) | `/:path*` — safety net for any stray Weebly URL |

Plus infrastructure-level: **apex → `www`** (already 301 today; configure in Vercel to preserve).

---

## 6. DECISIONS I NEED FROM YOU BEFORE BUILDING

**Q1 — Member Login.** ✅ **ANSWERED — remove.** `/member-login.html` is a Weebly 401 gate; I cannot see what's behind it. Next.js has no equivalent. Options: (a) drop it and 301 → `/contact`, (b) link out to an external member portal if one exists, (c) build real auth. Which?

**Q2 — `/photo-resources.html`.** ✅ **ANSWERED — retire.** Internal photo library, robots-disallowed but publicly reachable. Rebuild privately, or 301 → `/events/gallery` and retire?

**Q3 — Events + Square. This is the one real conflict in the brief.** The spec says each event links to its **Square checkout URL, no Eventbrite embeds** — but **all 10 ticket links in the live sheet are Eventbrite**, and there are no Square links for events anywhere. The only Square links on the site are the $50 deposit and $25 day pass.

I will honor the "no Eventbrite embeds" rule either way — no iframes, no `checkout-external`. The question is what the ticket button points at:

- **(a)** You swap the sheet's `link` column to Square checkout URLs; I build for Square and the button reads "Get Tickets". *(Cleanest — matches the brief.)*
- **(b)** I build the `link` field host-agnostic: Square when present, otherwise a plain outbound link in a new tab. No embed either way. *(My recommendation — ships now, works the moment you swap the column.)*

**Q4 — Google Sheet access.** I can read the feed via the public Apps Script endpoint. Keep using that at build/ISR time, or read the Sheet directly via the Sheets API with a service account? *(Apps Script endpoint is simpler and already working.)*

**Q5 — Form delivery.** Forms currently post to Apps Script (→ Sheet). Brief specifies Resend. Do you want (a) Resend email only, (b) Resend **and** keep writing to the Sheet so you don't lose your existing record, or (c) Apps Script only? *(I recommend (b).)*

**Q6 — The expired homepage promo.** The `$50 for all of August` modal says *"Offer ends Friday, August 21"* — that date has passed. Drop it, extend it, or replace it with a different founding-member CTA?

**Q7 — Terms & Privacy.** Confirm you want first-party `/terms` and `/privacy` pages instead of the Thryv links. I can draft both from your actual practices for your review — I'd want you or your attorney to sign off before they go live.

**Q8 — Meta descriptions.** None exist. I'll write a unique one per page from the real copy unless you'd rather supply them.

**Q9 — Two small data issues to confirm.**

- In the sheet, **Changemakers27: Night 2** links to the **Night 3** Eventbrite URL. Looks like a copy/paste slip.
- Two images 404 on the live site and need replacement files: `time-to-experience-nexcore-week_orig.png` (EXPERIENCE NexCore Week!, referenced by the events sheet) and `grand-opening-in-the-books_orig.png` (was on photo-resources).

---

## 7. STATUS

✅ Sitemap complete — 21 pages, one found outside the sitemap
✅ Content inventory complete — copy parsed from raw embeds, not text-scraped
✅ Design tokens extracted and **verified against your expected brand values** (3 confirmed, 2 corrected)
✅ External links, embeds, and payment links catalogued
✅ Route map + 301 table proposed
✅ **304 of 305** raster assets downloaded + renamed; **16 vector logos/icons** recovered from inline base64 SVG
✅ Commercial data structured — 18 offices, 6 spaces, 3 membership tiers
✅ Live events feed captured and typed

**Nothing has been built. Awaiting your approval and answers to Q1–Q9.**
