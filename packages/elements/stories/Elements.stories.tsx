import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Field, lang, stack } from './shared';

// Both elements in a plain <form>, as a server-rendered page uses them (the per-element stories
// are NumberInputElement.stories.tsx and DatePickerElement.stories.tsx: one title per file).
// visual/elements.spec.ts drives this story: submit, reset, required, fieldset disabled.
const meta: Meta = {
  title: 'Components/Elements',
  parameters: { layout: 'padded' },
  decorators: [lang],
};
export default meta;
type Story = StoryObj;

// Plain buttons, as the server-rendered page would have; just enough style to read as buttons.
const button: React.CSSProperties = {
  paddingInline: '1rem',
  blockSize: 'var(--size-control-md, 2.5rem)',
  border: '1px solid var(--color-outline)',
  borderRadius: 'var(--shape-control, 999rem)',
  color: 'var(--color-on-surface)',
  // Its own surface: a native button's face is the engine's. WebKit's stays light grey under
  // color-scheme: dark (11.7), which put dark-theme text on a light face.
  background: 'var(--color-surface-container-high)',
};

/** The output shows the submitted `FormData`. */
export const Form: Story = {
  render: function FormStory() {
    const [result, setResult] = React.useState('');
    return (
      <form
        method="post"
        action="#"
        data-testid="form"
        style={stack}
        onSubmit={(e) => {
          e.preventDefault();
          setResult(JSON.stringify(Object.fromEntries(new FormData(e.currentTarget) as unknown as Iterable<[string, string]>)));
        }}
      >
        <Field id="age" label="Age">
          <nx-number-input id="age" name="age" min="18" max="120" step="1" required placeholder="18–120" />
        </Field>
        <Field id="start" label="Start date">
          <nx-date-picker id="start" name="start" min="2026-01-01" max="2026-12-31" required />
        </Field>
        <Field id="month" label="Billing month">
          <nx-date-picker id="month" name="month" granularity="month" defaultValue="2026-11" />
        </Field>
        <fieldset data-testid="extra" style={{ ...stack, margin: 0, border: '1px solid var(--color-outline-variant)', borderRadius: 'var(--shape-container)', padding: '1rem' }}>
          <legend>Extras</legend>
          <Field id="seats" label="Seats">
            <nx-number-input id="seats" name="seats" min="1" max="9" defaultValue="2" />
          </Field>
        </fieldset>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={button}>
            Send
          </button>
          <button type="reset" style={button}>
            Reset
          </button>
        </div>
        <output data-testid="result" aria-live="polite" style={{ fontFamily: 'var(--font-family-mono)', minBlockSize: '1.5rem' }}>
          {result}
        </output>
      </form>
    );
  },
};
