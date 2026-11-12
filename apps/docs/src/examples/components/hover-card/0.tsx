'use client'; // docs preview: server pages import every example

import { HoverCard, Link, Avatar, Text } from '@nexub/react';

export default function Example() {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger asChild>
        <Link href="#">@alex_johnson</Link>
      </HoverCard.Trigger>
      <HoverCard.Content>
        <div className="flex flex-col gap-2 items-start">
          <Avatar name="Alex Johnson" size="lg" />
          <div>
            <Text weight="semibold">Alex Johnson</Text>
            <Text size="body-sm" tone="muted">Product Designer</Text>
          </div>
          <Text size="body-sm" tone="secondary">Building design systems and making developers happy.</Text>
        </div>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
