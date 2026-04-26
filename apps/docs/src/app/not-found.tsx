import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '32px',
        textAlign: 'center',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--color-text-subtle)', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Page not found</h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '360px', margin: 0, lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        style={{
          marginTop: '8px',
          padding: '8px 20px',
          background: 'var(--color-brand-primary-500)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Back to home
      </Link>
    </div>
  );
}
