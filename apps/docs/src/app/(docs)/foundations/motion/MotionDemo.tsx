'use client';

import * as React from 'react';
import { Button } from '@nexub/react';

const springs = ['spatial', 'effects', 'expressive'].flatMap((kind) =>
  ['fast', 'default', 'slow'].map((speed) => `${kind}-${speed}`),
);

/** Click a row to send its dot across on that spring (CSS linear() easing). */
export function SpringDemo() {
  const [moved, setMoved] = React.useState<Record<string, boolean>>({});
  return (
    <div style={{ display: 'grid', gap: 8, marginBottom: '2rem' }}>
      {springs.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setMoved((m) => ({ ...m, [s]: !m[s] }))}
          className="nx-state-layer relative grid grid-cols-[160px_1fr] items-center gap-4 rounded-shape-container px-3 py-2 text-left"
        >
          <code style={{ fontFamily: 'var(--font-family-mono)', fontSize: '0.75rem' }}>{s}</code>
          <span style={{ position: 'relative', height: 24, borderRadius: 12, background: 'var(--color-surface-container-high)' }}>
            <span
              style={{
                position: 'absolute',
                top: 2,
                left: 2,
                width: 20,
                height: 20,
                borderRadius: 10,
                background: s.startsWith('effects') ? 'var(--color-tertiary)' : 'var(--color-primary)',
                transform: moved[s] ? 'translateX(calc(min(480px, 60vw)))' : 'none',
                transition: `transform var(--motion-spring-${s}-duration) var(--motion-spring-${s}-easing)`,
              }}
            />
          </span>
        </button>
      ))}
    </div>
  );
}

/** Real controls: hover, press and Tab through them to see the state layer, press spring and focus ring. */
export function StateDemo() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2rem' }}>
      <Button variant="filled">Filled</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
      <Button variant="filled" disabled>
        Disabled
      </Button>
    </div>
  );
}
