import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from './ThemeProvider.js';
import { Button } from '../Button/Button.js';
import { Card } from '../Card/Card.js';
import { Chip } from '../Chip/Chip.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { Switch } from '../Switch/Switch.js';
import { Progress } from '../Progress/Progress.js';

// Runtime white-label theming: <ThemeProvider seed="#…"> regenerates the
// primary (or tertiary) accent family from one colour and sets it on <html>
// through the CSSOM. It applies after the lazy @nexub/tokens/seed chunk loads,
// so server-rendered pages flash the default brand first; for SSR, render
// createSeedThemeCss(seed) from '@nexub/tokens/seed' into a <style> instead.
const meta: Meta<typeof ThemeProvider> = {
  title: 'Foundations/Seed theming',
  component: ThemeProvider,
};
export default meta;

const PRESETS = [
  ['Nexub blue', '#4099f1'],
  ['Crimson', '#d32f2f'],
  ['Sunflower', '#ffeb3b'],
  ['Teal', '#00897b'],
  ['Plum', '#7b1fa2'],
  ['Graphite', '#5f6368'],
] as const;

function SeedDemo({ target }: { target: 'primary' | 'tertiary' }) {
  const [seed, setSeed] = React.useState<string>(PRESETS[0][1]);
  const id = React.useId();
  return (
    // Separate storage keys so the demo never overwrites the toolbar's theme.
    <ThemeProvider
      seed={seed}
      seedTarget={target}
      defaultTheme={document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'}
      storageKey="nexub-seed-story-theme"
      glassStorageKey="nexub-seed-story-glass"
    >
      <div className="flex flex-col gap-6 max-w-[720px]">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor={id} className="text-label-lg">Seed</label>
          <input
            id={id}
            type="color"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="h-10 w-14 rounded-shape-field border border-[var(--color-outline-variant)] bg-transparent"
          />
          <code className="text-body-sm text-[var(--color-on-surface-muted)]">{seed}</code>
          {PRESETS.map(([name, hex]) => (
            <Button key={hex} variant={seed === hex ? 'tonal' : 'text'} size="sm" onClick={() => setSeed(hex)} aria-pressed={seed === hex}>
              {name}
            </Button>
          ))}
        </div>

        {target === 'primary' ? (
          <>
            <div className="flex flex-wrap gap-3">
              <Button variant="filled">Filled</Button>
              <Button variant="tonal">Tonal</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip className="bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]">Primary container</Chip>
              <Chip className="bg-[var(--color-primary)] text-[var(--color-on-primary)]">Primary</Chip>
              <Chip>Neutral</Chip>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card variant="surface" className="p-5 flex flex-col gap-3">
                <p className="text-title-md text-[var(--color-primary)]">Workspace plan</p>
                <p className="text-body-sm text-[var(--color-on-surface-muted)]">Accent text, controls and progress follow the seed.</p>
                <Progress value={64} aria-label="Usage" />
                <div className="flex items-center gap-4">
                  <Checkbox defaultChecked aria-label="Enabled" />
                  <Switch defaultChecked aria-label="Sync" />
                </div>
              </Card>
              <Card variant="flat" className="p-5 flex flex-col gap-3 bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)]">
                <p className="text-title-md">Container</p>
                <p className="text-body-sm">on-primary-container on primary-container: ≥ 4.5:1 for any seed.</p>
              </Card>
            </div>
          </>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Chip className="bg-[var(--color-tertiary-container)] text-[var(--color-on-tertiary-container)]">Product container</Chip>
            <Chip className="bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)]">Product</Chip>
            <Button variant="filled">Primary stays</Button>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

type Story = StoryObj<typeof ThemeProvider>;

/** Pick any colour: the primary family is regenerated in HCT and re-tints live. */
export const Primary: Story = { render: () => <SeedDemo target="primary" /> };

/** `seedTarget="tertiary"`: a product brand on top of the Nexub primary. */
export const ProductBrand: Story = { render: () => <SeedDemo target="tertiary" /> };
