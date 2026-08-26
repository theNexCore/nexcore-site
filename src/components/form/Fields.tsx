'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';
import { HONEYPOT } from '@/lib/forms';

const fieldBase =
  'w-full rounded-field border bg-white/[0.04] px-4 py-3 font-inter text-[15px] text-white ' +
  'placeholder:text-white/35 transition-colors focus:outline-none focus:ring-2 focus:ring-sky ' +
  'focus:ring-offset-2 focus:ring-offset-ink';

export function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-inter text-[14px] font-medium text-white/80">
      {children}
      {required && (
        <span className="ml-1 text-sky" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 font-inter text-[13px] text-red-bright">
      {message}
    </p>
  );
}

interface BaseProps {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export function Input({
  name,
  label,
  error,
  required,
  className,
  ...rest
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn(fieldBase, error ? 'border-red-bright' : 'border-white/15 hover:border-white/25')}
        {...rest}
      />
      <FieldError id={errId} message={error} />
    </div>
  );
}

export function Textarea({
  name,
  label,
  error,
  required,
  className,
  rows = 5,
  ...rest
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn(
          fieldBase,
          'resize-y',
          error ? 'border-red-bright' : 'border-white/15 hover:border-white/25',
        )}
        {...rest}
      />
      <FieldError id={errId} message={error} />
    </div>
  );
}

export function Select({
  name,
  label,
  error,
  required,
  className,
  children,
  ...rest
}: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        className={cn(
          fieldBase,
          'appearance-none bg-ink-lift',
          error ? 'border-red-bright' : 'border-white/15 hover:border-white/25',
        )}
        {...rest}
      >
        {children}
      </select>
      <FieldError id={errId} message={error} />
    </div>
  );
}

export function RadioGroup({
  name,
  label,
  options,
  error,
}: {
  name: string;
  label: string;
  options: string[];
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset>
      <legend className="mb-2 font-inter text-[14px] font-medium text-white/80">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="cursor-pointer rounded-pill border border-white/15 px-4 py-2 font-inter text-[14px] text-white/75 transition-colors hover:border-sky has-[:checked]:border-sky has-[:checked]:bg-sky/10 has-[:checked]:text-white"
          >
            <input type="radio" name={name} value={opt} className="sr-only" />
            {opt}
          </label>
        ))}
      </div>
      <FieldError id={`${id}-err`} message={error} />
    </fieldset>
  );
}

/**
 * Honeypot + timing trap.
 * Hidden from users and assistive tech; bots that fill it are silently dropped.
 */
export function BotTrap() {
  return (
    <>
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={HONEYPOT}>Company website</label>
        <input
          id={HONEYPOT}
          type="text"
          name={HONEYPOT}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <input type="hidden" name="_t" value={Date.now()} />
    </>
  );
}
