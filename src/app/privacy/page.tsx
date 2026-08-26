import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { site, formattedAddress } from '@/data/site';

/**
 * ⚠️ REVIEW REQUIRED BEFORE LAUNCH.
 *
 * This replaces the previous footer links, which pointed at Thryv's own
 * boilerplate (thryv.com/client-privacy-policy) — a former vendor's policy
 * that did not describe NexCore's practices.
 *
 * Everything below is written to match what this site actually does today:
 * contact/enquiry forms delivered by email (Resend), optionally mirrored to a
 * Google Sheet, plus optional GA4. It makes no claims beyond that.
 *
 * Jim (or counsel) must confirm accuracy before DNS cutover.
 */

const UPDATED = '26 August 2026';

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
            The only personal information we collect through this website is what you type into one
            of our forms. Depending on the form, that may include your name, email address, phone
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

          <h2>Where it goes</h2>
          <p>
            Form submissions are delivered to NexCore by email through our email provider, and may
            also be recorded in a private internal spreadsheet so we do not lose track of enquiries.
            Both are accessible only to NexCore staff.
          </p>

          <h2>Payments</h2>
          <p>
            Membership deposits and day passes are processed by <strong>Square</strong>, and event
            registration is handled by <strong>Eventbrite</strong>. Those links take you to their
            websites. We never see or store your full card details — payment information is handled
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
            connection in a short period. These exist to block automated abuse, not to profile you.
          </p>

          <h2>Retention</h2>
          <p>
            We keep enquiries for as long as we need them to serve you and to keep an accurate record
            of our business. You can ask us to delete yours at any time.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us what information we hold about you, ask us to correct it, or ask us to
            delete it. Contact us using the details below and we will take care of it.
          </p>

          <h2>Children</h2>
          <p>
            This website is intended for adults and for people acting on behalf of a business. It is
            not directed at children, and we do not knowingly collect information from them.
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
