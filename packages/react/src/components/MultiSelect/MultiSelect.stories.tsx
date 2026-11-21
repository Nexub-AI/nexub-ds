import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MultiSelect } from './MultiSelect.js';

const meta: Meta = {
  title: 'Components/MultiSelect',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

const labels = [
  { value: 'bug', label: 'Bug' },
  { value: 'design', label: 'Design' },
  { value: 'docs', label: 'Docs' },
  { value: 'perf', label: 'Performance' },
  { value: 'a11y', label: 'Accessibility' },
  { value: 'security', label: 'Security' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState(['bug', 'a11y']);
    return (
      <div style={{ width: '320px', maxWidth: '100%' }}>
        <MultiSelect aria-label="Labels" options={labels} value={value} onValueChange={setValue} placeholder="Add labels…" />
      </div>
    );
  },
};

export const MoreChips: Story = {
  render: () => (
    <div style={{ width: '320px', maxWidth: '100%' }}>
      <MultiSelect aria-label="Labels" options={labels} defaultValue={['bug', 'design', 'docs', 'perf', 'a11y']} maxVisibleChips={2} />
    </div>
  ),
};

/** 10.4: the shared size scale and the read-only state. */
export const ConsistentControls: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 280 }}>
      <MultiSelect size="sm" aria-label="Small" options={labels} defaultValue={["bug"]} />
      <MultiSelect size="md" aria-label="Medium" options={labels} defaultValue={["bug"]} />
      <MultiSelect size="lg" aria-label="Large" options={labels} defaultValue={["bug"]} />
      <MultiSelect readOnly aria-label="Read-only" options={labels} defaultValue={["bug", "docs"]} />
    </div>
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual list above. */
export const SheetAuto: Story = {
  render: () => (
    <div style={{ width: '18rem', maxWidth: '100%' }}>
      <MultiSelect aria-label="Labels" options={labels} defaultValue={['bug']} sheet="auto" />
    </div>
  ),
};

const initials = (name: string) => (
  <span
    aria-hidden="true"
    style={{ display: 'inline-grid', placeItems: 'center', width: 20, height: 20, borderRadius: 999, fontSize: 10, background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
  >
    {name.split(' ').map((p) => p[0]).join('')}
  </span>
);

/** 11.2: people as chips with avatars, a second line per option, and a disabled option. */
export const People: Story = {
  render: () => {
    const people = [
      { value: 'u1', label: 'Aisha Rahman', description: 'Finance', avatar: initials('Aisha Rahman') },
      { value: 'u2', label: 'Ben Ong', description: 'Sales', avatar: initials('Ben Ong') },
      { value: 'u3', label: 'Chen Wei', description: 'On leave', avatar: initials('Chen Wei'), disabled: true },
    ];
    const [value, setValue] = React.useState(['u1', 'u2']);
    return (
      <div style={{ maxWidth: 420 }}>
        <MultiSelect aria-label="Reviewers" options={people} value={value} onValueChange={setValue} />
      </div>
    );
  },
};
