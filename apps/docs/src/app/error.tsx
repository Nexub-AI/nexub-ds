'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error('[docs error boundary]', error);
  }, [error]);

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
        color: 'var(--color-on-surface)',
        fontFamily: 'var(--font-family-sans)',
      }}
    >
      <div style={{ fontSize: '4rem', lineHeight: 1 }}>⚠️</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Something went wrong</h1>
      <p style={{ color: 'var(--color-on-surface-variant)', maxWidth: '360px', margin: 0, lineHeight: 1.6 }}>
        An unexpected error occurred. You can try again or return to the home page.
      </p>
      {error.digest && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-outline)', margin: 0, fontFamily: 'var(--font-family-mono)' }}>
          Error ID: {error.digest}
        </p>
      )}
      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
        <button
          onClick={reset}
          style={{
            padding: '8px 20px',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--shape-field)',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            padding: '8px 20px',
            background: 'transparent',
            color: 'var(--color-on-surface-variant)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: 'var(--shape-field)',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Home
        </Link>
      </div>
    </div>
  );
}
