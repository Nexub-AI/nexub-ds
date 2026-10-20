import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { MediaCard } from './MediaCard.js';
import { Button } from '../Button/Button.js';

// Inline SVG keeps the story offline and deterministic.
const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><circle cx="300" cy="80" r="40" fill="#fde68a"/></svg>',
  );

const meta: Meta<typeof MediaCard> = {
  title: 'Components/MediaCard',
  component: MediaCard,
  tags: ['autodocs'],
  args: { className: 'w-80', src: IMG, alt: 'Abstract sunset', ratio: '16/9', eyebrow: 'Travel', title: 'Lisbon in three days', description: 'Trams, tiles and the best pastel de nata.' },
};
export default meta;

type Story = StoryObj<typeof MediaCard>;

export const Default: Story = {};

export const Linked: Story = { args: { href: '#lisbon' } };

export const WithActions: Story = {
  args: {
    href: '#lisbon',
    children: (
      <Button size="sm" variant="secondary">
        Save
      </Button>
    ),
  },
};

export const Ratios: Story = {
  decorators: [(Story) => <div className="grid w-[720px] grid-cols-4 items-start gap-4">{Story()}</div>],
  render: (args) => (
    <>
      {(['16/9', '4/3', '1/1', '3/4'] as const).map((r) => (
        <MediaCard key={r} {...args} ratio={r} className="w-full" title={r} description={undefined} eyebrow={undefined} />
      ))}
    </>
  ),
};

export const ImageOnly: Story = { args: { title: undefined, description: undefined, eyebrow: undefined, alt: '' } };
