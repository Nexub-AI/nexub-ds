import { Card } from '@nexub/react';
import { FeatureSplit } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <FeatureSplit
        eyebrow="Payroll"
        title="Pay your team on time, every time"
        description="Run payroll in minutes with tax and statutory filings handled for you."
        points={['CPF, EPF and BPJS filed for you', 'Payslips in every employee’s language', 'Approvals on your phone']}
        visual={<Card variant="showcase" accent="payub" className="aspect-[4/3] w-full" role="img" aria-label="Payroll screenshot" />}
      />
    </div>
  );
}
