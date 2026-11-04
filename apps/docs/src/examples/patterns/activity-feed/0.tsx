import { ActivityFeed } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[340px]">
      <ActivityFeed.Root>
        <ActivityFeed.Item title="Sarah K. created an invoice" description="Invoice #1042 for Acme Corp" timestamp="2 min ago" />
        <ActivityFeed.Item title="James L. approved a request" description="Budget increase for Q2" timestamp="15 min ago" />
        <ActivityFeed.Item title="Maria R. added a comment" description="On the design review document" timestamp="1 hr ago" />
      </ActivityFeed.Root>
    </div>
  );
}
