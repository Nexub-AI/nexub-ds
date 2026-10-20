import Link from 'next/link';

export function LandingCallout() {
  return (
    <section data-reveal-scroll
      style={{
        padding: '5rem 2rem',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-outline-variant)',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          padding: '2.5rem',
          background: 'var(--color-surface-container-low)',
          border: '1px solid var(--color-outline-variant)',
          borderRadius: 'var(--shape-container)',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--color-on-surface)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
            This site is built with Nexub DS
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-on-surface-muted)', lineHeight: 1.7, maxWidth: '460px' }}>
            Every header, sidebar, badge, button, and code block you see here is a real{' '}
            <code style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.82em', background: 'var(--color-surface-container-high)', padding: '1px 5px', borderRadius: 'var(--shape-tooltip)', border: '1px solid var(--color-outline-variant)' }}>@nexub/react</code>{' '}
            component. We eat our own cooking.
          </p>
        </div>
        <Link
          href="/getting-started"
          style={{
            padding: '11px 24px',
            borderRadius: 'var(--shape-container)',
            background: 'var(--color-primary)',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Start building →
        </Link>
      </div>
    </section>
  );
}
