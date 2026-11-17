import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Breadcrumb } from './Breadcrumb.js';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  parameters: { layout: 'centered' },
};

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  ),
};

export const WithEllipsis: StoryObj = {
  render: () => (
    <Breadcrumb.Root>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Ellipsis />
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  ),
};

/** 10.6: a bottom sheet below the md breakpoint, the usual "More" menu above. */
export const SheetAuto: StoryObj = {
  render: () => (
    <Breadcrumb.Trail
      sheet="auto"
      maxItems={2}
      items={[{ label: 'Home', href: '/' }, { label: 'Library', href: '/library' }, { label: 'Data', href: '/library/data' }, { label: 'Report' }]}
    />
  ),
};
