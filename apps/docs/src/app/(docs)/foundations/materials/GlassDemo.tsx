'use client';

import { Button, Card, SegmentedControl, useTheme, type GlassMode } from '@nexub/react';

const backdrop =
  'radial-gradient(circle at 18% 30%, #4099f1 0 20%, transparent 21%), radial-gradient(circle at 72% 40%, #f59e0b 0 16%, transparent 17%), radial-gradient(circle at 45% 85%, #8b5cf6 0 22%, transparent 23%), light-dark(#eceef4, #1b1d24)';

/**
 * Live Glass 2.0 demo. The dial is the real ThemeProvider setting: it changes
 * every glass surface on the site and is remembered (localStorage `nexub-glass`).
 */
export function GlassDemo() {
  const { glass, setGlass } = useTheme();
  return (
    <div style={{ display: 'grid', gap: 16, marginBottom: '2rem' }}>
      <SegmentedControl.Root value={glass} onValueChange={(v) => v && setGlass(v as GlassMode)} aria-label="Glass intensity">
        <SegmentedControl.Item value="clear">Clear</SegmentedControl.Item>
        <SegmentedControl.Item value="balanced">Balanced</SegmentedControl.Item>
        <SegmentedControl.Item value="tinted">Tinted</SegmentedControl.Item>
        <SegmentedControl.Item value="off">Solid</SegmentedControl.Item>
      </SegmentedControl.Root>
      <div style={{ background: backdrop, borderRadius: 24, padding: 32, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <Card style={{ padding: 24, width: 200 }}>
          <strong>Solid</strong>
          <p style={{ margin: '4px 0 0' }}>surface=&quot;solid&quot;</p>
        </Card>
        <Card surface="glass" style={{ padding: 24, width: 200 }}>
          <strong>Glass</strong>
          <p style={{ margin: '4px 0 0' }}>surface=&quot;glass&quot;</p>
        </Card>
        <Button variant="glass">Glass button</Button>
      </div>
    </div>
  );
}
