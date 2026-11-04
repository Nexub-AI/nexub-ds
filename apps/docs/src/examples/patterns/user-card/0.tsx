import { UserCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[300px]">
      <UserCard name="Alex Johnson" email="alex@example.com" role="Admin" avatarFallback="AJ" />
    </div>
  );
}
