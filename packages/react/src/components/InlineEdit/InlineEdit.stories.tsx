import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InlineEdit } from './InlineEdit.js';

const meta: Meta = {
  title: 'Components/InlineEdit',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ initial }: { initial: string }) {
  const [value, setValue] = React.useState(initial);
  return <InlineEdit label="Project name" placeholder="Add a name" value={value} onSave={setValue} />;
}

export const Default: Story = { render: () => <Demo initial="Q4 launch plan" /> };
export const Empty: Story = { render: () => <Demo initial="" /> };
