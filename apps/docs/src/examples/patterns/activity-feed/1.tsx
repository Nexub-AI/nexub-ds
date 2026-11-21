'use client'; // docs preview: server pages import every example

import { ActivityFeed } from '@nexub/patterns';
import { IconButton } from '@nexub/react';
import { MoreHorizontal } from '@nexub/icons';

export default function Example() {
  const minutesAgo = (n: number) => new Date(Date.now() - n * 60_000);
  const more = (
    <IconButton size="xs" label="More actions">
      <MoreHorizontal className="size-4" aria-hidden="true" />
    </IconButton>
  );
  return (
    <div className="w-full max-w-md">
      <ActivityFeed.Root>
        <ActivityFeed.Group label="Today">
          <ActivityFeed.Item tone="success" title="Deploy to production finished" timestamp={minutesAgo(5)} actions={more} />
          <ActivityFeed.Item tone="danger" title="Contacts import failed" description="Row 12 is missing an email." timestamp={minutesAgo(42)} actions={more} />
        </ActivityFeed.Group>
        <ActivityFeed.Group label="Yesterday">
          <ActivityFeed.Item tone="info" title="Maria R. joined the workspace" timestamp={minutesAgo(26 * 60)} />
        </ActivityFeed.Group>
      </ActivityFeed.Root>
    </div>
  );
}
