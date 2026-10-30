import * as React from 'react';
import { Badge, Kbd, Text } from '@nexub/react';
import type { A11yDef } from '@/registry/types';

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="m-0 flex list-disc flex-col gap-1 ps-[1.1rem] marker:text-[var(--color-on-surface-muted)]">
      {items.map((t, i) => (
        <li key={i}>
          <Text size="body-sm" tone="secondary">
            {t}
          </Text>
        </li>
      ))}
    </ul>
  );
}

export function A11yPanel({ a11y }: { a11y: A11yDef }) {
  const { roles, keyboard, focus, screenReader, notes } = a11y;
  const sections: { title: string; body: React.ReactNode }[] = [];

  if (roles?.length) {
    sections.push({
      title: 'ARIA roles',
      body: (
        <div className="flex flex-wrap gap-1.5">
          {roles.map((r) => (
            <Badge key={r} size="sm" variant="soft" tone="info" className="font-mono">
              {r}
            </Badge>
          ))}
        </div>
      ),
    });
  }

  if (keyboard?.length) {
    sections.push({
      title: 'Keyboard',
      body: (
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
          {keyboard.map((k) => (
            <li key={k.key} className="flex items-center gap-2.5">
              <Kbd className="shrink-0">{k.key}</Kbd>
              <Text size="body-sm" tone="secondary">
                {k.description}
              </Text>
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (focus?.length) sections.push({ title: 'Focus', body: <Bullets items={focus} /> });
  if (screenReader?.length) sections.push({ title: 'Screen reader', body: <Bullets items={screenReader} /> });
  if (notes?.length) sections.push({ title: 'Notes', body: <Bullets items={notes} /> });

  if (!sections.length) {
    return (
      <Text size="body-sm" tone="muted">
        No accessibility notes documented yet.
      </Text>
    );
  }

  return (
    <div className="docs-a11y-grid">
      {sections.map((s) => (
        <section key={s.title} className="flex flex-col gap-2">
          <Text size="label" weight="semibold" tone="secondary" className="uppercase tracking-wider">
            {s.title}
          </Text>
          {s.body}
        </section>
      ))}
    </div>
  );
}
