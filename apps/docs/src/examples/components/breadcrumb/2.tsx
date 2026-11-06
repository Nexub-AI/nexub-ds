import { Breadcrumb } from '@nexub/react';

export default function Example() {
  return (
    <Breadcrumb.Trail
      maxItems={3}
      items={[
        { label: 'Home', href: '/' },
        { label: 'Acme', href: '/' },
        { label: 'Billing', href: '/' },
        { label: 'Invoices', href: '/' },
        { label: 'INV-2041' },
      ]}
    />
  );
}
