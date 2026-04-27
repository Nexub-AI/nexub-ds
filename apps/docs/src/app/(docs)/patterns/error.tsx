'use client';

/**
 * Segment-level error boundary for /patterns/[slug].
 * Catches render errors without taking down the entire docs layout.
 */
export default function PatternPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1rem',
        maxWidth: '560px',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--color-semantic-error-default)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        Pattern page error
      </p>
      <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
        Failed to load this page
      </h2>
      <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
        {error.message || 'An unexpected error occurred while rendering this pattern page.'}
      </p>
      {error.digest && (
        <code
          style={{
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-family-mono)',
            background: 'var(--color-bg-muted)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          digest: {error.digest}
        </code>
      )}
      <button
        onClick={reset}
        style={{
          padding: '8px 16px',
          background: 'var(--color-brand-primary-500)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-family-sans)',
        }}
      >
        Try again
      </button>
    </div>
  );
}
