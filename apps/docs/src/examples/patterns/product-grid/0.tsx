import { BookubMark, FounderubMark, LeapMark, PayubMark } from '@nexub/icons';
import { ProductCard, ProductGrid, SectionHeader } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <ProductGrid header={<SectionHeader eyebrow="Platform" title="One account, four products" />}>
        <ProductCard name="Leap" description="Incorporate and stay compliant." href="#leap" accent="leap" icon={<LeapMark size={24} />} />
        <ProductCard name="Bookub" description="Bookkeeping that closes itself." href="#bookub" accent="bookub" icon={<BookubMark size={24} />} />
        <ProductCard name="Payub" description="Payroll and HR in one place." href="#payub" accent="payub" icon={<PayubMark size={24} />} />
        <ProductCard name="Founderub" description="Cap table and fundraising." href="#founderub" accent="founderub" icon={<FounderubMark size={24} />} />
      </ProductGrid>
    </div>
  );
}
