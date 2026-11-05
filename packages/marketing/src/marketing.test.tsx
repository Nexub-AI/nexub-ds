/// <reference types="node" />
import * as React from 'react';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  CTABand,
  FAQ,
  FeatureSplit,
  Hero,
  HowItWorks,
  LogoStrip,
  MarketingFooter,
  MarketingNav,
  PricingTable,
  ProductCard,
  ProductGrid,
  SectionHeader,
  StatBand,
  StatBandItem,
  TestimonialCard,
  TestimonialGrid,
} from './index.js';

const page = (
  <div data-mode="marketing">
    <MarketingNav
      logo="Nexub"
      items={[{ label: 'Products', items: [{ label: 'Payub', href: '/payub', description: 'Payroll' }] }, { label: 'Pricing', href: '/pricing' }]}
      countries={[{ code: 'SG', label: 'Singapore', href: '/sg' }, { code: 'IN', label: 'India', href: '/in' }]}
      country="SG"
    />
    <Hero eyebrow="New" title="Run your company" description="One platform." />
    <LogoStrip label="Trusted by">A B</LogoStrip>
    <StatBand title="In numbers"><StatBandItem value={2000} label="Teams" suffix="+" /></StatBand>
    <TestimonialGrid header={<SectionHeader title="Customers" />}>
      <TestimonialCard quote="Great" name="Ada Lovelace" role="CFO" rating={5} accent="payub" />
    </TestimonialGrid>
    <ProductGrid><ProductCard name="Payub" description="Payroll" href="/payub" accent="payub" /></ProductGrid>
    <HowItWorks steps={[{ title: 'Sign up', description: 'In a minute' }]} />
    <FeatureSplit title="Feature" points={['Fast']} visual={<div />} />
    <PricingTable currency="USD" locale="en-US" plans={[{ name: 'Pro', price: { monthly: 49, yearly: 39 }, features: ['All'], cta: 'Start', href: '/start' }]} />
    <FAQ items={[{ question: 'Is it secure?', answer: 'Yes.' }]} />
    <CTABand title="Start today" />
    <MarketingFooter columns={[{ title: 'Company', links: [{ label: 'About', href: '/about' }] }]} tools={['Slack', 'Xero']} bottom="© Nexub" />
  </div>
);

describe('@nexub/marketing', () => {
  it('renders the whole page on the server, with one h1', () => {
    const html = renderToString(page);
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('2,000'); // the real number, not zeros
  });

  it('switches pricing between monthly and yearly', () => {
    render(page);
    expect(screen.getByText('$49')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Yearly' }));
    expect(screen.getByText('$39')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start');
  });

  it('opens an FAQ answer', () => {
    render(page);
    fireEvent.click(screen.getByRole('button', { name: 'Is it secure?' }));
    expect(screen.getByText('Yes.')).toBeVisible();
  });

  it('names the country switcher and the testimonial rating', () => {
    render(page);
    expect(screen.getByRole('button', { name: 'Choose country: Singapore' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rated 5 out of 5' })).toBeInTheDocument();
  });

  // Server components can't hold state or handlers, or dot into a client
  // component (<Accordion.Root>); those sections must say 'use client'.
  it('marks every section that needs the client', () => {
    const dir = join(process.cwd(), 'src/components');
    for (const name of readdirSync(dir)) {
      const src = readFileSync(join(dir, name, `${name}.tsx`), 'utf8');
      const client = /^'use client'/.test(src);
      const needsClient = /\buse(State|Effect|Ref|Context|Reducer)\b|\son[A-Z]\w*=\{|<(?!React\.)[A-Z]\w*\.[A-Z]/.test(src);
      expect(client, name).toBe(needsClient);
    }
  });
});
