import * as React from 'react';
import type { Meta } from '@storybook/react';
import { Checkbox } from '../components/Checkbox/Checkbox.js';
import { RadioGroup } from '../components/RadioGroup/RadioGroup.js';
import { Switch } from '../components/Switch/Switch.js';
import { Input } from '../components/Input/Input.js';
import { Textarea } from '../components/Textarea/Textarea.js';
import { Badge } from '../components/Badge/Badge.js';
import { Chip } from '../components/Chip/Chip.js';
import { Toggle } from '../components/Toggle/Toggle.js';
import { Slider } from '../components/Slider/Slider.js';

// Every state of the Calm Depth core controls on one canvas: the review and
// visual-regression surface for design refresh Phase 2.
const meta: Meta = { title: 'Foundations/Core controls' };
export default meta;

const row: React.CSSProperties = { display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' };

export const States = () => (
  <div style={{ display: 'grid', gap: 20, maxWidth: 720 }}>
    <div style={row}>
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" checked="indeterminate" />
      <Checkbox aria-label="Disabled" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
      <RadioGroup.Root defaultValue="b" aria-label="Radio" style={{ flexDirection: 'row' }}>
        <RadioGroup.Item value="a" aria-label="A" />
        <RadioGroup.Item value="b" aria-label="B" />
        <RadioGroup.Item value="c" aria-label="C" disabled />
      </RadioGroup.Root>
    </div>
    <div style={row}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <React.Fragment key={size}>
          <Switch size={size} aria-label={`Off ${size}`} />
          <Switch size={size} aria-label={`On ${size}`} defaultChecked />
        </React.Fragment>
      ))}
      <Switch aria-label="Disabled" disabled />
      <Switch aria-label="Disabled on" disabled defaultChecked />
    </div>
    <div style={{ display: 'grid', gap: 12 }}>
      <Input placeholder="Placeholder" aria-label="Empty" />
      <Input defaultValue="Filled value" aria-label="Filled" />
      <Input defaultValue="Invalid value" invalid aria-label="Invalid" />
      <Input defaultValue="Disabled" disabled aria-label="Disabled input" />
      <Input placeholder="example" leadingAddon="https://" aria-label="With addon" />
      <Textarea placeholder="Textarea" aria-label="Textarea" />
    </div>
    <div style={row}>
      {(['soft', 'solid', 'outline'] as const).map((variant) =>
        (['neutral', 'info', 'success', 'warning', 'danger', 'payub'] as const).map((tone) => (
          <Badge key={`${variant}-${tone}`} variant={variant} tone={tone}>
            {tone}
          </Badge>
        )),
      )}
    </div>
    <div style={row}>
      {(['neutral', 'info', 'success', 'warning', 'danger', 'leap'] as const).map((tone) => (
        <Chip key={tone} tone={tone} onRemove={() => {}}>
          {tone}
        </Chip>
      ))}
    </div>
    <div style={row}>
      <Toggle aria-label="Off">Off</Toggle>
      <Toggle aria-label="On" defaultPressed>
        On
      </Toggle>
      <Toggle variant="outline" aria-label="Outline">
        Outline
      </Toggle>
      <Toggle disabled aria-label="Disabled toggle">
        Disabled
      </Toggle>
    </div>
    <div style={{ display: 'grid', gap: 12, maxWidth: 320 }}>
      <Slider defaultValue={[40]} aria-label="Slider" />
      <Slider defaultValue={[20, 70]} thumbLabels={['Min', 'Max']} />
      <Slider defaultValue={[60]} disabled aria-label="Disabled slider" />
    </div>
  </div>
);
