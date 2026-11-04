import { Avatar } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-3 flex-wrap items-center justify-center">
      <Avatar name="Online" badge badgeColor="var(--color-success)" />
      <Avatar name="Away" badge badgeColor="var(--color-warning)" />
    </div>
  );
}
