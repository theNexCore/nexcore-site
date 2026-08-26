import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { site, formattedAddress } from '@/data/site';

/**
 * ⚠️ REVIEW REQUIRED BEFORE LAUNCH.
 *
 * Replaces the previous footer link to thryv.com/client-terms-of-use — a
 * former vendor's boilerplate that did not describe NexCore's terms.
 *
 * Scope is deliberately narrow: this covers use of the WEBSITE only.
 *
 * CONFIRMED BY JIM (2026-08-26):
 *   - Governing law is Missouri.
 *   - The copyright paragraph is carried over verbatim from the Weebly footer.
 *
 * STILL UNVERIFIED — counsel should confirm before this goes live:
 *
 *   1. The opening paragraph states that membership, office licence and space
 *      rental terms "are set out in the agreements you sign with us directly".
 *      Whether those signed agreements exist was NOT confirmed. If they do not,
 *      that sentence is false AND there is a real gap: nothing would then set
 *      terms for paid memberships, office licences or space rentals. This is
 *      the single most important item on this page.
 *   2. The liability limitation and "as is" disclaimer are conventional but
 *      have not been reviewed by a lawyer.
 *   3. No refund policy is stated. Square deposits and day passes, and
 *      Eventbrite registrations, are deferred to those providers — confirm
 *      that matches how refunds are actually handled, particularly the $50
 *      membership deposit and the $25 refundable vendor deposit.
 */

const UPDATED = '26 August 2026';

export const metadata = buildMetadata({
  title: 'Terms of Use',
  description: 'The terms that apply to your use of thenexcore.com.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="Terms of" accent="Use" />

      <Section width="prose">
        <p className="font-inter text-[14px] text-white/45">Last updated: {UPDATED}</p>

        <div className="prose-nex mt-8">
          <p>
            These terms apply to your use of <strong>thenexcore.com</strong>. By using this website,
            you agree to them. They cover the website only — membership, office licence, and space
            rental terms are set out in the agreements you sign with us directly.
          </p>

          <h2>Using this site</h2>
          <p>
            You may browse this site, and submit our forms in good faith to contact us about
            membership, offices, spaces, events, or general enquiries. Please do not attempt to
            disrupt the site, submit automated or fraudulent enquiries, or use it in a way that
            breaks the law.
          </p>

          <h2>Content and copyright</h2>
          <p>
            Content on this website, including images, is protected by copyright. Downloading,
            republication, retransmission or reproduction of content on this website is strictly
            prohibited without our written permission. Photographs of events and spaces remain the
            property of NexCore or the photographers credited.
          </p>

          <h2>Accuracy</h2>
          <p>
            We work to keep pricing, availability, amenities, and event details accurate and current.
            Even so, information on this site may change, and errors are possible. Nothing on this
            website is a binding offer. Office availability and pricing are confirmed in writing when
            you enquire, and event details are set by the organiser.
          </p>

          <h2>Payments and registration</h2>
          <p>
            Membership deposits and day passes are processed by <strong>Square</strong>. Event
            registration is handled by <strong>Eventbrite</strong>. When you follow those links you
            leave this website and are subject to that provider&rsquo;s own terms, and to any refund
            policy stated for the specific item or event.
          </p>

          <h2>Links to other sites</h2>
          <p>
            This site links to other organisations — partners, press coverage, and payment and
            ticketing providers. We do not control those sites and are not responsible for their
            content or practices.
          </p>

          <h2>Availability</h2>
          <p>
            We aim to keep the site available, but we do not guarantee uninterrupted access. We may
            change, suspend, or withdraw any part of it.
          </p>

          <h2>Liability</h2>
          <p>
            This website is provided on an &ldquo;as is&rdquo; basis. To the fullest extent permitted
            by law, NexCore is not liable for any loss arising from your use of, or reliance on, this
            website. Nothing here limits liability that cannot lawfully be limited.
          </p>

          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the State of Missouri, United States.</p>

          <h2>Changes</h2>
          <p>
            If we change these terms we will update the date at the top of this page.
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
