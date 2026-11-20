import type { Meta, StoryObj } from '@storybook/react';
import { Sparkles } from '@nexub/icons';
import { QRCode } from './QRCode.js';

const meta: Meta<typeof QRCode> = { title: 'Components/QRCode', component: QRCode, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof QRCode>;

export const Default: Story = { args: { value: 'https://example.com/h/4729' } };

/** A logo covers the centre, so the code is drawn at error correction level H. */
export const WithLogo: Story = {
  args: { value: 'https://example.com/h/4729', size: 200, logo: <Sparkles />, caption: 'example.com/h/4729' },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-80 flex-wrap items-end gap-4">
      <QRCode value="NX-4729" size={96} />
      <QRCode value="NX-4729" size={128} />
      <QRCode value="NX-4729" size="10rem" caption={false} label="QR code for order NX-4729" />
    </div>
  ),
};
