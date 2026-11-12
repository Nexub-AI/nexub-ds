// 9.6: the XSS corpus (packages/react/src/utils/xss-corpus.ts) against every @nexub/marketing
// prop that renders a URL or CMS text. Menus are opened first.
import * as React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
// @nexub/react's test corpus, aliased in vitest.config.ts (it is outside this package's rootDir).
import { XSS_TEXT, XSS_URLS, auditDom } from 'xss-corpus';
import { NexubProvider } from '@nexub/react';
import { MarketingNav } from './components/MarketingNav/index.js';
import { MarketingFooter } from './components/MarketingFooter/index.js';
import { ProductCard, ProductGrid } from './components/Products/index.js';
import { TestimonialCard, TestimonialGrid } from './components/Testimonials/index.js';
import { PricingTable } from './components/PricingTable/index.js';


afterEach(cleanup);

async function findings(ui: React.ReactElement) {
  render(<NexubProvider>{ui}</NexubProvider>);
  for (let round = 0; round < 4; round++) {
    const closed = [...document.querySelectorAll<HTMLElement>('button[aria-expanded="false"]')];
    if (closed.length === 0) break;
    fireEvent.pointerDown(closed[0]!, { button: 0, pointerType: 'mouse' });
    fireEvent.click(closed[0]!);
  }
  return auditDom();
}

const nav = (u: string, t = 'Label') => (
  <MarketingNav
    logo={<span>logo</span>}
    logoHref={u}
    logoLabel={t}
    items={[
      { label: t, items: [{ label: t, href: u, description: t }] },
      { label: t, href: u },
    ]}
    countries={[
      { code: 'SG', label: t, href: u },
      { code: 'IN', label: t, href: u },
    ]}
    country="SG"
  />
);

const URL_PROPS: Record<string, (url: string) => React.ReactElement> = {
  'MarketingNav logoHref, items and countries': (u) => nav(u),
  'MarketingFooter columns[].links[].href': (u) => <MarketingFooter logo={<span>logo</span>} columns={[{ title: 't', links: [{ label: 'l', href: u }] }]} />,
  'ProductCard href': (u) => (
    <ProductGrid>
      <ProductCard name="Leap" description="d" href={u} />
    </ProductGrid>
  ),
  'TestimonialCard avatarSrc': (u) => (
    <TestimonialGrid>
      <TestimonialCard name="Ada" role="CFO" quote="q" avatarSrc={u} />
    </TestimonialGrid>
  ),
  'PricingTable plans[].href': (u) => <PricingTable currency="USD" plans={[{ name: 'Pro', price: { monthly: 9, yearly: 7 }, features: ['a'], cta: 'Go', href: u }]} />,
};

const TEXT_PROPS: Record<string, (text: string) => React.ReactElement> = {
  'MarketingNav text': (t) => nav('/x', t),
  'MarketingFooter text': (t) => (
    <MarketingFooter logo={<span>logo</span>} tagline={t} tools={[t]} columns={[{ title: t, links: [{ label: t, href: '/x' }] }]} bottom={t} />
  ),
  'ProductCard text': (t) => (
    <ProductGrid>
      <ProductCard name={t} description={t} href="/x" linkLabel={t} />
    </ProductGrid>
  ),
  'TestimonialCard text': (t) => (
    <TestimonialGrid>
      <TestimonialCard name={t} role={t} quote={t} />
    </TestimonialGrid>
  ),
};

describe.each(Object.entries(URL_PROPS))('%s', (_name, ui) => {
  it.each(XSS_URLS)('renders nothing script-capable for %j', async (url) => {
    expect(await findings(ui(url))).toEqual([]);
  });
});

describe.each(Object.entries(TEXT_PROPS))('%s', (_name, ui) => {
  it.each(XSS_TEXT)('renders %j as text', async (text) => {
    expect(await findings(ui(text))).toEqual([]);
    expect(document.body.textContent).toContain(text);
  });
});

it('opens menus before auditing: the dropdown links are in the DOM', async () => {
  await findings(nav('/ok'));
  expect(document.querySelectorAll('a[href="/ok"]').length).toBeGreaterThanOrEqual(3);
});
