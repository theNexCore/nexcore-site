'use client';

import { useEffect, useRef } from 'react';
import { MemberDetail } from './MemberDetail';
import type { NexMember } from '@/lib/members';

/**
 * Detail card as a modal. Conventions follow DayPassModal and Lightbox:
 * Escape closes, a backdrop click closes, and body scroll is locked while it
 * is open.
 */
export function MemberModal({ member, onClose }: { member: NexMember | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!member) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm sm:items-center sm:p-8"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-modal-title"
        tabIndex={-1}
        className="relative my-auto w-full max-w-3xl rounded-card border border-white/12 bg-ink p-6 shadow-2xl outline-none sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-ink/80 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            &times;
          </span>
        </button>

        <MemberDetail member={member} as="modal" titleId="member-modal-title" />
      </div>
    </div>
  );
}
