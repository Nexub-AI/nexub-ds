import type React from 'react';

/**
 * Slug-level loading boundary for component detail pages.
 *
 * Next.js creates a Suspense boundary at this segment, so this skeleton
 * is shown specifically when /components/[slug] is loading — not when
 * the parent (docs) layout or other siblings are loading.
 *
 * The gradient sweep makes the animation visible (background-position
 * only works on gradients, not solid colours).
 */
const shimmer: React.CSSProperties = {
  background:
    'linear-gradient(90deg, var(--color-surface-container-high) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container-high) 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.4s ease infinite',
};

export default function ComponentSlugLoading() {
  return (
    <div className="docs-prose" aria-busy="true" aria-label="Loading component">
      {/* Breadcrumb: "Components · Category" */}
      <div style={{ height: '12px', width: '180px', borderRadius: 'var(--shape-tooltip)', marginBottom: '1rem', ...shimmer }} />

      {/* Title row + status badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '0.75rem' }}>
        <div style={{ height: '36px', width: '220px', borderRadius: 'var(--shape-tooltip)', ...shimmer }} />
        <div style={{ height: '20px', width: '52px', borderRadius: 'var(--shape-control)', ...shimmer }} />
        <div style={{ height: '20px', width: '96px', borderRadius: 'var(--shape-control)', ...shimmer }} />
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
        {[95, 75].map((w) => (
          <div
            key={w}
            style={{ height: '14px', width: `${w}%`, maxWidth: '520px', borderRadius: 'var(--shape-tooltip)', ...shimmer }}
          />
        ))}
      </div>

      {/* Import section */}
      <div style={{ height: '14px', width: '80px', borderRadius: 'var(--shape-tooltip)', marginBottom: '0.75rem', ...shimmer }} />
      <div style={{ height: '52px', borderRadius: 'var(--shape-container)', background: 'var(--docs-code-bg)', opacity: 0.6, marginBottom: '2rem' }} />

      {/* Examples section */}
      <div style={{ height: '14px', width: '90px', borderRadius: 'var(--shape-tooltip)', marginBottom: '0.75rem', ...shimmer }} />

      {/* Example title + preview skeleton */}
      <div style={{ height: '18px', width: '160px', borderRadius: 'var(--shape-tooltip)', marginBottom: '0.5rem', ...shimmer }} />
      <div style={{ border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--shape-container)', overflow: 'hidden', marginBottom: '2rem' }}>
        {/* Tab bar */}
        <div style={{ height: '40px', background: 'var(--color-surface-container-low)', borderBottom: '1px solid var(--color-outline-variant)' }} />
        {/* Preview area */}
        <div style={{ height: '160px', ...shimmer }} />
      </div>

      {/* Props table */}
      <div style={{ height: '14px', width: '60px', borderRadius: 'var(--shape-tooltip)', marginBottom: '0.75rem', ...shimmer }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{ height: '36px', borderRadius: 'var(--shape-tooltip)', animationDelay: `${i * 0.08}s`, ...shimmer }}
          />
        ))}
      </div>
    </div>
  );
}
