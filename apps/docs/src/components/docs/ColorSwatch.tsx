import * as React from 'react';

interface ColorSwatchProps {
  name: string;
  value: string;
  textColor?: string;
}

export function ColorSwatch({ name, value, textColor = '#fff' }: ColorSwatchProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border-default)',
        fontSize: '0.75rem',
      }}
    >
      <div
        style={{
          height: '64px',
          background: value,
          display: 'flex',
          alignItems: 'flex-end',
          padding: '6px 10px',
        }}
      >
        <span
          style={{
            color: textColor,
            fontFamily: 'var(--font-family-mono)',
            fontWeight: 600,
            fontSize: '0.7rem',
            opacity: 0.85,
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          padding: '6px 10px',
          background: 'var(--color-bg-subtle)',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family-mono)',
        }}
      >
        {name}
      </div>
    </div>
  );
}

interface TokenRowProps {
  name: string;
  value: string;
  preview?: React.ReactNode;
}

export function TokenRow({ name, value, preview }: TokenRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '10px 0',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      {preview && <div style={{ flexShrink: 0 }}>{preview}</div>}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontWeight: 600,
            fontSize: '0.8rem',
            color: 'var(--color-brand-primary-500)',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
