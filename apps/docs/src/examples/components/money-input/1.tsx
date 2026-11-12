'use client'; // docs preview: server pages import every example

import { MoneyInput } from '@nexub/react';

export default function Example() {
  return <MoneyInput aria-label="Betrag" currency="EUR" locale="de-DE" defaultValue={1234.5} />;
}
