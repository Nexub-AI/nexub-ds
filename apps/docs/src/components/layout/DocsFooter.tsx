export function DocsFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border-default)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.78rem',
        lineHeight: 1.6,
      }}
    >
      Built on{' '}
      <span style={{ color: 'var(--color-brand-primary-500)', fontWeight: 600 }}>
        Nexub Design System
      </span>
      {' '}·{' '}
      © {new Date().getFullYear()} Nexub Pte. Ltd., Singapore 🇸🇬
      {' '}·{' '}
      Crafted by{' '}
      <a
        href="https://github.com/sasinex"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--color-brand-primary-500)',
          textDecoration: 'none',
          fontWeight: 500,
        }}
      >
        Sasidharan
      </a>
      {' '}— shipped with vibe coding energy ⚡
    </footer>
  );
}
