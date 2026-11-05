// A server component: every section below renders on the server, and only
// the nav, the ticking numbers and the buttons ship to the browser.
import { Badge } from '@nexub/react/Badge';
import { Button } from '@nexub/react/Button';
import { Card } from '@nexub/react/Card';
import { Logo } from '@nexub/react/Logo';
import { Float } from '@nexub/react/Motion';
import { ArrowRight, BookubMark, FounderubMark, LeapMark, PayubMark } from '@nexub/icons';
import { CTABand } from '@nexub/marketing/CTABand';
import { Hero } from '@nexub/marketing/Hero';
import { LogoStrip } from '@nexub/marketing/LogoStrip';
import { MarketingFooter } from '@nexub/marketing/MarketingFooter';
import { MarketingNav } from '@nexub/marketing/MarketingNav';
import { ProductCard, ProductGrid } from '@nexub/marketing/Products';
import { SectionHeader } from '@nexub/marketing/SectionHeader';
import { StatBand, StatBandItem } from '@nexub/marketing/StatBand';
import { TestimonialCard, TestimonialGrid } from '@nexub/marketing/Testimonials';

const customers = ['Kopi Labs', 'Harbourline', 'Sonvo', 'Tanjong Freight', 'Mekong Foods', 'Batik Studio'];

function DashboardVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <Card variant="showcase" className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-title-md">This month</span>
          <Badge variant="soft" tone="success" size="sm">On track</Badge>
        </div>
        {[
          ['Payroll', 'S$84,210', 'w-4/5'],
          ['Expenses', 'S$12,940', 'w-2/5'],
          ['Revenue', 'S$203,500', 'w-full'],
        ].map(([label, value, width]) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-body-sm">
              <span className="text-[var(--color-on-surface-variant)]">{label}</span>
              <span className="tabular-nums">{value}</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--color-surface-container-high)]">
              <div className={`nx-mkt-bar h-2 rounded-full bg-[var(--color-primary)] ${width}`} />
            </div>
          </div>
        ))}
      </Card>
      <Float className="absolute -start-6 -top-6 hidden sm:block">
        <Card variant="showcase" accent="payub" className="nx-mkt-float-card flex items-center gap-2 p-3 text-label-lg">
          <PayubMark size={20} /> Payroll approved
        </Card>
      </Float>
      <Float speed="slow" className="absolute -bottom-6 -end-6 hidden sm:block">
        <Card variant="showcase" accent="bookub" className="nx-mkt-float-card flex items-center gap-2 p-3 text-label-lg">
          <BookubMark size={20} /> Books closed
        </Card>
      </Float>
    </div>
  );
}

export function MarketingExample() {
  return (
    <div data-mode="marketing" className="overflow-hidden rounded-shape-container border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-lowest)]">
      <MarketingNav
        className="static"
        logo={<Logo size="sm" />}
        items={[
          {
            label: 'Products',
            items: [
              { label: 'Leap', href: '#leap', description: 'Incorporate and stay compliant' },
              { label: 'Bookub', href: '#bookub', description: 'Bookkeeping that closes itself' },
              { label: 'Payub', href: '#payub', description: 'Payroll and HR' },
              { label: 'Founderub', href: '#founderub', description: 'Cap table and fundraising' },
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
      <Hero
        eyebrow="Now in Vietnam"
        title="Run your whole company in one place"
        description="Payroll, bookkeeping and compliance for growing teams across Southeast Asia and India."
        actions={
          <>
            <Button variant="hero" size="lg" asChild><a href="#start">Start free <ArrowRight size={16} aria-hidden="true" /></a></Button>
            <Button variant="outlined" size="lg" asChild><a href="#demo">Book a demo</a></Button>
          </>
        }
        visual={<DashboardVisual />}
      />
      <div className="nx-mkt-accent-line" aria-hidden="true" />
      <LogoStrip label="Trusted by 2,000+ teams">
        {customers.map((name) => (
          <span key={name} className="text-title-lg text-[var(--color-on-surface-muted)]">{name}</span>
        ))}
      </LogoStrip>
      <StatBand>
        <StatBandItem value={2000} suffix="+" label="Companies" />
        <StatBandItem value={5} label="Countries" tone="success" />
        <StatBandItem value={98} suffix="%" label="On-time payroll" tone="payub" />
        <StatBandItem value={30} suffix=" min" label="Average month-end close" tone="founderub" />
      </StatBand>
      <TestimonialGrid header={<SectionHeader eyebrow="Customers" title="Loved by finance teams" />}>
        <TestimonialCard accent="payub" rating={5} name="Priya Nair" role="Head of People, Kopi Labs" quote="Payroll used to take two days. Now it takes twenty minutes." />
        <TestimonialCard accent="bookub" rating={5} name="Daniel Tan" role="CFO, Harbourline" quote="Our books close on the third working day, every month." />
        <TestimonialCard accent="leap" rating={5} name="Linh Pham" role="Founder, Sonvo" quote="We incorporated in Singapore without leaving Hanoi." />
      </TestimonialGrid>
      <ProductGrid id="platform" header={<SectionHeader eyebrow="Platform" title="One account, four products" />}>
        <ProductCard name="Leap" description="Incorporate and stay compliant." href="#leap" accent="leap" icon={<LeapMark size={24} />} />
        <ProductCard name="Bookub" description="Bookkeeping that closes itself." href="#bookub" accent="bookub" icon={<BookubMark size={24} />} />
        <ProductCard name="Payub" description="Payroll and HR in one place." href="#payub" accent="payub" icon={<PayubMark size={24} />} />
        <ProductCard name="Founderub" description="Cap table and fundraising." href="#founderub" accent="founderub" icon={<FounderubMark size={24} />} />
      </ProductGrid>
      <CTABand
        title="Start running your company on Nexub"
        description="Free for 30 days. No card needed."
        actions={<Button variant="filled" tone="neutral" size="lg" asChild><a href="#start">Create an account</a></Button>}
      />
      <MarketingFooter
        logo={<Logo size="sm" />}
        tagline="The operating system for growing companies."
        tools={['Slack', 'Xero', 'Google Workspace', 'Stripe', 'QuickBooks', 'WhatsApp']}
        columns={[
          { title: 'Products', links: [{ label: 'Leap', href: '#leap' }, { label: 'Bookub', href: '#bookub' }, { label: 'Payub', href: '#payub' }, { label: 'Founderub', href: '#founderub' }] },
          { title: 'Company', links: [{ label: 'About', href: '#about' }, { label: 'Careers', href: '#careers' }] },
          { title: 'Resources', links: [{ label: 'Help centre', href: '#help' }, { label: 'Status', href: '#status' }] },
        ]}
        bottom="© 2026 Nexub Pte. Ltd., Singapore"
      />
    </div>
  );
}
