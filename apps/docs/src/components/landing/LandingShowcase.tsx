'use client';

import { Button, Badge, Input, Spinner, Stack, Text } from '@nexub/react';
import { Search } from '@nexub/icons';

export function LandingShowcase() {
  return (
    <div className="flex flex-wrap gap-8 justify-center items-center">
      {/* Buttons */}
      <div className="flex flex-col gap-3 items-center">
        <Text size="caption" tone="muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Button</Text>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button variant="filled" size="md">Filled</Button>
          <Button variant="tonal" size="md">Tonal</Button>
          <Button variant="outlined" size="md">Outlined</Button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-col gap-3 items-center">
        <Text size="caption" tone="muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badge</Text>
        <div className="flex gap-2 flex-wrap justify-center">
          <Badge tone="info">Info</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="danger">Danger</Badge>
        </div>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-3 items-center">
        <Text size="caption" tone="muted" weight="semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>Input</Text>
        <div className="w-[200px]">
          <Input placeholder="Search components…" leadingIcon={<Search size="sm" />} />
        </div>
      </div>

      {/* Spinner */}
      <div className="flex flex-col gap-3 items-center">
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
