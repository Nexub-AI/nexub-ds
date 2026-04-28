'use client';

import { Button, Badge, Input, Spinner, Stack } from '@nexub/react';
import { Search } from '@nexub/icons';

export function LandingShowcase() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Button</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" size="md">Primary</Button>
          <Button variant="outline" size="md">Outline</Button>
          <Button variant="ghost" size="md">Ghost</Button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badge</div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Input</div>
        <div style={{ width: '200px' }}>
          <Input placeholder="Search components…" leadingIcon={<Search size="sm" />} />
        </div>
      </div>

      {/* Spinner */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(240,246,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Spinner</div>
        <Stack direction="row" gap="md" align="center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Stack>
      </div>
    </div>
  );
}
