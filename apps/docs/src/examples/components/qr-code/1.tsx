'use client'; // docs preview: server pages import every example

import { QRCode } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  return <QRCode value="https://example.com/h/4729" size={200} logo={<Sparkles />} caption="example.com/h/4729" label="QR code for order 4729" />;
}
