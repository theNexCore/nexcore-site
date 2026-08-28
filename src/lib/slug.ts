/**
 * URL slug generation.
 *
 * Extracted from events.ts so the members build script can share it without
 * dragging in the `@/` path alias (the script runs under tsx, outside Next's
 * resolver). events.ts still re-exports it, so its public surface is unchanged.
 */
export const slugify = (s: string, max = 60): string =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[‘’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    // Re-trim: slicing can leave a dangling hyphen, which would otherwise
    // produce "...presented-by--2026-09-05" once the date is appended.
    .replace(/-+$/, '');
