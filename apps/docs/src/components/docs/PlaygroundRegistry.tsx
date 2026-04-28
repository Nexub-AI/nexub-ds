'use client';

import * as React from 'react';
import {
  Badge,
  Button,
  Card,
  HelperText,
  Input,
  Label,
  Text,
} from '@nexub/react';

/**
 * PlaygroundRegistry — maps a component slug to a render function that takes
 * a runtime props bag (from playground controls / variant matrix) and returns
 * the live React element.
 *
 * Add a new entry only after the registry entry declares `playground` and/or
 * `matrix`. Unknown slugs render a small placeholder; consumers can branch on
 * `hasPlaygroundRenderer(slug)` if needed.
 */

type Bag = Record<string, unknown>;

function s(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function b(v: unknown): boolean {
  return v === true;
}

const renderers: Record<string, (p: Bag) => React.ReactElement> = {
  button: (p) => {
    const tone = s(p.tone, 'none');
    return (
      <Button
        variant={s(p.variant, 'primary') as 'primary'}
        size={s(p.size, 'md') as 'md'}
        tone={(tone === 'none' ? undefined : tone) as 'neutral' | undefined}
        loading={b(p.loading)}
        disabled={b(p.disabled)}
        fullWidth={b(p.fullWidth)}
      >
        {s(p.children, 'Click me')}
      </Button>
    );
  },

  badge: (p) => (
    <Badge
      variant={s(p.variant, 'soft') as 'soft'}
      tone={s(p.tone, 'neutral') as 'neutral'}
    >
      {s(p.children, 'Badge')}
    </Badge>
  ),

  input: (p) => {
    const id = 'pg-input';
    const showLabel = b(p.showLabel);
    const showHelper = b(p.showHelper);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 280 }}>
        {showLabel && <Label htmlFor={id}>{s(p.labelText, 'Email')}</Label>}
        <Input
          id={id}
          size={s(p.size, 'md') as 'md'}
          placeholder={s(p.placeholder, 'Enter value…')}
          invalid={b(p.invalid)}
          disabled={b(p.disabled)}
        />
        {showHelper && <HelperText>{s(p.helperText, 'We never share your email.')}</HelperText>}
      </div>
    );
  },

  card: (p) => (
    <div style={{ width: 280 }}>
      <Card variant={s(p.variant, 'surface') as 'surface'}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--color-text-primary)' }}>
          {s(p.title, 'Card title')}
        </div>
        <Text size="body-sm" tone="muted">
          {s(p.body, 'Cards group related content on a raised surface.')}
        </Text>
      </Card>
    </div>
  ),
};

export function hasPlaygroundRenderer(slug: string): boolean {
  return slug in renderers;
}

export function renderPlayground(slug: string, props: Bag): React.ReactElement {
  const fn = renderers[slug];
  if (!fn) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
        Live preview not available for <code>{slug}</code>.
      </div>
    );
  }
  return fn(props);
}
