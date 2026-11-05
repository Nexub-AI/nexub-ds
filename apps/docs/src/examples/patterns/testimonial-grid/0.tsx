import { SectionHeader, TestimonialCard, TestimonialGrid } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <TestimonialGrid header={<SectionHeader eyebrow="Customers" title="Loved by finance teams" />}>
        <TestimonialCard accent="payub" rating={5} name="Priya Nair" role="Head of People, Kopi Labs" quote="Payroll used to take two days. Now it takes twenty minutes." />
        <TestimonialCard accent="bookub" rating={5} name="Daniel Tan" role="CFO, Harbourline" quote="Our books close on the third working day, every month." />
        <TestimonialCard accent="leap" rating={5} name="Linh Pham" role="Founder, Sonvo" quote="We incorporated in Singapore without leaving Hanoi." />
      </TestimonialGrid>
    </div>
  );
}
