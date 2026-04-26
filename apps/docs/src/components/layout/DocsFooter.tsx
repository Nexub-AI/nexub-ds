export function DocsFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border-default)',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.8rem',
      }}
    >
      Built with{' '}
      <span style={{ color: 'var(--color-brand-primary-500)', fontWeight: 600 }}>
        Nexub Design System
      </span>{' '}
      · © {new Date().getFullYear()} · Nexub Pte. Ltd. Singapore.
    </footer>
  );
}
