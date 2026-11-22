import type { Meta, StoryObj } from '@storybook/react';
import { Field, lang, openOnMount, stack } from './shared';

/** `<nx-date-picker>` from `@nexub/elements`: the web component for pages without React. */
const meta: Meta = {
  title: 'Components/DatePickerElement',
  parameters: { layout: 'padded' },
  decorators: [lang],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={stack}>
      <Field id="due" label="Due date">
        <nx-date-picker id="due" name="due" defaultValue="2024-03-14" />
      </Field>
    </div>
  ),
};

export const MonthGranularity: Story = {
  name: 'Month granularity',
  render: () => (
    <div style={stack}>
      <Field id="billing" label="Billing month">
        <nx-date-picker id="billing" name="billing" granularity="month" defaultValue="2024-03" />
      </Field>
    </div>
  ),
};

export const YearGranularity: Story = {
  name: 'Year granularity',
  render: () => (
    <div style={stack}>
      <Field id="founded" label="Year founded">
        <nx-date-picker id="founded" name="founded" granularity="year" min="2016" max="2025" defaultValue="2024" />
      </Field>
    </div>
  ),
};

/** Days before `min` and after `max` are disabled in the calendar. */
export const MinMax: Story = {
  render: () => (
    <div style={stack}>
      <Field id="window" label="Delivery date">
        <nx-date-picker id="window" name="window" min="2024-03-05" max="2024-03-25" defaultValue="2024-03-14" />
      </Field>
    </div>
  ),
};

/** The calendar open on a fixed date (opened on mount), with `min` and `max` disabling the ends of the month. */
export const Open: Story = {
  // Fullscreen with the padding in the story: the padded layout's class lands after the first
  // render, which would move the field away from a calendar already placed under it.
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ ...stack, minBlockSize: '26rem', padding: '1rem' }}>
      <Field id="open-date" label="Check-in">
        <nx-date-picker ref={openOnMount} id="open-date" name="checkin" min="2024-03-04" max="2024-03-28" defaultValue="2024-03-14" />
      </Field>
    </div>
  ),
};
