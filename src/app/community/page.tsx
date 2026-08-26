import { buildMetadata } from '@/lib/seo';
import { Section, Eyebrow } from '@/components/Section';
import { PageHero } from '@/components/PageHero';
import { ButtonLink } from '@/components/Button';

export const metadata = buildMetadata({
  title: 'Community — A Seat at the Table',
  description:
    'Strong businesses and strong communities are built together. From Fox Park to South County — how NexCore invests in the community it sits in.',
  path: '/community',
});

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="THE COMMUNITY SECTION"
        title="A Seat at"
        accent="the Table"
        lead="Strong businesses and strong communities aren't built separately. They're built together."
      />

      <Section width="prose">
        <p className="font-sora text-[20px] font-medium leading-snug text-white/85">
          From Fox Park to South County, one lesson became impossible to ignore.
        </p>
        <p className="mt-6 border-l-2 border-sky/50 pl-6 font-sora text-[22px] font-semibold leading-snug text-white">
          Businesses don&rsquo;t transform communities. <span className="o">People do.</span>
        </p>

        <div className="prose-nex mt-8">
          <p>
            Communities don’t become stronger because someone writes a check. They become stronger
            because people decide to build something together.
          </p>
          <p>
            Neighbors. Business owners. Nonprofits. Educators. Civic leaders. Volunteers. The
            strongest communities are the ones where all of them choose to show up.
          </p>
          <p>
            We’ve always believed that being located in a community isn’t enough. Our responsibility
            is to become a positive, transformational part of it — not a business that happens to
            have an address there.
          </p>
          <p>
            <strong>
              That work has already begun. Now it’s time to invite others to help shape what’s next.
            </strong>
          </p>
        </div>
      </Section>

      <Section tone="lift" width="prose">
        <Eyebrow>THE NEXT CHAPTER</Eyebrow>
        <h2 className="font-sora text-h2sm font-semibold text-white">
          Beginning this September,
          <br />
          <span className="o">we&rsquo;re opening the doors.</span>
        </h2>

        <div className="mt-8 rounded-card border border-sky/25 bg-sky/[0.06] p-7">
          <p className="font-sora text-[17px] font-semibold text-white">
            September 10 <span className="text-white/40">·</span> South County Chamber Launch Pad
          </p>
          <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/70">
            Join us as we introduce our vision, our partnerships, and the first phase of the NexCore
            community initiatives. It&rsquo;s where the next chapter begins — and where you can be
            part of it from the start.
          </p>
          <p className="mt-3 font-inter text-[15px] leading-relaxed text-white/70">
            Visit the Events page for details, registration, and ways to get involved.
          </p>
        </div>

        <p className="mt-8 font-inter text-[16px] leading-relaxed text-white/65">
          This is only the beginning. Additional initiatives, partnerships, and opportunities will be
          announced beginning September 17 — with new programs continuing to roll out over the weeks
          and months ahead.
        </p>

        <div className="mt-12 space-y-2">
          <p className="font-sora text-[20px] font-medium text-white/85">
            We&rsquo;re not building programs.
          </p>
          <p className="font-sora text-[20px] font-semibold text-white">
            We&rsquo;re building <span className="o">relationships</span>.
          </p>
          <p className="pt-3 font-sora text-[20px] font-medium text-white/85">
            We&rsquo;re not creating events.
          </p>
          <p className="font-sora text-[20px] font-semibold text-white">
            We&rsquo;re creating <span className="o">momentum</span>.
          </p>
        </div>

        <p className="mt-8 font-inter text-[17px] text-white/70">
          And we&rsquo;d love for you to have a seat at the table.
        </p>

        <ButtonLink href="/events" size="lg" className="mt-8">
          View Upcoming Events →
        </ButtonLink>
      </Section>
    </>
  );
}
