'use client'; // docs preview: server pages import every example

import { Button, Card, CardLink, Logo } from '@nexub/react';
import { MarketingNav, type MarketingNavItem } from '@nexub/marketing';

// The nexub.com header: Products (the five divisions), Solutions and Resources.
export const items: MarketingNavItem[] = [
  {
    label: 'Products',
    columns: [
      {
        title: 'Nexub OS',
        href: '#os',
        accent: 'os',
        links: [
          { label: 'Leap', href: '#leap' },
          { label: 'People', href: '#people' },
          { label: 'PayHub', href: '#payhub' },
          { label: 'Contracts', href: '#contracts' },
          { label: 'Book Hub', href: '#book-hub' },
          { label: 'Forms', href: '#forms', badge: 'Early access' },
          { label: 'Founder Hub', href: '#founder-hub' },
        ],
      },
      {
        title: 'Nexub Commerce',
        href: '#commerce',
        accent: 'commerce',
        links: [{ label: 'Commerce', href: '#commerce-app', badge: 'Coming to Indonesia' }],
      },
      {
        title: 'Nexub Fintech',
        href: '#fintech',
        accent: 'fintech',
        links: [
          { label: 'Money', href: '#money', badge: 'Coming soon' },
          { label: 'Capital', href: '#capital', badge: 'Coming soon' },
        ],
      },
      {
        title: 'Nexub Intelligence',
        href: '#intelligence',
        accent: 'intelligence',
        links: [
          { label: 'Mind', href: '#mind' },
          { label: 'Go', href: '#go' },
          { label: 'Bring your own AI key', href: '#byok' },
        ],
      },
      {
        title: 'Nexub Autonomous',
        href: '#autonomous',
        accent: 'autonomous',
        links: [
          { label: 'Command Hub', href: '#command-hub' },
          { label: 'Runner', href: '#runner' },
          { label: 'Robotics & logistics', href: '#robotics', badge: 'In research' },
        ],
      },
    ],
    footer: [
      { label: 'All products', href: '#products' },
      { label: 'Nexub Account', href: '#account' },
      { label: 'Integrations', href: '#integrations' },
    ],
  },
  {
    label: 'Solutions',
    columns: [
      {
        title: 'By stage',
        links: [
          { label: 'Starting up', href: '#starting-up', description: 'Incorporate and open for business' },
          { label: 'Growing', href: '#growing', description: 'Hire, pay and stay compliant' },
          { label: 'Scaling', href: '#scaling', description: 'Many entities, one view' },
        ],
      },
      {
        title: 'By industry',
        links: [
          { label: 'Retail and e-commerce', href: '#retail' },
          { label: 'Professional services', href: '#services' },
          { label: 'Food and beverage', href: '#fnb' },
          { label: 'Logistics', href: '#logistics' },
        ],
      },
      {
        title: 'By need',
        links: [
          { label: 'Payroll', href: '#payroll' },
          { label: 'Bookkeeping', href: '#bookkeeping' },
          { label: 'Company secretary', href: '#cosec' },
          { label: 'Fundraising', href: '#fundraising' },
        ],
      },
    ],
    feature: (
      <Card variant="surface" className="flex h-full flex-col gap-2 p-5">
        <p className="m-0 text-label-md text-[var(--color-on-surface-muted)]">Customer story</p>
        <p className="m-0 text-title-md text-[var(--color-on-surface)]">
          <CardLink href="#story">How a 40-person studio closes its books in two days</CardLink>
        </p>
      </Card>
    ),
  },
  {
    label: 'Resources',
    columns: [
      {
        title: 'Learn',
        links: [
          { label: 'Guides', href: '#guides' },
          { label: 'Blog', href: '#blog' },
          { label: 'Webinars', href: '#webinars' },
        ],
      },
      {
        title: 'Tools',
        links: [
          { label: 'Payroll calculator', href: '#calculator' },
          { label: 'Company name check', href: '#name-check' },
          { label: 'Templates', href: '#templates' },
        ],
      },
      {
        title: 'Help',
        links: [
          { label: 'Help centre', href: '#help' },
          { label: 'Contact sales', href: '#sales' },
          { label: 'System status', href: '#status' },
        ],
      },
    ],
  },
  { label: 'Pricing', href: '#pricing' },
];

export default function Example() {
  // Room for the open panel: the docs preview clips what overflows it.
  return (
    <div data-mode="marketing" className="min-h-[34rem] w-full">
      <MarketingNav
        logo={<Logo size="sm" />}
        items={items}
        countries={[
          { code: 'SG', label: 'Singapore', href: '#sg' },
          { code: 'MY', label: 'Malaysia', href: '#my' },
          { code: 'IN', label: 'India', href: '#in' },
          { code: 'ID', label: 'Indonesia', href: '#id' },
          { code: 'VN', label: 'Vietnam', href: '#vn' },
        ]}
        country="SG"
        actions={
          <>
            <Button variant="text" size="sm" asChild><a href="#signin">Sign in</a></Button>
            <Button variant="filled" size="sm" asChild><a href="#start">Get started</a></Button>
          </>
        }
      />
    </div>
  );
}
