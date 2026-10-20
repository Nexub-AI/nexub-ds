'use client';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-999px',
        left: '-999px',
        zIndex: 9999,
        padding: '8px 16px',
        background: 'var(--color-primary)',
        color: '#fff',
        borderRadius: 'var(--shape-field)',
        fontSize: '0.875rem',
        fontWeight: 600,
        textDecoration: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '8px';
        e.currentTarget.style.left = '8px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-999px';
        e.currentTarget.style.left = '-999px';
      }}
    >
      Skip to content
    </a>
  );
}
