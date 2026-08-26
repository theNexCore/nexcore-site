'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * The NexCore "Energy Core" hero.
 *
 * Hybrid strategy:
 *   1. A static Energy Core SVG paints immediately — it is the LCP element,
 *      so the hero never waits on JavaScript.
 *   2. The ~166KB canvas engine is dynamically imported only when the device
 *      looks capable and the user has not asked for reduced motion. It fades
 *      in over the poster once running.
 *   3. If anything fails — import error, no 2D context, slow link — the
 *      poster simply stays. Nothing breaks.
 *
 * Engine source: src/components/genesis/engine.js (ported from the Weebly
 * homepage embed; act timings unchanged, runtime ~14.2s).
 */

const POSTER = '/logo/nexcore-illustration.svg';

function shouldAnimate(): boolean {
  if (typeof window === 'undefined') return false;

  // Respect an explicit reduced-motion preference.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;

  // Respect Save-Data and very slow connections.
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false;

  // The engine is particle-heavy; skip it on very low-core devices.
  if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4) {
    return false;
  }

  return true;
}

export function EnergyCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!shouldAnimate()) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // Defer past first paint so the poster and the rest of the page settle first.
    const idle =
      window.requestIdleCallback?.(start, { timeout: 2500 }) ?? window.setTimeout(start, 400);

    function start() {
      import('./engine')
        .then(({ mountGenesis }) => {
          if (cancelled || !canvasRef.current) return;
          cleanup = mountGenesis(canvasRef.current);
          setRunning(true);
        })
        .catch(() => {
          // Poster stays. Nothing else to do.
        });
    }

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback && typeof idle === 'number') window.cancelIdleCallback(idle);
      else window.clearTimeout(idle as number);
      cleanup?.();
    };
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ height: 'clamp(470px, 78vh, 900px)' }}
    >
      {/* Static poster — paints immediately, fades out once the engine runs. */}
      <div
        aria-hidden={running}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
          running ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src={POSTER}
          alt="The NexCore Energy Core — the connected systems within the ecosystem."
          width={5143}
          height={4906}
          priority
          sizes="(max-width: 1023px) 86vw, 620px"
          className="h-auto w-[min(620px,86vw)] max-w-full"
        />
      </div>

      {/* Canvas — transparent until the engine takes over. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 block h-full w-full transition-opacity duration-700 ${
          running ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* The animation resolves to a white "dawn" finale, but the page below
          is dark. This bridges that edge so the handoff reads as intentional
          rather than as a seam. Only shown once the engine is actually
          running — the static poster sits on black and needs no bridge. */}
      {running && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink"
        />
      )}
    </div>
  );
}
