import { NotificationItem } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[340px]">
      <NotificationItem title="New team member" description="Sarah joined your workspace." timestamp="2 min ago" read={false} />
      <NotificationItem title="Invoice paid" description="Invoice #1042 was paid successfully." timestamp="1 hr ago" read />
    </div>
  );
}
