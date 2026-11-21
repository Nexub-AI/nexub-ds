import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ResourceTimeline, type ResourceCell } from './ResourceTimeline.js';
import { Avatar } from '../Avatar/Avatar.js';

const meta: Meta = {
  title: 'Components/ResourceTimeline',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

// Pinned dates keep the screenshots stable.
const range = { from: new Date(2026, 10, 2), to: new Date(2026, 10, 22) };
const people = [
  { id: 'ana', label: 'Ana Lima', description: 'Design' },
  { id: 'ben', label: 'Ben Ode', description: 'Engineering' },
  { id: 'cho', label: 'Cho Park', description: 'Support' },
  { id: 'dev', label: 'Dev Rao', description: 'Finance' },
].map((p) => ({ ...p, avatar: <Avatar size="sm" name={p.label} /> }));
const initial: Record<string, ResourceCell> = {
  'ana-3': { value: 'AL', tone: 'info' },
  'ana-4': { value: 'AL', tone: 'info' },
  'ben-10': { value: 'Sick', tone: 'warning' },
  'cho-16': { value: 'AL', tone: 'info' },
  'cho-17': { value: 'AL', tone: 'info' },
  'cho-18': { value: 'AL', tone: 'info' },
  'dev-20': { value: 'Pending', tone: 'neutral' },
};

/** Team leave: Enter or a click on a cell toggles leave (your editor goes there); totals in the footer and last column. */
export const TeamLeave: Story = {
  render: function Render() {
    const [cells, setCells] = React.useState(initial);
    const count = (match: (k: string) => boolean) => Object.keys(cells).filter(match).length;
    return (
      <ResourceTimeline
        label="Team leave, November 2026"
        resources={people}
        range={range}
        now={new Date(2026, 10, 9)}
        getCell={(id, d) => cells[`${id}-${d.getDate()}`]}
        onCellActivate={(id, d) =>
          setCells((c) => {
            const k = `${id}-${d.getDate()}`;
            const { [k]: had, ...rest } = c;
            return had ? rest : { ...c, [k]: { value: 'AL', tone: 'info' } };
          })
        }
        footer={(d) => count((k) => k.endsWith(`-${d.getDate()}`)) || ''}
        rowTotal={(id) => count((k) => k.startsWith(`${id}-`))}
        grandTotal={Object.keys(cells).length}
      />
    );
  },
};

/** Without `onCellActivate`: a read-only table. */
export const ReadOnly: Story = {
  render: () => <ResourceTimeline label="Team leave" resources={people} range={range} now={new Date(2026, 10, 9)} getCell={(id, d) => initial[`${id}-${d.getDate()}`]} />,
};
