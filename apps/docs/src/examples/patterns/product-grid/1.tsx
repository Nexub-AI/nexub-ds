'use client'; // docs preview: server pages import every example

import { ProductCard, ProductGrid, SectionHeader } from '@nexub/marketing';

// Needs @nexub/themes/divisions.
export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <ProductGrid header={<SectionHeader eyebrow="Divisions" title="Five divisions, one account" />}>
        <ProductCard name="Nexub OS" description="Run the company: people, payroll, books and contracts." href="#os" division="os" />
        <ProductCard name="Nexub Commerce" description="Sell online and in store." href="#commerce" division="commerce" />
        <ProductCard name="Nexub Fintech" description="Accounts and credit for growing companies." href="#fintech" division="fintech" />
        <ProductCard name="Nexub Intelligence" description="AI that knows your business." href="#intelligence" division="intelligence" />
        <ProductCard name="Nexub Autonomous" description="Agents that run the routine work." href="#autonomous" division="autonomous" />
      </ProductGrid>
    </div>
  );
}
