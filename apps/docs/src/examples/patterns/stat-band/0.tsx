import { StatBand, StatBandItem } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <StatBand title="Teams run on Nexub">
        <StatBandItem value={2000} suffix="+" label="Companies" />
        <StatBandItem value={5} label="Countries" tone="success" />
        <StatBandItem value={98} suffix="%" label="On-time payroll" tone="payub" />
        <StatBandItem value={4.9} label="Average rating" tone="founderub" format={{ minimumFractionDigits: 1 }} />
      </StatBand>
    </div>
  );
}
