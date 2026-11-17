import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '@nexub/react';
import { StatusPage } from './StatusPage.js';

const meta: Meta<typeof StatusPage> = {
  title: 'Patterns/Pages/StatusPage',
  component: StatusPage,
  parameters: { layout: 'fullscreen' },
  args: { as: 'div', fullScreen: true },
};
export default meta;
type Story = StoryObj<typeof StatusPage>;

const noop = () => {};

export const NotFound: Story = { args: { kind: 'notFound', code: '404', homeHref: '#' } };

export const ServerError: Story = { args: { kind: 'serverError', code: '500', onRetry: noop } };

export const Maintenance: Story = {
  args: { kind: 'maintenance', description: 'We’re making some improvements. We expect to be back by 6:00 pm.' },
};

export const Offline: Story = { args: { kind: 'offline', onRetry: noop } };

export const NoAccess: Story = {
  args: {
    kind: 'noAccess',
    code: '403',
    actions: (
      <>
        <Button>Request access</Button>
        <Button variant="text">Switch workspace</Button>
      </>
    ),
  },
};
