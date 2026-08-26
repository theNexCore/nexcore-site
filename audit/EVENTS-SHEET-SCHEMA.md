# Events Sheet — Final Column Schema

Approved decisions, 2026-08-26. Ticketing: **Eventbrite outbound links, no iframe embeds.**
Square remains only on `/coworking` ($50 deposit, $25 day pass).

---

## Final column list, in order

| # | Column | Type / allowed values | Req? | Example |
|---|---|---|---|---|
| 1 | `title` | text | ✅ | `A Taste of Plaza21` |
| 2 | `slug` | lowercase-hyphen text | — | `a-taste-of-plaza21-2026-10-17` |
| 3 | `date` | `YYYY-MM-DD` | ✅ | `2026-10-17` |
| 4 | `startTS` | `YYYY-MM-DDTHH:mm` | ✅ | `2026-10-17T09:00` |
| 5 | `endTS` | `YYYY-MM-DDTHH:mm` | ✅ | `2026-10-17T21:00` |
| 6 | `doors` | text | — | `9:00 AM` |
| 7 | `recurrence` | `none` \| `weekly` \| `monthly` | ✅ | `weekly` |
| 8 | `recurrenceEnd` | `YYYY-MM-DD` | — | `2026-12-31` |
| 9 | `series` | text | — | `Changemakers27` |
| 10 | `seriesOrder` | number | — | `1` |
| 11 | `locationType` | `nexcore` \| `plaza` \| `online` \| `offsite` | ✅ | `plaza` |
| 12 | `locationName` | text | — | `Plaza 21` |
| 13 | `locationAddress` | text | — | `11820 Tesson Ferry Rd, Ste 1000, St. Louis, MO 63128` |
| 14 | `summary` | text, **max 160 chars** | ✅ | `A free, all-day celebration of the businesses that make Plaza 21 a South County destination.` |
| 15 | `desc` | long text, line breaks OK | ✅ | *(full program)* |
| 16 | `img` | absolute URL | ✅ | `https://…/a-taste-of-plaza21.png` |
| 17 | `gallery` | newline- or comma-separated URLs | — | `https://…/1.jpg, https://…/2.jpg` |
| 18 | `priceLabel` | text | ✅ | `Free` · `$25` · `$25 refundable deposit` |
| 19 | `priceValue` | number (`0` = free) | ✅ | `0` |
| 20 | `link` | URL (Eventbrite) | — | `https://www.eventbrite.com/e/…` |
| 21 | `linkLabel` | text — defaults to `Get Tickets` | — | `Register Free` |
| 22 | `link2` | URL | — | `https://www.eventbrite.com/e/…` |
| 23 | `link2Label` | text | — | `Vendor Tickets ($25 refundable deposit)` |

**23 columns.**

---

## Changes from the current sheet

**Added (10):** `slug`, `startTS`, `recurrence`, `recurrenceEnd`, `series`, `seriesOrder`, `locationType`, `locationName`, `locationAddress`, `summary`, `linkLabel`

**Replaced (1):** `type` → `priceLabel` + `priceValue`

**Kept (9):** `title`, `date`, `endTS`, `doors`, `desc`, `img`, `gallery`, `link`, `link2`, `link2Label`

**Dropped (2):** `time`, `timeRange` — both are now derived in code, see below.

---

## Derived in code — do NOT keep as columns

| Was | Now derived from | Rule |
|---|---|---|
| `timeRange` | `startTS` + `endTS` | `9:00 AM – 9:00 PM` |
| `time` | `timeRange` + `doors` | `9:00 AM – 9:00 PM, doors open at 9:00 AM` (doors clause omitted when `doors` is blank) |

This removes a class of drift: today `time`, `timeRange`, and `endTS` can disagree with each other and nothing catches it.

---

## Behavior rules

**Past events.** An event moves from Current to Past when `endTS < now`. Automatic, applies to every completed event whether or not it has photos. Nothing is deleted from the sheet. Both sections live on `/events`.

**Recurrence.** `weekly` / `monthly` rows expand into occurrences, **capped at 8 weeks ahead**, stopping at `recurrenceEnd` if set. Each occurrence gets its own slug (`title` + occurrence date) and its own event page. Occurrences move to Past individually as they complete.

**Series.** Rows sharing a `series` value show a series badge and cross-link, ordered by `seriesOrder`.

**Location & JSON-LD.**

| `locationType` | schema.org output |
|---|---|
| `nexcore` | `Place` — defaults to 11820 Tesson Ferry Rd, Ste 1000, St. Louis, MO 63128 when `locationAddress` is blank |
| `plaza` | `Place` — `locationName` + NexCore address |
| `offsite` | `Place` — requires `locationName` + `locationAddress` |
| `online` | `VirtualLocation` with the Eventbrite `link` as `url` |

**Pricing.** `priceValue` feeds JSON-LD `offers.price`; `priceLabel` is what displays.

**Event pages.** `/events/[slug]`. Slug from `title` + `date` unless `slug` is set. `summary` on cards, `desc` on the page, `Event` JSON-LD on the page.

---

## Action items for the sheet

- [ ] **Fix Changemakers27: Night 2 `link`.** Currently points at the **Night 3** URL (`…changemakers27-night-3-online-tickets-1994940146681…`). Correct link needed — **not guessed.**
- [ ] **Replace 2 dead images.** `time-to-experience-nexcore-week_orig.png` (EXPERIENCE NexCore Week!) and `grand-opening-in-the-books_orig.png` — both 404 on the live site.
- [ ] **Backfill `startTS`** for all 11 rows from the existing `timeRange` start value.
- [ ] **Collapse BusinessGPS Weekly** to a single row, `recurrence: weekly`, set `recurrenceEnd`.
- [ ] **Tag Changemakers27** — `series: Changemakers27`, `seriesOrder: 1–4`.
- [ ] **Set `locationType`** on all rows — the 4 Changemakers27 rows are `online`, A Taste of Plaza21 is `plaza`.
- [ ] **Write `summary`** (≤160 chars) for all rows — `desc` currently runs 1,143–9,029 chars, far too long for a card.
- [ ] **Set `priceLabel` / `priceValue`** — all rows are `type: free` today, but A Taste of Plaza21 has a $25 refundable vendor deposit on `link2`.
