import { PlanCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[280px]">
      <PlanCard
        name="Pro"
        price="$49"
        period="/ month"
        description="For growing teams that need more power."
        features={['Unlimited seats', 'Advanced analytics', 'Priority support']}
        cta="Get started"
        onSelect={() => {}}
      />
    </div>
  );
}
