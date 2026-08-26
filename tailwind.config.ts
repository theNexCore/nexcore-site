import type { Config } from 'tailwindcss';

/**
 * Tokens verified against the live Weebly site, 2026-08-26.
 * Usage counts in comments come from the audit (see audit/PHASE1.md §3).
 * Two values were corrected against the original brand sheet:
 *   - dark surface is #001018 (85 uses), NOT #0F1318 (3 uses)
 *   - light surface is #E7ECF3 (24 uses); #F6F7F9 (4 uses) kept as `paper`
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sky: {
          DEFAULT: '#27AAE2', // accent - 552 uses. This is the `.o` colour.
          light: '#3CB8EE',
          lighter: '#4CBEEE',
        },
        ink: {
          DEFAULT: '#001018', // real dark surface - 85 uses
          lift: '#03101F', // 26 uses
          deep: '#03081A',
        },
        navy: {
          DEFAULT: '#012269', // 43 uses
          mid: '#012E83',
          bright: '#002177',
          deep: '#0A1F4A',
          soft: '#185196',
        },
        red: {
          DEFAULT: '#E20713', // 68 uses
          bright: '#FC0C16',
        },
        rule: {
          DEFAULT: '#C4CCD9', // 32 uses
          soft: '#DBE2EC',
        },
        muted: {
          DEFAULT: '#8F9BB0', // 26 uses
          light: '#AAB4C4',
          grey: '#6B7280',
        },
        surface: {
          DEFAULT: '#E7ECF3', // 24 uses - workhorse light surface
          alt: '#EDEFF3',
          tint: '#F3F5FA',
        },
        paper: '#F6F7F9',
      },
      fontFamily: {
        // Bound to next/font CSS variables in layout.tsx
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        inter: [
          'var(--font-inter)',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        // Fluid scale lifted verbatim from the live site's inline CSS
        mega: ['clamp(104px, 12vw, 144px)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        hero: ['clamp(48px, 6vw, 80px)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        h2: ['clamp(40px, 5vw, 60px)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h2sm: ['clamp(36px, 4vw, 52px)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        h2xs: ['clamp(32px, 4vw, 48px)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        h3: ['clamp(28px, 3vw, 48px)', { lineHeight: '1.16', letterSpacing: '-0.01em' }],
        lead: ['clamp(24px, 3vw, 32px)', { lineHeight: '1.32' }],
      },
      maxWidth: {
        wide: '1180px',
        prose: '820px', // most common container - 45 uses
        narrow: '640px',
        tight: '560px',
        modal: '480px',
      },
      spacing: {
        section: '120px',
        'section-sm': '72px',
      },
      borderRadius: {
        pill: '999px',
        card: '14px',
        field: '10px',
      },
      screens: {
        // 820px is the live site's primary breakpoint (24 uses) and still
        // drives layout elsewhere. The header bar is the exception: seven
        // top-level items plus a CTA need ~980px of content, so the desktop
        // nav only switches on once there is room for it on one line.
        nav: '1060px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
