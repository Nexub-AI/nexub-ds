import type React from 'react';

/**
 * Slug-level loading boundary for pattern detail pages.
 *
 * Pattern pages use a taller preview (minHeight 180px) and never wrap
 * examples in a Suspense, so the skeleton is slightly different from the
 * component page — taller preview area, no status badge row.
 */
const shimmer: React.CSSProperties = {
  background:
    'linear-gradient(90deg, var(--color-surface-container-high) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container-high) 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-shimmer 1.4s ease infinite',
};

export default function PatternSlugLoading() {
  return (
    <div className="docs-prose" aria-busy="true" aria-label="Loading pattern">
      {/* Breadcrumb: "Patterns · Category" */}
      <div style={{ height: '12px', width: '160px', borderRadius: 'var(--shape-tooltip)', marginBottom: '1rem', ...shimmer }} />

      {/* Title row + package badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '0.75rem' }}>
        <div style={{ height: '36px', width: '240px', borderRadius: 'var(--shape-tooltip)', ...shimmer }} />
        <div style={{ height: '20px', width: '120px', borderRadius: 'var(--shape-control)', ...shimmer }} />
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
        {[90, 70].map((w) => (
          <div
            key={w}
            style={{ height: '14px', width: `${w}%`, maxWidth: '500px', borderRadius: 'var(--shape-tooltip)', ...shimmer }}
          />
        ))}
      </div>

      {/* Import */}
      <div style={{ height: '14px', width: '80px', borderRadius: 'var(--shape-tooltip)', marginBottom: '0.75rem', ...shimmer }} />
      <div style={{ height: '52px', borderRadius: 'var(--shape-container)', background: 'var(--docs-code-bg)', opacity: 0.6, marginBottom: '2rem' }} />

      {/* Examples */}
      <div style={{ height: '14px', width: '90px', borderRadius: 'var(--shape-tooltip)', marginBottom: '0.75rem', ...shimmer }} />
      <div style={{ height: '18px', width: '140px', borderRadius: 'var(--shape-tooltip)', marginBottom: '0.5rem', ...shimmer }} />

      {/* Taller preview card (patterns use minHeight 180px) */}
      <div style={{ border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--shape-container)', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ height: '40px', background: 'var(--color-surface-container-low)', borderBottom: '1px solid var(--color-outline-variant)' }} />
        <div style={{ height: '200px', ...shimmer }} />
      </div>

      {/* Props table (optional on pattern pages) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{ height: '36px', borderRadius: 'var(--shape-tooltip)', animationDelay: `${i * 0.1}s`, ...shimmer }}
          />
        ))}
      </div>
    </div>
  );
}
