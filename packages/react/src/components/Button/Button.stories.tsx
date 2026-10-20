import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button.js';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
};

const variants = ['filled', 'tonal', 'outlined', 'text', 'destructive', 'accent', 'link'] as const;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const tones = ['neutral', 'info', 'success', 'warning', 'danger', 'leap', 'bookub', 'payub', 'founderub'] as const;

/** Every variant, enabled and disabled, plus the size ladder and tones. */
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {variants.map((v) => (
        <div key={v} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button variant={v}>{v}</Button>
          <Button variant={v} disabled>
            Disabled
          </Button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {sizes.map((s) => (
          <Button key={s} size={s}>
            Size {s}
          </Button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {tones.map((t) => (
          <Button key={t} tone={t}>
            {t}
          </Button>
        ))}
      </div>
    </div>
  ),
};
