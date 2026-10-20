import type React from 'react';

/**
 * loading.tsx — shown immediately when navigating to any docs page.
 * Next.js streams the layout (sidebar + header) instantly, then shows
 * this skeleton while the async page content is being prepared.
 * Eliminates the "frozen" feeling during page transitions.
 *
 * IMPORTANT: skeleton-shimmer animates background-position.
 * The background MUST be a gradient (not a solid colour) for the
 * animation to produce a visible sweep. Solid colours have no position
 * to shift, so the animation would run silently with no visual output.
 */

// Reusable shimmer style — gradient sweep matching LivePreviewWrapper.tsx
const shimmer: React.CSSProperties = {
  background:
    'linear-gradient(90deg, var(--color-surface-container-high) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container-high) 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.4s ease infinite',
};

export default function DocsLoading() {
  return (
    <div className="docs-prose" aria-busy="true" aria-label="Loading page content">
      {/* Breadcrumb */}
      <div
        style={{
          height: '12px',
          width: '160px',
          borderRadius: 'var(--shape-tooltip)',
          marginBottom: '1rem',
          ...shimmer,
        }}
      />

      {/* Page title */}
      <div
        style={{
          height: '36px',
          width: '260px',
          borderRadius: 'var(--shape-tooltip)',
          marginBottom: '0.75rem',
          ...shimmer,
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
              borderRadius: 'var(--shape-tooltip)',
              ...shimmer,
            }}
          />
        ))}
      </div>

      {/* Code block skeleton */}
      <div
        style={{
          height: '52px',
          borderRadius: 'var(--shape-container)',
          background: 'var(--docs-code-bg)',
          opacity: 0.6,
          marginBottom: '2rem',
        }}
      />

      {/* Preview skeleton */}
      <div
        style={{
          border: '1px solid var(--color-outline-variant)',
          borderRadius: 'var(--shape-container)',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            height: '40px',
            background: 'var(--color-surface-container-low)',
            borderBottom: '1px solid var(--color-outline-variant)',
          }}
        />
        <div style={{ height: '140px', ...shimmer }} />
      </div>

      {/* Props table skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {[100, 85, 70, 90].map((w, i) => (
          <div
            key={i}
            style={{
              height: '36px',
              borderRadius: 'var(--shape-tooltip)',
              ...shimmer,
              // Stagger the animation so rows don't pulse in lock-step
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
