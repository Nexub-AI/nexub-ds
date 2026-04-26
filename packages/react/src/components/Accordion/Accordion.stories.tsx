import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Accordion } from './Accordion.js';

const meta: Meta = {
  title: 'Disclosure/Accordion',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '480px' }}>
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>What is a design system?</Accordion.Trigger>
          <Accordion.Content>
            A design system is a collection of reusable components, guided by clear standards, that
            can be assembled to build any number of applications.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Why use reusable components?</Accordion.Trigger>
          <Accordion.Content>
            Reusable components promote consistency across your product, reduce duplicate work, and
            make it easier for teams to collaborate on UI at scale.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>How do I get started?</Accordion.Trigger>
          <Accordion.Content>
            Install the package, import the components you need, and wrap them in the appropriate
            Root element. Each component follows a compound pattern for maximum flexibility.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
};
