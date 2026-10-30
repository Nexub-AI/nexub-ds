import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = { title: 'Spacing' };

const scale = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64];

export default function SpacingPage() {
  return (
    <div className="docs-prose">
      <p className="text-[0.8rem] font-semibold text-[var(--color-brand-primary-500)] tracking-wider uppercase mb-2">Foundations</p>
      <h1>Spacing</h1>
      <p>
        Nexub DS uses a 4px base unit spacing scale exposed as <code>--spacing-{'{n}'}</code> CSS custom properties.
        1 unit = 4px.
      </p>

      <h2>Scale</h2>
      <div className="flex flex-col gap-1">
        {scale.map((n) => {
          const px = n * 4;
          return (
            <div key={n} className="flex items-center gap-4 py-1 px-0 border-b border-[var(--color-border-subtle)]">
              <code className="text-[0.72rem] font-mono text-[var(--color-brand-primary-500)] w-[120px]">
                --spacing-{n}
              </code>
              <code className="text-[0.72rem] font-mono text-[var(--color-text-muted)] w-[60px]">
                {px}px
              </code>
              <div
                style={{
                  height: '16px',
                  width: `${Math.min(px, 320)}px`,
                  background: 'var(--color-brand-primary-500)',
                  borderRadius: '2px',
                  opacity: 0.7,
                  minWidth: px > 0 ? '2px' : 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
