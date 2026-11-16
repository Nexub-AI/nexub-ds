/// <reference types="node" />
import * as React from 'react';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen, within } from '@testing-library/react';
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
    expect(screen.getByRole('button', { name: 'SG, Choose country: Singapore' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rated 5 out of 5' })).toBeInTheDocument();
  });

  it('renders a grouped mega-menu on the server and as accordion sections in the drawer', () => {
    const nav = (
      <MarketingNav
        logo="Nexub"
        items={[
          {
            label: 'Products',
            columns: [
              { title: 'Nexub OS', href: '/sg/os', description: 'Run the company', accent: 'os', links: [{ label: 'Forms', href: '/sg/forms', badge: 'Early access' }] },
              { title: 'By stage', links: [{ label: 'Growing', href: '/sg/growing', description: 'Hire and pay' }] },
            ],
            feature: <a href="/sg/story">Customer story</a>,
            footer: [{ label: 'All products', href: '/sg/products' }],
          },
          { label: 'More', items: [{ label: 'Money', href: '/sg/money', badge: 'Coming soon' }] },
        ]}
      />
    );
    expect(renderToString(nav)).toContain('Products');
    render(nav);
    // Desktop panel: each column is a list labelled by its title.
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    expect(within(screen.getByRole('list', { name: /Nexub OS/ })).getByRole('link', { name: 'Forms Early access' })).toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: 'By stage' })).getByRole('link', { name: /Growing/ })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Customer story' }).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Products' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    // The heading stays a link; the button beside it opens the list.
    expect(screen.getByRole('link', { name: 'Nexub OS' })).toHaveAttribute('href', '/sg/os');
    expect(screen.getByRole('link', { name: 'Nexub OS' }).closest('[data-division]')).toHaveAttribute('data-division', 'os');
    expect(screen.getByRole('button', { name: 'By stage' })).toHaveAttribute('aria-expanded', 'false'); // a title without a link
    const toggle = screen.getByRole('button', { name: 'Nexub OS' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Forms Early access' })).toBeNull();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    // Badges are part of the link name, on grouped and flat items alike.
    expect(screen.getByRole('link', { name: 'Forms Early access' })).toHaveAttribute('href', '/sg/forms');
    expect(screen.getByRole('link', { name: 'Money Coming soon' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'All products' })).toBeInTheDocument();
  });

  it('sets data-division / data-product from division and accent', () => {
    const { container } = render(
      <div>
        <Hero division="os" title="OS" />
        <CTABand division="fintech" title="Go" />
        <ProductGrid division="intelligence">
          <ProductCard name="Runner" description="Agents" href="/runner" division="autonomous" />
          <ProductCard name="Mind" description="AI" href="/mind" accent="mind" />
          <ProductCard name="Commerce" description="Sell" href="/commerce" accent="commerce" />
        </ProductGrid>
        <SectionHeader division="commerce" title="Sell" level={3} />
      </div>,
    );
    const attr = (sel: string) => [...container.querySelectorAll(sel)].map((el) => el.getAttribute(sel.slice(sel.indexOf('[') + 1, -1)));
    expect(attr('section[data-division]')).toEqual(['os', 'fintech', 'intelligence']);
    expect(attr('header[data-division]')).toEqual(['commerce']);
    // The card itself carries the attribute the showcase tint reads.
    expect(attr('.nx-mkt-showcase[data-division]')).toEqual(['autonomous', 'commerce']);
    expect(attr('.nx-mkt-showcase[data-product]')).toEqual(['mind', 'commerce']); // commerce is an app and a division
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
