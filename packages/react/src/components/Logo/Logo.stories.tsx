import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from './Logo.js';

const meta: Meta<typeof Logo> = {
  title: 'Components/Logo',
  component: Logo,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['full', 'icon'] },
    mark: { control: 'inline-radio', options: ['color', 'mono'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['default', 'inverse'] },
  },
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {
  args: { variant: 'full', mark: 'color', size: 'md', tone: 'default' },
};

export const Mono: Story = {
  args: { variant: 'full', mark: 'mono' },
};

export const Icon: Story = {
  args: { variant: 'icon' },
};

export const WithProduct: Story = {
  args: { product: 'Command Hub' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Logo size="sm" product="Account" />
      <Logo size="md" product="Account" />
      <Logo size="lg" product="Account" />
    </div>
  ),
};

/** Every combination on light and dark surfaces, independent of the toolbar theme. */
export const LightAndDark: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="flex flex-col items-start gap-5 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-6"
        >
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
            {theme}
          </span>
          <Logo />
          <Logo mark="mono" />
          <Logo product="Command Hub" />
          <Logo product="Account" mark="mono" />
          <div className="flex items-center gap-4">
            <Logo variant="icon" />
            <Logo variant="icon" mark="mono" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Inverse: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4 rounded-xl bg-[var(--color-bg-inverse)] p-6">
      <Logo tone="inverse" />
      <Logo tone="inverse" mark="mono" product="Command Hub" />
    </div>
  ),
};
