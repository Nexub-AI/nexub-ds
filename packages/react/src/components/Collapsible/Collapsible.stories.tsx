import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Collapsible } from './Collapsible.js';

const meta: Meta = {
  title: 'Disclosure/Collapsible',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ width: '360px' }}>
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Release notes</span>
            <Collapsible.Trigger
              style={{
                fontSize: '13px',
                padding: '4px 10px',
                border: '1px solid var(--color-border-default, #e2e8f0)',
                borderRadius: '6px',
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              {open ? 'Hide' : 'Show'} details
            </Collapsible.Trigger>
          </div>
          <p style={{ fontSize: '13px', margin: 0 }}>v2.4.0 — performance improvements and bug fixes.</p>
          <Collapsible.Content>
            <ul style={{ fontSize: '13px', marginTop: '8px', paddingLeft: '16px', lineHeight: '1.75' }}>
              <li>Reduced bundle size by 12%</li>
              <li>Fixed focus ring on Safari</li>
              <li>Improved keyboard navigation in Select</li>
              <li>Updated peer dependency ranges</li>
            </ul>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    );
  },
};
