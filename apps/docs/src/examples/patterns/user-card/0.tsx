'use client'; // docs preview: server pages import every example

import { UserCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-75">
      <UserCard name="Alex Johnson" email="alex@example.com" role="Admin" avatarFallback="AJ" />
    </div>
  );
}
