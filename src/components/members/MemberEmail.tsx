'use client';

import { useState } from 'react';
import { MailIcon } from '@/components/Icons';

/**
 * Protected click-to-email.
 *
 * The raw address is never in the DOM, never in a `mailto:` href, and never in
 * the JSON-LD. What ships is `token`: the address reversed, then base64'd by
 * `encodeEmail` in @/lib/members. This component reverses the transform inside
 * the click handler and navigates to the mailto it builds.
 *
 * That is obfuscation rather than protection — anything running a real browser
 * can click too. It stops the harvesters that matter, which pull `mailto:`
 * hrefs and @-shaped text straight out of static HTML and never execute JS.
 *
 * After the first click the plain address is revealed as text, so anyone
 * without a mail client configured can still copy it.
 */
export function MemberEmail({ token, label }: { token: string; label: string }) {
  const [revealed, setRevealed] = useState<string | null>(null);

  const decode = (): string | null => {
    try {
      return [...atob(token)].reverse().join('');
    } catch {
      return null;
    }
  };

  const onClick = () => {
    const address = decode();
    if (!address) return;
    setRevealed(address);
    window.location.href = `mailto:${address}`;
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2.5 font-inter text-[15px] text-sky transition-colors hover:text-sky-light"
      >
        <MailIcon />
        {label}
      </button>

      {revealed && (
        <p className="mt-1.5 select-all font-inter text-[13px] text-white/45">{revealed}</p>
      )}
    </div>
  );
}
