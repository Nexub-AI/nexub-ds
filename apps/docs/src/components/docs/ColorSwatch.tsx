import * as React from 'react';

interface ColorSwatchProps {
  name: string;
  value: string;
}

export function ColorSwatch({ name, value }: ColorSwatchProps) {
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
        }}
      />
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
