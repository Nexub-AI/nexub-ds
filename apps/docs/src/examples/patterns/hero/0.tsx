import { Button } from '@nexub/react';
import { Hero } from '@nexub/marketing';
import { ArrowRight } from '@nexub/icons';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <Hero
        eyebrow="Now in Vietnam"
        title="Run your whole company in one place"
        description="Payroll, bookkeeping and compliance for growing teams across Southeast Asia and India."
        actions={
          <>
            <Button variant="hero" size="lg" trailingIcon={<ArrowRight size={16} />}>Start free</Button>
            <Button variant="outlined" size="lg">Book a demo</Button>
          </>
        }
      />
    </div>
  );
}
