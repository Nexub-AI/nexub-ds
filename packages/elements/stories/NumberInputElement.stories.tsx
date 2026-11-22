import type { Meta, StoryObj } from '@storybook/react';
import { Field, lang, stack, validateOnMount } from './shared';

/** `<nx-number-input>` from `@nexub/elements`: the web component for pages without React. */
const meta: Meta = {
  title: 'Components/NumberInputElement',
  parameters: { layout: 'padded' },
  decorators: [lang],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={stack}>
      <Field id="quantity" label="Quantity">
        <nx-number-input id="quantity" name="quantity" min="0" max="100" step="1" defaultValue="5" placeholder="0–100" />
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size} id={`size-${size}`} label={`Size ${size}`}>
          <nx-number-input id={`size-${size}`} name={size} size={size} defaultValue="42" />
        </Field>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={stack}>
      <Field id="disabled-number" label="Seats">
        <nx-number-input id="disabled-number" name="seats" defaultValue="2" disabled />
      </Field>
    </div>
  ),
};

/** Shown as after a failed submit: a required field left empty, and a value over `max`. */
export const InvalidRequired: Story = {
  name: 'Invalid/required',
  render: () => (
    <div style={stack}>
      <Field id="required-number" label="Age (required)">
        <nx-number-input ref={validateOnMount} id="required-number" name="age" min="18" max="120" required placeholder="18–120" />
      </Field>
      <Field id="over-number" label="Guests (at most 8)">
        <nx-number-input ref={validateOnMount} id="over-number" name="guests" max="8" defaultValue="12" />
      </Field>
    </div>
  ),
};
