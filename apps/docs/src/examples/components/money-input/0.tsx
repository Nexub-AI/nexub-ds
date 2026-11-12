'use client'; // docs preview: server pages import every example

import { MoneyInput } from '@nexub/react';

export default function Example() {
  return <MoneyInput aria-label="Amount to send" currency="USD" defaultValue={1250} />;
}
