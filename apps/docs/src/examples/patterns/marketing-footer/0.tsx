'use client'; // docs preview: server pages import every example

import { Logo } from '@nexub/react';
import { MarketingFooter } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <MarketingFooter
        logo={<Logo size="sm" />}
        tagline="The operating system for growing companies."
        tools={['Slack', 'Xero', 'Google Workspace', 'Stripe', 'QuickBooks', 'WhatsApp']}
        columns={[
          { title: 'Products', links: [{ label: 'Payub', href: '#payub' }, { label: 'Bookub', href: '#bookub' }, { label: 'Leap', href: '#leap' }] },
          { title: 'Company', links: [{ label: 'About', href: '#about' }, { label: 'Careers', href: '#careers' }] },
          { title: 'Resources', links: [{ label: 'Help centre', href: '#help' }, { label: 'Status', href: '#status' }] },
        ]}
        bottom="© 2026 Nexub Pte. Ltd., Singapore"
      />
    </div>
  );
}
