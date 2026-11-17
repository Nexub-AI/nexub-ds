import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button, IconChip } from '@nexub/react';
import { Wallet } from '@nexub/icons';
import { WelcomeBanner } from './WelcomeBanner.js';

const meta: Meta<typeof WelcomeBanner> = {
  title: 'Patterns/WelcomeBanner',
  component: WelcomeBanner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof WelcomeBanner>;

const banner = (
  <WelcomeBanner
    title="Welcome back, Mei"
    description="Two bills are due this week, and your savings goal is 80% there."
    actions={
      <>
        <Button>Review bills</Button>
        <Button variant="text">Not now</Button>
      </>
    }
    media={
      <IconChip category="accent" size="lg" shape="circle">
        <Wallet />
      </IconChip>
    }
    onDismiss={() => {}}
  />
);

export const Default: Story = { render: () => banner };

/** Under the vivid expression the banner carries a soft wash of the accent. */
export const Vivid: Story = { render: () => <div data-expression="vivid">{banner}</div> };
