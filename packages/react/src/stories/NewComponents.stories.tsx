import * as React from 'react';
import type { Meta } from '@storybook/react';
import { Folder, Home, Plus, Settings } from '@nexub/icons';
import { Button } from '../components/Button/Button.js';
import { ButtonGroup } from '../components/ButtonGroup/ButtonGroup.js';
import { SplitButton } from '../components/SplitButton/SplitButton.js';
import { DropdownMenu } from '../components/DropdownMenu/DropdownMenu.js';
import { Toolbar } from '../components/Toolbar/Toolbar.js';
import { NavigationRail } from '../components/NavigationRail/NavigationRail.js';
import { IconButton } from '../components/IconButton/IconButton.js';
import { Amount } from '../components/Amount/Amount.js';
import { MoneyInput } from '../components/MoneyInput/MoneyInput.js';

// Design refresh Phase 5: the new components on one canvas for review and
// visual regression.
const meta: Meta = { title: 'Foundations/New components' };
export default meta;

const row: React.CSSProperties = { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' };

export const Gallery = () => (
  <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 24, maxWidth: 860 }}>
    <NavigationRail.Root
      aria-label="Workspace"
      header={
        <IconButton label="New" variant="subtle" size="lg" className="rounded-[16px]">
          <Plus size="md" aria-hidden="true" />
        </IconButton>
      }
      style={{ background: 'var(--color-surface-container-low)', borderRadius: 24 }}
    >
      <NavigationRail.Item href="#" icon={<Home />} label="Home" active />
      <NavigationRail.Item href="#" icon={<Folder />} label="Files" />
      <NavigationRail.Item href="#" icon={<Settings />} label="Settings" />
    </NavigationRail.Root>

    <div style={{ display: 'grid', gap: 24, alignContent: 'start' }}>
      <div style={row}>
        <ButtonGroup attached aria-label="Alignment">
          <Button variant="tonal">Left</Button>
          <Button variant="tonal">Center</Button>
          <Button variant="tonal">Right</Button>
        </ButtonGroup>
        <SplitButton
          menuLabel="More save options"
          menu={
            <>
              <DropdownMenu.Item>Save as draft</DropdownMenu.Item>
              <DropdownMenu.Item>Save a copy</DropdownMenu.Item>
            </>
          }
        >
          Save
        </SplitButton>
        <SplitButton variant="outlined" menuLabel="More export options" menu={<DropdownMenu.Item>CSV</DropdownMenu.Item>}>
          Export
        </SplitButton>
      </div>

      {/* A floating toolbar over busy content. */}
      <div
        style={{
          padding: 32,
          borderRadius: 24,
          background:
            'radial-gradient(circle at 20% 30%, #4099f1 0 22%, transparent 23%), radial-gradient(circle at 75% 60%, #f59e0b 0 18%, transparent 19%), light-dark(#eceef4, #1b1d24)',
        }}
      >
        <Toolbar.Root floating aria-label="Formatting" style={{ width: 'fit-content' }}>
          <Toolbar.ToggleGroup type="multiple" defaultValue={['b']} aria-label="Text style">
            <Toolbar.ToggleItem value="b" aria-label="Bold">B</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="i" aria-label="Italic">I</Toolbar.ToggleItem>
            <Toolbar.ToggleItem value="u" aria-label="Underline">U</Toolbar.ToggleItem>
          </Toolbar.ToggleGroup>
          <Toolbar.Separator />
          <Toolbar.Button>Comment</Toolbar.Button>
          <Toolbar.Button>Share</Toolbar.Button>
        </Toolbar.Root>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <span className="text-label-md text-[var(--color-on-surface-muted)]">Available balance</span>
        <Amount value={128450.75} currency="USD" locale="en-US" size="display" />
        <div style={row}>
          <Amount value={2450} currency="EUR" locale="de-DE" size="lg" />
          <Amount value={312.4} currency="USD" locale="en-US" tone="auto" signDisplay="exceptZero" />
          <Amount value={-89.99} currency="USD" locale="en-US" tone="auto" />
          <Amount value={150000} currency="JPY" locale="ja-JP" />
        </div>
      </div>

      <div style={{ maxWidth: 320 }}>
        <MoneyInput aria-label="Amount to send" currency="USD" locale="en-US" defaultValue={1250} />
      </div>
    </div>
  </div>
);
