import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { site } from '@/data/site';

/**
 * NexCore privacy policy.
 *
 * Text is Part 1 of the NexCore SMS Compliance Pack, published verbatim at
 * Jim's direction on 2026-09-12 for A2P 10DLC carrier registration. It
 * replaces the 2026-08-26 policy that counsel approved verbally; this text has
 * NOT been through that review (the pack itself recommends attorney review).
 *
 * DO NOT PARAPHRASE section 3. Carrier reviewers look for the bolded
 * "No mobile information will be shared..." sentence word for word.
 *
 * The SMS opt-in checkbox on every phone-collecting form links here and to
 * /sms-terms (components/form/Fields.tsx, SmsConsent).
 */

const EFFECTIVE = 'September 12, 2026';

export const metadata = buildMetadata({
  title: 'Privacy Policy',
  description:
    'How NexCore collects, uses, and protects your information, including SMS / text messaging.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="LEGAL" title="Privacy" accent="Policy" />

      <Section width="prose">
        <p className="font-inter text-[14px] text-white/45">
          <strong className="font-semibold text-white/70">Effective Date:</strong> {EFFECTIVE}
        </p>

        <div className="prose-nex mt-8">
          <p>
            NexCore (&ldquo;NexCore,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            operates the website thenexcore.com and provides coworking space, meeting rooms, and
            business services at 11820 Tesson Ferry Rd, Ste 1000, St. Louis, MO 63128. This Privacy
            Policy explains what information we collect, how we use it, and the choices you have.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including: your name, email address,
            phone number, company name, and mailing address when you submit a contact form, book a
            room or office tour, register for an event, apply for membership, or sign up to receive
            text messages from us. We also collect standard technical information automatically when
            you visit our website, such as IP address, browser type, pages visited, and referring
            pages, through cookies and similar analytics technologies.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to: respond to your inquiries; process bookings,
            memberships, and event registrations; send transactional communications such as booking
            confirmations and account notices; send marketing communications you have opted in to
            receive; operate, maintain, and improve our website and services; and comply with legal
            obligations.
          </p>

          <h2>3. SMS / Text Messaging</h2>
          <p>
            If you opt in to receive text messages from NexCore, we will use your mobile number to
            send the messages you signed up for, such as booking confirmations, event reminders, and
            membership updates. Consent to receive text messages is not a condition of any purchase
            or membership. Message frequency varies. Message and data rates may apply. You can opt
            out at any time by replying STOP, or get help by replying HELP.
          </p>
          <p className="rounded-field border border-sky/35 bg-sky/[0.07] px-5 py-4">
            <strong>
              No mobile information will be shared with third parties or affiliates for marketing or
              promotional purposes. All the above categories exclude text messaging originator
              opt-in data and consent; this information will not be shared with, or sold to, any
              third parties.
            </strong>
          </p>

          <h2>4. How We Share Information</h2>
          <p>
            We do not sell your personal information. We share information only with: service
            providers who perform services on our behalf (such as website hosting, email delivery,
            payment processing, and scheduling tools), who are permitted to use it only to provide
            those services; law enforcement or government authorities when required by law; and a
            successor entity in the event of a merger, acquisition, or sale of assets, in which case
            this Policy will continue to apply to your information.
          </p>

          <h2>5. Cookies and Analytics</h2>
          <p>
            Our website uses cookies and similar technologies to operate the site and understand how
            visitors use it. You can control cookies through your browser settings; disabling cookies
            may affect some site features.
          </p>

          <h2>6. Data Security and Retention</h2>
          <p>
            We use commercially reasonable administrative, technical, and physical safeguards to
            protect your information. No method of transmission or storage is completely secure, and
            we cannot guarantee absolute security. We retain personal information for as long as
            needed to provide our services, comply with legal obligations, resolve disputes, and
            enforce agreements.
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our website and services are not directed to children under 13, and we do not knowingly
            collect personal information from children under 13. If you believe a child has provided
            us personal information, contact us and we will delete it.
          </p>

          <h2>8. Your Choices and Rights</h2>
          <p>
            You may opt out of marketing emails by using the unsubscribe link in any marketing email.
            You may opt out of text messages by replying STOP to any message. You may request access
            to, correction of, or deletion of your personal information by contacting us at{' '}
            <a href={`mailto:${site.email}`}>hello@thenexcore.com</a>. We will respond within a
            reasonable timeframe consistent with applicable law.
          </p>

          <h2>9. Third-Party Links</h2>
          <p>
            Our website may link to third-party websites. We are not responsible for the privacy
            practices of those sites, and this Policy does not apply to them.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will post the updated version on
            this page with a revised effective date. Continued use of our website or services after
            changes take effect constitutes acceptance of the updated Policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            NexCore
            <br />
            11820 Tesson Ferry Rd, Ste 1000
            <br />
            St. Louis, MO 63128
            <br />
            Email: <a href={`mailto:${site.email}`}>hello@thenexcore.com</a>
          </p>
        </div>
      </Section>
    </>
  );
}
