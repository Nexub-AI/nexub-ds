/**
 * loading.tsx — shown immediately when navigating to any docs page.
 * Next.js streams the layout (sidebar + header) instantly, then shows
 * this skeleton while the async page content is being prepared.
 * Eliminates the "frozen" feeling during page transitions.
 */
export default function DocsLoading() {
  return (
    <div className="docs-prose" aria-busy="true" aria-label="Loading page content">
      {/* Breadcrumb */}
      <div
        style={{
          height: '12px',
          width: '160px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-muted)',
          marginBottom: '1rem',
          animation: 'skeleton-shimmer 1.4s ease infinite',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Page title */}
      <div
        style={{
          height: '36px',
          width: '260px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--color-bg-muted)',
          marginBottom: '0.75rem',
          animation: 'skeleton-shimmer 1.4s ease infinite',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
        {[100, 80, 60].map((w) => (
          <div
            key={w}
            style={{
              height: '14px',
              width: `${w}%`,
              maxWidth: '480px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-bg-muted)',
              animation: 'skeleton-shimmer 1.4s ease infinite',
              backgroundSize: '200% 100%',
            }}
          />
        ))}
      </div>

      {/* Code block skeleton */}
      <div
        style={{
          height: '52px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--docs-code-bg, #0d1117)',
          opacity: 0.6,
          marginBottom: '2rem',
        }}
      />

      {/* Preview skeleton */}
      <div
        style={{
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
      >
        <div style={{ height: '40px', background: 'var(--color-bg-subtle)', borderBottom: '1px solid var(--color-border-default)' }} />
        <div style={{ height: '140px', background: 'var(--color-bg-default)' }} />
      </div>
    </div>
  );
}
