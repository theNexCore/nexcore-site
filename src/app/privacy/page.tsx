import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { site, formattedAddress } from '@/data/site';
import { SMS_BRAND, SMS_MESSAGE_TYPES } from '@/data/sms';

/**
 * NexCore privacy policy.
 *
 * Replaces the previous footer link to thryv.com/client-privacy-policy — a
 * former vendor's boilerplate that did not describe NexCore's practices.
 *
 * The technical description is verified against the code: enquiry forms
 * posted server-side to the NexCore Apps Script web app, which logs to the
 * Google Sheet and sends its own notification email; honeypot plus timing and
 * rate-limit checks; no cookies set by this site today.
 *
 * Facts confirmed by Jim, 2026-08-26: no data sharing (not sold, not shared
 * with any partner including the SOCO Chamber); 24-month retention; deletion
 * and access requests to hello@thenexcore.com; site is for adults and youth
 * programs run in person; Missouri only, so no CCPA or GDPR section.
 *
 * Reviewed and approved by counsel verbally, 2026-08-26, reported by Jim.
 * The "Text messaging (SMS)" section was added 2026-09-12 at Jim's direction
 * for A2P 10DLC registration, after that review. The "No mobile information
 * will be shared..." paragraph is the carrier-required wording: do not
 * paraphrase it. The contact paragraph answers GoTo's review asking for a
 * direct SMS contact method and clear sender identification. SMS message
 * types come from data/sms.ts. "How we protect your information" is GoTo's
 * recommended safeguards wording, added 2026-09-12, also after counsel's review.
 *
 * TWO THINGS THAT CAN GO STALE — check before changing either:
 *
 *   1. The 24-month retention is a written commitment but nothing in this
 *      codebase enforces it. Old enquiries have to actually be deleted from
 *      the inbox and the mirrored Google Sheet by someone.
 *   2. "Does not use advertising cookies or cross-site tracking" holds only
 *      while NEXT_PUBLIC_GA4_ID is unset. Enabling GA4 makes that sentence
 *      inaccurate and likely requires a consent mechanism.
 *
 * Access is described as "NexCore staff" rather than naming individuals, so
 * staff changes do not require a policy edit.
 */

const UPDATED = '12 September 2026';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How NexCore collects, uses, and protects information submitted through thenexcore.com.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="Privacy" accent="Policy" />

      <Section width="prose">
        <p className="font-inter text-[14px] text-white/45">Last updated: {UPDATED}</p>

        <div className="prose-nex mt-8">
          <p>
            This policy explains what information NexCore collects through this website, how we use
            it, and the choices you have. It applies to <strong>thenexcore.com</strong> only.
          </p>

          <h2>Information you give us</h2>
          <p>
            Almost all of the personal information we collect through this website is what you type
            into one of our forms. Depending on the form, that may include your name, email address, phone
            number, business or organisation name, whether you are a NexCore member, the reason for
            your enquiry, and any message, notes, or dates you provide.
          </p>
          <p>
            You do not need to submit a form to browse this site. If you would rather not use a form,
            you can call or email us using the details below.
          </p>

          <h2>How we use it</h2>
          <p>
            We use what you submit to respond to you and to provide the thing you asked about — a
            tour, a membership, an office, a space booking, or a general question. We do not sell
            your information, and we do not share it with third parties for their own marketing.
          </p>

          <h2>Text messaging (SMS)</h2>
          <p>
            If you opt in to receive text messages from {SMS_BRAND}, we use your mobile number to send
            you {SMS_MESSAGE_TYPES}. Consent is not a condition of any purchase or membership. Message
            frequency varies, and message and data rates may apply. Reply STOP to any message to opt
            out, or HELP for help.
          </p>
          <p>
            Example message:{' '}
            <em>
              &ldquo;Thanks for contacting NexCore Coworking. We&rsquo;ve received your message and
              will get back to you shortly. Is there anything else I can help you with? Reply STOP
              to unsubscribe, or HELP for more information.&rdquo;
            </em>
          </p>
          <p>
            No mobile information will be shared with third parties or affiliates for marketing or
            promotional purposes. All the above categories exclude text messaging originator opt-in
            data and consent; this information will not be shared with, or sold to, any third
            parties.
          </p>
          <p>
            Our text messages identify the sender as NexCore Coworking. If you have questions about
            our text messages, including the privacy of SMS communications, reply HELP to any
            message, email <a href={`mailto:${site.email}`}>{site.email}</a>, or call{' '}
            <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].number}</a>.
          </p>

          <h2>Where it goes</h2>
          <p>
            Form submissions are sent to a private NexCore application hosted on Google, which
            records them in a private internal spreadsheet and emails the relevant NexCore staff.
            Both the spreadsheet and the mailbox are accessible only to NexCore staff.
          </p>

          <h2>How we protect your information</h2>
          <p>
            We take reasonable steps to prevent unauthorized sharing of personal information. Access
            to personal information is limited to authorized personnel who need it to perform their
            duties.
          </p>
          <ul>
            <li>
              <strong>Access Limits:</strong> Personal information is accessible only to individuals
              with a legitimate business need.
            </li>
            <li>
              <strong>Safeguards:</strong> We use appropriate administrative, technical, and physical
              safeguards to help protect personal information against unauthorized access, use, or
              disclosure.
            </li>
            <li>
              <strong>Controlled Handling:</strong> We maintain processes designed to reduce the risk
              of improper sharing or misuse of personal information.
            </li>
          </ul>

          <h2>Payments</h2>
          <p>
            Membership deposits and day passes are processed by <strong>Square</strong>, and event
            registration is handled by <strong>Eventbrite</strong>. This site does not embed either
            one — the buttons are ordinary links that take you to their websites. We never see or store your full card details — payment information is handled
            entirely by those providers under their own privacy policies.
          </p>

          <h2>Analytics and cookies</h2>
          <p>
            This site does not use advertising cookies or cross-site tracking. If website analytics
            are enabled, they are used only in aggregate to understand which pages are useful. Your
            browser&rsquo;s Do Not Track and cookie controls are respected.
          </p>

          <h2>Automated protections</h2>
          <p>
            Our forms include basic anti-spam measures — a hidden field that real visitors never see,
            a timing check, and a limit on how many times a form can be submitted from the same
            connection in a short period. That last check reads the IP address your connection
            presents so it can count recent submissions. It is held only in memory, for about ten
            minutes, and is never written to the spreadsheet, included in the notification email, or
            used to identify or profile you.
          </p>

          <h2>Retention</h2>
          <p>
            We keep enquiries for up to <strong>24 months</strong>, after which they are deleted. You
            can ask us to delete yours sooner at any time — see below.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what information we hold about you, ask us to correct it, or ask us to
            delete it. Email <a href={`mailto:${site.email}`}>{site.email}</a> and we will take care
            of it.
          </p>

          <h2>Children</h2>
          <p>
            This website is intended for adults and for people acting on behalf of a business. It is
            not directed at children, and we do not knowingly collect information from them. Youth
            programs run by NexCore take place in person and do not collect information through this
            site.
          </p>

          <h2>Changes</h2>
          <p>
            If we change this policy we will update the date at the top of this page.
          </p>

          <h2>Contact</h2>
          <p>
            NexCore
            <br />
            {formattedAddress}
            <br />
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <br />
            <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].number}</a>
          </p>
        </div>
      </Section>
    </>
  );
}
