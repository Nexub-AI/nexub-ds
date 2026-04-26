import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Pagination } from './Pagination.js';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = React.useState(1);
    return (
      <Pagination
        page={page}
        totalItems={100}
        pageSize={10}
        onPageChange={setPage}
      />
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = React.useState(5);
    return (
      <Pagination
        page={page}
        totalItems={500}
        pageSize={10}
        onPageChange={setPage}
      />
    );
  },
};

export const WithSiblingCount: Story = {
  render: () => {
    const [page, setPage] = React.useState(10);
    return (
      <Pagination
        page={page}
        totalItems={300}
        pageSize={10}
        siblingCount={2}
        onPageChange={setPage}
      />
    );
  },
};
