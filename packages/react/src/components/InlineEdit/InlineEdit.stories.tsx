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

/** 11.5: `size` from body text to a headline; the input matches while editing. */
export const Sizes: Story = {
  render: () => {
    const sizes = ['sm', 'md', 'lg', 'title', 'headline'] as const;
    return (
      <div className="flex flex-col items-start gap-3">
        {sizes.map((size) => (
          <InlineEdit key={size} size={size} label={`Name (${size})`} value={`Size ${size}`} onSave={() => {}} />
        ))}
      </div>
    );
  },
};

/** 11.5: `as="h2"` keeps a page heading in place; `maxLength` adds a counter while editing. */
function HeadingDemo() {
  const [value, setValue] = React.useState('Quarterly roadmap');
  return <InlineEdit as="h2" size="headline" maxLength={40} label="Page title" value={value} onSave={setValue} />;
}
export const HeadingWithLimit: Story = { render: () => <HeadingDemo /> };
