import { Section } from '@/components/Section';
import { ButtonLink } from '@/components/Button';

export default function NotFound() {
  return (
    <Section width="prose" className="text-center">
      <p className="font-sora text-[13px] font-semibold tracking-[0.18em] text-sky">404</p>
      <h1 className="mt-4 font-sora text-h2sm font-semibold text-white">
        We couldn&rsquo;t find that <span className="o">page</span>.
      </h1>
      <p className="mt-5 font-inter text-[17px] leading-relaxed text-white/65">
        It may have moved when we rebuilt the site. Here are the places people head to most.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Home</ButtonLink>
        <ButtonLink href="/coworking" variant="ghost">
          Coworking
        </ButtonLink>
        <ButtonLink href="/events" variant="ghost">
          Events
        </ButtonLink>
        <ButtonLink href="/contact" variant="ghost">
          Contact
        </ButtonLink>
      </div>
    </Section>
  );
}
