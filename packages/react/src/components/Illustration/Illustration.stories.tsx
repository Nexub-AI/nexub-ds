import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Illustration, type IllustrationKind } from './Illustration.js';

const meta: Meta<typeof Illustration> = { title: 'Components/Illustration', component: Illustration, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof Illustration>;

const kinds: IllustrationKind[] = ['noData', 'noResults', 'noAccess', 'serverError', 'offline', 'notFound', 'maintenance'];

export const Default: Story = { args: { kind: 'noData' } };

/** One drawing per kind. They follow the theme, dark mode and the product accent. */
export const Kinds: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-wrap gap-6">
      {kinds.map((kind) => (
        <figure key={kind} className="m-0 flex flex-col items-center gap-2">
          <Illustration kind={kind} />
          <figcaption className="text-label-md text-[var(--color-on-surface-variant)]">{kind}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      <Illustration kind="noResults" size="sm" />
      <Illustration kind="noResults" size="md" />
      <Illustration kind="noResults" size="lg" />
    </div>
  ),
};

/** With a `title` the drawing is an image with that name. */
export const Titled: Story = { args: { kind: 'offline', title: 'You are offline' } };
