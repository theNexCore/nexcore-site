'use client';

import { useMemo, useState } from 'react';
import { MemberCard } from './MemberCard';
import { MemberModal } from './MemberModal';
import { MemberWall } from './MemberWall';
import { Section, Eyebrow } from '@/components/Section';
import type { NexMember } from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * The /members body: the capped-tier wall, then the searchable directory.
 *
 * Both live in one client component so they share the detail modal — a click
 * on a founding spot and a click on a directory card open the same card.
 *
 * The directory below the wall is the ENTIRE membership, founding members
 * included. They appear twice on purpose: the wall is the honour roll, the
 * directory is the thing you search. Cards keep the founding badge down there,
 * so per-tier headings would only repeat what the wall already said — hence
 * one flat grid, in the order the server sorted it (tier, weight, then name).
 *
 * Filtering is all client-side: the dataset is one page of members, so the
 * three controls are a couple of array passes with no network round trip.
 * They combine with AND; within the category filter, selecting several
 * categories widens the result (OR), as a chip list is expected to.
 */

const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

/** Which tier gets the wall. Whether it HAS one is decided by its config. */
const WALL_TIER = 'Founding' as const;

export function MembersView({
  members,
  categories,
  letters,
  error,
}: {
  members: NexMember[];
  categories: string[];
  letters: string[];
  /** Feed failure message, or null. The wall renders either way. */
  error: string | null;
}) {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<NexMember | null>(null);

  // Enabled letters come from the full dataset, not the current results, so
  // the strip does not reshuffle under the pointer as you type.
  const available = useMemo(() => new Set(letters), [letters]);
  const strip = useMemo(() => [...ALPHABET, ...(available.has('#') ? ['#'] : [])], [available]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return members.filter((m) => {
      if (letter && m.letter !== letter) return false;

      // OR within categories: any selected category is a match.
      if (selected.length && !selected.some((c) => m.categories.includes(c))) return false;

      if (!q) return true;
      // The person's name is searchable too: the card leads with it, so
      // someone who remembers "Taylor" and not the business must still find them.
      return (
        m.business.toLowerCase().includes(q) ||
        m.contactName.toLowerCase().includes(q) ||
        m.categories.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [members, query, letter, selected]);

  const toggleCategory = (c: string) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const clearAll = () => {
    setQuery('');
    setLetter(null);
    setSelected([]);
  };

  const filtered = query.trim() !== '' || letter !== null || selected.length > 0;

  return (
    <>
      {/* The wall renders its full spot count even before a single member
          exists, so the tier reads as a fixed set of places to claim rather
          than as a short list. */}
      <Section>
        <MemberWall
          tierId={WALL_TIER}
          members={members}
          onOpen={setOpen}
          unavailable={error !== null}
        />
      </Section>

      <Section id="directory" tone="lift">
        <div className="max-w-2xl">
          <Eyebrow>THE FULL DIRECTORY</Eyebrow>
          <h2 className="font-sora text-h2sm font-semibold text-white">
            Find a member by <span className="o">what they do</span>.
          </h2>
          <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
            Every NexCore member, searchable by business category or by name.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mt-12 rounded-card border border-red-bright/30 bg-red/10 p-8 text-center"
          >
            <p className="font-sora text-lg font-semibold text-white">
              We couldn&rsquo;t load the directory just now.
            </p>
            <p className="mt-2 font-inter text-[15px] text-white/65">
              Please try again shortly, or{' '}
              <a href="/contact" className="text-sky hover:text-sky-light">
                get in touch
              </a>{' '}
              and we&rsquo;ll point you to the right member.
            </p>
          </div>
        ) : members.length === 0 ? (
          <p className="mt-12 rounded-card border border-white/10 bg-ink p-8 text-center font-inter text-[16px] text-white/60">
            The directory is being put together right now. Check back shortly.
          </p>
        ) : (
          <div className="mt-12">
            {/* Search */}
            <div className="max-w-md">
              <label
                htmlFor="member-search"
                className="mb-2 block font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45"
              >
                Search members
              </label>
              <input
                id="member-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, business or category"
                className="w-full rounded-field border border-white/15 bg-white/[0.04] px-4 py-3 font-inter text-[15px] text-white placeholder:text-white/35 focus:border-sky focus:outline-none"
              />
            </div>

            {/* Business category — the primary filter */}
            {categories.length > 0 && (
              <fieldset className="mt-8">
                <legend className="mb-3 font-inter text-[13px] font-semibold tracking-[0.08em] text-white/45">
                  Filter by business category
                </legend>
                <ul className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const on = selected.includes(c);
                    return (
                      <li key={c}>
                        <button
                          type="button"
                          onClick={() => toggleCategory(c)}
                          aria-pressed={on}
                          className={cn(
                            'rounded-pill border px-3.5 py-1.5 font-inter text-[13px] transition-colors',
                            on
                              ? 'border-sky bg-sky/15 font-semibold text-sky'
                              : 'border-white/12 text-white/60 hover:border-white/30 hover:text-white',
                          )}
                        >
                          {c}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            )}

            {/* A-Z strip */}
            <nav aria-label="Filter by surname" className="mt-8">
              <ul className="flex flex-wrap gap-1.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setLetter(null)}
                    aria-pressed={letter === null}
                    className={cn(
                      'rounded-pill px-3.5 py-1.5 font-inter text-[13px] font-semibold transition-colors',
                      letter === null ? 'bg-sky text-white' : 'text-white/60 hover:text-white',
                    )}
                  >
                    All
                  </button>
                </li>
                {strip.map((l) => {
                  const enabled = available.has(l);
                  return (
                    <li key={l}>
                      <button
                        type="button"
                        disabled={!enabled}
                        onClick={() => setLetter(letter === l ? null : l)}
                        aria-pressed={letter === l}
                        aria-label={
                          l === '#'
                            ? 'Surnames starting with a number or symbol'
                            : `Surnames starting with ${l}`
                        }
                        className={cn(
                          'h-8 w-8 rounded-pill font-inter text-[13px] font-semibold transition-colors',
                          !enabled && 'cursor-not-allowed text-white/15',
                          enabled && letter === l && 'bg-sky text-white',
                          enabled &&
                            letter !== l &&
                            'text-white/60 hover:bg-white/10 hover:text-white',
                        )}
                      >
                        {l}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Result count */}
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-6">
              <p aria-live="polite" className="font-inter text-[14px] text-white/55">
                {results.length} {results.length === 1 ? 'member' : 'members'}
                {filtered && ` of ${members.length}`}
              </p>
              {filtered && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-inter text-[14px] font-semibold text-sky hover:text-sky-light"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Results */}
            {results.length === 0 ? (
              <p className="mt-8 rounded-card border border-white/10 bg-ink p-8 text-center font-inter text-[16px] text-white/60">
                No members match those filters. Try a different category or letter, or{' '}
                <button
                  type="button"
                  onClick={clearAll}
                  className="font-semibold text-sky hover:text-sky-light"
                >
                  clear the filters
                </button>
                .
              </p>
            ) : (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((m) => (
                  <MemberCard key={m.slug} member={m} onOpen={setOpen} />
                ))}
              </div>
            )}
          </div>
        )}
      </Section>

      <MemberModal member={open} onClose={() => setOpen(null)} />
    </>
  );
}
