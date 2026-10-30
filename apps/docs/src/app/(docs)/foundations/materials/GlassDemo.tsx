'use client';

import { Button, Card, SegmentedControl, Text, useTheme, type GlassMode } from '@nexub/react';

/**
 * Live Glass 2.0 demo. The dial is the real ThemeProvider setting: it changes
 * every glass surface on the site and is remembered (localStorage `nexub-glass`).
 * The busy backdrop is `.docs-glass-backdrop` in globals.css.
 */
export function GlassDemo() {
  const { glass, setGlass } = useTheme();
  return (
    <div className="grid gap-4">
      <SegmentedControl.Root
        value={glass}
        onValueChange={(v) => v && setGlass(v as GlassMode)}
        aria-label="Glass intensity"
        className="self-start justify-self-start"
      >
        <SegmentedControl.Item value="clear">Clear</SegmentedControl.Item>
        <SegmentedControl.Item value="balanced">Balanced</SegmentedControl.Item>
        <SegmentedControl.Item value="tinted">Tinted</SegmentedControl.Item>
        <SegmentedControl.Item value="off">Solid</SegmentedControl.Item>
      </SegmentedControl.Root>
      <div className="docs-glass-backdrop flex flex-wrap items-center justify-center gap-5 rounded-shape-overlay p-8">
        <Card className="w-[200px] p-6">
          <Text weight="semibold">Solid</Text>
          <Text size="body-sm" tone="secondary" className="mt-1 font-mono">surface=&quot;solid&quot;</Text>
        </Card>
        <Card surface="glass" className="w-[200px] p-6">
          <Text weight="semibold">Glass</Text>
          <Text size="body-sm" tone="secondary" className="mt-1 font-mono">surface=&quot;glass&quot;</Text>
        </Card>
        <Button variant="glass">Glass button</Button>
      </div>
    </div>
  );
}
