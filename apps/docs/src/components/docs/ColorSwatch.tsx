import * as React from 'react';

interface ColorSwatchProps {
  name: string;
  value: string;
}

export function ColorSwatch({ name, value }: ColorSwatchProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--shape-container)',
        overflow: 'hidden',
        border: '1px solid var(--color-outline-variant)',
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
          background: 'var(--color-surface-container-low)',
          color: 'var(--color-on-surface-variant)',
          fontFamily: 'var(--font-family-mono)',
        }}
      >
        {name}
      </div>
    </div>
  );
}
