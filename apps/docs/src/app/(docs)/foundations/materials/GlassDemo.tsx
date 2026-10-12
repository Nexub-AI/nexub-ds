'use client';

import { Card } from '@nexub/react';

const gradient = 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)';

/** Live glass-vs-solid demo. Client component so it can import the component library. */
export function GlassDemo() {
  return (
    <div style={{ background: gradient, borderRadius: 'var(--radius-xl)', padding: '48px', display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
      <Card style={{ padding: '24px', width: '220px' }}>
        <strong>Solid</strong>
        <p style={{ margin: '4px 0 0', opacity: 0.8 }}>surface=&quot;solid&quot;</p>
      </Card>
      <Card surface="glass" style={{ padding: '24px', width: '220px' }}>
        <strong>Glass</strong>
        <p style={{ margin: '4px 0 0', opacity: 0.8 }}>surface=&quot;glass&quot;</p>
      </Card>
    </div>
  );
}
