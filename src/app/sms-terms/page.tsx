import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { site } from '@/data/site';

/**
 * NexCore SMS program terms.
 *
 * Text is Part 2 of the NexCore SMS Compliance Pack, published verbatim at
 * Jim's direction on 2026-09-12 for A2P 10DLC carrier registration. Not
 * reviewed by counsel.
 *
 * Linked from the footer and from the SMS opt-in checkbox on every
 * phone-collecting form (components/form/Fields.tsx, SmsConsent).
 */

const UPDATED = '12 September 2026';

export const metadata = buildMetadata({
  title: 'NexCore SMS Program — Terms & Conditions',
  description:
    'Terms for the NexCore SMS program: what we send, message frequency, costs, and how to opt out.',
  path: '/sms-terms',
});

export default function SmsTermsPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="SMS" accent="Terms" />

      <Section width="prose">
        <p className="font-inter text-[14px] text-white/45">Last updated: {UPDATED}</p>

        <div className="prose-nex mt-8">
          <h2 className="!mt-0">NexCore SMS Program — Terms &amp; Conditions</h2>

          <p>
            <strong>Program Description:</strong> NexCore sends text messages to members and
            customers who opt in, including booking confirmations, event reminders, membership
            updates, and occasional promotional offers from NexCore.
          </p>

          <p>
            <strong>Opt-In:</strong> You can opt in by checking the SMS consent box on a form at
            thenexcore.com, or by providing written or verbal consent in person at our location.
            Consent is not a condition of any purchase or membership.
          </p>

          <p>
            <strong>Message Frequency:</strong> Message frequency varies based on your bookings,
            memberships, and preferences.
          </p>

          <p>
            <strong>Cost:</strong> Message and data rates may apply according to your mobile carrier
            plan.
          </p>

          <p>
            <strong>Opt-Out:</strong> Reply <strong>STOP</strong> to any message to cancel. After you
            send STOP, we will send one final message confirming you have been unsubscribed. No
            further messages will be sent unless you opt in again.
          </p>

          <p>
            <strong>Help:</strong> Reply <strong>HELP</strong> to any message for assistance, or
            contact us at <a href={`mailto:${site.email}`}>hello@thenexcore.com</a>.
          </p>

          <p>
            <strong>Carriers:</strong> Carriers are not liable for delayed or undelivered messages.
          </p>

          <p>
            <strong>Privacy:</strong> See our Privacy Policy at{' '}
            <Link href="/privacy">thenexcore.com/privacy</Link> for how we handle your information.
            No mobile information will be shared with third parties or affiliates for marketing or
            promotional purposes.
          </p>
        </div>
      </Section>
    </>
  );
}
