import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '@nexub/react';
import { InvoicePage, type InvoicePageProps } from './InvoicePage.js';

const meta: Meta<typeof InvoicePage> = {
  title: 'Patterns/Pages/InvoicePage',
  component: InvoicePage,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof InvoicePage>;

const invoice: InvoicePageProps = {
  as: 'div',
  number: 'INV-2041',
  issuedOn: '2026-11-03',
  dueOn: '2026-11-17',
  from: { name: 'Harbour Studio', lines: ['12 Quay Street', 'Port Ellis', 'billing@harbour.test'], taxId: 'HS-204-881' },
  to: { name: 'Northwind Traders', lines: ['4 Mill Lane', 'Eastbrook'] },
  items: [
    { id: 'sprint', description: 'Design sprint', detail: 'October, two weeks', quantity: 2, unitPrice: 2400 },
    { id: 'research', description: 'User interviews', quantity: 6, unitPrice: 180 },
    { id: 'hosting', description: 'Prototype hosting', detail: 'Monthly', quantity: 1, unitPrice: 45 },
  ],
  currency: 'USD',
  locale: 'en-US',
  discount: 200,
  taxes: [{ label: 'Sales tax 8%', amount: 458 }],
  notes: 'Thank you for working with us.',
};

/** An invoice that is due: parties, line items, the arithmetic and how to pay. */
export const Default: Story = {
  render: () => (
    <InvoicePage
      {...invoice}
      status="due"
      payment="Pay by bank transfer within 14 days, quoting the invoice number."
      actions={
        <>
          <Button variant="outlined">Download</Button>
          <Button>Pay now</Button>
        </>
      }
    />
  ),
};

/** The receipt: compact and centred, the amount as the hero. */
export const Receipt: Story = {
  render: () => <InvoicePage {...invoice} variant="receipt" status="paid" dueOn={undefined} notes={undefined} payment="Paid by card ending 4242." actions={<Button variant="tonal">Download</Button>} />,
};
