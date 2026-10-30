import type { Metadata } from 'next';
import { PageIntro, Section } from '@/components/kit';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Spacing' };

// Every step that exists in @nexub/tokens (half steps are named 0-5, 1-5, …).
const scale = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64];

export default function SpacingPage() {
  return (
    <div className="docs-prose">
      <PageIntro
        eyebrow="Foundations"
        title="Spacing"
        lead={
          <>
            Nexub uses a 4px base unit, exposed as <code>--spacing-{'{n}'}</code> custom properties and Tailwind spacing
            classes (<code>p-4</code>, <code>gap-2</code>). 1 unit = 4px. React Native reads the same scale as dp numbers
            from <code>@nexub/tokens/native</code>.
          </>
        }
      />

      <Section id="scale" title="Scale">
        <div className="flex flex-col">
          {scale.map((n) => {
            const px = n * 4;
            const name = String(n).replace('.', '-');
            return (
              <div key={n} className="flex items-center gap-4 border-b border-[var(--color-outline-variant)] py-1.5">
                <code className="w-[120px] shrink-0 font-mono text-label-sm text-[var(--color-primary)]">--spacing-{name}</code>
                <code className="w-[56px] shrink-0 font-mono text-label-sm text-[var(--color-on-surface-muted)]">{px}px</code>
                <div
                  className="h-4 min-w-[2px] rounded-[2px] bg-[var(--color-primary)] opacity-70"
                  style={{ width: `${Math.min(px, 256)}px` }}
                />
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
