import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { site } from '@/data/site';

/**
 * NexCore SMS program terms, for A2P 10DLC registration through GoTo.
 * Not reviewed by counsel.
 *
 * The program is registered as CUSTOMER CARE ONLY. GoTo's opt-in review
 * (2026-09-12) rejected any message type beyond exactly "customer care
 * messages". That phrase is the only message type named here, on /privacy,
 * and in the form checkbox (components/form/Fields.tsx, SmsConsent). Do not
 * add promotional, marketing, or notification wording to any of the three
 * unless the GoTo campaign is re-registered to cover it first.
 */

const UPDATED = '12 September 2026';

export const metadata = buildMetadata({
  title: 'NexCore SMS Program — Terms & Conditions',
  description:
    'Terms for the NexCore Coworking SMS program: customer care messages, message frequency, costs, and how to opt out.',
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
            By providing your mobile number and opting in to receive SMS messages from{' '}
            <strong>NexCore Coworking</strong>, you agree to receive customer care messages.
          </p>

          <h3>Message frequency</h3>
          <p>Message frequency may vary. On average, 1-2 messages per month.</p>

          <h3>Additional terms</h3>
          <ul>
            <li>Message and data rates may apply.</li>
            <li>Consent is not a condition of purchase.</li>
            <li>Reply STOP to opt out at any time.</li>
            <li>Reply HELP for help.</li>
            <li>
              For privacy information, please review:{' '}
              <Link href="/privacy">https://www.thenexcore.com/privacy</Link>
            </li>
            <li>
              Terms and Conditions:{' '}
              <Link href="/sms-terms">https://www.thenexcore.com/sms-terms</Link>
            </li>
          </ul>

          <h3>Program details</h3>

          <p>
            <strong>Program Description:</strong> NexCore Coworking sends customer care messages to
            members and customers who opt in.
          </p>

          <p>
            <strong>Opt-In:</strong> You can opt in by checking the SMS consent box on a form at
            thenexcore.com, or by providing written or verbal consent in person at our location.
            Consent is not a condition of any purchase or membership.
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
            contact NexCore Coworking at <a href={`mailto:${site.email}`}>hello@thenexcore.com</a>{' '}
            or <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].number}</a>.
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
