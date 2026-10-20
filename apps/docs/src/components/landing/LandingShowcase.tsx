'use client';

import { Button, Badge, Input, Spinner, Stack, Text } from '@nexub/react';
import { Search } from '@nexub/icons';

export function LandingShowcase() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', alignItems: 'center' }}>
      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <Text size="caption" tone="muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Button</Text>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="filled" size="md">Filled</Button>
          <Button variant="tonal" size="md">Tonal</Button>
          <Button variant="outlined" size="md">Outlined</Button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <Text size="caption" tone="muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badge</Text>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </div>

      {/* Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <Text size="caption" tone="muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Input</Text>
        <div style={{ width: '200px' }}>
          <Input placeholder="Search components…" leadingIcon={<Search size="sm" />} />
        </div>
      </div>

      {/* Spinner */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <Text size="caption" tone="muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Spinner</Text>
        <Stack direction="row" gap="md" align="center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </Stack>
      </div>
    </div>
  );
}
