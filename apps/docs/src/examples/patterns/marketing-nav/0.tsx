import { Button, Logo } from '@nexub/react';
import { MarketingNav } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <MarketingNav
        logo={<Logo size="sm" />}
        items={[
          {
            label: 'Products',
            items: [
              { label: 'Payub', href: '#payub', description: 'Payroll and HR' },
              { label: 'Bookub', href: '#bookub', description: 'Bookkeeping' },
              { label: 'Leap', href: '#leap', description: 'Company formation' },
              { label: 'Founderub', href: '#founderub', description: 'Founder tools' },
            ],
          },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Customers', href: '#customers' },
        ]}
        countries={[
          { code: 'SG', label: 'Singapore', href: '#sg' },
          { code: 'IN', label: 'India', href: '#in' },
          { code: 'ID', label: 'Indonesia', href: '#id' },
          { code: 'MY', label: 'Malaysia', href: '#my' },
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
