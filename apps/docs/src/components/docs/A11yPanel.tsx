import * as React from 'react';
import type { A11yDef } from '@/registry/types';

/**
 * Inline <kbd> pill — rendered locally instead of importing `Kbd` from
 * `@nexub/react` so the panel stays a Server Component (the package's barrel
 * pulls hooks that require a client boundary).
 */
function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '1px 6px',
        minWidth: 22,
        height: 22,
        background: 'var(--color-surface)',
        border: '1px solid var(--color-outline-variant)',
        borderBottomWidth: 2,
        borderRadius: 'var(--shape-tooltip)',
        fontFamily: 'var(--font-family-mono)',
        fontSize: '0.72rem',
        fontWeight: 600,
        color: 'var(--color-on-surface-variant)',
      }}
    >
      {children}
    </kbd>
  );
}

interface Props {
  a11y: A11yDef;
}

export function A11yPanel({ a11y }: Props) {
  const { roles, keyboard, focus, screenReader, notes } = a11y;
  const sections: { title: string; body: React.ReactNode }[] = [];

  if (roles?.length) {
    sections.push({
      title: 'ARIA roles',
      body: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {roles.map((r) => (
            <span key={r} style={pillStyle}>{r}</span>
          ))}
        </div>
      ),
    });
  }

  if (keyboard?.length) {
    sections.push({
      title: 'Keyboard',
      body: (
        <ul style={listStyle}>
          {keyboard.map((k) => (
            <li key={k.key} style={listItemStyle}>
              <Key>{k.key}</Key>
              <span style={{ color: 'var(--color-on-surface-variant)' }}>{k.description}</span>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (focus?.length) {
    sections.push({
      title: 'Focus',
      body: (
        <ul style={bulletStyle}>
          {focus.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      ),
    });
  }

  if (screenReader?.length) {
    sections.push({
      title: 'Screen reader',
      body: (
        <ul style={bulletStyle}>
          {screenReader.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      ),
    });
  }

  if (notes?.length) {
    sections.push({
      title: 'Notes',
      body: (
        <ul style={bulletStyle}>
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      ),
    });
  }

  if (!sections.length) {
    return (
      <p style={{ color: 'var(--color-on-surface-muted)', fontSize: '0.85rem' }}>
        No accessibility notes documented yet.
      </p>
    );
  }

  return (
    <div className="docs-a11y-grid">
      {sections.map((s) => (
        <section key={s.title}>
          <h4 style={headingStyle}>{s.title}</h4>
          {s.body}
        </section>
      ))}
    </div>
  );
}

const pillStyle: React.CSSProperties = {
  padding: '2px 8px',
  borderRadius: 'var(--shape-control)',
  background: 'var(--color-info-container)',
  color: 'var(--color-info)',
  border: '1px solid color-mix(in srgb, var(--color-info) 35%, transparent)',
  fontSize: '0.72rem',
  fontWeight: 600,
  fontFamily: 'var(--font-family-mono)',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  margin: 0,
  padding: 0,
  listStyle: 'none',
};

const listItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: '0.82rem',
};

const bulletStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: '1.1rem',
  color: 'var(--color-on-surface-variant)',
  fontSize: '0.82rem',
  lineHeight: 1.6,
};

const headingStyle: React.CSSProperties = {
  margin: '0 0 0.5rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--color-on-surface-variant)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};
