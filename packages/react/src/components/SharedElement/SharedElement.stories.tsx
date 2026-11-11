import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { SharedElement } from './SharedElement.js';
import { Button } from '../Button/Button.js';
import { Card } from '../Card/Card.js';

const meta: Meta = {
  title: 'Components/SharedElement',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The card morphs between compact and expanded when toggled inside
 * startViewTransition(). The story renders the compact state; nothing animates until clicked.
 */
export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [expanded, setExpanded] = React.useState(false);
      const toggle = () => {
        const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
        if (doc.startViewTransition) doc.startViewTransition(() => setExpanded((e) => !e));
        else setExpanded((e) => !e);
      };
      return (
        <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
          <Button variant="outlined" onClick={toggle}>{expanded ? 'Collapse' : 'Expand'}</Button>
          <SharedElement name="story-card">
            <Card variant="surface" style={{ padding: 20, width: expanded ? 480 : 240 }}>
              <p className="text-title-md">Invoice #1042</p>
              {expanded && <p className="text-body-sm text-[var(--color-on-surface-muted)]">Due 15 January, $4,310.00</p>}
            </Card>
          </SharedElement>
        </div>
      );
    };
    return <Demo />;
  },
};
