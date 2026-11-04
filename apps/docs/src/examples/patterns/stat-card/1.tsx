import { StatCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      <StatCard label="Users" value="2,841" delta="+8.3%" deltaType="increase" />
      <StatCard label="Churn" value="3.2%" delta="-0.4%" deltaType="decrease" />
    </div>
  );
}
