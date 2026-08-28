import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/Section';
import { JsonLd } from '@/components/JsonLd';
import { ButtonLink } from '@/components/Button';
import { MemberDetail } from '@/components/members/MemberDetail';
import { getMembers, getMemberBySlug, memberJsonLd } from '@/lib/members-server';
import { memberSince } from '@/lib/members';

export const revalidate = 300;

export async function generateStaticParams() {
  const { members } = await getMembers();
  return members.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) {
    return buildMetadata({
      title: 'Member not found',
      description: '',
      path: '/members',
      noIndex: true,
    });
  }

  const description =
    member.desc.replace(/\s+/g, ' ').trim().slice(0, 200) ||
    `${member.business} — ${memberSince(member)} at NexCore in South St. Louis County.`;

  return buildMetadata({
    title: member.contactName ? `${member.contactName} — ${member.business}` : member.business,
    description,
    path: `/members/${member.slug}`,
    // The logo is the sharper social card; the photo is the fallback.
    image: member.logo?.src ?? member.photo?.src ?? '/og/default.png',
    type: 'article',
  });
}

/**
 * A member's own page. Renders exactly the same card as the directory modal,
 * so a shared link and an in-page click show the same thing.
 */
export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await getMemberBySlug(slug);
  if (!member) notFound();

  return (
    <>
      <JsonLd data={memberJsonLd(member)} />

      <Section>
        <Link href="/members" className="font-inter text-[14px] text-sky hover:text-sky-light">
          ← Member directory
        </Link>

        <div className="mt-8">
          <MemberDetail member={member} as="page" />
        </div>
      </Section>

      <Section tone="lift" width="prose" className="text-center">
        <h2 className="font-sora text-h3 font-semibold text-white">
          Find more <span className="o">NexCore members</span>.
        </h2>
        <p className="mt-4 font-inter text-[16px] leading-relaxed text-white/65">
          Search the full directory by name or category.
        </p>
        <ButtonLink href="/members" variant="ghost" className="mt-7">
          Browse the directory →
        </ButtonLink>
      </Section>
    </>
  );
}
