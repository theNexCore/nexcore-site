'use client';

import { useEffect, useState } from 'react';

/**
 * Tiny pub/sub so the header can follow the Energy Core animation.
 *
 * The core runs on the homepage only and resolves from black to a white
 * "dawn" finale. The header cross-fades with it, so a context provider
 * wrapping the whole tree would be overkill — this is one boolean.
 *
 * States:
 *   'none' — no core on this page (every route except "/")
 *   'dark' — core mounted, still on black
 *   'dawn' — core has flipped to white
 */
export type CoreState = 'none' | 'dark' | 'dawn';

let current: CoreState = 'none';
const listeners = new Set<(s: CoreState) => void>();

export function setCoreState(next: CoreState) {
  if (current === next) return;
  current = next;
  for (const fn of listeners) fn(next);
}

export function useCoreState(): CoreState {
  // Always start at 'none' so server and first client render agree;
  // the effect below syncs immediately after hydration.
  const [state, setState] = useState<CoreState>('none');

  useEffect(() => {
    setState(current);
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return state;
}
