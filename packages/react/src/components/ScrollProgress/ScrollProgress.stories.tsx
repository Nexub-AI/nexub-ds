import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ScrollProgress } from './ScrollProgress.js';

const meta: Meta = {
  title: 'Components/ScrollProgress',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Scroll the page to fill the bar along the top. At rest (scroll 0) the bar is
 * empty, and it is hidden under reduced motion, so screenshots are stable.
 */
export const Default: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <ScrollProgress />
      <h2 className="text-title-lg">Release notes</h2>
      {[1, 2, 3].map((n) => (
        <p key={n} className="text-body-md">
          Section {n}. A bar along the top of the viewport tracks how far the page has scrolled.
        </p>
      ))}
    </div>
  ),
};
